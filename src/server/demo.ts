import type { TeamId } from "@/config/teams";
import type { PlayerScore } from "@/domain/leaderboard";
import type { Announcement, TeamStanding, Viewer } from "./types";

/**
 * ข้อมูลตัวอย่างสำหรับดูหน้าจอระหว่างพัฒนา (เปิดด้วย DEMO_MODE=1)
 * ชื่อทั้งหมดสมมุติจากไฟล์ดีไซน์ ไม่ใช่ข้อมูลพนักงานจริง
 */
export const DEMO_NOW = new Date("2026-11-25T03:00:00Z"); // พ. 25 พ.ย. 10:00 เวลาไทย · สัปดาห์ 3

const FIRST = ["ณัฐวุฒิ", "พิมพ์ชนก", "ธีรภัทร", "กัญญาณัฐ", "อนุชา", "ศิริพร", "วรเชษฐ์", "ปวีณา", "กิตติพัฒน์", "สุภาวดี", "ชยพล", "อรอุมา", "ภูมิพัฒน์", "จิราพร", "ธนากร"];
const LAST = ["ป.", "ส.", "ม.", "ว.", "ท.", "ก.", "ร.", "ช."];
const TEAM_CYCLE: TeamId[] = ["SAMYAN", "FAC", "SAMYAN", "WH", "FAC", "SAMYAN", "WH", "SAMYAN", "FAC", "WH"];

function demoPlayers(): PlayerScore[] {
  const fixed: [string, TeamId, number][] = [
    ["ณัฐวุฒิ ป.", "SAMYAN", 132],
    ["พิมพ์ชนก ส.", "FAC", 128],
    ["ธีรภัทร ม.", "SAMYAN", 121],
    ["กัญญาณัฐ ว.", "WH", 86],
    ["อนุชา ท.", "FAC", 84],
  ];
  const players: PlayerScore[] = fixed.map(([name, team, score], i) => ({
    userId: `demo-${i}`,
    name,
    team,
    score,
    scoreReachedAt: `2026-11-24T0${i}:00:00Z`,
  }));
  for (let i = 5; i < 60; i++) {
    players.push({
      userId: `demo-${i}`,
      name: `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`,
      team: TEAM_CYCLE[i % TEAM_CYCLE.length],
      score: Math.max(0, 83 - Math.floor((i - 5) * 1.45)),
      scoreReachedAt: `2026-11-24T${String(i % 24).padStart(2, "0")}:00:00Z`,
    });
  }
  // ตัวเราอยู่กลางตาราง ให้เห็นข้อความ "อีก x คะแนนแซงอันดับ y"
  players.push({ userId: "demo-me", name: "ปองภพ สุขใจ", team: "SAMYAN", score: 75, scoreReachedAt: "2026-11-24T12:00:00Z" });
  return players;
}

export const demoViewer: Viewer = {
  userId: "demo-me",
  name: "ปองภพ สุขใจ",
  team: "SAMYAN",
  avatarUrl: null,
  totalScore: 75,
  daysPlayed: 12,
  avgCorrect: 4.2,
  badges: [{ id: "true-reader", count: 2 }],
  playedDates: [
    "2026-11-09", "2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13",
    "2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20",
    "2026-11-23", "2026-11-24",
  ],
  todayDone: false,
  history: [
    { date: "2026-11-24", label: "ถูก 5/5 · เกม ×2", points: 13 },
    { date: "2026-11-23", label: "ถูก 4/5 · เกม ×1.5", points: 9 },
    { date: "2026-11-20", label: "Every Round Bonus", points: 5, bonus: true },
  ],
};

export const demoPlayerList = demoPlayers();

export const demoTeams: TeamStanding[] = [
  { team: "FAC", score: 96.4, members: 12, playedThisWeek: 10, lastAtWeekStart: false },
  { team: "SAMYAN", score: 91.2, members: 30, playedThisWeek: 21, lastAtWeekStart: false },
  { team: "WH", score: 84.7, members: 18, playedThisWeek: 10, lastAtWeekStart: true },
];

export const demoAnnouncements: Announcement[] = [
  { id: "every-round", kind: "every-round", title: "เล่นครบ 5 วันสัปดาห์นี้\nรับแต้มพิเศษ + เหรียญ True Reader" },
  { id: "all-in", kind: "all-in", title: "ทีมไหนเล่นครบ 80%\nรับโบนัสทั้งทีม" },
  { id: "week3", kind: "info", title: "สัปดาห์ 3 · บท 5 Curious", body: "ทบทวนเล่ม 1 ทั้งเล่มด้วย ก่อนขึ้นเล่ม 2 วันจันทร์หน้า" },
];
