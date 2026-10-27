import Image from "next/image";
import Link from "next/link";
import { NextRankText, ProgressBar, SectionHeader, TeamRow, WeekStamps } from "@/components/blocks";
import { Bookmark, Dot, Squiggle, Star } from "@/components/Decor";
import { ChatIcon, FlagIcon, MedalIcon, SlackIcon } from "@/components/icons";
import { Mascot } from "@/components/Mascot";
import { RankAvatar } from "@/components/rank-avatar/RankAvatar";
import type { RankStep } from "@/config/ranks";
import { TEAM_IDS, TEAMS } from "@/config/teams";
import { participation } from "@/domain/leaderboard";
import { getRank, rankProgress } from "@/domain/ranks";
import { getDayStatus, type DayStatus } from "@/domain/schedule";
import { formatThaiDay, workweekOf } from "@/domain/time";
import { shortName } from "@/domain/names";
import { getAnnouncements, getConfig, getLeaderboard, getNow, getViewer, isSlackConfigured } from "@/server/data";
import type { Announcement, TeamStanding, Viewer } from "@/server/types";

export default async function HomePage() {
  const [viewer, { schedule, ranks }] = await Promise.all([getViewer(), getConfig()]);
  const status = getDayStatus(schedule, getNow());
  return viewer ? (
    <MemberHome viewer={viewer} status={status} ranks={ranks} eventStart={schedule.eventStart} />
  ) : (
    <GuestHome eventStart={schedule.eventStart} eventEnd={schedule.eventEnd} />
  );
}

/* ---------- ยังไม่ล็อกอิน (H0) ---------- */

async function GuestHome({ eventStart, eventEnd }: { eventStart: string; eventEnd: string }) {
  const slackReady = isSlackConfigured();
  return (
    <main className="relative flex flex-col items-center gap-4 px-4 pt-10">
      <Squiggle className="absolute top-6 left-4" />
      <Star className="absolute top-6 right-4" fill="var(--paper)" size={56} />
      <Dot className="absolute top-[270px] left-5" fill="var(--orange)" />
      <Bookmark className="absolute top-[250px] right-5" />

      <Image src="/logo-jamsai-battle.png" alt="แจ่มใส Battle ปฏิบัติการอ่านสู้ศึก" width={280} height={280} priority />

      <div className="flex flex-wrap justify-center gap-2">
        <span className="rounded-full bg-ink px-3.5 py-1.5 font-display text-[14px] font-semibold text-sun">
          {formatThaiDay(eventStart)} – {formatThaiDay(eventEnd)} 2569
        </span>
        <span className="chip bg-paper px-3.5 py-1.5 text-[14px]">จ–ศ วันละ 1 รอบ</span>
      </div>

      <section className="card flex w-full flex-col gap-3 p-[18px]">
        <h1 className="text-center font-display text-[22px] leading-[1.3] font-semibold">
          อ่าน · ตอบ · เล่น
          <br />
          สู้เพื่อทีมของคุณ
        </h1>
        {/* โมดูล 3 จะเปลี่ยนเป็น signIn("slack") */}
        <button
          type="button"
          disabled={!slackReady}
          className="flex min-h-[56px] items-center justify-center gap-2.5 rounded-2xl border-[3px] border-ink bg-ink font-display text-[17px] font-semibold text-paper disabled:opacity-60"
          style={{ boxShadow: "4px 4px 0 var(--sun)" }}
        >
          <SlackIcon />
          เข้าสู่ระบบด้วย Slack
        </button>
        <p className="text-center text-[13px] text-ink-soft">
          {slackReady ? (
            <>
              ใช้บัญชี Slack ของบริษัท ครั้งแรกครั้งเดียว
              <br />
              ครั้งต่อไปเข้าได้เลย
            </>
          ) : (
            "ระบบล็อกอินกำลังเชื่อมกับ Slack เร็วๆ นี้"
          )}
        </p>
      </section>

      <section className="card flex w-full flex-col gap-2.5 bg-sun p-4">
        <SectionHeader title="ประกาศ" aside={<span className="chip bg-paper">ใหม่</span>} />
        <GuestNotice icon={<ChatIcon />} tone="var(--sky)" title={`เปิดศึก ${formatThaiDay(eventStart)}`} body="สัปดาห์แรกอ่าน 2 บท Caring · Trusted" />
        <GuestNotice icon={<MedalIcon />} tone="var(--pink)" title="เล่นครบ 5 วัน" body="รับแต้มพิเศษ + เหรียญ True Reader" />
      </section>

      <section className="card flex w-full flex-col gap-3 p-4">
        <SectionHeader title="3 ทีม 1 สนามรบ" />
        <div className="grid grid-cols-3 gap-2.5">
          {TEAM_IDS.map((id) => (
            <div key={id} className="flex flex-col items-center gap-1.5 rounded-[14px] border-[2.5px] border-ink px-1 py-2.5" style={{ background: TEAMS[id].bg }}>
              <FlagIcon color={TEAMS[id].color} size={34} />
              <b className="font-display text-[15px] font-semibold">{id}</b>
              <span className="text-[12px]">{TEAMS[id].name}</span>
            </div>
          ))}
        </div>
        <Link href="/dashboard" className="flex min-h-11 items-center justify-center text-[14px] font-semibold underline underline-offset-4">
          ดูอันดับตอนนี้ได้เลย ไม่ต้องล็อกอิน
        </Link>
      </section>
    </main>
  );
}

