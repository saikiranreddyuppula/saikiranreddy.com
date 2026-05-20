import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Promise = {
  index: string;
  industry: string;
  toWhom: string;
  promise: string;
  breaks: string;
  protect: string;
  outcome: { figure: string; caption: string };
  signed: string;
};

const PROMISES: Promise[] = [
  {
    index: "01",
    industry: "Healthcare",
    toWhom: "to the patient",
    promise:
      "that the right person knows the right thing about you, in time for it to matter.",
    breaks:
      "When a record is technically present but practically invisible — sitting in one team's folder while another team is making a decision without it.",
    protect:
      "I draw the path the patient actually takes, not the one the org chart prefers. Then I argue, in plain language, about who is responsible at every handoff. Most of the work is naming the seam, out loud, before anyone has to live in it.",
    outcome: {
      figure: "37 min",
      caption: "shaved off a referral round-trip that used to take a full day",
    },
    signed: "for a regional hospital network",
  },
  {
    index: "02",
    industry: "Banking",
    toWhom: "to the customer and the regulator at the same time",
    promise:
      "that the bank can say, a year from now, exactly why it did what it did.",
    breaks:
      "When speed wins the room and nobody writes down the trade. A decision made in a meeting is not a decision a regulator can read.",
    protect:
      "I keep the why visible. I push for the boring version: who decided, what they saw, what they were willing to lose. The architecture I sign is the one a stranger can audit without me in the room.",
    outcome: {
      figure: "0 findings",
      caption: "on the first regulatory review after the rewrite",
    },
    signed: "for a tier-one retail bank",
  },
  {
    index: "03",
    industry: "Retail",
    toWhom: "to the shopper",
    promise:
      "that what they were told about — price, stock, return — is still true at the counter.",
    breaks:
      "Stores, warehouses, an app, a returns desk. Each one tells a slightly different version of the same truth, and the shopper is the one who finds out.",
    protect:
      "I look for the seam first. Where one team finishes and another picks it up cold is where the promise quietly slips. I'd rather slow a launch than ship a story we can't keep.",
    outcome: {
      figure: "1.8x",
      caption: "lift in completed returns after the seam was named and owned",
    },
    signed: "for a national retailer",
  },
  {
    index: "04",
    industry: "Public sector",
    toWhom: "to the citizen",
    promise:
      "that the program does, out loud, what the page said it would do.",
    breaks:
      "When eligibility is correct on paper but unreachable in practice. The form is the floor; the result is the ceiling; most programs lose the room in between.",
    protect:
      "I write things a non-builder can read. If a caseworker can't explain the decision to the person in front of them, the architecture is wrong, no matter how elegant it looks on my screen.",
    outcome: {
      figure: "+22%",
      caption:
        "completion rate for a benefits flow rewritten around the citizen, not the form",
    },
    signed: "for a state agency",
  },
];

