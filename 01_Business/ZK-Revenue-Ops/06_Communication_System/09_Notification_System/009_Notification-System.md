---
Title: 009 Notification System - ZK Revenue Ops
ID: ZK-COM-009
Type: Communication System Document
Module: 06_Communication_System / 09_Notification_System / 009
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 009 Notification System

## Goal
Menetap dan menguruskan semua jenis amaran dan notifikasi sistem (*System Notification Architecture*).

## Purpose
Memastikan setiap amaran kritikal (P1 Critical) disampaikan serta-merta kepada pihak yang bertanggungjawab.

## Scope
Notifikasi: New Lead, Missed SLA, Appointment Today, Lead Reply, Task Assigned, Report Ready, Reminder, Escalation Alert.

## Trigger
Pencetus peristiwa sistem / amaran SLA terlanggar.

## Audience
REN Client, Virtual SDR, Founder.

## Channel
WhatsApp Push Alert, Browser Pop-up, Email.

---

## 2-Layer Communication Architecture

### Layer 1 — Business Communication (Notification Rules)
1. **P1 Immediate Push**: Amaran P1 Critical (Speed-to-lead breach / Booking fee) WAJIB dihantar secara pautan mesej WhatsApp serta merta (<1 minit).
2. **Batching Low Priority**: Notifikasi P4 Low (cth: Laporan mingguan siap) digabungkan dan dihantar mengikut jadual.

### Layer 2 — Channel Implementation (Payload Format)

```json
{
  "event_type": "P1_MISSED_SLA_ALERT",
  "lead_id": "LEAD-00102",
  "client_id": "SEAT-004",
  "elapsed_minutes": 16,
  "action_required": "Manual Operator Intervention Required Immediately"
}
```

---

## Message Flow
`System Event` ➔ `Priority Classifier` ➔ `Notification Dispatcher` ➔ `Acknowledgement`

## Business Rules
`PS-001` (Priority Matrix), `SLA-001` (Speed-to-Lead SLA).

## Templates
`TMP-NOTIF-01` hingga `TMP-NOTIF-08`.

## QA Checklist
- [ ] Mesej notifikasi P1 dihantar < 1 minit.

## KPIs
* **Notification Delivery SLA**: 100%.

## Related SOP
`SOP-006` (Outreach), `EXC-001` (Exceptions)

## Related Workflow
`ZK-WF-009` (Escalation Workflow)

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Notification System ZK Revenue Ops |
