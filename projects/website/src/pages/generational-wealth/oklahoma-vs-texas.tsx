import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";
import { T } from "@/components/generational-wealth/TooltipTerm";

export default function OklahomaVsTexasPage() {
  return (
    <GWLayout
      title="Oklahoma vs Texas — Which State Fits Better"
      lastVerified="April 2026"
      readingTime="10 min"
    >
      <PageCover imageSrc="/images/generational-wealth/cover-ok-vs-tx.jpg" imageAlt="Oklahoma and Texas rural landscapes" />
      <h1>Oklahoma vs Texas — Which State Fits Better</h1>

      <p className="gw-lead">
        We&rsquo;re looking at both states seriously. Oklahoma is the primary
        target &mdash; cheaper land, simpler water rights, easier permits. Texas
        is Plan B with its own advantages. Here&rsquo;s the honest side-by-side.
      </p>

      <h2>The Big Comparison</h2>

      <ComparisonTable
        headers={["Factor", "Oklahoma", "Texas", "Edge"]}
        rows={[
          ["Land $/acre (target counties)", "$2,000–$2,600", "$3,000–$5,000", "OK"],
          ["Rainfall (east region)", "48–55 inches/yr", "45–52 inches/yr", "OK"],
          ["Well permits", "Domestic exemption — no permit", "Rule of capture + GCDs may regulate", "OK"],
          ["Building permits (rural)", "Many counties: zero enforcement", "County-variable", "OK"],
          ["Ag exemption entry", "File OTC 994, straightforward", "Need 5-yr ag history or buy existing", "OK"],
          ["Ag exemption exit penalty", "Minimal", "5-yr rollback tax — painful", "TX risk"],
          ["State income tax", "Yes (0.25–4.75%)", "None", "TX"],
          ["Sales tax", "4.5% state", "6.25% state", "OK"],
          ["Homestead exemption", "1 acre rural", "200 acres rural", "TX"],
          ["Property tax rate", "~1% with ag: 0.2–0.4%", "Higher base, but ag reduces", "Tie"],
          ["Tornado risk", "High (east OK)", "High (north TX)", "Tie"],
          ["Tilapia hobby legality", "ODAFF license required", "Recirc hobby exempt", "TX"],
        ]}
      />

      <h2>Why Oklahoma Is Primary</h2>

      <p>
        Eastern Oklahoma checks the most boxes for what we need: cheap land with
        good rainfall, simple water rights, and counties that mostly leave you
        alone when you&rsquo;re building on your own rural property.
      </p>

      <h3>Target Counties</h3>

      <ComparisonTable
        headers={["County", "Land $/ac", "Rainfall", "Why It's On the List"]}
        rows={[
          ["Latimer", "$2,000–$2,400", "50\"", "Pine country, lots of timber sales, Wilburton"],
          ["Haskell", "$2,200–$2,600", "50\"", "Stigler base, good mix pasture + timber"],
          ["Le Flore", "$2,400–$2,900", "52\"", "Kiamichi foothills, Poteau regional hub"],
          ["Pushmataha", "$1,800–$2,400", "52\"", "Remote, cheap, Kiamichi mountains"],
          ["McCurtain", "$2,200–$3,200", "55\"", "Wettest in OK, SE corner"],
        ]}
      />

      <h3>Why Texas Is Plan B</h3>

      <ComparisonTable
        headers={["County", "Land $/ac", "Rainfall", "Why It's On the List"]}
        rows={[
          ["Cherokee", "$3,000–$4,500", "48\"", "Piney woods, affordable for TX"],
          ["Anderson", "$3,500–$5,000", "45\"", "Palestine area, more developed"],
          ["Red River", "$3,000–$4,500", "48\"", "Close to OK border"],
        ]}
      />

      <p>
        Texas wins on no state income tax and the massive 200-acre homestead
        exemption. But the land costs 50&ndash;100% more per acre, and the ag
        exemption has a 5-year rollback trap that can cost thousands if you
        change land use.
      </p>

      <h2>Water Rights — The Biggest Difference</h2>

      <CalloutBox type="family-note">
        Water rights are one of the most important things to understand when
        buying rural land. The rules are completely different between these two
        states, and they affect what you can do with your well.
      </CalloutBox>

      <ExpandableSection title="Oklahoma — Domestic Exemption (Simpler)">
        <p>
          Oklahoma gives landowners a <T>Domestic Exemption</T> for well water.
          If you&rsquo;re using the water for your household, your livestock,
          and up to 3 acres of irrigation &mdash; you don&rsquo;t need any
          permit. Just drill the well and use it. This covers everything a
          homestead needs. The Oklahoma Water Resources Board (<T>OWRB</T>)
          manages water rights, but the domestic exemption keeps most homesteaders
          out of the permit process entirely.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Texas — Rule of Capture + GCDs (More Complex)">
        <p>
          Texas uses the &ldquo;Rule of Capture&rdquo; &mdash; you own whatever
          you pump from under your land. Sounds simple, but then there are
          Groundwater Conservation Districts (<T>GCD</T>s) that can limit how
          much you pump, require well registration, set spacing rules, and cap
          production. Most east Texas counties ARE in a GCD. Before buying land
          in Texas, check whether the county has a GCD and what their rules are.
          This is one more layer of homework that Oklahoma doesn&rsquo;t require.
        </p>
      </ExpandableSection>

      <h2>Mineral Rights — Both States</h2>

      <p>
        In both Oklahoma and Texas, <T>Mineral Rights</T> are commonly separated
        (&ldquo;severed&rdquo;) from surface rights. This means someone else
        might own what&rsquo;s under your land &mdash; oil, gas, minerals. And
        if they do, they have the legal right to access the surface to extract it.
      </p>

      <CalloutBox type="heads-up">
        Always check the mineral status before buying. If minerals are severed
        AND there&rsquo;s an active oil/gas lease within a mile &mdash; that&rsquo;s
        a walk-away. A drill pad on your homestead destroys the entire plan.
        Seminole County in Oklahoma is especially heavy O&amp;G country. Eastern
        OK counties (our target) have less activity but still check every parcel.
      </CalloutBox>

      <h2>Ag Exemption — The Rollback Trap</h2>

      <ExpandableSection title="Oklahoma Ag Exemption — Straightforward">
        <p>
          File Form OTC 994 with the county assessor. Show agricultural use
          (livestock, crops, wildlife management). The exemption reduces your
          assessed value by 40&ndash;60%, which directly lowers your property
          tax. If you stop ag use, the exemption just ends &mdash; no penalty,
          no rollback. Clean.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Texas Ag Exemption — 5-Year Rollback Risk">
        <p>
          Texas requires 5 years of continuous agricultural use before the
          exemption kicks in. If you buy land that already has the exemption,
          you can continue it &mdash; but if you convert the land to non-ag use,
          you owe 5 years of back taxes at the difference between ag-assessed
          and market-assessed values. This &ldquo;rollback tax&rdquo; can be
          $5,000&ndash;$50,000+ depending on property value. Non-negotiable
          pain.
        </p>
        <p>
          <strong>Rule</strong>: In Texas, always buy land that ALREADY has the ag
          exemption, and maintain ag use from Day 1 to avoid the rollback.
        </p>
      </ExpandableSection>

      <h2>Real Estate Transaction Differences</h2>

      <p>
        If you&rsquo;re coming from California, Nevada, or another state,
        Oklahoma and Texas real estate will feel different:
      </p>

      <ComparisonTable
        headers={["Practice", "OK/TX", "CA/NV"]}
        rows={[
          ["Closing agent", "Title company does everything", "Separate escrow + title companies"],
          ["Disclosure requirements", "Thin — caveat emptor culture", "Heavy — statutory disclosures"],
          ["Earnest money", "$500–$2,000 typical", "1–3% of price"],
          ["Inspection period", "10 days standard", "17–21 days"],
          ["Contract length", "1–4 pages", "14–30+ pages"],
          ["Owner financing", "Normal, especially rural", "Rare"],
          ["Mineral rights", "Commonly severed — must check", "Almost never severed"],
          ["Septic", "Universal rural", "Rare (municipal sewer)"],
        ]}
      />

      <CalloutBox type="pro-tip">
        Don&rsquo;t lead with &ldquo;I&rsquo;m from California.&rdquo; In some
        rural markets, that triggers a 10&ndash;20% upcharge. Lead with what
        you&rsquo;re going to do with the land. Trust and handshake matter in
        rural OK &mdash; casual confidence beats enthusiasm.
      </CalloutBox>

      <h2>Our Recommendation</h2>

      <p>
        <strong>Primary: Eastern Oklahoma.</strong> Cheaper land, simpler water
        rights, no ag rollback trap, relaxed building codes, and the domestic
        well exemption makes everything easier. Latimer and Haskell counties
        are the sweet spot.
      </p>
      <p>
        <strong>Plan B: East Texas.</strong> If a specific opportunity surfaces —
        especially land with existing improvements and an active ag exemption.
        No state income tax is a real long-term benefit. But higher land costs
        and the ag rollback risk make it the backup, not the default.
      </p>
    </GWLayout>
  );
}
