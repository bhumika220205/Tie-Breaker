export interface ProConItem {
  id: string;
  text: string;
  category: string;
  weight: number; // 1 to 5
  impact: string;
}

export interface SWOTCategoryItem {
  title: string;
  detail: string;
}

export interface OptionSWOT {
  strengths: SWOTCategoryItem[];
  weaknesses: SWOTCategoryItem[];
  opportunities: SWOTCategoryItem[];
  threats: SWOTCategoryItem[];
}

export interface DecisionOption {
  id: string;
  name: string;
  tagline: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: OptionSWOT;
}

export interface DimensionScore {
  optionId: string;
  rating: number; // 1 to 10
  comment: string;
}

export interface ComparisonDimension {
  dimension: string;
  importance: 'High' | 'Medium' | 'Low' | string;
  scores: DimensionScore[];
  notes?: string;
}

export interface RiskMitigation {
  risk: string;
  suggestion: string;
}

export interface TiebreakerVerdict {
  recommendedOptionId: string;
  confidencePercent: number;
  headlineVerdict: string;
  coreRationale: string;
  theDecidingQuestion: string;
  blindspots: string[];
  riskMitigations: RiskMitigation[];
  twoWayDoorAnalysis: string;
}

export interface DecisionAnalysis {
  id: string;
  createdAt: string;
  dilemma: string;
  title: string;
  summary: string;
  context?: string;
  priorities?: string[];
  options: DecisionOption[];
  comparisonTable: ComparisonDimension[];
  tiebreakerVerdict: TiebreakerVerdict;
  customWeights?: Record<string, number>; // item id -> custom weight 1-5
  status?: 'evaluating' | 'decided' | 'archived';
  selectedWinnerId?: string;
  finalDecisionReflection?: string;
}

export interface StressTestResult {
  nightmareScenario: string;
  piercingQuestions: string[];
  acidTestMetric: string;
  hardTruth: string;
  survivalChecklist: string[];
}

export interface DecisionTemplate {
  id: string;
  title: string;
  tagline: string;
  category: 'Career' | 'Life' | 'Business' | 'Tech' | 'Finance';
  dilemma: string;
  options: string[];
  context: string;
  priorities: string[];
}
