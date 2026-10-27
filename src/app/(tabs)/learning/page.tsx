import { ProgressBar } from "@/components/blocks";
import { LockIcon } from "@/components/icons";
import type { Chapter, Week } from "@/config/schedule";
import { bookshelf } from "@/domain/bookshelf";
import { weekState, type WeekState } from "@/domain/schedule";
import { bangkokDateKey, formatThaiDay, formatThaiRange } from "@/domain/time";
import { getConfig, getNow, getViewer } from "@/server/data";

export default async function LearningPage() {
  const [{ schedule }, viewer] = await Promise.all([getConfig(), getViewer()]);
  const today = bangkokDateKey(getNow());
  const slots = bookshelf(schedule, viewer?.playedDates ?? [], today);
  const earned = slots.filter((s) => s.state === "earned").length;

  // สัปดาห์ที่เปิดอยู่ขึ้นก่อน ตามด้วยที่ผ่านแล้ว แล้วจึงสัปดาห์ที่ยังล็อก
  const order: Record<WeekState, number> = { now: 0, done: 1, locked: 2 };
  const weeks = [...schedule.weeks].sort((a, b) => order[weekState(a, today)] - order[weekState(b, today)] || a.week - b.week);

  return (
    <main className="flex flex-col gap-3 px-4 pt-10">
      <h1 className="page-title mb-1">Learning</h1>

      {viewer && (
        <section className="card flex flex-col gap-2.5 px-4 py-3.5">
          <div className="flex items-baseline justify-between">
            <b className="font-display text-[17px] font-semibold">อ่านแล้ว {earned} จาก 10 บท</b>
          </div>
          <ProgressBar fraction={earned / 10} color="var(--matcha)" />
        </section>
      )}

      {weeks.map((w) => (
        <WeekCard key={w.week} week={w} state={weekState(w, today)} />
      ))}

      <p className="text-center font-cheer text-[14px] font-semibold">เนื้อหาและคลิปทยอยเปิดตามสัปดาห์</p>
    </main>
  );
}

function WeekCard({ week, state }: { week: Week; state: WeekState }) {
  const locked = state === "locked";
  const tag = state === "now" ? "เปิดอยู่" : state === "done" ? "ผ่านแล้ว" : `เปิด ${formatThaiDay(week.start)}`;
  const book = week.chapters[0]?.book ?? 1;
  const title = week.week === 7 ? "สัปดาห์ 7 · โค้งสุดท้าย" : `สัปดาห์ ${week.week} · เล่ม ${book}`;
  const sub = [formatThaiRange(week.start, week.end), week.doublePoint ? "Double Point" : null].filter(Boolean).join(" · ");

  return (
    <section
      className="flex flex-col gap-2 rounded-[20px] border-[3px] border-ink px-3.5 py-3"
      style={{
        background: locked ? "var(--locked-bg)" : "var(--paper)",
        borderStyle: locked ? "dashed" : "solid",
        boxShadow: state === "now" ? "5px 5px 0 var(--sun), 5px 5px 0 3px var(--ink)" : state === "done" ? "4px 4px 0 var(--ink)" : undefined,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex flex-col">
          <h2 className="font-display text-[16px] font-semibold">{title}</h2>
          <span className="text-[12.5px] text-ink-soft">{sub}</span>
        </span>
        <span
          className="chip px-2.5 py-[3px] text-[12px] font-bold whitespace-nowrap"
          style={{ background: state === "now" ? "var(--sun)" : state === "done" ? "var(--team-fac-bg)" : "var(--paper)" }}
        >
          {tag}
        </span>
      </div>
      <ul>
        {week.chapters.map((c) => (
          <ChapterRow key={c.id} chapter={c} locked={locked} />
        ))}
      </ul>
    </section>
  );
}

function ChapterRow({ chapter, locked }: { chapter: Chapter; locked: boolean }) {
  const name = chapter.chapter ? `บทที่ ${chapter.chapter} · ${chapter.title}` : chapter.title;
  return (
    <li className="flex items-center gap-2.5 border-t-2 border-dashed border-line pt-2 pb-1">
      <span
        aria-hidden
        className="h-[34px] w-3.5 flex-none rounded-[3px] border-[2.5px]"
        style={{
          borderColor: locked ? "var(--muted)" : "var(--ink)",
          background: locked ? "transparent" : chapter.book === 1 ? "var(--matcha)" : "var(--sun)",
        }}
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <b className="text-[14px]">{name}</b>
        <span className="text-[12px] text-ink-soft">{chapter.sub}</span>
      </span>
      {locked ? (
        <LockIcon aria-label="ยังไม่เปิด" />
      ) : (
        <span className="flex gap-1.5">
          <ContentLink href={chapter.readUrl} label="อ่าน" primary />
          <ContentLink href={chapter.clipUrl} label="คลิป" />
        </span>
      )}
    </li>
  );
}

/** ลิงก์เนื้อหาใส่ตามหลัง (ข้อ 8 Learning) — ยังไม่มีลิงก์ให้แสดงปุ่มกดไม่ได้ */
function ContentLink({ href, label, primary }: { href?: string; label: string; primary?: boolean }) {
  const cls = `grid min-h-11 min-w-12 place-items-center rounded-[10px] border-[2.5px] border-ink px-3 font-display text-[13px] font-semibold ${
    primary ? "bg-sun" : "bg-paper"
  }`;
  if (!href) {
    return (
      <span className={`${cls} opacity-45`} aria-disabled="true" title="เนื้อหากำลังมา">
        {label}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {label}
    </a>
  );
}
