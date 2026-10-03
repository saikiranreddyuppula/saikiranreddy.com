import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { BLOCK_COUNT, MONOLITH_PHASES, RING_COUNT } from "./sceneTimeline";
import { range, useInViewport, usePrefersReducedMotion } from "./sceneHooks";

gsap.registerPlugin(ScrollTrigger);

const MonolithScene = dynamic(() => import("./MonolithScene"), { ssr: false });

const pad2 = (n: number) => String(n).padStart(2, "0");

const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLSpanElement>(null);
  const yearsRef = useRef<HTMLSpanElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  const inView = useInViewport(containerRef);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    let entranceTl: gsap.core.Timeline;

    const handleReveal = () => {
      containerRef.current!.style.visibility = "visible";
      entranceTl?.play();
      gsap.delayedCall(0.2, () => ScrollTrigger.refresh());
    };
    window.addEventListener("revealAbout", handleReveal);

    // Fallback: if user lands mid-page
    if (window.scrollY > window.innerHeight * 0.5) {
      containerRef.current.style.visibility = "visible";
      gsap.delayedCall(0.1, () => {
        entranceTl?.play();
        ScrollTrigger.refresh();
      });
    }

    const ctx = gsap.context(() => {
      entranceTl = gsap.timeline({ paused: true });
      entranceTl.fromTo(
        ".about-chrome",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" },
      );

      // ═══════════════════════════════════════════════
      // PINNED STAGE — scroll drives the monolith scene
      // ═══════════════════════════════════════════════
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            progress.current = p;

            if (projectsRef.current) {
              const n = range(p, ...MONOLITH_PHASES.orbit) * BLOCK_COUNT;
              projectsRef.current.textContent = pad2(Math.round(n));
            }
            if (yearsRef.current) {
              const n = range(p, ...MONOLITH_PHASES.rings) * RING_COUNT;
              yearsRef.current.textContent = pad2(Math.round(n));
            }
            if (progressLineRef.current) {
              progressLineRef.current.style.transform = `scaleX(${p})`;
            }
          },
        },
      });

      // Captions — one at a time, timed to the scene's phases (0..1)
      const caption = (sel: string, inAt: number, outAt?: number) => {
        tl.fromTo(
          sel,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.05 },
          inAt,
        );
        if (outAt !== undefined) {
          tl.to(sel, { opacity: 0, y: -24, duration: 0.04 }, outAt);
        }
      };
      tl.to(".cap-name", { opacity: 0, y: -24, duration: 0.04 }, 0.11);
      caption(".cap-projects", 0.17, 0.44);
      caption(".cap-years", 0.57, 0.84);
      caption(".cap-final", 0.89);
      tl.fromTo(".about-hint", { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.2);
      tl.to({}, { duration: 0 }, 1); // timeline spans exactly 0..1
    }, containerRef);

    return () => {
      window.removeEventListener("revealAbout", handleReveal);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="about-section"
      style={{ visibility: "hidden" }}
    >
      {/* Full text for screen readers and search engines */}
      <div className="sr-only">
        <h2>About</h2>
        <p>
          I don&rsquo;t just write code &mdash; I build the systems that make
          everything else possible.
        </p>
        <ul>
          <li>8+ years of engineering</li>
          <li>50+ projects shipped</li>
          <li>12 industries served</li>
        </ul>
        <p>I think in systems. Not frameworks &mdash; systems.</p>
      </div>

      <div ref={stageRef} className="about-stage" aria-hidden="true">
        <div className="about-canvas">
          <MonolithScene progress={progress} active={inView} reduced={reduced} />
        </div>

        <div className="about-chrome">
          <div className="about-label">
            <span className="label-index">01</span>
            <span className="label-line" />
            <span className="label-text">About</span>
          </div>

          <div className="about-captions">
            <div className="cap cap-name">
              <span className="cap-title">Sai Kiran Reddy</span>
              <span className="cap-sub">Solution Architect &amp; Engineer</span>
            </div>
            <div className="cap cap-projects">
              <span ref={projectsRef} className="cap-number">
                00
              </span>
              <span className="cap-sub">Projects shipped</span>
            </div>
            <div className="cap cap-years">
              <span ref={yearsRef} className="cap-number">
                00
              </span>
              <span className="cap-sub">Years of engineering</span>
            </div>
            <div className="cap cap-final">
              <span className="cap-title cap-italic">I think in systems.</span>
            </div>
          </div>

          <div className="about-hint">
            <span className="hint-fine">Click the blocks</span>
            <span className="hint-coarse">Tap the blocks</span>
          </div>

          <div className="about-progress">
            <div ref={progressLineRef} className="about-progress-fill" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-section {
          position: relative;
          z-index: 2;
          background: #000;
        }

        .about-stage {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #000;
        }

        .about-canvas {
          position: absolute;
          inset: 0;
        }

        .about-chrome {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
        }

        /* ── Label ─────────────────────────────────── */
        .about-label {
          position: absolute;
          top: 3rem;
          left: 4rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .label-index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #fff;
          letter-spacing: 0.1em;
        }

        .label-line {
          width: 40px;
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
        }

        .label-text {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ── Captions — one small line per scene ───── */
        .about-captions {
          position: absolute;
          left: 4rem;
          bottom: 4.5rem;
        }

        .cap {
          position: absolute;
          left: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          white-space: nowrap;
          opacity: 0;
        }

        .cap-name {
          opacity: 1;
        }

        .cap-title {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(1.6rem, 2.6vw, 2.4rem);
          font-weight: 300;
          color: #fff;
          line-height: 1;
        }

        .cap-italic {
          font-style: italic;
        }

        .cap-number {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 300;
          color: #fff;
          line-height: 0.9;
          font-variant-numeric: tabular-nums;
        }

        .cap-sub {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        /* ── Hint ──────────────────────────────────── */
        .about-hint {
          position: absolute;
          right: 5rem;
          bottom: 4.5rem;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          opacity: 0;
        }

        .hint-coarse {
          display: none;
        }

        @media (pointer: coarse) {
          .hint-fine {
            display: none;
          }
          .hint-coarse {
            display: inline;
          }
        }

        /* ── Progress ──────────────────────────────── */
        .about-progress {
          position: absolute;
          left: 4rem;
          right: 5rem;
          bottom: 2.5rem;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
        }

        .about-progress-fill {
          height: 100%;
          background: rgba(255, 255, 255, 0.35);
          transform: scaleX(0);
          transform-origin: left center;
        }

        @media (max-width: 768px) {
          .about-label {
            top: 2rem;
            left: 1.5rem;
          }
          .about-captions {
            left: 1.5rem;
            bottom: 5.5rem;
          }
          .about-hint {
            left: 1.5rem;
            right: auto;
            bottom: 3.5rem;
          }
          .about-progress {
            left: 1.5rem;
            right: 3rem;
            bottom: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
