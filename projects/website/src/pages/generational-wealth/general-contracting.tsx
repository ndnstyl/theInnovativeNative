import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";

export default function GeneralContractingPage() {
  return (
    <GWLayout
      title="Being Our Own General Contractor"
      lastVerified="April 2026"
      readingTime="9 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-general-contracting.jpg"
        imageAlt="Owner-builder reviewing build plans on site"
      />
      <h1>Being Our Own General Contractor</h1>

      <p className="gw-lead">
        Hiring a general contractor on a $272K build typically costs 10 to
        25 percent of the project value, or $27,000 to $68,000. That fee
        is the entire reason a 90% DIY build pencils out under our budget.
        We&rsquo;re saving the GC fee by doing the GC work ourselves.
        Worth understanding what that means.
      </p>

      <p>
        Related pages:{" "}
        <a href="/generational-wealth/permits">Permits</a>,{" "}
        <a href="/generational-wealth/insurance">Insurance</a>,{" "}
        <a href="/generational-wealth/site-prep">Site Prep</a>,{" "}
        <a href="/generational-wealth/building">Building Overview</a>.
      </p>

      <h2>What the GC Role Actually Involves</h2>

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

      <h2>The Time Commitment</h2>

      <p>
        Realistic rule of thumb: 1 to 2 hours per day on phone calls,
        scheduling, errands, and inspector coordination during active
        construction. Plus the full days when subs are on site (we have to
        be present). A 10-hour build day might be 7 hours of Mike doing
        labor plus 3 hours of GC duties. We do not do both at full
        capacity simultaneously.
      </p>

      <h2>The Build Order Is Not Negotiable</h2>

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

      <h2>Truss Day: The One Build Day We Don&rsquo;t Skimp On</h2>

      <p>
        Step 7 in the build order (column raising and truss setting) is
        the one day that single-handedly justifies hiring a crew. Setting
        roof trusses with two people is dangerous; setting them with four
        is fast and safe. We do this exactly once per build, and we do it
        right.
      </p>

      <ul className="gw-list">
        <li>
          <strong>Why a crew of four:</strong> trusses are 20 to 40 feet
          long and weigh 40+ pounds each. One person guides from the
          ground, two raise from the top plate, one stages the next
          truss. Three is the safety floor. Two is reckless. Four is the
          right number.
        </li>
        <li>
          <strong>Cost:</strong> roughly $3,000 for a 4-person crew for
          one day, plus crane truck rental if the trusses are too big to
          hand-set ($500 to $1,200). Total: $3,000 to $4,500.
        </li>
        <li>
          <strong>Insurance:</strong> the crew must carry general
          liability and workers comp at the same minimums as any other
          sub. Certificate of Insurance on file before they show up. See
          the <a href="/generational-wealth/insurance">Insurance page</a>{" "}
          for COI requirements.
        </li>
        <li>
          <strong>Weather:</strong> wind over 15 mph means we postpone.
          Wet pads or wet trusses mean we postpone. Crew shows up,
          weather is wrong, we pay a half-day fee and reschedule. Rather
          that than a falling truss.
        </li>
        <li>
          <strong>Coordination:</strong> trusses arrive on the same day
          or the day before. Pads and columns must be set and dry. Mike
          is on site as the GC, not as a crew member (his job is
          coordination and material handoff).
        </li>
      </ul>

      <CalloutBox type="heads-up" title="Why we do not DIY truss day">
        It&rsquo;s the only day where saving the labor cost has a
        chance of getting someone killed. We hire it. We pay for the COI.
        We do not negotiate the crew size down.
      </CalloutBox>

      <h2>The Build Journal</h2>

      <p>
        From day one, we keep a paper or digital journal. Every day we
        log: date, what happened, who was on site, what got inspected,
        what we paid, photos of the day&rsquo;s work. The journal serves
        four downstream purposes:
      </p>

      <ul className="gw-list">
        <li>
          <strong>Lender draws:</strong> when we request a draw payment,
          the lender wants documentation of work completed. Journal +
          photos answer this in five minutes instead of five hours of
          reconstruction.
        </li>
        <li>
          <strong>Insurance claims:</strong> if something gets damaged
          or stolen, the journal proves what was on site when.
        </li>
        <li>
          <strong>Tax documentation:</strong> at the end, we have a
          complete cost basis for the property, broken down by category,
          with receipts. Useful for future capital gains or insurance
          replacement claims.
        </li>
        <li>
          <strong>Family memory:</strong> 20 years from now the kids will
          read this and know exactly how their childhood home was built.
          That&rsquo;s its own reason.
        </li>
      </ul>

      <CalloutBox type="pro-tip">
        Phone notes app plus daily photos plus a shared family folder
        is enough. We don&rsquo;t need fancy software. The discipline is
        in showing up to log it every day, not the tool.
      </CalloutBox>

      <h2>Common First-Time GC Mistakes</h2>

      <ol className="gw-list">
        <li>
          <strong>Pulling the permit too late.</strong> Submit the
          application as soon as plans are stamped. Don&rsquo;t wait for
          materials to arrive.
        </li>
        <li>
          <strong>Not requesting the inspection when ready.</strong>
          Inspectors get backlogged. We schedule 3 to 5 days in advance
          for each milestone.
        </li>
        <li>
          <strong>Letting subs onto the site without a COI.</strong>
          Already covered in <a href="/generational-wealth/insurance">Insurance</a>.
          Re-emphasized here because it&rsquo;s the easiest rule to break
          when a sub shows up early and we just want them to start.
        </li>
        <li>
          <strong>Not protecting materials.</strong> A pallet of windows
          or a stack of drywall left exposed for one good rain becomes a
          warranty argument that we lose.
        </li>
        <li>
          <strong>Trying to do GC duty AND labor on the same day at full
          capacity.</strong> We pick one mode per day. Mornings can be
          phone calls and inspector contact, afternoons labor. Or vice
          versa. Trying to do both makes both worse.
        </li>
        <li>
          <strong>Underestimating change orders.</strong> Reality differs
          from plans. Budget 5 to 10 percent contingency on the total
          for unforeseen changes (rock in the soil, supplier shortages,
          plan revisions). Decisions made under stress without
          contingency money usually cost more than the change itself.
        </li>
      </ol>

      <CalloutBox type="family-note" title="The honest tradeoff">
        Hiring a real GC saves us 1 to 2 hours per day and removes the
        coordination stress. It costs $30K to $70K. We&rsquo;re trading
        the cash for the time. For a one-time owner-occupied build, the
        trade is usually worth taking.
      </CalloutBox>
    </GWLayout>
  );
}
