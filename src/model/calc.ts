import type { Material, Member, MemberKind, TabKind } from './types';

export const tabLength: Record<TabKind, number> = { flat: 4.8, folded: 5 };

export const kindLabels: Record<MemberKind, string> = {
  track: 'מסילה',
  stud: 'ניצב',
  girt: 'חגורה',
  beam: 'קורה',
  blocking: 'חוסם לגבס',
  header: 'משקוף',
  sill: 'סף',
  strap: 'פס פח מחורר',
};

export const materialLabels: Record<Material, string> = {
  track: 'פרופיל מסילה',
  stud: 'פרופיל ניצב',
  strap: 'פס פח מחורר',
};

/** Beams are studs laid flat; straps are perforated strip; everything else in the plan is drawn as track. */
export function materialOf(member: Member): Material {
  if (member.kind === 'strap') return 'strap';
  return member.kind === 'stud' || member.kind === 'beam' ? 'stud' : 'track';
}

export function cutLength(member: Member): number {
  if (member.statedCut !== undefined) return member.statedCut;
  return round1(member.netLength + member.tabs * tabLength[member.tabKind]);
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function formatCm(value: number): string {
  return `${Number(value.toFixed(2))} ס״מ`;
}

export interface CutGroup {
  material: Material;
  kind: MemberKind;
  cut: number;
  net: number;
  members: Member[];
}

/** Groups identical cuts so each length is cut once with a quantity. */
export function groupCuts(members: Member[]): CutGroup[] {
  const groups = new Map<string, CutGroup>();
  for (const member of members) {
    const cut = cutLength(member);
    const key = `${materialOf(member)}|${member.kind}|${cut}|${member.netLength}`;
    const group = groups.get(key);
    if (group) group.members.push(member);
    else groups.set(key, { material: materialOf(member), kind: member.kind, cut, net: member.netLength, members: [member] });
  }
  return [...groups.values()].sort((a, b) => a.material.localeCompare(b.material) || b.cut - a.cut);
}

export interface Bar {
  cuts: { member: Member; cut: number }[];
  used: number;
  waste: number;
}

/** First-fit-decreasing packing of cuts into stock bars. */
export function packBars(members: Member[], stockLength: number, kerf = 0.3): { bars: Bar[]; tooLong: Member[] } {
  const bars: Bar[] = [];
  const tooLong: Member[] = [];
  const cuts = members.map((member) => ({ member, cut: cutLength(member) })).sort((a, b) => b.cut - a.cut);
  for (const item of cuts) {
    if (item.cut > stockLength) {
      tooLong.push(item.member);
      continue;
    }
    const bar = bars.find((candidate) => candidate.used + kerf + item.cut <= stockLength);
    if (bar) {
      bar.cuts.push(item);
      bar.used = round1(bar.used + kerf + item.cut);
    } else {
      bars.push({ cuts: [item], used: item.cut, waste: 0 });
    }
  }
  for (const bar of bars) bar.waste = round1(stockLength - bar.used);
  return { bars, tooLong };
}

export function totalLength(members: Member[]): number {
  return round1(members.reduce((sum, member) => sum + cutLength(member), 0));
}
