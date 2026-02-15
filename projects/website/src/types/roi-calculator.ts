export type PracticeArea = 'bankruptcy' | 'criminal-defense' | 'administrative';

export interface FirmInputs {
  // Billing & Revenue
  billingRate: number;
  numAttorneys: number;
  avgRevenuePerCase: number;
  billableCapturePct: number; // whole number, e.g. 70 = 70%

  // Caseload & Workload
  currentCaseload: number;
  adminHoursPerWeek: number;

  // Marketing & Intake
  leadsPerMonth: number;
  leadResponseTimeHrs: number;
  leadConversionPct: number; // whole number, e.g. 7 = 7%
  monthlyMarketingSpend: number;

  // Operations
  statusCallsPerWeek: number;
  billingHoursPerWeek: number;
  missedDeadlines: number;
}

export interface PhaseResult {
  name: string;
  shortName: string;
  annualRoi: number;
  insights: string[];
}

export interface ScenarioResult {
  label: string;
  cost: number;
  annualRoi: number;
  paybackMonths: number;
  roiMultiple: number;
}

export interface RoiResults {
  phases: PhaseResult[];
  totalAnnualRoi: number;
  totalMonthlyRoi: number;
  scenarios: ScenarioResult[];
}

export interface FieldMeta {
  key: keyof FirmInputs;
  label: string;
  unit: string;
  tooltip: string;
  proTip?: string;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
}

export interface WizardStepDef {
  title: string;
  subtitle: string;
  icon: string;
  fields: FieldMeta[];
}
