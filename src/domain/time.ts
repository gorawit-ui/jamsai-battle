/**
 * เวลาอ้างอิงทั้งหมดเป็น Asia/Bangkok (UTC+7 ไม่มี daylight saving) ตัดวันตอนเที่ยงคืน
 * วันที่ใช้รูปแบบ "YYYY-MM-DD" ตามเวลาไทยทั้งระบบ
 */
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type DateKey = string;

export function bangkokDateKey(now: Date): DateKey {
  return new Date(now.getTime() + BANGKOK_OFFSET_MS).toISOString().slice(0, 10);
}

function keyToUtcMs(key: DateKey): number {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** 0 = อาทิตย์ … 6 = เสาร์ */
export function weekdayOf(key: DateKey): number {
  return new Date(keyToUtcMs(key)).getUTCDay();
}

export function isWeekend(key: DateKey): boolean {
  const d = weekdayOf(key);
  return d === 0 || d === 6;
}

export function addDays(key: DateKey, days: number): DateKey {
  return new Date(keyToUtcMs(key) + days * DAY_MS).toISOString().slice(0, 10);
}

/** จันทร์–ศุกร์ของสัปดาห์ที่ key อยู่ */
export function workweekOf(key: DateKey): DateKey[] {
  const monday = addDays(key, -((weekdayOf(key) + 6) % 7));
  return [0, 1, 2, 3, 4].map((i) => addDays(monday, i));
}

const TH_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const TH_WEEKDAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

/** "9 พ.ย." */
export function formatThaiDay(key: DateKey): string {
  const [, m, d] = key.split("-").map(Number);
  return `${d} ${TH_MONTHS[m - 1]}`;
}

/** "จ. 9 พ.ย." */
export function formatThaiWeekdayDay(key: DateKey): string {
  return `${TH_WEEKDAYS[weekdayOf(key)]} ${formatThaiDay(key)}`;
}

/** "9–13 พ.ย." หรือ "30 พ.ย.–4 ธ.ค." */
export function formatThaiRange(start: DateKey, end: DateKey): string {
  const [, sm, sd] = start.split("-").map(Number);
  const [, em] = end.split("-").map(Number);
  if (sm === em) return `${sd}–${formatThaiDay(end)}`;
  return `${formatThaiDay(start)}–${formatThaiDay(end)}`;
}
