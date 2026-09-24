"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { about, contact, projects, shop } from "@/content/portfolio";
import { CafeRoom } from "./cafe-room";
import { CafeCounter, COUNTER_TOP_Y, EspressoMachine } from "./cafe-counter";
import { CafeTable, TABLE_TOP_Y, TableItems } from "./cafe-table";
import { ChalkboardMenu } from "./chalkboard-menu";
import { BackBar } from "./back-bar";
import { LoungeCorner } from "./lounge-corner";
import { WallTv } from "./wall-tv";
import { CameraRig } from "./camera-rig";
import { cameraViews, type FocusId, type ViewId } from "./camera-views";
import { Hotspot } from "./hotspot";
import { PokeProvider } from "./pokeable";
import { ShopShelf } from "./shop-shelf";

type CafeSceneProps = {
  view: ViewId;
  onSelect: (id: FocusId) => void;
  onReady: () => void;
};

/** Full-screen WebGL café. Hotspot labels only appear while the camera is in overview. */
export function CafeScene({ view, onSelect, onReady }: CafeSceneProps) {
  const interactive = view === "overview";
  // Phones render at up to 1.5x and fall back to 1x if the frame rate drops.
  const [dpr, setDpr] = useState(1.5);
  const [touch] = useState(() => window.matchMedia("(pointer: coarse)").matches);

  return (
    <Canvas
      shadows
      dpr={[1, dpr]}
      camera={{ position: cameraViews.intro.position, fov: 40, near: 0.1, far: 100 }}
      onCreated={onReady}
      className="scene-canvas !fixed inset-0"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <color attach="background" args={["#1c130d"]} />
      <fog attach="fog" args={["#1c130d", 14, 30]} />

      {/* Warm evening light: soft fill plus a low key light through the window side */}
      <ambientLight intensity={0.55} color="#ffe2c0" />
      <hemisphereLight args={["#ffe8c8", "#4a2e1c", 0.7]} />
      <directionalLight
        castShadow
        position={[-6, 7, 4]}
        intensity={1.8}
        color="#ffe0b8"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0005}
      />
      {/* Local studio environment so chrome, marble and glass have something to reflect */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={1.6} color="#ffd9a0" position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#bfe0ff" position={[-6, 2, 1]} rotation={[0, Math.PI / 2, 0]} scale={[3, 2, 1]} />
        <Lightformer form="ring" intensity={2} color="#ff7aa8" position={[2, 3.6, -5]} scale={1.5} />
        <Lightformer form="rect" intensity={0.8} color="#ffe2c0" position={[6, 2, 4]} rotation={[0, -Math.PI / 2, 0]} scale={[4, 3, 1]} />
      </Environment>

      <PokeProvider value={interactive}>
      <CafeRoom />
      <BackBar position={[2.5, 0, -3.99]} />
      <CafeCounter position={[1.6, 0, -2.6]} />
      <CafeTable position={[-2.6, 0, 1.4]} />
      <LoungeCorner position={[3.1, 0, 0.95]} rotationY={-0.5} />
      <Hotspot
        id="tv"
        label="Nghe nhạc"
        position={[-4.52, 3.3, -3.52]}
        labelOffset={[0, 0.6, 0]}
        interactive={interactive}
        onSelect={onSelect}
      >
        <WallTv position={[0, 0, 0]} rotationY={Math.PI / 4} focused={view === "tv"} />
      </Hotspot>

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

      <Hotspot
        id="shop"
        label={shop.title}
        position={[-4.78, 0, 3.7]}
        labelOffset={[0, 2.95, 0]}
        interactive={interactive}
        onSelect={onSelect}
      >
        <group rotation={[0, Math.PI / 2, 0]}>
          <ShopShelf />
        </group>
      </Hotspot>
      </PokeProvider>

      {/* Dust motes drifting in the lamp light */}
      <Sparkles count={touch ? 30 : 60} scale={[9, 3.5, 7]} position={[0, 2.2, 0]} size={2} speed={0.25} opacity={0.5} color="#ffd9a0" />

      <ContactShadows position={[0, 0.005, 0]} opacity={0.35} scale={12} blur={2.5} far={3} />
      <CameraRig view={view} />

      {/* Emissive parts use color > 1 with toneMapped={false}; tone mapping runs last in the composer */}
      <EffectComposer multisampling={touch ? 0 : 4}>
        <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.8} />
        <Vignette offset={0.3} darkness={0.45} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}
