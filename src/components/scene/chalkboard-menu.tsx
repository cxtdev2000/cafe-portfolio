"use client";

import { useCanvasTexture } from "./canvas-texture";
import { drawMenuBoard } from "./textures";
import { palette } from "./palette";

/** Framed chalkboard menu hung on the back wall — its "drinks" are the projects. Centered on its origin. */
export function ChalkboardMenu() {
  const board = useCanvasTexture(1024, 640, drawMenuBoard);
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[2.2, 1.4, 0.06]} />
        <meshStandardMaterial color={palette.walnut} roughness={0.5} />
      </mesh>
      {/* Inner bevel */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[2.08, 1.28, 0.03]} />
        <meshStandardMaterial color={palette.woodDark} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.036]}>
        <planeGeometry args={[2.02, 1.22]} />
        <meshStandardMaterial map={board} roughness={0.95} />
      </mesh>
      {/* Chalk ledge with a couple of sticks */}
      <mesh castShadow position={[0, -0.72, 0.06]}>
        <boxGeometry args={[2.1, 0.04, 0.1]} />
        <meshStandardMaterial color={palette.walnut} roughness={0.5} />
      </mesh>
      {[
        [-0.6, palette.chalk],
        [-0.48, "#f2b3c4"],
        [0.7, "#ffd28a"],
      ].map(([x, color]) => (
        <mesh key={x} position={[Number(x), -0.69, 0.07]} rotation={[0, 0, Math.PI / 2 + Number(x) * 0.2]}>
          <cylinderGeometry args={[0.009, 0.009, 0.09, 8]} />
          <meshStandardMaterial color={String(color)} roughness={1} />
        </mesh>
      ))}
      {/* Brass hanging chain */}
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} position={[x * 0.75, 0.9, 0]} rotation={[0, 0, x > 0 ? 0.45 : -0.45]}>
          <cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />
          <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}
