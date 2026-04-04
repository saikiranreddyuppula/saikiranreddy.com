import React, { useMemo, useState } from "react";

// ─── Seeded pseudo-random ───
const sr = (s: number) => {
  const x = Math.sin(s * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

interface Pt { x: number; y: number }
const f = (v: number) => v.toFixed(5);

// Smooth points by averaging neighbors
const smooth = (pts: Pt[], passes: number): Pt[] => {
  let result = pts;
  for (let p = 0; p < passes; p++) {
    const next: Pt[] = [result[0]];
    for (let i = 1; i < result.length - 1; i++) {
      next.push({
        x: result[i].x,
        y: result[i - 1].y * 0.25 + result[i].y * 0.5 + result[i + 1].y * 0.25,
      });
    }
    next.push(result[result.length - 1]);
    result = next;
  }
  return result;
};

// Two-scale torn edge
const tornPts = (
  n: number, seed: number, baseY: number, amp: number, slope = 0
): Pt[] => {
  const raw: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const r = (sr(seed + i * 7.13 + 31) - 0.5) * 2;
    const y = baseY + r * amp + t * slope;
    raw.push({ x: t, y: Math.max(0, Math.min(1, y)) });
  }
  const broad = smooth(raw, 3);
  const detail: Pt[] = [];
  const fineAmp = amp * 0.35;
  for (let i = 0; i < broad.length - 1; i++) {
    const a = broad[i], b = broad[i + 1];
    detail.push(a);
    for (let j = 1; j <= 3; j++) {
      const t = j / 4;
      const mx = a.x + (b.x - a.x) * t;
      const my = a.y + (b.y - a.y) * t;
      const fn = (sr(seed + i * 17.3 + j * 41.7 + 200) - 0.5) * fineAmp;
      detail.push({ x: mx, y: Math.max(0, Math.min(1, my + fn)) });
    }
  }
  detail.push(broad[broad.length - 1]);
  return detail;
};

const curvesThrough = (pts: Pt[]): string => {
  if (pts.length < 2) return "";
  let d = "";
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C ${f(p1.x + (p2.x - p0.x) / 6)},${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)},${f(p2.y - (p3.y - p1.y) / 6)} ${f(p2.x)},${f(p2.y)} `;
  }
  return d;
};

const tornBot = (seed: number, baseY: number, amp: number, slope = 0) => {
  const pts = tornPts(16, seed, baseY, amp, slope);
  const rev = [...pts].reverse();
  return `M 0,0 L 1,0 L ${f(rev[0].x)},${f(rev[0].y)} ${curvesThrough(rev)} Z`;
};

const tornTop = (seed: number, baseY: number, amp: number, slope = 0) => {
  const pts = tornPts(16, seed, baseY, amp, slope);
  return `M ${f(pts[0].x)},${f(pts[0].y)} ${curvesThrough(pts)} L 1,1 L 0,1 Z`;
};

const tornBoth = (
  sT: number, yT: number, aT: number, slT: number,
  sB: number, yB: number, aB: number, slB: number,
) => {
  const top = tornPts(16, sT, yT, aT, slT);
  const bot = tornPts(16, sB, yB, aB, slB);
  const botRev = [...bot].reverse();
  return `M ${f(top[0].x)},${f(top[0].y)} ${curvesThrough(top)} L ${f(botRev[0].x)},${f(botRev[0].y)} ${curvesThrough(botRev)} Z`;
};

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

interface PaperProps {
  id: string;
  bg: string;
  pos: React.CSSProperties;
  z: number;
  rotate?: number;
  fringe?: number;
  selected: string | null;
  onSelect: (id: string) => void;
  children: React.ReactNode;
}

const Paper: React.FC<PaperProps> = ({ id, bg, pos, z, rotate = 0, fringe = 26, selected, onSelect, children }) => {
  const dimmed = selected !== null && selected !== id;
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      style={{
        position: "absolute", ...pos, zIndex: selected === id ? 100 : z,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        opacity: dimmed ? 0.08 : 1,
        transition: "opacity 0.4s ease, z-index 0s",
        cursor: "pointer",
      }}
    >
      {/* Torn edge layers — filtered for organic distortion */}
      <div style={{ filter: fringe > 0 ? "url(#torn-disp)" : undefined }}>
        <div style={{
          position: "absolute",
          top: `-${fringe}px`, left: `-${fringe + 2}px`,
          right: `-${fringe + 2}px`, bottom: `-${fringe + 16}px`,
          backgroundColor: "rgba(0,0,0,0.4)",
          clipPath: `url(#${id})`, filter: "blur(16px)",
        }} />
        <div style={{
          position: "absolute", inset: `-${fringe}px`,
          background: "#f0f0f0", clipPath: `url(#${id})`,
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
        }} />
        <div style={{
          position: "absolute", inset: `-${Math.round(fringe * 0.65)}px`,
          background: "#d8d8d8", clipPath: `url(#${id})`,
        }} />
        <div style={{
          position: "absolute", inset: `-${Math.round(fringe * 0.35)}px`,
          background: "#e4e4e4", clipPath: `url(#${id})`,
        }} />
      </div>
      {/* Paper surface + content — NO filter, crisp text */}
      <div style={{
        position: "absolute", inset: "6px",
        backgroundColor: bg, clipPath: `url(#${id})`, overflow: "hidden",
      }}>
        {children}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: GRAIN_SVG, opacity: 0.1,
          mixBlendMode: "multiply", pointerEvents: "none",
        }} />
      </div>
    </div>
  );
};

