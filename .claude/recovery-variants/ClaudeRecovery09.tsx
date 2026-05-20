import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Brief = {
  index: string;
  industry: string;
  hook: string;
  problem: string;
  call: string;
  outcome: string;
};

const BRIEFS: Brief[] = [
  {
    index: "I",
    industry: "Healthcare",
    hook: "The handoff, not the record.",
    problem:
      "A patient's referral was sitting between two teams that never spoke. The data was fine. The ownership wasn't.",
    call:
      "I drew the seam first — who is accountable the moment a name leaves one queue and lands in another.",
    outcome:
      "Cycle time on referrals dropped enough that the clinic stopped staffing a workaround role.",
  },
  {
    index: "II",
    industry: "Banking",
    hook: "Explain it a year from now.",
    problem:
      "Decisions were getting made quickly and forgotten just as fast. When the regulator asked, nobody could reconstruct why.",
    call:
      "I treated the audit answer as the product, not the byproduct — write the memo before writing anything else.",
    outcome:
      "The next exam closed without a finding. The team kept the practice because it shortened their own arguments.",
  },
  {
    index: "III",
    industry: "Retail",
    hook: "The seams between people.",
    problem:
      "Online return, store pickup, warehouse rebalance — four good teams, none of them owning the moment in between.",
    call:
      "I rewrote the operating contract before touching anything else. Who picks up cold. Who calls the customer.",
    outcome:
      "Lost-in-transit cases fell by about a third. Most of the savings came from a phone call that no longer happened.",
  },
  {
    index: "IV",
    industry: "Public Sector",
    hook: "Outcomes in public.",
    problem:
      "A benefits program where eligibility was right, but the citizen couldn't tell whether their case was moving.",
    call:
      "I worked backward from a sentence a person could read on a Tuesday and act on. Everything upstream had to serve that.",
    outcome:
      "Inbound questions dropped. Caseworkers got their afternoons back. The program kept its funding cycle.",
  },
];

const PRINCIPLES = [
  "Ownership before architecture.",
  "The business case is the brief.",
  "If it can't be read aloud, it isn't decided.",
];

