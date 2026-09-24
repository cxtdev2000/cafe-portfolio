@AGENTS.md

## Project notes
- 3D café portfolio: Next.js App Router + React Three Fiber/drei + GSAP. pnpm only.
- All site copy lives in `src/content/portfolio.ts`; UI and hotspot labels read from it.
- Scene models are procedural (no asset files) in `src/components/scene/`; colors in `palette.ts`, mirrored as Tailwind tokens in `globals.css`.
- Camera views per section: `camera-views.ts`. Orbit limits are applied imperatively only after the overview tween finishes (`camera-rig.tsx`); passing them as OrbitControls props clamps close-up views.
