"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { QuadraticBezierLine } from "@react-three/drei";
import { DoubleSide, QuadraticBezierCurve3, Vector3, type Group, type MeshBasicMaterial, type PointLight } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { drawBrick, drawChevronFloor, drawCityNight, drawPoster, drawRain, drawSubwayTile } from "./textures";
import { HangingPlanter, Plant } from "./plants";
import { Pokeable, secondsSince, usePoke } from "./pokeable";
import { palette } from "./palette";

type Vec3 = [number, number, number];

/** Floor, walls, window, lights and decor — the static shell of the café. */
export function CafeRoom() {
  return (
    <group>
      <Floor />
      <Walls />
      <CafeWindow position={[-4.9, 1.9, 1.2]} />
      <FramedPoster position={[-4.97, 2.45, -2.1]} />
      <HangingPlanter position={[-4.72, 3.1, -0.6]} rotationY={Math.PI / 2} />
      <StringLights from={[-4.9, 4.35, -3.9]} to={[4.9, 4.35, -3.9]} sag={0.45} count={18} />
      <StringLights from={[-4.9, 4.35, -3.8]} to={[-4.9, 4.35, 4.8]} sag={0.4} count={16} />
      {[0.6, 1.6, 2.6].map((x) => (
        <PendantLamp key={x} position={[x, 4.4, -2.5]} />
      ))}
      <PendantLamp position={[-2.6, 4.4, 1.4]} />
      <Plant position={[-4.3, 0, -3.3]} scale={1.35} />
      <Plant position={[4.45, 0, -3.4]} scale={1.05} potColor={palette.sage} leaves={7} />
      <Rug position={[-2.6, 0.011, 1.4]} />
      {[0.7, 1.6, 2.5].map((x) => (
        <BarStool key={x} position={[x, 0, -1.6]} />
      ))}
    </group>
  );
}

function Floor() {
  const texture = useCanvasTexture(1024, 1024, drawChevronFloor, [3.3, 3]);
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
        <planeGeometry args={[10, 9]} />
        <meshStandardMaterial map={texture} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.16, 0.5]}>
        <boxGeometry args={[10.2, 0.3, 9.2]} />
        <meshStandardMaterial color={palette.walnut} />
      </mesh>
    </group>
  );
}

