# เปิด Google Cloud Run สำหรับแจ่มใส Battle

คู่มือสำหรับเบนซ์หรือพี่ทิม ทำครั้งเดียว ~45–60 นาที
ทำผ่านหน้าเว็บ <https://console.cloud.google.com> ได้ทั้งหมด (มีคำสั่ง `gcloud` ให้ด้วยสำหรับคนที่ใช้ Cloud Shell)

> **เรื่องค่าใช้จ่าย:** ผู้ใช้ ~80 คน วันละ 1 รอบ ใช้น้อยกว่าโควต้าฟรีของ Cloud Run และ Firestore มาก แต่ Google **บังคับผูกบัตร/บัญชีเรียกเก็บเงิน** ก่อนเปิดบริการ
> ขั้นที่ 2 ตั้ง budget alert ไว้ ถ้าเกินจะมีอีเมลเตือนทันที · ตรวจโควต้าฟรีล่าสุดได้ที่ <https://cloud.google.com/free>

## สรุปสิ่งที่จะสร้าง

| อะไร | ตั้งค่า | ใช้ทำอะไร |
|---|---|---|
| Project | เช่น `tdfb-jamsai-battle` | กล่องรวมทุกอย่าง |
| Firestore | Native mode · `(default)` · `asia-southeast1` | ฐานข้อมูล (**เลือก location แล้วเปลี่ยนไม่ได้**) |
| Artifact Registry | Docker repo `jamsai` · `asia-southeast1` · เก็บ 5 image | เก็บ image ของเว็บ |
| Secret Manager | 6 secrets (ขั้นที่ 5) | เก็บรหัส Slack ฯลฯ |
| Service account | `jamsai-run` | ตัวตนของเว็บตอนรัน |
| Cloud Build trigger | push ขึ้น `main` → build + deploy | deploy อัตโนมัติจาก GitHub |
| Cloud Run | service `jamsai-battle` · `asia-southeast1` · min 0 / max 2 | ตัวเว็บ |
| Cloud Scheduler | (ทำทีหลังในโมดูล 8) | งานคืนวันศุกร์ + sync ชีต |

## 1. สร้าง Project

1. Console → เมนูเลือกโปรเจกต์ด้านบน → **New Project**
2. ชื่อ `jamsai-battle` · Organization ของบริษัท (ถ้ามี) → **Create**
3. จด **Project ID** ไว้ (อาจมีตัวเลขต่อท้าย) — ส่งให้ผมได้

```sh
gcloud projects create tdfb-jamsai-battle --name="jamsai-battle"
gcloud config set project tdfb-jamsai-battle
```

## 2. ผูก Billing + ตั้ง Budget alert

1. **Billing** → Link a billing account → เลือกบัญชีบริษัท
2. **Billing → Budgets & alerts → Create budget**
   - Scope: เฉพาะ project นี้ · Amount: เช่น 300 บาท/เดือน
   - Alert ที่ 50% / 90% / 100% · ส่งอีเมลถึงเบนซ์และพี่ทิม

## 3. เปิด API ที่ใช้

**APIs & Services → Enable APIs** เปิดทั้งหมดนี้:
Cloud Run · Cloud Build · Artifact Registry · Secret Manager · Cloud Firestore · Cloud Scheduler · IAM

```sh
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  secretmanager.googleapis.com firestore.googleapis.com cloudscheduler.googleapis.com iam.googleapis.com
```

## 4. สร้าง Firestore และที่เก็บ image

**Firestore**: Console → Firestore → **Create database** → **Native mode** → Database ID `(default)` → Location **asia-southeast1 (Singapore)** → Production rules
(โควต้าฟรีใช้ได้กับ database `(default)` เท่านั้น)

**Artifact Registry**: Console → Artifact Registry → **Create repository**
- Name `jamsai` · Format Docker · Region `asia-southeast1`
- Cleanup policies → Keep most recent versions = **5** (brief ข้อ 3)

