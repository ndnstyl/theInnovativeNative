import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";
import StepProcess from "@/components/generational-wealth/StepProcess";

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
