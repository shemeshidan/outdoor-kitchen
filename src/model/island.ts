import { boxPair, FLANGE, makeStage, runX, runY, stageList, studAt, wallStudAt, type Draft } from './build';
import type { Member, ZoneModel } from './types';

// Island, pages 10 and 19–24 of the work plan (21.10).
// Plan x = cm from the front face of the centre section toward the island's free end
// (the continuous outer rail starts 58.5 behind it, at the centre's back wall).
// Plan y = across the 36 cm base: inner wall (centre x 299.5) to outer wall (centre x 330.5).
// Scene boxes are shifted so every coordinate stays positive.
const O = 60;
const OY = 30;
const INNER_Y = OY;
const OUTER_Y = OY + 31;
const BASE_TOP = 82.5;
const FRAME_TOP = 87.5;
const stage = makeStage('island', 'I');

const studs: [number, number][] = [[4, 82.4], [44, 83.5], [84, 84.3], [124, 84.8], [164, 85.5], [208, 86.5]];
const beamXs = Array.from({ length: 8 }, (_, k) => 12.5 + 25 * k);
const straps: [number, number][] = [[64, 123], [144, 124], [186, 105]];

const strapDrafts = (side: 'פנימי' | 'חיצוני', y: number): Draft[] => straps.flatMap(([cx, length]) => {
  const angle = (Math.asin(Math.min(0.9, 76 / length)) * 180) / Math.PI;
  return [1, -1].map((sign): Draft => ({
    kind: 'strap', name: `פס פח מחורר ${length} – קיר ${side} (${sign > 0 ? 'א' : 'ב'})`, netLength: length,
    box: { x: O + cx - length / 2, y, z: 40, dx: length, dy: 0.6, dz: 2.5 }, tilt: sign * angle,
    location: `קיר הבסיס ה${side}, באלכסון (X)`, sourcePage: 24, approximate: true,
  }));
});

