---
Title: Field Dictionary - ZK Revenue Ops
ID: ZK-IA-003
Type: Information Architecture Document
Module: 03_Information_Architecture / 003 Field Dictionary
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 003: Field Dictionary

> **ZK-IA-003 | Kamus Medan Data (Field Dictionary)**

---

## Purpose

Dokumen ini ialah **kamus lengkap medan data (*Field Dictionary*)** yang menyenaraikan setiap pembolehubah data, jenis jenis data (*Data Types*), syarat wajib, contoh nilai, dan peraturan pengesahan (*Validation Rules*).

---

## 1. Entity: Lead Fields

| Field Name | Data Type | Required? | Example Value | Validation Rule | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `lead_id` | String | **YES** | `LEAD-00102` | Format: `LEAD-NNNNN` | ID Unik Utama Lead. |
| `client_id` | String | **YES** | `SEAT-004` | Format: `SEAT-NNN` | ID REN pemilik lead. |
| `full_name` | String | **YES** | `Ahmad Razali` | Min 2 huruf, Proper Case | Nama Penuh Pembeli. |
| `phone_number` | String | **YES** | `+60123456789` | Regex: `^\+601\d{8,9}$` | No. WhatsApp Format MY. |
| `email` | String | NO | `ahmad@gmail.com` | Email Regex Valid | Alamat E-mel Pembeli. |
| `source` | Enum | **YES** | `Facebook Ads` | Must match Source Dictionary | Sumber asal iklan. |
| `status` | Enum | **YES** | `🔥 Tier 1 Hot` | Must match Status Dictionary | Status fasa pipeline. |
| `gross_salary` | Number | NO | `8500.00` | Min `0.00` | Pendapatan Kasar (RM). |
| `is_pre_approved`| Boolean | **YES** | `true` | `true` atau `false` | Status Pre-Approval Bank. |
| `buying_timeline`| Enum | NO | `<30 Days` | `<30 Days`, `1-3 Months`, `>6 Months` | Tempoh rancang beli. |
| `est_commission` | Number | NO | `12500.00` | Min `0.00` | Anggaran komisyen REN. |
| `created_at` | DateTime | **YES** | `2026-07-24T10:30:00Z` | ISO 8601 UTC Format | Tarikh lead masuk. |
| `updated_at` | DateTime | **YES** | `2026-07-24T14:15:00Z` | ISO 8601 UTC Format | Tarikh status dikemas kini.|

---

## 2. Entity: Appointment Fields

| Field Name | Data Type | Required? | Example Value | Validation Rule | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `appointment_id`| String | **YES** | `VIEW-0042` | Format: `VIEW-NNNN` | ID Unik Temujanji. |
| `lead_id` | String | **YES** | `LEAD-00102` | Valid Lead ID | ID Lead terlibat. |
| `client_id` | String | **YES** | `SEAT-004` | Valid Client Seat ID | ID REN pemilik. |
| `slot_datetime` | DateTime | **YES** | `2026-07-26T11:00:00Z` | Min 12j dari tarikh booking | Masa temujanji viewing. |
| `waze_link` | String | **YES** | `https://waze.com/...` | Valid URL Waze/Maps | Pautan lokasi hartanah. |
| `status` | Enum | **YES** | `📅 Viewing Booked` | Must match Status Dictionary | Status temujanji. |
| `is_t24h_sent` | Boolean | **YES** | `true` | `true` atau `false` | Peringatan T-24j dihantar. |
| `is_t2h_sent` | Boolean | **YES** | `true` | `true` atau `false` | Peringatan T-2j dihantar. |

---

## 3. Entity: Client (REN) Fields

| Field Name | Data Type | Required? | Example Value | Validation Rule | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `client_id` | String | **YES** | `SEAT-004` | Format: `SEAT-NNN` | ID Kuota Eksklusif. |
| `ren_name` | String | **YES** | `Zubair Ariff` | Min 2 huruf | Nama Penuh REN. |
| `ren_no` | String | **YES** | `REN 45892` | Format: `REN NNNNN` | Nombor Lesen LPPEH. |
| `agency_name` | String | **YES** | `IQI Realty` | Non-empty string | Nama Agensi Hartanah. |
| `exclusive_zone`| String | **YES** | `Savanna Bukit Jalil` | Non-empty string | Projek/Zon Eksklusif Lock.|
| `seat_status` | Enum | **YES** | `Seat Active 🟢` | `Vacant`, `Active`, `Revoked` | Status kuota kerusi. |

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Kamus Medan Data ZK Revenue Ops (ZK-IA-003) |
