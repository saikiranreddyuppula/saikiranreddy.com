import { useEffect, useState, type RefObject } from "react";

/** Mount a WebGL canvas only while the host section is near the viewport. */
export const useCanvasGate = (
  ref: RefObject<HTMLElement | null>,
  rootMargin = "280px",
) => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setOn(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return on;
};