const TypographyCollage: React.FC = () => {
  const clips = useMemo(() => ({
    garamond: tornBot(10, 0.72, 0.10, -0.04),
    arial:    tornBot(20, 0.70, 0.11, 0.05),
    helv:     tornBot(30, 0.74, 0.09, -0.03),
    times:    tornBoth(80, 0.12, 0.07, -0.02, 90, 0.82, 0.07, 0.02),
    univers:  tornTop(110, 0.16, 0.08, 0.04),
    rock:     tornTop(120, 0.14, 0.07, -0.03),
  }), []);

  const [selected, setSelected] = useState<string | null>(null);
  const handleSelect = (id: string) => setSelected((prev) => (prev === id ? null : id));

  return (
    <div
      onClick={() => setSelected(null)}
      style={{
        position: "relative", width: "100%", height: "100vh",
        overflow: "hidden", backgroundColor: "#b0b0b0",
      }}
    >
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
        <defs>
          <filter id="torn-disp" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={5} seed={2} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={10} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <clipPath id="bodoni" clipPathUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" />
          </clipPath>
          {Object.entries(clips).map(([id, d]) => (
            <clipPath key={id} id={id} clipPathUnits="objectBoundingBox">
              <path d={d} />
            </clipPath>
          ))}
        </defs>
      </svg>

      {/* ═══ FRONTEND z=1 ─ Dark hero background: React/Next.js/Three.js ═══ */}
      <Paper id="bodoni" bg="#111"
        pos={{ top: "0%", left: "-5%", width: "110%", height: "70%" }} z={1} fringe={0}
        selected={selected} onSelect={handleSelect}>
        {/* Giant ghosted bracket watermark */}
        <div style={{
          position: "absolute", top: "5%", left: "2%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(300px, 50vw, 700px)", fontWeight: 700,
          color: "rgba(255,255,255,0.03)", lineHeight: 0.85,
        }}>&lt;/&gt;</div>
        {/* Main display */}
        <div style={{
          position: "absolute", top: "38%", left: "8%",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "clamp(100px, 16vw, 260px)", fontWeight: 700,
          color: "#fff", letterSpacing: "-4px", lineHeight: 0.85,
        }}>Frontend</div>
        {/* Tech stack label */}
        <div style={{
          position: "absolute", top: "38%", left: "1%",
          fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "clamp(9px, 1vw, 13px)",
          color: "#555", lineHeight: 1.8, fontWeight: 300,
        }}>
          <div style={{ letterSpacing: "4px", textTransform: "uppercase", fontSize: "0.7em", color: "#444" }}>SPECIALIZATION</div>
          <div style={{ fontStyle: "italic", color: "#666" }}>UI · UX · Interaction</div>
        </div>
        {/* Decorative thin rule */}
        <div style={{
          position: "absolute", top: "62%", left: "8%", width: "40%",
          borderTop: "1px solid rgba(255,255,255,0.15)",
        }} />
        {/* Tech list */}
        <div style={{
          position: "absolute", top: "64%", left: "8%",
          fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "clamp(8px, 0.9vw, 12px)",
          color: "#555", letterSpacing: "2px",
        }}>React · Next.js · Three.js · GSAP · Framer Motion · TypeScript</div>
      </Paper>

      {/* ═══ BACKEND z=2 ─ Node/Python/APIs ═══ */}
      <Paper id="garamond" bg="#ccc"
        pos={{ top: "-10%", left: "-6%", width: "42%", height: "66%" }}
        z={2} rotate={-1} selected={selected} onSelect={handleSelect}>
        {/* Giant curly brace watermark */}
        <div style={{
          position: "absolute", top: "14%", left: "10%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(180px, 28vw, 400px)", fontWeight: 400,
          color: "#999", lineHeight: 0.8,
          opacity: 0.4,
        }}>&#123;</div>
        {/* Title */}
        <div style={{
          position: "absolute", top: "42%", left: "32%",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "clamp(28px, 4vw, 55px)", fontWeight: 700,
          color: "#444", letterSpacing: "-1px",
        }}>Backend</div>
        {/* Subtitle */}
        <div style={{
          position: "absolute", top: "56%", left: "32%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(9px, 1.1vw, 14px)", fontWeight: 400,
          color: "#888", letterSpacing: "4px", textTransform: "uppercase",
        }}>APIs · Services</div>
        {/* Decorative lines (code-like) */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            position: "absolute", left: `${20 + i * 14}px`, top: "6%",
            width: "10px", height: "48%",
            backgroundColor: i % 2 === 0 ? "#999" : "#aaa",
            transform: "rotate(-6deg)", borderRadius: "2px",
            boxShadow: "inset -2px 0 0 rgba(0,0,0,0.15)",
          }} />
        ))}
        {/* Tech chips */}
        <div style={{
          position: "absolute", top: "66%", left: "14%", right: "10%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(7px, 0.8vw, 10px)",
          color: "#777", letterSpacing: "2px", lineHeight: 2,
        }}>Node.js · Python · GraphQL · REST · PostgreSQL · Redis</div>
      </Paper>

      {/* ═══ CLOUD z=3 ─ AWS/GCP/Infrastructure ═══ */}
      <Paper id="arial" bg="#777"
        pos={{ top: "-12%", left: "28%", width: "40%", height: "68%" }}
        z={3} rotate={0.8} selected={selected} onSelect={handleSelect}>
        {/* Massive outlined cloud symbol */}
        <div style={{
          position: "absolute", top: "16%", left: "6%",
          fontFamily: "'Arial Black', Impact, sans-serif",
          fontSize: "clamp(200px, 32vw, 450px)", fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "2px rgba(0,0,0,0.15)",
          lineHeight: 0.85,
        }}>&#9729;</div>
        {/* Solid bold text */}
        <div style={{
          position: "absolute", top: "28%", left: "12%",
          fontFamily: "'Arial Black', Impact, sans-serif",
          fontSize: "clamp(80px, 12vw, 180px)", fontWeight: 900,
          color: "#222", letterSpacing: "-3px",
        }}>CLOUD</div>
        {/* Subtext */}
        <div style={{
          position: "absolute", top: "52%", left: "14%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(10px, 1.3vw, 16px)", fontWeight: 400,
          color: "#444", letterSpacing: "6px", textTransform: "uppercase",
        }}>AWS · GCP · AZURE</div>
        {/* Extra detail */}
        <div style={{
          position: "absolute", top: "60%", left: "14%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(8px, 0.9vw, 11px)", fontWeight: 400,
          color: "#555", letterSpacing: "3px", lineHeight: 1.8,
        }}>Lambda · S3 · EC2 · CloudFront · CDN</div>
      </Paper>

      {/* ═══ DEVOPS z=2 ─ Docker/K8s/CI-CD ═══ */}
      <Paper id="helv" bg="#444"
        pos={{ top: "-10%", right: "-4%", width: "42%", height: "66%" }}
        z={2} rotate={0.5} selected={selected} onSelect={handleSelect}>
        {/* "Dev" large */}
        <div style={{
          position: "absolute", top: "22%", left: "6%",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "clamp(80px, 13vw, 200px)", fontWeight: 700,
          color: "#eee", letterSpacing: "-2px", lineHeight: 1,
        }}>Dev</div>
        {/* "Ops" medium */}
        <div style={{
          position: "absolute", top: "42%", left: "8%",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "clamp(36px, 5.5vw, 80px)", fontWeight: 300,
          color: "#aaa", letterSpacing: "6px",
        }}>Ops</div>
        {/* CI/CD label */}
        <div style={{
          position: "absolute", top: "55%", left: "8%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(18px, 2.5vw, 36px)", fontWeight: 100,
          color: "#777", letterSpacing: "12px", textTransform: "uppercase",
        }}>CI/CD</div>
        {/* Pipeline circle */}
        <div style={{
          position: "absolute", bottom: "16%", right: "12%",
          width: "clamp(45px, 5vw, 70px)", height: "clamp(45px, 5vw, 70px)",
          border: "2px solid rgba(255,255,255,0.2)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'SF Mono', monospace", fontSize: "clamp(8px, 1vw, 12px)",
          color: "rgba(255,255,255,0.3)",
        }}>&#8734;</div>
        {/* Tech list */}
        <div style={{
          position: "absolute", top: "66%", left: "8%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(8px, 1vw, 12px)", fontWeight: 400,
          color: "#666", letterSpacing: "3px",
        }}>Docker · Kubernetes · GitHub Actions · Terraform</div>
      </Paper>

      {/* ═══ Generative AI z=5 ─ Machine Learning / Generative AI ═══ */}
      <Paper id="times" bg="#999"
        pos={{ top: "38%", left: "8%", width: "56%", height: "36%" }}
        z={5} rotate={0.5} selected={selected} onSelect={handleSelect}>
        {/* Small label above */}
        <div style={{
          position: "absolute", top: "18%", left: "4%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(11px, 1.4vw, 18px)", fontWeight: 400,
          color: "#555", letterSpacing: "3px",
        }}>Artificial</div>
        {/* Large headline */}
        <div style={{
          position: "absolute", top: "26%", left: "4%",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "clamp(55px, 8.5vw, 140px)", fontWeight: 700,
          color: "#222", letterSpacing: "-1px", lineHeight: 0.9,
        }}>Generative AI</div>
        {/* Thin rule */}
        <div style={{
          position: "absolute", top: "56%", left: "4%", width: "50%",
          borderTop: "1px solid rgba(0,0,0,0.25)",
        }} />
        {/* Subtitle */}
        <div style={{
          position: "absolute", top: "60%", left: "4%",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "clamp(20px, 3vw, 44px)", fontWeight: 400,
          color: "#444", fontStyle: "italic",
        }}>Intelligence</div>
        {/* Tech list */}
        <div style={{
          position: "absolute", top: "78%", left: "4%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(7px, 0.8vw, 10px)",
          color: "#666", letterSpacing: "3px", textTransform: "uppercase",
        }}>TensorFlow · PyTorch · LLMs · RAG · Computer Vision</div>
      </Paper>

      {/* ═══ SYSTEMS z=6 ─ Architecture & Design ═══ */}
      <Paper id="univers" bg="#222"
        pos={{ top: "56%", left: "-6%", width: "54%", height: "52%" }}
        z={6} rotate={0.8} selected={selected} onSelect={handleSelect}>
        {/* Striped main text */}
        <div style={{
          position: "absolute", top: "22%", left: "18%",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "clamp(55px, 8.5vw, 150px)", fontWeight: 700,
          backgroundImage: "repeating-linear-gradient(0deg, #888 0px, #888 3px, transparent 3px, transparent 8px)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", letterSpacing: "2px",
        }}>Systems</div>
        {/* Architecture badge */}
        <div style={{
          position: "absolute", top: "16%", left: "8%",
          width: "clamp(40px, 5vw, 68px)", height: "clamp(40px, 5vw, 68px)",
          backgroundColor: "#fff", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'SF Mono', monospace",
          fontSize: "clamp(10px, 1.2vw, 16px)", fontWeight: 700, color: "#222",
        }}>SYS</div>
        {/* Detail label */}
        <div style={{
          position: "absolute", top: "50%", left: "20%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(9px, 1.1vw, 14px)", fontWeight: 300,
          color: "#555", letterSpacing: "5px", textTransform: "uppercase",
        }}>Microservices · Event-Driven · DDD</div>
        {/* Grid lines */}
        {[60, 68, 76].map((t) => (
          <div key={t} style={{
            position: "absolute", top: `${t}%`, left: "18%", width: "45%",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }} />
        ))}
      </Paper>

      {/* ═══ LANGUAGES z=6 ─ Programming Languages ═══ */}
      <Paper id="rock" bg="#e8e8e8"
        pos={{ top: "54%", right: "-4%", width: "52%", height: "54%" }}
        z={6} rotate={-0.8} selected={selected} onSelect={handleSelect}>
        {/* Large outlined "TS" background */}
        <div style={{
          position: "absolute", top: "10%", right: "6%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(150px, 24vw, 350px)", fontWeight: 700,
          color: "transparent",
          WebkitTextStroke: "3px rgba(0,0,0,0.08)",
          lineHeight: 0.85,
        }}>TS</div>
        {/* Display text */}
        <div style={{
          position: "absolute", top: "22%", left: "6%",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "clamp(45px, 7vw, 120px)", fontWeight: 700,
          color: "#222",
        }}>Languages</div>
        {/* Thin rule */}
        <div style={{
          position: "absolute", top: "50%", left: "6%", width: "40%",
          borderTop: "3px solid rgba(0,0,0,0.12)",
        }} />
        {/* Language list */}
        <div style={{
          position: "absolute", top: "56%", left: "6%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(18px, 2.8vw, 40px)", fontWeight: 400,
          color: "#666", letterSpacing: "2px",
        }}>TypeScript · Python</div>
        {/* More languages */}
        {[70, 78].map((t) => (
          <div key={t} style={{
            position: "absolute", top: `${t}%`, left: "6%", width: "50%",
            borderTop: "2px dashed rgba(0,0,0,0.1)",
          }} />
        ))}
        {/* Extra languages */}
        <div style={{
          position: "absolute", top: "84%", left: "6%",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "clamp(8px, 1vw, 12px)",
          color: "#888", letterSpacing: "4px", textTransform: "uppercase",
        }}>Go · Rust · Java · SQL · Bash</div>
      </Paper>
    </div>
  );
};

export default TypographyCollage;
