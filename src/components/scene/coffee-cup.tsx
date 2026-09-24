"use client";

import { Vector2 } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { drawLatteArt } from "./textures";
import { Steam } from "./steam";
import { palette } from "./palette";

// Lathe profiles (radius, height) for a curved ceramic cup and its saucer.
const cupProfile = [
  [0, 0],
  [0.048, 0],
  [0.054, 0.006],
  [0.066, 0.06],
  [0.072, 0.112],
  [0.066, 0.112],
  [0.06, 0.06],
  [0.048, 0.014],
  [0, 0.014],
].map(([x, y]) => new Vector2(x, y));

const saucerProfile = [
  [0, 0],
  [0.07, 0.002],
  [0.1, 0.008],
  [0.132, 0.022],
  [0.128, 0.026],
  [0.1, 0.014],
  [0.06, 0.012],
  [0, 0.012],
].map(([x, y]) => new Vector2(x, y));

type CoffeeCupProps = {
  position?: [number, number, number];
  rotationY?: number;
  steaming?: boolean;
  latteArt?: boolean;
  saucer?: boolean;
};

/** Glazed cup on a saucer, optionally with latte art and steam. Base sits at y = 0. */
export function CoffeeCup({ position = [0, 0, 0], rotationY = 0, steaming = false, latteArt = false, saucer = true }: CoffeeCupProps) {
  const lift = saucer ? 0.012 : 0;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {saucer && (
        <mesh castShadow receiveShadow>
          <latheGeometry args={[saucerProfile, 32]} />
          <meshPhysicalMaterial color={palette.cup} roughness={0.25} clearcoat={0.6} />
        </mesh>
      )}
      <group position={[0, lift, 0]}>
        <mesh castShadow>
          <latheGeometry args={[cupProfile, 32]} />
          <meshPhysicalMaterial color={palette.cup} roughness={0.25} clearcoat={0.6} />
        </mesh>
        {latteArt ? <LatteTop /> : (
          <mesh position={[0, 0.098, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.064, 32]} />
            <meshStandardMaterial color={palette.coffee} roughness={0.3} />
          </mesh>
        )}
        <mesh position={[0.078, 0.066, 0]} rotation={[0, 0, -0.2]}>
          <torusGeometry args={[0.026, 0.008, 10, 20, Math.PI * 1.3]} />
          <meshPhysicalMaterial color={palette.cup} roughness={0.25} clearcoat={0.6} />
        </mesh>
      </group>
      {steaming && <Steam position={[0, 0.13, 0]} height={0.45} />}
    </group>
  );
}

function LatteTop() {
  const texture = useCanvasTexture(256, 256, drawLatteArt);
  return (
    <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.066, 32]} />
      <meshStandardMaterial map={texture} roughness={0.35} />
    </mesh>
  );
}
