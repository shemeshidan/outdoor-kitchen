import { boxPair, FLANGE, makeStage, runX, runY, stageList, studAt, WEB, wallStudAt, type Draft } from './build';
import type { Member, ZoneModel } from './types';

// Centre section, pages 9–18 of the work plan (21.10).
// x = cm from the end that meets the right side, y = cm from the front face, z = cm above the floor.
export const CENTER_LENGTH = 365;
const DEPTH = 63.5;
const FRONT_TOP = 87.5;
const BACK_TOP = 116.2;
const BACK_Y = DEPTH - WEB;
const INNER_FRONT = WEB;
const INNER_BACK = BACK_Y - FLANGE;
/** Second (shelf) wall stands 84–89 from the front, clear of the concrete. */
const SHELF_Y = 84;
const stage = makeStage('center', 'C');

const frontStuds = [31.5, 59.5, 79.5, 99.5, 155.5, 182.5, 231.5, 265.5, 299.5, 331.5];
const backStuds = [0, 59.5, 99.5, 155.5, 182.5, 231.5, 265.5, 299.5, 330.5, 361];
const widthRails = [0, 98.5, 155.5, 181.5, 231.5, 299.5];
const lowWalls = [330.5, 299.5, 231.5, 181.5, 155.5, 98.5];
const wallStudYs = [1, 2, 3].map((k) => INNER_FRONT + (53.5 * k) / 4 - FLANGE / 2);
const shelfStuds = [0, 47, 94.5, 117.5, 181, 245, 309, 332.5, 360];
// Blocking for the raised drywall, listed from the right-side end (page 14).
const blockingLengths = [31.5, 36, 44, 30, 34, 31, 26.5, 30.5, 38, 38, 35, 34.5];

const blockingDrafts = (): Draft[] => {
  // The listed lengths add up to more than the run (409 vs 365), so they are spread evenly for display only.
  const step = (CENTER_LENGTH - Math.max(...blockingLengths)) / (blockingLengths.length - 1);
  return blockingLengths.map((length, index) => {
    const x = Number((index * step).toFixed(2));
    return {
      kind: 'blocking', name: `חוסם לגבס ההגבהה ${index + 1} (${length})`, netLength: length, box: { x, y: BACK_Y, z: 87.5, dx: length, dy: WEB, dz: 5 },
      location: 'גב, בגובה 87.5–92.5, בין ניצבי הגב', sourcePage: 14, approximate: true,
      needsCheck: index === 0 ? 'סכום 12 החסימות בעמוד 14 הוא 409 ס״מ, יותר מאורך החלק (365). המיקום בתצוגה משוער – למדוד כל רווח בין ניצבים במקום לפני החיתוך.' : undefined,
    } satisfies Draft;
  });
};

