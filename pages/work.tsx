import type { NextPage } from "next";
import PageFrame from "../components/PageFrame";
import { industries, projects } from "../lib/content";

const WorkPage: NextPage = () => {
  return (
    <PageFrame
      title="Work"
      description="Industries and selected projects — hospitality, ecommerce, healthcare, security, and generative AI."
    >
      <article className="page">
        <p className="kicker">02 — Atlas</p>
        <h1>
          Domains I have
          <em> already been inside.</em>
        </h1>
        <ol className="industries">
          {industries.map((item) => (
            <li key={item.name}>
              <span className="num">{item.number}</span>
              <div>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <h2 className="sub">Selected work</h2>
        <ul className="projects">
          {projects.map((project) => (
            <li key={project.name}>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <span className="year">{project.year}</span>
                <strong>{project.name}</strong>
                <span className="blurb">{project.blurb}</span>
              </a>
            </li>
          ))}
        </ul>
      </article>
      <style jsx>{`
        .page {
          max-width: 960px;
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
          font-size: clamp(2.8rem, 7vw, 5rem);
          font-weight: 300;
          line-height: 1.08;
          margin: 0 0 3rem;
        }
        h1 em {
          display: block;
          font-style: italic;
          color: rgba(255, 255, 255, 0.45);
        }
        .industries {
          list-style: none;
        }
        .industries li {
          display: grid;
          grid-template-columns: 3.5rem 1fr;
          gap: 1.25rem;
          padding: 1.75rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .num {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          padding-top: 0.55rem;
        }
        h2 {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: 2.1rem;
          font-weight: 300;
          margin: 0 0 0.5rem;
        }
        p {
          margin: 0;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.65;
          max-width: 36rem;
        }
        .sub {
          margin: 4rem 0 1.25rem;
        }
        .projects {
          list-style: none;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .projects a {
          display: grid;
          gap: 0.35rem;
          padding: 1.4rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .year {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.32);
        }
        strong {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: 1.6rem;
          font-weight: 400;
        }
        .blurb {
          color: rgba(255, 255, 255, 0.42);
          line-height: 1.6;
        }
      `}</style>
    </PageFrame>
  );
};

export default WorkPage;
