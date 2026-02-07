export enum Jurisdiction {
  PIPEDA = 'PIPEDA',
  QUEBEC_LAW25 = 'QUEBEC_LAW25',
  ALBERTA_PIPA = 'ALBERTA_PIPA',
  BC_PIPA = 'BC_PIPA',
  GDPR = 'GDPR',
  CCPA = 'CCPA',
  CPRA = 'CPRA',
}

export const JURISDICTION_LABELS: Record<Jurisdiction, string> = {
  [Jurisdiction.PIPEDA]: 'PIPEDA (Canada — Federal)',
  [Jurisdiction.QUEBEC_LAW25]: 'Quebec Law 25 (An Act to modernize legislative provisions as regards the protection of personal information)',
  [Jurisdiction.ALBERTA_PIPA]: 'Alberta PIPA (Personal Information Protection Act)',
  [Jurisdiction.BC_PIPA]: 'BC PIPA (Personal Information Protection Act)',
  [Jurisdiction.GDPR]: 'GDPR (General Data Protection Regulation — EU)',
  [Jurisdiction.CCPA]: 'CCPA (California Consumer Privacy Act)',
  [Jurisdiction.CPRA]: 'CPRA (California Privacy Rights Act)',
};

export enum DataCategory {
  PERSONAL_IDENTIFIERS = 'personal_identifiers',
  FINANCIAL = 'financial',
  HEALTH = 'health',
  BIOMETRIC = 'biometric',
  GEOLOCATION = 'geolocation',
  BEHAVIORAL = 'behavioral',
  EMPLOYMENT = 'employment',
  EDUCATION = 'education',
  SENSITIVE_PERSONAL = 'sensitive_personal',
  CHILDRENS = 'childrens',
  DEVICE_TECHNICAL = 'device_technical',
  USER_GENERATED = 'user_generated',
}

export const DATA_CATEGORY_LABELS: Record<DataCategory, string> = {
  [DataCategory.PERSONAL_IDENTIFIERS]: 'Personal identifiers (name, email, phone, address)',
  [DataCategory.FINANCIAL]: 'Financial information (payment details, bank information)',
  [DataCategory.HEALTH]: 'Health and medical data',
  [DataCategory.BIOMETRIC]: 'Biometric data (fingerprints, facial recognition)',
  [DataCategory.GEOLOCATION]: 'Geolocation data (GPS, IP-based location)',
  [DataCategory.BEHAVIORAL]: 'Behavioral data (browsing history, purchase history, preferences)',
  [DataCategory.EMPLOYMENT]: 'Employment information',
  [DataCategory.EDUCATION]: 'Educational records',
  [DataCategory.SENSITIVE_PERSONAL]: 'Sensitive personal information (race, religion, sexual orientation, political opinions)',
  [DataCategory.CHILDRENS]: "Children's data (individuals under 16/13)",
  [DataCategory.DEVICE_TECHNICAL]: 'Device and technical data (device IDs, browser info, cookies)',
  [DataCategory.USER_GENERATED]: 'User-generated content (reviews, feedback, posts)',
};

export enum LegalBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_INTEREST = 'public_interest',
  LEGITIMATE_INTEREST = 'legitimate_interest',
}

export const LEGAL_BASIS_LABELS: Record<LegalBasis, string> = {
  [LegalBasis.CONSENT]: 'Consent of the data subject',
  [LegalBasis.CONTRACT]: 'Performance of a contract',
  [LegalBasis.LEGAL_OBLIGATION]: 'Compliance with a legal obligation',
  [LegalBasis.VITAL_INTERESTS]: 'Protection of vital interests',
  [LegalBasis.PUBLIC_INTEREST]: 'Performance of a task in the public interest',
  [LegalBasis.LEGITIMATE_INTEREST]: 'Legitimate interests of the controller',
};

export enum ProcessingPurpose {
  SERVICE_DELIVERY = 'service_delivery',
  ACCOUNT_MANAGEMENT = 'account_management',
  MARKETING_DIRECT = 'marketing_direct',
  MARKETING_THIRD_PARTY = 'marketing_third_party',
  ANALYTICS = 'analytics',
  PERSONALIZATION = 'personalization',
  LEGAL_COMPLIANCE = 'legal_compliance',
  SECURITY_FRAUD = 'security_fraud',
  RESEARCH = 'research',
  EMPLOYMENT_ADMIN = 'employment_admin',
}

export const PROCESSING_PURPOSE_LABELS: Record<ProcessingPurpose, string> = {
  [ProcessingPurpose.SERVICE_DELIVERY]: 'Service delivery and fulfillment',
  [ProcessingPurpose.ACCOUNT_MANAGEMENT]: 'Account creation and management',
  [ProcessingPurpose.MARKETING_DIRECT]: 'Direct marketing communications',
  [ProcessingPurpose.MARKETING_THIRD_PARTY]: 'Third-party marketing',
  [ProcessingPurpose.ANALYTICS]: 'Analytics and performance measurement',
  [ProcessingPurpose.PERSONALIZATION]: 'Personalization and recommendations',
  [ProcessingPurpose.LEGAL_COMPLIANCE]: 'Legal and regulatory compliance',
  [ProcessingPurpose.SECURITY_FRAUD]: 'Security and fraud prevention',
  [ProcessingPurpose.RESEARCH]: 'Research and development',
  [ProcessingPurpose.EMPLOYMENT_ADMIN]: 'Employment administration',
};

export enum TransferMechanism {
  ADEQUACY_DECISION = 'adequacy_decision',
  STANDARD_CONTRACTUAL_CLAUSES = 'sccs',
  BINDING_CORPORATE_RULES = 'bcrs',
  EXPLICIT_CONSENT = 'explicit_consent',
  CONTRACTUAL_NECESSITY = 'contractual_necessity',
  COMPARABLE_PROTECTION = 'comparable_protection',
}

export enum DataSource {
  DIRECTLY_FROM_SUBJECT = 'directly_from_subject',
  THIRD_PARTY_PROVIDERS = 'third_party_providers',
  AUTOMATED_COLLECTION = 'automated_collection',
  PUBLIC_SOURCES = 'public_sources',
  SOCIAL_MEDIA = 'social_media',
}

export enum ConsentMechanism {
  OPT_IN = 'opt_in',
  OPT_OUT = 'opt_out',
  GRANULAR_CONSENT = 'granular_consent',
  COOKIE_CONSENT_BANNER = 'cookie_consent_banner',
  DOUBLE_OPT_IN = 'double_opt_in',
}

export enum TopicCategory {
  DEFINITIONS = 'definitions',
  SCOPE = 'scope',
  DATA_SUBJECT_RIGHTS = 'data_subject_rights',
  ENTERPRISE_REQUIREMENTS = 'enterprise_requirements',
  DATA_PROTECTION = 'data_protection',
  DATA_MANAGEMENT = 'data_management',
  ENFORCEMENT = 'enforcement',
  THIRD_PARTY = 'third_party_considerations',
}

export enum OutputFormat {
  MARKDOWN = 'md',
  DOCX = 'docx',
  HTML = 'html',
}
