import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const MANIFESTO =
  "I don\u2019t just write code \u2014 I build the systems that make everything else possible.";
const WORDS = MANIFESTO.split(" ");

const STATS = [
  { value: 8, suffix: "+", label: "Years of\nEngineering" },
  { value: 50, suffix: "+", label: "Projects\nShipped" },
  { value: 12, suffix: "", label: "Industries\nServed" },
];

const MARQUEE =
  "SYSTEMS \u00B7 ARCHITECTURE \u00B7 ENGINEERING \u00B7 SCALE \u00B7 PERFORMANCE \u00B7 INFRASTRUCTURE \u00B7 ";
const MARQUEE_ALT =
  "CLOUD \u00B7 MICROSERVICES \u00B7 DEVOPS \u00B7 AUTOMATION \u00B7 RESILIENCE \u00B7 OPTIMIZATION \u00B7 ";

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
      // ═══════════════════════════════════════════════
      // ENTRANCE ANIMATIONS (triggered by revealAbout)
      // ═══════════════════════════════════════════════
      entranceTl = gsap.timeline({ paused: true });

      entranceTl.fromTo(
        ".about-label",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" },
      );

      // ═══════════════════════════════════════════════
      // WORD-BY-WORD SCROLL REVEAL — the hero effect
      // ═══════════════════════════════════════════════
      const words = gsap.utils.toArray<HTMLElement>(".manifesto-word");
      gsap.set(words, { opacity: 0.08 });

      const manifestoTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".manifesto-pin",
          start: "top 15%",
          end: "+=250%",
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      // Each word brightens sequentially
      manifestoTl.to(
        words,
        {
          opacity: 1,
          stagger: { each: 0.06 },
          duration: 1,
          ease: "none",
        },
        0,
      );

      // Subtle cinematic zoom during reveal
      manifestoTl.fromTo(
        ".manifesto-text",
        { scale: 0.97 },
        { scale: 1, duration: 1, ease: "none" },
        0,
      );

      // Hold at end before unpin
      manifestoTl.to({}, { duration: 0.25 });

      // ═══════════════════════════════════════════════
      // MARQUEE — entrance on scroll
      // ═══════════════════════════════════════════════
      gsap.fromTo(
        ".marquee-strip",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".marquee-strip",
            start: "top 92%",
            toggleActions: "play none none none",
          },
        },
      );

      // ═══════════════════════════════════════════════
      // STATS — dramatic count-up with stagger
      // ═══════════════════════════════════════════════
      gsap.utils.toArray<HTMLElement>(".stat-col").forEach((col, i) => {
        gsap.fromTo(
          col,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".about-stats-grid",
              start: "top 82%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Stat vertical dividers draw in
      gsap.utils.toArray<HTMLElement>(".stat-divider").forEach((d, i) => {
        gsap.fromTo(
          d,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.8,
            delay: 0.1 + i * 0.12,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: ".about-stats-grid",
              start: "top 82%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Count-up numbers
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const target = Number(el.dataset.value);
        const suffix = el.dataset.suffix || "";
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(proxy.val) + suffix;
          },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      // ═══════════════════════════════════════════════
      // TAGLINE — blur reveal
      // ═══════════════════════════════════════════════
      gsap.fromTo(
        ".about-tagline",
        { y: 25, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-tagline",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
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
      <div className="about-container">
        {/* ── Label ── */}
        <div className="about-header">
          <div className="about-label">
            <span className="label-index">01</span>
            <span className="label-line" />
            <span className="label-text">About</span>
          </div>
        </div>

        {/* ── Pinned Manifesto — word-by-word scroll reveal ── */}
        <div className="manifesto-pin">
          <div className="manifesto-text">
            {WORDS.map((word, i) => (
              <span
                key={i}
                className={`manifesto-word${word === "systems" ? " accent-word" : ""}`}
              >
                {word}{" "}
              </span>
            ))}
          </div>
        </div>

        {/* ── Dual Marquee Strip ── */}
        <div className="marquee-strip">
          <div className="marquee-track marquee-forward">
            <span className="marquee-content marquee-bold">{MARQUEE.repeat(4)}</span>
            <span className="marquee-content marquee-bold" aria-hidden="true">
              {MARQUEE.repeat(4)}
            </span>
          </div>
          <div className="marquee-track marquee-reverse">
            <span className="marquee-content">{MARQUEE_ALT.repeat(4)}</span>
            <span className="marquee-content" aria-hidden="true">
              {MARQUEE_ALT.repeat(4)}
            </span>
          </div>
        </div>

        {/* ── Stats — oversized numbers with vertical dividers ── */}
        <div className="about-stats-grid">
          {STATS.map((stat, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="stat-divider" />}
              <div className="stat-col">
                <span
                  className="stat-value interactive"
                  data-value={stat.value}
                  data-suffix={stat.suffix}
                >
                  0
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ── Tagline — blur reveal ── */}
        <p className="about-tagline">
          I think in systems. Not frameworks &mdash;{" "}
          <em className="tagline-accent">systems.</em>
        </p>
      </div>

      <style jsx>{`
        /* ── Section ───────────────────────────────── */
        .about-section {
          position: relative;
          z-index: 2;
          background: #000;
          overflow: hidden;
        }

        .about-container {
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
          padding: 8rem 4rem;
        }

        /* ── Label ─────────────────────────────────── */
        .about-header {
          margin-bottom: 0;
        }

        .about-label {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          opacity: 0;
          margin-bottom: 2.5rem;
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

        /* ── Manifesto — pinned scroll zone ────────── */
        .manifesto-pin {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .manifesto-text {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(3.2rem, 7vw, 6rem);
          font-weight: 300;
          line-height: 1.25;
          color: #fff;
          max-width: 1000px;
          will-change: transform;
        }

        .manifesto-word {
          display: inline;
          opacity: 0.08;
        }

        .accent-word {
          font-style: italic;
        }

        /* ── Dual Marquee ──────────────────────────── */
        .marquee-strip {
          padding: 2.5rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          overflow: hidden;
          opacity: 0;
          margin: 0 -4rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .marquee-track {
          display: flex;
          width: max-content;
        }

        .marquee-forward {
          animation: marquee-left 50s linear infinite;
        }

        .marquee-reverse {
          animation: marquee-right 60s linear infinite;
        }

        .marquee-content {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.08);
          white-space: nowrap;
          padding: 0 0.5rem;
        }

        .marquee-bold {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: 1.6rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.06);
        }

        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        /* ── Stats — oversized numbers ─────────────── */
        .about-stats-grid {
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: 6rem 0;
        }

        .stat-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          opacity: 0;
        }

        .stat-value {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(4rem, 10vw, 8rem);
          font-weight: 300;
          color: #fff;
          line-height: 1;
          cursor: default;
          transition: text-shadow 0.4s ease;
        }

        .stat-value:hover {
          text-shadow:
            0 0 80px rgba(255, 255, 255, 0.2),
            0 0 160px rgba(255, 255, 255, 0.08);
        }

        .stat-label {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.2);
          text-align: center;
          white-space: pre-line;
          line-height: 1.8;
        }

        .stat-divider {
          width: 1px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255, 255, 255, 0.12),
            transparent
          );
          transform-origin: top center;
          margin: 1rem 0;
        }

        /* ── Tagline ───────────────────────────────── */
        .about-tagline {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(1.1rem, 1.8vw, 1.4rem);
          font-style: italic;
          color: rgba(255, 255, 255, 0.3);
          text-align: center;
          margin: 0;
          padding-bottom: 4rem;
          opacity: 0;
        }

        .tagline-accent {
          color: rgba(255, 255, 255, 0.6);
        }

        /* ── Responsive ────────────────────────────── */
        @media (max-width: 1024px) {
          .about-container {
            padding: 7rem 2.5rem;
          }
          .marquee-strip {
            margin: 0 -2.5rem;
          }
        }

        @media (max-width: 768px) {
          .about-container {
            padding: 5rem 1.5rem;
          }
          .marquee-strip {
            margin: 0 -1.5rem;
          }
          .manifesto-text {
            font-size: clamp(2.2rem, 8vw, 3.2rem);
          }
          .manifesto-pin {
            min-height: 80vh;
          }
          .about-stats-grid {
            flex-direction: column;
            gap: 3rem;
            padding: 4rem 0;
          }
          .stat-divider {
            width: 60px;
            height: 1px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.12),
              transparent
            );
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
