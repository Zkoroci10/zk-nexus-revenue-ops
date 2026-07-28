---
Title: User Roles & Permissions Matrix - ZK Revenue Ops
ID: ZK-USER-002
Type: Software Specification System Document
Module: 09_Software_Specification / 04_User_Roles_Permissions / ZK-USER-002
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-USER-002 — User Roles & Permissions Matrix

> **ZK-USER-002 | Matriks Peranan & Kebenaran Pengguna (Role & Permission Matrix)**

---

## Purpose

Dokumen ini mendefinisikan **Matriks Peranan & Kebenaran Pengguna (*Role & Permission Matrix*)** bagi menjamin perlindungan privasi data dan menguatkuasakan aturan `LR-002` (No Hard Delete).

---

## Master Role Permission Matrix Table

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MATRIKS PERANAN & KEBENARAN PENGGUNA                 │
├─────────────────┬───────────────────┬───────────────────┬──────────────┤
│ PERANAN (ROLE)  │ PAPARAN (VIEW)    │ SUNting (EDIT)    │ PADAM (DELETE│
├─────────────────┼───────────────────┼───────────────────┼──────────────┤
│ Solo REN Client │ Own Leads Only    │ Status & Notes    │ ❌ HARAM     │
│ SDR Operator    │ Assigned Queue    │ Activity Logs     │ ❌ HARAM     │
│ Ops Admin       │ All Client Queues │ Assign & Triage   │ ❌ HARAM     │
│ Super Admin     │ 100% Full Access  │ All Settings      │ Audit Only ⚠️│
└─────────────────┴───────────────────┴───────────────────┴──────────────┘
```

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi User Roles Matrix ZK Revenue Ops (ZK-USER-002) |
