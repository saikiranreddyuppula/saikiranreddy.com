export const profile = {
  name: "Sai Kiran Reddy",
  fullName: "Uppula Sai Kiran Reddy",
  title: "Solutions Architect & Engineer",
  company: "Hertz",
  location: "Greater Chicago Area",
  email: "hello@saikiranreddy.com",
  headline:
    "I design the systems — cloud, platform, and product — that teams can actually run.",
  manifesto:
    "Architecture, delivery, and the interfaces between them.",
  about: [
    "Solutions Architect at Hertz. I shape platforms that have to stay up: services, events, cost, and the path from a prototype to production.",
    "The work is the stack — cloud architecture, platform engineering, APIs, and AI that survives contact with real traffic.",
  ],
  socials: [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/saikiranreddyuppula/",
    },
    { name: "GitHub", url: "https://github.com/saikiranreddyuppula" },
    { name: "X", url: "https://x.com/saikiranreddy_u" },
  ],
};

export const skillGroups = [
  {
    name: "Architecture",
    hint: "How the system is shaped",
    items: [
      "Cloud architecture",
      "Platform engineering",
      "Microservices",
      "Event-driven systems",
      "API contracts",
      "Resilience",
    ],
  },
  {
    name: "Delivery",
    hint: "How it ships and stays up",
    items: [
      "DevOps & CI/CD",
      "Observability",
      "Performance",
      "Security",
      "Cost control",
      "Incident paths",
    ],
  },
  {
    name: "Build",
    hint: "What I reach for",
    items: [
      "TypeScript",
      "Next.js",
      "Node",
      "Generative AI",
      "Web Audio",
      "Realtime UIs",
    ],
  },
  {
    name: "Domains",
    hint: "Where the stack has lived",
    items: [
      "Fleet & hospitality",
      "Payments",
      "Healthcare workflows",
      "Zero-trust",
      "Ecommerce",
      "IoT / supply chain",
    ],
  },
];

export const capabilities = skillGroups.flatMap((group) => group.items);

export const industries = [
  {
    name: "Hospitality",
    number: "01",
    description: "Booking, fleet ops, and guest platforms that hold when demand spikes.",
    tags: ["Fleet ops", "Booking", "PMS"],
  },
  {
    name: "Ecommerce",
    number: "02",
    description: "Checkout, inventory, and payment paths built for real traffic.",
    tags: ["Payments", "Inventory", "APIs"],
  },
  {
    name: "Healthcare",
    number: "03",
    description: "Clinical workflows and records that have to stay trustworthy.",
    tags: ["HIPAA", "EHR", "Workflows"],
  },
  {
    name: "Cyber Security",
    number: "04",
    description: "Zero-trust patterns and the controls that let the rest of the stack ship.",
    tags: ["Zero Trust", "Detection", "Compliance"],
  },
  {
    name: "Generative AI",
    number: "05",
    description: "Agents and pipelines with eval, cost, latency, and a clear owner.",
    tags: ["Pipelines", "Agents", "Eval"],
  },
  {
    name: "Manufacturing",
    number: "06",
    description: "IoT and supply-chain systems between the floor and the dashboard.",
    tags: ["IoT", "Supply chain", "Predictive"],
  },
];

export const projects = [
  {
    name: "Open Utility Tools",
    url: "https://www.openutilitytools.com/",
    blurb: "Fast public utilities. No account wall.",
    tags: ["TypeScript", "Next.js"],
  },
  {
    name: "Literature",
    url: "https://literature-red.vercel.app",
    blurb: "A reading surface. Quiet type, fast pages.",
    tags: ["TypeScript", "Vercel"],
  },
  {
    name: "Internet Radio",
    url: "https://github.com/saikiranreddyuppula/Internet-Radio-Angular-8",
    blurb: "Streaming radio on Angular, Howler, Firebase.",
    tags: ["Angular", "Howler", "Firebase"],
  },
  {
    name: "Audio Visualizer",
    url: "https://audio-visualizer.saikiranreddy.com/",
    blurb: "Frequency as form. Sound as architecture.",
    tags: ["Web Audio", "Canvas"],
  },
  {
    name: "WayToSkill",
    url: "https://waytoskill.vercel.app",
    blurb: "Structured paths. Less noise, more practice.",
    tags: ["TypeScript"],
  },
  {
    name: "Vivid Technologies",
    url: "https://vivid-technologies.vercel.app",
    blurb: "A studio site that has to explain itself in one scroll.",
    tags: ["JavaScript"],
  },
  {
    name: "World Stats Info",
    url: "https://github.com/saikiranreddyuppula/worldstatsinfo",
    blurb: "Public numbers, daily refresh, Vue.",
    tags: ["Vue", "Data"],
  },
];

export const systems = [
  {
    name: "Platforms",
    kicker: "Cloud & runtime",
    body: "Services, events, and the failure modes between them. Architecture that stays boring in production.",
  },
  {
    name: "Interfaces",
    kicker: "Contracts & APIs",
    body: "The seams: REST, events, identity, payments. Clear contracts so teams can move without breaking the floor.",
  },
  {
    name: "Intelligence",
    kicker: "AI in production",
    body: "Generative features with evaluation, cost, and an owner when they fail — not a demo glued to a prompt.",
  },
];

export const nav = [
  { href: "/", label: "Home", id: "hero" },
  { href: "/about", label: "About", id: "about" },
  { href: "/work", label: "Work", id: "industries" },
  { href: "/journey", label: "Stack", id: "journey" },
  { href: "/contact", label: "Contact", id: "contact" },
];
