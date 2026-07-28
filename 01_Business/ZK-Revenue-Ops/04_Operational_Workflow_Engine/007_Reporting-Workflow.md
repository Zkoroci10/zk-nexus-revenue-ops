---
Title: Reporting Workflow - ZK Revenue Ops
ID: ZK-WF-007
Type: Operational Workflow Engine Document
Module: 04_Operational_Workflow_Engine / 007 Reporting Workflow
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 007: Reporting Workflow

> **ZK-WF-007 | Enjin Aliran Pelaporan Audit & Metrik (Reporting Engine Workflow)**

---

## Workflow Name
**Performance Reporting & Audit Flow**

## Goal
Mengagregatkan log aktiviti harian menjadi Laporan Audit Mingguan dan pengiraan Nisbah ROI Komisyen bulanan bagi menjamin ketelusan 100%.

## Trigger
Pencetus masa automatik (*Cron Trigger*):
* Harian (11:59 PM): Penjanaan Ringkasan Harian.
* Mingguan (Isnin 8:30 AM): Penjanaan Laporan Audit Mingguan.
* Bulanan (28hb): Penjanaan Laporan ROI Bulanan.

## Pre-conditions
* Semua status lead dan rekod temujanji telah dikemas kini dalam Notion Client Portal.

## Input
Log Aktiviti, Status Pipeline Lead, Rekod Viewing Show-up, Nilai Komisyen Terkunci.

---

## Steps (Aliran 5 Peringkat Pelaporan)

```text
[Activity Logs] ──> [Daily Summary] ──> [Weekly KPI Report] ──> [Monthly ROI Report] ──> [Quarterly Review]
```

1. **Activity Logs**: Merekodkan setiap perbualan & perubahan status secara real-time.
2. **Daily Summary**: Kompilasi angka lead masuk & status temujanji harian pada jam 11:59 malam.
3. **Weekly KPI Report**: Penjanaan dokumen Laporan Audit Mingguan dan hantaran ke WhatsApp REN pada hari Isnin jam 9:00 pagi (`RR-001`).
4. **Monthly ROI Report**: Kiraan nisbah komisyen terhasil berbanding yuran langganan ZK Revenue Ops (Target 3x–5x ROI).
5. **Quarterly Review**: Semakan prestasi strategik suku tahunan bersama Founder.

---

## Related Business Rules & Entities
* `RR-001` (Monday 9 AM Delivery), `RR-002` (Mandatory Metrics), `RR-004` (Low ROI Audit Trigger); Entiti `Report`, `Client`, `Dashboard`.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Reporting Workflow ZK Revenue Ops (ZK-WF-007) |
