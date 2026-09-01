import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { capabilities, profile } from "../lib/content";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let entranceTl: gsap.core.Timeline;

    const reveal = () => {
      if (!containerRef.current) return;
      containerRef.current.style.visibility = "visible";
      entranceTl?.play();
      gsap.delayedCall(0.15, () => ScrollTrigger.refresh());
    };

    window.addEventListener("revealAbout", reveal);

    if (window.scrollY > window.innerHeight * 0.5) {
      containerRef.current.style.visibility = "visible";
      gsap.delayedCall(0.08, reveal);
    }

    const ctx = gsap.context(() => {
      entranceTl = gsap.timeline({ paused: true });

      entranceTl
        .fromTo(
          ".ab-kicker",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        )
        .fromTo(
          ".ab-headline .line",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.7, stagger: 0.08, ease: "power4.out" },
          0.05,
        )
        .fromTo(
          ".ab-rail, .ab-copy p, .ab-caps, .ab-meter",
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power3.out",
          },
          0.2,
        );

      gsap.utils.toArray<HTMLElement>(".ab-meter-fill").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 90%" },
          },
        );
      });
    }, containerRef);

    return () => {
      window.removeEventListener("revealAbout", reveal);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="about-section"
      style={{ visibility: "hidden" }}
    >
      <div className="ab-shell">
        <div className="ab-rail">
          <div className="ab-kicker">
            <span>01</span>
            <i />
            <span>Dossier</span>
          </div>
          <dl>
            <div>
              <dt>Now</dt>
              <dd>
                {profile.title}
                <em>{profile.company}</em>
              </dd>
            </div>
            <div>
              <dt>Station</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>School</dt>
              <dd>
                {profile.education.school}
                <em>{profile.education.note}</em>
              </dd>
            </div>
          </dl>
        </div>

        <div className="ab-main">
          <h2 className="ab-headline">
            <span>
              <span className="line">I think in systems.</span>
            </span>
            <span>
              <span className="line italic">Not frameworks — systems.</span>
            </span>
          </h2>

          <div className="ab-copy">
            {profile.about.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>

          <ul className="ab-caps">
            {capabilities.map((item, i) => (
              <li key={item}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="ab-meter">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="ab-meter-row">
                <div className="ab-meter-top">
                  <b>
                    {stat.value}
                    {stat.suffix}
                  </b>
                  <span>{stat.label.replace("\n", " ")}</span>
                </div>
                <div className="ab-meter-track">
                  <span
                    className="ab-meter-fill"
                    style={{
                      width: `${Math.min(100, Number(stat.value) * (stat.value > 20 ? 1.6 : 8))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-section {
          position: relative;
          z-index: 2;
          background: #000;
          color: #fff;
          padding: 8rem 0 7rem;
        }

        .ab-shell {
          width: min(1280px, calc(100% - 5rem));
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 5rem;
        }

        .ab-rail {
          position: sticky;
          top: 6rem;
          align-self: start;
        }

        .ab-kicker {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }

        .ab-kicker i {
          width: 36px;
          height: 1px;
          background: rgba(255, 255, 255, 0.28);
        }

        dl {
          display: grid;
          gap: 1.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.75rem;
        }

        dt {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.32);
          margin-bottom: 0.4rem;
        }

        dd {
          margin: 0;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: 1.35rem;
          font-weight: 300;
          line-height: 1.3;
        }

        dd em {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .ab-headline {
          margin: 0 0 2.5rem;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(3rem, 7vw, 5.6rem);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.03em;
        }

        .ab-headline > span {
          display: block;
          overflow: hidden;
        }

        .ab-headline .line {
          display: block;
        }

        .ab-headline .italic {
          font-style: italic;
          color: rgba(255, 255, 255, 0.42);
        }

        .ab-copy {
          display: grid;
          gap: 1.15rem;
          max-width: 40rem;
          margin-bottom: 3rem;
        }

        .ab-copy p {
          margin: 0;
          color: rgba(255, 255, 255, 0.58);
          line-height: 1.75;
        }

        .ab-caps {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 3.5rem;
        }

        .ab-caps li {
          display: flex;
          gap: 0.9rem;
          align-items: baseline;
          padding: 0.95rem 1rem 0.95rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
        }

        .ab-caps li span {
          color: rgba(255, 255, 255, 0.28);
        }

        .ab-meter {
          display: grid;
          gap: 1.1rem;
        }

        .ab-meter-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.45rem;
        }

        .ab-meter-top b {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: 2rem;
          font-weight: 300;
        }

        .ab-meter-top span {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
        }

        .ab-meter-track {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .ab-meter-fill {
          display: block;
          height: 1px;
          background: #fff;
          transform-origin: left center;
        }

        @media (max-width: 900px) {
          .ab-shell {
            width: calc(100% - 2.5rem);
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .ab-rail {
            position: static;
          }
          .ab-caps {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
