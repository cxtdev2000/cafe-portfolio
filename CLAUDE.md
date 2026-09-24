@AGENTS.md

## Project notes
- 3D café portfolio: Next.js App Router + React Three Fiber/drei + GSAP. pnpm only.
- All site copy lives in `src/content/portfolio.ts`; UI and hotspot labels read from it.
- Scene models are procedural (no asset files) in `src/components/scene/`; colors in `palette.ts`, mirrored as Tailwind tokens in `globals.css`.
- Labels, menu, screens and posters are canvas textures (`canvas-texture.ts` + `textures.ts`). Draw functions must be module-level constants so `useCanvasTexture` stays stable.
- Glow: emissive parts use `meshBasicMaterial` with `color` > 1 and `toneMapped={false}` so Bloom picks them up. `<ToneMapping>` must stay the last effect in `EffectComposer` (the renderer's tone mapping is skipped when rendering into the composer).
- Reflections come from a local `<Environment>` of `<Lightformer>`s — no remote HDR files.
- Camera views per section: `camera-views.ts`. Orbit limits are applied imperatively only after the overview tween finishes (`camera-rig.tsx`); passing them as OrbitControls props clamps close-up views.
- Background music: `music/youtube-music.ts` is a module-level store (works across the Canvas and Html React roots) around one YouTube IFrame player, mounted on the in-scene TV via drei `<Html transform>` with `pointerEvents="none"` so clicks reach the TV hotspot. It uses `occlude="blending"` + `zIndexRange={[0, 0]}` so it sits behind the canvas (lifted by `.scene-canvas` in `globals.css`) and props in front hide it; other `<Html>` overlays need `zIndexRange` ≥ 10 to stay above the canvas. Start playback inside the intro button click (autoplay policy). The TV is a camera focus (`FocusId = SectionId | "tv"`) with no content panel.
- Portrait phones: `frameForAspect` in `camera-views.ts` rebuilds desktop frames (wider fov, backs off to fit `focus`, drops it above the bottom sheet). Views with no `focus` get the capped overview pull-back; `sheet: false` for views without a content panel (TV).
- Clickable props ("pokes"): wrap in `Pokeable` from `scene/pokeable.tsx` and drive animation in `useFrame` from `usePoke()` + `secondsSince()`. Pokes are only enabled in overview through `PokeProvider`, and clicks with drag `delta` > 6px are ignored so orbiting doesn't trigger them.