const members: Member[] = [
  ...stage(1, [
    { kind: 'track', name: 'מסילה תחתונה – חזית, צד ימין', netLength: 103.5, box: runX(0, 103.5, 0, 4), location: 'חזית, 0–103.5', sourcePage: 10 },
    { kind: 'track', name: 'מסילה תחתונה – חזית, צד האי', netLength: 175, tabs: 1, tabKind: 'flat', box: runX(155.5, 175, 0, 4), location: 'חזית, 155.5–330.5. לשונית על המסילה 270.5 של האי (חיתוך 179.8)', sourcePage: 10 },
    { kind: 'track', name: 'מסילה תחתונה – גב, צד ימין', netLength: 67.5, box: runX(0, 67.5, BACK_Y, 4), location: 'גב, 0–67.5', sourcePage: 10 },
    { kind: 'track', name: 'מסילה תחתונה – גב', netLength: 297.5, box: runX(67.5, 297.5, BACK_Y, 4), location: 'גב, 67.5–365', sourcePage: 10 },
    ...widthRails.map((x): Draft => ({ kind: 'track', name: `מסילת רוחב תחתונה ב-${x}`, netLength: 53.5, tabs: 2, tabKind: 'flat', box: runY(x, INNER_FRONT, 53.5, 4), location: `${x} מהקצה של צד ימין`, sourcePage: 10 })),
  ]),
  ...stage(2, [
    { kind: 'stud', name: 'ניצב פינה ב-0 (צמוד לסוף צד ימין)', netLength: 116.1, box: studAt(0, 0, 0, BACK_TOP), location: 'חזית, 0, עד 116.2. מוברג לצד ימין כל 25–30', sourcePage: 11 },
    ...frontStuds.map((x): Draft => ({ kind: 'stud', name: `ניצב חזית ב-${x}`, netLength: 87.4, box: studAt(x, 0, 0, FRONT_TOP), location: `חזית, ${x}, עד 87.5`, sourcePage: 11 })),
    ...backStuds.map((x): Draft => ({ kind: 'stud', name: `ניצב גב ב-${x}`, netLength: 115.2, box: studAt(x, BACK_Y, 0, BACK_TOP), location: `גב, ${x}, עד 116.2`, sourcePage: 11 })),
    { kind: 'track', name: 'מסילה עליונה – חזית, צד ימין', netLength: 63.5, tabs: 1, tabKind: 'flat', box: runX(0, 63.5, 0, FRONT_TOP), location: 'חזית, 0–63.5, גובה 87.5', sourcePage: 11,
      needsCheck: 'בשרטוט יש לשונית אחת מול ניצב הפינה. הסוג (שטוחה או מקופלת) לא כתוב – לבדוק בעמוד 11.' },
    { kind: 'track', name: 'מסילה עליונה – חזית', netLength: 268, box: runX(63.5, 268, 0, FRONT_TOP), location: 'חזית, 63.5–331.5, גובה 87.5 (עוברת מעל פתח המקרר)', sourcePage: 11 },
    { kind: 'track', name: 'מסילה עליונה – גב, צד ימין', netLength: 65, box: runX(0, 65, BACK_Y, BACK_TOP), location: 'גב, 0–65, גובה 116.2', sourcePage: 11 },
    { kind: 'track', name: 'מסילה עליונה – גב', netLength: 300, box: runX(65, 300, BACK_Y, BACK_TOP), location: 'גב, 65–365, גובה 116.2', sourcePage: 11 },
    { kind: 'track', name: 'שרוול חיבור למסילה העליונה בגב', netLength: 20, box: { x: 55, y: BACK_Y + 0.6, z: 112.6, dx: 20, dy: 3.8, dz: 3.2 }, location: 'גב, על החיבור בין 65 ל-300', sourcePage: 11, approximate: true },
  ]),
  ...stage(3, [
    ...lowWalls.flatMap((x): Draft[] => [
      ...[87.3, 87, 86.6].map((length, k): Draft => ({ kind: 'stud', name: `ניצב בקיר הרוחב ב-${x} (${k + 1}/3)`, netLength: length, box: wallStudAt(x, wallStudYs[k]!, FRONT_TOP), location: `קיר רוחב ב-${x}`, sourcePage: 12, approximate: true })),
      { kind: 'track', name: `מסילה עליונה לקיר הרוחב ב-${x}`, netLength: 53.5, tabs: 2, tabKind: 'flat', box: runY(x, INNER_FRONT, 53.5, FRONT_TOP), location: `קיר רוחב ב-${x}, גובה 87.5`, sourcePage: 12 },
    ]),
    ...[116, 115.6, 115.3].map((length, k): Draft => ({ kind: 'stud', name: `ניצב בקיר הרוחב הגבוה ב-0 (${k + 1}/3)`, netLength: length, box: wallStudAt(0, wallStudYs[k]!, BACK_TOP), location: 'קיר הרוחב בקצה של צד ימין, עד 116.2', sourcePage: 12, approximate: true })),
    { kind: 'track', name: 'מסילה עליונה לקיר הרוחב הגבוה ב-0', netLength: 58.5, box: runY(0, 2.5, 58.5, BACK_TOP), location: 'קיר רוחב ב-0, גובה 116.2', sourcePage: 12 },
  ]),
  ...stage(4, [
    ...boxPair({ name: 'קופסה מעל פתח המקרר', netLength: 52, box: runX(103.5, 52, INNER_FRONT, FRONT_TOP, FLANGE), location: 'חזית, 103.5–155.5, מעל פתח המקרר (גובה 84)', sourcePage: 13,
      needsCheck: 'בעמוד 14 כתוב "חגורות 52 מלפנים ומאחור", ובשרטוט החזית מעל המקרר היא קופסה. כאן נספרה רק הקופסה – לבדוק.' }),
    { kind: 'header', name: 'משקוף פתח המגירות', netLength: 45, tabs: 2, tabKind: 'folded', box: runX(186.5, 45, 0, 76.75), location: 'חזית, 186.5–231.5, בגובה 72.75', sourcePage: 13 },
    { kind: 'sill', name: 'סף פתח המגירות', netLength: 45, tabs: 2, tabKind: 'folded', box: runX(186.5, 45, 0, 12.75), location: 'חזית, 186.5–231.5, בגובה 12.75', sourcePage: 13 },
    { kind: 'stud', name: 'ניצב קצר מעל המגירות', netLength: 14.7, box: studAt(207, 0, 76.75, FRONT_TOP), location: 'חזית, באמצע הפתח, מעל המשקוף', sourcePage: 13, approximate: true },
    { kind: 'stud', name: 'ניצב קצר מתחת למגירות', netLength: 9.2, box: studAt(207, 0, 0, 8.75), location: 'חזית, באמצע הפתח, מתחת לסף', sourcePage: 13, approximate: true },
  ]),
  ...stage(5, [
    ...([[5, 93.5, 101.5], [186.5, 45, 53], [236.5, 63, 71]] as const).flatMap(([x, length, cut]): Draft[] => [
      { kind: 'girt', name: `חגורת מסגרת השיש ${length} – חזית`, netLength: length, statedCut: cut, box: runX(x, length, INNER_FRONT, FRONT_TOP, FLANGE), location: `חזית, ${x}–${x + length}, מתחת לשיש. לשוניות לקירות הרוחב, 2 ברגים בכל לשונית`, sourcePage: 14 },
      { kind: 'girt', name: `חגורת מסגרת השיש ${length} – גב`, netLength: length, statedCut: cut, box: runX(x, length, INNER_BACK, FRONT_TOP, FLANGE), location: `גב, ${x}–${x + length}, מתחת לשיש. לשוניות לקירות הרוחב, 2 ברגים בכל לשונית`, sourcePage: 14 },
    ]),
    { kind: 'girt', name: 'חגורת מסגרת השיש 52 – גב (מעל המקרר)', netLength: 52, statedCut: 60, box: runX(103.5, 52, INNER_BACK, FRONT_TOP, FLANGE), location: 'גב, 103.5–155.5, מתחת לשיש', sourcePage: 14 },
    ...[35.5, 65.5, 124.5, 206.5, 265.5].map((x): Draft => ({ kind: 'beam', name: `קורת מסגרת השיש ב-${x}`, netLength: 53.4, box: runY(x, INNER_FRONT, 53.4, FRONT_TOP), location: `מתחת לשיש, ${x}`, sourcePage: 14 })),
    ...[27.5, 125.5, 205].flatMap((x) => boxPair({ name: `קופסה עומדת בגב ב-${x}`, netLength: 33.6, box: { x, y: BACK_Y, z: 82.6, dx: FLANGE, dy: WEB, dz: 33.6 }, location: `גב, ${x}, בתוך ההגבהה`, sourcePage: 14 })),
    ...blockingDrafts(),
    // Drawer frame at 12.75
    ...[186.5, 226.5].map((x): Draft => ({ kind: 'girt', name: `חגורת מסגרת המגירות ב-${x}`, netLength: 53.5, box: runY(x, INNER_FRONT, 53.5, 12.75), location: 'מסגרת המגירות, בגובה 12.75', sourcePage: 14, approximate: true })),
    { kind: 'beam', name: 'קורת מסגרת המגירות 45', netLength: 45, statedCut: 55, box: runX(186.5, 45, 28, 12.75, FLANGE), location: 'מסגרת המגירות, בגובה 12.75', sourcePage: 14, approximate: true,
      needsCheck: 'המבנה המדויק של מסגרת המגירות לא ברור מהשרטוט – לבדוק בעמוד 14 ומול יחידת המגירות.' },
    { kind: 'beam', name: 'קורת מסגרת המגירות 38', netLength: 38, statedCut: 48, box: runX(190, 38, 46, 12.75, FLANGE), location: 'מסגרת המגירות, בגובה 12.75', sourcePage: 14, approximate: true },
  ]),
  ...stage(6, [
    ...([[0, 98.5], [117.5, 195.5], [332.5, 32.5]] as const).flatMap(([x, length]): Draft[] => [
      { kind: 'track', name: `מסילה תחתונה לקיר השני ${length}`, netLength: length, box: runX(x, length, SHELF_Y, 4), location: `קיר שני (84–89 מהחזית), ${x}–${x + length}`, sourcePage: 15 },
      { kind: 'track', name: `מסילה עליונה לקיר השני ${length}`, netLength: length, box: runX(x, length, SHELF_Y, BACK_TOP), location: `קיר שני, ${x}–${x + length}, גובה 116.2`, sourcePage: 15 },
      { kind: 'girt', name: `חגורת ראש לקיר השני ${length - (length > 100 ? 8 : 4)}`, netLength: length - (length > 100 ? 8 : 4), box: runX(x + (length > 100 ? 4 : 2), length - (length > 100 ? 8 : 4), SHELF_Y - FLANGE, BACK_TOP - 1, FLANGE, 5), location: `קיר שני, גובה 111.2–116.2`, sourcePage: 15, approximate: true },
    ]),
    ...shelfStuds.map((x): Draft => ({ kind: 'stud', name: `ניצב בקיר השני ב-${x}`, netLength: 115.2, box: studAt(x, SHELF_Y, 0, BACK_TOP), location: `קיר שני, ${x}`, sourcePage: 15,
      needsCheck: x === 0 ? 'אורך ניצבי הקיר השני לא כתוב בטקסט – 115.2 לפי השרטוט בעמוד 15. למדוד במקום.' : undefined })),
    ...shelfStuds.map((x): Draft => ({ kind: 'beam', name: `ניצב שוכב (גשר) ב-${x}`, netLength: 20.5, box: runY(x, DEPTH, 20.5, BACK_TOP - 2), location: `בין הגב לקיר השני, ${x}. מדידה עד הפנל פחות 5`, sourcePage: 15, approximate: true })),
    ...boxPair({ name: 'קופסת גשר לפני עמוד הגדר הראשון', netLength: 19.5, box: runY(102, DEPTH + 0.5, 19.5, BACK_TOP - 2), location: 'בין הגב לקיר השני, לפני עמוד הגדר', sourcePage: 15, approximate: true }),
    ...boxPair({ name: 'קופסת גשר לפני עמוד הגדר השני', netLength: 19, box: runY(318, DEPTH + 0.5, 19, BACK_TOP - 2), location: 'בין הגב לקיר השני, לפני עמוד הגדר', sourcePage: 15, approximate: true }),
  ]),
  ...stage(7, [
    ...[6, 28, 50].flatMap((y, k) => boxPair({ name: `קופסה 26 בקצה הישיבה (${k + 1}/3)`, netLength: 26, box: runX(335.5, 26, y, FRONT_TOP, FLANGE), location: 'בין קיר הרוחב 330.5 לקופסת השפה, גובה 87.5', sourcePage: 16, approximate: true }, 35.6)),
    ...boxPair({ name: 'קופסת שפה 58.5', netLength: 58.5, box: runY(360, 0, 58.5, FRONT_TOP), location: 'קצה החלק האמצעי מעל הרגליים. לשונית לניצב הגב 361; בחזית ממשיכה את ההיקף של האי', sourcePage: 16 }),
  ]),
];

