import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { journey } from "../lib/content";

gsap.registerPlugin(ScrollTrigger);

const Journey = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".journey-label",
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        },
      );

      gsap.utils.toArray<HTMLElement>(".journey-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          },
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="journey" className="journey">
      <div className="journey-wrap">
        <div className="journey-label">
          <span className="idx">03</span>
          <span className="line" />
          <span className="txt">Journey</span>
        </div>

        <h2 className="journey-title">
          The climb is the work.
          <em> Patience, then altitude.</em>
        </h2>

        <ol className="journey-list">
          {journey.map((item) => (
            <li key={item.stage} className="journey-card">
              <div className="meta">
                <span className="stage">{item.stage}</span>
                <span className="year">{item.year}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <style jsx>{`
        .journey {
          position: relative;
          z-index: 2;
          background: #000;
          padding: 8rem 0 6rem;
        }

        .journey-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 4rem;
        }

        .journey-label {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          opacity: 0;
        }

        .idx,
        .txt {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .txt {
          color: rgba(255, 255, 255, 0.5);
        }

        .line {
          width: 40px;
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
        }

        .journey-title {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          font-weight: 300;
          line-height: 1.2;
          margin: 0 0 3rem;
        }

        .journey-title em {
          display: block;
          font-style: italic;
          color: rgba(255, 255, 255, 0.45);
        }

        .journey-list {
          list-style: none;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .journey-card {
          padding: 2.4rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .meta {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.7rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        h3 {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 300;
          margin: 0 0 0.7rem;
        }

        p {
          margin: 0;
          max-width: 40rem;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .journey-wrap {
            padding: 0 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Journey;
