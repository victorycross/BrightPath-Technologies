import { JURISDICTION_LABELS, type Jurisdiction } from '@core/data/enums.js';
import {
  COOKIE_CATEGORY_LABELS,
  type CookieEntry,
  type ConsentModel,
  type BannerPosition,
} from './types.ts';

interface CookieReviewProps {
  cookies: CookieEntry[];
  consentModels: ConsentModel[];
  jurisdictions: Jurisdiction[];
  websiteUrl: string;
  orgName: string;
  bannerPosition: BannerPosition;
}

const BANNER_POSITION_LABELS: Record<BannerPosition, string> = {
  bottom: 'Bottom Bar',
  top: 'Top Bar',
  center_modal: 'Center Modal',
};

const CONSENT_TYPE_LABELS: Record<string, string> = {
  opt_in: 'Opt-In',
  opt_out: 'Opt-Out',
  implied: 'Implied',
  reasonable: 'Reasonable',
};

export function CookieReview({
  cookies,
  consentModels,
  jurisdictions,
  websiteUrl,
  orgName,
  bannerPosition,
}: CookieReviewProps) {
  const activeModels = consentModels.filter((m) => jurisdictions.includes(m.jurisdiction));

  // Group cookies by category
  const grouped = cookies.reduce<Record<string, CookieEntry[]>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold mb-1">Review Cookie Disclaimer</h2>
        <p className="text-xs text-muted-foreground">
          Verify the information below before generating your cookie disclaimer document.
        </p>
      </div>

      {/* Organization info */}
      <div className="rounded-lg border border-border p-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Organization</h3>
        <div className="grid gap-1 text-sm">
          <p><span className="text-muted-foreground">Organization:</span> {orgName || '—'}</p>
          <p><span className="text-muted-foreground">Website:</span> {websiteUrl || '—'}</p>
          <p><span className="text-muted-foreground">Banner Position:</span> {BANNER_POSITION_LABELS[bannerPosition]}</p>
        </div>
      </div>

      {/* Jurisdictions */}
      <div className="rounded-lg border border-border p-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Jurisdictions</h3>
        <div className="flex flex-wrap gap-1.5">
          {jurisdictions.map((j) => (
            <span key={j} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {j}
            </span>
          ))}
        </div>
      </div>

      {/* Cookie inventory */}
      <div className="rounded-lg border border-border p-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Cookie Inventory ({cookies.length} cookie{cookies.length !== 1 ? 's' : ''})
        </h3>
        {Object.entries(grouped).map(([category, catCookies]) => (
          <div key={category} className="space-y-1.5">
            <h4 className="text-xs font-medium">{COOKIE_CATEGORY_LABELS[category as keyof typeof COOKIE_CATEGORY_LABELS] ?? category}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-1 pr-3 font-medium">Name</th>
                    <th className="pb-1 pr-3 font-medium">Provider</th>
                    <th className="pb-1 pr-3 font-medium">Purpose</th>
                    <th className="pb-1 pr-3 font-medium">Duration</th>
                    <th className="pb-1 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {catCookies.map((c) => (
                    <tr key={c.id} className="border-b border-border/50">
                      <td className="py-1 pr-3 font-mono">{c.name || '—'}</td>
                      <td className="py-1 pr-3">{c.provider || '—'}</td>
                      <td className="py-1 pr-3">{c.purpose || '—'}</td>
                      <td className="py-1 pr-3">{c.duration || '—'}</td>
                      <td className="py-1">{c.type === 'third_party' ? '3rd Party' : '1st Party'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {cookies.length === 0 && (
          <p className="text-xs text-muted-foreground">No cookies added.</p>
        )}
      </div>

      {/* Consent models */}
      <div className="rounded-lg border border-border p-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Consent Configuration</h3>
        {activeModels.map((m) => (
          <div key={m.jurisdiction} className="flex items-start gap-3 text-xs">
            <span className="shrink-0 font-medium">{JURISDICTION_LABELS[m.jurisdiction]}:</span>
            <div className="space-y-0.5">
              <span>{CONSENT_TYPE_LABELS[m.model] ?? m.model}</span>
              <div className="flex flex-wrap gap-2 text-muted-foreground">
                {m.granularByCategory && <span>Granular</span>}
                {m.rejectAllRequired && <span>Reject-All Required</span>}
                {m.cookieWallProhibited && <span>No Cookie Walls</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
