---
Title: Object ID Standard - ZK Revenue Ops
ID: ZK-GOV-003
Type: Governance Constitution Document
Module: 02_Governance / 003 Object ID Standard
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.1 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-28
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 003: Object ID Standard

> **ZK-GOV-003 | Perlembagaan Piawaian Penjadualan Object ID**

---

## Purpose

Dokumen ini menetapkan **piawaian format ID unik (*Object ID Standard*)** untuk mengidentifikasi setiap dokumen, entiti pelanggan, rekod lead, temujanji, dan skrip dalam ZK Revenue Ops.

---

## 1. Universal Object ID Format (Format ID Sejagat)

* **ID-001.1**: Semua Object ID WAJIB mematuhi format berstruktur: **`{PREFIX}-{NNN}`** (Di mana NNN ialah nombor berurutan zero-padded 3 atau 5 digit).
* **ID-001.2**: Object ID tidak boleh dikitar semula (*non-reusable*) dan bersifat unik sepanjang hayat sistem.

---

## 2. Master Prefix Taxonomy (Taksonomi Awalan ID)

| Prefix Prefix | Kategori Entiti / Dokumen | Format Contoh | Penerangan |
| :--- | :--- | :--- | :--- |
| **ZK-FND-** | Foundation Documents | `ZK-FND-001` | Dokumen DNA & Asas Konseptual (001–010). |
| **ZK-GOV-** | Governance Constitution | `ZK-GOV-001` | Dokumen Perlembagaan Governance (001–010). |
| **ZK-OPS-** | ZK Revenue Ops Operational Deliverables | `ZK-OPS-001` | Katalog perkhidmatan, cetak biru kempen SDR, skrip outreach, SOP saringan lead, cetak biru CRM (001–099). |
| **SEAT-** | Client Seat Exclusivity | `SEAT-001` hingga `SEAT-030` | ID Kuota Eksklusif pelanggan REN (Max 30). |
| **LEAD-** | Unique Lead Record | `LEAD-00001` | ID Unik bagi setiap prospek pembeli. |
| **VIEW-** | Viewing Appointment | `VIEW-0001` | ID Unik bagi slot temujanji viewing. |
| **AUDIT-** | Weekly Performance Audit | `AUDIT-001` | ID Log Laporan Audit Mingguan Isnin. |
| **OBJ-** | Objection Handling Script | `OBJ-001` | ID Skrip Penanganan Bantahan Hartanah. |

---

## 3. ID Assignment & Registry Rule (Undang-Undang Pendaftaran ID)

* **ID-003.1**: Setiap Object ID baharu WAJIB didaftarkan dalam [ID-Registry.md](file:///c:/Users/Dell/Documents/Projects%20ZK%20Nexus/00_Command%20Center/ID-Registry.md) sebaik sahaja dicipta.
* **ID-003.2**: Permohonan ID baharu dikendalikan secara automatik oleh sistem atau AI Agent bagi mengelakkan pertindihan nombor siri.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Piawaian Object ID ZK Revenue Ops (ZK-GOV-003) |
| **v1.1** | 2026-07-28 | Human Founder & AI AGY | Added ZK-OPS- to Master Prefix Taxonomy for M3 operational deliverables |