const members: Member[] = [
  ...stage(1, [
    { kind: 'track', name: 'מסילה תחתונה – קיר פנימי', netLength: 212, statedCut: 216.8, box: runX(O, 212, INNER_Y, 4), location: 'קיר פנימי (במרכז: 299.5–304.5), מחזית החלק האמצעי. לשונית מקופלת מול החזית שלו', sourcePage: 19 },
    { kind: 'track', name: 'מסילה תחתונה רציפה – קיר חיצוני', netLength: 270.5, statedCut: 275.3, box: runX(O - 58.5, 270.5, OUTER_Y, 4), location: 'קיר חיצוני (במרכז: 330.5–335.5), 58.5 בתוך החלק האמצעי + 212 באי. לשונית מקופלת מול המסילה האחורית', sourcePage: 19 },
    { kind: 'track', name: 'מסילה תחתונה – קיר הקצה', netLength: 26, statedCut: 35.6, box: runY(O + 207, INNER_Y + 5, 26, 4), location: 'בין שני הקירות, 207–212', sourcePage: 19 },
  ]),
  ...stage(2, [
    ...studs.flatMap(([x, length]): Draft[] => [
      { kind: 'stud', name: `ניצב קיר פנימי ב-${x}`, netLength: length, box: studAt(O + x, INNER_Y, 0, BASE_TOP), location: `קיר פנימי, ${x} מחזית החלק האמצעי`, sourcePage: 21 },
      { kind: 'stud', name: `ניצב קיר חיצוני ב-${x}`, netLength: length, box: studAt(O + x, OUTER_Y, 0, BASE_TOP), location: `קיר חיצוני, ${x} מחזית החלק האמצעי`, sourcePage: 21 },
    ]),
    { kind: 'stud', name: 'ניצב אמצעי בקיר הקצה', netLength: 86.5, box: wallStudAt(O + 207, OY + 16, BASE_TOP), location: 'קיר הקצה, באמצע', sourcePage: 21, approximate: true },
    { kind: 'track', name: 'מסילה עליונה – קיר פנימי', netLength: 212, box: runX(O, 212, INNER_Y, BASE_TOP), location: 'קיר פנימי, ראש הבסיס בגובה 82.5', sourcePage: 21 },
    { kind: 'track', name: 'מסילה עליונה – קיר חיצוני', netLength: 212, box: runX(O, 212, OUTER_Y, BASE_TOP), location: 'קיר חיצוני, ראש הבסיס בגובה 82.5', sourcePage: 21 },
    { kind: 'track', name: 'מסילה עליונה – קיר הקצה', netLength: 26, box: runY(O + 207, INNER_Y + 5, 26, BASE_TOP), location: 'קיר הקצה, גובה 82.5', sourcePage: 21,
      needsCheck: 'לא כתוב אם למסילה העליונה של קיר הקצה יש לשוניות כמו לתחתונה (חיתוך 35.6) – לבדוק בעמוד 21.' },
  ]),
  ...stage(3, [
    { kind: 'girt', name: 'חגורת רצפה – קיר פנימי', netLength: 207, box: runX(O, 207, INNER_Y + 5, 4, FLANGE), location: 'על הרצפה, צמודה לקיר הפנימי, פתוחה פנימה', sourcePage: 22 },
    { kind: 'girt', name: 'חגורת רצפה – קיר חיצוני', netLength: 207, box: runX(O, 207, OUTER_Y - FLANGE, 4, FLANGE), location: 'על הרצפה, צמודה לקיר החיצוני, פתוחה פנימה', sourcePage: 22 },
    ...[4, 44, 84, 124, 164].map((x): Draft => ({ kind: 'beam', name: `ניצב שוכב על הרצפה ב-${x}`, netLength: 25.8, box: runY(O + x, INNER_Y + 5.1, 25.8, 4), location: `על הרצפה, ${x}, בין שני הקירות`, sourcePage: 22 })),
  ]),
  ...stage(4, [
    ...boxPair({ name: 'היקף עליון – צד פנימי 241.5', netLength: 241.5, box: runX(O, 241.5, 0.5, FRAME_TOP, 3.5), location: 'מסגרת עליונה, צד הישיבה הפנימי', sourcePage: 23,
      needsCheck: 'ההיקף הוא מסילה + ניצב. לא כתוב אם למסילה יש לשוניות – לבדוק בעמוד 23.' }),
    ...boxPair({ name: 'היקף עליון – צד חיצוני 241.5', netLength: 241.5, box: runX(O, 241.5, 92, FRAME_TOP, 3.5), location: 'מסגרת עליונה, צד הישיבה החיצוני', sourcePage: 23,
      needsCheck: 'ההיקף הוא מסילה + ניצב. לא כתוב אם למסילה יש לשוניות – לבדוק בעמוד 23.' }),
    ...boxPair({ name: 'היקף עליון – קצה 95', netLength: 95, box: { x: O + 238, y: 0.5, z: FRAME_TOP - 4, dx: 3.5, dy: 95, dz: 4 }, location: 'מסגרת עליונה, בקצה החופשי', sourcePage: 23,
      needsCheck: 'ההיקף הוא מסילה + ניצב. לא כתוב אם למסילה יש לשוניות – לבדוק בעמוד 23.' }),
    ...beamXs.flatMap((x, k) => boxPair({ name: `קורת קופסה 88 (${k + 1}/8)`, netLength: 88, box: runY(O + x, 4, 88, FRAME_TOP, FLANGE), location: `מסגרת עליונה, כל 25 ס״מ`, sourcePage: 23, approximate: true,
      needsCheck: k === 0 ? 'בטקסט כתוב 8 קורות 88, ובכותרת השרטוט 9. נספרו 8 – לבדוק בעמוד 23.' : undefined }, 97.6)),
    ...[INNER_Y, OUTER_Y].map((y, k): Draft => ({ kind: 'beam', name: `קורה 53 בקצה המסגרת (${k + 1}/2)`, netLength: 53, box: runX(O + 184, 53, y, FRAME_TOP, FLANGE), location: 'מסגרת עליונה, ליד הקצה החופשי', sourcePage: 23, approximate: true })),
    ...[195, 210, 225].map((x, k): Draft => ({ kind: 'beam', name: `קורה 26 בקצה המסגרת (${k + 1}/3)`, netLength: 26, box: runY(O + x, INNER_Y + 5, 26, FRAME_TOP, FLANGE), location: 'מסגרת עליונה, ליד הקצה החופשי', sourcePage: 23, approximate: true })),
  ]),
  ...stage(5, [
    ...([[212, 86.6], [217, 86.7]] as const).flatMap(([x, length], wall): Draft[] => [
      { kind: 'track', name: `מסילה תחתונה – קיר קופסת הקצה ${wall + 1}`, netLength: 60, box: runY(O + x, 18, 60, 4), location: `קופסת הקצה, ${x}–${x + 5}`, sourcePage: 24 },
      { kind: 'track', name: `מסילה עליונה – קיר קופסת הקצה ${wall + 1}`, netLength: 60, box: runY(O + x, 18, 60, BASE_TOP), location: `קופסת הקצה, ${x}–${x + 5}, הראש לקורות שמעליו`, sourcePage: 24 },
      ...[19, 37, 55, 73].map((y, k): Draft => ({ kind: 'stud', name: `ניצב בקיר קופסת הקצה ${wall + 1} (${k + 1}/4)`, netLength: length, box: wallStudAt(O + x, y, BASE_TOP), location: `קופסת הקצה, ${x}–${x + 5}`, sourcePage: 24, approximate: true,
        needsCheck: k === 0 && wall === 0 ? 'בתכנית כתוב "4 ניצבים 86.7–86.6 בכל קיר" – לא ברור איזה אורך בכל קיר. למדוד במקום.' : undefined })),
    ]),
    ...strapDrafts('פנימי', INNER_Y - 0.6),
    ...strapDrafts('חיצוני', OUTER_Y + 5),
  ]),
];

