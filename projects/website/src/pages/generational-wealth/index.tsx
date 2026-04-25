import React from "react";
import Link from "next/link";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import PasswordGate from "@/components/generational-wealth/PasswordGate";
import JourneyProgress from "@/components/generational-wealth/JourneyProgress";
import StatCard from "@/components/generational-wealth/StatCard";
import GWBottomNav from "@/components/generational-wealth/GWBottomNav";
import YouTubeEmbed from "@/components/generational-wealth/YouTubeEmbed";

interface SectionCard {
  title: string;
  description: string;
  href: string;
  badge: string;
  group: "priority" | "knowledge" | "reference";
}

const SECTION_CARDS: SectionCard[] = [
  {
    title: "EQIP — Government Cost-Share",
    description: "How the USDA pays 75-90% of your land clearing, fencing, and pond costs. Start here.",
    href: "/generational-wealth/eqip",
    badge: "Must Read",
    group: "priority",
  },
  {
    title: "Money & Financing",
    description: "The $272K budget, three ways to pay for it, and why borrowing might be smarter than paying cash.",
    href: "/generational-wealth/financing",
    badge: "Priority",
    group: "priority",
  },
  {
    title: "Due Diligence",
    description: "The checklist that protects you from expensive surprises before you sign anything.",
    href: "/generational-wealth/due-diligence",
    badge: "Printable",
    group: "priority",
  },
  {
    title: "Legal Structure — Trust, LLC & Tax",
    description: "How to structure ownership so the land passes to the next generation tax-free and probate-free.",
    href: "/generational-wealth/legal-structure",
    badge: "Priority",
    group: "priority",
  },
  {
    title: "Timber as Asset — Buying Land at a Discount",
    description: "How standing timber + EQIP cost-share can drive the net cost of a 25-acre tract to zero or below. Same region, smarter parcels.",
    href: "/generational-wealth/timber",
    badge: "Strategy",
    group: "priority",
  },
  {
    title: "The Vision",
    description: "Why we're doing this, what it looks like when it's done, and the order everything has to happen.",
    href: "/generational-wealth/vision",
    badge: "Start Here",
    group: "knowledge",
  },
  {
    title: "Finding Land",
    description: "Where to look, how to evaluate a property, and how to negotiate.",
    href: "/generational-wealth/find-land",
    badge: "Guide",
    group: "knowledge",
  },
  {
    title: "Building the Barndominium",
    description: "Post-frame construction, spray foam insulation, and how to build tight on a budget.",
    href: "/generational-wealth/building",
    badge: "Guide",
    group: "knowledge",
  },
  {
    title: "Water, Power & Systems",
    description: "Wells, solar panels, septic, rainwater — the infrastructure that makes the land livable.",
    href: "/generational-wealth/systems",
    badge: "Guide",
    group: "knowledge",
  },
  {
    title: "Zero-Energy Cooling",
    description: "Solar chimneys, earth tubes, and a tight envelope — keeping the house comfortable in hot-humid Oklahoma without a grid-hungry AC.",
    href: "/generational-wealth/cooling",
    badge: "Guide",
    group: "knowledge",
  },
  {
    title: "Food Systems",
    description: "Aquaponics, fruit trees, sheep, chickens — growing what we eat.",
    href: "/generational-wealth/food",
    badge: "Guide",
    group: "knowledge",
  },
  {
    title: "The Compound",
    description: "When we're ready to bring more family in — carrying capacity, shared infrastructure, legal options.",
    href: "/generational-wealth/compound",
    badge: "Long-Term",
    group: "knowledge",
  },
  {
    title: "Oklahoma vs Texas",
    description: "Side-by-side comparison of land costs, water rights, taxes, and permits.",
    href: "/generational-wealth/oklahoma-vs-texas",
    badge: "Reference",
    group: "reference",
  },
  {
    title: "Risks & Edge Cases",
    description: "What can go wrong, walk-away triggers, hidden costs, and how we handle each one.",
    href: "/generational-wealth/risks",
    badge: "Reference",
    group: "reference",
  },
  {
    title: "Contacts & Resources",
    description: "Every phone number, website, and person you'll need. Tap to call.",
    href: "/generational-wealth/contacts",
    badge: "Printable",
    group: "reference",
  },
  {
    title: "Timeline",
    description: "The full plan quarter by quarter — Year 0 through Year 5.",
    href: "/generational-wealth/timeline",
    badge: "Reference",
    group: "reference",
  },
  {
    title: "Glossary",
    description: "Every acronym and term explained in plain English.",
    href: "/generational-wealth/glossary",
    badge: "Reference",
    group: "reference",
  },
];

function CardGroup({ title, intro, cards }: { title: string; intro: string; cards: SectionCard[] }) {
  return (
    <>
      <h2 className="gw-dashboard__section-heading">{title}</h2>
      <p className="gw-dashboard__section-intro">{intro}</p>
      <div className="gw-dashboard__cards">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="gw-dashboard__card gw-dashboard__card--active">
            <span className="gw-dashboard__card-badge gw-dashboard__card-badge--phase1">
              {card.badge}
            </span>
            <h3 className="gw-dashboard__card-title">{card.title}</h3>
            <p className="gw-dashboard__card-desc">{card.description}</p>
            <span className="gw-dashboard__card-cta">Read this &rarr;</span>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function GenerationalWealthIndex() {
  return (
    <Layout header={1} footer={1}>
      <Head>
        <title>Generational Wealth Hub | The Innovative Native</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PasswordGate>
        <div className="gw-dashboard">
          <div className="gw-dashboard__hero">
            <div className="gw-dashboard__hero-inner">
              <h1 className="gw-dashboard__headline">Claim the Land.<br />Build the Village.</h1>
              <p className="gw-dashboard__subheadline">
                A family guide to buying rural land, building a homestead, and
                creating something that outlasts us — written from one generation
                to the next.
              </p>
            </div>
          </div>

          <div className="gw-dashboard__content">
            <YouTubeEmbed videoId="MEx1OJDpv1M" title="Welcome — Watch This First" />

            <JourneyProgress />

            <div className="gw-stat-cards">
              <StatCard value="25 acres" label="Target land size" />
              <StatCard value="$275K" label="Cash reserves available" />
              <StatCard value="90% DIY" label="Plan is mostly our hands" />
              <StatCard value="4 years" label="Full build-out timeline" />
            </div>

            <CardGroup
              title="Start Here — The Critical Decisions"
              intro="These four guides cover the money, the programs, the legal structure, and the due diligence. Read these before visiting any property."
              cards={SECTION_CARDS.filter((c) => c.group === "priority")}
            />

            <CardGroup
              title="Deep Knowledge — The Build"
              intro="Everything about finding land, building the house, setting up water and power, growing food, and eventually bringing more family onto the property."
              cards={SECTION_CARDS.filter((c) => c.group === "knowledge")}
            />

            <CardGroup
              title="Reference — Look These Up When You Need Them"
              intro="State comparisons, risk analysis, contact directories, the full timeline, and a glossary of every term we use."
              cards={SECTION_CARDS.filter((c) => c.group === "reference")}
            />

            <div className="gw-dashboard__legal">
              <p>
                This guide is for informational purposes only. It is not legal,
                financial, or tax advice. All program rules, payment rates, income
                limits, and deadlines are subject to change — verify everything
                with the relevant agency or a licensed professional before acting.
                The information here reflects our best understanding as of April 2026.
              </p>
            </div>
          </div>
        </div>
        <GWBottomNav />
      </PasswordGate>
    </Layout>
  );
}
