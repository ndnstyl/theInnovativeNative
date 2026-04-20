import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import CostCalculator from "@/components/generational-wealth/CostCalculator";
import EligibilityChecker from "@/components/generational-wealth/EligibilityChecker";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";
import StatCard from "@/components/generational-wealth/StatCard";
import StepProcess from "@/components/generational-wealth/StepProcess";
import { T } from "@/components/generational-wealth/TooltipTerm";

const applySteps = [
  {
    number: 1,
    title: "Get your farm number from FSA",
    time: "Day 1 after closing",
    description:
      "Walk into your local Farm Service Agency (FSA) office the same day you close on the land. Bring your deed. They'll assign you a farm number — it's free and takes about an hour. You cannot apply for any USDA program without this number. FSA and NRCS are usually in the same building.",
  },
  {
    number: 2,
    title: "Visit the NRCS office and meet your district conservationist",
    time: "Day 1-3",
    description:
      "The Natural Resources Conservation Service (NRCS) runs EQIP. Walk next door (or call) and introduce yourself. Tell them you just bought land and you're interested in EQIP. Ask to schedule a site visit. Your district conservationist will become your main contact for everything.",
  },
  {
    number: 3,
    title: "Hire a consulting forester for a timber cruise",
    time: "Week 1",
    description:
      "A timber cruise is when a professional forester walks your land and inventories the trees — species, size, quality, market value. This takes 2-4 hours. Cost is $500-$1,500 depending on acreage. You need this to find out what the timber is worth AND to create a management plan, which NRCS requires before they'll fund anything.",
  },
  {
    number: 4,
    title: "Forester delivers your management plan",
    time: "Weeks 3-6",
    description:
      "The forester writes a formal management plan that says: here's what's on the land, here's the recommended approach. This plan is what NRCS uses to develop your conservation plan. Don't skip this step — it's the document that unlocks everything downstream.",
  },
  {
    number: 5,
    title: "NRCS develops your conservation plan with you",
    time: "Weeks 4-8",
    description:
      "Your district conservationist visits the property (or reviews maps and plans remotely) and creates a formal conservation plan. This document identifies the resource concerns on your land and recommends specific EQIP practices — with their practice codes. The conservation plan is required before you can submit an EQIP application.",
  },
  {
    number: 6,
    title: "Submit your EQIP application (Form CPA-1200)",
    time: "After conservation plan",
    description:
      "The actual application is one page. Your NRCS conservationist helps you fill it out. You'll list the practices you're applying for (brush management, fencing, etc.) and the estimated acres. Submit before the ranking deadline — the national deadline is January 15, but states have additional signup periods throughout the year. Ask your local office when the next ranking period is.",
  },
  {
    number: 7,
    title: "Application enters the ranking period",
    time: "1-3 months",
    description:
      "NRCS scores your application against others in your local pool. Applications are ranked by the conservation benefit they'd provide. Being a beginning farmer, minority, or veteran puts you in a dedicated pool with less competition. You'll typically hear back within a few months.",
  },
  {
    number: 8,
    title: "Contract offered if you rank high enough",
    time: "After ranking",
    description:
      "If your application ranks high enough, NRCS will offer you a contract. Read it carefully. It spells out exactly which practices are funded, the payment rates, and the timeline. You can accept or decline. Once you sign, you have a legal agreement — and the clock starts.",
  },
  {
    number: 9,
    title: "Implement practices AFTER the contract is signed",
    time: "Per contract schedule",
    description:
      "This is the most important rule of the whole program: do NOT start any work before you have a signed contract. If you clear brush, build fence, or dig a pond before the contract is signed, that work is NOT eligible for reimbursement. Period. No exceptions. Wait for the ink to dry.",
  },
  {
    number: 10,
    title: "NRCS certifies your work, payment issued",
    time: "After work is done",
    description:
      "Once you complete a practice, contact NRCS to schedule a certification visit. They'll inspect the work and confirm it meets their standards. After certification, payment is processed — typically within 30-60 days. Payments are made once per year in most cases, usually in October.",
  },
];

