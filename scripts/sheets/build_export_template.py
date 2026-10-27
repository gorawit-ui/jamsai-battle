"""ร่าง Google Sheet สำหรับเก็บคำตอบและวิเคราะห์ผลรายบุคคล (brief ข้อ 12)

ระบบจะเขียนข้อมูลดิบลง 3 แท็บ (Answers · Daily · People คอลัมน์ A–C) ทุกคืนผ่าน Cloud Scheduler
แท็บอื่นเป็นสูตรทั้งหมด ไม่ต้องแก้มือ

รัน: python3 -I scripts/sheets/build_export_template.py docs/sheets/jamsai-battle-results-template.xlsx
"""

import random
import sys
from datetime import date, datetime, timedelta

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

OUT = sys.argv[1]
FONT = "Arial"
HEAD_FILL = PatternFill("solid", fgColor="FFDD3C")  # --sun
INPUT_FILL = PatternFill("solid", fgColor="BFE3FF")  # --sky-light = ช่องให้กรอก/เลือก
SAMPLE_FILL = PatternFill("solid", fgColor="FFF4C7")  # --hint-bg = ข้อมูลตัวอย่าง
THIN = Side(style="thin", color="CFD3D8")

wb = Workbook()


def sheet(title, headers, widths):
    ws = wb.create_sheet(title)
    for i, (h, w) in enumerate(zip(headers, widths), start=1):
        c = ws.cell(row=1, column=i, value=h)
        c.font = Font(name=FONT, bold=True)
        c.fill = HEAD_FILL
        c.alignment = Alignment(vertical="center", wrap_text=True)
        c.border = Border(bottom=THIN)
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = "A2"
    return ws


def style_body(ws):
    for row in ws.iter_rows(min_row=2):
        for c in row:
            if c.font is None or c.font.name != FONT:
                c.font = Font(name=FONT, bold=c.font.bold if c.font else False)


# ---------- ข้อมูลตัวอย่าง (สมมุติทั้งหมด) ----------
rng = random.Random(9)
PEOPLE = [
    ("U-DEMO-01", "สมชาย ใจดี", "FAC"),
    ("U-DEMO-02", "สมหญิง รักอ่าน", "FAC"),
    ("U-DEMO-03", "วีระ กล้าหาญ", "WH"),
    ("U-DEMO-04", "มาลี ตั้งใจ", "WH"),
    ("U-DEMO-05", "ปิยะ ขยันดี", "SAMYAN"),
    ("U-DEMO-06", "อรทัย สุขสันต์", "SAMYAN"),
]
LEVELS = ["ง่าย", "ง่าย", "กลาง", "กลาง", "ยาก"]
DAYS = [date(2026, 11, 9) + timedelta(days=i) for i in range(4)] + [date(2026, 11, 16)]
QBANK = {1: [f"C1-{i:03d}" for i in range(1, 13)], 2: [f"C2-{i:03d}" for i in range(1, 13)], 3: [f"C3-{i:03d}" for i in range(1, 13)], 4: [f"C4-{i:03d}" for i in range(1, 13)]}
LEVEL_OF = {q: LEVELS[i % 5] for qs in QBANK.values() for i, q in enumerate(qs)}

answers, daily = [], []
seen = {}
for uid, name, team in PEOPLE:
    skill = rng.uniform(0.45, 0.9)
    for d in DAYS:
        if rng.random() < 0.18:
            continue  # วันที่ไม่ได้เล่น
        week = 1 if d.day <= 13 else 2
        chapters = [1, 2] if week == 1 else [3, 4]
        # ข้อที่เคยผิดดึงกลับมาก่อน (ข้อ 6)
        wrong_before = [q for (u, q), hist in seen.items() if u == uid and not hist[-1] and int(q[1]) in chapters][:2]
        picks = wrong_before + [q for q in rng.sample(QBANK[chapters[0]] + QBANK[chapters[1]], 8) if q not in wrong_before]
        correct_count = 0
        t0 = datetime(d.year, d.month, d.day, rng.randint(8, 17), rng.randint(0, 59))
        for n, q in enumerate(picks[:5], start=1):
            hist = seen.setdefault((uid, q), [])
            ok = rng.random() < skill + (0.15 if hist else 0)
            hist.append(ok)
            correct_count += ok
            key = "กขคง"[rng.randrange(4)]
            pick = key if ok else rng.choice([k for k in "กขคง" if k != key])
            answers.append([t0 + timedelta(seconds=40 * n), d, week, uid, name, team, n, q, 1, int(q[1]), LEVEL_OF[q], q.endswith("07"), pick, key, ok, len(hist), rng.randint(12, 55)])
        unlocked = correct_count >= 3
        mult = 2 if correct_count == 5 else 1.5 if unlocked else 0
        raw = rng.randint(2, 5) if unlocked else 0
        daily.append([d, week, uid, name, team, correct_count, unlocked, ("หาช่องสีเพี้ยน" if rng.random() < 0.5 else "ตบใบชา") if unlocked else "", (20 if mult == 2 else 15) if unlocked else 0, raw, mult, False, 0, 0, ""])

