import { boxPair, evenly, FLANGE, makeStage, runX, runY, stageList, studAt, WEB, wallStudAt, type Draft } from './build';
import type { Member, ZoneModel } from './types';

// Right-side frame, pages 3–8 and 25 of the work plan (21.10).
// x = cm from the free edge (sink end), y = cm from the front face, z = cm above the floor.
export const LENGTH = 241.2;
export const DEPTH = 63.5;
export const FRONT_TOP = 87.5;
export const BACK_TOP = 116.2;
const BACK_Y = DEPTH - WEB;
const INNER_FRONT = WEB;
const INNER_BACK = BACK_Y - FLANGE;
const stage = makeStage('right', 'R');

const frontStuds: [number, number][] = [[0, 92.2], [82, 90.4], [97.5, 90.2], [113, 89.9], [135, 89.6], [237.2, 87.4]];
const backStuds: [number, number][] = [[0, 120.9], [41, 120], [82, 119.1], [97.5, 118.9], [118, 118.5], [141, 118.2], [226.5, 116.4], [237.2, 116.1]];
const behindGrillStuds: [number, number][] = [[163, 89.2], [183.75, 88.9], [204, 88.3]];
const widthWalls: [number, number][] = [[0, 92.2], [82, 90.4], [140, 89.5], [226.5, 87.7]];
const wallStudYs = [1, 2, 3].map((k) => INNER_FRONT + (53.5 * k) / 4 - FLANGE / 2);

