// Product configuration
export const TWINGEN = {
  name: "TwinGen",
  tagline: "Build Your Own AI Influencer From Scratch",
  description: "The complete automation system for AI-generated content — from character creation to published videos. No coding. No guesswork.",
  price: {
    earlyBird: 57,
    full: 150,
    currency: "USD",
  },
  scarcity: {
    earlyBirdLimit: 100,
    earlyBirdSold: 0,
  },
  stripe: {
    buyButtonId: "buy_btn_1T40tRI4n1kMt7iRy0rCS9gU",
    publishableKey: "***REDACTED***",
    priceId: "price_1T2ZsdI4n1kMt7iRG9urq2tr",
  },
  seo: {
    title: "TwinGen — Build Your Own AI Influencer | The Innovative Native",
    description: "Build your own AI influencer from scratch. Get the complete automation system — workflows, prompts, and pipeline. No coding required.",
    keywords: ["AI influencer", "TwinGen", "AI UGC creator", "virtual influencer", "AI brand ambassador", "AI content creator", "AI content automation"],
    ogImage: "/images/twingen/og-image.jpg",
  },
};

// Backwards compat — components import this name
export const HAVEN_BLUEPRINT = TWINGEN;

// Pain points for problem agitation section
export const painPoints = [
  {
    icon: "eye",
    title: "Watching from the Sidelines",
    description: "You've seen AI influencers going viral — but have no idea how they're made",
  },
  {
    icon: "video",
    title: "Tutorial Treadmill",
    description: "Every 'tutorial' is a 10-minute TikTok that skips the actual system",
  },
  {
    icon: "dollar-sign",
    title: "Course Graveyard",
    description: "You've spent $200+ on courses that teach theory, not buildable pipelines",
  },
  {
    icon: "clock",
    title: "Manual Content Hamster Wheel",
    description: "You're manually creating content when AI should be doing the heavy lifting",
  },
];

// 5-step "How It Works" system
export const systemSteps = [
  {
    number: 1,
    title: "Design Your AI Character",
    description: "Build a consistent AI persona with detailed character sheets, wardrobe systems, and room settings. Your character looks the same in every single generation.",
    deliverable: "Brand system template + 60+ prompt templates",
    icon: "palette",
  },
  {
    number: 2,
    title: "Set Up Mission Control",
    description: "Deploy a pre-built Airtable base with 9 linked tables that tracks every piece of content from concept to published post.",
    deliverable: "Duplicatable Airtable base template",
    icon: "database",
  },
  {
    number: 3,
    title: "Build Your Automation Engine",
    description: "Import ready-made n8n workflows that chain image generation, quality scoring, and video assembly into a single automated pipeline.",
    deliverable: "5 n8n workflow JSONs (ready to import)",
    icon: "zap",
  },
  {
    number: 4,
    title: "Generate Content at Scale",
    description: "Use Gemini AI for consistent image generation with built-in quality scoring, plus Veo3.1 and Sora2 for ultra-realistic AI video clips.",
    deliverable: "Gemini + Kie.AI prompt templates + scoring rubric",
    icon: "image",
  },
  {
    number: 5,
    title: "Assemble & Publish",
    description: "FFMPEG recipes automatically assemble your AI-generated assets into platform-ready videos — Instagram Reels, TikTok, YouTube Shorts.",
    deliverable: "FFMPEG command recipe library + export presets",
    icon: "film",
  },
];

// 6 modules for the product breakdown
export const modules = [
  {
    id: 1,
    title: "Brand Foundation",
    subtitle: "Design a consistent AI character that never breaks",
    bullets: [
      "AI character design with Gemini — consistency markers, wardrobe system, room character sheets",
      "Visual identity system — color palette, typography, video overlay styling",
      "Brand voice document — tone, vocabulary patterns, content framing rules",
      "Visual identity lockdown checklist for cross-generation consistency",
    ],
    deliverables: ["Brand system template (MD)", "Character sheet generator", "60+ Gemini prompt templates", "Tone of voice builder"],
  },
  {
    id: 2,
    title: "Mission Control",
    subtitle: "Your entire pipeline in one Airtable base",
    bullets: [
      "Full Airtable base with 9 pre-configured, linked tables",
      "Pipeline state machine: Draft → Approved → In Production → Published",
      "Product catalog, playbook system, and QA review tracking",
      "Field-by-field setup guide with video walkthrough",
    ],
    deliverables: ["Duplicatable Airtable base", "Field-by-field setup guide", "Pipeline state machine docs", "Table schema reference"],
  },
  {
    id: 3,
    title: "AI Image & Video Generation",
    subtitle: "From text prompts to ultra-realistic content",
    bullets: [
      "Gemini API image generation with character consistency enforcement",
      "Quality scoring system — 7/10 threshold with automatic 3-retry logic",
      "Veo3.1 and Sora2 video generation via Kie.AI for realistic AI video clips",
      "Google Drive asset management with organized folder structure",
    ],
    deliverables: ["n8n workflow JSONs (WF-003, WF-004)", "UGC Machine workflow template", "Gemini prompt templates", "Quality scoring rubric"],
  },
  {
    id: 4,
    title: "Automation Engine",
    subtitle: "n8n workflows that run your pipeline end-to-end",
    bullets: [
      "Master orchestrator workflow — chains generators and assemblers automatically",
      "Webhook triggers from Airtable status changes",
      "Dual-model UGC Machine — Veo3.1 + Sora2 with intelligent routing",
      "Error handling, retry logic, and notification setup",
    ],
    deliverables: ["n8n master orchestrator JSON (WF-001)", "UGC Machine workflow JSON", "n8n setup guides (self-hosted + cloud)", "Credential reference docs"],
  },
  {
    id: 5,
    title: "Video Assembly",
    subtitle: "FFMPEG recipes that turn assets into publish-ready videos",
    bullets: [
      "Ken Burns zoom, crossfade transitions, text overlay commands — all provided",
      "Platform-optimized output: 9:16, H.264, Instagram/TikTok/YouTube Shorts ready",
      "Text overlay system — hooks, caption bars, CTAs with exact positioning",
      "Music integration with volume levels, fade-in/out, and voiceover ducking",
    ],
    deliverables: ["n8n FFMPEG assembler JSON (WF-006)", "FFMPEG command recipe library", "Platform export presets", "Text overlay system reference"],
  },
  {
    id: 6,
    title: "Content Strategy & Scaling",
    subtitle: "What to post, how to hook, and how to grow",
    bullets: [
      "20+ proven hook formulas — problem-agitate, reveal, POV, curiosity gap",
      "Video structure templates for B-Roll, Talking Head, and Cinematic formats",
      "Content framing rules — discovery voice, emotional storytelling, soft CTAs",
      "Trend automation roadmap — automated trend scraping to playbook generation",
    ],
    deliverables: ["Content strategy playbook", "20+ hook formula database", "3 video structure templates", "Niche adaptation guide"],
  },
];

