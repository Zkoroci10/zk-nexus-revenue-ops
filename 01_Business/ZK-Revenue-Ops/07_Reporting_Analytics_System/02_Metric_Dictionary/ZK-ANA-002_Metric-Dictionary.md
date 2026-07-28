---
Title: Metric Dictionary - ZK Revenue Ops
ID: ZK-ANA-002
Type: Reporting & Analytics System Document
Module: 07_Reporting_Analytics_System / 02_Metric_Dictionary / ZK-ANA-002
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-ANA-002 — Metric Dictionary

> **ZK-ANA-002 | Kamus Nombor & Definisi Metrik (Metric Dictionary)**

---

## Purpose

Dokumen ini mendefinisikan **Kamus Nombor Rasmi (*Metric Dictionary*)** ZK Revenue Ops. Setiap metrik wajib mempunyai definisi jelas, formula pengiraan, sumber data, sasaran (*target*), dan tindakan perbetulan (*Action Trigger*).

---

## Master Metric Specifications

### 1. Metric: Speed-to-Lead Response Time (`MET-001`)
* **Definition**: Masa yang diambil dari saat lead mendaftar hingga mesej WhatsApp aluan pertama dihantar.
* **Formula**: `Timestamp First Message Sent - Timestamp Lead Created`
* **Data Source**: n8n Webhook Logs & WhatsApp API Gateway.
* **Frequency**: Real-time / Daily Audit.
* **Owner**: System Bot / SDR Operator.
* **Target**: `< 5 Minit` (Waktu Operasi 9am–8:30pm).
* **Action Trigger**: Jika purata > 5 minit ➔ Cetus P1 SLA Alert & tukar ke manual operator takeover.

### 2. Metric: Lead Response Rate (`MET-002`)
* **Definition**: Peratusan lead yang memberi respon selepas mesej saringan awal dihantar.
* **Formula**: `(Jumlah Responded Leads ÷ Jumlah Contacted Leads) × 100`
* **Data Source**: Notion Master Database (`RESPONDED` Status).
* **Frequency**: Mingguan.
* **Owner**: SDR Operator / AI Triage Agent.
* **Target**: `≥ 45%`.
* **Action Trigger**: Jika turun < 45% ➔ Semak semula skrip mesej aluan (`TMP-MSG-01`).

### 3. Metric: Qualification Rate (`MET-003`)
* **Definition**: Peratusan lead berespon yang memenuhi kriteria DSR gaji & loan bank (ditag Tier 1 & Tier 2).
* **Formula**: `(Jumlah Qualified Leads ÷ Jumlah Responded Leads) × 100`
* **Data Source**: Notion Master Database (Tier Tagging).
* **Frequency**: Mingguan.
* **Owner**: SDR Operator / AI Triage Agent.
* **Target**: `≥ 30%`.
* **Action Trigger**: Jika turun < 30% ➔ Audit kriteria sasaran borang iklan FB/TikTok.

### 4. Metric: Viewing Show-Up Rate (`MET-004`)
* **Definition**: Peratusan temujanji viewing yang dihadiri pembeli secara fizikal.
* **Formula**: `(Jumlah Viewing Completed ÷ Jumlah Confirmed Appointments) × 100`
* **Data Source**: Notion Client Portal (`Viewing Show-Up`).
* **Frequency**: Mingguan.
* **Owner**: Client REN & SDR Operator.
* **Target**: `≥ 85%`.
* **Action Trigger**: Jika turun < 85% ➔ Perketatkan penguatkuasaan Protokol Anti-Ghosting T-2j & Waze Card.

### 5. Metric: Client ROI Multiplier (`MET-005`)
* **Definition**: Nisbah komisyen jualan hartanah terhasil berbanding yuran retainer ZK Revenue Ops.
* **Formula**: `Jumlah Komisyen Hartanah Terkunci (RM) ÷ Yuran Monthly Retainer ZK (RM)`
* **Data Source**: Client Retention Ledger & Deal Receipt Log.
* **Frequency**: Bulanan.
* **Owner**: Founder (Zubair Ariff).
* **Target**: `3x – 5x ROI`.
* **Action Trigger**: Jika turun < 2x ROI ➔ Cetus Strategy Audit Percuma (`RR-004`).

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Metric Dictionary ZK Revenue Ops |
