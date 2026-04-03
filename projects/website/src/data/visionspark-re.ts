// Product configuration
export const VISIONSPARK_RE = {
  name: "The Listing Video Blueprint",
  tagline: "AI-Staged Photos + Generative Video for Every Listing",
  description: "The complete pipeline for AI-staged property photos, Veo 3.1 generative walkthrough video, and branded listing reels. Not Ken Burns. Not slideshows. Real generative video — for under $10 per listing.",
  price: {
    earlyBird: 97,
    full: 197,
    currency: "USD",
  },
  scarcity: {
    earlyBirdLimit: 100,
    earlyBirdSold: 0,
  },
  stripe: {
    productId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_VISIONSPARK || '',
    buyButtonId: process.env.NEXT_PUBLIC_STRIPE_BUY_BTN_VISIONSPARK || '',
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },
  upsells: {
    doneForYou: {
      name: "Done-For-You Listing Video",
      price: 497,
      description: "We run the pipeline for you. Submit property details — receive 8 AI-staged photos, a Veo 3.1 walkthrough video, and a branded listing reel. Delivered in 5 business days.",
      stripeBuyButtonId: process.env.NEXT_PUBLIC_STRIPE_BUY_BTN_VS_DFY || '',
      stripeLink: "#vs-dfy-checkout",
    },
    dfyBundle: {
      name: "Done-For-You 3-Pack",
      price: 997,
      description: "Full DFY package for 3 listings with priority 24-hour turnaround. Save $494 vs. individual pricing.",
      stripeBuyButtonId: process.env.NEXT_PUBLIC_STRIPE_BUY_BTN_VS_DFY_BUNDLE || '',
      stripeLink: "#vs-dfy-bundle-checkout",
    },
  },
  seo: {
    title: "AI Listing Videos for Real Estate — The Listing Video Blueprint | The Innovative Native",
    description: "AI-staged photos + true generative video for real estate listings. Veo 3.1 property walkthroughs, branded reels, compliance overlays. Under $10/listing.",
    keywords: ["AI real estate video", "virtual staging video", "listing video AI", "AI property staging", "real estate AI marketing", "Veo 3.1 real estate", "AI virtual staging"],
    ogImage: "/images/visionspark-re/og-image.jpg",
  },
};

// Pain points for problem agitation section
export const painPoints = [
  {
    icon: "triangle-exclamation",
    title: "AI Slop Everywhere",
    description: "Floating furniture, merged objects, scale issues. You've tried AI staging tools and the output looks fake. You can't put this on an MLS listing.",
  },
  {
    icon: "video-slash",
    title: "\"AI Video\" That Isn't Video",
    description: "Every tool marketing \"AI video\" is just zooming and panning on a still photo with music. That's a slideshow. Your clients can tell the difference.",
  },
  {
    icon: "layer-group",
    title: "Tool Overload",
    description: "One tool for staging, another for video, another for branding, another for social export. $200+/month across platforms and you're still stitching output together manually.",
  },
  {
    icon: "shield-halved",
    title: "Compliance Anxiety",
    description: "AB 723, NAR guidelines, your broker asking questions. You know you should use AI, but nobody is telling you how to stay compliant while you do it.",
  },
];

// 5-step "How It Works" system
export const systemSteps = [
  {
    number: 1,
    title: "Property Setup & Staging",
    description: "Define property details, architectural style, and room types. RE-specific prompt templates generate consistent, high-quality staged interiors — not the generic AI slop from other tools.",
    deliverable: "50 property-type prompt templates + quality scoring rubric",
    icon: "house",
  },
  {
    number: 2,
    title: "Set Up Mission Control",
    description: "Deploy a pre-built Airtable base that tracks every listing from property input to delivered output. Configure agent branding, MLS number, and disclosure settings once.",
    deliverable: "Airtable base template with RE pipeline tracking",
    icon: "database",
  },
  {
    number: 3,
    title: "Generate Staged Photos",
    description: "Kie.AI NBP generates photorealistic staged interiors from property descriptions. Quality scoring rejects floating furniture, scale issues, and AI artifacts automatically.",
    deliverable: "n8n image generation workflow (JSON)",
    icon: "image",
  },
  {
    number: 4,
    title: "Generate Walkthrough Video",
    description: "Veo 3.1 creates true generative video — actual camera movement through staged spaces. This is frame-interpolated, not a zoom effect on a photo.",
    deliverable: "n8n video generation workflow (JSON)",
    icon: "film",
  },
  {
    number: 5,
    title: "Brand & Assemble Reels",
    description: "FFMPEG assembles staged photos and video into branded reels with your agent logo, brokerage name, MLS number, and \"AI Generated\" disclosure overlay.",
    deliverable: "n8n reel assembly workflow + platform export presets",
    icon: "clapperboard",
  },
];

