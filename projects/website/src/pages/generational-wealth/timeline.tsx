import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import StatCard from "@/components/generational-wealth/StatCard";
import StepProcess from "@/components/generational-wealth/StepProcess";
import timelineData from "@/data/gw-timeline.json";

interface Phase {
  id: string;
  phase: string;
  quarter: string;
  title: string;
  months: string;
  budget: number;
  cumulativeBudget: number;
  reservesRemaining: number;
  activities: string[];
  deliverable: string;
  gate: string;
}

const phases: Phase[] = (timelineData as { phases: Phase[] }).phases;

function formatDollars(n: number): string {
  if (n >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return "$" + Math.round(n / 1000) + "K";
  return "$" + n;
}

const timelineSteps = phases.map((phase, index) => ({
  number: index + 1,
  title: `${phase.phase} ${phase.quarter} — ${phase.title}`,
  time: phase.months,
  description: [
    `Budget this phase: ${formatDollars(phase.budget)}`,
    `Cumulative spend: ${formatDollars(phase.cumulativeBudget)}`,
    `Reserves remaining: ${formatDollars(phase.reservesRemaining)}`,
    "",
    "What happens:",
    ...phase.activities.map((a) => `• ${a}`),
    "",
    `Deliverable: ${phase.deliverable}`,
    "",
    `Gate check: ${phase.gate}`,
  ].join("\n"),
}));

export default function TimelinePage() {
  return (
    <GWLayout title="Timeline — The Full Plan, Quarter by Quarter" readingTime="8 min">
      <PageCover imageSrc="/images/generational-wealth/cover-timeline.jpg" imageAlt="Building progress on homestead" />
      <h1>Timeline — The Full Plan, Quarter by Quarter</h1>

      <p className="gw-lead">
        Here&rsquo;s the whole journey laid out quarter by quarter. It&rsquo;s a lot —
        but remember, you don&rsquo;t do it all at once. Each quarter has one or two
        main things to focus on. The rest is planning for the next step.
      </p>

      <CalloutBox type="family-note">
        The first 6 months are just finding and buying the land. The building
        doesn&rsquo;t start until after that. If you&rsquo;re feeling overwhelmed
        looking at this page, start at Step 1 and only think about that. The rest
        will be here when you&rsquo;re ready.
      </CalloutBox>

      <div className="gw-stat-cards">
        <StatCard value="~4 years" label="Full build-out to move-in" />
        <StatCard value="$272,200" label="Total all-in budget" />
        <StatCard value="90% DIY" label="Most of the work is our hands" />
        <StatCard value="Month 22-24" label="Target move-in" />
      </div>

      <h2>The Full Timeline</h2>

      <p>
        Click any phase to expand the details — what happens, how much it costs,
        what you need to have done before moving forward.
      </p>

      <StepProcess steps={timelineSteps} />

      <h2>Budget by Phase</h2>

      <p>
        Here is a quick look at how the money flows across the whole project:
      </p>

      <div className="gw-timeline__budget-table">
        <table className="gw-table">
          <thead>
            <tr>
              <th>Phase</th>
              <th>Title</th>
              <th>Phase Budget</th>
              <th>Cumulative</th>
              <th>Reserves Left</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((phase) => (
              <tr key={phase.id}>
                <td>
                  {phase.phase} {phase.quarter}
                </td>
                <td>{phase.title}</td>
                <td>{phase.budget === 0 ? "—" : formatDollars(phase.budget)}</td>
                <td>{formatDollars(phase.cumulativeBudget)}</td>
                <td>{formatDollars(phase.reservesRemaining)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Gates — When to Pause and Check</h2>

      <p>
        Every phase has a &ldquo;gate check&rdquo; — a question to answer before
        moving forward. These are decision points, not deadlines. If a gate fails,
        the plan adjusts. That&rsquo;s normal. Here are the most important ones:
      </p>

      <ul className="gw-list">
        {phases
          .filter((p) => p.gate)
          .map((p) => (
            <li key={p.id}>
              <strong>
                {p.phase} {p.quarter}:
              </strong>{" "}
              {p.gate}
            </li>
          ))}
      </ul>

      <CalloutBox type="pro-tip">
        The timeline assumes you are living in a travel trailer on the property starting
        in Year 0, Quarter 3. This is not optional — it cuts housing costs to near zero,
        lets you work on the property daily, and dramatically compresses the build timeline.
        If you&rsquo;re paying rent somewhere else while building, add 12-18 months to
        everything.
      </CalloutBox>

      <CalloutBox type="family-note">
        This plan is aggressive. It is designed to be done mostly by Mike, with help on
        the dangerous stuff (electrical tie-in, structural erection, septic). If life
        happens — a health issue, a job change, a long rainy season — the plan bends.
        That&rsquo;s fine. The goal is not to finish on Day 730. The goal is to finish
        with the land paid for, the house standing, and the family on site.
      </CalloutBox>
    </GWLayout>
  );
}
