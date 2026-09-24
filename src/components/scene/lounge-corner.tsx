"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { QuadraticBezierLine, RoundedBox } from "@react-three/drei";
import { DoubleSide, Vector3, type Group, type Mesh, type MeshBasicMaterial, type PointLight } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { drawHeart, drawMusicNote, drawSleepyZ, drawVinyl } from "./textures";
import { FloatingGlyphs } from "./floating-glyphs";
import { pickLine, Pokeable, PokeBurst, secondsSince, usePoke } from "./pokeable";
import { music, useMusicState } from "../music/youtube-music";
import { CoffeeCup } from "./coffee-cup";
import { palette } from "./palette";

type Vec3 = [number, number, number];

const brass = { color: palette.brass, metalness: 0.9, roughness: 0.25 } as const;

/** Reading nook: leather armchair, record player, arc lamp and a napping cat. */
export function LoungeCorner({ position, rotationY = 0 }: { position: Vec3; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh receiveShadow position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.6]} />
        <meshStandardMaterial color="#7d3b2c" roughness={1} />
      </mesh>
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.95, 1.35]} />
        <meshStandardMaterial color="#a8583d" roughness={1} />
      </mesh>
      <Armchair position={[0, 0, -0.1]} />
      <SideTable position={[-0.85, 0, -0.15]} />
      <ArcLamp position={[0.75, 0, -0.55]} />
      <BookStack position={[0.6, 0.008, 0.45]} />
      <SleepingCat position={[0.05, 0.47, 0.02]} />
    </group>
  );
}

function Armchair({ position }: { position: Vec3 }) {
  const leather = { color: palette.leather, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.5 } as const;
  return (
    <group position={position}>
      {/* Seat cushion and base */}
      <RoundedBox args={[0.9, 0.24, 0.8]} radius={0.08} smoothness={4} position={[0, 0.3, 0.05]} castShadow receiveShadow>
        <meshPhysicalMaterial {...leather} />
      </RoundedBox>
      <RoundedBox args={[0.74, 0.12, 0.68]} radius={0.05} smoothness={4} position={[0, 0.46, 0.08]} castShadow>
        <meshPhysicalMaterial {...leather} color="#9a5537" />
      </RoundedBox>
      {/* Back */}
      <RoundedBox args={[0.9, 0.7, 0.2]} radius={0.08} smoothness={4} position={[0, 0.7, -0.3]} rotation={[-0.12, 0, 0]} castShadow>
        <meshPhysicalMaterial {...leather} />
      </RoundedBox>
      {/* Arms */}
      {[-0.43, 0.43].map((x) => (
        <RoundedBox key={x} args={[0.16, 0.5, 0.82]} radius={0.07} smoothness={4} position={[x, 0.45, 0.02]} castShadow>
          <meshPhysicalMaterial {...leather} />
        </RoundedBox>
      ))}
      {/* Tufting buttons */}
      {[-0.22, 0, 0.22].flatMap((x) =>
        [0.62, 0.84].map((y) => (
          <mesh key={`${x}${y}`} position={[x, y, -0.19 + (y - 0.62) * 0.12]}>
            <sphereGeometry args={[0.014, 8, 6]} />
            <meshStandardMaterial color="#5a2c1b" />
          </mesh>
        )),
      )}
      {/* Tapered walnut legs */}
      {[
        [-0.38, -0.28],
        [0.38, -0.28],
        [-0.38, 0.38],
        [0.38, 0.38],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} castShadow position={[x, 0.09, z]}>
          <cylinderGeometry args={[0.025, 0.015, 0.18, 8]} />
          <meshStandardMaterial color={palette.walnut} />
        </mesh>
      ))}
    </group>
  );
}

function SideTable({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.035, 32]} />
        <meshStandardMaterial color={palette.walnut} roughness={0.4} />
      </mesh>
      {[0, 1, 2].map((index) => {
        const angle = (index / 3) * Math.PI * 2;
        return (
          <mesh key={index} castShadow position={[Math.cos(angle) * 0.14, 0.29, Math.sin(angle) * 0.14]} rotation={[Math.sin(angle) * 0.2, 0, -Math.cos(angle) * 0.2]}>
            <cylinderGeometry args={[0.015, 0.012, 0.6, 8]} />
            <meshStandardMaterial {...brass} />
          </mesh>
        );
      })}
      <RecordPlayer position={[0, 0.6, 0]} />
    </group>
  );
}

