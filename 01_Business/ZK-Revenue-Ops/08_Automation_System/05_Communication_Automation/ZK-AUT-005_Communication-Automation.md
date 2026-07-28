---
Title: Communication Automation Specification - ZK Revenue Ops
ID: ZK-AUT-005
Type: Automation System Document
Module: 08_Automation_System / 05_Communication_Automation / ZK-AUT-005
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-AUT-005 — Assistive Communication Automation Specification

> **ZK-AUT-005 | Spesifikasi Automasi Komunikasi Berpandu (Assistive Communication Specs)**

---

## Core Rule: "Assistive Automation First, Zero Spam"

Dalam ZK Revenue Ops, automasi komunikasi pada fasa awal dilaksanakan secara **Assistive Automation (*Automasi Berpandu*)**. Sistem DILARANG menghantar mesej bertubi-tubi (*robot spamming*) tanpa kawalan mutu operator.

---

## Assistive Communication Workflow

```text
[New Lead Ingested] ──> [Generate Follow-up Task] ──> [Suggest Message Template]
                                                               │
                                                               ▼
[WhatsApp Delivered] <── [Send Action] <── [Operator Review & Approve]
```

1. **Lead Ingestion**: Lead baharu didaftarkan dalam pangkalan data.
2. **Task Generation**: Sistem menjana tugasan saringan dalam Operator Dashboard.
3. **Message Suggestion**: Bot secara automatik mengisi templat mesej WhatsApp (`TMP-MSG-01`) beserta pembolehubah nama pembeli & projek.
4. **Operator Approval**: Operator menyemak teks dan menekan butang `Approve & Send`.
5. **WhatsApp Delivery**: Gateway menghantar mesej ke WhatsApp prospek (< 5 minit SLA).

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Communication Automation Spec ZK Revenue Ops |