function Walls() {
  const brick = useCanvasTexture(1024, 512, drawBrick, [2.6, 2.2]);
  const tile = useCanvasTexture(512, 512, drawSubwayTile, [4.8, 2]);
  return (
    <group>
      {/* Back wall: exposed brick on the left, plaster + tiled splash behind the bar */}
      <mesh receiveShadow position={[-2.6, 2.25, -4.05]}>
        <boxGeometry args={[4.8, 4.5, 0.1]} />
        <meshStandardMaterial map={brick} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[2.4, 2.25, -4.05]}>
        <boxGeometry args={[5.2, 4.5, 0.1]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[2.4, 1.05, -3.995]}>
        <planeGeometry args={[5.2, 2.1]} />
        <meshPhysicalMaterial map={tile} roughness={0.2} clearcoat={0.8} />
      </mesh>
      <mesh position={[-0.2, 2.25, -3.99]}>
        <boxGeometry args={[0.12, 4.5, 0.06]} />
        <meshStandardMaterial color={palette.walnut} />
      </mesh>

      {/* Left wall: sage wainscot panels below plaster */}
      <mesh receiveShadow position={[-5.05, 2.25, 0.5]}>
        <boxGeometry args={[0.1, 4.5, 9]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[-4.99, 0.6, 0.5]}>
        <boxGeometry args={[0.03, 1.2, 9]} />
        <meshStandardMaterial color={palette.sage} roughness={0.7} />
      </mesh>
      {Array.from({ length: 9 }, (_, index) => (
        <mesh key={index} position={[-4.97, 0.6, -3.5 + index]}>
          <boxGeometry args={[0.02, 0.8, 0.72]} />
          <meshStandardMaterial color={palette.sageDark} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[-4.96, 1.22, 0.5]}>
        <boxGeometry args={[0.06, 0.06, 9]} />
        <meshStandardMaterial color={palette.walnut} />
      </mesh>

      {/* Top trim beams */}
      <mesh castShadow position={[0, 4.55, -4.02]}>
        <boxGeometry args={[10.2, 0.14, 0.18]} />
        <meshStandardMaterial color={palette.walnut} />
      </mesh>
      <mesh castShadow position={[-5.02, 4.55, 0.5]}>
        <boxGeometry args={[0.18, 0.14, 9.2]} />
        <meshStandardMaterial color={palette.walnut} />
      </mesh>
    </group>
  );
}

/** Night-city window with rain on the glass; tapping the glass lets the rain ease off or start again. */
function CafeWindow({ position }: { position: Vec3 }) {
  const city = useCanvasTexture(1024, 512, drawCityNight);
  const rain = useCanvasTexture(256, 512, drawRain, [2, 1]);
  const rainRef = useRef<MeshBasicMaterial>(null);
  const [raining, setRaining] = useState(true);

  useFrame((_, delta) => {
    const material = rainRef.current;
    if (!material?.map) return;
    material.map.offset.y += delta * 0.6;
    material.opacity += ((raining ? 1 : 0) - material.opacity) * (1 - Math.exp(-delta * 2));
  });

  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <Pokeable
        onPoke={() => setRaining((value) => !value)}
        bubble={() => (raining ? "Tạnh mưa rồi ✨" : "Mưa rơi tí tách… 🌧️")}
        bubbleOffset={[0, 0.6, 0.2]}
      >
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[2.6, 1.8]} />
          <meshBasicMaterial map={city} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[2.6, 1.8]} />
          <meshBasicMaterial ref={rainRef} map={rain} transparent depthWrite={false} />
        </mesh>
        {/* Glass pane */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.6, 1.8]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.05} metalness={0.2} />
        </mesh>
      </Pokeable>
      {[
        { p: [0, 0.93, 0], s: [2.76, 0.08, 0.1] },
        { p: [0, -0.93, 0.05], s: [2.9, 0.08, 0.26] },
        { p: [1.34, 0, 0], s: [0.08, 1.94, 0.1] },
        { p: [-1.34, 0, 0], s: [0.08, 1.94, 0.1] },
        { p: [0, 0, 0], s: [0.05, 1.8, 0.06] },
        { p: [0, 0.3, 0], s: [2.6, 0.04, 0.06] },
      ].map(({ p, s }, index) => (
        <mesh key={index} castShadow position={p as Vec3}>
          <boxGeometry args={s as Vec3} />
          <meshStandardMaterial color={palette.walnut} roughness={0.5} />
        </mesh>
      ))}
      {/* Brass rod with side drapes */}
      <mesh position={[0, 1.08, 0.12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 3.3, 10]} />
        <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
      </mesh>
      {[-1.5, 1.5].map((x) => (
        <group key={x} position={[x, 0.05, 0.14]}>
          {Array.from({ length: 5 }, (_, fold) => (
            <mesh key={fold} castShadow position={[(fold - 2) * 0.07, 0, fold % 2 ? 0.03 : 0]}>
              <boxGeometry args={[0.08, 2.05, 0.03]} />
              <meshStandardMaterial color={fold % 2 ? "#e8dcc6" : "#f3ead8"} roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
      <Plant position={[0.9, -0.89, 0.1]} scale={0.35} potColor={palette.cup} leaves={6} />
    </group>
  );
}

/** Brass-framed poster; a tap knocks it crooked and it wobbles back level. */
function FramedPoster({ position }: { position: Vec3 }) {
  const texture = useCanvasTexture(384, 512, drawPoster);
  const frameRef = useRef<Group>(null);
  const { pokedAt, poke } = usePoke();

  useFrame(() => {
    const age = secondsSince(pokedAt);
    if (frameRef.current) frameRef.current.rotation.z = age < 4 ? Math.sin(age * 7) * Math.exp(-age * 1.4) * 0.22 : 0;
  });

  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <Pokeable onPoke={poke} bubble="Ối, lệch rồi!" bubbleOffset={[0, 0.75, 0.1]}>
        {/* Pivots on its hanging nail, just above the frame */}
        <group ref={frameRef} position={[0, 0.5, 0]}>
          <mesh castShadow position={[0, -0.5, 0]}>
            <boxGeometry args={[0.8, 1.04, 0.04]} />
            <meshStandardMaterial color={palette.brass} metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.5, 0.021]}>
            <planeGeometry args={[0.7, 0.94]} />
            <meshStandardMaterial map={texture} roughness={0.8} />
          </mesh>
        </group>
      </Pokeable>
    </group>
  );
}

/** Warm fairy bulbs hanging on a sagging wire; bulbs glow via bloom, no real lights. */
function StringLights({ from, to, sag, count }: { from: Vec3; to: Vec3; sag: number; count: number }) {
  const mid: Vec3 = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 - sag * 2, (from[2] + to[2]) / 2];
  const curve = new QuadraticBezierCurve3(new Vector3(...from), new Vector3(...mid), new Vector3(...to));
  const bulbs = Array.from({ length: count }, (_, index) => curve.getPoint((index + 0.5) / count));

  return (
    <group>
      <QuadraticBezierLine start={from} end={to} mid={mid} color="#2a1a10" lineWidth={1.2} />
      {bulbs.map((point, index) => (
        <mesh key={index} position={[point.x, point.y - 0.06, point.z]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial color={index % 3 === 0 ? [4, 2.4, 1.2] : [4, 3, 1.6]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Hanging dome lamp. A tap flicks it on or off and sets it swinging from the ceiling. */
function PendantLamp({ position }: { position: Vec3 }) {
  const [on, setOn] = useState(true);
  const { pokedAt, poke } = usePoke();
  const swingRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  const filamentRef = useRef<MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    const age = secondsSince(pokedAt);
    if (swingRef.current) swingRef.current.rotation.z = age < 5 ? Math.sin(age * 3.2) * Math.exp(-age * 0.9) * 0.12 : 0;
    const light = lightRef.current;
    if (light) light.intensity += ((on ? 2.4 : 0) - light.intensity) * (1 - Math.exp(-delta * 12));
    if (on) filamentRef.current?.color.setRGB(6, 3.6, 1.6);
    else filamentRef.current?.color.setRGB(0.25, 0.18, 0.12);
  });

  return (
    <group position={position} ref={swingRef}>
      <Pokeable
        onPoke={() => {
          poke();
          setOn((value) => !value);
        }}
      >
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 1.1, 6]} />
          <meshStandardMaterial color={palette.metalDark} />
        </mesh>
        {/* Dome shade: sage outside, brass inside */}
        <mesh castShadow position={[0, -1.1, 0]}>
          <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={palette.sage} roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, -1.105, 0]}>
          <sphereGeometry args={[0.295, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={palette.brass} side={DoubleSide} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.012, 8, 40]} />
          <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Edison bulb: clear glass around a glowing filament */}
        <mesh position={[0, -1.2, 0]}>
          <sphereGeometry args={[0.075, 20, 20]} />
          <meshPhysicalMaterial color="#fff3de" transparent opacity={0.25} roughness={0.05} />
        </mesh>
        <mesh position={[0, -1.2, 0]}>
          <capsuleGeometry args={[0.012, 0.06, 4, 8]} />
          <meshBasicMaterial ref={filamentRef} color={[6, 3.6, 1.6]} toneMapped={false} />
        </mesh>
      </Pokeable>
      <pointLight ref={lightRef} position={[0, -1.3, 0]} color={palette.lampGlow} intensity={2.4} distance={5} decay={1.6} />
    </group>
  );
}

