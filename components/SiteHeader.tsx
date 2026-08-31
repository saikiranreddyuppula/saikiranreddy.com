import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { nav, profile } from "../lib/content";

const SiteHeader = () => {
  const { pathname } = useRouter();

  return (
    <header className="site-header">
      <Link href="/" className="site-mark interactive">
        <span className="mark-index">SKR</span>
        <span className="mark-name">{profile.name}</span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`site-link interactive ${active ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <a href={`mailto:${profile.email}`} className="site-cta interactive">
        Write
      </a>

      <style jsx>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.25rem 2.5rem;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .site-mark {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          min-width: 0;
        }

        .mark-index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          color: #fff;
        }

        .mark-name {
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: 1.05rem;
          font-weight: 300;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
        }

        .site-nav {
          display: flex;
          gap: 1.75rem;
          margin-left: auto;
        }

        .site-link {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
          position: relative;
        }

        .site-link:hover,
        .site-link.is-active {
          color: #fff;
        }

        .site-link.is-active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -0.45rem;
          height: 1px;
          background: rgba(255, 255, 255, 0.55);
        }

        .site-cta {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #000;
          background: #fff;
          padding: 0.45rem 0.9rem;
          border: 1px solid #fff;
        }

        .site-cta:hover {
          background: transparent;
          color: #fff;
        }

        @media (max-width: 860px) {
          .site-header {
            padding: 1rem 1.25rem;
            gap: 1rem;
          }

          .mark-name {
            display: none;
          }

          .site-nav {
            gap: 1rem;
            overflow-x: auto;
          }

          .site-cta {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default SiteHeader;
