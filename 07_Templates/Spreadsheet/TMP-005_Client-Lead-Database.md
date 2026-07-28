---
Title: Client Lead Database Template (CSV / Sheet Format)
ID: TMP-005
Type: Template
Module: 07_Templates / Spreadsheet
BU: ZK Revenue Ops
Status: Active
Version: 1
Created: 2026-07-28
Updated: 2026-07-28
Owner: Human Founder
Related: CAT-001, SOP-001
---

# TMP-005: Templat Pangkalan Data Lead Klien (Google Sheets / CSV)

**Kegunaan:** Digunakan oleh VA SDR untuk merekod dan mengemaskini maklumat lead prospek bagi pihak perunding hartanah (REN) secara harian tanpa kos perisian berbayar.

---

## 📊 Struktur Lajur Pangkalan Data (Google Sheet Columns)

```csv
Lead_ID,Tarikh_Masuk,Nama_Prospek,No_WhatsApp,Sumber_Lead,Projek_Pilihan,Tujuan_Beli,Kelayakan_Gaji,Status_Lead,Tarikh_Viewing,Nota_SDR
LD-001,2026-07-28,Ahmad Zaki,0123456789,FB Ads,Residensi Skyline,Own Stay,RM 4500 (Lulus),Qualified,2026-07-30 14:00,Berminat bilik 3. Loan dah pre-check.
LD-002,2026-07-28,Siti Sarah,0198765432,Mudah.my,Villa Mutiara,Investment,RM 2800 (Low),Unqualified,-,Komitmen tinggi. Simpan dalam cold database.
```

---

## 🏷️ Definisi Tag Status Lead

| Tag Status | Maksud | Tindakan SDR |
|---|---|---|
| 🟢 **Qualified** | Lulus saringan & berminat | Tetapkan temujanji viewing & hantar nota ke REN |
| 🟡 **Pending Check** | Belum jawab mesej / perlukan maklumat lanjut | Hantar mesej susulan 2 (Follow-up) |
| 🔴 **Unqualified** | Gaji/komitmen tidak lepas atau tak berminat | Pindahkan ke senarai *Cold Re-engagement* |
| ⭐ **Viewing Scheduled** | Temujanji viewing disahkan | Masukkan ke Google Calendar REN |

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2026-07-28 | Human Founder | Created Client Lead Database Template (TMP-005) |
