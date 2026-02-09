import { Jurisdiction, JURISDICTION_LABELS, DATA_CATEGORY_LABELS, DataCategory } from '@core/data/enums.js';
import type { MappedRequirement } from '@core/data/types.js';
import { getRoleImplication } from './role-implications.ts';

// --- Processor Disclosure ---

interface Recipient {
  category: string;
  purpose: string;
  dataCategories: DataCategory[];
  country?: string;
}

interface ProcessorDisclosureInput {
  recipients: Recipient[];
  jurisdictions: Jurisdiction[];
  requirements: MappedRequirement[];
  generatedAt: Date;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function shortLabel(cat: DataCategory): string {
  return DATA_CATEGORY_LABELS[cat].split('(')[0].trim();
}

export function renderProcessorDisclosure(input: ProcessorDisclosureInput): string {
  const lines: string[] = [];

  // YAML frontmatter
  lines.push('---');
  lines.push('title: "Third-Party Processor Disclosure"');
  lines.push('document_type: "processor_disclosure"');
  lines.push(`generated: "${input.generatedAt.toISOString()}"`);
  lines.push('jurisdictions:');
  for (const j of input.jurisdictions) {
    lines.push(`  - "${j}"`);
  }
  lines.push(`processor_count: ${input.recipients.length}`);
  lines.push('---');
  lines.push('');

  // Title
  lines.push('# Third-Party Processor Disclosure');
  lines.push('');
  lines.push(
    'This document identifies the categories of third-party service providers with whom personal information may be shared, the purposes of such sharing, and the applicable regulatory requirements.',
  );
  lines.push('');

  // Third-Party Service Providers
  lines.push('## Third-Party Service Providers');
  lines.push('');
  if (input.recipients.length === 0) {
    lines.push('No third-party service providers identified.');
  } else {
    lines.push(
      'The following categories of third-party service providers may receive personal information in connection with the stated purposes:',
    );
    lines.push('');
    for (const r of input.recipients) {
      lines.push(`- **${r.category}**: ${r.purpose}`);
      if (r.country) {
        lines.push(`  - Location: ${r.country}`);
      }
      if (r.dataCategories.length > 0) {
        const labels = r.dataCategories.map(shortLabel).join(', ');
        lines.push(`  - Data categories: ${labels}`);
      }
    }
  }
  lines.push('');

  // Processor Registry Table
  lines.push('## Processor Registry');
  lines.push('');
  if (input.recipients.length > 0) {
    lines.push('| Category | Purpose | Data Categories | Country |');
    lines.push('|----------|---------|-----------------|---------|');
    for (const r of input.recipients) {
      const cats = r.dataCategories.map(shortLabel).join(', ');
      const country = r.country || 'Not specified';
      lines.push(`| ${r.category} | ${r.purpose} | ${cats} | ${country} |`);
    }
  } else {
    lines.push('No processors registered.');
  }
  lines.push('');

  // Regulatory Disclosure Requirements
  if (input.requirements.length > 0) {
    lines.push('## Regulatory Disclosure Requirements');
    lines.push('');

    const byJurisdiction = new Map<Jurisdiction, MappedRequirement[]>();
    for (const req of input.requirements) {
      const existing = byJurisdiction.get(req.jurisdiction) ?? [];
      existing.push(req);
      byJurisdiction.set(req.jurisdiction, existing);
    }

    for (const [jurisdiction, reqs] of byJurisdiction) {
      lines.push(`### ${JURISDICTION_LABELS[jurisdiction]}`);
      lines.push('');
      for (const req of reqs) {
        lines.push(req.disclaimerLanguage);
        lines.push('');
      }
    }
  }

  // Statutory References
  const allCitations = input.requirements;
  if (allCitations.length > 0) {
    lines.push('## Statutory References');
    lines.push('');
    const seen = new Set<string>();
    for (const req of allCitations) {
      const key = `${req.jurisdiction}-${req.statutoryReference}`;
      if (seen.has(key)) continue;
      seen.add(key);
      lines.push(`- **${req.statutoryReference}** (${JURISDICTION_LABELS[req.jurisdiction]})`);
    }
    lines.push('');
  }

  // Legal disclaimer
  lines.push('---');
  lines.push('');
  lines.push(
    '*This document does not constitute legal advice. It is generated as a reference tool and should be reviewed by qualified legal counsel before use in regulatory filings, data processing agreements, or public-facing disclosures.*',
  );
  lines.push('');

  return lines.join('\n');
}

// --- Role Determination Memo ---

interface DecisionPathEntry {
  questionNumber: number;
  question: string;
  answer: 'Yes' | 'No';
}

interface RoleDeterminationInput {
  entityType: 'controller' | 'processor' | 'joint_controller';
  outcomeLabel: string;
  outcomeExplanation: string;
  decisionPath: DecisionPathEntry[];
  jurisdictions: Jurisdiction[];
  generatedAt: Date;
}

const ENTITY_TYPE_DISPLAY: Record<string, string> = {
  controller: 'Data Controller',
  processor: 'Data Processor',
  joint_controller: 'Joint Controller',
};

export function renderRoleDeterminationMemo(input: RoleDeterminationInput): string {
  const lines: string[] = [];

  // YAML frontmatter
  lines.push('---');
  lines.push('title: "Entity Role Determination Memo"');
  lines.push('document_type: "role_determination"');
  lines.push(`determined_role: "${input.entityType}"`);
  lines.push(`generated: "${input.generatedAt.toISOString()}"`);
  lines.push('jurisdictions:');
  for (const j of input.jurisdictions) {
    lines.push(`  - "${j}"`);
  }
  lines.push('---');
  lines.push('');

  // Title
  lines.push('# Entity Role Determination Memo');
  lines.push('');
  lines.push(
    `Date: ${formatDate(input.generatedAt)}`,
  );
  lines.push('');

  // Conclusion
  lines.push('## Conclusion');
  lines.push('');
  lines.push(
    `Based on the assessment below, the organization is classified as a **${ENTITY_TYPE_DISPLAY[input.entityType] ?? input.entityType}**.`,
  );
  lines.push('');
  lines.push(input.outcomeExplanation);
  lines.push('');

  // Decision Path
  if (input.decisionPath.length > 0) {
    lines.push('## Decision Path');
    lines.push('');
    lines.push(
      'The following questions were assessed to arrive at the determination:',
    );
    lines.push('');
    for (const entry of input.decisionPath) {
      lines.push(`${entry.questionNumber}. **${entry.question}**`);
      lines.push(`   - Answer: ${entry.answer}`);
    }
    lines.push('');
  }

  // Regulatory Implications
  if (input.jurisdictions.length > 0) {
    lines.push('## Regulatory Implications');
    lines.push('');
    lines.push(
      `The following outlines the obligations of a ${ENTITY_TYPE_DISPLAY[input.entityType] ?? input.entityType} under each applicable jurisdiction:`,
    );
    lines.push('');

    for (const jurisdiction of input.jurisdictions) {
      lines.push(`### ${JURISDICTION_LABELS[jurisdiction]}`);
      lines.push('');
      const text = getRoleImplication(jurisdiction, input.entityType);
      if (text) {
        lines.push(text);
      } else {
        lines.push('Regulatory implications not available for this jurisdiction.');
      }
      lines.push('');
    }
  }

  // Legal disclaimer
  lines.push('---');
  lines.push('');
  lines.push(
    '*This memo does not constitute legal advice. The role determination is based on the responses provided and should be validated by qualified legal counsel. Regulatory obligations may vary based on specific circumstances not captured in this assessment.*',
  );
  lines.push('');

  return lines.join('\n');
}

// --- Cookie Disclaimer ---

interface CookieDisclaimerInput {
  websiteUrl: string;
  orgName: string;
  jurisdictions: Jurisdiction[];
  cookies: {
    id: string;
    name: string;
    provider: string;
    purpose: string;
    duration: string;
    type: 'first_party' | 'third_party';
    category: string;
  }[];
  consentModels: {
    jurisdiction: Jurisdiction;
    model: string;
    granularByCategory: boolean;
    rejectAllRequired: boolean;
    cookieWallProhibited: boolean;
    notes: string;
  }[];
  bannerPosition: string;
  generatedAt: Date;
}

const COOKIE_CATEGORY_DISPLAY: Record<string, string> = {
  strictly_necessary: 'Strictly Necessary Cookies',
  performance: 'Performance / Analytics Cookies',
  functionality: 'Functionality Cookies',
  targeting: 'Targeting / Advertising Cookies',
  social_media: 'Social Media Cookies',
};

const CONSENT_MODEL_DISPLAY: Record<string, string> = {
  opt_in: 'Opt-In (prior consent required)',
  opt_out: 'Opt-Out (consent assumed until withdrawn)',
  implied: 'Implied Consent',
  reasonable: 'Reasonable Consent',
};

const BANNER_POSITION_DISPLAY: Record<string, string> = {
  bottom: 'bottom bar',
  top: 'top bar',
  center_modal: 'center modal dialog',
};

const COOKIE_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  strictly_necessary:
    'These cookies are essential for the website to function properly. They enable core features such as security, session management, and accessibility. These cookies do not require consent as they are necessary for the provision of the service.',
  performance:
    'These cookies help us understand how visitors interact with our website by collecting and reporting anonymous usage data. They allow us to measure and improve the performance of our site.',
  functionality:
    'These cookies allow the website to remember choices you make (such as your preferred language or region) and provide enhanced, more personalized features.',
  targeting:
    'These cookies are used to deliver advertisements that are relevant to your interests. They may also be used to limit the number of times you see an advertisement and to help measure the effectiveness of advertising campaigns.',
  social_media:
    'These cookies are set by social media platforms to enable you to share our content with your networks. They may track your browsing activity across other websites.',
};