const stages = stageList('island', [
  { number: 1, title: 'מסילות תחתונות של הבסיס', sourcePage: 19, notes: [
    'קיר פנימי 212 (חיתוך 216.8), נעצר בקיר הקדמי של החלק האמצעי. בתוך החלק האמצעי נשארת שם מסילת הרוחב 53.5.',
    'קיר חיצוני: מסילה אחת רציפה 270.5 (חיתוך 275.3) – 212 באי ועוד 58.5 עד הקיר האחורי של החלק האמצעי. היא מחליפה את מסילת הרוחב ב-330.5.',
    'קיר קצה 26 בין שני הקירות, ב-207–212 (חיתוך 35.6).',
    'הכול על פס MS. באי – חיתוכי כנף כל 40–60 ס״מ, כדי שהמסילה תעקוב אחרי שיפוע הרצפה.',
  ] },
  { number: 2, title: 'ניצבים ומסילות עליונות של הבסיס', sourcePage: 21, notes: [
    'ניצבים ב-4, 44, 84, 124, 164, 208 בשני הקירות. האורכים 82.4 עד 86.5 בגלל שיפוע הרצפה – למדוד במקום.',
    'ראש הבסיס מפולס בגובה 82.5.',
    'הניצב הראשון מוברג לחלק האמצעי ב-5 ברגים: בגבהים 15, 30, 45, 60, 75.',
  ] },
  { number: 3, title: 'מסילות משיקות וניצבים שוכבים על הרצפה', sourcePage: 22, notes: [
    'מסילה 207 צמודה לכל קיר בסיס, פתוחה פנימה.',
    '5 ניצבים שוכבים 25.8 ב-4, 44, 84, 124, 164.',
  ] },
  { number: 4, title: 'מסגרת עליונה', sourcePage: 23, notes: [
    'מרכיבים על הרצפה כמו סולם: היקף 2 × 241.5 + 95 (מסילה + ניצב).',
    '8 קופסאות 88 (חיתוך המסילה 97.6) כל 25 ס״מ. בקצה 3 × 26 ו-2 × 53.',
    'בודקים אלכסונים, מרימים וממרכזים – 32 מכל צד.',
    'מבריגים מלמטה דרך המסילות העליונות של הבסיס, 2 ברגים בכל קורה.',
  ] },
  { number: 5, title: 'קופסת קצה ופסים באלכסון', sourcePage: 24, notes: [
    '2 קירות 60 צמודים לקיר הקצה של הבסיס (212–217, 217–222), 4 ניצבים 86.6–86.7 בכל קיר.',
    '6 ברגים לקיר הקצה, והראש מוברג לקורות שמעליו.',
    'פסי פח מחורר באלכסון (X) בשני קירות הבסיס: 2 × 123, 2 × 124, 2 × 105 בכל קיר.',
    '5 ברגים בכל קיר בחיבור לחלק האמצעי.',
  ] },
]);

export const island: ZoneModel = {
  id: 'island',
  label: 'אי',
  summary: 'בסיס צר עם משטח ישיבה רחב, יוצא מהחלק האמצעי',
  members,
  stages,
  generalNotes: [
    'כל המספרים הם אורך נטו בס״מ, בלי לשוניות. לשונית מוסיפה לאורך החיתוך 4.8 (שטוחה) או 5 (מקופלת) בכל קצה.',
    'המרחקים באי נמדדים מהחזית של החלק האמצעי לכיוון הקצה החופשי.',
    'משטח 240 × 100 (שלד 241.5 × 95). בסיס 212 × 36 ועוד קופסת קצה 10 × 60 – סך הכול 222.',
    'בליטה של המשטח: 32 בצדדים, 22 בקצה (20 בצדי הקופסה).',
    'קופסה = מסילה עם ניצב בתוכה. המסילה נחתכת עם לשונית 4.8 בכל קצה, והניצב בדיוק לאורך הנטו.',
  ],
  extraItems: [
    'משטח לאי 240 × 100',
    'פס פח מחורר לאלכסונים (ראו רשימת החיתוך)',
    'פס MS מתחת למסילות התחתונות',
    'ברגים לפח (כפולים בכל החיבורים המסומנים)',
  ],
  markers: [
    { x: O - 64, y: OY + 18, label: 'החלק האמצעי' },
    { x: O + 254, y: OY + 18, label: 'קצה חופשי' },
    { x: O + 110, y: -14, label: 'צד ישיבה' },
  ],
};
