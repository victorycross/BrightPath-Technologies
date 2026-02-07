import { Jurisdiction, DataCategory, LegalBasis, TopicCategory, TransferMechanism } from '../enums.js';
import type { RegulationModule, MappedRequirement, ValidatedInput } from '../types.js';

const SPECIAL_CATEGORIES: DataCategory[] = [
  DataCategory.HEALTH,
  DataCategory.BIOMETRIC,
  DataCategory.SENSITIVE_PERSONAL,
];

const LEGAL_BASIS_ARTICLE_MAP: Record<LegalBasis, string> = {
  [LegalBasis.CONSENT]: 'Art. 6(1)(a)',
  [LegalBasis.CONTRACT]: 'Art. 6(1)(b)',
  [LegalBasis.LEGAL_OBLIGATION]: 'Art. 6(1)(c)',
  [LegalBasis.VITAL_INTERESTS]: 'Art. 6(1)(d)',
  [LegalBasis.PUBLIC_INTEREST]: 'Art. 6(1)(e)',
  [LegalBasis.LEGITIMATE_INTEREST]: 'Art. 6(1)(f)',
};

const TRANSFER_MECHANISM_LABELS: Record<TransferMechanism, string> = {
  [TransferMechanism.ADEQUACY_DECISION]: 'an adequacy decision (Art. 45)',
  [TransferMechanism.STANDARD_CONTRACTUAL_CLAUSES]: 'Standard Contractual Clauses (Art. 46(2)(c))',
  [TransferMechanism.BINDING_CORPORATE_RULES]: 'Binding Corporate Rules (Art. 47)',
  [TransferMechanism.EXPLICIT_CONSENT]: 'the explicit consent of the data subject (Art. 49(1)(a))',
  [TransferMechanism.CONTRACTUAL_NECESSITY]: 'contractual necessity (Art. 49(1)(b)-(c))',
  [TransferMechanism.COMPARABLE_PROTECTION]: 'appropriate safeguards (Art. 46)',
};

