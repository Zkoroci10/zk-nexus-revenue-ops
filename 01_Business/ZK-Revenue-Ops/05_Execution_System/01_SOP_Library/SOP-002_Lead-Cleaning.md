---
Title: SOP-002 — Lead Cleaning
ID: ZK-SOP-002
Type: Standard Operating Procedure
Module: 05_Execution_System / 01_SOP_Library / SOP-002
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# SOP-002 — Lead Cleaning

## Goal
Membuka dan mengesahkan kebersihan nombor telefon WhatsApp, membuang format pelik/rosak, dan memformatkan nama prospek secara seragam.

## Scope
Merangkumi semua lead baharu berstatus `📥 New Lead` yang baru diimport dari SOP-001.

## Trigger
Rekod lead baharu berjaya dicipta dari SOP-001.

## Prerequisites
1. Akses WhatsApp Phone Formatter Service.

## Input
`lead_id`, `full_name`, `phone_number`.

## Required Tools
Regex Formatter, WhatsApp Number Checker Bot, Notion Database.

---

## 3-Layer Execution System

### Layer 1: Business SOP (Tool-Agnostic Process)
1. Semak format nombor telefon (Format piawai `+601XXXXXXXX`).
2. Bersihkan aksara simbol/jarak yang tidak diperlukan (cth: `012-345 6789` ➔ `+60123456789`).
3. Tukar status lead ke `VERIFIED`.

### Layer 2: Tool Guide (Notion / Sheets Execution Guide)
1. Buka view `Unverified Leads` dalam Notion.
2. Gunakan formula `Phone Cleaner` untuk menukar format `01...` ke `+601...`.
3. Kemaskini lajur `Status` ke `VERIFIED`.

### Layer 3: Automation Mapping (n8n & AI Automation)
1. **Regex Cleaner Node**: Menukar format nombor telefon secara automatik.
2. **WhatsApp Verifier Node**: Menyemak kewujudan akaun WhatsApp aktif.

---

## Procedure
* **Step 1**: Terima `phone_number` dari SOP-001.
* **Step 2**: Jalankan regex `^\+601\d{8,9}$`.
* **Step 3**: Jika sah, tukar status ke `VERIFIED`.

## Decision Points
* **Jika Format Sah**: Teruskan ke SOP-003 (Duplicate Checking).
* **Jika Nombor Rosak / Tak Sah**: Tag `🗑️ Tier 3 Disqualified (Invalid Number)` ➔ Tamatkan workflow.

## Validation
Aturan pengesahan format nombor `VR-001`.

## QA Checklist
- [ ] Nombor bermula dengan `+601...`.
- [ ] Tiada aksara khas (`-`, ` `, `(`, `)`).

## Expected Output
Lead disahkan bersih berstatus `VERIFIED`.

## Related Workflow
`ZK-WF-001`, `ZK-WF-002`

## Related Business Rules
`VR-001`, `LR-002`

## Related Templates
`N/A`

---

## Revision History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi SOP-002 Lead Cleaning ZK Revenue Ops |
