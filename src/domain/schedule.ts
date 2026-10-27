import type { Schedule, Week } from "@/config/schedule";
import { bangkokDateKey, isWeekend, type DateKey } from "./time";

export function findWeek(schedule: Schedule, key: DateKey): Week | null {
  return schedule.weeks.find((w) => w.start <= key && key <= w.end) ?? null;
}

export type DayStatus =
  | { kind: "before"; dateKey: DateKey }
  | { kind: "after"; dateKey: DateKey }
  | { kind: "weekend"; dateKey: DateKey; week: Week | null }
  | { kind: "quiz"; dateKey: DateKey; week: Week }
  | { kind: "survey"; dateKey: DateKey; week: Week };

/** วันนี้เล่นอะไรได้ — วันหยุดราชการที่ตรงกับ จ–ศ เปิดเล่นตามปกติ (ข้อ 2) */
export function getDayStatus(schedule: Schedule, now: Date): DayStatus {
  const dateKey = bangkokDateKey(now);
  if (dateKey < schedule.eventStart) return { kind: "before", dateKey };
  if (dateKey > schedule.eventEnd) return { kind: "after", dateKey };
  const week = findWeek(schedule, dateKey);
  if (isWeekend(dateKey) || !week) return { kind: "weekend", dateKey, week };
  if (week.surveyDates?.includes(dateKey)) return { kind: "survey", dateKey, week };
  return { kind: "quiz", dateKey, week };
}

export type WeekState = "done" | "now" | "locked";

export function weekState(week: Week, todayKey: DateKey): WeekState {
  if (todayKey > week.end) return "done";
  if (todayKey >= week.start) return "now";
  return "locked";
}

/** สัปดาห์ปัจจุบันหรือสัปดาห์ถัดไปที่จะเปิด (ใช้กับป้าย "สัปดาห์ 3 จาก 7") */
export function currentOrNextWeek(schedule: Schedule, todayKey: DateKey): Week | null {
  return schedule.weeks.find((w) => todayKey <= w.end) ?? null;
}
