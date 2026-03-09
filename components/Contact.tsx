import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ChicagoSkyline from "./ChicagoSkyline";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_WORDS = [
  { text: "Let's", accent: false },
  { text: "build", accent: false },
  { text: "something", accent: false },
  { text: "extraordinary", accent: true },
];

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const emailBtnRef = useRef<HTMLAnchorElement>(null);
  const backToTopRef = useRef<HTMLAnchorElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // ── Intersection Observer to trigger reveal ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ── Main entrance animation ──
  useEffect(() => {
    if (!isVisible || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Label reveal
      gsap.fromTo(
        ".contact-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        }
      );

      // 2. Headline word-by-word waterfall reveal
      const words = gsap.utils.toArray<HTMLElement>(".headline-word");
      words.forEach((word, i) => {
        const inner = word.querySelector(".headline-word-inner");
        if (!inner) return;

        gsap.fromTo(
          inner,
          {
            y: "110%",
            rotateX: 25,
            opacity: 0,
          },
          {
            y: "0%",
            rotateX: 0,
            opacity: 1,
            duration: 0.9,
            delay: 0.3 + i * 0.12,
            ease: "power4.out",
          }
        );
      });

      // 3. Divider line
      gsap.fromTo(
        ".contact-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.inOut",
          delay: 0.7,
        }
      );

      // 4. CTA shimmer entrance
      gsap.fromTo(
        ".contact-cta",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.9,
        }
      );

      // 5. Tagline
      gsap.fromTo(
        ".contact-tagline",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.1,
        }
      );

      // 6. Footer staggered entrance
      const footerItems = gsap.utils.toArray<HTMLElement>(".footer-stagger");
      gsap.fromTo(
        footerItems,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          delay: 1.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isVisible]);

  // ── Magnetic button effect for email CTA ──
  useEffect(() => {
    const btn = emailBtnRef.current;
    if (!btn) return;

    const magnetStrength = 0.35;
    const magnetRadius = 120; // px radius of magnetic pull

    const onMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < magnetRadius) {
        const pullX = distX * magnetStrength;
        const pullY = distY * magnetStrength;

        gsap.to(btn, {
          x: pullX,
          y: pullY,
          duration: 0.4,
          ease: "power2.out",
        });
      } else {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // ── Email button hover shimmer ──
  const onEmailEnter = useCallback(() => {
    const btn = emailBtnRef.current;
    if (!btn) return;

    const shimmer = btn.querySelector(".email-shimmer") as HTMLElement;
    if (shimmer) {
      gsap.fromTo(
        shimmer,
        { x: "-100%", opacity: 0.6 },
        {
          x: "200%",
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
        }
      );
    }

    // Arrow fluid animation
    const arrow = btn.querySelector(".email-arrow");
    if (arrow) {
      gsap.to(arrow, {
        x: 8,
        scale: 1.2,
        duration: 0.4,
        ease: "back.out(2)",
      });
    }
  }, []);

  const onEmailLeave = useCallback(() => {
    const btn = emailBtnRef.current;
    if (!btn) return;

    const arrow = btn.querySelector(".email-arrow");
    if (arrow) {
      gsap.to(arrow, {
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  // ── Back to Top playful animation ──
  const onBackToTopEnter = useCallback(() => {
    const btn = backToTopRef.current;
    if (!btn) return;

    const arrow = btn.querySelector(".top-arrow");
    if (arrow) {
      gsap.to(arrow, {
        y: -6,
        scale: 1.3,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  }, []);

  const onBackToTopClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const socialLinks = [
    { name: "LinkedIn", url: "https://linkedin.com" },
    { name: "GitHub", url: "https://github.com" },
    { name: "Twitter", url: "https://twitter.com" },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`contact-section ${isVisible ? "is-visible" : ""}`}
    >
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <div className="contact-label contact-reveal">
            <span className="label-index">03</span>
            <span className="label-line"></span>
            <span className="label-text">Contact</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="contact-main">
          <div className="contact-headline-wrapper">
            <div className="contact-light-motif" aria-hidden="true" />
            <h2 className="contact-headline">
              {HEADLINE_WORDS.map((word, i) => (
                <span key={i} className="headline-word">
                  <span
                    className={`headline-word-inner ${
                      word.accent ? "text-accent" : ""
                    }`}
                  >
                    {word.text}
                    {word.accent ? "." : ""}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <div className="contact-line"></div>

          <div className="contact-cta">
            <a
              ref={emailBtnRef}
              href="mailto:hello@saikiranreddy.com"
              className="email-link interactive"
              onMouseEnter={onEmailEnter}
              onMouseLeave={onEmailLeave}
            >
              <span className="email-shimmer"></span>
              <span className="email-bg"></span>
              <span className="email-text">hello@saikiranreddy.com</span>
              <span className="email-arrow">&rarr;</span>
            </a>
          </div>

          <p className="contact-tagline">
            Available for full-time positions, consulting, and select projects.
          </p>
        </div>

        {/* Footer */}
        <footer className="contact-footer">
          <div className="footer-left footer-stagger">
            <span className="footer-copyright">
              &copy; {new Date().getFullYear()} Sai Kiran Reddy
            </span>
          </div>

          <nav className="footer-nav">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link interactive footer-stagger"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="footer-right footer-stagger">
            <a
              ref={backToTopRef}
              href="#"
              className="back-to-top interactive"
              onClick={onBackToTopClick}
              onMouseEnter={onBackToTopEnter}
            >
              <span>Back to Top</span>
              <span className="top-arrow">&uarr;</span>
            </a>
          </div>
        </footer>
      </div>

      {/* Chicago Skyline Background */}
      <ChicagoSkyline />

      <style jsx>{`
        .contact-section {
          min-height: 100vh;
          position: relative;
          z-index: 100;
          background: #000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .contact-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 8rem 4rem 3rem;
          position: relative;
          z-index: 2;
        }

        /* Header */
        .contact-header {
          margin-bottom: 4rem;
        }

        .contact-label {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          opacity: 0;
        }

        .label-index {
          font-family: var(--font-mono);
          font-size: 0.75rem;
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
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Main */
        .contact-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 4rem 0;
        }

        /* Headline wrapper with light motif */
        .contact-headline-wrapper {
          position: relative;
        }

        .contact-light-motif {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 250, 240, 0.07) 0%,
            rgba(255, 255, 255, 0.02) 40%,
            transparent 70%
          );
          pointer-events: none;
          animation: contactGlowPulse 6s ease-in-out infinite;
          z-index: 0;
        }

        @keyframes contactGlowPulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }

        /* Headline with word-by-word reveal */
        .contact-headline {
          position: relative;
          z-index: 1;
          font-family: var(--font-serif);
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 300;
          line-height: 1.15;
          color: #fff;
          margin: 0 0 3rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0 0.35em;
          perspective: 600px;
        }

        .headline-word {
          display: inline-block;
          overflow: hidden;
          vertical-align: top;
        }

        .headline-word-inner {
          display: inline-block;
          will-change: transform, opacity;
          transform-origin: bottom center;
        }

        .text-accent {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }

        .contact-line {
          width: 100px;
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

        /* CTA */
        .contact-cta {
          margin-bottom: 2rem;
          opacity: 0;
        }

        .email-link {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
          position: relative;
          overflow: hidden;
          will-change: transform;
        }

        /* Sliding background fill */
        .email-bg {
          position: absolute;
          inset: 0;
          background: #fff;
          transform: translateX(-101%);
          transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
          z-index: 0;
        }

        .email-link:hover .email-bg {
          transform: translateX(0);
        }

        /* Shimmer highlight */
        .email-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transform: translateX(-100%);
          z-index: 1;
          pointer-events: none;
        }

        .email-link:hover {
          border-color: #fff;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
        }

        .email-text {
          font-family: var(--font-mono);
          font-size: clamp(0.875rem, 2vw, 1.125rem);
          letter-spacing: 0.05em;
          color: #fff;
          position: relative;
          z-index: 2;
          transition: color 0.4s;
        }

        .email-link:hover .email-text {
          color: #000;
        }

        .email-arrow {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.6);
          position: relative;
          z-index: 2;
          transition: color 0.4s ease;
          display: inline-block;
          will-change: transform;
        }

        .email-link:hover .email-arrow {
          color: #000;
        }

        .contact-tagline {
          font-family: var(--font-serif);
          font-size: 1rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.4);
          opacity: 0;
        }

        /* Footer */
        .contact-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-left {
          opacity: 0;
        }

        .footer-copyright {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
        }

        .footer-nav {
          display: flex;
          gap: 2.5rem;
        }

        .footer-link {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          transition: color 0.3s;
          position: relative;
          opacity: 0;
        }

        .footer-link::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 1px;
          background: #fff;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }

        .footer-link:hover {
          color: #fff;
        }

        .footer-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .footer-right {
          opacity: 0;
        }

        .back-to-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.3s;
        }

        .back-to-top:hover {
          color: #fff;
        }

        .top-arrow {
          display: inline-block;
          will-change: transform;
          transition: color 0.3s;
        }

        @media (max-width: 1024px) {
          .contact-footer {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .contact-container {
            padding: 6rem 2rem 2rem;
          }

          .contact-headline {
            font-size: clamp(2.5rem, 10vw, 4rem);
          }

          .footer-nav {
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
