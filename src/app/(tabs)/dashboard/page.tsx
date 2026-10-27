import Link from "next/link";
import { ProgressBar } from "@/components/blocks";
import { CrownIcon, FlagIcon, TrendIcon } from "@/components/icons";
import { RankAvatar } from "@/components/rank-avatar/RankAvatar";
import type { RankStep } from "@/config/ranks";
import { TEAMS } from "@/config/teams";
import { ALL_IN_THRESHOLD, formatTeamScore, gapToNext, isLowerHalf, participation, type RankedPlayer } from "@/domain/leaderboard";
import { shortName } from "@/domain/names";
import { getRank } from "@/domain/ranks";
import { currentOrNextWeek } from "@/domain/schedule";
import { bangkokDateKey, formatThaiDay } from "@/domain/time";
import { getConfig, getLeaderboard, getNow, getViewer } from "@/server/data";
import type { TeamStanding } from "@/server/types";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function DashboardPage({ searchParams }: Props) {
  const tab = (await searchParams).tab === "people" ? "people" : "teams";
  const [{ schedule, ranks }, { players, teams }, viewer] = await Promise.all([getConfig(), getLeaderboard(), getViewer()]);
  const week = currentOrNextWeek(schedule, bangkokDateKey(getNow()));
  const me = viewer ? players.find((p) => p.userId === viewer.userId) : undefined;

  return (
    <main className="flex flex-col gap-4 px-4 pt-10">
      <header className="flex items-center justify-between gap-2">
        <h1 className="page-title">Dashboard</h1>
        {week && <span className="chip bg-paper px-3 py-1 text-[13px]">สัปดาห์ {week.week} จาก {schedule.weeks.length}</span>}
      </header>

      <nav aria-label="มุมมองอันดับ" className="card grid grid-cols-2 gap-1 p-1.5" style={{ boxShadow: "none" }}>
        {(
          [
            ["teams", "อันดับทีม"],
            ["people", "รายคน"],
          ] as const
        ).map(([key, label]) => (
          <Link
            key={key}
            href={key === "teams" ? "/dashboard" : "/dashboard?tab=people"}
            aria-current={tab === key ? "page" : undefined}
            className={`grid min-h-11 place-items-center rounded-[14px] font-display text-[15px] font-semibold ${tab === key ? "bg-ink text-sun" : ""}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {teams.length === 0 ? (
        <section className="card p-5 text-center">
          <p className="font-display text-[18px] font-semibold">ยังไม่มีคะแนน</p>
          <p className="text-[14px] text-ink-soft">อันดับจะขึ้นหลังเปิดศึก {formatThaiDay(schedule.eventStart)}</p>
        </section>
      ) : tab === "teams" ? (
        <>
          <Podium teams={teams} />
          <ParticipationCard teams={teams} />
          <TopFive players={players} ranks={ranks} />
        </>
      ) : (
        <AllPlayers players={players} ranks={ranks} meId={me?.userId} />
      )}

      {me && <MyRow me={me} players={players} ranks={ranks} />}
    </main>
  );
}

function Podium({ teams }: { teams: TeamStanding[] }) {
  // วาง 2 · 1 · 3
  const order = [teams[1], teams[0], teams[2]].filter(Boolean);
  const heights: Record<number, number> = { 1: 118, 2: 84, 3: 60 };
  return (
    <section className="card overflow-hidden px-3 pt-4" aria-label="โพเดียมทีม">
      <ol className="grid grid-cols-3 items-end gap-2">
        {order.map((t) => {
          const pos = teams.indexOf(t) + 1;
          return (
            <li key={t.team} className="flex flex-col items-center gap-1.5">
              {pos === 1 && <CrownIcon />}
              <FlagIcon color={TEAMS[t.team].color} size={pos === 1 ? 56 : 44} />
              <b className="font-display text-[14px] font-semibold">{t.team}</b>
              <b className="font-display font-bold" style={{ fontSize: pos === 1 ? 26 : 22 }}>
                {formatTeamScore(t.score)}
              </b>
              <div
                className="grid w-full place-items-center rounded-t-xl border-[3px] border-b-0 border-ink font-display font-bold"
                style={{ height: heights[pos], background: pos === 1 ? "var(--sun)" : TEAMS[t.team].bg, fontSize: pos === 1 ? 40 : 30 }}
              >
                <span className="sr-only">อันดับ </span>
                {pos}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function ParticipationCard({ teams }: { teams: TeamStanding[] }) {
  const comeback = teams.find((t) => t.lastAtWeekStart);
  return (
    <section className="card flex flex-col gap-3 px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-[17px] font-semibold">คนเล่นสัปดาห์นี้</h2>
        <span className="text-[12px] font-semibold">ถึง 80% = All-In Bonus</span>
      </div>
      {teams.map((t) => {
        const p = participation(t.playedThisWeek, t.members);
        const pct = Math.round(p.fraction * 100);
        return (
          <div key={t.team} className="flex flex-col gap-[5px]">
            <div className="flex justify-between text-[14px]">
              <b>
                {t.team} · {t.members} คน
              </b>
              <span className={`font-semibold ${p.needed === 0 ? "text-matcha-ink" : ""}`}>
                {pct}%{p.needed === 0 ? " · ได้โบนัสแล้ว" : p.needed <= 5 ? ` · อีก ${p.needed} คน` : ""}
              </span>
            </div>
            <ProgressBar fraction={p.fraction} color={TEAMS[t.team].color} marker={ALL_IN_THRESHOLD} />
          </div>
        );
      })}
      {comeback && (
        <div className="flex items-center gap-2.5 rounded-[14px] border-[2.5px] border-dashed border-ink px-3 py-2.5" style={{ background: TEAMS[comeback.team].bg }}>
          <TrendIcon />
          <span className="flex-1 text-[13.5px] leading-[1.45]">
            <b>Comeback Challenge · {comeback.team}</b>
            <br />
            เพิ่มคนเล่นอีก 15% จากสัปดาห์ก่อน รับโบนัสทีม
          </span>
        </div>
      )}
    </section>
  );
}

function PlayerRow({ p, ranks, highlight, divider }: { p: RankedPlayer; ranks: RankStep[]; highlight?: boolean; divider?: boolean }) {
  const rank = getRank(p.score, ranks).rank;
  return (
    <li
      className={`flex items-center gap-2.5 p-2 ${divider ? "border-t-2 border-dashed border-line" : ""} ${highlight ? "rounded-[14px] border-[2.5px] border-ink bg-sun" : ""}`}
    >
      <b className="w-6 text-center font-display text-[17px] font-bold">{p.position}</b>
      <RankAvatar name={p.name} score={p.score} ranks={ranks} photoUrl={p.avatarUrl} team={p.team} size={48} />
      <span className="flex min-w-0 flex-1 flex-col">
        <b className="truncate text-[14.5px]">{shortName(p.name)}</b>
        <span className="text-[12px] font-semibold">
          {rank} · {p.team}
        </span>
      </span>
      <b className="font-display text-[18px] font-bold">{p.score}</b>
    </li>
  );
}

function TopFive({ players, ranks }: { players: RankedPlayer[]; ranks: RankStep[] }) {
  return (
    <section className="card flex flex-col gap-0.5 px-3.5 pt-3.5 pb-2">
      <div className="mb-1.5 flex items-baseline justify-between">
        <h2 className="font-display text-[17px] font-semibold">Top 5 รายคน</h2>
        <span className="text-[12px] text-ink-soft">เท่ากัน ใครทำก่อนอยู่บน</span>
      </div>
      <ol>
        {players.slice(0, 5).map((p, i) => (
          <PlayerRow key={p.userId} p={p} ranks={ranks} highlight={i === 0} divider={i > 1} />
        ))}
      </ol>
    </section>
  );
}

function AllPlayers({ players, ranks, meId }: { players: RankedPlayer[]; ranks: RankStep[]; meId?: string }) {
  return (
    <section className="card px-3.5 pt-3.5 pb-2">
      <div className="mb-1.5 flex items-baseline justify-between">
        <h2 className="font-display text-[17px] font-semibold">อันดับรายคน</h2>
        <span className="text-[12px] text-ink-soft">{players.length} คน</span>
      </div>
      <ol>
        {players.map((p, i) => (
          <PlayerRow key={p.userId} p={p} ranks={ranks} highlight={p.userId === meId} divider={i > 0 && p.userId !== meId} />
        ))}
      </ol>
    </section>
  );
}

/** แถวอันดับตัวเองปักล่าง · ครึ่งล่างไม่บอกเลขอันดับ บอกระยะห่างแทน (ข้อ 8.5) */
function MyRow({ me, players, ranks }: { me: RankedPlayer; players: RankedPlayer[]; ranks: RankStep[] }) {
  const gap = gapToNext(players, me.userId);
  const lower = isLowerHalf(me.position, players.length);
  return (
    <section className="flex items-center gap-2.5 rounded-[22px] bg-ink px-3.5 py-3 text-paper" aria-label="อันดับของคุณ">
      <b className="min-w-7 text-center font-display text-[20px] font-bold text-sun">{lower ? "" : me.position}</b>
      <RankAvatar name={me.name} score={me.score} ranks={ranks} photoUrl={me.avatarUrl} team={me.team} size={48} />
      <span className="flex min-w-0 flex-1 flex-col">
        <b className="text-[15px]">
          คุณ · {getRank(me.score, ranks).rank} · {me.team}
        </b>
        <span className="text-[13px]">{gap ? `อีก ${gap.points} คะแนนแซงอันดับ ${gap.position}` : "คุณอยู่อันดับ 1"}</span>
      </span>
      <b className="font-display text-[22px] font-bold text-sun">{me.score}</b>
    </section>
  );
}
