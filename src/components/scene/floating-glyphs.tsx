"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Sprite, SpriteMaterial } from "three";
import { useCanvasTexture, type CanvasDraw } from "./canvas-texture";

type FloatingGlyphsProps = {
  draw: CanvasDraw;
  position: [number, number, number];
  count?: number;
  height?: number;
  size?: number;
  drift?: number;
};

/** Glyph sprites (sleepy z's, music notes) that rise, sway and fade in a loop. */
export function FloatingGlyphs({ draw, position, count = 3, height = 0.6, size = 0.12, drift = 0.15 }: FloatingGlyphsProps) {
  const texture = useCanvasTexture(128, 128, draw);
  const spriteRefs = useRef<(Sprite | null)[]>([]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    spriteRefs.current.forEach((sprite, index) => {
      if (!sprite) return;
      const progress = (time * 0.25 + index / count) % 1;
      sprite.position.set(progress * drift + Math.sin(time * 2 + index) * 0.03, progress * height, 0);
      sprite.scale.setScalar(size * (0.6 + progress * 0.7));
      (sprite.material as SpriteMaterial).opacity = Math.sin(progress * Math.PI);
    });
  });

  return (
    <group position={position}>
      {Array.from({ length: count }, (_, index) => (
        <sprite key={index} ref={(sprite) => { spriteRefs.current[index] = sprite; }}>
          <spriteMaterial map={texture} transparent opacity={0} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}