// 6 modules for the product breakdown
export const modules = [
  {
    id: 1,
    title: "Property Staging Foundation",
    subtitle: "RE-specific prompt engineering that produces staging you'd put on an MLS listing",
    bullets: [
      "Master 12 room types with 8 architectural style variants — structured prompts for consistent, high-quality output",
      "Quality scoring calibrated for RE: floating furniture detection, scale validation, reflection consistency",
      "50 property-type prompt templates organized by room + style combination",
      "Staging style selector: modern minimalist, transitional, coastal, farmhouse, industrial, luxury traditional",
    ],
    deliverables: ["RE Prompt Engineering System", "50 Property-Type Prompt Templates", "Quality Scoring Rubric (RE)", "Staging Style Guide"],
  },
  {
    id: 2,
    title: "Mission Control",
    subtitle: "Airtable command center tracking every listing from input to delivered reel",
    bullets: [
      "Airtable base with property records, generation pipeline, and delivery tracking",
      "Agent branding configuration: logo, brokerage name, MLS number — set once, used on every reel",
      "Pipeline state machine: Property Input → Staging → Video Gen → Reel Assembly → Delivery",
      "Disclosure state field that auto-applies the correct compliance overlay for your state",
    ],
    deliverables: ["Airtable Base Template (RE)", "Field-by-Field Setup Guide", "Pipeline State Machine Docs", "Agent Branding Config Guide"],
  },
  {
    id: 3,
    title: "AI Image Generation",
    subtitle: "Photorealistic staged interiors with built-in quality gates",
    bullets: [
      "Kie.AI NBP generates staged interior photos from property descriptions — no need to photograph the property",
      "Quality scoring rejects floating furniture, scale issues, and obvious AI artifacts before you see them",
      "Batch generation: submit 8 rooms, get 8 staged photos — quality-checked and organized in Google Drive",
      "Works for vacant properties, pre-construction marketing, and renovation previews",
    ],
    deliverables: ["n8n Image Generation Workflow (JSON)", "Kie.AI NBP Setup Guide", "RE Quality Scoring System", "Drive Asset Organization Template"],
  },
  {
    id: 4,
    title: "AI Video Generation",
    subtitle: "True generative video via Veo 3.1 — not Ken Burns pan-and-zoom",
    bullets: [
      "Veo 3.1 frame interpolation creates actual camera motion — dolly shots, pan reveals, walkthrough sequences",
      "Property walkthrough videos showing depth, perspective changes, and spatial relationships",
      "Construction timelapse generation for pre-construction marketing (no competitor does this)",
      "Fire-and-forget callback pattern: submit generation, get notified when complete",
    ],
    deliverables: ["n8n Video Generation Workflow (JSON)", "Walkthrough Prompt Templates", "Construction Timelapse System", "Veo 3.1 Optimization Guide"],
  },
  {
    id: 5,
    title: "Branding & Reel Assembly",
    subtitle: "Branded, compliant listing reels assembled automatically",
    bullets: [
      "Agent branding overlay: your logo, brokerage name, MLS number — positioned and styled automatically",
      "\"AI Generated\" disclosure overlay baked into every output (per AB 723 and NAR guidelines)",
      "Music options: ambient property showcase, modern upbeat, cinematic luxury",
      "Platform-optimized export: Instagram Reels (9:16), TikTok, YouTube Shorts, MLS-compliant (16:9)",
    ],
    deliverables: ["n8n Reel Assembly Workflow (JSON)", "FFMPEG Recipe Library (RE)", "Agent Branding System Guide", "Platform Export Presets"],
  },
  {
    id: 6,
    title: "Compliance & Content Strategy",
    subtitle: "The regulatory knowledge and strategy that turns pipeline output into closings",
    bullets: [
      "California AB 723 compliance templates — when disclosure is required, exact language, placement rules",
      "NAR AI guidelines decoded — what's actually required vs. what agents fear is required",
      "State-by-state disclosure requirements for the top 15 states",
      "Content strategy: which platforms, posting frequency, how to position AI-generated content",
    ],
    deliverables: ["AI Disclosure Compliance Guide (PDF)", "State-by-State Matrix", "NAR Guidelines Decoder", "RE Content Strategy Playbook"],
  },
];

