import { rightSide } from '../model/right-side';
import { zoneModels, type Member, type ZoneModel } from '../model';
import type { UserPreferences } from '../types/kitchen-plan';

export function currentZone(preferences: UserPreferences): ZoneModel {
  return zoneModels[preferences.selectedZone] ?? rightSide;
}

export function setFlags(flags: Record<string, true>, ids: string[], on: boolean): Record<string, true> {
  const next = { ...flags };
  for (const id of ids) {
    if (on) next[id] = true;
    else delete next[id];
  }
  return next;
}

export function countFlagged(members: Member[], flags: Record<string, true>): number {
  return members.filter((member) => flags[member.id]).length;
}
