import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import StatCard from "@/components/generational-wealth/StatCard";
import StepProcess from "@/components/generational-wealth/StepProcess";
import ExpandableSection from "@/components/generational-wealth/ExpandableSection";
import { T } from "@/components/generational-wealth/TooltipTerm";

const trustSteps = [
  {
    number: 1,
    title: "Buy the land in your personal name",
    time: "At closing",
    description:
      "This is the simplest path for financing, title insurance, and claiming the homestead exemption. USDA loans, conventional mortgages, and owner financing all work best with an individual buyer. Sellers in rural OK and TX prefer dealing with a person, not an LLC.",
  },
  {
    number: 2,
    title: "File homestead + ag exemptions immediately",
    time: "Day of closing",
    description:
      "Same-day file: homestead exemption at the county assessor, agricultural exemption (OTC 994 in OK), and get your farm number from FSA. These protect your property taxes from Day 1.",
  },
  {
    number: 3,
    title: "Hire an estate planning attorney",
    time: "Within 90 days",
    description:
      "You need an attorney who has done trust + LLC for agricultural land in your state. Not a general practice lawyer — someone who knows rural property, mineral rights provisions, and ag exemption continuity. Budget $2,000–$3,500 for the full package.",
  },
  {
    number: 4,
    title: "Create the revocable living trust",
    time: "Within 90 days",
    description:
      "The attorney drafts your revocable living trust. You are the grantor, trustee, and initial beneficiary. Your wife is successor trustee, then your eldest daughter. The trust names your daughters as final beneficiaries. Include provisions for mineral rights, conditions on sale, and a pour-over will to catch anything not in the trust.",
  },
  {
    number: 5,
    title: "Transfer the property deed to the trust",
    time: "Same day as trust signing",
    description:
      "Record a new deed transferring the property from 'Mike Soto' to 'Mike Soto, as Trustee of the [Soto Family] Trust.' This is exempt from Oklahoma documentary stamp tax when the grantor is the sole beneficiary. Notify the county assessor to confirm homestead and ag exemptions continue.",
  },
  {
    number: 6,
    title: "Form the LLC for farm operations",
    time: "Within 6 months",
    description:
      "File Articles of Organization with the state ($100 in OK, $300 in TX). Get an EIN from the IRS (free). Create an operating agreement. The LLC operates the agricultural business ON the land — receiving farm income, paying expenses, carrying liability insurance. The LLC does NOT own the land.",
  },
  {
    number: 7,
    title: "Create a lease between trust and LLC",
    time: "After LLC formation",
    description:
      "The trust (as landlord) leases the land to the LLC (as tenant) for nominal rent. This creates a clean legal boundary: the trust holds the generational asset, the LLC operates the business. If someone sues the farm business, they can't reach the land in the trust.",
  },
];

