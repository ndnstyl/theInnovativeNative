import React from "react";
import Link from "next/link";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import PasswordGate from "@/components/generational-wealth/PasswordGate";
import JourneyProgress from "@/components/generational-wealth/JourneyProgress";
import StatCard from "@/components/generational-wealth/StatCard";
import GWBottomNav from "@/components/generational-wealth/GWBottomNav";

interface SectionCard {
  title: string;
  description: string;
  href: string;
  badge: string;
  phase: 1 | 2;
}

const SECTION_CARDS: SectionCard[] = [
  {
    title: "EQIP — Government Cost-Share",
    description: "How the USDA pays 75–90% of your land improvement costs. The most important program you've never heard of.",
    href: "/generational-wealth/eqip",
    badge: "Phase 1 — Must Read",
    phase: 1,
  },
  {
    title: "Money & Financing",
    description: "The $272K budget, three ways to pay for it, and why borrowing might be smarter than paying cash.",
    href: "/generational-wealth/financing",
    badge: "Phase 1",
    phase: 1,
  },
  {
    title: "Due Diligence",
    description: "The checklist that protects you from expensive surprises before you sign anything.",
    href: "/generational-wealth/due-diligence",
    badge: "Phase 1 — Printable",
    phase: 1,
  },
  {
    title: "Contacts & Resources",
    description: "Every agency, lender, forester, and tool you'll need. Phone numbers you can tap to call.",
    href: "/generational-wealth/contacts",
    badge: "Phase 1 — Printable",
    phase: 1,
  },
  {
    title: "Timeline",
    description: "The full plan quarter by quarter — from first land search through Year 5 food production.",
    href: "/generational-wealth/timeline",
    badge: "Phase 1",
    phase: 1,
  },
  {
    title: "Glossary",
    description: "Every acronym explained in plain English. EQIP, FSA, NRCS, GPM — all of it.",
    href: "/generational-wealth/glossary",
    badge: "Phase 1 — Reference",
    phase: 1,
  },
  {
    title: "Building the Barndominium",
    description: "Post-frame construction, closed-cell foam, mini-splits, and how to build tight on a budget.",
    href: "/generational-wealth/building",
    badge: "Phase 2 — Coming Soon",
    phase: 2,
  },
  {
    title: "Off-Grid Systems",
    description: "Solar, battery, well water, rainwater, and septic — the systems that make the land livable.",
    href: "/generational-wealth/systems",
    badge: "Phase 2 — Coming Soon",
    phase: 2,
  },
  {
    title: "Food Production",
    description: "Aquaponics, hair sheep, laying hens, fruit trees — the food systems that cut your grocery bill.",
    href: "/generational-wealth/food",
    badge: "Phase 2 — Coming Soon",
    phase: 2,
  },
  {
    title: "Legal Structure",
    description: "LLC vs. trust vs. nothing — how to hold the land so it passes to the next generation cleanly.",
    href: "/generational-wealth/legal",
    badge: "Phase 2 — Coming Soon",
    phase: 2,
  },
  {
    title: "Tax Strategy",
    description: "Ag exemptions, timber income treatment, depreciation, and how to keep more of what you earn.",
    href: "/generational-wealth/tax",
    badge: "Phase 2 — Coming Soon",
    phase: 2,
  },
  {
    title: "Estate Planning",
    description: "How to make sure the land — and the vision — passes to your daughters without a courtroom fight.",
    href: "/generational-wealth/estate",
    badge: "Phase 2 — Coming Soon",
    phase: 2,
  },
  {
    title: "Insurance",
    description: "Farm and ranch insurance, builder's risk, homestead coverage — what you need and when.",
    href: "/generational-wealth/insurance",
    badge: "Phase 2 — Coming Soon",
    phase: 2,
  },
  {
    title: "Business Structures",
    description: "Turning the homestead into a small agribusiness — market garden, timber, agritourism.",
    href: "/generational-wealth/business",
    badge: "Phase 2 — Coming Soon",
    phase: 2,
  },
];

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
            <JourneyProgress />

            <div className="gw-stat-cards">
              <StatCard value="25 acres" label="Target land size" />
              <StatCard value="$275K" label="Cash reserves available" />
              <StatCard value="90% DIY" label="Plan is mostly our hands" />
              <StatCard value="4 years" label="Full build-out timeline" />
            </div>

            <h2 className="gw-dashboard__section-heading">Phase 1 — Buy the Land</h2>
            <p className="gw-dashboard__section-intro">
              These six guides cover everything from finding the property to
              closing the deal. Start with EQIP — it changes how you look at
              every parcel you consider.
            </p>

            <div className="gw-dashboard__cards">
              {SECTION_CARDS.filter((c) => c.phase === 1).map((card) => (
                <Link key={card.href} href={card.href} className="gw-dashboard__card gw-dashboard__card--active">
                  <span className="gw-dashboard__card-badge gw-dashboard__card-badge--phase1">
                    {card.badge}
                  </span>
                  <h3 className="gw-dashboard__card-title">{card.title}</h3>
                  <p className="gw-dashboard__card-desc">{card.description}</p>
                  <span className="gw-dashboard__card-cta">
                    Read this &rarr;
                  </span>
                </Link>
              ))}
            </div>

            <h2 className="gw-dashboard__section-heading">Phase 2 — Build It</h2>
            <p className="gw-dashboard__section-intro">
              These guides come after the land is bought and the plan is locked.
              We&rsquo;re writing them as we go — they&rsquo;ll be ready when you
              need them.
            </p>

            <div className="gw-dashboard__cards">
              {SECTION_CARDS.filter((c) => c.phase === 2).map((card) => (
                <div key={card.href} className="gw-dashboard__card gw-dashboard__card--dimmed">
                  <span className="gw-dashboard__card-badge gw-dashboard__card-badge--phase2">
                    {card.badge}
                  </span>
                  <h3 className="gw-dashboard__card-title">{card.title}</h3>
                  <p className="gw-dashboard__card-desc">{card.description}</p>
                  <span className="gw-dashboard__card-cta gw-dashboard__card-cta--disabled">
                    Coming Soon
                  </span>
                </div>
              ))}
            </div>

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
