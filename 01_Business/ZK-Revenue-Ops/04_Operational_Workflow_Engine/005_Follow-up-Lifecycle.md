---
Title: Follow-up Lifecycle Workflow - ZK Revenue Ops
ID: ZK-WF-005
Type: Operational Workflow Engine Document
Module: 04_Operational_Workflow_Engine / 005 Follow-up Lifecycle
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 005: Follow-up Lifecycle Workflow

> **ZK-WF-005 | Enjin Kitaran Hayat Follow-Up & Reactivation (Follow-Up Cadence Engine)**

---

## Workflow Name
**Multi-Touch Follow-up Cadence & Revival Lifecycle Workflow**

## Goal
Mengendalikan siri kempen susulan berjadual (*Follow-up Cadence*) untuk lead Tier 2 Warm dan kempen pengaktifan semula (*Dormant Lead Revival*) bagi memastikan zero lead terbiar.

## Trigger
Lead tidak merespon perbualan awal ATAU lead ditag sebagai `🌤️ Tier 2 Warm`.

## Pre-conditions
* Lead tidak berada dalam status `Disqualified`, `Opt-Out`, atau `Closed Won`.

## Input
Jadual SLA Touchpoint, Skrip Nurturing, Matriks Penanganan Bantahan (*Objection Playbook*).

---

## Steps & SLA Cadence Breakdown

```text
[No Response] ──> [1st Follow Up (Hari 1 / <5m)] ──> [2nd Follow Up (Hari 3)]
                                                               │
                                                               ▼
[Active Again] <── [Revival Campaign (Hari 14)] <── [Ghost] <── [3rd Follow Up (Hari 7)]
```

1. **No Response**: Lead baharu belum merespon mesej aluan.
2. **1st Follow Up (SLA < 5 Minit / Hari 1)**: Mesej saringan DSR awal & tawaran maklumat hartanah.
3. **2nd Follow Up (SLA Hari ke-3)**: Hantaran gambar/pautan galeri projek & pertanyaan status pinjaman bank.
4. **3rd Follow Up (SLA Hari ke-7)**: Mesej penanganan bantahan harga & semakan kelapangan temujanji viewing.
5. **Ghost (SLA Hari ke-10)**: Prospek ditag sebagai *Ghost / Inactive* (Rehatkan dari mesej harian).
6. **Revival Campaign (SLA Hari ke-14)**: Kempen khas mesej pengaktifan semula (cth: *"Bang, unit tingkat tinggi ni ada diskaun baru masuk"*).
7. **Active Again**: Prospek membalas perbualan ➔ Tukar status ke `🔥 Tier 1 Hot` / `📅 Viewing Booked`.

---

## Decision Points
* **Decision 1**: Adakah prospek membalas mesej pada mana-mana nod touchpoint?
  * *Ya*: Hentikan sequence automatik ➔ Teruskan ke saringan DSR / Booking Viewing.
  * *Tidak*: Teruskan ke nod touchpoint seterusnya mengikut jadual SLA.

## Related Business Rules & Entities
* `SLA-001` (Speed-to-lead <5m), `SLA-002` (Touchpoint Cadence); Entiti `Lead`, `Task`, `Message`.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Follow-up Lifecycle Workflow ZK Revenue Ops (ZK-WF-005) |
