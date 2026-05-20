import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Note = {
  no: string;
  industry: string;
  where: string;
  title: string;
  situation: string;
  call: string;
  changed: string;
  outcome: { value: string; caption: string }[];
};

const NOTES: Note[] = [
  {
    no: "01",
    industry: "Healthcare",
    where: "Regional health system · 2022",
    title: "The queue was the diagnosis.",
    situation:
      "Prior-authorisation requests sat for eleven days on average. Procedures were already on the calendar. Patients found out they had to be rescheduled by voicemail.",
    call:
      "I redrew the line between intake and clinical review. A denial could not leave the building until a human had read the chart. The queue stopped being a worklist and started being someone's job.",
    changed:
      "Median wait fell from eleven days to three. Reschedule rate dropped by a third. Two staff moved off paperwork chasing and onto the cases that actually needed a clinician.",
    outcome: [
      { value: "11 → 3", caption: "days, median wait" },
      { value: "−33%", caption: "reschedules" },
    ],
  },
  {
    no: "02",
    industry: "Banking",
    where: "Mid-size lender · 2021",
    title: "Fast was easy. Explaining it later was the job.",
    situation:
      "A credit decision could land in under a minute. A year later, no one in the building could say exactly why a particular borrower had been turned away.",
    call:
      "I treated the paper trail as a deliverable, not a report. Every decision wrote down, at the moment it was made, the few inputs that actually moved it and the policy it answered to.",
    changed:
      "The regulator's review closed in one cycle. Internal disputes dropped sharply. The lender kept its speed and finally owned its reasoning.",
    outcome: [
      { value: "1 cycle", caption: "regulator review, closed" },
      { value: "audit-ready", caption: "by default, not by sprint" },
    ],
  },
  {
    no: "03",
    industry: "Retail",
    where: "National chain · 2020",
    title: "The seam between the app and the store.",
    situation:
      "Online returns piled up at stores that could not accept them. The app kept promising customers they could walk in. Managers and head office stopped trusting each other.",
    call:
      "I made the store the source of truth about what it could take that day. Head office stopped guessing. The customer was told the truth before they drove anywhere.",
    changed:
      "Mis-routed returns fell by roughly seventy percent. Front-of-store complaints halved. The argument between store and head office quietly ended.",
    outcome: [
      { value: "−70%", caption: "mis-routed returns" },
      { value: "−50%", caption: "front-of-store complaints" },
    ],
  },
  {
    no: "04",
    industry: "Public sector",
    where: "State benefits programme · 2023",
    title: "An eligible citizen was dropping out at week three.",
    situation:
      "A state benefit asked twenty-two pages and waited six weeks to verify. Plenty of people who actually qualified gave up before anyone read their case.",
    call:
      "I cut intake to one short step and pushed verification behind the scenes, with one named owner per case. Nothing was approved without a human signing for it.",
    changed:
      "Drop-off was roughly halved. Calls to the help line fell. The auditor signed off in the first pass because every case had a person attached to it.",
    outcome: [
      { value: "−50%", caption: "drop-off, week three" },
      { value: "1 owner", caption: "per case, named" },
    ],
  },
];

const INDEX = [
  { tag: "Healthcare", no: "01" },
  { tag: "Banking", no: "02" },
  { tag: "Retail", no: "03" },
  { tag: "Public sector", no: "04" },
];

