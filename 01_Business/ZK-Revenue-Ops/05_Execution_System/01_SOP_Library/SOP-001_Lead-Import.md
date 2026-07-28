---
Title: SOP-001 — Lead Import
ID: ZK-SOP-001
Type: Standard Operating Procedure
Module: 05_Execution_System / 01_SOP_Library / SOP-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# SOP-001 — Lead Import

## Goal
Mengimport data lead mentah daripada borang iklan digital atau fail CSV ke dalam pangkalan data ZK Revenue Ops tanpa sebarang keciciran rekod.

## Scope
Merangkumi semua lead baharu daripada Facebook Ads, TikTok Ads, PropertyGuru, iProperty, Borang Web Landing Page, dan Cold CSV Import.

## Trigger
Lead baharu mendaftar di borang iklan ATAU REN memuat naik fail CSV lead lama.

## Prerequisites
1. Hak *Territory Lock* REN aktif.
2. Webhook Ingestion n8n beroperasi normal.

## Input
Payload API / Fail CSV (Nama, Nombor Telefon, Source, Projek Diminati).

## Required Tools
Notion Master Database, n8n Webhook Ingestion Engine, Google Sheets CSV Converter.

---

## 3-Layer Execution System

### Layer 1: Business SOP (Tool-Agnostic Process)
1. Terima payload/fail data lead mentah dari sumber iklan.
2. Rekodkan cap masa `created_at` dan tandakan sumber `source`.
3. Alirkan data ke fasa *Lead Cleaning* (SOP-002).

### Layer 2: Tool Guide (Notion / Sheets Execution Guide)
1. Buka borang Notion Ingestion Queue.
2. Pilih butang `...` ➔ `Merge with CSV` atau paste data dari Google Sheets.
3. Pastikan lajur `Full Name`, `Phone Number`, dan `Project Name` dipadankan tepat.

### Layer 3: Automation Mapping (n8n & AI Automation)
1. **n8n Webhook Node**: Menangkap payload FB/TikTok Lead Ads secara real-time.
2. **AI Formatter Node**: Memformatkan nama lead kepada *Proper Case*.

---

## Procedure
* **Step 1**: Webhook menerima data mentah ➔ Hasilkan `LEAD-NNNNN`.
* **Step 2**: Semak kelengkapan lajur nama dan nombor telefon.
* **Step 3**: Masukkan rekod ke dalam *Ingestion Queue Board*.

## Decision Points
* **Jika Data Lengkap**: Alih ke SOP-002 (Lead Cleaning).
* **Jika No Telefon Kosong**: Buang rekod ➔ Hantar notifikasi error.

## Validation
Ujian format nombor `VR-001` & pengesahan `client_id` `VR-002`.

## QA Checklist
- [ ] Format nombor telefon disemak (+601...).
- [ ] Tag sumber (`source`) dimasukkan tepat.

## Expected Output
Rekod Lead baharu dicipta dalam status `📥 New Lead`.

## Related Workflow
`ZK-WF-001` (Master Workflow)

## Related Business Rules
`LR-001` (Mandatory Fields), `LR-002` (No Hard Delete).

## Related Templates
`TMP-CSV-01` (CSV Import Template).

---

## Revision History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi SOP-001 Lead Import ZK Revenue Ops |
