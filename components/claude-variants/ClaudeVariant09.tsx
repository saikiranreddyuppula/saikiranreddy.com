import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type WorkCase = {
  index: string;
  industry: string;
  setting: string;
  headline: string;
  pressure: string;
  businessCase: string;
  architecturalCall: string;
  proof: string;
  carriedBy: string;
  ownedBy: string;
};

const CASES: WorkCase[] = [
  {
    index: "01",
    industry: "Healthcare",
    setting: "Patient access / clinical operations",
    headline: "The patient should not carry the handoff.",
    pressure:
      "Care teams were doing good work in fragments. The business cost lived in the wait between them.",
    businessCase:
      "Reduce avoidable delay without adding clerical work to clinicians.",
    architecturalCall:
      "Name the owner of the wait, separate clinical judgment from coordination work, and make the handoff visible before the patient has to ask.",
    proof:
      "Fewer dropped referrals. Faster first response. Less rework at intake.",
    carriedBy: "Care coordination",
    ownedBy: "Operations leader",
  },
  {
    index: "02",
    industry: "Banking",
    setting: "Lending, risk, and branch operations",
    headline: "Every decision has to be explainable later.",
    pressure:
      "The bank needed speed, but the real risk was an answer nobody could defend when reviewed.",
    businessCase:
      "Protect lending velocity without creating audit drag or surprise remediation.",
    architecturalCall:
      "Keep the reason for the decision with the decision; make exceptions rare, named, and reviewable.",
    proof:
      "Shorter audit prep. Fewer remediation loops. Clear ownership of exceptions.",
    carriedBy: "Risk office",
    ownedBy: "Chief Risk Officer",
  },
  {
    index: "03",
    industry: "Retail",
    setting: "Store, warehouse, order, and returns",
    headline: "The return desk is part of the promise.",
    pressure:
      "Store, warehouse, and online teams could each be locally right while the customer experience was still wrong.",
    businessCase:
      "Protect margin when fulfillment, service, and returns move at different speeds.",
    architecturalCall:
      "Treat ownership of the order as one continuous obligation; split cost and responsibility where the work actually lands.",
    proof:
      "Fewer escalations. Clearer store ownership. Less value lost in exceptions.",
    carriedBy: "Customer operations",
    ownedBy: "Retail leadership",
  },
  {
    index: "04",
    industry: "Public Sector",
    setting: "Eligibility, access, and service delivery",
    headline: "The form is not the service.",
    pressure:
      "Policy worked on paper. People still fell out of the process because nobody owned the wait.",
    businessCase:
      "Increase completion without pushing more burden onto applicants or caseworkers.",
    architecturalCall:
      "Make eligibility readable, assign ownership inside the agency, and let the citizen see one path instead of the org chart.",
    proof:
      "Higher completion. Shorter determination window. Fewer cases lost between teams.",
    carriedBy: "Program operations",
    ownedBy: "Agency director",
  },
];

const PRINCIPLES = [
  "Who carries the cost?",
  "Who owns the promise?",
  "What proves it worked?",
];

