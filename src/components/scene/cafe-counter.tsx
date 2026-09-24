"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { CatmullRomCurve3, DoubleSide, Vector2, Vector3, type Group, type Mesh } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { drawMarble } from "./textures";
import { CoffeeCup } from "./coffee-cup";
import { Steam } from "./steam";
import { Pokeable, pickLine, secondsSince, usePoke } from "./pokeable";
import { palette } from "./palette";

type Vec3 = [number, number, number];

export const COUNTER_TOP_Y = 1.13;

const FLUTE_COUNT = 30;
const COUNTER_WIDTH = 3.4;

const chrome = { color: palette.chrome, metalness: 1, roughness: 0.14 } as const;
const brass = { color: palette.brass, metalness: 0.9, roughness: 0.25 } as const;
const copper = { color: "#b87333", metalness: 0.9, roughness: 0.3 } as const;

/** Fluted sage bar with a marble top, brass foot rail, pastry case, POS and tip jar. */
export function CafeCounter({ position }: { position: Vec3 }) {
  const marble = useCanvasTexture(1024, 512, drawMarble);
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.53, 0]}>
        <boxGeometry args={[COUNTER_WIDTH, 1.06, 0.9]} />
        <meshStandardMaterial color={palette.sageDark} roughness={0.6} />
      </mesh>
      {/* Fluted front: half-round reeds */}
      {Array.from({ length: FLUTE_COUNT }, (_, index) => (
        <mesh
          key={index}
          castShadow
          position={[-COUNTER_WIDTH / 2 + 0.06 + index * ((COUNTER_WIDTH - 0.12) / (FLUTE_COUNT - 1)), 0.55, 0.45]}
        >
          <cylinderGeometry args={[0.05, 0.05, 0.9, 12, 1, false, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color={palette.sage} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.04, 0.47]}>
        <boxGeometry args={[COUNTER_WIDTH, 0.08, 0.08]} />
        <meshStandardMaterial color={palette.walnut} />
      </mesh>
      {/* Marble top with a brass edge */}
      <mesh castShadow receiveShadow position={[0, 1.09, 0]}>
        <boxGeometry args={[3.6, 0.08, 1.05]} />
        <meshPhysicalMaterial map={marble} roughness={0.18} clearcoat={0.7} />
      </mesh>
      <mesh position={[0, 1.05, 0.53]}>
        <boxGeometry args={[3.62, 0.02, 0.02]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      <FootRail />
      <PastryCase position={[-1.15, COUNTER_TOP_Y, 0.1]} />
      <PosTablet position={[1.45, COUNTER_TOP_Y, 0.05]} />
      <TipJar position={[1.2, COUNTER_TOP_Y, 0.38]} />
    </group>
  );
}

function FootRail() {
  return (
    <group position={[0, 0.2, 0.68]}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 3.3, 12]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {[-1.4, 0, 1.4].map((x) => (
        <mesh key={x} position={[x, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
          <meshStandardMaterial {...brass} />
        </mesh>
      ))}
    </group>
  );
}

export function Croissant({ position, rotationY = 0 }: { position: Vec3; rotationY?: number }) {
  // Crescent built from overlapping lobes that shrink toward the tips.
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-2, -1, 0, 1, 2].map((step) => {
        const angle = step * 0.45;
        const size = 0.045 - Math.abs(step) * 0.009;
        return (
          <mesh key={step} castShadow position={[Math.sin(angle) * 0.07, size * 0.8, -Math.cos(angle) * 0.07 + 0.07]} scale={[1, 0.8, 1.2]} rotation={[0, angle, 0]}>
            <sphereGeometry args={[size, 12, 10]} />
            <meshStandardMaterial color={step % 2 ? "#c9863e" : palette.pastry} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

function CakeSlice({ position, rotationY = 0 }: { position: Vec3; rotationY?: number }) {
  const layers = ["#6b3e26", "#f6eee2", "#6b3e26", "#f6eee2"];
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {layers.map((color, index) => (
        <mesh key={index} castShadow position={[0, 0.012 + index * 0.024, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.024, 12, 1, false, 0, Math.PI / 4]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0.07, 0.11, 0.03]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshPhysicalMaterial color={palette.berry} roughness={0.2} clearcoat={1} />
      </mesh>
    </group>
  );
}

const macaronColors = ["#f4b6c2", "#b9dcb0", "#f7d58b", "#c9b6e4", "#a8d3ea"];

function Macaron({ position, color }: { position: Vec3; color: string }) {
  return (
    <group position={position}>
      {[0.012, 0.042].map((y) => (
        <mesh key={y} castShadow position={[0, y, 0]} scale={[1, 0.45, 1]}>
          <sphereGeometry args={[0.032, 16, 12]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.027, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.012, 16]} />
        <meshStandardMaterial color={palette.cup} />
      </mesh>
    </group>
  );
}

function PastryCase({ position }: { position: Vec3 }) {
  const width = 0.95;
  const depth = 0.55;
  const height = 0.46;
  return (
    <group position={position}>
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[width, 0.03, depth]} />
        <meshStandardMaterial color={palette.walnut} />
      </mesh>
      <mesh position={[0, height / 2 + 0.03, 0]}>
        <boxGeometry args={[width - 0.02, height, depth - 0.02]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.14} roughness={0.02} metalness={0.1} depthWrite={false} />
      </mesh>
      {/* Brass corner posts and top frame */}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz]) => (
        <mesh key={`${sx}${sz}`} position={[(sx * width) / 2, height / 2 + 0.03, (sz * depth) / 2]}>
          <boxGeometry args={[0.015, height, 0.015]} />
          <meshStandardMaterial {...brass} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.035, 0]}>
        <boxGeometry args={[width + 0.02, 0.012, depth + 0.02]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {/* Middle glass shelf */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[width - 0.04, 0.008, depth - 0.04]} />
        <meshPhysicalMaterial color="#e8f4f0" transparent opacity={0.35} roughness={0.05} />
      </mesh>
      {[-0.3, 0, 0.3].map((x, index) => (
        <Croissant key={x} position={[x, 0.03, 0.02]} rotationY={index * 0.7} />
      ))}
      {macaronColors.map((color, index) => (
        <Macaron key={color} position={[-0.36 + index * 0.1, 0.255, 0.1]} color={color} />
      ))}
      <CakeSlice position={[-0.15, 0.255, -0.08]} rotationY={-0.9} />
      <CakeSlice position={[0.2, 0.255, -0.1]} rotationY={-0.6} />
    </group>
  );
}

function PosTablet({ position }: { position: Vec3 }) {
  return (
    <group position={position} rotation={[0, -0.35, 0]}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.012, 0.03, 0.12, 12]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      <group position={[0, 0.17, 0]} rotation={[-0.5, 0, 0]}>
        <RoundedBox args={[0.3, 0.2, 0.015]} radius={0.01} castShadow>
          <meshStandardMaterial color="#1b1b1f" roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, 0.009]}>
          <planeGeometry args={[0.27, 0.17]} />
          <meshBasicMaterial color={[0.9, 0.75, 0.55]} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

const thanks = pickLine(["Cảm ơn bạn đã ủng hộ! 🙏", "Ting! Thêm một ly cho barista ☕", "Quý hoá quá 💛"]);

/** Glass tip jar; each tap drops a spinning coin in and the jar gives a little wobble. */
function TipJar({ position }: { position: Vec3 }) {
  const jarRef = useRef<Group>(null);
  const coinRef = useRef<Mesh>(null);
  const { pokedAt, poke } = usePoke();

  useFrame(() => {
    const age = secondsSince(pokedAt);
    const coin = coinRef.current;
    if (coin) {
      coin.visible = age < 0.7;
      // Free fall from above the rim down to the pile.
      const fall = Math.min(1, age / 0.55);
      coin.position.y = 0.45 - fall * fall * 0.5;
      coin.rotation.x = age * 18;
    }
    const landed = age - 0.55;
    if (jarRef.current) jarRef.current.rotation.z = landed > 0 && landed < 1.5 ? Math.sin(landed * 18) * Math.exp(-landed * 4) * 0.12 : 0;
  });

  return (
    <Pokeable onPoke={poke} bubble={thanks} bubbleOffset={[0, 0.5, 0]} position={position}>
      <group ref={jarRef} position={[0, -0.08, 0]}>
        <group position={[0, 0.08, 0]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.055, 0.16, 20, 1, true]} />
            <meshPhysicalMaterial color="#ffffff" transparent opacity={0.25} roughness={0.05} side={DoubleSide} depthWrite={false} />
          </mesh>
          {[0, 1, 2, 3].map((index) => (
            <mesh key={index} position={[(index % 2) * 0.02 - 0.01, -0.07 + index * 0.012, (index % 3) * 0.015 - 0.015]} rotation={[0.3 * index, 0, 0.2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.005, 14]} />
              <meshStandardMaterial {...brass} />
            </mesh>
          ))}
        </group>
      </group>
      <mesh ref={coinRef} visible={false}>
        <cylinderGeometry args={[0.02, 0.02, 0.006, 16]} />
        <meshStandardMaterial {...brass} />
      </mesh>
    </Pokeable>
  );
}

// Lathe profile for a chrome milk pitcher.
const pitcherProfile = [
  [0, 0],
  [0.045, 0],
  [0.05, 0.02],
  [0.05, 0.08],
  [0.04, 0.12],
  [0.046, 0.14],
  [0.042, 0.14],
  [0.036, 0.12],
  [0.044, 0.08],
  [0, 0.08],
].map(([x, y]) => new Vector2(x, y));

const hopperProfile = [
  [0.03, 0],
  [0.05, 0.02],
  [0.13, 0.2],
  [0.13, 0.24],
].map(([x, y]) => new Vector2(x, y));

const steamWandCurve = new CatmullRomCurve3([
  new Vector3(0.44, 0.4, 0.12),
  new Vector3(0.52, 0.38, 0.2),
  new Vector3(0.56, 0.26, 0.26),
  new Vector3(0.57, 0.12, 0.28),
]);

/** Dual-group espresso machine: chrome body, gauges, live pour, steam wand, grinder. Base at y = 0. */
export function EspressoMachine() {
  const needleRefs = useRef<(Mesh | null)[]>([]);
  const pourRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    needleRefs.current.forEach((needle, index) => {
      if (needle) needle.rotation.z = -0.6 + Math.sin(time * (1.3 + index)) * 0.06 + index * 0.4;
    });
    if (pourRef.current) {
      const pouring = time % 6 < 4;
      pourRef.current.visible = pouring;
      pourRef.current.scale.x = 0.8 + Math.sin(time * 18) * 0.2;
    }
  });

  return (
    <group>
      {[
        [-0.44, -0.3],
        [0.44, -0.3],
        [-0.44, 0.14],
        [0.44, 0.14],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.02, z]}>
          <cylinderGeometry args={[0.025, 0.03, 0.04, 12]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
      ))}
      <RoundedBox args={[1.0, 0.48, 0.52]} radius={0.04} smoothness={4} position={[0, 0.28, -0.08]} castShadow>
        <meshStandardMaterial {...chrome} />
      </RoundedBox>
      {/* Copper front band */}
      <RoundedBox args={[0.92, 0.13, 0.02]} radius={0.008} position={[0, 0.44, 0.185]}>
        <meshStandardMaterial {...copper} />
      </RoundedBox>
      {/* Cup warmer with rails and inverted cups */}
      <mesh position={[0, 0.535, -0.08]}>
        <boxGeometry args={[0.96, 0.02, 0.48]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      {[-0.46, 0.46].map((x) => (
        <mesh key={x} position={[x, 0.6, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.46, 8]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
      ))}
      {[-0.3, -0.12, 0.06].map((x) => (
        <group key={x} position={[x, 0.66, -0.12]} rotation={[Math.PI, 0, 0]}>
          <CoffeeCup saucer={false} />
        </group>
      ))}

      {/* Pressure gauges with live needles */}
      {[-0.2, 0.2].map((x, index) => (
        <group key={x} position={[x, 0.44, 0.198]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.052, 0.052, 0.012, 28]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
          <mesh position={[0, 0, 0.007]}>
            <circleGeometry args={[0.044, 28]} />
            <meshStandardMaterial color="#fbf7f0" roughness={0.4} />
          </mesh>
          <mesh ref={(mesh) => { needleRefs.current[index] = mesh; }} position={[0, 0, 0.009]}>
            <boxGeometry args={[0.004, 0.036, 0.002]} />
            <meshBasicMaterial color={palette.berry} />
          </mesh>
        </group>
      ))}

      {/* Group heads + portafilters with walnut handles */}
      {[-0.24, 0.24].map((x) => (
        <group key={x} position={[x, 0.3, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 24]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.06, 0.05, 0.04, 24]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
          <mesh position={[0, -0.05, 0.14]} rotation={[Math.PI / 2 - 0.15, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.02, 0.2, 12]} />
            <meshStandardMaterial color={palette.walnut} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.012, 0.008, 0.02, 8]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
        </group>
      ))}
      {/* Espresso stream into the cup under the left group */}
      <group ref={pourRef} position={[-0.24, 0.2, 0.2]}>
        {[-0.008, 0.008].map((x) => (
          <mesh key={x} position={[x, -0.02, 0]}>
            <cylinderGeometry args={[0.0035, 0.0025, 0.045, 6]} />
            <meshStandardMaterial color={palette.crema} roughness={0.2} />
          </mesh>
        ))}
      </group>
      <CoffeeCup position={[-0.24, 0.05, 0.22]} saucer={false} />

      {/* Drip tray with grille */}
      <mesh position={[0, 0.03, 0.24]}>
        <boxGeometry args={[0.84, 0.04, 0.2]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      {Array.from({ length: 12 }, (_, index) => (
        <mesh key={index} position={[-0.38 + index * 0.069, 0.052, 0.24]}>
          <boxGeometry args={[0.012, 0.004, 0.17]} />
          <meshStandardMaterial color={palette.metalDark} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Steam wand + knob */}
      <mesh>
        <tubeGeometry args={[steamWandCurve, 24, 0.008, 8, false]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      <mesh position={[0.44, 0.47, 0.12]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color={palette.walnut} roughness={0.4} />
      </mesh>
      <Steam position={[0.57, 0.1, 0.28]} puffs={3} height={0.25} />

      <mesh castShadow position={[0.68, 0, 0.18]}>
        <latheGeometry args={[pitcherProfile, 24]} />
        <meshStandardMaterial {...chrome} side={DoubleSide} />
      </mesh>
      <CoffeeCup position={[0.7, 0, -0.12]} rotationY={0.6} latteArt steaming />
      <Grinder position={[-0.8, 0, -0.05]} />
    </group>
  );
}

function Grinder({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.22, 0.44, 0.3]} radius={0.03} position={[0, 0.22, 0]} castShadow>
        <meshStandardMaterial color="#1f1d1c" metalness={0.4} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.3, 0.155]}>
        <boxGeometry args={[0.14, 0.05, 0.01]} />
        <meshStandardMaterial {...copper} />
      </mesh>
      {/* Portafilter fork + chute */}
      <mesh position={[0, 0.16, 0.18]}>
        <boxGeometry args={[0.1, 0.012, 0.06]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      <mesh position={[0, 0.22, 0.17]}>
        <cylinderGeometry args={[0.018, 0.012, 0.05, 10]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      <group position={[0, 0.44, 0]}>
        <mesh>
          <latheGeometry args={[hopperProfile, 24]} />
          <meshPhysicalMaterial color="#fff6e8" transparent opacity={0.3} roughness={0.05} side={DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.1, 0.045, 0.16, 20]} />
          <meshStandardMaterial color={palette.coffee} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.135, 0.135, 0.02, 24]} />
          <meshStandardMaterial color="#1f1d1c" />
        </mesh>
      </group>
    </group>
  );
}
