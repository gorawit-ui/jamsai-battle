import type { Metadata, Viewport } from "next";
import { Anuphan, Mali, Mitr } from "next/font/google";
import "./globals.css";

// ฟอนต์ 3 ตัวตามข้อ 8.3
const mitr = Mitr({ variable: "--font-mitr", subsets: ["thai", "latin"], weight: ["400", "500", "600", "700"] });
const anuphan = Anuphan({ variable: "--font-anuphan", subsets: ["thai", "latin"], weight: ["400", "500", "600", "700"] });
const mali = Mali({ variable: "--font-mali", subsets: ["thai", "latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  title: "แจ่มใส Battle — ปฏิบัติการอ่านสู้ศึก",
  description: "อ่าน · ตอบ · เล่น สู้เพื่อทีมของคุณ",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2f9bea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${mitr.variable} ${anuphan.variable} ${mali.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
