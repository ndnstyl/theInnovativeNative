import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";
import InteractiveChecklist from "@/components/generational-wealth/InteractiveChecklist";
import { T } from "@/components/generational-wealth/TooltipTerm";

const phase1Items = [
  {
    id: "county-gis",
    label: "Pull the county GIS parcel record",
    description: "Every county in OK and TX has a free GIS portal. Look up the parcel by address or legal description. Confirms exact acreage, legal owner, and any noted easements.",
  },
  {
    id: "flood-map",
    label: "Check FEMA flood map (msc.fema.gov)",
    description: "Search by address. If your intended building site is in a 100-year floodplain (Zone A or AE), insurance costs triple and building is complicated. Walk away or negotiate hard.",
  },
  {
    id: "satellite",
    label: "Pull satellite imagery — Google Earth + AcreValue",
    description: "Look at the last 10 years of imagery if you can. See how the land drains, where the trees are, and whether the seller's description matches reality.",
  },
  {
    id: "well-logs",
    label: "Check OWRB (Oklahoma) or TCEQ (Texas) for nearby well logs",
    description: "These state databases show well depth and yield for neighboring properties. If the area has lots of 3 GPM wells, yours probably will too. That may mean a storage cistern.",
  },
  {
    id: "drive-by",
    label: "Drive by and walk the property — don't just look at photos",
    description: "Listing photos are taken on the best day, in the best light. Walk the whole property. Check drainage, look for standing water, identify brush density, find the high ground.",
  },
];

const phase2Items = [
  {
    id: "title-search",
    label: "Order a preliminary title search",
    description: "A title company searches the county deed records and tells you who actually owns the land, what debts are attached, and whether the chain of title is clean.",
  },
  {
    id: "mineral-status",
    label: "Check mineral rights status",
    description: "Ask the title company to flag any mineral severance in the deed history. In Oklahoma and Texas, mineral rights are commonly severed. Know what you're buying before you sign.",
  },
  {
    id: "easements",
    label: "Identify all easements",
    description: "Utility easements, pipeline easements, access easements — these restrict what you can build and where. Get the full list from the title search.",
  },
  {
    id: "tax-history",
    label: "Pull 5-year property tax history",
    description: "County assessor's office. Confirms taxes are current, shows any delinquencies, and helps you understand what you'll pay after closing.",
  },
  {
    id: "zoning",
    label: "Confirm zoning allows your intended use",
    description: "Most rural Oklahoma land is unzoned (county, not city), which gives you wide latitude. Verify with the county planning office if you're unsure.",
  },
  {
    id: "ag-exemption",
    label: "Confirm ag exemption status (or eligibility)",
    description: "If the land currently has an ag exemption, ask what the requirements were. If it doesn't, ask the county what you'll need to establish one.",
  },
];

const phase3Items = [
  {
    id: "title-commitment",
    label: "Receive full title commitment from title company",
    description: "This is the formal document listing what's insured and what's excluded. Read Schedule B exceptions carefully — that's where problems hide.",
  },
  {
    id: "survey",
    label: "Get a current survey",
    description: "A licensed surveyor walks the property lines and marks corners. Required for most loans. Protects you from encroachment disputes. Budget $800-$2,000 depending on acreage.",
  },
  {
    id: "soil-test",
    label: "Pull SSURGO soil data (websoilsurvey.sc.egov.usda.gov)",
    description: "Free USDA database. Shows soil types, drainage class, and limitations. Critical for septic planning, gardening, and pasture establishment.",
  },
  {
    id: "perk-test",
    label: "Run a perk test if septic site is unproven",
    description: "A percolation test tells you how fast the soil drains — which determines what kind of septic system you can install. Bad perk = expensive aerobic system. Know before you close.",
  },
  {
    id: "phase1-esa",
    label: "Consider Phase 1 ESA for any historically commercial land",
    description: "An Environmental Site Assessment checks for contamination — old fuel tanks, industrial waste, chemical spills. Worth doing if the land was ever used commercially.",
  },
  {
    id: "well-estimate",
    label: "Get a well drilling estimate from 2 local drillers",
    description: "Call local well drillers and ask: what's the typical depth in this area and what's your price per foot? Gets you a real number for the budget.",
  },
  {
    id: "insurance-quote",
    label: "Get a farm/homestead insurance quote",
    description: "Some rural properties are hard to insure — high fire risk, no fire hydrants, floodplain proximity. Get a quote before you close, not after.",
  },
];

