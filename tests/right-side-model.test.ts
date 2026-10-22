import { describe, expect, it } from 'vitest';
import { rightSide, LENGTH, DEPTH, BACK_TOP } from '../src/model/right-side';
import { cutLength } from '../src/model';

const { members, stages } = rightSide;
const byName = (name: string) => {
  const found = members.filter((member) => member.name === name);
  expect(found, name).toHaveLength(1);
  return found[0]!;
};
const end = (value: number) => Number(value.toFixed(2));

describe('right side model', () => {
  it('has unique ids and every member belongs to a defined stage', () => {
    expect(new Set(members.map((member) => member.id)).size).toBe(members.length);
    const stageNumbers = new Set(stages.map((stage) => stage.number));
    for (const member of members) expect(stageNumbers.has(member.stage), member.id).toBe(true);
  });

  it('keeps every member inside the frame envelope', () => {
    for (const { id, box } of members) {
      expect(box.dx > 0 && box.dy > 0 && box.dz > 0, id).toBe(true);
      expect(box.x, id).toBeGreaterThanOrEqual(0);
      expect(end(box.x + box.dx), id).toBeLessThanOrEqual(LENGTH);
      expect(box.y, id).toBeGreaterThanOrEqual(0);
      expect(end(box.y + box.dy), id).toBeLessThanOrEqual(DEPTH);
      expect(end(box.z + box.dz), id).toBeLessThanOrEqual(BACK_TOP);
    }
  });

  it('draws runs at their stated net length', () => {
    // Members that run along the frame are drawn exactly as long as the plan says.
    const runs = members.filter((member) => ['track', 'girt', 'header', 'sill', 'blocking'].includes(member.kind) || member.kind === 'beam');
    for (const member of runs) {
      const drawn = Math.max(member.box.dx, member.box.dy);
      expect(end(drawn), member.name).toBe(member.netLength);
    }
  });

  it('matches the plan spans: top rails meet at the grill niche', () => {
    const front = byName('מסילה עליונה – חזית');
    const frontEnd = byName('מסילה עליונה – חזית, קצה');
    const behindGrill = byName('מסילה עליונה מאחורי המנגל');
    expect(front.box.x + front.box.dx).toBe(145);
    expect(behindGrill.box.x).toBe(145);
    expect(behindGrill.box.x + behindGrill.box.dx).toBe(frontEnd.box.x);
    expect(end(frontEnd.box.x + frontEnd.box.dx)).toBe(LENGTH);
  });

  it('fills the gaps between back studs exactly with drywall blocking', () => {
    const backStuds = members.filter((member) => member.name.startsWith('ניצב גב ב-')).map((member) => member.box).sort((a, b) => a.x - b.x);
    for (const blocking of members.filter((member) => member.kind === 'blocking')) {
      const left = backStuds.find((stud) => end(stud.x + stud.dx) === blocking.box.x);
      const right = backStuds.find((stud) => stud.x === end(blocking.box.x + blocking.box.dx));
      expect(left, `${blocking.name} starts at a stud`).toBeDefined();
      expect(right, `${blocking.name} ends at a stud`).toBeDefined();
    }
  });

  it('adds tabs to the cut length (63.1 for a 53.5 width rail with flat tabs)', () => {
    const widthRail = byName('מסילת רוחב תחתונה ב-82');
    expect(cutLength(widthRail)).toBe(63.1);
    expect(cutLength(byName('משקוף דלת הכיור'))).toBe(88);
    expect(cutLength(byName('מסילה תחתונה – חזית'))).toBe(241.2);
  });

  it('uses the cut lengths written in the plan for the blocking', () => {
    const cuts = members.filter((member) => member.kind === 'blocking').map(cutLength).sort((a, b) => a - b);
    expect(cuts).toEqual([10.7, 15.5, 20.5, 23, 41, 41]);
  });

  it('keeps the gas-hole zone (150–170) clear of niche-floor beams', () => {
    const nicheBeams = members.filter((member) => member.name.startsWith('קורת קופסה ברצפת הנישה') && !member.pairOf);
    expect(nicheBeams).toHaveLength(4);
    for (const beam of nicheBeams) {
      const overlaps = beam.box.x < 170 && beam.box.x + beam.box.dx > 150;
      expect(overlaps, beam.name).toBe(false);
    }
  });

  it('door openings match the plan widths and heights', () => {
    const sinkHeader = byName('משקוף דלת הכיור');
    const sinkSill = byName('סף דלת הכיור');
    expect([sinkHeader.box.x, sinkHeader.box.x + sinkHeader.box.dx]).toEqual([4, 82]);
    expect(sinkHeader.box.z).toBe(67.25);
    expect(sinkSill.box.z + sinkSill.box.dz).toBe(12.75);
    const gasHeader = byName('משקוף דלת הגז');
    expect([gasHeader.box.x, gasHeader.box.x + gasHeader.box.dx]).toEqual([146.75, 224.75]);
    expect(gasHeader.box.z).toBe(47.25);
  });
});
