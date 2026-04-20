import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";

export default function FoodPage() {
  return (
    <GWLayout
      title="Food Systems &mdash; Growing What We Eat"
      lastVerified="April 2026"
      readingTime="8 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-food.jpg"
        imageAlt="Aquaponics greenhouse with growing vegetables"
      />
      <h1>Food Systems &mdash; Growing What We Eat</h1>

      <p>
        Food is the last system we build, but it&rsquo;s the one that makes
        the homestead feel like a homestead. This page covers the three food
        tracks we&rsquo;re running: aquaponics, agroforestry (trees), and
        livestock.
      </p>

      <CalloutBox type="family-note">
        We&rsquo;re not trying to become full-time farmers. We&rsquo;re
        building a system that feeds the family while Mike keeps running the
        business. The goal is 40&ndash;50% food self-sufficiency by Year 5
        &mdash; not 100%. One hundred percent is unrealistic and would consume
        every hour of every day. Forty to fifty percent is meaningful, doable,
        and leaves room for a real life.
      </CalloutBox>

      <h2>The Goal</h2>

      <p>
        By Year 2, we want to be producing about 40% of the family&rsquo;s
        food from the land. By Year 5, we&rsquo;re targeting 50% or more. The
        remaining half we buy &mdash; and that&rsquo;s fine. We&rsquo;re not
        isolating, we&rsquo;re reducing dependency and building skills.
      </p>

      <p>
        The 40% number comes from stacking the three food systems together.
        Aquaponics handles year-round protein and vegetables. Trees handle
        fruit and nuts on a slower timeline. Livestock handles eggs and
        lamb starting Year 2. None of them alone gets you to 40%. All three
        together do.
      </p>

      <h2>Aquaponics</h2>

      <p>
        Aquaponics is a closed-loop food production system that grows fish and
        vegetables together. The fish produce waste. Bacteria in the water
        convert that waste into nutrients. Plants absorb those nutrients and
        clean the water. The clean water goes back to the fish. Round and round
        it goes, 24 hours a day, year-round.
      </p>

      <p>
        We&rsquo;re growing Blue Tilapia. They&rsquo;re the right species for
        this climate because they can survive water temperatures down to 47
        degrees Fahrenheit, which means they&rsquo;re far more forgiving when
        the greenhouse gets cold during an Oklahoma ice storm.
      </p>

      <p>
        The system lives in a greenhouse attached to the south wall of the
        house. The greenhouse shares thermal mass with the house, which cuts
        winter heating costs for the fish tanks. We stock the greenhouse with
        tilapia plus whatever vegetables are in season: lettuce, basil, kale,
        tomatoes, cucumbers.
      </p>

      <p>
        Total build cost for the Tier 2 production system is around $6,000,
        DIY. We build this in Year 2 after we&rsquo;re living on the land.
      </p>

      <ExpandableSection title="How the aquaponics cycle actually works">
        <p>
          Here&rsquo;s the step-by-step of what&rsquo;s happening inside the
          system every single day:
        </p>
        <ol>
          <li>
            <strong>Fish produce waste.</strong> Every time a tilapia eats and
            digests, it produces ammonia through its gills and in its waste.
            Ammonia in high concentrations is toxic to fish.
          </li>
          <li>
            <strong>Bacteria convert the ammonia.</strong> Beneficial bacteria
            called Nitrosomonas and Nitrobacter live in the grow media (the
            gravel or clay pebbles in the plant beds). They convert ammonia to
            nitrite, then nitrite to nitrate. Nitrate is plant food.
          </li>
          <li>
            <strong>Plants absorb the nitrate.</strong> The plant roots hang
            into the water in the grow beds. They pull out the nitrate and
            use it for growth. A head of lettuce in aquaponics reaches harvest
            in about 30 days.
          </li>
          <li>
            <strong>Clean water returns to the fish.</strong> After the plants
            have filtered the nutrients out, the water is clean enough for the
            fish. It drains back to the fish tank and the cycle starts over.
          </li>
        </ol>
        <p>
          The critical phase is the first 6&ndash;8 weeks, called the nitrogen
          cycle. You&rsquo;re establishing the bacterial colony. Water chemistry
          gets tested daily during this period &mdash; ammonia, nitrite,
          nitrate, and pH. Once the cycle is stable, daily testing drops to
          a quick weekly check.
        </p>
        <p>
          We use IBC totes for the fish tanks &mdash; those big 275-gallon
          plastic containers you see at farm supply stores. Used food-grade
          totes cost $80&ndash;$120 each in rural Oklahoma and Texas. Easy
          to cut, connect, and plumb with basic tools.
        </p>
      </ExpandableSection>

      <h2>Trees</h2>

      <p>
        Trees are the long game. We plant them in Year 1 and most of them
        won&rsquo;t produce meaningful harvests for 5&ndash;10 years. But
        a tree you plant today is a tree that&rsquo;s feeding your family
        in 2031.
      </p>

      <p>
        We&rsquo;re planting 60 bare-root trees in the first dormant season
        after closing on the land &mdash; November through February is the
        window. Bare-root trees are cheaper than container-grown trees and
        actually establish better when planted dormant.
      </p>

      <p>
        The species mix for eastern Oklahoma:
      </p>

      <ul className="gw-list">
        <li>
          <strong>Pecan (10&ndash;12 trees)</strong> &mdash; This is the
          long game inside the long game. Pecans don&rsquo;t produce a
          meaningful harvest until Year 5&ndash;7, and they don&rsquo;t hit
          full production until Year 10+. But mature pecan trees produce
          hundreds of pounds of nuts per tree per year. The Oklahoma Forestry
          Services sells bare-root pecans cheap. Plant them first.
        </li>
        <li>
          <strong>Black walnut (6&ndash;8 trees)</strong> &mdash; Even longer
          timeline than pecans for nuts, but walnut timber is worth real money
          at Year 25+. These are legacy trees for the daughters.
        </li>
        <li>
          <strong>Persimmon (8&ndash;10 trees)</strong> &mdash; American
          persimmons are native to eastern Oklahoma, extremely cold-hardy,
          and produce fruit starting Year 3&ndash;5. Wildlife also love them,
          which helps with deer management.
        </li>
        <li>
          <strong>Mulberry (6&ndash;8 trees)</strong> &mdash; Fast producers.
          Some mulberry trees fruit in Year 2 after planting. Great for fresh
          eating, pies, and as high-protein chicken feed.
        </li>
        <li>
          <strong>Plum (6&ndash;8 trees)</strong> &mdash; Chickasaw plums are
          native to the region. Hardy, productive by Year 3, and not
          something you normally find at a grocery store in useful quantities.
        </li>
        <li>
          <strong>Nitrogen fixers (10&ndash;15 trees)</strong> &mdash;
          Black locust and Siberian pea shrub pull nitrogen from the air and
          put it in the soil. Plant these between your fruit and nut trees
          and they fertilize everything around them for free.
        </li>
      </ul>

      <p>
        Every tree gets a tree tube on planting day. Tree tubes protect the
        young tree from deer browse, which in eastern Oklahoma is a real
        threat. Deer will eat a $15 bare-root tree down to a stick overnight.
        A $3 tree tube saves the tree.
      </p>

      <h2>Livestock</h2>

      <p>
        Livestock starts in Year 2, after we&rsquo;re settled and the fencing
        is in. We&rsquo;re starting simple &mdash; animals that are forgiving
        for beginners and produce food quickly.
      </p>

      <p>
        <strong>Hair sheep (8&ndash;10 ewes).</strong> We&rsquo;re using
        Katahdin or Dorper sheep &mdash; both are hair breeds, meaning they
        don&rsquo;t grow wool and don&rsquo;t need shearing. They&rsquo;re
        also more parasite-resistant than wooled breeds, which matters a lot
        in the hot-humid south. Eight ewes producing one lamb each per year
        gives you about 240&ndash;320 pounds of lamb, depending on breed and
        finishing weight.
      </p>

      <p>
        <strong>Livestock guardian dog (1 dog, Year 1).</strong> One LGD
        &mdash; livestock guardian dog &mdash; stays with the sheep 24/7 and
        protects them from coyotes and dogs. Great Pyrenees or Anatolian
        Shepherd are the most common breeds for this. You get the dog before
        you get the sheep. It needs time to bond with the land and establish
        its patrol territory.
      </p>

      <p>
        <strong>Laying hens (12 birds).</strong> Twelve laying hens produce
        8&ndash;10 eggs per day during peak season. That&rsquo;s nearly a dozen
        eggs every day. Chickens are the easiest livestock to manage, cost
        almost nothing to feed on pasture, and eat bugs. They follow the sheep
        in a rotational grazing pattern &mdash; the sheep graze a paddock first,
        then 3 days later the chickens come through and eat the parasite larvae
        that the sheep left behind.
      </p>

      <p>
        <strong>Rotational grazing</strong> is the management system that ties
        the livestock together. Instead of letting animals graze one pasture
        continuously, you divide the land into paddocks (sections) and rotate
        the animals through them. Each paddock gets 30&ndash;60 days to rest
        and regrow between grazing periods. The land gets healthier every
        year, the animals stay healthier, and you need less hay in winter.
      </p>

      <h2>What We&rsquo;ll Harvest</h2>

      <p>
        Here is the projected food output from Year 2 through Year 5. These
        numbers are conservative &mdash; they assume one fish harvest cycle
        per year and a small initial aquaponics setup. Production increases
        as we optimize the system.
      </p>

      <ComparisonTable
        headers={["Year", "Fish (lbs)", "Eggs (dozen)", "Vegetables (lbs)", "Lamb (lbs)", "Fruit"]}
        rows={[
          ["Year 2", "50–80", "200–250", "200–300", "0", "Mulberry + persimmon starting"],
          ["Year 3", "100–150", "250–300", "400–600", "120–180", "Plum, persimmon, mulberry"],
          ["Year 4", "150–200", "300–350", "500–800", "200–280", "All fruit species producing"],
          ["Year 5", "200+", "300–350", "500–800+", "240–320", "First pecan yield possible"],
        ]}
      />

      <p>
        Year 2 fish numbers are lower because we&rsquo;re still cycling the
        system and learning the management. By Year 4, the aquaponics is in
        its stride at around 200 pounds of tilapia per year. That&rsquo;s
        roughly 16 pounds of fish per month for a family of 4 &mdash; a
        meaningful share of protein.
      </p>

      <CalloutBox type="pro-tip">
        The aquaponics system needs to be registered with the Oklahoma
        Department of Agriculture, Food and Forestry (ODAFF) if you&rsquo;re
        in Oklahoma &mdash; even for hobby use. The ODAFF aquaculture license
        costs $50&ndash;$150 per year. In Texas, a recirculating hobby system
        with no discharge to state waters requires no permit at all. File
        before you stock the first fingerlings.
      </CalloutBox>
    </GWLayout>
  );
}
