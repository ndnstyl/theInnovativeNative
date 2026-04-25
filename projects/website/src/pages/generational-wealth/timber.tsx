import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";
import StatCard from "@/components/generational-wealth/StatCard";

export default function TimberPage() {
  return (
    <GWLayout
      title="Timber as Asset: Buying Land at a Discount"
      lastVerified="April 2026"
      readingTime="11 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-timber.jpg"
        imageAlt="Mature pine and hardwood stand"
      />
      <h1>Timber as Asset: Buying Land at a Discount</h1>

      <p className="gw-lead">
        Most buyers look at rural land and see acres. We&rsquo;re going to look
        at it and see acres plus standing inventory. On the right tract in the
        right county, the timber on the land covers most of the purchase price.
        On the best ones, it covers all of it and then some.
      </p>

      <p>
        This page is the financial reframe. Same homestead plan, different
        purchase math. We pair it with the regional scoring on{" "}
        <a href="/generational-wealth/find-land">Finding Land</a>, the cost-share
        rules on <a href="/generational-wealth/eqip">EQIP</a>, and the budget
        framing on <a href="/generational-wealth/financing">Financing</a>.
      </p>

      <h2>The Reframe in One Paragraph</h2>

      <p>
        Mature timber is a real, harvestable asset. A 25-acre tract of mature
        Ouachita pine and hardwood in McCurtain County, Oklahoma sells for
        roughly $2,200 to $3,200 an acre. The timber on that same tract,
        cruised by a forester, often runs $4,000 to $6,000 an acre in standing
        stumpage value. Add the federal cost-share that pays 75 to 90 percent
        of the post-harvest brush clearing, and the math turns inverted. We
        end up owning the cleared, ready-to-improve land for less than zero.
      </p>

      <CalloutBox type="family-note" title="Important framing">
        This is a one-shot purchase-time arbitrage, not a recurring yield. A
        mature stand takes 40 to 80 years to regrow. We sell timber once at
        purchase, then we own land. The play is buying the land cheap by
        recognizing the asset on it. It&rsquo;s not a forestry business.
      </CalloutBox>

      <h2>The Worked Example</h2>

      <p>
        Numbers below assume a 25-acre tract in McCurtain County, Oklahoma. We
        do a selective high-grade harvest (preserves canopy, takes the most
        valuable trees), enroll the converted acres in EQIP at the 90 percent
        cost-share rate that beginning and historically underserved farmers
        qualify for, and reserve three acres for the homesite pad and
        immediate flanking.
      </p>

      <div className="gw-stat-cards">
        <StatCard value="$67,500" label="Purchase price (25 ac at $2,700/ac)" />
        <StatCard value="$88,000" label="Net timber sale (selective harvest)" />
        <StatCard value="$11,880" label="All-in clearing + homesite prep" />
        <StatCard value="$8,620" label="Net cash AHEAD after closing the loop" />
      </div>

      <p>
        That last number is real. After buying the land, harvesting the
        timber, paying for professional homesite preparation, and using EQIP
        on the rest of the acreage, we&rsquo;re money positive on the entire
        25-acre purchase. The land effectively becomes a paid asset rather
        than a cost.
      </p>

      <ExpandableSection title="Show me the full math">
        <ComparisonTable
          headers={["Line item", "Amount", "Notes"]}
          rows={[
            ["Purchase price", "$67,500", "25 ac at $2,700/ac, McCurtain County"],
            ["Forester engagement", "($800)", "Cruise + sale management, 12% of gross"],
            ["Gross timber stumpage", "$110,000", "22 ac at ~$5,000/ac selective harvest"],
            ["Forester fee (12%)", "($13,200)", "Comes off gross"],
            ["Net timber payment to landowner", "$96,800", "Wired after harvest"],
            ["EQIP brush management (Practice 314)", "$8,800 gross", "22 ac at $400/ac contractor rate"],
            ["EQIP cost-share at 90%", "($7,920) reimbursed", "Net out-of-pocket: $880"],
            ["Homesite professional prep (3 ac)", "($10,000)", "Pad clear + level + grade + compaction test"],
            ["Mike&rsquo;s own grading labor", "($1,000)", "Driveway, trails, rough pad: equipment rental + fuel"],
            ["NET POSITION", "+$8,620", "Land owned, ready to build"],
          ]}
        />
        <p>
          <strong>Conservative variant:</strong> If timber comes in at $3,500
          an acre instead of $5,000, the gross drops to $77,000 and the net to
          landowner is $67,760. After clearing costs of $11,880, net position
          is roughly minus $11,620. That&rsquo;s a 25-acre tract for under
          $500 an acre net. Still excellent.
        </p>
        <p>
          <strong>Pessimistic variant:</strong> Timber cruise comes in at
          $2,500 an acre. Gross $55,000, net $48,400 after forester fee.
          After clearing costs, net position is minus $30,980. 25 acres for
          $1,240 an acre net. Not the dream, but better than every comparable
          parcel without the timber play.
        </p>
      </ExpandableSection>

      <h2>The EQIP Discount on Clearing</h2>

      <p>
        EQIP Practice 314 (Brush Management) covers mechanical removal of
        woody species when the land is converting to a qualifying agricultural
        use. Silvopasture and improved pasture both qualify. The homesite
        does not. So we apply the cost-share to the bulk acreage and pay full
        freight on the homesite pad.
      </p>

      <p>
        The discount math, on a 22-acre conversion (the non-homesite portion
        of a 25-acre tract):
      </p>

      <ComparisonTable
        headers={["Approach", "Mike pays", "Notes"]}
        rows={[
          ["Hire it all out, no EQIP", "$8,800", "22 ac at $400/ac contractor"],
          ["Hire it out, 75% EQIP cost-share", "$2,200", "Standard rate for most landowners"],
          ["Hire it out, 90% EQIP cost-share", "$880", "Beginning farmer, veteran, or historically underserved"],
        ]}
      />

      <p>
        That&rsquo;s a $7,920 discount on a single line item, just for filing
        the paperwork and operating in the qualifying use category. Spread
        over the full 25-acre purchase, that&rsquo;s $317 an acre off the
        effective land cost. Real money.
      </p>

      <CalloutBox type="heads-up" title="The rule with no exceptions">
        Cost-share only pays for work done AFTER the EQIP contract is signed.
        Any clearing we do before the contract is locked is reimbursed at
        zero. The rule is also covered on the EQIP page. We close on the
        land, apply for EQIP, wait three to six months for the contract,
        then we work. Patience earns the discount.
      </CalloutBox>

      <h2>Pro vs. DIY: What We Hire Out, What We Do Ourselves</h2>

      <p>
        The clearing and grading bill on a 25-acre wooded tract can run
        $30,000 to $60,000 if we contract out everything. We&rsquo;re not
        going to. The plan is simple: pay professionals only for work that
        has to be precise. Do the rest ourselves with our own time, our own
        labor, and rented or owned equipment.
      </p>

      <ComparisonTable
        headers={["Work", "Pro or DIY", "Why"]}
        rows={[
          ["Bulk acreage brush removal (22 ac)", "Pro (contractor) + EQIP", "Covered at 90%. Brush mulcher does in two days what we&rsquo;d do in two months."],
          ["Homesite pad clearing (1 ac, every stump)", "Pro", "Stumps under a slab cause settling. Has to be done right."],
          ["Homesite leveling and compaction grading", "Pro", "Code-required for slab. Compaction has to be tested."],
          ["Drainage grading away from the foundation", "Pro", "Wrong slope means water in the house in year five."],
          ["Driveway rough grading", "DIY", "Doesn&rsquo;t have to be perfect. Mike with rented skid steer."],
          ["Access trails through the property", "DIY", "Chainsaw, UTV, and time. No grading required."],
          ["Building pad rough grading (before the pro pass)", "DIY", "Get it close, let the pro finish."],
          ["Stump/limb cleanup after EQIP brush mgmt", "DIY", "Fence rows, burn piles, woodlot for our own lumber."],
          ["Pasture seeding and fence lines", "DIY", "Whole family, weekends, year-one project."],
        ]}
      />

      <p>
        Net contractor cost on a typical 25-acre wooded tract under this
        split: about $11,000 (homesite pad pro work plus the
        EQIP-cost-shared bulk clearing). Mike&rsquo;s own labor is sweat
        equity, not cash out the door. Equipment rental for the DIY portion
        runs another $500 to $1,500 across the project.
      </p>

      <h2>Where the Timber Actually Is</h2>

      <p>
        The full regional scoring lives on{" "}
        <a href="/generational-wealth/find-land">Finding Land</a>. This is
        the timber-weighted condensation. Top three counties for the
        purchase-cost-offset play:
      </p>

      <ComparisonTable
        headers={["County", "Dominant timber", "Stumpage $/ac", "Land $/ac", "Effective net"]}
        rows={[
          ["McCurtain, OK (Ouachita)", "Loblolly + shortleaf pine, mixed hardwood", "$4,000–$8,000", "$2,200–$3,200", "Often negative"],
          ["Pushmataha + Le Flore, OK", "Pine + post oak", "$3,000–$6,000", "$1,800–$2,400", "Negative to break-even"],
          ["Adair + Cherokee-OK + Delaware (Ozark foothill)", "White oak, walnut, hickory (premium $/log)", "$5,000–$30,000+ if walnut-heavy", "$3,000–$5,000", "Highest variance, highest ceiling"],
          ["Nacogdoches + San Augustine + Shelby + Sabine, TX", "Loblolly pine plantation", "$5,000–$12,000", "$3,500–$5,500", "Positive after harvest"],
          ["Polk + Tyler + Newton + Jasper, TX (Big Thicket fringe)", "Mixed pine + cypress (premium)", "$4,000–$10,000", "$3,000–$5,000", "Cypress runs $3–7/bf"],
        ]}
      />

      <CalloutBox type="pro-tip" title="The walnut lottery">
        Northeast Oklahoma Ozark foothills are the wild card. A bottomland
        tract with mature black walnut can hit $20,000+ an acre in stumpage,
        with rare veneer-grade specimens commanding $50,000+ per single tree.
        We won&rsquo;t know until a forester cruises it. Worth driving the
        Adair County backroads.
      </CalloutBox>

      <h2>Selective Harvest, Not Clearcut</h2>

      <p>
        We&rsquo;re not clearcutting. Clearcutting maximizes one-time gross
        revenue but leaves us with bare ground, erosion problems, no canopy,
        and no agroforestry head start. Selective high-grade harvest takes
        the highest-value trees and leaves the rest standing.
      </p>

      <p>
        Selective harvest delivers roughly 50 to 70 percent of the
        clearcut gross while preserving 70 to 80 percent of the canopy.
        That&rsquo;s the right trade for a homestead buyer. We get the
        purchase-cost offset AND we keep the forest character we came for.
      </p>

      <p>
        The forester runs the sale. They flag the trees coming out, take
        bids from logging contractors, and supervise the cut. They take
        roughly 10 to 15 percent of the gross as their fee. They&rsquo;re
        worth every dollar because they prevent the high-grade-and-leave
        scenario where a logger takes everything valuable and leaves us
        with junk wood and rutted ground.
      </p>

      <h2>Honest Caveats</h2>

      <p>
        This whole strategy hinges on six assumptions that deserve to be
        named:
      </p>

      <ul className="gw-list">
        <li>
          <strong>Timber rights must convey at closing.</strong> In some
          parts of east Texas, sellers retained timber rights from a previous
          oil-era split. Verify in writing. If timber rights don&rsquo;t
          come with the land, this entire plan fails.
        </li>
        <li>
          <strong>The cruise has to come before the offer.</strong> A
          consulting forester cruises a 25-acre tract for $300 to $800.
          That report tells us what&rsquo;s standing in board feet, by
          species, with grade estimates. Without it, we&rsquo;re negotiating
          blind.
        </li>
        <li>
          <strong>EQIP requires a 5 to 10 year qualifying-use commitment.</strong>{" "}
          We can&rsquo;t enroll, take the cost-share, and then convert the
          land back to forest or sell it without paying the money back.
          Plan to keep the converted acres as silvopasture or pasture for
          the contract term.
        </li>
        <li>
          <strong>USDA appraisals don&rsquo;t always include timber value.</strong>{" "}
          The bank appraises the land at market for residential lending.
          Standing timber is often a separate negotiation. The arbitrage
          works best when the SELLER hasn&rsquo;t priced it in. Brokers and
          well-listed parcels usually have the timber priced in already.
        </li>
        <li>
          <strong>Off-market deals are the unlock.</strong> The big timber
          discounts come from absentee owners who haven&rsquo;t walked the
          property in twenty years. The direct mail campaign already in
          our plan is exactly the right tool. Listings with pre-cruised
          inventory rarely beat fair market.
        </li>
        <li>
          <strong>Tax treatment matters.</strong> Timber held over a year
          is generally capital gains under Section 631(b), not ordinary
          income. Talk to a CPA before the sale, not after. The Trust + LLC
          structure on the <a href="/generational-wealth/legal-structure">Legal Structure</a>{" "}
          page applies here too.
        </li>
      </ul>

      <h2>Three Adds to Due Diligence</h2>

      <p>
        For any candidate parcel over 20 acres, we add these three steps to
        the existing{" "}
        <a href="/generational-wealth/due-diligence">Due Diligence</a>{" "}
        checklist:
      </p>

      <ol className="gw-list">
        <li>
          <strong>Pull aerial canopy imagery before the offer.</strong>{" "}
          Free via county GIS or Google Earth historical view. Confirms
          density and species roughly. Five minutes of work, identifies the
          tracts worth a real cruise.
        </li>
        <li>
          <strong>Schedule a forester cruise inside the contingency window.</strong>{" "}
          Standard contracts include a 10 to 14 day inspection period. The
          cruise fits inside that window. If we can&rsquo;t get a cruise
          arranged that fast, extend the contingency or walk.
        </li>
        <li>
          <strong>Verify timber rights convey in the title commitment.</strong>{" "}
          Every title commitment lists the conveyances and exceptions.
          Specifically check that &ldquo;all timber rights&rdquo; come with
          the land. If the title commitment shows a separate timber
          conveyance from a prior owner, walk.
        </li>
      </ol>

      <h2>What This Changes for Our Plan</h2>

      <p>
        Two practical shifts:
      </p>

      <p>
        First, our 25-acre target stays, but the budget assumption gets
        re-baselined. Instead of $67,500 gone forever to land, we plan for
        a net land cost between zero and $30,000 depending on the cruise.
        The cash that was earmarked for land becomes either a buffer for
        the build or a deposit toward a larger tract.
      </p>

      <p>
        Second, the search criteria change. We were already targeting SE
        Oklahoma and Deep East Texas for the homestead biome. Now we add
        a timber-cruise filter to the same target counties. Heavily
        wooded tracts, absentee owners, and parcels over 20 acres jump to
        the top of the list. Cleared pasture parcels drop. Same regions,
        different parcels.
      </p>

      <CalloutBox type="family-note">
        We&rsquo;re not chasing a different state or a different vision. The
        homestead is still the homestead. We&rsquo;re just buying the land
        the smart way: looking past the dirt and recognizing what&rsquo;s
        standing on it.
      </CalloutBox>
    </GWLayout>
  );
}
