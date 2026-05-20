import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Case = {
  index: string;
  industry: string;
  caption: string;
  promise: string;
  judgment: string;
  proof: { value: string; label: string }[];
  note: string;
};

const CASES: Case[] = [
  {
    index: "01",
    industry: "Healthcare",
    caption: "the patient is the deadline",
    promise:
      "A patient should not have to repeat their own story to be seen. The promise is a single, calm path from arrival to answer.",
    judgment:
      "I draw the line between what the clinician owns and what the front desk owns, then make sure the record moves between them without a phone call. Most of the work is in the handoff, not the screen.",
    proof: [
      { value: "−38%", label: "Time from arrival to first decision" },
      { value: "1", label: "Record of truth, across departments" },
      { value: "0", label: "Manual re-entries at handoff" },
    ],
    note: "Regional health system, multi-site rollout",
  },
  {
    index: "02",
    industry: "Banking",
    caption: "the regulator reads everything",
    promise:
      "Approve a customer in seconds and still be able to explain that decision a year later, line by line, without anyone losing sleep.",
    judgment:
      "Speed is cheap; defensibility is the work. I pin every decision to a signed reason, keep the audit trail boring, and let the business move faster because the paperwork moved with it.",
    proof: [
      { value: "<2s", label: "Decision latency at the desk" },
      { value: "100%", label: "Decisions with a written reason" },
      { value: "9 yr", label: "Trail retained without surprises" },
    ],
    note: "Mid-market bank, lending and onboarding",
  },
  {
    index: "03",
    industry: "Retail",
    caption: "the seam is where the money leaks",
    promise:
      "One promise to the shopper across store, warehouse, app, and returns desk — even when four different teams are answering the phone.",
    judgment:
      "I treat ownership of the order, not the order itself, as the asset. When the customer moves between channels, the order does too, with the same name on it. The teams stop arguing because the work stops being ambiguous.",
    proof: [
      { value: "+22%", label: "Same-day fulfilment rate" },
      { value: "−61%", label: "Disputed returns" },
      { value: "1", label: "Owner per order, end to end" },
    ],
    note: "National retailer, omnichannel re-anchor",
  },
  {
    index: "04",
    industry: "Public sector",
    caption: "outcomes have to work in daylight",
    promise:
      "A program a citizen can actually feel — they qualify, they reach it, they get a result, and a journalist can describe it in plain language.",
    judgment:
      "I write the service path the way a case worker would tell it to a neighbour, then build only what that sentence needs. Everything that does not survive being read aloud gets cut before it gets funded.",
    proof: [
      { value: "−47%", label: "Median time to determination" },
      { value: "3x", label: "Channels reaching one outcome" },
      { value: "0", label: "Cases lost between agencies" },
    ],
    note: "State-level benefits modernisation",
  },
];

