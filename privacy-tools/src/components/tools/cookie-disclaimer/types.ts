import type { Jurisdiction } from '@core/data/enums.js';

export enum CookieCategory {
  STRICTLY_NECESSARY = 'strictly_necessary',
  PERFORMANCE = 'performance',
  FUNCTIONALITY = 'functionality',
  TARGETING = 'targeting',
  SOCIAL_MEDIA = 'social_media',
}

export const COOKIE_CATEGORY_LABELS: Record<CookieCategory, string> = {
  [CookieCategory.STRICTLY_NECESSARY]: 'Strictly Necessary',
  [CookieCategory.PERFORMANCE]: 'Performance / Analytics',
  [CookieCategory.FUNCTIONALITY]: 'Functionality',
  [CookieCategory.TARGETING]: 'Targeting / Advertising',
  [CookieCategory.SOCIAL_MEDIA]: 'Social Media',
};

export const COOKIE_CATEGORY_DESCRIPTIONS: Record<CookieCategory, string> = {
  [CookieCategory.STRICTLY_NECESSARY]:
    'Essential for the website to function. These cookies enable core features such as security, session management, and accessibility. They cannot be disabled.',
  [CookieCategory.PERFORMANCE]:
    'Help us understand how visitors interact with the website by collecting anonymous usage data. Used to measure and improve site performance.',
  [CookieCategory.FUNCTIONALITY]:
    'Allow the website to remember choices you make (such as language or region) and provide enhanced, personalized features.',
  [CookieCategory.TARGETING]:
    'Used to deliver advertisements relevant to your interests. They may also be used to limit the number of times you see an ad and to measure the effectiveness of advertising campaigns.',
  [CookieCategory.SOCIAL_MEDIA]:
    'Enable sharing content on social media platforms and may track your browsing activity across other websites.',
};

export interface CookieEntry {
  id: string;
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  type: 'first_party' | 'third_party';
  category: CookieCategory;
}

export type ConsentType = 'opt_in' | 'opt_out' | 'implied' | 'reasonable';

export interface ConsentModel {
  jurisdiction: Jurisdiction;
  model: ConsentType;
  granularByCategory: boolean;
  rejectAllRequired: boolean;
  cookieWallProhibited: boolean;
  notes: string;
}

export type BannerPosition = 'bottom' | 'top' | 'center_modal';

export interface CookieDisclaimerInput {
  websiteUrl: string;
  orgName: string;
  jurisdictions: Jurisdiction[];
  cookies: CookieEntry[];
  consentModels: ConsentModel[];
  bannerPosition: BannerPosition;
  generatedAt: Date;
}

