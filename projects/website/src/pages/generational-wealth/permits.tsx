import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";

export default function PermitsPage() {
  return (
    <GWLayout
      title="Permits and the Building Department"
      lastVerified="April 2026"
      readingTime="7 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-permits.jpg"
        imageAlt="Building permit documents and architectural plans"
      />
      <h1>Permits and the Building Department</h1>

      <p className="gw-lead">
        Haskell County building department is the authority that says
        yes or no to our build. We talk to them BEFORE we hire the
        designer or the engineer. The first conversation establishes
        what they require, which determines what the designer and PE
        have to deliver.
      </p>

      <p>
        Related pages:{" "}
        <a href="/generational-wealth/general-contracting">Being Your Own GC</a>,{" "}
        <a href="/generational-wealth/foundation">Foundation</a>,{" "}
        <a href="/generational-wealth/building">Building Overview</a>.
      </p>

      <h2>Questions to Ask the AHJ on the First Call</h2>

      <p>
        AHJ stands for Authority Having Jurisdiction. In our case
        that&rsquo;s Haskell County Building Department. The list below
        is the first phone call we make once we close on land. Some
        counties answer all of these in a 15-minute conversation. Some
        require email. Either way, we get the answers in writing.
      </p>

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
        <li>
          Do you require separate permits for septic, well, electrical
          service, and HVAC, or is one master permit sufficient?
        </li>
        <li>
          Are FEMA-rated safe rooms inspected separately from the main
          structural inspection?
        </li>
      </ul>

      <h2>Permit Types We Need</h2>

      <p>
        Most counties bundle these into a single residential permit. Some
        require separate permits per discipline. Confirm in the first
        call.
      </p>

      <ul className="gw-list">
        <li>
          <strong>Building permit:</strong> structural shell, roof,
          windows, doors, slab.
        </li>
        <li>
          <strong>Electrical permit:</strong> service entrance, branch
          circuits, panels.
        </li>
        <li>
          <strong>Plumbing permit:</strong> water service, drain-waste-vent,
          fixtures.
        </li>
        <li>
          <strong>Mechanical permit:</strong> HVAC ducting, ERV, fuel
          gas if applicable.
        </li>
        <li>
          <strong>Septic permit:</strong> issued by county health
          department, separate from building permit.
        </li>
        <li>
          <strong>Well permit:</strong> issued by Oklahoma Water
          Resources Board for non-domestic-exempt situations. We
          typically qualify for the domestic exemption (see{" "}
          <a href="/generational-wealth/oklahoma-vs-texas">Oklahoma vs Texas</a>).
        </li>
        <li>
          <strong>Driveway and culvert permit:</strong> if our driveway
          crosses a county road right-of-way, we need a permit from the
          county roads department.
        </li>
      </ul>

      <h2>Permit Timeline</h2>

      <p>
        Once we submit a complete application with all required plans and
        engineer stamps, expect 10 to 30 calendar days for approval.
        Incomplete applications are rejected, not held. If a sheet is
        missing or a stamp is wrong, the application starts over. We
        budget two cycles in the schedule, which means we want plans
        finalized 60 days before we want to break ground.
      </p>

      <h2>Plan Format Acceptance</h2>

      <p>
        Different counties accept different levels of formality. Asking
        about this in the first call saves us paying for a level of
        detail we don&rsquo;t need (or being rejected for a level we
        skipped).
      </p>

      <ul className="gw-list">
        <li>
          <strong>Hand-drawn:</strong> some rural counties accept
          legibly-drawn plans on graph paper for simple residential
          builds. Probably not for our build because of the engineering
          stamps required.
        </li>
        <li>
          <strong>Sketch software (SketchUp, etc.):</strong> generally
          accepted for design intent, but most counties want CAD-quality
          sheets for permit submission.
        </li>
        <li>
          <strong>CAD plans:</strong> the standard. Designer-produced
          drawings on a title block, scaled, dimensioned, with elevations
          and sections.
        </li>
        <li>
          <strong>Engineer-stamped plans:</strong> required for any sheet
          showing structural elements (foundation, framing, roof
          penetrations). The PE&rsquo;s seal and signature on each
          stamped sheet.
        </li>
      </ul>

      <h2>Inspection Schedule (Typical)</h2>

      <ul className="gw-list">
        <li>
          <strong>Foundation:</strong> after pier drilling and concrete
          pour, before slab. Inspector verifies depth, reinforcement,
          bracket placement.
        </li>
        <li>
          <strong>Underground:</strong> rough plumbing and electrical
          conduit in the slab area, before slab pour.
        </li>
        <li>
          <strong>Framing:</strong> after columns, trusses, and roof
          deck are installed. Before any wall sheathing is closed.
        </li>
        <li>
          <strong>Rough mechanical/electrical/plumbing (MEP):</strong>
          after all branch wiring, supply lines, and ducts are run.
          Before insulation.
        </li>
        <li>
          <strong>Insulation:</strong> after CCSF and rigid insulation
          are installed, before drywall.
        </li>
        <li>
          <strong>Final:</strong> all systems operational, fixtures in,
          finishes complete. Inspector signs off on Certificate of
          Occupancy.
        </li>
      </ul>

      <CalloutBox type="family-note" title="Why we call before we design">
        If the county requires a structural PE stamp, the designer needs
        to know that before they draw anything (the PE has specific
        format and detail requirements). If solar chimney penetrations
        need engineer review, the engineer needs to be looped in early.
        Calling the AHJ first costs us one phone call. Skipping that
        call costs weeks of rework when the permit gets rejected.
      </CalloutBox>

      <h2>Permit Fee Estimate</h2>

      <p>
        Haskell County permit fees are typically calculated as a small
        percentage of the project valuation, often $300 to $1,500 for a
        residential build of our size. Plus separate fees for septic
        ($100 to $300) and well permit if required.{" "}
        <strong>Total permit budget: $500 to $2,000.</strong> Real
        numbers come from the first call.
      </p>
    </GWLayout>
  );
}
