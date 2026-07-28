---
Title: Success Metrics & Performance KPIs - ZK Revenue Ops
ID: ZK-FND-010
Type: Foundation Document
Module: 00_Foundation / 010 Success Metrics
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Exclusive Seats)
---

# 010: Success Metrics & Performance KPIs

> **ZK-FND-010 | Modul 010 — Indikator Kejayaan & Metrik Prestasi ZK Revenue Ops**

---

## Executive Purpose

Dokumen ini mendefinisikan **Matriks Indikator Kejayaan (*Success Metrics & KPIs*)** yang digunakan untuk mengukur kecekapan sistem, prestasi Virtual SDR, kepuasan pelanggan REN, dan kadar pulangan pelaburan (ROI) ZK Revenue Ops.

---

## Core Success Metrics Architecture (4 Lapisan Metrik Utama)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      4 LAPISAN METRIK KEJAYAAN                         │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│ TIER 1:      │ TIER 2:      │ TIER 3:      │ TIER 4:      │ CLIENT     │
│ SYSTEM       │ PIPELINE &   │ VIEWING &    │ BUSINESS &   │ RETENTION  │
│ EFFICIENCY   │ TRIAGE       │ SHOW-UP      │ CLIENT ROI   │ & NPS      │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
```

---

## Metric Measurement Framework (Matriks Pengukuran KPI)

### Tier 1: System & Operational Efficiency Metrics (Kecekapan Operasi)
| Metrik | Definisi | Target KPI | Frekuensi Semakan |
| :--- | :--- | :--- | :--- |
| **Speed-to-Lead Response Time** | Masa daripada lead mendaftar hingga mesej aluan pertama dihantar. | **< 5 Minit** (95% kes) | Real-time / Harian |
| **Zero Lead Leakage Rate** | Peratusan lead yang didaftarkan dan diberi tag kelayakan status. | **100%** | Harian |
| **Data Cleaning Accuracy** | Peratusan nombor duplikasi/rosak yang diasingkan dari queue. | **100%** | Harian |

### Tier 2: Lead Qualification & Triage Metrics (Kualiti Saringan)
| Metrik | Definisi | Target KPI | Frekuensi Semakan |
| :--- | :--- | :--- | :--- |
| **Tier 1 Qualification Ratio** | Peratusan lead mentah yang melepasi saringan *Pre-Approved Loan / Cash*. | **15% – 25%** | Mingguan |
| **Triage Accuracy Rate** | Ketepatan tag kelayakan Tier 1 apabila prospek sampai kepada REN. | **> 90%** | Mingguan |
| **Reactivation Success Rate** | Peratusan lead dormant lama yang berjaya diaktifkan semula. | **> 12%** | Bulanan |

### Tier 3: Viewing & Attendance Metrics (Kehadiran Temujanji)
| Metrik | Definisi | Target KPI | Frekuensi Semakan |
| :--- | :--- | :--- | :--- |
| **Viewing Booking Rate** | Peratusan lead Tier 1 yang bersetuju mengunci slot temujanji. | **> 40%** | Mingguan |
| **Viewing Show-Up Rate** | Peratusan pembeli yang hadir secara fizikal di lokasi viewing. | **> 90%** | Mingguan |
| **Ghosting Rate** | Peratusan pembeli yang batalkan temujanji di saat akhir tanpa makluman. | **< 10%** | Mingguan |

### Tier 4: Business Revenue & Client ROI Metrics (Hasil Jualan & Retention)
| Metrik | Definisi | Target KPI | Frekuensi Semakan |
| :--- | :--- | :--- | :--- |
| **Client ROI Multiplier** | Nisbah komisyen jualan terkunci berbanding yuran langganan ZK. | **3x – 5x ROI** | Bulanan |
| **Client Retention Rate** | Peratusan pelanggan REN yang memperbaharui langganan retainer. | **> 85%** | Bulanan |
| **Territory Seat Occupancy** | Bilangan kerusi REN yang terisi daripada had kuota 30 seat. | **30 / 30 Seats** | Bulanan |

---

## SLA (Service Level Agreement) Thresholds & Violations

```text
  [GREEN LEVEL 🟢] ──> Speed-to-Lead <5m | Show-up >90% | Client ROI >3x ──> System Nominal
  [AMBER LEVEL 🟡] ──> Speed-to-Lead 5m-15m | Show-up 80-89% | Client ROI 2x-3x ──> Trigger Strategy Review
  [RED LEVEL 🔴]   ──> Speed-to-Lead >15m | Show-up <80% | Client ROI <2x ──> Immediate Operational Audit
```

* **JIKA** Speed-to-Lead melebihi 15 minit: Automasi n8n dihantar mesej amaran (*alert*) kepada Founder.
* **JIKA** Client ROI berada di bawah 2x dalam tempoh 60 hari: Audit percuma ke atas skrip outreach & kualiti iklan REN wajib dilaksanakan.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Indikator Kejayaan ZK Revenue Ops (ZK-FND-010) |
