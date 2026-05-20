import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type CaseFile = {
  no: string;
  industry: string;
  title: string;
  brief: string;
  stakes: string;
  constraints: string;
  call: string;
  outcome: string;
  outcomeMetric: string;
  outcomeMetricLabel: string;
  role: string;
  year: string;
};

const FILES: CaseFile[] = [
  {
    no: "01",
    industry: "Healthcare",
    title: "A claim that finally clears.",
    brief:
      "A regional payer was bleeding hours on disputes that should have settled inside a week. Clinical notes, eligibility, and adjudication each lived in their own office, and none of them spoke to the member.",
    stakes:
      "Four million dollars of float sitting unresolved each quarter, and a member-facing call center taking the heat for a decision it could not see.",
    constraints:
      "A regulator review already on the calendar. No room to retrain operations during open enrollment. Two leaders quietly disagreeing about who owned the answer.",
    call:
      "Rebuild the ownership map before touching a workflow. Eligibility became the single source of truth, even though it meant pushing back on the team that wanted to keep it.",
    outcome:
      "Dispute resolution moved from 19 days to 6. The float number stopped being a quarterly board topic, and the call center finally had something to read out loud.",
    outcomeMetric: "19 → 6 days",
    outcomeMetricLabel: "Dispute resolution time",
    role: "Lead architect · payer operations",
    year: "2022",
  },
  {
    no: "02",
    industry: "Banking",
    title: "The decision we can defend a year later.",
    brief:
      "A mid-market lender wanted to underwrite faster. The credit committee wanted every yes and every no to be explainable on paper, to a stranger, twelve months after the fact.",
    stakes:
      "Two regulatory cycles away from a formal review. Speed without a paper trail was never going to clear the room.",
    constraints:
      "A fourteen-year-old core that nobody wanted to touch. Two product lines mid-launch. A committee that met fortnightly and read everything twice.",
    call:
      "Treat the credit memo as the contract, not the system. The decision had to read the same way to the analyst writing it, the auditor reviewing it, and the customer hearing it.",
    outcome:
      "Time-to-decision down 41%. Zero adverse findings in the next audit, with the audit team naming the memo trail as a strength rather than a risk.",
    outcomeMetric: "−41%",
    outcomeMetricLabel: "Time to credit decision",
    role: "Architect · credit & risk",
    year: "2023",
  },
  {
    no: "03",
    industry: "Retail",
    title: "Returns the store can keep up with.",
    brief:
      "A national specialty retailer had online returns piling up faster than stores could process them. Customers walking into two different doors were getting two different answers.",
    stakes:
      "A nine-point drop in repeat purchase among customers who had returned even once. A finance team already drafting a write-down memo for the next quarter.",
    constraints:
      "A unionised in-store workforce, a peak season eight weeks out, and a CFO who was uninterested in absorbing another inventory hit to fix the experience.",
    call:
      "Put the store associate in charge of the answer, not the system behind them. Move the rules to where the customer actually stands, and let the rest catch up.",
    outcome:
      "Returns-related contact volume fell 34%. Repeat purchase among returners recovered within two quarters, and the write-down memo was quietly shelved.",
    outcomeMetric: "−34%",
    outcomeMetricLabel: "Returns-related contact volume",
    role: "Practice lead · customer operations",
    year: "2024",
  },
  {
    no: "04",
    industry: "Public Sector",
    title: "A benefit that reaches the person it was written for.",
    brief:
      "A state agency ran a benefit with strong eligibility on paper and weak take-up in the field. The people who qualified often started the application and quietly stopped.",
    stakes:
      "A program facing a legislative review with enrollment numbers that did not justify the next funding line. A waiting list nobody wanted to read out loud.",
    constraints:
      "Eight county offices, no shared case management, and a published service standard that could not move. A program rule book the agency was not willing to rewrite.",
    call:
      "Treat the application as a conversation owned by one caseworker, end-to-end. Keep the rules. Change who holds the thread between the first visit and the answer.",
    outcome:
      "Completed applications up 62% in twelve months. The program kept its funding line in the next session, with the agency cited by name in the committee report.",
    outcomeMetric: "+62%",
    outcomeMetricLabel: "Completed applications",
    role: "Engagement lead · agency delivery",
    year: "2025",
  },
];

