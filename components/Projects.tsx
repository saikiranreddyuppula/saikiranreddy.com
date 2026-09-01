import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { projects } from "../lib/content";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wk-head > *",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 78%" },
        },
      );

      gsap.utils.toArray<HTMLElement>(".wk-row").forEach((row) => {
        gsap.fromTo(
          row,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 92%" },
          },
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="projects" className="work-index">
      <div className="wk-wrap">
        <div className="wk-head">
          <div className="wk-kicker">
            <span>02b</span>
            <i />
            <span>Selected work</span>
          </div>
          <h2>
            Things I have actually
            <em> shipped into the world.</em>
          </h2>
        </div>

        <div className="wk-list">
          {projects.map((project, i) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="wk-row interactive"
            >
              <span className="wk-no">{String(i + 1).padStart(2, "0")}</span>
              <span className="wk-year">{project.year}</span>
              <div className="wk-body">
                <h3>{project.name}</h3>
                <p>{project.blurb}</p>
                <ul>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              <span className="wk-go" aria-hidden>
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .work-index {
          position: relative;
          z-index: 2;
          background: #000;
          color: #fff;
          padding: 7rem 0 6rem;
        }

        .wk-wrap {
          width: min(1100px, calc(100% - 5rem));
          margin: 0 auto;
        }

        .wk-kicker {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.4rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }

        .wk-kicker i {
          width: 36px;
          height: 1px;
          background: rgba(255, 255, 255, 0.28);
        }

        h2 {
          margin: 0 0 3rem;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(2.6rem, 5.5vw, 4.6rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.03em;
        }

        h2 em {
          display: block;
          font-style: italic;
          color: rgba(255, 255, 255, 0.42);
        }

        .wk-list {
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .wk-row {
          display: grid;
          grid-template-columns: 3rem 4.5rem 1fr auto;
          gap: 1.25rem;
          align-items: start;
          padding: 1.7rem 0.4rem 1.7rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          transition: background 0.25s ease, padding-left 0.25s ease;
        }

        .wk-row:hover {
          background: #fff;
          color: #000;
          padding-left: 0.8rem;
        }

        .wk-no,
        .wk-year,
        .wk-go {
          font-family: var(--font-mono);
          font-size: 0.64rem;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.32);
          padding-top: 0.55rem;
        }

        .wk-row:hover .wk-no,
        .wk-row:hover .wk-year,
        .wk-row:hover .wk-go,
        .wk-row:hover p,
        .wk-row:hover li {
          color: rgba(0, 0, 0, 0.5);
        }

        h3 {
          margin: 0 0 0.4rem;
          font-family: "Cormorant Garamond", var(--font-serif);
          font-size: clamp(1.7rem, 3vw, 2.3rem);
          font-weight: 300;
          letter-spacing: -0.02em;
        }

        p {
          margin: 0 0 0.7rem;
          max-width: 36rem;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.6;
        }

        ul {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        li {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
        }

        .wk-go {
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .wk-wrap {
            width: calc(100% - 2rem);
          }
          .wk-row {
            grid-template-columns: 2.4rem 1fr auto;
          }
          .wk-year {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;
