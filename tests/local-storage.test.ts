import { beforeEach, describe, expect, it } from 'vitest';
import { defaultPreferences, loadPreferences, resetPreferences, savePreferences } from '../src/lib/local-storage';

describe('local preferences', () => {
  beforeEach(() => localStorage.clear());

  it('returns defaults when storage is empty or malformed', () => {
    expect(loadPreferences()).toEqual(defaultPreferences);
    localStorage.setItem('outdoor-kitchen-plan:v2', '{broken');
    expect(loadPreferences()).toEqual(defaultPreferences);
  });

  it('ignores the old v1 format', () => {
    localStorage.setItem('outdoor-kitchen-plan:v2', JSON.stringify({ version: 1, selectedZone: 'right', selectedPartId: null, notes: {} }));
    expect(loadPreferences()).toEqual(defaultPreferences);
  });

  it('persists progress, stage and stock length locally', () => {
    const preferences = { ...defaultPreferences, stage: 3, selectedMemberId: 'R2-01', built: { 'R1-01': true as const }, cut: { 'R1-02': true as const }, stockLength: 400 as const };
    savePreferences(preferences);
    expect(loadPreferences()).toEqual(preferences);
  });

  it('rejects progress flags that are not true', () => {
    localStorage.setItem('outdoor-kitchen-plan:v2', JSON.stringify({ ...defaultPreferences, built: { 'R1-01': 'yes' } }));
    expect(loadPreferences()).toEqual(defaultPreferences);
  });

  it('resets only the app keys', () => {
    localStorage.setItem('other-app', 'keep');
    localStorage.setItem('outdoor-kitchen-plan:v1', 'old');
    savePreferences({ ...defaultPreferences, stage: 2 });
    resetPreferences();
    expect(localStorage.getItem('outdoor-kitchen-plan:v2')).toBeNull();
    expect(localStorage.getItem('outdoor-kitchen-plan:v1')).toBeNull();
    expect(localStorage.getItem('other-app')).toBe('keep');
  });
});
