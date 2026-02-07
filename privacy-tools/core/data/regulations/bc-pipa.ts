import { Jurisdiction, DataCategory, TopicCategory } from '../enums.js';
import type { RegulationModule, MappedRequirement, ValidatedInput } from '../types.js';

const SENSITIVE_CATEGORIES: DataCategory[] = [
  DataCategory.HEALTH,
  DataCategory.BIOMETRIC,
  DataCategory.FINANCIAL,
  DataCategory.SENSITIVE_PERSONAL,
  DataCategory.CHILDRENS,
];

export const bcPipaModule: RegulationModule = {
  id: Jurisdiction.BC_PIPA,
  fullName: 'Personal Information Protection Act (British Columbia)',
  shortName: 'BC PIPA',
  effectiveDate: '2004-01-01',
  sourceUrl: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03063_01',

  mapRequirements(input: ValidatedInput): MappedRequirement[] {
    const reqs: MappedRequirement[] = [];
    const dp = input.dataPractices;

    // --- s.4: Accountability ---
    reqs.push({
      id: 'BC-PIPA-S4',
      jurisdiction: Jurisdiction.BC_PIPA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Accountability',
      statutoryReference: 'BC PIPA, s. 4',
      obligationType: 'disclosure',
      requirementText: 'An organization is responsible for personal information under its control, including personal information that is not in its custody. The organization must designate one or more individuals to be responsible for ensuring compliance.',
      disclaimerLanguage: `${input.orgProfile.legalName} is responsible for personal information under its control. Our ${input.orgProfile.dpoContact.title}, ${input.orgProfile.dpoContact.name ?? ''}, is accountable for our compliance with BC PIPA and can be reached at ${input.orgProfile.dpoContact.email}.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- s.6-8: Consent ---
    reqs.push({
      id: 'BC-PIPA-S6',
      jurisdiction: Jurisdiction.BC_PIPA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Consent',
      statutoryReference: 'BC PIPA, s. 6-8',
      obligationType: 'disclosure',
      requirementText: 'An organization must not collect, use, or disclose personal information without the consent of the individual unless authorized by this Act.',
      disclaimerLanguage: 'We obtain your consent before collecting, using, or disclosing your personal information, except where authorized by BC PIPA without consent (s. 6-8). Consent may be express or implied depending on the nature and sensitivity of the information.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Express consent for sensitive data
    const hasSensitive = dp.dataCategories.some((cat) => SENSITIVE_CATEGORIES.includes(cat));
    if (hasSensitive) {
      reqs.push({
        id: 'BC-PIPA-S8-SENSITIVE',
        jurisdiction: Jurisdiction.BC_PIPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Express consent for sensitive information',
        statutoryReference: 'BC PIPA, s. 8',
        obligationType: 'disclosure',
        requirementText: 'Express consent is generally required for the collection, use, or disclosure of sensitive personal information.',
        disclaimerLanguage: 'Where we collect sensitive personal information — including health, biometric, or financial information — we obtain your express consent as required by BC PIPA s. 8.',
        conditionalOn: ['dataCategories.sensitive'],
        priority: 'required',
      });
    }

    // Children's consent
    if (dp.collectsChildrensData) {
      reqs.push({
        id: 'BC-PIPA-CHILDREN',
        jurisdiction: Jurisdiction.BC_PIPA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Consent for children',
        statutoryReference: 'BC PIPA, s. 6 (OIPC BC Guidance)',
        obligationType: 'disclosure',
        requirementText: 'Where an individual is a minor, consent may be given by a parent or guardian on behalf of the minor.',
        disclaimerLanguage: `Where we collect personal information from individuals under the age of ${dp.minimumAgeThreshold ?? 13}, we obtain verifiable consent from a parent or guardian in accordance with BC PIPA requirements.`,
        conditionalOn: ['collectsChildrensData'],
        priority: 'required',
      });
    }

    // --- s.11: Purpose limitation ---
    reqs.push({
      id: 'BC-PIPA-S11',
      jurisdiction: Jurisdiction.BC_PIPA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Identifying purposes',
      statutoryReference: 'BC PIPA, s. 11',
      obligationType: 'disclosure',
      requirementText: 'An organization may collect personal information only for purposes that a reasonable person would consider appropriate in the circumstances.',
      disclaimerLanguage: 'We identify the purposes for which we collect your personal information at or before the time of collection, and collect only for purposes a reasonable person would consider appropriate (BC PIPA s. 11).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Purpose-specific disclosures
    for (const entry of dp.processingPurposes) {
      reqs.push({
        id: `BC-PIPA-S11-${entry.purpose}`,
        jurisdiction: Jurisdiction.BC_PIPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Purpose specification',
        statutoryReference: 'BC PIPA, s. 11-14',
        obligationType: 'disclosure',
        requirementText: `Purpose identified: ${entry.purpose}. ${entry.description ?? ''}`,
        disclaimerLanguage: entry.description ?? `To support ${entry.purpose.replace(/_/g, ' ')}.`,
        conditionalOn: [`processingPurposes.${entry.purpose}`],
        priority: 'required',
      });
    }

    // --- s.11: Limiting collection ---
    reqs.push({
      id: 'BC-PIPA-S11-LIMIT',
      jurisdiction: Jurisdiction.BC_PIPA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting collection',
      statutoryReference: 'BC PIPA, s. 11',
      obligationType: 'disclosure',
      requirementText: 'An organization must collect personal information only to the extent reasonable for the identified purposes.',
      disclaimerLanguage: 'We limit the collection of personal information to that which is reasonable for the purposes we have identified (BC PIPA s. 11).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- s.14: Use limitation ---
    reqs.push({
      id: 'BC-PIPA-S14',
      jurisdiction: Jurisdiction.BC_PIPA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting use, disclosure, and retention',
      statutoryReference: 'BC PIPA, s. 14',
      obligationType: 'disclosure',
      requirementText: 'An organization may use personal information only for the purposes for which it was collected or for a use consistent with that purpose.',
      disclaimerLanguage: 'We use your personal information only for the purposes for which it was collected or for a use consistent with those purposes. We retain personal information only for as long as necessary (BC PIPA s. 14, 35).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Retention schedule disclosures
    for (const entry of dp.retentionSchedule) {
      reqs.push({
        id: `BC-PIPA-S35-RET-${entry.dataCategory}`,
        jurisdiction: Jurisdiction.BC_PIPA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Retention period',
        statutoryReference: 'BC PIPA, s. 35',
        obligationType: 'disclosure',
        requirementText: `Retention period for ${entry.dataCategory}: ${entry.period}`,
        disclaimerLanguage: `${entry.dataCategory.replace(/_/g, ' ')}: ${entry.period}${entry.justification ? ` (${entry.justification})` : ''}`,
        conditionalOn: [`retentionSchedule.${entry.dataCategory}`],
        priority: 'required',
      });
    }

    // --- s.34: Safeguards ---
    reqs.push({
      id: 'BC-PIPA-S34',
      jurisdiction: Jurisdiction.BC_PIPA,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Safeguards',
      statutoryReference: 'BC PIPA, s. 34',
      obligationType: 'disclosure',
      requirementText: 'An organization must protect personal information in its custody or under its control by making reasonable security arrangements to prevent unauthorized access, collection, use, disclosure, copying, modification or disposal.',
      disclaimerLanguage: 'We protect your personal information with reasonable security arrangements, including physical, organizational, and technological safeguards appropriate to the sensitivity of the information (BC PIPA s. 34).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Breach notification ---
    reqs.push({
      id: 'BC-PIPA-BREACH',
      jurisdiction: Jurisdiction.BC_PIPA,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Breach notification',
      statutoryReference: 'BC PIPA, s. 29.1-29.4',
      obligationType: 'disclosure',
      requirementText: 'An organization must report breaches of security safeguards involving personal information that pose a real risk of significant harm to the Commissioner and affected individuals.',
      disclaimerLanguage: 'In the event of a breach of security safeguards involving your personal information that poses a real risk of significant harm, we will notify the Office of the Information and Privacy Commissioner for British Columbia and you without unreasonable delay, in accordance with BC PIPA s. 29.1-29.4.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- s.23: Access ---
    reqs.push({
      id: 'BC-PIPA-S23',
      jurisdiction: Jurisdiction.BC_PIPA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Individual access',
      statutoryReference: 'BC PIPA, s. 23',
      obligationType: 'right',
      requirementText: 'An individual has a right to request access to their personal information in the custody or under the control of an organization.',
      disclaimerLanguage: 'You have the right to request access to your personal information held by us. Upon receipt of a written request and sufficient identification, we will respond within 30 business days, as required by BC PIPA s. 23.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- s.29: Correction ---
    reqs.push({
      id: 'BC-PIPA-S29',
      jurisdiction: Jurisdiction.BC_PIPA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to challenge accuracy',
      statutoryReference: 'BC PIPA, s. 29',
      obligationType: 'right',
      requirementText: 'An individual may request correction of an error or omission in their personal information.',
      disclaimerLanguage: 'You have the right to request correction of any errors or omissions in your personal information. If we disagree with the correction, we will annotate the information accordingly (BC PIPA s. 29).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- s.17-18: Third-party disclosure ---
    if (dp.thirdPartySharing.shares || dp.crossBorderTransfers.transfers) {
      reqs.push({
        id: 'BC-PIPA-S17',
        jurisdiction: Jurisdiction.BC_PIPA,
        topic: TopicCategory.THIRD_PARTY,
        subtopic: 'Accountability for transfers',
        statutoryReference: 'BC PIPA, s. 17-18',
        obligationType: 'disclosure',
        requirementText: 'An organization may disclose personal information only for purposes that are reasonable and with appropriate contractual arrangements.',
        disclaimerLanguage: `When we disclose your personal information to third parties, ${input.orgProfile.legalName} ensures that contractual arrangements provide comparable protection (BC PIPA s. 17-18).`,
        conditionalOn: ['thirdPartySharing.shares'],
        priority: 'required',
      });
    }

    // --- s.33: Storage outside Canada ---
    if (dp.crossBorderTransfers.transfers && dp.crossBorderTransfers.destinations) {
      const countries = dp.crossBorderTransfers.destinations.map((d) => d.country).join(', ');
      reqs.push({
        id: 'BC-PIPA-S33',
        jurisdiction: Jurisdiction.BC_PIPA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Cross-border transfers',
        statutoryReference: 'BC PIPA, s. 33',
        obligationType: 'disclosure',
        requirementText: 'An organization must ensure personal information stored outside Canada is afforded a comparable level of protection. Individuals must be notified.',
        disclaimerLanguage: `Your personal information may be transferred to, stored, and processed in jurisdictions outside of Canada, including ${countries}. We notify you that personal information stored or accessed outside Canada may be subject to the laws of that jurisdiction (BC PIPA s. 33).`,
        conditionalOn: ['crossBorderTransfers.transfers'],
        priority: 'required',
      });
    }

    // --- Complaints ---
    reqs.push({
      id: 'BC-PIPA-COMPLAINTS',
      jurisdiction: Jurisdiction.BC_PIPA,
      topic: TopicCategory.ENFORCEMENT,
      subtopic: 'Challenging compliance',
      statutoryReference: 'BC PIPA, s. 47',
      obligationType: 'disclosure',
      requirementText: 'An individual may ask the Commissioner to review any matter related to the organization\'s compliance with BC PIPA.',
      disclaimerLanguage: `You may challenge our compliance with BC PIPA by contacting our ${input.orgProfile.dpoContact.title} at ${input.orgProfile.dpoContact.email}. If you are not satisfied with our response, you have the right to file a complaint with the Office of the Information and Privacy Commissioner for British Columbia (OIPC BC) at www.oipc.bc.ca.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Automated decision-making ---
    if (dp.usesAutomatedDecisionMaking) {
      reqs.push({
        id: 'BC-PIPA-ADM',
        jurisdiction: Jurisdiction.BC_PIPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Automated decision-making',
        statutoryReference: 'BC PIPA, s. 6, 11 (OIPC Guidance)',
        obligationType: 'disclosure',
        requirementText: 'Organizations using automated decision-making systems should be transparent about their use, consistent with consent and purpose limitation requirements.',
        disclaimerLanguage: 'We use automated decision-making systems in the processing of your personal information. In accordance with BC PIPA transparency and consent requirements, we disclose the use of these systems and will provide meaningful information about the logic involved upon request.',
        conditionalOn: ['usesAutomatedDecisionMaking'],
        priority: 'required',
      });
    }

    // --- Cookies and tracking ---
    if (dp.usesCookies) {
      reqs.push({
        id: 'BC-PIPA-COOKIES',
        jurisdiction: Jurisdiction.BC_PIPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Cookies and tracking technologies',
        statutoryReference: 'BC PIPA, s. 6-8 (OIPC Guidance on Online Tracking)',
        obligationType: 'disclosure',
        requirementText: 'Organizations must inform individuals of the use of cookies and tracking technologies and obtain consent where required.',
        disclaimerLanguage: 'We use cookies and similar tracking technologies to collect information about your interactions with our services. In accordance with BC PIPA consent requirements, we obtain your consent before deploying non-essential cookies.',
        conditionalOn: ['usesCookies'],
        priority: 'required',
      });
    }

    return reqs;
  },
};