export const ClaudeRecovery08 = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="promise"
      aria-labelledby="promise-title"
    >
      <header className="promise__masthead">
        <span className="promise__eyebrow" data-reveal>
          a working note
        </span>
        <h2 id="promise-title" className="promise__title" data-reveal>
          What I actually do<br />
          is keep promises legible.
        </h2>
        <p className="promise__lede" data-reveal>
          Every industry I work in is, at heart, one sentence said to a stranger:
          <em> we will do this for you.</em> The work I sign my name to is
          making sure that sentence is still true after it leaves the room —
          across teams, across years, across people who weren't there when it
          was written.
        </p>
        <div className="promise__rule" data-rule aria-hidden="true" />
      </header>

      <ol className="promise__list">
        {PROMISES.map((p) => (
          <li key={p.index} className="entry" data-reveal>
            <div className="entry__index" aria-hidden="true">
              <span className="entry__num">{p.index}</span>
              <span className="entry__industry">{p.industry}</span>
            </div>

            <div className="entry__body">
              <p className="entry__towhom">{p.toWhom}</p>
              <blockquote className="entry__promise">
                <span className="entry__quote" aria-hidden="true">&ldquo;</span>
                {p.promise}
              </blockquote>

              <div className="entry__grid">
                <div className="entry__col">
                  <span className="entry__label">where it breaks</span>
                  <p className="entry__text">{p.breaks}</p>
                </div>
                <div className="entry__col">
                  <span className="entry__label">how I hold it</span>
                  <p className="entry__text">{p.protect}</p>
                </div>
              </div>

              <div className="entry__foot">
                <div className="entry__outcome">
                  <span className="entry__figure">{p.outcome.figure}</span>
                  <span className="entry__caption">{p.outcome.caption}</span>
                </div>
                <span className="entry__signed">{p.signed}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <footer className="promise__coda" data-reveal>
        <div className="promise__rule" data-rule aria-hidden="true" />
        <p className="promise__signoff">
          The drawing on the wall is never the point. The point is the sentence
          underneath it — and whether, a year from now, it still reads true.
        </p>
        <span className="promise__signature">— Sai Kiran</span>
      </footer>

      <style jsx>{`
        .promise {
          position: relative;
          width: 100%;
          padding: clamp(96px, 14vw, 192px) clamp(24px, 6vw, 96px);
          background: #0a0a0a;
          color: #f4f4f4;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          overflow: hidden;
        }

        .promise::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              1200px 600px at 12% 8%,
              rgba(255, 255, 255, 0.04),
              transparent 60%
            ),
            radial-gradient(
              1000px 800px at 100% 100%,
              rgba(255, 255, 255, 0.025),
              transparent 60%
            );
          pointer-events: none;
        }

        .promise__masthead {
          position: relative;
          max-width: 1080px;
          margin: 0 auto clamp(72px, 10vw, 128px);
        }

        .promise__eyebrow {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(244, 244, 244, 0.5);
          margin-bottom: 28px;
        }

        .promise__title {
          font-family: "Cormorant Garamond", "Times New Roman", serif;
          font-weight: 400;
          font-size: clamp(40px, 6.4vw, 88px);
          line-height: 1.02;
          letter-spacing: -0.02em;
          margin: 0 0 36px;
          color: #fafafa;
        }

        .promise__lede {
          font-size: clamp(15px, 1.25vw, 19px);
          line-height: 1.7;
          max-width: 64ch;
          color: rgba(244, 244, 244, 0.74);
          margin: 0;
        }

        .promise__lede em {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          font-size: 1.15em;
          color: rgba(244, 244, 244, 0.95);
        }

        .promise__rule {
          height: 1px;
          width: 100%;
          background: linear-gradient(
            to right,
            rgba(244, 244, 244, 0.4),
            rgba(244, 244, 244, 0)
          );
          margin-top: 56px;
        }

        .promise__list {
          list-style: none;
          padding: 0;
          margin: 0 auto;
          max-width: 1080px;
          display: flex;
          flex-direction: column;
          gap: clamp(72px, 10vw, 128px);
        }

        .entry {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: clamp(32px, 5vw, 72px);
          position: relative;
        }

        .entry::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: clamp(-36px, -5vw, -64px);
          height: 1px;
          background: rgba(244, 244, 244, 0.08);
        }

        .entry:last-child::after {
          display: none;
        }

        .entry__index {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 14px;
          border-top: 1px solid rgba(244, 244, 244, 0.18);
        }

        .entry__num {
          font-family: "Cormorant Garamond", serif;
          font-size: 14px;
          letter-spacing: 0.2em;
          color: rgba(244, 244, 244, 0.55);
        }

        .entry__industry {
          font-size: 13px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #fafafa;
          font-weight: 500;
        }

        .entry__body {
          display: flex;
          flex-direction: column;
          gap: clamp(20px, 2.5vw, 32px);
        }

        .entry__towhom {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          font-size: clamp(15px, 1.2vw, 18px);
          color: rgba(244, 244, 244, 0.55);
          margin: 0;
          letter-spacing: 0.01em;
        }

        .entry__promise {
          font-family: "Cormorant Garamond", serif;
          font-weight: 400;
          font-size: clamp(24px, 3vw, 38px);
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: #fafafa;
          margin: 0;
          padding: 0;
          position: relative;
          max-width: 28ch;
        }

        .entry__quote {
          font-size: 1.3em;
          line-height: 0;
          color: rgba(244, 244, 244, 0.4);
          margin-right: 0.05em;
          vertical-align: -0.15em;
        }

        .entry__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(28px, 4vw, 56px);
          margin-top: 8px;
        }

        .entry__col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .entry__label {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(244, 244, 244, 0.42);
        }

        .entry__text {
          font-size: 15px;
          line-height: 1.65;
          color: rgba(244, 244, 244, 0.78);
          margin: 0;
        }

        .entry__foot {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          margin-top: 12px;
          padding-top: 28px;
          border-top: 1px solid rgba(244, 244, 244, 0.1);
          flex-wrap: wrap;
        }

        .entry__outcome {
          display: flex;
          align-items: baseline;
          gap: 18px;
          flex: 1 1 auto;
          min-width: 0;
        }

        .entry__figure {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 400;
          line-height: 1;
          color: #fafafa;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .entry__caption {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(244, 244, 244, 0.6);
          max-width: 38ch;
        }

        .entry__signed {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          font-size: 13px;
          color: rgba(244, 244, 244, 0.42);
          white-space: nowrap;
        }

        .promise__coda {
          position: relative;
          max-width: 1080px;
          margin: clamp(96px, 12vw, 160px) auto 0;
        }

        .promise__signoff {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          font-size: clamp(20px, 2.2vw, 28px);
          line-height: 1.45;
          color: rgba(244, 244, 244, 0.82);
          max-width: 56ch;
          margin: 40px 0 20px;
        }

        .promise__signature {
          display: inline-block;
          font-size: 12px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(244, 244, 244, 0.55);
        }

        @media (max-width: 760px) {
          .entry {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .entry__index {
            flex-direction: row;
            align-items: baseline;
            gap: 18px;
            padding-top: 10px;
          }

          .entry__grid {
            grid-template-columns: 1fr;
          }

          .entry__foot {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global([data-reveal]),
          :global([data-rule]) {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ClaudeRecovery08;