export const gdprModule: RegulationModule = {
  id: Jurisdiction.GDPR,
  fullName: 'General Data Protection Regulation',
  shortName: 'GDPR',
  effectiveDate: '2018-05-25',
  sourceUrl: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',

  mapRequirements(input: ValidatedInput): MappedRequirement[] {
    const reqs: MappedRequirement[] = [];
    const dp = input.dataPractices;

    // --- Art. 5: Principles ---
    reqs.push({
      id: 'GDPR-ART5',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Accountability',
      statutoryReference: 'GDPR Art. 5',
      obligationType: 'disclosure',
      requirementText: 'Personal data shall be processed lawfully, fairly, and in a transparent manner in relation to the data subject. The controller shall be responsible for, and be able to demonstrate compliance with, these principles.',
      disclaimerLanguage: `${input.orgProfile.legalName} processes personal data in accordance with the principles set forth in Article 5 of the GDPR: lawfulness, fairness, and transparency; purpose limitation; data minimisation; accuracy; storage limitation; integrity and confidentiality; and accountability.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 6: Lawful basis for processing ---
    reqs.push({
      id: 'GDPR-ART6',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Consent',
      statutoryReference: 'GDPR Art. 6',
      obligationType: 'disclosure',
      requirementText: 'Processing shall be lawful only if and to the extent that at least one of the six legal bases under Article 6(1) applies.',
      disclaimerLanguage: 'We process your personal data on the basis of one or more lawful grounds set forth in GDPR Art. 6. The legal basis for each processing purpose is identified below.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Legal basis per processing purpose
    for (const entry of dp.processingPurposes) {
      const artRef = LEGAL_BASIS_ARTICLE_MAP[entry.legalBasis] ?? 'Art. 6(1)';
      reqs.push({
        id: `GDPR-ART6-${entry.purpose}`,
        jurisdiction: Jurisdiction.GDPR,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Purpose specification',
        statutoryReference: `GDPR ${artRef}`,
        obligationType: 'disclosure',
        requirementText: `Processing purpose: ${entry.purpose}. Legal basis: ${entry.legalBasis} (${artRef}). ${entry.description ?? ''}`,
        disclaimerLanguage: `${entry.description ?? `To support ${entry.purpose.replace(/_/g, ' ')}`} — legal basis: ${entry.legalBasis.replace(/_/g, ' ')} (GDPR ${artRef}).`,
        conditionalOn: [`processingPurposes.${entry.purpose}`],
        priority: 'required',
      });
    }

    // --- Art. 13-14: Information to be provided ---
    reqs.push({
      id: 'GDPR-ART13',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Identifying purposes',
      statutoryReference: 'GDPR Art. 13-14',
      obligationType: 'disclosure',
      requirementText: 'Where personal data are collected from the data subject, the controller shall provide specified information at the time when personal data are obtained.',
      disclaimerLanguage: 'This privacy policy provides you with the information required under GDPR Art. 13-14, including the identity and contact details of the controller, the purposes of processing, the legal basis, the recipients, and your rights as a data subject.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 5(1)(b): Purpose limitation ---
    reqs.push({
      id: 'GDPR-ART5B',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting collection',
      statutoryReference: 'GDPR Art. 5(1)(b)-(c)',
      obligationType: 'disclosure',
      requirementText: 'Personal data shall be collected for specified, explicit and legitimate purposes and not further processed in a manner incompatible with those purposes. Personal data shall be adequate, relevant, and limited to what is necessary.',
      disclaimerLanguage: 'We collect personal data only for specified, explicit, and legitimate purposes and do not process it in a manner incompatible with those purposes. We ensure that personal data collected is adequate, relevant, and limited to what is necessary (GDPR Art. 5(1)(b)-(c)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 5(1)(e): Storage limitation / Retention ---
    reqs.push({
      id: 'GDPR-ART5E',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting use, disclosure, and retention',
      statutoryReference: 'GDPR Art. 5(1)(e)',
      obligationType: 'disclosure',
      requirementText: 'Personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed.',
      disclaimerLanguage: 'We retain personal data only for as long as necessary for the purposes for which it was collected. When personal data is no longer required, we securely delete or anonymize it (GDPR Art. 5(1)(e)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Retention schedule disclosures
    for (const entry of dp.retentionSchedule) {
      reqs.push({
        id: `GDPR-RET-${entry.dataCategory}`,
        jurisdiction: Jurisdiction.GDPR,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Retention period',
        statutoryReference: 'GDPR Art. 5(1)(e), Art. 13(2)(a)',
        obligationType: 'disclosure',
        requirementText: `Retention period for ${entry.dataCategory}: ${entry.period}`,
        disclaimerLanguage: `${entry.dataCategory.replace(/_/g, ' ')}: ${entry.period}${entry.justification ? ` (${entry.justification})` : ''}`,
        conditionalOn: [`retentionSchedule.${entry.dataCategory}`],
        priority: 'required',
      });
    }

    // --- Art. 9: Special categories ---
    const hasSpecial = dp.dataCategories.some((cat) => SPECIAL_CATEGORIES.includes(cat));
    if (hasSpecial) {
      reqs.push({
        id: 'GDPR-ART9',
        jurisdiction: Jurisdiction.GDPR,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Express consent for sensitive information',
        statutoryReference: 'GDPR Art. 9',
        obligationType: 'disclosure',
        requirementText: 'Processing of special categories of personal data (revealing racial or ethnic origin, political opinions, religious beliefs, health data, biometric data, data concerning sex life or sexual orientation) is prohibited unless one of the conditions in Art. 9(2) applies.',
        disclaimerLanguage: 'We process special categories of personal data only where one of the conditions under GDPR Art. 9(2) is met, such as explicit consent, employment law obligations, or reasons of substantial public interest. Where we rely on explicit consent, you may withdraw that consent at any time.',
        conditionalOn: ['dataCategories.sensitive'],
        priority: 'required',
      });
    }

    // --- Art. 8: Children's consent ---
    if (dp.collectsChildrensData) {
      reqs.push({
        id: 'GDPR-ART8',
        jurisdiction: Jurisdiction.GDPR,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Consent for children',
        statutoryReference: 'GDPR Art. 8',
        obligationType: 'disclosure',
        requirementText: 'Where consent is the legal basis and information society services are offered directly to a child, consent is lawful only if the child is at least 16 years old. Where the child is below 16, consent must be given or authorized by the holder of parental responsibility.',
        disclaimerLanguage: `Where we offer information society services directly to children and rely on consent as the legal basis, we require that the child is at least ${dp.minimumAgeThreshold ?? 16} years of age. For children below this threshold, consent must be given or authorized by the holder of parental responsibility (GDPR Art. 8).`,
        conditionalOn: ['collectsChildrensData'],
        priority: 'required',
      });
    }

    // --- Art. 15: Right of access ---
    reqs.push({
      id: 'GDPR-ART15',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Individual access',
      statutoryReference: 'GDPR Art. 15',
      obligationType: 'right',
      requirementText: 'The data subject shall have the right to obtain from the controller confirmation as to whether or not personal data concerning him or her are being processed, and, where that is the case, access to the personal data.',
      disclaimerLanguage: 'You have the right to obtain confirmation as to whether we process personal data concerning you, and to access that data along with information about the purposes, categories, recipients, retention periods, and your rights. We will respond within one month (GDPR Art. 15).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 16: Right to rectification ---
    reqs.push({
      id: 'GDPR-ART16',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to challenge accuracy',
      statutoryReference: 'GDPR Art. 16',
      obligationType: 'right',
      requirementText: 'The data subject shall have the right to obtain from the controller without undue delay the rectification of inaccurate personal data concerning him or her.',
      disclaimerLanguage: 'You have the right to obtain the rectification of inaccurate personal data concerning you without undue delay, and to have incomplete personal data completed (GDPR Art. 16).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 17: Right to erasure ---
    reqs.push({
      id: 'GDPR-ART17',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to erasure',
      statutoryReference: 'GDPR Art. 17',
      obligationType: 'right',
      requirementText: 'The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay where one of the specified grounds applies.',
      disclaimerLanguage: 'You have the right to obtain the erasure of your personal data without undue delay where the data is no longer necessary, you withdraw consent, you object to the processing, or the data has been unlawfully processed, among other grounds (GDPR Art. 17).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 18: Right to restriction of processing ---
    reqs.push({
      id: 'GDPR-ART18',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to restrict processing',
      statutoryReference: 'GDPR Art. 18',
      obligationType: 'right',
      requirementText: 'The data subject shall have the right to obtain from the controller restriction of processing where one of the specified conditions applies.',
      disclaimerLanguage: 'You have the right to restrict the processing of your personal data where you contest the accuracy, the processing is unlawful, we no longer need the data, or you have objected to the processing pending verification (GDPR Art. 18).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 20: Right to data portability ---
    reqs.push({
      id: 'GDPR-ART20',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to data portability',
      statutoryReference: 'GDPR Art. 20',
      obligationType: 'right',
      requirementText: 'The data subject shall have the right to receive the personal data concerning him or her in a structured, commonly used and machine-readable format and have the right to transmit those data to another controller.',
      disclaimerLanguage: 'You have the right to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit it to another controller where technically feasible. This right applies where the processing is based on consent or contract and is carried out by automated means (GDPR Art. 20).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 21: Right to object ---
    reqs.push({
      id: 'GDPR-ART21',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to object',
      statutoryReference: 'GDPR Art. 21',
      obligationType: 'right',
      requirementText: 'The data subject shall have the right to object, on grounds relating to his or her particular situation, at any time to processing of personal data which is based on Art. 6(1)(e) or (f).',
      disclaimerLanguage: 'You have the right to object to the processing of your personal data on grounds relating to your particular situation, where the processing is based on public interest or legitimate interests. Where you object to processing for direct marketing purposes, we will cease processing for such purposes immediately (GDPR Art. 21).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 22: Automated decision-making ---
    if (dp.usesAutomatedDecisionMaking) {
      reqs.push({
        id: 'GDPR-ART22',
        jurisdiction: Jurisdiction.GDPR,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Automated decision-making',
        statutoryReference: 'GDPR Art. 22',
        obligationType: 'right',
        requirementText: 'The data subject shall have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her or similarly significantly affects him or her.',
        disclaimerLanguage: 'You have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects or similarly significantly affects you. Where we use automated decision-making, we implement suitable measures to safeguard your rights, including the right to obtain human intervention, express your point of view, and contest the decision (GDPR Art. 22).',
        conditionalOn: ['usesAutomatedDecisionMaking'],
        priority: 'required',
      });
    }

    // --- Art. 32: Security of processing ---
    reqs.push({
      id: 'GDPR-ART32',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Safeguards',
      statutoryReference: 'GDPR Art. 32',
      obligationType: 'disclosure',
      requirementText: 'The controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk.',
      disclaimerLanguage: 'We implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including pseudonymisation and encryption, the ability to ensure ongoing confidentiality, integrity, availability, and resilience of processing systems, and regular testing and evaluation of the effectiveness of these measures (GDPR Art. 32).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 33-34: Breach notification ---
    reqs.push({
      id: 'GDPR-ART33',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Breach notification',
      statutoryReference: 'GDPR Art. 33-34',
      obligationType: 'disclosure',
      requirementText: 'In the case of a personal data breach, the controller shall without undue delay and, where feasible, not later than 72 hours after having become aware of it, notify the personal data breach to the supervisory authority. Where the breach is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall communicate the breach to the data subject without undue delay.',
      disclaimerLanguage: 'In the event of a personal data breach, we will notify the relevant supervisory authority without undue delay and, where feasible, within 72 hours of becoming aware of the breach (GDPR Art. 33). Where the breach is likely to result in a high risk to your rights and freedoms, we will communicate the breach to you without undue delay (GDPR Art. 34).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 37-39: Data Protection Officer ---
    reqs.push({
      id: 'GDPR-ART37',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Data Protection Officer',
      statutoryReference: 'GDPR Art. 37-39',
      obligationType: 'disclosure',
      requirementText: 'The controller and the processor shall designate a data protection officer in any case where their core activities require regular and systematic monitoring of data subjects on a large scale, or consist of processing on a large scale of special categories of data.',
      disclaimerLanguage: `Our ${input.orgProfile.dpoContact.title}, ${input.orgProfile.dpoContact.name ?? ''}, can be contacted at ${input.orgProfile.dpoContact.email}${input.orgProfile.dpoContact.address ? ` or by post at ${input.orgProfile.dpoContact.address}` : ''} (GDPR Art. 37-39).`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 35: Data Protection Impact Assessment ---
    if (dp.conductsDPIA) {
      reqs.push({
        id: 'GDPR-ART35',
        jurisdiction: Jurisdiction.GDPR,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Data protection impact assessment',
        statutoryReference: 'GDPR Art. 35',
        obligationType: 'process',
        requirementText: 'Where a type of processing is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall, prior to the processing, carry out an assessment of the impact of the envisaged processing operations on the protection of personal data.',
        disclaimerLanguage: 'We carry out Data Protection Impact Assessments (DPIAs) for processing operations that are likely to result in a high risk to the rights and freedoms of individuals, as required by GDPR Art. 35. These assessments evaluate the necessity, proportionality, and risks of the processing, and identify measures to mitigate those risks.',
        conditionalOn: ['conductsDPIA'],
        priority: 'required',
      });
    }

    // --- Art. 27: EU Representative ---
    if (input.orgProfile.euRepresentative) {
      const rep = input.orgProfile.euRepresentative;
      reqs.push({
        id: 'GDPR-ART27',
        jurisdiction: Jurisdiction.GDPR,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'EU Representative',
        statutoryReference: 'GDPR Art. 27',
        obligationType: 'disclosure',
        requirementText: 'Where a controller or processor not established in the Union processes personal data of data subjects in the Union, a representative in the Union shall be designated.',
        disclaimerLanguage: `As we are not established in the European Union, we have designated an EU representative in accordance with GDPR Art. 27: ${rep.name}, reachable at ${rep.email}, ${rep.address}.`,
        conditionalOn: ['always'],
        priority: 'required',
      });
    }

    // --- Art. 44-49: Cross-border transfers ---
    if (dp.crossBorderTransfers.transfers && dp.crossBorderTransfers.destinations) {
      for (const dest of dp.crossBorderTransfers.destinations) {
        const mechanismLabel = TRANSFER_MECHANISM_LABELS[dest.mechanism] ?? 'appropriate safeguards';
        reqs.push({
          id: `GDPR-TRANSFER-${dest.country.replace(/\s/g, '_')}`,
          jurisdiction: Jurisdiction.GDPR,
          topic: TopicCategory.DATA_MANAGEMENT,
          subtopic: 'Cross-border transfers',
          statutoryReference: 'GDPR Art. 44-49',
          obligationType: 'disclosure',
          requirementText: `Transfer to ${dest.country} based on ${mechanismLabel}.`,
          disclaimerLanguage: `We transfer personal data to ${dest.country} on the basis of ${mechanismLabel}. We ensure that appropriate safeguards are in place to protect your personal data in accordance with GDPR Art. 44-49.`,
          conditionalOn: ['crossBorderTransfers.transfers'],
          priority: 'required',
        });
      }
    }

    // --- Third-party disclosure ---
    if (dp.thirdPartySharing.shares) {
      reqs.push({
        id: 'GDPR-ART28',
        jurisdiction: Jurisdiction.GDPR,
        topic: TopicCategory.THIRD_PARTY,
        subtopic: 'Accountability for transfers',
        statutoryReference: 'GDPR Art. 28',
        obligationType: 'disclosure',
        requirementText: 'Where processing is to be carried out on behalf of a controller, the controller shall use only processors providing sufficient guarantees to implement appropriate technical and organisational measures.',
        disclaimerLanguage: `${input.orgProfile.legalName} uses only data processors that provide sufficient guarantees to implement appropriate technical and organisational measures in accordance with the GDPR. We enter into data processing agreements with all processors as required by GDPR Art. 28.`,
        conditionalOn: ['thirdPartySharing.shares'],
        priority: 'required',
      });
    }

    // --- Cookies: ePrivacy Directive + GDPR ---
    if (dp.usesCookies) {
      reqs.push({
        id: 'GDPR-COOKIES',
        jurisdiction: Jurisdiction.GDPR,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Cookies and tracking technologies',
        statutoryReference: 'GDPR Art. 6-7; ePrivacy Directive Art. 5(3)',
        obligationType: 'disclosure',
        requirementText: 'The storing of information, or the gaining of access to information already stored in the terminal equipment of a subscriber or user, is only allowed on condition that the subscriber or user concerned has given his or her consent, having been provided with clear and comprehensive information.',
        disclaimerLanguage: 'We use cookies and similar tracking technologies in accordance with the ePrivacy Directive (Art. 5(3)) and the GDPR. Non-essential cookies require your prior consent, which must be freely given, specific, informed, and unambiguous. You may withdraw your consent at any time through our cookie preference settings (GDPR Art. 7; ePrivacy Directive Art. 5(3)).',
        conditionalOn: ['usesCookies'],
        priority: 'required',
      });
    }

    // --- Art. 77: Right to lodge a complaint ---
    reqs.push({
      id: 'GDPR-ART77',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.ENFORCEMENT,
      subtopic: 'Challenging compliance',
      statutoryReference: 'GDPR Art. 77',
      obligationType: 'disclosure',
      requirementText: 'Every data subject shall have the right to lodge a complaint with a supervisory authority, in particular in the Member State of his or her habitual residence, place of work, or place of the alleged infringement.',
      disclaimerLanguage: `You may contact our ${input.orgProfile.dpoContact.title} at ${input.orgProfile.dpoContact.email} regarding any concerns about our processing of your personal data. You also have the right to lodge a complaint with a supervisory authority, in particular in the EU/EEA Member State of your habitual residence, place of work, or place of the alleged infringement (GDPR Art. 77).`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Art. 7(3): Right to withdraw consent ---
    reqs.push({
      id: 'GDPR-ART7',
      jurisdiction: Jurisdiction.GDPR,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to withdraw consent',
      statutoryReference: 'GDPR Art. 7(3)',
      obligationType: 'right',
      requirementText: 'The data subject shall have the right to withdraw his or her consent at any time. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal.',
      disclaimerLanguage: 'Where we rely on your consent as the legal basis for processing, you have the right to withdraw that consent at any time. Withdrawal of consent does not affect the lawfulness of processing carried out before the withdrawal (GDPR Art. 7(3)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    return reqs;
  },
};
