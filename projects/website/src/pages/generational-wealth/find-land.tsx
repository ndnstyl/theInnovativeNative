import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";

export default function FindLandPage() {
  return (
    <GWLayout
      title="Finding Land &mdash; Where to Look and What to Look For"
      lastVerified="April 2026"
      readingTime="10 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-find-land.jpg"
        imageAlt="Rural Oklahoma land for sale"
      />
      <h1>Finding Land &mdash; Where to Look and What to Look For</h1>

      <p>
        Finding the right land is the most important decision in this whole
        plan. Get it wrong and nothing downstream works. Get it right and
        everything gets easier. We spent months building a system for this
        &mdash; here&rsquo;s what it looks like.
      </p>

      <h2>Where We&rsquo;re Looking</h2>

      <p>
        We&rsquo;re focused on eastern Oklahoma as our primary target. The land
        is cheaper than Texas, the water rights are cleaner, and many counties
        have zero residential building code enforcement &mdash; which means
        we can build without hiring a code-licensed general contractor.
      </p>

      <ComparisonTable
        headers={["County", "Why We Like It", "Price Per Acre", "Annual Rainfall"]}
        rows={[
          ["Latimer", "Cheap pine country, small market, less competition", "$2,000–$2,400", "50 inches"],
          ["Haskell", "Already scoped in Stigler area, good pasture and timber mix", "$2,200–$2,600", "50 inches"],
          ["Le Flore", "Kiamichi foothills, varied terrain, Poteau as regional hub", "$2,400–$2,900", "52 inches"],
          ["Pushmataha", "Remote and cheap, Kiamichi mountains, serious isolation", "$1,800–$2,400", "52 inches"],
          ["McCurtain", "Wettest county in Oklahoma, Ouachita National Forest nearby", "$2,200–$3,200", "55 inches"],
        ]}
      />

      <p>
        We need at least 40 inches of annual rainfall to make the homestead
        water plan work without trucking water in. Every county on our list
        clears that threshold comfortably.
      </p>

      <p>
        Our Plan B is east Texas &mdash; specifically Cherokee and Anderson
        counties. The land costs more per acre, but Texas has no state income
        tax and the tilapia hobby rules are cleaner. If a great deal surfaces
        in east Texas, we&rsquo;re not walking away from it.
      </p>

      <h2>Regional Scoring: Why These Counties Won</h2>

      <p>
        Before we scored individual parcels, we scored whole regions. The plan
        is an agroforestry plus aquaponics homestead that survives weather
        disasters, produces food without trucked water, and stays off-grid
        viable. Different regions of Texas and Oklahoma fail at those goals
        in very different ways.
      </p>

      <p>
        We weighted nine factors based on what actually kills homesteads. Water
        shortage kills aquaponics. Hurricanes kill orchards. One flood wipes
        five years of work. So water and disaster risk dominate the matrix.
      </p>

      <ComparisonTable
        headers={["Factor", "Weight", "Why It Matters"]}
        rows={[
          ["Water (rainfall, aquifer, surface)", "22%", "Aquaponics and food forest are water-positive only when rain and aquifer cooperate"],
          ["Disaster risk (inverse)", "18%", "Hurricane, flood, tornado, drought, wildfire. One bad year costs years of progress"],
          ["Soil quality", "13%", "Swales, food forest, silvopasture all fail on shallow rock or caliche"],
          ["Land cost ($/acre)", "10%", "Doubles or halves how fast we can scale the plan"],
          ["Tree cover", "9%", "Mature canopy is a 20-year head start on agroforestry"],
          ["Climate suitability", "9%", "Growing season, chill hours for fruit, heat stress"],
          ["Regulatory friendliness", "8%", "Unrestricted land plus ag exemption ease"],
          ["Energy potential", "6%", "Solar is good everywhere in the target region; wind varies"],
          ["Proximity to Houston", "5%", "Homestead is not a commute, so low weight on purpose"],
        ]}
      />

      <h3>Regional Rankings</h3>

      <p>
        We scored nine candidate regions on each factor (1 to 10), weighted
        them, and summed out of 1000. The same biome shows up at the top from
        both states: Piney Woods sandy loam with 50+ inches of rain, just on
        different sides of the Red River.
      </p>

      <ComparisonTable
        headers={["Rank", "Region", "Score", "Why It Ranked"]}
        rows={[
          ["1", "SE Oklahoma (McCurtain, Pushmataha, Le Flore, Choctaw)", "813", "Highest rainfall in OK, mature hardwood and pine, cheap, no zoning"],
          ["2", "Deep East TX (Nacogdoches, San Augustine, Shelby, Cherokee)", "805", "Same rainfall and trees as SE OK, closer to Houston, no state income tax"],
          ["3", "NE Oklahoma (Delaware, Adair, Cherokee-OK, Mayes)", "771", "Ozark springs enable gravity-fed aquaponics, real chill hours, very cheap"],
          ["4", "North Houston Piney Woods (Montgomery, Walker, Grimes)", "730", "Closest to Houston, but more expensive and higher hurricane risk"],
          ["5", "South Central OK (Bryan, Marshall, Johnston)", "725", "Lake Texoma water, cheaper land, but less rainfall than SE OK"],
          ["6", "Brazos Valley (Burleson, Milam, Lee)", "694", "Excellent soil, but drier and more expensive"],
          ["7", "Liberty and Chambers TX", "674", "Coastal plain. Direct hurricane and flood exposure sinks the score"],
          ["8", "Colorado County and Eagle Lake", "649", "Prairie with minimal tree cover and a known flooding history"],
          ["9", "Hill Country", "464", "28-32 inches rainfall plus shallow rock plus $25K/ac makes it the worst fit for this plan"],
        ]}
      />

      <CalloutBox type="family-note" title="The big unlock">
        SE Oklahoma and Deep East Texas score within 8 points of each other.
        They&rsquo;re effectively the same biome. The choice between them comes
        down to income tax (none in Texas) versus land cost (30 to 40 percent
        cheaper in Oklahoma). Both win on everything else that matters for the
        plan.
      </CalloutBox>

      <CalloutBox type="heads-up" title="Why the Hill Country is a trap for this plan">
        Everyone romanticizes the Hill Country. For our plan it&rsquo;s the
        worst region on the board: 28 to 32 inches of rainfall, shallow
        caliche soil, flash flood risk in every canyon, wildfire exposure,
        and $25K+ per acre. Beautiful to visit. Not where we build a
        water-hungry food system.
      </CalloutBox>

      <h2>How to Search</h2>

      <p>
        Not all search channels are equal. Here&rsquo;s how we&rsquo;re
        stacking them, ranked by how likely they are to find us the best deal:
      </p>

      <ol className="gw-list">
        <li>
          <strong>LandWatch, Land.com, AcreValue</strong> &mdash; These three
          sites cover about 80% of listed rural land inventory. Set saved
          searches with daily alerts. Filter by state, county, 15&ndash;40
          acres, and a max price that gives you negotiation room. Use the map
          view to check parcel shape and road access.
        </li>
        <li>
          <strong>Local real estate agents</strong> &mdash; Pick one rural agent
          per shortlist county and call them directly. Rural agents often know
          about parcels before they hit the listings &mdash; owners who are
          thinking about selling but haven&rsquo;t listed yet. Introduce
          yourself as a cash buyer who can close fast.
        </li>
        <li>
          <strong>County GIS and tax roll mining</strong> &mdash; Every Oklahoma
          county has a free online GIS portal. Search for absentee owners
          (where the owner&rsquo;s mailing address is different from the
          property address), parcels over 10 acres that have been held for 20+
          years, and delinquent tax accounts. These owners are often more
          motivated to sell.
        </li>
        <li>
          <strong>County tax auctions</strong> &mdash; Oklahoma county treasurer
          sales typically run June through September. Texas sheriff sales happen
          the first Tuesday of every month at the county courthouse. Prices can
          be 5&ndash;15% below retail, but title can be cloudy. Always use a
          title company before closing at auction.
        </li>
        <li>
          <strong>Direct mail campaign</strong> &mdash; The highest conversion
          rate for off-market deals. Details below.
        </li>
      </ol>

      <h2>The Direct Mail Play</h2>

      <p>
        This is the strategy that gets you deals nobody else is even bidding
        on. We pull the list of absentee owners on 15&ndash;40 acre parcels
        from the county GIS, and we send them a letter. Not a postcard.
        A letter. Signed by Mike. In plain language.
      </p>

      <p>
        The numbers: about 500 letters per county, sent four times each six
        weeks apart. Response rate is 1&ndash;3%. That&rsquo;s 5&ndash;15
        people per 500 who will actually call back. Total campaign cost is
        around $1,200. One deal from that campaign could save $10,000 off
        market price.
      </p>

      <ExpandableSection title="The actual letter we&rsquo;re sending">
        <p>
          <em>
            This is the actual letter we&rsquo;re sending to landowners. Feel
            free to use it &mdash; just swap in your own details.
          </em>
        </p>
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
{`[Date]

[Owner name]
[Owner address]

Dear [Name],

I'm Mike — I'm a real buyer, not a wholesaler. I'm looking to buy rural
land in [County] for my family of four to build a permanent home. I'm
not in a hurry, but I am serious.

If you've ever considered selling your [X acres] on [Rd/township] —
even if it's not listed — I'd love a short call to see if we can make
a simple deal work. Cash or agreed terms, flexible closing, I pay
closing costs.

No pressure, no back-and-forth. One honest conversation.

Call or text: [phone]
Email: [email]

Thank you,
Mike`}
        </pre>
        <p>
          Keep it short. Keep it personal. Landowners can smell a form letter
          from a wholesaler. This one doesn&rsquo;t look like that because it
          isn&rsquo;t.
        </p>
      </ExpandableSection>

      <h2>Scoring a Property</h2>

      <p>
        Once a parcel looks interesting, we run it through a scorecard before
        we drive out there. Each factor gets a score of 1 to 5. Our rule: walk
        away if the total is below 45 out of 100, or if any non-negotiable
        fails.
      </p>

      <ComparisonTable
        headers={["Factor", "Max Points", "What 5 Looks Like"]}
        rows={[
          ["Price per acre vs county average", "10", "Well below average"],
          ["Acreage in target range (15–40 ac)", "5", "Right in the sweet spot"],
          ["Annual rainfall (40 inches minimum)", "5", "50 inches or more"],
          ["Slope and drainage", "5", "Rolling, drains well"],
          ["Soil quality for crops and pasture", "5", "Class I or II farmland"],
          ["Expected well yield (neighbor logs)", "5", "10+ gallons per minute"],
          ["Road access", "5", "Paved county road frontage"],
          ["Utilities at road (power, phone)", "5", "Power line at the road"],
          ["Distance to hospital emergency room", "4", "Under 30 minutes"],
          ["Mineral rights status", "5", "Surface and minerals unified"],
        ]}
      />

      <p>
        Target score is 70 or higher. We&rsquo;re not looking for a perfect
        100 &mdash; that parcel doesn&rsquo;t exist in our budget. We&rsquo;re
        looking for a strong 70 with no deal-breakers.
      </p>

      <h2>Non-Negotiables</h2>

      <p>
        Some things aren&rsquo;t scored. They&rsquo;re automatic rejections.
        If any of these are true, we don&rsquo;t make an offer &mdash; period.
      </p>

      <CalloutBox type="heads-up" title="Auto-reject: No clear title">
        Cloudy title means ownership is disputed or unclear. It doesn&rsquo;t
        matter how cheap the land is. A title you can&rsquo;t defend is
        worthless. Always get a full title commitment from a title company
        before closing.
      </CalloutBox>

      <CalloutBox type="heads-up" title="Auto-reject: No confirmed water">
        If the neighbor&rsquo;s well is 400 feet deep at 2 gallons per minute,
        yours will probably be similar. Always check neighboring well logs
        through the Oklahoma Water Resources Board (OWRB) before making an
        offer. No water, no homestead.
      </CalloutBox>

      <CalloutBox type="heads-up" title="Auto-reject: No legal road access">
        If you can&rsquo;t get to the land on a recorded easement or road
        frontage, you don&rsquo;t own it &mdash; you&rsquo;re just paying
        taxes on it. Verify legal access before anything else.
      </CalloutBox>

      <CalloutBox type="heads-up" title="Auto-reject: Active mineral lease">
        If someone has an active oil or gas lease on the property, they have
        the legal right to enter your land and drill. Dormant mineral severance
        is manageable with a surface-use agreement. An active lease is a
        different problem entirely.
      </CalloutBox>

      <CalloutBox type="heads-up" title="Auto-reject: 100-year floodplain">
        FEMA maps tell you whether a property is in the 100-year floodplain
        &mdash; meaning it has a 1% chance of flooding in any given year. That
        sounds small, but over a 30-year ownership it&rsquo;s roughly a
        26% chance. Don&rsquo;t build your home in a flood zone.
      </CalloutBox>

      <h2>Negotiation Basics</h2>

      <p>
        Rural land negotiation is different from buying a house in the suburbs.
        Here are the rules we follow:
      </p>

      <ul className="gw-list">
        <li>
          <strong>Open 10&ndash;15% below asking price.</strong> On
          cold-outreach deals (direct mail), open 20&ndash;30% below the
          county average per acre. Sellers expect negotiation &mdash; your
          first offer is not your final offer.
        </li>
        <li>
          <strong>Always offer cash-equivalent terms.</strong> Even if you
          eventually use a land loan, frame the offer as cash. It makes the
          seller feel more confident and speeds up closing.
        </li>
        <li>
          <strong>Offer to pay closing costs.</strong> This typically adds
          $1,000&ndash;$1,500 to your out-of-pocket but makes the seller feel
          like they&rsquo;re netting more. It&rsquo;s cheap leverage.
        </li>
        <li>
          <strong>Walk away at least twice.</strong> Your best negotiating
          position is the credible ability to leave. If you haven&rsquo;t been
          willing to walk, the seller knows it. Walk on something small, come
          back on something bigger.
        </li>
        <li>
          <strong>Never put more than $2,000 earnest money down</strong> before
          your inspection contingencies are cleared. The earnest money is at
          risk. Keep it low until you&rsquo;ve done your due diligence.
        </li>
      </ul>

      <CalloutBox type="pro-tip">
        The best sweetener you can offer a rural seller isn&rsquo;t always more
        money. Sometimes it&rsquo;s a longer close timeline so they can find
        their next place, or letting them keep the current hay crop through the
        season. Ask what matters to them before you assume it&rsquo;s price.
      </CalloutBox>
    </GWLayout>
  );
}
