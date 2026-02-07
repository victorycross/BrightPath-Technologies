import { Jurisdiction, DataCategory, TopicCategory } from '../enums.js';
import type { RegulationModule, MappedRequirement, ValidatedInput } from '../types.js';

const SENSITIVE_CATEGORIES: DataCategory[] = [
  DataCategory.HEALTH,
  DataCategory.BIOMETRIC,
  DataCategory.FINANCIAL,
  DataCategory.SENSITIVE_PERSONAL,
  DataCategory.GEOLOCATION,
];

export const cpraModule: RegulationModule = {
  id: Jurisdiction.CPRA,
  fullName: 'California Privacy Rights Act',
  shortName: 'CPRA',
  effectiveDate: '2023-01-01',
  sourceUrl: 'https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?division=3.&part=4.&lawCode=CIV&title=1.81.5',

  mapRequirements(input: ValidatedInput): MappedRequirement[] {
    const reqs: MappedRequirement[] = [];
    const dp = input.dataPractices;

    // --- §1798.100: Disclosure at collection ---
    reqs.push({
      id: 'CPRA-100',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Accountability',
      statutoryReference: 'Cal. Civ. Code §1798.100 (as amended by CPRA)',
      obligationType: 'disclosure',
      requirementText: 'A business that controls the collection of a consumer\'s personal information shall, at or before the point of collection, inform consumers as to the categories of personal information to be collected, the purposes, and the length of time the business intends to retain each category.',
      disclaimerLanguage: `${input.orgProfile.legalName} discloses the categories of personal information collected, the purposes for which such information is used, and the retention periods, in accordance with the California Privacy Rights Act (Cal. Civ. Code §1798.100, as amended by CPRA).`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- §1798.100(c): Data minimization ---
    reqs.push({
      id: 'CPRA-100C',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting collection',
      statutoryReference: 'Cal. Civ. Code §1798.100(c) (CPRA)',
      obligationType: 'disclosure',
      requirementText: 'A business\'s collection, use, retention, and sharing of a consumer\'s personal information shall be reasonably necessary and proportionate to achieve the purposes for which the personal information was collected or processed.',
      disclaimerLanguage: 'Our collection, use, retention, and sharing of your personal information is reasonably necessary and proportionate to achieve the disclosed purposes. We do not collect or process personal information in a manner incompatible with those purposes (Cal. Civ. Code §1798.100(c)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- §1798.100(d): Storage limitation ---
    reqs.push({
      id: 'CPRA-100D',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting use, disclosure, and retention',
      statutoryReference: 'Cal. Civ. Code §1798.100(d) (CPRA)',
      obligationType: 'disclosure',
      requirementText: 'A business shall not retain a consumer\'s personal information for longer than is reasonably necessary for each disclosed purpose.',
      disclaimerLanguage: 'We do not retain your personal information for longer than is reasonably necessary for each disclosed purpose. Our retention periods are set forth below (Cal. Civ. Code §1798.100(d)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Retention schedule disclosures
    for (const entry of dp.retentionSchedule) {
      reqs.push({
        id: `CPRA-RET-${entry.dataCategory}`,
        jurisdiction: Jurisdiction.CPRA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Retention period',
        statutoryReference: 'Cal. Civ. Code §1798.100(d)',
        obligationType: 'disclosure',
        requirementText: `Retention period for ${entry.dataCategory}: ${entry.period}`,
        disclaimerLanguage: `${entry.dataCategory.replace(/_/g, ' ')}: ${entry.period}${entry.justification ? ` (${entry.justification})` : ''}`,
        conditionalOn: [`retentionSchedule.${entry.dataCategory}`],
        priority: 'required',
      });
    }

    // --- Purpose identification ---
    reqs.push({
      id: 'CPRA-PURPOSES',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Identifying purposes',
      statutoryReference: 'Cal. Civ. Code §1798.100(a)-(b) (CPRA)',
      obligationType: 'disclosure',
      requirementText: 'A business must disclose the purposes for which categories of personal information are collected and the length of retention.',
      disclaimerLanguage: 'We disclose the purposes for which we collect each category of personal information and the length of retention, as required by the CPRA (Cal. Civ. Code §1798.100(a)-(b)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Purpose-specific disclosures
    for (const entry of dp.processingPurposes) {
      reqs.push({
        id: `CPRA-PURPOSE-${entry.purpose}`,
        jurisdiction: Jurisdiction.CPRA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Purpose specification',
        statutoryReference: 'Cal. Civ. Code §1798.100(a)',
        obligationType: 'disclosure',
        requirementText: `Purpose identified: ${entry.purpose}. ${entry.description ?? ''}`,
        disclaimerLanguage: entry.description ?? `To support ${entry.purpose.replace(/_/g, ' ')}.`,
        conditionalOn: [`processingPurposes.${entry.purpose}`],
        priority: 'required',
      });
    }

    // --- §1798.100: Right to know (access) ---
    reqs.push({
      id: 'CPRA-ACCESS',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Individual access',
      statutoryReference: 'Cal. Civ. Code §1798.100(a), §1798.110 (CPRA)',
      obligationType: 'right',
      requirementText: 'A consumer shall have the right to request that a business disclose the categories and specific pieces of personal information it has collected.',
      disclaimerLanguage: 'You have the right to request that we disclose the categories and specific pieces of personal information we have collected about you, including the categories of sources, purposes, and third parties. We will respond within 45 days (Cal. Civ. Code §1798.100, §1798.110).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- §1798.105: Right to deletion ---
    reqs.push({
      id: 'CPRA-105',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to deletion',
      statutoryReference: 'Cal. Civ. Code §1798.105 (CPRA)',
      obligationType: 'right',
      requirementText: 'A consumer shall have the right to request that a business delete any personal information about the consumer.',
      disclaimerLanguage: 'You have the right to request deletion of your personal information, subject to certain exceptions. Upon a verifiable request, we and our service providers and contractors will delete the information (Cal. Civ. Code §1798.105).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- §1798.106: Right to correction (new in CPRA) ---
    reqs.push({
      id: 'CPRA-106',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to challenge accuracy',
      statutoryReference: 'Cal. Civ. Code §1798.106 (CPRA)',
      obligationType: 'right',
      requirementText: 'A consumer shall have the right to request a business that maintains inaccurate personal information about the consumer to correct that inaccurate personal information.',
      disclaimerLanguage: 'You have the right to request correction of inaccurate personal information that we maintain about you. We will use commercially reasonable efforts to correct the information as directed (Cal. Civ. Code §1798.106).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- §1798.120: Right to opt out of sale ---
    reqs.push({
      id: 'CPRA-120',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to opt out of sale',
      statutoryReference: 'Cal. Civ. Code §1798.120 (CPRA)',
      obligationType: 'right',
      requirementText: 'A consumer shall have the right to direct a business that sells or shares personal information not to sell or share the consumer\'s personal information.',
      disclaimerLanguage: 'You have the right to opt out of the sale or sharing of your personal information (Cal. Civ. Code §1798.120).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Expanded opt-out for cross-context behavioral advertising
    if (dp.thirdPartySharing.sharesForCrossBehavioral) {
      reqs.push({
        id: 'CPRA-120-BEHAVIORAL',
        jurisdiction: Jurisdiction.CPRA,
        topic: TopicCategory.DATA_SUBJECT_RIGHTS,
        subtopic: 'Opt out of cross-context behavioral advertising',
        statutoryReference: 'Cal. Civ. Code §1798.120, §1798.140(ah) (CPRA)',
        obligationType: 'right',
        requirementText: 'The CPRA expands the opt-out right to include the sharing of personal information for cross-context behavioral advertising.',
        disclaimerLanguage: 'We share personal information for cross-context behavioral advertising as defined by the CPRA. You have the right to opt out of this sharing. Use the "Do Not Sell or Share My Personal Information" link on our website (Cal. Civ. Code §1798.120, §1798.140(ah)).',
        conditionalOn: ['thirdPartySharing.sharesForCrossBehavioral'],
        priority: 'required',
      });
    }

    // "Do Not Sell or Share" link (conditional on sellsData or sharesForCrossBehavioral)
    if (dp.thirdPartySharing.sellsData || dp.thirdPartySharing.sharesForCrossBehavioral) {
      reqs.push({
        id: 'CPRA-135-LINK',
        jurisdiction: Jurisdiction.CPRA,
        topic: TopicCategory.DATA_SUBJECT_RIGHTS,
        subtopic: 'Do not sell or share link',
        statutoryReference: 'Cal. Civ. Code §1798.135(a) (CPRA)',
        obligationType: 'disclosure',
        requirementText: 'A business that sells or shares personal information shall provide a clear and conspicuous link on its website titled "Do Not Sell or Share My Personal Information."',
        disclaimerLanguage: 'We provide a "Do Not Sell or Share My Personal Information" link on our website through which you may exercise your opt-out rights (Cal. Civ. Code §1798.135(a)).',
        conditionalOn: ['thirdPartySharing.sellsData', 'thirdPartySharing.sharesForCrossBehavioral'],
        priority: 'required',
      });
    }

    // --- §1798.121: Right to limit use of sensitive PI ---
    const hasSensitive = dp.dataCategories.some((cat) => SENSITIVE_CATEGORIES.includes(cat));
    if (hasSensitive) {
      reqs.push({
        id: 'CPRA-121',
        jurisdiction: Jurisdiction.CPRA,
        topic: TopicCategory.DATA_SUBJECT_RIGHTS,
        subtopic: 'Right to limit use of sensitive personal information',
        statutoryReference: 'Cal. Civ. Code §1798.121 (CPRA)',
        obligationType: 'right',
        requirementText: 'A consumer shall have the right to direct a business that collects sensitive personal information to limit its use to that which is necessary to perform the services or provide the goods reasonably expected.',
        disclaimerLanguage: 'You have the right to limit our use of your sensitive personal information to that which is necessary to perform the services or provide the goods you expect. We provide a "Limit the Use of My Sensitive Personal Information" link on our website (Cal. Civ. Code §1798.121).',
        conditionalOn: ['dataCategories.sensitive'],
        priority: 'required',
      });
    }

    // --- §1798.125: Non-discrimination ---
    reqs.push({
      id: 'CPRA-125',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Non-discrimination',
      statutoryReference: 'Cal. Civ. Code §1798.125 (CPRA)',
      obligationType: 'right',
      requirementText: 'A business shall not discriminate against a consumer for exercising any of their rights under the CPRA.',
      disclaimerLanguage: 'We will not discriminate against you for exercising any of your rights under the CPRA, including by denying goods or services, charging different prices, or providing a different quality (Cal. Civ. Code §1798.125).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Third-party sharing ---
    if (dp.thirdPartySharing.shares) {
      reqs.push({
        id: 'CPRA-THIRD-PARTY',
        jurisdiction: Jurisdiction.CPRA,
        topic: TopicCategory.THIRD_PARTY,
        subtopic: 'Accountability for transfers',
        statutoryReference: 'Cal. Civ. Code §1798.100(d), §1798.140(ag) (CPRA)',
        obligationType: 'disclosure',
        requirementText: 'A business must contractually obligate service providers and contractors to comply with the CPRA and limit the use of personal information to the purposes specified in the contract.',
        disclaimerLanguage: `${input.orgProfile.legalName} contractually obligates service providers and contractors to comply with the CPRA and to limit their use of personal information to the purposes specified in our agreements (Cal. Civ. Code §1798.100(d), §1798.140(ag)).`,
        conditionalOn: ['thirdPartySharing.shares'],
        priority: 'required',
      });
    }

    // --- §1798.185(a)(15): Risk assessments (conditional on conductsDPIA) ---
    if (dp.conductsDPIA) {
      reqs.push({
        id: 'CPRA-RISK-ASSESSMENT',
        jurisdiction: Jurisdiction.CPRA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Data protection impact assessment',
        statutoryReference: 'Cal. Civ. Code §1798.185(a)(15) (CPRA)',
        obligationType: 'process',
        requirementText: 'The CPRA directs the California Privacy Protection Agency to issue regulations requiring businesses whose processing presents significant risk to consumer privacy to perform cybersecurity audits and risk assessments.',
        disclaimerLanguage: 'We conduct regular risk assessments of our processing activities that present significant risk to consumer privacy, in accordance with CPRA requirements (Cal. Civ. Code §1798.185(a)(15)).',
        conditionalOn: ['conductsDPIA'],
        priority: 'required',
      });
    }

    // --- Automated decision-making (opt-out right) ---
    if (dp.usesAutomatedDecisionMaking) {
      reqs.push({
        id: 'CPRA-ADM',
        jurisdiction: Jurisdiction.CPRA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Automated decision-making',
        statutoryReference: 'Cal. Civ. Code §1798.185(a)(16) (CPRA)',
        obligationType: 'disclosure',
        requirementText: 'The CPRA directs the CPPA to issue regulations governing access and opt-out rights related to businesses\' use of automated decisionmaking technology, including profiling.',
        disclaimerLanguage: 'We use automated decision-making technology, including profiling. You may have the right to opt out of such processing and to request information about the logic involved, in accordance with CPRA regulations (Cal. Civ. Code §1798.185(a)(16)).',
        conditionalOn: ['usesAutomatedDecisionMaking'],
        priority: 'required',
      });
    }

    // --- Safeguards ---
    reqs.push({
      id: 'CPRA-SAFEGUARDS',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Safeguards',
      statutoryReference: 'Cal. Civ. Code §1798.100(e) (CPRA)',
      obligationType: 'disclosure',
      requirementText: 'A business shall implement reasonable security procedures and practices appropriate to the nature of the personal information.',
      disclaimerLanguage: 'We implement reasonable security procedures and practices appropriate to the nature of the personal information we collect (Cal. Civ. Code §1798.100(e)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Breach ---
    reqs.push({
      id: 'CPRA-BREACH',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Breach notification',
      statutoryReference: 'Cal. Civ. Code §1798.150 (CPRA)',
      obligationType: 'disclosure',
      requirementText: 'Consumers have a private right of action for data breaches involving certain personal information categories resulting from a business\'s failure to maintain reasonable security.',
      disclaimerLanguage: 'In the event of a data breach resulting from our failure to maintain reasonable security practices, affected consumers may seek statutory damages under the CPRA (Cal. Civ. Code §1798.150).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Children ---
    if (dp.collectsChildrensData) {
      reqs.push({
        id: 'CPRA-CHILDREN',
        jurisdiction: Jurisdiction.CPRA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Consent for children',
        statutoryReference: 'Cal. Civ. Code §1798.120(c)-(d) (CPRA)',
        obligationType: 'disclosure',
        requirementText: 'A business shall not sell or share the personal information of consumers under 16 without affirmative authorization. For consumers under 13, parental consent is required.',
        disclaimerLanguage: 'We do not sell or share the personal information of consumers under 16 without affirmative authorization. For consumers under 13, we require opt-in consent from a parent or guardian (Cal. Civ. Code §1798.120(c)-(d)).',
        conditionalOn: ['collectsChildrensData'],
        priority: 'required',
      });
    }

    // --- Cookies and tracking ---
    if (dp.usesCookies) {
      reqs.push({
        id: 'CPRA-COOKIES',
        jurisdiction: Jurisdiction.CPRA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Cookies and tracking technologies',
        statutoryReference: 'Cal. Civ. Code §1798.100, §1798.140(e) (CPRA)',
        obligationType: 'disclosure',
        requirementText: 'The use of cookies and tracking technologies that collect personal information must be disclosed, and sharing of such data for cross-context behavioral advertising triggers opt-out rights.',
        disclaimerLanguage: 'We use cookies and similar tracking technologies. Where such technologies are used for cross-context behavioral advertising, you have the right to opt out under the CPRA (Cal. Civ. Code §1798.100, §1798.140(e)).',
        conditionalOn: ['usesCookies'],
        priority: 'required',
      });
    }

    // --- Enforcement: CPPA ---
    reqs.push({
      id: 'CPRA-ENFORCEMENT',
      jurisdiction: Jurisdiction.CPRA,
      topic: TopicCategory.ENFORCEMENT,
      subtopic: 'Challenging compliance',
      statutoryReference: 'Cal. Civ. Code §1798.199.10-§1798.199.100 (CPRA)',
      obligationType: 'disclosure',
      requirementText: 'The CPRA established the California Privacy Protection Agency (CPPA) to implement and enforce the CPRA.',
      disclaimerLanguage: `You may contact our ${input.orgProfile.dpoContact.title} at ${input.orgProfile.dpoContact.email} regarding any concerns about our CPRA compliance. The CPRA is enforced by the California Privacy Protection Agency (CPPA) at cppa.ca.gov.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    return reqs;
  },
};
