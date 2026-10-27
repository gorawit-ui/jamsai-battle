import { describe, expect, it } from "vitest";
import { DEFAULT_RANKS } from "@/config/ranks";
import { DEFAULT_SCHEDULE } from "@/config/schedule";
import { bookshelf } from "./bookshelf";
import { gapToNext, isLowerHalf, participation, rankPlayers, teamScore, formatTeamScore } from "./leaderboard";
import { initialsOf, shortName } from "./names";
import { getRank, rankProgress } from "./ranks";
import { getDayStatus, weekState } from "./schedule";
import { addDays, bangkokDateKey, formatThaiRange, weekdayOf, workweekOf } from "./time";

describe("time — Asia/Bangkok ตัดวันเที่ยงคืน", () => {
  it("23:59 เวลาไทยยังเป็นวันเดิม 00:00 เป็นวันใหม่", () => {
    expect(bangkokDateKey(new Date("2026-11-09T16:59:59Z"))).toBe("2026-11-09");
    expect(bangkokDateKey(new Date("2026-11-09T17:00:00Z"))).toBe("2026-11-10");
  });
  it("วันในสัปดาห์และสัปดาห์ทำงาน", () => {
    expect(weekdayOf("2026-11-09")).toBe(1); // จันทร์
    expect(workweekOf("2026-11-11")).toEqual(["2026-11-09", "2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13"]);
    expect(workweekOf("2026-11-15")[0]).toBe("2026-11-09"); // อาทิตย์ → สัปดาห์ที่จบ
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
  });
  it("จัดรูปช่วงวันที่ภาษาไทย", () => {
    expect(formatThaiRange("2026-11-09", "2026-11-13")).toBe("9–13 พ.ย.");
    expect(formatThaiRange("2026-11-30", "2026-12-04")).toBe("30 พ.ย.–4 ธ.ค.");
  });
});

describe("ranks — ข้อ 5.3", () => {
  const edges: [number, string, string][] = [
    [19, "E", "D"],
    [49, "D", "C"],
    [89, "C", "B"],
    [139, "B", "A"],
    [199, "A", "S"],
    [269, "S", "SSS"],
    [349, "SSS", "Legendary"],
  ];
  it.each(edges)("%i = %s · +1 = %s", (score, below, above) => {
    expect(getRank(score, DEFAULT_RANKS).rank).toBe(below);
    expect(getRank(score + 1, DEFAULT_RANKS).rank).toBe(above);
  });
  it("ค่าแปลกไม่ทำให้พัง", () => {
    expect(getRank(0, DEFAULT_RANKS).rank).toBe("E");
    expect(getRank(-5, DEFAULT_RANKS).rank).toBe("E");
    expect(getRank(Number.NaN, DEFAULT_RANKS).rank).toBe("E");
    expect(getRank(9999, DEFAULT_RANKS).rank).toBe("Legendary");
  });
  it("ระยะไปแรงค์ถัดไป", () => {
    const p = rankProgress(75, DEFAULT_RANKS);
    expect(p.current.rank).toBe("C");
    expect(p.next?.rank).toBe("B");
    expect(p.pointsToNext).toBe(15);
    expect(p.fraction).toBeCloseTo(25 / 40);
    expect(rankProgress(400, DEFAULT_RANKS).next).toBeNull();
  });
});

describe("schedule — ข้อ 2", () => {
  const at = (iso: string) => getDayStatus(DEFAULT_SCHEDULE, new Date(iso));
  it("ก่อนเปิด / วันแรก / เสาร์ / survey / หลังจบ", () => {
    expect(at("2026-11-08T12:00:00+07:00").kind).toBe("before");
    const first = at("2026-11-09T00:00:00+07:00");
    expect(first.kind).toBe("quiz");
    expect(first.kind === "quiz" && first.week.week).toBe(1);
    expect(at("2026-11-14T10:00:00+07:00").kind).toBe("weekend");
    expect(at("2026-12-23T10:00:00+07:00").kind).toBe("quiz");
    expect(at("2026-12-24T10:00:00+07:00").kind).toBe("survey");
    expect(at("2026-12-26T10:00:00+07:00").kind).toBe("after");
  });
  it("Double Point เฉพาะสัปดาห์ 6", () => {
    expect(DEFAULT_SCHEDULE.weeks.filter((w) => w.doublePoint).map((w) => w.week)).toEqual([6]);
  });
  it("สถานะสัปดาห์", () => {
    const w3 = DEFAULT_SCHEDULE.weeks[2];
    expect(weekState(w3, "2026-11-20")).toBe("locked");
    expect(weekState(w3, "2026-11-23")).toBe("now");
    expect(weekState(w3, "2026-11-28")).toBe("done");
  });
});

