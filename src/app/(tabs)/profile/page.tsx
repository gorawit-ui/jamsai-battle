import Link from "next/link";
import { Bookshelf, NextRankText, RankLadder } from "@/components/blocks";
import { Dot, Squiggle, Star } from "@/components/Decor";
import { MedalIcon } from "@/components/icons";
import { RankAvatar } from "@/components/rank-avatar/RankAvatar";
import { TEAMS } from "@/config/teams";
import { bookshelf } from "@/domain/bookshelf";
import { isLowerHalf } from "@/domain/leaderboard";
import { getRank } from "@/domain/ranks";
import { bangkokDateKey, formatThaiWeekdayDay } from "@/domain/time";
import { getConfig, getLeaderboard, getNow, getViewer } from "@/server/data";
import type { BadgeId } from "@/server/types";

const BADGES: Record<BadgeId, string> = {
  "true-reader": "True Reader",
  "ten-days": "สะสม 10 วัน",
};

export default async function ProfilePage() {
  const [{ schedule, ranks }, viewer] = await Promise.all([getConfig(), getViewer()]);

  if (!viewer) {
    return (
      <main className="flex flex-col gap-4 px-4 pt-10">
        <h1 className="page-title">Profile</h1>
        <section className="card flex flex-col items-center gap-3 p-5 text-center">
          <p className="font-display text-[18px] font-semibold">เข้าสู่ระบบก่อนนะ</p>
          <p className="text-[14px] text-ink-soft">ดูแรงค์ ชั้นหนังสือ และเหรียญของคุณได้หลังล็อกอินด้วย Slack</p>
          <Link href="/" className="btn-primary w-full">
            ไปหน้าเข้าสู่ระบบ
          </Link>
        </section>
      </main>
    );
  }

  const { players } = await getLeaderboard();
  const me = players.find((p) => p.userId === viewer.userId);
  const rank = getRank(viewer.totalScore, ranks);
  const slots = bookshelf(schedule, viewer.playedDates, bangkokDateKey(getNow()));
  const earned = slots.filter((s) => s.state === "earned").length;
  const team = TEAMS[viewer.team];

  return (
    <main className="relative flex flex-col gap-4 px-4 pt-6">
      <Squiggle className="absolute top-10 left-4" />
      <Star className="absolute top-8 right-4" />
      <Dot className="absolute top-[180px] left-8" />

      <header className="flex flex-col items-center gap-2">
        <RankAvatar name={viewer.name} score={viewer.totalScore} ranks={ranks} photoUrl={viewer.avatarUrl} team={viewer.team} size={200} motion />
        <h1 className="font-display text-[26px] font-semibold">{viewer.name}</h1>
        <div className="flex gap-2">
          <span className="chip bg-ink px-3 py-1 font-display text-[14px] text-sun">แรงค์ {rank.rank}</span>
          <span className="chip px-3 py-1 text-[14px]" style={{ background: team.bg }}>
            {viewer.team}
          </span>
        </div>
      </header>

      <section className="card flex flex-col gap-2.5 px-4 py-3.5">
        <div className="flex items-baseline justify-between">
          <b className="font-display text-[17px] font-semibold">{viewer.totalScore} คะแนน</b>
          <span className="text-[13px]">
            <NextRankText score={viewer.totalScore} ranks={ranks} short />
          </span>
        </div>
        <RankLadder score={viewer.totalScore} ranks={ranks} />
      </section>

      <section className="grid grid-cols-3 gap-2.5">
        <Stat value={String(viewer.daysPlayed)} label="วันที่เล่น" />
        <Stat value={viewer.avgCorrect.toFixed(1)} label="ตอบถูกเฉลี่ย" />
        {me && !isLowerHalf(me.position, players.length) ? (
          <Stat value={`#${me.position}`} label="อันดับรวม" />
        ) : (
          <Stat value={String(viewer.badges.length)} label="เหรียญ" />
        )}
      </section>

      <section className="card flex flex-col gap-2.5 px-4 py-3.5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[17px] font-semibold">ชั้นหนังสือของฉัน</h2>
          <span className="text-[13px] text-ink-soft">{earned} จาก 10 เล่ม</span>
        </div>
        <Bookshelf slots={slots} />
      </section>

      <section className="card flex flex-col gap-2.5 px-4 py-3.5">
        <h2 className="font-display text-[17px] font-semibold">เหรียญ</h2>
        {viewer.badges.length === 0 ? (
          <p className="text-[14px] text-ink-soft">เล่นครบ 5 วันในสัปดาห์เดียว รับเหรียญ True Reader</p>
        ) : (
          <ul className="grid grid-cols-4 gap-2">
            {viewer.badges.map((b) => (
              <li key={b.id} className="flex flex-col items-center gap-1 text-center">
                {/* เหรียญเป็นวงกลมได้ — กฎสี่เหลี่ยมใช้กับรูปโปรไฟล์เท่านั้น */}
                <span className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-ink bg-sun">
                  <MedalIcon />
                </span>
                <span className="text-[11.5px] leading-[1.25] font-semibold">
                  {BADGES[b.id]}
                  {b.count > 1 ? ` ×${b.count}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card flex flex-col px-4 py-3.5">
        <h2 className="mb-1 font-display text-[17px] font-semibold">ล่าสุด</h2>
        <ul>
          {viewer.history.map((h, i) => (
            <li key={`${h.date}-${i}`} className={`flex items-center justify-between gap-2 py-2.5 ${i > 0 ? "border-t-2 border-dashed border-line" : ""}`}>
              <span className="flex flex-col">
                <b className="text-[15px]">{formatThaiWeekdayDay(h.date)}</b>
                <span className="text-[13px] text-ink-soft">{h.label}</span>
              </span>
              <b className={`font-display text-[18px] font-bold ${h.bonus ? "text-matcha-ink" : ""}`}>+{h.points}</b>
            </li>
          ))}
        </ul>
      </section>

      {/* โมดูล 3 จะเปลี่ยนเป็น signOut() */}
      <button type="button" disabled className="btn-secondary mx-auto rounded-full bg-paper px-6 disabled:opacity-60">
        ออกจากระบบ
      </button>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-[18px] border-[3px] border-ink bg-paper px-1.5 py-2.5" style={{ boxShadow: "4px 4px 0 var(--ink)" }}>
      <b className="font-display text-[26px] font-bold">{value}</b>
      <span className="text-center text-[12px]">{label}</span>
    </div>
  );
}
