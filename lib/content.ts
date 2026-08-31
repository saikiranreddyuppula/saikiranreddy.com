export const profile = {
  name: "Sai Kiran Reddy",
  fullName: "Uppula Sai Kiran Reddy",
  title: "Solutions Architect & Engineer",
  company: "Hertz",
  location: "Greater Chicago Area",
  email: "hello@saikiranreddy.com",
  headline:
    "I architect systems that turn operational complexity into something a team can actually run.",
  manifesto:
    "I don't just write code — I build the systems that make everything else possible.",
  about: [
    "Solutions Architect at Hertz, based in the Greater Chicago Area. I spend most of my time on platforms that have to work at fleet scale — availability, cost, and the messy reality of production.",
    "Before that I designed and shipped products across hospitality, healthcare, ecommerce, and security: booking engines, clinical workflows, payments, and internal platforms used by operators every day.",
    "I think in systems. Not frameworks — the contracts between services, the failure modes, and the path from a prototype to something that stays up.",
  ],
  stats: [
    { value: 8, suffix: "+", label: "Years of\nEngineering" },
    { value: 50, suffix: "+", label: "Projects\nShipped" },
    { value: 12, suffix: "", label: "Industries\nServed" },
  ],
  education: {
    school: "Lovely Professional University",
    note: "3rd prize, graduation project expo — April 2019",
  },
  socials: [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/saikiranreddyuppula/",
    },
    { name: "GitHub", url: "https://github.com/saikiranreddyuppula" },
    { name: "X", url: "https://x.com/saikiranreddy_u" },
  ],
};

export const capabilities = [
  "Cloud architecture",
  "Platform engineering",
  "Microservices",
  "DevOps & CI/CD",
  "Event-driven systems",
  "Generative AI",
  "Performance",
  "Security",
];

export const industries = [
  {
    name: "Hospitality",
    number: "01",
    description:
      "Fleet and guest platforms at Hertz scale — booking, operations, and systems that have to stay up when demand spikes.",
    tags: ["Fleet ops", "Booking", "PMS"],
  },
  {
    name: "Ecommerce",
    number: "02",
    description:
      "Payment flows, inventory, and checkout paths designed for real traffic, not demo-day volume.",
    tags: ["Payments", "Inventory", "Microservices"],
  },
  {
    name: "Healthcare",
    number: "03",
    description:
      "HIPAA-aware patient systems, clinical workflows, and the unglamorous work of keeping records trustworthy.",
    tags: ["HIPAA", "EHR", "Workflows"],
  },
  {
    name: "Cyber Security",
    number: "04",
    description:
      "Zero-trust patterns, threat-aware platforms, and the controls that let the rest of the stack ship safely.",
    tags: ["Zero Trust", "Detection", "Compliance"],
  },
  {
    name: "Generative AI",
    number: "05",
    description:
      "AI features that survive contact with production: evaluation, cost, latency, and a clear owner when they fail.",
    tags: ["Pipelines", "Agents", "Eval"],
  },
  {
    name: "Manufacturing",
    number: "06",
    description:
      "IoT, supply-chain, and predictive maintenance — the systems that sit between the factory floor and the dashboard.",
    tags: ["IoT", "Supply chain", "Predictive"],
  },
];

export const projects = [
  {
    name: "Open Utility Tools",
    year: "2026",
    url: "https://www.openutilitytools.com/",
    blurb:
      "A public toolkit of fast, focused utilities. Built to be useful on the first visit — no account wall, no ceremony.",
    tags: ["TypeScript", "Next.js"],
  },
  {
    name: "Literature",
    year: "2026",
    url: "https://literature-red.vercel.app",
    blurb:
      "A reading surface for long-form work. Quiet typography, fast navigation, nothing between the reader and the page.",
    tags: ["TypeScript", "Vercel"],
  },
  {
    name: "Internet Radio",
    year: "2019",
    url: "https://github.com/saikiranreddyuppula/Internet-Radio-Angular-8",
    blurb:
      "Streaming radio built on Angular and Howler.js, with Firebase behind the catalog. Still one of the cleanest players I have shipped.",
    tags: ["Angular", "Howler", "Firebase"],
  },
  {
    name: "Audio Visualizer",
    year: "2021",
    url: "https://audio-visualizer.saikiranreddy.com/",
    blurb:
      "A visualizer that treats sound as architecture — frequency as form, silence as negative space.",
    tags: ["Web Audio", "Canvas"],
  },
  {
    name: "WayToSkill",
    year: "2020",
    url: "https://waytoskill.vercel.app",
    blurb:
      "A learning platform experiment: structured paths, less noise, more practice.",
    tags: ["TypeScript"],
  },
  {
    name: "Vivid Technologies",
    year: "2023",
    url: "https://vivid-technologies.vercel.app",
    blurb:
      "Product and platform work for a technology studio — the kind of site that has to explain a company in one scroll.",
    tags: ["JavaScript"],
  },
  {
    name: "World Stats Info",
    year: "2020",
    url: "https://github.com/saikiranreddyuppula/worldstatsinfo",
    blurb:
      "A COVID-19 tracker shipped when the data was moving faster than the dashboards. Vue, public numbers, daily refresh.",
    tags: ["Vue", "Data"],
  },
];

export const journey = [
  {
    stage: "Base Camp",
    year: "2017 — 2019",
    title: "Foundations",
    body: "Lovely Professional University. Shipped early products, placed 3rd at the graduation project expo, and learned that shipping beats a perfect plan.",
  },
  {
    stage: "High Camp",
    year: "2019 — 2023",
    title: "Building in public",
    body: "Platforms across healthcare, ecommerce, and internal ops — STS, Asthra, Pillbro, and a string of products that had to survive real users. Radio, visualizers, and the first cloud systems I still stand behind.",
  },
  {
    stage: "Summit",
    year: "2023 — now",
    title: "Architecture at scale",
    body: "Solutions Architect at Hertz. Fleet-scale platforms, cloud architecture, and the discipline of making systems boring in the best way — predictable, observable, and cheap enough to keep running.",
  },
];

export const nav = [
  { href: "/", label: "Home", id: "hero" },
  { href: "/about", label: "About", id: "about" },
  { href: "/work", label: "Work", id: "industries" },
  { href: "/journey", label: "Journey", id: "journey" },
  { href: "/contact", label: "Contact", id: "contact" },
];