# ---------- README ----------
ws = wb.active
ws.title = "วิธีใช้"
readme = [
    ("แจ่มใส Battle — ผลการตอบรายบุคคล (ร่าง)", True),
    ("", False),
    ("ที่มาของข้อมูล", True),
    ("ระบบเว็บส่งข้อมูลเข้าแท็บ Answers, Daily และ People (คอลัมน์ A–C) ทุกคืนผ่าน Cloud Scheduler · ห้ามแก้ข้อมูลในแท็บเหล่านี้ด้วยมือ", False),
    ("แท็บอื่นคำนวณด้วยสูตรจากแท็บข้างบนทั้งหมด", False),
    ("แถวพื้นเหลืองอ่อนเป็นข้อมูลตัวอย่าง (ชื่อสมมุติ) ระบบจะล้างออกก่อนส่งข้อมูลจริงครั้งแรก", False),
    ("", False),
    ("แท็บ", True),
    ("รายบุคคล — เลือกชื่อในช่องสีฟ้า แล้วดูคะแนน แรงค์ ผลรายบท รายระดับ ประวัติรายวัน และข้อที่ยังไม่ผ่าน", False),
    ("People — สรุปทุกคน 1 แถวต่อคน (คะแนน แรงค์ วันที่เล่น % ถูก ผิด→ถูก ผิดซ้ำ ถูก→ผิด)", False),
    ("ภาพรวม — คะแนนทีม % คนเล่น ผลรายบท", False),
    ("รายข้อ — % ตอบผิดของแต่ละคำถาม ติดธงข้อที่ผิดเกินเกณฑ์", False),
    ("Daily — 1 แถวต่อคนต่อวัน (ควิซ เกม ตัวคูณ โบนัส รวมวัน)", False),
    ("Answers — 1 แถวต่อคำตอบ 1 ข้อ", False),
    ("Survey — คำตอบแบบสอบถาม 24–25 ธ.ค. (รอ HR ร่างคำถาม)", False),
    ("ตั้งค่า — เกณฑ์แรงค์ (brief ข้อ 5.3) เกณฑ์ข้อควรทบทวน และโบนัสทีม", False),
    ("", False),
    ("ความหมายของรูปแบบคำตอบ (Answers คอลัมน์ R)", True),
    ("ครั้งแรก = เจอข้อนี้ครั้งแรก · ผิด→ถูก = ครั้งก่อนผิด ครั้งนี้ถูก · ผิดซ้ำ = ผิดทั้งสองครั้ง · ถูก→ผิด = ครั้งก่อนถูก ครั้งนี้ผิด · ถูกซ้ำ = ถูกทั้งสองครั้ง", False),
    ("", False),
    ("สีของช่อง", True),
    ("ฟ้าอ่อน = ช่องให้เลือกหรือกรอก · เหลือง = หัวตาราง · เหลืองอ่อน = ข้อมูลตัวอย่าง", False),
]
for i, (text, bold) in enumerate(readme, start=1):
    c = ws.cell(row=i, column=1, value=text)
    c.font = Font(name=FONT, bold=bold, size=14 if i == 1 else 11)
ws.column_dimensions["A"].width = 120

