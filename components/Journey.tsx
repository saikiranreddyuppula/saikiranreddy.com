import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { journey } from "../lib/content";

gsap.registerPlugin(ScrollTrigger);

const altitudes = ["1 200 m", "2 800 m", "4 200 m"];

const Journey = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".jn-rule-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".jn-trail",
            start: "top 70%",
            end: "bottom 40%",
            scrub: 0.4,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".jn-stop").forEach((stop, i) => {
        gsap.fromTo(
          stop,
          { opacity: 0, x: i % 2 === 0 ? -28 : 28 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: stop, start: "top 82%" },
          },
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="journey" className="jn">
      <div className="jn-wrap">
        <div className="jn-kicker">
          <span>03</span>
          <i />
          <span>Ascent</span>
        </div>
        <h2>
          The climb is the work.
          <em> Patience, then altitude.</em>
        </h2>

        <div className="jn-trail">
          <div className="jn-rule" aria-hidden>
            <span className="jn-rule-fill" />
          </div>

          {journey.map((item, i) => (
            <article
              key={item.stage}
              className={`jn-stop ${i % 2 === 0 ? "left" : "right"}`}
            >
              <div className="jn-node" aria-hidden />
              <div className="jn-card">
                <div className="jn-meta">
                  <span>{item.stage}</span>
                  <span>{altitudes[i]}</span>
                  <span>{item.year}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .jn {
          position: relative;
          z-index: 2;
          background: #000;
          color: #fff;
          padding: 8rem 0 7rem;
        }

        .jn-wrap {
          width: min(980px, calc(100% - 5rem));
          margin: 0 auto;
        }

        .jn-kicker {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }

        .jn-kicker i {
          width: 36px;
          height: 1px;
          background: rgba(255, 255, 255, 0.28);
        }

        h2 {
          margin: 0 0 4.5rem;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(2.6rem, 5.5vw, 4.6rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.03em;
        }

        h2 em {
          display: block;
          font-style: italic;
          color: rgba(255, 255, 255, 0.42);
        }

        .jn-trail {
          position: relative;
          display: grid;
          gap: 4.5rem;
          padding: 1rem 0 2rem;
        }

        .jn-rule {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(-50%);
        }

        .jn-rule-fill {
          position: absolute;
          inset: 0;
          background: #fff;
          transform-origin: top center;
          transform: scaleY(0);
        }

        .jn-stop {
          position: relative;
          width: min(42%, 26rem);
        }

        .jn-stop.left {
          justify-self: start;
          text-align: right;
        }

        .jn-stop.right {
          justify-self: end;
        }

        .jn-node {
          position: absolute;
          top: 0.55rem;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 6px #000, 0 0 24px rgba(255, 255, 255, 0.35);
        }

        .left .jn-node {
          right: calc(-50% - 4.5px);
        }

        .right .jn-node {
          left: calc(-50% - 4.5px);
        }

        .jn-meta {
          display: flex;
          gap: 1rem;
          justify-content: inherit;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
          margin-bottom: 0.7rem;
        }

        .left .jn-meta {
          justify-content: flex-end;
        }

        h3 {
          margin: 0 0 0.6rem;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(2rem, 3.4vw, 2.8rem);
          font-weight: 300;
        }

        p {
          margin: 0;
          color: rgba(255, 255, 255, 0.48);
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .jn-wrap {
            width: calc(100% - 2rem);
          }
          .jn-rule {
            left: 0.4rem;
          }
          .jn-stop,
          .jn-stop.left,
          .jn-stop.right {
            width: calc(100% - 1.8rem);
            justify-self: end;
            text-align: left;
          }
          .left .jn-meta,
          .right .jn-meta {
            justify-content: flex-start;
            flex-wrap: wrap;
          }
          .left .jn-node,
          .right .jn-node {
            left: -1.7rem;
            right: auto;
          }
        }
      `}</style>
    </section>
  );
};

export default Journey;
