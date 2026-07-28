---
Title: Agent Permissions Matrix - ZK Revenue Ops
ID: ZK-AI-008
Type: Digital Workforce System Document
Module: 10_Digital_Workforce / 08_Agent_Permissions / ZK-AI-008
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-25
Updated: 2026-07-25
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-AI-008 — Agent Permissions Matrix

> **ZK-AI-008 | Matriks Hak Akses & Kebenaran Ejen AI (Agent Permission Matrix)**

---

## Purpose

Dokumen ini mendefinisikan **Matriks Hak Akses Ejen AI (*Agent Permission Matrix*)** bagi menyekat tindakan berbahaya oleh AI (cth: memadam data atau menghantar mesej automatik tanpa seliaan).

---

## Master AI Permission Matrix Table

```
┌────────────────────────────────────────────────────────────────────────┐
│                      MATRIKS HAK AKSES EJEN AI                         │
├───────────────┬──────────────┬──────────────┬──────────────┬───────────┤
│ KOD EJEN AI   │ BACA (READ)  │ TULIS (WRITE)│ PADAM(DELETE)│ HANTAR    │
├───────────────┼──────────────┼──────────────┼──────────────┼───────────┤
│ Lead AI       │ ✅ SAH       │ ✅ SAH       │ ❌ HARAM     │ ❌ HARAM  │
│ Reporting AI  │ ✅ SAH       │ ✅ SAH (PDF) │ ❌ HARAM     │ ❌ HARAM  │
│ Follow-up AI  │ ✅ SAH       │ ✅ Draf Sah  │ ❌ HARAM     │ Human Appr│
│ Executive AI  │ ✅ SAH       │ ❌ HARAM     │ ❌ HARAM     │ ❌ HARAM  │
└───────────────┴──────────────┴──────────────┴──────────────┴───────────┘
```

---

## Revision History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-25 | Human Founder & AI AGY | Penulisan rasmi Agent Permissions Matrix ZK Revenue Ops |
