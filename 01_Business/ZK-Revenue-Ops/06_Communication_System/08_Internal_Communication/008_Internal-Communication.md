---
Title: 008 Internal Communication - ZK Revenue Ops
ID: ZK-COM-008
Type: Communication System Document
Module: 06_Communication_System / 08_Internal_Communication / 008
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 008 Internal Communication

## Goal
Menguruskan aliran komunikasi dalaman antara Operator SDR, System Bot, Admin, dan Founder (Daily Stand-up, Task Update, Escalation, Incident Report, QA Feedback).

## Purpose
Memastikan koordinasi operasi dalaman pantas dan bebas daripada halangan komunikasi (*frictionless execution*).

## Scope
Mesej Stand-up Harian, Notifikasi Sistem Internal, Laporan Insiden, Maklum Balas Audit QA.

## Trigger
Permulaan hari kerja, pertukaran giliran task, atau insiden sistem.

## Audience
Virtual SDR Operator, Human Founder, AI AGY System Agents.

## Channel
Internal WhatsApp Group / Slack / Telegram Operations Channel.

---

## 2-Layer Communication Architecture

### Layer 1 — Business Communication (Internal Rules)
1. **Daily Morning Stand-up**: Operator wajib melaporkan status sediaan pada jam 8:45 AM.
2. **Incident Escalation**: Insiden bot terhenti (*system down*) wajib dilaporkan ke Founder dalam tempoh < 5 minit.

### Layer 2 — Channel Implementation (Templates)

```text
🚨 INCIDENT ALERT (SYSTEM BOT DOWN)
------------------------------------
Time: 10:15 AM
Affected System: n8n WhatsApp Gateway
Impact: Speed-to-lead bot paused
Action: Operator manual takeover active. Engineer notified.
------------------------------------
```

---

## Message Flow
`Morning Stand-up` ➔ `Task Assignment Alert` ➔ `Incident Escalation` ➔ `EOD Summary`

## Business Rules
`OR-004` (Human Takeover Rule), `PS-001` (Priority P1 Alert).

## Templates
`TMP-INT-01` hingga `TMP-INT-05`.

## QA Checklist
- [ ] Mesej insiden dihantar < 5 minit.

## KPIs
* **Internal Resolution Time**: < 15 minit.

## Related SOP
`DOP-001` (Daily Operations Manual)

## Related Workflow
`ZK-WF-009` (Escalation Workflow)

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Internal Communication ZK Revenue Ops |