const members: Member[] = [
  ...stage(1, [
    { kind: 'track', name: 'מסילה תחתונה – חזית', netLength: 241.2, box: runX(0, LENGTH, 0, 4), location: 'חזית, לכל האורך', sourcePage: 4 },
    { kind: 'track', name: 'מסילה תחתונה – גב', netLength: 241.2, box: runX(0, LENGTH, BACK_Y, 4), location: 'גב, לכל האורך', sourcePage: 4 },
    ...widthWalls.map(([x]): Draft => ({
      kind: 'track', name: `מסילת רוחב תחתונה ב-${x}`, netLength: 53.5, tabs: 2, tabKind: 'flat', box: runY(x, INNER_FRONT, 53.5, 4), location: `${x} מהקצה החופשי, בין החזית לגב`, sourcePage: 4,
    })),
  ]),
  ...stage(2, [
    ...frontStuds.map(([x, length]): Draft => ({ kind: 'stud', name: `ניצב חזית ב-${x}`, netLength: length, box: studAt(x, 0, 0, FRONT_TOP), location: `חזית, ${x} מהקצה החופשי, עד גובה 87.5`, sourcePage: 5 })),
    { kind: 'stud', name: 'עמוד פינה לנישה ב-141', netLength: 67, box: studAt(141, 0, 0, 65), location: 'חזית, 141, עד גובה 65', sourcePage: 5 },
    { kind: 'stud', name: 'עמוד פינה לנישה ב-226.5', netLength: 65.2, box: studAt(226.5, 0, 0, 65), location: 'חזית, 226.5, עד גובה 65', sourcePage: 5 },
    { kind: 'stud', name: 'ניצב קצר מעל הנישה ב-141', netLength: 22.4, box: studAt(141, 0, 65, FRONT_TOP), location: 'חזית, 141, מגובה 65 עד 87.5', sourcePage: 5 },
    { kind: 'stud', name: 'ניצב קצר מעל הנישה ב-226.5', netLength: 22.4, box: studAt(226.5, 0, 65, FRONT_TOP), location: 'חזית, 226.5, מגובה 65 עד 87.5', sourcePage: 5 },
    ...backStuds.map(([x, length]): Draft => ({ kind: 'stud', name: `ניצב גב ב-${x}`, netLength: length, box: studAt(x, BACK_Y, 0, BACK_TOP), location: `גב, ${x} מהקצה החופשי, עד גובה 116.2`, sourcePage: 5 })),
    ...behindGrillStuds.map(([x, length]): Draft => ({ kind: 'stud', name: `ניצב גב מאחורי המנגל ב-${x}`, netLength: length, box: studAt(x, BACK_Y, 0, FRONT_TOP), location: `גב, ${x}, עד גובה 87.5 (אין הגבהה מאחורי המנגל)`, sourcePage: 5 })),
    { kind: 'track', name: 'מסילה עליונה – חזית', netLength: 145, box: runX(0, 145, 0, FRONT_TOP), location: 'חזית, 0–145, גובה 87.5', sourcePage: 5 },
    { kind: 'track', name: 'מסילה עליונה – חזית, קצה', netLength: 14.7, box: runX(226.5, 14.7, 0, FRONT_TOP), location: 'חזית, 226.5–241.2, גובה 87.5 (המסילה נקטעת בנישה)', sourcePage: 5 },
    { kind: 'track', name: 'מסילה מתחת לנישת המנגל', netLength: 89.5, box: runX(141, 89.5, 0, 65), location: 'חזית, 141–230.5, גובה 65', sourcePage: 5 },
    { kind: 'track', name: 'מסילה עליונה – גב', netLength: 145, box: runX(0, 145, BACK_Y, BACK_TOP), location: 'גב, 0–145, גובה 116.2', sourcePage: 5 },
    { kind: 'track', name: 'מסילה עליונה – גב, קצה', netLength: 14.7, box: runX(226.5, 14.7, BACK_Y, BACK_TOP), location: 'גב, 226.5–241.2, גובה 116.2', sourcePage: 5 },
    { kind: 'track', name: 'מסילה עליונה מאחורי המנגל', netLength: 81.5, tabs: 2, tabKind: 'folded', box: runX(145, 81.5, BACK_Y, FRONT_TOP), location: 'גב, 145–226.5, גובה 87.5', sourcePage: 5,
      needsCheck: 'סוג הלשוניות (שטוחה או מקופלת) לא כתוב – לבדוק בעמוד 5.' },
  ]),
  ...stage(3, widthWalls.flatMap(([x, length]): Draft[] => [
    ...wallStudYs.map((y, k): Draft => ({ kind: 'stud', name: `ניצב בקיר הרוחב ב-${x} (${k + 1}/3)`, netLength: length, box: wallStudAt(x, y, FRONT_TOP), location: `קיר רוחב ב-${x}`, sourcePage: 6, approximate: true })),
    { kind: 'track', name: `מסילה עליונה לקיר הרוחב ב-${x}`, netLength: 53.5, tabs: 2, tabKind: 'flat', box: runY(x, INNER_FRONT, 53.5, FRONT_TOP), location: `קיר רוחב ב-${x}, גובה 87.5`, sourcePage: 6 },
  ])),
  ...stage(4, [
    { kind: 'header', name: 'משקוף דלת הכיור', netLength: 78, tabs: 2, tabKind: 'folded', box: runX(4, 78, 0, 71.25), location: 'חזית, 4–82, בגובה 67.25', sourcePage: 7 },
    { kind: 'sill', name: 'סף דלת הכיור', netLength: 78, tabs: 2, tabKind: 'folded', box: runX(4, 78, 0, 12.75), location: 'חזית, 4–82, בגובה 12.75', sourcePage: 7 },
    ...evenly(4, 78, 3).map((x, k): Draft => ({ kind: 'stud', name: `ניצב קצר מעל דלת הכיור (${k + 1}/3)`, netLength: 20.1, box: studAt(x, 0, 71.25, FRONT_TOP), location: 'חזית, בין המשקוף למסילה העליונה', sourcePage: 7, approximate: true })),
    { kind: 'stud', name: 'ניצב קצר מתחת לדלת הכיור', netLength: 16.6, box: studAt(41, 0, 0, 8.75), location: 'חזית, באמצע הפתח, מתחת לסף', sourcePage: 7, approximate: true },
    { kind: 'header', name: 'משקוף דלת הגז', netLength: 78, tabs: 2, tabKind: 'folded', box: runX(146.75, 78, 0, 51.25), location: 'חזית, 146.75–224.75, בגובה 47.25', sourcePage: 7 },
    { kind: 'sill', name: 'סף דלת הגז', netLength: 78, tabs: 2, tabKind: 'folded', box: runX(146.75, 78, 0, 12.75), location: 'חזית, 146.75–224.75, בגובה 12.75', sourcePage: 7 },
    ...evenly(146.75, 78, 3).map((x, k): Draft => ({ kind: 'stud', name: `ניצב קצר מעל דלת הגז (${k + 1}/3)`, netLength: 17.6, box: studAt(x, 0, 51.25, 65), location: 'חזית, בין המשקוף למסילה שמתחת לנישה', sourcePage: 7, approximate: true })),
    { kind: 'stud', name: 'ניצב קצר מתחת לדלת הגז', netLength: 14.2, box: studAt(183.75, 0, 0, 8.75), location: 'חזית, באמצע הפתח, מתחת לסף', sourcePage: 7, approximate: true },
  ]),
  ...stage(5, [
    // Cabinet floors
    { kind: 'girt', name: 'חגורת רצפת ארון הכיור – חזית', netLength: 77, box: runX(4.5, 77, INNER_FRONT, 12.75, FLANGE), location: 'ארון הכיור, בגובה הסף', sourcePage: 8, approximate: true },
    { kind: 'girt', name: 'חגורת רצפת ארון הכיור – גב', netLength: 77, box: runX(4.5, 77, INNER_BACK, 12.75, FLANGE), location: 'ארון הכיור, בגובה הסף', sourcePage: 8, approximate: true },
    ...evenly(4, 78, 4).map((x, k): Draft => ({ kind: 'beam', name: `קורת רצפת ארון הכיור (${k + 1}/4)`, netLength: 53.4, box: runY(x, INNER_FRONT, 53.4, 12.75), location: 'ארון הכיור, בגובה הסף', sourcePage: 8, approximate: true })),
    { kind: 'girt', name: 'חגורת רצפת ארון הגז – חזית', netLength: 81.5, box: runX(145, 81.5, INNER_FRONT, 12.75, FLANGE), location: 'ארון הגז, 145–226.5, בגובה הסף', sourcePage: 8, approximate: true },
    { kind: 'girt', name: 'חגורת רצפת ארון הגז – גב', netLength: 81.5, box: runX(145, 81.5, INNER_BACK, 12.75, FLANGE), location: 'ארון הגז, 145–226.5, בגובה הסף', sourcePage: 8, approximate: true },
    ...evenly(145, 81.5, 4).map((x, k): Draft => ({ kind: 'beam', name: `קורת רצפת ארון הגז (${k + 1}/4)`, netLength: 53.4, box: runY(x, INNER_FRONT, 53.4, 12.75), location: 'ארון הגז, בגובה הסף', sourcePage: 8, approximate: true })),
    // Grill niche floor at 65
    { kind: 'girt', name: 'חגורת רצפת הנישה – חזית', netLength: 81.5, box: runX(145, 81.5, INNER_FRONT, 65, FLANGE), location: 'נישת המנגל, 145–226.5, גובה 65', sourcePage: 8, approximate: true },
    { kind: 'girt', name: 'חגורת רצפת הנישה – גב', netLength: 81.5, box: runX(145, 81.5, INNER_BACK, 65, FLANGE), location: 'נישת המנגל, 145–226.5, גובה 65', sourcePage: 8, approximate: true,
      needsCheck: 'בשרטוט מופיעות כמה חגורות 81.5 בגבהים שונים – לוודא את הכמות בעמודים 3 ו-8.' },
    ...[145, 170.5, 196, 221.5].flatMap((x) => boxPair({ name: `קורת קופסה ברצפת הנישה ב-${x}`, netLength: 53.4, box: runY(x, INNER_FRONT, 53.4, 65), location: `נישת המנגל, ${x}, גובה 65`, sourcePage: 25 })),
    // Countertop frame
    ...[13.5, 67.5, 97, 134.5].map((x): Draft => ({ kind: 'beam', name: `קורת מסגרת השיש ב-${x}`, netLength: 53.4, box: runY(x, INNER_FRONT, 53.4, FRONT_TOP), location: `מתחת לשיש, ${x}`, sourcePage: 8 })),
    { kind: 'header', name: 'משקוף פתח הכיור בשיש', netLength: 49, box: runX(18.5, 49, 44, FRONT_TOP, FLANGE), location: 'מסגרת השיש, 18.5–67.5, בגב פתח הכיור', sourcePage: 8, approximate: true },
    { kind: 'girt', name: 'חגורת מסגרת השיש – גב, אזור הכיור', netLength: 77, box: runX(4.5, 77, INNER_BACK, FRONT_TOP, FLANGE), location: 'מסגרת השיש, גב', sourcePage: 8, approximate: true },
    { kind: 'girt', name: 'חגורת מסגרת השיש – גב, אזור הכיריים', netLength: 53, box: runX(86, 53, INNER_BACK, FRONT_TOP, FLANGE), location: 'מסגרת השיש, 86–139, גב', sourcePage: 8, approximate: true },
    { kind: 'girt', name: 'חגורת מסגרת השיש מעל המנגל – חזית', netLength: 81.5, box: runX(145, 81.5, INNER_FRONT, FRONT_TOP, FLANGE), location: 'מסגרת השיש, 145–226.5, חזית', sourcePage: 3, approximate: true },
    { kind: 'girt', name: 'חגורת מסגרת השיש מעל המנגל – גב', netLength: 81.5, box: runX(145, 81.5, INNER_BACK, FRONT_TOP, FLANGE), location: 'מסגרת השיש, 145–226.5, גב', sourcePage: 3, approximate: true },
    ...([[13.5, 4.5], [14.5, 101.5], [15, 86], [5.5, 135]] as const).map(([length, x]): Draft => ({ kind: 'girt', name: `חגורה קצרה במסגרת השיש ${length}`, netLength: length, box: runX(x, length, INNER_FRONT, FRONT_TOP, FLANGE), location: 'מסגרת השיש, חזית', sourcePage: 8, approximate: true,
      needsCheck: 'המיקום של החגורות הקצרות לא ברור מהשרטוט – לבדוק בעמוד 8 לפני החיתוך.' })),
    // Blocking for the raised drywall, between the back studs
    ...([[4, 37, 41], [45, 37, 41], [86, 11.5, 15.5], [101.5, 16.5, 20.5], [122, 19, 23], [230.5, 6.7, 10.7]] as const).map(([x, length, cut]): Draft => ({
      kind: 'blocking', name: `חוסם לגבס ההגבהה ${length}`, netLength: length, statedCut: cut, box: { x, y: BACK_Y, z: 87.5, dx: length, dy: WEB, dz: 5 }, location: `גב, ${x}–${Number((x + length).toFixed(2))}, גובה 87.5–92.5`, sourcePage: 8,
    })),
  ]),
];

