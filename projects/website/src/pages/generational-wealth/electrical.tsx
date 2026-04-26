import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";

export default function ElectricalPage() {
  return (
    <GWLayout
      title="Electrical: What Mike Wires, What the Licensed Electrician Does"
      lastVerified="April 2026"
      readingTime="9 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-electrical.jpg"
        imageAlt="Electrical panel and rough-in wiring"
      />
      <h1>Electrical: What Mike Wires, What the Licensed Electrician Does</h1>

      <p className="gw-lead">
        Electrical is the biggest DIY system in this build by labor hours.
        Mike does most of it. The two pieces that require licensed work
        are the main service tie-in (utility company demands it) and the
        solar grid-tie inspection (interconnect requirement). Everything
        in between is owner-builder territory in Oklahoma, with the
        right permit.
      </p>

      <p>
        Related pages:{" "}
        <a href="/generational-wealth/permits">Permits</a>,{" "}
        <a href="/generational-wealth/systems">Systems (solar + battery)</a>,{" "}
        <a href="/generational-wealth/building">Building Overview</a>.
      </p>

      <h2>Owner-Builder Permit in Oklahoma</h2>

      <p>
        Oklahoma allows homeowners to do their own electrical work on
        their own primary residence with a homeowner electrical permit.
        Some counties limit this; Haskell County is permissive. We
        confirm in the first call to the building department (questions
        list on the <a href="/generational-wealth/permits">Permits</a>{" "}
        page).
      </p>

      <p>
        Required code references:
      </p>

      <ul className="gw-list">
        <li>
          National Electrical Code (NEC) 2020 or later edition, whichever
          Oklahoma has adopted statewide. Local jurisdictions may amend.
        </li>
        <li>
          Oklahoma Electrical Code (state-level amendments and
          requirements).
        </li>
        <li>
          Local Haskell County amendments (rare, but verify in the
          permit office).
        </li>
      </ul>

      <h2>Service Size and Load Calculation</h2>

      <p>
        Before we plan circuits, we know what total amperage the house
        needs. NEC has a load calculation method (Article 220) that
        adds up all anticipated loads, applies demand factors, and
        produces a minimum service size.
      </p>

      <ComparisonTable
        headers={["Load", "Wattage estimate", "Notes"]}
        rows={[
          ["General lighting (3 W/sq ft × 1,200)", "3,600 W", "NEC general lighting load"],
          ["Small appliance circuits (kitchen, 2 × 1,500)", "3,000 W", "NEC required minimum"],
          ["Laundry circuit", "1,500 W", "NEC required dedicated 20A"],
          ["Bathroom circuit", "1,500 W", "NEC required dedicated 20A"],
          ["Range / cooktop (electric)", "8,000 to 12,000 W", "240V if electric. We may use propane to reduce load"],
          ["Water heater (electric)", "4,500 W", "Or propane. Propane reduces load significantly"],
          ["Dishwasher", "1,200 W", "Dedicated circuit"],
          ["Disposal", "1,000 W", "Often shares dishwasher circuit"],
          ["Mini-split HVAC (24K BTU)", "2,500 W", "240V"],
          ["Refrigerator", "800 W", "Dedicated 20A circuit"],
          ["Aquaponics pumps + heaters", "1,500 W", "Continuous load, year-round"],
          ["Well pump", "2,000 W", "Submersible, 240V usually"],
          ["Workshop circuits (2)", "3,000 W", "Future expansion"],
          ["Subtotal before demand factor", "~32,000 to 40,000 W", "133 to 167 amps at 240V"],
          ["With NEC demand factor (35-40% reduction)", "~22,000 to 27,000 W", "92 to 113 amps continuous"],
        ]}
      />

      <p>
        <strong>Recommended service size:</strong> 200 amp residential.
        Gives us headroom for a workshop, future EV charging, and
        seasonal aquaponics scale-up. Cost difference between 100A and
        200A panels is about $200 to $400 in equipment, so we go 200A.
      </p>

      <h2>The DIY/Hire Split</h2>

      <ComparisonTable
        headers={["Work", "Who does it", "Why"]}
        rows={[
          ["Service entrance from utility pole to meter base", "Licensed electrician + utility crew", "Utility company will not connect to a non-licensed install. Worth $1,000 to $2,000"],
          ["Meter base + main disconnect", "Licensed (under same scope as service tie-in)", "Same crew, same day"],
          ["Main panel install (200A)", "Mike", "Owner-builder permitted"],
          ["Branch circuit wiring (15A and 20A circuits to outlets and lights)", "Mike", "Standard owner-builder work"],
          ["240V circuits (range, dryer, water heater, mini-split, well)", "Mike", "Same code applies, owner-builder allowed"],
          ["Outlet, switch, fixture installation (rough and trim)", "Mike", "Standard"],
          ["Solar combiner panel + DC disconnect", "Mike", "Owner-builder"],
          ["Solar grid-tie inverter wiring to panel", "Mike", "Owner-builder, but inverter manufacturer may want certified installer for warranty"],
          ["Solar grid-tie inspection", "Licensed inspector + utility approval", "Required by interconnect agreement"],
          ["Final electrical inspection", "County inspector", "Required for CO"],
        ]}
      />

      <h2>Branch Circuit Plan (Typical 1,200 sq ft)</h2>

      <ul className="gw-list">
        <li>15A bedroom 1: lights + 4 outlets</li>
        <li>15A bedroom 2: lights + 4 outlets</li>
        <li>15A bedroom 3: lights + 4 outlets</li>
        <li>15A living/dining: lights + 8 outlets</li>
        <li>20A small appliance #1: kitchen counter outlets</li>
        <li>20A small appliance #2: kitchen counter outlets</li>
        <li>20A laundry: laundry outlet only</li>
        <li>20A bathroom 1: outlets + GFCI (lights on separate 15A)</li>
        <li>20A bathroom 2: outlets + GFCI (lights on separate 15A)</li>
        <li>20A dishwasher (dedicated)</li>
        <li>20A microwave (dedicated)</li>
        <li>20A refrigerator (dedicated)</li>
        <li>20A aquaponics (dedicated, if greenhouse adjacent)</li>
        <li>240V 50A range (if electric)</li>
        <li>240V 30A dryer</li>
        <li>240V 30A water heater (if electric)</li>
        <li>240V 30A well pump</li>
        <li>240V 30A mini-split</li>
        <li>240V 30A solar combiner</li>
        <li>15A garage door / shop power</li>
      </ul>

      <p>
        About 18 to 22 circuits in a 200A panel. Plenty of room left for
        future workshop, EV, or compound expansion.
      </p>

      <h2>Rough-In Sequencing</h2>

      <p>
        Electrical rough-in happens AFTER framing inspection and BEFORE
        insulation. The wires need to be in the wall cavities before
        insulation seals them. Mistake here means cutting drywall later.
      </p>

      <ol className="gw-list">
        <li>
          <strong>Mark every box location on the floor plan.</strong>
          Outlets every 12 feet along walls (NEC), switches at door
          openings, lights centered or per fixture spec.
        </li>
        <li>
          <strong>Mount all boxes to studs at the right height.</strong>
          Outlets 16 inches AFF (above finished floor) typical. Switches
          48 inches. Some heights are code, some are convention.
        </li>
        <li>
          <strong>Pull wire from panel location to each box.</strong>
          Romex 14/2 for 15A, 12/2 for 20A. 12/3 if a switch leg needs
          a neutral.
        </li>
        <li>
          <strong>Make up the boxes</strong> (strip jackets, leave 8
          inches of conductor inside each box, label which circuit each
          wire belongs to).
        </li>
        <li>
          <strong>Rough-in inspection.</strong> Inspector checks box
          mounting, wire paths, that nothing is bent past code limits,
          that nothing is too close to plumbing or HVAC.
        </li>
        <li>
          <strong>Insulation goes in.</strong> Wire is now buried.
        </li>
        <li>
          <strong>Trim phase later:</strong> install outlets, switches,
          fixtures, panel breakers.
        </li>
      </ol>

      <h2>The 12 Most Common DIY Electrical Mistakes</h2>

      <ol className="gw-list">
        <li>Wrong wire gauge for circuit amperage (using 14 AWG on a 20A circuit is a fire hazard)</li>
        <li>Loose connections in outlets (back-stab connections fail; use the screw terminals)</li>
        <li>Box fill exceeded (stuffing too many conductors into one box; NEC has a fill calculation)</li>
        <li>Missing ground continuity (every metal box needs ground; PVC boxes don&rsquo;t)</li>
        <li>No GFCI in required locations (kitchens, bathrooms, garage, outdoor, basements)</li>
        <li>No AFCI (arc fault) breakers where required (most living spaces in 2020+ NEC)</li>
        <li>Wire too close to drywall surface (must be 1.25 inches from face of stud or have a metal nail plate)</li>
        <li>Improper box height variation (mixed heights look bad and may violate ADA if applicable)</li>
        <li>Forgetting the laundry circuit, bathroom circuit, or small appliance circuits (all NEC required)</li>
        <li>Mixing circuits between rooms (each bedroom should have its own circuit for AFCI compliance)</li>
        <li>Not labeling the panel (every breaker should be labeled accurately)</li>
        <li>Skipping the rough-in inspection (we lose the right to demand corrections later)</li>
      </ol>

      <CalloutBox type="heads-up" title="The licensed work is non-negotiable">
        Service entrance and grid-tie inspection are not places to save
        money. Utility companies refuse to connect to non-licensed
        installs. Doing it yourself means the meter never goes in. We
        budget $1,500 to $3,000 for the licensed scope and move on.
      </CalloutBox>

      <CalloutBox type="pro-tip">
        Mike&rsquo;s electrical study material: NEC Handbook (current
        edition) plus Mike Holt&rsquo;s YouTube channel for residential
        rough-in walkthroughs. About 20 hours of focused reading and
        watching before pulling the first wire.
      </CalloutBox>
    </GWLayout>
  );
}
