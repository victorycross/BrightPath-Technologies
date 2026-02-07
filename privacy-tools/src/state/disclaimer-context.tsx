import { createContext, useContext, useReducer, type ReactNode } from 'react';
import {
  disclaimerReducer,
  initialState,
  type DisclaimerState,
  type DisclaimerAction,
} from './disclaimer-reducer.ts';

interface DisclaimerContextValue {
  state: DisclaimerState;
  dispatch: React.Dispatch<DisclaimerAction>;
}

const DisclaimerContext = createContext<DisclaimerContextValue | null>(null);

export function DisclaimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(disclaimerReducer, initialState);
  return (
    <DisclaimerContext.Provider value={{ state, dispatch }}>
      {children}
    </DisclaimerContext.Provider>
  );
}

export function useDisclaimer() {
  const ctx = useContext(DisclaimerContext);
  if (!ctx) throw new Error('useDisclaimer must be used within DisclaimerProvider');
  return ctx;
}