export const ClaudeRecovery06 = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set(
          ".fn-label, .fn-title__line, .fn-lede, .fn-index__item, .fn-note, .fn-foot",
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
          ".fn-label",
          { autoAlpha: 0, x: -16 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.55,
            ease: "power3.out",
            immediateRender: false,
          },
        )
        .fromTo(
          ".fn-title__line",
          { autoAlpha: 0, y: "110%" },
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
          ".fn-lede",
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
          ".fn-index__item",
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.4",
        );

      gsap.utils.toArray<HTMLElement>(".fn-note").forEach((note) => {
        gsap.fromTo(
          note,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: note,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.fromTo(
        ".fn-foot",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".fn-foot",
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="practice" className="fieldnotes">
      <div className="fn-inner">
        <header className="fn-head">
          <div className="fn-label">
            <span>02</span>
            <span className="fn-label__line" />
            <span>Field notes</span>
          </div>
          <p className="fn-kicker">
            selected work &middot; 2018 &mdash; present
          </p>
        </header>

        <div className="fn-headline">
          <h2 className="fn-title">
            <span className="fn-title__mask">
              <span className="fn-title__line">Notes from the field.</span>
            </span>
            <span className="fn-title__mask fn-title__mask--shift">
              <span className="fn-title__line fn-title__line--alt">
                Four industries. One way of reading the work.
              </span>
            </span>
          </h2>
          <p className="fn-lede">
            I&apos;m Sai Kiran. These are the cases I keep coming back to &mdash;
            not the diagrams, the decisions. Each one started with a queue, a
            complaint or a regulator, and each one ended with a number the
            business could feel.
          </p>
        </div>

        <ul className="fn-index" aria-label="Industries covered in these notes">
          {INDEX.map((item) => (
            <li key={item.no} className="fn-index__item">
              <span className="fn-index__no">{item.no}</span>
              <span className="fn-index__tag">{item.tag}</span>
            </li>
          ))}
        </ul>

        <div className="fn-stack">
          {NOTES.map((note) => (
            <article
              key={note.no}
              className="fn-note"
              aria-label={`Field note ${note.no} — ${note.industry}`}
            >
              <header className="fn-note__head">
                <div className="fn-note__stamp">
                  <span className="fn-note__no">N&deg; {note.no}</span>
                  <span className="fn-note__rule" aria-hidden="true" />
                  <span className="fn-note__industry">{note.industry}</span>
                </div>
                <span className="fn-note__where">{note.where}</span>
              </header>

              <h3 className="fn-note__title">{note.title}</h3>

              <dl className="fn-note__body">
                <div className="fn-note__row">
                  <dt>The situation</dt>
                  <dd>{note.situation}</dd>
                </div>
                <div className="fn-note__row">
                  <dt>The call</dt>
                  <dd>{note.call}</dd>
                </div>
                <div className="fn-note__row">
                  <dt>What changed</dt>
                  <dd>{note.changed}</dd>
                </div>
              </dl>

              <footer className="fn-note__foot">
                {note.outcome.map((o) => (
                  <div key={o.caption} className="fn-note__measure">
                    <span className="fn-note__value">{o.value}</span>
                    <span className="fn-note__caption">{o.caption}</span>
                  </div>
                ))}
              </footer>
            </article>
          ))}
        </div>

        <footer className="fn-foot">
          <span className="fn-foot__sig">&mdash; Sai Kiran</span>
          <span className="fn-foot__line" />
          <span className="fn-foot__caption">
            Names withheld. Numbers are what the business measured.
          </span>
        </footer>
      </div>

      <style jsx>{`
        .fieldnotes {
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

        .fieldnotes::before {
          position: absolute;
          inset: 0;
          content: "";
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.02) 1px,
            transparent 1px
          );
          background-size: 96px 96px;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            #000 18%,
            #000 82%,
            transparent 100%
          );
          pointer-events: none;
        }

        .fn-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 1280px);
          margin: 0 auto;
          padding: clamp(4rem, 7vw, 7rem) clamp(1.25rem, 5vw, 5rem)
            clamp(5rem, 7vw, 7rem);
        }

        .fn-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: clamp(2rem, 4vw, 3.5rem);
        }

        .fn-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.74);
          letter-spacing: 0.1em;
        }

        .fn-label__line {
          display: block;
          width: min(11vw, 140px);
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
        }

        .fn-kicker {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.46);
        }

        .fn-headline {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
          margin-bottom: clamp(2.2rem, 4.5vw, 3.8rem);
        }

        .fn-title {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(2.5rem, 5vw, 5rem);
          line-height: 1;
          letter-spacing: -0.012em;
        }

        .fn-title__mask {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }

        .fn-title__mask--shift {
          padding-left: clamp(0rem, 3vw, 3rem);
        }

        .fn-title__line {
          display: block;
          will-change: transform, opacity;
        }

        .fn-title__line--alt {
          font-style: italic;
          color: rgba(255, 255, 255, 0.74);
        }

        .fn-lede {
          max-width: 48ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: clamp(1rem, 1.3vw, 1.14rem);
          line-height: 1.68;
        }

        .fn-index {
          list-style: none;
          margin: 0 0 clamp(2.2rem, 4vw, 3.4rem);
          padding: clamp(0.9rem, 1.6vw, 1.2rem) 0;
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1.4rem, 4vw, 3rem);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .fn-index__item {
          display: flex;
          align-items: baseline;
          gap: 0.7rem;
        }

        .fn-index__no {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.42);
        }

        .fn-index__tag {
          font-family: var(--font-heading, serif);
          font-size: clamp(1rem, 1.3vw, 1.15rem);
          color: rgba(255, 255, 255, 0.92);
          letter-spacing: -0.005em;
        }

        .fn-stack {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(1rem, 2vw, 1.6rem);
        }

        .fn-note {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(0.9rem, 1.6vw, 1.25rem);
          padding: clamp(1.4rem, 2.4vw, 2rem);
          border: 1px solid rgba(255, 255, 255, 0.12);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.005)
            ),
            #050505;
        }

        .fn-note::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 14px;
          height: 14px;
          content: "";
          border-top: 1px solid rgba(255, 255, 255, 0.55);
          border-left: 1px solid rgba(255, 255, 255, 0.55);
          pointer-events: none;
        }

        .fn-note::after {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 14px;
          height: 14px;
          content: "";
          border-bottom: 1px solid rgba(255, 255, 255, 0.55);
          border-right: 1px solid rgba(255, 255, 255, 0.55);
          pointer-events: none;
        }

        .fn-note__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .fn-note__stamp {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.86);
        }

        .fn-note__rule {
          display: block;
          width: 22px;
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
        }

        .fn-note__industry {
          color: rgba(255, 255, 255, 0.62);
        }

        .fn-note__where {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }

        .fn-note__title {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(1.3rem, 1.9vw, 1.65rem);
          line-height: 1.22;
          letter-spacing: -0.005em;
          color: rgba(255, 255, 255, 0.96);
        }

        .fn-note__body {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
        }

        .fn-note__row {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 1rem;
          align-items: baseline;
          padding-top: 0.7rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .fn-note__row:first-child {
          border-top: 0;
          padding-top: 0;
        }

        .fn-note__row dt {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        .fn-note__row dd {
          margin: 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.96rem;
          line-height: 1.62;
        }

        .fn-note__foot {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1rem, 2.4vw, 2rem);
          margin-top: 0.4rem;
          padding-top: 0.95rem;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .fn-note__measure {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .fn-note__value {
          font-family: var(--font-heading, serif);
          font-size: clamp(1.4rem, 2.2vw, 1.85rem);
          line-height: 1;
          color: rgba(255, 255, 255, 0.96);
          letter-spacing: -0.01em;
        }

        .fn-note__caption {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.52);
        }

        .fn-foot {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-top: clamp(2.4rem, 5vw, 3.6rem);
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.54);
        }

        .fn-foot__sig {
          color: rgba(255, 255, 255, 0.9);
        }

        .fn-foot__line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.16);
        }

        @media (max-width: 1100px) {
          .fn-headline {
            grid-template-columns: 1fr;
            gap: 1.4rem;
            align-items: start;
          }
        }

        @media (max-width: 820px) {
          .fn-stack {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .fn-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .fn-title__mask--shift {
            padding-left: 0;
          }

          .fn-note__row {
            grid-template-columns: 1fr;
            gap: 0.35rem;
          }

          .fn-foot {
            flex-wrap: wrap;
          }

          .fn-foot__line {
            order: 3;
            flex-basis: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default ClaudeRecovery06;
