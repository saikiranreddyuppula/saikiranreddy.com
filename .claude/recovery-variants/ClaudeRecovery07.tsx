import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type CaseRow = {
  plate: string;
  industry: string;
  promise: string;
  situation: string;
  stake: string;
  decision: string;
  principle: string;
  outcome: { value: string; label: string }[];
};

const CASES: CaseRow[] = [
  {
    plate: "I",
    industry: "Healthcare",
    promise: "Care that doesn't fall through the seams.",
    situation:
      "A regional health network was losing patients between referral and intake. The visits were fine. The week in between wasn't. Nobody owned that week.",
    stake:
      "Avoidable readmissions, clinician trust, and the patient who simply stopped calling back.",
    decision:
      "I redrew the work so every handoff had a named owner and a deadline visible to both sides. Not a new tool. A clearer line of who carries the patient next.",
    principle: "Ownership before instrumentation.",
    outcome: [
      { value: "9d → 36h", label: "Referral to intake" },
      { value: "−48%", label: "Drop-off in two quarters" },
    ],
  },
  {
    plate: "II",
    industry: "Banking",
    promise: "Decisions you can still explain a year later.",
    situation:
      "A small-business lending desk was approving loans faster than its own auditors could trace why. Speed was the pitch; the paper trail couldn't keep up.",
    stake:
      "Regulatory exposure on every quarter close, and a team that couldn't defend its own approvals in writing.",
    decision:
      "I made the reasoning the artifact. Every approval now carried the evidence used to make it, attached, not appended. The decision and its defense move together or not at all.",
    principle: "If it can't be re-read, it wasn't a decision.",
    outcome: [
      { value: "3 weeks → 4 days", label: "Audit prep" },
      { value: "0", label: "Remediation findings, next cycle" },
    ],
  },
  {
    plate: "III",
    industry: "Retail",
    promise: "The return desk is the brand.",
    situation:
      "A national retailer ran online and in-store returns on different rulebooks. The customer found the gap before anyone inside did, and the gap was loud.",
    stake:
      "Repeat customers, store associates losing arguments at the counter, and a promise that meant one thing in advertising and another in person.",
    decision:
      "I gave the return desk the same view of the order the customer had when they bought it. One source of truth, two doors into the same room. The seam disappeared because the seam was never the customer's problem.",
    principle: "Hand the customer's truth back to the people who serve them.",
    outcome: [
      { value: "87%", label: "First-contact resolution" },
      { value: "−52%", label: "Escalations to managers" },
    ],
  },
  {
    plate: "IV",
    industry: "Public Sector",
    promise: "Programs that work out loud.",
    situation:
      "A state benefits program had a participation rate well below the population it was funded to serve. The form worked. The path to the form did not.",
    stake:
      "Funding tied to enrollment, and citizens who qualified but were quietly turned away by the route — never the rule.",
    decision:
      "I rewrote the path from “prove you qualify” to “show what you have, we'll tell you what fits.” Eligibility became the program's job to find, not the applicant's job to defend.",
    principle: "Carry the burden of proof on the side that can bear it.",
    outcome: [
      { value: "+41%", label: "Enrollments in 9 months" },
      { value: "−33%", label: "Caseworker time per applicant" },
    ],
  },
];

