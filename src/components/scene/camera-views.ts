import type { SectionId } from "@/content/portfolio";

type Vec3 = [number, number, number];

export type CameraView = {
  position: Vec3;
  target: Vec3;
  /** Center of the object a close-up is about; used to reframe it on portrait screens. */
  focus?: Vec3;
  /** Whether a bottom-sheet panel covers the lower screen on mobile (default true when focused). */
  sheet?: boolean;
};

/** Anything the camera can zoom to: a content section or the music TV. */
export type FocusId = SectionId | "tv";

export type ViewId = FocusId | "overview" | "intro";

// Camera framing for each section. Section views are shifted along the camera's right axis
// so the hotspot model sits left of center, leaving room for the content panel on the right.
export const cameraViews: Record<ViewId, CameraView> = {
  intro: { position: [14, 11, 16], target: [0, 1, 0] },
  overview: { position: [6.5, 5, 8], target: [-0.3, 1.1, -0.5] },
  about: { position: [3.3, 2.1, 0.3], target: [2.5, 1.45, -2.6], focus: [1.9, 1.45, -2.6] },
  projects: { position: [-1.3, 2.35, 0.7], target: [-1.3, 2.3, -3.9], focus: [-2.2, 2.3, -3.96] },
  shop: { position: [0.5, 2.05, 3.2], target: [-4.78, 1.4, 3.1], focus: [-4.78, 1.45, 3.7] },
  contact: { position: [0.66, 2.4, 3.27], target: [-2.14, 0.8, 0.87], focus: [-2.6, 0.9, 1.4] },
  tv: { position: [-3.3, 3.25, -2.3], target: [-4.52, 3.3, -3.52], focus: [-4.52, 3.3, -3.52], sheet: false },
};

// Portrait phones see a far narrower slice of the room at the desktop fov, so they get a wider
// lens and frames rebuilt from the desktop ones (see frameForAspect).
export const LANDSCAPE_FOV = 40;
export const PORTRAIT_FOV = 50;

const DESKTOP_ASPECT = 1.6;
const halfTan = (fov: number) => Math.tan((fov * Math.PI) / 360);

/** How far the overview camera pulls back on a portrait screen (1 on landscape screens). */
export function overviewPullBack(aspect: number) {
  return aspect >= 1 ? 1 : Math.min(2.2, (1.2 / aspect) ** 0.75);
}

/**
 * Desktop frames assume a wide screen with the content panel on the right. On portrait screens the
 * camera keeps the same viewing direction but backs off until the focused object fits the width, and
 * shifts down so the object sits in the strip above the bottom-sheet panel.
 */
export function frameForAspect(view: CameraView, aspect: number): CameraView {
  if (aspect >= 1) return view;
  const { position, target, focus, sheet = true } = view;
  if (!focus) {
    const pull = overviewPullBack(aspect);
    return { target, position: target.map((t, i) => t + (position[i] - t) * pull) as Vec3 };
  }
  const offset = position.map((p, i) => p - target[i]) as Vec3;
  const widen = (halfTan(LANDSCAPE_FOV) * DESKTOP_ASPECT) / (halfTan(PORTRAIT_FOV) * aspect);
  const scale = widen * (sheet ? 0.5 : 0.7);
  const distance = Math.hypot(...offset) * scale;
  const drop = sheet ? 0.42 * distance * halfTan(PORTRAIT_FOV) : 0;
  const lowered = (point: Vec3): Vec3 => [point[0], point[1] - drop, point[2]];
  return {
    target: lowered(focus),
    position: lowered(focus.map((f, i) => f + offset[i] * scale) as Vec3),
  };
}
