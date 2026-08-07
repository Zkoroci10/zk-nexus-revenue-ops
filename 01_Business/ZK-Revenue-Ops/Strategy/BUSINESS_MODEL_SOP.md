---
Title: ZK Revenue Ops Core Business Model & Lead Triage SOP
ID: BUS-002
Type: Strategy / SOP
Module: 01_Business/ZK-Revenue-Ops/Strategy
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-08-08
Updated: 2026-08-08
Owner: Zubair (zubairisa10@gmail.com)
Related: BUS-001, STR-011, SOP-OPS-003
---

# 🏢 ZK Revenue Ops — Core Business Model & SDR Triage SOP

> **Core Philosophy:** Client runs marketing ads & provides raw lead database. ZK Revenue Ops extracts, triages DSR eligibility, executes WhatsApp outreach, and locks qualified buyers into confirmed sales gallery appointments for the Client.

---

## 🎯 1. Skop Kerja Utama ZK Revenue Ops (Service Level Agreement)

```
┌────────────────────────────────────────────────────────────────────────┐
│                     ZK REVENUE OPS END-TO-END WORKFLOW                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. 📥 DATA INGESTION (CLIENT HANDOFF)                                 │
│     • Client (REN / Agensi) jalankan iklan (FB/Tiktok/Google Ads).     │
│     • Client muat naik / serahkan pangkalan data lead mentah.          │
│                                                                        │
│  2. 🧮 TRIAGE & DSR PRE-APPROVAL (ZUBAIR ENGINE)                       │
│     • Ekstrak data lead mentah (Nama, Telefon, Gaji, Komitmen).        │
│     • Pengiraan Nisbah DSR (Gaji Bersih = 87% Gaji Kasar).            │
│     • Penarafan Kelayakan:                                             │
│       - Tier 1 Hot  : DSR ≤ 40% (LPPSA / Bank Pre-Approved)            │
│       - Tier 2 Warm : DSR 41-65% (Kumpul Dokumen Tambahan)             │
│       - Tier 3 Cold : DSR > 65% (Risiko Tinggi / Kena Revive)          │
│                                                                        │
│  3. 📱 OUTREACH & APPOINTMENT LOCKING                                  │
│     • Hantar mesej WhatsApp Malay ramah & berstruktur.                 │
│     • Tetapkan tarikh & masa viewing gallery.                          │
│     • Penguncian Janji Temu (Appointment Lock) ke dalam pangkalan      │
│       data khusus Client.                                              │
│                                                                        │
│  4. 📊 CLIENT REPORTING & DATA SAFETY                                  │
│     • Client menerima pembeli yang 100% layak sahaja.                  │
│     • Pangkalan data Client dilindungi & tidak bercampur.              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 2. Data Safety & Client Separation Rules

1. **Strict Client Database Isolation:** Data setiap Client (cth: REN-001 Ahmad Razif) adalah hak milik Client tersebut dan **TIDAK BUKAN** bercampur dengan Client lain.
2. **Dedicated Workspace Partition:** Setiap Client mempunyai paparan pangkalan data, statistik kelayakan DSR, dan senarai appointment tersendiri.
3. **Backup Berkembar (Local + Cloud):** Data tersimpan dalam LocalStorage/IndexedDB untuk kepantasan tempatan dan disinkronkan ke Notion CRM / Google Sheets untuk simpanan selamat.
