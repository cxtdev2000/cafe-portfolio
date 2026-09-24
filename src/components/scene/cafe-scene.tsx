"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { about, contact, projects, type SectionId } from "@/content/portfolio";
import { CafeRoom } from "./cafe-room";
import { CafeCounter, COUNTER_TOP_Y, EspressoMachine } from "./cafe-counter";
import { CafeTable, TABLE_TOP_Y, TableItems } from "./cafe-table";
import { ChalkboardMenu } from "./chalkboard-menu";
import { CameraRig } from "./camera-rig";
import { cameraViews, type ViewId } from "./camera-views";
import { Hotspot } from "./hotspot";

type CafeSceneProps = {
  view: ViewId;
  onSelect: (id: SectionId) => void;
  onReady: () => void;
};

/** Full-screen WebGL café. Hotspot labels only appear while the camera is in overview. */
export function CafeScene({ view, onSelect, onReady }: CafeSceneProps) {
  const interactive = view === "overview";

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: cameraViews.intro.position, fov: 40, near: 0.1, far: 100 }}
      onCreated={onReady}
      className="!fixed inset-0"
    >
      <color attach="background" args={["#1c130d"]} />
      <fog attach="fog" args={["#1c130d", 14, 30]} />

      <ambientLight intensity={0.55} color="#ffe9d1" />
      <hemisphereLight args={["#fff4e0", "#5b3a24", 0.5]} />
      <directionalLight
        castShadow
        position={[-6, 7, 4]}
        intensity={1.6}
        color="#fff1dc"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0005}
      />

      <CafeRoom />
      <CafeCounter position={[1.6, 0, -2.6]} />
      <CafeTable position={[-2.6, 0, 1.4]} />

      <Hotspot
        id="about"
        label={about.title}
        position={[1.9, COUNTER_TOP_Y, -2.6]}
        labelOffset={[0, 1.05, 0]}
        interactive={interactive}
        onSelect={onSelect}
      >
        <EspressoMachine />
      </Hotspot>

      <Hotspot
        id="projects"
        label={projects.title}
        position={[-2.2, 2.3, -3.96]}
        labelOffset={[0, 0.95, 0.1]}
        interactive={interactive}
        onSelect={onSelect}
      >
        <ChalkboardMenu />
      </Hotspot>

      <Hotspot
        id="contact"
        label={contact.title}
        position={[-2.6, TABLE_TOP_Y, 1.4]}
        labelOffset={[0, 0.7, 0]}
        interactive={interactive}
        onSelect={onSelect}
      >
        <TableItems />
      </Hotspot>

      <ContactShadows position={[0, 0.005, 0]} opacity={0.35} scale={12} blur={2.5} far={3} />
      <CameraRig view={view} />
    </Canvas>
  );
}