export const ClaudeRecovery02 = () => {
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
          ".caw-label, .caw-title__line, .caw-lede, .caw-file, .caw-foot, .caw-strip__item",
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
          ".caw-label",
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
          ".caw-title__line",
          { autoAlpha: 0, y: "115%" },
          {
            autoAlpha: 1,
            y: "0%",
            duration: 0.9,
            stagger: 0.09,
            ease: "power4.out",
            immediateRender: false,
          },
          "-=0.2",
        )
        .fromTo(
          ".caw-lede",
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.4",
        )
        .fromTo(
          ".caw-file",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.35",
        )
        .fromTo(
          ".caw-strip__item",
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.4",
        )
        .fromTo(
          ".caw-foot",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.3",
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="practice" className="casewall">
      <div className="caw-inner">
        <header className="caw-head">
          <div className="caw-label">
            <span>02</span>
            <span className="caw-label__line" />
            <span>Practice · Case archive</span>
          </div>
          <p className="caw-kicker">
            a personal portfolio &middot; four files, off the shelf
          </p>
        </header>

        <div className="caw-headline">
          <h2 className="caw-title">
            <span className="caw-title__mask">
              <span className="caw-title__line">Cases, off the shelf.</span>
            </span>
            <span className="caw-title__mask caw-title__mask--shift">
              <span className="caw-title__line caw-title__line--alt">
                Same questions, four industries.
              </span>
            </span>
          </h2>
          <p className="caw-lede">
            I&apos;m Sai Kiran. These are four files I keep on the desk — one
            from healthcare, one from banking, one from retail, one from the
            public sector. Each one is a problem someone was paying real money
            to solve, the constraint that made it hard, the call I made, and
            the number it moved.
          </p>
        </div>

        <div className="caw-wall" role="list">
          {FILES.map((file, idx) => (
            <FileSlab key={file.no} file={file} position={idx} />
          ))}
        </div>

        <aside className="caw-strip" aria-label="What the four cases share">
          <span className="caw-strip__label">Across the four</span>
          <ul className="caw-strip__list">
            <li className="caw-strip__item">
              <span className="caw-strip__value">4</span>
              <span className="caw-strip__caption">Regulated industries</span>
            </li>
            <li className="caw-strip__item">
              <span className="caw-strip__value">8+</span>
              <span className="caw-strip__caption">Years on the desk</span>
            </li>
            <li className="caw-strip__item">
              <span className="caw-strip__value">Every file</span>
              <span className="caw-strip__caption">Moved a board number</span>
            </li>
          </ul>
        </aside>

        <footer className="caw-foot">
          <span className="caw-foot__sig">&mdash; Sai Kiran</span>
          <span className="caw-foot__line" />
          <span className="caw-foot__caption">
            Real engagements. Numbers paraphrased where the room asked.
          </span>
        </footer>
      </div>

      <style jsx>{`
        .casewall {
          position: relative;
          z-index: 2;
          overflow: hidden;
          color: #fff;
          background:
            radial-gradient(
              80% 60% at 50% 30%,
              rgba(255, 255, 255, 0.04),
              transparent 60%
            ),
            linear-gradient(180deg, #000 0%, #060606 50%, #000 100%);
          isolation: isolate;
        }

        .casewall::before {
          position: absolute;
          inset: 0;
          content: "";
          background:
            linear-gradient(
              rgba(255, 255, 255, 0.028) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px
            );
          background-size: 96px 96px;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            #000 14%,
            #000 86%,
            transparent 100%
          );
          pointer-events: none;
        }

        .caw-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 1440px);
          margin: 0 auto;
          padding: clamp(4rem, 7vw, 7rem) clamp(1.25rem, 5vw, 5rem)
            clamp(5rem, 7vw, 7rem);
        }

        .caw-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: clamp(2.4rem, 4.5vw, 4rem);
        }

        .caw-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.74);
          letter-spacing: 0.08em;
        }

        .caw-label__line {
          display: block;
          width: min(11vw, 140px);
          height: 1px;
          background: rgba(255, 255, 255, 0.32);
        }

        .caw-kicker {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.46);
        }

        .caw-headline {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
          margin-bottom: clamp(2.8rem, 5vw, 4.4rem);
        }

        .caw-title {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(2.5rem, 5vw, 5.2rem);
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .caw-title__mask {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }

        .caw-title__mask--shift {
          padding-left: clamp(0rem, 4vw, 4rem);
        }

        .caw-title__line {
          display: block;
          will-change: transform, opacity;
        }

        .caw-title__line--alt {
          font-style: italic;
          color: rgba(255, 255, 255, 0.78);
        }

        .caw-lede {
          max-width: 48ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(1rem, 1.35vw, 1.16rem);
          line-height: 1.68;
        }

        .caw-wall {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(1rem, 2.2vw, 1.8rem);
          align-items: stretch;
          margin-bottom: clamp(2.4rem, 5vw, 4rem);
        }

        .caw-strip {
          display: flex;
          align-items: center;
          gap: clamp(1.2rem, 3vw, 2.4rem);
          margin-bottom: clamp(2rem, 4vw, 3rem);
          padding: clamp(1rem, 2vw, 1.6rem) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .caw-strip__label {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.5);
          white-space: nowrap;
        }

        .caw-strip__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: clamp(1.4rem, 4vw, 3.4rem);
        }

        .caw-strip__item {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
        }

        .caw-strip__value {
          font-family: var(--font-heading, serif);
          font-size: clamp(1.4rem, 2.2vw, 1.9rem);
          font-weight: 400;
          line-height: 1;
          color: rgba(255, 255, 255, 0.94);
          letter-spacing: -0.01em;
        }

        .caw-strip__caption {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.55);
        }

        .caw-foot {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.56);
        }

        .caw-foot__sig {
          color: rgba(255, 255, 255, 0.9);
        }

        .caw-foot__line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.18);
        }

        @media (max-width: 1100px) {
          .caw-headline {
            grid-template-columns: 1fr;
            gap: 1.6rem;
            align-items: start;
          }
        }

        @media (max-width: 760px) {
          .caw-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }

          .caw-title__mask--shift {
            padding-left: 0;
          }

          .caw-wall {
            grid-template-columns: 1fr;
          }

          .caw-strip {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }

          .caw-strip__list {
            gap: 1.4rem 2rem;
          }

          .caw-foot {
            flex-wrap: wrap;
          }

          .caw-foot__line {
            order: 3;
            flex-basis: 100%;
          }
        }

        @media (max-width: 480px) {
          .caw-title {
            font-size: clamp(2.4rem, 12vw, 4rem);
          }
        }
      `}</style>
    </section>
  );
};

