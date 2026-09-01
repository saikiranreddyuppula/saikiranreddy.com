import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { industries } from "../lib/content";

gsap.registerPlugin(ScrollTrigger);

const Industries = () => {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".atlas-panel");

        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight * 3.2, track.scrollWidth)}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(
                panels.length - 1,
                Math.floor(self.progress * panels.length),
              );
              setActive(i);
            },
          },
        });

        return () => tween.kill();
      });

      mm.add("(max-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>(".atlas-panel").forEach((panel, i) => {
          gsap.fromTo(
            panel,
            { opacity: 0.35, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              scrollTrigger: {
                trigger: panel,
                start: "top 82%",
                onEnter: () => setActive(i),
              },
            },
          );
        });
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  return (
    <section id="industries" className="atlas">
      <div ref={pinRef} className="atlas-pin">
        <header className="atlas-bar">
          <div className="atlas-kicker">
            <span>02</span>
            <i />
            <span>Atlas</span>
          </div>
          <p className="atlas-lede">
            Domains I have already been inside.
            <em> Six rooms. One operating system.</em>
          </p>
          <div className="atlas-count" aria-live="polite">
            <b>{String(active + 1).padStart(2, "0")}</b>
            <span>/ {String(industries.length).padStart(2, "0")}</span>
          </div>
        </header>

        <div className="atlas-window">
          <div ref={trackRef} className="atlas-track">
            {industries.map((item, i) => (
              <article
                key={item.name}
                className={`atlas-panel ${i === active ? "is-on" : ""}`}
              >
                <span className="atlas-ghost" aria-hidden>
                  {item.number}
                </span>
                <div className="atlas-copy">
                  <span className="atlas-idx">{item.number}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <ul>
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="atlas-ticks">
          {industries.map((item, i) => (
            <span
              key={item.name}
              className={i === active ? "on" : ""}
              style={{ width: `${100 / industries.length}%` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .atlas {
          position: relative;
          z-index: 2;
          background: #000;
          color: #fff;
        }

        .atlas-pin {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 4.5rem 0 2.5rem;
          overflow: hidden;
        }

        .atlas-bar {
          width: min(1280px, calc(100% - 5rem));
          margin: 0 auto 1.5rem;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 2rem;
          align-items: end;
        }

        .atlas-kicker {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }

        .atlas-kicker i {
          width: 36px;
          height: 1px;
          background: rgba(255, 255, 255, 0.28);
        }

        .atlas-lede {
          margin: 0;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(1.4rem, 2.4vw, 2rem);
          font-weight: 300;
          line-height: 1.2;
        }

        .atlas-lede em {
          font-style: italic;
          color: rgba(255, 255, 255, 0.4);
        }

        .atlas-count {
          font-family: var(--font-mono);
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.38);
        }

        .atlas-count b {
          color: #fff;
          font-weight: 400;
          font-size: 1.1rem;
        }

        .atlas-window {
          overflow: hidden;
        }

        .atlas-track {
          display: flex;
          gap: 1.25rem;
          padding: 0 4vw 1rem;
          width: max-content;
          will-change: transform;
        }

        .atlas-panel {
          position: relative;
          width: min(78vw, 980px);
          height: min(62vh, 560px);
          flex: 0 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            radial-gradient(80% 80% at 100% 0%, rgba(255, 255, 255, 0.06), transparent 55%),
            #050505;
          overflow: hidden;
          padding: 3.2rem 3.4rem;
          display: flex;
          align-items: flex-end;
        }

        .atlas-ghost {
          position: absolute;
          right: -0.08em;
          top: -0.28em;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(10rem, 22vw, 20rem);
          font-weight: 300;
          line-height: 0.8;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.08);
          pointer-events: none;
        }

        .atlas-copy {
          position: relative;
          z-index: 1;
          max-width: 34rem;
        }

        .atlas-idx {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.38);
          margin-bottom: 0.7rem;
        }

        h3 {
          margin: 0 0 1rem;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(3rem, 6vw, 5.4rem);
          font-weight: 300;
          letter-spacing: -0.03em;
          line-height: 0.92;
        }

        p {
          margin: 0 0 1.4rem;
          color: rgba(255, 255, 255, 0.52);
          line-height: 1.65;
          max-width: 28rem;
        }

        ul {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        li {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.16);
          padding: 0.38rem 0.7rem;
        }

        .atlas-ticks {
          width: min(1280px, calc(100% - 5rem));
          margin: 1.4rem auto 0;
          display: flex;
          gap: 0.4rem;
        }

        .atlas-ticks span {
          display: block;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          position: relative;
        }

        .atlas-ticks span.on {
          background: #fff;
        }

        @media (max-width: 768px) {
          .atlas-pin {
            padding: 4rem 0 3rem;
            min-height: auto;
          }
          .atlas-bar {
            width: calc(100% - 2rem);
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }
          .atlas-track {
            display: grid;
            width: 100%;
            padding: 0 1rem;
            gap: 1rem;
          }
          .atlas-panel {
            width: 100%;
            height: auto;
            min-height: 22rem;
            padding: 2rem 1.4rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Industries;
