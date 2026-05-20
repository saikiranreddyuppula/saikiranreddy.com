// @ts-ignore
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef, useLayoutEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SCROLL_LERP, SCROLL_DURATION } from "../constants";

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

      const lenis = lenisRef.current?.lenis;
      const viewportStep = Math.round(window.innerHeight * 0.82);
      const target =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? document.documentElement.scrollHeight
            : window.scrollY + direction * viewportStep;

      if (lenis) {
        lenis.scrollTo(target, {
          force: true,
          duration: SCROLL_DURATION,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
        return;
      }

      window.scrollTo({
        top: target,
        behavior: "smooth",
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const scrollToSection = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string; immediate?: boolean }>).detail;
      const id = detail?.id;
      if (!id) return;

      const target = id === "hero" ? null : document.getElementById(id);
      if (id !== "hero" && !target) return;

      ScrollTrigger.refresh();

      window.requestAnimationFrame(() => {
        const lenis = lenisRef.current?.lenis;
        const top =
          id === "hero"
            ? 0
            : Math.max(0, window.scrollY + target!.getBoundingClientRect().top);

        if (lenis) {
          lenis.scrollTo(top, {
            immediate: Boolean(detail?.immediate),
            force: true,
            duration: detail?.immediate ? undefined : 1,
            easing: (t: number) => 1 - Math.pow(1 - t, 4),
          });
          return;
        }

        window.scrollTo({
          top,
          behavior: detail?.immediate ? "instant" as ScrollBehavior : "smooth",
        });
      });
    };

    window.addEventListener("portfolio:scroll-to", scrollToSection);
    return () => window.removeEventListener("portfolio:scroll-to", scrollToSection);
  }, []);

  const lenisOptions = useMemo(
    () => ({
      lerp: SCROLL_LERP,
      duration: SCROLL_DURATION,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.2,
      syncTouch: false,
      autoRaf: false,
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
