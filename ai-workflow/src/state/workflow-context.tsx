import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { WorkflowData, WorkflowState } from '@/types/workflow';

const STORAGE_KEY = 'brightpath-ai-workflow';

function defaultData(): WorkflowData {
  return {
    useCaseIntake: {
      projectName: '', sponsor: '', department: '', description: '',
      objectives: '', expectedOutcome: '', timeline: '',
    },
    businessImpact: {
      strategicAlignment: '', revenueImpact: '', costReduction: '',
      customerExperience: '', competitiveAdvantage: '', estimatedROI: '', notes: '',
    },
    dataReadiness: {
      dataAvailable: '', dataQuality: '', dataSources: '', dataVolume: '',
      piiPresent: '', dataGovernanceInPlace: '', notes: '',
    },
    riskAssessment: {
      biasRisk: '', privacyRisk: '', securityRisk: '',
      reputationalRisk: '', operationalRisk: '', mitigationPlan: '', notes: '',
    },
    governanceReview: {
      regulatoryRequirements: '', aiActCompliance: '', pipedaCompliance: '',
      ethicsReview: '', humanOversight: '', transparencyPlan: '', notes: '',
    },
    deliveryPlanning: {
      approach: '', teamSize: '', techStack: '', infrastructure: '',
      milestones: '', budget: '', dependencies: '', notes: '',
    },
    implementationTracking: {
      phase: '', progress: 0, blockers: '', keyDecisions: '',
      testingStatus: '', notes: '',
    },
    launchMonitoring: {
      launchDate: '', goLiveChecklist: '', monitoringMetrics: '',
      alertsConfigured: '', feedbackLoop: '', retrainingPlan: '', notes: '',
    },
  };
}

function loadState(): WorkflowState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        completedSteps: new Set(parsed.completedSteps ?? []),
      };
    }
  } catch { /* ignore */ }
  return { currentStep: 0, data: defaultData(), completedSteps: new Set() };
}

function saveState(state: WorkflowState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...state,
    completedSteps: [...state.completedSteps],
  }));
}

type Action =
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_DATA'; payload: Partial<WorkflowData> }
  | { type: 'MARK_COMPLETE'; step: number }
  | { type: 'RESET' };

function reducer(state: WorkflowState, action: Action): WorkflowState {
  let next: WorkflowState;
  switch (action.type) {
    case 'GO_TO_STEP':
      next = { ...state, currentStep: Math.max(0, Math.min(7, action.step)) };
      break;
    case 'NEXT_STEP':
      next = { ...state, currentStep: Math.min(7, state.currentStep + 1) };
      break;
    case 'PREV_STEP':
      next = { ...state, currentStep: Math.max(0, state.currentStep - 1) };
      break;
    case 'UPDATE_DATA':
      next = { ...state, data: { ...state.data, ...action.payload } };
      break;
    case 'MARK_COMPLETE': {
      const completed = new Set(state.completedSteps);
      completed.add(action.step);
      next = { ...state, completedSteps: completed };
      break;
    }
    case 'RESET':
      next = { currentStep: 0, data: defaultData(), completedSteps: new Set() };
      break;
    default:
      return state;
  }
  saveState(next);
  return next;
}

interface WorkflowContextValue {
  state: WorkflowState;
  dispatch: React.Dispatch<Action>;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  return (
    <WorkflowContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be used within WorkflowProvider');
  return ctx;
}
