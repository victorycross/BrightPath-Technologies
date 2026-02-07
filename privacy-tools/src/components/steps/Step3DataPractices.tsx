import { useState } from 'react';
import {
  DataCategory, DATA_CATEGORY_LABELS,
  DataSource,
  ProcessingPurpose, PROCESSING_PURPOSE_LABELS,
  LegalBasis, LEGAL_BASIS_LABELS,
  ConsentMechanism,
} from '@core/data/enums.js';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';
import type { DataPractices } from '@core/data/types.js';

export function Step3DataPractices() {
  const { state, dispatch } = useDisclaimer();
  const dp = state.dataPractices;

  function update(partial: Partial<DataPractices>) {
    dispatch({ type: 'SET_DATA_PRACTICES', payload: partial });
  }

  // --- Data Categories ---
  const categories = (dp.dataCategories ?? []) as DataCategory[];
  function toggleCategory(cat: DataCategory) {
    const next = categories.includes(cat)
      ? categories.filter((c) => c !== cat)
      : [...categories, cat];
    update({ dataCategories: next });
  }

  // --- Data Sources ---
  const sources = (dp.dataSources ?? []) as DataSource[];
  function toggleSource(src: DataSource) {
    const next = sources.includes(src) ? sources.filter((s) => s !== src) : [...sources, src];
    update({ dataSources: next });
  }

  // --- Processing Purposes ---
  const purposes = dp.processingPurposes ?? [];
  function addPurpose() {
    update({ processingPurposes: [...purposes, { purpose: ProcessingPurpose.SERVICE_DELIVERY, legalBasis: LegalBasis.CONSENT }] });
  }
  function removePurpose(i: number) {
    update({ processingPurposes: purposes.filter((_, idx) => idx !== i) });
  }
  function updatePurpose(i: number, field: string, value: string) {
    const next = [...purposes];
    next[i] = { ...next[i], [field]: value };
    update({ processingPurposes: next });
  }

  // --- Retention ---
  const retention = dp.retentionSchedule ?? [];
  function updateRetention(i: number, period: string) {
    const next = [...retention];
    next[i] = { ...next[i], period };
    update({ retentionSchedule: next });
  }

  // Auto-generate retention rows for selected categories
  if (categories.length > 0 && retention.length !== categories.length) {
    const newRetention = categories.map((cat) => {
      const existing = retention.find((r) => r.dataCategory === cat);
      return existing ?? { dataCategory: cat, period: 'Duration of account relationship plus 2 years' };
    });
    update({ retentionSchedule: newRetention });
  }

  // --- Consent ---
  const consent = (dp.consentMechanisms ?? []) as ConsentMechanism[];
  function toggleConsent(cm: ConsentMechanism) {
    const next = consent.includes(cm) ? consent.filter((c) => c !== cm) : [...consent, cm];
    update({ consentMechanisms: next });
  }

  return (
    <div className="space-y-6">
      <h2 className="mb-1 text-lg font-semibold">Data Collection Practices</h2>

      {/* Data Categories */}
      <Section title="What categories of personal data do you collect?">
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.values(DataCategory).map((cat) => (
            <label key={cat} className={`flex items-center gap-2 rounded-md border border-border p-2 text-sm cursor-pointer hover:bg-accent/50 ${categories.includes(cat) ? 'border-primary bg-primary/5' : ''}`}>
              <input type="checkbox" checked={categories.includes(cat)} onChange={() => toggleCategory(cat)} className="h-3.5 w-3.5 accent-primary" />
              {DATA_CATEGORY_LABELS[cat]}
            </label>
          ))}
        </div>
      </Section>

      {/* Data Sources */}
      <Section title="How do you collect this data?">
        <div className="space-y-2">
          {([
            [DataSource.DIRECTLY_FROM_SUBJECT, 'Directly from the individual'],
            [DataSource.THIRD_PARTY_PROVIDERS, 'From third-party providers'],
            [DataSource.AUTOMATED_COLLECTION, 'Through automated collection (cookies, logs)'],
            [DataSource.PUBLIC_SOURCES, 'From publicly available sources'],
            [DataSource.SOCIAL_MEDIA, 'From social media platforms'],
          ] as const).map(([src, label]) => (
            <label key={src} className={`flex items-center gap-2 rounded-md border border-border p-2 text-sm cursor-pointer hover:bg-accent/50 ${sources.includes(src) ? 'border-primary bg-primary/5' : ''}`}>
              <input type="checkbox" checked={sources.includes(src)} onChange={() => toggleSource(src)} className="h-3.5 w-3.5 accent-primary" />
              {label}
            </label>
          ))}
        </div>
      </Section>

      {/* Processing Purposes */}
      <Section title="Processing purposes">
        <div className="space-y-3">
          {purposes.map((pp, i) => (
            <div key={i} className="flex gap-2 rounded-md border border-border p-3">
              <div className="flex-1 space-y-2">
                <select value={pp.purpose} onChange={(e) => updatePurpose(i, 'purpose', e.target.value)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                  {Object.values(ProcessingPurpose).map((p) => <option key={p} value={p}>{PROCESSING_PURPOSE_LABELS[p]}</option>)}
                </select>
                <select value={pp.legalBasis} onChange={(e) => updatePurpose(i, 'legalBasis', e.target.value)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                  {Object.values(LegalBasis).map((lb) => <option key={lb} value={lb}>{LEGAL_BASIS_LABELS[lb]}</option>)}
                </select>
                <input type="text" placeholder="Brief description (optional)" value={pp.description ?? ''} onChange={(e) => updatePurpose(i, 'description', e.target.value)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              </div>
              <button type="button" onClick={() => removePurpose(i)} className="self-start text-destructive hover:text-destructive/80 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={addPurpose} className="rounded-md border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-foreground">+ Add purpose</button>
        </div>
      </Section>

      {/* Retention Schedule */}
      {categories.length > 0 && (
        <Section title="Retention periods">
          <div className="space-y-2">
            {retention.map((r, i) => (
              <div key={r.dataCategory} className="flex items-center gap-2">
                <span className="min-w-[180px] text-sm text-muted-foreground">{DATA_CATEGORY_LABELS[r.dataCategory as DataCategory]}</span>
                <input type="text" value={r.period} onChange={(e) => updateRetention(i, e.target.value)} className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Consent Mechanisms */}
      <Section title="Consent mechanisms">
        <div className="space-y-2">
          {([
            [ConsentMechanism.OPT_IN, 'Opt-in (affirmative consent)'],
            [ConsentMechanism.OPT_OUT, 'Opt-out'],
            [ConsentMechanism.GRANULAR_CONSENT, 'Granular consent (per purpose)'],
            [ConsentMechanism.COOKIE_CONSENT_BANNER, 'Cookie consent banner'],
            [ConsentMechanism.DOUBLE_OPT_IN, 'Double opt-in (email confirmation)'],
          ] as const).map(([cm, label]) => (
            <label key={cm} className={`flex items-center gap-2 rounded-md border border-border p-2 text-sm cursor-pointer hover:bg-accent/50 ${consent.includes(cm) ? 'border-primary bg-primary/5' : ''}`}>
              <input type="checkbox" checked={consent.includes(cm)} onChange={() => toggleConsent(cm)} className="h-3.5 w-3.5 accent-primary" />
              {label}
            </label>
          ))}
        </div>
      </Section>

      {/* Boolean Flags */}
      <Section title="Additional data practices">
        <div className="space-y-2">
          <Toggle label="Uses cookies or tracking technologies" checked={dp.usesCookies ?? false} onChange={(v) => update({ usesCookies: v })} />
          <Toggle label="Collects children's data (under 16/13)" checked={dp.collectsChildrensData ?? false} onChange={(v) => update({ collectsChildrensData: v })} />
          <Toggle label="Uses automated decision-making or profiling" checked={dp.usesAutomatedDecisionMaking ?? false} onChange={(v) => update({ usesAutomatedDecisionMaking: v })} />
          <Toggle label="Conducts Data Protection Impact Assessments" checked={dp.conductsDPIA ?? false} onChange={(v) => update({ conductsDPIA: v })} />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-border p-2 text-sm cursor-pointer hover:bg-accent/50">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-3.5 w-3.5 accent-primary" />
      {label}
    </label>
  );
}
