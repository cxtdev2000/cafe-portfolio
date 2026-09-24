"use client";

import { DoubleSide, Vector2 } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { drawLaptopCode, drawMarble } from "./textures";
import { CoffeeCup } from "./coffee-cup";
import { Croissant } from "./cafe-counter";
import { palette } from "./palette";

type Vec3 = [number, number, number];

export const TABLE_TOP_Y = 0.78;

const brass = { color: palette.brass, metalness: 0.9, roughness: 0.25 } as const;
const blackIron = { color: "#1f1d1c", metalness: 0.6, roughness: 0.35 } as const;

/** Marble-topped bistro table with two bentwood chairs. The items on top are a separate hotspot. */
export function CafeTable({ position }: { position: Vec3 }) {
  const marble = useCanvasTexture(512, 512, drawMarble);
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 0.04, 48]} />
        <meshPhysicalMaterial map={marble} roughness={0.2} clearcoat={0.8} clearcoatRoughness={0.15} />
      </mesh>
      <mesh position={[0, 0.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.66, 0.012, 8, 64]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      <mesh castShadow position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 0.72, 16]} />
        <meshStandardMaterial {...blackIron} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.08, 16]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {/* Four-footed cast-iron base */}
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} castShadow position={[0, 0.03, 0]} rotation={[0, (index * Math.PI) / 2 + Math.PI / 4, 0]}>
          <boxGeometry args={[0.62, 0.035, 0.05]} />
          <meshStandardMaterial {...blackIron} />
        </mesh>
      ))}
      <BentwoodChair position={[0.95, 0, 0.1]} rotationY={-Math.PI / 2} />
      <BentwoodChair position={[-0.2, 0, -0.95]} rotationY={0} />
    </group>
  );
}

/** Thonet-style chair: steamed-wood hoop back, cane seat and splayed legs. */
function BentwoodChair({ position, rotationY }: { position: Vec3; rotationY: number }) {
  const wood = { color: palette.walnut, roughness: 0.4 } as const;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.47, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.035, 32]} />
        <meshStandardMaterial color="#c9a26b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.018, 8, 40]} />
        <meshStandardMaterial {...wood} />
      </mesh>
      {/* Hoop back */}
      <mesh castShadow position={[0, 0.78, -0.2]} rotation={[-0.08, 0, 0]}>
        <torusGeometry args={[0.18, 0.016, 8, 32, Math.PI]} />
        <meshStandardMaterial {...wood} />
      </mesh>
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} castShadow position={[x, 0.63, -0.19]}>
          <cylinderGeometry args={[0.016, 0.016, 0.32, 8]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}
      <mesh position={[0, 0.8, -0.2]} rotation={[-0.08, 0, 0]}>
        <torusGeometry args={[0.1, 0.012, 8, 24, Math.PI]} />
        <meshStandardMaterial {...wood} />
      </mesh>
      {[
        [-0.15, -0.15],
        [0.15, -0.15],
        [-0.15, 0.15],
        [0.15, 0.15],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} castShadow position={[x * 1.1, 0.23, z * 1.1]} rotation={[z * 0.4, 0, -x * 0.4]}>
          <cylinderGeometry args={[0.018, 0.014, 0.47, 8]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.01, 6, 32]} />
        <meshStandardMaterial {...wood} />
      </mesh>
    </group>
  );
}

const vaseProfile = [
  [0, 0],
  [0.03, 0],
  [0.04, 0.04],
  [0.03, 0.09],
  [0.012, 0.13],
  [0.016, 0.15],
  [0, 0.15],
].map(([x, y]) => new Vector2(x, y));