export default function DueDiligencePage() {
  return (
    <GWLayout
      title="Due Diligence — The Checklist Before You Buy Anything"
      readingTime="10 min"
      printable={true}
    >
      <PageCover imageSrc="/images/generational-wealth/cover-due-diligence.jpg" imageAlt="Inspecting rural property" />
      <h1>Due Diligence — The Checklist Before You Buy Anything</h1>

      <p className="gw-lead">
        This is the most important page for protecting you from expensive surprises.
        Land is not like buying a car — you can&rsquo;t return it. The problems that
        show up after closing can cost tens of thousands of dollars to fix. Most of them
        are findable before you sign if you know what to look for.
      </p>

      <p>
        We have broken the process into three phases. Each phase happens at a different
        point in the buying process. Check off each item as you complete it — your
        progress saves automatically on this device.
      </p>

      <h2>Phase 1 — Before You Make an Offer</h2>

      <p>
        Do these checks remotely before you spend time or money on anything formal.
        Most of this costs nothing and takes an afternoon. If something fails here,
        you move on to the next parcel — no harm done.
      </p>

      <InteractiveChecklist pageKey="dd-phase1" items={phase1Items} />

      <CalloutBox type="heads-up" title="Flood Zone Red Flag">
        A 100-year floodplain on your building site is not necessarily a deal-killer —
        but it changes everything. Flood insurance on a structure in Zone AE runs
        $3,000-$8,000 per year. Some lenders won&rsquo;t touch it at all. If the
        building site is in a floodplain, either find higher ground on the same parcel
        or move on.
      </CalloutBox>

      <h2>Phase 2 — Before You Sign</h2>

      <p>
        Once you have an accepted offer and you&rsquo;re in the due diligence window,
        these are the critical checks. Most purchase contracts give you 10-30 days to
        do this. Use every day.
      </p>

      <InteractiveChecklist pageKey="dd-phase2" items={phase2Items} />

      <CalloutBox type="heads-up" title="Mineral Severance Red Flag">
        Mineral severance means the oil, gas, and minerals under the land belong to
        someone else. In Oklahoma and Texas, this is extremely common — sometimes
        going back 100 years. It is not automatically a deal-killer. But if there is
        an <em>active lease</em> on the minerals, that means a company has the right
        to come onto your land and drill. That changes things. Ask your title company
        to flag any active leases, not just severance history.
      </CalloutBox>

      <CalloutBox type="heads-up" title="Low Well Yield Red Flag">
        If nearby wells in the area are coming in under 3{" "}
        <T>GPM</T> (gallons per minute), plan for a storage cistern from the start.
        A 5,000-gallon cistern with a pump system adds $3,000-$6,000 to your budget
        but solves the low-yield problem entirely. Do not let well concerns kill a
        good land deal — just price in the solution.
      </CalloutBox>

      <h2>Phase 3 — Before You Close</h2>

      <p>
        These are the final checks that happen in the last two weeks before closing.
        Some of these cost money. All of them are worth it — they are the last line
        of defense against a problem you&rsquo;ll be living with for decades.
      </p>

      <InteractiveChecklist pageKey="dd-phase3" items={phase3Items} />

      <CalloutBox type="heads-up" title="Septic System Red Flag">
        If the perk test fails or shows very slow drainage, you may be required to
        install an aerobic septic system instead of a conventional one. Aerobic systems
        cost $8,000-$15,000 and require annual maintenance contracts. Factor this in
        before closing if perk results are marginal.
      </CalloutBox>

      <h2>Scripts and Templates</h2>

      <p>
        Use these word-for-word when talking to listing agents or requesting documents.
        Most sellers are cooperative — they just need to be asked clearly.
      </p>

      <ExpandableSection title="Phone Script — Call to the Listing Agent">
        <p>
          <em>
            &ldquo;Hi, my name is [your name]. I&rsquo;m looking at the [address or
            parcel] property you have listed. Before I make an offer, I have a few quick
            questions. Can you tell me: (1) Do the sellers own the mineral rights, or have
            they been severed? (2) Is there a current survey on file? (3) Does the property
            currently have an ag exemption? (4) Is the land on a well, or is there no
            water source yet? And (5) Are there any known easements besides the road
            frontage?&rdquo;
          </em>
        </p>
        <p>
          If the agent doesn&rsquo;t know the answers, ask them to find out. These are
          standard questions — any experienced rural agent should be able to answer them
          or get the answers quickly.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Email Template — Document Request">
        <p>
          <em>Subject: Document Request — [Property Address]</em>
        </p>
        <p>
          <em>
            Hello [Agent Name],<br /><br />
            Thank you for your time on the phone. I am moving forward with my due
            diligence on [property address/legal description]. Could you please send me
            or arrange access to the following documents?<br /><br />
            1. Most recent survey (if available)<br />
            2. Title commitment or preliminary title report<br />
            3. Mineral rights documentation or deed history<br />
            4. Property tax history (last 3-5 years)<br />
            5. Any easement documentation (utility, access, pipeline)<br />
            6. Current ag exemption certificate (if applicable)<br />
            7. Well log (if a well exists on the property)<br /><br />
            I am working with [title company name] for this transaction. Please let me
            know if any of these require the seller&rsquo;s authorization and I will
            coordinate accordingly.<br /><br />
            Thank you,<br />
            [Your name]
          </em>
        </p>
      </ExpandableSection>

      <h2>What to Do If You Find a Problem</h2>

      <p>
        Finding a problem during due diligence is not the end of the deal — it is
        the deal. Here is how to think about each type of issue:
      </p>

      <ul className="gw-list">
        <li>
          <strong>Cloudy title or unpaid liens:</strong> The title company handles this.
          They will require the seller to clear it before closing. Do not close on
          cloudy title.
        </li>
        <li>
          <strong>Flood zone on building site:</strong> Ask for a price reduction
          that covers the extra insurance cost for 10 years. Or find a different parcel.
        </li>
        <li>
          <strong>Mineral severance with no active lease:</strong> Usually acceptable.
          Get it in writing in the contract. Negotiate a discount if you can.
        </li>
        <li>
          <strong>Mineral severance with an active lease:</strong> Get an attorney
          involved. Read the lease carefully. If the operator has surface access rights,
          understand what that means for your building plans.
        </li>
        <li>
          <strong>Low well yield:</strong> Price in a cistern and adjust your offer
          accordingly. Not a deal-killer.
        </li>
        <li>
          <strong>Failed perk test:</strong> Get an aerobic septic quote and reduce
          your offer by that amount. Or walk away if the margin is tight.
        </li>
      </ul>

      <CalloutBox type="family-note">
        The goal of due diligence is not to find reasons to walk away. It is to make
        sure the price you pay reflects the actual condition of what you&rsquo;re buying.
        Problems are negotiating leverage. Find them before closing, not after.
      </CalloutBox>
    </GWLayout>
  );
}
