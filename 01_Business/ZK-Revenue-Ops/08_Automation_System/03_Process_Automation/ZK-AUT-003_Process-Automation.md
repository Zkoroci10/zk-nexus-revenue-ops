---
Title: Process Automation Specification - ZK Revenue Ops
ID: ZK-AUT-003
Type: Automation System Document
Module: 08_Automation_System / 03_Process_Automation / ZK-AUT-003
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-AUT-003 — Process Automation Specification

> **ZK-AUT-003 | Spesifikasi Automasi Proses Teras (Process Automation Specs)**

---

## Purpose

Dokumen ini mendefinisikan **Spesifikasi Automasi Proses Teras (*Process Automation Specs*)** bagi menguruskan aliran lead dari Ingestion hingga CRM Sync.

---

## Core Process Automations

### 1. Lead Assignment Automation (`AUT-PROC-01`)
* **Input Trigger**: Payload lead baharu melepasi fasa validation.
* **Automation Rule**: Padankan `project_name` lead dengan pangkalan data kerusi eksklusif `SEAT-001` hingga `SEAT-030`.
* **Output Action**: Tetapkan medan `client_id` dalam kad Notion Lead dan bina tugasan outreach operator secara automatik.

### 2. Follow-Up Queue Automation (`AUT-PROC-02`)
* **Input Trigger**: Pencetus masa Cron Harian (Jam 9:00 AM).
* **Automation Rule**: Cari semua lead berstatus `🌤️ Tier 2 Warm` yang belum menerima touchpoint mengikut sela hari (Hari 1, 3, 7, 14).
* **Output Action**: Hasilkan *Today's Follow-up Queue* dalam Operator Dashboard bersama draf templat mesej.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Process Automation Spec ZK Revenue Ops |
