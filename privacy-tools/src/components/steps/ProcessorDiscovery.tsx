import { useState } from 'react';
import { Users, SlidersHorizontal, X } from 'lucide-react';
import { DataCategory, DATA_CATEGORY_LABELS } from '@core/data/enums.js';
import { PROCESSOR_CATEGORIES } from './processor-categories.ts';
import type { ProcessorCategoryDef } from './processor-categories.ts';

interface Recipient {
  category: string;
  purpose: string;
  dataCategories: DataCategory[];
  country?: string;
}

interface ProcessorDiscoveryProps {
  availableCategories: DataCategory[];
  existingRecipients: Recipient[];
  onAdd: (recipients: Recipient[]) => void;
  onDismiss: () => void;
}

interface Override {
  category?: string;
  purpose?: string;
  country?: string;
  dataCategories?: DataCategory[];
}

export function ProcessorDiscovery({
  availableCategories,
  existingRecipients,
  onAdd,
  onDismiss,
}: ProcessorDiscoveryProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [phase, setPhase] = useState<'select' | 'customize'>('select');

  function isAlreadyAdded(proc: ProcessorCategoryDef): boolean {
    const lower = proc.category.toLowerCase();
    return existingRecipients.some(
      (r) => r.category.toLowerCase().includes(lower) || lower.includes(r.category.toLowerCase()),
    );
  }

  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function getOverride(id: string): Override {
    return overrides[id] ?? {};
  }

  function setOverride(id: string, partial: Override) {
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...partial } }));
  }

  function removeSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (selectedIds.size <= 1) {
      setPhase('select');
    }
  }

  function getSuggestedCategories(proc: ProcessorCategoryDef): DataCategory[] {
    return proc.suggestedDataCategories.filter((c) => availableCategories.includes(c));
  }

  function getDataCategories(proc: ProcessorCategoryDef): DataCategory[] {
    const o = getOverride(proc.id);
    return o.dataCategories ?? getSuggestedCategories(proc);
  }

  function toggleDataCategory(procId: string, proc: ProcessorCategoryDef, cat: DataCategory) {
    const current = getDataCategories(proc);
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    setOverride(procId, { dataCategories: next });
  }

  function handleAdd() {
    const selected = PROCESSOR_CATEGORIES.filter((p) => selectedIds.has(p.id));
    const recipients: Recipient[] = selected.map((proc) => {
      const o = getOverride(proc.id);
      return {
        category: o.category ?? proc.category,
        purpose: o.purpose ?? proc.purpose,
        country: o.country || undefined,
        dataCategories: getDataCategories(proc),
      };
    });
    onAdd(recipients);
  }

  const selectedProcessors = PROCESSOR_CATEGORIES.filter((p) => selectedIds.has(p.id));

  if (phase === 'customize') {
    return (
      <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Review & Customize ({selectedProcessors.length})
            </span>
          </div>
          <button type="button" onClick={onDismiss} className="text-xs text-muted-foreground hover:text-foreground">
            Cancel
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Review and edit the pre-populated details for each processor before adding them.
        </p>

        {selectedProcessors.map((proc) => {
          const o = getOverride(proc.id);
          const cats = getDataCategories(proc);
          return (
            <div key={proc.id} className="rounded-md border border-border bg-background p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">{proc.label}</span>
                <button type="button" onClick={() => removeSelection(proc.id)} className="text-destructive text-xs flex items-center gap-0.5">
                  <X className="h-3 w-3" /> Remove
                </button>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
                <input
                  type="text"
                  value={o.category ?? proc.category}
                  onChange={(e) => setOverride(proc.id, { category: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Purpose</label>
                <input
                  type="text"
                  value={o.purpose ?? proc.purpose}
                  onChange={(e) => setOverride(proc.id, { purpose: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Country (optional)</label>
                <input
                  type="text"
                  value={o.country ?? ''}
                  onChange={(e) => setOverride(proc.id, { country: e.target.value })}
                  placeholder="e.g., United States"
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                />
              </div>
              {availableCategories.length > 0 && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Data categories shared</label>
                  <div className="flex flex-wrap gap-1">
                    {availableCategories.map((cat) => (
                      <label
                        key={cat}
                        className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs cursor-pointer ${
                          cats.includes(cat) ? 'border-primary bg-primary/10' : 'border-border'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={cats.includes(cat)}
                          onChange={() => toggleDataCategory(proc.id, proc, cat)}
                          className="hidden"
                        />
                        {DATA_CATEGORY_LABELS[cat].split('(')[0].trim()}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAdd}
            disabled={selectedProcessors.length === 0}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Add {selectedProcessors.length} recipient{selectedProcessors.length !== 1 ? 's' : ''}
          </button>
          <button
            type="button"
            onClick={() => setPhase('select')}
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Phase: select
  return (
    <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Identify Third-Party Processors</span>
        </div>
        <button type="button" onClick={onDismiss} className="text-xs text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Select the types of third-party service providers your organization shares personal data with.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {PROCESSOR_CATEGORIES.map((proc) => {
          const added = isAlreadyAdded(proc);
          const selected = selectedIds.has(proc.id);
          return (
            <label
              key={proc.id}
              className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${
                added
                  ? 'cursor-not-allowed opacity-50 border-border'
                  : 'cursor-pointer hover:bg-accent/50'
              } ${selected && !added ? 'border-primary bg-primary/5' : 'border-border'}`}
            >
              <input
                type="checkbox"
                checked={selected}
                disabled={added}
                onChange={() => toggleSelection(proc.id)}
                className="mt-0.5 h-3.5 w-3.5 accent-primary"
              />
              <div className="min-w-0">
                <span className="font-medium">{proc.label}</span>
                <span className="block text-xs text-muted-foreground">{proc.examples}</span>
                {added && <span className="block text-xs text-muted-foreground italic">Already added</span>}
              </div>
            </label>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPhase('customize')}
          disabled={selectedIds.size === 0}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Customize {selectedIds.size} selection{selectedIds.size !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}
