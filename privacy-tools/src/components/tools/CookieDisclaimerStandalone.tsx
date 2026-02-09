import { useMemo, useState } from 'react';
import { Cookie, ArrowLeft, FileText } from 'lucide-react';
import type { Jurisdiction } from '@core/data/enums.js';
import { JurisdictionPicker } from '@/components/shared/JurisdictionPicker.tsx';
import { ExportActions } from '@/components/shared/ExportActions.tsx';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';
import { renderCookieDisclaimer } from '@/utils/standalone-renderers.ts';
import { buildStandaloneFilename } from '@/utils/download.ts';
import { CookieInventory } from './cookie-disclaimer/CookieInventory.tsx';
import { ConsentConfig } from './cookie-disclaimer/ConsentConfig.tsx';
import { CookieReview } from './cookie-disclaimer/CookieReview.tsx';
import {
  type CookieEntry,
  type ConsentModel,
  type BannerPosition,
  getDefaultConsentModel,
} from './cookie-disclaimer/types.ts';
import type { CookieCategory } from './cookie-disclaimer/types.ts';

interface CookieDisclaimerStandaloneProps {
  onClose: () => void;
}

type Phase = 'setup' | 'inventory' | 'consent' | 'review' | 'export';

export function CookieDisclaimerStandalone({ onClose }: CookieDisclaimerStandaloneProps) {
  const { state } = useDisclaimer();

  const wizardJurisdictions = state.jurisdictions as Jurisdiction[];
  const wizardOrgName = state.orgProfile?.legalName ?? '';
  const wizardWebsiteUrl = state.orgProfile?.websiteUrl ?? '';

  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<Jurisdiction[]>(wizardJurisdictions);
  const [websiteUrl, setWebsiteUrl] = useState(wizardWebsiteUrl);
  const [orgName, setOrgName] = useState(wizardOrgName);
  const [cookies, setCookies] = useState<CookieEntry[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CookieCategory[]>([]);
  const [consentModels, setConsentModels] = useState<ConsentModel[]>([]);
  const [bannerPosition, setBannerPosition] = useState<BannerPosition>('bottom');

  function handleJurisdictionsChange(jurisdictions: Jurisdiction[]) {
    setSelectedJurisdictions(jurisdictions);
    // Sync consent models with selected jurisdictions
    setConsentModels((prev) => {
      const existing = new Map(prev.map((m) => [m.jurisdiction, m]));
      return jurisdictions.map((j) => existing.get(j) ?? getDefaultConsentModel(j));
    });
  }

  function handleProceedToInventory() {
    // Initialize consent models if not already done
    if (consentModels.length === 0) {
      setConsentModels(selectedJurisdictions.map(getDefaultConsentModel));
    }
    setPhase('inventory');
  }

  const exportMarkdown = useMemo(() => {
    if (phase !== 'export') return null;
    return renderCookieDisclaimer({
      websiteUrl,
      orgName,
      jurisdictions: selectedJurisdictions,
      cookies,
      consentModels: consentModels.filter((m) => selectedJurisdictions.includes(m.jurisdiction)),
      bannerPosition,
      generatedAt: new Date(),
    });
  }, [phase, websiteUrl, orgName, selectedJurisdictions, cookies, consentModels, bannerPosition]);

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
            Back
          </button>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Cookie className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Cookie Disclaimer Generator</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate a jurisdiction-specific cookie policy for your website. Start by selecting
            applicable regulations and providing your organization details.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g., Acme Corporation"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="e.g., https://example.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <JurisdictionPicker
            selected={selectedJurisdictions}
            onChange={handleJurisdictionsChange}
            label="Which privacy regulations apply to your website?"
          />

          <button
            type="button"
            onClick={handleProceedToInventory}
            disabled={selectedJurisdictions.length === 0}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Phase: inventory
  if (phase === 'inventory') {
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
            <Cookie className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Cookie Inventory</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Select the categories of cookies used on your website and add specific cookie details.
          </p>
        </div>

        <CookieInventory
          cookies={cookies}
          onUpdate={setCookies}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
        />

        <button
          type="button"
          onClick={() => setPhase('consent')}
          disabled={selectedCategories.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Continue to Consent Configuration
        </button>
      </div>
    );
  }

  // Phase: consent
  if (phase === 'consent') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPhase('inventory')}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory
          </button>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Cookie className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Consent Configuration</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure cookie consent requirements for each applicable jurisdiction.
          </p>
        </div>

        <ConsentConfig
          jurisdictions={selectedJurisdictions}
          consentModels={consentModels}
          onUpdate={setConsentModels}
          bannerPosition={bannerPosition}
          onBannerPositionChange={setBannerPosition}
        />

        <button
          type="button"
          onClick={() => setPhase('review')}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Review
        </button>
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
            onClick={() => setPhase('review')}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Review
          </button>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Cookie Disclaimer</h1>
          </div>
        </div>

        <ExportActions
          markdown={exportMarkdown}
          filename={buildStandaloneFilename('cookie-disclaimer')}
          documentTitle="Cookie Disclaimer"
          documentSubtitle={`${cookies.length} cookie${cookies.length !== 1 ? 's' : ''} · ${selectedJurisdictions.length} jurisdiction${selectedJurisdictions.length !== 1 ? 's' : ''}`}
        />
      </div>
    );
  }

  // Phase: review
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPhase('consent')}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Consent
        </button>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <Cookie className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Review</h1>
        </div>
      </div>

      <CookieReview
        cookies={cookies}
        consentModels={consentModels}
        jurisdictions={selectedJurisdictions}
        websiteUrl={websiteUrl}
        orgName={orgName}
        bannerPosition={bannerPosition}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPhase('export')}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <FileText className="h-4 w-4" />
          Generate Disclaimer
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent/50"
        >
          Done
        </button>
        <button
          type="button"
          onClick={() => setPhase('setup')}
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