export const ClaudeRecovery09 = () => {
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
          ".memo-eyebrow, .memo-title__line, .memo-lede, .memo-brief, .memo-stack, .memo-principle, .memo-foot",
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
          ".memo-eyebrow",
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
          ".memo-title__line",
          { autoAlpha: 0, y: "110%" },
          {
            autoAlpha: 1,
            y: "0%",
            duration: 0.9,
            stagger: 0.12,
            ease: "power4.out",
            immediateRender: false,
          },
          "-=0.2",
        )
        .fromTo(
          ".memo-lede",
          { autoAlpha: 0, y: 18 },
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
          ".memo-stack__sheet",
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.5",
        )
        .fromTo(
          ".memo-brief",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.6",
        )
        .fromTo(
          ".memo-principle",
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            immediateRender: false,
          },
          "-=0.35",
        )
        .fromTo(
          ".memo-foot",
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

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="practice" className="memo">
      <div className="memo-inner">
        <header className="memo-head">
          <div className="memo-eyebrow">
            <span>01</span>
            <span className="memo-eyebrow__rule" />
            <span>Practice</span>
          </div>
          <p className="memo-meta">
            A short memorandum &middot; four industries, the same job
          </p>
        </header>

        <div className="memo-headline">
          <h2 className="memo-title">
            <span className="memo-title__mask">
              <span className="memo-title__line">The work, written down</span>
            </span>
            <span className="memo-title__mask memo-title__mask--shift">
              <span className="memo-title__line memo-title__line--alt">
                before it is drawn.
              </span>
            </span>
          </h2>
          <p className="memo-lede">
            I&rsquo;m Sai Kiran. I work as an architect of decisions &mdash; the
            kind that have to hold up in a hospital corridor, a credit
            committee, a returns line, or a public hearing. Each of the four
            briefs below is real practice, written the way I&rsquo;d hand it to
            a sponsor: the problem in a sentence, the call I made, and what
            actually changed.
          </p>
        </div>

        <div className="memo-body">
          <div
            className="memo-stack"
            aria-label="A stack of memorandum sheets — cover, body, and signature"
          >
            <div className="memo-stack__sheet memo-stack__sheet--three" aria-hidden="true">
              <div className="memo-stack__lines">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="memo-stack__sheet memo-stack__sheet--two" aria-hidden="true">
              <div className="memo-stack__row">
                <span className="memo-stack__tag">Re:</span>
                <span className="memo-stack__redacted memo-stack__redacted--lg" />
              </div>
              <div className="memo-stack__row">
                <span className="memo-stack__tag">From:</span>
                <span className="memo-stack__redacted memo-stack__redacted--md" />
              </div>
              <div className="memo-stack__rule" />
              <div className="memo-stack__lines">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="memo-stack__sheet memo-stack__sheet--one">
              <header className="memo-stack__head">
                <span className="memo-stack__kicker">Memorandum</span>
                <span className="memo-stack__date">No. 47 &middot; in confidence</span>
              </header>
              <div className="memo-stack__field">
                <span className="memo-stack__tag">To</span>
                <span className="memo-stack__value">The sponsor of the work</span>
              </div>
              <div className="memo-stack__field">
                <span className="memo-stack__tag">From</span>
                <span className="memo-stack__value">Sai Kiran, on the practice</span>
              </div>
              <div className="memo-stack__field">
                <span className="memo-stack__tag">Re</span>
                <span className="memo-stack__value">
                  Where I make the call before anyone draws a line
                </span>
              </div>
              <div className="memo-stack__rule" />
              <p className="memo-stack__body">
                Most of the work is choosing what the business is allowed to
                promise &mdash; and to whom &mdash; before any of it is built.
                The four pages that follow are the briefs I keep returning to.
              </p>
              <footer className="memo-stack__foot">
                <span className="memo-stack__sig">&mdash; S.K.R.</span>
                <span className="memo-stack__seal" aria-hidden="true">
                  <span />
                  <span />
                </span>
              </footer>
            </div>
          </div>

          <ol className="memo-briefs">
            {BRIEFS.map((brief) => (
              <li key={brief.industry} className="memo-brief">
                <header className="memo-brief__head">
                  <span className="memo-brief__index">{brief.index}.</span>
                  <span className="memo-brief__industry">{brief.industry}</span>
                </header>
                <h3 className="memo-brief__hook">{brief.hook}</h3>
                <dl className="memo-brief__fields">
                  <div className="memo-brief__field">
                    <dt>The brief</dt>
                    <dd>{brief.problem}</dd>
                  </div>
                  <div className="memo-brief__field">
                    <dt>The call I made</dt>
                    <dd>{brief.call}</dd>
                  </div>
                  <div className="memo-brief__field">
                    <dt>What changed</dt>
                    <dd>{brief.outcome}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>

        <aside className="memo-principles" aria-label="Three working principles">
          <span className="memo-principles__label">Working principles</span>
          <ul className="memo-principles__list">
            {PRINCIPLES.map((line, i) => (
              <li key={line} className="memo-principle">
                <span className="memo-principle__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="memo-principle__text">{line}</span>
              </li>
            ))}
          </ul>
        </aside>

        <footer className="memo-foot">
          <span className="memo-foot__sig">&mdash; Sai Kiran</span>
          <span className="memo-foot__rule" />
          <span className="memo-foot__caption">
            First-person notes. Filed before the first line is drawn.
          </span>
        </footer>
      </div>

      <style jsx>{`
        .memo {
          position: relative;
          z-index: 2;
          overflow: hidden;
          color: #fff;
          background:
            radial-gradient(
              80% 50% at 50% 0%,
              rgba(255, 255, 255, 0.04),
              transparent 65%
            ),
            linear-gradient(180deg, #000 0%, #070707 50%, #000 100%);
          isolation: isolate;
        }

        .memo::before {
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
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            );
          background-size: 96px 96px;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            #000 16%,
            #000 84%,
            transparent 100%
          );
          pointer-events: none;
        }

        .memo-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 1380px);
          margin: 0 auto;
          padding: clamp(4rem, 7vw, 7rem) clamp(1.25rem, 5vw, 5rem)
            clamp(5rem, 7vw, 7rem);
        }

        .memo-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: clamp(2.4rem, 4.5vw, 4rem);
        }

        .memo-eyebrow {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.74);
        }

        .memo-eyebrow__rule {
          display: block;
          width: min(11vw, 140px);
          height: 1px;
          background: rgba(255, 255, 255, 0.32);
        }

        .memo-meta {
          margin: 0;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.46);
        }

        .memo-headline {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.85fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
          margin-bottom: clamp(2.8rem, 5vw, 4.6rem);
        }

        .memo-title {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(2.5rem, 5.4vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.012em;
        }

        .memo-title__mask {
          display: block;
          overflow: hidden;
          padding-bottom: 0.08em;
        }

        .memo-title__mask--shift {
          padding-left: clamp(0rem, 5vw, 5rem);
        }

        .memo-title__line {
          display: block;
          will-change: transform, opacity;
        }

        .memo-title__line--alt {
          font-style: italic;
          color: rgba(255, 255, 255, 0.78);
        }

        .memo-lede {
          max-width: 48ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(1rem, 1.35vw, 1.16rem);
          line-height: 1.7;
        }

        .memo-body {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.25fr);
          gap: clamp(2rem, 4vw, 4rem);
          align-items: start;
          margin-bottom: clamp(2.6rem, 5vw, 4rem);
        }

        /* ---------- Stack of sheets ---------- */
        .memo-stack {
          position: sticky;
          top: clamp(2rem, 6vw, 5rem);
          position: relative;
          padding: clamp(1.2rem, 3vw, 2.4rem) clamp(0.6rem, 2vw, 1.6rem);
          min-height: clamp(420px, 38vw, 560px);
        }

        .memo-stack__sheet {
          position: relative;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.055) 0%,
              rgba(255, 255, 255, 0.018) 100%
            ),
            #050505;
          border: 1px solid rgba(255, 255, 255, 0.14);
          padding: clamp(1.1rem, 1.8vw, 1.6rem) clamp(1rem, 1.8vw, 1.6rem);
          will-change: transform, opacity;
        }

        .memo-stack__sheet--three {
          position: absolute;
          top: clamp(0.6rem, 1.4vw, 1.2rem);
          left: clamp(2rem, 4vw, 3.4rem);
          right: clamp(0.4rem, 1vw, 0.8rem);
          height: clamp(220px, 22vw, 320px);
          transform: rotate(-1.2deg);
          opacity: 0.55;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.01)
            ),
            #040404;
          border-color: rgba(255, 255, 255, 0.08);
        }

        .memo-stack__sheet--two {
          position: absolute;
          top: clamp(1.4rem, 3vw, 2.4rem);
          left: clamp(1rem, 2.4vw, 1.8rem);
          right: clamp(1.2rem, 2.6vw, 2rem);
          height: clamp(260px, 26vw, 360px);
          transform: rotate(0.8deg);
          opacity: 0.78;
        }

        .memo-stack__sheet--one {
          position: relative;
          margin-top: clamp(2.6rem, 5vw, 4.2rem);
          margin-left: clamp(0.2rem, 0.8vw, 0.6rem);
          margin-right: clamp(1.8rem, 3.4vw, 2.6rem);
          transform: rotate(-0.4deg);
          z-index: 2;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.04) inset,
            0 18px 40px -28px rgba(0, 0, 0, 0.9);
        }

        .memo-stack__head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: clamp(0.9rem, 1.6vw, 1.4rem);
          padding-bottom: 0.7rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .memo-stack__kicker {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: rgba(255, 255, 255, 0.78);
        }

        .memo-stack__date {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.42);
        }

        .memo-stack__field {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 0.8rem;
          padding: 0.35rem 0;
          align-items: baseline;
        }

        .memo-stack__tag {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.48);
        }

        .memo-stack__value {
          font-family: var(--font-heading, serif);
          font-size: 0.98rem;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.92);
        }

        .memo-stack__rule {
          margin: 0.85rem 0 0.85rem;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
        }

        .memo-stack__body {
          margin: 0;
          font-family: var(--font-heading, serif);
          font-size: clamp(0.98rem, 1.2vw, 1.06rem);
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.78);
        }

        .memo-stack__foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: clamp(1rem, 2vw, 1.6rem);
          padding-top: 0.7rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .memo-stack__sig {
          font-family: var(--font-heading, serif);
          font-style: italic;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.86);
          letter-spacing: 0.04em;
        }

        .memo-stack__seal {
          position: relative;
          width: 30px;
          height: 30px;
          display: inline-block;
        }

        .memo-stack__seal span {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255, 255, 255, 0.32);
          border-radius: 50%;
        }

        .memo-stack__seal span + span {
          inset: 5px;
          border-color: rgba(255, 255, 255, 0.18);
        }

        .memo-stack__row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.3rem 0;
        }

        .memo-stack__redacted {
          display: block;
          height: 10px;
          background: rgba(255, 255, 255, 0.16);
        }

        .memo-stack__redacted--lg {
          width: 62%;
        }

        .memo-stack__redacted--md {
          width: 38%;
        }

        .memo-stack__lines {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          margin-top: 0.6rem;
        }

        .memo-stack__lines span {
          display: block;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .memo-stack__lines span:nth-child(1) {
          width: 100%;
        }
        .memo-stack__lines span:nth-child(2) {
          width: 92%;
        }
        .memo-stack__lines span:nth-child(3) {
          width: 96%;
        }
        .memo-stack__lines span:nth-child(4) {
          width: 78%;
        }
        .memo-stack__lines span:nth-child(5) {
          width: 88%;
        }
        .memo-stack__lines span:nth-child(6) {
          width: 64%;
        }

        /* ---------- Briefs ---------- */
        .memo-briefs {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(1.4rem, 2.6vw, 2.2rem);
        }

        .memo-brief {
          position: relative;
          padding: clamp(1.2rem, 2vw, 1.8rem) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          will-change: transform, opacity;
        }

        .memo-brief:last-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
        }

        .memo-brief__head {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 0.6rem;
        }

        .memo-brief__index {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          min-width: 2ch;
        }

        .memo-brief__industry {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.8);
        }

        .memo-brief__hook {
          margin: 0 0 0.9rem;
          font-family: var(--font-heading, serif);
          font-weight: 400;
          font-size: clamp(1.35rem, 2vw, 1.8rem);
          line-height: 1.18;
          color: rgba(255, 255, 255, 0.96);
          letter-spacing: -0.005em;
        }

        .memo-brief__fields {
          margin: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 0.7rem;
        }

        .memo-brief__field {
          display: grid;
          grid-template-columns: 140px minmax(0, 1fr);
          gap: 1.2rem;
          align-items: baseline;
        }

        .memo-brief__field dt {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.5);
        }

        .memo-brief__field dd {
          margin: 0;
          font-size: 0.98rem;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.78);
        }

        /* ---------- Principles ---------- */
        .memo-principles {
          display: grid;
          grid-template-columns: minmax(180px, auto) minmax(0, 1fr);
          gap: clamp(1.4rem, 3vw, 2.6rem);
          align-items: start;
          padding: clamp(1.4rem, 2.4vw, 2rem) 0;
          margin-bottom: clamp(2rem, 4vw, 3rem);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .memo-principles__label {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.5);
        }

        .memo-principles__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1.2rem, 3vw, 2.6rem);
        }

        .memo-principle {
          display: flex;
          align-items: baseline;
          gap: 0.7rem;
          flex: 1 1 220px;
          will-change: transform, opacity;
        }

        .memo-principle__num {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.46);
        }

        .memo-principle__text {
          font-family: var(--font-heading, serif);
          font-size: clamp(1rem, 1.25vw, 1.12rem);
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.9);
        }

        /* ---------- Footer ---------- */
        .memo-foot {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.55);
        }

        .memo-foot__sig {
          color: rgba(255, 255, 255, 0.9);
        }

        .memo-foot__rule {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.18);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1100px) {
          .memo-headline {
            grid-template-columns: 1fr;
            gap: 1.6rem;
            align-items: start;
          }

          .memo-body {
            grid-template-columns: 1fr;
            gap: 2.2rem;
          }

          .memo-stack {
            min-height: clamp(360px, 50vw, 480px);
          }
        }

        @media (max-width: 760px) {
          .memo-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }

          .memo-title__mask--shift {
            padding-left: 0;
          }

          .memo-brief__field {
            grid-template-columns: 1fr;
            gap: 0.2rem;
          }

          .memo-stack__field {
            grid-template-columns: 56px 1fr;
            gap: 0.6rem;
          }

          .memo-stack__sheet--three,
          .memo-stack__sheet--two {
            display: none;
          }

          .memo-stack__sheet--one {
            margin: 0;
            transform: none;
          }

          .memo-principles {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .memo-foot {
            flex-wrap: wrap;
          }

          .memo-foot__rule {
            order: 3;
            flex-basis: 100%;
          }
        }

        @media (max-width: 480px) {
          .memo-title {
            font-size: clamp(2.4rem, 11vw, 3.6rem);
          }

          .memo-brief__hook {
            font-size: clamp(1.2rem, 5.8vw, 1.5rem);
          }
        }
      `}</style>
    </section>
  );
};

export default ClaudeRecovery09;
