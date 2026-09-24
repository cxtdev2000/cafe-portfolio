"use client";

import { Steam } from "./steam";
import { palette } from "./palette";

type CoffeeCupProps = {
  position?: [number, number, number];
  rotationY?: number;
  steaming?: boolean;
};

/** Small cup on a saucer, optionally steaming. Base sits at y = 0. */
export function CoffeeCup({ position = [0, 0, 0], rotationY = 0, steaming = false }: CoffeeCupProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.02, 24]} />
        <meshStandardMaterial color={palette.cup} />
      </mesh>
      <mesh castShadow position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.07, 0.055, 0.11, 24]} />
        <meshStandardMaterial color={palette.cup} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.062, 24]} />
        <meshStandardMaterial color={palette.coffee} />
      </mesh>
      <mesh position={[0.08, 0.075, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.028, 0.009, 8, 16, Math.PI]} />
        <meshStandardMaterial color={palette.cup} />
      </mesh>
      {steaming && <Steam position={[0, 0.14, 0]} height={0.45} />}
    </group>
  );
}
