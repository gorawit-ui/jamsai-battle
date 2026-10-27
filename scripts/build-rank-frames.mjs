// แปลงกรอบแรงค์ต้นฉบับ (docs/rank-frames) เป็น WebP สำหรับเว็บ + geometry ต่อแรงค์
// รัน: npm run build:frames — ผลลัพธ์ commit ไว้ใน repo ไม่ต้องรันตอน deploy
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "docs/rank-frames");
const OUT = path.join(ROOT, "public/rank-frames");
// 96 = leaderboard, 256 = การ์ดทั่วไป (ข้อ 9) · 512 = รูปใหญ่หน้า Profile บนจอความละเอียดสูง
const SIZES = [96, 256, 512];

const manifest = JSON.parse(await readFile(path.join(SRC, "asset-manifest.json"), "utf8"));

const geometry = [];
for (const r of manifest.ranks) {
  const file = path.basename(r.src, ".png");
  for (const size of SIZES) {
    await mkdir(path.join(OUT, String(size)), { recursive: true });
    await sharp(path.join(SRC, r.src))
      .resize(size, size)
      .webp({ quality: 88, alphaQuality: 100 })
      .toFile(path.join(OUT, String(size), `${file}.webp`));
  }
  // ไม่คัด minScore จาก manifest — เกณฑ์อยู่ที่ src/config/ranks.ts (ข้อ 5.3)
  geometry.push({
    rank: r.rank,
    file,
    photo: r.photo,
    accent: r.accent,
    sparkles: r.sparkles,
    animate: r.animate,
  });
}

await writeFile(
  path.join(ROOT, "src/config/rank-frames.json"),
  JSON.stringify({ sizes: SIZES, ranks: geometry }, null, 2) + "\n",
);
console.log(`built ${geometry.length} frames × ${SIZES.join("/")}px`);
