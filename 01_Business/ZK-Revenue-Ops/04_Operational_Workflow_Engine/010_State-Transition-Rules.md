---
Title: State Transition Rules - ZK Revenue Ops
ID: ZK-WF-010
Type: Operational Workflow Engine Document
Module: 04_Operational_Workflow_Engine / 010 State Transition Rules
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 010: State Transition Rules Matrix

> **ZK-WF-010 | Perlembagaan Matriks Pertukaran Status Sah vs Haram (State Transition Rules)**

---

## Purpose

Dokumen ini menetapkan **matriks pertukaran status rasmi (*State Transition Rules Matrix*)** yang mengawal pergerakan fasa lead dan entiti sistem. Pertukaran status yang tidak tersenarai sebagai `✅ Sah` adalah **HARAM & DILARANG (*FORBIDDEN*)** di peringkat kod backend, API, Notion Portal, mahupun AI Workers.

---

## Master State Transition Matrix Table

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MATRIKS PERTUKARAN STATUS SAH VS HARAM                          │
├─────────────────┬─────────────────┬──────────┬──────────────────────┬──────────────────┤
│ FROM STATE      │ TO STATE        │ ALLOWED? │ SYARAT PENCETUS      │ ACTOR DIBENARKAN │
├─────────────────┼─────────────────┼──────────┼──────────────────────┼──────────────────┤
│ `NEW`           │ `VERIFIED`      │ ✅ SAH   │ Clean & Format OK    │ System Bot       │
│ `VERIFIED`      │ `ASSIGNED`      │ ✅ SAH   │ Territory Seat Match │ System Bot       │
│ `ASSIGNED`      │ `CONTACTED`     │ ✅ SAH   │ WhatsApp Sent (<5m)  │ Bot / SDR        │
│ `CONTACTED`     │ `RESPONDED`     │ ✅ SAH   │ Buyer Replied Chat   │ Bot / SDR        │
│ `RESPONDED`     │ `QUALIFIED`     │ ✅ SAH   │ DSR Triage Done      │ Bot / SDR        │
│ `QUALIFIED`     │ `APPOINTMENT`   │ ✅ SAH   │ Viewing Slot Selected│ Virtual SDR      │
│ `APPOINTMENT`   │ `HANDED TO REN` │ ✅ SAH   │ T-2h Confirmed + Waze│ Virtual SDR      │
│ `HANDED TO REN` │ `CLOSED WON`    │ ✅ SAH   │ Deposit Receipt Logged│ Client REN       │
│ `HANDED TO REN` │ `CLOSED LOST`   │ ✅ SAH   │ Buyer Rejected Unit  │ Client REN / SDR │
├─────────────────┼─────────────────┼──────────┼──────────────────────┼──────────────────┤
│ `NEW`           │ `APPOINTMENT`   │ ❌ HARAM │ Tak Boleh Skip Triage│ N/A (Blocked)    │
│ `GHOST`         │ `CLOSED WON`    │ ❌ HARAM │ Wajib Re-Qualify     │ N/A (Blocked)    │
│ `ARCHIVED`      │ `ACTIVE`        │ ❌ HARAM │ Wajib Re-Ingest Lead │ N/A (Blocked)    │
│ `DISQUALIFIED`  │ `CLOSED WON`    │ ❌ HARAM │ No Loan/No Deposit   │ N/A (Blocked)    │
└─────────────────┴─────────────────┴──────────┴──────────────────────┴──────────────────┘
```

---

## 1. System Transition Guardrail Rules (Undang-Undang Penguatkuasaan System)

* **TR-001.1**: Sebarang permohonan API atau kemaskini Notion Portal yang cuba melompati fasa status (cth: dari `NEW` terus ke `APPOINTMENT`) WAJIB ditolak secara automatik oleh backend validator (*Validation Error 400 Bad Request*).
* **TR-001.2**: AI Workers DILARANG menukar status lead ke `CLOSED WON` tanpa lampiran resit deposit jualan yang dimasukkan oleh pelanggan REN.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Peraturan Pertukaran Status ZK Revenue Ops (ZK-WF-010) |
