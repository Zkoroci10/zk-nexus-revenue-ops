---
Title: Human-AI Handoff Rules - ZK Revenue Ops
ID: ZK-AI-009
Type: Digital Workforce System Document
Module: 10_Digital_Workforce / 09_Human_AI_Handoff / ZK-AI-009
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-25
Updated: 2026-07-25
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-AI-009 — Human-AI Handoff Rules Engine

> **ZK-AI-009 | Rules Penyerahan Perbualan AI ke Manusia (Human-AI Handoff Engine)**

---

## Purpose

Dokumen ini mendefinisikan **Aturan Penyerahan Perbualan (*Human-AI Handoff Rules*)** yang menetapkan secara tepat bila Ejen AI MESTI berhenti dan menyerahkan tugas kepada Human Operator.

---

## Master Handoff Trigger Matrix

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   ATURAN PENYERAHAN AI KE MANUSIA (HANDOFF)            │
├───────────────────────────────┬───────────────────┬────────────────────┤
│ SITUASI / TRIGER              │ PELAKSANA UTAMA   │ TINDAKAN HANDOFF   │
├───────────────────────────────┼───────────────────┼────────────────────┤
│ Lead Ingest & Deduplication   │ AI-001 & AI-002   │ AI Merge Automatik │
│ Lead Marah / Emosi            │ Human Operator    │ AI Berhenti ➔ Human│
│ Pertanyaan Nego Harga Khas    │ Human Operator    │ AI Berhenti ➔ Human│
│ Appointment Confirmation T-2j │ Human Operator    │ Human Dispatch Waze│
│ Opt-Out / Stop Request        │ AI System         │ Auto Opt-Out & End │
└───────────────────────────────┴───────────────────┴────────────────────┘
```

---

## Revision History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-25 | Human Founder & AI AGY | Penulisan rasmi Human-AI Handoff Rules ZK Revenue Ops |
