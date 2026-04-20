import React from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import CalloutBox from "@/components/generational-wealth/CalloutBox";
import ComparisonTable from "@/components/generational-wealth/ComparisonTable";
import ContactCard from "@/components/generational-wealth/ContactCard";
import CostCalculator from "@/components/generational-wealth/CostCalculator";
import StatCard from "@/components/generational-wealth/StatCard";
import { T } from "@/components/generational-wealth/TooltipTerm";

export default function FinancingPage() {
  return (
    <GWLayout
      title="Money & Financing — The Budget and How to Pay for It"
      readingTime="10 min"
    >
      <PageCover imageSrc="/images/generational-wealth/cover-financing.jpg" imageAlt="Financial planning for homestead" />
      <h1>Money &amp; Financing — The Budget and How to Pay for It</h1>

      <CalloutBox type="the-law">
        This page is educational — it is not financial advice. Loan programs, interest
        rates, and eligibility rules change. Talk to a licensed lender before making any
        financing decisions.
      </CalloutBox>

      <p className="gw-lead">
        We have roughly $275,000 in reserves. This page explains how we think about
        using that money — and why the smartest move might be to borrow most of it
        instead of spending it.
      </p>

      <h2>The Total Budget at a Glance</h2>

      <div className="gw-stat-cards">
        <StatCard value="$272,200" label="Total all-in project budget" />
        <StatCard value="$57,500" label="Land acquisition target" />
        <StatCard value="$50,000" label="Shell (post-frame barndo kit + erection)" />
        <StatCard value="$25,000" label="Contingency — do not touch unless you need it" />
        <StatCard value="$275K" label="Cash reserves — kept intact if we borrow" />
        <StatCard value="4 years" label="Full build-out timeline" />
      </div>

      <p>
        The $272,200 number is not random. That is the current{" "}
        <T>USDA</T> direct loan limit for a single-family home in rural areas. The whole
        plan is designed to fit inside that ceiling so that one loan covers the entire
        project — land, house, infrastructure — without having to refinance or layer
        multiple loans on top of each other.
      </p>

      <h2>Three Ways to Pay for This</h2>

      <p>
        We have three realistic paths. Each one works. They have different tradeoffs.
      </p>

      <h3>Path 1: All Cash</h3>
      <p>
        We have the reserves to pay cash for everything. No loan, no lender, no monthly
        payment. On paper, this sounds like the simplest option. The problem is that
        it burns your entire safety net. If something goes wrong — a health emergency,
        a job change, a bad crop year — you have nothing left to fall back on. Cash is
        your insurance policy. Spending it on dirt is risky.
      </p>

      <h3>Path 2: USDA Direct Loan (0% Down)</h3>
      <p>
        The USDA Rural Development Section 502 Direct Loan program is the best deal in
        American real estate for people who qualify. It is a government loan with
        0% down, a subsidized interest rate as low as 1%, and a 33-year repayment term.
        Your monthly payment on $272,200 at 1% is under $900. That is less than rent
        almost anywhere in the country.
      </p>
      <p>
        The catch: income limits. This program targets lower-to-moderate income households.
        Limits vary by county and household size — check the USDA eligibility map in
        the contacts section. If you earn too much, you move to Path 3.
      </p>

      <h3>Path 3: Owner Financing</h3>
      <p>
        Owner financing means the seller acts as the bank. You pay them directly — usually
        with a small down payment and monthly payments over 5-15 years. No traditional
        lender involved. This is common in rural land deals, especially when the seller
        has owned the land for decades and doesn&rsquo;t need all the cash at once.
      </p>
      <p>
        Owner financing works best for the land portion only. Getting seller financing on
        a construction project is unusual. But for raw land? Sellers who want a steady
        income stream often prefer it. Always have a real estate attorney review the
        contract.
      </p>

      <h2>Comparing the Paths</h2>

      <ComparisonTable
        headers={["Path", "Down Payment", "Rate", "Monthly Payment", "Reserves Intact"]}
        rows={[
          ["All Cash", "100%", "0%", "$0", "No — depleted"],
          ["USDA Section 502 Direct", "0%", "As low as 1%", "~$825/mo", "Yes — $275K safe"],
          ["USDA Guaranteed / Conv.", "0–10%", "Market rate", "~$1,400/mo", "Mostly"],
          ["Owner Finance (land only)", "10–20%", "6–8%", "Varies", "Mostly"],
        ]}
      />

      <CalloutBox type="family-note">
        The big reason to borrow instead of pay cash: your $275,000 in reserves becomes
        your emergency fund, your opportunity fund, and your peace of mind. A $900
        monthly payment is manageable. Running out of money in Year 2 of a four-year
        build because something broke — that is a crisis. Keep the cash. Take the loan.
      </CalloutBox>

      <h2>USDA Loan Programs — What You Need to Know</h2>

      <p>
        The USDA has two main home loan programs. They work differently and serve
        different income levels.
      </p>

      <h3>Section 502 Direct Loan</h3>
      <p>
        Administered directly by the government. Low income limits. The lowest possible
        rates — sometimes 1% after subsidies. Best deal if you qualify. Apply through
        your local USDA Rural Development office.
      </p>

      <h3>Section 502 Guaranteed Loan</h3>
      <p>
        The government guarantees the loan, but a private lender (bank or mortgage
        company) actually makes it. Higher income limits than the direct program.
        Rates are close to conventional mortgage rates — but 0% down is still possible.
        This is what most people call a &ldquo;USDA loan&rdquo; when talking to
        a mortgage broker.
      </p>

      <h3>Single-Close Construction Loan</h3>
      <p>
        A <T>Single-Close</T> construction loan wraps land + construction + permanent
        mortgage into one closing. You lock your interest rate upfront, go through
        the paperwork once, and the loan converts automatically when construction is
        done. This is what we want if we&rsquo;re building a barndominium — not all
        lenders do this, so you have to find ones that specialize in it.
      </p>

      <h2>Use the Budget Calculator</h2>

      <p>
        Plug in your acreage and price per acre to see how much budget you have
        left for the build after buying the land.
      </p>

      <CostCalculator mode="budget" />

      <h2>Verified Lenders</h2>

      <p>
        These lenders have been researched and confirmed to offer USDA or barndo-friendly
        construction loans in Oklahoma and Texas. Call at least two before deciding.
      </p>

      <div className="gw-contacts__grid">
        <ContactCard
          name="The Federal Savings Bank / USDA Nationwide"
          agency="Mortgage Lender"
          phone="(844) 999-0639"
          website="https://www.usdanationwide.com/usda-construction-loans"
          description="Largest remaining USDA single-close construction lender. Barndominium-friendly. All 50 states."
          category="lenders"
        />
        <ContactCard
          name="District Lending"
          agency="Mortgage Lender"
          phone="(888) 210-3964"
          website="https://districtlending.com/barndominium-financing/"
          description="Barndominium specialists. USDA construction-to-perm loans. OK + TX confirmed."
          category="lenders"
        />
        <ContactCard
          name="Hurst Lending"
          agency="Mortgage Lender"
          phone="(877) 292-7350"
          website="https://hurstlending.com/financing-a-barndominium-construction-project/"
          description="Dallas-based. Barndo construction program. Note: max 10 acres per loan — plan accordingly."
          category="lenders"
        />
        <ContactCard
          name="Oklahoma USDA Rural Development"
          agency="USDA Rural Development"
          phone="(800) 522-3819"
          address="100 USDA Suite 108, Stillwater, OK 74074"
          website="https://www.rd.usda.gov/ok/oklahoma-contacts"
          description="Direct USDA home loans (Section 502). For lower-income borrowers — 0% down, rates as low as 1%."
          category="lenders"
        />
      </div>

      <h2>The Ag Exemption — Don&rsquo;t Miss This</h2>

      <p>
        The day you close on agricultural land, file for the{" "}
        <T>Ag Exemption</T> at the county assessor&rsquo;s office. In Oklahoma, this
        exemption can cut your property taxes by 60-80%. Instead of being taxed at market
        value, the land is assessed at its agricultural production value — which is
        dramatically lower.
      </p>
      <p>
        You need to prove the land is being used for agriculture. Getting your farm number
        from FSA is step one. Showing a management plan from a forester is step two.
        Running livestock or growing trees counts. Do this early — waiting costs you
        money every year.
      </p>

      <CalloutBox type="heads-up" title="Barndominium Appraisal Warning">
        Barndominiums can be hard to appraise because there are not many comparable sales
        in rural areas. Some lenders have tightened their requirements after 2023. When
        you call a lender, ask specifically: &ldquo;Do you do USDA construction loans
        for post-frame metal buildings?&rdquo; If they hesitate, call the next one.
        The lenders listed above have been vetted for this.
      </CalloutBox>
    </GWLayout>
  );
}
