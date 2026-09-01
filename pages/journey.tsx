import type { NextPage } from "next";
import PageFrame from "../components/PageFrame";
import { journey } from "../lib/content";

const JourneyPage: NextPage = () => {
  return (
    <PageFrame
      title="Journey"
      description="From LPU to Hertz — the climb, the platforms, and the systems along the way."
    >
      <article className="page">
        <p className="kicker">03 — Ascent</p>
        <h1>
          Base camp to
          <em> ridge line.</em>
        </h1>
        <ol>
          {journey.map((item) => (
            <li key={item.stage}>
              <div className="meta">
                <span>{item.stage}</span>
                <span>{item.year}</span>
              </div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </article>
      <style jsx>{`
        .page {
          max-width: 820px;
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
          font-size: clamp(3rem, 8vw, 5.2rem);
          font-weight: 300;
          line-height: 1.08;
          margin: 0 0 2.5rem;
        }
        h1 em {
          display: block;
          font-style: italic;
          color: rgba(255, 255, 255, 0.45);
        }
        ol {
          list-style: none;
        }
        li {
          padding: 2rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .meta {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 0.7rem;
        }
        h2 {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: 2.1rem;
          font-weight: 300;
          margin: 0 0 0.6rem;
        }
        p {
          margin: 0;
          color: rgba(255, 255, 255, 0.48);
          line-height: 1.7;
        }
      `}</style>
    </PageFrame>
  );
};

export default JourneyPage;
