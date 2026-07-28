---
Title: Agent Memory System - ZK Revenue Ops
ID: ZK-AI-007
Type: Digital Workforce System Document
Module: 10_Digital_Workforce / 07_Agent_Memory / ZK-AI-007
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-25
Updated: 2026-07-25
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-AI-007 — Agent Memory System Specification

## Memory vs Knowledge Distinction
* **Knowledge**: Maklumat statik (SOP, Playbook, FAQ, Formats).
* **Memory**: Data dinamik konteks perbualan (Conversation History, Previous Touchpoint Responses, Buyer Preference, Recent Activity Log).

## Memory Storage Architecture
* **Short-Term Memory**: In-memory cache perbualan aktif 24 jam.
* **Long-Term Memory**: Log perbualan tersimpan dalam SQLite / PocketBase `activities` table.

---

## Revision History
| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-25 | Human Founder & AI AGY | Penulisan rasmi Agent Memory System ZK Revenue Ops |
