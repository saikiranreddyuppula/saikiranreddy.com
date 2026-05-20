import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Pressure = {
  key: "delay" | "risk" | "margin" | "access";
  label: string;
  weight: number;
  note: string;
};

type Reading = {
  index: string;
  industry: string;
  whoWaits: string;
  promise: string;
  pressures: Pressure[];
  decision: {
    held: string;
    cut: string;
  };
  result: string;
};

const READINGS: Reading[] = [
  {
    index: "01",
    industry: "Healthcare",
    whoWaits: "A patient, in a paper gown, holding a referral.",
    promise: "Care that arrives before the situation gets worse.",
    pressures: [
      { key: "delay", label: "Delay", weight: 0.92, note: "Days between referral and first contact." },
      { key: "risk", label: "Risk", weight: 0.78, note: "Wrong record, wrong room, wrong dose." },
      { key: "margin", label: "Margin", weight: 0.34, note: "Thin. Every avoidable readmission shows." },
      { key: "access", label: "Access", weight: 0.55, note: "Some people never get to the front of the line." },
    ],
    decision: {
      held: "The handoff between two people who barely talk.",
      cut: "Anything that looked tidy on a slide but added a step for the nurse.",
    },
    result: "Wait between referral and intake fell from days to the same afternoon.",
  },
  {
    index: "02",
    industry: "Banking",
    whoWaits: "A regulator, eventually, asking for the paper trail.",
    promise: "Money moves, and someone can still explain why.",
    pressures: [
      { key: "delay", label: "Delay", weight: 0.42, note: "Speed is mostly solved. The audit is not." },
      { key: "risk", label: "Risk", weight: 0.94, note: "A decision a year ago has to defend itself today." },
      { key: "margin", label: "Margin", weight: 0.71, note: "Tight, but real, if the controls hold." },
      { key: "access", label: "Access", weight: 0.48, note: "Who gets approved is a business choice, not a default." },
    ],
    decision: {
      held: "Every decision has to be readable a year from now.",
      cut: "Clever shortcuts that nobody could justify in a hearing.",
    },
    result: "Same approval throughput, with a record an auditor could read in one sitting.",
  },
  {
    index: "03",
    industry: "Retail",
    whoWaits: "The customer at a returns desk, and the manager behind them.",
    promise: "What the store says, the warehouse and the app also say.",
    pressures: [
      { key: "delay", label: "Delay", weight: 0.66, note: "Hours between the order and the truth on the shelf." },
      { key: "risk", label: "Risk", weight: 0.51, note: "Most trouble lives in the seam between two teams." },
      { key: "margin", label: "Margin", weight: 0.88, note: "Razor. Returns and shrink eat the quarter." },
      { key: "access", label: "Access", weight: 0.62, note: "Channel a customer used should not punish them later." },
    ],
    decision: {
      held: "Stores, warehouse, and the app told one story, on purpose.",
      cut: "A second dashboard that nobody in the store had time to open.",
    },
    result: "Returns desk stopped guessing. Refunds went out before the customer left the counter.",
  },
  {
    index: "04",
    industry: "Public Sector",
    whoWaits: "A citizen, on hold, with a case number.",
    promise: "Programs that work in public, for people who never read the rules.",
    pressures: [
      { key: "delay", label: "Delay", weight: 0.81, note: "Weeks between application and a real answer." },
      { key: "risk", label: "Risk", weight: 0.69, note: "Headline risk; the wrong call ends up in a newspaper." },
      { key: "margin", label: "Margin", weight: 0.27, note: "Not money. Trust, which spends slower and breaks faster." },
      { key: "access", label: "Access", weight: 0.96, note: "If a grandmother cannot reach it, it does not work." },
    ],
    decision: {
      held: "Whatever I drew had to survive a reader who did not build it.",
      cut: "Jargon, gates, and any step that asked a citizen to be patient.",
    },
    result: "Eligibility decisions a caseworker could explain over the phone, in one call.",
  },
];

const STANCE: { label: string; line: string }[] = [
  { label: "What I do", line: "I read a business under pressure and decide where the weight should sit." },
  { label: "How I work", line: "Industries first, judgment second, drawings last. The page is for the people who have to live with it." },
  { label: "What I refuse", line: "Tidy answers that survive the slide and break in the room." },
];