// Included items checklist for pricing section
export const includedItems = [
  "6 comprehensive modules with video walkthroughs",
  "50 property-type prompt templates",
  "n8n workflow files for image gen, video gen, and reel assembly (importable JSON)",
  "Airtable base template with agent branding configuration",
  "Veo 3.1 generative video system (not Ken Burns zoom)",
  "Construction timelapse generation for pre-construction marketing",
  "FFMPEG branding overlay recipes (agent logo, MLS, disclosure)",
  "AI Disclosure Compliance Guide (AB 723, NAR, state-by-state)",
  "Platform export presets (Instagram, TikTok, YouTube, MLS)",
  "Lifetime Access + All Future Updates",
];

// Bonus items
export const bonuses = [
  {
    name: "AI Disclosure Compliance Kit",
    description: "The complete regulatory guide: California AB 723, NAR guidelines, disclosure requirements for the top 15 states. Copy-paste disclosure templates for MLS listings and social media. The same kit our Done-For-You clients receive.",
    value: 97,
  },
  {
    name: "RE Content Calendar Template",
    description: "A 90-day content calendar pre-built for real estate agents using AI-generated content. Posting cadence by platform, content pillar rotation, and caption templates for each post type.",
    value: 47,
  },
  {
    name: "3 Months of Pipeline Updates",
    description: "AI models improve. Disclosure regulations evolve. New workflow optimizations get discovered. Every update to the Blueprint for 3 months — new prompt templates, workflows, compliance guidance. No extra cost.",
    value: 97,
  },
];

// FAQ items
export const faqItems = [
  {
    question: "Do I need technical experience to use this?",
    answer: "No. The Blueprint is built on no-code and low-code tools. Airtable is drag-and-drop. n8n workflows are importable JSON files — you connect nodes, not write code. FFMPEG commands are provided as copy-paste recipes. If you can follow step-by-step instructions, you can build this.",
  },
  {
    question: "What tools do I need? How much do they cost?",
    answer: "Kie.AI for image and video generation (~$10-30/month), Airtable (free tier works to start), n8n (free self-hosted or ~$20/month cloud), and Google Drive. Total monthly cost under $50. Most agents start on free tiers and scale up as listing volume grows.",
  },
  {
    question: "How is this different from REimagineHome, Collov, or other AI staging tools?",
    answer: "Those tools do photo staging only — still images. This Blueprint gives you staged photos AND true generative video AND branded reel assembly AND compliance overlays — all from one pipeline. Our video is Veo 3.1 generative video with real camera motion, not Ken Burns zoom-and-pan on still photos.",
  },
  {
    question: "What about legal compliance? Is AI staging allowed?",
    answer: "AI staging is legal in every U.S. state, but disclosure requirements vary. California AB 723 requires disclosure of AI-generated content. Module 6 covers state-by-state requirements, exact disclosure language, and templates. The pipeline also bakes an \"AI Generated\" disclosure overlay into every video output automatically.",
  },
  {
    question: "Can this work for pre-construction or development projects?",
    answer: "Yes — this is where the Blueprint is genuinely unique. The Veo 3.1 construction timelapse system generates time-lapse sequences showing a building from foundation to completion. No other product on the market does this. If you market pre-construction properties, this pipeline produces content your competitors cannot create.",
  },
  {
    question: "How long until I have my first listing video?",
    answer: "The Blueprint is designed for your first AI-staged listing content within 48 hours. Airtable base and branding in session one. Workflows imported and first generation running by session two. A branded listing reel by session three.",
  },
  {
    question: "What if I just want someone to do it for me?",
    answer: "After purchasing the Blueprint, you'll see our Done-For-You offer. For $497 per listing (or $1,997 per development project), we run the pipeline for you. Submit property details — receive 8 staged photos + walkthrough video + branded reel. No setup required on your end.",
  },
  {
    question: "Do I own the content the pipeline produces?",
    answer: "Yes. All AI-generated images and videos are yours with full commercial rights. Your agent branding is on it. Your MLS number is on it. You own the output.",
  },
];

// Trust badges
export const trustBadges = [
  { icon: "shield", text: "Secure Checkout" },
  { icon: "bolt", text: "Instant Access" },
  { icon: "download", text: "Lifetime Access" },
];
