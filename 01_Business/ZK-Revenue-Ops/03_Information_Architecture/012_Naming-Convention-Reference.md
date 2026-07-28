---
Title: Naming Convention Reference - ZK Revenue Ops
ID: ZK-IA-012
Type: Information Architecture Document
Module: 03_Information_Architecture / 012 Naming Convention Reference
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 012: Naming Convention Reference

> **ZK-IA-012 | Pemetaan Silang Rujukan Penamaan Data**

---

## Purpose

Dokumen ini menyediakan **jadual pemetaan silang (*Cross-Reference Mapping*)** antara nama medan pangkalan data (DB), JSON API Key, Notion Column Label, dan Paparan UI supaya pembina perisian tidak keliru.

---

## Master Naming Cross-Reference Table

| Domain Data | DB Column (`snake_case`) | API JSON Key (`camelCase`) | Notion Column Label | UI Display Label (Malay/English) |
| :--- | :--- | :--- | :--- | :--- |
| **Lead ID** | `lead_id` | `leadId` | `Lead ID` | ID Lead |
| **Full Name** | `full_name` | `fullName` | `Nama Pembeli` | Nama Penuh |
| **Phone Number**| `phone_number` | `phoneNumber` | `No. WhatsApp` | Nombor WhatsApp |
| **Loan Status** | `is_pre_approved`| `isPreApproved` | `Status Loan Bank` | Loan Bank Pre-Approved? |
| **Pipeline Status**|`status` | `status` | `Status Pipeline` | Status Terkini |
| **Appointment Time**|`slot_datetime` | `slotDatetime` | `Masa Viewing` | Tarikh & Masa Viewing |
| **Commission** | `est_commission` | `estCommission` | `Anggaran Komisyen` | Anggaran Nilai Komisyen |

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Rujukan Penamaan Data ZK Revenue Ops (ZK-IA-012) |
