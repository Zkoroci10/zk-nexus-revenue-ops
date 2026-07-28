---
Title: SOP-003 — Duplicate Checking
ID: ZK-SOP-003
Type: Standard Operating Procedure
Module: 05_Execution_System / 01_SOP_Library / SOP-003
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# SOP-003 — Duplicate Checking

## Goal
Mengenal pasti dan menggabungkan rekod lead duplikasi yang mempunyai nombor telefon yang sama dalam tempoh 30 hari.

## Scope
Merangkumi semua lead berstatus `VERIFIED` dari SOP-002.

## Trigger
Nombor telefon lead disahkan sah dalam SOP-002.

## Prerequisites
Database search index aktif.

## Input
`phone_number`, `client_id`.

## Required Tools
Notion Search Filter, n8n Deduplication Node.

---

## 3-Layer Execution System

### Layer 1: Business SOP (Tool-Agnostic Process)
1. Cari nombor telefon dalam pangkalan data aktif 30 hari.
2. Jika wujud, gabungkan log perbualan baharu ke kad asal.
3. Tag rekod baharu sebagai `Duplicate Archived`.

### Layer 2: Tool Guide (Notion Execution Guide)
1. Buka carian Notion `Search Lead`.
2. Taip nombor telefon `+601...`.
3. Jika rekod lama wujud, salin nota baharu ke kad lama ➔ Tukar status kad baharu ke `Archived (Duplicate)`.

### Layer 3: Automation Mapping (n8n Automation)
1. **Lookup Node**: Semak kewujudan `phone_number` dalam database.
2. **Auto-Merge Node**: Gabungkan metadata secara automatik.

---

## Decision Points
* **Jika Rekod Lama Wujud**: Gabung log ➔ Alih ke Archived Duplicate.
* **Jika Rekod Baharu Unik**: Alih ke SOP-004 (Segmentation).

## QA Checklist
- [ ] Carian nombor 30 hari selesai.
- [ ] Tiada 2 kad aktif untuk nombor yang sama.

## Expected Output
Lead disahkan unik ATAU digabungkan dengan rekod lama.

## Related Workflow
`ZK-WF-001`, `ZK-WF-008` (Exception)

## Related Business Rules
`LR-003` (Deduplication Rule)

---

## Revision History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi SOP-003 Duplicate Checking ZK Revenue Ops |
