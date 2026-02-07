import { Jurisdiction, DataCategory, LegalBasis, TopicCategory, DataSource, ConsentMechanism } from '../enums.js';
import type { RegulationModule, MappedRequirement, ValidatedInput } from '../types.js';

const SENSITIVE_CATEGORIES: DataCategory[] = [
  DataCategory.HEALTH,
  DataCategory.BIOMETRIC,
  DataCategory.FINANCIAL,
  DataCategory.SENSITIVE_PERSONAL,
  DataCategory.CHILDRENS,
];

export const pipedaModule: RegulationModule = {
  id: Jurisdiction.PIPEDA,
  fullName: 'Personal Information Protection and Electronic Documents Act',
  shortName: 'PIPEDA',
  effectiveDate: '2000-01-01',
  sourceUrl: 'https://laws-lois.justice.gc.ca/eng/acts/P-8.6/',

  mapRequirements(input: ValidatedInput): MappedRequirement[] {
    const reqs: MappedRequirement[] = [];
    const dp = input.dataPractices;

    // --- Principle 4.1: Accountability ---
    reqs.push({
      id: 'PIPEDA-P4.1',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Accountability',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.1',
      obligationType: 'disclosure',
      requirementText: 'An organization is responsible for personal information under its control and shall designate an individual or individuals who are accountable for the organization\'s compliance.',
      disclaimerLanguage: `${input.orgProfile.legalName} is responsible for personal information under its control. Our ${input.orgProfile.dpoContact.title}, ${input.orgProfile.dpoContact.name ?? ''}, is accountable for our compliance with PIPEDA and can be reached at ${input.orgProfile.dpoContact.email}.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Principle 4.1.3: Accountability for third-party transfers
    if (dp.thirdPartySharing.shares || dp.crossBorderTransfers.transfers) {
      reqs.push({
        id: 'PIPEDA-P4.1.3',
        jurisdiction: Jurisdiction.PIPEDA,
        topic: TopicCategory.THIRD_PARTY,
        subtopic: 'Accountability for transfers',
        statutoryReference: 'PIPEDA Schedule 1, Principle 4.1.3',
        obligationType: 'disclosure',
        requirementText: 'An organization is responsible for personal information that has been transferred to a third party for processing. The organization shall use contractual or other means to provide a comparable level of protection while the information is being processed by a third party.',
        disclaimerLanguage: `When we transfer your personal information to third parties for processing, ${input.orgProfile.legalName} remains accountable for its protection. We use contractual agreements to ensure that third-party service providers afford a comparable level of protection to the personal information in their custody (PIPEDA Principle 4.1.3).`,
        conditionalOn: ['thirdPartySharing.shares', 'crossBorderTransfers.transfers'],
        priority: 'required',
      });
    }

    // --- Principle 4.2: Identifying Purposes ---
    reqs.push({
      id: 'PIPEDA-P4.2',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Identifying purposes',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.2',
      obligationType: 'disclosure',
      requirementText: 'The purposes for which personal information is collected shall be identified by the organization at or before the time the information is collected.',
      disclaimerLanguage: 'We identify the purposes for which we collect your personal information at or before the time of collection, as required by PIPEDA Principle 4.2. The purposes for which we collect personal information are set out below.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Purpose-specific disclosures
    for (const entry of dp.processingPurposes) {
      reqs.push({
        id: `PIPEDA-P4.2-${entry.purpose}`,
        jurisdiction: Jurisdiction.PIPEDA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Purpose specification',
        statutoryReference: 'PIPEDA Schedule 1, Principle 4.2.1',
        obligationType: 'disclosure',
        requirementText: `Purpose identified: ${entry.purpose}. ${entry.description ?? ''}`,
        disclaimerLanguage: entry.description ?? `To support ${entry.purpose.replace(/_/g, ' ')}.`,
        conditionalOn: [`processingPurposes.${entry.purpose}`],
        priority: 'required',
      });
    }

    // --- Principle 4.3: Consent ---
    const hasSensitive = dp.dataCategories.some((cat) => SENSITIVE_CATEGORIES.includes(cat));

    reqs.push({
      id: 'PIPEDA-P4.3',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Consent',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.3',
      obligationType: 'disclosure',
      requirementText: 'The knowledge and consent of the individual are required for the collection, use, or disclosure of personal information, except where inappropriate.',
      disclaimerLanguage: 'We obtain your knowledge and consent for the collection, use, or disclosure of your personal information, except where exempted by law (PIPEDA Principle 4.3).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    if (hasSensitive) {
      reqs.push({
        id: 'PIPEDA-P4.3-SENSITIVE',
        jurisdiction: Jurisdiction.PIPEDA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Express consent for sensitive information',
        statutoryReference: 'PIPEDA Schedule 1, Principle 4.3.4',
        obligationType: 'disclosure',
        requirementText: 'Express consent shall be obtained when the information is likely to be considered sensitive.',
        disclaimerLanguage: 'Where we collect sensitive personal information — including health information, biometric data, or financial information — we obtain your express consent, as required by PIPEDA Principle 4.3.4. Sensitive personal information requires a higher degree of protection, and we apply additional safeguards to this category of data.',
        conditionalOn: ['dataCategories.sensitive'],
        priority: 'required',
      });
    }

    if (dp.collectsChildrensData) {
      reqs.push({
        id: 'PIPEDA-P4.3-CHILDREN',
        jurisdiction: Jurisdiction.PIPEDA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Consent for children',
        statutoryReference: 'PIPEDA Schedule 1, Principle 4.3 (OPC Guidelines for obtaining meaningful consent)',
        obligationType: 'disclosure',
        requirementText: 'Organizations must consider the capacity of individuals to provide meaningful consent. For children, consent of a parent or guardian may be required.',
        disclaimerLanguage: `Where we collect personal information from individuals under the age of ${dp.minimumAgeThreshold ?? 13}, we obtain verifiable consent from a parent or guardian, in accordance with OPC guidelines for obtaining meaningful consent from minors.`,
        conditionalOn: ['collectsChildrensData'],
        priority: 'required',
      });
    }

    // --- Principle 4.4: Limiting Collection ---
    reqs.push({
      id: 'PIPEDA-P4.4',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting collection',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.4',
      obligationType: 'disclosure',
      requirementText: 'The collection of personal information shall be limited to that which is necessary for the purposes identified by the organization.',
      disclaimerLanguage: 'We limit the collection of personal information to that which is necessary for the purposes we have identified (PIPEDA Principle 4.4). We collect personal information by fair and lawful means.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Principle 4.5: Limiting Use, Disclosure, and Retention ---
    reqs.push({
      id: 'PIPEDA-P4.5',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting use, disclosure, and retention',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.5',
      obligationType: 'disclosure',
      requirementText: 'Personal information shall not be used or disclosed for purposes other than those for which it was collected, except with the consent of the individual or as required by law. Personal information shall be retained only as long as necessary for the fulfillment of those purposes.',
      disclaimerLanguage: 'We do not use or disclose your personal information for purposes other than those for which it was collected, except with your consent or as permitted or required by law. We retain personal information only for as long as necessary to fulfill the purposes for which it was collected (PIPEDA Principle 4.5).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Retention schedule disclosures
    for (const entry of dp.retentionSchedule) {
      reqs.push({
        id: `PIPEDA-P4.5-RET-${entry.dataCategory}`,
        jurisdiction: Jurisdiction.PIPEDA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Retention period',
        statutoryReference: 'PIPEDA Schedule 1, Principle 4.5.2',
        obligationType: 'disclosure',
        requirementText: `Retention period for ${entry.dataCategory}: ${entry.period}`,
        disclaimerLanguage: `${entry.dataCategory.replace(/_/g, ' ')}: ${entry.period}${entry.justification ? ` (${entry.justification})` : ''}`,
        conditionalOn: [`retentionSchedule.${entry.dataCategory}`],
        priority: 'required',
      });
    }

    // --- Principle 4.6: Accuracy ---
    reqs.push({
      id: 'PIPEDA-P4.6',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Accuracy',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.6',
      obligationType: 'disclosure',
      requirementText: 'Personal information shall be as accurate, complete, and up-to-date as is necessary for the purposes for which it is to be used.',
      disclaimerLanguage: 'We take reasonable steps to ensure that personal information in our custody is accurate, complete, and up-to-date as is necessary for the purposes for which it is used (PIPEDA Principle 4.6).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Principle 4.7: Safeguards ---
    reqs.push({
      id: 'PIPEDA-P4.7',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Safeguards',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.7',
      obligationType: 'disclosure',
      requirementText: 'Personal information shall be protected by security safeguards appropriate to the sensitivity of the information.',
      disclaimerLanguage: 'We protect your personal information with security safeguards appropriate to the sensitivity of the information, including physical, organizational, and technological measures (PIPEDA Principle 4.7). The nature of the safeguards varies depending on the sensitivity of the information, the amount, distribution, format of the information, and the method of storage.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Principle 4.8: Openness ---
    reqs.push({
      id: 'PIPEDA-P4.8',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Openness',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.8',
      obligationType: 'disclosure',
      requirementText: 'An organization shall make readily available to individuals specific information about its policies and practices relating to the management of personal information.',
      disclaimerLanguage: 'This privacy policy describes our policies and practices for the management of personal information. This policy is readily available to individuals upon request and is published on our website (PIPEDA Principle 4.8).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Principle 4.9: Individual Access ---
    reqs.push({
      id: 'PIPEDA-P4.9',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Individual access',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.9',
      obligationType: 'right',
      requirementText: 'Upon request, an individual shall be informed of the existence, use, and disclosure of his or her personal information and shall be given access to that information.',
      disclaimerLanguage: 'You have the right to request access to your personal information held by us. Upon receipt of a written request and sufficient identification, we will inform you of the existence, use, and disclosure of your personal information and provide you with access to that information within 30 days (PIPEDA Principle 4.9).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Right to challenge accuracy
    reqs.push({
      id: 'PIPEDA-P4.9.5',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to challenge accuracy',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.9.5',
      obligationType: 'right',
      requirementText: 'An individual shall be able to challenge the accuracy and completeness of the information and have it amended as appropriate.',
      disclaimerLanguage: 'You have the right to challenge the accuracy and completeness of your personal information and to have it amended as appropriate. If we disagree with your challenge, we will record the substance of your challenge and, where appropriate, transmit the existence of the unresolved challenge to third parties with access to the information (PIPEDA Principle 4.9.5).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Principle 4.10: Challenging Compliance ---
    reqs.push({
      id: 'PIPEDA-P4.10',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.ENFORCEMENT,
      subtopic: 'Challenging compliance',
      statutoryReference: 'PIPEDA Schedule 1, Principle 4.10',
      obligationType: 'disclosure',
      requirementText: 'An individual shall be able to address a challenge concerning compliance with the above principles to the designated individual or individuals accountable for the organization\'s compliance.',
      disclaimerLanguage: `You may challenge our compliance with PIPEDA by contacting our ${input.orgProfile.dpoContact.title} at ${input.orgProfile.dpoContact.email}. If you are not satisfied with our response, you have the right to file a complaint with the Office of the Privacy Commissioner of Canada (OPC) at www.priv.gc.ca.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Cross-border transfers (OPC guidance) ---
    if (dp.crossBorderTransfers.transfers && dp.crossBorderTransfers.destinations) {
      const countries = dp.crossBorderTransfers.destinations.map((d) => d.country).join(', ');
      reqs.push({
        id: 'PIPEDA-CROSS-BORDER',
        jurisdiction: Jurisdiction.PIPEDA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Cross-border transfers',
        statutoryReference: 'PIPEDA Principle 4.1.3; OPC Guidelines for Processing Personal Data Across Borders',
        obligationType: 'disclosure',
        requirementText: 'Organizations transferring personal information to another jurisdiction for processing must ensure that comparable protection is provided. Individuals must be notified that their information may be transferred and may be accessible to law enforcement and national security authorities of that jurisdiction.',
        disclaimerLanguage: `Your personal information may be transferred to, stored, and processed in jurisdictions outside of Canada, including ${countries}. When we transfer personal information outside of Canada, we ensure that the information is protected by contractual obligations requiring the recipient to provide a comparable level of protection. Please be aware that personal information transferred outside of Canada may be accessible to law enforcement and national security authorities in those jurisdictions under their laws.`,
        conditionalOn: ['crossBorderTransfers.transfers'],
        priority: 'required',
      });
    }

    // --- PIPEDA s.10.1 Breach notification ---
    reqs.push({
      id: 'PIPEDA-S10.1',
      jurisdiction: Jurisdiction.PIPEDA,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Breach notification',
      statutoryReference: 'PIPEDA s. 10.1',
      obligationType: 'disclosure',
      requirementText: 'Organizations must report breaches of security safeguards involving personal information that pose a real risk of significant harm to the OPC and affected individuals.',
      disclaimerLanguage: 'In the event of a breach of security safeguards involving your personal information that poses a real risk of significant harm, we will notify the Office of the Privacy Commissioner of Canada and you as soon as feasible, in accordance with PIPEDA s. 10.1. We will also notify any other organization or government institution that may be able to reduce the risk of harm.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Automated decision-making (OPC guidance) ---
    if (dp.usesAutomatedDecisionMaking) {
      reqs.push({
        id: 'PIPEDA-ADM',
        jurisdiction: Jurisdiction.PIPEDA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Automated decision-making',
        statutoryReference: 'PIPEDA Principles 4.2, 4.3, 4.8 (OPC Guidelines on Automated Decision-Making)',
        obligationType: 'disclosure',
        requirementText: 'Organizations using automated decision-making systems should be transparent about their use and provide meaningful explanations of how decisions are made.',
        disclaimerLanguage: 'We use automated decision-making systems in the processing of your personal information. In accordance with PIPEDA principles of openness and transparency, we disclose the use of these systems and will provide meaningful information about the logic involved upon request.',
        conditionalOn: ['usesAutomatedDecisionMaking'],
        priority: 'required',
      });
    }

    // --- Cookies and tracking (OPC guidance) ---
    if (dp.usesCookies) {
      reqs.push({
        id: 'PIPEDA-COOKIES',
        jurisdiction: Jurisdiction.PIPEDA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Cookies and tracking technologies',
        statutoryReference: 'PIPEDA Principles 4.2, 4.3 (OPC Position on Online Tracking)',
        obligationType: 'disclosure',
        requirementText: 'Organizations must inform individuals of the use of cookies and tracking technologies and obtain meaningful consent.',
        disclaimerLanguage: 'We use cookies and similar tracking technologies to collect information about your interactions with our services. In accordance with PIPEDA consent requirements, we obtain your meaningful consent before deploying non-essential cookies and provide you with information about the types of cookies used and their purposes.',
        conditionalOn: ['usesCookies'],
        priority: 'required',
      });
    }

    return reqs;
  },
};
