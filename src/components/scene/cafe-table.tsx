"use client";

import { CoffeeCup } from "./coffee-cup";
import { palette } from "./palette";

export const TABLE_TOP_Y = 0.78;

/** Round bistro table with two chairs. The items on top are a separate hotspot. */
export function CafeTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.04, 40]} />
        <meshStandardMaterial color={palette.wood} roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.74, 10]} />
        <meshStandardMaterial color={palette.metalDark} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.04, 24]} />
        <meshStandardMaterial color={palette.metalDark} metalness={0.6} roughness={0.4} />
      </mesh>
      <Chair position={[0.95, 0, 0.1]} rotationY={-Math.PI / 2} />
      <Chair position={[-0.2, 0, -0.95]} rotationY={0} />
    </group>
  );
}

function Chair({ position, rotationY }: { position: [number, number, number]; rotationY: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow position={[0, 0.47, 0]}>
        <boxGeometry args={[0.46, 0.05, 0.46]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      <mesh castShadow position={[0, 0.8, -0.21]}>
        <boxGeometry args={[0.46, 0.4, 0.04]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      {[
        [-0.19, -0.19],
        [0.19, -0.19],
        [-0.19, 0.19],
        [0.19, 0.19],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} castShadow position={[x, 0.23, z]}>
          <boxGeometry args={[0.04, 0.46, 0.04]} />
          <meshStandardMaterial color={palette.woodDark} />
        </mesh>
      ))}
    </group>
  );
}

/** Cup, postcard and phone resting on the table — the contact hotspot. Base sits at y = 0. */
export function TableItems() {
  return (
    <group>
      <CoffeeCup position={[0.15, 0, 0.1]} steaming />
      {/* Postcard / envelope */}
      <group position={[-0.2, 0.005, 0.15]} rotation={[0, 0.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.01, 0.24]} />
          <meshStandardMaterial color={palette.cup} />
        </mesh>
        <mesh position={[0, 0.006, -0.03]} rotation={[-Math.PI / 2, 0, Math.PI]}>
          <circleGeometry args={[0.18, 3, Math.PI / 2 - Math.PI / 3, (Math.PI * 2) / 3]} />
          <meshStandardMaterial color="#e6d9c3" />
        </mesh>
        <mesh position={[0, 0.008, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial color={palette.berry} />
        </mesh>
      </group>
      {/* Phone */}
      <group position={[0.05, 0.008, -0.25]} rotation={[0, -0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.012, 0.2]} />
          <meshStandardMaterial color={palette.metalDark} />
        </mesh>
        <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.088, 0.18]} />
          <meshStandardMaterial color={palette.windowGlow} emissive={palette.windowGlow} emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}