export default function EqipPage() {
  return (
    <GWLayout
      title="NRCS & EQIP — How the Government Helps Pay"
      lastVerified="April 2026"
      readingTime="12 min"
    >
      <h1>NRCS &amp; EQIP — How the Government Helps Pay</h1>

      <CalloutBox type="the-law">
        Program rules, payment rates, and ranking priorities change every year. Everything
        on this page reflects our best understanding as of April 2026. Before you make any
        decisions, verify details directly with your local{" "}
        <T>NRCS</T> office. They are free to call and genuinely helpful.
      </CalloutBox>

      <h2>What is EQIP?</h2>

      <p>
        <T>EQIP</T> stands for Environmental Quality Incentives Program. It is the federal
        government&rsquo;s biggest program for helping landowners improve their land — and
        it has been running since 1996. Think of it as a cost-sharing deal: you do the
        conservation work, and the government reimburses you for most of the cost.
      </p>

      <p>
        When we say &ldquo;reimburse,&rdquo; we mean they pay you back after the work is
        done. The reimbursement rate is 75% for most landowners and up to 90% if you
        qualify as a beginning farmer, a socially disadvantaged producer, or a veteran.
        That is not a typo. On a $20,000 brush-clearing job, they could send you a check
        for $18,000.
      </p>

      <p>
        EQIP is not a loan. You do not pay it back. It is not taxable as income in most
        cases (check with your tax person). It is a reimbursement for conservation work
        that improves the land. The government wants healthy land — and they&rsquo;re
        willing to write a check to get it.
      </p>

      <p>
        The program is run by the Natural Resources Conservation Service,{" "}
        <T>NRCS</T> for short — a <T>USDA</T> agency. Your local NRCS office has a
        district conservationist who works with you one-on-one. They&rsquo;re not
        salespeople. They&rsquo;re government employees who actually want to help you
        succeed.
      </p>

      <h2>Do You Qualify?</h2>

      <p>
        Use this quick checker first, then read the plain-English breakdown below.
      </p>

      <EligibilityChecker />

      <h3>Own or Control the Land</h3>
      <p>
        You need to own or control the land where the work will happen. Control means
        you have a deed (owned) or a lease (rented). We&rsquo;ll be buying, so this is
        straightforward — bring your deed to the NRCS office.
      </p>

      <h3>Get a Farm Number from FSA</h3>
      <p>
        A <T>Farm Number</T> is a unique ID for your property, assigned by the{" "}
        <T>FSA</T> (Farm Service Agency). It&rsquo;s free and takes about an hour to
        get. You cannot apply for any USDA program without it. The very first thing you
        do after closing on the land — same day if possible — is walk into the local
        USDA Service Center and get this number.
      </p>

      <h3>Land Has a Resource Concern</h3>
      <p>
        NRCS needs to identify a &ldquo;resource concern&rdquo; on your land — something
        that could be improved for conservation benefit. Overgrown, neglected land with
        invasive brush, erosion risk, or no water infrastructure qualifies easily.
        Honestly, most rural land that&rsquo;s been sitting unused for years will have
        multiple resource concerns. Your district conservationist documents this with you.
      </p>

      <h3>Sign Form AD-1026</h3>
      <p>
        This is the conservation compliance form. It says you won&rsquo;t drain wetlands
        or clear native prairie to grow crops while receiving federal benefits. NRCS
        helps you fill it out — it&rsquo;s not complicated for our situation.
      </p>

      <h3>Income Under $900,000</h3>
      <p>
        Your adjusted gross income (AGI) must be under $900,000. That&rsquo;s not a
        typo — that&rsquo;s the threshold. Almost everyone reading this qualifies.
      </p>

      <CalloutBox type="pro-tip">
        You likely qualify for the 90% rate. Beginning farmer means you have been farming
        for fewer than 10 years — which is most of us starting from scratch. If you are
        also a minority or veteran, you qualify on multiple tracks. Ask NRCS specifically
        about the &ldquo;dedicated pools&rdquo; for beginning and socially disadvantaged
        farmers — these have less competition.
      </CalloutBox>

      <h2>How Much Does It Pay?</h2>

      <p>
        The payment rate depends on your producer category. Here is the breakdown:
      </p>

      <ComparisonTable
        headers={["Producer Type", "Cost-Share Rate", "Advance Payment Available"]}
        rows={[
          ["Standard landowner", "75%", "No"],
          ["Beginning farmer (under 10 yrs)", "Up to 90%", "Yes — 50% upfront"],
          ["Socially disadvantaged producer", "Up to 90%", "Yes — 50% upfront"],
          ["Veteran", "Up to 90%", "Yes — 50% upfront"],
        ]}
      />

      <CalloutBox type="family-note">
        The advance payment option is huge for us. Instead of paying the full cost
        out-of-pocket and waiting to get reimbursed, NRCS sends you 50% of your payment
        upfront — before the work starts. That means if brush clearing costs $20,000 and
        you qualify for 90%, NRCS would send you $9,000 before you hire anyone. You use
        that to pay contractors. This is specifically designed for people who don&rsquo;t
        have $20K sitting around to front.
      </CalloutBox>

      <h2>What Practices Apply to Us?</h2>

      <p>
        NRCS has numbered codes for every type of conservation work. Here are the ones
        most relevant to buying raw, overgrown land and turning it into a homestead:
      </p>

      <ExpandableSection title="Code 314 — Brush Management">
        <p>
          This is the big one for most overgrown rural land. Brush management covers
          the mechanical or chemical control of invasive or unwanted woody plants — trees,
          shrubs, and brush that have taken over land that could otherwise be productive
          pasture or forest.
        </p>
        <p>
          &ldquo;Mechanical&rdquo; usually means a forestry mulcher — a machine that grinds
          everything into chips on the spot. It is the fastest way to clear land and
          doesn&rsquo;t require hauling. EQIP can reimburse the cost of hiring a contractor
          with a mulcher, or the cost of equipment rental.
        </p>
        <p>
          This practice works hand-in-hand with a timber sale. After the timber company
          takes the valuable trees, you&rsquo;re left with brush and stumps. That&rsquo;s
          exactly what Code 314 is designed to address.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Code 382 — Fence">
        <p>
          EQIP will cost-share fencing — but not all fence is equal in their ranking
          system. Cross-fencing (interior fence that divides your property into paddocks
          for rotational grazing) scores higher than perimeter boundary fence. Why?
          Because rotational grazing has proven conservation benefits — it improves soil
          health, prevents overgrazing, and helps land recover.
        </p>
        <p>
          Boundary fence still qualifies, but it ranks lower. If you&rsquo;re going to
          apply for fence money, prioritize planning a rotational grazing system —
          even a simple one with two or three paddocks.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Code 378 — Pond">
        <p>
          Stock ponds — small earthen ponds dug for livestock water and wildlife —
          are one of the most cost-effective EQIP practices. A typical half-acre stock
          pond might cost $8,000-$15,000 to build. At 90%, your out-of-pocket could be
          under $1,500.
        </p>
        <p>
          Ponds also provide wildlife habitat, fire suppression water, and eventually
          fish. The catch: NRCS has specific design standards. The pond must be engineered
          to their specs. Your district conservationist handles this — you don&rsquo;t
          need to hire a separate engineer.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Code 612 — Tree and Shrub Establishment">
        <p>
          This practice covers the planting of trees and shrubs for conservation purposes
          — things like wind breaks, riparian buffers along streams, and agroforestry
          plantings. Our plan includes planting pecans, walnuts, persimmons, and mulberries.
          Many of those fit neatly into a Code 612 application.
        </p>
        <p>
          You&rsquo;ll need a tree planting plan (the forester can write this). NRCS
          reimburses for seedlings, site preparation, and sometimes planting equipment.
          Trees that produce food AND provide conservation benefit (like nut trees along
          contours to prevent erosion) score well.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Code 338 — Prescribed Burning">
        <p>
          In Oklahoma and East Texas, prescribed fire is one of the most effective land
          management tools. It clears brush, returns nutrients to soil, controls invasive
          species, and improves wildlife habitat. EQIP can reimburse the cost of
          prescribed burning — including hiring a certified burn crew if you&rsquo;re not
          doing it yourself.
        </p>
        <p>
          You&rsquo;ll need a prescribed burn plan prepared by or reviewed by NRCS before
          applying. This is not something you just light up on your own — there are
          notification requirements and safety protocols.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Code 550 — Range Planting">
        <p>
          Range planting covers seeding native grasses on land that has been cleared or
          degraded. After you clear brush and before you run livestock, you may want to
          seed the land with native grasses — coastal bermuda, native bluestem, or
          similar species depending on your soil and region.
        </p>
        <p>
          EQIP can reimburse seed costs and seedbed preparation. This works especially
          well combined with Codes 314 (brush clearing) and 382 (fencing) — you clear,
          fence, plant, and then run cattle on a rotational system. That&rsquo;s a
          complete EQIP story that ranks well.
        </p>
      </ExpandableSection>

      <h2>How to Apply — Step by Step</h2>

      <p>
        Here is the full process in order. Do not skip steps or rearrange them —
        the sequence matters.
      </p>

      <StepProcess steps={applySteps} />

      <h2>The Timber-to-Pasture Play</h2>

      <p>
        Here is the &ldquo;aha moment&rdquo; that most people miss when they buy overgrown
        land. There are actually two income streams hiding in that mess of trees and brush
        — and they stack on top of each other.
      </p>

      <p>
        First, the forester inventories the timber. If your land has marketable pine, oak,
        or hardwood, timber companies will bid on it. A competitive bid process can
        generate $5,000 to $30,000 or more depending on acreage and species. The forester
        manages the sale for you — usually for a 10-15% commission on the sale price.
        That&rsquo;s money in your pocket before a single fence post goes in the ground.
      </p>

      <p>
        After the timber company harvests the trees, they leave. But they also leave behind
        the brush, stumps, and slash. That&rsquo;s exactly what EQIP Code 314 — brush
        management — is designed to clean up. So you just earned timber sale income, and
        now the government will reimburse you 75-90% of the cost to clear what&rsquo;s left.
        The land goes from overgrown forest to productive pasture — and you barely spent
        any money to do it.
      </p>

      <CalloutBox type="pro-tip">
        This is the single most powerful strategy for rural land buyers without big
        capital. Timber sale income covers a chunk of your land cost. EQIP covers most of
        the clearing cost. You end up with pasture, fence, and water infrastructure for a
        fraction of what it would otherwise cost. Run the numbers with your forester before
        you buy — not after.
      </CalloutBox>

      <h2>What This Saves Us</h2>

      <p>
        Use this calculator to estimate your own EQIP reimbursement on any project cost.
      </p>

      <CostCalculator mode="eqip" />

      <div className="gw-stat-cards">
        <StatCard value="$12,600–$42,600" label="Conservative EQIP savings on our plan" />
        <StatCard value="75–90%" label="Government reimburses this share" />
        <StatCard value="$0" label="You pay back — it's not a loan" />
      </div>

      <h2>The Critical Rule</h2>

      <CalloutBox type="heads-up" title="Do NOT start work before the contract is signed">
        This is the number-one mistake people make with EQIP. You hear about the program,
        you get excited, you hire a bulldozer and start clearing. Then you apply for EQIP.
        And NRCS tells you that any work done before the contract was signed is not
        eligible for reimbursement. None of it. The whole project. This is not a
        technicality — it is the law. No contract, no money. Wait for the ink.
      </CalloutBox>

      <h2>Realistic Timeline</h2>

      <p>
        Here is what to expect from start to first payment check:
      </p>

      <ul className="gw-list">
        <li>Day 1: Get farm number from FSA, introduce yourself to NRCS</li>
        <li>Weeks 1-6: Forester delivers management plan, NRCS creates conservation plan</li>
        <li>After plan: Submit EQIP application (Form CPA-1200)</li>
        <li>3-6 months: Ranking period, contract offered if you qualify</li>
        <li>After contract: Implement practices according to the schedule</li>
        <li>After work is certified: Payment — typically October of that year</li>
      </ul>

      <CalloutBox type="family-note">
        EQIP is not instant. From the day you walk into NRCS to the day you get your first
        check, plan for 9 to 18 months. That feels slow — but the check at the end is real,
        and it can cover most of the cost of turning raw land into something. Start early,
        be patient, and stay in touch with your district conservationist.
      </CalloutBox>
    </GWLayout>
  );
}
