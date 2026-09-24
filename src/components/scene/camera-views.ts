import type { SectionId } from "@/content/portfolio";

export type CameraView = {
  position: [number, number, number];
  target: [number, number, number];
};

export type ViewId = SectionId | "overview" | "intro";

// Camera framing for each section. Section views are shifted along the camera's right axis
// so the hotspot model sits left of center, leaving room for the content panel on the right.
export const cameraViews: Record<ViewId, CameraView> = {
  intro: { position: [14, 11, 16], target: [0, 1, 0] },
  overview: { position: [6.5, 5, 8], target: [-0.3, 1.1, -0.5] },
  about: { position: [3.3, 2.1, 0.3], target: [2.5, 1.45, -2.6] },
  projects: { position: [-1.3, 2.35, 0.7], target: [-1.3, 2.3, -3.9] },
  contact: { position: [0.66, 2.4, 3.27], target: [-2.14, 0.8, 0.87] },
};
