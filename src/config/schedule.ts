/**
 * ตารางกิจกรรมเริ่มต้น — PROJECT_BRIEF.md ข้อ 2
 * เป็นค่าตั้งต้นสำหรับ config/schedule ใน Firestore (HR เลื่อนวันได้โดยไม่แก้โค้ด)
 * วันที่ทั้งหมดเป็นวันที่ตามเวลาไทย รูปแบบ YYYY-MM-DD
 */

export type Chapter = {
  /** "B1C5" = เล่ม 1 บท 5 · "B1ALL" = รวมเล่ม 1 */
  id: string;
  book: 1 | 2;
  /** null = บทรวม ไม่นับเป็นเล่มบนชั้นหนังสือ */
  chapter: number | null;
  title: string;
  sub: string;
  readUrl?: string;
  clipUrl?: string;
};

export type GamePhase = 1 | 2 | 3;

export type Week = {
  week: number;
  start: string;
  end: string;
  /** บทที่ใช้สุ่มคำถาม · บทแรกคือบทหลักของสัปดาห์ */
  chapters: Chapter[];
  gamePhase: GamePhase | null;
  doublePoint?: boolean;
  /** วันที่ทำ Survey แทนควิซ */
  surveyDates?: string[];
};

export type Schedule = {
  eventStart: string;
  eventEnd: string;
  weeks: Week[];
};

const ch = (book: 1 | 2, chapter: number, title: string, sub: string): Chapter => ({
  id: `B${book}C${chapter}`,
  book,
  chapter,
  title,
  sub,
});

export const DEFAULT_SCHEDULE: Schedule = {
  eventStart: "2026-11-09",
  eventEnd: "2026-12-25",
  weeks: [
    {
      week: 1,
      start: "2026-11-09",
      end: "2026-11-13",
      chapters: [
        ch(1, 1, "Caring", "กล่องที่ไม่ถึงมือ"),
        ch(1, 2, "Trusted", "คำที่พูดไว้กับพี่สมาน"),
      ],
      gamePhase: 1,
    },
    {
      week: 2,
      start: "2026-11-16",
      end: "2026-11-20",
      chapters: [ch(1, 3, "Humble", "I may be wrong"), ch(1, 4, "Team", "คนส่งบอล")],
      gamePhase: 1,
    },
    {
      week: 3,
      start: "2026-11-23",
      end: "2026-11-27",
      chapters: [
        ch(1, 5, "Curious", "เอ๊ะ ทำไมต้องอุณหภูมิห้อง"),
        { id: "B1ALL", book: 1, chapter: null, title: "รวมเล่ม 1", sub: "ทบทวนบท 1–5" },
      ],
      gamePhase: 1,
    },
    {
      week: 4,
      start: "2026-11-30",
      end: "2026-12-04",
      chapters: [ch(2, 1, "Servant Leadership", "เก้าอี้ที่แม็กซ์เลือกนั่ง")],
      gamePhase: 2,
    },
    {
      week: 5,
      start: "2026-12-07",
      end: "2026-12-11",
      chapters: [
        ch(2, 2, "Courage", 'คำว่า "ไม่" ที่พูดยากที่สุด'),
        ch(2, 3, "Think like an Owner", "ของที่ยังอยู่บนชั้น"),
      ],
      gamePhase: 2,
    },
    {
      week: 6,
      start: "2026-12-14",
      end: "2026-12-18",
      chapters: [
        ch(2, 4, "Good Judgment", "สามรสที่อยากเพิ่ม"),
        ch(2, 5, "Accountability", "ความรับผิดชอบของผม"),
      ],
      gamePhase: 2,
      doublePoint: true,
    },
    {
      week: 7,
      start: "2026-12-21",
      end: "2026-12-25",
      chapters: [{ id: "B12ALL", book: 2, chapter: null, title: "รวมเล่ม 1–2", sub: "ทบทวนทั้ง 10 บท" }],
      gamePhase: 3,
      surveyDates: ["2026-12-24", "2026-12-25"],
    },
  ],
};
