import type {
  ValidatedInput,
  MappedRequirement,
  DisclaimerSection,
  DisclaimerMetadata,
} from '../data/types.js';
import { assembleSections } from './section-assembler.js';

export interface BuiltDisclaimer {
  sections: DisclaimerSection[];
  metadata: DisclaimerMetadata;
}

export function buildDisclaimer(
  requirements: MappedRequirement[],
  input: ValidatedInput,
): BuiltDisclaimer {
  const sections = assembleSections(requirements, input);

  const metadata: DisclaimerMetadata = {
    generatedAt: new Date(),
    jurisdictions: input.jurisdictions,
    orgName: input.orgProfile.legalName,
    version: '0.1.0',
    requirementCount: requirements.length,
  };

  return { sections, metadata };
}
