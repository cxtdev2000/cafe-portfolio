"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Vector2, type MeshBasicMaterial, type PointLight } from "three";
import { useCanvasTexture, type CanvasDraw } from "./canvas-texture";
import { coffeeBagDraws, drawNeonSign } from "./textures";
import { CoffeeCup } from "./coffee-cup";
import { Pokeable, secondsSince, usePoke } from "./pokeable";
import { palette } from "./palette";

type Vec3 = [number, number, number];

const brass = { color: palette.brass, metalness: 0.9, roughness: 0.25 } as const;

/** Wall behind the bar: sideboard, floating shelves stocked with jars/bottles/bags, neon sign. */
export function BackBar({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <Sideboard />
      {[2.2, 2.85].map((y, row) => (
        <Shelf key={y} y={y} row={row} />
      ))}
      <NeonSign position={[-0.3, 3.62, 0.03]} />
    </group>
  );
}

function Sideboard() {
  return (
    <group position={[0, 0, 0.2]}>
      <mesh castShadow receiveShadow position={[0, 0.47, 0]}>
        <boxGeometry args={[4.2, 0.94, 0.42]} />
        <meshStandardMaterial color={palette.sage} roughness={0.55} />
      </mesh>
      {[-1.575, -0.525, 0.525, 1.575].map((x) => (
        <group key={x} position={[x, 0.47, 0.215]}>
          <mesh>
            <boxGeometry args={[0.95, 0.8, 0.012]} />
            <meshStandardMaterial color={palette.sageDark} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.2, 0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.22, 8]} />
            <meshStandardMaterial {...brass} />
          </mesh>
        </group>
      ))}
      <mesh castShadow position={[0, 0.96, 0]}>
        <boxGeometry args={[4.3, 0.04, 0.46]} />
        <meshStandardMaterial color={palette.walnut} roughness={0.45} />
      </mesh>
      {/* Items on the sideboard */}
      {coffeeBagDraws.map((draw, index) => (
        <CoffeeBag key={index} draw={draw} position={[-1.7 + index * 0.3, 0.98, 0]} rotationY={0.15 - index * 0.12} />
      ))}
      {[0, 1, 2].map((level) => (
        <CoffeeCup key={level} position={[0.3, 0.98 + level * 0.1, 0]} saucer={false} />
      ))}
      {[0, 1].map((level) => (
        <CoffeeCup key={level} position={[0.55, 0.98 + level * 0.1, 0.02]} saucer={false} rotationY={1} />
      ))}
      <Kettle position={[1.3, 0.98, 0]} />
    </group>
  );
}

export function CoffeeBag({ draw, position, rotationY }: { draw: CanvasDraw; position: Vec3; rotationY: number }) {
  const label = useCanvasTexture(256, 384, draw);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <RoundedBox args={[0.2, 0.3, 0.1]} radius={0.02} position={[0, 0.15, 0]} castShadow>
        <meshStandardMaterial color="#c9a57a" roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 0.15, 0.051]}>
        <planeGeometry args={[0.18, 0.27]} />
        <meshStandardMaterial map={label} roughness={0.9} />
      </mesh>
      {/* Folded, clipped top */}
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#b89468" roughness={0.9} />
      </mesh>
    </group>
  );
}

const kettleProfile = [
  [0, 0],
  [0.08, 0],
  [0.09, 0.03],
  [0.085, 0.12],
  [0.05, 0.16],
  [0.02, 0.17],
  [0, 0.17],
].map(([x, y]) => new Vector2(x, y));

/** Gooseneck pour-over kettle in matte black. */
function Kettle({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <latheGeometry args={[kettleProfile, 24]} />
        <meshStandardMaterial color="#1f1d1c" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0.13, 0.12, 0]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.008, 0.012, 0.2, 8]} />
        <meshStandardMaterial color="#1f1d1c" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[-0.1, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.05, 0.01, 8, 16, Math.PI]} />
        <meshStandardMaterial color={palette.walnut} />
      </mesh>
    </group>
  );
}

const bottleProfile = [
  [0, 0],
  [0.04, 0],
  [0.042, 0.02],
  [0.042, 0.16],
  [0.03, 0.2],
  [0.014, 0.23],
  [0.014, 0.27],
  [0, 0.27],
].map(([x, y]) => new Vector2(x, y));

