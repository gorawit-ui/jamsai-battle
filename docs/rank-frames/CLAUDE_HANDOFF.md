# งานเชื่อมกรอบ Rank เข้ากับ Reading Rally

ใช้ไฟล์ในแพ็กนี้กับเว็บที่มีอยู่แล้ว ไม่เปลี่ยน flow ล็อกอินหรือคำนวณคะแนนเดิม

- คงลำดับ E > D > C > B > A > S > SSS > Legendary และ threshold ทุก 50 คะแนน
- ใช้รูปผู้ใช้ Slack จากข้อมูล session/profile ที่โครงการมีอยู่แล้ว ห้ามใส่ token ลง frontend
- ใช้ frames/rank-*.png เป็น overlay โปร่งใส รูปอยู่ข้างหลัง กรอบอยู่ข้างหน้า
- ต้องใช้ geometry ต่อ Rank ใน asset-manifest.json อย่าตั้ง inset เดียวทุก Rank
- object-fit:cover พร้อม clipPath ป้องกันภาพล้นช่อง โดยไม่ดัดแปลงหน้าผู้ใช้
- ดูตัวอย่างที่ทำงานได้ใน preview.html และนำ rank-avatar.js/CSS ไปปรับเป็น component
- คงวิ้บวับช้า ๆ และเพิ่มตาม Rank; E ไม่มีแอนิเมชัน; D ประกายภาพนิ่ง
- แอนิเมชันขยับเฉพาะแสง/ดาว ห้ามขยับทั้งกรอบจนรูปคลาดแนว
- รองรับ reduced-motion, ปิดเอฟเฟกต์ได้, ใช้ fallback ชื่อย่อเมื่อโหลดรูปไม่สำเร็จ
- ตรวจ Home, Dashboard และ Profile บนมือถือ รวมกรอบเล็กใน Leaderboard
- แสดงชื่อ Rank เป็นข้อความที่อ่านได้ด้วย screen reader แม้ใน PNG มีชื่ออยู่แล้ว
- ตรวจ 49/50,99/100,149/150,199/200,249/250,299/300,349/350

ตัวอย่าง vanilla JS:

```html
<link rel="stylesheet" href="/rank-frames/rank-avatar.css">
<div id="player-avatar"></div>
<script src="/rank-frames/rank-avatar.js"></script>
<script>
ReadingRallyFrames.mount(document.querySelector('#player-avatar'), {
  score: 117,
  name: 'ชื่อพนักงาน',
  photoUrl: slackProfileImageUrl,
  size: 160,
  assetBase: '/rank-frames/',
  motion: true
});
</script>
```