export default function LegalStructurePage() {
  return (
    <GWLayout
      title="Legal Structure — Trust, LLC & Tax Strategy"
      lastVerified="April 2026"
      readingTime="12 min"
    >
      <PageCover imageSrc="/images/generational-wealth/cover-legal.jpg" imageAlt="Legal documents and family estate planning" />
      <h1>Legal Structure — Trust, LLC &amp; Tax Strategy</h1>

      <CalloutBox type="the-law">
        This page describes legal structures and tax strategies based on publicly
        available information. It is NOT legal or tax advice. The specifics depend
        on your state, your family situation, and your finances. Hire an estate
        planning attorney and a CPA with agricultural experience before executing
        any of this. See the Contacts page for recommendations.
      </CalloutBox>

      <p className="gw-lead">
        The strategy is simple in concept: buy the land personally for the
        easiest financing, then wrap it in a trust so it passes to your children
        without probate court, and run the farm business through an LLC for
        liability protection and tax flexibility.
      </p>

      <h2>Why This Structure?</h2>

      <ComparisonTable
        headers={["Goal", "How We Achieve It"]}
        rows={[
          ["Easiest financing at purchase", "Buy in personal name — USDA loans, owner financing all simpler"],
          ["Avoid probate at death", "Revocable living trust — property transfers to daughters automatically"],
          ["Keep control during lifetime", "You are the trustee — nothing changes day-to-day"],
          ["Protect land from business lawsuits", "LLC operates the farm, trust owns the land — separate entities"],
          ["Minimize property taxes", "Homestead + ag exemption both preserved in trust"],
          ["Zero estate tax", "Federal exemption is $13.6M+ — well above our estate size"],
          ["Stepped-up basis at death", "Daughters inherit at current market value — all prior gains erased"],
          ["Borrow against equity when needed", "Revocable trust allows mortgages and HELOCs on trust property"],
        ]}
      />

      <h2>The Step-by-Step Process</h2>

      <StepProcess steps={trustSteps} />

      <h2>The Revocable Living Trust — Explained Simply</h2>

      <p>
        A trust is just a legal container for your stuff. You create it, you
        put the land in it, and you write the rules for what happens to it. A
        <strong> revocable</strong> trust means you can change the rules anytime
        during your lifetime. You stay in full control.
      </p>

      <ComparisonTable
        headers={["Role", "Who"]}
        rows={[
          ["Grantor (creator)", "Mike"],
          ["Trustee (manager during your lifetime)", "Mike"],
          ["Successor Trustee (if you can't manage)", "Wife, then eldest daughter"],
          ["Beneficiaries (who gets it)", "Daughters — equal shares or as you specify"],
        ]}
      />

      <h3>What the Trust Does</h3>
      <ul className="gw-list">
        <li>Holds title to the land and home — your name stays off some public records</li>
        <li>If you become incapacitated, your successor trustee manages without court</li>
        <li>When you pass, property transfers to daughters automatically — no probate</li>
        <li>You can set conditions: &ldquo;land cannot be sold until daughters are 30&rdquo;</li>
      </ul>

      <h3>What the Trust Does NOT Do</h3>
      <ul className="gw-list">
        <li>Does NOT protect from creditors during your lifetime</li>
        <li>Does NOT reduce income taxes (pass-through, same as personal)</li>
        <li>Does NOT reduce estate taxes (but your estate is well under the $13.6M threshold)</li>
        <li>Does NOT protect from Medicaid look-back (revocable trusts are countable)</li>
      </ul>

      <CalloutBox type="pro-tip">
        A properly drafted revocable trust costs $2,000&ndash;$3,500 from an
        attorney. That includes the trust document, pour-over will, power of
        attorney, healthcare directive, and the deed transfer. Compare that to
        probate: $5,000&ndash;$20,000 in fees plus 6&ndash;18 months of waiting.
        The trust pays for itself the day you pass.
      </CalloutBox>

      <h2>The LLC — For the Business, Not the Land</h2>

      <p>
        The LLC exists to operate the farm business &mdash; livestock sales,
        timber revenue, produce, EQIP reimbursements. It does NOT own the land.
        The trust owns the land. The LLC leases it.
      </p>

      <h3>Why Separate?</h3>

      <ul className="gw-list">
        <li><strong>Liability shield</strong> &mdash; if someone gets hurt on the farm or a business deal goes bad, the LLC absorbs the lawsuit, not the trust-held land</li>
        <li><strong>Tax flexibility</strong> &mdash; LLC can elect S-corp taxation when farm income exceeds ~$40K/yr, reducing self-employment tax</li>
        <li><strong>Ag sales tax exemption</strong> &mdash; LLC engaged in farming qualifies for equipment and supply purchase exemptions</li>
        <li><strong>Clean separation</strong> &mdash; land is a generational asset (trust), business is operational (LLC). Different purposes, different structures.</li>
      </ul>

      <div className="gw-stat-cards">
        <StatCard value="$100" label="OK LLC filing fee" />
        <StatCard value="$300" label="TX LLC filing fee" />
        <StatCard value="$0" label="IRS EIN (free)" />
        <StatCard value="$25/yr" label="OK annual report" />
      </div>

      <h2>The Biggest Tax Win — Stepped-Up Basis</h2>

      <CalloutBox type="pro-tip" title="This Is the Single Best Reason to Hold">
        <p>
          When your daughters inherit the land through the trust, their cost
          basis &ldquo;steps up&rdquo; to the fair market value at the time of
          your death. That means ALL of the appreciation during your lifetime
          is never taxed. Ever.
        </p>
        <p>
          Example: You buy land for $57,000. Over 30 years of improvements and
          appreciation, it&rsquo;s worth $400,000. If you sold it, you&rsquo;d
          owe capital gains tax on the $343,000 gain. But if your daughters
          inherit it through the trust, their basis is $400,000. The $343,000
          gain disappears. This is why you hold — never sell — generational land.
        </p>
      </CalloutBox>

      <h2>Tax Reduction Strategies</h2>

      <ComparisonTable
        headers={["Strategy", "How", "Annual Savings"]}
        rows={[
          ["Ag exemption", "File OTC 994, maintain ag use", "40–60% reduction in assessed property value"],
          ["Farm expense deductions", "All ag expenses through LLC", "Dollar-for-dollar income reduction"],
          ["Equipment depreciation", "Barn, fencing, equipment, tractor on Schedule F", "$10K–$20K/yr early years"],
          ["Section 179 deduction", "Full cost of equipment in year purchased", "Up to $1.22M immediate deduction"],
          ["S-corp election", "When farm income >$40K, split salary vs distribution", "Save 15.3% SE tax on distributions"],
          ["Timber capital gains", "Timber held 1+ year gets long-term rate (15%)", "Significant on $10K–$30K sales"],
          ["EQIP exclusion (IRC §126)", "Cost-share payments may be excludable", "Up to 90% of EQIP reimbursement"],
        ]}
      />

      <h2>Oklahoma vs Texas — Legal Differences</h2>

      <ExpandableSection title="Oklahoma Documentary Stamp Tax">
        <p>
          Transfer from you personally to your own trust is <strong>exempt</strong>{" "}
          from Oklahoma documentary stamp tax under 68 O.S. &sect; 3202. The
          exemption applies when the only owners are the transferor, spouse,
          parent, child, or second-degree relative. If you transfer interest to
          someone outside that circle within 1 year, you owe the full tax
          retroactively.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Oklahoma Property Tax Cap">
        <p>
          Oklahoma caps annual increases at 3% for ag/homestead land, 5% for
          other property. The cap lifts when title transfers to &ldquo;another
          person.&rdquo; Transfer to your own revocable trust should NOT
          trigger reassessment (you remain beneficial owner), but this is not
          explicitly confirmed in statute. Verify with your county assessor
          before transferring. If uncertain, transfer immediately after purchase
          before the property appreciates.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Texas — No Documentary Stamp Tax">
        <p>
          Texas does not impose a documentary stamp tax on property transfers.
          Transfer to trust or LLC has no transfer tax. Simpler than Oklahoma.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Texas — No State Income Tax">
        <p>
          LLC income in Texas is only taxed federally. Texas franchise tax
          applies only to businesses with revenue over $2.47M (your farm
          won&rsquo;t hit this). This is a meaningful long-term advantage for
          farm business income.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Both States — Estate Tax">
        <p>
          Federal estate tax exemption is $13.6M+ (2026). Your estate is well
          under this threshold. Neither Oklahoma nor Texas has a state estate
          or inheritance tax. Your daughters will owe <strong>$0</strong> in
          estate taxes on the property.
        </p>
      </ExpandableSection>

      <h2>Borrowing Against Equity</h2>

      <p>
        With a revocable trust, you retain full authority to take out a mortgage,
        home equity loan, or line of credit on trust property. Most lenders treat
        it the same as personally-held property. Some may ask you to temporarily
        transfer the property out of the trust for the closing, then transfer it
        back. This is routine and creates no tax event.
      </p>

      <CalloutBox type="family-note">
        The equity play looks like this: you buy land for $57K&ndash;$225K. You
        build a $100K+ barndominium on it. You add fencing, a pond, established
        pasture, an orchard. By Year 5, the property could be worth $350K&ndash;$500K.
        You can borrow against 70&ndash;80% of that value &mdash; $245K&ndash;$400K
        available &mdash; for business expansion, education, a second property,
        or as an emergency reserve. The land works for you financially while
        you live on it.
      </CalloutBox>

      <h2>What NOT to Do</h2>

      <CalloutBox type="heads-up">
        <ul className="gw-list">
          <li><strong>Don&rsquo;t buy through the LLC.</strong> You lose homestead exemption, USDA loan eligibility, and create financing headaches.</li>
          <li><strong>Don&rsquo;t skip the trust.</strong> Without it, daughters go through probate court — $5K&ndash;$20K in fees, 6&ndash;18 months of waiting.</li>
          <li><strong>Don&rsquo;t use an irrevocable trust too early.</strong> You lose control and borrowing flexibility. Revocable is correct until Medicaid planning becomes relevant (age 60+).</li>
          <li><strong>Don&rsquo;t DIY the trust document.</strong> Online templates miss mineral rights provisions, ag exemption continuity, and state-specific stepped-up basis optimization. Pay the attorney.</li>
          <li><strong>Don&rsquo;t forget to re-title.</strong> The trust only works if the property deed is actually transferred to the trust. An empty trust is a useless trust.</li>
        </ul>
      </CalloutBox>

      <h2>What It Costs</h2>

      <div className="gw-stat-cards">
        <StatCard value="$2K–$3.5K" label="Attorney — full trust package" />
        <StatCard value="$100–$300" label="LLC formation (state filing)" />
        <StatCard value="$500–$1.5K" label="CPA — first-year tax setup" />
        <StatCard value="$3K–$5K" label="Total upfront investment" />
      </div>

      <p>
        Compare that to probate ($5K&ndash;$20K + 6&ndash;18 months), an
        unshielded lawsuit ($50K+ exposure), or overpaying taxes for 20 years.
        This is the highest-ROI money you&rsquo;ll spend on the entire project.
      </p>
    </GWLayout>
  );
}
