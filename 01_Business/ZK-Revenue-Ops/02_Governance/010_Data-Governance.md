---
Title: Data Governance Constitution - ZK Revenue Ops
ID: ZK-GOV-010
Type: Governance Constitution Document
Module: 02_Governance / 010 Data Governance
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 010: Data Governance Constitution

> **ZK-GOV-010 | Perlembagaan Pengurusan & Tadbir Urus Data**

---

## Purpose

Dokumen ini ialah **Perlembagaan Pengurusan Data (*Data Governance Constitution*)** yang mengawal tadbir urus pangkalan data, keselamatan maklumat peribadi pembeli (PDPA Malaysia), dan integriti aliran data ZK Revenue Ops.

---

## 1. Data Ownership Principle (Prinsip Hak Milik Data)

* **DG-001.1**: Semua data lead, nombor telefon WhatsApp, dan rekod perbualan adalah **HAK MILIK MUTLAK PELANGGAN REN**.
* **DG-001.2**: ZK Revenue Ops bertindak HANYA sebagai *Data Processor* (Pengendali Data) yang menguruskan data bagi pihak REN mengikut perjanjian *Data Confidentiality Agreement* (NDA).

---

## 2. PDPA 2010 Compliance Rule (Pematuhan Akta Data Peribadi Malaysia)

* **DG-002.1**: Semua borang intake iklan dan mesej saringan WhatsApp WAJIB menyertakan notis kebenaran pemprosesan data ringkas mengikut Akta Perlindungan Data Peribadi 2010 (PDPA) Malaysia.
* **DG-002.2**: Sekiranya prospek memohon untuk menghentikan mesej (*Opt-out / Stop Messaging*), sistem WAJIB menukar status lead kepada **Archived (Opt-Out)** dan menghentikan semua siri mesej susulan secara automatik.

---

## 3. Zero Selling / Sharing Rule (Larangan Mutlak Jual Data)

```text
  [❌ HARAM & DILARANG] ──> Menjual, menyewa, atau berkongsi data pembeli REN kepada agensi lain / pihak ketiga.
```

* **DG-003.1**: Data pembeli pelanggan REN A TIDAK BOLEH sekali-kali dijual, disewa, atau dikongsi kepada pelanggan REN B atau pihak ketiga bawah sebarang keadaan.

---

## 4. No Hard Delete Rule (Undang-Undang Dilarang Padam Data)

* **DG-004.1**: **TIADA PEMADAMAN DENGAN KERAS (*NO HARD DELETE*)** dibenarkan dalam pangkalan data aktif ZK.
* **DG-004.2**: Lead yang tidak berminat HANYA dibenarkan ditukar status kepada **Archived** atau **Disqualified** bagi mengekalkan ketepatan laporan audit mingguan.

---

## 5. Offboarding Data Wipe Protocol (Protokol Pembersihan Data Client Offboarding)

* **SR-005.1**: Apabila pelanggan REN menamatkan langganan, ZK Revenue Ops akan menyerahkan fail eksport data penuh (CSV/vCard) kepada REN dalam tempoh 7 hari.
* **SR-005.2**: Selepas serahan data disahkan, sistem ZK WAJIB melaksanakan **Data Wipe Protocol** — memadamkan semua rekod lead REN tersebut secara kekal daripada server aktif ZK dalam tempoh 14 hari.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Perlembagaan Tadbir Urus Data ZK Revenue Ops (ZK-GOV-010) |
