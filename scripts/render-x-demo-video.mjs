import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const siteUrl = process.env.DEMO_URL ?? "http://localhost:3001";
const width = Number(process.env.DEMO_WIDTH ?? 1920);
const height = Number(process.env.DEMO_HEIGHT ?? 1080);
const outputDir = path.join(repoRoot, "public", "demo");
const rawDir = path.join(repoRoot, ".video-capture");
const webmPath = path.join(outputDir, "sai-kiran-reddy-website-demo-x.webm");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureUrlResponds(url) {
  const response = await fetch(url, { method: "HEAD" }).catch(() => null);
  if (!response?.ok) {
    throw new Error(
      `Could not reach ${url}. Start the portfolio dev server first, or pass DEMO_URL=http://host:port.`,
    );
  }
}

async function injectDemoOverlay(page) {
  await page.addStyleTag({
    content: `
      :root {
        --demo-white: 255, 255, 255;
        --demo-black: 0, 0, 0;
      }

      html, body {
        background: #000 !important;
      }

      body,
      a,
      button {
        cursor: none !important;
      }

      .custom-cursor,
      [class*="cursor"] {
        opacity: 0 !important;
      }

      #demo-reel-overlay,
      #demo-reel-overlay * {
        box-sizing: border-box;
      }

      #demo-reel-overlay {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        pointer-events: none;
        color: rgb(var(--demo-white));
        font-family:
          "Space Grotesk",
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
        letter-spacing: 0;
      }

      .demo-reel__grain,
      .demo-reel__vignette,
      .demo-reel__bars,
      .demo-reel__grid,
      .demo-reel__wipe {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .demo-reel__bars::before,
      .demo-reel__bars::after {
        position: absolute;
        left: 0;
        width: 100%;
        height: 7.2vh;
        content: "";
        background: rgba(var(--demo-black), 0.92);
      }

      .demo-reel__bars::before {
        top: 0;
      }

      .demo-reel__bars::after {
        bottom: 0;
      }

      .demo-reel__vignette {
        background:
          radial-gradient(circle at 50% 42%, transparent 0%, transparent 47%, rgba(var(--demo-black), 0.52) 100%),
          linear-gradient(90deg, rgba(var(--demo-black), 0.44), transparent 16%, transparent 84%, rgba(var(--demo-black), 0.44));
        mix-blend-mode: normal;
      }

      .demo-reel__grain {
        opacity: 0.13;
        background-image:
          repeating-linear-gradient(
            0deg,
            rgba(var(--demo-white), 0.04) 0 1px,
            transparent 1px 3px
          );
        animation: demoGrainDrift 8s linear infinite;
      }

      .demo-reel__grid {
        opacity: 0.16;
        background-image:
          linear-gradient(rgba(var(--demo-white), 0.10) 1px, transparent 1px),
          linear-gradient(90deg, rgba(var(--demo-white), 0.10) 1px, transparent 1px);
        background-size: 96px 96px;
        mask-image: radial-gradient(circle at center, rgba(var(--demo-black), 0.45), transparent 68%);
      }

      .demo-reel__brand {
        position: absolute;
        top: 4.1vh;
        left: 4.2vw;
        display: flex;
        align-items: center;
        gap: 18px;
        font-family: "Space Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 13px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(var(--demo-white), 0.76);
      }

      .demo-reel__brand-mark {
        width: 42px;
        height: 42px;
        border: 1px solid rgba(var(--demo-white), 0.56);
        display: grid;
        place-items: center;
        font-size: 15px;
        color: rgba(var(--demo-white), 0.92);
      }

      .demo-reel__chapter {
        position: absolute;
        top: 4.4vh;
        right: 4.2vw;
        min-width: 160px;
        text-align: right;
        font-family: "Space Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(var(--demo-white), 0.54);
      }

      .demo-reel__progress {
        position: absolute;
        left: 4.2vw;
        right: 4.2vw;
        bottom: 5vh;
        height: 1px;
        background: rgba(var(--demo-white), 0.18);
        overflow: hidden;
      }

      .demo-reel__progress-fill {
        width: 0%;
        height: 100%;
        background: rgba(var(--demo-white), 0.88);
        transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .demo-reel__caption {
        position: absolute;
        left: 4.2vw;
        bottom: 12vh;
        width: min(620px, 34vw);
        opacity: 0;
        transform: translateY(18px);
      }

      .demo-reel__caption.is-visible {
        opacity: 1;
        transform: translateY(0);
        transition:
          opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .demo-reel__kicker {
        margin: 0 0 14px;
        font-family: "Space Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
        letter-spacing: 0.18em;
        line-height: 1.3;
        text-transform: uppercase;
        color: rgba(var(--demo-white), 0.56);
      }

      .demo-reel__title {
        margin: 0;
        max-width: 12ch;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: clamp(42px, 4vw, 78px);
        font-weight: 300;
        line-height: 0.94;
        letter-spacing: 0;
        color: rgba(var(--demo-white), 0.94);
      }

      .demo-reel__body {
        max-width: 50ch;
        margin: 18px 0 0;
        font-size: 16px;
        line-height: 1.45;
        color: rgba(var(--demo-white), 0.66);
      }

      .demo-reel__wipe {
        opacity: 0;
        background: #000;
        transition: opacity 0.75s cubic-bezier(0.85, 0, 0.15, 1);
      }

      .demo-reel__wipe.is-active {
        opacity: 1;
      }

      .demo-reel__end-card {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 10vh 8vw;
        text-align: center;
        background: #000;
        opacity: 0;
        transform: scale(1.02);
        transition:
          opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
          transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .demo-reel__end-card.is-visible {
        opacity: 1;
        transform: scale(1);
      }

      .demo-reel__end-card-inner {
        display: grid;
        gap: 28px;
        justify-items: center;
      }

      .demo-reel__end-kicker {
        margin: 0;
        font-family: "Space Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 13px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: rgba(var(--demo-white), 0.48);
      }

      .demo-reel__end-title {
        margin: 0;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: clamp(92px, 9vw, 172px);
        font-weight: 300;
        font-style: italic;
        line-height: 0.86;
        letter-spacing: 0;
        color: rgba(var(--demo-white), 0.96);
        text-shadow:
          0 0 28px rgba(var(--demo-white), 0.22),
          0 0 92px rgba(var(--demo-white), 0.18);
      }

      .demo-reel__end-url {
        margin: 0;
        font-family: "Space Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 16px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(var(--demo-white), 0.66);
      }

      @keyframes demoGrainDrift {
        0% { transform: translateY(0); }
        100% { transform: translateY(36px); }
      }
    `,
  });

  await page.evaluate(() => {
    const overlay = document.createElement("div");
    overlay.id = "demo-reel-overlay";
    overlay.innerHTML = `
      <div class="demo-reel__grid"></div>
      <div class="demo-reel__vignette"></div>
      <div class="demo-reel__grain"></div>
      <div class="demo-reel__bars"></div>
      <div class="demo-reel__brand">
        <div class="demo-reel__brand-mark">SK</div>
        <div>Sai Kiran Reddy</div>
      </div>
      <div class="demo-reel__chapter">00 / Prelude</div>
      <div class="demo-reel__caption">
        <p class="demo-reel__kicker"></p>
        <h1 class="demo-reel__title"></h1>
        <p class="demo-reel__body"></p>
      </div>
      <div class="demo-reel__progress"><div class="demo-reel__progress-fill"></div></div>
      <div class="demo-reel__wipe"></div>
      <div class="demo-reel__end-card">
        <div class="demo-reel__end-card-inner">
          <p class="demo-reel__end-kicker">Portfolio reel</p>
          <h2 class="demo-reel__end-title">Find the light within</h2>
          <p class="demo-reel__end-url">saikiranreddy.com</p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  });
}

async function setCaption(page, { chapter, kicker, title, body, progress }) {
  await page.evaluate(
    ({ chapter, kicker, title, body, progress }) => {
      const overlay = document.querySelector("#demo-reel-overlay");
      const caption = overlay.querySelector(".demo-reel__caption");
      const chapterEl = overlay.querySelector(".demo-reel__chapter");
      const kickerEl = overlay.querySelector(".demo-reel__kicker");
      const titleEl = overlay.querySelector(".demo-reel__title");
      const bodyEl = overlay.querySelector(".demo-reel__body");
      const progressEl = overlay.querySelector(".demo-reel__progress-fill");

      caption.classList.remove("is-visible");
      window.requestAnimationFrame(() => {
        chapterEl.textContent = chapter;
        kickerEl.textContent = kicker;
        titleEl.textContent = title;
        bodyEl.textContent = body;
        progressEl.style.width = `${progress}%`;
        caption.classList.add("is-visible");
      });
    },
    { chapter, kicker, title, body, progress },
  );
}

async function hideCaption(page) {
  await page.evaluate(() => {
    document
      .querySelector("#demo-reel-overlay .demo-reel__caption")
      ?.classList.remove("is-visible");
  });
}

async function setChapter(page, { chapter, progress }) {
  await page.evaluate(
    ({ chapter, progress }) => {
      const overlay = document.querySelector("#demo-reel-overlay");
      overlay.querySelector(".demo-reel__chapter").textContent = chapter;
      overlay.querySelector(".demo-reel__progress-fill").style.width =
        `${progress}%`;
    },
    { chapter, progress },
  );
}

async function scrollTo(page, top, duration = 2200) {
  await page.evaluate(
    ({ top, duration }) =>
      new Promise((resolve) => {
        const start = window.scrollY;
        const distance = top - start;
        const startedAt = performance.now();
        const ease = (t) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const frame = (now) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          window.scrollTo(0, start + distance * ease(progress));
          if (progress < 1) {
            window.requestAnimationFrame(frame);
          } else {
            resolve(null);
          }
        };

        window.requestAnimationFrame(frame);
      }),
    { top, duration },
  );
}

async function getTargets(page) {
  return page.evaluate(() => {
    const topFor = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return 0;
      return el.getBoundingClientRect().top + window.scrollY;
    };

    const maxScroll =
      document.scrollingElement.scrollHeight - window.innerHeight;
    const clamp = (value) => Math.max(0, Math.min(maxScroll, value));

    return {
      hero: 0,
      practice: clamp(topFor("#practice") + window.innerHeight * 0.04),
      ledger: clamp(topFor("#practice") + window.innerHeight * 0.96),
      proof: clamp(topFor("#practice") + window.innerHeight * 2.04),
      journey: clamp(topFor("#journey") - window.innerHeight * 0.04),
      contact: clamp(topFor("#contact") - window.innerHeight * 0.18),
      maxScroll,
    };
  });
}

async function flashCut(page, action) {
  await page.evaluate(() =>
    document
      .querySelector("#demo-reel-overlay .demo-reel__wipe")
      ?.classList.add("is-active"),
  );
  await wait(420);
  await action();
  await wait(180);
  await page.evaluate(() =>
    document
      .querySelector("#demo-reel-overlay .demo-reel__wipe")
      ?.classList.remove("is-active"),
  );
}

async function run() {
  await ensureUrlResponds(siteUrl);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(rawDir, { recursive: true });
  await fs.rm(webmPath, { force: true });

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--hide-scrollbars",
      "--autoplay-policy=no-user-gesture-required",
      "--use-gl=angle",
      "--use-angle=metal",
    ],
  });

  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    recordVideo: {
      dir: rawDir,
      size: { width, height },
    },
  });

  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(siteUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForFunction(
    () => {
      const app = document.querySelector(".app-content");
      return app && !app.classList.contains("app-content--hidden");
    },
    null,
    { timeout: 20000 },
  );
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(1800);

  await injectDemoOverlay(page);
  const targets = await getTargets(page);

  await setCaption(page, {
    chapter: "01 / Signal",
    kicker: "Portfolio reel",
    title: "Enterprise clarity, cinematic motion.",
    body: "A monochrome tour through systems thinking, industry architecture, and the work behind the promise.",
    progress: 8,
  });
  await wait(3400);

  await hideCaption(page);
  await scrollTo(page, targets.practice, 2400);
  await setCaption(page, {
    chapter: "02 / Practice",
    kicker: "Business case to architecture",
    title: "Where decisions become design.",
    body: "Healthcare, banking, retail, and public-sector systems reduced to ownership, proof, and outcomes.",
    progress: 30,
  });
  await wait(3600);

  await scrollTo(page, targets.ledger, 2600);
  await setCaption(page, {
    chapter: "03 / Operating Model",
    kicker: "Industry ledger",
    title: "The owner of the wait matters.",
    body: "Each case reframes complexity into a named promise, a clear cost, and a measurable result.",
    progress: 50,
  });
  await wait(3000);

  await scrollTo(page, targets.proof, 2400);
  await wait(1000);
  await flashCut(page, async () => {
    await scrollTo(page, targets.journey, 1);
  });
  await setCaption(page, {
    chapter: "04 / Journey",
    kicker: "Systems in motion",
    title: "Architecture with atmosphere.",
    body: "The visual language stays restrained: light, terrain, and momentum without breaking the monochrome brand.",
    progress: 72,
  });
  await wait(4200);

  await hideCaption(page);
  await scrollTo(page, targets.contact, 3000);
  await setChapter(page, {
    chapter: "05 / Close",
    progress: 92,
  });
  await wait(3600);

  await page.evaluate(() => {
    document
      .querySelector("#demo-reel-overlay .demo-reel__caption")
      ?.classList.remove("is-visible");
    document
      .querySelector("#demo-reel-overlay .demo-reel__end-card")
      ?.classList.add("is-visible");
    const progress = document.querySelector(
      "#demo-reel-overlay .demo-reel__progress-fill",
    );
    if (progress) progress.style.width = "100%";
  });
  await wait(3400);

  const video = page.video();
  await context.close();
  if (!video) {
    throw new Error("Playwright did not produce a video file.");
  }
  await video.saveAs(webmPath);
  await browser.close();

  console.log(webmPath);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
