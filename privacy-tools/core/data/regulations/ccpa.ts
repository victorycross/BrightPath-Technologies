import { Jurisdiction, DataCategory, TopicCategory } from '../enums.js';
import type { RegulationModule, MappedRequirement, ValidatedInput } from '../types.js';

const SENSITIVE_CATEGORIES: DataCategory[] = [
  DataCategory.HEALTH,
  DataCategory.BIOMETRIC,
  DataCategory.FINANCIAL,
  DataCategory.SENSITIVE_PERSONAL,
  DataCategory.GEOLOCATION,
];

export const ccpaModule: RegulationModule = {
  id: Jurisdiction.CCPA,
  fullName: 'California Consumer Privacy Act',
  shortName: 'CCPA',
  effectiveDate: '2020-01-01',
  sourceUrl: 'https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?division=3.&part=4.&lawCode=CIV&title=1.81.5',

  mapRequirements(input: ValidatedInput): MappedRequirement[] {
    const reqs: MappedRequirement[] = [];
    const dp = input.dataPractices;

    // --- §1798.100: Right to know / Disclosure at collection ---
    reqs.push({
      id: 'CCPA-100',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Accountability',
      statutoryReference: 'Cal. Civ. Code §1798.100',
      obligationType: 'disclosure',
      requirementText: 'A business that collects a consumer\'s personal information shall, at or before the point of collection, inform consumers as to the categories of personal information to be collected and the purposes for which the categories of personal information shall be used.',
      disclaimerLanguage: `${input.orgProfile.legalName} discloses the categories of personal information collected and the purposes for which such information is used, in accordance with the California Consumer Privacy Act (Cal. Civ. Code §1798.100).`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Purpose identification ---
    reqs.push({
      id: 'CCPA-100-PURPOSES',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Identifying purposes',
      statutoryReference: 'Cal. Civ. Code §1798.100(b)',
      obligationType: 'disclosure',
      requirementText: 'A business shall not collect additional categories of personal information or use personal information collected for additional purposes without providing the consumer with notice consistent with this section.',
      disclaimerLanguage: 'We do not collect additional categories of personal information or use collected information for additional purposes beyond those disclosed below, without first providing you with notice (Cal. Civ. Code §1798.100(b)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Purpose-specific disclosures
    for (const entry of dp.processingPurposes) {
      reqs.push({
        id: `CCPA-100-${entry.purpose}`,
        jurisdiction: Jurisdiction.CCPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Purpose specification',
        statutoryReference: 'Cal. Civ. Code §1798.100(b)',
        obligationType: 'disclosure',
        requirementText: `Purpose identified: ${entry.purpose}. ${entry.description ?? ''}`,
        disclaimerLanguage: entry.description ?? `To support ${entry.purpose.replace(/_/g, ' ')}.`,
        conditionalOn: [`processingPurposes.${entry.purpose}`],
        priority: 'required',
      });
    }

    // --- §1798.100: Right to know (access) ---
    reqs.push({
      id: 'CCPA-100-ACCESS',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Individual access',
      statutoryReference: 'Cal. Civ. Code §1798.100(a), §1798.110',
      obligationType: 'right',
      requirementText: 'A consumer shall have the right to request that a business that collects personal information about the consumer disclose the categories and specific pieces of personal information the business has collected.',
      disclaimerLanguage: 'You have the right to request that we disclose the categories and specific pieces of personal information we have collected about you, the categories of sources, the business or commercial purpose for collecting, and the categories of third parties with whom we share the information. We will respond within 45 days of receiving a verifiable consumer request (Cal. Civ. Code §1798.100, §1798.110).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- §1798.105: Right to deletion ---
    reqs.push({
      id: 'CCPA-105',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to deletion',
      statutoryReference: 'Cal. Civ. Code §1798.105',
      obligationType: 'right',
      requirementText: 'A consumer shall have the right to request that a business delete any personal information about the consumer which the business has collected from the consumer.',
      disclaimerLanguage: 'You have the right to request deletion of your personal information that we have collected, subject to certain exceptions set forth in the CCPA (Cal. Civ. Code §1798.105). Upon receiving a verifiable consumer request, we will delete the information and direct our service providers to delete the information.',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- §1798.120: Right to opt out of sale ---
    reqs.push({
      id: 'CCPA-120',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Right to opt out of sale',
      statutoryReference: 'Cal. Civ. Code §1798.120',
      obligationType: 'right',
      requirementText: 'A consumer shall have the right, at any time, to direct a business that sells personal information about the consumer to third parties not to sell the consumer\'s personal information.',
      disclaimerLanguage: 'You have the right to opt out of the sale of your personal information to third parties. You may exercise this right at any time (Cal. Civ. Code §1798.120).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // "Do Not Sell" link requirement (conditional on sellsData)
    if (dp.thirdPartySharing.sellsData) {
      reqs.push({
        id: 'CCPA-120-LINK',
        jurisdiction: Jurisdiction.CCPA,
        topic: TopicCategory.DATA_SUBJECT_RIGHTS,
        subtopic: 'Do not sell link',
        statutoryReference: 'Cal. Civ. Code §1798.135(a)',
        obligationType: 'disclosure',
        requirementText: 'A business that sells consumers\' personal information shall provide a clear and conspicuous link on its website titled "Do Not Sell My Personal Information."',
        disclaimerLanguage: 'We sell certain categories of personal information as defined by the CCPA. You may opt out of the sale of your personal information by using the "Do Not Sell My Personal Information" link available on our website (Cal. Civ. Code §1798.135(a)).',
        conditionalOn: ['thirdPartySharing.sellsData'],
        priority: 'required',
      });
    }

    // --- §1798.125: Non-discrimination ---
    reqs.push({
      id: 'CCPA-125',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.DATA_SUBJECT_RIGHTS,
      subtopic: 'Non-discrimination',
      statutoryReference: 'Cal. Civ. Code §1798.125',
      obligationType: 'right',
      requirementText: 'A business shall not discriminate against a consumer because the consumer exercised any of the consumer\'s rights under this title.',
      disclaimerLanguage: 'We will not discriminate against you for exercising any of your rights under the CCPA. We will not deny you goods or services, charge you a different price, or provide a different quality of goods or services because you exercised your rights (Cal. Civ. Code §1798.125).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- §1798.115: Disclosure for sale/business purpose ---
    if (dp.thirdPartySharing.shares) {
      reqs.push({
        id: 'CCPA-115',
        jurisdiction: Jurisdiction.CCPA,
        topic: TopicCategory.THIRD_PARTY,
        subtopic: 'Accountability for transfers',
        statutoryReference: 'Cal. Civ. Code §1798.115',
        obligationType: 'disclosure',
        requirementText: 'A business shall disclose the categories of personal information that the business sold or disclosed for a business purpose in the preceding 12 months.',
        disclaimerLanguage: `${input.orgProfile.legalName} discloses the categories of personal information sold or disclosed for a business purpose in the preceding 12 months, as required by Cal. Civ. Code §1798.115.`,
        conditionalOn: ['thirdPartySharing.shares'],
        priority: 'required',
      });
    }

    // --- Verification of consumer requests ---
    reqs.push({
      id: 'CCPA-VERIFICATION',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Consumer request verification',
      statutoryReference: 'Cal. Civ. Code §1798.100(c)',
      obligationType: 'process',
      requirementText: 'A business shall verify the identity of the consumer making a request and the consumer\'s right to access the information.',
      disclaimerLanguage: 'To protect your privacy, we will verify your identity before responding to requests to know, delete, or exercise other rights. You may be required to provide sufficient information for us to reasonably verify that you are the person about whom we collected personal information (Cal. Civ. Code §1798.100(c)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Children (under 16 opt-in for sale) ---
    if (dp.collectsChildrensData) {
      reqs.push({
        id: 'CCPA-CHILDREN',
        jurisdiction: Jurisdiction.CCPA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Consent for children',
        statutoryReference: 'Cal. Civ. Code §1798.120(c)-(d)',
        obligationType: 'disclosure',
        requirementText: 'A business shall not sell the personal information of consumers if the business has actual knowledge that the consumer is less than 16 years of age, unless the consumer has affirmatively authorized the sale. For consumers under 13, a parent or guardian must opt in.',
        disclaimerLanguage: `We do not sell the personal information of consumers under 16 without affirmative authorization. For consumers under 13, we require opt-in consent from a parent or guardian (Cal. Civ. Code §1798.120(c)-(d)).`,
        conditionalOn: ['collectsChildrensData'],
        priority: 'required',
      });
    }

    // --- Data collection limitation ---
    reqs.push({
      id: 'CCPA-COLLECTION',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting collection',
      statutoryReference: 'Cal. Civ. Code §1798.100(b)',
      obligationType: 'disclosure',
      requirementText: 'A business shall not collect personal information for additional purposes beyond those disclosed at or before collection.',
      disclaimerLanguage: 'We limit the collection of personal information to that which is disclosed in this policy and do not collect additional categories without providing notice (Cal. Civ. Code §1798.100(b)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Retention ---
    reqs.push({
      id: 'CCPA-RETENTION',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.DATA_MANAGEMENT,
      subtopic: 'Limiting use, disclosure, and retention',
      statutoryReference: 'Cal. Civ. Code §1798.100(a)',
      obligationType: 'disclosure',
      requirementText: 'A business must disclose the length of time it intends to retain each category of personal information, or if that is not possible, the criteria used to determine such period.',
      disclaimerLanguage: 'We retain personal information for no longer than is reasonably necessary for the disclosed purposes. The retention periods for each category of personal information are set out below (Cal. Civ. Code §1798.100(a)).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // Retention schedule disclosures
    for (const entry of dp.retentionSchedule) {
      reqs.push({
        id: `CCPA-RET-${entry.dataCategory}`,
        jurisdiction: Jurisdiction.CCPA,
        topic: TopicCategory.DATA_MANAGEMENT,
        subtopic: 'Retention period',
        statutoryReference: 'Cal. Civ. Code §1798.100(a)',
        obligationType: 'disclosure',
        requirementText: `Retention period for ${entry.dataCategory}: ${entry.period}`,
        disclaimerLanguage: `${entry.dataCategory.replace(/_/g, ' ')}: ${entry.period}${entry.justification ? ` (${entry.justification})` : ''}`,
        conditionalOn: [`retentionSchedule.${entry.dataCategory}`],
        priority: 'required',
      });
    }

    // --- Safeguards ---
    reqs.push({
      id: 'CCPA-SAFEGUARDS',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Safeguards',
      statutoryReference: 'Cal. Civ. Code §1798.150 (implied duty)',
      obligationType: 'disclosure',
      requirementText: 'A business shall implement and maintain reasonable security procedures and practices appropriate to the nature of the personal information.',
      disclaimerLanguage: 'We implement and maintain reasonable security procedures and practices appropriate to the nature of the personal information we collect, to protect it from unauthorized access, destruction, use, modification, or disclosure (Cal. Civ. Code §1798.150).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Breach (private right of action) ---
    reqs.push({
      id: 'CCPA-BREACH',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.DATA_PROTECTION,
      subtopic: 'Breach notification',
      statutoryReference: 'Cal. Civ. Code §1798.150',
      obligationType: 'disclosure',
      requirementText: 'A consumer whose nonencrypted and nonredacted personal information is subject to an unauthorized access and exfiltration, theft, or disclosure as a result of the business\'s violation of the duty to implement and maintain reasonable security procedures and practices may institute a civil action.',
      disclaimerLanguage: 'In the event of a data breach resulting from our failure to maintain reasonable security practices, affected consumers may have the right to seek statutory damages under the CCPA (Cal. Civ. Code §1798.150).',
      conditionalOn: ['always'],
      priority: 'required',
    });

    // --- Cookies and tracking ---
    if (dp.usesCookies) {
      reqs.push({
        id: 'CCPA-COOKIES',
        jurisdiction: Jurisdiction.CCPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Cookies and tracking technologies',
        statutoryReference: 'Cal. Civ. Code §1798.100, §1798.140(e)',
        obligationType: 'disclosure',
        requirementText: 'The use of cookies and similar tracking technologies that collect personal information must be disclosed, including the categories of information collected and purposes.',
        disclaimerLanguage: 'We use cookies and similar tracking technologies that may collect personal information as defined by the CCPA. We disclose the categories of personal information collected through these technologies and the purposes for their use (Cal. Civ. Code §1798.100, §1798.140(e)).',
        conditionalOn: ['usesCookies'],
        priority: 'required',
      });
    }

    // --- Automated decision-making ---
    if (dp.usesAutomatedDecisionMaking) {
      reqs.push({
        id: 'CCPA-ADM',
        jurisdiction: Jurisdiction.CCPA,
        topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
        subtopic: 'Automated decision-making',
        statutoryReference: 'Cal. Civ. Code §1798.140 (CCPA/AG Regulations)',
        obligationType: 'disclosure',
        requirementText: 'Businesses should disclose the use of automated decision-making and profiling technologies in their privacy policies.',
        disclaimerLanguage: 'We use automated decision-making and profiling technologies in the processing of personal information. We disclose the use of these technologies in accordance with CCPA requirements.',
        conditionalOn: ['usesAutomatedDecisionMaking'],
        priority: 'required',
      });
    }

    // --- Enforcement / Complaints ---
    reqs.push({
      id: 'CCPA-ENFORCEMENT',
      jurisdiction: Jurisdiction.CCPA,
      topic: TopicCategory.ENFORCEMENT,
      subtopic: 'Challenging compliance',
      statutoryReference: 'Cal. Civ. Code §1798.155-§1798.199',
      obligationType: 'disclosure',
      requirementText: 'The CCPA is enforced by the California Attorney General. Consumers have a limited private right of action for data breaches.',
      disclaimerLanguage: `You may contact our ${input.orgProfile.dpoContact.title} at ${input.orgProfile.dpoContact.email} regarding any concerns about our CCPA compliance. The CCPA is enforced by the California Attorney General at oag.ca.gov.`,
      conditionalOn: ['always'],
      priority: 'required',
    });

    return reqs;
  },
};