/** Laptop, latte, croissant, notebook, bud vase and phone — the contact hotspot. Base sits at y = 0. */
export function TableItems() {
  return (
    <group>
      <Laptop position={[-0.12, 0, -0.12]} rotationY={0.55} />
      <CoffeeCup position={[0.3, 0, 0.12]} steaming latteArt />
      <group position={[0.12, 0, 0.38]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.13, 0.11, 0.012, 32]} />
          <meshPhysicalMaterial color={palette.cup} roughness={0.25} clearcoat={0.6} />
        </mesh>
        <Croissant position={[0, 0.006, -0.02]} rotationY={0.6} />
      </group>
      <Notebook position={[-0.3, 0, 0.3]} rotationY={-0.3} />
      <BudVase position={[0.34, 0, -0.3]} />
      {/* Phone */}
      <group position={[0.35, 0.006, -0.08]} rotation={[0, -0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.012, 0.16]} />
          <meshStandardMaterial color={palette.metalDark} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.07, 0.145]} />
          <meshBasicMaterial color={[0.55, 0.75, 1.1]} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Laptop({ position, rotationY }: { position: Vec3; rotationY: number }) {
  const screen = useCanvasTexture(640, 400, drawLaptopCode);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.008, 0]}>
        <boxGeometry args={[0.4, 0.016, 0.27]} />
        <meshStandardMaterial color={palette.chrome} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.0165, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.34, 0.13]} />
        <meshStandardMaterial color="#2a2b30" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.0165, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 0.06]} />
        <meshStandardMaterial color="#b9bcc2" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Lid tilted back from the hinge */}
      <group position={[0, 0.016, -0.135]} rotation={[-0.3, 0, 0]}>
        <mesh castShadow position={[0, 0.13, -0.004]}>
          <boxGeometry args={[0.4, 0.26, 0.008]} />
          <meshStandardMaterial color={palette.chrome} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.13, 0.001]}>
          <planeGeometry args={[0.37, 0.231]} />
          <meshBasicMaterial map={screen} color={[1.15, 1.15, 1.15]} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Notebook({ position, rotationY }: { position: Vec3; rotationY: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow position={[0, 0.008, 0]}>
        <boxGeometry args={[0.2, 0.016, 0.26]} />
        <meshStandardMaterial color={palette.sage} roughness={0.8} />
      </mesh>
      <mesh position={[0.03, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.035, 0.26]} />
        <meshStandardMaterial color={palette.wallAccent} roughness={0.8} />
      </mesh>
      {/* Pen */}
      <group position={[0.14, 0.008, 0]} rotation={[Math.PI / 2, 0, 0.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.16, 10]} />
          <meshStandardMaterial color="#1f1d1c" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.0075, 0.0075, 0.03, 10]} />
          <meshStandardMaterial {...brass} />
        </mesh>
      </group>
    </group>
  );
}

function BudVase({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <latheGeometry args={[vaseProfile, 24]} />
        <meshPhysicalMaterial color="#cfe3dc" transparent opacity={0.55} roughness={0.05} clearcoat={1} side={DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0.01, 0.22, 0]} rotation={[0, 0, -0.08]}>
        <cylinderGeometry args={[0.003, 0.003, 0.2, 5]} />
        <meshStandardMaterial color={palette.leafDark} />
      </mesh>
      <group position={[0.02, 0.33, 0]}>
        {Array.from({ length: 6 }, (_, index) => {
          const angle = (index / 6) * Math.PI * 2;
          return (
            <mesh key={index} position={[Math.cos(angle) * 0.02, 0, Math.sin(angle) * 0.02]} scale={[1, 0.5, 1]}>
              <sphereGeometry args={[0.02, 10, 8]} />
              <meshStandardMaterial color="#f2b3c4" roughness={0.6} />
            </mesh>
          );
        })}
        <mesh>
          <sphereGeometry args={[0.012, 8, 6]} />
          <meshStandardMaterial color="#ffd28a" />
        </mesh>
      </group>
      <mesh position={[-0.02, 0.2, 0]} rotation={[0, 0, 0.8]} scale={[0.5, 1, 0.2]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color={palette.leaf} />
      </mesh>
    </group>
  );
}
