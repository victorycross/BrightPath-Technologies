import { useMemo, useState } from 'react';
import { Building2, ArrowLeft, Check, FileText } from 'lucide-react';
import { EntityRoleDetermination } from '@/components/steps/EntityRoleDetermination.tsx';
import { JurisdictionPicker } from '@/components/shared/JurisdictionPicker.tsx';
import { ExportActions } from '@/components/shared/ExportActions.tsx';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';
import { TREE_NODES } from '@/components/steps/entity-role-tree.ts';
import type { OrgProfile } from '@core/data/types.js';
import type { Jurisdiction } from '@core/data/enums.js';
import { renderRoleDeterminationMemo } from '@/utils/standalone-renderers.ts';
import type { DecisionPathEntry } from '@/utils/standalone-renderers.ts';
import { buildStandaloneFilename } from '@/utils/download.ts';

interface EntityRoleStandaloneProps {
  onClose: () => void;
}

type Phase = 'determine' | 'result' | 'export';

export function EntityRoleStandalone({ onClose }: EntityRoleStandaloneProps) {
  const { state, dispatch } = useDisclaimer();

  const wizardJurisdictions = state.jurisdictions as Jurisdiction[];

  const [phase, setPhase] = useState<Phase>('determine');
  const [result, setResult] = useState<OrgProfile['entityType'] | null>(null);
  const [decisionPath, setDecisionPath] = useState<DecisionPathEntry[]>([]);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<Jurisdiction[]>(wizardJurisdictions);

  function handleStepComplete(entry: { question: string; answer: 'Yes' | 'No' }) {
    setDecisionPath((prev) => [
      ...prev,
      { questionNumber: prev.length + 1, question: entry.question, answer: entry.answer },
    ]);
  }

  function handleDetermine(entityType: OrgProfile['entityType']) {
    setResult(entityType);
    setPhase('result');
  }

  function handleApply() {
    if (!result) return;
    dispatch({ type: 'SET_ORG_PROFILE', payload: { entityType: result } });
    onClose();
  }

  function handleStartOver() {
    setResult(null);
    setDecisionPath([]);
    setPhase('determine');
  }

  const outcomeNode = result
    ? Object.values(TREE_NODES).find(
        (n) => n.kind === 'outcome' && n.entityType === result,
      )
    : null;

  const exportMarkdown = useMemo(() => {
    if (phase !== 'export' || !result || !outcomeNode || outcomeNode.kind !== 'outcome') {
      return null;
    }
    return renderRoleDeterminationMemo({
      entityType: result,
      outcomeLabel: outcomeNode.label,
      outcomeExplanation: outcomeNode.explanation,
      decisionPath,
      jurisdictions: selectedJurisdictions,
      generatedAt: new Date(),
    });
  }, [phase, result, outcomeNode, decisionPath, selectedJurisdictions]);

  // Phase: determine
  if (phase === 'determine') {
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
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Entity Role Determination</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Answer a few questions to determine whether your organization acts as a Data Controller,
            Data Processor, or Joint Controller under privacy regulations.
          </p>
        </div>

        {state.orgProfile.entityType && (
          <div className="rounded-md border border-border bg-muted/50 p-3 text-sm">
            <span className="text-muted-foreground">Current wizard setting: </span>
            <span className="font-medium">{state.orgProfile.entityType}</span>
          </div>
        )}

        <EntityRoleDetermination
          onDetermine={handleDetermine}
          onDismiss={onClose}
          onStepComplete={handleStepComplete}
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
            onClick={() => setPhase('result')}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </button>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Entity Role Determination Memo</h1>
          </div>
        </div>

        <ExportActions
          markdown={exportMarkdown}
          filename={buildStandaloneFilename('role-determination')}
          documentTitle="Entity Role Determination Memo"
          documentSubtitle={`${outcomeNode?.kind === 'outcome' ? outcomeNode.label : result} · ${selectedJurisdictions.length} jurisdiction${selectedJurisdictions.length !== 1 ? 's' : ''}`}
        />
      </div>
    );
  }

  // Phase: result
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
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Entity Role Determination</h1>
        </div>
      </div>

      {result && outcomeNode && outcomeNode.kind === 'outcome' && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold text-primary">{outcomeNode.label}</span>
          </div>
          <p className="text-sm text-muted-foreground">{outcomeNode.explanation}</p>
        </div>
      )}

      <JurisdictionPicker
        selected={selectedJurisdictions}
        onChange={setSelectedJurisdictions}
        label="Select jurisdictions for regulatory implications"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPhase('export')}
          disabled={selectedJurisdictions.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <FileText className="h-4 w-4" />
          Export Memo
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
          onClick={handleStartOver}
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
