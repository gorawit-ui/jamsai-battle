/**
 * มาสคอตชั่วคราว — ตัวหนังสือจากโลโก้ (หน้าขาว ผ้าคาดหัวแดง มงกุฎ) ถอดจาก H1-Home.dc.html
 * รอไฟล์ท่าทางจริงจากทีมออกแบบ: เชียร์ · คิด · ยังไม่ใช่ · ดีใจ · พัก
 * สีในภาพวาดนี้มาจากไฟล์ดีไซน์ ไม่ได้เป็น token ของ UI
 */
export function Mascot({ size = 100 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size * 1.14} viewBox="0 -6 160 186">
      <path d="M66 134 l-4 30 M94 134 l4 30" stroke="#17181C" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="58" cy="168" rx="11" ry="6" fill="#FF7A2F" stroke="#17181C" strokeWidth="3" />
      <ellipse cx="102" cy="168" rx="11" ry="6" fill="#FF7A2F" stroke="#17181C" strokeWidth="3" />
      <path d="M42 94 q-14 8 -18 22" fill="none" stroke="#17181C" strokeWidth="5" strokeLinecap="round" />
      <circle cx="24" cy="118" r="6" fill="#FFFDF5" stroke="#17181C" strokeWidth="3" />
      <path d="M118 90 q16 -6 20 -32" fill="none" stroke="#17181C" strokeWidth="5" strokeLinecap="round" />
      <circle cx="138" cy="56" r="7" fill="#FFFDF5" stroke="#17181C" strokeWidth="3" />
      <rect x="34" y="28" width="16" height="108" rx="5" fill="#2F7D49" stroke="#17181C" strokeWidth="4" />
      <rect x="42" y="28" width="76" height="108" rx="8" fill="#FFFDF5" stroke="#17181C" strokeWidth="4" />
      <rect x="112" y="28" width="10" height="108" rx="4" fill="#42A161" stroke="#17181C" strokeWidth="4" />
      <path d="M40 46 h82" stroke="#17181C" strokeWidth="13" />
      <path d="M40 46 h82" stroke="#E5483A" strokeWidth="8" />
      <path d="M122 46 l18 -10 M122 48 l16 10" stroke="#17181C" strokeWidth="8" strokeLinecap="round" />
      <path d="M122 46 l18 -10 M122 48 l16 10" stroke="#E5483A" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M84 4 L80 -6 L90 0 L97 -8 L104 0 L114 -6 L110 4 Z"
        transform="translate(-17 18)"
        fill="#FFDD3C"
        stroke="#17181C"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="68" cy="80" r="5" fill="#17181C" />
      <path d="M86 80 q6 -6 12 0" fill="none" stroke="#17181C" strokeWidth="4" strokeLinecap="round" />
      <path d="M70 98 q10 12 20 0 z" fill="#17181C" stroke="#17181C" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="56" cy="94" rx="6" ry="4" fill="#FF8FB8" />
      <ellipse cx="104" cy="94" rx="6" ry="4" fill="#FF8FB8" />
    </svg>
  );
}
