---
Title: Permission Matrix Standard - ZK Revenue Ops
ID: ZK-GOV-007
Type: Governance Constitution Document
Module: 02_Governance / 007 Permission Matrix
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 007: Permission Matrix Standard

> **ZK-GOV-007 | Perlembagaan Matriks Kebenaran Akses (RBAC)**

---

## Purpose

Dokumen ini menetapkan **matriks kawalan kebenaran akses (*Permission Matrix Standard*)** untuk mengawal peranan Founder, Client REN, Virtual SDR Operator, dan AI Agent.

---

## Master RBAC Permission Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MATRIKS KAWALAN AKSES (RBAC)                    │
├───────────────────────┬───────────┬────────────┬─────────────┬─────────┤
│ PERANAN PENGGUNA      │ VIEW DATA │ EDIT DATA  │ EXPORT DATA │ DELETE  │
├───────────────────────┼───────────┼────────────┼─────────────┼─────────┤
│ 👑 Founder            │ ALL       │ ALL        │ ALL         │ ADMIN   │
│ 👤 Client REN         │ OWN ONLY  │ STATUS ONLY│ OWN ONLY    │ HARAM ❌│
│ 🎧 Virtual SDR        │ ASSIGNED  │ CHAT/TAGS  │ HARAM ❌    │ HARAM ❌│
│ 🤖 AI Agent Bot       │ WEBHOOK   │ AUTO-TAG   │ HARAM ❌    │ HARAM ❌│
└───────────────────────┴───────────┴────────────┴─────────────┴─────────┘
```

---

## 1. Access Enforcement Rules (Undang-Undang Penguatkuasaan Akses)

* **PM-001.1**: Sebarang modul web app, portal klien, atau pangkalan data Notion WAJIB menyemak `role_id` sebelum membenarkan sebarang transaksi pembacaan atau pengemaskinian data.
* **PM-001.2**: Pelanggan REN DILARANG SAMA SEKALI melihat data pelanggan REN lain.
* **PM-001.3**: Operator & AI Agent DILARANG memadam sebarang rekod pangkalan data secara pukal.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Matriks Kebenaran Akses ZK Revenue Ops (ZK-GOV-007) |
