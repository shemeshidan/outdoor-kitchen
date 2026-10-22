import { round1 } from './calc';
import type { Box, Member, Stage, ZoneId } from './types';

// Shared geometry for all zones. Profiles are drawn 5 cm across the wall and 4 cm along it.
export const WEB = 5;
export const FLANGE = 4;

/** Vertical stud in a front/back wall. */
export const studAt = (x: number, y: number, z0: number, z1: number): Box => ({ x, y, z: z0, dx: FLANGE, dy: WEB, dz: z1 - z0 });
/** Vertical stud in a width wall (wall runs along y). */
export const wallStudAt = (x: number, y: number, z1: number, z0 = 0): Box => ({ x, y, z: z0, dx: WEB, dy: FLANGE, dz: z1 - z0 });
/** Horizontal run along x with its top at zTop. */
export const runX = (x: number, length: number, y: number, zTop: number, depth = WEB, height = 4): Box => ({ x, y, z: zTop - height, dx: length, dy: depth, dz: height });
/** Horizontal run along y with its top at zTop. */
export const runY = (x: number, y: number, length: number, zTop: number, width = WEB): Box => ({ x, y, z: zTop - 4, dx: width, dy: length, dz: 4 });

export type Draft = Omit<Member, 'id' | 'zone' | 'stage' | 'tabs' | 'tabKind' | 'pairOf'>
  & Partial<Pick<Member, 'tabs' | 'tabKind'>>
  & { pairWithPrevious?: true };

/** Turns drafts into members with ids like C3-07; a paired draft points at the member before it. */
export function makeStage(zone: ZoneId, prefix: string) {
  return (number: number, drafts: Draft[]): Member[] => {
    const members: Member[] = [];
    drafts.forEach(({ pairWithPrevious, ...draft }, index) => {
      const previous = members[members.length - 1];
      members.push({
        tabs: 0,
        tabKind: 'flat',
        ...draft,
        id: `${prefix}${number}-${String(index + 1).padStart(2, '0')}`,
        zone,
        stage: number,
        ...(pairWithPrevious && previous ? { pairOf: previous.id } : {}),
      });
    });
    return members;
  };
}

type BoxDraft = Omit<Draft, 'kind' | 'pairWithPrevious' | 'statedCut' | 'tabs' | 'tabKind'>;

/**
 * A box ("קופסה") is a track with a stud inside it (page 16). The stud is cut to the net length;
 * the track gets a 4.8 tab folded at each end unless the plan states its cut.
 */
export function boxPair(draft: BoxDraft, statedTrackCut?: number): Draft[] {
  const trackCut = statedTrackCut ?? round1(draft.netLength + 9.6);
  const ruleCheck = statedTrackCut === undefined ? 'אורך חיתוך המסילה של הקופסה מחושב לפי הכלל של עמוד 16 (נטו + 4.8 + 4.8). לבדוק שזה מתאים כאן.' : undefined;
  return [
    { ...draft, kind: 'beam', name: `${draft.name} – ניצב` },
    { ...draft, kind: 'track', name: `${draft.name} – מסילה`, statedCut: trackCut, pairWithPrevious: true, needsCheck: draft.needsCheck ?? ruleCheck },
  ];
}

export function stageList(zone: ZoneId, stages: Omit<Stage, 'zone'>[]): Stage[] {
  return stages.map((stage) => ({ ...stage, zone }));
}

/** Studs evenly spaced across a span, returning their start positions. */
export const evenly = (from: number, span: number, count: number) => Array.from({ length: count }, (_, k) => from + (span * (k + 0.5)) / count - FLANGE / 2);
