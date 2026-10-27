import type { TeamId } from "@/config/teams";

export type PlayerScore = {
  userId: string;
  name: string;
  team: TeamId;
  score: number;
  /** เวลาที่ทำคะแนนถึงค่าปัจจุบัน (ISO) — ใช้ตัดสินเมื่อคะแนนเท่ากัน (ข้อ 5.5) */
  scoreReachedAt: string;
  avatarUrl?: string | null;
};

export type RankedPlayer = PlayerScore & { position: number };

/** คะแนนมากอยู่บน · เท่ากัน → ใครถึงก่อนอยู่บน */
export function rankPlayers(players: PlayerScore[]): RankedPlayer[] {
  return [...players]
    .sort((a, b) => b.score - a.score || a.scoreReachedAt.localeCompare(b.scoreReachedAt))
    .map((p, i) => ({ ...p, position: i + 1 }));
}

/**
 * คะแนนทีม = ผลรวมคะแนนรายคน ÷ จำนวนสมาชิกทั้งหมด + โบนัสทีม (ข้อ 5.4)
 * หารด้วยสมาชิกทั้งหมด ไม่ใช่เฉพาะคนที่เล่น
 */
export function teamScore(memberScoreSum: number, memberCount: number, teamBonus: number): number {
  if (memberCount <= 0) return teamBonus;
  return memberScoreSum / memberCount + teamBonus;
}

export function formatTeamScore(score: number): string {
  return score.toFixed(1);
}

export const ALL_IN_THRESHOLD = 0.8;

export type Participation = {
  played: number;
  members: number;
  fraction: number;
  /** อีกกี่คนถึงเกณฑ์ All-In · 0 = ถึงแล้ว */
  needed: number;
};

/** % คนเล่นอย่างน้อย 1 วันในสัปดาห์ (ข้อ 5.6 All-In) */
export function participation(played: number, members: number, threshold = ALL_IN_THRESHOLD): Participation {
  const fraction = members > 0 ? played / members : 0;
  return { played, members, fraction, needed: Math.max(0, Math.ceil(threshold * members - 1e-9) - played) };
}

/** อยู่ครึ่งล่างของตาราง → ไม่บอกเลขอันดับ บอกระยะห่างแทน (ข้อ 8.5) */
export function isLowerHalf(position: number, total: number): boolean {
  return position > Math.ceil(total / 2);
}

/** "อีก 3 คะแนนแซงอันดับ 33" */
export function gapToNext(ranked: RankedPlayer[], userId: string): { points: number; position: number } | null {
  const idx = ranked.findIndex((p) => p.userId === userId);
  if (idx <= 0) return null;
  const ahead = ranked[idx - 1];
  // คะแนนเท่ากันแต่ถึงทีหลัง ต้องได้มากกว่าอีก 1
  return { points: ahead.score - ranked[idx].score + 1, position: ahead.position };
}
