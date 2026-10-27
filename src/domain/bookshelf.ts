import type { Chapter, Schedule } from "@/config/schedule";
import type { DateKey } from "./time";

export type ShelfSlot = {
  chapter: Chapter & { chapter: number };
  /** earned = ได้แล้ว · current = สัปดาห์นี้ยังไม่ได้ · missed = พลาด · future = ยังไม่ถึง */
  state: "earned" | "current" | "missed" | "future";
};

/**
 * ชั้นหนังสือ 10 ช่องตามบท (ข้อ 8 ชั้นหนังสือ)
 * ได้เล่มเมื่อเล่นอย่างน้อย 1 วันในสัปดาห์ของบทนั้น · บทรวม (chapter = null) ไม่นับ
 */
export function bookshelf(schedule: Schedule, playedDates: DateKey[], today: DateKey): ShelfSlot[] {
  const slots: ShelfSlot[] = [];
  for (const week of schedule.weeks) {
    const played = playedDates.some((d) => week.start <= d && d <= week.end);
    for (const ch of week.chapters) {
      if (ch.chapter === null) continue;
      const state = played ? "earned" : today > week.end ? "missed" : today >= week.start ? "current" : "future";
      slots.push({ chapter: ch as ShelfSlot["chapter"], state });
    }
  }
  return slots;
}
