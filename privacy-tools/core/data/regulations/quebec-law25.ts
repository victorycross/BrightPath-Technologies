import { Jurisdiction, DataCategory, TopicCategory } from '../enums.js';
import type { RegulationModule, MappedRequirement, ValidatedInput } from '../types.js';

const SENSITIVE_CATEGORIES: DataCategory[] = [
  DataCategory.HEALTH,
  DataCategory.BIOMETRIC,
  DataCategory.FINANCIAL,
  DataCategory.SENSITIVE_PERSONAL,
  DataCategory.CHILDRENS,
];

export const quebecLaw25Module: RegulationModule = {
  id: Jurisdiction.QUEBEC_LAW25,
  fullName: 'An Act to modernize legislative provisions as regards the protection of personal information (Quebec Law 25)',
  shortName: 'Quebec Law 25',
  effectiveDate: '2023-09-22',
  sourceUrl: 'https://www.legisquebec.gouv.qc.ca/en/document/cs/P-39.1',

  mapRequirements(input: ValidatedInput): MappedRequirement[] {
    const reqs: MappedRequirement[] = [];
    const dp = input.dataPractices;

    // --- s.3.1: Person responsible (DPO equivalent) ---
    reqs.push({
      id: 'QC-LAW25-S3.1',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Accountability',
      statutoryReference: 'Quebec Law 25, s. 3.1 (amending Quebec Privacy Act)',
      obligationType: 'disclosure',
      requirementText: 'The person carrying on an enterprise must designate a person responsible for the protection of personal information. By default, this is the person having the highest authority within the enterprise.',
      disclaimerLanguage: `${input.orgProfile.legalName} has designated a person responsible for the protection of personal information as required by Quebec Law 25, s. 3.1. Our ${input.orgProfile.dpoContact.title}, ${input.orgProfile.dpoContact.name ?? ''}, can be reached at ${input.orgProfile.dpoContact.email}.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Consent ---
    reqs.push({
      id: 'QC-LAW25-CONSENT',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Consent',
      statutoryReference: 'Quebec Law 25, s. 8.1-8.3',
      obligationType: 'disclosure',
      requirementText: 'Consent must be manifest, free, and enlightened. It must be given for specific purposes and requested in clear and simple language, separately from any other information.',
      disclaimerLanguage: 'We obtain your manifest, free, and enlightened consent for the collection, use, and disclosure of your personal information. Consent is requested for specific purposes in clear and simple language, separately from any other information (Quebec Law 25, s. 8.1-8.3).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Express consent for sensitive data
    const hasSensitive = dp.dataCategories.some((cat) => SENSITIVE_CATEGORIES.includes(cat));
    if (hasSensitive) {
      reqs.push({
        id: 'QC-LAW25-SENSITIVE',
        jurisdiction: Jurisdiction.QUEBEC_LAW25,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Express consent for sensitive information',
        statutoryReference: 'Quebec Law 25, s. 12-13',
        obligationType: 'disclosure',
        requirementText: 'Express consent is required for the collection, use, or disclosure of sensitive personal information, which by its nature — medical, biometric, or otherwise intimate — calls for a high degree of reasonable expectation of privacy.',
        disclaimerLanguage: 'For sensitive personal information — including health, biometric, or financial data — we obtain your express consent as required by Quebec Law 25 (s. 12-13). Sensitive information is that which, by its nature, calls for a high degree of reasonable expectation of privacy.',
        conditionalOn: ['dataCategories.sensitive'],
        priority: 'required',
      });
    }

    // Children's consent
    if (dp.collectsChildrensData) {
      reqs.push({
        id: 'QC-LAW25-CHILDREN',
        jurisdiction: Jurisdiction.QUEBEC_LAW25,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Consent for children',
        statutoryReference: 'Quebec Law 25, s. 4.1 (Civil Code of Quebec)',
        obligationType: 'disclosure',
        requirementText: 'For minors under 14, consent must be given by the person having parental authority or the tutor.',
        disclaimerLanguage: `For individuals under the age of 14, we obtain consent from a parent or tutor as required by Quebec law. For minors aged 14 and over, the minor may consent independently (Quebec Law 25, s. 4.1).`,
        conditionalOn: ['collectsChildrensData'],
        priority: 'required',
      });
    }

    // --- Purpose identification ---
    reqs.push({
      id: 'QC-LAW25-PURPOSE',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Identifying purposes',
      statutoryReference: 'Quebec Law 25, s. 4-5',
      obligationType: 'disclosure',
      requirementText: 'A person carrying on an enterprise must determine the purposes for which personal information is collected before collection.',
      disclaimerLanguage: 'We determine and communicate the purposes for which personal information is collected before or at the time of collection, as required by Quebec Law 25.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Purpose-specific disclosures
    for (const entry of dp.processingPurposes) {
      reqs.push({
        id: `QC-LAW25-PURPOSE-${entry.purpose}`,
        jurisdiction: Jurisdiction.QUEBEC_LAW25,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Purpose specification',
        statutoryReference: 'Quebec Law 25, s. 4-5',
        obligationType: 'disclosure',
        requirementText: `Purpose identified: ${entry.purpose}. ${entry.description ?? ''}`,
        disclaimerLanguage: entry.description ?? `To support ${entry.purpose.replace(/_/g, ' ')}.`,
        conditionalOn: [`processingPurposes.${entry.purpose}`],
        priority: 'required',
      });
    }

    // --- Limiting collection ---
    reqs.push({
      id: 'QC-LAW25-COLLECTION',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting collection',
      statutoryReference: 'Quebec Law 25, s. 4',
      obligationType: 'disclosure',
      requirementText: 'Only personal information necessary for the identified purposes may be collected.',
      disclaimerLanguage: 'We collect only the personal information necessary for the purposes we have identified, in accordance with Quebec Law 25 (s. 4).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Retention ---
    reqs.push({
      id: 'QC-LAW25-RETENTION',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting use, disclosure, and retention',
      statutoryReference: 'Quebec Law 25, s. 12',
      obligationType: 'disclosure',
      requirementText: 'Personal information must be destroyed or anonymized once the purpose for which it was collected has been achieved, unless retention is required by law.',
      disclaimerLanguage: 'We destroy or anonymize personal information once the purposes for which it was collected have been achieved, unless retention is required by law. Our de-identification and anonymization practices comply with Quebec Law 25 (s. 12, 23).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Retention schedule disclosures
    for (const entry of dp.retentionSchedule) {
      reqs.push({
        id: `QC-LAW25-RET-${entry.dataCategory}`,
        jurisdiction: Jurisdiction.QUEBEC_LAW25,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Retention period',
        statutoryReference: 'Quebec Law 25, s. 12',
        obligationType: 'disclosure',
        requirementText: `Retention period for ${entry.dataCategory}: ${entry.period}`,
        disclaimerLanguage: `${entry.dataCategory.replace(/_/g, ' ')}: ${entry.period}${entry.justification ? ` (${entry.justification})` : ''}`,
        conditionalOn: [`retentionSchedule.${entry.dataCategory}`],
        priority: 'required',
      });
    }

    // --- Safeguards ---
    reqs.push({
      id: 'QC-LAW25-SAFEGUARDS',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Safeguards',
      statutoryReference: 'Quebec Law 25, s. 10',
      obligationType: 'disclosure',
      requirementText: 'A person carrying on an enterprise must take reasonable security measures to ensure the protection of personal information.',
      disclaimerLanguage: 'We implement reasonable security measures to protect your personal information, including physical, organizational, and technological safeguards (Quebec Law 25, s. 10).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Breach notification (s.3.5) ---
    reqs.push({
      id: 'QC-LAW25-BREACH',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Breach notification',
      statutoryReference: 'Quebec Law 25, s. 3.5',
      obligationType: 'disclosure',
      requirementText: 'In the event of a confidentiality incident involving personal information that presents a risk of serious injury, the person responsible must notify the Commission and affected individuals with diligence.',
      disclaimerLanguage: 'In the event of a confidentiality incident involving your personal information that presents a risk of serious injury, we will notify the Commission d\'accès à l\'information du Québec (CAI) and you with diligence, as required by Quebec Law 25 (s. 3.5).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Data subject rights: Access ---
    reqs.push({
      id: 'QC-LAW25-ACCESS',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Individual access',
      statutoryReference: 'Quebec Law 25, s. 27-28',
      obligationType: 'right',
      requirementText: 'Any person who makes a request in writing may have access to their personal information and be informed of its use and disclosure.',
      disclaimerLanguage: 'You have the right to access your personal information held by us and to be informed of its use and communication to third parties. We will respond within 30 days of receiving your request (Quebec Law 25, s. 27-28).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Right to rectification ---
    reqs.push({
      id: 'QC-LAW25-RECTIFICATION',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to challenge accuracy',
      statutoryReference: 'Quebec Law 25, s. 28',
      obligationType: 'right',
      requirementText: 'An individual has the right to request the rectification of personal information that is inaccurate, incomplete, or equivocal.',
      disclaimerLanguage: 'You have the right to request rectification of personal information that is inaccurate, incomplete, or equivocal. Where appropriate, you may also request deletion of information collected in contravention of the law (Quebec Law 25, s. 28).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Right to data portability (s.27) ---
    reqs.push({
      id: 'QC-LAW25-PORTABILITY',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to data portability',
      statutoryReference: 'Quebec Law 25, s. 27 (effective Sept 2024)',
      obligationType: 'right',
      requirementText: 'A person may request that personal information collected be communicated in a structured, commonly used technological format or that it be communicated to another person.',
      disclaimerLanguage: 'You have the right to receive your personal information in a structured, commonly used technological format, or to have it communicated to another person or organization you designate, subject to applicable conditions (Quebec Law 25, s. 27).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Right regarding automated decisions (s.12.1) ---
    if (dp.usesAutomatedDecisionMaking) {
      reqs.push({
        id: 'QC-LAW25-ADM',
        jurisdiction: Jurisdiction.QUEBEC_LAW25,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Automated decision-making',
        statutoryReference: 'Quebec Law 25, s. 12.1',
        obligationType: 'disclosure',
        requirementText: 'Where a decision based exclusively on automated processing is made about an individual, the individual must be informed. The individual has the right to submit observations to a person in the enterprise who is in a position to review the decision.',
        disclaimerLanguage: 'Where we make decisions based exclusively on automated processing of your personal information, we will inform you at the time of or before the decision. You have the right to submit observations to a designated person who can review the decision (Quebec Law 25, s. 12.1).',
        conditionalOn: ['usesAutomatedDecisionMaking'],
        priority: 'required',
      });
    }

    // --- De-identification and anonymization (s.23) ---
    reqs.push({
      id: 'QC-LAW25-ANONYMIZATION',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Accuracy',
      statutoryReference: 'Quebec Law 25, s. 23',
      obligationType: 'disclosure',
      requirementText: 'Information is anonymized when it irreversibly no longer allows the person to be identified. De-identified information must use generally accepted best practices and criteria and standards that may be determined by regulation.',
      disclaimerLanguage: 'When we anonymize or de-identify personal information, we apply generally accepted best practices to ensure the information can no longer allow an individual to be identified, directly or indirectly, in accordance with Quebec Law 25 (s. 23).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Third-party disclosure ---
    if (dp.thirdPartySharing.shares || dp.crossBorderTransfers.transfers) {
      reqs.push({
        id: 'QC-LAW25-THIRD-PARTY',
        jurisdiction: Jurisdiction.QUEBEC_LAW25,
        topic: TopicCategory.THIRD_PARTY,
        subtopic: 'Accountability for transfers',
        statutoryReference: 'Quebec Law 25, s. 18.2-18.3',
        obligationType: 'disclosure',
        requirementText: 'Before communicating personal information to a third party, the enterprise must enter into a written agreement ensuring the recipient provides protection equivalent to that afforded under Quebec law.',
        disclaimerLanguage: `When we communicate your personal information to third parties, ${input.orgProfile.legalName} enters into written agreements ensuring the recipient provides protection equivalent to that under Quebec law (Quebec Law 25, s. 18.2-18.3).`,
        conditionalOn: ['thirdPartySharing.shares'],
        priority: 'required',
      });
    }

    // --- Cross-border: equivalent protection (s.17) ---
    if (dp.crossBorderTransfers.transfers && dp.crossBorderTransfers.destinations) {
      const countries = dp.crossBorderTransfers.destinations.map((d) => d.country).join(', ');
      reqs.push({
        id: 'QC-LAW25-CROSS-BORDER',
        jurisdiction: Jurisdiction.QUEBEC_LAW25,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Cross-border transfers',
        statutoryReference: 'Quebec Law 25, s. 17',
        obligationType: 'disclosure',
        requirementText: 'Before communicating personal information outside Quebec, the enterprise must conduct a privacy impact assessment and ensure the information will be afforded equivalent protection.',
        disclaimerLanguage: `Your personal information may be communicated outside Quebec to jurisdictions including ${countries}. Before any such transfer, we conduct a privacy impact assessment and ensure the information is afforded equivalent protection. We will inform you if the information may be communicated outside Quebec (Quebec Law 25, s. 17).`,
        conditionalOn: ['crossBorderTransfers.transfers'],
        priority: 'required',
      });
    }

    // --- Confidentiality impact assessments (s.3.3) ---
    if (dp.conductsDPIA) {
      reqs.push({
        id: 'QC-LAW25-PIA',
        jurisdiction: Jurisdiction.QUEBEC_LAW25,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Data protection impact assessment',
        statutoryReference: 'Quebec Law 25, s. 3.3',
        obligationType: 'process',
        requirementText: 'A confidentiality impact assessment must be carried out for any project involving the collection, use, communication, storage, or destruction of personal information.',
        disclaimerLanguage: 'We conduct confidentiality impact assessments for projects involving the collection, use, communication, storage, or destruction of personal information, as required by Quebec Law 25 (s. 3.3). These assessments evaluate risks and ensure appropriate safeguards are in place.',
        conditionalOn: ['conductsDPIA'],
        priority: 'required',
      });
    }

    // --- Cookies and tracking ---
    if (dp.usesCookies) {
      reqs.push({
        id: 'QC-LAW25-COOKIES',
        jurisdiction: Jurisdiction.QUEBEC_LAW25,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Cookies and tracking technologies',
        statutoryReference: 'Quebec Law 25, s. 8.1-8.3',
        obligationType: 'disclosure',
        requirementText: 'Organizations must obtain manifest, free, and enlightened consent for the use of cookies and tracking technologies that collect personal information.',
        disclaimerLanguage: 'We use cookies and similar tracking technologies to collect information about your interactions with our services. In accordance with Quebec Law 25 consent requirements, we obtain your manifest, free, and enlightened consent before deploying non-essential cookies (s. 8.1-8.3).',
        conditionalOn: ['usesCookies'],
        priority: 'required',
      });
    }

    // --- Complaints ---
    reqs.push({
      id: 'QC-LAW25-COMPLAINTS',
      jurisdiction: Jurisdiction.QUEBEC_LAW25,
      topic: TopicCategory.ENFORCEMENT,
      subtopic: 'Challenging compliance',
      statutoryReference: 'Quebec Law 25, s. 81-82',
      obligationType: 'disclosure',
      requirementText: 'A person may file a complaint with the Commission d\'accès à l\'information du Québec regarding any matter related to the protection of personal information.',
      disclaimerLanguage: `You may challenge our compliance with Quebec Law 25 by contacting our ${input.orgProfile.dpoContact.title} at ${input.orgProfile.dpoContact.email}. If you are not satisfied with our response, you have the right to file a complaint with the Commission d'accès à l'information du Québec (CAI) at www.cai.gouv.qc.ca.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    return reqs;
  },
};
