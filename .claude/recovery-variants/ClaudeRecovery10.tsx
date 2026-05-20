import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Judgment = {
  index: string;
  industry: string;
  year: string;
  decision: string;
  situation: string;
  cost: string;
  promise: string;
  proof: string;
};

const JUDGMENTS: Judgment[] = [
  {
    index: "01",
    industry: "Healthcare",
    year: "Hospital network",
    decision: "The patient never has to ask twice.",
    situation:
      "Intake and claims barely spoke. The patient was carrying the gap between two desks. I moved the seam so a single team owned the question — even the parts that used to belong to the other side.",
    cost: "The claims team absorbed the work the front desk used to push downstream.",
    promise: "The Chief Operating Officer. One name on the wall, not a committee.",
    proof: "Re-asks fell from four per case to under one. Time-to-eligibility cut by half.",
  },
  {
    index: "02",
    industry: "Banking",
    year: "Retail bank, pre-audit",
    decision: "Every decision that moves money is re-readable a year later, by a stranger.",
    situation:
      "The regulator was coming. The fast answer was a vault of evidence. The honest answer was that we should never need a vault. So I made the trail of a decision part of the decision itself.",
    cost: "Quarter-one velocity. Features shipped slower for ninety days, then much faster.",
    promise: "The Chief Risk Officer, in writing, to the board.",
    proof: "The audit cycle went from six weeks of evidence-gathering to two days of retrieval.",
  },
  {
    index: "03",
    industry: "Retail",
    year: "National chain",
    decision: "The handoff between channels is the product.",
    situation:
      "Stores, the warehouse, the app, the returns desk — four good teams that each finished their half on time, while the customer waited in between. I treated the seam as the unit of work, not the team.",
    cost: "Store managers. They now own the seam, not the warehouse.",
    promise: "The VP of Customer Operations, named on the customer-facing receipt.",
    proof: "Returns abandonment fell by a third. The seam became the number reviewed at exec, not the store.",
  },
  {
    index: "04",
    industry: "Public sector",
    year: "Benefits program",
    decision: "The thing being designed is not the form. It is the wait.",
    situation:
      "Eligibility was measured in weeks. Every rule change pushed the wait further. I designed for the rule that would change next year, not the form that was sitting on the desk this year.",
    cost: "The caseworker, who carries the rule-change cycle inside the queue.",
    promise: "The program director, named in the legislative record.",
    proof: "Determination window cut from twenty-three days to under seven. Read aloud at a public hearing.",
  },
];

