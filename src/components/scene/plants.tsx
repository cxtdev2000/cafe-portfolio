"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Shape, Vector2, type Group, type Sprite } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { pickLine, Pokeable, PokeBurst, secondsSince, usePoke } from "./pokeable";
import { drawSparkle, drawWaterDrop } from "./textures";
import { palette } from "./palette";

// Split monstera-style leaf, unit length along +Y.
function createLeafShape() {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.45, 0.1, 0.55, 0.65, 0, 1);
  shape.bezierCurveTo(-0.55, 0.65, -0.45, 0.1, 0, 0);
  return shape;
}

const leafShape = createLeafShape();

const potProfile = [
  [0, 0],
  [0.2, 0],
  [0.24, 0.05],
  [0.28, 0.42],
  [0.3, 0.46],
  [0.27, 0.47],
  [0.25, 0.44],
  [0, 0.44],
].map(([x, y]) => new Vector2(x, y));

type PlantProps = { position: [number, number, number]; scale?: number; potColor?: string; leaves?: number };

const thankYous = pickLine(["Cảm ơn nhé! 💧", "Mát quá~ 🌿", "Lớn thêm chút rồi 🌱"]);

// Watering timeline (seconds after the poke): the can swings in, pours, then the leaves perk up.
const POUR_START = 0.55;
const POUR_END = 1.95;
const CAN_GONE = 2.4;

/** Potted monstera: ceramic lathe pot, soil and leaves fanned on thin stems. Tap it to water it. */
export function Plant({ position, scale = 1, potColor = palette.pot, leaves = 9 }: PlantProps) {
  const { pokedAt, poke } = usePoke();
  const leavesRef = useRef<Group>(null);

  useFrame(() => {
    const leavesGroup = leavesRef.current;
    if (!leavesGroup) return;
    const since = secondsSince(pokedAt) - POUR_START - 0.3;
    const perk = since > 0 && since < 3 ? Math.sin(since * 9) * Math.exp(-since * 1.8) * 0.09 : 0;
    leavesGroup.scale.set(1 - perk * 0.4, 1 + perk, 1 - perk * 0.4);
  });

  return (
    <group position={position} scale={scale}>
      <Pokeable onPoke={poke} bubble={thankYous} bubbleOffset={[0, 1.75, 0]}>
        <mesh castShadow receiveShadow>
          <latheGeometry args={[potProfile, 32]} />
          <meshPhysicalMaterial color={potColor} roughness={0.45} clearcoat={0.3} />
        </mesh>
        <mesh position={[0, 0.43, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.25, 24]} />
          <meshStandardMaterial color="#3a2618" roughness={1} />
        </mesh>
        <group ref={leavesRef} position={[0, 0.42, 0]}>
          {Array.from({ length: leaves }, (_, index) => {
            const angle = (index / leaves) * Math.PI * 2 + index * 0.4;
            const tilt = 0.35 + (index % 3) * 0.22;
            const height = 0.55 + (index % 4) * 0.12;
            return (
              <group key={index} rotation={[0, angle, 0]}>
                <mesh position={[0, height / 2, 0.06]} rotation={[tilt * 0.4, 0, 0]}>
                  <cylinderGeometry args={[0.008, 0.012, height, 5]} />
                  <meshStandardMaterial color={palette.leafDark} />
                </mesh>
                <mesh castShadow position={[0, height, 0.1 + tilt * 0.12]} rotation={[tilt, 0, 0]} scale={0.34 + (index % 3) * 0.05}>
                  <shapeGeometry args={[leafShape, 10]} />
                  <meshStandardMaterial color={index % 2 ? palette.leaf : palette.leafDark} side={DoubleSide} roughness={0.55} />
                </mesh>
              </group>
            );
          })}
        </group>
      </Pokeable>
      <WateringCan pokedAt={pokedAt} />
      <PokeBurst draw={drawSparkle} pokedAt={pokedAt} position={[0, 1.1, 0]} delay={POUR_END - 0.4} count={6} height={0.45} spread={0.35} size={0.12} />
    </group>
  );
}

const CAN_POSITION: [number, number, number] = [0.5, 1.5, 0];
const CAN_TILT = 0.7;
// Spout tip in plant space once the can is tilted (the rose of the can, see the geometry below).
const SPOUT_TIP: [number, number, number] = [0.235, 1.42, 0];
const SOIL_Y = 0.45;
const DROPS = 6;

