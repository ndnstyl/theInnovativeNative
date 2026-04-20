import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import StatCard from "@/components/generational-wealth/StatCard";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";
import { T } from "@/components/generational-wealth/TooltipTerm";

export default function CompoundPage() {
  return (
    <GWLayout
      title="The Compound — Building for More Than One Family"
      lastVerified="April 2026"
      readingTime="8 min"
    >
      <PageCover imageSrc="/images/generational-wealth/cover-compound.jpg" imageAlt="Rural community of homes on shared land" />
      <h1>The Compound — Building for More Than One Family</h1>

      <p className="gw-lead">
        This page is about something bigger than one house on one piece of land.
        It&rsquo;s about what happens when we&rsquo;re ready to bring trusted
        family onto the property and build something together. This is the
        long-term vision &mdash; not Year 1, probably Year 3 or later.
      </p>

      <CalloutBox type="the-law">
        Co-ownership of land involves real legal complexity &mdash; LLCs, trusts,
        shared-well agreements, and zoning rules. Everything here is educational.
        Before adding anyone to a deed or forming any entity, hire an attorney
        who specializes in rural property and family co-ownership in your state.
      </CalloutBox>

      <h2>The Math Surprised Us</h2>

      <p>
        When we first started planning, we assumed we needed 25&ndash;30 acres
        just for one family. But when we actually ran the carrying-capacity math
        &mdash; how many people can the land actually feed and house &mdash; the
        numbers told a different story.
      </p>

      <div className="gw-stat-cards">
        <StatCard value="10 acres" label="Minimum viable for 4 families" />
        <StatCard value="14 acres" label="Comfortable with 30% headroom" />
        <StatCard value="16 people" label="4 families of 4" />
        <StatCard value="25+ acres" label="Luxurious — room to expand" />
      </div>

      <p>
        The key insight: intensive rotational grazing, aquaponics, and shared
        infrastructure mean 4 families don&rsquo;t need 4&times; the land. They
        need about 1.5&times; the shared space plus 4 small home sites.
      </p>

      <h2>How It Works — Shared Infrastructure</h2>

      <p>
        The compound model shares the expensive stuff that doesn&rsquo;t need
        to be duplicated:
      </p>

      <ul className="gw-list">
        <li><strong>Water</strong> &mdash; One well + cistern system serves all 4 homes (sized for 15+ GPM)</li>
        <li><strong>Septic</strong> &mdash; One commercial-grade aerobic system or 2 residential systems</li>
        <li><strong>Power</strong> &mdash; One solar array + battery bank with sub-panels to each home</li>
        <li><strong>Aquaponics</strong> &mdash; One larger greenhouse (24&prime;&times;48&prime;) feeds everyone</li>
        <li><strong>Fencing</strong> &mdash; One perimeter fence, shared rotational paddocks</li>
        <li><strong>Workshop</strong> &mdash; One shared tool shop, one tractor, shared implements</li>
        <li><strong>Internet</strong> &mdash; One Starlink dish, shared via mesh WiFi</li>
      </ul>

      <p>
        Each family builds their own home (barndo shell, ~800&ndash;1,200 sqft)
        with their own budget. The shared infrastructure cost is split.
      </p>

      <h2>The Food Production Math</h2>

      <ComparisonTable
        headers={["System", "Footprint", "Annual Production", "Feeds"]}
        rows={[
          ["Aquaponics (2,000 gal)", "0.03 acres", "800 lb fish + 2,000 lb veg", "16 people"],
          ["Sheep (10 ewes, rotational)", "6 acres", "600 lb lamb", "16 people"],
          ["Poultry (200 broilers + 40 layers)", "Same 6 acres", "800 lb chicken + 320 doz eggs", "16 people"],
          ["Garden beds (8,000 sqft)", "0.18 acres", "2,000+ lb produce", "16 people"],
          ["Orchard (integrated)", "2 acres (silvopasture)", "Pecans Y5+, fruit Y3+", "Supplemental"],
        ]}
      />

      <CalloutBox type="pro-tip">
        The magic number is silvopasture &mdash; trees + grazing on the same
        acres. Instead of a separate orchard and a separate pasture, you run
        sheep under the pecan trees. Same land, multiple yields.
      </CalloutBox>

      <h2>When to Expand</h2>

      <p>
        The compound doesn&rsquo;t happen Year 1. Here&rsquo;s when it makes
        sense to start the conversation:
      </p>

      <ul className="gw-list">
        <li><strong>Year 1&ndash;2</strong> &mdash; Mike&rsquo;s family only. Prove the systems work. Learn what breaks.</li>
        <li><strong>Year 3+</strong> &mdash; If 2+ families are genuinely committed (not just &ldquo;that sounds cool&rdquo;), begin planning. Water + septic capacity sized accordingly.</li>
        <li><strong>Trigger criteria</strong> &mdash; Family has visited the land, understands the lifestyle, has capital for their own home build, and everyone agrees on the operating rules.</li>
      </ul>

      <CalloutBox type="heads-up">
        The biggest risk to a family compound isn&rsquo;t the land, the money,
        or the systems. It&rsquo;s the relationships. Have the hard conversations
        about money, labor expectations, decision-making authority, and exit
        terms BEFORE anyone moves in. Put it all in writing.
      </CalloutBox>

      <h2>Legal Structure Options</h2>

      <ExpandableSection title="Option A: One Owner + Lease Agreements">
        <p>
          Mike owns the land (personally or via trust). Other families lease
          their home sites with long-term agreements. Simplest legally. Mike
          retains full control. Other families have security through the lease
          but no equity in the land itself.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Option B: LLC with Membership Units">
        <p>
          Form an LLC that owns the land. Each family holds membership units
          proportional to their investment. Operating agreement governs
          decisions, buyouts, and exits. More complex but gives everyone skin
          in the game. Requires a good attorney.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Option C: Tenancy in Common (TIC)">
        <p>
          Each family owns an undivided percentage of the whole property. Any
          owner can force a sale (partition action) unless you have a TIC
          agreement that waives that right. Risky without airtight legal docs.
          Not recommended without an attorney experienced in TIC for rural land.
        </p>
      </ExpandableSection>

      <CalloutBox type="family-note">
        We&rsquo;re leaning toward Option A for now &mdash; Mike owns, families
        lease. It&rsquo;s the simplest to set up and the easiest to unwind if
        someone&rsquo;s situation changes. We can restructure later if the
        compound proves out.
      </CalloutBox>

      <div className="gw-layout__disclaimer">
        This is educational information about co-ownership concepts. It is NOT
        legal advice. Before any co-ownership arrangement, consult a real estate
        attorney licensed in your state.
      </div>
    </GWLayout>
  );
}
