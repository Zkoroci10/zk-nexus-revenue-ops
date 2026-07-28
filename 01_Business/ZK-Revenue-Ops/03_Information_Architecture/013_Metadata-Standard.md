---
Title: Metadata Standard - ZK Revenue Ops
ID: ZK-IA-013
Type: Information Architecture Document
Module: 03_Information_Architecture / 013 Metadata Standard
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 013: Metadata Standard

> **ZK-IA-013 | Perlembagaan Piawaian Metadata Dokumen & Rekod System**

---

## Purpose

Dokumen ini menetapkan **piawaian metadata rasmi (*Metadata Standard*)** yang wajib diletakkan pada bahagian atas setiap fail markdown (*YAML Frontmatter*) dan pada setiap rekod pangkalan data bagi memudahkan pengindeksan automatik oleh AI/AGI Agents dan carian sistem.

---

## 1. Mandatory YAML Frontmatter Standard (Metadata Dokumen)

Setiap fail markdown WAJIB mengandungi blok metadata YAML berikut di garisan paling atas:

```yaml
---
Title: [Nama Tajuk Dokumen]
ID: [Object ID cth: ZK-IA-001]
Type: [Information Architecture / Governance / Foundation / SOP]
Module: [Laluan Modul cth: 03_Information_Architecture / 001 Entity Dictionary]
BU: ZK Revenue Ops
Status: [Active Blueprint / Draft / Archived]
Version: 1.0
Created: YYYY-MM-DD
Updated: YYYY-MM-DD
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---
```

---

## 2. System Record Metadata Standard (Metadata Rekod Database)

Setiap rekod dalam database (Lead, Appointment, Client, Task) WAJIB mempunyai 4 medan metadata audit berikut:

* `created_at`: ISO 8601 UTC Timestamp (cth: `2026-07-24T17:10:00Z`).
* `created_by`: ID Pengguna / Bot pencipta rekod (`actor_id`).
* `updated_at`: ISO 8601 UTC Timestamp kemaskini terakhir.
* `updated_by`: ID Pengguna / Bot pengemas kini terakhir.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Piawaian Metadata ZK Revenue Ops (ZK-IA-013) |
