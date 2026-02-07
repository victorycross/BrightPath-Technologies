import { useState } from 'react';
import { DataCategory, DATA_CATEGORY_LABELS, TransferMechanism } from '@core/data/enums.js';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';
import type { DataPractices } from '@core/data/types.js';
import { ProcessorDiscovery } from './ProcessorDiscovery.tsx';

export function Step4ThirdParty() {
  const { state, dispatch } = useDisclaimer();
  const dp = state.dataPractices;
  const availableCategories = (dp.dataCategories ?? []) as DataCategory[];
  const [showDiscovery, setShowDiscovery] = useState(false);

  const sharing = dp.thirdPartySharing ?? { shares: false, sellsData: false, sharesForCrossBehavioral: false };
  const recipients = sharing.recipients ?? [];
  const transfers = dp.crossBorderTransfers ?? { transfers: false };
  const destinations = transfers.destinations ?? [];

  function updateSharing(partial: Partial<DataPractices['thirdPartySharing']>) {
    dispatch({
      type: 'SET_THIRD_PARTY',
      payload: {
        thirdPartySharing: { ...sharing, ...partial },
        crossBorderTransfers: transfers,
      },
    });
  }

  function updateTransfers(partial: Partial<DataPractices['crossBorderTransfers']>) {
    dispatch({
      type: 'SET_THIRD_PARTY',
      payload: {
        thirdPartySharing: sharing,
        crossBorderTransfers: { ...transfers, ...partial },
      },
    });
  }

  function addRecipient() {
    updateSharing({ recipients: [...recipients, { category: '', purpose: '', dataCategories: [] }] });
  }
  function removeRecipient(i: number) {
    updateSharing({ recipients: recipients.filter((_, idx) => idx !== i) });
  }
  function updateRecipient(i: number, field: string, value: unknown) {
    const next = [...recipients];
    next[i] = { ...next[i], [field]: value };
    updateSharing({ recipients: next });
  }

  function addDestination() {
    updateTransfers({ destinations: [...destinations, { country: '', mechanism: TransferMechanism.COMPARABLE_PROTECTION, dataCategories: [] }] });
  }
  function removeDestination(i: number) {
    updateTransfers({ destinations: destinations.filter((_, idx) => idx !== i) });
  }
  function updateDestination(i: number, field: string, value: unknown) {
    const next = [...destinations];
    next[i] = { ...next[i], [field]: value };
    updateTransfers({ destinations: next });
  }

  function toggleRecipientCategory(i: number, cat: DataCategory) {
    const current = recipients[i].dataCategories as DataCategory[];
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    updateRecipient(i, 'dataCategories', next);
  }

  function toggleDestCategory(i: number, cat: DataCategory) {
    const current = destinations[i].dataCategories as DataCategory[];
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    updateDestination(i, 'dataCategories', next);
  }

  return (
    <div className="space-y-6">
      <h2 className="mb-1 text-lg font-semibold">Third-Party Sharing & Cross-Border Transfers</h2>

      {/* Third-party sharing */}
      <div>
        <label className="flex items-center gap-3 rounded-md border border-border p-3 text-sm cursor-pointer hover:bg-accent/50">
          <input type="checkbox" checked={sharing.shares} onChange={(e) => updateSharing({ shares: e.target.checked })} className="h-4 w-4 accent-primary" />
          <span className="font-medium">We share personal information with third parties</span>
        </label>
      </div>

      {sharing.shares && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Third-party recipients</h3>
            {!showDiscovery && (
              <button
                type="button"
                onClick={() => setShowDiscovery(true)}
                className="text-xs text-primary hover:underline"
              >
                Help me identify third-party processors
              </button>
            )}
          </div>

          {showDiscovery && (
            <ProcessorDiscovery
              availableCategories={availableCategories}
              existingRecipients={recipients}
              onAdd={(newRecipients) => {
                updateSharing({ recipients: [...recipients, ...newRecipients] });
                setShowDiscovery(false);
              }}
              onDismiss={() => setShowDiscovery(false)}
            />
          )}

          {recipients.map((r, i) => (
            <div key={i} className="rounded-md border border-border p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">Recipient {i + 1}</span>
                <button type="button" onClick={() => removeRecipient(i)} className="text-destructive text-xs">Remove</button>
              </div>
              <input type="text" placeholder="Category (e.g., Cloud service providers)" value={r.category} onChange={(e) => updateRecipient(i, 'category', e.target.value)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <input type="text" placeholder="Purpose for sharing" value={r.purpose} onChange={(e) => updateRecipient(i, 'purpose', e.target.value)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <input type="text" placeholder="Country (optional)" value={r.country ?? ''} onChange={(e) => updateRecipient(i, 'country', e.target.value || undefined)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <div className="flex flex-wrap gap-1">
                {availableCategories.map((cat) => (
                  <label key={cat} className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs cursor-pointer ${(r.dataCategories as DataCategory[]).includes(cat) ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    <input type="checkbox" checked={(r.dataCategories as DataCategory[]).includes(cat)} onChange={() => toggleRecipientCategory(i, cat)} className="hidden" />
                    {DATA_CATEGORY_LABELS[cat].split('(')[0].trim()}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="button" onClick={addRecipient} className="rounded-md border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-foreground">+ Add recipient</button>

          <div className="space-y-2 mt-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={sharing.sellsData} onChange={(e) => updateSharing({ sellsData: e.target.checked })} className="h-3.5 w-3.5 accent-primary" />
              "Sell" personal information (CCPA definition)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={sharing.sharesForCrossBehavioral} onChange={(e) => updateSharing({ sharesForCrossBehavioral: e.target.checked })} className="h-3.5 w-3.5 accent-primary" />
              Share for cross-context behavioral advertising (CPRA)
            </label>
          </div>
        </div>
      )}

      {/* Cross-border transfers */}
      <div className="border-t border-border pt-4">
        <label className="flex items-center gap-3 rounded-md border border-border p-3 text-sm cursor-pointer hover:bg-accent/50">
          <input type="checkbox" checked={transfers.transfers} onChange={(e) => updateTransfers({ transfers: e.target.checked })} className="h-4 w-4 accent-primary" />
          <span className="font-medium">We transfer personal information outside our headquarters country</span>
        </label>
      </div>

      {transfers.transfers && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <h3 className="text-sm font-medium">Transfer destinations</h3>
          {destinations.map((d, i) => (
            <div key={i} className="rounded-md border border-border p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">Destination {i + 1}</span>
                <button type="button" onClick={() => removeDestination(i)} className="text-destructive text-xs">Remove</button>
              </div>
              <input type="text" placeholder="Destination country" value={d.country} onChange={(e) => updateDestination(i, 'country', e.target.value)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <select value={d.mechanism} onChange={(e) => updateDestination(i, 'mechanism', e.target.value)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                <option value="adequacy_decision">Adequacy decision</option>
                <option value="sccs">Standard Contractual Clauses (SCCs)</option>
                <option value="bcrs">Binding Corporate Rules (BCRs)</option>
                <option value="explicit_consent">Explicit consent</option>
                <option value="contractual_necessity">Contractual necessity</option>
                <option value="comparable_protection">Comparable protection (PIPEDA)</option>
              </select>
              <div className="flex flex-wrap gap-1">
                {availableCategories.map((cat) => (
                  <label key={cat} className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs cursor-pointer ${(d.dataCategories as DataCategory[]).includes(cat) ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    <input type="checkbox" checked={(d.dataCategories as DataCategory[]).includes(cat)} onChange={() => toggleDestCategory(i, cat)} className="hidden" />
                    {DATA_CATEGORY_LABELS[cat].split('(')[0].trim()}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="button" onClick={addDestination} className="rounded-md border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-foreground">+ Add destination</button>
        </div>
      )}
    </div>
  );
}