function GuestNotice({ icon, tone, title, body }: { icon: React.ReactNode; tone: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[14px] border-[2.5px] border-ink bg-paper px-3 py-2.5">
      <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] border-2 border-ink" style={{ background: tone }}>
        {icon}
      </span>
      <span className="text-[14px] leading-[1.45]">
        <b>{title}</b>
        <br />
        {body}
      </span>
    </div>
  );
}

/* ---------- ล็อกอินแล้ว (H1) ---------- */

async function MemberHome({ viewer, status, ranks, eventStart }: { viewer: Viewer; status: DayStatus; ranks: RankStep[]; eventStart: string }) {
  const [{ teams }, announcements] = await Promise.all([getLeaderboard(), getAnnouncements()]);
  const rank = getRank(viewer.totalScore, ranks);
  const progress = rankProgress(viewer.totalScore, ranks);
  const week = workweekOf(status.dateKey);
  const playedThisWeek = week.filter((d) => viewer.playedDates.includes(d)).length;
  const myTeam = teams.find((t) => t.team === viewer.team);

  return (
    <main className="relative flex flex-col gap-4 px-4">
      <Squiggle className="absolute top-2 left-1/2 -translate-x-1/2" />
      <header className="relative flex items-center justify-between gap-2.5 pt-10 pb-1">
        <Image src="/logo-jamsai-battle.png" alt="แจ่มใส Battle" width={88} height={88} priority />
        <Link
          href="/profile"
          className="flex min-h-11 items-center gap-2.5 rounded-full border-[2.5px] border-ink bg-paper py-1 pr-3.5 pl-1"
          style={{ boxShadow: "3px 3px 0 var(--ink)" }}
        >
          <RankAvatar name={viewer.name} score={viewer.totalScore} ranks={ranks} photoUrl={viewer.avatarUrl} team={viewer.team} size={44} />
          <span className="flex flex-col leading-[1.2]">
            <b className="text-[14px]">{shortName(viewer.name)}</b>
            <span className="text-[12px] font-semibold">
              แรงค์ {rank.rank} · {viewer.team}
            </span>
          </span>
        </Link>
      </header>

      {announcements.length > 0 && (
        <Announcements items={announcements} playedThisWeek={playedThisWeek} myTeam={myTeam} />
      )}

      <TodayCard status={status} viewer={viewer} eventStart={eventStart} />

      <section className="card flex flex-col gap-2.5 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <RankAvatar name={viewer.name} score={viewer.totalScore} ranks={ranks} photoUrl={viewer.avatarUrl} team={viewer.team} size={56} />
          <span className="flex flex-1 flex-col">
            <b className="font-display text-[18px] font-semibold">
              แรงค์ {rank.rank} · {viewer.totalScore} คะแนน
            </b>
            <span className="text-[13px]">
              <NextRankText score={viewer.totalScore} ranks={ranks} />
            </span>
          </span>
        </div>
        <ProgressBar fraction={progress.fraction} color="var(--sky)" />
        <WeekStamps days={week} playedDates={viewer.playedDates} today={status.dateKey} />
      </section>

      <section className="card flex flex-col gap-2.5 px-4 py-3.5">
        <SectionHeader
          title="สนามรบตอนนี้"
          aside={
            <Link href="/dashboard" className="font-semibold underline underline-offset-4">
              ดูทั้งหมด
            </Link>
          }
        />
        {teams.map((t, i) => (
          <TeamRow key={t.team} position={i + 1} team={t.team} score={t.score} mine={t.team === viewer.team} />
        ))}
        <span className="text-[12px] text-ink-soft">คะแนนทีม = คะแนนเฉลี่ยต่อคน + โบนัสทีม</span>
      </section>
    </main>
  );
}

