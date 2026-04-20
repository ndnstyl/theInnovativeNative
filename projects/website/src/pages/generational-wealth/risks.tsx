import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";
import StatCard from "@/components/generational-wealth/StatCard";

export default function RisksPage() {
  return (
    <GWLayout
      title="Risks & Edge Cases — What Can Go Wrong"
      lastVerified="April 2026"
      readingTime="10 min"
    >
      <PageCover imageSrc="/images/generational-wealth/cover-risks.jpg" imageAlt="Storm clouds over rural Oklahoma" />
      <h1>Risks &amp; Edge Cases — What Can Go Wrong</h1>

      <p className="gw-lead">
        This page isn&rsquo;t meant to scare you. It&rsquo;s meant to make sure
        we&rsquo;ve already decided what we&rsquo;ll do when things go wrong —
        so we&rsquo;re not making those decisions under stress.
      </p>

      <h2>The Risk Matrix</h2>

      <p>
        Every significant risk ranked by how likely it is over 10 years and how
        bad it would be if it happened. The score combines both.
      </p>

      <ComparisonTable
        headers={["Risk", "Likelihood (10 yr)", "Impact", "Score", "Category"]}
        rows={[
          ["Ice storm (3–7 days grid down)", "~100%", "Severe", "10", "Weather"],
          ["Family medical emergency", "~95%", "Severe", "9", "People"],
          ["Budget overrun >25%", "~70%", "Project-ending", "8", "Financial"],
          ["Tornado within 5 mi", "~60%", "Catastrophic if direct", "8", "Weather"],
          ["Teen rebellion / social isolation", "~60%", "Severe to family", "8", "People"],
          ["Divorce / family split", "~15%", "Catastrophic to project", "8", "People"],
          ["Drought (>3 weeks no rain)", "~100%", "Moderate", "7", "Weather"],
          ["Well issue (dry / pump / contamination)", "~35%", "Severe", "7", "Infrastructure"],
          ["Wildfire", "~25%", "Catastrophic", "7", "Weather"],
          ["Aquaponics mass die-off", "~50% Y1–2", "Moderate", "6", "Operational"],
          ["Septic failure", "~25%", "Moderate", "5", "Infrastructure"],
          ["Mineral rights conflict", "~10%", "Severe", "5", "Legal"],
        ]}
      />

      <h2>Walk-Away Triggers</h2>

      <p>
        These are pre-committed decisions. We made them now, before we&rsquo;re
        emotionally invested in a property or a build. If any of these happen,
        we walk. No re-litigating under stress.
      </p>

      <CalloutBox type="heads-up" title="Walk Away If...">
        <ul className="gw-list">
          <li>Phase 1 ESA flags contamination on the property</li>
          <li>Minerals are severed AND there&rsquo;s active O&amp;G drilling within 5 miles</li>
          <li>Well yields less than 3 GPM with no backup water source</li>
          <li>Property is in a FEMA flood zone</li>
          <li>Any family member scores below 3/10 on &ldquo;is this working?&rdquo; for 2+ quarters</li>
        </ul>
      </CalloutBox>

      <h2>The Big Ones — And What We Do</h2>

      <ExpandableSection title="Ice Storm (Score: 10) — It WILL happen">
        <p>
          Eastern Oklahoma gets a serious ice storm roughly every 3&ndash;5 years.
          Grid goes down for 3&ndash;7 days. Roads are impassable. Temperatures
          drop to 0&ndash;25&deg;F.
        </p>
        <p><strong>Our prep:</strong></p>
        <ul className="gw-list">
          <li>Battery + solar handles critical loads for 2&ndash;3 days</li>
          <li>Wood stove is the backup when the mini-split can&rsquo;t keep up below 15&deg;F</li>
          <li>Propane backup for aquaponics heat (fish die if water drops below 60&deg;F)</li>
          <li>Cistern holds 30+ days of water if the well pump loses power</li>
          <li>2 weeks of food + fuel stored at all times</li>
        </ul>
      </ExpandableSection>

      <ExpandableSection title="Budget Overrun (Score: 8) — Most likely financial risk">
        <p>
          Our budget is $272K with $2,800 headroom. That&rsquo;s tight. The 10%
          contingency ($25K) absorbs normal surprises, but a 25%+ overrun would
          break the plan.
        </p>
        <p><strong>Pre-committed fallback cuts</strong> (in priority order):</p>
        <ul className="gw-list">
          <li>Defer battery to Year 2 (keep solar grid-tied) — saves $8K</li>
          <li>Defer aquaponics Tier 2 to Year 3 — saves $3K</li>
          <li>Scale appliances to used/stock — saves $2K</li>
          <li>Scale land from 25 to 20 acres — saves $11.5K (decide before closing)</li>
        </ul>
        <p>
          Decision gates every quarter: if cumulative spend exceeds the benchmark,
          trigger the next fallback automatically. No debating.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Tornado (Score: 8) — Low probability, extreme impact">
        <p>
          A direct hit on the homestead is unlikely in any given year (~6% annual
          probability within 5 miles), but over 10 years it&rsquo;s a real
          possibility. A direct hit on the house would be catastrophic.
        </p>
        <p><strong>Our mitigation:</strong></p>
        <ul className="gw-list">
          <li>Root cellar / storm shelter is mandatory (doubles as cold storage)</li>
          <li>Post-frame barndo with engineered wind-load brackets (certified for OK wind zones)</li>
          <li>Insurance: dwelling + tornado rider + builder&rsquo;s risk during construction</li>
          <li>Tornado drills 2&times;/year with the family</li>
          <li>Weather radio + phone alerts always on</li>
        </ul>
      </ExpandableSection>

      <ExpandableSection title="Family Friction (Score: 8) — The hardest one to plan for">
        <p>
          Teen isolation, spouse burnout, and the stress of a 2-year build
          while living in a travel trailer are all real risks. This isn&rsquo;t
          a construction risk &mdash; it&rsquo;s a people risk. And it&rsquo;s
          the one that can actually end the project.
        </p>
        <p><strong>How we manage it:</strong></p>
        <ul className="gw-list">
          <li>Family sentiment check every quarter &mdash; everyone scores 1&ndash;10</li>
          <li>If ANY family member is below 4/10 for 2 quarters: pause the project</li>
          <li>Starlink from Day 1 (teens need internet, period)</li>
          <li>Budget a 3-day Airbnb escape mid-build (trailer fatigue is real)</li>
          <li>Nearest high school distance is a non-negotiable in site selection</li>
          <li>Monthly family meetings &mdash; rotate who leads</li>
        </ul>
      </ExpandableSection>

      <ExpandableSection title="Well Failure (Score: 7) — Solvable but expensive">
        <p>
          The well could come in low-yield (&lt;3 GPM), the pump could fail,
          or contamination could show up in testing. Water is the foundation of
          everything &mdash; no water, no homestead.
        </p>
        <p><strong>Layers of defense:</strong></p>
        <ul className="gw-list">
          <li>Research neighbor well logs before buying (OWRB database)</li>
          <li>Well driller walk-the-land consult before closing ($0&ndash;$300)</li>
          <li>10,000-gallon cistern as backup (60+ days of water independence)</li>
          <li>Rainwater collection system (supplemental, not primary)</li>
          <li>If well is &lt;3 GPM at drilling: trigger walk-away or aggressive cistern plan</li>
        </ul>
      </ExpandableSection>

      <h2>Hidden Costs People Miss</h2>

      <p>
        These aren&rsquo;t in the construction budget because they&rsquo;re
        funded from ongoing income. But they&rsquo;re real money that goes out
        the door during the build:
      </p>

      <ComparisonTable
        headers={["Hidden Cost", "Estimated Amount", "When"]}
        rows={[
          ["Travel to county offices (15+ trips)", "~$300 fuel", "Year 0–1"],
          ["Tools you didn't know you needed", "$100/month ongoing", "Every month"],
          ["Blown tires, broken implements", "$400–$800/year", "Year 1+"],
          ["Hay price spikes (2–3× in drought years)", "Variable", "Year 2+"],
          ["Medical deductibles (rural = 45+ min to ER)", "Variable", "Anytime"],
          ["Failed tree batch (10–20% first-year mortality)", "~$500 replacement", "Year 1"],
          ["Bureaucracy time (hours not building)", "Psychological", "Year 0–1"],
          ["Family friction relief (Airbnb escape, date nights)", "$500–$1,000", "Mid-build"],
        ]}
      />

      <h2>Decision Gates — Quarterly Check-In</h2>

      <p>
        Every quarter, we answer these 5 questions. All green = keep going.
        One red = pause and fix. This is non-negotiable discipline.
      </p>

      <ol className="gw-list">
        <li><strong>Budget</strong> — Are we on plan? Within &plusmn;10%? Over 25%?</li>
        <li><strong>Schedule</strong> — Is the next milestone realistic?</li>
        <li><strong>Family sentiment</strong> — Is every member at 4/10 or above?</li>
        <li><strong>Health &amp; safety</strong> — Any near-misses? Anything deferred?</li>
        <li><strong>Next quarter scope</strong> — Locked or ambiguous?</li>
      </ol>

      <div className="gw-stat-cards">
        <StatCard value="Green" label="All 5 positive — proceed" />
        <StatCard value="Yellow" label="1–2 concerns — adjust scope" />
        <StatCard value="Red" label="3+ concerns — pause project" />
      </div>

      <CalloutBox type="family-note">
        The point of all this isn&rsquo;t to be pessimistic. It&rsquo;s to be
        prepared. Every one of these risks has a plan, and the plan was made
        before we were standing in the middle of the problem. That&rsquo;s the
        difference between &ldquo;we figured it out&rdquo; and &ldquo;we panicked.&rdquo;
      </CalloutBox>
    </GWLayout>
  );
}
