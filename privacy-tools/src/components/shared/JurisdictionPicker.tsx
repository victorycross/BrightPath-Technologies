import { Jurisdiction, JURISDICTION_LABELS } from '@core/data/enums.js';
import { isRegulationSupported } from '@core/data/regulations/index.js';

interface JurisdictionPickerProps {
  selected: Jurisdiction[];
  onChange: (jurisdictions: Jurisdiction[]) => void;
  label?: string;
}

export function JurisdictionPicker({ selected, onChange, label }: JurisdictionPickerProps) {
  function toggle(j: Jurisdiction) {
    const next = selected.includes(j)
      ? selected.filter((x) => x !== j)
      : [...selected, j];
    onChange(next);
  }

  return (
    <div>
      {label && <h2 className="mb-2 text-sm font-semibold">{label}</h2>}
      <div className="space-y-2">
        {Object.values(Jurisdiction).map((j) => {
          const supported = isRegulationSupported(j);
          return (
            <label
              key={j}
              className={`flex items-center gap-3 rounded-lg border border-border p-3 ${
                supported ? 'cursor-pointer hover:bg-accent/50' : 'cursor-not-allowed opacity-50'
              } ${selected.includes(j) ? 'border-primary bg-primary/5' : ''}`}
            >
              <input
                type="checkbox"
                checked={selected.includes(j)}
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
