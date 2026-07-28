---
Title: Report Automation Specification - ZK Revenue Ops
ID: ZK-AUT-007
Type: Automation System Document
Module: 08_Automation_System / 07_Report_Automation / ZK-AUT-007
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-AUT-007 — Report Automation Specification

> **ZK-AUT-007 | Spesifikasi Automasi Penjanaan Laporan (Report Automation Specs)**

---

## Purpose

Dokumen ini mendefinisikan **Spesifikasi Automasi Pelaporan (*Report Automation Specs*)** yang menyambungkan data Phase 07 dengan enjin penghantaran automatik.

---

## Report Automation Pipeline

```text
[Notion Data Engine] ──> [n8n Metric Aggregator] ──> [n8n PDF Generator] ──> [WhatsApp API Monday 9am]
```

1. **Scheduled Cron Trigger**: n8n melancarkan skrip agregasi data setiap Isnin jam 8:30 AM.
2. **Metric Aggregation**: Memproses jumlah lead, kadar respon, show-up rate, & nilai komisyen pipeline.
3. **Automated PDF Export**: Menjana dokumen PDF Laporan Audit Mingguan yang kemas.
4. **Automated WhatsApp Delivery**: Menghantar fail PDF dan ringkasan mesej ke WhatsApp pelanggan REN pada tepat jam 9:00 AM (`RR-001`).

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Report Automation Spec ZK Revenue Ops |