export function renderCookieDisclaimer(input: CookieDisclaimerInput): string {
  const lines: string[] = [];

  // YAML frontmatter
  lines.push('---');
  lines.push('title: "Cookie Disclaimer"');
  lines.push('document_type: "cookie_disclaimer"');
  lines.push(`generated: "${input.generatedAt.toISOString()}"`);
  lines.push('jurisdictions:');
  for (const j of input.jurisdictions) {
    lines.push(`  - "${j}"`);
  }
  lines.push(`cookie_count: ${input.cookies.length}`);
  if (input.websiteUrl) {
    lines.push(`website: "${input.websiteUrl}"`);
  }
  lines.push('---');
  lines.push('');

  // Title
  lines.push('# Cookie Policy');
  lines.push('');
  lines.push(`**Effective Date:** ${formatDate(input.generatedAt)}`);
  lines.push('');
  if (input.orgName) {
    lines.push(`**Organization:** ${input.orgName}`);
    lines.push('');
  }
  if (input.websiteUrl) {
    lines.push(`**Website:** ${input.websiteUrl}`);
    lines.push('');
  }

  // Introduction
  lines.push('## What Are Cookies');
  lines.push('');
  lines.push(
    'Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, to provide a better browsing experience, and to supply information to the owners of the website.',
  );
  lines.push('');
  lines.push(
    'This Cookie Policy explains what cookies we use, the purposes for which we use them, and how you can manage your cookie preferences.',
  );
  lines.push('');

  // Group cookies by category
  const grouped = new Map<string, typeof input.cookies>();
  for (const cookie of input.cookies) {
    const existing = grouped.get(cookie.category) ?? [];
    existing.push(cookie);
    grouped.set(cookie.category, existing);
  }

  // Cookie categories
  lines.push('## Cookies We Use');
  lines.push('');

  if (input.cookies.length === 0) {
    lines.push('No specific cookies have been documented at this time.');
    lines.push('');
  } else {
    // Summary of categories
    const categories = [...grouped.keys()];
    lines.push('We use the following categories of cookies:');
    lines.push('');
    for (const cat of categories) {
      const displayName = COOKIE_CATEGORY_DISPLAY[cat] ?? cat;
      const count = grouped.get(cat)?.length ?? 0;
      lines.push(`- **${displayName}** (${count} cookie${count !== 1 ? 's' : ''})`);
    }
    lines.push('');

    // Per-category sections with tables
    for (const [cat, catCookies] of grouped) {
      const displayName = COOKIE_CATEGORY_DISPLAY[cat] ?? cat;
      const description = COOKIE_CATEGORY_DESCRIPTIONS[cat] ?? '';

      lines.push(`### ${displayName}`);
      lines.push('');
      if (description) {
        lines.push(description);
        lines.push('');
      }

      lines.push('| Cookie Name | Provider | Purpose | Duration | Type |');
      lines.push('|-------------|----------|---------|----------|------|');
      for (const c of catCookies) {
        const typeLabel = c.type === 'third_party' ? 'Third Party' : 'First Party';
        lines.push(
          `| ${c.name || '—'} | ${c.provider || '—'} | ${c.purpose || '—'} | ${c.duration || '—'} | ${typeLabel} |`,
        );
      }
      lines.push('');
    }
  }

  // Consent mechanism
  lines.push('## Cookie Consent');
  lines.push('');
  lines.push(
    `When you first visit our website, you will be presented with a cookie consent ${BANNER_POSITION_DISPLAY[input.bannerPosition] ?? 'banner'} that allows you to accept or reject non-essential cookies.`,
  );
  lines.push('');

  // Strictly necessary note
  if (grouped.has('strictly_necessary')) {
    lines.push(
      'Strictly necessary cookies do not require your consent as they are essential for the website to function. All other categories of cookies require your consent before they are placed on your device.',
    );
    lines.push('');
  }

  // Per-jurisdiction consent requirements
  if (input.consentModels.length > 0) {
    lines.push('### Consent Requirements by Jurisdiction');
    lines.push('');
    for (const model of input.consentModels) {
      if (!input.jurisdictions.includes(model.jurisdiction)) continue;
      const label = JURISDICTION_LABELS[model.jurisdiction];
      lines.push(`**${label}**`);
      lines.push('');
      lines.push(`- Consent model: ${CONSENT_MODEL_DISPLAY[model.model] ?? model.model}`);
      if (model.granularByCategory) {
        lines.push('- Users may accept or reject cookies on a per-category basis');
      }
      if (model.rejectAllRequired) {
        lines.push('- A "Reject All" option is provided with equal prominence to the "Accept All" option');
      }
      if (model.cookieWallProhibited) {
        lines.push('- Access to the website is not conditional upon cookie consent (no cookie walls)');
      }
      if (model.notes) {
        lines.push(`- ${model.notes}`);
      }
      lines.push('');
    }
  }

  // Managing cookies
  lines.push('## How to Manage Cookies');
  lines.push('');
  lines.push(
    'You can change your cookie preferences at any time by clicking the cookie settings link in the footer of our website. You can also manage cookies through your browser settings:',
  );
  lines.push('');
  lines.push('- **Chrome:** Settings > Privacy and Security > Cookies and other site data');
  lines.push('- **Firefox:** Settings > Privacy & Security > Cookies and Site Data');
  lines.push('- **Safari:** Preferences > Privacy > Manage Website Data');
  lines.push('- **Edge:** Settings > Cookies and site permissions > Manage and delete cookies');
  lines.push('');
  lines.push(
    'Please note that disabling certain cookies may affect the functionality of our website.',
  );
  lines.push('');

  // Third-party cookies
  const thirdPartyCookies = input.cookies.filter((c) => c.type === 'third_party');
  if (thirdPartyCookies.length > 0) {
    lines.push('## Third-Party Cookies');
    lines.push('');
    lines.push(
      'Some cookies on our website are set by third-party service providers. We do not control these cookies. For more information about how these third parties use cookies, please refer to their respective privacy policies:',
    );
    lines.push('');
    const providers = [...new Set(thirdPartyCookies.map((c) => c.provider))];
    for (const provider of providers) {
      lines.push(`- ${provider}`);
    }
    lines.push('');
  }

  // Updates
  lines.push('## Updates to This Cookie Policy');
  lines.push('');
  lines.push(
    'We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. We encourage you to periodically review this page for the latest information on our cookie practices.',
  );
  lines.push('');

  // Contact
  lines.push('## Contact Us');
  lines.push('');
  lines.push(
    'If you have any questions about our use of cookies or this Cookie Policy, please contact us:',
  );
  lines.push('');
  if (input.orgName) {
    lines.push(`- **Organization:** ${input.orgName}`);
  }
  if (input.websiteUrl) {
    lines.push(`- **Website:** ${input.websiteUrl}`);
  }
  lines.push('');

  // Legal disclaimer
  lines.push('---');
  lines.push('');
  lines.push(
    '*This cookie policy does not constitute legal advice. It is generated as a reference tool and should be reviewed by qualified legal counsel before publication. Cookie requirements vary by jurisdiction and are subject to change.*',
  );
  lines.push('');

  return lines.join('\n');
}

export type { DecisionPathEntry, ProcessorDisclosureInput, RoleDeterminationInput, CookieDisclaimerInput };