/** Turntable that mirrors the background music: tap it to play or pause, the disc and tonearm follow. */
function RecordPlayer({ position }: { position: Vec3 }) {
  const vinyl = useCanvasTexture(512, 512, drawVinyl);
  const discRef = useRef<Mesh>(null);
  const armRef = useRef<Group>(null);
  const spin = useRef(0);
  const { playing } = useMusicState();

  useFrame(({ clock }, delta) => {
    const ease = 1 - Math.exp(-delta * 3);
    spin.current += ((playing ? 3.5 : 0) - spin.current) * ease;
    if (discRef.current) discRef.current.rotation.z -= delta * spin.current;
    const arm = armRef.current;
    if (arm) arm.rotation.y += ((playing ? 0.55 + Math.sin(clock.getElapsedTime() * 0.3) * 0.02 : 0.95) - arm.rotation.y) * ease;
  });

  return (
    <Pokeable
      onPoke={music.toggle}
      bubble={() => (playing ? "Tạm dừng nhạc ⏸" : "Bật nhạc nào ♪")}
      bubbleOffset={[0, 0.35, 0]}
      position={position}
      rotation={[0, 0.3, 0]}
    >
      <RoundedBox args={[0.42, 0.07, 0.34]} radius={0.015} position={[0, 0.035, 0]} castShadow>
        <meshStandardMaterial color="#8a5a3b" roughness={0.35} />
      </RoundedBox>
      <mesh position={[-0.04, 0.075, 0]}>
        <cylinderGeometry args={[0.145, 0.145, 0.01, 40]} />
        <meshStandardMaterial color={palette.metalDark} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh ref={discRef} position={[-0.04, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.14, 48]} />
        <meshStandardMaterial map={vinyl} roughness={0.25} metalness={0.2} />
      </mesh>
      {/* Tonearm pivots from the back-right corner */}
      <group ref={armRef} position={[0.15, 0.09, -0.12]}>
        <mesh>
          <cylinderGeometry args={[0.018, 0.018, 0.03, 12]} />
          <meshStandardMaterial {...brass} />
        </mesh>
        <mesh position={[-0.09, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.18, 6]} />
          <meshStandardMaterial color={palette.chrome} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.185, 0.005, 0]}>
          <boxGeometry args={[0.025, 0.012, 0.018]} />
          <meshStandardMaterial color="#1f1d1c" />
        </mesh>
      </group>
      <group visible={playing}>
        <FloatingGlyphs draw={drawMusicNote} position={[-0.04, 0.2, 0]} count={3} height={0.55} size={0.1} drift={-0.2} />
      </group>
    </Pokeable>
  );
}

/** Brass arc floor lamp leaning over the chair; its shade holds the corner's only light. Tap to switch it. */
function ArcLamp({ position }: { position: Vec3 }) {
  const start = new Vector3(0, 0.05, 0);
  const end = new Vector3(-0.7, 1.75, 0.55);
  const control = new Vector3(0.1, 2.4, 0.1);
  const [on, setOn] = useState(true);
  const lightRef = useRef<PointLight>(null);
  const bulbRef = useRef<MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    const light = lightRef.current;
    if (light) light.intensity += ((on ? 2.2 : 0) - light.intensity) * (1 - Math.exp(-delta * 12));
    if (on) bulbRef.current?.color.setRGB(4, 3, 1.8);
    else bulbRef.current?.color.setRGB(0.3, 0.25, 0.2);
  });

  return (
    <Pokeable onPoke={() => setOn((value) => !value)} position={position}>
      <mesh castShadow position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.05, 32]} />
        <meshStandardMaterial color="#1f1d1c" metalness={0.4} roughness={0.4} />
      </mesh>
      <QuadraticBezierLine start={start} end={end} mid={control} color={palette.brass} lineWidth={3} />
      <group position={end.toArray()}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...brass} side={DoubleSide} />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.05, 16, 12]} />
          <meshBasicMaterial ref={bulbRef} color={[4, 3, 1.8]} toneMapped={false} />
        </mesh>
        <pointLight ref={lightRef} position={[0, -0.15, 0]} color={palette.lampGlow} intensity={2.2} distance={3.5} decay={2} castShadow={false} />
      </group>
    </Pokeable>
  );
}

const nowReading = pickLine(["Clean Code — đọc lần thứ 3 📖", "Designing Data-Intensive Applications 📚", "The Pragmatic Programmer ☕"]);

/** Reading pile topped with a cup; a tap tells you what's on it. */
function BookStack({ position }: { position: Vec3 }) {
  const books = [
    { color: "#2f4b6e", size: [0.3, 0.05, 0.22], turn: 0.1 },
    { color: palette.berry, size: [0.27, 0.045, 0.2], turn: -0.15 },
    { color: palette.sage, size: [0.25, 0.06, 0.18], turn: 0.25 },
  ] as const;
  let height = 0;
  return (
    <Pokeable onPoke={() => undefined} bubble={nowReading} bubbleOffset={[0, 0.45, 0]} position={position}>
      {books.map(({ color, size, turn }) => {
        const y = height + size[1] / 2;
        height += size[1];
        return (
          <mesh key={color} castShadow position={[0, y, 0]} rotation={[0, turn, 0]}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        );
      })}
      <CoffeeCup position={[0, height, 0]} rotationY={0.8} />
    </Pokeable>
  );
}

