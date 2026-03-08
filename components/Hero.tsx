import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import dynamic from "next/dynamic";
// @ts-ignore
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const flashFadeRef = useRef<gsap.core.Tween | null>(null);
  const lenisRef = useRef<any>(null);
  const flashControlActive = useRef(true);
  const isTransitioning = useRef(false);

  useLenis((lenis: any) => {
    lenisRef.current = lenis;
  });

  useEffect(() => {
    const flashEl = document.querySelector(".hero-flash") as HTMLElement;

    const introTl = gsap.timeline({ delay: 2.2 });

    introTl.fromTo(
      ".hero-tagline",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
    );

    introTl.fromTo(
      ".hero-scroll-prompt",
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4",
    );

    introTl.fromTo(
      ".scroll-cue",
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3",
    );

    const lightWordEl = document.querySelector(".hero-light-word") as HTMLElement;
    const randomGlow = () => {
      const intensity = 0.4 + Math.random() * 0.6;
      const spread = 15 + Math.random() * 50;
      const spread2 = 30 + Math.random() * 60;
      const duration = 0.3 + Math.random() * 1.2;
      gsap.to(lightWordEl, {
        textShadow: `0 0 ${4 + Math.random() * 4}px #fff, 0 0 ${spread}px rgba(255,255,255,${intensity}), 0 0 ${spread2}px rgba(255,255,255,${intensity * 0.5})`,
        duration,
        ease: "power1.inOut",
        onComplete: randomGlow,
      });
    };
    randomGlow();

    gsap.to(".scroll-cue-line", {
      y: 24,
      opacity: 0,
      duration: 1.2,
      ease: "power2.in",
      repeat: -1,
      repeatDelay: 0.6,
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        scrub: 0.3,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          if (flashEl && flashControlActive.current) {
            const flashOpacity = Math.min(
              1,
              Math.max(0, (self.progress - 0.4) / 0.3),
            );
            flashEl.style.opacity = String(flashOpacity);
          }
        },
        onLeave: () => {
          if (isTransitioning.current) return;
          isTransitioning.current = true;
          flashControlActive.current = false;

          const lenis = lenisRef.current;
          if (flashFadeRef.current) flashFadeRef.current.kill();
          if (flashEl) {
            flashEl.style.visibility = "visible";
            flashEl.style.opacity = "1";
          }
          if (containerRef.current) {
            containerRef.current.style.visibility = "hidden";
          }

          // Scroll to about — native fallback ensures it works even if Lenis is stopped
          const aboutEl = document.getElementById("about");
          if (aboutEl) {
            window.scrollTo({ top: aboutEl.offsetTop, behavior: "instant" as ScrollBehavior });
          }
          if (lenis) lenis.stop();

          flashFadeRef.current = gsap.to(flashEl, {
            opacity: 0,
            duration: 0.4,
            delay: 0.1,
            ease: "power2.inOut",
            onStart: () => {
              window.dispatchEvent(new Event("revealAbout"));
            },
            onComplete: () => {
              if (flashEl) flashEl.style.visibility = "hidden";
              if (lenis) lenis.start();
              isTransitioning.current = false;
            },
          });
        },
        onEnterBack: () => {
          if (flashFadeRef.current) flashFadeRef.current.kill();
          flashControlActive.current = true;
          isTransitioning.current = false;
          if (containerRef.current) {
            containerRef.current.style.visibility = "visible";
          }
          if (flashEl) {
            flashEl.style.visibility = "visible";
          }
          // Hide about section so it doesn't leak through on next scroll
          const aboutEl = document.getElementById("about");
          if (aboutEl) aboutEl.style.visibility = "hidden";
        },
      },
    });

    scrollTl.to(".hero-text", { opacity: 0, y: -30, duration: 0.5 }, 0);
    scrollTl.to(".scroll-cue", { opacity: 0, duration: 1 }, 0);

    return () => {
      introTl.kill();
      scrollTl.kill();
      gsap.killTweensOf(lightWordEl);
      if (flashFadeRef.current) flashFadeRef.current.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className="hero">
      <HeroScene scrollProgress={scrollProgress} />

      <div className="hero-text">
        <p className="hero-tagline interactive">Find the <span className="hero-light-word">light</span> within</p>
        <div className="hero-scroll-prompt interactive">
          <svg
            className="hero-scroll-arrow"
            viewBox="0 0 20 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="arrowTrail"
                x1="10"
                y1="0"
                x2="10"
                y2="60"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line
              className="arrow-line"
              x1="10"
              y1="0"
              x2="10"
              y2="42"
              stroke="url(#arrowTrail)"
              strokeWidth="1"
            />
            <path
              className="arrow-tip"
              d="M4 36L10 44L16 36"
              stroke="#ffffff"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="hero-scroll-label">scroll</span>
        </div>
      </div>

      <div className="scroll-cue">
        <div className="scroll-cue-track">
          <div className="scroll-cue-line"></div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          height: 100vh;
          min-height: 100vh;
          position: relative;
          background: #000;
          overflow: hidden;
          z-index: 3;
        }

        /* Hero Text */
        .hero-text {
          position: absolute;
          bottom: 12%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 10;
          pointer-events: auto;
        }

        .hero-tagline {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 300;
          font-style: italic;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.75);
          margin: 0 0 0.2rem;
          opacity: 0;
          white-space: nowrap;
        }

        .hero-light-word {
          color: #fff;
        }

        .hero-scroll-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          opacity: 0;
          margin-bottom: 1.5rem;
        }

        .hero-scroll-arrow {
          width: 20px;
          height: 36px;
          overflow: visible;
          margin-top: 0.5rem;
        }

        .arrow-line {
          stroke-dasharray: 20 42;
          stroke-dashoffset: -10;
          animation: arrowFlow 2.4s ease-in-out infinite;
        }

        .arrow-tip {
          opacity: 0.5;
          animation: arrowTipPulse 2.4s ease-in-out infinite;
        }

        @keyframes arrowFlow {
          0% {
            stroke-dashoffset: 30;
            opacity: 0;
          }
          30% {
            opacity: 0.6;
          }
          70% {
            opacity: 0.6;
          }
          100% {
            stroke-dashoffset: -20;
            opacity: 0;
          }
        }

        @keyframes arrowTipPulse {
          0%,
          100% {
            opacity: 0.2;
          }
          40%,
          60% {
            opacity: 0.6;
          }
        }

        .hero-scroll-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-top: 0rem;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.3) 35%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0.3) 65%,
            rgba(255, 255, 255, 0.3) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textSweep 3s ease-in-out infinite;
        }

        @keyframes textSweep {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* Scroll Indicator */
        .scroll-cue {
          position: absolute;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
          z-index: 10;
        }

        .scroll-cue-track {
          width: 1px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .scroll-cue-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 16px;
          background: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 768px) {
          .hero-text {
            bottom: 16%;
          }

          .hero-tagline {
            font-size: clamp(1.2rem, 5vw, 1.6rem);
          }

          .scroll-cue {
            right: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
