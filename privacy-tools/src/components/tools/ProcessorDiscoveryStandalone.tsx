import { useMemo, useState } from 'react';
import { Users, ArrowLeft, Check, FileText } from 'lucide-react';
import { DataCategory, DATA_CATEGORY_LABELS, TopicCategory } from '@core/data/enums.js';
import type { Jurisdiction } from '@core/data/enums.js';
import { mapRegulations } from '@core/core/regulatory-mapper.js';
import { ProcessorDiscovery } from '@/components/steps/ProcessorDiscovery.tsx';
import { JurisdictionPicker } from '@/components/shared/JurisdictionPicker.tsx';
import { ExportActions } from '@/components/shared/ExportActions.tsx';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';
import { buildMinimalValidatedInput } from '@/utils/minimal-input-builder.ts';
import { renderProcessorDisclosure } from '@/utils/standalone-renderers.ts';
import { buildStandaloneFilename } from '@/utils/download.ts';

interface Recipient {
  category: string;
  purpose: string;
  dataCategories: DataCategory[];
  country?: string;
}

interface ProcessorDiscoveryStandaloneProps {
  onClose: () => void;
}

type Phase = 'setup' | 'discovery' | 'results' | 'export';

export function ProcessorDiscoveryStandalone({ onClose }: ProcessorDiscoveryStandaloneProps) {
  const { state, dispatch } = useDisclaimer();

  const wizardCategories = (state.dataPractices.dataCategories ?? []) as DataCategory[];
  const wizardRecipients = (state.dataPractices.thirdPartySharing?.recipients ?? []) as Recipient[];
  const wizardJurisdictions = state.jurisdictions as Jurisdiction[];

  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<Jurisdiction[]>(wizardJurisdictions);
  const [selectedCategories, setSelectedCategories] = useState<DataCategory[]>(wizardCategories);
  const [addedRecipients, setAddedRecipients] = useState<Recipient[]>([]);

  function toggleCategory(cat: DataCategory) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  function handleDiscoveryAdd(recipients: Recipient[]) {
    setAddedRecipients(recipients);
    setPhase('results');
  }

  function handleApply() {
    if (selectedCategories.length > 0 && wizardCategories.length === 0) {
      dispatch({
        type: 'SET_DATA_PRACTICES',
        payload: { dataCategories: selectedCategories },
      });
    }

    const mergedRecipients = [...wizardRecipients, ...addedRecipients];
    dispatch({
      type: 'SET_THIRD_PARTY',
      payload: {
        thirdPartySharing: {
          shares: mergedRecipients.length > 0,
          sellsData: state.dataPractices.thirdPartySharing?.sellsData ?? false,
          sharesForCrossBehavioral: state.dataPractices.thirdPartySharing?.sharesForCrossBehavioral ?? false,
          recipients: mergedRecipients,
        },
        crossBorderTransfers: state.dataPractices.crossBorderTransfers ?? {
          transfers: false,
        },
      },
    });
    onClose();
  }

  const exportMarkdown = useMemo(() => {
    if (phase !== 'export' || addedRecipients.length === 0 || selectedJurisdictions.length === 0) {
      return null;
    }

    const minimalInput = buildMinimalValidatedInput({
      jurisdictions: selectedJurisdictions,
      dataCategories: selectedCategories,
      recipients: addedRecipients,
    });

    const allRequirements = mapRegulations(minimalInput);
    const thirdPartyReqs = allRequirements.filter(
      (r) => r.topic === TopicCategory.THIRD_PARTY,
    );

    return renderProcessorDisclosure({
      recipients: addedRecipients,
      jurisdictions: selectedJurisdictions,
      requirements: thirdPartyReqs,
      generatedAt: new Date(),
    });
  }, [phase, addedRecipients, selectedJurisdictions, selectedCategories]);

  // Phase: setup
  if (phase === 'setup') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Wizard
          </button>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Third-Party Processor Discovery</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Identify third-party service providers your organization shares personal data with.
            Select applicable jurisdictions and data categories to get started.
          </p>
        </div>

        <JurisdictionPicker
          selected={selectedJurisdictions}
          onChange={setSelectedJurisdictions}
          label="Which privacy regulations apply?"
        />

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">What categories of personal data does your organization collect?</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.values(DataCategory).map((cat) => (
              <label
                key={cat}
                className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent/50 ${
                  selectedCategories.includes(cat) ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <span className="text-sm">{DATA_CATEGORY_LABELS[cat].split('(')[0].trim()}</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPhase('discovery')}
            disabled={selectedCategories.length === 0 || selectedJurisdictions.length === 0}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Phase: discovery
  if (phase === 'discovery') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Setup
          </button>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Third-Party Processor Discovery</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Select the types of third-party service providers, then customize the details.
          </p>
        </div>

        <ProcessorDiscovery
          availableCategories={selectedCategories}
          existingRecipients={wizardRecipients}
          onAdd={handleDiscoveryAdd}
          onDismiss={onClose}
        />
      </div>
    );
  }

  // Phase: export
  if (phase === 'export' && exportMarkdown) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPhase('results')}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </button>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Third-Party Processor Disclosure</h1>
          </div>
        </div>

        <ExportActions
          markdown={exportMarkdown}
          filename={buildStandaloneFilename('processor-disclosure')}
          documentTitle="Third-Party Processor Disclosure"
          documentSubtitle={`${addedRecipients.length} processor${addedRecipients.length !== 1 ? 's' : ''} · ${selectedJurisdictions.length} jurisdiction${selectedJurisdictions.length !== 1 ? 's' : ''}`}
        />
      </div>
    );
  }

  // Phase: results
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Wizard
        </button>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <Check className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Processors Identified</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {addedRecipients.length} third-party processor{addedRecipients.length !== 1 ? 's' : ''} identified.
        </p>
      </div>

      <div className="space-y-2">
        {addedRecipients.map((r, i) => (
          <div key={i} className="rounded-md border border-border p-3 text-sm space-y-1">
            <p className="font-medium">{r.category}</p>
            <p className="text-muted-foreground">{r.purpose}</p>
            {r.country && <p className="text-xs text-muted-foreground">Country: {r.country}</p>}
            <div className="flex flex-wrap gap-1 mt-1">
              {r.dataCategories.map((cat) => (
                <span key={cat} className="rounded bg-muted px-2 py-0.5 text-xs">
                  {DATA_CATEGORY_LABELS[cat].split('(')[0].trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPhase('export')}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <FileText className="h-4 w-4" />
          Export Disclosure
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Apply to Wizard
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Done
        </button>
        <button
          type="button"
          onClick={() => setPhase('discovery')}
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
