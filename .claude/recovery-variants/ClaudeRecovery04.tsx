import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Panel = {
  index: string;
  industry: string;
  whoWaits: string;
  promise: string;
  constraint: string;
  decision: string;
  outcome: string;
  metric: { value: string; label: string };
};

const PANELS: Panel[] = [
  {
    index: "01",
    industry: "Healthcare",
    whoWaits:
      "A patient sitting in a waiting room while two systems argue about whose record is correct.",
    promise:
      "The clinician sees the full picture before they walk in. Nothing important is buried.",
    constraint:
      "Clinical safety, audit, and the small fact that nobody has time to read another dashboard.",
    decision:
      "I owned the call to fold three intake handoffs into one, and to let the floor nurse sign the final view.",
    outcome:
      "Triage time fell from a measured-in-hours problem to a measured-in-minutes one. People stopped re-asking the same question.",
    metric: { value: "−63%", label: "Time to first clinician response" },
  },
  {
    index: "02",
    industry: "Banking",
    whoWaits:
      "A relationship manager who has to explain, on a call, why a transfer is sitting in review.",
    promise:
      "Every decision the bank makes about a customer can be reconstructed a year later, in plain language.",
    constraint:
      "Regulators, auditors, and the bank's own risk committee. Speed is welcome, evidence is required.",
    decision:
      "I argued for keeping the slower, fully-evidenced path as the default and treating the fast lane as the exception, not the rule.",
    outcome:
      "Audit cycles that used to consume a quarter of the team now close in a week. The fast lane is small, named, and watched.",
    metric: { value: "1 week", label: "Audit close, down from a quarter" },
  },
  {
    index: "03",
    industry: "Retail",
    whoWaits:
      "A customer at a returns desk holding a box, while three teams disagree about who is supposed to refund them.",
    promise:
      "The store, the warehouse, and the order screen tell the customer the same thing, in that order.",
    constraint:
      "Margin is thin. Every extra step in the seam between teams shows up in the next quarter's numbers.",
    decision:
      "I drew the line of ownership where the inventory actually changes hands, not where the org chart suggested.",
    outcome:
      "Returns that used to bounce between three queues resolve in one. Same-store complaint volume dropped meaningfully through the next two quarters.",
    metric: { value: "1 queue", label: "Returns path, down from three" },
  },
  {
    index: "04",
    industry: "Public Sector",
    whoWaits:
      "A citizen who applied for a benefit six weeks ago and has been told, three times, that someone will get back to them.",
    promise:
      "Whoever picks up the case can see the whole story, including the parts the citizen has already had to repeat.",
    constraint:
      "It has to be readable by a caseworker, defensible to a minister, and survive a change of government.",
    decision:
      "I pushed for fewer, simpler statuses, written in language a citizen could read out loud, and traceable end to end.",
    outcome:
      "Case backlogs that grew quietly each year began to shrink. The number that mattered most — repeat contact for the same case — dropped first.",
    metric: { value: "−41%", label: "Repeat contact on the same case" },
  },
];

