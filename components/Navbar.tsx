import React, { useState, useEffect, useRef, useCallback } from "react";
// @ts-ignore
import { useLenis } from "lenis/react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "industries", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

const Navbar = () => {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [stretching, setStretching] = useState(false);
  const lenis = useLenis();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const stretchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstActiveRef = useRef(true);

  // Stretch indicator into a pill briefly whenever active changes
  useEffect(() => {
    if (isFirstActiveRef.current) {
      isFirstActiveRef.current = false;
      return;
    }
    setStretching(true);
    if (stretchTimerRef.current) clearTimeout(stretchTimerRef.current);
    stretchTimerRef.current = setTimeout(() => setStretching(false), 420);
    return () => {
      if (stretchTimerRef.current) clearTimeout(stretchTimerRef.current);
    };
  }, [active]);

  // Track which section is in view
  useEffect(() => {
    // Delay visibility so it doesn't flash during loader
    const showTimer = setTimeout(() => setVisible(true), 1800);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Find section closest to viewport center
      let closest = 0;
      let closestDist = Infinity;

      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - vh / 2);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });

      setActive(closest);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;

      // Hero is pinned by GSAP with pinSpacing:false, so lenis can't
      // resolve its scroll offset from the DOM element. Target 0 directly.
      const target = id === "hero" ? 0 : el;

      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1,
          easing: (t: number) => 1 - Math.pow(1 - t, 4), // easeOutQuart
        });
      } else {
        if (id === "hero") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [lenis],
  );

  return (
    <nav className={`navbar ${visible ? "navbar--visible" : ""}`}>
      <div
        className="navbar-track"
        style={{ ["--active" as never]: active }}
      >
        {/* Active indicator pill */}
        <div
          className={`navbar-indicator ${stretching ? "navbar-indicator--stretching" : ""}`}
        />

        {sections.map((section, i) => (
          <button
            key={section.id}
            className={`navbar-dot interactive ${i === active ? "navbar-dot--active" : ""}`}
            onClick={() => handleClick(section.id)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            aria-label={`Navigate to ${section.label}`}
          >
            <span className="dot-core" />
            <span
              className={`dot-label ${hovered === i ? "dot-label--visible" : ""}`}
            >
              {section.label}
            </span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .navbar--visible {
          opacity: 1;
          pointer-events: auto;
        }

        .navbar-track {
          --dot-size: 8px;
          --dot-gap: 24px;
          --indicator-size: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--dot-gap);
          position: relative;
        }

        .navbar-indicator {
          position: absolute;
          top: calc((var(--dot-size) - var(--indicator-size)) / 2);
          left: 50%;
          width: var(--indicator-size);
          height: var(--indicator-size);
          border-radius: 50%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.5);
          transform-origin: center;
          transition: transform 0.75s cubic-bezier(0.34, 1.3, 0.5, 1);
          pointer-events: none;
          will-change: transform;
          transform: translateX(-50%)
            translateY(calc(var(--active, 0) * (var(--dot-size) + var(--dot-gap))));
        }

        .navbar-indicator--stretching {
          transform: translateX(-50%)
            translateY(calc(var(--active, 0) * (var(--dot-size) + var(--dot-gap))))
            scale(0.78, 1.45);
        }

        .navbar-dot {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--dot-size);
          height: var(--dot-size);
          background: none;
          border: none;
          padding: 0;
          cursor: none;
          -webkit-tap-highlight-color: transparent;
        }

        .dot-core {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            background 0.3s ease;
        }

        .navbar-dot--active .dot-core {
          background: #fff;
          transform: scale(1.5);
        }

        .navbar-dot:hover .dot-core {
          background: rgba(255, 255, 255, 0.7);
          transform: scale(1.8);
        }

        .dot-label {
          position: absolute;
          right: 24px;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .dot-label--visible {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .navbar {
            right: 1rem;
          }

          .dot-label {
            display: none;
          }
        }

        @media (pointer: coarse) {
          .navbar-track {
            --dot-size: 20px;
            --indicator-size: 22px;
          }

          .dot-core {
            width: 6px;
            height: 6px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
