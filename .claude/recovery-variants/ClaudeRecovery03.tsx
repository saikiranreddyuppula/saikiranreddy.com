import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Row = {
  index: string;
  industry: string;
  setting: string;
  pressure: string;
  move: string;
  moveTag: string;
  proof: string;
  proofLabel: string;
};

const ROWS: Row[] = [
  {
    index: "I",
    industry: "Healthcare",
    setting: "a hospital network, four states",
    pressure:
      "Patients waited days for a callback because three departments each held one third of the answer and none of them owned the wait.",
    move: "I gave the wait a single owner and forced the three teams to settle their handoff in writing, not in meetings.",
    moveTag: "ownership before automation",
    proof: "callback time fell from 72h to under 6h",
    proofLabel: "after one quarter",
  },
  {
    index: "II",
    industry: "Banking",
    setting: "a retail lender under fresh regulator scrutiny",
    pressure:
      "Credit decisions were quick, but no one could reconstruct why a particular customer had been turned away nine months later.",
    move: "I redrew the decision path so every refusal carried the reason, the rulebook version, and the human who signed it.",
    moveTag: "auditable by default",
    proof: "regulator review closed without a finding",
    proofLabel: "first time in three cycles",
  },
  {
    index: "III",
    industry: "Retail",
    setting: "a national chain, store + warehouse + app",
    pressure:
      "Returns were the most expensive part of the business and the part no one wanted to own across the store, the warehouse, and the app.",
    move: "I treated the return as one promise to the customer, then split the cost of that promise across the three teams by where the goods actually sat.",
    moveTag: "one promise, three ledgers",
    proof: "return-loss reduced by 22%",
    proofLabel: "year over year",
  },
  {
    index: "IV",
    industry: "Public Sector",
    setting: "a state benefits programme",
    pressure:
      "Citizens were dropping out of the application halfway through because the eligibility rules lived in a 380-page handbook no front-line officer had time to read.",
    move: "I rewrote eligibility as a small set of plain-language decisions a caseworker could defend to the person sitting across the desk.",
    moveTag: "decisions a human can defend",
    proof: "completion rate rose from 41% to 78%",
    proofLabel: "within two release cycles",
  },
];

