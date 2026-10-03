import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
// @ts-ignore
import { useLenis } from "lenis/react";
import { galleryPosition, progressForIndex } from "./sceneTimeline";
import { useInViewport, usePrefersReducedMotion } from "./sceneHooks";

gsap.registerPlugin(ScrollTrigger);

const GalleryScene = dynamic(() => import("./GalleryScene"), { ssr: false });

const industries = [
  {
    name: "Ecommerce",
    description:
      "Scalable platforms that handle millions of transactions with real-time inventory, dynamic pricing, and seamless checkout experiences.",
    tags: ["Payments", "Inventory", "Microservices"],
  },
  {
    name: "Cyber Security",
    description:
      "Zero-trust architectures and threat detection systems that protect critical infrastructure at scale.",
    tags: ["Zero Trust", "Threat Detection", "Compliance"],
  },
  {
    name: "Healthcare",
    description:
      "HIPAA-compliant systems for patient data management, telemedicine platforms, and clinical workflow automation.",
    tags: ["HIPAA", "EHR Systems", "Telemedicine"],
  },
  {
    name: "Hospitality",
    description:
      "Real-time booking engines, guest experience platforms, and operational systems that delight at every touchpoint.",
    tags: ["Booking Engines", "Guest Experience", "PMS"],
  },
  {
    name: "Generative AI",
    description:
      "ML pipelines, intelligent automation systems, and AI-driven products from prototype to production at scale.",
    tags: ["ML Pipelines", "NLP", "Computer Vision"],
  },
  {
    name: "Manufacturing",
    description:
      "IoT integration, supply chain optimization, and predictive maintenance systems for smart factories.",
    tags: ["IoT", "Supply Chain", "Predictive Maintenance"],
  },
];

const COUNT = industries.length;
const pad2 = (n: number) => String(n).padStart(2, "0");

const Industries = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const progress = useRef(0);
  const focusedRef = useRef(0);
  const [focused, setFocused] = useState(0);
  const [exploded, setExploded] = useState(false);

  const inView = useInViewport(sectionRef);
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Pinned stage: vertical scroll trucks the camera along the gallery
      triggerRef.current = ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top top",
        end: `+=${(COUNT - 1) * 90 + 60}%`,
        pin: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          const idx = Math.round(galleryPosition(self.progress, COUNT));
          if (idx !== focusedRef.current) {
            focusedRef.current = idx;
            setFocused(idx);
          }
        },
      });

      gsap.fromTo(
        ".gal-chrome",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Moving on to another piece puts the previous one back together
  useEffect(() => {
    setExploded(false);
  }, [focused]);

  const goTo = useCallback(
    (i: number) => {
      const st = triggerRef.current;
      if (!st) return;
      const y = st.start + progressForIndex(i, COUNT) * (st.end - st.start);
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    },
    [lenis],
  );

  const toggle = useCallback(() => setExploded((e) => !e), []);

  const current = industries[focused];

  return (
    <section ref={sectionRef} id="industries" className="ind-section">
      {/* Full text for screen readers and search engines */}
      <div className="sr-only">
        <h2>Industries</h2>
        <p>From startups to enterprise, I architect solutions that scale.</p>
        <ul>
          {industries.map((ind) => (
            <li key={ind.name}>
              <h3>{ind.name}</h3>
              <p>{ind.description}</p>
              <p>{ind.tags.join(", ")}</p>
            </li>
          ))}
        </ul>
      </div>

      <div ref={stageRef} className="gal-stage">
        <div className="gal-canvas" onClick={toggle} aria-hidden="true">
          <GalleryScene
            progress={progress}
            active={inView}
            reduced={reduced}
            focusedIndex={focused}
            exploded={exploded}
            items={industries}
          />
        </div>

        <div className="gal-chrome">
          <div className="gal-label" aria-hidden="true">
            <span className="gal-label-index">02</span>
            <span className="gal-label-line" />
            <span className="gal-label-text">Industries</span>
          </div>

          <div className="gal-caption">
            <span className="gal-index" aria-hidden="true">
              {pad2(focused + 1)} / {pad2(COUNT)}
            </span>
            <span key={focused} className="gal-name" aria-live="polite">
              {current.name}
            </span>
            <button
              type="button"
              className="gal-hint interactive"
              onClick={toggle}
              aria-pressed={exploded}
            >
              <span className="hint-fine">
                {exploded ? "Click to reassemble" : "Click to take apart"}
              </span>
              <span className="hint-coarse">
                {exploded ? "Tap to reassemble" : "Tap to take apart"}
              </span>
            </button>
          </div>

          <div className="gal-pips" role="tablist" aria-label="Industries">
            {industries.map((ind, i) => (
              <button
                key={ind.name}
                type="button"
                role="tab"
                aria-selected={i === focused}
                aria-label={ind.name}
                className={`gal-pip interactive${i === focused ? " is-active" : ""}`}
                onClick={() => goTo(i)}
              >
                <span className="gal-pip-dot" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ind-section {
          position: relative;
          z-index: 1;
          background: #000;
        }

        .gal-stage {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #000;
        }

        .gal-canvas {
          position: absolute;
          inset: 0;
        }

        .gal-chrome {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
        }

        /* ── Label ── */
        .gal-label {
          position: absolute;
          top: 3rem;
          left: 4rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .gal-label-index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #fff;
          letter-spacing: 0.1em;
        }

        .gal-label-line {
          width: 40px;
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
        }

        .gal-label-text {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ── Caption: one small word per piece ── */
        .gal-caption {
          position: absolute;
          left: 50%;
          bottom: 5.5rem;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.7rem;
          text-align: center;
        }

        .gal-index {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: rgba(255, 255, 255, 0.35);
        }

        .gal-name {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(1.5rem, 2.4vw, 2.1rem);
          font-weight: 300;
          color: #fff;
          line-height: 1;
          white-space: nowrap;
          animation: gal-name-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes gal-name-in {
          from {
            opacity: 0;
            transform: translateY(10px);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: none;
            filter: blur(0);
          }
        }

        .gal-hint {
          pointer-events: auto;
          background: none;
          border: none;
          padding: 0.4rem 0.6rem;
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          cursor: none;
          transition: color 0.3s ease;
        }

        .gal-hint:hover,
        .gal-hint:focus-visible {
          color: rgba(255, 255, 255, 0.75);
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

        /* ── Pips ── */
        .gal-pips {
          position: absolute;
          left: 50%;
          bottom: 2.5rem;
          transform: translateX(-50%);
          display: flex;
          gap: 0.4rem;
          pointer-events: auto;
        }

        .gal-pip {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          padding: 0;
          cursor: none;
        }

        .gal-pip-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          transition:
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            background 0.3s ease;
        }

        .gal-pip:hover .gal-pip-dot {
          background: rgba(255, 255, 255, 0.6);
        }

        .gal-pip.is-active .gal-pip-dot {
          background: #fff;
          transform: scale(1.6);
        }

        /* ── Part labels (rendered by drei <Html> inside the canvas) ── */
        .gal-tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          white-space: nowrap;
          color: rgba(255, 255, 255, 0.85);
          padding: 0.35rem 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 100px;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          opacity: 0;
          transform: translateY(6px);
          transition:
            opacity 0.35s ease,
            transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gal-tag.is-visible {
          opacity: 1;
          transform: none;
          transition-delay: 0.25s;
        }

        @media (max-width: 768px) {
          .gal-label {
            top: 2rem;
            left: 1.5rem;
          }
          .gal-caption {
            bottom: 5rem;
          }
          .gal-tag {
            font-size: 0.5rem;
            padding: 0.3rem 0.6rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Industries;
