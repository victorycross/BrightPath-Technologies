import type { OrgProfile } from '@core/data/types.js';
import { OrgProfileSchema } from '@core/data/types.js';

const STORAGE_KEY = 'privacy-agent-profiles';

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
}

export function saveProfile(profile: OrgProfile, name?: string): void {
  const profiles = loadAllProfiles();
  const slug = slugify(name ?? profile.legalName);
  profiles[slug] = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function loadAllProfiles(): Record<string, OrgProfile> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function loadProfile(name: string): OrgProfile | null {
  const profiles = loadAllProfiles();
  const raw = profiles[slugify(name)];
  if (!raw) return null;
  const result = OrgProfileSchema.safeParse(raw);
  return result.success ? result.data : null;
}

export function deleteProfile(name: string): void {
  const profiles = loadAllProfiles();
  delete profiles[slugify(name)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function listProfileNames(): string[] {
  return Object.keys(loadAllProfiles());
}
