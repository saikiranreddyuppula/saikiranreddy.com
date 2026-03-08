import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger);

const AboutScene = dynamic(() => import("./AboutScene"), { ssr: false });

const headlineWords = [
  { text: "I", accent: false },
  { text: "architect", accent: false },
  { text: "digital", accent: false },
  { text: "solutions", accent: false },
  { text: "that", accent: false },
  { text: "transform", accent: false },
  { text: "complexity", accent: true },
  { text: "into", accent: false },
  { text: "clarity.", accent: true },
];

const stats = [
  { value: 8, suffix: "+", label: "Years" },
  { value: 50, suffix: "+", label: "Projects" },
  { value: 12, suffix: "", label: "Industries" },
];

const tags = [
  "Systems Design",
  "Cloud Architecture",
  "Full-Stack",
  "DevOps",
  "AI/ML",
];

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (!containerRef.current || !headlineRef.current) return;

    const tl = gsap.timeline({ paused: true });
    const handleReveal = () => {
      containerRef.current!.style.visibility = "visible";
      tl.restart();
    };
    window.addEventListener("revealAbout", handleReveal);

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".about-word");
      const dividerLine = containerRef.current!.querySelector(".about-divider");
      const statEls = gsap.utils.toArray<HTMLElement>(".about-stat");
      const statNumbers = gsap.utils.toArray<HTMLElement>(".about-stat-number");
      const tagline = containerRef.current!.querySelector(".about-tagline");
      const tagEls = gsap.utils.toArray<HTMLElement>(".about-tag");
      const sectionLabel = containerRef.current!.querySelector(".about-label");

      // Fallback: if user lands mid-page (e.g. page refresh with scroll restored)
      if (window.scrollY > window.innerHeight * 0.5 && tl.progress() === 0) {
        containerRef.current!.style.visibility = "visible";
        tl.play();
      }

      // === PHASE 1: Label + headline words ===
      tl.fromTo(
        sectionLabel,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        0,
      );

      words.forEach((word, i) => {
        tl.fromTo(
          word,
          {
            scale: 3,
            opacity: 0,
            rotateX: 15,
            rotateZ: -3 + Math.random() * 6,
            clipPath: "inset(100% 0% 0% 0%)",
            filter: "blur(8px)",
          },
          {
            scale: 1,
            opacity: 1,
            rotateX: 0,
            rotateZ: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            filter: "blur(0px)",
            duration: 0.4,
            ease: "power3.out",
          },
          0.1 + i * 0.08,
        );
      });

      // === PHASE 2: Divider + stats ===
      tl.fromTo(
        dividerLine,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
        0.8,
      );

      statEls.forEach((stat, i) => {
        tl.fromTo(
          stat,
          {
            scale: 3,
            opacity: 0,
            filter: "blur(12px)",
          },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "back.out(1.4)",
          },
          1.0 + i * 0.15,
        );
      });

      statNumbers.forEach((numEl, i) => {
        const targetValue = Number(numEl.dataset.value);
        tl.fromTo(
          numEl,
          { textContent: "0" },
          {
            textContent: String(targetValue),
            snap: { textContent: 1 },
            duration: 0.8,
            ease: "power2.out",
          },
          1.1 + i * 0.15,
        );
      });

      // === PHASE 3: Tagline + tags ===
      tl.fromTo(
        tagline,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        1.5,
      );

      tagEls.forEach((tag, i) => {
        tl.fromTo(
          tag,
          {
            y: 30,
            opacity: 0,
            clipPath: "inset(100% 0% 0% 0%)",
          },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.4,
            ease: "power3.out",
          },
          1.7 + i * 0.1,
        );
      });
    }, containerRef);

    return () => {
      window.removeEventListener("revealAbout", handleReveal);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} id="about" className="about-section" style={{ visibility: "hidden" }}>
      <AboutScene scrollProgress={scrollProgress} />

      <div className="about-label">
        <span className="label-index">01</span>
        <span className="label-dash">&mdash;</span>
        <span className="label-text">ABOUT</span>
      </div>

      <div className="about-content">
        <h2 className="about-headline" ref={headlineRef}>
          {headlineWords.map((word, i) => (
            <span key={i} className="about-word-wrapper">
              <span
                className={`about-word ${word.accent ? "about-word--accent" : ""}`}
              >
                {word.text}
              </span>
            </span>
          ))}
        </h2>

        <div className="about-divider" />

        <div className="about-stats-row">
          {stats.map((stat, i) => (
            <div key={i} className="about-stat">
              <div className="about-stat-value">
                <span className="about-stat-number" data-value={stat.value}>
                  0
                </span>
                <span className="about-stat-suffix">{stat.suffix}</span>
              </div>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="about-bottom">
          <p className="about-tagline">
            Building scalable systems from early-stage startups to enterprise
            &mdash; across 12 industries and 50+ projects.
          </p>

          <div className="about-tags">
            {tags.map((tag, i) => (
              <span key={i} className="about-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-section {
          height: 100vh;
          position: relative;
          z-index: 2;
          background: #000;
          overflow: hidden;
        }

        .about-label {
          position: absolute;
          top: 3rem;
          left: 4rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          z-index: 10;
          opacity: 0;
        }

        .label-index {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #fff;
          letter-spacing: 0.1em;
        }

        .label-dash {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .label-text {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.5);
        }

        .about-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 4rem;
          perspective: 1000px;
        }

        .about-headline {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          line-height: 1.25;
          color: #fff;
          margin: 0 0 2.5rem;
          max-width: 900px;
        }

        .about-word-wrapper {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          margin-right: 0.25em;
          line-height: 1.3;
          perspective: 600px;
        }

        .about-word {
          display: inline-block;
          will-change: transform, opacity, clip-path, filter;
        }

        .about-word--accent {
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        .about-divider {
          width: min(500px, 60%);
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          margin-bottom: 3rem;
          transform-origin: center;
          transform: scaleX(0);
        }

        .about-stats-row {
          display: flex;
          justify-content: center;
          gap: clamp(3rem, 8vw, 8rem);
          margin-bottom: 3rem;
          will-change: transform;
        }

        .about-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0;
          will-change: transform, opacity, filter;
        }

        .about-stat-value {
          display: flex;
          align-items: baseline;
        }

        .about-stat-number {
          font-family: var(--font-display);
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .about-stat-suffix {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1;
        }

        .about-stat-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
        }

        .about-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          will-change: transform;
        }

        .about-tagline {
          font-family: var(--font-serif);
          font-size: clamp(0.95rem, 1.5vw, 1.15rem);
          font-style: italic;
          color: rgba(255, 255, 255, 0.45);
          max-width: 500px;
          line-height: 1.6;
          opacity: 0;
          margin: 0;
        }

        .about-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
        }

        .about-tag {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.6rem 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
          opacity: 0;
          will-change: transform, opacity, clip-path;
        }

        .about-tag:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        @media (max-width: 1024px) {
          .about-content {
            padding: 0 2.5rem;
          }

          .about-label {
            left: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .about-label {
            top: 2rem;
            left: 1.5rem;
          }

          .about-content {
            padding: 0 1.5rem;
          }

          .about-headline {
            font-size: clamp(1.8rem, 7vw, 2.5rem);
            margin-bottom: 2rem;
          }

          .about-stats-row {
            flex-direction: column;
            gap: 2rem;
          }

          .about-stat-number {
            font-size: 3rem;
          }

          .about-divider {
            width: 80%;
          }

          .about-tags {
            gap: 0.5rem;
          }

          .about-tag {
            font-size: 0.65rem;
            padding: 0.5rem 1rem;
          }
        }

        @media (pointer: coarse) {
          .about-tag:hover {
            background: transparent;
            color: rgba(255, 255, 255, 0.5);
            border-color: rgba(255, 255, 255, 0.15);
          }
        }
      `}</style>
    </section>
  );
};

export default About;
