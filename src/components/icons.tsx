import type { SVGProps } from "react";

// ไอคอนลายเส้นจากไฟล์ดีไซน์ V3 — เส้นดำ 2.4px ปลายมน
const line = {
  fill: "none",
  stroke: "var(--ink)",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function HomeIcon({ size = 22, ...p }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" {...line} {...p}>
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function TrophyIcon({ size = 22, ...p }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" {...line} {...p}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M8 21h8M10 17h4" />
    </svg>
  );
}

export function BookIcon({ size = 22, ...p }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" {...line} {...p}>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 21V5M8 7h7" />
    </svg>
  );
}

export function PersonIcon({ size = 22, ...p }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" {...line} {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </svg>
  );
}

export function LockIcon({ size = 22, ...p }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" {...line} {...p}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function ChatIcon({ size = 22, ...p }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" {...line} {...p}>
      <path d="M4 5h16v11H9l-5 4z" />
    </svg>
  );
}

export function MedalIcon({ size = 22, ...p }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" {...line} {...p}>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13l-2 8 5-3 5 3-2-8" />
    </svg>
  );
}

export function TrendIcon({ size = 26, ...p }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" {...line} {...p}>
      <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
    </svg>
  );
}

export function SlackIcon({ size = 22, ...p }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--sun)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M9 9h6M9 12h4" />
    </svg>
  );
}

export function CrownIcon({ size = 44, ...p }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size * 0.6} viewBox="0 0 50 30" {...p}>
      <path d="M5 26 L3 6 L15 15 L25 3 L35 15 L47 6 L45 26 Z" fill="var(--sun)" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}

/** ธงทีม — สีจาก token ทีม */
export function FlagIcon({ color, size = 26 }: { color: string; size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24">
      <path d="M5 22V3" stroke="var(--ink)" strokeWidth={2.4} strokeLinecap="round" />
      <path d="M6 4h12l-3 4 3 4H6z" fill={color} stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}
