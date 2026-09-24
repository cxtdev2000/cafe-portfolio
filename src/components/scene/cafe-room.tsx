"use client";

import { palette } from "./palette";

const PLANK_COUNT = 10;
const PLANK_WIDTH = 1;

/** Floor, walls, window, shelves, lamps and decor — the static shell of the café. */
export function CafeRoom() {
  return (
    <group>
      <Floor />
      <Walls />
      <CafeWindow position={[-4.94, 1.9, 1.2]} />
      <WallShelves position={[2.1, 0, -3.85]} />
      {[0.6, 1.6, 2.6].map((x) => (
        <PendantLamp key={x} position={[x, 4.2, -2.4]} />
      ))}
      <PendantLamp position={[-2.6, 4.2, 1.4]} />
      <Plant position={[-4.3, 0, -3.3]} scale={1.2} />
      <Plant position={[4.3, 0, -3.3]} scale={0.9} />
      <Rug position={[-2.6, 0.011, 1.4]} />
      {[0.7, 1.6, 2.5].map((x) => (
        <Stool key={x} position={[x, 0, -1.6]} />
      ))}
    </group>
  );
}

function Floor() {
  return (
    <group>
      {Array.from({ length: PLANK_COUNT }, (_, index) => (
        <mesh
          key={index}
          receiveShadow
          position={[-5 + PLANK_WIDTH / 2 + index * PLANK_WIDTH, -0.05, 0.5]}
        >
          <boxGeometry args={[PLANK_WIDTH - 0.02, 0.1, 9]} />
          <meshStandardMaterial color={index % 2 ? palette.floor : palette.floorDark} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Walls() {
  return (
    <group>
      {/* Back wall with a terracotta wainscot band */}
      <mesh receiveShadow position={[0, 2.25, -4.05]}>
        <boxGeometry args={[10, 4.5, 0.1]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.5, -3.99]}>
        <boxGeometry args={[10, 1, 0.02]} />
        <meshStandardMaterial color={palette.wallAccent} roughness={0.9} />
      </mesh>
      {/* Left wall */}
      <mesh receiveShadow position={[-5.05, 2.25, 0.5]}>
        <boxGeometry args={[0.1, 4.5, 9]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-4.99, 0.5, 0.5]}>
        <boxGeometry args={[0.02, 1, 9]} />
        <meshStandardMaterial color={palette.wallAccent} roughness={0.9} />
      </mesh>
    </group>
  );
}

function CafeWindow({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.02, 1.8, 2.6]} />
        <meshStandardMaterial color={palette.windowGlow} emissive={palette.windowGlow} emissiveIntensity={0.9} />
      </mesh>
      {/* Frame: outer border + mullions */}
      {[
        { p: [0, 0.93, 0], s: [0.08, 0.08, 2.76] },
        { p: [0, -0.93, 0], s: [0.14, 0.08, 2.9] },
        { p: [0, 0, 1.34], s: [0.08, 1.94, 0.08] },
        { p: [0, 0, -1.34], s: [0.08, 1.94, 0.08] },
        { p: [0, 0, 0], s: [0.06, 1.8, 0.05] },
        { p: [0, 0.1, 0], s: [0.06, 0.05, 2.6] },
      ].map(({ p, s }, index) => (
        <mesh key={index} position={p as [number, number, number]}>
          <boxGeometry args={s as [number, number, number]} />
          <meshStandardMaterial color={palette.woodDark} />
        </mesh>
      ))}
    </group>
  );
}

function WallShelves({ position }: { position: [number, number, number] }) {
  const jarColors = [palette.coffee, palette.pastry, palette.berry, palette.floorDark];
  return (
    <group position={position}>
      {[2.3, 3.0].map((y, row) => (
        <group key={y} position={[0, y, 0.15]}>
          <mesh castShadow>
            <boxGeometry args={[2.8, 0.06, 0.3]} />
            <meshStandardMaterial color={palette.wood} />
          </mesh>
          {Array.from({ length: 5 }, (_, index) => (
            <group key={index} position={[-1.1 + index * 0.55, 0.15, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.09, 0.09, 0.24, 16]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.45} roughness={0.1} />
              </mesh>
              <mesh position={[0, -0.03, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.16, 16]} />
                <meshStandardMaterial color={jarColors[(index + row) % jarColors.length]} />
              </mesh>
              <mesh position={[0, 0.13, 0]}>
                <cylinderGeometry args={[0.095, 0.095, 0.03, 16]} />
                <meshStandardMaterial color={palette.woodDark} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

function PendantLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.2, 6]} />
        <meshStandardMaterial color={palette.metalDark} />
      </mesh>
      <mesh position={[0, -1.3, 0]}>
        <coneGeometry args={[0.28, 0.3, 24, 1, true]} />
        <meshStandardMaterial color={palette.metalDark} side={2} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.4, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={palette.lampGlow} emissive={palette.lampGlow} emissiveIntensity={3} />
      </mesh>
      <pointLight position={[0, -1.5, 0]} color={palette.lampGlow} intensity={2.2} distance={4.5} decay={1.6} />
    </group>
  );
}

function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.28, 0.22, 0.5, 20]} />
        <meshStandardMaterial color={palette.pot} roughness={0.8} />
      </mesh>
      {[
        [0, 0.85, 0, 0.38],
        [0.2, 1.15, 0.1, 0.28],
        [-0.18, 1.1, -0.1, 0.3],
        [0.05, 1.4, -0.05, 0.22],
      ].map(([x, y, z, r], index) => (
        <mesh key={index} castShadow position={[x, y, z]}>
          <icosahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color={index % 2 ? palette.leafDark : palette.leaf} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Rug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh receiveShadow>
        <circleGeometry args={[1.5, 48]} />
        <meshStandardMaterial color={palette.wallAccent} roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0, 0, 0.002]}>
        <ringGeometry args={[1.15, 1.25, 48]} />
        <meshStandardMaterial color={palette.cup} roughness={1} />
      </mesh>
    </group>
  );
}

function Stool({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      <mesh castShadow position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.74, 8]} />
        <meshStandardMaterial color={palette.metalDark} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.04, 20]} />
        <meshStandardMaterial color={palette.metalDark} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}
