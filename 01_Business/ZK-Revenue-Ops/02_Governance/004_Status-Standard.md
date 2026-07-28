---
Title: Status Standard - ZK Revenue Ops
ID: ZK-GOV-004
Type: Governance Constitution Document
Module: 02_Governance / 004 Status Standard
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 004: Status Standard

> **ZK-GOV-004 | Perlembagaan Piawaian Status Pipeline & Entiti**

---

## Purpose

Dokumen ini menetapkan **piawaian status rasmi (*Status Standard*)** yang mentakrifkan kitaran hayat lead, status kerusi pelanggan, dan status temujanji viewing secara konsisten di seluruh aplikasi web, Notion Portal, dan automasi AI.

---

## 1. Master Lead Pipeline Status Lifecycle

Setiap lead WAJIB berada dalam salah satu status rasmi berikut mengikut fasa kitaran hayat:

```
[1. 📥 New Lead] ──> [2. 🔍 Screening] ──> [3. 🔥 Tier 1 Hot / 🌤️ Tier 2 Warm] ──> [4. 📅 Viewing Booked]
                                                            │                                    │
                                                            ▼                                    ▼
                                                 [🗑️ Tier 3 Disqualified]           [💰 Closed Won / ❌ Lost]
```

| Kode Status | Nama Status Visual | Definisi & Maksud Operasi |
| :--- | :--- | :--- |
| `ST-01` | `📥 New Lead` | Lead mentah baru masuk dari borang iklan (Belum disapa). |
| `ST-02` | `🔍 Screening` | Mesej saringan DSR awal telah dihantar (Menunggu jawapan). |
| `ST-03` | `🔥 Tier 1 Hot` | Pre-Approved Loan / Cash + Sedia beli < 30 hari. |
| `ST-04` | `🌤️ Tier 2 Warm` | Perlu semakan loan / Timeline belian 1–3 bulan. |
| `ST-05` | `🗑️ Tier 3 Disqualified` | No bajet / Loan rejected / Spammer (Diarkibkan). |
| `ST-06` | `📅 Viewing Booked` | Slot masa temujanji viewing dikunci dalam kalendar. |
| `ST-07` | `🔴 High Ghost Risk` | Unconfirmed pada nod T-2 jam (Pembeli senyap). |
| `ST-08` | `🟢 Viewing Show-Up` | Pembeli hadir secara fizikal di lokasi hartanah. |
| `ST-09` | `💰 Deal Closed Won` | Booking fee dibayar & komisyen terkunci. |
| `ST-10` | `❌ Deal Lost` | Pembeli menolak unit selepas viewing. |

---

## 2. Client Seat Status Standard (Status Kerusi REN)

| Nama Status Seat | Definisi & Maksud Operasi |
| :--- | :--- |
| `Seat Vacant` | Kerusi kekal lapang daripada kuota 30 seat. |
| `Seat Onboarding` | Permohonan diluluskan, menunggu bayaran & dokumen MSA. |
| `Seat Active 🟢` | REN aktif melanggan dan memegang hak *Territory Lock*. |
| `Seat Revoked 🔴` | Kerusi dibatalkan kerana tidak aktif / gagal bayar yuran >7 hari. |

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Piawaian Status ZK Revenue Ops (ZK-GOV-004) |
