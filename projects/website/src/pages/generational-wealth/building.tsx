import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";
import StepProcess from "@/components/generational-wealth/StepProcess";
import YouTubeEmbed from "@/components/generational-wealth/YouTubeEmbed";

const buildSteps = [
  {
    number: 1,
    title: "Foundation piers",
    description:
      "We drill concrete piers with a tractor-mounted auger, one at each column location. Post-frame buildings sit on piers instead of a full concrete slab, which is cheaper and still structural. Mike does this himself with rental equipment. The piers go in before anything else.",
  },
  {
    number: 2,
    title: "Kit delivery",
    description:
      "The post-frame kit &mdash; columns, trusses, purlins, metal panels, hardware &mdash; arrives on a flatbed. We&rsquo;ll have a staging area cleared and level for delivery. This is the day the build starts to feel real.",
  },
  {
    number: 3,
    title: "Columns and trusses set",
    description:
      "The structural columns go in first, set into or onto the piers. Then the roof trusses get lifted and fastened. This is the one day we hire a small crew of 4 people for safety &mdash; trusses are heavy and the risk of a collapse during setting is real. One day, about $3,000.",
  },
  {
    number: 4,
    title: "Metal roof panels",
    description:
      "Once trusses are in, the metal roof goes on. This gets us &ldquo;dried in&rdquo; &mdash; meaning the structure is protected from rain. Dry-in is the milestone that unlocks the rest of the interior work. Mike does the roof panels himself with one helper.",
  },
  {
    number: 5,
    title: "Windows and exterior doors",
    description:
      "Rough openings are framed and windows and doors go in. Every window gets sealed with ZIP System tape around the rough opening. Airtight at this stage means comfortable and efficient for the next 40 years.",
  },
  {
    number: 6,
    title: "Spray foam insulation",
    description:
      "This is the one envelope step we contract. Closed-cell spray foam (CCSF) requires a commercial rig and a certified installer. We get 4 inches in the walls (R-28) and 6 inches in the roof (R-42). No fiberglass mixed in &mdash; ever. One insulation type per cavity.",
  },
  {
    number: 7,
    title: "Rough mechanical, electrical, and plumbing",
    description:
      "MEP stands for mechanical, electrical, and plumbing. All rough wiring, PEX water lines, and drain lines go in before any walls are closed up. Mike runs all of this himself. The main service tie-in and solar grid inspection are contracted at the end.",
  },
  {
    number: 8,
    title: "Interior finish",
    description:
      "Drywall, flooring, cabinets, fixtures, paint. This phase takes the longest and is the most flexible &mdash; it can be done in stages as budget allows. The goal is livable by Year 1 Q4, not magazine-perfect.",
  },
];

