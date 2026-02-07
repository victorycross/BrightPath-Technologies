import { useState } from 'react';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';
import type { OrgProfile } from '@core/data/types.js';
import { EntityRoleDetermination } from './EntityRoleDetermination.tsx';

export function Step2OrgProfile() {
  const { state, dispatch } = useDisclaimer();
  const org = state.orgProfile;
  const [showRoleHelper, setShowRoleHelper] = useState(false);

  function update(partial: Partial<OrgProfile>) {
    dispatch({ type: 'SET_ORG_PROFILE', payload: partial });
  }

  function updateDpo(field: string, value: string) {
    const dpo = org.dpoContact ?? { title: '', email: '' };
    update({ dpoContact: { ...dpo, [field]: value } } as Partial<OrgProfile>);
  }

  function updateEuRep(field: string, value: string) {
    const rep = org.euRepresentative ?? { name: '', email: '', address: '' };
    update({ euRepresentative: { ...rep, [field]: value } } as Partial<OrgProfile>);
  }

  const needsEuRep = state.jurisdictions.some((j) => j === 'GDPR');

  return (
    <div className="space-y-6">
      <h2 className="mb-1 text-lg font-semibold">Organization Profile</h2>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Legal name *</label>
        <input type="text" value={org.legalName ?? ''} onChange={(e) => update({ legalName: e.target.value })} placeholder="Full legal entity name" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Trading / brand name</label>
        <input type="text" value={org.tradingName ?? ''} onChange={(e) => update({ tradingName: e.target.value })} placeholder="If different from legal name" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-xs font-medium text-muted-foreground">Entity type *</label>
          {!showRoleHelper && (
            <button type="button" onClick={() => setShowRoleHelper(true)} className="text-xs text-primary hover:underline">
              Help me determine
            </button>
          )}
        </div>
        <select value={org.entityType ?? ''} onChange={(e) => update({ entityType: e.target.value as OrgProfile['entityType'] })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">Select entity type</option>
          <option value="controller">Data Controller</option>
          <option value="processor">Data Processor</option>
          <option value="joint_controller">Joint Controller</option>
        </select>
        {showRoleHelper && (
          <div className="mt-3">
            <EntityRoleDetermination
              onDetermine={(entityType) => { update({ entityType }); setShowRoleHelper(false); }}
              onDismiss={() => setShowRoleHelper(false)}
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Industry sector *</label>
        <input type="text" value={org.industrySector ?? ''} onChange={(e) => update({ industrySector: e.target.value })} placeholder="e.g., Financial services, Healthcare, Technology" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Website URL</label>
        <input type="url" value={org.websiteUrl ?? ''} onChange={(e) => update({ websiteUrl: e.target.value })} placeholder="https://example.com" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Headquarters country *</label>
        <input type="text" value={org.headquartersCountry ?? ''} onChange={(e) => update({ headquartersCountry: e.target.value })} placeholder="e.g., Canada" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Headquarters province / state</label>
        <input type="text" value={org.headquartersProvince ?? ''} onChange={(e) => update({ headquartersProvince: e.target.value })} placeholder="e.g., Ontario" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>

      <div className="space-y-3 rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium">Privacy Officer / DPO Contact *</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Title *</label>
            <input type="text" value={org.dpoContact?.title ?? ''} onChange={(e) => updateDpo('title', e.target.value)} placeholder="e.g., Data Protection Officer" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Email *</label>
            <input type="email" value={org.dpoContact?.email ?? ''} onChange={(e) => updateDpo('email', e.target.value)} placeholder="privacy@example.com" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Name</label>
            <input type="text" value={org.dpoContact?.name ?? ''} onChange={(e) => updateDpo('name', e.target.value)} placeholder="Full name" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
            <input type="tel" value={org.dpoContact?.phone ?? ''} onChange={(e) => updateDpo('phone', e.target.value)} placeholder="+1 (555) 000-0000" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Address</label>
          <input type="text" value={org.dpoContact?.address ?? ''} onChange={(e) => updateDpo('address', e.target.value)} placeholder="Mailing address" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
        </div>
      </div>

      {needsEuRep && (
        <div className="space-y-3 rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium">EU Representative (GDPR Art. 27)</h3>
          <p className="text-xs text-muted-foreground">Required for non-EU organizations that process EU personal data.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Name</label>
              <input type="text" value={org.euRepresentative?.name ?? ''} onChange={(e) => updateEuRep('name', e.target.value)} placeholder="Representative name" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
              <input type="email" value={org.euRepresentative?.email ?? ''} onChange={(e) => updateEuRep('email', e.target.value)} placeholder="eu-rep@example.com" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Address</label>
            <input type="text" value={org.euRepresentative?.address ?? ''} onChange={(e) => updateEuRep('address', e.target.value)} placeholder="EU address" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
