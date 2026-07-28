---
Title: Analytics Framework - ZK Revenue Ops
ID: ZK-ANA-001
Type: Reporting & Analytics System Document
Module: 07_Reporting_Analytics_System / 01_Analytics_Framework / ZK-ANA-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-ANA-001 — Analytics Framework

> **ZK-ANA-001 | Rangka Kerja Analitik & Intelijen Perniagaan (Analytics Framework Blueprint)**

---

## Purpose

Dokumen ini menetapkan **Rangka Kerja Analitik (*Analytics Framework*)** yang mengarahkan cara pemikiran berasaskan data (*data-driven thinking*) dalam ZK Revenue Ops. Rangka kerja ini memastikan setiap data yang dikumpul berupaya menjawab soalan perniagaan (*Decision-Making Questions*) dan mencetuskan tindakan perbetulan (*Action Layer*) secara tepat.

---

## Decision-Making Framework Architecture

```text
[Business Decision Question] ──> [Data Sources] ──> [Analysis Layer] ──> [Reporting Layer] ──> [Action Layer]
```

### 1. Decision-Making Questions (Soalan Bisnes Utama)
* *"Kenapa bilangan temujanji viewing turun minggu ini?"*
* *"Projek hartanah mana yang menghasilkan nisbah ROI komisyen tertinggi untuk REN?"*
* *"Operator SDR atau bot automasi mana yang mengalami kebocoran SLA terbanyak?"*

### 2. Data Sources (Sumber Data Teras)
* Notion Master Database & Client Portals.
* Log Webhook n8n & WhatsApp API Gateway.
* Log Aktiviti Operator & System Audit Logs.

### 3. Analysis Layer (Lapisan Analisis Data)
* Analisis Funnel Perjalanan Lead (*Funnel Conversion Analytics*).
* Analisis Corak Ghosting (*Anti-Ghosting Behavioral Analytics*).
* Analisis Pematuhan SLA (*Response Time & Resolution Speed*).

### 4. Reporting Layer (Lapisan Pelaporan Visual)
* Client Performance Portal (Notion Board).
* Weekly Audit Report (Isnin 9am PDF & Markdown).
* Executive Control Dashboard.

### 5. Action Layer (Lapisan Tindakan & Perbetulan)
* Sekiranya Reply Rate turun ➔ Tukar skrip perbualan WhatsApp (`TMP-MSG-01`).
* Sekiranya Qualification Rate turun ➔ Semak semula kriteria penyerapan iklan FB/TikTok.
* Sekiranya Show-up Rate turun ➔ Perketatkan Protokol Anti-Ghosting T-2j.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Analytics Framework ZK Revenue Ops |
