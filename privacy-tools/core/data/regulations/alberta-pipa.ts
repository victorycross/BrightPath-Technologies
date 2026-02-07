import { Jurisdiction, DataCategory, TopicCategory } from '../enums.js';
import type { RegulationModule, MappedRequirement, ValidatedInput } from '../types.js';

const SENSITIVE_CATEGORIES: DataCategory[] = [
  DataCategory.HEALTH,
  DataCategory.BIOMETRIC,
  DataCategory.FINANCIAL,
  DataCategory.SENSITIVE_PERSONAL,
  DataCategory.CHILDRENS,
];

export const albertaPipaModule: RegulationModule = {
  id: Jurisdiction.ALBERTA_PIPA,
  fullName: 'Personal Information Protection Act (Alberta)',
  shortName: 'Alberta PIPA',
  effectiveDate: '2004-01-01',
  sourceUrl: 'https://www.qp.alberta.ca/documents/Acts/P06P5.pdf',

  mapRequirements(input: ValidatedInput): MappedRequirement[] {
    const reqs: MappedRequirement[] = [];
    const dp = input.dataPractices;

    // --- s.4-5: Accountability ---
    reqs.push({
      id: 'AB-PIPA-S4',
      jurisdiction: Jurisdiction.ALBERTA_PIPA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Accountability',
      statutoryReference: 'Alberta PIPA, s. 4-5',
      obligationType: 'disclosure',
      requirementText: 'An organization is responsible for personal information that is in its custody or under its control. The organization must designate one or more individuals to be responsible for ensuring compliance.',
      disclaimerLanguage: `${input.orgProfile.legalName} is responsible for personal information in its custody or under its control. Our ${input.orgProfile.dpoContact.title}, ${input.orgProfile.dpoContact.name ?? ''}, is accountable for our compliance with Alberta PIPA and can be reached at ${input.orgProfile.dpoContact.email}.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- s.7-8: Consent ---
    reqs.push({
      id: 'AB-PIPA-S7',
      jurisdiction: Jurisdiction.ALBERTA_PIPA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Consent',
      statutoryReference: 'Alberta PIPA, s. 7-8',
      obligationType: 'disclosure',
      requirementText: 'An organization must not collect, use, or disclose personal information without the consent of the individual unless authorized by this Act.',
      disclaimerLanguage: 'We obtain your consent before collecting, using, or disclosing your personal information, except where authorized by Alberta PIPA without consent (s. 7-8). Consent may be express, deemed, or opt-out depending on the nature and sensitivity of the information.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Express consent for sensitive data (s.8(1))
    const hasSensitive = dp.dataCategories.some((cat) => SENSITIVE_CATEGORIES.includes(cat));
    if (hasSensitive) {
      reqs.push({
        id: 'AB-PIPA-S8-SENSITIVE',
        jurisdiction: Jurisdiction.ALBERTA_PIPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Express consent for sensitive information',
        statutoryReference: 'Alberta PIPA, s. 8(1)',
        obligationType: 'disclosure',
        requirementText: 'Express consent is required for the collection, use, or disclosure of sensitive personal information.',
        disclaimerLanguage: 'Where we collect sensitive personal information — including health, biometric, or financial information — we obtain your express consent as required by Alberta PIPA s. 8(1).',
        conditionalOn: ['dataCategories.sensitive'],
        priority: 'required',
      });
    }

    // Children's consent (s.7(2))
    if (dp.collectsChildrensData) {
      reqs.push({
        id: 'AB-PIPA-S7-CHILDREN',
        jurisdiction: Jurisdiction.ALBERTA_PIPA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Consent for children',
        statutoryReference: 'Alberta PIPA, s. 7(2)',
        obligationType: 'disclosure',
        requirementText: 'Where an individual is a minor, consent may be given by a parent or guardian.',
        disclaimerLanguage: `Where we collect personal information from individuals under the age of ${dp.minimumAgeThreshold ?? 13}, we obtain verifiable consent from a parent or guardian in accordance with Alberta PIPA s. 7(2).`,
        conditionalOn: ['collectsChildrensData'],
        priority: 'required',
      });
    }

    // --- s.11: Limiting Collection ---
    reqs.push({
      id: 'AB-PIPA-S11',
      jurisdiction: Jurisdiction.ALBERTA_PIPA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting collection',
      statutoryReference: 'Alberta PIPA, s. 11',
      obligationType: 'disclosure',
      requirementText: 'An organization may collect personal information only for purposes that are reasonable and only to the extent that is reasonable for meeting those purposes.',
      disclaimerLanguage: 'We limit the collection of personal information to that which is reasonable for the purposes we have identified, as required by Alberta PIPA s. 11.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- s.16-17: Identifying purposes / Use ---
    reqs.push({
      id: 'AB-PIPA-S16',
      jurisdiction: Jurisdiction.ALBERTA_PIPA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Identifying purposes',
      statutoryReference: 'Alberta PIPA, s. 16',
      obligationType: 'disclosure',
      requirementText: 'Before or at the time of collecting personal information, the organization must identify the purposes for the collection.',
      disclaimerLanguage: 'We identify the purposes for which we collect your personal information at or before the time of collection, as required by Alberta PIPA s. 16.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Purpose-specific disclosures
    for (const entry of dp.processingPurposes) {
      reqs.push({
        id: `AB-PIPA-S16-${entry.purpose}`,
        jurisdiction: Jurisdiction.ALBERTA_PIPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Purpose specification',
        statutoryReference: 'Alberta PIPA, s. 16-17',
        obligationType: 'disclosure',
        requirementText: `Purpose identified: ${entry.purpose}. ${entry.description ?? ''}`,
        disclaimerLanguage: entry.description ?? `To support ${entry.purpose.replace(/_/g, ' ')}.`,
        conditionalOn: [`processingPurposes.${entry.purpose}`],
        priority: 'required',
      });
    }

    // --- s.35: Retention ---
    reqs.push({
      id: 'AB-PIPA-S35',
      jurisdiction: Jurisdiction.ALBERTA_PIPA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting use, disclosure, and retention',
      statutoryReference: 'Alberta PIPA, s. 35',
      obligationType: 'disclosure',
      requirementText: 'An organization must destroy, erase, or make anonymous personal information that is no longer required for the identified purpose or a legal or business purpose.',
      disclaimerLanguage: 'We retain personal information only for as long as necessary for the purposes for which it was collected, or as required for legal or business purposes. When personal information is no longer required, we destroy, erase, or anonymize it (Alberta PIPA s. 35).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Retention schedule disclosures
    for (const entry of dp.retentionSchedule) {
      reqs.push({
        id: `AB-PIPA-S35-RET-${entry.dataCategory}`,
        jurisdiction: Jurisdiction.ALBERTA_PIPA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Retention period',
        statutoryReference: 'Alberta PIPA, s. 35',
        obligationType: 'disclosure',
        requirementText: `Retention period for ${entry.dataCategory}: ${entry.period}`,
        disclaimerLanguage: `${entry.dataCategory.replace(/_/g, ' ')}: ${entry.period}${entry.justification ? ` (${entry.justification})` : ''}`,
        conditionalOn: [`retentionSchedule.${entry.dataCategory}`],
        priority: 'required',
      });
    }

    // --- s.34: Safeguards ---
    reqs.push({
      id: 'AB-PIPA-S34',
      jurisdiction: Jurisdiction.ALBERTA_PIPA,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Safeguards',
      statutoryReference: 'Alberta PIPA, s. 34',
      obligationType: 'disclosure',
      requirementText: 'An organization must protect personal information by making reasonable security arrangements against such risks as unauthorized access, collection, use, disclosure, copying, modification, disposal, or destruction.',
      disclaimerLanguage: 'We protect your personal information with reasonable security arrangements, including physical, organizational, and technological safeguards appropriate to the sensitivity of the information (Alberta PIPA s. 34).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- s.34.1: Breach notification ---
    reqs.push({
      id: 'AB-PIPA-S34.1',
      jurisdiction: Jurisdiction.ALBERTA_PIPA,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Breach notification',
      statutoryReference: 'Alberta PIPA, s. 34.1',
      obligationType: 'disclosure',
      requirementText: 'An organization having personal information under its control must, without unreasonable delay, provide notice to the Commissioner of a loss of or unauthorized access to or disclosure of the personal information where a reasonable person would consider that there exists a real risk of significant harm to an individual.',
      disclaimerLanguage: 'In the event of a breach of security safeguards involving your personal information that poses a real risk of significant harm, we will notify the Office of the Information and Privacy Commissioner of Alberta and you without unreasonable delay, in accordance with Alberta PIPA s. 34.1.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- s.24-28: Access ---
    reqs.push({
      id: 'AB-PIPA-S24',
      jurisdiction: Jurisdiction.ALBERTA_PIPA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Individual access',
      statutoryReference: 'Alberta PIPA, s. 24-28',
      obligationType: 'right',
      requirementText: 'An individual has a right to request access to their personal information in the custody or under the control of an organization.',
      disclaimerLanguage: 'You have the right to request access to your personal information held by us. Upon receipt of a written request and sufficient identification, we will respond within 45 days, as required by Alberta PIPA s. 24-28.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- s.36: Correction ---
    reqs.push({
      id: 'AB-PIPA-S36',
      jurisdiction: Jurisdiction.ALBERTA_PIPA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to challenge accuracy',
      statutoryReference: 'Alberta PIPA, s. 36',
      obligationType: 'right',
      requirementText: 'An individual may request correction of an error or omission in their personal information.',
      disclaimerLanguage: 'You have the right to request correction of any errors or omissions in your personal information. If we disagree with the correction, we will annotate the information with the substance of the unresolved correction request (Alberta PIPA s. 36).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Third-party disclosure (s.20-21) ---
    if (dp.thirdPartySharing.shares || dp.crossBorderTransfers.transfers) {
      reqs.push({
        id: 'AB-PIPA-S20',
        jurisdiction: Jurisdiction.ALBERTA_PIPA,
        topic: TopicCategory.THIRD_PARTY,
        subtopic: 'Accountability for transfers',
        statutoryReference: 'Alberta PIPA, s. 20-21',
        obligationType: 'disclosure',
        requirementText: 'An organization may disclose personal information only for purposes that are reasonable. Disclosure to service providers requires contractual protection.',
        disclaimerLanguage: `When we disclose your personal information to third parties, ${input.orgProfile.legalName} ensures that contractual arrangements provide comparable protection (Alberta PIPA s. 20-21).`,
        conditionalOn: ['thirdPartySharing.shares'],
        priority: 'required',
      });
    }

    // --- s.13.1: Cross-border transfers ---
    if (dp.crossBorderTransfers.transfers && dp.crossBorderTransfers.destinations) {
      const countries = dp.crossBorderTransfers.destinations.map((d) => d.country).join(', ');
      reqs.push({
        id: 'AB-PIPA-S13.1',
        jurisdiction: Jurisdiction.ALBERTA_PIPA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Cross-border transfers',
        statutoryReference: 'Alberta PIPA, s. 13.1',
        obligationType: 'disclosure',
        requirementText: 'An organization must notify individuals that their personal information may be stored or accessed outside of Canada, and that it may be subject to the laws of that jurisdiction.',
        disclaimerLanguage: `Your personal information may be transferred to, stored, and processed in jurisdictions outside of Canada, including ${countries}. We notify you that personal information stored or accessed outside Canada may be subject to the laws of that jurisdiction and may be accessible to law enforcement authorities (Alberta PIPA s. 13.1).`,
        conditionalOn: ['crossBorderTransfers.transfers'],
        priority: 'required',
      });
    }

    // --- s.46: Complaints ---
    reqs.push({
      id: 'AB-PIPA-S46',
      jurisdiction: Jurisdiction.ALBERTA_PIPA,
      topic: TopicCategory.ENFORCEMENT,
      subtopic: 'Challenging compliance',
      statutoryReference: 'Alberta PIPA, s. 46',
      obligationType: 'disclosure',
      requirementText: 'An individual may ask the Commissioner to review any matter specified in the Act, including a complaint about the collection, use, or disclosure of personal information.',
      disclaimerLanguage: `You may challenge our compliance with Alberta PIPA by contacting our ${input.orgProfile.dpoContact.title} at ${input.orgProfile.dpoContact.email}. If you are not satisfied with our response, you have the right to file a complaint with the Office of the Information and Privacy Commissioner of Alberta (OIPC) at www.oipc.ab.ca.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Automated decision-making ---
    if (dp.usesAutomatedDecisionMaking) {
      reqs.push({
        id: 'AB-PIPA-ADM',
        jurisdiction: Jurisdiction.ALBERTA_PIPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Automated decision-making',
        statutoryReference: 'Alberta PIPA, s. 7, 16 (OIPC Guidance)',
        obligationType: 'disclosure',
        requirementText: 'Organizations using automated decision-making systems should be transparent about their use, consistent with consent and purpose limitation requirements.',
        disclaimerLanguage: 'We use automated decision-making systems in the processing of your personal information. In accordance with Alberta PIPA transparency and consent requirements, we disclose the use of these systems and will provide meaningful information about the logic involved upon request.',
        conditionalOn: ['usesAutomatedDecisionMaking'],
        priority: 'required',
      });
    }

    // --- Cookies and tracking ---
    if (dp.usesCookies) {
      reqs.push({
        id: 'AB-PIPA-COOKIES',
        jurisdiction: Jurisdiction.ALBERTA_PIPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Cookies and tracking technologies',
        statutoryReference: 'Alberta PIPA, s. 7-8 (OIPC Guidance on Online Tracking)',
        obligationType: 'disclosure',
        requirementText: 'Organizations must inform individuals of the use of cookies and tracking technologies and obtain consent where required.',
        disclaimerLanguage: 'We use cookies and similar tracking technologies to collect information about your interactions with our services. In accordance with Alberta PIPA consent requirements, we obtain your consent before deploying non-essential cookies.',
        conditionalOn: ['usesCookies'],
        priority: 'required',
      });
    }

    return reqs;
  },
};
