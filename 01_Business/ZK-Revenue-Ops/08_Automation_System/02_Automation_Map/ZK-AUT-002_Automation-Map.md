---
Title: Master Automation Map - ZK Revenue Ops
ID: ZK-AUT-002
Type: Automation System Document
Module: 08_Automation_System / 02_Automation_Map / ZK-AUT-002
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-AUT-002 — Master Automation Map

> **ZK-AUT-002 | Peta Peluang & Pemetaan Automasi Operasi (Master Automation Map)**

---

## Purpose

Dokumen ini merupakan **Peta Automasi Utama (*Master Automation Map*)** yang memetakan pertukaran daripada proses manual kepada peluang automasi teknikal mengikut alatan perisian.

---

## Master Automation Mapping Matrix

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PETA PEMETAAN AUTOMASI OPERASI                            │
├─────────────┬─────────────────────┬────────────────────────┬──────────────┬────────────┤
│ PROSES      │ LANGKAH MANUAL      │ PELUANG AUTOMASI       │ ALATAN (TOOL)│ HASIL      │
├─────────────┼─────────────────────┼────────────────────────┼──────────────┼────────────┤
│ Lead Import │ REN muat naik CSV   │ Webhook Auto-Ingest &  │ n8n / FB Ads │ Ingest <1m │
│             │ & Operator semak    │ Format Check           │ Webhook      │ Zero Miss  │
├─────────────┼─────────────────────┼────────────────────────┼──────────────┼────────────┤
│ Lead Clean  │ Semak format &      │ Auto Normalization &   │ n8n Regex &  │ Format MY  │
│             │ duplikasi 30 hari   │ Database Lookup Index  │ Notion API   │ Cleaned    │
├─────────────┼─────────────────────┼────────────────────────┼──────────────┼────────────┤
│ Assignment  │ Operator semak      │ Auto Territory Router  │ n8n Router   │ Seat Assigned│
│             │ pendaftaran projek  │ mengikut `SEAT-NNN`    │ Engine       │ Instantly  │
├─────────────┼─────────────────────┼────────────────────────┼──────────────┼────────────┤
│ Outreach    │ Operator taip chat  │ Auto WhatsApp Greeting │ n8n + WA API │ Speed <5m  │
│             │ & hantar manual     │ & DSR Question Trigger │ Gateway      │ 100% SLA   │
├─────────────┼─────────────────────┼────────────────────────┼──────────────┼────────────┤
│ Follow-up   │ Operator ingat tarikh│ Cadence Task Generator │ n8n Scheduler│ Zero Lead  │
│ Queue       │ & buat susulan      │ & Draf Mesej Cadangan  │ & Notion API │ Terbiar    │
├─────────────┼─────────────────────┼────────────────────────┼──────────────┼────────────┤
│ Appointment │ Operator set jam &  │ Auto Calendar Lock,    │ Google Cal / │ Show-Up    │
│ Reminders   │ hantar Waze manual  │ Node T-24h & T-2h Waze │ n8n WhatsApp │ > 90%      │
├─────────────┼─────────────────────┼────────────────────────┼──────────────┼────────────┤
│ Weekly      │ Operator kira KPI   │ Auto Metric Aggregate, │ n8n PDF &    │ Delivered  │
│ Reporting   │ & bina PDF manual   │ PDF Gen & WA Dispatch  │ WhatsApp API │ Isnin 9am  │
└─────────────┴─────────────────────┴────────────────────────┴──────────────┴────────────┘
```

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Master Automation Map ZK Revenue Ops |
