import {
  TopicCategory,
  Jurisdiction,
  JURISDICTION_LABELS,
  DATA_CATEGORY_LABELS,
  DataCategory,
  DataSource,
} from '../data/enums.js';
import type {
  ValidatedInput,
  MappedRequirement,
  DisclaimerSection,
  SectionParagraph,
  JurisdictionCallout,
  StatutoryCitation,
  SectionId,
} from '../data/types.js';
import { SECTION_ORDER } from '../data/types.js';
import { formatDate } from '../utils/validators.js';

const DATA_SOURCE_LABELS: Record<DataSource, string> = {
  [DataSource.DIRECTLY_FROM_SUBJECT]: 'directly from you',
  [DataSource.THIRD_PARTY_PROVIDERS]: 'from third-party providers',
  [DataSource.AUTOMATED_COLLECTION]: 'through automated collection technologies',
  [DataSource.PUBLIC_SOURCES]: 'from publicly available sources',
  [DataSource.SOCIAL_MEDIA]: 'from social media platforms',
};

type SectionBuilder = (input: ValidatedInput, reqs: MappedRequirement[]) => DisclaimerSection | null;

const SECTION_BUILDERS: Record<SectionId, SectionBuilder> = {
  'preamble': buildPreamble,
  'data-collection': buildDataCollection,
  'legal-basis': buildLegalBasis,
  'use-of-data': buildUseOfData,
  'data-sharing': buildDataSharing,
  'cross-border': buildCrossBorder,
  'retention': buildRetention,
  'data-subject-rights': buildDataSubjectRights,
  'security-measures': buildSecurityMeasures,
  'children': buildChildren,
  'cookies': buildCookies,
  'automated-decisions': buildAutomatedDecisions,
  'changes-to-policy': buildChangesToPolicy,
  'contact': buildContact,
  'jurisdiction-specific': buildJurisdictionSpecific,
};

export function assembleSections(
  requirements: MappedRequirement[],
  input: ValidatedInput,
): DisclaimerSection[] {
  const sections: DisclaimerSection[] = [];

  for (let i = 0; i < SECTION_ORDER.length; i++) {
    const sectionId = SECTION_ORDER[i];
    const builder = SECTION_BUILDERS[sectionId];
    const section = builder(input, requirements);
    if (section) {
      section.order = i + 1;
      sections.push(section);
    }
  }

  return sections;
}

// --- Section Builders ---

function buildPreamble(input: ValidatedInput, _reqs: MappedRequirement[]): DisclaimerSection {
  const jurisdictionNames = input.jurisdictions.map((j) => JURISDICTION_LABELS[j]).join('; ');

  return {
    id: 'preamble',
    heading: 'Privacy Policy',
    order: 1,
    paragraphs: [
      p(`**Effective Date:** ${formatDate(new Date())}`),
      p(`**Last Updated:** ${formatDate(new Date())}`),
      p(`This Privacy Policy describes how ${input.orgProfile.legalName}${input.orgProfile.tradingName ? ` (doing business as "${input.orgProfile.tradingName}")` : ''} ("we," "us," or "our") collects, uses, discloses, and protects your personal information${input.orgProfile.websiteUrl ? ` in connection with our website at ${input.orgProfile.websiteUrl} and` : ''} our products and services.`),
      p(`This policy has been prepared to comply with the following privacy legislation: ${jurisdictionNames}.`),
      p('**IMPORTANT NOTICE:** This document does not constitute legal advice. It has been generated as a starting point and should be reviewed by qualified legal counsel before publication or reliance.', 'bold'),
    ],
    jurisdictionCallouts: [],
    citations: [],
  };
}