const stages = stageList('right', [
  { number: 1, title: 'מסילות תחתונות', sourcePage: 4, notes: [
    '2 מסילות 241.2 (חזית וגב), עם חיתוכי כנף כל 60 ס״מ כדי להתאים לשיפוע הרצפה.',
    '4 מסילות רוחב 53.5 ב-0, 82, 140, 226.5, עם לשונית שטוחה 4.8 בכל צד (חיתוך 63.1).',
  ] },
  { number: 2, title: 'ניצבים בחזית ובגב + מסילות עליונות', sourcePage: 5, notes: [
    'חזית עד גובה 87.5: ניצבים ב-0, 82, 97.5, 113, 135, 237.2.',
    'נישת המנגל: עמודי פינה עד 65 ב-141 ו-226.5, ומעליהם ניצבים קצרים 22.4.',
    'גב עד 116.2: ניצבים ב-0, 41, 82, 97.5, 118, 141, 226.5, 237.2. מאחורי המנגל רק עד 87.5: ב-163, 183.75, 204.',
    'מסילה עליונה בחזית 145 + 14.7 (נקטעת בנישה), ומתחת לנישה מסילה 89.5 בגובה 65.',
    'מסילה עליונה בגב 145 + 14.7 בגובה 116.2, ומאחורי המנגל 81.5 בגובה 87.5.',
    'הרצפה יורדת עד 4.8 ס״מ לכיוון הקצה החופשי, ולכן לכל ניצב אורך אחר. האורכים כאן לפי התכנית – למדוד כל ניצב במקום.',
    'בטקסט של עמוד 5 מופיעים גם המספרים 142.75 ו-224.75 ("משקופי הגריל"), שלא מסומנים בשרטוט. לבדוק בעמוד 5.',
  ] },
  { number: 3, title: 'קירות רוחב', sourcePage: 6, notes: [
    '4 קירות רוחב. בכל קיר 3 ניצבים ומסילה עליונה 53.5 עם לשוניות.',
    'חיבורי קירות הרוחב – ברגים כפולים.',
  ] },
  { number: 4, title: 'פתחי הדלתות', sourcePage: 7, notes: [
    'דלת הכיור: 4–82 (רוחב 78), בגובה 12.75–67.25.',
    'דלת הגז והמנגל: 146.75–224.75 (רוחב 78), בגובה 12.75–47.25.',
    'משקוף וסף 78 עם לשוניות, וניצבים קצרים באמצע.',
    'ניצבי הצד של הפתחים – ברגים כפולים.',
  ] },
  { number: 5, title: 'חגורות, קורות וחסימות', sourcePage: 8, notes: [
    'רצפת הארונות: חגורות 81.5 (גז) ו-77 (כיור), וקורות 53.4.',
    'מסגרת השיש: קורות 53.4 ב-13.5, 67.5, 97, 134.5, ומשקוף 49.',
    'משטח המנגל בגובה 65: 4 קורות קופסה 53.4 (כל אחת מסילה + ניצב) ב-145, 170.5, 196, 221.5. לא לשים קורה בין 150 ל-170, כי שם עובר חור הגז.',
    'חיתוכים בשיש: כיור 18.5–67.5, כיריים 102–134.5, גריל 148–223.5.',
    'חסימות לגבס ההגבהה בגובה 87.5–92.5, בין ניצבי הגב.',
  ] },
  { number: 6, title: 'המנגל והגז', sourcePage: 25, notes: [
    'המנגל Napoleon BILEX485: נישה נטו 76.5 (לפחות 75.5), גובה 22.5 (לפחות 19), עומק כ-56 (לפחות 54.5).',
    'חור גז Ø5 ברצפת הנישה: בערך 158 מהקצה החופשי ו-11 מהגב, בין הקורות שב-145 וב-170.5. לסמן את המיקום המדויק כשהמנגל מונח, לפי פתח הכניסה בתחתית שלו.',
    'קודחים בגבס ובאריח של רצפת הנישה, ומכניסים גומיית מעבר.',
    'אוורור: דלת שירות בגב התא (145–226.5) עם תריסים מגובה 3 עד 62, לפחות 65 סמ״ר בכל קצה. תא הגז לא פתוח לחלל המקרר.',
    'חשמל: שקע מוגן לרוטיסרי בהגבהה הסמוכה לנישה, בצד המנוע (ב-141 או ב-226.5). מאחורי הנישה אין הגבהה.',
    'מסגרת הקישוט של המנגל עולה 4 ס״מ על השיש מכל צד, אז שפת הפתח לא צריכה גימור מושלם.',
  ] },
]);

