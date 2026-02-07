import { Jurisdiction } from '../enums.js';
import type { RegulationModule } from '../types.js';
import { pipedaModule } from './pipeda.js';
import { albertaPipaModule } from './alberta-pipa.js';
import { bcPipaModule } from './bc-pipa.js';
import { quebecLaw25Module } from './quebec-law25.js';
import { ccpaModule } from './ccpa.js';
import { cpraModule } from './cpra.js';
import { gdprModule } from './gdpr.js';

const REGULATION_REGISTRY = new Map<Jurisdiction, RegulationModule>();

function register(mod: RegulationModule): void {
  REGULATION_REGISTRY.set(mod.id, mod);
}

// Register available modules
register(pipedaModule);
register(albertaPipaModule);
register(bcPipaModule);
register(quebecLaw25Module);
register(ccpaModule);
register(cpraModule);
register(gdprModule);

export function getRegulationModule(jurisdiction: Jurisdiction): RegulationModule | undefined {
  return REGULATION_REGISTRY.get(jurisdiction);
}

export function getAvailableRegulations(): RegulationModule[] {
  return Array.from(REGULATION_REGISTRY.values());
}

export function isRegulationSupported(jurisdiction: Jurisdiction): boolean {
  return REGULATION_REGISTRY.has(jurisdiction);
}