/** Sage watering can that swings in over the pot, pours a stream of drops and leaves again. */
function WateringCan({ pokedAt }: { pokedAt: RefObject<number> }) {
  const canRef = useRef<Group>(null);
  const dropRefs = useRef<(Sprite | null)[]>([]);
  const drop = useCanvasTexture(64, 64, drawWaterDrop);

  useFrame(() => {
    const can = canRef.current;
    if (!can) return;
    const age = secondsSince(pokedAt);
    can.visible = age < CAN_GONE;
    if (!can.visible) return;
    const grow = Math.min(1, age / 0.3, (CAN_GONE - age) / 0.3);
    can.scale.setScalar(Math.max(0.001, grow));
    const tiltIn = Math.min(1, Math.max(0, (age - 0.3) / 0.3));
    const tiltOut = Math.min(1, Math.max(0, (POUR_END + 0.15 - age) / 0.25));
    can.rotation.z = CAN_TILT * Math.min(tiltIn, tiltOut);

    const pouring = age > POUR_START && age < POUR_END;
    dropRefs.current.forEach((sprite, index) => {
      if (!sprite) return;
      sprite.visible = pouring;
      if (!pouring) return;
      const progress = ((age - POUR_START) * 1.8 + index / DROPS) % 1;
      sprite.position.set(SPOUT_TIP[0] + Math.sin(index * 1.7) * 0.03, SPOUT_TIP[1] - progress * (SPOUT_TIP[1] - SOIL_Y), Math.cos(index * 2.3) * 0.03);
    });
  });

  return (
    <group>
      <group ref={canRef} position={CAN_POSITION} visible={false}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.11, 0.16, 24]} />
          <meshStandardMaterial color={palette.sage} metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.008, 8, 24]} />
          <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Spout angled up and out, capped by a brass rose */}
        <mesh position={[-0.17, 0.04, 0]} rotation={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.012, 0.02, 0.22, 10]} />
          <meshStandardMaterial color={palette.sage} metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh position={[-0.256, 0.108, 0]} rotation={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.03, 0.014, 0.03, 12]} />
          <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0.04, 0.08, 0]}>
          <torusGeometry args={[0.07, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
      {Array.from({ length: DROPS }, (_, index) => (
        <sprite key={index} visible={false} scale={0.045} ref={(sprite) => { dropRefs.current[index] = sprite; }}>
          <spriteMaterial map={drop} transparent depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

const rustles = pickLine(["Rung rinh~ 🍃", "Hihi, nhột quá! 🌿"]);

/** Wall-hung planter with trailing vines that sway gently, and swing when tapped. */
export function HangingPlanter({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const vinesRef = useRef<Group>(null);
  const { pokedAt, poke } = usePoke();

  useFrame(({ clock }) => {
    if (!vinesRef.current) return;
    const age = secondsSince(pokedAt);
    const swing = age < 4 ? Math.sin(age * 6) * Math.exp(-age * 1.2) * 0.35 : 0;
    vinesRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.8) * 0.04 + swing;
  });

  return (
    <Pokeable onPoke={poke} bubble={rustles} bubbleOffset={[0, 0.55, 0.2]} position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.25, -0.12]}>
        <boxGeometry args={[0.04, 0.04, 0.28]} />
        <meshStandardMaterial color={palette.brass} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh castShadow scale={0.55}>
        <latheGeometry args={[potProfile, 24]} />
        <meshPhysicalMaterial color={palette.cup} roughness={0.3} clearcoat={0.5} />
      </mesh>
      <group ref={vinesRef} position={[0, 0.22, 0]}>
        {[-0.1, 0, 0.1].map((x, strand) => (
          <group key={x} position={[x, 0, strand === 1 ? 0.1 : 0.05]}>
            {Array.from({ length: 9 }, (_, index) => (
              <mesh
                key={index}
                position={[Math.sin(index * 0.9 + strand) * 0.04, -index * 0.11 - strand * 0.05, 0]}
                rotation={[0.3, index * 1.3, Math.PI + (index % 2 ? 0.5 : -0.5)]}
                scale={0.1}
              >
                <shapeGeometry args={[leafShape, 6]} />
                <meshStandardMaterial color={index % 2 ? palette.leaf : palette.leafDark} side={DoubleSide} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </Pokeable>
  );
}
