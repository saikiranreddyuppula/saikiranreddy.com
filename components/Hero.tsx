import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import dynamic from "next/dynamic";
// @ts-ignore
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/** Split text into spans, preserving spaces as explicit characters */
const splitText = (text: string, baseClass: string, wordClass?: string) => {
  const chars: React.ReactElement[] = [];
  let charIndex = 0;
  const words = text.split(" ");

  words.forEach((word, wi) => {
    const isSpecialWord = wordClass && word.toLowerCase() === "light";
    word.split("").forEach((char) => {
      chars.push(
        <span
          key={charIndex}
          className={`${baseClass} ${isSpecialWord ? wordClass : ""}`}
          style={{ display: "inline-block" }}
        >
          {char}
        </span>,
      );
      charIndex++;
    });
    // Add space between words (not after last)
    if (wi < words.length - 1) {
      chars.push(
        <span
          key={`space-${wi}`}
          className={baseClass}
          style={{ display: "inline-block", width: "0.3em" }}
        >
          {"\u00A0"}
        </span>,
      );
      charIndex++;
    }
  });

  return chars;
};

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const lenisRef = useRef<any>(null);
  const isTransitioning = useRef(false);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  const heroChars = useMemo(
    () => splitText("Find the light within", "hero-char", "hero-light-char"),
    [],
  );

  useLenis((lenis: any) => {
    lenisRef.current = lenis;
  });

  useEffect(() => {
    const chars = gsap.utils.toArray<HTMLElement>(".hero-char");
    const lightChars = gsap.utils.toArray<HTMLElement>(".hero-light-char");

    // === Intro: character-level stagger animation ===
    const introTl = gsap.timeline({ delay: 2.2 });

    // Fade in the tagline container first (it starts opacity:0)
    introTl.set(".hero-tagline", { opacity: 1 });

    // Stagger each character in
    introTl.fromTo(
      chars,
      { opacity: 0, y: 18, rotateX: -60 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.035,
      },
      0,
    );

    // Scroll indicator fade in (after text lands)
    introTl.fromTo(
      ".hero-scroll-line-wrap",
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
      0.8,
    );

    introTl.fromTo(
      ".scroll-cue",
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3",
    );

    // === Random glow on "light" characters ===
    const randomGlow = () => {
      const intensity = 0.4 + Math.random() * 0.6;
      const spread = 15 + Math.random() * 50;
      const spread2 = 30 + Math.random() * 60;
      const duration = 0.3 + Math.random() * 1.2;
      gsap.to(lightChars, {
        textShadow: `0 0 ${4 + Math.random() * 4}px #fff, 0 0 ${spread}px rgba(255,255,255,${intensity}), 0 0 ${spread2}px rgba(255,255,255,${intensity * 0.5})`,
        duration,
        ease: "power1.inOut",
        onComplete: randomGlow,
      });
    };
    randomGlow();

    // === Scroll-cue line animation ===
    gsap.to(".scroll-cue-line", {
      y: 24,
      opacity: 0,
      duration: 1.2,
      ease: "power2.in",
      repeat: -1,
      repeatDelay: 0.6,
    });

    // === Scroll-responsive: letter-spacing shift on scroll ===
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

          // Scroll-responsive letter spacing on individual characters
          const progress = self.progress;
          if (taglineRef.current) {
            // Subtle letter-spacing expansion as user scrolls
            const spacing = progress * 0.15; // max 0.15em extra
            taglineRef.current.style.letterSpacing = `${0.05 + spacing}em`;
          }

          // Per-character subtle vertical drift based on scroll
          chars.forEach((char, i) => {
            const offset = Math.sin(i * 0.7 + progress * Math.PI) * progress * 4;
            gsap.set(char, { y: offset });
          });
        },
        onLeave: () => {
          if (isTransitioning.current) return;
          isTransitioning.current = true;

          const lenis = lenisRef.current;

          // Smooth crossfade: fade hero out, then scroll to about
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              opacity: 0,
              scale: 0.97,
              duration: 0.5,
              ease: "power2.inOut",
              onComplete: () => {
                if (containerRef.current) {
                  containerRef.current.style.visibility = "hidden";
                }

                // Scroll to about section
                const aboutEl = document.getElementById("about");
                if (aboutEl) {
                  window.scrollTo({
                    top: aboutEl.offsetTop,
                    behavior: "instant" as ScrollBehavior,
                  });
                }
                if (lenis) lenis.stop();

                // Reveal about with a slight delay
                window.dispatchEvent(new Event("revealAbout"));

                // Re-enable scrolling after about is revealed
                gsap.delayedCall(0.3, () => {
                  if (lenis) lenis.start();
                  isTransitioning.current = false;
                });
              },
            });
          }
        },
        onEnterBack: () => {
          isTransitioning.current = false;

          if (containerRef.current) {
            containerRef.current.style.visibility = "visible";
            gsap.to(containerRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            });
          }

          // Reset letter-spacing
          if (taglineRef.current) {
            taglineRef.current.style.letterSpacing = "0.05em";
          }

          // Reset character positions
          chars.forEach((char) => {
            gsap.set(char, { y: 0 });
          });

          // Hide about section so it doesn't leak through on next scroll
          const aboutEl = document.getElementById("about");
          if (aboutEl) aboutEl.style.visibility = "hidden";
        },
      },
    });

    // Fade hero text + scroll cue as user scrolls
    scrollTl.to(
      ".hero-text",
      { opacity: 0, y: -30, duration: 0.5 },
      0,
    );
    scrollTl.to(".scroll-cue", { opacity: 0, duration: 1 }, 0);

    return () => {
      introTl.kill();
      scrollTl.kill();
      gsap.killTweensOf(lightChars);
      gsap.killTweensOf(chars);
    };
  }, []);

  return (
    <section ref={containerRef} className="hero">
      <HeroScene scrollProgress={scrollProgress} />

      <div className="hero-text">
        <p className="hero-tagline interactive" ref={taglineRef}>
          {heroChars}
        </p>

        {/* Minimal scroll indicator: thin animated line */}
        <div className="hero-scroll-line-wrap interactive">
          <div className="hero-scroll-line-track">
            <div className="hero-scroll-line-pulse" />
          </div>
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
          perspective: 600px;
        }

        /* Scroll indicator: minimal pulsing line */
        .hero-scroll-line-wrap {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
          opacity: 0;
          margin-bottom: 1.5rem;
        }

        .hero-scroll-line-track {
          width: 1px;
          height: 48px;
          background: rgba(255, 255, 255, 0.08);
          position: relative;
          overflow: hidden;
        }

        .hero-scroll-line-pulse {
          position: absolute;
          top: -20px;
          left: 0;
          width: 100%;
          height: 20px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.6),
            rgba(255, 255, 255, 0)
          );
          animation: linePulse 2s ease-in-out infinite;
        }

        @keyframes linePulse {
          0% {
            top: -20px;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            top: 48px;
            opacity: 0;
          }
        }

        /* Scroll Indicator (right side) */
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