const stages = stageList('center', [
  { number: 1, title: 'מסילות תחתונות', sourcePage: 10, notes: [
    'חזית: 103.5 (0–103.5) ו-175 (155.5–330.5). בין 103.5 ל-155.5 פתח המקרר, ולכן אין שם מסילה.',
    'ל-175 יש לשונית מקופלת על המסילה 270.5 של האי (חיתוך 179.8). היא נגמרת ב-330.5, ולא 180 כמו בגרסה הקודמת.',
    'גב: 67.5 + 297.5.',
    '6 מסילות רוחב 53.5 ב-0, 98.5, 155.5, 181.5, 231.5, 299.5, עם לשונית שטוחה 4.8 בשני הקצוות (חיתוך 63.1).',
    'ב-330.5 אין מסילת רוחב – עוברת שם המסילה הרציפה 270.5 של האי.',
  ] },
  { number: 2, title: 'ניצבים בחזית ובגב + מסילות עליונות', sourcePage: 11, notes: [
    'חזית (87.4): 31.5, 59.5, 79.5, 99.5, 155.5, 182.5, 231.5, 265.5, 299.5, 331.5. ב-0 ניצב פינה עד 116.2.',
    'גב (115.2): 0, 59.5, 99.5, 155.5, 182.5, 231.5, 265.5, 299.5, 330.5, 361.',
    'מסילה עליונה בחזית בגובה 87.5: 63.5 + 268. בגב בגובה 116.2: 65 + 300, עם שרוול 20 על החיבור.',
    'חיבור לצד ימין: ניצב הפינה צמוד לסוף צד ימין (241.2), ומוברג כל 25–30 ס״מ.',
  ] },
  { number: 3, title: 'קירות רוחב', sourcePage: 12, notes: [
    'בכל קיר 3 ניצבים ומסילה עליונה 53.5.',
    'הקיר ב-0 (בקצה של צד ימין) גבוה, עד 116.2, עם מסילה עליונה 58.5.',
    'הקיר ב-330.5 עומד על המסילה הרציפה של האי.',
  ] },
  { number: 4, title: 'פתחים: מקרר ומגירות', sourcePage: 13, notes: [
    'מקרר: 103.5–155.5 (פתח 84 × 52), וקופסה 52 מעליו. המקרר 83.3 × 47.2 × 43.7 – לוודא את הגובה בפועל.',
    'מגירות: 186.5–231.5, משקוף וסף 45 בגבהים 12.75 ו-72.75.',
  ] },
  { number: 5, title: 'חגורות, קורות, חסימות ומסגרת המגירות', sourcePage: 14, notes: [
    'חגורות רק ב-4 מפתחים, מלפנים ומאחור: 93.5, 52, 45, 63. החיתוך ארוך ב-8 (לשוניות לקירות הרוחב, 2 ברגים בכל לשונית).',
    'קורות 53.4 ב-35.5, 65.5, 124.5, 206.5, 265.5.',
    'קופסאות 33.6 בגב ב-27.5, 125.5, 205.',
    'חסימות לגבס ההגבהה בגובה 87.5–92.5: 31.5, 36, 44, 30, 34, 31, 26.5, 30.5, 38, 38, 35, 34.5.',
    'הפרש בין גובה השלד להגבהה: בחזית 28.7 במקום 30. אם יוצא פחות – חותכים את הפס החזיתי למעלה.',
    'מסגרת המגירות בגובה 12.75.',
  ] },
  { number: 6, title: 'מדף על תשתית כפולה', sourcePage: 15, notes: [
    'קיר ניצבים שני 84–89 מהחזית, לא נוגע בבטון. ניצבים ב-0, 47, 94.5, 117.5, 181, 245, 309, 332.5, 361.',
    'מסילות הקיר השני: 98.5, 195.5, 32.5 (רווחים לעמודי הגדר). חגורות ראש בגובה 111.2–116.2.',
    'ניצבים שוכבים 20.5 מהגב לקיר השני (למדוד עד הפנל, פחות 5). קופסאות גשר 19.5 ו-19 לפני עמודי הגדר.',
    'המדף: גבס כפול ואריח בגובה 119.8. סגירה מאחור בפרופיל פח מודבק MS.',
    'יציאת אוויר חם של המקרר: תריס כ-20 × 10 בדופן הקצה (צד הישיבה), גבוה, 100–112, מתחת למדף.',
  ] },
  { number: 7, title: 'קופסאות 26 בקצה הישיבה', sourcePage: 16, notes: [
    'כל קופסה = מסילה + ניצב בתוכה. את המסילה חותכים 26 + 4.8 + 4.8 = 35.6.',
    'בשני הקצוות חותכים את שתי הכנפיים 4.8 ומכופפים את הגב ב-90° ללשונית.',
    'לשונית אחת נצמדת לכנף של המסילה העליונה של קיר הרוחב 330.5, והשנייה לקופסת השפה 58.5 מבפנים – 2 ברגים בכל אחת.',
    'הניצב שבתוך הקופסה נחתך 26 בדיוק, ומוברג למסילה שלו מלמעלה ומלמטה כל 15–20.',
    'קופסת השפה: בקצה האחורי לשונית לניצב הגב 361. בקצה הקדמי היא ממשיכה את ההיקף 241.5 של האי – פס פח מחורר 30 על החיבור.',
  ] },
  { number: 8, title: 'גבס בחזית ושקעים', sourcePage: 17, notes: [
    'גבס בחזית ב-2 לוחות לרוחב: א׳ 103.5 × 87.5 (0–103.5), ב׳ 180 × 87.5 (155.5–335.5) עם חיתוך מגירות 45 × 60. כל קצה לוח על ניצב.',
    'ברגים כל 25 לאורך כל ניצב, 1 ס״מ מקצה הלוח.',
    'שקעים בהגבהה: זוג 1 במרכז 15.75, זוג 2 במרכז 317, בגובה 104.8 – באמצע פס ה-30, רחוק מהחסימה ומהחגורה.',
    'הצינור עולה בחלל הקיר האחורי בין הניצבים. בחסימה קודחים חור 25 מ״מ.',
    'לפני חיתוך מסמנים את מרכז הקופסה לפי מדידה מהפינה של צד ימין ובודקים שאין ניצב מאחור.',
    'את החיבור החשמלי והשקעים מתקין חשמלאי – שקעים מוגנים מים לחוץ (IP44 לפחות) וממסר פחת.',
  ] },
  { number: 9, title: 'פס לד בשפת השיש', sourcePage: 18, notes: [
    'פס לד LG-929 בקו תחתית הקנט (בצד ימין ובחלק האמצעי).',
    'סדר: גבס חזית ← חריץ 16 מ״מ גובה, 9–10 עומק ← הפרופיל (כנף עליונה על הגבס) ← הרצועה מוברגת מעל הכנף ← קנט 5.',
    'כנף תחתונה: פריימר מקשר, סרט רשת 5 ס״מ על הגבס, ושליכט גמיש לחוץ בשתי שכבות.',
    'פס חם 2700–3000K, IP65, מפזר חלבי. בפינות: 45° (או סיום בפקק לפני הפינה). כבל לספק לפני הגבס.',
  ] },
]);

