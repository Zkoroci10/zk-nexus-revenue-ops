---
Title: Feature Specs: Client Portal & PDF Engine - ZK Revenue Ops
ID: ZK-FEAT-003
Type: Feature Specification Document
Module: 09_Software_Specification / 05_Feature_Specification / ZK-FEAT-003
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-FEAT-003, ZK-FEAT-004 & ZK-FEAT-005 — Core Application Specs

## ZK-FEAT-003: Client REN Growth Portal
* **Goal**: Memberi paparan telus real-time untuk REN semak lead Hot, temujanji, & nilai komisyen pipeline.
* **UI Components**: Total Leads Counter, Confirmed Viewings Badge, Interactive Notion Kanban Board View, Recent Activity Stream.
* **Permissions**: Access Restricted strictly to `client_id = current_seat_id`.

---

## ZK-FEAT-004: Viewing & Waze Dispatch Engine
* **Goal**: Melaksanakan Protokol Anti-Ghosting T-24j & T-2j beserta hantaran kad Dossier & pautan Waze.
* **UI Components**: Calendar Slot Picker, Buyer Dossier Summary Card, 1-Click Waze Navigation Button.

---

## ZK-FEAT-005: Monday Audit PDF Engine
* **Goal**: Menjana Laporan Audit Mingguan PDF dan menghantarnya ke WhatsApp REN pada Isnin jam 9:00 AM (`RR-001`).
* **Workflow**: `Cron Trigger (Isnin 8:30am)` ➔ `Aggregate Metrics` ➔ `Generate PDF Document` ➔ `Dispatch WhatsApp Message`.

---

## Revision History
| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Client Portal & PDF Engine Specs |