# ---------- ตั้งค่า ----------
cfg = sheet("ตั้งค่า", ["แรงค์", "คะแนนขั้นต่ำ"], [14, 14])
for i, (r, m) in enumerate([("E", 0), ("D", 20), ("C", 50), ("B", 90), ("A", 140), ("S", 200), ("SSS", 270), ("Legendary", 350)], start=2):
    cfg.cell(row=i, column=1, value=r)
    cfg.cell(row=i, column=2, value=m).fill = INPUT_FILL
cfg["A1"].comment = Comment("Source: PROJECT_BRIEF.md ข้อ 5.3", "Claude")
cfg["D1"], cfg["E1"] = "ค่าตั้งต้น", "ค่า"
for c in (cfg["D1"], cfg["E1"]):
    c.font, c.fill = Font(name=FONT, bold=True), HEAD_FILL
cfg.column_dimensions["D"].width = 44
cfg.column_dimensions["E"].width = 10
settings = [
    ("ข้อควรทบทวน: % ตอบผิดมากกว่า", 0.5, "0%"),
    ("ข้อควรทบทวน: ต้องมีคนตอบอย่างน้อย (ครั้ง)", 5, "0"),
    ("All-In: % คนเล่นในสัปดาห์", 0.8, "0%"),
    ("โบนัสทีมสะสม FAC", 0, "0"),
    ("โบนัสทีมสะสม WH", 0, "0"),
    ("โบนัสทีมสะสม SAMYAN", 0, "0"),
]
for i, (label, val, fmt) in enumerate(settings, start=2):
    cfg.cell(row=i, column=4, value=label)
    c = cfg.cell(row=i, column=5, value=val)
    c.fill, c.number_format = INPUT_FILL, fmt
cfg["D2"].comment = Comment("Source: PROJECT_BRIEF.md ข้อ 12 (ข้อที่ผิดเกิน 50%)", "Claude")
cfg["D4"].comment = Comment("Source: PROJECT_BRIEF.md ข้อ 5.6 All-In", "Claude")
style_body(cfg)

# ---------- Answers ----------
ans = sheet(
    "Answers",
    ["ตอบเมื่อ", "วันที่", "สัปดาห์", "user_id", "ชื่อ", "ทีม", "ข้อที่", "รหัสคำถาม", "เล่ม", "บท", "ระดับ", "golden", "ตอบ", "เฉลย", "ถูก", "ครั้งที่เจอข้อนี้", "เวลาที่ใช้ (วิ)", "รูปแบบ"],
    [17, 11, 8, 12, 16, 9, 7, 12, 6, 6, 8, 8, 6, 6, 7, 9, 9, 10],
)
for r, row in enumerate(answers, start=2):
    for col, v in enumerate(row, start=1):
        c = ans.cell(row=r, column=col, value=v)
        if col == 1:
            c.fill = SAMPLE_FILL
    ans.cell(row=r, column=1).number_format = "yyyy-mm-dd hh:mm"
    ans.cell(row=r, column=2).number_format = "yyyy-mm-dd"
# ครั้งก่อนของข้อเดียวกัน คนเดียวกัน ผิดหรือถูก · สูตรเดียวคลุมแถวที่ระบบส่งเพิ่มมาเอง
ans["R2"] = '=ARRAYFORMULA(IF(D2:D="","",IF(P2:P<=1,"ครั้งแรก",IF(COUNTIFS(D2:D,D2:D,H2:H,H2:H,P2:P,P2:P-1,O2:O,FALSE)>0,IF(O2:O,"ผิด→ถูก","ผิดซ้ำ"),IF(O2:O,"ถูกซ้ำ","ถูก→ผิด")))))'
ans["A1"].comment = Comment("Source: ระบบเว็บแจ่มใส Battle (Firestore sessions/*/answers) ส่งออกทุกคืน · ตอนนี้เป็นข้อมูลตัวอย่าง", "Claude")
ans.auto_filter.ref = f"A1:R{len(answers) + 1}"
style_body(ans)

