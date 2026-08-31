import React from "react";
import Head from "next/head";
import SiteHeader from "./SiteHeader";
import CustomCursor from "./CustomCursor";
import { profile } from "../lib/content";

const PageFrame = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  const fullTitle = `${title} · ${profile.name}`;
  const desc =
    description ||
    "Portfolio of Sai Kiran Reddy — Solutions Architect and Engineer.";

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={desc} />
        <meta name="theme-color" content="#000000" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={desc} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CustomCursor />
      <div className="page-frame">
        <SiteHeader />
        <main>{children}</main>
        <footer className="page-foot">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </footer>
      </div>
      <style jsx>{`
        .page-frame {
          min-height: 100vh;
          background: #000;
          color: #fff;
        }

        .page-foot {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 2rem 2.5rem 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.35);
        }

        .page-foot a:hover {
          color: #fff;
        }
      `}</style>
    </>
  );
};

export default PageFrame;
