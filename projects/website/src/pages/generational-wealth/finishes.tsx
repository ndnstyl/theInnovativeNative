import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";

export default function FinishesPage() {
  return (
    <GWLayout
      title="Finishes: What We Spend Where"
      lastVerified="April 2026"
      readingTime="8 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-finishes.jpg"
        imageAlt="Interior finishes - flooring, cabinets, paint"
      />
      <h1>Finishes: What We Spend Where</h1>

      <p className="gw-lead">
        Once the structure is dried in and the systems are roughed,
        finishes is where the budget lives or dies. The same 1,200
        square foot floor plan can run $25K in finishes (bargain DIY) or
        $80K (custom contractor). Most of the swing is choices, not
        construction. This page is the framework for making those
        choices early so the design and budget agree.
      </p>

      <p>
        Related pages:{" "}
        <a href="/generational-wealth/financing">Financing</a>,{" "}
        <a href="/generational-wealth/building">Building Overview</a>,{" "}
        <a href="/generational-wealth/general-contracting">Being Your Own GC</a>.
      </p>

      <h2>Three Finish Levels</h2>

      <ComparisonTable
        headers={["Level", "What it looks like", "Total finish cost (1,200 sq ft)"]}
        rows={[
          ["Bargain DIY", "Stock cabinets, vinyl plank, laminate counters, basic fixtures, owner-installed everything", "$15,000 to $25,000"],
          ["Combination (our plan)", "Mid-grade DIY install of upgraded materials. Mix of bargain and custom by room", "$25,000 to $45,000"],
          ["Custom contractor", "Professional installer, premium materials throughout, designer-selected", "$60,000 to $120,000"],
        ]}
      />

      <p>
        Bargain DIY is livable and clean. Custom is magazine-perfect and
        expensive. Combination is what we actually plan for: spend on
        the things that matter every day, save on the things we use less
        often or can upgrade later.
      </p>

      <h2>The Decision Framework</h2>

      <p>
        We rank finishes by daily contact and difficulty-to-replace.
        Things we touch every day and that are hard to replace get the
        budget. Things we rarely use or can swap easily get the savings.
      </p>

      <ComparisonTable
        headers={["Item", "Daily contact?", "Hard to replace?", "Spend level"]}
        rows={[
          ["Kitchen counters", "Yes (every meal)", "Yes (plumbing, demolition)", "Mid to upper"],
          ["Kitchen cabinets", "Yes", "Yes", "Mid"],
          ["Bathroom vanity", "Yes", "Easy (4 hours, $200 vanity)", "Bargain"],
          ["Floor in living area", "Yes", "Hard (everything has to come out)", "Mid to upper"],
          ["Floor in bedrooms", "Yes (but bare feet, less wear)", "Moderate", "Mid"],
          ["Floor in laundry/utility", "Sometimes", "Easy (small footprint)", "Bargain"],
          ["Interior doors", "Daily", "Easy (hinges)", "Bargain"],
          ["Door hardware", "Daily (hands)", "Easy (screwdriver)", "Mid"],
          ["Light fixtures", "Daily (eyes)", "Easy (15 minutes each)", "Bargain initially, upgrade later"],
          ["Plumbing fixtures (faucets, shower head)", "Daily", "Easy (1 hour each)", "Bargain initially"],
          ["Trim and baseboards", "Visual every day", "Hard (caulk, paint, fit)", "Mid"],
          ["Paint", "Visual every day", "Easy (a weekend)", "Bargain"],
          ["Tile in showers", "Daily", "Very hard (waterproofing, demolition)", "Mid to upper"],
          ["Closet shelving", "Daily", "Easy", "Bargain (wire shelving)"],
        ]}
      />

      <h2>Material Cost Per Item (Mid-Grade DIY Install)</h2>

      <ComparisonTable
        headers={["Item", "Material cost", "Notes"]}
        rows={[
          ["Flooring (vinyl plank, 1,200 sq ft)", "$2,400 to $4,800", "$2 to $4/sq ft, DIY install. Click-lock plank is the move"],
          ["Kitchen cabinets (mid-grade, 25 linear ft)", "$5,000 to $10,000", "Stock RTA + soft-close. Home Depot, IKEA, Cabinets To Go"],
          ["Kitchen countertop (quartz mid-grade, 30 sq ft)", "$1,800 to $3,000", "$60-100/sq ft installed. Worth the premium over laminate at the kitchen"],
          ["Backsplash (subway tile, 30 sq ft)", "$200 to $500", "DIY install, inexpensive, durable look"],
          ["Bathroom vanity + fixtures (2 baths)", "$800 to $1,500", "Stock vanities $300-600 each, fixtures $200-400 each"],
          ["Shower tile + waterproofing (1 walk-in)", "$1,500 to $3,000", "DIY tile install, professional waterproofing membrane"],
          ["Toilets (2)", "$300 to $600", "Mid-grade, $150-300 each. Easy DIY install"],
          ["Interior doors (8 doors + hardware)", "$1,200 to $2,400", "Solid-core doors, mid-grade lever hardware"],
          ["Trim package (baseboard + casing)", "$1,000 to $2,000", "Mike installs. Material is cheap, labor is the cost when hired"],
          ["Paint (interior, 2 coats)", "$600 to $1,200", "DIY. 12-15 gallons primer + paint"],
          ["Lighting (recessed + fixtures)", "$1,000 to $2,500", "Bargain LED throughout, accent fixtures in living/dining"],
          ["Appliances (kitchen)", "$3,000 to $6,000", "Mid-grade range, fridge, dishwasher, microwave"],
          ["Washer/dryer", "$1,200 to $2,000", "Mid-grade, full-size"],
          ["HVAC trim, registers, returns", "$300 to $600", "Vents and grilles only; the system is in Cooling page"],
        ]}
      />

      <p>
        <strong>Estimated total finish budget (combination level):</strong>{" "}
        $20,000 to $40,000 in materials. Mike&rsquo;s labor is sweat
        equity. If we hired all the install work, add $20,000 to $40,000
        more in labor. So: combination DIY = $20K-$40K. Combination
        contractor = $40K-$80K. Most of the labor savings come from
        flooring, paint, trim, and cabinet install.
      </p>

      <h2>What We Defer to Later</h2>

      <p>
        Finishes that are easy to upgrade later are the right place to
        save now. We move in with bargain versions and upgrade as the
        budget allows over years 2 to 5.
      </p>

      <ul className="gw-list">
        <li>
          <strong>Light fixtures:</strong> live with $20 fixtures Year 1.
          Replace with $200 fixtures Year 3 when we know which rooms
          we&rsquo;re in most.
        </li>
        <li>
          <strong>Plumbing fixtures (faucets, shower heads):</strong>{" "}
          $30 fixtures Year 1. Upgrade when one breaks or annoys us
          enough to replace.
        </li>
        <li>
          <strong>Cabinet hardware:</strong> stock pulls Year 1, upgrade
          to brushed brass or matte black later.
        </li>
        <li>
          <strong>Backsplash:</strong> live with paint behind the stove
          Year 1, tile it Year 2 once we know the layout.
        </li>
        <li>
          <strong>Window treatments:</strong> blinds and curtains Year 1,
          custom shades or shutters whenever.
        </li>
      </ul>

      <h2>What We Refuse to Cheap Out On</h2>

      <ul className="gw-list">
        <li>
          <strong>Insulation:</strong> covered separately on{" "}
          <a href="/generational-wealth/building#envelope">Building &gt; The Envelope</a>.
          Once the drywall goes up, the only way to add insulation is
          to demo. We do not cheap out here.
        </li>
        <li>
          <strong>Plumbing supply lines:</strong> PEX-A is the standard.
          Cheaper PEX-B is fine in some applications but not for a build
          that&rsquo;s expected to last 50 years. Worth the upgrade.
        </li>
        <li>
          <strong>Electrical wiring:</strong> we run #12 copper for all
          15A and 20A circuits, even where #14 is technically allowed.
          Future-proofs against load growth and is required by some
          jurisdictions anyway.
        </li>
        <li>
          <strong>Subfloor:</strong> 3/4 inch tongue-and-groove plywood,
          glued and screwed. The cheap option is OSB. The premium option
          (which we DO take here) is what doesn&rsquo;t squeak in 20 years.
        </li>
        <li>
          <strong>Roof flashing and underlayment:</strong> the membrane
          beneath the metal panels. Failing here means water in the
          house. Spend the extra $500.
        </li>
      </ul>

      <h2>The Decision-Order Rule</h2>

      <CalloutBox type="heads-up" title="Pick the finish level before designing">
        If we tell the designer &ldquo;custom kitchen,&rdquo; the layout
        gets bigger and the cabinet runs longer. If we say
        &ldquo;mid-grade combination kitchen,&rdquo; the layout is more
        modest and the budget holds. Designer, contractor, and budget
        all need the same finish target before sketching starts.
      </CalloutBox>

      <h2>Tools We Buy vs Rent for Finish Work</h2>

      <p>
        Most finish work is hand tools. The big-ticket items are worth
        owning if we&rsquo;ll use them more than 3 to 5 days, otherwise
        rent.
      </p>

      <ComparisonTable
        headers={["Tool", "Buy or rent?", "Cost"]}
        rows={[
          ["Compound miter saw", "Buy", "$300 to $500"],
          ["Table saw (jobsite)", "Buy", "$400 to $600"],
          ["Cordless drill + impact driver kit", "Buy", "$300 to $450"],
          ["Tile saw (wet)", "Rent", "$60/day"],
          ["Floor nailer", "Rent", "$40/day"],
          ["Pneumatic finish nailer + brad nailer", "Buy", "$200 each"],
          ["Levels (2 ft, 4 ft, 8 ft)", "Buy", "$150 set"],
          ["Drywall lift", "Rent", "$50/day"],
          ["Paint sprayer", "Buy or rent", "$300 to buy / $80/day"],
          ["Stud finder, oscillating multitool, jigsaw, sander", "Buy", "$150 each tier"],
        ]}
      />

      <p>
        <strong>Tool budget for the finish phase:</strong> $2,000 to
        $3,500 in purchased tools, $500 to $1,000 in rentals. After the
        build, we own $2,000+ of tools that pay back on every future
        project (compound expansion, repairs, improvements).
      </p>
    </GWLayout>
  );
}
