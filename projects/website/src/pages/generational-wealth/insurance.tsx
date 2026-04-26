import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";

export default function InsurancePage() {
  return (
    <GWLayout
      title="Insurance During Construction and After"
      lastVerified="April 2026"
      readingTime="8 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-insurance.jpg"
        imageAlt="Construction site insurance documentation"
      />
      <h1>Insurance During Construction and After</h1>

      <p className="gw-lead">
        We&rsquo;re acting as our own general contractor. That makes us
        the legally responsible party on the job site. If a hired
        sub-contractor gets hurt and they aren&rsquo;t carrying their own
        liability coverage, that liability lands on us personally.
        Standard homeowner&rsquo;s insurance does not cover an unfinished
        house. Two policies fill the gap, plus a paper habit that protects
        us from sub-contractor liability.
      </p>

      <p>
        Related pages:{" "}
        <a href="/generational-wealth/general-contracting">Being Your Own GC</a>,{" "}
        <a href="/generational-wealth/storm-shelter">Storm Shelter</a> (insurance discount),{" "}
        <a href="/generational-wealth/risks">Risks &amp; Edge Cases</a>.
      </p>

      <h2>Policy 1: Builder&rsquo;s Risk</h2>

      <p>
        A temporary insurance policy that covers the structure and
        materials during construction. Replaces the gap between vacant
        land coverage and final homeowner&rsquo;s coverage.
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

      <h2>Policy 2: Vacant Land (between closing and groundbreaking)</h2>

      <p>
        Between closing on land and starting construction, the property
        sits unoccupied. Vacant land insurance is cheap (often $200 to
        $400 a year) and covers liability if someone trespasses and
        gets hurt, plus property damage to anything on the land. Once
        builder&rsquo;s risk starts, the vacant policy converts or
        cancels.
      </p>

      <h2>Policy 3: Final Homeowner&rsquo;s Coverage</h2>

      <p>
        After the Certificate of Occupancy, we transition to standard
        homeowner&rsquo;s. Three things to negotiate hard with the
        carrier on a metal-clad post-frame in tornado alley:
      </p>

      <ComparisonTable
        headers={["Endorsement", "What it does", "Why it matters here"]}
        rows={[
          ["Replacement cost (RC) on dwelling", "Pays to rebuild at current cost, not depreciated value", "If a tornado totals the build at year 10, depreciated payouts won't rebuild it"],
          ["Wind/hail rider", "Specifically covers tornado, hail, severe storm damage", "Many policies exclude or sub-limit wind in OK; we want this explicit"],
          ["Detached structures coverage", "Workshop, barn, greenhouse separate from main home", "Aquaponics greenhouse + workshop need their own coverage"],
          ["Other structures (well, septic, solar)", "Mechanical and infrastructure outside the dwelling", "Default policies often cap this at 10% of dwelling; we may need higher"],
          ["Personal property", "Tools, furniture, contents", "DIY house = lots of tools that need to be itemized for full coverage"],
          ["Liability", "If a guest is injured on the property", "$500K minimum, $1M better, $2M-$5M umbrella for the compound future"],
          ["Storm shelter discount", "Premium reduction with FEMA-rated shelter documented", "5 to 15 percent saving once the safe room is built"],
        ]}
      />

      <h2>Certificates of Insurance from every hired sub</h2>

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

      <h2>Subs we hire that need a COI on file before they arrive</h2>

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

      <h2>Cost Summary: All Construction-Phase Insurance</h2>

      <ComparisonTable
        headers={["Coverage", "Period", "Estimated cost"]}
        rows={[
          ["Vacant land", "From closing to groundbreaking", "$200 to $400/year"],
          ["Builder's risk", "From groundbreaking to CO", "$1,500 to $4,000 total"],
          ["Homeowner's (annual)", "After CO, ongoing", "$1,800 to $3,500/year (post-frame, OK, with riders)"],
          ["Total construction phase", "Closing through CO", "$2,000 to $4,500"],
        ]}
      />

      <p>
        That&rsquo;s real money but it&rsquo;s also the cost of not
        getting wiped out if a single bad day happens during the build.
        Compared to the cost of an uninsured sub-contractor injury, this
        is cheap.
      </p>
    </GWLayout>
  );
}
