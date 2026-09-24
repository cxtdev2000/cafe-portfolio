"use client";

import { CoffeeCup } from "./coffee-cup";
import { Steam } from "./steam";
import { palette } from "./palette";

export const COUNTER_TOP_Y = 1.13;

/** The bar counter body plus a pastry display case. The espresso machine is a separate hotspot. */
export function CafeCounter({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.53, 0]}>
        <boxGeometry args={[3.4, 1.06, 0.9]} />
        <meshStandardMaterial color={palette.wood} roughness={0.7} />
      </mesh>
      {/* Vertical slats on the customer-facing side */}
      {Array.from({ length: 11 }, (_, index) => (
        <mesh key={index} position={[-1.5 + index * 0.3, 0.53, 0.46]}>
          <boxGeometry args={[0.06, 0.9, 0.02]} />
          <meshStandardMaterial color={palette.woodDark} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 1.09, 0]}>
        <boxGeometry args={[3.6, 0.08, 1.05]} />
        <meshStandardMaterial color={palette.counterTop} roughness={0.35} />
      </mesh>
      <PastryCase position={[-1.15, COUNTER_TOP_Y, 0.1]} />
    </group>
  );
}

function PastryCase({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.9, 0.4, 0.55]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} roughness={0.05} />
      </mesh>
      {[-0.25, 0, 0.25].map((x, index) => (
        <mesh key={x} position={[x, 0.07, 0]} rotation={[0, index, 0]}>
          <torusGeometry args={[0.07, 0.035, 10, 20]} />
          <meshStandardMaterial color={index === 1 ? palette.berry : palette.pastry} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/** Espresso machine with portafilters, cups and steam. Base sits at y = 0 (counter top). */
export function EspressoMachine() {
  return (
    <group>
      <mesh castShadow position={[0, 0.3, -0.1]}>
        <boxGeometry args={[0.9, 0.6, 0.5]} />
        <meshStandardMaterial color={palette.metal} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh castShadow position={[0, 0.63, -0.1]}>
        <boxGeometry args={[0.94, 0.06, 0.54]} />
        <meshStandardMaterial color={palette.metalDark} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Front accent panel */}
      <mesh position={[0, 0.42, 0.155]}>
        <boxGeometry args={[0.8, 0.22, 0.01]} />
        <meshStandardMaterial color={palette.wallAccent} />
      </mesh>
      {/* Pressure gauges */}
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.42, 0.162]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.01, 24]} />
          <meshStandardMaterial color={palette.cup} />
        </mesh>
      ))}
      {/* Group heads + portafilters */}
      {[-0.22, 0.22].map((x) => (
        <group key={x} position={[x, 0.22, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.06, 20]} />
            <meshStandardMaterial color={palette.metalDark} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.02, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.18, 8]} />
            <meshStandardMaterial color={palette.coffee} />
          </mesh>
        </group>
      ))}
      {/* Drip tray */}
      <mesh position={[0, 0.02, 0.22]}>
        <boxGeometry args={[0.8, 0.04, 0.2]} />
        <meshStandardMaterial color={palette.metalDark} metalness={0.7} roughness={0.3} />
      </mesh>
      <CoffeeCup position={[-0.22, 0.04, 0.22]} steaming />
      <CoffeeCup position={[0.62, 0, 0.2]} rotationY={0.6} />
      <CoffeeCup position={[0.62, 0.02, 0.2]} rotationY={1.4} />
      <Steam position={[0.46, 0.3, 0.1]} puffs={4} height={0.35} />
      <Grinder position={[-0.72, 0, -0.05]} />
    </group>
  );
}

function Grinder({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.24]} />
        <meshStandardMaterial color={palette.metalDark} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.5, 0]}>
        <coneGeometry args={[0.13, 0.22, 20]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <coneGeometry args={[0.09, 0.12, 20]} />
        <meshStandardMaterial color={palette.coffee} />
      </mesh>
    </group>
  );
}
