---
Title: Security & Data Isolation - ZK Revenue Ops
ID: ZK-SEC-001
Type: Software Specification System Document
Module: 09_Software_Specification / 12_Security / ZK-SEC-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-SEC-001 — Security & Row-Level Isolation Policy

> **ZK-SEC-001 | Polisi Keselamatan & Perlindungan Data Terasing (Security Specification)**

---

## Core Security Requirements

1. **Row-Level Security (RLS) Enforcement**: Setiap query SQL ke pangkalan data WAJIB ditapis mengikut ID kerusi pengguna (`WHERE client_id = current_seat_id`). Pengguna REN `SEAT-001` dilarang membaca data `SEAT-002`.
2. **PDPA 2010 Data Encryption**: Teks perbualan sensitif dan nombor telefon dienkripsikan di peringkat pangkalan data (`AES-256 Encryption`).
3. **Cardless Zero-Risk Policy**: Tiada sebarang maklumat kad kredit/debit disimpan atau digunakan dalam sistem.

---

## Revision History
| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Security & RLS Policy ZK Revenue Ops |