export default function BuildingPage() {
  return (
    <GWLayout
      title="Building &mdash; The Barndominium Plan"
      lastVerified="April 2026"
      readingTime="10 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-building.jpg"
        imageAlt="Metal building frame under construction"
      />
      <h1>Building &mdash; The Barndominium Plan</h1>

      <p>
        The house is a barndominium. That word sounds like a trend, but the
        construction method behind it has been used in rural America for
        decades. Here&rsquo;s what it actually means and why it fits this plan.
      </p>

      <h2>What&rsquo;s a Barndominium?</h2>

      <p>
        A barndominium is a metal building shell with a finished residential
        interior. The outside looks like a barn or a shop &mdash; steel panels,
        metal roof, exposed structure. The inside looks like a house &mdash;
        drywall, hardwood floors, real bedrooms and a kitchen.
      </p>

      <p>
        The metal shell goes up faster and costs less than a traditional house
        frame. You can be dried in (weatherproof) in a few weeks instead of
        months. In rural Oklahoma and Texas, this is a completely normal way
        to build a permanent home.
      </p>

      <h2>Why Post-Frame?</h2>

      <p>
        There are three ways to build a barndominium: post-frame, steel frame,
        and stick frame. We&rsquo;re using post-frame, and here&rsquo;s why.
      </p>

      <ComparisonTable
        headers={["Type", "Cost", "DIY-Friendly", "Notes"]}
        rows={[
          ["Post-frame (our choice)", "Lowest", "Yes", "Wood columns, 8-foot spacing, open interior, owner-builder-friendly"],
          ["Steel frame (red iron)", "Middle", "No", "Commercial grade, hard to modify, requires specialized crews"],
          ["Stick frame with metal siding", "Highest", "Moderate", "Traditional framing with barn aesthetics, no real savings"],
        ]}
      />

      <p>
        Post-frame buildings sit on columns spaced 8 feet apart. The wide
        spacing means fewer pieces, fewer connections, and faster assembly.
        The interior starts completely open &mdash; you frame in the walls and
        rooms afterward, exactly how you want them.
      </p>

      <CalloutBox type="pro-tip">
        The savings from DIY are $65,000. That&rsquo;s what makes the whole
        plan fit inside $275K. Without the DIY labor commitment, this plan
        doesn&rsquo;t work. With it, you have a finished home and a $25,000
        contingency buffer.
      </CalloutBox>

      <h2>The Floor Plan We&rsquo;re Building Around</h2>

      <p>
        The plan we&rsquo;ve fallen in love with is <strong>Plan 1121-01</strong>
        {" "}from J&amp;E Renderings &mdash; a two-story barndominium with an
        industrial-modern exterior and an open floor plan inside.
      </p>

      <figure className="gw-figure">
        <img
          src="/images/generational-wealth/floorplan-1121-01.png"
          alt="First-floor layout of J&E Renderings Plan 1121-01 barndominium"
          className="gw-figure__image"
          loading="lazy"
        />
        <figcaption className="gw-figure__caption">
          First-floor layout, Plan 1121-01. Image courtesy of{" "}
          <a
            href="https://janderenderings.com/plans/ols/products/1121-01"
            target="_blank"
            rel="noopener noreferrer"
          >
            J&amp;E Renderings
          </a>
          {" "}&mdash; the source of the plan we&rsquo;re buying and adapting.
        </figcaption>
      </figure>

      <p>
        The 6-bedroom variant of this plan (1121-01-6B) runs <strong>4,928
        square feet</strong>, 6 bed / 4.5 bath. The base 1121-01 is smaller
        and what we&rsquo;re starting with. Open great room, large kitchen,
        second-story loft/bedrooms, and clear-span living space that
        post-frame construction handles beautifully.
      </p>

      <h3>Walkthrough Video</h3>

      <p>
        Here&rsquo;s the 3D walkthrough of the plan from J&amp;E Renderings so
        the family can see how it flows before we commit.
      </p>

      <YouTubeEmbed videoId="tkyEIALqSRo" title="Plan 1121-01 walkthrough — J&E Renderings" />

      <h2>Buying and Modifying the Plan</h2>

      <p>
        This is where we have to be careful and honest about what
        we&rsquo;re buying.
      </p>

      <p>
        J&amp;E Renderings is a <strong>rendering and design company, not a
        licensed architect or engineer</strong> &mdash; they say so directly
        on their site. That means when we purchase Plan 1121-01, what we
        receive is a drawing set (PDFs, possibly CAD files). It is{" "}
        <em>not</em> a permit-ready, stamped set of construction documents
        for Oklahoma. That&rsquo;s normal for stock plans at this price point
        &mdash; it&rsquo;s also the most important thing to know before
        buying.
      </p>

      <CalloutBox type="heads-up" title="What we still need after purchase">
        <ol className="gw-list">
          <li><strong>A licensed Oklahoma structural engineer</strong> to stamp the post-frame structural details, the roof penetration for the solar chimney, and the foundation plan.</li>
          <li><strong>A local designer or architect</strong> to modify the plan to incorporate our zero-energy cooling strategy (solar chimney location, earth-tube routing, ERV ducting). See the <a href="/generational-wealth/cooling">Cooling page</a> for the three paths and cost ranges.</li>
          <li><strong>Written permission from J&amp;E Renderings to modify the plan.</strong> Their terms state: &ldquo;All designs are protected by copyright law and may not be reproduced in any way without prior written approval.&rdquo; We have to email or call Ansley before any third party touches the drawings.</li>
        </ol>
      </CalloutBox>

      <h3>Questions to Ask J&amp;E Renderings Before Buying</h3>

      <p>
        Contact: <strong>Ansley</strong> at{" "}
        <a href="mailto:ansley@janderenderings.com">ansley@janderenderings.com</a>{" "}
        or <a href="tel:17705390938">770-539-0938</a>.
      </p>

      <ol className="gw-list">
        <li>What is the price of Plan 1121-01 and what files come with it (PDF only, CAD, electrical / HVAC schematics, foundation plan)?</li>
        <li>Is the license one-time use (one house built) or can we re-use it for a second family member&rsquo;s build on the compound later?</li>
        <li>Will you grant written permission for a licensed Oklahoma architect or engineer to modify the plan for passive cooling features (solar chimney, earth tubes) and our specific site?</li>
        <li>Do you provide engineer&rsquo;s stamps for Oklahoma permit submission, or is that our responsibility? (Expected answer: our responsibility.)</li>
        <li>Can you refer a designer or engineer you&rsquo;ve worked with who&rsquo;s familiar with your plans and can do the modification?</li>
      </ol>

      <h3>Our Modification Plan</h3>

      <p>
        Assuming J&amp;E approves modification, here&rsquo;s the realistic
        path we&rsquo;ll take:
      </p>

      <ul className="gw-list">
        <li><strong>Step 1:</strong> Buy Plan 1121-01 from J&amp;E. Expected cost: $500&ndash;$2,500 based on typical stock-plan pricing for this tier.</li>
        <li><strong>Step 2:</strong> Get written approval from J&amp;E to modify.</li>
        <li><strong>Step 3:</strong> Hire a local Oklahoma designer (first call: <a href="https://alldraft.com/passive-solar-design-in-barndominiums-harnessing-the-sun-for-comfort-and-efficiency/" target="_blank" rel="noopener noreferrer">Alldraft</a>) to integrate the solar chimney and earth tube routing into the plan. Expected scope: $2,000&ndash;$5,000.</li>
        <li><strong>Step 4:</strong> Hire a licensed Oklahoma PE to stamp the structural details, roof penetration, and foundation for Haskell County permit submission. Expected scope: $1,000&ndash;$3,500.</li>
      </ul>

      <p>
        <strong>Total path cost:</strong> $3,500 &ndash; $11,000 for
        permit-ready, zero-energy-cooling-integrated plans derived from
        Plan 1121-01. That&rsquo;s still cheaper than a full custom design
        ($5,000&ndash;$15,000) and gives us the layout we actually want.
      </p>

      <h2>Foundation: What Goes Under the Columns</h2>

      <p className="gw-lead">
        The foundation is the single most consequential decision in a
        post-frame build. Get it wrong and the house rots from the bottom up.
        Get it right once and it lasts longer than we will. This section
        decides which system goes under our wood columns and what we
        actually have to spend.
      </p>

      <h3>The Core Decision: Wood in the Ground vs. Wood Above the Ground</h3>

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

      <h3>Option 1: Perma-Column (Precast)</h3>

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

      <h3>Option 2: DIY Wet-Set Brackets (Sturdi-Wall Plus)</h3>

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

      <h3>The Honest Comparison</h3>

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

      <h3>Our Plan</h3>

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

      <h3>What the Engineer Needs From Us</h3>

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
          <strong>Soil bearing:</strong> Most of our target counties are
          Class 4 or 5 soil (medium clay loam). The PE confirms with a
          soil test before final pier sizing.
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

      <h2>Storm Shelter: Mandatory in Tornado Alley</h2>

      <p>
        Eastern Oklahoma is in the heart of tornado alley. We don&rsquo;t
        skip this. Some counties won&rsquo;t insure a residential build
        without a documented shelter plan, and any insurance company that
        does will charge a premium until one exists. More importantly,
        a 1,200 sq ft post-frame house is the wrong place to be in a
        tornado without a hardened space to retreat to.
      </p>

      <p>
        Four shelter types, ranked by what fits a 90% DIY build:
      </p>

      <ComparisonTable
        headers={["Type", "DIY-friendly?", "Materials cost", "Notes"]}
        rows={[
          ["Underground poured concrete", "Yes (with concrete delivery)", "$3,000 to $5,000", "Outside the home, accessed by stairs. Hardest to retrofit. Best to design in before site prep."],
          ["Reinforced concrete safe room (interior)", "Partial (concrete contractor pours, Mike finishes)", "$5,000 to $10,000", "Built into the slab during pour. Steel door, ventilation. Doubles as pantry or closet."],
          ["Above-ground prefab steel safe", "No (delivered + bolted in)", "$8,000 to $15,000 installed", "Bolted to a reinforced slab section. Fast install. Higher cost."],
          ["Buried prefab fiberglass/steel", "No (excavated + dropped in)", "$10,000 to $18,000 installed", "Outdoor, hatch entry. Excavator-required."],
        ]}
      />

      <h3>Our Pick</h3>

      <p>
        Reinforced concrete safe room, built into the slab during the
        pour. About 8 feet by 8 feet, designed by the PE alongside the
        foundation plan. Concrete contractor pours the walls and ceiling
        as part of the slab pour day, which is one of the few days we
        already hire help. Mike finishes the interior with a FEMA-rated
        steel door, ventilation, and shelving. Doubles as a pantry the
        rest of the year.
      </p>

      <p>
        <strong>Estimated cost:</strong> $6,000 to $8,000, sized into the
        budget under structure. We confirm FEMA P-320 specs with the PE
        before pour day.
      </p>

      <CalloutBox type="heads-up" title="Cannot retrofit easily">
        A safe room poured into the slab is straightforward. Adding one
        after the slab is set means cutting concrete, retrofitting walls,
        and probably code review for the modification. Plan it now or
        plan to do an above-ground prefab later.
      </CalloutBox>

      <h2>Builder&rsquo;s Risk and Contractor Insurance</h2>

      <p>
        We&rsquo;re acting as our own general contractor. That makes us
        the legally responsible party on the job site. If a hired
        sub-contractor gets hurt and they aren&rsquo;t carrying their own
        liability coverage, that liability lands on us personally. Two
        policies cover this gap.
      </p>

      <h3>Policy 1: Builder&rsquo;s Risk</h3>

      <p>
        A temporary insurance policy that covers the structure and
        materials during construction. Standard homeowner&rsquo;s
        insurance does not cover an unfinished house. Builder&rsquo;s
        risk fills that gap.
      </p>

      <ul className="gw-list">
        <li>
          <strong>What it covers:</strong> wind damage, hail, theft of
          materials on site, fire, vandalism. Some policies also cover
          worker injury on site if a sub is uninsured.
        </li>
        <li>
          <strong>When it starts:</strong> the day construction begins or
          the day materials are delivered to site, whichever comes first.
        </li>
        <li>
          <strong>When it ends:</strong> when the certificate of
          occupancy is issued and the homeowner&rsquo;s policy starts.
        </li>
        <li>
          <strong>Cost:</strong> roughly 1 to 4 percent of the total
          build value, prorated for the build duration. For a $272K
          build over 18 months, expect $1,500 to $4,000 total.
        </li>
        <li>
          <strong>Where to buy:</strong> regional carriers like
          Farm Bureau (Oklahoma), Country Financial, Shelter, Allstate,
          State Farm. Get three quotes. Confirm the policy covers
          post-frame metal-clad construction specifically.
        </li>
      </ul>

      <h3>Policy 2: Certificates of Insurance from every hired sub</h3>

      <p>
        Before any contractor steps on the property, we collect their
        Certificate of Insurance (COI). This single page proves they
        carry general liability and workers comp at adequate amounts.
        If they get hurt or damage the property, their policy pays.
        If they don&rsquo;t have a COI, our builder&rsquo;s risk and our
        own pockets pay.
      </p>

      <p>
        <strong>Required coverage minimums to confirm on the COI:</strong>
      </p>

      <ul className="gw-list">
        <li>General liability: $1,000,000 per occurrence, $2,000,000 aggregate</li>
        <li>Workers compensation: state statutory minimum (Oklahoma)</li>
        <li>Auto liability if they drive heavy equipment to site</li>
        <li>Policy active dates that cover the day they&rsquo;re on site</li>
      </ul>

      <h3>Subs we hire that need a COI on file before they arrive</h3>

      <ComparisonTable
        headers={["Hired sub", "Why we hire them", "COI required?"]}
        rows={[
          ["Truss-setting crew", "Safety on truss day", "Yes"],
          ["Concrete contractor (slab + safe room pour)", "Volume, timing", "Yes"],
          ["Septic installer (licensed)", "State requirement", "Yes"],
          ["Electric service tie-in (licensed)", "Code, utility company requirement", "Yes"],
          ["Solar grid-tie inspection (licensed)", "Utility company interconnect requirement", "Yes"],
          ["Spray foam contractor (if not DIY)", "Equipment, training", "Yes"],
          ["Site grading on the homesite pad", "Precision required", "Yes"],
          ["EQIP brush mulching contractor", "Heavy equipment", "Yes"],
        ]}
      />

      <CalloutBox type="heads-up" title="No COI, no work">
        We do not let anyone start work until their certificate is in our
        hands. Email is fine. We file them in a build folder. If a sub
        balks at providing one, that sub is uninsured. Hire someone else.
      </CalloutBox>

      <h2>Being Our Own General Contractor</h2>

      <p>
        Hiring a general contractor on a $272K build typically costs 10 to
        25 percent of the project value, or $27,000 to $68,000. That fee
        is the entire reason a 90% DIY build pencils out under our budget.
        We&rsquo;re saving the GC fee by doing the GC work ourselves. Worth
        understanding what that means.
      </p>

      <h3>What the GC role actually involves</h3>

      <ul className="gw-list">
        <li>
          <strong>Permitting:</strong> pulling the permits, posting them
          on site, scheduling required inspections at the right milestones.
        </li>
        <li>
          <strong>Sub-contractor coordination:</strong> calling subs,
          collecting bids, scheduling them in the correct sequence,
          rescheduling when one runs late and cascades into the next.
        </li>
        <li>
          <strong>Material delivery:</strong> ordering, receiving,
          checking against packing lists, staging on site, protecting
          from weather and theft.
        </li>
        <li>
          <strong>Safety:</strong> first aid kit, fire extinguisher,
          posting site rules, confirming subs follow them.
        </li>
        <li>
          <strong>Budget tracking:</strong> running ledger of paid vs
          remaining, change order management, contingency monitoring.
        </li>
        <li>
          <strong>Lender draws:</strong> if we&rsquo;re on a USDA
          construction loan, we coordinate the inspection-and-draw cycle
          (typically 3 to 5 draws over the build).
        </li>
        <li>
          <strong>Inspector contact:</strong> requesting county inspections
          when the build hits each milestone (foundation, framing,
          rough electrical, rough plumbing, final).
        </li>
      </ul>

      <h3>The time commitment</h3>

      <p>
        Realistic rule of thumb: 1 to 2 hours per day on phone calls,
        scheduling, errands, and inspector coordination during active
        construction. Plus the full days when subs are on site (we have to
        be present). A 10-hour build day might be 7 hours of Mike doing
        labor plus 3 hours of GC duties. We do not do both at full
        capacity simultaneously.
      </p>

      <h3>The build order is not negotiable</h3>

      <p>
        Each step has prerequisites. Skipping or reordering means redoing
        work or failing inspection.
      </p>

      <ol className="gw-list">
        <li>Site prep and pad grading (homesite acre only, contractor)</li>
        <li>Foundation pier drilling and concrete (DIY wet-set + Perma-Columns)</li>
        <li>Foundation inspection</li>
        <li>Slab pour with safe room walls (concrete contractor)</li>
        <li>Underground rough plumbing and electrical conduit before slab cures</li>
        <li>Kit delivery (post-frame columns, trusses, panels)</li>
        <li>Column raising and truss setting (one-day crew)</li>
        <li>Framing inspection</li>
        <li>Roof and metal panel install (DIY)</li>
        <li>Window and exterior door install (DIY)</li>
        <li>Rough plumbing supply lines (DIY)</li>
        <li>Rough electrical branch circuits (DIY) and main service tie-in (licensed contractor)</li>
        <li>Rough mechanical (HVAC ducting, ERV)</li>
        <li>Rough electrical and plumbing inspections</li>
        <li>Insulation install (CCSF contractor + DIY rigid + DIY radiant barrier)</li>
        <li>Insulation inspection</li>
        <li>Drywall install (DIY)</li>
        <li>Interior finishes: flooring, paint, trim, cabinets (DIY)</li>
        <li>Plumbing fixtures and electrical trim (DIY)</li>
        <li>Final inspection and Certificate of Occupancy</li>
      </ol>

      <CalloutBox type="pro-tip">
        We keep a build journal. Date, what happened, who was on site,
        what got inspected, what we paid. When the lender wants a draw
        package or the insurer wants documentation, the journal is the
        fastest way to assemble it. Photos every day, even if nothing
        looks new.
      </CalloutBox>

      <h2>Permits and the Building Department</h2>

      <p>
        Haskell County building department is the authority that says
        yes or no to our build. We talk to them BEFORE we hire the
        designer or the engineer. The first conversation establishes
        what they require, which determines what the designer and PE
        have to deliver.
      </p>

      <h3>Questions to ask the AHJ on the first call</h3>

      <ul className="gw-list">
        <li>
          Do you accept hand-drawn plans, CAD plans, or only stamped
          engineered plans for residential post-frame construction?
        </li>
        <li>
          For a 1,200 sq ft post-frame residential build, is a structural
          PE stamp required, and on which sheets?
        </li>
        <li>
          Do solar chimney roof penetrations and earth-tube wall
          penetrations require separate engineer review?
        </li>
        <li>
          What wind load zone applies? (Eastern Oklahoma is generally
          110 mph, but local amendments vary.)
        </li>
        <li>
          What is the minimum foundation depth required for residential
          post-frame piers in this county?
        </li>
        <li>
          What is your inspection schedule (foundation, framing, rough,
          insulation, final), and how much advance notice do you need
          for each?
        </li>
        <li>
          How long does a complete permit application typically take to
          approve? What rejects an application immediately?
        </li>
        <li>
          What is the permit fee structure for our build value?
        </li>
        <li>
          Is the permit issued in the name of the homeowner-as-GC or do
          you require a licensed general contractor on the application?
        </li>
        <li>
          How long is the permit valid once issued, and what triggers a
          re-inspection or re-approval?
        </li>
      </ul>

      <h3>Permit timeline</h3>

      <p>
        Once we submit a complete application with all required plans and
        engineer stamps, expect 10 to 30 calendar days for approval.
        Incomplete applications are rejected, not held. If a sheet is
        missing or a stamp is wrong, the application starts over. We
        budget two cycles in the schedule, which means we want plans
        finalized 60 days before we want to break ground.
      </p>

      <CalloutBox type="family-note" title="Why we call before we design">
        If the county requires a structural PE stamp, the designer needs
        to know that before they draw anything (the PE has specific
        format and detail requirements). If solar chimney penetrations
        need engineer review, the engineer needs to be looped in early.
        Calling the AHJ first costs us one phone call. Skipping that
        call costs weeks of rework when the permit gets rejected.
      </CalloutBox>

      <h2>The Envelope</h2>

      <p>
        The &ldquo;envelope&rdquo; is everything that separates the inside of
        your house from the outside air. Get this right and you have a
        comfortable, efficient home for 40 years. Get it wrong and you fight
        your heating and cooling system forever.
      </p>

      <p>
        In eastern Oklahoma, we&rsquo;re in a hot and humid climate zone. That
        changes what works. Standard insulation advice from the internet is
        often written for northern states &mdash; it will hurt you here.
      </p>

      <ExpandableSection title="Layer 1: Closed-cell spray foam (walls and roof)">
        <p>
          Closed-cell spray foam, or CCSF, is the backbone of the entire
          envelope. It does three things at once: it insulates (R-28 at 4
          inches), it acts as an air barrier, and it acts as a vapor retarder.
          In a hot-humid climate, you need all three in one layer.
        </p>
        <p>
          The critical rule: never mix CCSF with fiberglass batts in the same
          wall cavity. The spray foam creates a vapor barrier. Fiberglass
          behind it traps moisture at the dew point. The result is mold inside
          a wall you can&rsquo;t see. One insulation type per cavity.
        </p>
        <p>
          Cost is around $1.50&ndash;$3 per square foot and must be
          professionally installed. We budget $8,500 for this.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Layer 2: Exterior rigid insulation (thermal break)">
        <p>
          Post-frame columns are wood, but the steel panels on the outside
          conduct heat. Without a thermal break, the columns bridge heat from
          the hot exterior straight into your conditioned space. One inch of
          polyiso rigid foam board on the exterior face of the sheathing breaks
          that bridge and adds about R-5.
        </p>
        <p>
          This is a cheap win &mdash; roughly $2,000&ndash;$3,000 in materials
          and DIY labor &mdash; that pays back every single summer.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Layer 3: Radiant barrier in the roof">
        <p>
          A metal roof in Oklahoma can reach 160&deg;F on a July afternoon.
          That heat radiates down into the attic space and cooks your
          insulation. A radiant barrier &mdash; foil-faced sheathing or foil
          under the metal panels &mdash; reflects that radiant heat before it
          can get in.
        </p>
        <p>
          This is about a $0.50 per square foot upcharge on the roof sheathing.
          On a 1,200 square foot footprint, that&rsquo;s $600. Skip it and
          your air conditioner runs 20% harder all summer.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Layer 4: Deep overhangs">
        <p>
          Overhangs are free passive solar control. A 3&ndash;4 foot overhang
          on the south side blocks the high summer sun while letting in the
          lower winter sun. North, east, and west overhangs at 2+ feet protect
          against rain-driven moisture on the wall panels.
        </p>
        <p>
          Deep overhangs are designed in at the kit stage &mdash; you
          can&rsquo;t add them easily after the fact. We specify this when
          ordering the kit.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Layer 5: Airtight construction and blower-door test">
        <p>
          All the insulation in the world doesn&rsquo;t matter if air is
          leaking freely through gaps and penetrations. Every penetration
          through the building envelope &mdash; wires, pipes, HVAC lines
          &mdash; gets sealed with foam or tape.
        </p>
        <p>
          We run a blower-door test before drywall goes up. A blower-door test
          pressurizes the building and measures air leakage. If we fail, we
          find the leaks and fix them before they&rsquo;re hidden behind
          drywall. A standard house leaks 4&ndash;7 air changes per hour.
          Our target is 1.5 or better.
        </p>
      </ExpandableSection>

      <h2>What We DIY vs What We Hire</h2>

      <p>
        Mike does almost everything. But there are 7 tasks where licensing,
        safety, or specialized equipment make DIY impossible or illegal. Those
        get contracted. Everything else is on Mike.
      </p>

      <ComparisonTable
        headers={["Task", "DIY or Contract", "Why"]}
        rows={[
          ["Foundation piers", "DIY", "Straightforward with tractor auger"],
          ["Column and truss erection", "DIY + 1-day crew", "Truss setting day needs 4 people for safety &mdash; $3,000"],
          ["Metal roof panels", "DIY", "Physical work, learnable with YouTube prep"],
          ["Windows and doors", "DIY", "Manufacturer instructions are clear"],
          ["Well drilling", "Contract", "State-licensed drillers only"],
          ["Septic system", "Contract", "State-licensed installer required by law"],
          ["Closed-cell spray foam", "Contract", "Commercial rig and certification required"],
          ["Electrical rough-in (branch circuits)", "DIY", "Mike studies NEC and pulls county permit"],
          ["Electrical main service tie-in", "Contract", "Utility requires licensed electrician"],
          ["PEX plumbing (supply lines)", "DIY", "Easy with crimp tool, Mike learns this"],
          ["Drain and vent plumbing", "DIY", "More complex but fully learnable"],
          ["Solar panels and racking", "DIY", "Physical and basic DC wiring"],
          ["Solar grid-tie inspection", "Contract", "Utility and AHJ require licensed sign-off"],
          ["Engineer stamp (if required)", "Contract", "Some counties require it for post-frame residential"],
          ["Drywall, flooring, cabinets, paint", "DIY", "Finish imperfect but livable is the goal"],
        ]}
      />

      <h2>The Build Sequence</h2>

      <p>
        Order matters. Here are the 8 steps in the sequence we&rsquo;re
        following. Don&rsquo;t rearrange them.
      </p>

      <StepProcess steps={buildSteps} />

      <h2>Kit Suppliers</h2>

      <p>
        The post-frame kit &mdash; the package of steel columns, trusses,
        purlins, and metal panels &mdash; comes from a supplier who delivers
        it to the site. Three companies worth getting quotes from:
      </p>

      <ul className="gw-list">
        <li>
          <strong>Mueller Buildings</strong> &mdash; Large national supplier
          with a Texas presence. Competitive pricing on standard sizes.
          Good for straightforward rectangular footprints.
        </li>
        <li>
          <strong>Morton Buildings</strong> &mdash; One of the oldest post-frame
          companies in the country. More expensive but well-engineered.
          Good if you want a lot of design support.
        </li>
        <li>
          <strong>Cleary Building Corp</strong> &mdash; Midwest-focused,
          competitive on custom sizes. Worth a quote if the other two
          are slower to respond.
        </li>
      </ul>

      <p>
        Get at least 3 quotes on the same spec before committing. Kit prices
        vary more than you&rsquo;d expect for the same building. Specify your
        exact footprint (we&rsquo;re targeting 32&prime;&nbsp;&times;&nbsp;48&prime;
        = 1,536 square feet), wall height, overhang depth, door and window
        locations, and panel color.
      </p>

      <CalloutBox type="family-note">
        We designed to a 32&prime;&nbsp;&times;&nbsp;48&prime; footprint because
        post-frame buildings work best with dimensions divisible by 8. The
        column grid is 8 feet on center. Fighting that grid wastes materials
        and adds cost. Work with it and the pieces just fit.
      </CalloutBox>
    </GWLayout>
  );
}
