"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Sprite, SpriteMaterial } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { drawSoftPuff } from "./textures";

type SteamProps = { position: [number, number, number]; puffs?: number; height?: number };

/** Looping soft vapour sprites rising above a hot drink. */
export function Steam({ position, puffs = 5, height = 0.5 }: SteamProps) {
  const texture = useCanvasTexture(64, 64, drawSoftPuff);
  const puffRefs = useRef<(Sprite | null)[]>([]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    puffRefs.current.forEach((puff, index) => {
      if (!puff) return;
      const progress = (time * 0.35 + index / puffs) % 1;
      puff.position.set(Math.sin(time * 1.5 + index) * 0.03, progress * height, Math.cos(time + index) * 0.02);
      puff.scale.setScalar(0.06 + progress * 0.16);
      (puff.material as SpriteMaterial).opacity = Math.sin(progress * Math.PI) * 0.3;
    });
  });

  return (
    <group position={position}>
      {Array.from({ length: puffs }, (_, index) => (
        <sprite key={index} ref={(sprite) => { puffRefs.current[index] = sprite; }}>
          <spriteMaterial map={texture} transparent opacity={0} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}