export const ClaudeRecovery01 = () => {
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
          ".cl-eyebrow, .cl-title__line, .cl-lede, .cl-row, .cl-rule, .cl-foot",
          { autoAlpha: 1, x: 0, y: 0 },
        );
        return;
      }

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      intro
        .fromTo(
          ".cl-eyebrow",
          { autoAlpha: 0, x: -20 },
          { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out" },
        )
        .fromTo(
          ".cl-title__line",
          { autoAlpha: 0, y: "110%" },
          {
            autoAlpha: 1,
            y: "0%",
            duration: 0.9,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.2",
        )
        .fromTo(
          ".cl-lede",
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out" },
          "-=0.45",
        );

      gsap.utils.toArray<HTMLElement>(".cl-row").forEach((row) => {
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
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.fromTo(
        ".cl-foot",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cl-foot",
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="practice" className="caseledger">
      <div className="cl-inner">
        <header className="cl-head">
          <div className="cl-eyebrow">
            <span>01</span>
            <span className="cl-eyebrow__rule" />
            <span>Practice</span>
          </div>
          <p className="cl-meta">
            A case ledger &middot; four industries, in plain words
          </p>
        </header>

        <div className="cl-headline">
          <h2 className="cl-title">
            <span className="cl-title__mask">
              <span className="cl-title__line">Four industries.</span>
            </span>
            <span className="cl-title__mask cl-title__mask--shift">
              <span className="cl-title__line cl-title__line--alt">
                One promise each.
              </span>
            </span>
          </h2>
          <p className="cl-lede">
            I&apos;m Sai Kiran. I work where the business decision and the
            service path meet. Each entry below is a real engagement reduced to
            three lines: the promise the business made, the judgment call I
            made on their behalf, and the proof it held.
          </p>
        </div>

        <div className="cl-table" role="list">
          {CASES.map((c, i) => (
            <article
              key={c.index}
              role="listitem"
              className="cl-row"
              aria-label={`${c.index} — ${c.industry}`}
            >
              <header className="cl-row__head">
                <span className="cl-row__index">{c.index}</span>
                <div className="cl-row__title">
                  <h3 className="cl-row__industry">{c.industry}</h3>
                  <p className="cl-row__caption">{c.caption}</p>
                </div>
                <span className="cl-row__note" aria-hidden="true">
                  {c.note}
                </span>
              </header>

              <div className="cl-row__body">
                <div className="cl-cell">
                  <span className="cl-cell__label">The promise</span>
                  <p className="cl-cell__text">{c.promise}</p>
                </div>
                <div className="cl-cell cl-cell--mid">
                  <span className="cl-cell__label">My judgment</span>
                  <p className="cl-cell__text">{c.judgment}</p>
                </div>
                <div className="cl-cell">
                  <span className="cl-cell__label">What it proved</span>
                  <ul className="cl-cell__proof">
                    {c.proof.map((p) => (
                      <li key={p.label}>
                        <span className="cl-cell__value">{p.value}</span>
                        <span className="cl-cell__caption">{p.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {i < CASES.length - 1 && (
                <span className="cl-rule" aria-hidden="true" />
              )}
            </article>
          ))}
        </div>

        <footer className="cl-foot">
          <span className="cl-foot__sig">&mdash; Sai Kiran</span>
          <span className="cl-foot__line" />
          <span className="cl-foot__caption">
            Each row is real. Names are kept quiet on purpose.
          </span>
        </footer>
      </div>

      <style jsx>{`
        .caseledger {
          position: relative;
          z-index: 2;
          overflow: hidden;
          color: #fff;
          background: linear-gradient(
            180deg,
            #000 0%,
            #060606 50%,
            #000 100%
          );
          isolation: isolate;
        }

        .caseledger::before {
          position: absolute;
          inset: 0;
          content: "";
          background:
            radial-gradient(
              60% 40% at 18% 12%,
              rgba(255, 255, 255, 0.04),
              transparent 65%
            ),
            radial-gradient(
              50% 40% at 82% 92%,
              rgba(255, 255, 255, 0.03),
              transparent 65%
            );
          pointer-events: none;
        }

        .cl-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 1280px);
          margin: 0 auto;
          padding: clamp(4.5rem, 8vw, 8rem) clamp(1.25rem, 5vw, 5rem)
            clamp(5rem, 7vw, 7rem);
        }

        .cl-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: clamp(2.4rem, 4.5vw, 4rem);
        }

        .cl-eyebrow {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.74);
          letter-spacing: 0.14em;
          will-change: transform, opacity;
        }

        .cl-eyebrow__rule {
          display: block;
          width: min(11vw, 140px);
          height: 1px;
          background: rgba(255, 255, 255, 0.32);
        }

        .cl-meta {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.46);
        }

        .cl-headline {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
          padding-bottom: clamp(3rem, 6vw, 5rem);
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }

        .cl-title {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(2.6rem, 5.6vw, 5.6rem);
          line-height: 1;
          letter-spacing: -0.012em;
        }

        .cl-title__mask {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }

        .cl-title__mask--shift {
          padding-left: clamp(0rem, 5vw, 5rem);
        }

        .cl-title__line {
          display: block;
          will-change: transform, opacity;
        }

        .cl-title__line--alt {
          font-style: italic;
          color: rgba(255, 255, 255, 0.74);
        }

        .cl-lede {
          max-width: 46ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: clamp(1rem, 1.3vw, 1.15rem);
          line-height: 1.7;
          will-change: transform, opacity;
        }

        .cl-table {
          display: flex;
          flex-direction: column;
        }

        .cl-row {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(1.4rem, 2.6vw, 2.2rem);
          padding: clamp(2rem, 4vw, 3.2rem) 0;
          will-change: transform, opacity;
        }

        .cl-row:first-child {
          padding-top: 0;
        }

        .cl-row__head {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: baseline;
          gap: clamp(1rem, 2vw, 2rem);
        }

        .cl-row__index {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: clamp(0.78rem, 1vw, 0.9rem);
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.55);
        }

        .cl-row__title {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .cl-row__industry {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(1.8rem, 3.2vw, 2.8rem);
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: rgba(255, 255, 255, 0.96);
        }

        .cl-row__caption {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-style: italic;
          font-size: clamp(0.95rem, 1.2vw, 1.1rem);
          color: rgba(255, 255, 255, 0.55);
          letter-spacing: 0.005em;
        }

        .cl-row__note {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.4);
          text-align: right;
          white-space: nowrap;
        }

        .cl-row__body {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1.4rem, 2.8vw, 2.6rem);
          padding-left: clamp(0rem, 4vw, 3.2rem);
        }

        .cl-cell {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .cl-cell--mid {
          position: relative;
        }

        .cl-cell--mid::before,
        .cl-cell--mid::after {
          position: absolute;
          top: 0.2rem;
          bottom: 0.2rem;
          width: 1px;
          background: rgba(255, 255, 255, 0.1);
          content: "";
        }

        .cl-cell--mid::before {
          left: calc(clamp(1.4rem, 2.8vw, 2.6rem) * -0.5);
        }

        .cl-cell--mid::after {
          right: calc(clamp(1.4rem, 2.8vw, 2.6rem) * -0.5);
        }

        .cl-cell__label {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.45);
        }

        .cl-cell__text {
          margin: 0;
          color: rgba(255, 255, 255, 0.84);
          font-size: clamp(0.95rem, 1.1vw, 1.04rem);
          line-height: 1.66;
        }

        .cl-cell__proof {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .cl-cell__proof li {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: baseline;
          gap: 0.9rem;
          padding-bottom: 0.7rem;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
        }

        .cl-cell__proof li:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }

        .cl-cell__value {
          font-family: var(--font-heading, serif);
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          font-weight: 400;
          line-height: 1;
          color: rgba(255, 255, 255, 0.96);
          letter-spacing: -0.01em;
          font-variant-numeric: tabular-nums;
        }

        .cl-cell__caption {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.4;
        }

        .cl-rule {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.02),
            rgba(255, 255, 255, 0.18) 18%,
            rgba(255, 255, 255, 0.18) 82%,
            rgba(255, 255, 255, 0.02)
          );
          pointer-events: none;
        }

        .cl-foot {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-top: clamp(2.5rem, 5vw, 4rem);
          padding-top: clamp(1.6rem, 3vw, 2.4rem);
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.55);
          will-change: transform, opacity;
        }

        .cl-foot__sig {
          color: rgba(255, 255, 255, 0.92);
        }

        .cl-foot__line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.16);
        }

        @media (max-width: 1024px) {
          .cl-headline {
            grid-template-columns: 1fr;
            gap: 1.4rem;
            align-items: start;
          }

          .cl-row__body {
            grid-template-columns: 1fr;
            gap: 1.6rem;
            padding-left: 0;
          }

          .cl-cell--mid::before,
          .cl-cell--mid::after {
            display: none;
          }

          .cl-cell--mid {
            padding: 1.4rem 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            gap: 0.7rem;
          }
        }

        @media (max-width: 720px) {
          .cl-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }

          .cl-title__mask--shift {
            padding-left: 0;
          }

          .cl-row__head {
            grid-template-columns: auto minmax(0, 1fr);
            row-gap: 0.5rem;
          }

          .cl-row__note {
            grid-column: 1 / -1;
            text-align: left;
            white-space: normal;
            color: rgba(255, 255, 255, 0.45);
          }

          .cl-foot {
            flex-wrap: wrap;
          }

          .cl-foot__line {
            order: 3;
            flex-basis: 100%;
          }
        }

        @media (max-width: 480px) {
          .cl-title {
            font-size: clamp(2.4rem, 12vw, 4rem);
          }

          .cl-row__industry {
            font-size: clamp(1.6rem, 8vw, 2.2rem);
          }
        }
      `}</style>
    </section>
  );
};

export default ClaudeRecovery01;