# ---------- Daily ----------
day = sheet(
    "Daily",
    ["วันที่", "สัปดาห์", "user_id", "ชื่อ", "ทีม", "ควิซถูก (ข้อ)", "ได้เล่นเกม", "เกม", "เวลาเกม (วิ)", "คะแนนเกมดิบ 1–5", "ตัวคูณ", "Double Point", "Golden (+)", "โบนัสรายคน", "ชื่อโบนัส", "คะแนนเกม", "รวมวัน"],
    [11, 8, 12, 16, 9, 9, 9, 14, 8, 10, 7, 9, 9, 9, 14, 9, 8],
)
for r, row in enumerate(daily, start=2):
    for col, v in enumerate(row, start=1):
        c = day.cell(row=r, column=col, value=v)
        if col == 1:
            c.fill = SAMPLE_FILL
    day.cell(row=r, column=1).number_format = "yyyy-mm-dd"
# brief ข้อ 5.1–5.2: คะแนนเกม = ปัดขึ้น(ดิบ × ตัวคูณ)
day["P2"] = '=ARRAYFORMULA(IF(C2:C="","",IF(G2:G,ROUNDUP(J2:J*K2:K,0),0)))'
# ข้อ 5.6: (ควิซ + เกม) × Double → + Golden → + โบนัสรายคน
day["Q2"] = '=ARRAYFORMULA(IF(C2:C="","",(F2:F+P2:P)*IF(L2:L,2,1)+M2:M+N2:N))'
day["A1"].comment = Comment("Source: ระบบเว็บแจ่มใส Battle (Firestore sessions) ส่งออกทุกคืน · ตอนนี้เป็นข้อมูลตัวอย่าง", "Claude")
day.auto_filter.ref = f"A1:Q{len(daily) + 1}"
style_body(day)

# ---------- People ----------
ppl = sheet(
    "People",
    ["user_id", "ชื่อ", "ทีม", "คะแนนรวม", "แรงค์", "วันที่เล่น", "ตอบทั้งหมด", "ตอบถูก", "% ถูก", "ถูกเฉลี่ย/วัน", "ได้เล่นเกม (วัน)", "ผิด→ถูก", "ผิดซ้ำ", "ถูก→ผิด", "เล่นล่าสุด"],
    [12, 18, 9, 10, 10, 9, 10, 9, 8, 10, 10, 9, 9, 9, 12],
)
for r, (uid, name, team) in enumerate(PEOPLE, start=2):
    for col, v in enumerate((uid, name, team), start=1):
        ppl.cell(row=r, column=col, value=v).fill = SAMPLE_FILL
PPL = {
    "D": '=ARRAYFORMULA(IF(A2:A="","",SUMIFS(Daily!Q2:Q,Daily!C2:C,A2:A)))',
    "E": "=ARRAYFORMULA(IF(A2:A=\"\",\"\",LOOKUP(D2:D,'ตั้งค่า'!B2:B9,'ตั้งค่า'!A2:A9)))",
    "F": '=ARRAYFORMULA(IF(A2:A="","",COUNTIFS(Daily!C2:C,A2:A)))',
    "G": '=ARRAYFORMULA(IF(A2:A="","",COUNTIFS(Answers!D2:D,A2:A)))',
    "H": '=ARRAYFORMULA(IF(A2:A="","",COUNTIFS(Answers!D2:D,A2:A,Answers!O2:O,TRUE)))',
    "I": '=ARRAYFORMULA(IF(A2:A="","",IF(G2:G=0,0,H2:H/G2:G)))',
    "J": '=ARRAYFORMULA(IF(A2:A="","",IF(F2:F=0,0,H2:H/F2:F)))',
    "K": '=ARRAYFORMULA(IF(A2:A="","",COUNTIFS(Daily!C2:C,A2:A,Daily!G2:G,TRUE)))',
    "L": '=ARRAYFORMULA(IF(A2:A="","",COUNTIFS(Answers!D2:D,A2:A,Answers!R2:R,L1)))',
    "M": '=ARRAYFORMULA(IF(A2:A="","",COUNTIFS(Answers!D2:D,A2:A,Answers!R2:R,M1)))',
    "N": '=ARRAYFORMULA(IF(A2:A="","",COUNTIFS(Answers!D2:D,A2:A,Answers!R2:R,N1)))',
    "O": '=BYROW(A2:A,LAMBDA(u,IF(u="","",MAXIFS(Daily!A2:A,Daily!C2:C,u))))',
}
for col, formula in PPL.items():
    ppl[f"{col}2"] = formula
