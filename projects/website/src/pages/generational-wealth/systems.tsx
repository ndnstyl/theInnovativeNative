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

      <p>
        We&rsquo;re also building a 10,000-gallon cistern as a backup. A
        cistern is an above-ground water storage tank &mdash; ours will be two
        5,000-gallon polyethylene tanks in series, fed by rainwater off the
        metal roof. Eastern Oklahoma gets 48&ndash;55 inches of rain per year.
        A 2,000 square foot roof can collect close to 50,000 gallons annually.
        The cistern gives us 60+ days of household water if the well ever needs
        work.
      </p>

      <p>
        Cistern water for drinking and cooking goes through a three-stage
        filter: 100-micron pre-filter, UV sterilizer, and a 5-micron carbon
        block. The aquaponics system (covered on the Food page) gets
        unfiltered cistern water because chlorine from municipal sources kills
        the beneficial bacteria that make the whole system work.
      </p>

      <h2>Septic</h2>

      <p>
        We&rsquo;re installing an aerobic septic system, which is required by
        many Oklahoma counties and is the right choice for rural land anyway.
        Here&rsquo;s the difference: a conventional septic system just
        separates solids and sends liquid to a drain field. An aerobic system
        adds oxygen into the treatment process, which breaks down waste much
        more thoroughly. The output is cleaner, which means you can use it
        for subsurface irrigation on your property.
      </p>

      <p>
        Septic install is fully contracted &mdash; state law requires a
        licensed installer in both Oklahoma and Texas. Budget around $12,000.
        The county issues a permit and inspects the work before sign-off.
      </p>

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
