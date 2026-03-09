// =============================================================================
// Homepage Data — The Innovative Native
// Foundation data for all homepage components.
// =============================================================================

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface Vertical {
  id: string;
  name: string;
  avatar: string;
  painPoint: string;
  icon: string;
}

export interface ProofSystem {
  id: string;
  name: string;
  vertical: string;
  description: string;
  outcome: string;
  price: string;
  href: string;
  status: "live" | "coming-soon" | "beta";
}

export interface ValueLadderTier {
  id: string;
  name: string;
  priceRange: string;
  description: string;
  cta: string;
  href: string;
  order: number;
}

export interface ServiceOffering {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  icon: string;
}

// ---------------------------------------------------------------------------
// Verticals
// ---------------------------------------------------------------------------

export const verticals: Vertical[] = [
  {
    id: "legal",
    name: "Legal Professionals",
    avatar: "Lawyers & Small Firms",
    painPoint:
      "Generic AI can't leverage your private case history. Your competitive edge lives in your own briefs, motions, and outcomes.",
    icon: "fa-scale-balanced",
  },
  {
    id: "creative",
    name: "Creative Professionals",
    avatar: "Videographers, Photographers & Content Creators",
    painPoint:
      "You're manually creating content when AI pipelines could generate, score, and assemble publish-ready media automatically.",
    icon: "fa-camera-retro",
  },
  {
    id: "real-estate",
    name: "Real Estate Professionals",
    avatar: "Agents, Brokers & Property Marketers",
    painPoint:
      "AI staging tools produce slop. You need production-grade AI video and compliant listing content — not another slideshow tool.",
    icon: "fa-building",
  },
  {
    id: "small-business",
    name: "Small Business Operators",
    avatar: "Entrepreneurs & Digital Operators",
    painPoint:
      "You're paying for 12 SaaS subscriptions that don't talk to each other. AI infrastructure replaces the stack and gives you back 10-20 hours a week.",
    icon: "fa-rocket",
  },
];

// ---------------------------------------------------------------------------
// Proof Systems
// ---------------------------------------------------------------------------

export const proofSystems: ProofSystem[] = [
  {
    id: "law-firm-rag",
    name: "Law Firm RAG",
    vertical: "legal",
    description:
      "A private second brain trained on your firm's own briefs, motions, and outcomes. Ask 'How did we handle this last time?' and get answers from your own work.",
    outcome:
      "Private institutional intelligence — not generic AI doctrine",
    price: "$2,500 pilot",
    href: "/law-firm-rag",
    status: "live",
  },
  {
    id: "haven-blueprint",
    name: "The AI Influencer Blueprint",
    vertical: "creative",
    description:
      "The complete system behind an AI influencer — from character design to automated video production. Image generation, quality scoring, and publish-ready assembly.",
    outcome: "Full content pipeline — from idea to published video",
    price: "From $57",
    href: "/haven-blueprint",
    status: "live",
  },
  {
    id: "visionspark-re",
    name: "The Listing Video Blueprint",
    vertical: "real-estate",
    description:
      "AI-staged photos, Veo 3.1 generative walkthrough video, and branded listing reels. Real video, not slideshows. Compliant by default.",
    outcome: "AI-staged listings with true generative video",
    price: "From $97",
    href: "/visionspark-re",
    status: "live",
  },
];

// ---------------------------------------------------------------------------
// Value Ladder
// ---------------------------------------------------------------------------

export const valueLadderTiers: ValueLadderTier[] = [
  {
    id: "learn",
    name: "Learn",
    priceRange: "Free",
    description:
      "Blog posts, guides, and educational content that shows you how AI systems actually work — not theory, not hype.",
    cta: "Start Learning",
    href: "/blog",
    order: 1,
  },
  {
    id: "deploy",
    name: "Deploy",
    priceRange: "$57 – $197",
    description:
      "Self-deploy AI system blueprints. Step-by-step templates, workflow files, and automation configs you set up yourself.",
    cta: "Get a Blueprint",
    href: "#proof-systems",
    order: 2,
  },
  {
    id: "pilot",
    name: "Pilot",
    priceRange: "$2,500",
    description:
      "Done-with-you AI system deployment. We build the infrastructure, integrate your data, and hand you a working system.",
    cta: "Book a Pilot Call",
    href: "https://calendly.com/mike-buildmytribe/ai-discovery-call",
    order: 3,
  },
  {
    id: "build",
    name: "Build",
    priceRange: "Project-Based",
    description:
      "Full custom AI infrastructure for your business. We design, build, and deploy the system from scratch — then train your team to run it.",
    cta: "Book a Discovery Call",
    href: "https://calendly.com/mike-buildmytribe/ai-discovery-call",
    order: 4,
  },
];

// ---------------------------------------------------------------------------
// Service Offerings
// ---------------------------------------------------------------------------

export const serviceOfferings: ServiceOffering[] = [
  {
    id: "ai-system-design",
    name: "AI System Design",
    description:
      "We architect the AI layer that sits on top of your business. Data pipelines, workflow automation, and AI agents — connected into one system that runs your operations.",
    capabilities: [
      "Map your manual workflows, then replace them with AI",
      "Connect your data so every tool talks to every other tool",
      "Build AI agents that research, write, and decide for you",
      "Plug into what you already use — no rip-and-replace",
      "Document everything so your team runs it without us",
    ],
    icon: "fa-drafting-compass",
  },
  {
    id: "automation-infrastructure",
    name: "Automation Infrastructure",
    description:
      "We build the automation engine that replaces your fragmented SaaS stack. n8n workflows, Airtable command centers, and AI-powered pipelines that run while you sleep.",
    capabilities: [
      "n8n workflows that trigger, process, and deliver automatically",
      "Airtable command centers that track everything in one place",
      "AI content engines that generate, score, and assemble",
      "Publish to every platform from one workflow",
      "Built-in quality checks so nothing ships without review",
    ],
    icon: "fa-gears",
  },
  {
    id: "ai-training",
    name: "AI Training & Education",
    description:
      "We teach your team how to think in systems — not just how to use ChatGPT. Practical training on deploying AI infrastructure inside your own business.",
    capabilities: [
      "Figure out what's worth automating and what's not",
      "Hands-on workshops where your team builds a real system",
      "Train your people on the tools that actually matter",
      "Show you how to use AI for content without losing your voice",
      "Ongoing access to our learning platform and community",
    ],
    icon: "fa-graduation-cap",
  },
];
