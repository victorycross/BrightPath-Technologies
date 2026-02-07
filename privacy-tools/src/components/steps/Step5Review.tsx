import {
  JURISDICTION_LABELS,
  DATA_CATEGORY_LABELS,
  PROCESSING_PURPOSE_LABELS,
  LEGAL_BASIS_LABELS,
  type DataCategory,
  type ProcessingPurpose,
  type LegalBasis,
} from '@core/data/enums.js';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';
import { useDisclaimerPreview } from '@/hooks/use-disclaimer-preview.ts';

export function Step5Review() {
  const { state, dispatch } = useDisclaimer();
  const { isValid, requirementCount, sections } = useDisclaimerPreview(state);
  const dp = state.dataPractices;
  const org = state.orgProfile;

  function goToStep(step: number) {
    dispatch({ type: 'SET_STEP', payload: step });
  }

  return (
    <div className="space-y-4">
      <h2 className="mb-1 text-lg font-semibold">Review Your Selections</h2>
      {!isValid && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          Some required fields are missing. Please go back and complete all required steps.
        </div>
      )}

      {/* Jurisdictions */}
      <ReviewCard title="Jurisdictions" step={1} onEdit={goToStep}>
        <ul className="list-inside list-disc text-sm">
          {state.jurisdictions.map((j) => <li key={j}>{JURISDICTION_LABELS[j]}</li>)}
        </ul>
      </ReviewCard>

      {/* Organization */}
      <ReviewCard title="Organization" step={2} onEdit={goToStep}>
        <div className="text-sm space-y-1">
          <p><strong>{org.legalName}</strong>{org.tradingName ? ` (${org.tradingName})` : ''}</p>
          <p className="text-muted-foreground">{org.entityType} · {org.industrySector}</p>
          <p className="text-muted-foreground">{org.headquartersCountry}{org.headquartersProvince ? `, ${org.headquartersProvince}` : ''}</p>
          <p className="text-muted-foreground">DPO: {org.dpoContact?.email}</p>
        </div>
      </ReviewCard>

      {/* Data Practices */}
      <ReviewCard title="Data Practices" step={3} onEdit={goToStep}>
        <div className="text-sm space-y-2">
          <p><strong>{(dp.dataCategories ?? []).length}</strong> data categories selected</p>
          <div className="flex flex-wrap gap-1">
            {(dp.dataCategories ?? []).map((cat) => (
              <span key={cat as string} className="rounded bg-muted px-2 py-0.5 text-xs">
                {DATA_CATEGORY_LABELS[cat as DataCategory].split('(')[0].trim()}
              </span>
            ))}
          </div>
          <p className="mt-2"><strong>{(dp.processingPurposes ?? []).length}</strong> processing purposes:</p>
          <ul className="list-inside list-disc text-muted-foreground">
            {(dp.processingPurposes ?? []).map((pp, i) => (
              <li key={i}>
                {PROCESSING_PURPOSE_LABELS[pp.purpose as ProcessingPurpose]} ({LEGAL_BASIS_LABELS[pp.legalBasis as LegalBasis]})
              </li>
            ))}
          </ul>
        </div>
      </ReviewCard>

      {/* Third-Party */}
      <ReviewCard title="Third-Party & Transfers" step={4} onEdit={goToStep}>
        <div className="text-sm space-y-1">
          <p>Third-party sharing: <strong>{dp.thirdPartySharing?.shares ? 'Yes' : 'No'}</strong>
            {dp.thirdPartySharing?.shares && ` (${(dp.thirdPartySharing.recipients ?? []).length} recipient(s))`}
          </p>
          <p>Cross-border transfers: <strong>{dp.crossBorderTransfers?.transfers ? 'Yes' : 'No'}</strong>
            {dp.crossBorderTransfers?.transfers && ` (${(dp.crossBorderTransfers.destinations ?? []).length} destination(s))`}
          </p>
          <p>Cookies: <strong>{dp.usesCookies ? 'Yes' : 'No'}</strong></p>
          <p>Automated decision-making: <strong>{dp.usesAutomatedDecisionMaking ? 'Yes' : 'No'}</strong></p>
        </div>
      </ReviewCard>

      {/* Generation Stats */}
      {isValid && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm font-medium text-primary">Ready to generate</p>
          <p className="text-xs text-muted-foreground mt-1">
            {requirementCount} regulatory requirements mapped · {sections?.length} sections will be generated
          </p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ title, step, onEdit, children }: {
  title: string; step: number; onEdit: (step: number) => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <button type="button" onClick={() => onEdit(step)} className="text-xs text-primary hover:underline">Edit</button>
      </div>
      {children}
    </div>
  );
}