const syrupColors = ["#b8434f", "#d9a35b", "#6b3e26", "#e8c26a"];
const jarFills = [palette.coffee, "#7a4d31", palette.crema, "#4a2e1c"];

function Shelf({ y, row }: { y: number; row: number }) {
  return (
    <group position={[0, y, 0.16]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.06, 0.3]} />
        <meshStandardMaterial color={palette.walnut} roughness={0.45} />
      </mesh>
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, -0.08, -0.08]}>
          <boxGeometry args={[0.03, 0.14, 0.14]} />
          <meshStandardMaterial {...brass} />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, index) => {
        const x = -1.45 + index * 0.36;
        const kind = (index + row) % 3;
        if (kind === 0) {
          // Glass jar of beans
          return (
            <group key={index} position={[x, 0.03, 0]}>
              <mesh castShadow position={[0, 0.13, 0]}>
                <cylinderGeometry args={[0.085, 0.085, 0.26, 20]} />
                <meshPhysicalMaterial color="#ffffff" transparent opacity={0.22} roughness={0.05} depthWrite={false} />
              </mesh>
              <mesh position={[0, 0.09, 0]}>
                <cylinderGeometry args={[0.075, 0.075, 0.17, 20]} />
                <meshStandardMaterial color={jarFills[(index + row) % jarFills.length]} roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.27, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.03, 20]} />
                <meshStandardMaterial {...brass} />
              </mesh>
            </group>
          );
        }
        if (kind === 1) {
          // Syrup bottle
          return (
            <group key={index} position={[x, 0.03, 0]}>
              <mesh castShadow>
                <latheGeometry args={[bottleProfile, 20]} />
                <meshPhysicalMaterial color={syrupColors[(index + row) % syrupColors.length]} transparent opacity={0.8} roughness={0.1} clearcoat={1} />
              </mesh>
              <mesh position={[0, 0.29, 0]}>
                <cylinderGeometry args={[0.016, 0.016, 0.04, 10]} />
                <meshStandardMaterial color="#1f1d1c" />
              </mesh>
            </group>
          );
        }
        // Small trailing plant
        return (
          <group key={index} position={[x, 0.03, 0]}>
            <mesh castShadow position={[0, 0.07, 0]}>
              <cylinderGeometry args={[0.07, 0.055, 0.14, 16]} />
              <meshStandardMaterial color={palette.cup} roughness={0.4} />
            </mesh>
            {Array.from({ length: 5 }, (_, leaf) => (
              <mesh key={leaf} castShadow position={[Math.sin(leaf * 1.3) * 0.07, 0.15 - leaf * 0.05, 0.05 + Math.cos(leaf * 1.3) * 0.04]}>
                <icosahedronGeometry args={[0.04, 0]} />
                <meshStandardMaterial color={leaf % 2 ? palette.leaf : palette.leafDark} flatShading />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/** Script neon on a dark backer; flickers now and then like a real tube. Tap to switch it off and on. */
function NeonSign({ position }: { position: Vec3 }) {
  const texture = useCanvasTexture(1024, 256, drawNeonSign);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const lightRef = useRef<PointLight>(null);
  const [on, setOn] = useState(true);
  const { pokedAt, poke } = usePoke();

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    const time = clock.getElapsedTime();
    // Tubes stutter for a moment after being switched back on.
    const warmingUp = on && secondsSince(pokedAt) < 0.8;
    const flicker = (time % 7 > 6.7 || warmingUp) && Math.sin(time * 90) > 0 ? 0.35 : 1;
    const level = on ? 2.6 * flicker : 0.12;
    material.color.setScalar(level);
    if (lightRef.current) lightRef.current.intensity = (1.2 * level) / 2.6;
  });

  return (
    <Pokeable
      onPoke={() => {
        poke();
        setOn((value) => !value);
      }}
      bubble={() => (on ? "Tắt đèn, chill thôi 🌙" : "Quán vẫn mở nè ✨")}
      bubbleOffset={[0, 0.55, 0.1]}
      position={position}
    >
      <RoundedBox args={[2.1, 0.62, 0.03]} radius={0.015} castShadow>
        <meshStandardMaterial color="#141214" roughness={0.3} metalness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.0, 0.5]} />
        <meshBasicMaterial ref={materialRef} map={texture} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0, 0.4]} color={palette.neon} intensity={1.2} distance={2.5} decay={2} />
    </Pokeable>
  );
}
