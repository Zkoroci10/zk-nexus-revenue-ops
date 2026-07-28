---
Title: Task Lifecycle Workflow - ZK Revenue Ops
ID: ZK-WF-006
Type: Operational Workflow Engine Document
Module: 04_Operational_Workflow_Engine / 006 Task Lifecycle
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 006: Task Lifecycle Workflow

> **ZK-WF-006 | Enjin Kitaran Hayat Tugasan Operasi (Task Lifecycle Engine)**

---

## Workflow Name
**Operator & System Task Lifecycle Workflow**

## Goal
Menguruskan penugasan, pemantauan SLA, dan pengesahan kualiti tugasan operasi (*Operational Tasks*) yang dikendalikan oleh SDR Operator Manusia mahupun Bot Automasi.

## Trigger
Peristiwa sistem mencetuskan tugasan baharu (cth: Lead baharu masuk, Peringatan T-24j diperlukan, Laporan mingguan perlu dijana).

## Pre-conditions
* Task mempunyai ID tugasan unik, sasaran tarikh akhir (*Due Date*), dan tahap keutamaan (`P1` hingga `P4`).

## Input
Metadata tugasan, ID Lead terlibat, ID Operator ditugaskan.

---

## Steps (Aliran 6 Fasa Kitaran Hayat Task)

```text
[CREATED] ──> [ASSIGNED] ──> [IN PROGRESS] ──> [COMPLETED] ──> [VERIFIED] ──> [ARCHIVED]
```

1. **Created**: Task dicipta secara automatik oleh webhook sistem atau pencetus peristiwa.
2. **Assigned**: Task diumpukkan kepada giliran (*queue*) SDR Operator atau Bot Automasi.
3. **In Progress**: Operator/Bot mula memproses tugasan.
4. **Completed**: Operator/Bot selesai melaksanakan tindakan (cth: Mesej hantar, Dossier siap).
5. **Verified**: Bot audit menyemak pematuhan SLA dan integriti data.
6. **Archived**: Task disimpan dalam log audit sejarah.

---

## Related Business Rules & Entities
* `PS-001` (Priority Standard P1–P4), `SLA-003` (Support SLA); Entiti `Task`, `Operator`, `Activity`.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Task Lifecycle Workflow ZK Revenue Ops (ZK-WF-006) |
