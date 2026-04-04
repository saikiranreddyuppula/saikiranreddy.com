import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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

    // Mouse tracking for Zone A parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Smooth parallax loop for Zone A
    const smoothMouse = { x: 0, y: 0 };
    const statementEl = containerRef.current.querySelector(".zone-a-text") as HTMLElement;
    let rafId: number;

    const parallaxLoop = () => {
      smoothMouse.x += (mouseRef.current.x - smoothMouse.x) * 0.04;
      smoothMouse.y += (mouseRef.current.y - smoothMouse.y) * 0.04;
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

      // Phase 1: Label
      tl.fromTo(
        sectionLabel,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        0,
      );

      // Phase 1: Statement lines — clip reveal
      lines.forEach((line, i) => {
        tl.fromTo(
          line,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            y: 30,
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          0.15 + i * 0.15,
        );
      });

      // Phase 1: Accent word glow
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
          0.9,
        );
      }

      // ═══════════════════════════════════════════════
      // SCROLL-DRIVEN ANIMATIONS
      // ═══════════════════════════════════════════════

      // Zone A — Parallax on scroll
      const zoneA = containerRef.current!.querySelector(".zone-a");
      if (zoneA) {
        gsap.to(".zone-a-text", {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: zoneA,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Zone B — Stats entrance
      const statBlocks = gsap.utils.toArray<HTMLElement>(".stat-block");
      statBlocks.forEach((block, i) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: {
              trigger: ".zone-b",
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Zone B — Stat dividers draw in
      const dividers = gsap.utils.toArray<HTMLElement>(".stat-divider");
      dividers.forEach((div) => {
        gsap.fromTo(
          div,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.8,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: ".zone-b",
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Zone B — Philosophy line fade in
      const philosophy = containerRef.current!.querySelector(".zone-b-philosophy");
      if (philosophy) {
        gsap.fromTo(
          philosophy,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: philosophy,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Zone B — Inline stat count-ups
      const inlineStats = gsap.utils.toArray<HTMLElement>(".inline-stat");
      inlineStats.forEach((el) => {
        const target = Number(el.dataset.value);
        const suffix = el.dataset.suffix || "";
        const proxy = { val: 0 };

        gsap.to(proxy, {
          val: target,
          duration: 1.2,
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
      {/* Section label */}
      <div className="about-label">
        <span className="label-index">01</span>
        <span className="label-dash">&mdash;</span>
        <span className="label-text">ABOUT</span>
      </div>

      {/* ═══ ZONE A — The Hook ═══ */}
      <div className="zone-a">
        <div className="zone-a-text">
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

      {/* ═══ ZONE B — Stats & Philosophy ═══ */}
      <div className="zone-b">
        <div className="zone-b-stats">
          <div className="stat-block">
            <span className="stat-number inline-stat interactive" data-value="8" data-suffix="+">0</span>
            <span className="stat-label">Years</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-block">
            <span className="stat-number inline-stat interactive" data-value="50" data-suffix="+">0</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-block">
            <span className="stat-number inline-stat interactive" data-value="12" data-suffix="">0</span>
            <span className="stat-label">Industries</span>
          </div>
        </div>

        <p className="zone-b-philosophy body-paragraph">
          I think in systems. Not frameworks &mdash; systems.
        </p>
      </div>


      <style jsx>{`
        /* ── Section container ─────────────────────── */
        .about-section {
          position: relative;
          z-index: 2;
          background: #000;
          overflow: hidden;
        }

        /* ── Label ────────────────────────────────── */
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

        /* ═══ ZONE A ══════════════════════════════ */
        .zone-a {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 8rem 4rem 6rem;
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }

        .zone-a-text {
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
          text-align: left;
        }

        .statement-line {
          display: block;
          will-change: transform, opacity, clip-path;
          opacity: 0;
        }

        .accent-word {
          font-style: italic;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ═══ ZONE B ══════════════════════════════ */
        .zone-b {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 4rem 10rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .zone-b-stats {
          display: flex;
          align-items: center;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .stat-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .stat-number {
          font-family: 'Space Grotesk', var(--font-display);
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1;
          cursor: default;
          transition: text-shadow 0.3s ease;
        }

        .stat-number:hover {
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .stat-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
        }

        .stat-divider {
          width: 1px;
          height: 4rem;
          background: rgba(255, 255, 255, 0.1);
        }

        .inline-stat {
          font-family: 'Space Grotesk', var(--font-display);
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          line-height: inherit;
        }

        .zone-b-philosophy {
          font-family: 'Cormorant Garamond', var(--font-serif);
          font-size: clamp(1.1rem, 1.8vw, 1.4rem);
          font-weight: 400;
          font-style: italic;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.6;
          margin: 0;
          text-align: center;
          opacity: 0;
        }

        .body-paragraph {
          opacity: 0;
        }

        /* ── Responsive ──────────────────────────── */
        @media (max-width: 1024px) {
          .zone-a {
            padding: 6rem 2.5rem 4rem;
          }

          .zone-b {
            padding: 0 2.5rem 8rem;
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

          .zone-a {
            padding: 6rem 1.5rem 4rem;
            min-height: auto;
          }

          .statement {
            font-size: clamp(2rem, 8vw, 2.8rem);
          }

          .zone-b {
            padding: 0 1.5rem 6rem;
          }

          .zone-b-stats {
            gap: 2rem;
          }

          .stat-divider {
            height: 3rem;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
