---
Title: Appointment Lifecycle Workflow - ZK Revenue Ops
ID: ZK-WF-004
Type: Operational Workflow Engine Document
Module: 04_Operational_Workflow_Engine / 004 Appointment Lifecycle
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 004: Appointment Lifecycle Workflow

> **ZK-WF-004 | Enjin Kitaran Hayat Temujanji Viewing (Appointment Lifecycle Engine)**

---

## Workflow Name
**Viewing Appointment Lifecycle Workflow**

## Goal
Menguruskan fasa temujanji viewing fizikal daripada permohonan awal, pengesahan slot masa, peringatan anti-ghosting T-24j & T-2j, hingga temujanji selesai atau ditukar tarikh (*rescheduled*).

## Trigger
Prospek Tier 1 Hot bersetuju memilih tarikh & masa temujanji viewing.

## Pre-conditions
1. Lead memegang status `🔥 Tier 1 Hot` (Pre-Approved Loan / Cash).
2. Temujanji ditetapkan sekurang-kurangnya 12 jam awal (`AR-001`).

## Input
Tarikh & Masa Slot, Pautan Waze Lokasi Hartanah, Profil Buyer Dossier.

---

## Steps (Aliran 8 Fasa Kitaran Hayat Temujanji)

```text
[Requested] ──> [Pending] ──> [Confirmed] ──> [Reminder (T-24h & T-2h)]
                                                       │
                                       ┌───────────────┴───────────────┐
                                       ▼                               ▼
                                 [Completed]                      [Rescheduled / Cancelled]
```

1. **Requested**: Prospek memohon slot masa viewing.
2. **Pending**: Sistem menyemak kelapangan kalendar REN.
3. **Confirmed**: Slot masa dikunci, *Buyer Dossier* disahkan, & kad kalendar dihasilkan.
4. **Reminder (T-24h)**: Mesej pengesahan WhatsApp dihantar 24 jam sebelum temujanji.
5. **Reminder (T-2h)**: Mesej koordinasi lokasi Waze & kad Dossier dihantar 2 jam sebelum temujanji.
6. **Completed**: Pembeli hadir secara fizikal di lokasi viewing (`🟢 Viewing Show-Up`).
7. **Cancelled**: Pembeli menolak temujanji (Tag `❌ Deal Lost` / `Disqualified`).
8. **Rescheduled**: Pembeli memohon pertukaran tarikh (Maksimum 2 kali pertukaran dibenarkan).

---

## Decision Points
* **Decision 1**: Adakah pembeli membalas mesej pengesahan T-2 jam?
  * *Ya*: Tag `Confirmed` ➔ REN berlepas ke lokasi viewing.
  * *Tidak*: Tag `🔴 High Ghost Risk` ➔ Maklumkan REN untuk tangguhkan perjalanan.
* **Decision 2**: Adakah pembeli meminta reschedule melebihi 2 kali?
  * *Ya*: Tag `Disqualified / Blacklisted` (`AR-004`).
  * *Tidak*: Kemaskini tarikh/masa baharu dalam kalendar.

## Output
1. *Confirmed Viewing Slot*.
2. *Buyer Dossier Briefing Sheet*.

## Related Business Rules & Entities
* `AR-001` (12-Hour Lead Time), `AR-002` (Buyer Dossier Wajib), `AR-003` (Anti-Ghosting Protocol), `AR-004` (Reschedule Limit); Entiti `Appointment`, `Lead`.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Appointment Lifecycle Workflow ZK Revenue Ops (ZK-WF-004) |
