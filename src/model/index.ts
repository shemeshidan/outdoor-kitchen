import { rightSide } from './right-side';
import { center } from './center';
import { island } from './island';
import type { ZoneId, ZoneModel } from './types';

export const zones: { id: ZoneId; label: string }[] = [
  { id: 'right', label: 'צד ימין' },
  { id: 'center', label: 'מרכז' },
  { id: 'island', label: 'אי' },
];

/** Zones are modelled one at a time; a zone without a model shows as "coming soon". */
export const zoneModels: Partial<Record<ZoneId, ZoneModel>> = {
  right: rightSide,
  center,
  island,
};

export function isZoneId(value: unknown): value is ZoneId {
  return zones.some((zone) => zone.id === value);
}

export * from './types';
export * from './calc';
