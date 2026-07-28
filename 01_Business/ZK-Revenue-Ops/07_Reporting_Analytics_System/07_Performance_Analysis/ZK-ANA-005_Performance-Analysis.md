---
Title: Performance Analysis - ZK Revenue Ops
ID: ZK-ANA-005
Type: Reporting & Analytics System Document
Module: 07_Reporting_Analytics_System / 07_Performance_Analysis / ZK-ANA-005
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-ANA-005 — Performance Analysis Framework

> **ZK-ANA-005 | Rangka Kerja Analisis Punca Masalah & Perbetulan (Root Cause Analysis Framework)**

---

## Purpose

Dokumen ini mendefinisikan **Rangka Kerja Analisis Prestasi (*Performance Analysis Framework*)** untuk menukar data laporan menjadi eksperimen perbetulan strategi secara sistematik.

---

## 5-Step Diagnostic Architecture

```text
[1. Problem Detection] ──> [2. Root Cause Analysis] ──> [3. Recommendation] ──> [4. Experiment] ──> [5. Result]
```

### Real-World Diagnostic Case Study

* **Step 1: Problem Detection (Pengesanan Isu)**
  * *Pemerhatian*: Bilangan temujanji viewing jatuh 40% pada minggu ke-3 untuk Projek Subang Subsale.
* **Step 2: Root Cause Analysis (Analisis Punca Masalah)**
  * *Semakan 1*: Lead Reply Rate normal (48%).
  * *Semakan 2*: Qualification Rate jatuh dari 35% ke 12%.
  * *Dapatan Punca*: Iklan FB baharu menarik pemohon berpendapatan rendah (< RM2,500) yang tidak melepasi kelayakan loan bank (DSR Fail).
* **Step 3: Recommendation (Syor Perbetulan)**
  * Tukar penapisan segmen borang iklan FB Ads ke julat pendapatan > RM4,000 dan tambah soalan DSR wajib dalam borang.
* **Step 4: Experiment (Eksperimen 7 Hari)**
  * Jalankan set iklan baharu dengan penapis DSR diperketatkan selama 7 hari.
* **Step 5: Result (Hasil Eksperimen)**
  * Qualification Rate meningkat semula ke 38% dan temujanji viewing pulih sebanyak 50%.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Performance Analysis ZK Revenue Ops |
