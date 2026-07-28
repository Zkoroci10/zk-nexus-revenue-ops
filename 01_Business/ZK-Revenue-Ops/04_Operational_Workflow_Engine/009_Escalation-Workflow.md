---
Title: Escalation Workflow - ZK Revenue Ops
ID: ZK-WF-009
Type: Operational Workflow Engine Document
Module: 04_Operational_Workflow_Engine / 009 Escalation Workflow
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 009: Escalation Workflow

> **ZK-WF-009 | Enjin Aliran Eskalasi Kecemasan & Isu Sensitif (Escalation Engine)**

---

## Workflow Name
**Emergency & High-Priority Operational Escalation Workflow**

## Goal
Mengalirkan kes-kes kecemasan, aduan prospek, prospek bernilai tinggi (VIP), atau isu pertindihan kawalan wilayah (*Territory Lock Collision*) kepada REN atau Founder secara serta-merta (< 15 minit).

## Trigger
Sistem atau Operator mengesan perbualan sensitif, prospek bersedia bayar deposit, atau isu pelanggaran SLA.

---

## Master Escalation Pathways (3 Aliran Eskalasi Utama)

```text
[LEVEL 1: SDR / BOT OPERATOR] ──> Detect Event ──> Evaluate Severity (P1 / P2)
                                                         │
                         ┌───────────────────────────────┴───────────────────────────────┐
                         ▼                                                               ▼
           [PATH A: ESCALATE TO REN]                                       [PATH B: ESCALATE TO FOUNDER]
  • Prospek Marah / Aduan                                         • Territory Lock Collision Issue
  • Prospek VIP Sedia Bayar Booking                               • Pelanggaran SLA / Aduan Retainer
  • Mesej WhatsApp Alert (<15m)                                   • Notifikasi Kecemasan Founder
```

### Path A: Escalation to Client REN (Kehadiran Pembeli / Booking Fee)
1. **Trigger**: Pembeli minta nego harga khusus / sedia bayar booking fee / buat aduan.
2. **Action**: Operator menandakan task sebagai `P1 Critical` dan menghantar kad *Buyer Dossier* kecemasan ke WhatsApp REN.
3. **Completion**: Operator menutup task perbualan dan menyerahkan kawalan 100% kepada REN.

### Path B: Escalation to Founder (Pertindihan Data & SLA)
1. **Trigger**: Sistem mengesan pertindihan pendaftaran projek atau aduan perkhidmatan daripada REN.
2. **Action**: Sistem menghantar amaran notifikasi kecemasan (*Alert*) ke dashboard Founder.
3. **Completion**: Founder membuat keputusan komersial / pelarasan zon wilayah dalam tempoh < 2 jam (`ER-004`).

---

## Related Business Rules & Entities
* `ER-001` (Hierarchy), `ER-002` (Trigger to REN), `ER-003` (Trigger to Founder); Entiti `Notification`, `Task`, `Client`.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Escalation Workflow ZK Revenue Ops (ZK-WF-009) |