const FileSlab = ({ file, position }: { file: CaseFile; position: number }) => {
  const tilt = position % 2 === 0 ? "-0.35deg" : "0.4deg";

  return (
    <article
      className="slab"
      role="listitem"
      aria-label={`Case file ${file.no} — ${file.industry}: ${file.title}`}
      style={{ ["--slab-tilt" as string]: tilt }}
    >
      <div className="slab__tab" aria-hidden="true">
        <span className="slab__tab-no">File {file.no}</span>
        <span className="slab__tab-dot" />
        <span className="slab__tab-industry">{file.industry}</span>
      </div>

      <div className="slab__body">
        <div className="slab__binder" aria-hidden="true" />

        <div className="slab__head">
          <span className="slab__stamp" aria-hidden="true">
            <span className="slab__stamp-ring" />
            <span className="slab__stamp-text">on file</span>
          </span>
          <h3 className="slab__title">{file.title}</h3>
        </div>

        <dl className="slab__notes">
          <div className="slab__note">
            <dt>Brief</dt>
            <dd>{file.brief}</dd>
          </div>
          <div className="slab__note">
            <dt>What was at stake</dt>
            <dd>{file.stakes}</dd>
          </div>
          <div className="slab__note">
            <dt>Constraints in the room</dt>
            <dd>{file.constraints}</dd>
          </div>
          <div className="slab__note slab__note--call">
            <dt>The call I made</dt>
            <dd>{file.call}</dd>
          </div>
        </dl>

        <div className="slab__result">
          <div className="slab__metric">
            <span className="slab__metric-value">{file.outcomeMetric}</span>
            <span className="slab__metric-label">{file.outcomeMetricLabel}</span>
          </div>
          <p className="slab__outcome">{file.outcome}</p>
        </div>

        <footer className="slab__foot">
          <span>{file.role}</span>
          <span className="slab__foot-sep" aria-hidden="true">
            /
          </span>
          <span>{file.year}</span>
          <span className="slab__foot-sep" aria-hidden="true">
            /
          </span>
          <span className="slab__foot-tag">case file</span>
        </footer>
      </div>

      <style jsx>{`
        .slab {
          --slab-tilt: 0deg;
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          transform: rotate(var(--slab-tilt));
          will-change: transform, opacity;
        }

        .slab__tab {
          display: inline-flex;
          align-self: flex-start;
          align-items: center;
          gap: 0.7rem;
          padding: 0.55rem 1rem 0.6rem;
          margin-left: clamp(1.4rem, 3vw, 2.4rem);
          margin-bottom: -1px;
          background: #0f0f0f;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-bottom-color: transparent;
          border-radius: 2px 2px 0 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.78);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .slab__tab-no {
          color: rgba(255, 255, 255, 0.62);
        }

        .slab__tab-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.55);
        }

        .slab__tab-industry {
          color: rgba(255, 255, 255, 0.94);
          letter-spacing: 0.18em;
        }

        .slab__body {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 1.8vw, 1.4rem);
          padding: clamp(1.4rem, 2.6vw, 2rem) clamp(1.4rem, 2.4vw, 2rem)
            clamp(1.4rem, 2.4vw, 1.8rem) clamp(2.2rem, 3.4vw, 3rem);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.008) 38%,
              rgba(255, 255, 255, 0.018) 100%
            ),
            #060606;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 24px 60px -32px rgba(0, 0, 0, 0.85),
            0 2px 0 rgba(0, 0, 0, 0.6);
          flex: 1;
        }

        .slab__body::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              120% 100% at 0% 0%,
              rgba(255, 255, 255, 0.05),
              transparent 55%
            ),
            radial-gradient(
              120% 100% at 100% 100%,
              rgba(0, 0, 0, 0.55),
              transparent 60%
            );
          mix-blend-mode: screen;
        }

        .slab__body::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.018) 0,
            rgba(255, 255, 255, 0.018) 1px,
            transparent 1px,
            transparent 4px
          );
          opacity: 0.45;
          mix-blend-mode: overlay;
        }

        .slab__binder {
          position: absolute;
          top: 0;
          left: clamp(0.9rem, 1.6vw, 1.2rem);
          bottom: 0;
          width: 1px;
          background: rgba(255, 255, 255, 0.22);
          box-shadow:
            2px 0 0 rgba(255, 255, 255, 0.05),
            -2px 0 0 rgba(0, 0, 0, 0.4);
        }

        .slab__binder::before,
        .slab__binder::after {
          content: "";
          position: absolute;
          left: -3px;
          width: 7px;
          height: 7px;
          border: 1px solid rgba(255, 255, 255, 0.32);
          background: #050505;
          border-radius: 50%;
        }

        .slab__binder::before {
          top: clamp(1.4rem, 3vw, 2.2rem);
        }

        .slab__binder::after {
          bottom: clamp(1.4rem, 3vw, 2.2rem);
        }

        .slab__head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .slab__title {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(1.45rem, 2vw, 1.85rem);
          line-height: 1.18;
          letter-spacing: -0.005em;
          color: rgba(255, 255, 255, 0.96);
          max-width: 28ch;
        }

        .slab__stamp {
          position: relative;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          transform: rotate(-9deg);
          opacity: 0.78;
        }

        .slab__stamp-ring {
          position: absolute;
          inset: 0;
          border: 1.5px solid rgba(255, 255, 255, 0.55);
          border-radius: 50%;
        }

        .slab__stamp-ring::before {
          content: "";
          position: absolute;
          inset: 5px;
          border: 1px dashed rgba(255, 255, 255, 0.35);
          border-radius: 50%;
        }

        .slab__stamp-text {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.78);
        }

        .slab__notes {
          display: flex;
          flex-direction: column;
          gap: clamp(0.8rem, 1.4vw, 1rem);
          margin: 0;
        }

        .slab__note {
          display: grid;
          grid-template-columns: clamp(7.5rem, 12vw, 9.5rem) 1fr;
          gap: clamp(0.75rem, 1.6vw, 1.2rem);
          padding-bottom: clamp(0.8rem, 1.4vw, 1rem);
          border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
        }

        .slab__note:last-of-type {
          border-bottom: 0;
          padding-bottom: 0;
        }

        .slab__note dt {
          margin: 0;
          padding-top: 0.18rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.52);
        }

        .slab__note dd {
          margin: 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.96rem;
          line-height: 1.6;
        }

        .slab__note--call dd {
          color: rgba(255, 255, 255, 0.95);
          font-style: italic;
          font-family: var(--font-heading, serif);
          font-size: 1.04rem;
          line-height: 1.5;
        }

        .slab__result {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: clamp(1rem, 2vw, 1.6rem);
          align-items: stretch;
          padding: clamp(1rem, 1.8vw, 1.3rem);
          border: 1px solid rgba(255, 255, 255, 0.22);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.06),
              rgba(255, 255, 255, 0.012)
            ),
            #080808;
        }

        .slab__metric {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.35rem;
          padding-right: clamp(0.5rem, 1.6vw, 1.2rem);
          border-right: 1px solid rgba(255, 255, 255, 0.14);
        }

        .slab__metric-value {
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(1.7rem, 2.6vw, 2.3rem);
          line-height: 1;
          letter-spacing: -0.01em;
          color: #fff;
        }

        .slab__metric-label {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.64rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }

        .slab__outcome {
          margin: 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.94rem;
          line-height: 1.58;
        }

        .slab__foot {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.55rem 0.7rem;
          padding-top: clamp(0.8rem, 1.4vw, 1rem);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.54);
        }

        .slab__foot-sep {
          color: rgba(255, 255, 255, 0.22);
        }

        .slab__foot-tag {
          margin-left: auto;
          padding: 0.2rem 0.55rem;
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: rgba(255, 255, 255, 0.78);
        }

        @media (max-width: 760px) {
          .slab {
            transform: none;
          }

          .slab__head {
            flex-direction: column-reverse;
            align-items: flex-start;
            gap: 0.8rem;
          }

          .slab__stamp {
            transform: rotate(-6deg);
          }

          .slab__note {
            grid-template-columns: 1fr;
            gap: 0.4rem;
          }

          .slab__result {
            grid-template-columns: 1fr;
          }

          .slab__metric {
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.14);
            padding-right: 0;
            padding-bottom: 0.6rem;
          }

          .slab__foot {
            font-size: 0.62rem;
          }

          .slab__foot-tag {
            margin-left: 0;
          }
        }
      `}</style>
    </article>
  );
};

export default ClaudeRecovery02;