export const COMMON_COOKIES: Record<CookieCategory, Omit<CookieEntry, 'id'>[]> = {
  [CookieCategory.STRICTLY_NECESSARY]: [
    { name: 'session_id', provider: 'First Party', purpose: 'Maintains user session state', duration: 'Session', type: 'first_party', category: CookieCategory.STRICTLY_NECESSARY },
    { name: 'csrf_token', provider: 'First Party', purpose: 'Prevents cross-site request forgery attacks', duration: 'Session', type: 'first_party', category: CookieCategory.STRICTLY_NECESSARY },
    { name: 'cookie_consent', provider: 'First Party', purpose: 'Stores cookie consent preferences', duration: '1 year', type: 'first_party', category: CookieCategory.STRICTLY_NECESSARY },
  ],
  [CookieCategory.PERFORMANCE]: [
    { name: '_ga', provider: 'Google Analytics', purpose: 'Distinguishes unique users by assigning a randomly generated number', duration: '2 years', type: 'third_party', category: CookieCategory.PERFORMANCE },
    { name: '_gid', provider: 'Google Analytics', purpose: 'Distinguishes unique users', duration: '24 hours', type: 'third_party', category: CookieCategory.PERFORMANCE },
    { name: '_gat', provider: 'Google Analytics', purpose: 'Throttles request rate to limit data collection', duration: '1 minute', type: 'third_party', category: CookieCategory.PERFORMANCE },
  ],
  [CookieCategory.FUNCTIONALITY]: [
    { name: 'lang', provider: 'First Party', purpose: 'Stores language preference', duration: '1 year', type: 'first_party', category: CookieCategory.FUNCTIONALITY },
    { name: 'theme', provider: 'First Party', purpose: 'Stores display theme preference (light/dark)', duration: '1 year', type: 'first_party', category: CookieCategory.FUNCTIONALITY },
    { name: 'region', provider: 'First Party', purpose: 'Stores regional preference for content', duration: '1 year', type: 'first_party', category: CookieCategory.FUNCTIONALITY },
  ],
  [CookieCategory.TARGETING]: [
    { name: '_fbp', provider: 'Facebook (Meta)', purpose: 'Tracks visits across websites for ad targeting', duration: '3 months', type: 'third_party', category: CookieCategory.TARGETING },
    { name: '_gcl_au', provider: 'Google Ads', purpose: 'Stores conversion tracking data', duration: '3 months', type: 'third_party', category: CookieCategory.TARGETING },
    { name: 'IDE', provider: 'Google DoubleClick', purpose: 'Serves targeted advertisements based on browsing behavior', duration: '1 year', type: 'third_party', category: CookieCategory.TARGETING },
  ],
  [CookieCategory.SOCIAL_MEDIA]: [
    { name: 'li_sugr', provider: 'LinkedIn', purpose: 'Enables LinkedIn sharing functionality', duration: '3 months', type: 'third_party', category: CookieCategory.SOCIAL_MEDIA },
    { name: '__twid', provider: 'X (Twitter)', purpose: 'Enables content sharing on X', duration: '2 weeks', type: 'third_party', category: CookieCategory.SOCIAL_MEDIA },
  ],
};

export function getDefaultConsentModel(jurisdiction: Jurisdiction): ConsentModel {
  const defaults: Record<string, Omit<ConsentModel, 'jurisdiction'>> = {
    GDPR: { model: 'opt_in', granularByCategory: true, rejectAllRequired: true, cookieWallProhibited: true, notes: 'Prior opt-in consent required under the ePrivacy Directive and GDPR. Users must be able to reject all non-essential cookies as easily as they accept them.' },
    CCPA: { model: 'opt_out', granularByCategory: false, rejectAllRequired: false, cookieWallProhibited: false, notes: 'Opt-out model. A "Do Not Sell or Share My Personal Information" link must be provided.' },
    CPRA: { model: 'opt_out', granularByCategory: false, rejectAllRequired: false, cookieWallProhibited: false, notes: 'Opt-out model under CPRA. Requires "Do Not Sell or Share My Personal Information" link and limits on sensitive data use.' },
    PIPEDA: { model: 'implied', granularByCategory: false, rejectAllRequired: false, cookieWallProhibited: false, notes: 'Implied consent acceptable for non-sensitive cookies (analytics). Express consent required for tracking, profiling, and advertising cookies.' },
    QUEBEC_LAW25: { model: 'opt_in', granularByCategory: true, rejectAllRequired: true, cookieWallProhibited: true, notes: 'Express consent required. Cookie consent information must be available in French. Consent must be specific, informed, and freely given.' },
    ALBERTA_PIPA: { model: 'reasonable', granularByCategory: false, rejectAllRequired: false, cookieWallProhibited: false, notes: 'Consent must be reasonable and appropriate to the sensitivity of the information collected via cookies.' },
    BC_PIPA: { model: 'reasonable', granularByCategory: false, rejectAllRequired: false, cookieWallProhibited: false, notes: 'Consent must be reasonable and appropriate. Notification of cookie use is required.' },
  };

  const key = jurisdiction as string;
  const config = defaults[key] ?? { model: 'opt_in' as const, granularByCategory: false, rejectAllRequired: false, cookieWallProhibited: false, notes: '' };
  return { jurisdiction, ...config };
}