for r in range(2, 101):
    ppl[f"I{r}"].number_format = "0%"
    ppl[f"J{r}"].number_format = "0.0"
    ppl[f"O{r}"].number_format = "yyyy-mm-dd"
ppl["A1"].comment = Comment("Source: คอลัมน์ A–C ระบบส่งออกจาก Firestore users · คอลัมน์ D เป็นต้นไปเป็นสูตร", "Claude")
style_body(ppl)

# ---------- รายบุคคล ----------
per = wb.create_sheet("รายบุคคล", 1)
for col, w in zip("ABCDEFGH", [22, 14, 12, 12, 4, 14, 14, 12]):
    per.column_dimensions[col].width = w
per["A1"] = "วิเคราะห์รายบุคคล"
per["A1"].font = Font(name=FONT, bold=True, size=14)
per["A3"], per["B3"] = "เลือกชื่อ", PEOPLE[0][1]
per["B3"].fill = INPUT_FILL
per["B3"].font = Font(name=FONT, bold=True)
dv = DataValidation(type="list", formula1="=People!$B$2:$B$500", allow_blank=False)
per.add_data_validation(dv)
dv.add("B3")
per.merge_cells("B3:D3")

ROW = "MATCH($B$3,People!$B$2:$B,0)"
stats = [
    ("user_id", f"=INDEX(People!$A$2:$A,{ROW})", None),
    ("ทีม", f"=INDEX(People!$C$2:$C,{ROW})", None),
    ("คะแนนรวม", f"=INDEX(People!$D$2:$D,{ROW})", "0"),
    ("แรงค์", f"=INDEX(People!$E$2:$E,{ROW})", None),
    ("วันที่เล่น", f"=INDEX(People!$F$2:$F,{ROW})", "0"),
    ("% ตอบถูก", f"=INDEX(People!$I$2:$I,{ROW})", "0%"),
    ("ถูกเฉลี่ย/วัน", f"=INDEX(People!$J$2:$J,{ROW})", "0.0"),
    ("ได้เล่นเกม (วัน)", f"=INDEX(People!$K$2:$K,{ROW})", "0"),
    ("ผิด→ถูก", f"=INDEX(People!$L$2:$L,{ROW})", "0"),
    ("ผิดซ้ำ", f"=INDEX(People!$M$2:$M,{ROW})", "0"),
    ("ถูก→ผิด", f"=INDEX(People!$N$2:$N,{ROW})", "0"),
    ("เล่นล่าสุด", f"=INDEX(People!$O$2:$O,{ROW})", "yyyy-mm-dd"),
]
for i, (label, formula, fmt) in enumerate(stats, start=5):
    per.cell(row=i, column=1, value=label)
    c = per.cell(row=i, column=2, value=formula)
    if fmt:
        c.number_format = fmt
UID = "$B$5"

# ผลรายบท
per["D5"] = "ผลรายบท"
per["D5"].font = Font(name=FONT, bold=True)
for col, h in zip("DEFGH", ["เล่ม", "บท", "ตอบ", "ถูก", "% ถูก"]):
    c = per[f"{col}6"]
    c.value, c.font, c.fill = h, Font(name=FONT, bold=True), HEAD_FILL
r = 7
for book in (1, 2):
    for ch in range(1, 6):
        per[f"D{r}"], per[f"E{r}"] = book, ch
        per[f"F{r}"] = f"=COUNTIFS(Answers!$D$2:$D,{UID},Answers!$I$2:$I,$D{r},Answers!$J$2:$J,$E{r})"
        per[f"G{r}"] = f"=COUNTIFS(Answers!$D$2:$D,{UID},Answers!$I$2:$I,$D{r},Answers!$J$2:$J,$E{r},Answers!$O$2:$O,TRUE)"
        per[f"H{r}"] = f"=IF($F{r}=0,\"\",$G{r}/$F{r})"
        per[f"H{r}"].number_format = "0%"
        r += 1

