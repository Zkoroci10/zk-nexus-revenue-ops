---
Title: Priority Standard - ZK Revenue Ops
ID: ZK-GOV-005
Type: Governance Constitution Document
Module: 02_Governance / 005 Priority Standard
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 005: Priority Standard

> **ZK-GOV-005 | Perlembagaan Piawaian Keutamaan Tugas & Lead (Priority Matrix)**

---

## Purpose

Dokumen ini menetapkan **piawaian keutamaan (*Priority Standard*)** yang menentukan keutamaan pemprosesan tugas oleh Operator Manusia, Automasi Bot, dan Ejen AI.

---

## Priority Matrix Table (Matriks Keutamaan Task & Lead)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MATRIKS KEUTAMAAN (P1 - P4)                     │
├───────────┬──────────────┬───────────────────────────────┬─────────────┤
│ LEVEL     │ NAMA LEVEL   │ CONTOH TASK / EVENT           │ SLA TARGET  │
├───────────┼──────────────┼───────────────────────────────┼─────────────┤
│ P1 🔴     │ Critical     │ New Lead Ingestion (<5m),     │ < 5 Minit   │
│           │              │ Booking Fee Escalation,       │             │
│           │              │ Collision Alert.              │             │
├───────────┼──────────────┼───────────────────────────────┼─────────────┤
│ P2 🟠     │ High         │ Anti-Ghosting T-2j Alert,     │ < 15 Minit  │
│           │              │ Tier 1 Viewing Booking,       │             │
│           │              │ High Ghost Risk Notification. │             │
├───────────┼──────────────┼───────────────────────────────┼─────────────┤
│ P3 🟡     │ Medium       │ Touchpoint Cadence Hari 3 & 7,│ < 2 Jam     │
│           │              │ Daily Notion Sync,            │             │
│           │              │ General REN Query.            │             │
├───────────┼──────────────┼───────────────────────────────┼─────────────┤
│ P4 🟢     │ Low          │ Dormant Reactivation Blast,   │ < 24 Jam    │
│           │              │ Weekly Audit Report Generation│             │
└───────────┴──────────────┴───────────────────────────────┴─────────────┘
```

---

## 1. Rules Pengutamaan Queue (Queue Queue Rules)

* **PS-001.1**: Task berstatus **P1 Critical** WAJIB memotong giliran (*queue jump*) di hadapan P2, P3, dan P4 secara automatik.
* **PS-001.2**: Bot automasi & Operator Manusia DILARANG memproses task P3/P4 sekiranya terdapat task P1/P2 yang masih belum diselesaikan.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Piawaian Keutamaan ZK Revenue Ops (ZK-GOV-005) |
