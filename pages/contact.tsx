import type { NextPage } from "next";
import PageFrame from "../components/PageFrame";
import { profile } from "../lib/content";

const ContactPage: NextPage = () => {
  return (
    <PageFrame
      title="Contact"
      description="Available for full-time roles and consulting. hello@saikiranreddy.com"
    >
      <article className="page">
        <p className="kicker">04 — Contact</p>
        <h1>
          Let&apos;s build something
          <em> extraordinary.</em>
        </h1>
        <p className="lede">
          Available for full-time roles and consulting. Chicago time, most days.
        </p>
        <a href={`mailto:${profile.email}`} className="email interactive">
          {profile.email}
          <span>→</span>
        </a>
        <ul>
          {profile.socials.map((link) => (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </article>
      <style jsx>{`
        .page {
          max-width: 860px;
          margin: 0 auto;
          padding: 5rem 2rem 8rem;
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
          margin: 0 0 1.25rem;
        }
        h1 em {
          display: block;
          font-style: italic;
          color: rgba(255, 255, 255, 0.45);
        }
        .lede {
          color: rgba(255, 255, 255, 0.45);
          margin: 0 0 2.5rem;
        }
        .email {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono);
          font-size: 1rem;
          letter-spacing: 0.04em;
          border: 1px solid rgba(255, 255, 255, 0.22);
          padding: 1.1rem 1.6rem;
          color: #fff;
        }
        .email:hover {
          background: #fff;
          color: #000;
        }
        ul {
          list-style: none;
          display: flex;
          gap: 2rem;
          margin-top: 3rem;
        }
        a {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }
        ul a:hover {
          color: #fff;
        }
      `}</style>
    </PageFrame>
  );
};

export default ContactPage;
