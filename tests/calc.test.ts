import { describe, expect, it } from 'vitest';
import { cutLength, formatCm, groupCuts, materialOf, packBars, type Member } from '../src/model';

const member = (id: string, netLength: number, extra: Partial<Member> = {}): Member => ({
  id, zone: 'right', stage: 1, kind: 'track', name: id, netLength, tabs: 0, tabKind: 'flat',
  box: { x: 0, y: 0, z: 0, dx: netLength, dy: 5, dz: 4 }, location: '', sourcePage: 1, ...extra,
});

describe('cut calculations', () => {
  it('adds 4.8 per flat tab and 5 per folded tab', () => {
    expect(cutLength(member('a', 53.5, { tabs: 2, tabKind: 'flat' }))).toBe(63.1);
    expect(cutLength(member('b', 78, { tabs: 2, tabKind: 'folded' }))).toBe(88);
    expect(cutLength(member('c', 50, { tabs: 1, tabKind: 'flat' }))).toBe(54.8);
  });

  it('prefers a cut length stated in the plan', () => {
    expect(cutLength(member('d', 19, { statedCut: 23, tabs: 2 }))).toBe(23);
  });

  it('maps beams to stud stock and girts to track stock', () => {
    expect(materialOf(member('e', 1, { kind: 'beam' }))).toBe('stud');
    expect(materialOf(member('f', 1, { kind: 'girt' }))).toBe('track');
  });

  it('groups identical cuts with a quantity', () => {
    const groups = groupCuts([member('a', 53.5, { tabs: 2 }), member('b', 53.5, { tabs: 2 }), member('c', 241.2)]);
    expect(groups.map((group) => [group.cut, group.members.length])).toEqual([[241.2, 1], [63.1, 2]]);
  });

  it('packs cuts into stock bars without exceeding the bar length', () => {
    const cuts = [241.2, 241.2, 145, 145, 81.5, 63.1, 63.1, 14.7].map((length, index) => member(`m${index}`, length));
    const { bars, tooLong } = packBars(cuts, 300);
    expect(tooLong).toHaveLength(0);
    for (const bar of bars) expect(bar.used).toBeLessThanOrEqual(300);
    expect(bars.flatMap((bar) => bar.cuts)).toHaveLength(cuts.length);
    expect(bars.length).toBeLessThanOrEqual(5);
  });

  it('reports cuts longer than the stock', () => {
    expect(packBars([member('long', 320)], 300).tooLong).toHaveLength(1);
  });

  it('formats centimetres without trailing zeros', () => {
    expect(formatCm(53.5)).toBe('53.5 ס״מ');
    expect(formatCm(78)).toBe('78 ס״מ');
    expect(formatCm(224.75)).toBe('224.75 ס״מ');
  });
});
