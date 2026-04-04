import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 8, suffix: "+", label: "Years of engineering" },
  { value: 50, suffix: "+", label: "Projects shipped" },
  { value: 12, suffix: "", label: "Industries served" },
];

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ paused: true });
    const handleReveal = () => {
      containerRef.current!.style.visibility = "visible";
      tl.restart();
    };
    window.addEventListener("revealAbout", handleReveal);

    // Fallback: if user lands mid-page
    if (window.scrollY > window.innerHeight * 0.5 && tl.progress() === 0) {
      containerRef.current.style.visibility = "visible";
      tl.play();
    }

    // Mouse tracking for parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Smooth parallax loop
    const smoothMouse = { x: 0, y: 0 };
    const statementEl = containerRef.current.querySelector(".about-statement") as HTMLElement;
    let rafId: number;

    const parallaxLoop = () => {
      smoothMouse.x += (mouseRef.current.x - smoothMouse.x) * 0.08;
      smoothMouse.y += (mouseRef.current.y - smoothMouse.y) * 0.08;
      if (statementEl) {
        statementEl.style.transform = `translate(${smoothMouse.x * 8}px, ${smoothMouse.y * 5}px)`;
      }
      rafId = requestAnimationFrame(parallaxLoop);
    };
    rafId = requestAnimationFrame(parallaxLoop);

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".statement-line");
      const sectionLabel = containerRef.current!.querySelector(".about-label");
      const accentWord = containerRef.current!.querySelector(".accent-word");

      // ═══════════════════════════════════════════════
      // ENTRANCE ANIMATIONS (triggered by revealAbout)
      // ═══════════════════════════════════════════════

      // Label
      tl.fromTo(
        sectionLabel,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" },
        0,
      );

      // Statement lines — clip reveal
      lines.forEach((line, i) => {
        tl.fromTo(
          line,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            y: 20,
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          0.1 + i * 0.1,
        );
      });

      // Accent word glow
      if (accentWord) {
        tl.to(
          accentWord,
          {
            textShadow: "0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.1)",
            duration: 1.2,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          },
          0.5,
        );
      }

      // ═══════════════════════════════════════════════
      // SCROLL-DRIVEN ANIMATIONS
      // ═══════════════════════════════════════════════

      // Statement parallax on scroll
      const heroZone = containerRef.current!.querySelector(".about-hero");
      if (heroZone) {
        gsap.to(".about-statement", {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: heroZone,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Divider line draws in
      gsap.fromTo(
        ".about-divider",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".about-lower",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Stat rows stagger in
      const statRows = gsap.utils.toArray<HTMLElement>(".about-stat-row");
      statRows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: ".about-lower",
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Stat rule lines draw in
      const ruleLines = gsap.utils.toArray<HTMLElement>(".stat-rule");
      ruleLines.forEach((rule, i) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            delay: 0.1 + i * 0.05,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: ".about-lower",
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Stat count-ups
      const inlineStats = gsap.utils.toArray<HTMLElement>(".stat-value");
      inlineStats.forEach((el) => {
        const target = Number(el.dataset.value);
        const suffix = el.dataset.suffix || "";
        const proxy = { val: 0 };

        gsap.to(proxy, {
          val: target,
          duration: 0.7,
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

      // Philosophy tagline
      gsap.fromTo(
        ".about-tagline",
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-tagline",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

    }, containerRef);

    return () => {
      window.removeEventListener("revealAbout", handleReveal);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} id="about" className="about-section" style={{ visibility: "hidden" }}>
      <div className="about-container">
        {/* Header — matches Industries/Contact label pattern */}
        <div className="about-header">
          <div className="about-label">
            <span className="label-index">01</span>
            <span className="label-line" />
            <span className="label-text">About</span>
          </div>
        </div>

        {/* Statement — full viewport with mouse parallax */}
        <div className="about-hero">
          <div className="about-statement">
            <h2 className="statement">
              <span className="statement-line">I don&rsquo;t just write code.</span>
              <span className="statement-line">
                I build the{" "}
                <em className="accent-word">systems</em>
              </span>
              <span className="statement-line">that make everything else possible.</span>
            </h2>
          </div>
        </div>

        {/* Lower section — stats + tagline */}
        <div className="about-lower">
          <div className="about-divider" />

          {/* Stat rows — editorial layout matching Industries rows */}
          <div className="about-stats">
            <div className="stat-rule" />
            {STATS.map((stat, i) => (
              <React.Fragment key={i}>
                <div className="about-stat-row">
                  <span className="stat-number">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className="stat-value interactive"
                    data-value={stat.value}
                    data-suffix={stat.suffix}
                  >
                    0
                  </span>
                  <span className="stat-label">{stat.label}</span>
                </div>
                <div className="stat-rule" />
              </React.Fragment>
            ))}
          </div>

          <p className="about-tagline">
            I think in systems. Not frameworks &mdash;{" "}
            <em className="tagline-accent">systems.</em>
          </p>
        </div>
      </div>

      <style jsx>{`
        /* ── Section ─────────────────────────────── */
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

        /* ── Label — matches Industries/Contact ── */
        .about-header {
          margin-bottom: 2.5rem;
        }

        .about-label {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          opacity: 0;
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

        /* ── Hero zone — statement ───────────────── */
        .about-hero {
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .about-statement {
          position: relative;
          z-index: 2;
          will-change: transform;
        }

        .statement {
          font-family: 'Cormorant Garamond', var(--font-serif);
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 300;
          line-height: 1.2;
          color: #fff;
          margin: 0;
        }

        .statement-line {
          display: block;
          will-change: transform, opacity, clip-path;
          opacity: 0;
        }

        .accent-word {
          font-style: italic;
          color: rgba(255, 255, 255, 0.4);
        }

        /* ── Lower section ───────────────────────── */
        .about-lower {
          padding-top: 2rem;
        }

        .about-divider {
          width: 100px;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          margin-bottom: 4rem;
          transform-origin: left center;
        }

        /* ── Stats — editorial rows like Industries ─ */
        .about-stats {
          margin-bottom: 4rem;
        }

        .about-stat-row {
          display: flex;
          align-items: baseline;
          gap: 2.5rem;
          padding: 2rem 0;
          opacity: 0;
        }

        .stat-number {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.2);
          min-width: 2.5rem;
        }

        .stat-value {
          font-family: 'Cormorant Garamond', var(--font-serif);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          color: #fff;
          line-height: 1;
          min-width: 5rem;
          cursor: default;
          transition: text-shadow 0.4s ease;
        }

        .stat-value:hover {
          text-shadow: 0 0 60px rgba(255, 255, 255, 0.15),
                       0 0 120px rgba(255, 255, 255, 0.05);
        }

        .stat-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
        }

        .stat-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          transform-origin: left center;
        }

        /* ── Tagline — matches Contact tagline ───── */
        .about-tagline {
          font-family: 'Cormorant Garamond', var(--font-serif);
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          font-style: italic;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
          opacity: 0;
        }

        .tagline-accent {
          color: rgba(255, 255, 255, 0.6);
        }

        /* ── Responsive ──────────────────────────── */
        @media (max-width: 1024px) {
          .about-container {
            padding: 7rem 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .about-container {
            padding: 5rem 1.5rem;
          }

          .about-header {
            margin-bottom: 1.5rem;
          }

          .about-hero {
            min-height: 60vh;
          }

          .statement {
            font-size: clamp(2rem, 8vw, 2.8rem);
          }

          .about-stat-row {
            gap: 1.5rem;
          }

          .stat-value {
            min-width: 3.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
