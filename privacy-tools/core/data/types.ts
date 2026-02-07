import { z } from 'zod';
import {
  Jurisdiction,
  DataCategory,
  LegalBasis,
  ProcessingPurpose,
  TransferMechanism,
  DataSource,
  ConsentMechanism,
  TopicCategory,
  OutputFormat,
} from './enums.js';

// --- Organization Profile ---

export const DpoContactSchema = z.object({
  name: z.string().optional(),
  title: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const EuRepresentativeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
});

export const OrgProfileSchema = z.object({
  legalName: z.string().min(1),
  tradingName: z.string().optional(),
  entityType: z.enum(['controller', 'processor', 'joint_controller']),
  industrySector: z.string(),
  websiteUrl: z.string().url().optional(),
  headquartersCountry: z.string(),
  headquartersProvince: z.string().optional(),
  dpoContact: DpoContactSchema,
  euRepresentative: EuRepresentativeSchema.optional(),
});

export type OrgProfile = z.infer<typeof OrgProfileSchema>;

// --- Data Practices ---

export const ProcessingPurposeEntrySchema = z.object({
  purpose: z.nativeEnum(ProcessingPurpose),
  legalBasis: z.nativeEnum(LegalBasis),
  description: z.string().optional(),
});

export const RetentionEntrySchema = z.object({
  dataCategory: z.nativeEnum(DataCategory),
  period: z.string(),
  justification: z.string().optional(),
});

export const ThirdPartyRecipientSchema = z.object({
  category: z.string(),
  purpose: z.string(),
  dataCategories: z.array(z.nativeEnum(DataCategory)),
  country: z.string().optional(),
});

export const ThirdPartySharingSchema = z.object({
  shares: z.boolean(),
  recipients: z.array(ThirdPartyRecipientSchema).optional(),
  sellsData: z.boolean(),
  sharesForCrossBehavioral: z.boolean(),
});

export const CrossBorderDestinationSchema = z.object({
  country: z.string(),
  mechanism: z.nativeEnum(TransferMechanism),
  dataCategories: z.array(z.nativeEnum(DataCategory)),
});

export const CrossBorderTransfersSchema = z.object({
  transfers: z.boolean(),
  destinations: z.array(CrossBorderDestinationSchema).optional(),
});

export const DataPracticesSchema = z.object({
  dataCategories: z.array(z.nativeEnum(DataCategory)).min(1),
  dataSources: z.array(z.nativeEnum(DataSource)),
  processingPurposes: z.array(ProcessingPurposeEntrySchema).min(1),
  retentionSchedule: z.array(RetentionEntrySchema),
  thirdPartySharing: ThirdPartySharingSchema,
  crossBorderTransfers: CrossBorderTransfersSchema,
  consentMechanisms: z.array(z.nativeEnum(ConsentMechanism)),
  collectsChildrensData: z.boolean(),
  minimumAgeThreshold: z.number().optional(),
  usesCookies: z.boolean(),
  usesAutomatedDecisionMaking: z.boolean(),
  conductsDPIA: z.boolean(),
});

export type DataPractices = z.infer<typeof DataPracticesSchema>;

// --- Validated Input (combined) ---

export const ValidatedInputSchema = z.object({
  jurisdictions: z.array(z.nativeEnum(Jurisdiction)).min(1),
  orgProfile: OrgProfileSchema,
  dataPractices: DataPracticesSchema,
});

export type ValidatedInput = z.infer<typeof ValidatedInputSchema>;

// --- Regulatory Output Types ---

export interface MappedRequirement {
  id: string;
  jurisdiction: Jurisdiction;
  topic: TopicCategory;
  subtopic: string;
  statutoryReference: string;
  obligationType: 'disclosure' | 'right' | 'safeguard' | 'process' | 'restriction';
  requirementText: string;
  disclaimerLanguage: string;
  conditionalOn: string[];
  priority: 'required' | 'recommended' | 'conditional';
}

// --- Disclaimer Structure ---

export interface DisclaimerSection {
  id: string;
  heading: string;
  order: number;
  paragraphs: SectionParagraph[];
  jurisdictionCallouts: JurisdictionCallout[];
  citations: StatutoryCitation[];
}

export interface SectionParagraph {
  text: string;
  emphasis: 'normal' | 'bold' | 'italic';
  jurisdictionScope: Jurisdiction[] | 'all';
}

export interface JurisdictionCallout {
  jurisdiction: Jurisdiction;
  heading: string;
  body: string;
  citations: StatutoryCitation[];
}

export interface StatutoryCitation {
  jurisdiction: Jurisdiction;
  reference: string;
  description: string;
}

// --- Regulation Module Interface ---

export interface RegulationModule {
  id: Jurisdiction;
  fullName: string;
  shortName: string;
  effectiveDate: string;
  sourceUrl: string;
  mapRequirements(input: ValidatedInput): MappedRequirement[];
}

// --- Generation Options ---

export interface GenerationOptions {
  formats: OutputFormat[];
  outputDir: string;
}

// --- Generated Output ---

export interface GeneratedDisclaimer {
  sections: DisclaimerSection[];
  outputs: GeneratedOutput[];
  metadata: DisclaimerMetadata;
}

export interface GeneratedOutput {
  format: OutputFormat;
  filePath: string;
  content: string | Buffer;
}

export interface DisclaimerMetadata {
  generatedAt: Date;
  jurisdictions: Jurisdiction[];
  orgName: string;
  version: string;
  requirementCount: number;
}

// --- Section Template ---

export interface SectionContext {
  orgProfile: OrgProfile;
  dataPractices: DataPractices;
  requirements: MappedRequirement[];
  jurisdictions: Jurisdiction[];
  generatedDate: Date;
}

export type SectionTemplate = (context: SectionContext) => DisclaimerSection | null;

// --- Section Order ---

export const SECTION_ORDER = [
  'preamble',
  'data-collection',
  'legal-basis',
  'use-of-data',
  'data-sharing',
  'cross-border',
  'retention',
  'data-subject-rights',
  'security-measures',
  'children',
  'cookies',
  'automated-decisions',
  'changes-to-policy',
  'contact',
  'jurisdiction-specific',
] as const;

export type SectionId = typeof SECTION_ORDER[number];
