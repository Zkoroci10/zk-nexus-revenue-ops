---
Title: 005 Follow-up Library - ZK Revenue Ops
ID: ZK-COM-005
Type: Communication System Document
Module: 06_Communication_System / 05_Follow-up_Library / 005
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 005 Follow-up Library

## Goal
Menyediakan jadual templat susulan berperingkat (*Follow-up Cadence Library*) mengikut hari.

## Purpose
Memastikan susulan dijalankan secara konsisten tanpa terhenti di tengah jalan.

## Scope
Hari 1, Hari 3, Hari 7, Hari 14, Hari 30, Ghost Campaign, Revival Campaign.

## Trigger
Pencetus masa SLA susulan automasi.

## Audience
Prospek Tier 2 Warm / Inactive Leads.

## Channel
WhatsApp, SMS.

---

## 2-Layer Communication Architecture

### Layer 1 — Business Communication (Follow-up Rules)
1. **Cadence Schedule**: Hari 1 (Saringan), Hari 3 (Nurturing & Layout Plan), Hari 7 (Objection & Viewing Offer), Hari 14 (Revival Blast).
2. **Cooling Off Rule**: Sekiranya tiada respon selepas Hari 14, letak lead dalam fasa *Cooling Off* (Hanya sapa semula pada Hari 30).

### Layer 2 — Channel Implementation (Follow-up Templates)

```text
[Hari 3 - Layout Plan]: "Salam [Nama Pembeli], ni layout plan unit 3 bilik untuk [Nama Projek] yang Encik minta haritu. Unit ni ada 2 car park percuma bulan ni. Encik nak saya simpan 1 unit untuk viewing tak?"

[Hari 7 - Objection Check]: "Salam [Nama Pembeli], agak-agak ada apa-apa soalan pasal loan bank atau lokasi [Nama Projek] yang saya boleh bantu jelaskan?"
```

---

## Message Flow
`Day 1` ➔ `Day 3` ➔ `Day 7` ➔ `Day 14 (Revival)` ➔ `Cooling Off`

## Business Rules
`SLA-002` (Follow-up Touchpoint Cadence).

## Templates
`TMP-FW-01` hingga `TMP-FW-07`.

## QA Checklist
- [ ] Mesej dihantar mengikut sela hari tepat (Hari 1, 3, 7, 14).

## KPIs
* **Follow-up Reactivation Rate**: > 15%.

## Related SOP
`SOP-007` (Follow-up), `SOP-011` (Lead Revival)

## Related Workflow
`ZK-WF-005` (Follow-up Lifecycle)

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Follow-up Library ZK Revenue Ops |