export const ClaudeRecovery07 = () => {
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
          ".bg-label, .bg-title__line, .bg-lede, .bg-case, .bg-foot",
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
          ".bg-label",
          { autoAlpha: 0, x: -20 },
          { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out" },
        )
        .fromTo(
          ".bg-title__line",
          { autoAlpha: 0, y: "115%" },
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
          ".bg-lede",
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4",
        );

      gsap.utils.toArray<HTMLElement>(".bg-case").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.fromTo(
        ".bg-foot",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".bg-foot",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="practice" className="bgallery">
      <div className="bg-inner">
        <header className="bg-head">
          <div className="bg-label">
            <span>01</span>
            <span className="bg-label__line" />
            <span>Practice</span>
          </div>
          <p className="bg-kicker">
            a personal portfolio &middot; four cases, plainly told
          </p>
        </header>

        <div className="bg-headline">
          <h2 className="bg-title">
            <span className="bg-title__mask">
              <span className="bg-title__line">Four cases.</span>
            </span>
            <span className="bg-title__mask bg-title__mask--shift">
              <span className="bg-title__line bg-title__line--alt">
                Four industries. One way of reading the room.
              </span>
            </span>
          </h2>
          <p className="bg-lede">
            I&apos;m Sai Kiran. Architecture, to me, isn&apos;t a drawing
            &mdash; it&apos;s a series of judgments about who carries the work,
            who pays for it being late, and what the business has to be able
            to say out loud about it later. These are four I keep returning to.
          </p>
        </div>

        <ol className="bg-cases">
          {CASES.map((row, idx) => (
            <li
              key={row.plate}
              className="bg-case"
              aria-label={`Plate ${row.plate} — ${row.industry}`}
            >
              <article className="bg-case__inner">
                <header className="bg-case__head">
                  <span className="bg-case__plate">Plate {row.plate}</span>
                  <span className="bg-case__rule" aria-hidden="true" />
                  <span className="bg-case__index">
                    {String(idx + 1).padStart(2, "0")} / {String(CASES.length).padStart(2, "0")}
                  </span>
                </header>

                <div className="bg-case__title">
                  <h3 className="bg-case__industry">{row.industry}</h3>
                  <p className="bg-case__promise">{row.promise}</p>
                </div>

                <div className="bg-case__body">
                  <Field label="The situation" body={row.situation} />
                  <Field label="What was at stake" body={row.stake} />
                  <Field label="The decision" body={row.decision} />
                </div>

                <footer className="bg-case__foot">
                  <blockquote className="bg-case__principle">
                    <span className="bg-case__quote" aria-hidden="true">
                      &ldquo;
                    </span>
                    {row.principle}
                  </blockquote>

                  <dl className="bg-case__outcome" aria-label="Outcome">
                    {row.outcome.map((o) => (
                      <div key={o.label} className="bg-case__metric">
                        <dt>{o.label}</dt>
                        <dd>{o.value}</dd>
                      </div>
                    ))}
                  </dl>
                </footer>
              </article>
            </li>
          ))}
        </ol>

        <footer className="bg-foot">
          <span className="bg-foot__sig">&mdash; Sai Kiran</span>
          <span className="bg-foot__line" />
          <span className="bg-foot__caption">
            First-person notes. Names withheld; numbers are what the business
            measured, not what I claimed.
          </span>
        </footer>
      </div>

      <style jsx>{`
        .bgallery {
          position: relative;
          z-index: 2;
          overflow: hidden;
          color: #fff;
          background:
            linear-gradient(180deg, #000 0%, #050505 50%, #000 100%);
          isolation: isolate;
        }

        .bgallery::before {
          position: absolute;
          inset: 0;
          content: "";
          background:
            linear-gradient(
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            );
          background-size: 100% 96px;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            #000 18%,
            #000 82%,
            transparent 100%
          );
          pointer-events: none;
        }

        .bg-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 1320px);
          margin: 0 auto;
          padding: clamp(4rem, 7vw, 7rem) clamp(1.25rem, 5vw, 5rem)
            clamp(5rem, 7vw, 7rem);
        }

        .bg-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: clamp(2.4rem, 4.5vw, 4rem);
        }

        .bg-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.74);
          letter-spacing: 0.08em;
        }

        .bg-label__line {
          display: block;
          width: min(11vw, 140px);
          height: 1px;
          background: rgba(255, 255, 255, 0.32);
        }

        .bg-kicker {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.46);
        }

        .bg-headline {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
          margin-bottom: clamp(3rem, 6vw, 5rem);
        }

        .bg-title {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(2.4rem, 5vw, 5rem);
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .bg-title__mask {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }

        .bg-title__mask--shift {
          padding-left: clamp(0rem, 4vw, 4rem);
        }

        .bg-title__line {
          display: block;
          will-change: transform, opacity;
        }

        .bg-title__line--alt {
          font-style: italic;
          color: rgba(255, 255, 255, 0.78);
        }

        .bg-lede {
          max-width: 48ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(1rem, 1.3vw, 1.14rem);
          line-height: 1.7;
        }

        .bg-cases {
          list-style: none;
          margin: 0 0 clamp(2.4rem, 5vw, 4rem);
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 2.2vw, 1.8rem);
        }

        .bg-case {
          position: relative;
        }

        .bg-case__inner {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.55fr);
          gap: clamp(1.4rem, 3vw, 3rem);
          padding: clamp(1.6rem, 3vw, 2.8rem) clamp(1.4rem, 3vw, 2.6rem);
          border: 1px solid rgba(255, 255, 255, 0.12);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.005)
            ),
            #050505;
        }

        .bg-case__head {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.4rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.55);
        }

        .bg-case__plate {
          color: rgba(255, 255, 255, 0.88);
        }

        .bg-case__rule {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.16);
        }

        .bg-case__title {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding-right: 0.5rem;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }

        .bg-case__industry {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(2rem, 3.2vw, 3rem);
          line-height: 1.02;
          letter-spacing: -0.01em;
          color: rgba(255, 255, 255, 0.96);
        }

        .bg-case__promise {
          margin: 0;
          max-width: 22ch;
          font-family: var(--font-heading, serif);
          font-style: italic;
          font-size: clamp(1.05rem, 1.4vw, 1.25rem);
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.7);
        }

        .bg-case__body {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .bg-case__foot {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: clamp(1.2rem, 2.5vw, 2.4rem);
          margin-top: clamp(1rem, 1.6vw, 1.4rem);
          padding-top: clamp(1rem, 1.6vw, 1.4rem);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bg-case__principle {
          position: relative;
          margin: 0;
          padding-left: 1.4rem;
          font-family: var(--font-heading, serif);
          font-style: italic;
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.86);
        }

        .bg-case__quote {
          position: absolute;
          left: 0;
          top: -0.2rem;
          font-size: 1.8rem;
          line-height: 1;
          color: rgba(255, 255, 255, 0.45);
        }

        .bg-case__outcome {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(1rem, 2vw, 1.6rem);
          margin: 0;
        }

        .bg-case__metric {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .bg-case__metric dt {
          order: 2;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.5);
        }

        .bg-case__metric dd {
          order: 1;
          margin: 0;
          font-family: var(--font-heading, serif);
          font-size: clamp(1.3rem, 2vw, 1.85rem);
          line-height: 1;
          letter-spacing: -0.01em;
          color: rgba(255, 255, 255, 0.96);
        }

        .bg-foot {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.55);
        }

        .bg-foot__sig {
          color: rgba(255, 255, 255, 0.9);
        }

        .bg-foot__line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.18);
        }

        .bg-foot__caption {
          max-width: 56ch;
          line-height: 1.5;
        }

        @media (max-width: 1100px) {
          .bg-headline {
            grid-template-columns: 1fr;
            gap: 1.4rem;
            align-items: start;
          }

          .bg-case__inner {
            grid-template-columns: 1fr;
          }

          .bg-case__title {
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-right: 0;
            padding-bottom: 1.1rem;
          }

          .bg-case__foot {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .bg-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }

          .bg-title__mask--shift {
            padding-left: 0;
          }

          .bg-case__outcome {
            grid-template-columns: 1fr;
          }

          .bg-foot {
            flex-wrap: wrap;
          }

          .bg-foot__line {
            order: 3;
            flex-basis: 100%;
          }
        }

        @media (max-width: 480px) {
          .bg-title {
            font-size: clamp(2.2rem, 11vw, 3.6rem);
          }
        }
      `}</style>
    </section>
  );
};

const Field = ({ label, body }: { label: string; body: string }) => {
  return (
    <div className="fld">
      <span className="fld__label">{label}</span>
      <p className="fld__body">{body}</p>

      <style jsx>{`
        .fld {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .fld__label {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.48);
        }

        .fld__body {
          margin: 0;
          max-width: 62ch;
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(0.96rem, 1.1vw, 1.04rem);
          line-height: 1.65;
        }
      `}</style>
    </div>
  );
};

export default ClaudeRecovery07;