```sh
gcloud firestore databases create --location=asia-southeast1 --type=firestore-native
gcloud artifacts repositories create jamsai --repository-format=docker --location=asia-southeast1
```

## 5. ใส่ Secrets

Console → **Secret Manager → Create secret** ทีละตัว (ค่า Slack ดูใน [SLACK_APP.md](./SLACK_APP.md)):

| ชื่อ secret | ค่า |
|---|---|
| `AUTH_SECRET` | สุ่มยาว 32+ ตัว — ใน Cloud Shell รัน `openssl rand -base64 33` |
| `AUTH_SLACK_ID` | Client ID |
| `AUTH_SLACK_SECRET` | Client Secret |
| `SLACK_BOT_TOKEN` | Bot token `xoxb-…` |
| `SLACK_TEAM_ID` | Team ID `T…` |
| `ADMIN_EMAILS` | `gorawit@tdfb.co,sirirat@tdfb.co` |

## 6. Service account ของเว็บ

Console → **IAM & Admin → Service Accounts → Create**
- Name `jamsai-run`
- Roles: **Cloud Datastore User** และ **Secret Manager Secret Accessor**

```sh
gcloud iam service-accounts create jamsai-run
PROJECT=$(gcloud config get-value project)
for role in roles/datastore.user roles/secretmanager.secretAccessor; do
  gcloud projects add-iam-policy-binding $PROJECT \
    --member="serviceAccount:jamsai-run@$PROJECT.iam.gserviceaccount.com" --role=$role
done
```

## 7. เชื่อม GitHub → Cloud Build (deploy อัตโนมัติ)

1. Console → **Cloud Build → Repositories** → Region `asia-southeast1` → **Create host connection** → GitHub → อนุญาตแอป Google Cloud Build บน GitHub org **TDFB-TH** ให้เห็น repo `TDFB-TH/GM-Q4-Battle` (ต้องเป็น owner ของ org หรือให้ owner กดอนุมัติ)
2. **Link repository** → เลือก `GM-Q4-Battle`
3. **Triggers → Create trigger**
   - Region `asia-southeast1` · Event: Push to a branch · Branch `^main$`
   - Configuration: Cloud Build configuration file · `cloudbuild.yaml` (ผมจะเพิ่มไฟล์นี้ใน repo ตอนโมดูล 9)
   - Service account: ใช้ตัวที่มี role **Cloud Run Admin**, **Service Account User**, **Artifact Registry Writer**

## 8. Deploy ครั้งแรก

หลังผมเพิ่ม `cloudbuild.yaml` และ merge เข้า `main` แล้ว trigger จะ build และ deploy ให้เอง ค่าที่ตั้งไว้:

- Region `asia-southeast1` · Service `jamsai-battle` · Service account `jamsai-run`
- **Min instances 0** (ไม่เสียเงินตอนไม่มีคนใช้) · Max instances 2 · Memory 512 MiB · CPU 1
- **Allow unauthenticated** — เว็บเปิดสาธารณะ ส่วนสิทธิ์ตรวจด้วย Slack ในแอปเอง
- Secrets จากขั้นที่ 5 ผูกเป็น environment variables

ได้ URL หน้าตา `https://jamsai-battle-xxxxx.asia-southeast1.run.app` → เอาไปใส่ใน Slack App (Redirect URL) และ secret `AUTH_URL`

## สิ่งที่ส่งกลับมาให้ผม

- [ ] Project ID
- [ ] ยืนยันว่า Firestore อยู่ `asia-southeast1`
- [ ] ยืนยันว่าใส่ secrets ครบ (ไม่ต้องส่งค่า)
- [ ] Cloud Build trigger สร้างแล้ว
- [ ] (ถ้าต้องการให้ผมดู log/สถานะเอง) เพิ่มสิทธิ์ดูอย่างเดียว **Viewer** ให้บัญชีที่ใช้ทำงานกับผม
