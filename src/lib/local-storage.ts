import { isZoneId } from '../model';
import type { UserPreferences } from '../types/kitchen-plan';

const storageKey = 'outdoor-kitchen-plan:v2';
const legacyKeys = ['outdoor-kitchen-plan:v1'];

export const defaultPreferences: UserPreferences = {
  version: 2,
  selectedZone: 'right',
  selectedMemberId: null,
  stage: null,
  built: {},
  cut: {},
  stockLength: 300,
};

export function loadPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return defaultPreferences;

    const parsed: unknown = JSON.parse(stored);
    if (!isPreferences(parsed)) return defaultPreferences;
    return parsed;
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(preferences));
  } catch {
    // Storage can be unavailable (private mode); the app keeps working in memory.
  }
}

export function resetPreferences(): void {
  localStorage.removeItem(storageKey);
  for (const key of legacyKeys) localStorage.removeItem(key);
}

export function exportPreferences(preferences: UserPreferences): void {
  const blob = new Blob([JSON.stringify(preferences, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'outdoor-kitchen-progress.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

function isPreferences(value: unknown): value is UserPreferences {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<UserPreferences>;
  return candidate.version === 2
    && isZoneId(candidate.selectedZone)
    && (candidate.selectedMemberId === null || typeof candidate.selectedMemberId === 'string')
    && (candidate.stage === null || typeof candidate.stage === 'number')
    && isFlags(candidate.built)
    && isFlags(candidate.cut)
    && (candidate.stockLength === 300 || candidate.stockLength === 400 || candidate.stockLength === 600);
}

function isFlags(value: unknown): value is Record<string, true> {
  return typeof value === 'object' && value !== null && Object.values(value).every((flag) => flag === true);
}
