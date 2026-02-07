import type { Jurisdiction } from '@core/data/enums.js';
import type { OrgProfile, DataPractices } from '@core/data/types.js';

export interface DisclaimerState {
  currentStep: number;
  jurisdictions: Jurisdiction[];
  orgProfile: Partial<OrgProfile>;
  dataPractices: Partial<DataPractices>;
}

export type DisclaimerAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_JURISDICTIONS'; payload: Jurisdiction[] }
  | { type: 'SET_ORG_PROFILE'; payload: Partial<OrgProfile> }
  | { type: 'SET_DATA_PRACTICES'; payload: Partial<DataPractices> }
  | { type: 'SET_THIRD_PARTY'; payload: Pick<DataPractices, 'thirdPartySharing' | 'crossBorderTransfers'> }
  | { type: 'RESET' };

export const initialState: DisclaimerState = {
  currentStep: 1,
  jurisdictions: [],
  orgProfile: {},
  dataPractices: {},
};

export function disclaimerReducer(state: DisclaimerState, action: DisclaimerAction): DisclaimerState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_JURISDICTIONS':
      return { ...state, jurisdictions: action.payload };
    case 'SET_ORG_PROFILE':
      return { ...state, orgProfile: { ...state.orgProfile, ...action.payload } };
    case 'SET_DATA_PRACTICES':
      return { ...state, dataPractices: { ...state.dataPractices, ...action.payload } };
    case 'SET_THIRD_PARTY':
      return {
        ...state,
        dataPractices: {
          ...state.dataPractices,
          thirdPartySharing: action.payload.thirdPartySharing,
          crossBorderTransfers: action.payload.crossBorderTransfers,
        },
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