export const rightSide: ZoneModel = {
  id: 'right',
  label: 'צד ימין',
  summary: 'כיור וכיריים בצד הקצה החופשי, נישת מנגל ליד החלק האמצעי',
  markers: [
    { x: -8, y: -12, label: '0 · קצה חופשי (כיור)' },
    { x: LENGTH / 2, y: -22, label: 'חזית' },
    { x: LENGTH + 8, y: DEPTH / 2, label: 'לחלק האמצעי ←' },
  ],
  members,
  stages,
  generalNotes: [
    'כל המספרים הם אורך נטו בס״מ, בלי לשוניות. לשונית מוסיפה לאורך החיתוך 4.8 (שטוחה) או 5 (מקופלת) בכל קצה.',
    'נקודת האפס: הקצה החופשי, בצד הכיור.',
    'שלד באורך 241.2 (שיש 240) ובעומק 63.5. החזית בגובה 87.5, וההגבהה בגב בגובה 116.2 לכל האורך חוץ מאחורי המנגל.',
    'ברגים כפולים חובה: קופסאות, ניצבי צד של פתחים, קורות, לשוניות, חיבורי קירות רוחב, פינות וקצוות.',
    'קופסה = מסילה עם ניצב בתוכה (עמוד 16). הניצב נחתך בדיוק לאורך הנטו, והמסילה נחתכת עם לשונית 4.8 בכל קצה.',
  ],
  extraItems: [
    'מנגל Napoleon BILEX485',
    'דלת לפתח הכיור (פתח 78 × 54.5)',
    'דלת לפתח הגז (פתח 78 × 34.5)',
    'דלת שירות עם תריסים לגב תא הגז (145–226.5)',
    'גומיית מעבר לצינור הגז (חור Ø5)',
    'שקע חשמל מוגן לרוטיסרי',
    'פס לד LG-929 בשפת השיש, עם פרופיל ופריימר (עמוד 18)',
    'ברגים לפח (כפולים בכל החיבורים המסומנים)',
    'גבס ואריחים לחיפוי – הכמויות לא מפורטות בתכנית',
  ],
};
