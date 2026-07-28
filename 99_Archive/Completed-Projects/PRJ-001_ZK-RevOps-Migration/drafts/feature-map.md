---
Title: Feature Map
ID: TBD
Type: Document
Module: 02_Projects
BU: ZK Revenue Ops
Status: Draft
Version: 1
Created: 2026-07-17
Updated: 2026-07-17
Owner: Human Founder
Related: PRJ-001
---

# ZK Revenue Ops - SOP to CRM Feature Map

Tarikh: 2026-07-10

Tujuan fail ini: padankan Master SOP dengan sistem Google Apps Script CRM yang sudah ada, supaya upgrade dibuat ikut prioriti dan tidak rebuild benda yang sudah jalan.

## Ringkasan Status

- CRM core: Ada
- Internal dashboard: Ada
- Client dashboard: Ada
- Lead pipeline: Ada
- Ghost revival: Ada
- DSR calculator: Ada
- Broadcast/follow-up queue: Ada
- Client flag/escalation: Ada
- Daily report automation: Belum jelas
- Consent/opt-out tracking: Belum jelas
- VA performance KPI: Belum jelas

## Feature Map

| SOP Area | Sistem Sekarang | Status | Nota |
| --- | --- | --- | --- |
| Command Center | `Command Center`, `getDashboardStats()` | Ada | Dashboard ringkas sudah jalan. |
| War Room | `War Room`, `getAllLeads()`, `addLead()`, `updateLead()`, `deleteLead()` | Ada | Ini core CRM. |
| Engine Log | `Engine`, `getEngineLog()`, beberapa `appendRow()` | Separuh Ada | Tidak semua touch nampak dipaksa log. |
| Ghost Revival | `runGhostCheck()`, `getGhostLeads()`, `ghostStage` | Ada | Perlu semak stage ikut SOP 5 phase. |
| System Brain | `System Brain`, `getBroadcastScript()` | Ada | Template script sudah boleh dirujuk. |
| Deep Research Protocol | VA Notes/manual notes | Separuh Ada | SOP ada, tapi field khas research belum jelas. |
| Script Matrix | `System Brain`, frontend generated scripts | Separuh Ada | Ada script, tapi Variation A/B/C belum fully structured. |
| Appointment Setting | `getAllAppointments()`, `getTomorrowAppointments()`, reminder queue | Ada | Appointment reminder sudah ada asas. |
| DSR Qualification | `calculateDSR()` | Ada | Calculator sudah wujud. |
| Escalation Protocol | `flagLeadForAttention()`, `getFlaggedLeads()` | Ada | Client boleh flag lead. |
| Daily Rhythm | Manual SOP | Belum Auto | Belum nampak daily checklist/report generator. |
| Quality Standards | Manual SOP | Belum Auto | Belum ada validation ketat untuk zero tolerance errors. |
| PDPA Compliance | Manual SOP | Belum Jelas | Consent, opt-out, and privacy notice belum nampak sebagai field/system rule. |
| The Academy/KPI | Manual SOP | Belum Auto | Belum ada VA performance tracker. |

## Priority Upgrade Cadangan

1. Tambah consent/opt-out tracking dalam War Room.
2. Paksa Engine Log untuk setiap WhatsApp touch.
3. Tambah Daily Report generator dari Engine + War Room.
4. Mapping Ghost Revival kepada 5 phase SOP.
5. Tambah VA KPI tracker selepas operasi stabil.

## Next Small Build

Cadangan build paling kecil: tambah definisi field untuk `Consent Status` dan `Opt-Out Status` dalam SOP/CRM plan dahulu sebelum ubah Apps Script.

---
## Change Log
| Date | Actor | Change |
|------|-------|--------|
| 2026-07-17 | AI-002 | Migrated file to PRJ-001 drafts folder |
