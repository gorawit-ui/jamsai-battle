// ของตกแต่งมุมจอ (ข้อ 8.5) — วางบนพื้นฟ้า/เหลืองเท่านั้น ห้ามทับเนื้อหา ห้ามใช้ในหน้าคำถาม

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden width="64" height="24" viewBox="0 0 64 24" className={className}>
      <path d="M6 16 q10 -14 20 0 t20 0" fill="none" stroke="var(--sun)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function Star({ className = "", fill = "var(--pink)", size = 64 }: { className?: string; fill?: string; size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 64 64" className={className}>
      <path
        d="M32 5 L39.6 23.6 L59.6 25 L44.3 37.9 L49.1 57.4 L32 46.8 L14.9 57.4 L19.7 37.9 L4.4 25 L24.4 23.6 Z"
        fill={fill}
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Dot({ className = "", fill = "var(--paper)" }: { className?: string; fill?: string }) {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className={className}>
      <circle cx="8" cy="8" r="5.5" fill={fill} stroke="var(--ink)" strokeWidth="2.5" />
    </svg>
  );
}

export function Bookmark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden width="24" height="44" viewBox="0 0 24 44" className={className}>
      <path d="M3 2 h18 v40 l-9 -8 l-9 8 Z" fill="var(--pink)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}