export const ClaudeRecovery04 = () => {
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
          ".rec-eyebrow, .rec-title__line, .rec-lede, .rec-panel, .rec-coda, .rec-foot",
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
          ".rec-eyebrow",
          { autoAlpha: 0, x: -16 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            ease: "power3.out",
            immediateRender: false,
          },
        )
        .fromTo(
          ".rec-title__line",
          { autoAlpha: 0, y: "115%" },
          {
            autoAlpha: 1,
            y: "0%",
            duration: 0.85,
            stagger: 0.1,
            ease: "power4.out",
            immediateRender: false,
          },
          "-=0.2",
        )
        .fromTo(
          ".rec-lede",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.4",
        );

      gsap.utils.toArray<HTMLElement>(".rec-panel").forEach((panel) => {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: panel,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.fromTo(
        ".rec-coda",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".rec-coda",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".rec-foot",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".rec-foot",
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="practice" className="recovery">
      <div className="rec-inner">
        <header className="rec-head">
          <div className="rec-eyebrow">
            <span>Practice</span>
            <span className="rec-eyebrow__line" />
            <span>Four industries, in my own words</span>
          </div>
        </header>

        <div className="rec-headline">
          <h2 className="rec-title">
            <span className="rec-title__mask">
              <span className="rec-title__line">The work, by industry.</span>
            </span>
            <span className="rec-title__mask rec-title__mask--shift">
              <span className="rec-title__line rec-title__line--alt">
                Who waits, what was promised, what I decided.
              </span>
            </span>
          </h2>
          <p className="rec-lede">
            I&apos;m Sai Kiran. I don&apos;t draw pictures of systems for their own sake.
            I get hired to make a judgment call about who owns what, where the
            business is exposed, and what a customer is actually waiting for.
            Below, four rooms I keep being asked back into &mdash; in plain language,
            with the call I made and what changed because of it.
          </p>
        </div>

        <ol className="rec-stack" role="list">
          {PANELS.map((panel) => (
            <li key={panel.index} className="rec-panel">
              <div className="rec-panel__rail" aria-hidden="true">
                <span className="rec-panel__index">{panel.index}</span>
                <span className="rec-panel__rule" />
                <span className="rec-panel__tag">Industry</span>
              </div>

              <div className="rec-panel__body">
                <header className="rec-panel__head">
                  <h3 className="rec-panel__name">{panel.industry}</h3>
                  <p className="rec-panel__who">{panel.whoWaits}</p>
                </header>

                <dl className="rec-panel__notes">
                  <div className="rec-note">
                    <dt>Promise</dt>
                    <dd>{panel.promise}</dd>
                  </div>
                  <div className="rec-note">
                    <dt>Constraint</dt>
                    <dd>{panel.constraint}</dd>
                  </div>
                  <div className="rec-note">
                    <dt>My call</dt>
                    <dd>{panel.decision}</dd>
                  </div>
                  <div className="rec-note">
                    <dt>What changed</dt>
                    <dd>{panel.outcome}</dd>
                  </div>
                </dl>

                <footer className="rec-panel__metric">
                  <span className="rec-panel__metric-value">
                    {panel.metric.value}
                  </span>
                  <span className="rec-panel__metric-label">
                    {panel.metric.label}
                  </span>
                </footer>
              </div>
            </li>
          ))}
        </ol>

        <aside className="rec-coda" aria-label="A note on how I work">
          <p>
            Across all four, the same job: name the customer who is waiting,
            write the promise down, find the seam where the work hands off, and
            decide who owns the next step. I&apos;d rather make one honest call
            than ship a clever drawing.
          </p>
        </aside>

        <footer className="rec-foot">
          <span className="rec-foot__sig">&mdash; Sai Kiran</span>
          <span className="rec-foot__line" />
          <span className="rec-foot__caption">
            First-person notes, written before the work and kept after it.
          </span>
        </footer>
      </div>

      <style jsx>{`
        .recovery {
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

        .rec-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 1280px);
          margin: 0 auto;
          padding: clamp(4rem, 7vw, 7rem) clamp(1.25rem, 5vw, 5rem)
            clamp(5rem, 7vw, 7rem);
        }

        .rec-head {
          margin-bottom: clamp(2rem, 4vw, 3.4rem);
        }

        .rec-eyebrow {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.74);
          letter-spacing: 0.1em;
          flex-wrap: wrap;
        }

        .rec-eyebrow__line {
          display: block;
          width: min(11vw, 140px);
          height: 1px;
          background: rgba(255, 255, 255, 0.32);
        }

        .rec-eyebrow span:last-child {
          color: rgba(255, 255, 255, 0.46);
        }

        .rec-headline {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
          margin-bottom: clamp(3rem, 6vw, 5rem);
          padding-bottom: clamp(2rem, 4vw, 3rem);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .rec-title {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(2.4rem, 5.2vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.012em;
        }

        .rec-title__mask {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }

        .rec-title__mask--shift {
          padding-left: clamp(0rem, 4vw, 4rem);
        }

        .rec-title__line {
          display: block;
          will-change: transform, opacity;
        }

        .rec-title__line--alt {
          font-style: italic;
          color: rgba(255, 255, 255, 0.78);
        }

        .rec-lede {
          max-width: 48ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(1rem, 1.3vw, 1.14rem);
          line-height: 1.7;
        }

        .rec-stack {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .rec-panel {
          position: relative;
          display: grid;
          grid-template-columns: minmax(160px, 0.28fr) minmax(0, 1fr);
          gap: clamp(1.5rem, 4vw, 3.5rem);
          padding: clamp(2.4rem, 4.5vw, 4rem) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .rec-panel:last-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .rec-panel__rail {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .rec-panel__index {
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(3.6rem, 7vw, 6.4rem);
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: rgba(255, 255, 255, 0.92);
        }

        .rec-panel__rule {
          display: block;
          width: 56px;
          height: 1px;
          background: rgba(255, 255, 255, 0.4);
        }

        .rec-panel__tag {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.5);
        }

        .rec-panel__body {
          display: flex;
          flex-direction: column;
          gap: clamp(1.4rem, 2.4vw, 2rem);
          min-width: 0;
        }

        .rec-panel__head {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .rec-panel__name {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: rgba(255, 255, 255, 0.96);
        }

        .rec-panel__who {
          margin: 0;
          max-width: 58ch;
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(1.02rem, 1.3vw, 1.18rem);
          line-height: 1.55;
          font-style: italic;
        }

        .rec-panel__notes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: clamp(1.2rem, 3vw, 2.6rem);
          row-gap: clamp(1.2rem, 2vw, 1.6rem);
          margin: 0;
        }

        .rec-note {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          padding-top: 0.8rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .rec-note dt {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.5);
        }

        .rec-note dd {
          margin: 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.96rem;
          line-height: 1.6;
        }

        .rec-panel__metric {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-top: 0.4rem;
          padding-top: 1.1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
        }

        .rec-panel__metric-value {
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(2rem, 3.2vw, 2.8rem);
          line-height: 1;
          letter-spacing: -0.015em;
          color: #fff;
        }

        .rec-panel__metric-label {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.6);
        }

        .rec-coda {
          margin: clamp(3rem, 6vw, 5rem) 0 clamp(2rem, 4vw, 3rem);
          padding: clamp(1.6rem, 3vw, 2.2rem) 0;
        }

        .rec-coda p {
          margin: 0;
          max-width: 64ch;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-style: italic;
          font-size: clamp(1.1rem, 1.7vw, 1.5rem);
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.86);
        }

        .rec-foot {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.56);
        }

        .rec-foot__sig {
          color: rgba(255, 255, 255, 0.9);
        }

        .rec-foot__line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.18);
        }

        @media (max-width: 1100px) {
          .rec-headline {
            grid-template-columns: 1fr;
            gap: 1.6rem;
            align-items: start;
          }
        }

        @media (max-width: 760px) {
          .rec-title__mask--shift {
            padding-left: 0;
          }

          .rec-panel {
            grid-template-columns: 1fr;
            gap: 1.4rem;
          }

          .rec-panel__rail {
            flex-direction: row;
            align-items: baseline;
            gap: 1rem;
          }

          .rec-panel__index {
            font-size: clamp(3rem, 14vw, 4.2rem);
          }

          .rec-panel__rule {
            display: none;
          }

          .rec-panel__notes {
            grid-template-columns: 1fr;
          }

          .rec-foot {
            flex-wrap: wrap;
          }

          .rec-foot__line {
            order: 3;
            flex-basis: 100%;
          }
        }

        @media (max-width: 480px) {
          .rec-title {
            font-size: clamp(2.2rem, 11vw, 3.6rem);
          }
        }
      `}</style>
    </section>
  );
};

export default ClaudeRecovery04;
