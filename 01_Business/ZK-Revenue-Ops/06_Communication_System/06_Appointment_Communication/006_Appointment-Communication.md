---
Title: 006 Appointment Communication - ZK Revenue Ops
ID: ZK-COM-006
Type: Communication System Document
Module: 06_Communication_System / 06_Appointment_Communication / 006
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 006 Appointment Communication

## Goal
Menguruskan semua komunikasi berkaitan temujanji viewing hartanah (Booking, Confirmation, Reminders, Reschedule, Cancellation, Post-Appointment).

## Purpose
Menguatkuasakan Protokol Anti-Ghosting T-24j & T-2j bagi memastikan kadar kehadiran viewing melebihi 90%.

## Scope
Mesej Booking, Confirmation, Peringatan T-24j, Peringatan T-2j, Waze Dispatch Card, Post-Viewing Survey.

## Trigger
Penetapan temujanji viewing baharu atau pencetus masa nod T-24j / T-2j.

## Audience
Lead Pembeli & Client Solo REN.

## Channel
WhatsApp, SMS.

---

## 2-Layer Communication Architecture

### Layer 1 — Business Communication (Appointment Rules)
1. **Interactive Confirmation**: Peringatan T-24j MESTI meminta balasan prospek (*"Balas 1 untuk Confirm, 2 untuk Reschedule"*).
2. **Waze Location Dispatch**: Peringatan T-2j MESTI mengandungi pautan lokasi Waze tepat ke lobi galeri / pintu pengawal.

### Layer 2 — Channel Implementation (Templates)

#### Node T-24 Jam (WhatsApp to Buyer)
```text
Salam [Nama Pembeli], peringatan mesra untuk temujanji viewing [Nama Projek] esok:
📅 Tarikh: [Tarikh] | 11:00 AM
📍 Lokasi: [Nama Projek]

Boleh balaskan "1" untuk sahkan kehadiran atau "2" jika nak tukar masa ya. Terima kasih!
```

#### Node T-2 Jam (WhatsApp to Buyer & REN)
```text
Salam [Nama Pembeli], harini viewing jam 11:00 AM kat [Nama Projek]. 

🚗 Pautan Waze: https://waze.com/ul/...
Ejen kami [Nama REN] dah sedia menunggu kat sana. Jumpa kejap lagi ya!
```

---

## Message Flow
`Booking Set` ➔ `T-24h Reminder` ➔ `T-2h Reminder & Waze` ➔ `Post-Viewing Feedback`

## Business Rules
`AR-001`, `AR-002`, `AR-003` (Anti-Ghosting Protocol).

## Templates
`TMP-APP-01` hingga `TMP-APP-06`.

## QA Checklist
- [ ] Pautan Waze disahkan tepat ke lokasi viewing.
- [ ] Kad Buyer Dossier dihantar ke REN 2 jam awal.

## KPIs
* **Viewing Show-up Rate**: > 90%.

## Related SOP
`SOP-008` (Appointment Booking)

## Related Workflow
`ZK-WF-004` (Appointment Lifecycle)

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Appointment Communication ZK Revenue Ops |
