---
Title: Software QA Test Cases - ZK Revenue Ops
ID: ZK-TEST-001
Type: Software Specification System Document
Module: 09_Software_Specification / 13_QA_Testing / ZK-TEST-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-TEST-001 — End-to-End Software Test Cases

## Master Test Cases Suite

| Test ID | Senario Ujian | Hasil Jangkaan | Keputusan |
| :--- | :--- | :--- | :--- |
| **TC-001** | Operator cuba padam kad lead | Sistem menyekat tindakan (`VR-002 Violation Error`). | PASS ✅ |
| **TC-002** | Lead baharu masuk via webhook | Deduplikasi 30 hari berjalan & status bertukar `📥 New Lead`. | PASS ✅ |
| **TC-003** | REN `SEAT-001` cuba buka URL `SEAT-002` | RLS menyekat akses (`HTTP 403 Forbidden`). | PASS ✅ |

---

## Revision History
| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Software QA Test Cases ZK Revenue Ops |
