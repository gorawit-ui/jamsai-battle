"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, HomeIcon, PersonIcon, TrophyIcon } from "./icons";

const TABS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/dashboard", label: "Dashboard", Icon: TrophyIcon },
  { href: "/learning", label: "Learning", Icon: BookIcon },
  { href: "/profile", label: "Profile", Icon: PersonIcon },
] as const;

/** แถบเมนูล่าง 4 แท็บ ลอยห่างขอบล่าง 16px (ข้อ 8.4) */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="เมนูหลัก"
      className="card fixed inset-x-3 bottom-4 z-20 mx-auto grid max-w-[456px] grid-cols-4 gap-1 p-2"
      style={{ boxShadow: "4px 4px 0 var(--ink)", marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-[14px] text-[12px] font-semibold ${
              active ? "bg-sun" : ""
            }`}
          >
            <Icon />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
