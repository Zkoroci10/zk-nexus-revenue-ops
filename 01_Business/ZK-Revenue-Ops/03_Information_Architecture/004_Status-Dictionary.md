---
Title: Status Dictionary - ZK Revenue Ops
ID: ZK-IA-004
Type: Information Architecture Document
Module: 03_Information_Architecture / 004 Status Dictionary
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 004: Status Dictionary

> **ZK-IA-004 | Kamus Status Pipeline & Syarat Pergerakan**

---

## Purpose

Dokumen ini mentakrifkan **semua status rasmi (*Status Dictionary*)** dalam ekosistem ZK Revenue Ops, lengkap dengan syarat kemasukan (*entrance criteria*), syarat keluar (*exit criteria*), dan status seterusnya yang dibenarkan.

---

## Master Status Dictionary Matrix

### 1. `📥 NEW LEAD`
* **Definition**: Lead mentah baharu dimasukkan dari iklan digital / borang web (Belum disapa).
* **Entrance Criteria**: Data lead berjaya diimport dan lulus ujian deduplikasi.
* **Exit Criteria**: Mesej saringan WhatsApp pertama berjaya dihantar (< 5 minit).
* **Allowed Next Statuses**: `🔍 SCREENING`, `🗑️ TIER 3 DISQUALIFIED`.

### 2. `🔍 SCREENING`
* **Definition**: Mesej soalan saringan DSR & kelayakan kewangan telah dihantar (Menunggu balasan pembeli).
* **Entrance Criteria**: WhatsApp greeting & soalan saringan dihantar oleh bot/SDR.
* **Exit Criteria**: Prospek membalas soalan saringan pendapatan & loan bank.
* **Allowed Next Statuses**: `🔥 TIER 1 HOT`, `🌤️ TIER 2 WARM`, `🗑️ TIER 3 DISQUALIFIED`.

### 3. `🔥 TIER 1 HOT`
* **Definition**: Lead berkualiti tinggi yang mempunyai *Pre-Approved Loan* / Cash + timeline beli < 30 hari.
* **Entrance Criteria**: Pengesahan gaji/DSR mencukupi + sedia hadir viewing.
* **Exit Criteria**: Slot temujanji viewing dipilih dan dikunci dalam kalendar.
* **Allowed Next Statuses**: `📅 VIEWING BOOKED`, `🗑️ TIER 3 DISQUALIFIED`.

### 4. `🌤️ TIER 2 WARM`
* **Definition**: Lead berminat yang perlukan semakan loan bank atau timeline belian 1–3 bulan.
* **Entrance Criteria**: Bajet padan tetapi loan belum disemak / timeline sederhana.
* **Exit Criteria**: Prospek bersedia untuk temujanji viewing ATAU tiada respon selepas 14 hari.
* **Allowed Next Statuses**: `🔥 TIER 1 HOT`, `📅 VIEWING BOOKED`, `🗑️ TIER 3 DISQUALIFIED`.

### 5. `🗑️ TIER 3 DISQUALIFIED`
* **Definition**: Lead yang tiada bajet, loan rejected, nombor rosak, atau ejen pesaing.
* **Entrance Criteria**: Gagal ujian DSR / Nombor tidak aktif / Opt-out.
* **Exit Criteria**: Diletakkan dalam status kekal Archived (Tiada lagi susulan).
* **Allowed Next Statuses**: `ARCHIVED`.

### 6. `📅 VIEWING BOOKED`
* **Definition**: Slot masa temujanji viewing fizikal dikunci bersama Buyer Dossier.
* **Entrance Criteria**: Tarikh/masa dipilih oleh pembeli & REN + Buyer Dossier dilampirkan.
* **Exit Criteria**: Temujanji berlangsung di lokasi ATAU dibatalkan.
* **Allowed Next Statuses**: `🟢 VIEWING SHOW-UP`, `🔴 HIGH GHOST RISK`, `❌ DEAL LOST`.

### 7. `🔴 HIGH GHOST RISK`
* **Definition**: Pembeli senyap dan tidak membalas mesej pengesahan nod T-2 jam.
* **Entrance Criteria**: Mesej T-2j tidak dibalas & panggilan telefon tidak dijawab.
* **Exit Criteria**: Pembeli membalas mesej mengesahkan lokasi ATAU tidak hadir.
* **Allowed Next Statuses**: `🟢 VIEWING SHOW-UP`, `❌ DEAL LOST`, `🗑️ TIER 3 DISQUALIFIED`.

### 8. `🟢 VIEWING SHOW-UP`
* **Definition**: Pembeli hadir secara fizikal di lokasi viewing bersama REN.
* **Entrance Criteria**: REN mengesahkan kehadiran pembeli menerusi portal.
* **Exit Criteria**: Pembeli membayar booking fee ATAU menolak hartanah.
* **Allowed Next Statuses**: `💰 CLOSED WON`, `❌ DEAL LOST`.

### 9. `💰 CLOSED WON`
* **Definition**: Transaksi jualan berjaya! Booking fee dibayar & komisyen terkunci.
* **Entrance Criteria**: Salinan resit earnest deposit dimasukkan oleh REN.
* **Exit Criteria**: Fasa akhir kejayaan jualan.
* **Allowed Next Statuses**: `ARCHIVED (COMPLETED)`.

### 10. `❌ DEAL LOST`
* **Definition**: Pembeli menolak hartanah selepas hadir viewing.
* **Entrance Criteria**: Maklum balas penolakan unit dicatat dalam CRM.
* **Exit Criteria**: Lead diasingkan untuk kempen projek hartanah lain pada masa depan.
* **Allowed Next Statuses**: `🌤️ TIER 2 WARM`, `ARCHIVED`.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Kamus Status ZK Revenue Ops (ZK-IA-004) |
