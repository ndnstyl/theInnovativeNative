import type { FirmInputs, RoiResults, PhaseResult, ScenarioResult } from '@/types/roi-calculator';

export function calculateRoi(inputs: FirmInputs): RoiResults {
  const {
    billingRate, numAttorneys, avgRevenuePerCase, billableCapturePct,
    currentCaseload, adminHoursPerWeek, leadsPerMonth, leadConversionPct,
    monthlyMarketingSpend, statusCallsPerWeek, missedDeadlines,
  } = inputs;

  const convRate = leadConversionPct / 100;
  const captureRate = billableCapturePct / 100;

  // === Phase 1: Intake + Deadlines ===
  const improvedConvRate = Math.min(convRate * 1.3, 0.6);
  const currentConversions = leadsPerMonth * convRate;
  const improvedConversions = leadsPerMonth * improvedConvRate;
  const newCasesPerMonth = improvedConversions - currentConversions;
  const p1Annual = newCasesPerMonth * avgRevenuePerCase * 12;

  const p1Insights: string[] = [];
  if (newCasesPerMonth > 0) {
    p1Insights.push(`Faster response could add ${newCasesPerMonth.toFixed(1)} new cases/month`);
  }
  if (missedDeadlines > 0) {
    p1Insights.push(`${missedDeadlines} missed deadline${missedDeadlines > 1 ? 's' : ''} = $${(missedDeadlines * 180000).toLocaleString()} in malpractice exposure`);
  }

  // === Phase 2: Document Assembly + Billing ===
  const currentAdmin = adminHoursPerWeek;
  const improvedAdmin = adminHoursPerWeek * 0.35;
  const hoursRecoveredWeekly = (currentAdmin - improvedAdmin) * numAttorneys;
  const p2HoursRevenue = hoursRecoveredWeekly * billingRate * 52;

  const improvedCapture = Math.min(captureRate + 0.15, 0.95);
  const captureImprovement = improvedCapture - captureRate;
  const monthlyCases = currentCaseload / 12;
  const p2BillingRevenue = captureImprovement * monthlyCases * avgRevenuePerCase * 12;
  const p2Annual = p2HoursRevenue + p2BillingRevenue;

  const p2Insights: string[] = [];
  const leakageLoss = (1 - captureRate) * monthlyCases * avgRevenuePerCase * 12;
  if (leakageLoss > 0) {
    p2Insights.push(`Your firm is losing ~$${Math.round(leakageLoss).toLocaleString()}/year to billing leakage`);
  }
  if (hoursRecoveredWeekly > 0) {
    p2Insights.push(`${hoursRecoveredWeekly.toFixed(1)} hours/week recovered from admin automation`);
  }

  // === Phase 3: Client Communication ===
  const eliminatedCalls = statusCallsPerWeek * 0.8;
  const callHoursSaved = eliminatedCalls * 12 / 60;
  const p3CallRevenue = callHoursSaved * billingRate * 52;

  const manualUpdateSaved = (2 - 0.4) * numAttorneys;
  const p3UpdateRevenue = manualUpdateSaved * billingRate * 52;
  const p3Annual = p3CallRevenue + p3UpdateRevenue;

  const p3Insights: string[] = [];
  if (eliminatedCalls > 0) {
    p3Insights.push(`${Math.round(eliminatedCalls)} fewer status calls/week with automated updates`);
  }

  // === Phase 4: Marketing Engine ===
  let p4Annual = 0;
  const p4Insights: string[] = [];

  if (convRate > 0 && monthlyMarketingSpend > 0) {
    const currentCPA = monthlyMarketingSpend / (leadsPerMonth * convRate);
    const improvedCPA = currentCPA * 0.6;
    const currentClients = leadsPerMonth * convRate;
    const improvedClients = monthlyMarketingSpend / improvedCPA;
    const additionalClients = improvedClients - currentClients;
    p4Annual = additionalClients * avgRevenuePerCase * 12;
    if (additionalClients > 0) {
      p4Insights.push(`Same budget, ${additionalClients.toFixed(1)} more clients/month at $${Math.round(improvedCPA)} CPA`);
    }
  }

  const phases: PhaseResult[] = [
    { name: 'Phase 1: Intake + Deadlines', shortName: 'Intake', annualRoi: p1Annual, insights: p1Insights },
    { name: 'Phase 2: Documents + Billing', shortName: 'Docs/Billing', annualRoi: p2Annual, insights: p2Insights },
    { name: 'Phase 3: Communication', shortName: 'Comms', annualRoi: p3Annual, insights: p3Insights },
    { name: 'Phase 4: Marketing Engine', shortName: 'Marketing', annualRoi: p4Annual, insights: p4Insights },
  ];

  const totalAnnualRoi = phases.reduce((sum, p) => sum + p.annualRoi, 0);

  const scenarios: ScenarioResult[] = [5000, 10000, 15000].map((cost, i) => {
    const labels = ['DIY + Tools', 'Partial Custom', 'Full Custom Build'];
    return {
      label: labels[i],
      cost,
      annualRoi: totalAnnualRoi,
      paybackMonths: totalAnnualRoi > 0 ? cost / (totalAnnualRoi / 12) : 0,
      roiMultiple: cost > 0 ? totalAnnualRoi / cost : 0,
    };
  });

  return {
    phases,
    totalAnnualRoi,
    totalMonthlyRoi: totalAnnualRoi / 12,
    scenarios,
  };
}
