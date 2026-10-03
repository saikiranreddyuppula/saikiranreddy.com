import { clamp01, smoothstep } from "./sceneHooks";

/*
 * Scroll choreography shared by the DOM sections and their WebGL scenes.
 * Kept free of three.js so the sections can import it without pulling the
 * scenes (which load lazily, client-side only) into the main bundle.
 */

// ── About: the monolith ─────────────────────────────

export const BLOCK_COUNT = 50; // one block per project shipped
export const RING_COUNT = 8; // one ring per year of engineering

/** Scroll windows (0..1 of the pinned About stage). */
export const MONOLITH_PHASES = {
  crack: [0.06, 0.18], // seams open, light leaks out
  orbit: [0.14, 0.38], // blocks fly out and orbit the core
  tower: [0.46, 0.72], // blocks rebuild bottom-up into a twisted tower
  rings: [0.64, 0.86], // rings light up, one per year
} as const;

// ── Industries: the dark gallery ────────────────────

const GALLERY_PAD = 0.04;

/**
 * Scroll progress → continuous gallery position (0..count-1). Movement
 * between sculptures happens in the middle of each segment, so the camera
 * dwells on every piece like a snap — without fighting the smooth scroller.
 */
export const galleryPosition = (p: number, count: number) => {
  const s = clamp01((p - GALLERY_PAD) / (1 - 2 * GALLERY_PAD)) * (count - 1);
  const i = Math.min(Math.floor(s), count - 2);
  return i + smoothstep(0.2, 0.8, s - i);
};

/** Scroll progress at which sculpture `i` is centred. */
export const progressForIndex = (i: number, count: number) =>
  GALLERY_PAD + (i / (count - 1)) * (1 - 2 * GALLERY_PAD);
