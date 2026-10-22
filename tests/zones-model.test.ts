import { describe, expect, it } from 'vitest';
import { cutLength, zoneModels, type Member, type ZoneModel } from '../src/model';
import { center } from '../src/model/center';
import { island } from '../src/model/island';

const zones = Object.values(zoneModels) as ZoneModel[];
const all = zones.flatMap((zone) => zone.members);
const end = (value: number) => Number(value.toFixed(2));
const named = (members: Member[], name: string) => {
  const found = members.filter((member) => member.name === name);
  expect(found, name).toHaveLength(1);
  return found[0]!;
};

describe('all zones', () => {
  it('have unique ids across the whole kitchen', () => {
    expect(new Set(all.map((member) => member.id)).size).toBe(all.length);
  });

  it('place every member in a defined stage with a positive, on-floor box', () => {
    for (const zone of zones) {
      const stageNumbers = new Set(zone.stages.map((stage) => stage.number));
      for (const { id, stage, box } of zone.members) {
        expect(stageNumbers.has(stage), id).toBe(true);
        expect(box.dx > 0 && box.dy > 0 && box.dz > 0, id).toBe(true);
        expect(Math.min(box.x, box.y, box.z), id).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('draw every straight run at its net length', () => {
    for (const member of all.filter((candidate) => candidate.kind !== 'stud' && !candidate.tilt)) {
      const { dx, dy, dz } = member.box;
      expect([dx, dy, dz].map(end), member.name).toContain(member.netLength);
    }
  });

  it('pair each box track with a stud of the same length and position', () => {
    for (const track of all.filter((member) => member.pairOf)) {
      const stud = all.find((member) => member.id === track.pairOf);
      expect(stud, track.name).toBeDefined();
      expect(stud!.netLength).toBe(track.netLength);
      expect(stud!.box).toEqual(track.box);
      expect(cutLength(track)).toBeGreaterThan(track.netLength);
    }
  });
});

describe('centre section', () => {
  const members = center.members;

  it('front rails leave the 103.5–155.5 fridge opening and stop at the island rail (330.5)', () => {
    const right = named(members, 'מסילה תחתונה – חזית, צד ימין');
    const left = named(members, 'מסילה תחתונה – חזית, צד האי');
    expect(right.box.x + right.box.dx).toBe(103.5);
    expect(left.box.x).toBe(155.5);
    expect(left.box.x + left.box.dx).toBe(330.5);
    expect(cutLength(left)).toBe(179.8);
  });

  it('back rails cover the full 365', () => {
    const bottom = members.filter((member) => member.stage === 1 && member.name.startsWith('מסילה תחתונה – גב'));
    expect(end(bottom.reduce((sum, member) => sum + member.netLength, 0))).toBe(365);
    const top = members.filter((member) => member.stage === 2 && member.name.startsWith('מסילה עליונה – גב'));
    expect(end(top.reduce((sum, member) => sum + member.netLength, 0))).toBe(365);
  });

  it('countertop girts fill the gaps between width walls exactly', () => {
    const wallXs = [0, 98.5, 155.5, 181.5, 231.5, 299.5];
    for (const girt of members.filter((member) => member.name.startsWith('חגורת מסגרת השיש'))) {
      const start = girt.box.x;
      const finish = end(girt.box.x + girt.box.dx);
      expect(wallXs.some((x) => x + 5 === start), `${girt.name} starts after a wall`).toBe(true);
      expect(wallXs.some((x) => x === finish), `${girt.name} ends at a wall`).toBe(true);
    }
  });

  it('shelf-wall tracks span their studs (gaps left for the fence posts)', () => {
    expect(members.filter((member) => member.name.startsWith('מסילה תחתונה לקיר השני')).map((member) => member.netLength)).toEqual([98.5, 195.5, 32.5]);
    for (const bridge of members.filter((member) => member.name.startsWith('ניצב שוכב (גשר)'))) {
      expect(end(bridge.box.y + bridge.box.dy)).toBe(84);
    }
  });

  it('seat-end boxes use the stated 35.6 track cut', () => {
    const tracks = members.filter((member) => member.name.startsWith('קופסה 26') && member.pairOf);
    expect(tracks).toHaveLength(3);
    for (const track of tracks) expect(cutLength(track)).toBe(35.6);
  });
});

describe('island', () => {
  const members = island.members;

  it('outer rail runs 58.5 into the centre and 212 along the island', () => {
    const outer = named(members, 'מסילה תחתונה רציפה – קיר חיצוני');
    const inner = named(members, 'מסילה תחתונה – קיר פנימי');
    expect(end(inner.box.x - outer.box.x)).toBe(58.5);
    expect(end(outer.box.x + outer.box.dx)).toBe(end(inner.box.x + inner.box.dx));
    expect(cutLength(outer)).toBe(275.3);
    expect(cutLength(inner)).toBe(216.8);
  });

  it('studs get longer toward the free end (floor slope)', () => {
    const inner = members.filter((member) => member.name.startsWith('ניצב קיר פנימי')).sort((a, b) => a.box.x - b.box.x);
    expect(inner.map((member) => member.netLength)).toEqual([82.4, 83.5, 84.3, 84.8, 85.5, 86.5]);
  });

  it('top frame has 8 box beams with a 97.6 track cut', () => {
    const tracks = members.filter((member) => member.name.startsWith('קורת קופסה 88') && member.pairOf);
    expect(tracks).toHaveLength(8);
    for (const track of tracks) expect(cutLength(track)).toBe(97.6);
  });

  it('has 2 × 123, 2 × 124, 2 × 105 straps on each base wall', () => {
    const lengths = members.filter((member) => member.kind === 'strap').map((member) => member.netLength).sort();
    expect(lengths).toEqual([105, 105, 105, 105, 123, 123, 123, 123, 124, 124, 124, 124]);
  });
});
