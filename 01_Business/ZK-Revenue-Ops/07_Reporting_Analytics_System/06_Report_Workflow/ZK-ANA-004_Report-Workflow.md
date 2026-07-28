---
Title: Report Workflow - ZK Revenue Ops
ID: ZK-ANA-004
Type: Reporting & Analytics System Document
Module: 07_Reporting_Analytics_System / 06_Report_Workflow / ZK-ANA-004
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-ANA-004 — Report Workflow Engine

> **ZK-ANA-004 | Enjin Aliran Pelaporan & Penyampaian (Report Generation Workflow)**

---

## Purpose

Dokumen ini mengawal **aliran pemprosesan laporan (*Report Generation Workflow*)** daripada pengumpulan data mentah, pengesahan, pengiraan metrik, penjanaan dokumen, hingga serahan ke pelanggan REN.

---

## 7-Stage Report Pipeline Architecture

```text
[1. Data Collection] ──> [2. Validation] ──> [3. Calculation] ──> [4. Analysis]
                                                                        │
                                                                        ▼
[7. Action Plan] <── [6. Client Review] <── [5. Report Generation] ◄────┘
```

1. **Data Collection**: Mengumpul log perbualan & perubahan status dari Notion Master Database & Webhook Logs.
2. **Data Validation**: Memastikan tiada missing status atau nombor telefon rosak dalam rekod mingguan.
3. **Metric Calculation**: Mengira kadar respon, qualification rate, show-up rate, & nilai komisyen pipeline (Guna formula `ZK-ANA-002`).
4. **Performance Analysis**: Mengenal pasti punca masalah sekiranya sebarang metrik berada di bawah sasaran (*Target Breach*).
5. **Report Generation**: Menjana fail PDF dan Mesej Markdown secara automatik via n8n PDF Engine.
6. **Client Review**: Menghantar Laporan Audit Mingguan ke WhatsApp REN pada Isnin jam 9:00 AM (`RR-001`).
7. **Action Plan Execution**: Melaksanakan tindakan perbetulan strategi mengikut cadangan laporan.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Report Workflow ZK Revenue Ops |
