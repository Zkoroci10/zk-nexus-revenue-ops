---
Title: Agent Knowledge Segregation - ZK Revenue Ops
ID: ZK-AI-005
Type: Digital Workforce System Document
Module: 10_Digital_Workforce / 05_Agent_Knowledge / ZK-AI-005
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-25
Updated: 2026-07-25
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-AI-005 — Agent Knowledge Segregation Architecture

> **ZK-AI-005 | Senibina Pengasingan Sumber Pengetahuan Ejen AI (Agent Knowledge Architecture)**

---

## Core Rule: "No Unnecessary Context Bloat"

Ejen AI DILARANG membaca keseluruhan pangkalan data secara melulu. Setiap ejen AI **HANYA DIBENARKAN** mengakses domain pengetahuan (*Knowledge Domain*) yang relevan dengan skop kerjanya sahaja:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MATRIKS DOMAIN PENGETAHUAN EJEN AI                   │
├───────────┬─────────────────────────┬──────────────────────────────────┤
│ KOD EJEN  │ NAMA EJEN AI            │ DOMAIN PENGETAHUAN DIBENARKAN    │
├───────────┼─────────────────────────┼──────────────────────────────────┤
│ `AI-001`  │ Lead Intake Agent       │ Validation Rules & Format Specs  │
│ `AI-002`  │ Lead Cleaner Agent      │ Phone Regex & Deduplication Index│
│ `AI-003`  │ Lead Scoring AI (Triage)│ DSR Calculation Rules & Bank Docs│
│ `AI-004`  │ Outreach Assistant      │ Message Library & Property Specs │
│ `AI-005`  │ Follow-up Assistant     │ Objection Playbook & FAQ Sheet   │
│ `AI-007`  │ Reporting Analyst AI    │ Metric Dictionary & Report Specs │
│ `AI-008`  │ QA Audit Assistant      │ QA Audit Rubrics & Ethics Rules  │
│ `AI-009`  │ Knowledge Assistant     │ Master SOP & System Manuals      │
└───────────┴─────────────────────────┴──────────────────────────────────┘
```

---

## Revision History
| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-25 | Human Founder & AI AGY | Penulisan rasmi Agent Knowledge Architecture ZK Revenue Ops |