function Rug({ position }: { position: Vec3 }) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh receiveShadow>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial color={palette.wallAccent} roughness={1} />
      </mesh>
      {[
        [1.25, 1.33, palette.cup],
        [0.95, 1.0, palette.sage],
        [0.45, 0.52, palette.cup],
      ].map(([inner, outer, color]) => (
        <mesh key={inner} receiveShadow position={[0, 0, 0.002]}>
          <ringGeometry args={[inner as number, outer as number, 64]} />
          <meshStandardMaterial color={color as string} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Velvet swivel stool; a tap gives the seat a spin. */
function BarStool({ position }: { position: Vec3 }) {
  const seatRef = useRef<Group>(null);
  const { pokedAt, poke } = usePoke();

  useFrame(() => {
    const age = secondsSince(pokedAt);
    if (seatRef.current) seatRef.current.rotation.y = age < 1.6 ? easeOutCubic(age / 1.6) * Math.PI * 4 : 0;
  });

  return (
    <Pokeable onPoke={poke} position={position}>
      <group ref={seatRef}>
        <mesh castShadow position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 0.1, 32]} />
          <meshStandardMaterial color={palette.velvet} roughness={0.9} />
        </mesh>
        {/* Piping seam, so the spin is visible */}
        <mesh position={[0.21, 0.78, 0]}>
          <boxGeometry args={[0.02, 0.1, 0.03]} />
          <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.03, 24]} />
        <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
      </mesh>
      {[0, 1, 2, 3].map((index) => {
        const angle = (index / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh
            key={index}
            castShadow
            position={[Math.cos(angle) * 0.15, 0.36, Math.sin(angle) * 0.15]}
            rotation={[Math.sin(angle) * 0.12, 0, -Math.cos(angle) * 0.12]}
          >
            <cylinderGeometry args={[0.014, 0.014, 0.74, 8]} />
            <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.01, 8, 32]} />
        <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
      </mesh>
    </Pokeable>
  );
}