export const ClaudeVariant09 = () => {
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
          ".wi-label, .wi-title__line, .wi-lede, .wi-principle, .wi-row, .wi-foot",
          { autoAlpha: 1, x: 0, y: 0, scaleX: 1 },
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
          ".wi-label",
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
          ".wi-title__line",
          { autoAlpha: 0, y: "112%" },
          {
            autoAlpha: 1,
            y: "0%",
            duration: 0.9,
            stagger: 0.1,
            ease: "power4.out",
            immediateRender: false,
          },
          "-=0.15",
        )
        .fromTo(
          ".wi-lede",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.45",
        )
        .fromTo(
          ".wi-principle",
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.48",
        );

      gsap.utils.toArray<HTMLElement>(".wi-row").forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
            immediateRender: false,
          },
        );
      });

      gsap.fromTo(
        ".wi-foot",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.58,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".wi-foot",
            start: "top 94%",
            toggleActions: "play none none reverse",
          },
          immediateRender: false,
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="practice" className="workindex">
      <div className="wi-inner">
        <header className="wi-head">
          <div className="wi-label">
            <span>01</span>
            <span>Practice</span>
          </div>
          <p className="wi-kicker">
            industry architecture &middot; business case &middot; ownership
          </p>
        </header>

        <div className="wi-hero">
          <div>
            <h2 className="wi-title">
              <span className="wi-title__mask">
                <span className="wi-title__line">Where the business case</span>
              </span>
              <span className="wi-title__mask wi-title__mask--shift">
                <span className="wi-title__line wi-title__line--alt">
                  becomes architecture.
                </span>
              </span>
            </h2>
          </div>

          <p className="wi-lede">
            I&apos;m Sai Kiran. I work across industries where architecture is
            not a drawing on the wall. It is the decision about who owns the
            promise, who carries the cost when it slips, and what the business
            can point to when the work is done.
          </p>
        </div>

        <aside className="wi-principle" aria-label="Working rule">
          <p className="wi-principle__label">Working rule</p>
          <p className="wi-principle__quote">
            A business case is real only when a person can be named against
            the promise.
          </p>
          <ul className="wi-principle__list">
            {PRINCIPLES.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </aside>

        <ol className="wi-ledger" aria-label="Selected industry cases">
          {CASES.map((item) => (
            <li key={item.index} className="wi-row">
              <article className="wi-case">
                <div className="wi-case__number">{item.index}</div>

                <div className="wi-case__main">
                  <div className="wi-case__topline">
                    <span>{item.industry}</span>
                    <span>{item.setting}</span>
                  </div>
                  <h3 className="wi-case__title">{item.headline}</h3>
                  <p className="wi-case__pressure">{item.pressure}</p>
                </div>

                <div className="wi-case__brief">
                  <div className="wi-brief__block">
                    <span>Business case</span>
                    <p>{item.businessCase}</p>
                  </div>
                  <div className="wi-brief__block">
                    <span>Architectural call</span>
                    <p>{item.architecturalCall}</p>
                  </div>
                  <div className="wi-brief__block wi-brief__block--proof">
                    <span>Proof</span>
                    <p>{item.proof}</p>
                  </div>
                </div>

                <dl className="wi-case__ownership">
                  <div>
                    <dt>Cost carried by</dt>
                    <dd>{item.carriedBy}</dd>
                  </div>
                  <div>
                    <dt>Promise owned by</dt>
                    <dd>{item.ownedBy}</dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ol>

        <footer className="wi-foot">
          <span className="wi-foot__sig">&mdash; Sai Kiran</span>
          <span className="wi-foot__caption">
            Selected work, reduced to the decisions that mattered.
          </span>
        </footer>
      </div>

      <style jsx>{`
        .workindex {
          position: relative;
          z-index: 2;
          overflow: hidden;
          color: #fff;
          background:
            radial-gradient(
              70% 48% at 50% 4%,
              rgba(255, 255, 255, 0.05),
              transparent 64%
            ),
            linear-gradient(180deg, #000 0%, #050505 52%, #000 100%);
          isolation: isolate;
        }

        .workindex::before {
          position: absolute;
          inset: 0;
          content: "";
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(255, 255, 255, 0.035) 38%,
            rgba(255, 255, 255, 0.02) 62%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            #000 12%,
            #000 88%,
            transparent 100%
          );
          pointer-events: none;
        }

        .wi-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 1480px);
          margin: 0 auto;
          padding: clamp(4.5rem, 7vw, 7.5rem) clamp(1.25rem, 5vw, 5rem)
            clamp(5rem, 7vw, 7rem);
        }

        .wi-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: clamp(2.6rem, 4.5vw, 4.4rem);
          flex-wrap: wrap;
        }

        .wi-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          line-height: 1;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.76);
        }

        .wi-kicker {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.46);
        }

        .wi-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.14fr) minmax(320px, 0.86fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
          margin-bottom: clamp(1.8rem, 3.8vw, 3rem);
        }

        .wi-title {
          margin: 0;
          font-family: var(--font-heading, Georgia, serif);
          font-weight: 400;
          font-size: clamp(2.8rem, 5.4vw, 6.35rem);
          line-height: 0.96;
          letter-spacing: 0;
        }

        .wi-title__mask {
          display: block;
          overflow: hidden;
          padding-bottom: 0.08em;
        }

        .wi-title__mask--shift {
          padding-left: clamp(0rem, 5vw, 5rem);
        }

        .wi-title__line {
          display: block;
          will-change: transform, opacity;
        }

        .wi-title__line--alt {
          font-style: italic;
          color: rgba(255, 255, 255, 0.78);
        }

        .wi-lede {
          max-width: 48ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(1rem, 1.35vw, 1.16rem);
          line-height: 1.68;
        }

        .wi-principle {
          display: grid;
          grid-template-columns: minmax(140px, 0.45fr) minmax(0, 1.15fr) minmax(300px, 0.9fr);
          align-items: center;
          gap: clamp(1.2rem, 3vw, 2.6rem);
          margin-bottom: clamp(2.4rem, 5vw, 4.5rem);
          padding: clamp(1.2rem, 2.2vw, 1.9rem) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
        }

        .wi-principle__label {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.48);
        }

        .wi-principle__quote {
          margin: 0;
          font-family: var(--font-heading, Georgia, serif);
          font-size: clamp(1.35rem, 2.3vw, 2.28rem);
          line-height: 1.16;
          color: rgba(255, 255, 255, 0.92);
        }

        .wi-principle__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.56rem;
        }

        .wi-principle__list li {
          position: relative;
          padding-left: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.56);
        }

        .wi-principle__list li::before {
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 0.36rem;
          height: 1px;
          content: "";
          background: rgba(255, 255, 255, 0.55);
        }

        .wi-ledger {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
        }

        .wi-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        }

        .wi-case {
          display: grid;
          grid-template-columns: minmax(62px, 0.12fr) minmax(0, 0.9fr) minmax(340px, 0.9fr) minmax(240px, 0.48fr);
          gap: clamp(1rem, 2.4vw, 2.4rem);
          padding: clamp(1.5rem, 3vw, 2.8rem) 0;
          align-items: start;
        }

        .wi-case__number {
          font-family: var(--font-heading, Georgia, serif);
          font-size: clamp(2rem, 3.4vw, 4rem);
          line-height: 0.9;
          color: rgba(255, 255, 255, 0.34);
          font-variant-numeric: tabular-nums;
        }

        .wi-case__topline {
          display: flex;
          gap: 1rem;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: clamp(0.95rem, 1.4vw, 1.3rem);
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        .wi-case__topline span:first-child {
          color: rgba(255, 255, 255, 0.86);
        }

        .wi-case__topline span:last-child {
          text-align: right;
          max-width: 24ch;
        }

        .wi-case__title {
          margin: 0;
          max-width: 12ch;
          font-family: var(--font-heading, Georgia, serif);
          font-size: clamp(2rem, 3.45vw, 4.1rem);
          font-weight: 400;
          line-height: 0.98;
          letter-spacing: 0;
          color: rgba(255, 255, 255, 0.95);
        }

        .wi-case__pressure {
          max-width: 38ch;
          margin: clamp(1.1rem, 1.8vw, 1.55rem) 0 0;
          color: rgba(255, 255, 255, 0.64);
          font-size: 0.98rem;
          line-height: 1.62;
        }

        .wi-case__brief {
          display: grid;
          gap: clamp(1rem, 1.7vw, 1.45rem);
        }

        .wi-brief__block {
          padding: 0;
        }

        .wi-brief__block span {
          display: block;
          margin-bottom: 0.48rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.48);
        }

        .wi-brief__block p {
          margin: 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: 0.94rem;
          line-height: 1.58;
        }

        .wi-brief__block--proof p {
          color: rgba(255, 255, 255, 0.9);
        }

        .wi-case__ownership {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 1.8vw, 1.6rem);
        }

        .wi-case__ownership div {
          padding: 0;
        }

        .wi-case__ownership dt {
          margin-bottom: 0.45rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.64rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.44);
        }

        .wi-case__ownership dd {
          margin: 0;
          font-family: var(--font-heading, Georgia, serif);
          font-size: clamp(1.18rem, 1.55vw, 1.5rem);
          line-height: 1.1;
          color: rgba(255, 255, 255, 0.88);
        }

        .wi-foot {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding-top: clamp(1.8rem, 3vw, 2.8rem);
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.54);
        }

        .wi-foot__sig {
          color: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
        }

        @media (max-width: 1220px) {
          .wi-case {
            grid-template-columns: minmax(54px, 0.12fr) minmax(0, 1fr) minmax(320px, 0.85fr);
          }

          .wi-case__ownership {
            grid-column: 2 / -1;
            flex-direction: row;
          }
        }

        @media (max-width: 980px) {
          .wi-hero,
          .wi-principle {
            grid-template-columns: 1fr;
          }

          .wi-title__mask--shift {
            padding-left: 0;
          }

          .wi-case {
            grid-template-columns: minmax(44px, 0.14fr) minmax(0, 1fr);
          }

          .wi-case__brief,
          .wi-case__ownership {
            grid-column: 2 / -1;
          }
        }

        @media (max-width: 640px) {
          .wi-inner {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .wi-head {
            align-items: flex-start;
            flex-direction: column;
            gap: 0.7rem;
          }

          .wi-kicker {
            max-width: 34ch;
            line-height: 1.6;
          }

          .wi-title {
            font-size: clamp(2.45rem, 13vw, 4.1rem);
          }

          .wi-case {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .wi-case__number,
          .wi-case__brief,
          .wi-case__ownership {
            grid-column: auto;
          }

          .wi-case__topline {
            align-items: flex-start;
            flex-direction: column;
            gap: 0.45rem;
          }

          .wi-case__topline span:last-child {
            max-width: none;
            text-align: left;
          }

          .wi-case__title {
            max-width: 10.5ch;
          }

          .wi-case__ownership {
            flex-direction: column;
          }

          .wi-foot {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
};

export default ClaudeVariant09;
