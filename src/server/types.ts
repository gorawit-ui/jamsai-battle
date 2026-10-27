import type { TeamId } from "@/config/teams";
import type { DateKey } from "@/domain/time";

export type BadgeId = "true-reader" | "ten-days";

export type Viewer = {
  userId: string;
  name: string;
  team: TeamId;
  avatarUrl: string | null;
  totalScore: number;
  daysPlayed: number;
  avgCorrect: number;
  badges: { id: BadgeId; count: number }[];
  /** วันที่เล่น (ส่งคำตอบข้อแรกสำเร็จ) ตามเวลาไทย */
  playedDates: DateKey[];
  todayDone: boolean;
  history: { date: DateKey; label: string; points: number; bonus?: boolean }[];
};

export type TeamStanding = {
  team: TeamId;
  score: number;
  members: number;
  playedThisWeek: number;
  /** ทีมอันดับสุดท้ายตอนเริ่มสัปดาห์ → มีสิทธิ์ Comeback */
  lastAtWeekStart: boolean;
};

export type Announcement = {
  id: string;
  kind: "every-round" | "all-in" | "double-point" | "info";
  title: string;
  body?: string;
};