# ผลรายระดับ
per["A19"] = "ผลรายระดับ"
per["A19"].font = Font(name=FONT, bold=True)
for col, h in zip("ABCD", ["ระดับ", "ตอบ", "ถูก", "% ถูก"]):
    c = per[f"{col}20"]
    c.value, c.font, c.fill = h, Font(name=FONT, bold=True), HEAD_FILL
for i, lv in enumerate(["ง่าย", "กลาง", "ยาก"], start=21):
    per[f"A{i}"] = lv
    per[f"B{i}"] = f"=COUNTIFS(Answers!$D$2:$D,{UID},Answers!$K$2:$K,$A{i})"
    per[f"C{i}"] = f"=COUNTIFS(Answers!$D$2:$D,{UID},Answers!$K$2:$K,$A{i},Answers!$O$2:$O,TRUE)"
    per[f"D{i}"] = f"=IF($B{i}=0,\"\",$C{i}/$B{i})"
    per[f"D{i}"].number_format = "0%"

# ประวัติรายวัน
per["A26"] = "ประวัติรายวัน"
per["A26"].font = Font(name=FONT, bold=True)
for col, h, src in zip("ABCDE", ["วันที่", "ควิซถูก", "เกม", "คะแนนเกม", "รวมวัน"], "AFHPQ"):
    c = per[f"{col}27"]
    c.value, c.font, c.fill = h, Font(name=FONT, bold=True), HEAD_FILL
    per[f"{col}28"] = f'=IFERROR(FILTER(Daily!${src}$2:${src},Daily!$C$2:$C={UID}),"")'
per["A28"].number_format = "yyyy-mm-dd"
for i in range(28, 60):
    per[f"A{i}"].number_format = "yyyy-mm-dd"

# ข้อที่ยังไม่ผ่าน
per["G26"] = "ข้อที่ตอบไม่ถูก"
per["G26"].font = Font(name=FONT, bold=True)
for col, h, src in zip("GH", ["รหัสคำถาม", "รูปแบบ"], "HR"):
    c = per[f"{col}27"]
    c.value, c.font, c.fill = h, Font(name=FONT, bold=True), HEAD_FILL
    per[f"{col}28"] = f'=IFERROR(FILTER(Answers!${src}$2:${src},Answers!$D$2:$D={UID},Answers!$O$2:$O=FALSE),"")'
per.column_dimensions["G"].width = 14
style_body(per)

# ---------- ภาพรวม ----------
ov = wb.create_sheet("ภาพรวม", 2)
for col, w in zip("ABCDEFG", [14, 12, 12, 14, 14, 14, 4]):
    ov.column_dimensions[col].width = w
ov["A1"] = "ภาพรวมทีม"
ov["A1"].font = Font(name=FONT, bold=True, size=14)
for col, h in zip("ABCDEF", ["ทีม", "สมาชิก", "เคยเล่น", "คะแนนรวมทุกคน", "โบนัสทีม", "คะแนนทีม"]):
    c = ov[f"{col}3"]
    c.value, c.font, c.fill = h, Font(name=FONT, bold=True), HEAD_FILL
for i, (team, bonus_cell) in enumerate([("FAC", "E5"), ("WH", "E6"), ("SAMYAN", "E7")], start=4):
    ov[f"A{i}"] = team
    ov[f"B{i}"] = f"=COUNTIFS(People!$C$2:$C,$A{i})"
    ov[f"C{i}"] = f"=COUNTIFS(People!$C$2:$C,$A{i},People!$F$2:$F,\">0\")"
    ov[f"D{i}"] = f"=SUMIFS(People!$D$2:$D,People!$C$2:$C,$A{i})"
    ov[f"E{i}"] = f"='ตั้งค่า'!{bonus_cell}"
    # brief ข้อ 5.4: หารด้วยสมาชิกทั้งหมด
    ov[f"F{i}"] = f"=IF($B{i}=0,$E{i},$D{i}/$B{i}+$E{i})"
    ov[f"F{i}"].number_format = "0.0"

ov["A9"] = "ผลรายบท (ทุกคน)"
ov["A9"].font = Font(name=FONT, bold=True)
for col, h in zip("ABCDE", ["เล่ม", "บท", "ตอบ", "ถูก", "% ถูก"]):
    c = ov[f"{col}10"]
    c.value, c.font, c.fill = h, Font(name=FONT, bold=True), HEAD_FILL
