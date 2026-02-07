import type { ValidatedInput, MappedRequirement } from '../data/types.js';
import { getRegulationModule } from '../data/regulations/index.js';

export function mapRegulations(input: ValidatedInput): MappedRequirement[] {
  const allRequirements: MappedRequirement[] = [];

  for (const jurisdiction of input.jurisdictions) {
    const mod = getRegulationModule(jurisdiction);
    if (!mod) {
      continue;
    }
    const reqs = mod.mapRequirements(input);
    allRequirements.push(...reqs);
  }

  return allRequirements;
}
