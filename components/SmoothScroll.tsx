// @ts-ignore
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef, useLayoutEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  SCROLL_STEP,
  SCROLL_COOLDOWN,
  SCROLL_LERP,
  SCROLL_DURATION,
} from "../constants";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

// Component to handle ScrollTrigger updates
const ScrollTriggerUpdater = () => {
  useLenis(() => {
    ScrollTrigger.update();
  });

  return null;
};

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<any>(null);
  const lastScrollTimeRef = useRef(0);

  useLayoutEffect(() => {
    // Sync GSAP ticker with Lenis
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after a short delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      gsap.ticker.remove(update);
      clearTimeout(timeout);
    };
  }, []);

  // Keyboard scroll normalization
  useEffect(() => {
    const SCROLL_KEYS: Record<string, number> = {
      ArrowDown: 1,
      ArrowUp: -1,
      PageDown: 1,
      PageUp: -1,
      " ": 1,
      End: 1,
      Home: -1,
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const direction = SCROLL_KEYS[e.key];
      if (direction === undefined) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTimeRef.current < SCROLL_COOLDOWN) return;
      lastScrollTimeRef.current = now;

      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;
      lenis.scrollTo(lenis.targetScroll + direction * SCROLL_STEP, {
        programmatic: false,
        lerp: SCROLL_LERP,
        duration: SCROLL_DURATION,
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lenis options with virtualScroll callback that intercepts and normalizes
  // wheel events. Returning false from this function prevents Lenis from
  // processing the scroll, so we handle it ourselves with a fixed delta.
  const lenisOptions = useMemo(
    () => ({
      lerp: SCROLL_LERP,
      duration: SCROLL_DURATION,
      smoothWheel: true,
      syncTouch: true,
      autoRaf: false,
      virtualScroll: (data: {
        deltaX: number;
        deltaY: number;
        event: WheelEvent | TouchEvent;
      }) => {
        const { event, deltaY } = data;

        // Let touch events through to Lenis normally
        if (!event.type.includes("wheel")) return true;

        // Prevent native browser scroll
        if (event.cancelable) event.preventDefault();

        // Throttle: skip if within cooldown window
        const now = Date.now();
        if (now - lastScrollTimeRef.current < SCROLL_COOLDOWN) return false;
        lastScrollTimeRef.current = now;

        const direction = Math.sign(deltaY);
        if (direction === 0) return false;

        // Scroll by fixed amount instead of raw delta
        const lenis = lenisRef.current?.lenis;
        if (lenis) {
          lenis.scrollTo(lenis.targetScroll + direction * SCROLL_STEP, {
            programmatic: false,
            lerp: SCROLL_LERP,
            duration: SCROLL_DURATION,
          });
        }

        return false; // Block Lenis default wheel handling
      },
    }),
    []
  );

  return (
    <ReactLenis ref={lenisRef} root options={lenisOptions}>
      <ScrollTriggerUpdater />
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
