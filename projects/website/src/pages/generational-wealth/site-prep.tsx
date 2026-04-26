import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";

export default function SitePrepPage() {
  return (
    <GWLayout
      title="Site Prep: What We DIY, What We Hire"
      lastVerified="April 2026"
      readingTime="7 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-site-prep.jpg"
        imageAlt="Skid steer grading rural property pad"
      />
      <h1>Site Prep: What We DIY, What We Hire</h1>

      <p className="gw-lead">
        Site prep is the first phase of physical work on the land and the
        place where 90% DIY actually pays off. Done wrong, contractor
        bills here can run $20K to $40K. Done with a clear DIY/hire split,
        we cut that to about $11K out of pocket and save the difference
        for the build budget.
      </p>

      <p>
        Related pages:{" "}
        <a href="/generational-wealth/eqip">EQIP Cost-Share</a>,{" "}
        <a href="/generational-wealth/timber">Timber as Asset</a>,{" "}
        <a href="/generational-wealth/foundation">Foundation</a>,{" "}
        <a href="/generational-wealth/general-contracting">Being Your Own GC</a>.
      </p>

      <h2>The Four Phases of Site Prep</h2>

      <ol className="gw-list">
        <li>
          <strong>Selective timber harvest (if applicable).</strong>{" "}
          Done by a forester-managed logging crew. Removes the highest-value
          trees, opens up the building zone, leaves slash for cleanup.
          Generates revenue, doesn&rsquo;t cost us anything.
        </li>
        <li>
          <strong>EQIP brush management on the bulk acreage (22 of 25
          acres).</strong> 75 to 90 percent cost-share via NRCS Practice
          314. Heavy mulcher contractor cleans up post-harvest slash and
          unwanted brush. Converts forest to silvopasture or improved
          pasture.
        </li>
        <li>
          <strong>Homesite pad professional prep (1 to 3 acres).</strong>{" "}
          Pro-grade clearing, leveling, compaction. Has to be precise
          because the slab and home sit on it. Not eligible for EQIP
          cost-share (residential, not ag).
        </li>
        <li>
          <strong>DIY rough work everywhere else.</strong> Driveway, access
          trails, fence-line clearing, equipment paths. Mike does this with
          rented or owned equipment. Doesn&rsquo;t need precision.
        </li>
      </ol>

      <h2>Cost Comparison: Hire-It-All vs DIY Split</h2>

      <ComparisonTable
        headers={["Work item", "Hire it all", "DIY split (our plan)"]}
        rows={[
          ["EQIP brush mulching, 22 acres", "$8,800 contractor", "$880 net (90% cost-share)"],
          ["Homesite pad clearing + leveling, 1 acre", "$8,000 to $15,000", "$8,000 to $15,000 (still pro)"],
          ["Driveway grading, 1,000 ft", "$5,000 to $20,000", "$1,000 (Mike + skid steer rental)"],
          ["Access trails through property", "$3,000 to $10,000", "$500 (chainsaw + UTV time)"],
          ["Fence-line clearing", "$2,000 to $5,000", "$300 (chainsaw + brush hog)"],
          ["Equipment staging area", "$2,000 to $5,000", "$200 (Mike grades it himself)"],
          ["Total", "$28,800 to $63,800", "$10,880 to $17,880"],
        ]}
      />

      <p>
        The savings come from doing the rough work ourselves. The
        homesite pad still gets professional treatment because slab pour
        depends on flat, compacted, properly-graded ground. Driveway and
        trails do not. We keep the savings on the budget side instead
        of on the contractor side.
      </p>

      <h2>The Equipment Rental Plan</h2>

      <p>
        Most rural towns within 40 miles of our target counties have a
        Sunbelt, United Rentals, or local equipment rental yard. Daily
        rates for what we need:
      </p>

      <ComparisonTable
        headers={["Equipment", "Day rate", "Use", "Days needed"]}
        rows={[
          ["Skid steer with bucket", "$200 to $300", "Driveway grading, equipment paths, rough leveling", "5 to 8"],
          ["Skid steer with brush mulcher attachment", "$400 to $600", "Brush clearing in tight spots, fence-line work", "1 to 2"],
          ["Mini excavator", "$250 to $400", "Trenching for utilities, septic prep", "3 to 5"],
          ["Tractor with rear box blade", "$150 to $250", "Driveway top-dressing, finish grading, gravel spreading", "3 to 4"],
          ["Towable tow-behind brush hog", "$50 to $100", "Pasture mowing, weed control", "2 to 4 (per season)"],
        ]}
      />

      <p>
        <strong>Total equipment rental budget for site prep work:</strong>{" "}
        $2,500 to $4,500 across the project. Plus fuel and our time.
        Owning equipment outright would cost $25K to $80K for the same
        machines. Rental wins for one build.
      </p>

      <CalloutBox type="pro-tip">
        Rent on Saturdays for the long weekend rate. Most yards charge
        one day for a Saturday-Monday return, which gives 48 to 72 hours
        of work for the price of one. Plan high-equipment days around
        weekends.
      </CalloutBox>

      <h2>The Sequencing Constraint</h2>

      <p>
        Site prep has its own internal order. Get this wrong and we redo
        work or block a contractor when they show up.
      </p>

      <ol className="gw-list">
        <li>
          <strong>Survey + flag the building site.</strong> Before
          anyone clears or grades, the surveyor (or us with GPS + the
          plan) marks the slab corners, septic field, well drilling
          spot, driveway path, utility runs.
        </li>
        <li>
          <strong>Selective timber harvest.</strong> Logger needs access,
          a landing for log trucks, and clearance to drop trees. Done
          before any other work disturbs the site.
        </li>
        <li>
          <strong>EQIP brush mulching.</strong> Cleans up post-harvest
          slash. Contractor needs space to operate the mulcher.
        </li>
        <li>
          <strong>Driveway rough cut and gravel.</strong> Mike DIY.
          Done early so the well drillers, septic installers, and
          concrete trucks can get to the site without rutting it up.
        </li>
        <li>
          <strong>Well drilling.</strong> Confirms water before any
          permanent infrastructure spend. See{" "}
          <a href="/generational-wealth/systems">Systems</a> for the
          well decision.
        </li>
        <li>
          <strong>Septic site approval and install.</strong> County
          health department signs off on the perk-tested location;
          installer trenches the field.
        </li>
        <li>
          <strong>Homesite pad professional prep.</strong> Last because
          we don&rsquo;t want heavy traffic on the pad once it&rsquo;s
          been compacted and graded.
        </li>
        <li>
          <strong>Foundation pier drilling and pour.</strong> First step
          of the actual build phase.
        </li>
      </ol>

      <CalloutBox type="heads-up" title="Don't pad-prep before the well">
        We do not professionally prep the homesite pad before drilling
        the well. If the well comes up dry or marginal, the building
        location may shift. A perfectly graded pad in the wrong place
        is wasted money.
      </CalloutBox>

      <h2>The EQIP Timing Reality</h2>

      <p>
        EQIP contracts take 3 to 6 months to issue after we apply. We
        cannot do brush mulching with cost-share until the contract is
        signed. Workaround: we sequence selective timber harvest and
        well drilling during the EQIP wait, then mulch when the contract
        comes through.
      </p>

      <p>
        Detail on how EQIP cost-share works lives on the{" "}
        <a href="/generational-wealth/eqip">EQIP page</a>. The site-prep
        version is: don&rsquo;t pay full freight on bulk clearing if we
        can get it 90% paid for by waiting 4 months.
      </p>

      <h2>Contractor Coordination on Pro Days</h2>

      <p>
        Two days during site prep involve hired contractors on site:
        the brush mulching contractor (1 to 3 days) and the homesite
        pad pro (1 to 2 days). Plus the well driller and septic
        installer separately. Each one needs:
      </p>

      <ul className="gw-list">
        <li>Certificate of Insurance on file (see <a href="/generational-wealth/insurance">Insurance</a>)</li>
        <li>Clear site access (driveway done first)</li>
        <li>Marked work boundary (flags or stakes)</li>
        <li>Mike present for the kickoff and final walkthrough</li>
        <li>Written scope and price agreed in advance</li>
        <li>Deposit / progress / final payment terms in writing</li>
      </ul>

      <CalloutBox type="family-note" title="Why we do the rough work ourselves">
        It is genuinely cheaper to rent a skid steer for $250/day and
        spend a Saturday grading a driveway than to hire someone for
        $5,000. The work doesn&rsquo;t need to be perfect. Gravel
        smooths over the imperfections. The savings go straight into
        the build budget.
      </CalloutBox>
    </GWLayout>
  );
}
