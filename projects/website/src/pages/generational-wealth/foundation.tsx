import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";

export default function FoundationPage() {
  return (
    <GWLayout
      title="Foundation: What Goes Under the Columns"
      lastVerified="April 2026"
      readingTime="9 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-foundation.jpg"
        imageAlt="Concrete piers being poured for post-frame foundation"
      />
      <h1>Foundation: What Goes Under the Columns</h1>

      <p className="gw-lead">
        The foundation is the single most consequential decision in a
        post-frame build. Get it wrong and the house rots from the bottom up.
        Get it right once and it lasts longer than we will. This page
        decides which system goes under our wood columns and what we
        actually have to spend.
      </p>

      <p>
        Related pages:{" "}
        <a href="/generational-wealth/building">Building Overview</a>,{" "}
        <a href="/generational-wealth/permits">Permits</a>,{" "}
        <a href="/generational-wealth/storm-shelter">Storm Shelter</a>.
      </p>

      <h2>The Core Decision: Wood in the Ground vs. Wood Above the Ground</h2>

      <p>
        Old-school post-frame buildings buried treated wood columns directly
        in the ground. They lasted thirty to forty years, then the wood
        started rotting at the soil line. Modern post-frame puts concrete
        in the ground and keeps the wood above grade. Two ways to do that:
      </p>

      <ol className="gw-list">
        <li>
          <strong>Buy precast concrete columns (Perma-Column).</strong>{" "}
          Factory-made concrete piers shipped to the site, dropped into a
          hole, backfilled. Wood column bolts to a steel bracket on top.
        </li>
        <li>
          <strong>Pour our own piers and embed steel brackets while the
          concrete is wet (DIY wet-set).</strong> Standard ready-mix
          concrete in dug holes. Steel bracket pressed in while pouring.
          Cure, then bolt the wood column on top.
        </li>
      </ol>

      <p>
        Both put concrete in the ground, both put wood above grade, both
        are code-approved, both come from the same parent company. The
        decision comes down to cost, time, and how much DIY concrete work
        we want to do.
      </p>

      <h2>Option 1: Perma-Column (Precast)</h2>

      <p>
        Perma-Column is a precast concrete pier with a steel bracket
        molded into the top. They come in models sized to the wood column
        we&rsquo;re using.
      </p>

      <ComparisonTable
        headers={["Model", "Pairs with", "Bracket height", "Weight"]}
        rows={[
          ["PC4600", "4x6 wood post", "13\"", "135 lbs"],
          ["PC6600", "6x6 wood post", "13\"", "196 lbs"],
          ["PC8400", "4-ply 2x8 laminated", "18\"", "290 lbs"],
          ["PC8500", "5-ply 2x8 laminated", "18\"", "345 lbs"],
        ]}
      />

      <p>
        The concrete itself is rated 10,000 PSI. That&rsquo;s about three
        times the strength of standard residential concrete (3,000 to 4,000
        PSI). Polymer fiber reinforcement, freeze-thaw additives,
        corrosion inhibitors. ICC-ES certified for the 2015 to 2018
        IBC/IRC. Lifetime limited warranty.
      </p>

      <p>
        <strong>Cost:</strong> roughly $200 to $360 per column, depending
        on model and freight. For a 30x40 building with about 14 columns,
        that&rsquo;s $2,800 to $5,000 in concrete piers alone.
      </p>

      <h2>Option 2: DIY Wet-Set Brackets (Sturdi-Wall Plus)</h2>

      <p>
        Sturdi-Wall Plus is the bracket-only version, made by the same
        parent company as Perma-Column. We pour our own concrete piers
        with standard 4,000 PSI ready-mix and embed the steel bracket
        while the concrete is still wet. Wood column bolts to the bracket
        after the concrete cures.
      </p>

      <ComparisonTable
        headers={["Model", "Pairs with", "Price (Midwest PC)", "Notes"]}
        rows={[
          ["SWP63", "3-ply 2x6", "$77", "Smaller spans"],
          ["SWP64", "4-ply 2x6", "$98", "Standard 2x6 laminated"],
          ["SWP66", "6x6 solid post", "$80", "Solid post option"],
          ["SWP84", "4-ply 2x8", "$136 to $173", "Most common for our size"],
        ]}
      />

      <p>
        ICC-ES certified under report ESR-4239 (April 2020). Same code
        acceptance as Perma-Column. Same engineering pedigree. The only
        difference is we pour the concrete instead of buying it precast.
      </p>

      <p>
        <strong>Cost per column:</strong> $77 to $173 for the bracket
        plus roughly $50 to $100 for the concrete (bagged or ready-mix
        delivered) plus minimal rebar. Total per pier: $125 to $250.
        For 14 columns, that&rsquo;s $1,750 to $3,500.
      </p>

      <CalloutBox type="heads-up" title="The 10,000 PSI confusion">
        We may hear &ldquo;wet-set requires 10,000 PSI concrete.&rdquo;
        That&rsquo;s the precast Perma-Column spec, not a wet-set
        requirement. Standard ready-mix at 4,000 PSI is what the
        Sturdi-Wall Plus bracket is engineered for. We don&rsquo;t need
        specialty concrete to DIY this.
      </CalloutBox>

      <h2>The Honest Comparison</h2>

      <ComparisonTable
        headers={["Factor", "Perma-Column", "DIY Wet-Set"]}
        rows={[
          ["Cost per column", "$200 to $360", "$125 to $250"],
          ["Total for 14 columns", "$2,800 to $5,000", "$1,750 to $3,500"],
          ["Concrete strength", "10,000 PSI factory precast", "4,000 PSI standard ready-mix"],
          ["DIY skill needed", "Low (set in hole, backfill)", "Moderate (concrete pour, alignment, plumb while wet)"],
          ["Cure delay before next step", "None (precast is ready)", "7 days minimum, 30 days for max load"],
          ["Time per pier", "2 to 4 hours", "4 to 6 hours plus cure wait"],
          ["Code acceptance", "ICC-ES certified", "ICC-ES certified (ESR-4239)"],
          ["Engineer stamp ease", "Easiest (system has its own report)", "Standard (PE references the bracket cert)"],
          ["50-year durability", "Excellent (factory-controlled cure)", "Good (depends on our pour quality)"],
        ]}
      />

      <h2>Our Plan</h2>

      <p>
        We&rsquo;re going hybrid. Perma-Column on the four corner posts
        and the two highest-uplift perimeter posts. DIY wet-set on
        everything else. The corners take the most lateral load and any
        wind concentration; the precast removes the variable of our
        concrete pour quality where it matters most. Interior posts and
        non-corner perimeter posts get the wet-set treatment because the
        loads are lower and a normal pour easily handles them.
      </p>

      <p>
        <strong>Estimated cost:</strong> 6 Perma-Columns at roughly $280
        each is $1,680. 8 DIY wet-set piers at roughly $200 each is
        $1,600. Plus rebar, anchor bolts, and miscellaneous hardware,
        call it $400. <strong>Total foundation budget: about $3,700</strong>{" "}
        for a 14-pier 30x40 footprint. That fits inside the build budget
        comfortably.
      </p>

      <h2>Soil Testing: The One Thing That Changes Everything</h2>

      <p>
        Pier depth and pier diameter both depend on soil bearing capacity.
        Strong soil takes a smaller, shallower pier. Weak soil takes a
        larger, deeper pier. Guessing wrong either over-builds (waste of
        money) or under-builds (settling, structural damage). A soil test
        is $400 to $800 and resolves the question.
      </p>

      <h3>Free first pass: SSURGO soil database</h3>

      <p>
        The USDA Soil Survey Geographic database (SSURGO) is free and
        online. Pull up the property by GPS coordinates and read the
        soil class. Most of our SE Oklahoma target counties show as
        Class 4 or Class 5 soils (medium clay loam). That&rsquo;s
        decent bearing but not exceptional, which is why our default
        pier depth is 48 inches.
      </p>

      <h3>Paid second pass: site-specific soil test</h3>

      <p>
        After we close on land, we pay a local geotechnical firm $400 to
        $800 for a site test on the actual building footprint. Two or
        three test holes drilled to 6 to 8 feet, sample the soil at
        each foot, lab-test the bearing capacity. Results take about a
        week. The PE uses that report to size piers definitively.
      </p>

      <h3>Pier depth math, given the soil class</h3>

      <ComparisonTable
        headers={["Soil class", "Soil type", "Typical pier depth", "Typical hole diameter"]}
        rows={[
          ["Class 1-2", "Sandy gravel, dense sand", "36 inches", "16 inches"],
          ["Class 3", "Sandy loam", "36 to 42 inches", "18 inches"],
          ["Class 4", "Medium clay loam", "42 to 48 inches", "20 to 24 inches"],
          ["Class 5", "Soft clay", "48 inches plus footing pad", "24 inches"],
        ]}
      />

      <p>
        These are starter values. The PE produces the real numbers based
        on the soil test, the truss reactions, and the wind/snow loads.
        But they show why one extra foot of depth on 14 piers is roughly
        14 cubic feet of extra concrete, or about $200 to $400 in
        material plus an extra hour per pier of digging.
      </p>

      <h2>What the Engineer Needs From Us</h2>

      <p>
        Before the PE stamps the foundation plan, we hand them rough load
        numbers so they can size the piers correctly. Per column on a
        1,200 sq ft 30x40 post-frame in eastern Oklahoma:
      </p>

      <ul className="gw-list">
        <li>
          <strong>Axial (downward) load:</strong> 4,000 to 5,000 lbs on
          interior columns. 2,000 to 3,500 lbs on perimeter columns.
        </li>
        <li>
          <strong>Wind uplift:</strong> 1,000 to 2,500 lbs on perimeter
          columns. Minimal on interior.
        </li>
        <li>
          <strong>Frost depth:</strong> Eastern Oklahoma is 18 to 20
          inches officially. Post-frame piers go 36 to 48 inches anyway
          for lateral stability. We dig 48 inches.
        </li>
        <li>
          <strong>Soil bearing:</strong> Class 4 or 5 in our target
          counties. Site-specific soil test confirms before final
          pier sizing.
        </li>
      </ul>

      <p>
        These are starter numbers. The PE produces the real values from
        the actual truss reactions, snow loads, wind exposure category,
        and our specific soil. Do not size piers from this list alone.
      </p>

      <CalloutBox type="family-note" title="Why this section is so long">
        Most barndominium build guides skip the foundation in three
        sentences. That&rsquo;s how houses end up with rotting columns at
        year forty. The foundation is the part of the build that
        absolutely cannot be redone after the walls go up. Spend the time
        here. Save the regret later.
      </CalloutBox>
    </GWLayout>
  );
}
