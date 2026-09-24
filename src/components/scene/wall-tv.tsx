"use client";

import { Html, RoundedBox } from "@react-three/drei";
import { YouTubeScreen, SCREEN_WIDTH } from "../music/youtube-screen";
import { palette } from "./palette";

type Vec3 = [number, number, number];

const SCREEN_W = 1.2;
const SCREEN_H = 0.675;
// drei's transform mode maps 1 CSS px to distanceFactor / 400 world units.
const DISTANCE_FACTOR = (SCREEN_W * 400) / SCREEN_WIDTH;

const blackIron = { color: "#1f1d1c", metalness: 0.6, roughness: 0.35 } as const;

/** Slim flat TV on a swing-arm corner bracket. Its screen is the live YouTube background-music player. */
export function WallTv({ position, rotationY, focused }: { position: Vec3; rotationY: number; focused: boolean }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Walnut-framed bezel */}
      <RoundedBox args={[SCREEN_W + 0.08, SCREEN_H + 0.08, 0.05]} radius={0.015} smoothness={3} castShadow>
        <meshStandardMaterial color={palette.walnut} roughness={0.45} />
      </RoundedBox>
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[SCREEN_W + 0.02, SCREEN_H + 0.02]} />
        <meshStandardMaterial color="#0b0b0c" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Brass maker's badge and a tiny standby light */}
      <mesh position={[0, -SCREEN_H / 2 - 0.025, 0.026]}>
        <planeGeometry args={[0.08, 0.012]} />
        <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[SCREEN_W / 2 - 0.02, -SCREEN_H / 2 - 0.025, 0.027]}>
        <circleGeometry args={[0.005, 12]} />
        <meshBasicMaterial color={[2, 0.4, 0.3]} toneMapped={false} />
      </mesh>
      {/* Swing arm reaching back into the corner */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[0.18, 0.14, 0.04]} />
        <meshStandardMaterial {...blackIron} />
      </mesh>
      <mesh position={[0, 0, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.56, 10]} />
        <meshStandardMaterial {...blackIron} />
      </mesh>
      <mesh position={[0, 0, -0.645]}>
        <boxGeometry args={[0.1, 0.22, 0.03]} />
        <meshStandardMaterial {...blackIron} />
      </mesh>

      {/* The player sits behind the WebGL canvas (see .scene-canvas) and shows through a hole the "blending" occluder cuts,
          so props in front of the TV hide it. Until zoomed in, clicks and drags pass through to the TV hotspot and the
          orbit controls; once focused the video itself takes taps */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0.028]}
        distanceFactor={DISTANCE_FACTOR}
        zIndexRange={[0, 0]}
        pointerEvents={focused ? "auto" : "none"}
      >
        <YouTubeScreen />
      </Html>
    </group>
  );
}
