import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  {
    name: "Ecommerce",
    number: "01",
    video: "/videos/ecommerce.mp4",
    tags: ["Payments", "Inventory", "Microservices"],
  },
  {
    name: "Cyber\u00A0Security",
    number: "02",
    video: "/videos/cybersecurity.mp4",
    tags: ["Zero Trust", "Threat Detection", "Compliance"],
  },
  {
    name: "Healthcare",
    number: "03",
    video: "/videos/healthcare.mp4",
    tags: ["HIPAA", "EHR Systems", "Telemedicine"],
  },
  {
    name: "Hospitality",
    number: "04",
    video: "/videos/hospitality.mp4",
    tags: ["Booking Engines", "Guest Experience", "PMS"],
  },
  {
    name: "Generative\u00A0AI",
    number: "05",
    video: "/videos/ai.mp4",
    tags: ["ML Pipelines", "NLP", "Computer Vision"],
  },
  {
    name: "Manufacturing",
    number: "06",
    video: "/videos/manufacturing.mp4",
    tags: ["IoT", "Supply Chain", "Predictive Maintenance"],
  },
];

const Industries = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer for entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!isVisible || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ind-label",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
      );

      gsap.fromTo(
        ".ind-title-line",
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
        },
      );

      gsap.fromTo(
        ".ind-scroll-hint",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.5, delay: 0.6, ease: "power2.out" },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isVisible]);

  // Horizontal scroll + panel animations
  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    // Small delay to ensure layout is computed
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const track = trackRef.current!;
        const totalScroll = track.scrollWidth - window.innerWidth;

        // Main horizontal scroll tween
        const scrollTween = gsap.to(track, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalScroll}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Per-panel animations using containerAnimation
        const panels = gsap.utils.toArray<HTMLElement>(".ind-panel");
        panels.forEach((panel) => {
          const video = panel.querySelector(
            ".ind-panel-video",
          ) as HTMLElement;
          const name = panel.querySelector(
            ".ind-panel-name",
          ) as HTMLElement;
          const number = panel.querySelector(
            ".ind-panel-number",
          ) as HTMLElement;
          const tags = panel.querySelector(
            ".ind-panel-tags",
          ) as HTMLElement;
          const overlay = panel.querySelector(
            ".ind-panel-overlay-text",
          ) as HTMLElement;

          // Video parallax — moves counter to scroll for depth
          if (video) {
            gsap.fromTo(
              video,
              { xPercent: 15 },
              {
                xPercent: -15,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          }

          // Panel content reveal
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: "left 80%",
              end: "left 30%",
              toggleActions: "play none none reverse",
            },
          });

          // Number
          if (number) {
            tl.fromTo(
              number,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
              0,
            );
          }

          // Character stagger reveal
          if (name) {
            const chars = name.querySelectorAll(".ind-char");
            tl.fromTo(
              chars,
              { y: 80, opacity: 0, rotateX: -50 },
              {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.6,
                stagger: 0.02,
                ease: "power3.out",
              },
              0.05,
            );
          }

          // Tags
          if (tags) {
            tl.fromTo(
              tags,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
              0.25,
            );
          }

          // Ghost overlay
          if (overlay) {
            tl.fromTo(
              overlay,
              { opacity: 0, xPercent: 5 },
              {
                opacity: 1,
                xPercent: 0,
                duration: 0.8,
                ease: "power2.out",
              },
              0.1,
            );
          }
        });

        // Divider animations
        const dividers = gsap.utils.toArray<HTMLElement>(".ind-divider");
        dividers.forEach((div) => {
          gsap.fromTo(
            div,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 0.6,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: div,
                containerAnimation: scrollTween,
                start: "left 75%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      }, sectionRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={sectionRef} id="industries" className="ind-section">
      {/* Header */}
      <div className="ind-header-area">
        <div className="ind-header-inner">
          <div className="ind-label">
            <span className="ind-label-index">02</span>
            <span className="ind-label-line" />
            <span className="ind-label-text">Industries</span>
          </div>

          <h2 className="ind-title">
            <span className="ind-title-line">
              From startups to enterprise,
            </span>
            <span className="ind-title-line">
              I architect solutions{" "}
              <em className="ind-title-accent">that scale.</em>
            </span>
          </h2>

          <div className="ind-scroll-hint">
            <span className="ind-scroll-hint-line" />
            <span className="ind-scroll-hint-text">Scroll to explore</span>
            <svg
              className="ind-scroll-hint-arrow"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div ref={trackRef} className="ind-track">
        {industries.map((industry, index) => (
          <React.Fragment key={index}>
            <div
              className={`ind-panel ${index % 2 === 0 ? "ind-panel--video-right" : "ind-panel--video-left"}`}
            >
              {/* Video */}
              <div className="ind-panel-video-wrap">
                <div className="ind-panel-video-inner">
                  <video
                    className="ind-panel-video"
                    src={industry.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="ind-panel-video-grain" />
                  {/* Video border glow */}
                  <div className="ind-panel-video-border" />
                </div>
              </div>

              {/* Text content */}
              <div className="ind-panel-text">
                <span className="ind-panel-number">{industry.number}</span>
                <h3 className="ind-panel-name">
                  {industry.name.split("").map((char, i) => (
                    <span key={i} className="ind-char">
                      {char}
                    </span>
                  ))}
                </h3>
                <div className="ind-panel-tags">
                  {industry.tags.map((tag, i) => (
                    <span key={i} className="ind-panel-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Large ghost overlay text */}
              <div className="ind-panel-overlay-text" aria-hidden="true">
                {industry.name.replace("\u00A0", " ")}
              </div>
            </div>

            {/* Vertical divider */}
            {index < industries.length - 1 && (
              <div className="ind-divider" />
            )}
          </React.Fragment>
        ))}

        {/* End marker */}
        <div className="ind-end-marker">
          <div className="ind-end-marker-content">
            <span className="ind-end-number">06</span>
            <span className="ind-end-line" />
            <span className="ind-end-text">Domains of expertise</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* ═══════════════════════════════════════════════
           INDUSTRIES — Horizontal Scroll Section
           ═══════════════════════════════════════════════ */

        .ind-section {
          position: relative;
          z-index: 1;
          background: #000;
          overflow: hidden;
        }

        /* ── Header ── */
        .ind-header-area {
          padding: 8rem 4rem 3rem;
          max-width: 1300px;
          margin: 0 auto;
        }

        .ind-header-inner {
          position: relative;
        }

        .ind-label {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          opacity: 0;
        }

        .ind-label-index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #fff;
          letter-spacing: 0.1em;
        }

        .ind-label-line {
          width: 40px;
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
        }

        .ind-label-text {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        .ind-title {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300;
          line-height: 1.3;
          color: #fff;
          margin: 0;
          display: flex;
          flex-direction: column;
        }

        .ind-title-line {
          display: block;
          clip-path: inset(100% 0% 0% 0%);
          opacity: 0;
          will-change: clip-path, opacity;
        }

        .ind-title-accent {
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
        }

        /* ── Scroll hint ── */
        .ind-scroll-hint {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 2.5rem;
          opacity: 0;
        }

        .ind-scroll-hint-line {
          width: 30px;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
        }

        .ind-scroll-hint-text {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
        }

        .ind-scroll-hint-arrow {
          color: rgba(255, 255, 255, 0.3);
          animation: ind-arrow-pulse 2s ease-in-out infinite;
        }

        @keyframes ind-arrow-pulse {
          0%,
          100% {
            transform: translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateX(5px);
            opacity: 0.7;
          }
        }

        /* ── Track ── */
        .ind-track {
          display: flex;
          align-items: stretch;
          height: 100vh;
          will-change: transform;
          padding-left: 4rem;
        }

        /* ── Panel ── */
        .ind-panel {
          position: relative;
          flex-shrink: 0;
          width: 85vw;
          height: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 4rem;
          gap: 4%;
        }

        .ind-panel--video-right {
          flex-direction: row;
        }

        .ind-panel--video-left {
          flex-direction: row-reverse;
        }

        /* ── Video ── */
        .ind-panel-video-wrap {
          position: relative;
          flex-shrink: 0;
          width: 46%;
          height: 65%;
          overflow: hidden;
        }

        .ind-panel-video-inner {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 3px;
        }

        .ind-panel-video {
          width: 130%;
          height: 100%;
          object-fit: cover;
          margin-left: -15%;
          filter: grayscale(1) contrast(1.1) brightness(0.8);
          will-change: transform;
        }

        /* Grain overlay on video */
        .ind-panel-video-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        /* Subtle border glow */
        .ind-panel-video-border {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          pointer-events: none;
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.4);
        }

        /* ── Text content ── */
        .ind-panel-text {
          flex: 1;
          padding: 0 2%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 2;
          min-width: 0;
        }

        .ind-panel-number {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          color: rgba(255, 255, 255, 0.2);
          margin-bottom: 1.5rem;
          opacity: 0;
        }

        .ind-panel-name {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(3.5rem, 6.5vw, 7rem);
          font-weight: 300;
          color: #fff;
          margin: 0;
          line-height: 1;
          letter-spacing: -0.03em;
          perspective: 600px;
          display: flex;
          flex-wrap: wrap;
        }

        .ind-char {
          display: inline-block;
          will-change: transform, opacity;
          transition: text-shadow 0.4s ease;
        }

        .ind-panel:hover .ind-char {
          text-shadow:
            0 0 40px rgba(255, 255, 255, 0.15),
            0 0 80px rgba(255, 255, 255, 0.05);
        }

        .ind-panel-tags {
          display: flex;
          gap: 0.75rem;
          margin-top: 2.5rem;
          flex-wrap: wrap;
          opacity: 0;
        }

        .ind-panel-tag {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top-color: rgba(255, 255, 255, 0.18);
          border-bottom-color: rgba(255, 255, 255, 0.04);
          padding: 0.4rem 0.9rem;
          border-radius: 100px;
          background: linear-gradient(
            165deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.01) 100%
          );
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .ind-panel-tag:hover {
          border-color: rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 0 16px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* ── Ghost overlay text ── */
        .ind-panel-overlay-text {
          position: absolute;
          bottom: 5%;
          left: 4%;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(5rem, 13vw, 13rem);
          font-weight: 300;
          line-height: 0.85;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.04);
          letter-spacing: -0.04em;
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          z-index: 0;
          opacity: 0;
        }

        /* ── Divider ── */
        .ind-divider {
          flex-shrink: 0;
          width: 1px;
          height: 50%;
          align-self: center;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.12) 30%,
            rgba(255, 255, 255, 0.12) 70%,
            transparent
          );
          transform-origin: center top;
          transform: scaleY(0);
          margin: 0 0.5rem;
        }

        /* ── End marker ── */
        .ind-end-marker {
          flex-shrink: 0;
          width: 25vw;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ind-end-marker-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .ind-end-number {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(4rem, 8vw, 8rem);
          font-weight: 300;
          color: rgba(255, 255, 255, 0.05);
          line-height: 1;
        }

        .ind-end-line {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.08);
        }

        .ind-end-text {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.15);
          writing-mode: vertical-lr;
        }

        /* ═══════════════════════════════════════════════
           Hover effects on video
           ═══════════════════════════════════════════════ */

        .ind-panel-video-inner {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ind-panel:hover .ind-panel-video-inner {
          transform: scale(1.03);
        }

        .ind-panel:hover .ind-panel-video-border {
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow:
            inset 0 0 30px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(255, 255, 255, 0.03);
        }

        .ind-panel-video-border {
          transition: all 0.5s ease;
        }

        /* ═══════════════════════════════════════════════
           Responsive
           ═══════════════════════════════════════════════ */

        @media (max-width: 1024px) {
          .ind-header-area {
            padding: 6rem 2.5rem 2.5rem;
          }

          .ind-track {
            padding-left: 2.5rem;
          }

          .ind-panel {
            width: 90vw;
            padding: 3rem 2.5rem;
            gap: 3%;
          }

          .ind-panel-video-wrap {
            width: 44%;
            height: 55%;
          }
        }

        @media (max-width: 768px) {
          .ind-header-area {
            padding: 5rem 1.5rem 2rem;
          }

          .ind-label {
            margin-bottom: 1.5rem;
          }

          .ind-track {
            padding-left: 1.5rem;
          }

          .ind-panel {
            width: 95vw;
            padding: 2rem 1.5rem;
            flex-direction: column !important;
            justify-content: center;
            gap: 2rem;
          }

          .ind-panel-video-wrap {
            width: 90%;
            height: 32%;
          }

          .ind-panel-text {
            padding: 0;
            text-align: center;
            align-items: center;
          }

          .ind-panel-name {
            font-size: clamp(2.5rem, 10vw, 4rem);
            justify-content: center;
          }

          .ind-panel-overlay-text {
            font-size: clamp(3rem, 14vw, 5rem);
            left: 50%;
            transform: translateX(-50%);
          }

          .ind-panel-tags {
            justify-content: center;
          }

          .ind-divider {
            display: none;
          }

          .ind-end-marker {
            width: 40vw;
          }

          .ind-scroll-hint {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Industries;
