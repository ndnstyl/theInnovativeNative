import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import StatCard from "@/components/generational-wealth/StatCard";

export default function SystemsPage() {
  return (
    <GWLayout
      title="Water, Power &amp; Systems &mdash; Making the Land Livable"
      lastVerified="April 2026"
      readingTime="8 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-systems.jpg"
        imageAlt="Solar panels on rural property"
      />
      <h1>Water, Power &amp; Systems &mdash; Making the Land Livable</h1>

      <p>
        Raw land is just dirt until it has water and power. Before a single
        wall goes up, we need a working well and a plan for electricity. This
        page covers those two systems and the water rights rules that govern
        both Oklahoma and Texas.
      </p>

      <h2>Water First</h2>

      <CalloutBox type="family-note">
        No water = no homestead. This is always step one after buying the land.
        Before we hire an electrician, before we order the building kit, we
        call a well driller. Everything else waits on water.
      </CalloutBox>

      <p>
        In eastern Oklahoma, wells typically need to go 250&ndash;300 feet deep
        to reach a reliable aquifer. We&rsquo;re looking for at least 6 gallons
        per minute &mdash; that&rsquo;s the minimum for a family of 4 with
        some irrigation capacity.
      </p>

      <p>
        Well drilling is fully contracted &mdash; it requires a licensed driller
        and specialized equipment. Budget around $14,000 for drilling, casing,
        and the pump system. After the driller is done, Mike installs the
        pressure tank and plumbs to the house himself.
      </p>

      <h3>When We Need a Cistern (and When We Don&rsquo;t)</h3>

      <p>
        Cistern is a decision driven by well yield, not a default. The
        rule:
      </p>

      <ul className="gw-list">
        <li>
          <strong>Well yield 6+ GPM:</strong> cistern is optional, mostly
          for resilience and rainwater harvest. Nice to have, not
          mandatory.
        </li>
        <li>
          <strong>Well yield 3 to 5 GPM:</strong> cistern is strongly
          recommended. Buffer the well during peak demand (laundry +
          shower + irrigation simultaneously).
        </li>
        <li>
          <strong>Well yield 2 to 3 GPM:</strong> cistern is mandatory.
          The well alone can&rsquo;t meet family-of-4 peak loads. Cistern
          smooths the supply.
        </li>
        <li>
          <strong>Well yield under 2 GPM:</strong> walk away. The land
          can&rsquo;t reliably support a homestead on this water source
          alone.
        </li>
      </ul>

      <p>
        We&rsquo;re building the cistern regardless because rainwater
        harvest is its own benefit and the cost is moderate ($5K to $8K).
        Two 5,000-gallon polyethylene tanks in series, fed by rainwater
        off the metal roof. Eastern Oklahoma gets 48 to 55 inches of rain
        per year. A 2,000 square foot roof can collect close to 50,000
        gallons annually. The cistern gives us 60+ days of household
        water if the well ever needs work.
      </p>

      <p>
        Cistern water for drinking and cooking goes through a three-stage
        filter: 100-micron pre-filter, UV sterilizer, and a 5-micron carbon
        block. The aquaponics system (covered on the Food page) gets
        unfiltered cistern water because chlorine from municipal sources kills
        the beneficial bacteria that make the whole system work.
      </p>

      <h2>Septic: Conventional vs Aerobic</h2>

      <p>
        Septic system type is determined by soil drainage and county
        requirements. Both options are fully contracted (licensed
        installer required). The decision affects budget by $5K to $7K,
        so worth confirming early.
      </p>

      <ComparisonTable
        headers={["System", "Cost installed", "When it works", "Annual maintenance"]}
        rows={[
          ["Conventional (gravity)", "$5,000 to $8,000", "Good drainage soil (Class 1-3), not too wet, no permit issues", "$0 to $200 (occasional pump-out)"],
          ["Aerobic (mechanical)", "$10,000 to $15,000", "Required where soil drains poorly, near surface water, in some OK counties", "$300 to $500 (mandatory service contract)"],
        ]}
      />

      <h3>How to Know Which One We Need</h3>

      <ol className="gw-list">
        <li>
          <strong>Pull the soil class</strong> from SSURGO (free USDA
          database) for the proposed septic field. Sandy loam = good.
          Clay loam or heavier = marginal.
        </li>
        <li>
          <strong>Order a perk test</strong> ($300 to $600) before
          closing on land. The test measures how fast water drains
          through the soil. A pass means conventional works. A slow
          rate means aerobic.
        </li>
        <li>
          <strong>Call the county health department</strong> and ask:
          what septic types are permitted for residential properties in
          this area, and is aerobic mandatory regardless of soil?
          Some Oklahoma counties require aerobic across the board.
        </li>
      </ol>

      <p>
        If aerobic is required and we budgeted for conventional, that&rsquo;s
        a $5K-$7K surprise. We resolve this during due diligence, not
        during the build.
      </p>

      <CalloutBox type="heads-up" title="Annual maintenance contract is not optional on aerobic">
        Aerobic systems require a state-mandated service contract. The
        installer&rsquo;s service company comes out two to four times a
        year, tests, and reports to the county. Skipping the contract is
        a code violation. Budget $300 to $500 per year for the life of
        the system.
      </CalloutBox>

      <h2>Power</h2>

      <p>
        We&rsquo;re building a solar-first power system. The grid is a backup,
        not the primary source. Here&rsquo;s the setup:
      </p>

      <div className="gw-stat-cards">
        <StatCard value="6 kW" label="Solar panel array (kilowatts of capacity)" />
        <StatCard value="20 kWh" label="Battery bank (LiFePO4 lithium iron phosphate)" />
        <StatCard value="~$16,000" label="Total cost with DIY installation" />
      </div>

      <p>
        A 6-kilowatt solar array is 15&ndash;20 panels, depending on panel
        size. In eastern Oklahoma with an average of 4.5&ndash;5 peak sun
        hours per day, that generates about 27 kilowatt-hours of electricity
        on a typical sunny day. Our family of 4 will use around 20&ndash;25
        kilowatt-hours per day with efficient appliances.
      </p>

      <p>
        LiFePO4 stands for lithium iron phosphate &mdash; it&rsquo;s the safest
        and most durable type of lithium battery for home energy storage. A
        20-kilowatt-hour battery bank stores enough to run the critical loads
        (refrigerator, well pump, aquaponics pump, lights, and internet) for
        2&ndash;3 cloudy days without any solar input.
      </p>

      <p>
        Mike installs the solar panels, racking, and battery system himself.
        The only contracted piece is the final grid-tie inspection &mdash; the
        utility requires a licensed electrician to sign off on the
        interconnection. That costs about $800&ndash;$1,500.
      </p>

      <p>
        We&rsquo;re starting grid-tied in Year 1. That means the solar and
        battery system connects to the utility grid as a backup. If the battery
        runs low during an extended storm, grid power kicks in automatically.
        The goal in Year 2&ndash;3 is to be fully off-grid capable for normal
        operation.
      </p>

      <h2>Cooling &mdash; Zero-Energy Design</h2>

      <p>
        Cooling in hot-humid Oklahoma is its own system and it&rsquo;s big
        enough to have its own page. The short version: we&rsquo;re building
        a <strong>solar chimney</strong> into the barndominium to pull hot
        air out without electricity, paired with a tight envelope and a
        small, efficient mini-split that runs off the solar array. The full
        design &mdash; solar chimney, earth tubes, realistic performance
        numbers, cost breakdown, and how to get the plans stamped &mdash;
        lives on the{" "}
        <a href="/generational-wealth/cooling">Cooling page</a>.
      </p>

      <h2>The Dependency Chain</h2>

      <p>
        We covered this in the Vision page, but it&rsquo;s worth repeating here
        because the systems page is where it gets practical. Every system
        depends on the one above it.
      </p>

      <ol className="gw-list">
        <li><strong>Land</strong> &mdash; determines your water rights, legal access, building options</li>
        <li><strong>Water</strong> &mdash; drill the well before breaking ground on anything else</li>
        <li><strong>Shelter</strong> &mdash; once water is confirmed, build the house</li>
        <li><strong>Power</strong> &mdash; solar and battery go in during or right after shelter phase</li>
        <li><strong>Food</strong> &mdash; aquaponics, trees, and livestock come after you&rsquo;re living on the land</li>
      </ol>

      <p>
        You cannot shortcut this order. If you start the building before you
        confirm water, you might finish a beautiful house on land that has
        no viable well. That happens. We&rsquo;ve read the stories.
      </p>

      <h2>Water Rights</h2>

      <p>
        Water rights in Oklahoma and Texas are very different, and understanding
        them is part of why we&rsquo;re looking at Oklahoma first.
      </p>

      <CalloutBox type="pro-tip">
        Oklahoma&rsquo;s domestic well exemption is one of the biggest reasons
        we&rsquo;re looking there first. You can drill a well and use the water
        for your household, livestock, and up to 3 acres of irrigation with no
        permit required. In Texas, it&rsquo;s more complicated.
      </CalloutBox>

      <ComparisonTable
        headers={["Factor", "Oklahoma", "Texas"]}
        rows={[
          [
            "Household well permit",
            "No permit needed for domestic use (household + livestock + up to 3 acres of irrigation)",
            "Depends on county &mdash; many counties are inside Groundwater Conservation Districts (GCDs) that require registration or permits",
          ],
          [
            "Legal framework",
            "Prior appropriation for surface water; domestic wells exempt from permitting",
            "Rule of Capture for groundwater &mdash; you own what you pump, but GCDs can restrict it",
          ],
          [
            "Aquifer availability",
            "Eastern OK has good groundwater at 250&ndash;300 feet in target counties",
            "East Texas generally good aquifer availability, but GCD rules vary by county",
          ],
          [
            "Surface water (ponds, creeks)",
            "State owns; stock ponds under 15 acre-feet usually exempt",
            "State owns; permits required for dams over 15 acre-feet",
          ],
          [
            "Aquaponics water use",
            "Fits inside the domestic exemption &mdash; system recirculates, low top-off volume",
            "GCD registration may be required even for hobby recirculating systems in some counties",
          ],
          [
            "Our verdict",
            "Cleaner, simpler, preferred",
            "Workable but needs county-level GCD research before choosing a parcel",
          ],
        ]}
      />

      <p>
        The first action after identifying a candidate property is to pull the
        OWRB (Oklahoma Water Resources Board) database for nearby well logs.
        You can see what depth and flow rate neighbors are getting. That&rsquo;s
        your best real-world estimate before you spend $14,000 on a driller.
      </p>
    </GWLayout>
  );
}
