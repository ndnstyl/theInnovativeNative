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

      <h2>The Five Critical Decisions Before We Frame</h2>

      <p>
        Five topics deserve their own page because each one is big enough
        to make or break the build. Before we touch the envelope, the
        kit, or the build sequence, we work through these.
      </p>

      <ul className="gw-list gw-cross-links">
        <li>
          <strong>
            <a href="/generational-wealth/foundation">Foundation: What Goes Under the Columns</a>
          </strong>{" "}
          &mdash; Perma-Column vs DIY wet-set bracket comparison, soil
          testing, pier depth math, engineer-handoff load numbers. The
          decision that lasts longer than we do.
        </li>
        <li>
          <strong>
            <a href="/generational-wealth/storm-shelter">Storm Shelter</a>
          </strong>{" "}
          &mdash; Four shelter types, our pick (interior reinforced
          concrete safe room poured with the slab, ~$6-8K), FEMA P-320
          specs, insurance discount math.
        </li>
        <li>
          <strong>
            <a href="/generational-wealth/insurance">Insurance During Construction and After</a>
          </strong>{" "}
          &mdash; Builder&rsquo;s Risk, vacant land coverage, certificates
          of insurance from every sub, the seven endorsements to
          negotiate on the final homeowner&rsquo;s policy.
        </li>
        <li>
          <strong>
            <a href="/generational-wealth/general-contracting">Being Our Own General Contractor</a>
          </strong>{" "}
          &mdash; What the GC role actually involves, the 1-2 hour daily
          overhead, the non-negotiable 20-step build order, the build
          journal, the six common first-time mistakes.
        </li>
        <li>
          <strong>
            <a href="/generational-wealth/permits">Permits and the Building Department</a>
          </strong>{" "}
          &mdash; The 12 questions to ask Haskell County BEFORE hiring
          the designer, permit types, the 60-day plan-to-permit window,
          inspection schedule.
        </li>
      </ul>

      <p>
        Read those five before going further. The envelope, kit, and
        build sequence below assume those decisions have been made.
      </p>

      <CalloutBox type="family-note" title="Why this used to be one giant page">
        Earlier versions had all five topics as sections inside this
        page. It was 8,000 words and nobody would read it end to end.
        Splitting them out lets each topic get the depth it needs and
        lets us link to it from the dashboard, the sidebar, and other
        pages.
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
