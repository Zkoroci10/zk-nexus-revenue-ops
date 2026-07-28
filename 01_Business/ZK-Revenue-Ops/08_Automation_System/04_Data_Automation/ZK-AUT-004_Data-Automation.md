---
Title: Data Automation Specification - ZK Revenue Ops
ID: ZK-AUT-004
Type: Automation System Document
Module: 08_Automation_System / 04_Data_Automation / ZK-AUT-004
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-AUT-004 — Data Automation Specification

> **ZK-AUT-004 | Spesifikasi Automasi Data & Pembersihan (Data Automation Specs)**

---

## Purpose

Dokumen ini mendefinisikan **Spesifikasi Automasi Data (*Data Automation Specs*)** bagi memastikan 100% data lead dan transaksi bebas daripada format pelik atau duplikasi.

---

## Core Data Automations

```text
[Raw Input: "012-345 6789"] ──> [n8n Regex Cleaner] ──> [Normalized: "+60123456789"]
                                                                   │
                                                                   ▼
[Notion Ingested] <── [Format Check VR-001] <── [30-Day Index Lookup]
```

1. **Phone Number Normalization (`AUT-DATA-01`)**: Menukar aksara simbol, jarak, dan angka `01...` ke format antarabangsa Malaysia `+601...`.
2. **Automated Deduplication Lookup (`AUT-DATA-02`)**: Menyemak indeks nombor telefon 30 hari secara automatik. Jika wujud, gabungkan rekod log perbualan dan tandakan rekod baharu sebagai *Duplicate Archived*.
3. **Notion Real-Time Sync Engine (`AUT-DATA-03`)**: Memastikan sebarang pertukaran status dalam WhatsApp API diselaraskan ke kad Notion Client Portal secara real-time.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Data Automation Spec ZK Revenue Ops |
