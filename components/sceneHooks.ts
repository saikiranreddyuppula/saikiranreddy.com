import { RefObject, useEffect, useState } from "react";

/** True while the element is in (or near) the viewport — used to pause offscreen canvases. */
export const useInViewport = (
  ref: RefObject<HTMLElement | null>,
  rootMargin = "200px 0px",
) => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
};

export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
};

// ── Scroll-progress math ─────────────────────────────

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Maps v from [a, b] onto [0, 1], clamped. */
export const range = (v: number, a: number, b: number) =>
  clamp01((v - a) / (b - a));

export const smoothstep = (a: number, b: number, v: number) => {
  const t = range(v, a, b);
  return t * t * (3 - 2 * t);
};

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
