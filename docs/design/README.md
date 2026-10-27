# ดีไซน์อ้างอิง — แจ่มใส Battle (V3)

ไฟล์ทั้งหมดในโฟลเดอร์นี้ export มาจาก canvas "Reading Rally — Design" บน claude.ai
**ใช้ V3 เป็นหลัก** · หน้าในขั้นตอนควิซ/เกม/สรุปผลยังไม่มีใน V3 ให้ใช้จาก V2

## ดูอะไรก่อน

1. `screens/` — ภาพหน้าจอ PNG (2×) ดูหน้าตาและการจัดวาง
2. `source/` — ไฟล์ต้นฉบับ `.dc.html` ใช้ดูค่าที่แน่นอน (ขนาด สี ระยะ เงา) เพราะทุกค่าเขียนเป็น inline style
3. ค่ากลางของทั้งระบบ (สี ฟอนต์ ขอบ เงา น้ำเสียง) อยู่ใน `PROJECT_BRIEF.md` ข้อ 8 — **ถ้าในไฟล์ดีไซน์ต่างจาก brief ให้ยึด brief**

| หน้าจอ | ภาพ | ต้นฉบับ |
|---|---|---|
| Home (ยังไม่ล็อกอิน) | `screens/v3/H0-Login.png` | `source/v3/H0-Login.dc.html` |
| Home | `screens/v3/H1-Home.png` | `source/v3/H1-Home.dc.html` |
| Dashboard | `screens/v3/D-Dashboard.png` | `source/v3/D-Dashboard.dc.html` |
| Learning | `screens/v3/L-Learning.png` | `source/v3/L-Learning.dc.html` |
| Profile | `screens/v3/P-Profile.png` | `source/v3/P-Profile.dc.html` |
| กรอบแรงค์ (ภาพรวม) | `screens/v3/Ranks.png` | `source/v3/Ranks.dc.html` |
| ตอบคำถาม + เฉลย | `screens/v2/S2-Quiz.png` | `source/v2/S2-Quiz.dc.html` |
| สรุปผลควิซ | `screens/v2/S3-Result.png` | `source/v2/S3-Result.dc.html` |
| เลือกเกม | `screens/v2/S4-Game.png` | `source/v2/S4-Game.dc.html` |
| สรุปคะแนนวันนี้ | `screens/v2/S5-Summary.png` | `source/v2/S5-Summary.dc.html` |

## วิธีอ่านไฟล์ `.dc.html`

เป็นรูปแบบไฟล์ของเครื่องมือออกแบบ ไม่ใช่โค้ดที่ใช้งานจริง **ห้าม copy ไปใช้ตรงๆ** ให้ถอดเป็น React component + Tailwind ตาม `PROJECT_BRIEF.md`

- `<x-dc>` `<helmet>` — wrapper ของเครื่องมือ ไม่ต้องสนใจ
- `{{ name }}` · `<sc-for>` · `<sc-if>` — template วนลูป/เงื่อนไข ค่าจริงอยู่ใน `renderVals()` ท้ายไฟล์ (ใช้ใน `L-Learning`)
- ข้อมูลในหน้าจอ (ชื่อคน คะแนน %) เป็น **ตัวอย่าง** ของจริงต้องมาจาก Firestore

## ส่วนที่ไม่ตรงกับกติกาล่าสุด — ยึด brief

| ในดีไซน์ | ของจริง |
|---|---|
| มาสคอตหน้าควิซ/เกม/สรุป (V2) เป็นหนังสือปกเขียว | ใช้ตัวหนังสือจากโลโก้ (หน้าขาว ผ้าคาดหัวแดง มงกุฎ) เหมือนบนปุ่มเริ่มควิซใน V3 |
| กรอบแรงค์ใน `Ranks.png` / avatar ในหน้า V3 เป็นภาพร่าง | ใช้ PNG จริงจากแพ็กกรอบแรงค์ใน Google Drive (brief ข้อ 9) · **รูปทรงสี่เหลี่ยมในภาพร่างถูกต้องแล้ว** ห้ามทำเป็นวงกลม |
| รูปคนในภาพเป็นไอคอนคนสีขาว | ของจริงใช้รูปจาก Slack (brief ข้อ 9.2) |
| หน้าเลือกเกม "มีเวลา 15 วินาที" | เวลาตามกติกาใหม่: 20/15 วิ (จับคู่การ์ด 30/20 วิ) |
| ไอคอนธงทีมในรายการ | ใช้ไอคอนอาคารตามธงในโลโก้ได้ ถ้ามีไฟล์จากทีมออกแบบ |
| `ป้ายบท "สัปดาห์ 3 · บท 5 + รวมเล่ม 1"` | ข้อความมาจาก config ตารางสัปดาห์ |

## ไฟล์อื่นในโฟลเดอร์

- `logo-jamsai-battle.png` — โลโก้พื้นใส 640px (ลบพื้นขาวจากไฟล์ที่ได้มา) ถ้ามีไฟล์ต้นฉบับ SVG/PNG ความละเอียดสูงให้ใช้แทน
