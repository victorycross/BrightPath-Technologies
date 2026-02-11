/** Workflow step identifiers */
export type StepId =
  | 'use-case-intake'
  | 'business-impact'
  | 'data-readiness'
  | 'risk-assessment'
  | 'governance-review'
  | 'delivery-planning'
  | 'implementation'
  | 'launch-monitoring';

export interface StepMeta {
  id: StepId;
  index: number;
  title: string;
  shortTitle: string;
  description: string;
}

/** Step 1 – Use Case Intake */
export interface UseCaseIntake {
  projectName: string;
  sponsor: string;
  department: string;
  description: string;
  objectives: string;
  expectedOutcome: string;
  timeline: 'immediate' | '3-months' | '6-months' | '12-months' | '';
}

/** Step 2 – Business Impact Assessment */
export interface BusinessImpact {
  strategicAlignment: 'high' | 'medium' | 'low' | '';
  revenueImpact: 'high' | 'medium' | 'low' | '';
  costReduction: 'high' | 'medium' | 'low' | '';
  customerExperience: 'high' | 'medium' | 'low' | '';
  competitiveAdvantage: string;
  estimatedROI: string;
  notes: string;
}

/** Step 3 – Data Readiness Review */
export interface DataReadiness {
  dataAvailable: 'yes' | 'partial' | 'no' | '';
  dataQuality: 'high' | 'medium' | 'low' | 'unknown' | '';
  dataSources: string;
  dataVolume: string;
  piiPresent: 'yes' | 'no' | 'unknown' | '';
  dataGovernanceInPlace: 'yes' | 'partial' | 'no' | '';
  notes: string;
}

/** Step 4 – Risk Assessment */
export interface RiskAssessment {
  biasRisk: 'high' | 'medium' | 'low' | '';
  privacyRisk: 'high' | 'medium' | 'low' | '';
  securityRisk: 'high' | 'medium' | 'low' | '';
  reputationalRisk: 'high' | 'medium' | 'low' | '';
  operationalRisk: 'high' | 'medium' | 'low' | '';
  mitigationPlan: string;
  notes: string;
}

/** Step 5 – Governance Review */
export interface GovernanceReview {
  regulatoryRequirements: string;
  aiActCompliance: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable' | '';
  pipedaCompliance: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable' | '';
  ethicsReview: 'approved' | 'pending' | 'not-started' | '';
  humanOversight: 'full' | 'partial' | 'none' | '';
  transparencyPlan: string;
  notes: string;
}

/** Step 6 – Delivery Planning */
export interface DeliveryPlanning {
  approach: 'build' | 'buy' | 'hybrid' | '';
  teamSize: string;
  techStack: string;
  infrastructure: 'cloud' | 'on-premise' | 'hybrid' | '';
  milestones: string;
  budget: string;
  dependencies: string;
  notes: string;
}

/** Step 7 – Implementation Tracking */
export interface ImplementationTracking {
  phase: 'not-started' | 'poc' | 'pilot' | 'scaling' | 'production' | '';
  progress: number; // 0-100
  blockers: string;
  keyDecisions: string;
  testingStatus: 'not-started' | 'in-progress' | 'complete' | '';
  notes: string;
}

/** Step 8 – Launch & Monitoring */
export interface LaunchMonitoring {
  launchDate: string;
  goLiveChecklist: string;
  monitoringMetrics: string;
  alertsConfigured: 'yes' | 'partial' | 'no' | '';
  feedbackLoop: 'yes' | 'partial' | 'no' | '';
  retrainingPlan: string;
  notes: string;
}

/** Complete workflow state */
export interface WorkflowData {
  useCaseIntake: UseCaseIntake;
  businessImpact: BusinessImpact;
  dataReadiness: DataReadiness;
  riskAssessment: RiskAssessment;
  governanceReview: GovernanceReview;
  deliveryPlanning: DeliveryPlanning;
  implementationTracking: ImplementationTracking;
  launchMonitoring: LaunchMonitoring;
}

export interface WorkflowState {
  currentStep: number;
  data: WorkflowData;
  completedSteps: Set<number>;
}
