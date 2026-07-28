---
Title: Data Quality Checklist - ZK Revenue Ops
ID: ZK-ANA-006
Type: Reporting & Analytics System Document
Module: 07_Reporting_Analytics_System / 10_Data_Quality / ZK-ANA-006
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-ANA-006 — Data Quality Audit Checklist

> **ZK-ANA-006 | Senarai Semak Kualiti & Kebersihan Data (Data Quality Checklist)**

---

## Core Audit Checklist (Audit Kebersihan Data 100%)

- [ ] **Missing Data Check**: Semua medan wajib (`full_name`, `phone_number`, `project_name`) terisi 100%.
- [ ] **Duplicate Check**: Tiada 2 rekod aktif dengan nombor telefon yang sama dalam tempoh 30 hari.
- [ ] **Wrong Status Check**: Lead berada pada fasa status yang sah mengikut `ZK-WF-010` (Tiada fasa terlompat).
- [ ] **Wrong Owner Check**: `client_id` dipadankan tepat dengan pemegang *Territory Lock*.
- [ ] **Invalid Number Check**: Format nombor disahkan bermula dengan `+601...` dan berdaftar di WhatsApp.
- [ ] **Late Update Check**: Tiada kad lead tergantung tanpa kemaskini status melebihi 24 jam.

---

## Revision History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Data Quality Checklist ZK Revenue Ops |