function buildDataCollection(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection {
  const dp = input.dataPractices;
  const categoryList = dp.dataCategories
    .map((cat) => `- ${DATA_CATEGORY_LABELS[cat]}`)
    .join('\n');

  const sourceList = dp.dataSources
    .map((src) => DATA_SOURCE_LABELS[src])
    .join(', ');

  const collectionReqs = reqs.filter((r) => r.topic === TopicCategory.DATA_MANAGEMENT && r.subtopic === 'Limiting collection');

  return {
    id: 'data-collection',
    heading: 'Information We Collect',
    order: 2,
    paragraphs: [
      p('We collect the following categories of personal information:'),
      p(categoryList),
      p(`We collect this information ${sourceList}.`),
      ...collectionReqs.map((r) => p(r.disclaimerLanguage)),
    ],
    jurisdictionCallouts: [],
    citations: collectionReqs.map((r) => ({
      jurisdiction: r.jurisdiction,
      reference: r.statutoryReference,
      description: r.requirementText,
    })),
  };
}

function buildLegalBasis(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection {
  const consentReqs = reqs.filter(
    (r) => r.topic === TopicCategory.ENTERPRISE_REQUIREMENTS && r.subtopic.toLowerCase().includes('consent'),
  );

  return {
    id: 'legal-basis',
    heading: 'Legal Basis for Processing',
    order: 3,
    paragraphs: [
      p('We process your personal information on the following legal bases:'),
      ...input.dataPractices.processingPurposes.map((pp) =>
        p(`- **${pp.purpose.replace(/_/g, ' ')}**: ${pp.legalBasis.replace(/_/g, ' ')}${pp.description ? ` — ${pp.description}` : ''}`),
      ),
      ...consentReqs.map((r) => p(r.disclaimerLanguage)),
    ],
    jurisdictionCallouts: buildJurisdictionCallouts(consentReqs),
    citations: consentReqs.map((r) => citation(r)),
  };
}

function buildUseOfData(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection {
  const purposeReqs = reqs.filter(
    (r) => r.subtopic === 'Identifying purposes' || r.subtopic === 'Purpose specification',
  );

  return {
    id: 'use-of-data',
    heading: 'How We Use Your Information',
    order: 4,
    paragraphs: [
      p('We use your personal information for the following purposes:'),
      ...input.dataPractices.processingPurposes.map((pp) =>
        p(`- **${pp.purpose.replace(/_/g, ' ')}**${pp.description ? `: ${pp.description}` : ''}`),
      ),
      ...purposeReqs
        .filter((r) => r.subtopic === 'Identifying purposes')
        .map((r) => p(r.disclaimerLanguage)),
    ],
    jurisdictionCallouts: [],
    citations: purposeReqs.map((r) => citation(r)),
  };
}

function buildDataSharing(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection | null {
  const dp = input.dataPractices;
  if (!dp.thirdPartySharing.shares) {
    return {
      id: 'data-sharing',
      heading: 'Disclosure of Your Information',
      order: 5,
      paragraphs: [p('We do not sell, trade, or otherwise transfer your personal information to third parties.')],
      jurisdictionCallouts: [],
      citations: [],
    };
  }

  const sharingReqs = reqs.filter((r) => r.topic === TopicCategory.THIRD_PARTY);
  const recipients = dp.thirdPartySharing.recipients ?? [];

  return {
    id: 'data-sharing',
    heading: 'Disclosure of Your Information',
    order: 5,
    paragraphs: [
      p('We may disclose your personal information to the following categories of third parties:'),
      ...recipients.map((r) =>
        p(`- **${r.category}**: ${r.purpose}${r.country ? ` (located in ${r.country})` : ''}`),
      ),
      ...sharingReqs.map((r) => p(r.disclaimerLanguage)),
    ],
    jurisdictionCallouts: buildJurisdictionCallouts(sharingReqs),
    citations: sharingReqs.map((r) => citation(r)),
  };
}

function buildCrossBorder(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection | null {
  if (!input.dataPractices.crossBorderTransfers.transfers) {
    return null;
  }

  const transferReqs = reqs.filter(
    (r) => r.subtopic === 'Cross-border transfers' || r.subtopic.includes('cross-border'),
  );

  return {
    id: 'cross-border',
    heading: 'International Data Transfers',
    order: 6,
    paragraphs: [
      ...transferReqs.map((r) => p(r.disclaimerLanguage)),
    ],
    jurisdictionCallouts: buildJurisdictionCallouts(transferReqs),
    citations: transferReqs.map((r) => citation(r)),
  };
}

function buildRetention(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection {
  const retentionReqs = reqs.filter(
    (r) => r.subtopic === 'Limiting use, disclosure, and retention',
  );
  const periodReqs = reqs.filter((r) => r.subtopic === 'Retention period');

  const paragraphs: SectionParagraph[] = [
    ...retentionReqs.map((r) => p(r.disclaimerLanguage)),
  ];

  if (periodReqs.length > 0) {
    paragraphs.push(p('Our retention periods for specific categories of personal information are as follows:'));
    paragraphs.push(...periodReqs.map((r) => p(`- ${r.disclaimerLanguage}`)));
  }

  return {
    id: 'retention',
    heading: 'Data Retention',
    order: 7,
    paragraphs,
    jurisdictionCallouts: [],
    citations: [...retentionReqs, ...periodReqs].map((r) => citation(r)),
  };
}

function buildDataSubjectRights(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection {
  const rightsReqs = reqs.filter((r) => r.topic === TopicCategory.DATA_SUBJECT_RIGHTS);
  const singleJurisdiction = input.jurisdictions.length === 1;

  const paragraphs: SectionParagraph[] = [];

  if (singleJurisdiction) {
    // Single jurisdiction: inline rights directly in paragraphs
    paragraphs.push(
      p('You have certain rights regarding the personal information we hold about you.'),
    );
    paragraphs.push(
      p(`Under ${JURISDICTION_LABELS[input.jurisdictions[0]]}, you have the right to:`),
    );
    for (const r of rightsReqs) {
      paragraphs.push(p(`- ${r.disclaimerLanguage}`));
    }
  } else {
    // Multiple jurisdictions: use callouts
    paragraphs.push(
      p('You have certain rights regarding the personal information we hold about you. These rights vary depending on your jurisdiction of residence.'),
    );
  }

  // Build callouts only for multi-jurisdiction
  const callouts: JurisdictionCallout[] = [];
  if (!singleJurisdiction) {
    const byJurisdiction = groupByJurisdiction(rightsReqs);
    for (const [jurisdiction, jReqs] of byJurisdiction) {
      callouts.push({
        jurisdiction,
        heading: `For Individuals Subject to ${JURISDICTION_LABELS[jurisdiction]}`,
        body: jReqs.map((r) => `- ${r.disclaimerLanguage}`).join('\n'),
        citations: jReqs.map((r) => citation(r)),
      });
    }
  }

  return {
    id: 'data-subject-rights',
    heading: 'Your Rights',
    order: 8,
    paragraphs,
    jurisdictionCallouts: callouts,
    citations: rightsReqs.map((r) => citation(r)),
  };
}

function buildSecurityMeasures(_input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection {
  const secReqs = reqs.filter((r) => r.topic === TopicCategory.DATA_PROTECTION);

  return {
    id: 'security-measures',
    heading: 'Data Security',
    order: 9,
    paragraphs: secReqs.map((r) => p(r.disclaimerLanguage)),
    jurisdictionCallouts: [],
    citations: secReqs.map((r) => citation(r)),
  };
}

function buildChildren(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection | null {
  if (!input.dataPractices.collectsChildrensData) {
    return null;
  }

  const childReqs = reqs.filter((r) => r.subtopic.toLowerCase().includes('children') || r.subtopic.toLowerCase().includes('age'));

  return {
    id: 'children',
    heading: "Children's Privacy",
    order: 10,
    paragraphs: childReqs.map((r) => p(r.disclaimerLanguage)),
    jurisdictionCallouts: [],
    citations: childReqs.map((r) => citation(r)),
  };
}

function buildCookies(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection | null {
  if (!input.dataPractices.usesCookies) {
    return null;
  }

  const cookieReqs = reqs.filter(
    (r) => r.subtopic.toLowerCase().includes('cookie') || r.subtopic.toLowerCase().includes('tracking'),
  );

  return {
    id: 'cookies',
    heading: 'Cookies and Tracking Technologies',
    order: 11,
    paragraphs: cookieReqs.map((r) => p(r.disclaimerLanguage)),
    jurisdictionCallouts: [],
    citations: cookieReqs.map((r) => citation(r)),
  };
}

function buildAutomatedDecisions(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection | null {
  if (!input.dataPractices.usesAutomatedDecisionMaking) {
    return null;
  }

  const admReqs = reqs.filter((r) => r.subtopic.toLowerCase().includes('automated'));

  return {
    id: 'automated-decisions',
    heading: 'Automated Decision-Making',
    order: 12,
    paragraphs: admReqs.map((r) => p(r.disclaimerLanguage)),
    jurisdictionCallouts: [],
    citations: admReqs.map((r) => citation(r)),
  };
}

function buildChangesToPolicy(input: ValidatedInput, _reqs: MappedRequirement[]): DisclaimerSection {
  return {
    id: 'changes-to-policy',
    heading: 'Changes to This Privacy Policy',
    order: 13,
    paragraphs: [
      p(`${input.orgProfile.legalName} reserves the right to update or modify this Privacy Policy at any time. When we make material changes, we will notify you by updating the "Last Updated" date at the top of this policy${input.orgProfile.websiteUrl ? ' and, where required by applicable law, by providing additional notice (such as a notice on our website or direct communication)' : ''}.`),
      p('We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your personal information.'),
    ],
    jurisdictionCallouts: [],
    citations: [],
  };
}

function buildContact(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection {
  const dpo = input.orgProfile.dpoContact;
  const challengeReqs = reqs.filter((r) => r.subtopic === 'Challenging compliance');

  const paragraphs: SectionParagraph[] = [
    p('If you have questions or concerns about this Privacy Policy or our data practices, or if you wish to exercise any of your rights, please contact us:'),
    p(`**${dpo.title}**${dpo.name ? `\n${dpo.name}` : ''}\nEmail: ${dpo.email}${dpo.phone ? `\nPhone: ${dpo.phone}` : ''}${dpo.address ? `\nAddress: ${dpo.address}` : ''}`),
    ...challengeReqs.map((r) => p(r.disclaimerLanguage)),
  ];

  if (input.orgProfile.euRepresentative) {
    const rep = input.orgProfile.euRepresentative;
    paragraphs.push(
      p(`**EU Representative (GDPR Article 27)**\n${rep.name}\nEmail: ${rep.email}\nAddress: ${rep.address}`),
    );
  }

  return {
    id: 'contact',
    heading: 'Contact Us',
    order: 14,
    paragraphs,
    jurisdictionCallouts: [],
    citations: challengeReqs.map((r) => citation(r)),
  };
}

function buildJurisdictionSpecific(input: ValidatedInput, reqs: MappedRequirement[]): DisclaimerSection | null {
  // Collect requirements that are enforcement-related or jurisdiction-specific addenda
  const specificReqs = reqs.filter(
    (r) => r.topic === TopicCategory.ENFORCEMENT && r.subtopic !== 'Challenging compliance',
  );

  if (specificReqs.length === 0) {
    return null;
  }

  const callouts = buildJurisdictionCallouts(specificReqs);

  return {
    id: 'jurisdiction-specific',
    heading: 'Jurisdiction-Specific Provisions',
    order: 15,
    paragraphs: [
      p('The following provisions apply to residents of specific jurisdictions:'),
    ],
    jurisdictionCallouts: callouts,
    citations: specificReqs.map((r) => citation(r)),
  };
}

// --- Helpers ---

function p(text: string, emphasis: 'normal' | 'bold' | 'italic' = 'normal'): SectionParagraph {
  return { text, emphasis, jurisdictionScope: 'all' };
}

function citation(req: MappedRequirement): StatutoryCitation {
  return {
    jurisdiction: req.jurisdiction,
    reference: req.statutoryReference,
    description: req.requirementText,
  };
}

function groupByJurisdiction(reqs: MappedRequirement[]): Map<Jurisdiction, MappedRequirement[]> {
  const map = new Map<Jurisdiction, MappedRequirement[]>();
  for (const req of reqs) {
    const existing = map.get(req.jurisdiction) ?? [];
    existing.push(req);
    map.set(req.jurisdiction, existing);
  }
  return map;
}

function buildJurisdictionCallouts(reqs: MappedRequirement[]): JurisdictionCallout[] {
  const grouped = groupByJurisdiction(reqs);
  const callouts: JurisdictionCallout[] = [];

  for (const [jurisdiction, jReqs] of grouped) {
    if (jReqs.length > 0) {
      callouts.push({
        jurisdiction,
        heading: JURISDICTION_LABELS[jurisdiction],
        body: jReqs.map((r) => r.disclaimerLanguage).join('\n\n'),
        citations: jReqs.map((r) => citation(r)),
      });
    }
  }

  return callouts;
}