export const ClaudeRecovery05 = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-pressure-bar]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "power3.out",
        stagger: { each: 0.04, from: "start" },
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      gsap.from("[data-reveal]", {
        y: 18,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="recovery05"
      aria-labelledby="recovery05-title"
    >
      <div className="recovery05__inner">
        <header className="recovery05__head">
          <div className="recovery05__eyebrow" data-reveal>
            <span className="recovery05__eyebrow-mark" aria-hidden>§</span>
            <span>Market Pressure Index</span>
            <span className="recovery05__eyebrow-mark recovery05__eyebrow-mark--end" aria-hidden>§</span>
          </div>
          <h2 id="recovery05-title" className="recovery05__title" data-reveal>
            Four industries.<br />
            <em>Four kinds of weight.</em>
          </h2>
          <p className="recovery05__lede" data-reveal>
            I do not sell drawings. I read the pressure on a business — delay, risk, margin,
            access — and I decide which one the work has to answer first. This is the index I
            keep on my desk.
          </p>
          <dl className="recovery05__stance" data-reveal>
            {STANCE.map((row) => (
              <div className="recovery05__stance-row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.line}</dd>
              </div>
            ))}
          </dl>
        </header>

        <ol className="recovery05__index" role="list">
          {READINGS.map((reading) => {
            const dominant = reading.pressures.reduce((acc, p) =>
              p.weight > acc.weight ? p : acc
            );
            return (
              <li className="reading" key={reading.index} data-reveal>
                <div className="reading__rail">
                  <span className="reading__index">{reading.index}</span>
                  <span className="reading__rule" aria-hidden />
                  <span className="reading__dominant">
                    <span className="reading__dominant-label">Dominant</span>
                    <span className="reading__dominant-value">{dominant.label}</span>
                  </span>
                </div>

                <div className="reading__body">
                  <header className="reading__header">
                    <h3 className="reading__title">{reading.industry}</h3>
                    <p className="reading__who">{reading.whoWaits}</p>
                    <p className="reading__promise">
                      <span className="reading__promise-tag">The promise</span>
                      <span>{reading.promise}</span>
                    </p>
                  </header>

                  <div className="reading__pressures" role="group" aria-label={`${reading.industry} pressures`}>
                    {reading.pressures.map((p) => (
                      <div className="pressure" key={p.key}>
                        <div className="pressure__top">
                          <span className="pressure__label">{p.label}</span>
                          <span className="pressure__value" aria-hidden>
                            {Math.round(p.weight * 100)}
                          </span>
                        </div>
                        <div
                          className="pressure__track"
                          role="meter"
                          aria-valuenow={Math.round(p.weight * 100)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${p.label} pressure in ${reading.industry}`}
                        >
                          <span
                            className="pressure__fill"
                            data-pressure-bar
                            style={{ width: `${p.weight * 100}%` }}
                          />
                        </div>
                        <p className="pressure__note">{p.note}</p>
                      </div>
                    ))}
                  </div>

                  <div className="reading__decision">
                    <div className="decision-cell">
                      <span className="decision-cell__tag">Held the line on</span>
                      <p>{reading.decision.held}</p>
                    </div>
                    <div className="decision-cell decision-cell--cut">
                      <span className="decision-cell__tag">Cut</span>
                      <p>{reading.decision.cut}</p>
                    </div>
                  </div>

                  <p className="reading__result">
                    <span className="reading__result-tag">Outcome</span>
                    <span>{reading.result}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <footer className="recovery05__foot" data-reveal>
          <div className="recovery05__sig">
            <span className="recovery05__sig-name">Sai Kiran Reddy</span>
            <span className="recovery05__sig-role">Reading the room, then drawing the room.</span>
          </div>
          <p className="recovery05__close">
            If your business is sitting on one of these pressures and pretending it is not — that
            is the conversation I want.
          </p>
        </footer>
      </div>

      <style jsx>{`
        .recovery05 {
          position: relative;
          background: #050505;
          color: #f1f1f1;
          padding: clamp(96px, 12vw, 180px) clamp(24px, 6vw, 96px);
          font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
          overflow: hidden;
        }

        .recovery05::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at top, rgba(255, 255, 255, 0.05), transparent 60%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 30%);
          pointer-events: none;
        }

        .recovery05__inner {
          position: relative;
          max-width: 1180px;
          margin: 0 auto;
        }

        .recovery05__head {
          max-width: 760px;
          margin-bottom: clamp(72px, 8vw, 120px);
        }

        .recovery05__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.62);
          margin-bottom: 28px;
        }

        .recovery05__eyebrow-mark {
          color: rgba(255, 255, 255, 0.35);
          font-family: "Times New Roman", serif;
          font-style: italic;
          font-size: 16px;
          letter-spacing: 0;
        }

        .recovery05__eyebrow-mark--end {
          transform: scaleX(-1);
        }

        .recovery05__title {
          font-family: "Times New Roman", "Cormorant Garamond", serif;
          font-weight: 400;
          font-size: clamp(40px, 5.6vw, 76px);
          line-height: 1.04;
          letter-spacing: -0.02em;
          margin: 0 0 28px;
          color: #fafafa;
        }

        .recovery05__title em {
          font-style: italic;
          color: rgba(255, 255, 255, 0.62);
        }

        .recovery05__lede {
          font-size: clamp(16px, 1.3vw, 19px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.78);
          max-width: 620px;
          margin: 0 0 40px;
        }

        .recovery05__stance {
          margin: 0;
          padding: 24px 0 0;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          display: grid;
          gap: 18px;
        }

        .recovery05__stance-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 24px;
          align-items: baseline;
        }

        .recovery05__stance dt {
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }

        .recovery05__stance dd {
          margin: 0;
          font-size: 15px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.86);
        }

        .recovery05__index {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: clamp(48px, 6vw, 88px);
        }

        .reading {
          display: grid;
          grid-template-columns: 132px 1fr;
          gap: clamp(24px, 4vw, 56px);
          padding-top: 36px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }

        .reading__rail {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 32px;
          align-self: start;
        }

        .reading__index {
          font-family: "Times New Roman", serif;
          font-size: 44px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.92);
          line-height: 1;
        }

        .reading__rule {
          width: 56px;
          height: 1px;
          background: rgba(255, 255, 255, 0.35);
        }

        .reading__dominant {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .reading__dominant-label {
          font-size: 9px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }

        .reading__dominant-value {
          font-size: 14px;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.92);
        }

        .reading__body {
          display: grid;
          gap: 36px;
        }

        .reading__header {
          display: grid;
          gap: 14px;
        }

        .reading__title {
          font-family: "Times New Roman", "Cormorant Garamond", serif;
          font-weight: 400;
          font-size: clamp(28px, 3vw, 40px);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin: 0;
          color: #fafafa;
        }

        .reading__who {
          margin: 0;
          font-style: italic;
          font-family: "Times New Roman", serif;
          font-size: clamp(16px, 1.5vw, 20px);
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
        }

        .reading__promise {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 18px;
          align-items: baseline;
          margin: 0;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .reading__promise-tag {
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }

        .reading__promise span:last-child {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.55;
        }

        .reading__pressures {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 26px 40px;
        }

        .pressure {
          display: grid;
          gap: 10px;
        }

        .pressure__top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }

        .pressure__label {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
        }

        .pressure__value {
          font-family: "Times New Roman", serif;
          font-style: italic;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.55);
        }

        .pressure__track {
          position: relative;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .pressure__fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.92),
            rgba(255, 255, 255, 0.5)
          );
          transform-origin: left center;
        }

        .pressure__note {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.6);
        }

        .reading__decision {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 32px;
          padding: 24px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .decision-cell {
          display: grid;
          gap: 10px;
        }

        .decision-cell__tag {
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }

        .decision-cell p {
          margin: 0;
          font-size: 15px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.9);
        }

        .decision-cell--cut p {
          color: rgba(255, 255, 255, 0.55);
          text-decoration: line-through;
          text-decoration-color: rgba(255, 255, 255, 0.3);
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
        }

        .reading__result {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 18px;
          align-items: baseline;
          margin: 0;
        }

        .reading__result-tag {
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
        }

        .reading__result span:last-child {
          font-family: "Times New Roman", "Cormorant Garamond", serif;
          font-style: italic;
          font-size: clamp(17px, 1.6vw, 21px);
          color: #fafafa;
          line-height: 1.4;
        }

        .recovery05__foot {
          margin-top: clamp(80px, 8vw, 120px);
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: end;
        }

        .recovery05__sig {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .recovery05__sig-name {
          font-family: "Times New Roman", "Cormorant Garamond", serif;
          font-style: italic;
          font-size: 22px;
          color: #fafafa;
        }

        .recovery05__sig-role {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        .recovery05__close {
          margin: 0;
          font-size: 15px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.78);
          max-width: 420px;
          justify-self: end;
          text-align: right;
        }

        @media (max-width: 820px) {
          .recovery05__stance-row {
            grid-template-columns: 1fr;
            gap: 6px;
          }

          .reading {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .reading__rail {
            position: static;
            flex-direction: row;
            align-items: center;
            gap: 16px;
          }

          .reading__rule {
            flex: 1;
          }

          .reading__index {
            font-size: 32px;
          }

          .reading__promise,
          .reading__result {
            grid-template-columns: 1fr;
            gap: 6px;
          }

          .reading__pressures {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .reading__decision {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .recovery05__foot {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .recovery05__close {
            justify-self: start;
            text-align: left;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global([data-pressure-bar]),
          :global([data-reveal]) {
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ClaudeRecovery05;
