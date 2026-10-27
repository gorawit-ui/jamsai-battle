import type { ReactNode } from "react";
import { RANK_IDS, type RankStep } from "@/config/ranks";
import { TEAMS, type TeamId } from "@/config/teams";
import type { ShelfSlot } from "@/domain/bookshelf";
import { formatTeamScore } from "@/domain/leaderboard";
import { rankProgress } from "@/domain/ranks";
import type { DateKey } from "@/domain/time";
import { FlagIcon } from "./icons";

export function SectionHeader({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <h2 className="font-display text-[18px] font-semibold">{title}</h2>
      {aside && <span className="text-[13px]">{aside}</span>}
    </div>
  );
}

/** แถวอันดับทีม — ทีมตัวเองใช้เงาสีทีมแทนสีดำ (ข้อ 8.4) */
export function TeamRow({ position, team, score, mine }: { position: number; team: TeamId; score: number; mine?: boolean }) {
  const t = TEAMS[team];
  return (
    <div
      className="flex min-h-[48px] items-center gap-2.5 rounded-[14px] px-2.5 py-2"
      style={{
        background: t.bg,
        border: `${mine ? 3 : 2.5}px solid var(--ink)`,
        boxShadow: mine ? `3px 3px 0 ${t.color}` : undefined,
      }}
    >
      <b className="w-[18px] font-display text-[18px] font-semibold">{position}</b>
      <FlagIcon color={t.color} />
      <b className="flex-1 text-[15px]">
        {team} · {mine ? "ทีมคุณ" : t.name}
      </b>
      <b className="font-display text-[18px] font-semibold">{formatTeamScore(score)}</b>
    </div>
  );
}