function Announcements({ items, playedThisWeek, myTeam }: { items: Announcement[]; playedThisWeek: number; myTeam?: TeamStanding }) {
  return (
    <section aria-label="โบนัสและประกาศ" className="flex flex-col gap-2">
      <SectionHeader title="โบนัส & ประกาศ" aside={<span className="font-semibold">{items.length} รายการ</span>} />
      {/* การ์ดปัดแนวนอน ไม่เลื่อนเอง (ข้อ 8.5 Motion) */}
      <ul className="-mr-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pr-4 pb-2 [scrollbar-width:none]">
        {items.map((a) => (
          <li key={a.id} className="w-[280px] flex-none snap-start">
            <AnnouncementCard item={a} playedThisWeek={playedThisWeek} myTeam={myTeam} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function AnnouncementCard({ item, playedThisWeek, myTeam }: { item: Announcement; playedThisWeek: number; myTeam?: TeamStanding }) {
  const tones: Record<Announcement["kind"], { bg: string; tag: string; tagBg: string; tagInk: string }> = {
    "every-round": { bg: "var(--sun)", tag: "EVERY ROUND BONUS", tagBg: "var(--ink)", tagInk: "var(--sun)" },
    "all-in": { bg: "var(--team-wh-bg)", tag: "ALL-IN BONUS", tagBg: "var(--team-wh)", tagInk: "var(--paper)" },
    "double-point": { bg: "var(--pink)", tag: "DOUBLE POINT", tagBg: "var(--ink)", tagInk: "var(--paper)" },
    info: { bg: "var(--paper)", tag: "ประกาศ", tagBg: "var(--ink)", tagInk: "var(--paper)" },
  };
  const tone = tones[item.kind];
  const p = myTeam && participation(myTeam.playedThisWeek, myTeam.members);
  return (
    <div
      className="flex h-full flex-col gap-2 rounded-[20px] border-[3px] border-ink p-3.5"
      style={{ background: tone.bg, boxShadow: "4px 4px 0 var(--ink)" }}
    >
      <span className="self-start rounded-full px-2.5 py-0.5 text-[11.5px] font-bold tracking-[.06em]" style={{ background: tone.tagBg, color: tone.tagInk }}>
        {tone.tag}
      </span>
      <b className="font-display text-[19px] leading-[1.25] font-semibold whitespace-pre-line">{item.title}</b>
      {item.body && <span className="text-[13px]">{item.body}</span>}
      {item.kind === "every-round" && (
        <div className="flex items-center gap-[5px]" aria-label={`เล่นแล้ว ${playedThisWeek} จาก 5 วัน`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="h-2.5 w-[26px] rounded-full border-2 border-ink" style={{ background: i < playedThisWeek ? "var(--matcha)" : "var(--paper)" }} />
          ))}
          <span className="ml-1 text-[12.5px] font-semibold">{playedThisWeek}/5</span>
        </div>
      )}
      {item.kind === "all-in" && myTeam && p && (
        <span className="text-[13px]">
          {myTeam.team} ตอนนี้ {Math.round(p.fraction * 100)}%{p.needed > 0 ? ` · อีก ${p.needed} คน` : " · ได้โบนัสแล้ว"}
        </span>
      )}
    </div>
  );
}

/** การ์ดหลักของวัน — เปลี่ยนตามสถานะ (ข้อ 8 หน้าใน flow ข้อ 5–6) */
function TodayCard({ status, viewer, eventStart }: { status: DayStatus; viewer: Viewer; eventStart: string }) {
  let tag = "";
  let title = "";
  let sub = "";
  let action: React.ReactNode = null;

  switch (status.kind) {
    case "quiz":
      tag = `สัปดาห์ ${status.week.week} · ${status.week.chapters.map((c) => (c.chapter ? `บท ${c.chapter}` : c.title)).join(" + ")}`;
      if (viewer.todayDone) {
        title = "วันนี้ทำครบแล้ว";
        sub = "พรุ่งนี้มาต่อได้เลย";
      } else {
        title = "เริ่มคำถามวันนี้";
        sub = "5 ข้อ · ราว 3 นาที";
        action = (
          <Link href="/play" className="btn-primary mt-1.5 min-h-11 self-start rounded-full px-4 text-[15px]">
            เริ่มเลย
          </Link>
        );
      }
      break;
    case "survey":
      tag = `สัปดาห์ ${status.week.week} · แบบสอบถาม`;
      title = "วันนี้เป็นแบบสอบถาม";
      sub = "แบบสอบถามจะเปิดให้ทำเร็วๆ นี้";
      break;
    case "weekend":
      tag = "เสาร์–อาทิตย์";
      title = "วันนี้ไม่มีจ้าา";
      sub = "เจอกันวันจันทร์ · ยังดูอันดับได้นะ";
      break;
    case "before":
      tag = "ใกล้เปิดศึก";
      title = `เปิดศึก ${formatThaiDay(eventStart)}`;
      sub = "อ่านบทที่ 1–2 รอไว้ได้เลย";
      break;
    case "after":
      tag = "จบกิจกรรม";
      title = "ขอบคุณที่ร่วมสู้ศึก";
      sub = "ดูอันดับสุดท้ายได้ที่ Dashboard";
      break;
  }

  return (
    <section className="card flex items-center gap-2 py-3.5 pr-2.5 pl-4">
      <div className="flex flex-1 flex-col gap-1">
        <span className="self-start rounded-md border-2 border-ink px-2 py-0.5 text-[11.5px] font-semibold">{tag}</span>
        <h2 className="font-display text-[23px] leading-[1.15] font-semibold">{title}</h2>
        <p className="text-[13.5px]">{sub}</p>
        {action}
      </div>
      <Mascot size={96} />
    </section>
  );
}
