import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";

export default function StormShelterPage() {
  return (
    <GWLayout
      title="Storm Shelter: Mandatory in Tornado Alley"
      lastVerified="April 2026"
      readingTime="6 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-storm-shelter.jpg"
        imageAlt="Tornado approaching rural Oklahoma landscape"
      />
      <h1>Storm Shelter: Mandatory in Tornado Alley</h1>

      <p className="gw-lead">
        Eastern Oklahoma is in the heart of tornado alley. We don&rsquo;t
        skip this. Some counties won&rsquo;t insure a residential build
        without a documented shelter plan, and any insurance company that
        does will charge a premium until one exists. More importantly, a
        1,200 sq ft post-frame house is the wrong place to be in a
        tornado without a hardened space to retreat to.
      </p>

      <p>
        Related pages:{" "}
        <a href="/generational-wealth/foundation">Foundation</a>,{" "}
        <a href="/generational-wealth/insurance">Insurance</a>,{" "}
        <a href="/generational-wealth/risks">Risks &amp; Edge Cases</a>.
      </p>

      <h2>Four Shelter Types</h2>

      <ComparisonTable
        headers={["Type", "DIY-friendly?", "Materials cost", "Notes"]}
        rows={[
          ["Underground poured concrete (outside the home)", "Yes (with concrete delivery)", "$3,000 to $5,000", "Accessed by stairs. Hardest to retrofit. Best to design in before site prep."],
          ["Reinforced concrete safe room (interior)", "Partial (concrete contractor pours, Mike finishes)", "$5,000 to $10,000", "Built into the slab during pour. Steel door, ventilation. Doubles as pantry or closet."],
          ["Above-ground prefab steel safe", "No (delivered + bolted in)", "$8,000 to $15,000 installed", "Bolted to a reinforced slab section. Fast install. Higher cost."],
          ["Buried prefab fiberglass/steel", "No (excavated + dropped in)", "$10,000 to $18,000 installed", "Outdoor, hatch entry. Excavator-required."],
        ]}
      />

      <h2>Our Pick: Reinforced Interior Safe Room</h2>

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

      <h2>FEMA P-320 Specifications (the actual standard)</h2>

      <p>
        FEMA Publication 320 is the residential safe-room design standard.
        Our PE references this when stamping the safe room plan. Key
        requirements that drive design decisions:
      </p>

      <ul className="gw-list">
        <li>
          <strong>Wind speed rating:</strong> designed for 250 mph EF5
          tornado wind loads. That&rsquo;s about 7 times the design wind
          load for the rest of the house.
        </li>
        <li>
          <strong>Wall construction:</strong> 8-inch-thick reinforced
          concrete with #5 rebar at 12 inches on center, both directions.
          Or equivalent solid masonry block filled with concrete.
        </li>
        <li>
          <strong>Roof construction:</strong> 6 to 8-inch reinforced
          concrete slab, anchored to the walls with continuous rebar
          ties. Wood frame and steel deck do not qualify.
        </li>
        <li>
          <strong>Door:</strong> FEMA-tested impact-rated steel door
          ($800 to $2,500 installed). Standard interior doors do not
          qualify.
        </li>
        <li>
          <strong>Ventilation:</strong> a small protected air vent so the
          space doesn&rsquo;t suffocate during occupancy. Sized per
          number of occupants and expected duration.
        </li>
        <li>
          <strong>Anchoring:</strong> the safe room shell is tied
          continuously to the foundation slab. No connection to the
          surrounding house framing (the house can fail without
          collapsing the shelter).
        </li>
      </ul>

      <CalloutBox type="heads-up" title="Cannot retrofit easily">
        A safe room poured into the slab is straightforward. Adding one
        after the slab is set means cutting concrete, retrofitting walls,
        and probably code review for the modification. Plan it now or
        plan to do an above-ground prefab later.
      </CalloutBox>

      <h2>Insurance Implications</h2>

      <p>
        Most home insurers in Oklahoma offer a discount of 5 to 15
        percent on the dwelling premium when a FEMA-rated safe room is
        documented in the build. Some require it for replacement-cost
        coverage. We get a written quote BEFORE the slab pour and adjust
        the safe room spec if the discount math justifies upgrading any
        component.
      </p>

      <CalloutBox type="family-note" title="Why we do this even if we hated it">
        We don&rsquo;t install a safe room because we&rsquo;re scared.
        We install it so the family knows there&rsquo;s a place that
        will not fail when the warning siren goes off at 3 AM. That
        confidence is the entire point.
      </CalloutBox>
    </GWLayout>
  );
}