export const center: ZoneModel = {
  id: 'center',
  label: 'מרכז',
  summary: 'מקרר ומגירות, הגבהה עם מדף, ומחובר לצד ימין ולאי',
  members,
  stages,
  generalNotes: [
    'כל המספרים הם אורך נטו בס״מ, בלי לשוניות. לשונית מוסיפה לאורך החיתוך 4.8 (שטוחה) או 5 (מקופלת) בכל קצה.',
    'נקודת האפס: הקצה שצמוד לצד ימין.',
    'שלד באורך 365 ובעומק 63.5. חזית בגובה 87.5, הגבהה בגב בגובה 116.2, ומאחוריה קיר שני למדף.',
    'קופסה = מסילה עם ניצב בתוכה. המסילה נחתכת עם לשונית 4.8 בכל קצה, והניצב בדיוק לאורך הנטו.',
    'ברגים כפולים חובה: קופסאות, ניצבי צד של פתחים, קורות, לשוניות, חיבורי קירות רוחב, פינות וקצוות.',
  ],
  extraItems: [
    'מקרר (83.3 × 47.2 × 43.7) – לוודא גובה',
    'יחידת מגירות לפתח 45 × 60',
    'לוחות גבס 120 × 260 לחזית (שני חלקים: 103.5 × 87.5 ו-180 × 87.5)',
    'גבס כפול ואריח למדף בגובה 119.8',
    'פרופיל פח מודבק MS לסגירת המדף מאחור',
    'תריס כ-20 × 10 ליציאת האוויר החם של המקרר',
    '2 זוגות שקעים מוגנים מים (IP44), קופסאות וצינור – באחריות חשמלאי',
    'פס לד LG-929, פרופיל, פריימר, סרט רשת ושליכט גמיש (עמוד 18)',
    'פס פח מחורר 30 לחיבור קופסת השפה',
    'ברגים לפח (כפולים בכל החיבורים המסומנים)',
  ],
  markers: [
    { x: -10, y: -10, label: '0 · צד ימין' },
    { x: CENTER_LENGTH / 2, y: -22, label: 'חזית' },
    { x: CENTER_LENGTH + 10, y: -10, label: 'האי ←' },
    { x: CENTER_LENGTH / 2, y: 100, label: 'גדר / קיר קיים' },
  ],
};

