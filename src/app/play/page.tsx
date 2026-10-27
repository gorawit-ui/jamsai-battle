import Link from "next/link";
import { Mascot } from "@/components/Mascot";

// หน้าควิซ/เกมจะทำในโมดูล 4–5 หลังทีม HR รีวิวคำถามเสร็จ
export default function PlayPlaceholder() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center gap-4 bg-paper px-4">
      <Mascot size={120} />
      <h1 className="font-display text-[22px] font-semibold">ส่วนคำถามกำลังเตรียม</h1>
      <p className="text-center text-[15px] text-ink-soft">ทีมกำลังรีวิวคลังคำถามอยู่ เปิดให้เล่นก่อนวันเปิดศึกแน่นอน</p>
      <Link href="/" className="btn-primary w-full">
        กลับหน้าแรก
      </Link>
    </main>
  );
}