export const ClaudeRecovery10 = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          ".jr-label, .jr-title__line, .jr-lede, .jr-row, .jr-coda, .jr-foot",
          { autoAlpha: 1, x: 0, y: 0 },
        );
        return;
      }

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      intro
        .fromTo(
          ".jr-label",
          { autoAlpha: 0, x: -18 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.55,
            ease: "power3.out",
            immediateRender: false,
          },
        )
        .fromTo(
          ".jr-title__line",
          { autoAlpha: 0, y: "115%" },
          {
            autoAlpha: 1,
            y: "0%",
            duration: 0.9,
            stagger: 0.1,
            ease: "power4.out",
            immediateRender: false,
          },
          "-=0.2",
        )
        .fromTo(
          ".jr-lede",
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.45",
        )
        .fromTo(
          ".jr-rule",
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.55",
        );

      gsap.utils.toArray<HTMLElement>(".jr-row").forEach((row, i) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
            delay: (i % 2) * 0.04,
            immediateRender: false,
          },
        );
      });

      gsap.fromTo(
        ".jr-coda",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".jr-coda",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          immediateRender: false,
        },
      );

      gsap.fromTo(
        ".jr-foot",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".jr-foot",
            start: "top 94%",
            toggleActions: "play none none reverse",
          },
          immediateRender: false,
        },
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="practice" className="judgment-index">
      <div className="jr-inner">
        <header className="jr-head">
          <div className="jr-label">
            <span>01</span>
            <span className="jr-label__line" aria-hidden="true" />
            <span>Practice</span>
          </div>
          <p className="jr-kicker">
            an index of judgments &middot; the calls behind the work
          </p>
        </header>

        <div className="jr-headline">
          <h2 className="jr-title">
            <span className="jr-title__mask">
              <span className="jr-title__line">What I decide,</span>
            </span>
            <span className="jr-title__mask jr-title__mask--shift">
              <span className="jr-title__line jr-title__line--alt">
                and who carries it.
              </span>
            </span>
          </h2>
          <p className="jr-lede">
            I&apos;m Sai Kiran. Below are four calls I&apos;ve made for four
            different rooms &mdash; healthcare, banking, retail, and a public
            program. Each one is written the way I think about it before the
            first build: a decision, who absorbs its cost, who owns the
            promise out loud, and the single thing that proved the call was
            right.
          </p>
        </div>

        <div className="jr-meta" aria-hidden="true">
          <span>The Index</span>
          <span className="jr-meta__dot">&middot;</span>
          <span>Four entries</span>
          <span className="jr-meta__dot">&middot;</span>
          <span>First person</span>
        </div>

        <div className="jr-rule" aria-hidden="true" />

        <ol className="jr-list" aria-label="An ordered index of architectural judgments">
          {JUDGMENTS.map((j) => (
            <li key={j.index} className="jr-row">
              <div className="jr-row__chrome">
                <span className="jr-row__num">{j.index}</span>
                <span className="jr-row__industry">{j.industry}</span>
                <span className="jr-row__dash" aria-hidden="true" />
                <span className="jr-row__year">{j.year}</span>
              </div>

              <div className="jr-row__body">
                <div className="jr-row__left">
                  <p className="jr-row__decision">
                    <span className="jr-row__mark" aria-hidden="true">
                      &ldquo;
                    </span>
                    {j.decision}
                  </p>
                  <p className="jr-row__situation">{j.situation}</p>
                </div>

                <dl className="jr-row__ledger">
                  <div className="jr-cell">
                    <dt>Cost carried by</dt>
                    <dd>{j.cost}</dd>
                  </div>
                  <div className="jr-cell">
                    <dt>Promise owned by</dt>
                    <dd>{j.promise}</dd>
                  </div>
                  <div className="jr-cell jr-cell--proof">
                    <dt>Proven by</dt>
                    <dd>{j.proof}</dd>
                  </div>
                </dl>
              </div>

              <span className="jr-row__edge" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <aside className="jr-coda" aria-label="A closing note on how I read the index">
          <p className="jr-coda__lead">A note on reading this.</p>
          <p className="jr-coda__body">
            The decision is the part most people remember. The cost is the
            part that gets argued about a year in. The promise is the part
            that has to survive a change of leadership. The proof is the
            number that ends the meeting. I want all four on the same page,
            so the call can be judged honestly &mdash; not just by what got
            built, but by who has been holding it ever since.
          </p>
        </aside>

        <footer className="jr-foot">
          <span className="jr-foot__sig">&mdash; Sai Kiran</span>
          <span className="jr-foot__line" aria-hidden="true" />
          <span className="jr-foot__caption">
            Eight years. Four rooms. One way of deciding.
          </span>
        </footer>
      </div>

      <style jsx>{`
        .judgment-index {
          position: relative;
          z-index: 2;
          overflow: hidden;
          color: #fff;
          background:
            radial-gradient(
              80% 50% at 50% 0%,
              rgba(255, 255, 255, 0.04),
              transparent 60%
            ),
            linear-gradient(180deg, #000 0%, #060606 50%, #000 100%);
          isolation: isolate;
        }

        .judgment-index::before {
          position: absolute;
          inset: 0;
          content: "";
          background:
            linear-gradient(
              rgba(255, 255, 255, 0.022) 1px,
              transparent 1px
            );
          background-size: 100% 6px;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            #000 12%,
            #000 88%,
            transparent 100%
          );
          pointer-events: none;
          opacity: 0.55;
        }

        .jr-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 1320px);
          margin: 0 auto;
          padding: clamp(4rem, 7vw, 7rem) clamp(1.25rem, 5vw, 5rem)
            clamp(5rem, 7vw, 7rem);
        }

        .jr-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: clamp(2.4rem, 4.5vw, 4rem);
        }

        .jr-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.74);
        }

        .jr-label__line {
          display: block;
          width: min(11vw, 140px);
          height: 1px;
          background: rgba(255, 255, 255, 0.32);
        }

        .jr-kicker {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.46);
        }

        .jr-headline {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
          margin-bottom: clamp(1.6rem, 3.6vw, 2.6rem);
        }

        .jr-title {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(2.5rem, 5vw, 5.2rem);
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .jr-title__mask {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }

        .jr-title__mask--shift {
          padding-left: clamp(0rem, 4vw, 4rem);
        }

        .jr-title__line {
          display: block;
          will-change: transform, opacity;
        }

        .jr-title__line--alt {
          font-style: italic;
          color: rgba(255, 255, 255, 0.78);
        }

        .jr-lede {
          max-width: 48ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(1rem, 1.35vw, 1.16rem);
          line-height: 1.68;
        }

        .jr-meta {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          flex-wrap: wrap;
          margin: clamp(0.6rem, 1.4vw, 1rem) 0 0.9rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.42);
        }

        .jr-meta__dot {
          color: rgba(255, 255, 255, 0.28);
        }

        .jr-rule {
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.6),
            rgba(255, 255, 255, 0.08)
          );
          margin-bottom: clamp(0.6rem, 1.4vw, 1rem);
          transform-origin: left center;
        }

        .jr-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .jr-row {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(0.9rem, 1.6vw, 1.3rem);
          padding: clamp(1.6rem, 3vw, 2.6rem) 0
            clamp(1.6rem, 3vw, 2.6rem);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .jr-row:last-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
        }

        .jr-row__edge {
          position: absolute;
          left: 0;
          top: clamp(1.6rem, 3vw, 2.6rem);
          width: 1px;
          height: 28px;
          background: rgba(255, 255, 255, 0.65);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .jr-row:hover .jr-row__edge {
          opacity: 1;
        }

        .jr-row__chrome {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.6);
        }

        .jr-row__num {
          color: rgba(255, 255, 255, 0.92);
          letter-spacing: 0.18em;
        }

        .jr-row__industry {
          color: rgba(255, 255, 255, 0.88);
          letter-spacing: 0.22em;
        }

        .jr-row__dash {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.16);
          max-width: 280px;
        }

        .jr-row__year {
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.16em;
          text-align: right;
        }

        .jr-row__body {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
          gap: clamp(1.4rem, 3.4vw, 3.4rem);
          align-items: start;
        }

        .jr-row__left {
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
        }

        .jr-row__decision {
          position: relative;
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(1.5rem, 2.4vw, 2.05rem);
          line-height: 1.18;
          letter-spacing: -0.005em;
          color: rgba(255, 255, 255, 0.96);
        }

        .jr-row__mark {
          position: absolute;
          left: -0.55em;
          top: -0.05em;
          color: rgba(255, 255, 255, 0.28);
          font-size: 1.2em;
        }

        .jr-row__situation {
          margin: 0;
          max-width: 56ch;
          color: rgba(255, 255, 255, 0.66);
          font-size: clamp(0.95rem, 1.05vw, 1.02rem);
          line-height: 1.66;
        }

        .jr-row__ledger {
          margin: 0;
          padding: clamp(0.4rem, 1vw, 0.7rem) 0;
          display: flex;
          flex-direction: column;
          gap: clamp(0.7rem, 1.3vw, 1.05rem);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          padding-left: clamp(1rem, 2vw, 1.6rem);
        }

        .jr-cell {
          display: grid;
          grid-template-columns: minmax(0, 0.4fr) minmax(0, 1fr);
          gap: clamp(0.6rem, 1.2vw, 1rem);
          align-items: baseline;
        }

        .jr-cell dt {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.48);
        }

        .jr-cell dd {
          margin: 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: clamp(0.9rem, 1vw, 0.98rem);
          line-height: 1.5;
        }

        .jr-cell--proof dd {
          color: rgba(255, 255, 255, 0.95);
          font-family: var(--font-heading, serif);
          font-size: clamp(1.02rem, 1.18vw, 1.15rem);
          line-height: 1.4;
          letter-spacing: -0.005em;
        }

        .jr-coda {
          display: grid;
          grid-template-columns: minmax(0, 0.32fr) minmax(0, 1fr);
          gap: clamp(1.2rem, 3vw, 3rem);
          align-items: start;
          margin: clamp(2.8rem, 5vw, 4.4rem) 0 clamp(2rem, 4vw, 3rem);
          padding-top: clamp(1.2rem, 2.4vw, 1.8rem);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .jr-coda__lead {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.56);
        }

        .jr-coda__body {
          margin: 0;
          max-width: 64ch;
          color: rgba(255, 255, 255, 0.72);
          font-size: clamp(0.98rem, 1.18vw, 1.08rem);
          line-height: 1.7;
        }

        .jr-foot {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.56);
        }

        .jr-foot__sig {
          color: rgba(255, 255, 255, 0.92);
        }

        .jr-foot__line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.18);
        }

        @media (max-width: 1100px) {
          .jr-headline {
            grid-template-columns: 1fr;
            gap: 1.6rem;
            align-items: start;
          }

          .jr-row__body {
            grid-template-columns: 1fr;
            gap: 1.4rem;
          }

          .jr-row__ledger {
            border-left: 0;
            padding-left: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 1rem;
          }

          .jr-coda {
            grid-template-columns: 1fr;
            gap: 0.7rem;
          }
        }

        @media (max-width: 720px) {
          .jr-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }

          .jr-title__mask--shift {
            padding-left: 0;
          }

          .jr-row__chrome {
            flex-wrap: wrap;
            gap: 0.6rem 1rem;
          }

          .jr-row__dash {
            display: none;
          }

          .jr-cell {
            grid-template-columns: 1fr;
            gap: 0.25rem;
          }

          .jr-foot {
            flex-wrap: wrap;
          }

          .jr-foot__line {
            order: 3;
            flex-basis: 100%;
          }
        }

        @media (max-width: 480px) {
          .jr-title {
            font-size: clamp(2.4rem, 12vw, 4rem);
          }

          .jr-row__decision {
            font-size: clamp(1.35rem, 6.4vw, 1.8rem);
          }

          .jr-row__mark {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default ClaudeRecovery10;
