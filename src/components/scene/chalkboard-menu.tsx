"use client";

import { palette } from "./palette";

// Widths of chalk "text" strokes per row — reads as a handwritten menu from afar.
const MENU_ROWS = [
  { y: 0.45, widths: [0.7], title: true },
  { y: 0.2, widths: [0.55, 0.12] },
  { y: 0.05, widths: [0.4, 0.12] },
  { y: -0.1, widths: [0.6, 0.12] },
  { y: -0.25, widths: [0.35, 0.12] },
  { y: -0.4, widths: [0.5, 0.12] },
];

/** Framed chalkboard menu hung on the back wall. Centered on its origin. */
export function ChalkboardMenu() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[2.2, 1.4, 0.06]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[2.02, 1.22]} />
        <meshStandardMaterial color={palette.chalkboard} roughness={1} />
      </mesh>
      {MENU_ROWS.map(({ y, widths, title }) => (
        <group key={y} position={[0, y, 0.035]}>
          {title ? (
            <mesh>
              <planeGeometry args={[widths[0], 0.07]} />
              <meshBasicMaterial color={palette.chalk} />
            </mesh>
          ) : (
            <>
              <mesh position={[-0.75 + widths[0] / 2, 0, 0]}>
                <planeGeometry args={[widths[0], 0.035]} />
                <meshBasicMaterial color={palette.chalk} transparent opacity={0.85} />
              </mesh>
              <mesh position={[0.35, 0, 0]}>
                <planeGeometry args={[widths[1], 0.035]} />
                <meshBasicMaterial color={palette.pastry} />
              </mesh>
            </>
          )}
        </group>
      ))}
      {/* Chalk doodle of a cup */}
      <group position={[0.72, -0.1, 0.036]}>
        <mesh>
          <ringGeometry args={[0.13, 0.15, 3, 1, Math.PI / 6]} />
          <meshBasicMaterial color={palette.chalk} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <ringGeometry args={[0.04, 0.055, 20, 1, 0, Math.PI]} />
          <meshBasicMaterial color={palette.chalk} transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
}
