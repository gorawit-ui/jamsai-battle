# ตั้งค่า Slack App สำหรับแจ่มใส Battle

ใช้ทำ 2 อย่าง: ให้พนักงาน **ล็อกอินด้วย Slack** (ได้ชื่อ อีเมล และรูปโปรไฟล์) และให้ระบบ **ตรวจว่าเป็นสมาชิก #all-general**
ทั้งหมดอยู่ฝั่ง server — browser ไม่เห็น token ใดๆ (brief ข้อ 4.5)

> ผู้ทำ: เบนซ์ (ต้องเป็น admin ของ Slack workspace TD หรือให้ admin กดอนุมัติแอป)
> ใช้เวลา ~10 นาที

## 1. สร้างแอปจาก manifest

1. เปิด <https://api.slack.com/apps> → **Create New App** → **From a manifest**
2. เลือก workspace ของ TD
3. เลือกแท็บ YAML แล้ววางเนื้อหาจาก [`slack-app-manifest.yaml`](./slack-app-manifest.yaml)
   - แก้ `redirect_urls` เป็น URL ของ Cloud Run ถ้ามีแล้ว (ดู [GCP_CLOUD_RUN.md](./GCP_CLOUD_RUN.md)) — ถ้ายังไม่มี ใส่ทีหลังได้ที่ **OAuth & Permissions → Redirect URLs**
4. กด **Create**

## 2. ติดตั้งเข้า workspace

1. เมนู **Install App** → **Install to Workspace** → **Allow**
   - ถ้า workspace ตั้งให้ admin อนุมัติแอป จะต้องรอ admin กดอนุมัติก่อน

2. ถ้าตอนทดสอบระบบแจ้ง `not_in_channel` ให้พิมพ์ `/invite @แจ่มใส Battle` ใน #all-general ครั้งเดียว

## 3. ค่าที่ต้องส่งให้ระบบ

| ค่า | อยู่ที่ไหน | ชื่อ secret |
|---|---|---|
| Client ID | Basic Information → App Credentials | `AUTH_SLACK_ID` |
| Client Secret | Basic Information → App Credentials | `AUTH_SLACK_SECRET` |
| Bot User OAuth Token (`xoxb-…`) | OAuth & Permissions | `SLACK_BOT_TOKEN` |
| Team ID (`T…`) | เปิด Slack บนเว็บ ดูใน URL `app.slack.com/client/T…/` | `SLACK_TEAM_ID` |
| Channel ID ของ #all-general | `C01E8HUTCRY` (เช็กแล้ว) | `SLACK_GATE_CHANNEL_ID` |

**ห้ามส่ง Client Secret หรือ Bot Token ทางแชต อีเมล หรือ commit ลง repo**
ให้ใส่ตรงใน Google Secret Manager (ขั้นที่ 5 ของ GCP_CLOUD_RUN.md) แล้วบอกผมแค่ว่า "ใส่แล้ว"
Client ID และ Team ID ไม่ใช่ความลับ ส่งในแชตได้

## สิทธิ์ที่แอปขอ และใช้ทำอะไร

| Scope | ประเภท | ใช้ทำอะไร |
|---|---|---|
| `openid` `profile` `email` | User (Sign in with Slack) | ล็อกอิน ได้ชื่อ อีเมล รูปโปรไฟล์ (สูงสุด 512px) |
| `channels:read` | Bot | ตรวจว่าผู้ใช้อยู่ใน #all-general และนับจำนวนพนักงาน |
| `users:read` | Bot | ดึงรูปใหญ่ `image_512` เมื่อ login ได้รูปเล็ก · กรองบัญชี bot/ปิดใช้งาน |
| `users:read.email` | Bot | จับคู่อีเมลกับรายชื่อทีมจาก HR |

แอปนี้**อ่านอย่างเดียว** ไม่ส่งข้อความ ไม่อ่านข้อความในช่องใดๆ