// Included items checklist for pricing section
export const includedItems = [
  "6 comprehensive modules with video walkthroughs",
  "Notion workspace template (duplicate & go)",
  "5 n8n workflow JSONs (ready to import)",
  "Airtable base template (duplicate & go)",
  "60+ Gemini prompt templates",
  "UGC Machine workflow (Veo3.1 + Sora2)",
  "FFMPEG command recipe library",
  "Content strategy playbook with 20+ hook formulas",
  "Video structure templates (3 formats)",
  "Brand system + character sheet template kit",
];

// Bonus items
export const bonuses = [
  {
    name: "The AI Influencer Niche Selector",
    description: "A decision framework for picking the most profitable niche for your AI influencer — based on audience size, monetization potential, and content difficulty.",
    value: 47,
  },
  {
    name: "Platform Optimization Cheat Sheet",
    description: "Resolution, codec, file size, caption placement, and posting schedule settings for Instagram Reels, TikTok, and YouTube Shorts — all on one page.",
    value: 27,
  },
  {
    name: "3 Months of Pipeline Updates",
    description: "As the system evolves with new AI models, workflow improvements, and community-discovered optimizations — you get every update for 3 months.",
    value: 97,
  },
];

// FAQ items
export const faqItems = [
  {
    question: "Do I need coding experience?",
    answer: "No. n8n is a visual, no-code workflow builder — you drag and connect nodes. FFMPEG commands are provided as copy-paste recipes. The Airtable base is pre-built. If you can follow step-by-step instructions, you can build this.",
  },
  {
    question: "What AI tools do I need?",
    answer: "Gemini API (free tier available with generous limits), n8n (free self-hosted or affordable cloud plan), Airtable (free tier works), and optionally Kie.AI for Veo3.1/Sora2 video generation. Total monthly cost can be under $20.",
  },
  {
    question: "How long until I see results?",
    answer: "Most builders generate their first AI content within 48 hours of starting the setup. The full pipeline — from brand foundation to automated video output — typically takes 1-2 weeks to deploy, depending on how much time you put in.",
  },
  {
    question: "Is this just for kitchen/lifestyle content?",
    answer: "No. aSliceOfHaven is our case study, but the TwinGen system is niche-agnostic. The brand foundation, automation engine, and content strategy modules work for any vertical — fashion, fitness, tech reviews, travel, food, or anything else. Module 6 includes a niche adaptation guide.",
  },
  {
    question: "What if I get stuck?",
    answer: "Every module includes step-by-step video walkthroughs. The Notion workspace has troubleshooting sections for common issues. You can also reach us at info@theinnovativenative.com for direct support.",
  },
  {
    question: "Can I really build an AI influencer for under $100?",
    answer: "Yes. Here's the cost breakdown: This blueprint ($57 early bird) + Gemini API (free tier) + n8n self-hosted (free) + Airtable (free tier) = $57 total to get started. Optional Kie.AI credits for video generation add $10-30/month depending on volume.",
  },
  {
    question: "What makes this different from other AI influencer courses?",
    answer: "This isn't a course — it's a production system. You get the actual workflow files, the actual Airtable base, the actual prompt templates. Most courses teach theory and leave you to figure out implementation. This gives you the implementation, ready to deploy.",
  },
  {
    question: "Do I own the content my AI creates?",
    answer: "Yes, 100%. All AI-generated images and videos are yours with full commercial rights. You own the character, the content, and the brand you build with it.",
  },
];

// Trust badges
export const trustBadges = [
  { icon: "shield", text: "Secure Checkout" },
  { icon: "zap", text: "Instant Access" },
  { icon: "download", text: "Lifetime Access" },
];
