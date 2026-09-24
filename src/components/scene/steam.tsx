"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

type SteamProps = { position: [number, number, number]; puffs?: number; height?: number };

/** Looping translucent puffs rising above a hot drink. */
export function Steam({ position, puffs = 5, height = 0.5 }: SteamProps) {
  const puffRefs = useRef<(Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    puffRefs.current.forEach((puff, index) => {
      if (!puff) return;
      const progress = (time * 0.35 + index / puffs) % 1;
      puff.position.set(Math.sin(time * 1.5 + index) * 0.03, progress * height, Math.cos(time + index) * 0.02);
      puff.scale.setScalar(0.03 + progress * 0.06);
      const material = puff.material as { opacity: number };
      material.opacity = Math.sin(progress * Math.PI) * 0.35;
    });
  });

  return (
    <group position={position}>
      {Array.from({ length: puffs }, (_, index) => (
        <mesh key={index} ref={(mesh) => { puffRefs.current[index] = mesh; }}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
