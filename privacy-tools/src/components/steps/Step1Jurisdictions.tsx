import { Jurisdiction, JURISDICTION_LABELS } from '@core/data/enums.js';
import { isRegulationSupported } from '@core/data/regulations/index.js';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';

export function Step1Jurisdictions() {
  const { state, dispatch } = useDisclaimer();

  function toggle(j: Jurisdiction) {
    const next = state.jurisdictions.includes(j)
      ? state.jurisdictions.filter((x) => x !== j)
      : [...state.jurisdictions, j];
    dispatch({ type: 'SET_JURISDICTIONS', payload: next });
  }

  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold">Select Jurisdictions</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Which privacy regulations apply to your organization?
      </p>
      <div className="space-y-2">
        {Object.values(Jurisdiction).map((j) => {
          const supported = isRegulationSupported(j);
          return (
            <label
              key={j}
              className={`flex items-center gap-3 rounded-lg border border-border p-3 ${
                supported ? 'cursor-pointer hover:bg-accent/50' : 'cursor-not-allowed opacity-50'
              } ${state.jurisdictions.includes(j) ? 'border-primary bg-primary/5' : ''}`}
            >
              <input
                type="checkbox"
                checked={state.jurisdictions.includes(j)}
                onChange={() => toggle(j)}
                disabled={!supported}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <div>
                <span className="text-sm font-medium">{JURISDICTION_LABELS[j]}</span>
                {!supported && (
                  <span className="ml-2 text-xs text-muted-foreground">(coming soon)</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
