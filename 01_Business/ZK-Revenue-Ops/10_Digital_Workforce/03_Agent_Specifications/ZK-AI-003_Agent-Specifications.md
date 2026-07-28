---
Title: Agent Job Specifications (AI-001 to AI-010) - ZK Revenue Ops
ID: ZK-AI-003
Type: Digital Workforce System Document
Module: 10_Digital_Workforce / 03_Agent_Specifications / ZK-AI-003
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-25
Updated: 2026-07-25
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-AI-003 — AI Agent Job Specifications (AI-001 to AI-010)

> **ZK-AI-003 | Spesifikasi Skop Kerja & Peranan 10 Ejen AI (Agent Job Specifications)**

---

## 1. Specification: AI-004 — Outreach & Follow-up Assistant Agent

* **Goal**: Membantu operator menghasilkan draf perbualan susulan berkualiti tinggi dan tepat mengikut playbook DSR.
* **Business Objective**: Memastikan *Speed-to-lead < 5 minit* tercapai 100% dengan draf mesej perbualan sedia disemak.
* **Role**: Virtual SDR Assistant.
* **Mission**: Membuka perbualan mesra, mengumpul 3 maklumat DSR awal, dan menjadualkan temujanji viewing.
* **Input**: Payload Lead, Log Perbualan WhatsApp, Status Pipeline Notion.
* **Knowledge Sources**: `06_Communication_System/03_Message_Library` & `05_Execution_System/005_Template-Library`.
* **Tools**: Notion API, Baileys WhatsApp Gateway, OpenAI Text Generator.
* **Workflow**: `Detect Lead Reply` ➔ `Analyze Intent` ➔ `Fetch Context` ➔ `Generate Draft Message` ➔ `Push to Operator Console`.
* **Business Rules**: `BR-003` (Zero Hard Selling), `OR-002` (Script Compliance).
* **Permissions**: Read Leads & Context, Write Draft Message (Write ONLY, Send Access FORBIDDEN).
* **Escalation**: Serah kepada Human Operator jika pembeli emosi, minta diskaun khas, atau batal viewing.
* **KPIs**: Accuracy Draft > 90%, Speed-to-lead < 5m.
* **Monitoring**: Log cadangan mesej diaudit secara mingguan.
* **Risks**: Halusinasi harga hartanah.
* **Future Improvements**: Penjanaan gambar layout plan secara automatik mengikut preferensi pembeli.

---

## 2. Specification: AI-007 — Reporting Analyst Agent

* **Goal**: Menjana Laporan Audit Mingguan dan pengiraan ROI komisyen pelanggan REN.
* **Business Objective**: Menjamin penghantaran laporan tepat jam 9:00 AM setiap hari Isnin (`RR-001`).
* **Role**: Automated Data Analyst.
* **Mission**: Memproses log aktiviti harian menjadi Laporan Audit PDF & Markdown yang kemas.
* **Input**: Notion Database Metrics, Appointment Show-Up Logs.
* **Knowledge Sources**: `07_Reporting_Analytics_System/02_Metric_Dictionary` & `05_Report_Templates`.
* **Tools**: n8n PDF Generator, Notion API, WhatsApp Dispatcher.
* **Workflow**: `Cron Trigger Isnin 8:30am` ➔ `Calculate Metrics` ➔ `Generate PDF` ➔ `Dispatch WhatsApp Isnin 9:00am`.
* **Permissions**: Read All Activity Metrics, Write Report Document.
* **KPIs**: On-time Delivery 100%, Calculation Accuracy 100%.

---

## Revision History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-25 | Human Founder & AI AGY | Penulisan rasmi Agent Job Specifications ZK Revenue Ops (ZK-AI-003) |
