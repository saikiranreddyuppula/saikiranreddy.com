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

      // Phase 1: Label
      tl.fromTo(
        sectionLabel,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
        0,
      );

      // Phase 1: Statement lines — clip reveal
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
          0.5,
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

      // Zone B — Pull quote word reveal
      const pullQuoteWords = gsap.utils.toArray<HTMLElement>(".pull-quote-word");
      if (pullQuoteWords.length > 0) {
        const pullQuoteTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".zone-b",
            start: "top 75%",
            end: "top 25%",
            scrub: 1,
          },
        });

        pullQuoteWords.forEach((word, i) => {
          pullQuoteTl.fromTo(
            word,
            { opacity: 0, y: 25, filter: "blur(4px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3 },
            i * 0.08,
          );
        });
      }

      // Zone B — Body text paragraphs fade in
      const bodyParagraphs = gsap.utils.toArray<HTMLElement>(".body-paragraph");
      bodyParagraphs.forEach((p) => {
        gsap.fromTo(
          p,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: p,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Zone B — Inline stat count-ups
      const inlineStats = gsap.utils.toArray<HTMLElement>(".inline-stat");
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

    }, containerRef);

    return () => {
      window.removeEventListener("revealAbout", handleReveal);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  // Helper: wrap pull-quote text into word spans
  const renderPullQuote = (text: string) =>
    text.split(/\s+/).map((word, i) => (
      <span key={i} className="pull-quote-word-wrap">
        <span className="pull-quote-word">{word}</span>{" "}
      </span>
    ));

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

      {/* ═══ ZONE B — The Narrative ═══ */}
      <div className="zone-b">
        <div className="zone-b-left">
          <blockquote className="pull-quote">
            {renderPullQuote("Eight years of turning \"this can\u2019t be done\" into production.")}
          </blockquote>
        </div>

        <div className="zone-b-right">
          <p className="body-paragraph">
            From early-stage startups to high-scale platforms, I&rsquo;ve
            been the engineer teams count on to deliver.
          </p>
          <p className="body-paragraph">
            Today I design systems for organizations across{" "}
            <span className="inline-stat interactive" data-value="12" data-suffix="">0</span>{" "}
            industries &mdash; from healthcare platforms handling patient data
            to e-commerce engines processing millions of transactions.{" "}
            <span className="inline-stat interactive" data-value="50" data-suffix="+">0</span>{" "}
            projects, each one a lesson in what scales and what breaks.
          </p>
          <p className="body-paragraph">
            I think in systems. Not frameworks, not languages &mdash; systems.
            I architect for scale and ship with precision. Every system I
            build is meant to last.
          </p>
        </div>
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
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 6rem;
          padding: 8rem 4rem 10rem;
          max-width: 1400px;
          margin: 0 auto;
          align-items: start;
        }

        .zone-b-left {
          position: relative;
        }

        .zone-b-right {
          padding-top: 8rem;
        }

        .pull-quote {
          font-family: 'Cormorant Garamond', var(--font-serif);
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 300;
          font-style: italic;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.3;
          margin: 0;
          padding: 0;
          border: none;
        }

        .pull-quote-word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }

        .pull-quote-word {
          display: inline-block;
          will-change: transform, opacity, filter;
          opacity: 0;
        }

        .body-paragraph {
          font-family: 'Cormorant Garamond', var(--font-serif);
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.8;
          margin: 0 0 2rem;
          opacity: 0;
        }

        .body-paragraph:last-child {
          margin-bottom: 0;
        }

        .inline-stat {
          font-family: 'Space Grotesk', var(--font-display);
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1;
          vertical-align: baseline;
          cursor: default;
          transition: text-shadow 0.3s ease;
        }

        .inline-stat:hover {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        /* ── Responsive ──────────────────────────── */
        @media (max-width: 1024px) {
          .zone-a {
            padding: 6rem 2.5rem 4rem;
          }

          .zone-b {
            padding: 6rem 2.5rem 8rem;
            gap: 4rem;
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
            grid-template-columns: 1fr;
            padding: 4rem 1.5rem 6rem;
            gap: 3rem;
          }

          .zone-b-right {
            padding-top: 0;
          }

          .pull-quote {
            font-size: clamp(1.6rem, 6vw, 2.2rem);
          }
        }
      `}</style>
    </section>
  );
};

export default About;