describe("bookshelf — 10 เล่มตามบท", () => {
  it("มี 10 ช่อง ไม่นับบทรวม", () => {
    expect(bookshelf(DEFAULT_SCHEDULE, [], "2026-11-01")).toHaveLength(10);
  });
  it("เล่น 1 วันในสัปดาห์ที่มี 2 บท ได้ 2 เล่ม · สัปดาห์ 3 ได้ 1 เล่ม · พลาดเป็น missed", () => {
    const slots = bookshelf(DEFAULT_SCHEDULE, ["2026-11-10", "2026-11-25"], "2026-11-25");
    const state = Object.fromEntries(slots.map((s) => [s.chapter.id, s.state]));
    expect(state).toMatchObject({ B1C1: "earned", B1C2: "earned", B1C3: "missed", B1C4: "missed", B1C5: "earned", B2C1: "future" });
  });
  it("สัปดาห์ปัจจุบันที่ยังไม่เล่น = current", () => {
    const slots = bookshelf(DEFAULT_SCHEDULE, [], "2026-11-30");
    expect(slots.find((s) => s.chapter.id === "B2C1")?.state).toBe("current");
  });
});

describe("leaderboard — ข้อ 5.4–5.5", () => {
  it("คะแนนเท่ากัน ใครถึงก่อนอยู่บน", () => {
    const ranked = rankPlayers([
      { userId: "a", name: "A", team: "FAC", score: 50, scoreReachedAt: "2026-11-10T05:00:00Z" },
      { userId: "b", name: "B", team: "WH", score: 50, scoreReachedAt: "2026-11-10T04:00:00Z" },
      { userId: "c", name: "C", team: "WH", score: 60, scoreReachedAt: "2026-11-11T04:00:00Z" },
    ]);
    expect(ranked.map((p) => [p.userId, p.position])).toEqual([
      ["c", 1],
      ["b", 2],
      ["a", 3],
    ]);
    expect(gapToNext(ranked, "a")).toEqual({ points: 1, position: 2 });
    expect(gapToNext(ranked, "c")).toBeNull();
  });
  it("คะแนนทีมหารด้วยสมาชิกทั้งหมด + โบนัสทีม · ทศนิยม 1 ตำแหน่ง", () => {
    expect(teamScore(300, 4, 5)).toBe(80);
    expect(formatTeamScore(teamScore(100, 3, 0))).toBe("33.3");
    expect(teamScore(0, 0, 5)).toBe(5);
  });
  it("All-In 80%", () => {
    expect(participation(24, 30).needed).toBe(0);
    expect(participation(21, 30).needed).toBe(3);
    expect(participation(10, 12).needed).toBe(0); // 9.6 → 10 คน
    expect(participation(9, 12).needed).toBe(1);
  });
  it("ครึ่งล่างไม่บอกเลขอันดับ", () => {
    expect(isLowerHalf(30, 60)).toBe(false);
    expect(isLowerHalf(31, 60)).toBe(true);
  });
});

describe("names", () => {
  it("ชื่อย่อเป็นพยัญชนะ ไม่ติดสระบน/ล่าง · สระหน้าติดพยัญชนะ", () => {
    expect(initialsOf("ปองภพ สุขใจ")).toBe("ปส");
    expect(initialsOf("เบนซ์")).toBe("เบ");
    expect(initialsOf("ไพลิน ใจดี")).toBe("ไพใจ");
    expect(initialsOf("anna lee")).toBe("AL");
    expect(initialsOf("  ")).toBe("?");
    expect(shortName("ปองภพ สุขใจ")).toBe("ปองภพ ส.");
  });
});
