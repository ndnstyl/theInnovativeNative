import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import StatCard from "@/components/generational-wealth/StatCard";
import StepProcess from "@/components/generational-wealth/StepProcess";

const dependencySteps = [
  {
    number: 1,
    title: "Land",
    description:
      "You can&rsquo;t do anything without land. The land determines your water rights, your building options, and whether the whole plan is even legal. Land is the anchor. Everything else hangs from it.",
  },
  {
    number: 2,
    title: "Water",
    description:
      "No water, no homestead. Before you build a single wall, you need a drilled well and a confirmed water source. A family of 4 needs at least 6&ndash;10 gallons per minute from a well that&rsquo;s 250&ndash;300 feet deep in eastern Oklahoma. Water comes before shelter &mdash; always.",
  },
  {
    number: 3,
    title: "Shelter",
    description:
      "Once you know you have water, you build the house. We&rsquo;re doing a post-frame barndominium &mdash; a metal building shell with a finished residential interior. Faster and cheaper than traditional stick-frame. The goal is to be moved in by the end of Year 1.",
  },
  {
    number: 4,
    title: "Power",
    description:
      "Solar panels and batteries go in during or right after the shelter phase. We&rsquo;re targeting a 6 kilowatt solar array with a 20 kilowatt-hour battery bank. That handles the critical loads &mdash; refrigerator, well pump, lights, and internet &mdash; even without the grid.",
  },
  {
    number: 5,
    title: "Food",
    description:
      "Food systems start in Year 2 after we&rsquo;re living on the land. Aquaponics greenhouse, fruit and nut trees, hair sheep, and laying hens. This phase is the most forgiving because you can adjust as you go. You can&rsquo;t adjust the order of the first four.",
  },
];

export default function VisionPage() {
  return (
    <GWLayout
      title="The Vision &mdash; Why We&rsquo;re Doing This"
      lastVerified="April 2026"
      readingTime="8 min"
    >
      <PageCover
        imageSrc="/images/generational-wealth/cover-vision.jpg"
        imageAlt="Family homestead at sunset"
        videoId="gUnk00ThoVQ"
        videoTitle="The Vision — Why We&rsquo;re Doing This"
      />
      <h1>The Vision &mdash; Why We&rsquo;re Doing This</h1>

      <p>
        This is a plan to build a self-sustaining homestead for a family of 4
        in eastern Oklahoma. No debt. No contractors for anything we can learn.
        A permanent home that our daughters can inherit or sell &mdash; their
        choice, not ours.
      </p>

      <p>
        It&rsquo;s not a fantasy. Every number on this site is real. Every
        strategy has been researched to death. What you&rsquo;re reading is the
        actual plan we&rsquo;re executing.
      </p>

      <h2>Why This Matters</h2>

      <p>
        Mike runs an AI automation business. That business could slow down
        tomorrow. The market could change. Clients come and go. What
        doesn&rsquo;t go away is land you own outright and skills your family
        has built into their hands.
      </p>

      <p>
        We want our daughters to grow up knowing how to grow food, fix things,
        and make decisions when the power is out. Not because we think the world
        is ending &mdash; but because options create confidence. A kid who knows
        she could feed herself is a different person than one who doesn&rsquo;t.
      </p>

      <p>
        This is about building something that outlasts a business cycle and
        gives the next generation a real foundation.
      </p>

      <CalloutBox type="family-note">
        This isn&rsquo;t about going off-grid and disappearing. It&rsquo;s
        about having options. The business keeps running. The kids stay
        connected. We just also happen to have a piece of land that feeds us
        and belongs to no one but us.
      </CalloutBox>

      <h2>The Hard Numbers</h2>

      <p>
        Here is the plan in numbers. These aren&rsquo;t aspirational &mdash;
        they are the specific targets we&rsquo;re holding ourselves to.
      </p>

      <div className="gw-stat-cards">
        <StatCard value="25 acres" label="Target land size in eastern Oklahoma" />
        <StatCard value="$275K" label="Hard budget cap &mdash; cash, no debt" />
        <StatCard value="90% DIY" label="Share of labor Mike does himself" />
        <StatCard value="2 years" label="From land purchase to move-in" />
        <StatCard value="Year 4" label="Target for food self-sufficiency" />
      </div>

      <p>
        The $275K covers everything: land, well, septic, the building shell,
        insulation, solar, food systems, fencing, tools, and a 10% contingency
        buffer. It does not include living expenses during the build &mdash;
        the business covers that.
      </p>

      <p>
        The 90% DIY number is what makes the budget work. If we hired out all
        the labor, the same project would cost about $65,000 more. We
        can&rsquo;t afford that. So Mike learns the skills and does the work.
      </p>

      <h2>The Order of Everything</h2>

      <p>
        This is the part most people skip, and it&rsquo;s why homestead
        projects fail. Each system depends on the one before it. You cannot
        build the house before you have water. You cannot run food systems
        before you have shelter. The dependency chain is real.
      </p>

      <StepProcess steps={dependencySteps} />

      <h2>Who&rsquo;s Involved</h2>

      <p>
        This is a family project. Every person has a role, and we made those
        roles clear before we started planning.
      </p>

      <ul className="gw-list">
        <li>
          <strong>Mike</strong> &mdash; lead builder, primary labor, handles
          all capital decisions and construction. Runs the business in parallel
          during the build.
        </li>
        <li>
          <strong>Wife</strong> &mdash; co-decision on all major purchases and
          property selection. Manages family operations, food preservation, and
          the ag exemption paperwork. No decision gets made without her sign-off.
        </li>
        <li>
          <strong>Teen daughters</strong> &mdash; both are being brought into
          the plan now, not after the fact. One is taking on poultry operations
          as her own project. The other is focused on the aquaponics plant side.
          They both learn the basics: first aid, chainsaw safety, basic
          electrical literacy, and how to read a soil test.
        </li>
      </ul>

      <p>
        The whole family walked the property decision tree before we committed.
        If the teens had said no, we would have waited. They didn&rsquo;t.
      </p>

      <h2>What Success Looks Like</h2>

      <p>
        By Year 5, here is the picture we&rsquo;re building toward:
      </p>

      <ul className="gw-list">
        <li>
          Family living in a finished 1,200 square foot home they own outright,
          no mortgage, no landlord.
        </li>
        <li>
          A solar and battery system that covers all critical loads, with a
          grid tie as backup for cloudy weeks.
        </li>
        <li>
          An aquaponics greenhouse producing tilapia and vegetables year-round.
        </li>
        <li>
          Sixty trees in the ground &mdash; pecans, walnuts, persimmons,
          mulberries, plums &mdash; some starting to produce.
        </li>
        <li>
          A small flock of hair sheep and laying hens on rotational pasture.
        </li>
        <li>
          Around 40&ndash;50% of the family&rsquo;s food coming from the land.
        </li>
        <li>
          Both daughters with real, transferable skills &mdash; and a property
          they can choose to inherit, sell, or build on.
        </li>
      </ul>

      <p>
        That&rsquo;s the finish line. Everything on this site describes how to
        get there, one decision at a time.
      </p>
    </GWLayout>
  );
}
