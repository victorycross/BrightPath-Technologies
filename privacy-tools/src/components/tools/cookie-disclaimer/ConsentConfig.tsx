import { Info } from 'lucide-react';
import { JURISDICTION_LABELS, type Jurisdiction } from '@core/data/enums.js';
import type { ConsentModel, ConsentType, BannerPosition } from './types.ts';

interface ConsentConfigProps {
  jurisdictions: Jurisdiction[];
  consentModels: ConsentModel[];
  onUpdate: (models: ConsentModel[]) => void;
  bannerPosition: BannerPosition;
  onBannerPositionChange: (position: BannerPosition) => void;
}

const CONSENT_TYPE_LABELS: Record<ConsentType, string> = {
  opt_in: 'Opt-In (prior consent required)',
  opt_out: 'Opt-Out (consent assumed, user can withdraw)',
  implied: 'Implied (consent inferred from use)',
  reasonable: 'Reasonable (proportionate to sensitivity)',
};

const BANNER_POSITION_LABELS: Record<BannerPosition, string> = {
  bottom: 'Bottom Bar',
  top: 'Top Bar',
  center_modal: 'Center Modal',
};

export function ConsentConfig({
  jurisdictions,
  consentModels,
  onUpdate,
  bannerPosition,
  onBannerPositionChange,
}: ConsentConfigProps) {
  function updateModel(jurisdiction: Jurisdiction, field: keyof ConsentModel, value: unknown) {
    onUpdate(
      consentModels.map((m) =>
        m.jurisdiction === jurisdiction ? { ...m, [field]: value } : m,
      ),
    );
  }

  const activeModels = consentModels.filter((m) => jurisdictions.includes(m.jurisdiction));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold mb-1">Consent Configuration</h2>
        <p className="text-xs text-muted-foreground">
          Consent requirements are pre-populated based on each jurisdiction's regulations. You can adjust settings below.
        </p>
      </div>

      {/* Per-jurisdiction consent models */}
      <div className="space-y-3">
        {activeModels.map((model) => (
          <div key={model.jurisdiction} className="rounded-lg border border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold">{JURISDICTION_LABELS[model.jurisdiction]}</h3>

            {/* Notes callout */}
            {model.notes && (
              <div className="flex items-start gap-2 rounded-md bg-muted/50 p-2.5">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{model.notes}</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Consent model */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Consent Model
                </label>
                <select
                  value={model.model}
                  onChange={(e) => updateModel(model.jurisdiction, 'model', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm"
                >
                  {Object.entries(CONSENT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={model.granularByCategory}
                    onChange={(e) => updateModel(model.jurisdiction, 'granularByCategory', e.target.checked)}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  <span className="text-xs">Granular consent by category</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={model.rejectAllRequired}
                    onChange={(e) => updateModel(model.jurisdiction, 'rejectAllRequired', e.target.checked)}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  <span className="text-xs">Reject All button required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={model.cookieWallProhibited}
                    onChange={(e) => updateModel(model.jurisdiction, 'cookieWallProhibited', e.target.checked)}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  <span className="text-xs">Cookie wall prohibited</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner position */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Cookie Banner Position</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(BANNER_POSITION_LABELS) as [BannerPosition, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onBannerPositionChange(value)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                bannerPosition === value
                  ? 'border-primary bg-primary/10 font-medium text-primary'
                  : 'border-border hover:bg-accent/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