/** ตรายาง "อ่านแล้ว" จ–ศ (ข้อ 8.5) */
export function WeekStamps({ days, playedDates, today }: { days: DateKey[]; playedDates: DateKey[]; today: DateKey }) {
  const labels = ["จ", "อ", "พ", "พฤ", "ศ"];
  const tilt = [-7, 5, -5, 6, -8];
  return (
    <ol className="grid grid-cols-5 gap-1.5 border-t-2 border-dashed border-line pt-1">
      {days.map((d, i) => {
        const played = playedDates.includes(d);
        const isToday = d === today;
        return (
          <li key={d} className="flex flex-col items-center gap-[3px] pt-1.5">
            {played ? (
              <span
                className="grid h-10 w-[50px] place-items-center rounded-[7px] text-center font-display text-[11px] leading-[1.1] font-semibold text-matcha-ink"
                style={{ border: "2.5px solid var(--matcha-ink)", transform: `rotate(${tilt[i]}deg)` }}
              >
                อ่าน
                <br />
                แล้ว
              </span>
            ) : isToday ? (
              <span className="grid h-10 w-[50px] place-items-center rounded-[7px] border-[2.5px] border-ink bg-sun font-display text-[12px] font-semibold">
                วันนี้
              </span>
            ) : (
              <span className="h-10 w-[50px] rounded-[7px] border-[2.5px] border-dashed border-muted" />
            )}
            <span className={`text-[12px] ${played || isToday ? "font-semibold" : "text-ink-soft"}`}>
              {labels[i]}
              <span className="sr-only">{played ? " เล่นแล้ว" : isToday ? " วันนี้" : ""}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function ProgressBar({ fraction, color, marker }: { fraction: number; color: string; marker?: number }) {
  return (
    <div className="relative h-4 overflow-hidden rounded-full border-[2.5px] border-ink bg-paper">
      <div className="h-full" style={{ width: `${Math.round(fraction * 100)}%`, background: color }} />
      {marker !== undefined && <div className="absolute inset-y-0 w-[2.5px] bg-ink" style={{ left: `${marker * 100}%` }} />}
    </div>
  );
}

/** ข้อความแรงค์ถัดไป เช่น "อีก 15 คะแนนขึ้นแรงค์ B" */
export function NextRankText({ score, ranks, short }: { score: number; ranks: RankStep[]; short?: boolean }) {
  const p = rankProgress(score, ranks);
  if (!p.next) return <span>แรงค์สูงสุดแล้ว</span>;
  return short ? (
    <span>
      อีก {p.pointsToNext} ถึง <b>{p.next.rank}</b>
    </span>
  ) : (
    <span>
      อีก {p.pointsToNext} คะแนนขึ้นแรงค์ <b>{p.next.rank}</b>
    </span>
  );
}

/** แถบแรงค์ E → Legendary (หน้า Profile) */
export function RankLadder({ score, ranks }: { score: number; ranks: RankStep[] }) {
  const p = rankProgress(score, ranks);
  const currentIdx = RANK_IDS.indexOf(p.current.rank);
  return (
    <div className="flex flex-col gap-1.5">
      <ol className="grid grid-cols-8 items-center gap-1" aria-label={`ความคืบหน้าแรงค์ ตอนนี้แรงค์ ${p.current.rank}`}>
        {RANK_IDS.map((r, i) => {
          const reached = i <= currentIdx;
          const isNext = i === currentIdx + 1;
          return (
            <li
              key={r}
              className="rounded-full"
              style={{
                height: i === currentIdx ? 14 : 10,
                border: reached || isNext ? `${i === currentIdx ? 2.5 : 2}px solid var(--ink)` : "2px dashed var(--muted)",
                background: reached
                  ? "var(--ink)"
                  : isNext
                    ? `linear-gradient(90deg, var(--sun) ${Math.round(p.fraction * 100)}%, var(--paper) ${Math.round(p.fraction * 100)}%)`
                    : "var(--paper)",
              }}
            />
          );
        })}
      </ol>
      <div className="grid grid-cols-8 gap-1 text-center font-display text-[11px] font-semibold" aria-hidden>
        {RANK_IDS.map((r, i) => (
          <span key={r} className={i === currentIdx ? "underline decoration-2 underline-offset-2" : ""}>
            {r === "Legendary" ? <span className="text-[9px]">LEGEND</span> : r}
          </span>
        ))}
      </div>
    </div>
  );
}

/** ชั้นหนังสือ 10 ช่อง · เล่ม 1 สันเขียว เล่ม 2 สันเหลือง · ช่องที่พลาดเป็นเส้นประ */
export function Bookshelf({ slots }: { slots: ShelfSlot[] }) {
  const heights = [56, 50, 60, 54, 58, 50, 56, 48, 60, 54];
  return (
    <div>
      <ol className="grid h-16 grid-cols-10 items-end gap-[3px] px-1">
        {slots.map((s, i) => {
          const label = `เล่ม ${s.chapter.book} บทที่ ${s.chapter.chapter} ${s.chapter.title}`;
          const base = { height: heights[i % heights.length] };
          if (s.state === "earned") {
            const spine = s.chapter.book === 1 ? (i % 2 ? "var(--matcha)" : "var(--leaf)") : "var(--sun)";
            return (
              <li
                key={s.chapter.id}
                aria-label={`${label} · ได้แล้ว`}
                className="grid place-items-end justify-center rounded-t-[3px] rounded-b-[1px] border-[2.5px] border-ink pb-1 font-display text-[11px] font-semibold"
                style={{ ...base, background: spine }}
              >
                {s.chapter.chapter}
              </li>
            );
          }
          if (s.state === "current") {
            return (
              <li
                key={s.chapter.id}
                aria-label={`${label} · สัปดาห์นี้`}
                className="grid place-items-end justify-center rounded-t-[3px] rounded-b-[1px] border-[2.5px] border-dashed border-ink bg-hint-bg pb-1 font-display text-[11px] font-semibold"
                style={base}
              >
                {s.chapter.chapter}
              </li>
            );
          }
          return (
            <li
              key={s.chapter.id}
              aria-label={`${label} · ${s.state === "missed" ? "พลาดแล้ว" : "ยังไม่ถึง"}`}
              className="rounded-[3px] border-2 border-dashed border-muted"
              style={base}
            />
          );
        })}
      </ol>
      <div className="h-[9px] rounded-[4px] border-[3px] border-ink bg-shelf" />
    </div>
  );
}
