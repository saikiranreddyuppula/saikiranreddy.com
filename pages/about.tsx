import type { NextPage } from "next";
import PageFrame from "../components/PageFrame";
import { capabilities, profile } from "../lib/content";

const AboutPage: NextPage = () => {
  return (
    <PageFrame
      title="About"
      description="Solutions Architect at Hertz. Systems, platforms, and the work between a prototype and production."
    >
      <article className="page">
        <p className="kicker">01 — Dossier</p>
        <h1>
          {profile.title}
          <em> at {profile.company}.</em>
        </h1>
        <p className="lede">{profile.headline}</p>
        <div className="body">
          {profile.about.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
        <dl className="facts">
          <div>
            <dt>Now</dt>
            <dd>
              {profile.title}, {profile.company}
            </dd>
          </div>
          <div>
            <dt>Based</dt>
            <dd>{profile.location}</dd>
          </div>
          <div>
            <dt>School</dt>
            <dd>
              {profile.education.school}
              <span>{profile.education.note}</span>
            </dd>
          </div>
        </dl>
        <h2>What I reach for</h2>
        <ul className="caps">
          {capabilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <style jsx>{`
        .page {
          max-width: 880px;
          margin: 0 auto;
          padding: 5rem 2rem 7rem;
        }
        .kicker {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 1.5rem;
        }
        h1 {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(3rem, 8vw, 5.4rem);
          font-weight: 300;
          line-height: 1.08;
          margin: 0 0 1.5rem;
        }
        h1 em {
          display: block;
          font-style: italic;
          color: rgba(255, 255, 255, 0.45);
        }
        .lede {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: 1.4rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.55);
          margin: 0 0 3rem;
          max-width: 36rem;
        }
        .body p {
          color: rgba(255, 255, 255, 0.58);
          line-height: 1.75;
          margin: 0 0 1.2rem;
          max-width: 38rem;
        }
        .facts {
          display: grid;
          gap: 1.5rem;
          margin: 3.5rem 0;
          padding: 2rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        dt {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 0.35rem;
        }
        dd {
          margin: 0;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: 1.35rem;
          font-weight: 300;
        }
        dd span {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.95rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.4);
        }
        h2 {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: 2rem;
          font-weight: 300;
          margin: 0 0 1.25rem;
        }
        .caps {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .caps li {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.45rem 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </PageFrame>
  );
};

export default AboutPage;
