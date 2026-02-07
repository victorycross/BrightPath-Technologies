import { Jurisdiction, JURISDICTION_LABELS } from '@core/data/enums.js';

interface RoleImplicationEntry {
  jurisdictionLabel: string;
  controllerText: string;
  processorText: string;
  jointControllerText: string;
}

export const ROLE_IMPLICATIONS: Record<Jurisdiction, RoleImplicationEntry> = {
  [Jurisdiction.GDPR]: {
    jurisdictionLabel: JURISDICTION_LABELS[Jurisdiction.GDPR],
    controllerText:
      'As a Data Controller under the GDPR, your organization independently determines the purposes and means of processing personal data. You bear primary accountability under Art. 24, including obligations to implement appropriate technical and organizational measures, maintain records of processing activities (Art. 30), conduct data protection impact assessments where required (Art. 35), and ensure a lawful basis for all processing (Art. 6). You must appoint a Data Protection Officer where required (Art. 37) and serve as the primary point of contact for data subjects exercising their rights.',
    processorText:
      'As a Data Processor under the GDPR, your organization processes personal data on behalf of and under the instructions of a controller. You must enter into a data processing agreement per Art. 28, implement appropriate security measures (Art. 32), maintain records of processing activities carried out on behalf of the controller (Art. 30(2)), and assist the controller in fulfilling data subject access requests and DPIAs. You may not engage a sub-processor without prior written authorization from the controller.',
    jointControllerText:
      'As a Joint Controller under the GDPR, your organization jointly determines the purposes and means of processing with one or more other controllers. Under Art. 26, you must enter into a transparent arrangement defining each party\'s responsibilities for compliance, including obligations to data subjects. The arrangement must reflect the respective roles and relationships of the joint controllers vis-a-vis data subjects, and its essence must be made available to data subjects.',
  },
  [Jurisdiction.PIPEDA]: {
    jurisdictionLabel: JURISDICTION_LABELS[Jurisdiction.PIPEDA],
    controllerText:
      'Under PIPEDA, your organization is accountable for personal information under its control (Principle 4.1). You must designate an individual accountable for compliance, establish policies and practices to give effect to the principles, and ensure that third-party service providers afford a comparable level of protection (Principle 4.1.3). Accountability continues even when personal information is transferred to a third party for processing.',
    processorText:
      'Under PIPEDA, as a processor acting on behalf of another organization, you process personal information under contractual agreements that require comparable protection. The transferring organization (controller) retains accountability under Principle 4.1.3. You must comply with contractual obligations regarding the use, disclosure, and protection of the personal information entrusted to you.',
    jointControllerText:
      'Under PIPEDA, where organizations jointly determine the purposes and means of processing, each organization retains accountability under Principle 4.1. Both parties should establish clear agreements defining their respective roles, responsibilities, and accountability for compliance with the PIPEDA principles, particularly regarding consent, purpose limitation, and access requests.',
  },
  [Jurisdiction.QUEBEC_LAW25]: {
    jurisdictionLabel: JURISDICTION_LABELS[Jurisdiction.QUEBEC_LAW25],
    controllerText:
      'Under Quebec Law 25, your organization exercises control over the collection, holding, use, and communication of personal information. You must designate a person responsible for the protection of personal information (s. 3.1), conduct privacy impact assessments for information systems projects (s. 3.3), establish governance policies and practices (s. 3.2), and maintain a register of confidentiality incidents. You must inform individuals when personal information is communicated outside Quebec (s. 17).',
    processorText:
      'Under Quebec Law 25, when processing personal information on behalf of another organization, you must enter into a written agreement ensuring equivalent protection (s. 18.3). You may only use the information for the purposes specified in the agreement and must implement security measures consistent with the Act. You must notify the mandating organization of any confidentiality incident without delay.',
    jointControllerText:
      'Under Quebec Law 25, where organizations share responsibility for determining the purposes and means of processing, each organization must comply with its obligations under the Act. Written agreements should define responsibilities for governance, privacy impact assessments, incident management, and the exercise of access and rectification rights by the persons concerned.',
  },
  [Jurisdiction.ALBERTA_PIPA]: {
    jurisdictionLabel: JURISDICTION_LABELS[Jurisdiction.ALBERTA_PIPA],
    controllerText:
      'Under Alberta PIPA, your organization is responsible for personal information under its control (s. 5). You must designate one or more individuals to ensure compliance, develop and follow policies and practices, and ensure that personal information transferred to a service provider is subject to comparable protection through contractual or other means.',
    processorText:
      'Under Alberta PIPA, as a service provider processing personal information on behalf of another organization, you must comply with the terms of your service agreement and apply appropriate safeguards. The organization that collected the information retains overall responsibility for its protection under s. 5.',
    jointControllerText:
      'Under Alberta PIPA, where organizations share control over personal information, each organization bears responsibility under s. 5. Clear agreements should be established to delineate each party\'s obligations for collection, use, disclosure, and protection of personal information.',
  },
  [Jurisdiction.BC_PIPA]: {
    jurisdictionLabel: JURISDICTION_LABELS[Jurisdiction.BC_PIPA],
    controllerText:
      'Under BC PIPA, your organization is responsible for personal information under its control (s. 4). You must designate an individual to ensure compliance, develop policies and practices to meet obligations, and ensure that service providers to whom you transfer personal information are subject to comparable safeguards through contractual or other means.',
    processorText:
      'Under BC PIPA, as a service provider processing personal information on behalf of another organization, you must comply with the terms of your service agreement and apply appropriate safeguards. The originating organization retains primary responsibility under s. 4.',
    jointControllerText:
      'Under BC PIPA, where organizations jointly control personal information, each party bears responsibility under s. 4. Agreements should clearly define responsibilities for compliance, including consent management, access requests, and security safeguards.',
  },
  [Jurisdiction.CCPA]: {
    jurisdictionLabel: JURISDICTION_LABELS[Jurisdiction.CCPA],
    controllerText:
      'Under the CCPA, your organization qualifies as a "business" that determines the purposes and means of processing consumers\' personal information (Cal. Civ. Code \u00a71798.140(d)). You must provide notice at collection, honor opt-out requests for the sale of personal information, respond to verifiable consumer requests for access and deletion, and maintain reasonable security procedures.',
    processorText:
      'Under the CCPA, your organization qualifies as a "service provider" processing personal information on behalf of a business (Cal. Civ. Code \u00a71798.140(v)). You must process information only for the business purposes specified in your service agreement and are prohibited from selling or retaining the information for your own commercial purposes. You must assist the business in responding to consumer rights requests.',
    jointControllerText:
      'Under the CCPA, where organizations jointly determine the purposes and means of processing, each party may be classified as a "business" with independent obligations. Both parties should establish agreements defining their respective compliance responsibilities, particularly regarding consumer notice, opt-out mechanisms, and responding to access and deletion requests.',
  },
  [Jurisdiction.CPRA]: {
    jurisdictionLabel: JURISDICTION_LABELS[Jurisdiction.CPRA],
    controllerText:
      'Under the CPRA, your organization qualifies as a "business" that determines the purposes and means of processing consumers\' personal information (Cal. Civ. Code \u00a71798.140(d)). You must contractually obligate service providers and contractors to comply with the CPRA (\u00a71798.100(d)), honor opt-out rights for both sales and sharing for cross-context behavioral advertising, conduct cybersecurity audits and risk assessments where required, and respond to requests regarding automated decision-making technology.',
    processorText:
      'Under the CPRA, your organization qualifies as a "service provider" or "contractor" processing personal information on behalf of a business. You must comply with contractual restrictions per \u00a71798.100(d) and \u00a71798.140(ag), limit processing to specified purposes, implement reasonable security, assist the business with consumer rights requests, and refrain from selling or sharing the information for cross-context behavioral advertising.',
    jointControllerText:
      'Under the CPRA, where organizations jointly determine purposes and means of processing, each may qualify as a "business" with independent obligations under the Act. Joint arrangements should define responsibilities for consumer notice, contractual obligations to service providers, opt-out mechanisms for sales and sharing, and handling of sensitive personal information.',
  },
};

export function getRoleImplication(
  jurisdiction: Jurisdiction,
  entityType: 'controller' | 'processor' | 'joint_controller',
): string {
  const entry = ROLE_IMPLICATIONS[jurisdiction];
  if (!entry) return '';
  switch (entityType) {
    case 'controller':
      return entry.controllerText;
    case 'processor':
      return entry.processorText;
    case 'joint_controller':
      return entry.jointControllerText;
    default:
      return '';
  }
}
