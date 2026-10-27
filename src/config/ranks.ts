/**
 * เกณฑ์แรงค์ — PROJECT_BRIEF.md ข้อ 5.3
 * ใช้ตารางนี้เท่านั้น (เกณฑ์ทุก 50 คะแนนในแพ็กกรอบเป็นของเก่า)
 */
export const RANK_IDS = ["E", "D", "C", "B", "A", "S", "SSS", "Legendary"] as const;
export type RankId = (typeof RANK_IDS)[number];

export type RankStep = { rank: RankId; minScore: number };

export const DEFAULT_RANKS: RankStep[] = [
  { rank: "E", minScore: 0 },
  { rank: "D", minScore: 20 },
  { rank: "C", minScore: 50 },
  { rank: "B", minScore: 90 },
  { rank: "A", minScore: 140 },
  { rank: "S", minScore: 200 },
  { rank: "SSS", minScore: 270 },
  { rank: "Legendary", minScore: 350 },
];
