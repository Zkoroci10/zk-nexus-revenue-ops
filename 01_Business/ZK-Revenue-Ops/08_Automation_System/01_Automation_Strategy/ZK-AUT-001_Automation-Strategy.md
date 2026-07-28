---
Title: Automation Strategy - ZK Revenue Ops
ID: ZK-AUT-001
Type: Automation System Document
Module: 08_Automation_System / 01_Automation_Strategy / ZK-AUT-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK-AUT-001 — Automation Strategy

> **ZK-AUT-001 | Strategi Automasi Operasi & Prinsip Penguatkuasaan (Automation Strategy)**

---

## Purpose

Dokumen ini mendefinisikan **Strategi & Prinsip Automasi (*Automation Strategy*)** ZK Revenue Ops. Dokumen ini memastikan automasi dibina sebagai alat memperkuat sistem operasi yang stabil, bukannya punca kekeliruan data (*Automation Blueprint First*).

---

## Core Automation Rule Formula

```text
High Frequency  +  Low Complexity  +  High Repetition  =  GOOD AUTOMATION CANDIDATE
```

---

## Strategic Automation Scope

### 1. What We Automate (Proses Automasi Lulus ✅)
* **Lead Ingestion & Deduplication**: Tangkap webhook iklan FB/TikTok & semak duplikasi nombor 30 hari.
* **Phone Number Normalization**: Menukar format `01...` ke `+601...` secara automatik.
* **Territory Lock Assignment**: Mengumpukkan lead ke `SEAT-NNN` REN berasaskan zon/projek dimohon.
* **Follow-up Task Generator**: Penjanaan tugasan susulan berjadual untuk operator harian.
* **Weekly Audit Report PDF**: Penjanaan & hantaran laporan mingguan pada Isnin jam 9:00 AM (`RR-001`).

### 2. What We Don't Automate (Proses Manusia Sahaja ❌)
* **Closing Deal & Earnest Deposit Receipt**: Keputusan pengesahan jualan ditutup wajib diisi oleh pelanggan REN.
* **High-Conflict Lead Complaints**: Aduan prospek marah/emosi wajib dipengendalikan oleh operator manusia.
* **Retainer Contract Signing**: Penandatanganan dokumen MSA/NDA 30-Cap wajib dikendalikan oleh Founder.

### 3. Human Approval Points (Nod Pengesahan Manusia)
* **Assistive Communication Rule**: Bot automasi menyediakan draf mesej WhatsApp ➔ Operator menyemak & menekan butang `Approve & Send`. Dilarang *Robot Auto-Spamming* tanpa seliaan operator pada fasa awal.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Automation Strategy ZK Revenue Ops |
