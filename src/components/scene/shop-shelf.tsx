"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { MeshBasicMaterial } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { coffeeBagDraws, drawShopSign, drawShopTablet } from "./textures";
import { CoffeeBag } from "./back-bar";
import { CoffeeCup } from "./coffee-cup";
import { palette } from "./palette";

type Vec3 = [number, number, number];

const WIDTH = 1.3;
const HEIGHT = 1.9;
const DEPTH = 0.34;
const SHELF_LEVELS = [0.12, 0.58, 1.04, 1.5];

const walnut = { color: palette.walnut, roughness: 0.55 } as const;

const giftBoxes: { size: Vec3; x: number; level: number; color: string; ribbon: string }[] = [
  { size: [0.3, 0.26, 0.24], x: -0.4, level: 0, color: palette.sage, ribbon: palette.brass },
  { size: [0.24, 0.18, 0.2], x: -0.06, level: 0, color: "#b8434f", ribbon: "#f6eee2" },
  { size: [0.34, 0.22, 0.26], x: 0.34, level: 0, color: "#e8c26a", ribbon: "#b8434f" },
  { size: [0.2, 0.2, 0.2], x: -0.38, level: 1, color: palette.trust, ribbon: "#ffffff" },
  { size: [0.26, 0.14, 0.2], x: -0.1, level: 1, color: "#f6eee2", ribbon: palette.sage },
];

/**
 * Walnut retail étagère by the window: coffee beans, mugs and gift boxes on display,
 * a tablet showing the Trustinfy storefront and a hanging sign that points shoppers online.
 * The group origin sits on the floor at the shelf's centre; local +z faces into the room.
 */
export function ShopShelf() {
  return (
    <group>
      {/* Frame: sage back panel, two walnut sides and four shelves */}
      <mesh position={[0, HEIGHT / 2, -DEPTH / 2 + 0.01]} receiveShadow>
        <boxGeometry args={[WIDTH, HEIGHT, 0.02]} />
        <meshStandardMaterial color={palette.sageDark} roughness={0.8} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * (WIDTH + 0.04)) / 2, HEIGHT / 2, 0]} castShadow>
          <boxGeometry args={[0.04, HEIGHT, DEPTH]} />
          <meshStandardMaterial {...walnut} />
        </mesh>
      ))}
      {SHELF_LEVELS.map((y) => (
        <RoundedBox key={y} args={[WIDTH, 0.035, DEPTH]} radius={0.008} position={[0, y - 0.0175, 0]} castShadow receiveShadow>
          <meshStandardMaterial {...walnut} />
        </RoundedBox>
      ))}
      <RoundedBox args={[WIDTH + 0.1, 0.04, DEPTH + 0.04]} radius={0.01} position={[0, HEIGHT + 0.02, 0]} castShadow>
        <meshStandardMaterial {...walnut} />
      </RoundedBox>

      {/* Top shelf: house roasts */}
      {coffeeBagDraws.map((draw, index) => (
        <CoffeeBag key={index} draw={draw} position={[-0.42 + index * 0.28, SHELF_LEVELS[3], 0.02]} rotationY={(index - 1) * 0.12} />
      ))}
      <mesh position={[0.5, SHELF_LEVELS[3] + 0.09, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.18, 20]} />
        <meshStandardMaterial color={palette.brass} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Middle shelf: merch mugs and the storefront tablet */}
      {[-0.46, -0.24].map((x, index) => (
        <CoffeeCup key={x} position={[x, SHELF_LEVELS[2], 0.02]} rotationY={0.6 + index} saucer={false} />
      ))}
      <ShopTablet position={[0.25, SHELF_LEVELS[2], 0.02]} />

      {/* Lower shelves: wrapped gift boxes */}
      {giftBoxes.map((box) => (
        <GiftBox key={`${box.level}-${box.x}`} {...box} y={SHELF_LEVELS[box.level]} />
      ))}
      <mesh position={[0.38, SHELF_LEVELS[1] + 0.12, 0]} rotation={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.24, 24]} />
        <meshStandardMaterial color="#8c4a2f" roughness={0.7} />
      </mesh>

      <ShopSign position={[0, HEIGHT + 0.42, 0.08]} />
    </group>
  );
}

function GiftBox({ size, x, y, color, ribbon }: { size: Vec3; x: number; y: number; color: string; ribbon: string }) {
  const [w, h, d] = size;
  return (
    <group position={[x, y + h / 2, 0.02]}>
      <RoundedBox args={size} radius={0.01} castShadow>
        <meshStandardMaterial color={color} roughness={0.6} />
      </RoundedBox>
      {/* Ribbon crossing over the lid, plus a bow */}
      <mesh>
        <boxGeometry args={[w + 0.004, h + 0.004, 0.03]} />
        <meshStandardMaterial color={ribbon} roughness={0.4} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.03, h + 0.004, d + 0.004]} />
        <meshStandardMaterial color={ribbon} roughness={0.4} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.025, h / 2 + 0.015, 0]} rotation={[0, 0, side * 0.6]}>
          <torusGeometry args={[0.022, 0.007, 8, 16]} />
          <meshStandardMaterial color={ribbon} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/** Small tablet on a stand, lit with the Trustinfy storefront. */
function ShopTablet({ position }: { position: Vec3 }) {
  const screen = useCanvasTexture(512, 384, drawShopTablet);
  return (
    <group position={position}>
      <mesh position={[0, 0.01, -0.04]}>
        <boxGeometry args={[0.12, 0.02, 0.1]} />
        <meshStandardMaterial color="#1f1d1c" metalness={0.5} roughness={0.35} />
      </mesh>
      <group position={[0, 0.19, 0]} rotation={[-0.18, 0, 0]}>
        <RoundedBox args={[0.46, 0.35, 0.02]} radius={0.012} castShadow>
          <meshStandardMaterial color="#1f1d1c" metalness={0.4} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.43, 0.32]} />
          <meshBasicMaterial map={screen} color={[1.15, 1.15, 1.15]} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Hanging sign above the shelf with a softly pulsing "online" light. */
function ShopSign({ position }: { position: Vec3 }) {
  const texture = useCanvasTexture(1024, 320, drawShopSign);
  const dotRef = useRef<MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    dotRef.current?.color.set(palette.trust).multiplyScalar(1.6 + Math.sin(clock.getElapsedTime() * 3) * 0.9);
  });

  return (
    <group position={position}>
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} position={[x, 0.3, -0.04]}>
          <cylinderGeometry args={[0.004, 0.004, 0.36, 6]} />
          <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      <RoundedBox args={[1.12, 0.37, 0.03]} radius={0.02} castShadow>
        <meshStandardMaterial color={palette.walnut} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.016]}>
        <planeGeometry args={[1.08, 0.3375]} />
        <meshStandardMaterial map={texture} roughness={0.7} />
      </mesh>
      <mesh position={[0.5, 0.13, 0.02]}>
        <circleGeometry args={[0.018, 16]} />
        <meshBasicMaterial ref={dotRef} toneMapped={false} />
      </mesh>
    </group>
  );
}
