import type { RankId, RankStep } from "@/config/ranks";

/** หาแรงค์จาก minScore ใน config (ข้อ 5.3) — ห้ามคำนวณด้วยการหาร */
export function getRank(score: number, ranks: RankStep[]): RankStep {
  const safe = Number.isFinite(score) ? Math.max(0, score) : 0;
  let current = ranks[0];
  for (const step of ranks) {
    if (safe >= step.minScore) current = step;
  }
  return current;
}

export type RankProgress = {
  current: RankStep;
  next: RankStep | null;
  /** คะแนนที่ต้องเก็บเพิ่มเพื่อขึ้นแรงค์ถัดไป */
  pointsToNext: number | null;
  /** 0–1 ภายในช่วงของแรงค์ปัจจุบัน */
  fraction: number;
};

export function rankProgress(score: number, ranks: RankStep[]): RankProgress {
  const current = getRank(score, ranks);
  const idx = ranks.indexOf(current);
  const next = ranks[idx + 1] ?? null;
  if (!next) return { current, next: null, pointsToNext: null, fraction: 1 };
  const span = next.minScore - current.minScore;
  return {
    current,
    next,
    pointsToNext: next.minScore - score,
    fraction: Math.min(1, Math.max(0, (score - current.minScore) / span)),
  };
}

/** ข้อความสำหรับ screen reader (ข้อ 8 Accessibility) */
export function rankLabel(rank: RankId): string {
  return `แรงค์ ${rank}`;
}
