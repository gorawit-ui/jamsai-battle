import { BottomNav } from "@/components/BottomNav";

// เนื้อหาขึ้นกับวันที่ (เวลาไทย) และผู้ใช้ — ห้าม prerender ตอน build
export const dynamic = "force-dynamic";

export default function TabsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative mx-auto min-h-dvh max-w-[480px] overflow-x-clip">
      {/* เว้นที่ด้านล่าง ≥ 120px ให้แถบเมนู (ข้อ 8.4) */}
      <div className="pb-[136px]">{children}</div>
      <BottomNav />
    </div>
  );
}
