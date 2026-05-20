import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = "a, button, .interactive";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let raf = 0;
    let hasPointer = false;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { x: target.x, y: target.y };
    const ring = { x: target.x, y: target.y };

    const render = () => {
      dot.x += (target.x - dot.x) * 0.8;
      dot.y += (target.y - dot.y) * 0.8;
      ring.x += (target.x - ring.x) * 0.22;
      ring.y += (target.y - ring.y) * 0.22;

      cursor.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      follower.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;

      if (
        Math.abs(target.x - ring.x) < 0.1 &&
        Math.abs(target.y - ring.y) < 0.1
      ) {
        raf = 0;
        return;
      }

      raf = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      if (!hasPointer) {
        hasPointer = true;
        cursor.classList.add("is-visible");
        follower.classList.add("is-visible");
      }

      start();
    };

    const setHovered = (hovered: boolean) => {
      cursor.classList.toggle("is-hovered", hovered);
      follower.classList.toggle("is-hovered", hovered);
    };

    const onPointerOver = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest(INTERACTIVE_SELECTOR)) {
        setHovered(true);
      }
    };

    const onPointerOut = (event: PointerEvent) => {
      const targetEl = (event.target as Element | null)?.closest(
        INTERACTIVE_SELECTOR,
      );
      if (!targetEl) return;

      const relatedEl = event.relatedTarget as Element | null;
      if (!relatedEl || !targetEl.contains(relatedEl)) {
        setHovered(false);
      }
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={followerRef} className="cursor-follower" />
      <div ref={cursorRef} className="cursor-dot" />

      <style jsx global>{`
        @media (pointer: fine) {
          body {
            cursor: none;
          }

          a,
          button,
          .interactive {
            cursor: none;
          }
        }

        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          mix-blend-mode: difference;
          opacity: 0;
          transition: opacity 0.18s ease, scale 0.25s ease;
          will-change: transform;
        }

        .cursor-follower {
          position: fixed;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          opacity: 0;
          transition: opacity 0.18s ease, scale 0.3s ease,
            background-color 0.3s, border-color 0.3s;
          will-change: transform;
        }

        .cursor-dot.is-visible {
          opacity: 0.85;
        }

        .cursor-follower.is-visible {
          opacity: 0.72;
        }

        .cursor-dot.is-hovered {
          scale: 0;
        }

        .cursor-follower.is-hovered {
          scale: 2;
          border-color: rgba(255, 255, 255, 0.55);
          background-color: rgba(255, 255, 255, 0.035);
        }

        @media (pointer: coarse), (max-width: 768px) {
          .cursor-dot,
          .cursor-follower {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