const purrs = pickLine(["Meo~ 💕", "Rừ rừ… 😽", "Nựng nữa đi mà 🥺", "Gãi cằm cơ 🐾"]);
const PET_SECONDS = 3;

/** Curled-up ginger cat that breathes, swishes its tail and dreams in z's. Pet it for purrs and hearts. */
function SleepingCat({ position }: { position: Vec3 }) {
  const bodyRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const tailRef = useRef<Group>(null);
  const dreamsRef = useRef<Group>(null);
  const { pokedAt, poke } = usePoke();
  const fur = { color: palette.ginger, roughness: 0.85 } as const;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const age = secondsSince(pokedAt);
    // 0 while asleep, eases to 1 while being petted and back down afterwards.
    const petted = age < PET_SECONDS ? Math.min(1, age / 0.3, (PET_SECONDS - age) / 0.6) : 0;
    const purr = Math.sin(time * 40) * 0.012 * petted;
    if (bodyRef.current) bodyRef.current.scale.set(1, 1 + Math.sin(time * 1.6) * 0.04 + purr, 1 + Math.sin(time * 1.6) * 0.02);
    if (headRef.current) {
      headRef.current.rotation.z = 0.35 * petted;
      headRef.current.rotation.x = Math.sin(time * 5) * 0.12 * petted;
    }
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(time * (0.9 + petted * 4)) * (0.35 + petted * 0.3);
    if (dreamsRef.current) dreamsRef.current.visible = petted === 0;
  });

  return (
    <Pokeable onPoke={poke} bubble={purrs} bubbleOffset={[0.1, 0.45, 0]} position={position} rotation={[0, 0.4, 0]}>
      <group ref={bodyRef}>
        <mesh castShadow position={[0, 0.08, 0]} scale={[1.25, 0.72, 1]}>
          <sphereGeometry args={[0.16, 24, 16]} />
          <meshStandardMaterial {...fur} />
        </mesh>
        {/* Stripes */}
        {[-0.08, 0, 0.08].map((x) => (
          <mesh key={x} position={[x, 0.12, 0]} rotation={[0, 0, x * 2]} scale={[0.25, 0.9, 1.02]}>
            <sphereGeometry args={[0.13, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#c9763a" roughness={0.85} />
          </mesh>
        ))}
      </group>
      {/* Head tucked on paws; lifts and nuzzles while petted */}
      <group ref={headRef} position={[0.16, 0.08, 0.08]}>
        <mesh castShadow scale={[1, 0.85, 0.95]}>
          <sphereGeometry args={[0.09, 20, 16]} />
          <meshStandardMaterial {...fur} />
        </mesh>
        {[-0.045, 0.045].map((z) => (
          <group key={z}>
            <mesh position={[0, 0.075, z]} rotation={[z > 0 ? 0.3 : -0.3, 0, -0.1]}>
              <coneGeometry args={[0.032, 0.06, 4]} />
              <meshStandardMaterial {...fur} />
            </mesh>
            {/* Closed eyes */}
            <mesh position={[0.078, 0.015, z * 0.8]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.012, 0.003, 4, 10, Math.PI]} />
              <meshBasicMaterial color="#3b2416" />
            </mesh>
          </group>
        ))}
        <mesh position={[0.088, -0.01, 0]}>
          <sphereGeometry args={[0.009, 8, 6]} />
          <meshStandardMaterial color="#e58a8a" />
        </mesh>
        <mesh position={[0.06, -0.05, 0]} scale={[1.2, 0.5, 1.6]}>
          <sphereGeometry args={[0.035, 12, 8]} />
          <meshStandardMaterial color="#fbf1e2" roughness={0.9} />
        </mesh>
      </group>
      {/* Tail curling around the body */}
      <group ref={tailRef} position={[-0.18, 0.04, 0]}>
        {Array.from({ length: 7 }, (_, index) => {
          const angle = index * 0.32;
          return (
            <mesh key={index} castShadow position={[-Math.sin(angle) * 0.08, 0, Math.cos(angle) * 0.14 - 0.06]}>
              <sphereGeometry args={[0.032 - index * 0.002, 10, 8]} />
              <meshStandardMaterial {...fur} color={index > 4 ? "#fbf1e2" : palette.ginger} />
            </mesh>
          );
        })}
      </group>
      <group ref={dreamsRef}>
        <FloatingGlyphs draw={drawSleepyZ} position={[0.2, 0.18, 0.08]} count={3} height={0.45} size={0.09} drift={0.15} />
      </group>
      <PokeBurst draw={drawHeart} pokedAt={pokedAt} position={[0.15, 0.2, 0.05]} count={6} duration={2} height={0.5} spread={0.2} size={0.1} />
    </Pokeable>
  );
}