r = 11
for book in (1, 2):
    for ch in range(1, 6):
        ov[f"A{r}"], ov[f"B{r}"] = book, ch
        ov[f"C{r}"] = f"=COUNTIFS(Answers!$I$2:$I,$A{r},Answers!$J$2:$J,$B{r})"
        ov[f"D{r}"] = f"=COUNTIFS(Answers!$I$2:$I,$A{r},Answers!$J$2:$J,$B{r},Answers!$O$2:$O,TRUE)"
        ov[f"E{r}"] = f"=IF($C{r}=0,\"\",$D{r}/$C{r})"
        ov[f"E{r}"].number_format = "0%"
        r += 1

ov["A22"] = "คนเล่นรายวัน"
ov["A22"].font = Font(name=FONT, bold=True)
for col, h in zip("ABCD", ["วันที่", "FAC", "WH", "SAMYAN"]):
    c = ov[f"{col}23"]
    c.value, c.font, c.fill = h, Font(name=FONT, bold=True), HEAD_FILL
ov["A24"] = "=IFERROR(SORT(UNIQUE(Daily!$A$2:$A)),\"\")"
for col in "BCD":
    ov[f"{col}24"] = f'=ARRAYFORMULA(IF(A24:A="","",COUNTIFS(Daily!A2:A,A24:A,Daily!E2:E,{col}23)))'
for i in range(24, 60):
    ov[f"A{i}"].number_format = "yyyy-mm-dd"
style_body(ov)

# ---------- รายข้อ ----------
q = wb.create_sheet("รายข้อ", 3)
for col, w in zip("ABCDEFG", [12, 6, 6, 8, 8, 8, 14]):
    q.column_dimensions[col].width = w
for col, h in zip("ABCDEFG", ["รหัสคำถาม", "เล่ม", "บท", "ตอบ", "ถูก", "% ผิด", "หมายเหตุ"]):
    c = q[f"{col}1"]
    c.value, c.font, c.fill = h, Font(name=FONT, bold=True), HEAD_FILL
q.freeze_panes = "A2"
q["A2"] = "=IFERROR(SORT(UNIQUE(Answers!$H$2:$H)),\"\")"
Q = {
    "B": '=ARRAYFORMULA(IF(A2:A="","",XLOOKUP(A2:A,Answers!H2:H,Answers!I2:I)))',
    "C": '=ARRAYFORMULA(IF(A2:A="","",XLOOKUP(A2:A,Answers!H2:H,Answers!J2:J)))',
    "D": '=ARRAYFORMULA(IF(A2:A="","",COUNTIFS(Answers!H2:H,A2:A)))',
    "E": '=ARRAYFORMULA(IF(A2:A="","",COUNTIFS(Answers!H2:H,A2:A,Answers!O2:O,TRUE)))',
    "F": '=ARRAYFORMULA(IF((A2:A="")+(D2:D=0),"",1-E2:E/D2:D))',
    "G": "=ARRAYFORMULA(IF(F2:F=\"\",\"\",IF((D2:D>='ตั้งค่า'!E3)*(F2:F>'ตั้งค่า'!E2),\"ควรทบทวน\",\"\")))",
}
for col, formula in Q.items():
    q[f"{col}2"] = formula
for i in range(2, 151):
    q[f"F{i}"].number_format = "0%"
style_body(q)

# ---------- Survey ----------
sv = sheet("Survey", ["ส่งเมื่อ", "user_id", "ชื่อ", "ทีม", "คำถาม 1", "คำถาม 2", "คำถาม 3", "ความเห็นเพิ่มเติม"], [17, 12, 16, 9, 20, 20, 20, 30])
sv["E1"].comment = Comment("รอ HR ร่างคำถาม แล้วเปลี่ยนชื่อหัวคอลัมน์ตามคำถามจริง", "Claude")

wb.move_sheet("ตั้งค่า", offset=len(wb.sheetnames))
wb.save(OUT)
print(f"saved {OUT}: {len(answers)} answers, {len(daily)} days")