export const ClaudeRecovery03 = () => {
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
          ".bp-eyebrow, .bp-title__line, .bp-lede, .bp-colhead, .bp-row, .bp-foot, .bp-rule",
          { autoAlpha: 1, x: 0, y: 0, scaleX: 1 },
        );
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        ".bp-eyebrow",
        { autoAlpha: 0, x: -20 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.55,
          ease: "power3.out",
          immediateRender: false,
        },
      )
        .fromTo(
          ".bp-title__line",
          { autoAlpha: 0, y: "115%" },
          {
            autoAlpha: 1,
            y: "0%",
            duration: 0.95,
            stagger: 0.08,
            ease: "power4.out",
            immediateRender: false,
          },
          "-=0.15",
        )
        .fromTo(
          ".bp-lede",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.4",
        )
        .fromTo(
          ".bp-rule",
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.inOut",
            immediateRender: false,
          },
          "-=0.45",
        )
        .fromTo(
          ".bp-colhead",
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.5",
        )
        .fromTo(
          ".bp-row",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.3",
        )
        .fromTo(
          ".bp-foot",
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.2",
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="practice" className="boardproof">
      <div className="bp-inner">
        <header className="bp-head">
          <div className="bp-eyebrow">
            <span>01</span>
            <span className="bp-eyebrow__line" />
            <span>Practice</span>
          </div>
          <p className="bp-kicker">
            a personal portfolio &middot; selected work, in the room
          </p>
        </header>

        <div className="bp-headline">
          <h2 className="bp-title">
            <span className="bp-title__mask">
              <span className="bp-title__line">Four rooms.</span>
            </span>
            <span className="bp-title__mask bp-title__mask--shift">
              <span className="bp-title__line bp-title__line--alt">
                Four decisions I had to defend.
              </span>
            </span>
          </h2>
          <p className="bp-lede">
            I&apos;m Sai Kiran. Each row below is one engagement &mdash; the
            pressure the business was under when I walked in, the move I made
            that I had to defend to the people who paid for it, and the proof
            we left on the table.
          </p>
        </div>

        <span className="bp-rule" aria-hidden="true" />

        <div className="bp-table" role="table" aria-label="Selected engagements">
          <div className="bp-thead" role="rowgroup">
            <div className="bp-trow bp-trow--head" role="row">
              <div className="bp-colhead bp-col bp-col--idx" role="columnheader">
                <span className="bp-colhead__num">№</span>
              </div>
              <div className="bp-colhead bp-col bp-col--industry" role="columnheader">
                Industry
              </div>
              <div className="bp-colhead bp-col bp-col--pressure" role="columnheader">
                The pressure
              </div>
              <div className="bp-colhead bp-col bp-col--move" role="columnheader">
                My move
              </div>
              <div className="bp-colhead bp-col bp-col--proof" role="columnheader">
                Proof
              </div>
            </div>
          </div>

          <div className="bp-tbody" role="rowgroup">
            {ROWS.map((row) => (
              <article key={row.industry} className="bp-row" role="row">
                <div className="bp-col bp-col--idx" role="cell">
                  <span className="bp-idx__num">{row.index}</span>
                </div>

                <div className="bp-col bp-col--industry" role="cell">
                  <h3 className="bp-industry__name">{row.industry}</h3>
                  <p className="bp-industry__setting">{row.setting}</p>
                </div>

                <div className="bp-col bp-col--pressure" role="cell">
                  <p className="bp-pressure__text">{row.pressure}</p>
                </div>

                <div className="bp-col bp-col--move" role="cell">
                  <p className="bp-move__text">{row.move}</p>
                  <p className="bp-move__tag">&mdash; {row.moveTag}</p>
                </div>

                <div className="bp-col bp-col--proof" role="cell">
                  <p className="bp-proof__text">{row.proof}</p>
                  <p className="bp-proof__label">{row.proofLabel}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <footer className="bp-foot">
          <span className="bp-foot__sig">&mdash; Sai Kiran</span>
          <span className="bp-foot__line" />
          <span className="bp-foot__caption">
            Names withheld. Numbers on file. Available on request.
          </span>
        </footer>
      </div>

      <style jsx>{`
        .boardproof {
          position: relative;
          z-index: 2;
          overflow: hidden;
          color: #fff;
          background: linear-gradient(180deg, #000 0%, #060606 50%, #000 100%);
          isolation: isolate;
        }

        .boardproof::before {
          position: absolute;
          inset: 0;
          content: "";
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px);
          background-size: 100% 96px;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            #000 12%,
            #000 88%,
            transparent 100%
          );
          pointer-events: none;
        }

        .bp-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 1440px);
          margin: 0 auto;
          padding: clamp(4rem, 7vw, 7rem) clamp(1.25rem, 5vw, 5rem)
            clamp(5rem, 7vw, 7rem);
        }

        .bp-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: clamp(2.4rem, 4.5vw, 4rem);
        }

        .bp-eyebrow {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.74);
          letter-spacing: 0.08em;
        }

        .bp-eyebrow__line {
          display: block;
          width: min(11vw, 140px);
          height: 1px;
          background: rgba(255, 255, 255, 0.32);
        }

        .bp-kicker {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.46);
        }

        .bp-headline {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
          margin-bottom: clamp(2rem, 4vw, 3.4rem);
        }

        .bp-title {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(2.5rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .bp-title__mask {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }

        .bp-title__mask--shift {
          padding-left: clamp(0rem, 4vw, 4rem);
        }

        .bp-title__line {
          display: block;
          will-change: transform, opacity;
        }

        .bp-title__line--alt {
          font-style: italic;
          color: rgba(255, 255, 255, 0.78);
        }

        .bp-lede {
          max-width: 48ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(1rem, 1.35vw, 1.16rem);
          line-height: 1.68;
        }

        .bp-rule {
          display: block;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.32);
          margin-bottom: clamp(1.4rem, 2.4vw, 2rem);
          transform-origin: left center;
        }

        .bp-table {
          display: block;
          margin-bottom: clamp(2.4rem, 4.5vw, 3.6rem);
        }

        .bp-thead {
          display: block;
        }

        .bp-trow--head {
          padding: 0 0 clamp(0.9rem, 1.6vw, 1.2rem);
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
        }

        .bp-trow,
        .bp-row {
          display: grid;
          grid-template-columns:
            minmax(40px, 0.45fr)
            minmax(0, 1.2fr)
            minmax(0, 2fr)
            minmax(0, 2.2fr)
            minmax(0, 1.5fr);
          gap: clamp(1rem, 2.4vw, 2.4rem);
          align-items: baseline;
        }

        .bp-colhead {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.5);
        }

        .bp-colhead__num {
          opacity: 0.55;
        }

        .bp-tbody {
          display: block;
        }

        .bp-row {
          position: relative;
          align-items: baseline;
          padding: clamp(1.6rem, 3vw, 2.4rem) 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: background 0.4s ease;
        }

        .bp-row:last-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        }

        .bp-row::before {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          content: "";
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.025),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.45s ease;
          pointer-events: none;
        }

        .bp-row:hover::before {
          opacity: 1;
        }

        .bp-col {
          min-width: 0;
        }

        .bp-col--idx {
          font-family: var(--font-heading, serif);
          font-size: clamp(1rem, 1.3vw, 1.15rem);
          color: rgba(255, 255, 255, 0.42);
          letter-spacing: 0.04em;
          font-variant: small-caps;
        }

        .bp-idx__num {
          display: inline-block;
          font-style: italic;
        }

        .bp-industry__name {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(1.6rem, 2.4vw, 2.4rem);
          line-height: 1.05;
          color: rgba(255, 255, 255, 0.96);
          letter-spacing: -0.01em;
        }

        .bp-industry__setting {
          margin: 0.55rem 0 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.5);
        }

        .bp-pressure__text {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.02rem, 1.35vw, 1.18rem);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.78);
        }

        .bp-move__text {
          margin: 0;
          font-size: clamp(0.98rem, 1.25vw, 1.08rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.92);
        }

        .bp-move__tag {
          margin: 0.7rem 0 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.55);
        }

        .bp-proof__text {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(1.05rem, 1.45vw, 1.32rem);
          line-height: 1.3;
          color: #fff;
          letter-spacing: -0.005em;
        }

        .bp-proof__label {
          margin: 0.55rem 0 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.48);
        }

        .bp-foot {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.56);
        }

        .bp-foot__sig {
          color: rgba(255, 255, 255, 0.9);
        }

        .bp-foot__line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.18);
        }

        @media (max-width: 1100px) {
          .bp-headline {
            grid-template-columns: 1fr;
            gap: 1.6rem;
            align-items: start;
          }

          .bp-trow,
          .bp-row {
            grid-template-columns:
              minmax(36px, 0.4fr)
              minmax(0, 1.1fr)
              minmax(0, 1.8fr)
              minmax(0, 2fr)
              minmax(0, 1.4fr);
            gap: clamp(0.9rem, 2vw, 1.6rem);
          }
        }

        @media (max-width: 880px) {
          .bp-trow--head {
            display: none;
          }

          .bp-row {
            grid-template-columns: 1fr;
            gap: 0.9rem;
            padding: clamp(1.6rem, 4vw, 2.2rem) 0;
          }

          .bp-col--idx {
            order: 0;
            display: flex;
            align-items: center;
            gap: 0.8rem;
          }

          .bp-col--idx::after {
            content: "";
            flex: 1;
            height: 1px;
            background: rgba(255, 255, 255, 0.14);
          }

          .bp-col--industry {
            order: 1;
          }

          .bp-col--pressure {
            order: 2;
          }

          .bp-col--move {
            order: 3;
          }

          .bp-col--proof {
            order: 4;
            padding-top: 0.2rem;
            border-top: 1px dashed rgba(255, 255, 255, 0.12);
            padding-top: 0.9rem;
          }
        }

        @media (max-width: 760px) {
          .bp-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }

          .bp-title__mask--shift {
            padding-left: 0;
          }

          .bp-foot {
            flex-wrap: wrap;
          }

          .bp-foot__line {
            order: 3;
            flex-basis: 100%;
          }
        }

        @media (max-width: 480px) {
          .bp-title {
            font-size: clamp(2.4rem, 12vw, 4rem);
          }
        }
      `}</style>
    </section>
  );
};

export default ClaudeRecovery03;
