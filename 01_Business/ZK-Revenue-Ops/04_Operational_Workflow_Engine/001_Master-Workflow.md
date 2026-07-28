---
Title: Master Operational Workflow - ZK Revenue Ops
ID: ZK-WF-001
Type: Operational Workflow Engine Document
Module: 04_Operational_Workflow_Engine / 001 Master Workflow
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 001: Master Operational Workflow

> **ZK-WF-001 | Enjin Aliran Kerja Operasi Induk (Master Workflow Engine)**

---

## Workflow Name
**Master End-to-End Revenue Operations Workflow**

## Goal
Mengendalikan keseluruhan aliran operasi lead bermula daripada saat lead baharu didaftarkan dari saluran iklan hingga temujanji viewing diserahkan kepada REN, jualan ditutup, dan laporan audit diterbitkan.

## Trigger
Lead baharu masuk daripada FB Ads, TikTok Ads, PropertyGuru, iProperty, Borang Web, atau CSV Cold Import.

## Pre-conditions
1. Pelanggan REN memegang kerusi aktif (`SEAT-001` hingga `SEAT-030`) dengan status *Territory Lock* disahkan.
2. Saluran *Webhook Ingestion* n8n & WhatsApp API beroperasi secara normal.

## Input
Data lead mentah: Nama, Nombor Telefon, Sumber Iklan, Nama Projek Hartanah, Bajet / Kelayakan Pendapatan.

---

## Steps (Aliran Langkah 15 Peringkat)

```text
[1. Lead Masuk] ──> [2. Import] ──> [3. Cleaning] ──> [4. Validation] ──> [5. Segmentation]
                                                                                │
                                                                                ▼
[10. Follow Up] <── [9. Qualification] <── [8. Reply] <── [7. Outreach] <── [6. Assignment]
       │
       ▼
[11. Appointment] ──> [12. Handover to REN] ──> [13. CRM Update] ──> [14. Reporting] ──> [15. Continuous Follow Up]
```

1. **Step 1: Lead Ingestion (Lead Masuk)**: Webhook menerima payload data lead mentah.
2. **Step 2: Data Import**: Sistem merekodkan entiti Lead baharu dengan status `📥 New Lead`.
3. **Step 3: Data Cleaning**: Menyemak duplikasi nombor telefon dalam tempoh 30 hari & membuang format rosak.
4. **Step 4: Data Validation**: Menguatkuasakan aturan `VR-001` (Format nombor Malaysia `+601...`).
5. **Step 5: Lead Segmentation**: Mengelaskan lead mengikut projek hartanah & jenis tawaran (Subsale/New Launch/Rent).
6. **Step 6: Queue Assignment**: Melantik lead kepada kuota `client_id` REN yang memegang hak *Territory Lock*.
7. **Step 7: Speed-to-Lead Outreach**: Bot WhatsApp menyapa lead dalam masa < 5 minit bersama soalan saringan DSR.
8. **Step 8: Customer Reply**: Lead membalas perbualan WhatsApp (Status bertukar ke `🔍 Screening`).
9. **Step 9: Qualification Triage**: Mengira kelayakan gaji/loan dan menetapkan tag `🔥 Tier 1 Hot`, `🌤️ Tier 2 Warm`, atau `🗑️ Tier 3 Disqualified`.
10. **Step 10: Multi-Touch Follow Up**: Melaksanakan kempen susulan berjadual (Hari 1, 3, 7, 14) bagi lead Tier 2.
11. **Step 11: Viewing Appointment Booking**: Mengunci slot kalendar viewing dan menguatkuasakan Protokol Anti-Ghosting T-24j & T-2j.
12. **Step 12: Handover to REN**: Menghantar *Buyer Dossier* & pautan Waze kepada REN untuk sesi viewing fizikal.
13. **Step 13: CRM Real-Time Update**: Mengemaskini papan Kanban Notion Client Portal.
14. **Step 14: Weekly Reporting**: Mengagregatkan data ke dalam Laporan Audit Mingguan (Isnin jam 9:00 AM).
15. **Step 15: Continuous Follow-up**: Menjalankan kempen *Dormant Reactivation* bagi lead yang tidak berjaya diproses pada fasa awal.

---

## Decision Points
* **Decision 1**: Adakah nombor telefon duplikasi?
  * *Ya*: Jalankan Workflow Pengecualian (*Merge Duplicate Lead*).
  * *Tidak*: Teruskan ke Step 4 (Validation).
* **Decision 2**: Adakah pembeli mempunyai *Pre-Approved Loan* / Cash + Timeline < 30 Hari?
  * *Ya*: Tag `🔥 Tier 1 Hot` ➔ Teruskan ke Step 11 (Appointment Booking).
  * *Tidak*: Tag `🌤️ Tier 2 Warm` ➔ Teruskan ke Step 10 (Follow Up Cadence).
* **Decision 3**: Adakah pembeli senyap pada nod T-2 jam?
  * *Ya*: Tag `🔴 High Ghost Risk` ➔ Maklumkan REN untuk tangguhkan perjalanan.
  * *Tidak*: Tag `🟢 Viewing Show-Up` ➔ Teruskan ke Handover.

## Exception Paths
* **Wrong Number / Invalid**: Alih ke `008_Exception-Workflow.md` (Mark Invalid & End).
* **Lead Complaint / Marah**: Alih ke `009_Escalation-Workflow.md` (Escalate to REN).

## Exit Conditions
1. Transaksi jualan ditutup (`💰 Closed Won`).
2. Lead diarkibkan secara kekal (`Archived`).

## Output
1. *Buyer Dossier* lengkap disahkan.
2. Temujanji viewing fizikal disahkan (*Confirmed Viewing*).
3. Laporan Audit Mingguan diterbitkan.

## Related Business Rules
* `BR-001` (30-Cap Rule), `BR-002` (Territory Lock), `LR-001` (Mandatory Lead Fields), `LR-002` (No Hard Delete).

## Related Entities
* `Lead`, `Client`, `Appointment`, `Activity`, `Message`, `Report`, `Territory Seat`.

## Related SOP
* `SOP-OPS-001` (Master Operator Manual), `SOP-SDR-001` (Initial Outreach Protocol).

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Master Operational Workflow ZK Revenue Ops (ZK-WF-001) |
