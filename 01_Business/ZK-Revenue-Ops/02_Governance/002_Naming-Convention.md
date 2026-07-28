---
Title: Naming Convention Standard - ZK Revenue Ops
ID: ZK-GOV-002
Type: Governance Constitution Document
Module: 02_Governance / 002 Naming Convention
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 002: Naming Convention Standard

> **ZK-GOV-002 | Perlembagaan Piawaian Penamaan (Naming Convention)**

---

## Purpose

Dokumen ini menetapkan **piawaian penamaan rasmi (*Naming Conventions*)** untuk semua fail, folder, pembolehubah kod, medan database, tag status, dan webhook automasi dalam ZK Revenue Ops.

---

## 1. File & Directory Naming Rules (Penamaan Fail & Folder)

* **NC-001.1**: Fail Dokumen Foundation / Governance / SOP WAJIB menggunakan format nombor 3-digit berurutan: `00N_Title-In-Kebab-Case.md` (cth: `001_Vision.md`, `002_Naming-Convention.md`).
* **NC-001.2**: Folder modul utama WAJIB menggunakan format nombor 2-digit berurutan: `0N_ModuleName/` (cth: `00_Foundation/`, `02_Governance/`).
* **NC-001.3**: Fail kod JavaScript/PowerShell WAJIB menggunakan format `kebab-case` bermakna (cth: `full-system-audit.ps1`, `gas-code-optimized.js`).

---

## 2. Database Column & Code Variable Rules (Penamaan Medan Database & Kod)

* **NC-002.1**: Medan pangkalan data Notion / SQL / JSON WAJIB menggunakan format **`snake_case`** (cth: `lead_phone_number`, `client_seat_id`, `is_loan_approved`, `dsr_percentage`).
* **NC-002.2**: Pembolehubah kod JavaScript / API Payload WAJIB menggunakan format **`camelCase`** (cth: `leadDossier`, `speedToLeadMinutes`, `viewingSlotTime`).

---

## 3. Tag & Status Naming Rules (Penamaan Tag & Status Visual)

* **NC-003.1**: Tag status visual untuk pergerakan CRM & Notion Portal WAJIB mengandungi Emoji Standard di hadapan:
  * `🔥 Tier 1 Hot` (Pre-Approved / Cash)
  * `🌤️ Tier 2 Warm` (Nurture 1-3 Bulan)
  * `🗑️ Tier 3 Disqualified` (Archive / No Budget)
  * `📅 Viewing Booked` (Temujanji Disahkan)
  * `🟢 Viewing Show-Up` (Hadir Viewing)
  * `🔴 High Ghost Risk` (Unconfirmed T-2h)
  * `💰 Deal Closed Won` (Jualan Berjaya)

---

## 4. Automation Webhook & Workflow Rules (Penamaan Automasi)

* **NC-004.1**: Alur kerja n8n & API Webhook WAJIB menggunakan format `module_action_version` (cth: `ingestion_fb_lead_v1`, `triage_dsr_calculator_v2`, `reminder_antighosting_t24h`).

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Piawaian Penamaan ZK Revenue Ops (ZK-GOV-002) |
