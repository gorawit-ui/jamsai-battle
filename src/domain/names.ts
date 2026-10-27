const LEADING_VOWELS = new Set(["เ", "แ", "โ", "ใ", "ไ"]);

/** พยัญชนะตัวแรก (ไม่เอาสระบน/ล่าง/วรรณยุกต์) · ถ้าขึ้นต้นด้วยสระหน้าให้ติดพยัญชนะถัดไปด้วย */
function firstLetter(word: string): string {
  const chars = Array.from(word);
  if (chars.length === 0) return "";
  return LEADING_VOWELS.has(chars[0]) && chars[1] ? chars[0] + chars[1] : chars[0].toUpperCase();
}

/** ชื่อย่อ 1–2 ตัวอักษรสำหรับ fallback ของรูปโปรไฟล์ (ข้อ 9.2) */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = firstLetter(words[0]);
  if (words.length === 1) return first;
  return first + firstLetter(words[1]);
}

/** "ปองภพ สุขใจ" → "ปองภพ ส." สำหรับตารางอันดับ */
export function shortName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return words[0] ?? "";
  return `${words[0]} ${firstLetter(words[1])}.`;
}
