---
Title: Validation Rules - ZK Revenue Ops
ID: ZK-IA-007
Type: Information Architecture Document
Module: 03_Information_Architecture / 007 Validation Rules
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 007: Validation Rules

> **ZK-IA-007 | Peraturan Pengesahan Data (Data Validation Rules)**

---

## Purpose

Dokumen ini menetapkan **peraturan pengesahan data (*Validation Rules*)** yang dikuatkuasakan di peringkat pangkalan data, borang input, API, dan automasi bot bagi menjamin kebersihan data (*data hygiene*).

---

## Master Data Validation Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MATRIKS PENGESAHAN DATA                         │
├──────────────┬───────────────────────────┬─────────────────────────────┤
│ KOD RULE     │ ASPEK DIVERIFIKASI        │ PERATURAN SYARAT SAH        │
├──────────────┼───────────────────────────┼─────────────────────────────┤
│ VR-001       │ No. Telefon WhatsApp      │ Format Malaysia `+601...`   │
│              │                           │ Regex: `^\+601\d{8,9}$`     │
├──────────────┼───────────────────────────┼─────────────────────────────┤
│ VR-002       │ Lead Ownership            │ `client_id` TIDAK BOLEH     │
│              │                           │ NULL atau Kosong.           │
├──────────────┼───────────────────────────┼─────────────────────────────┤
│ VR-003       │ Pipeline Status           │ `status` MESTI wujud dalam  │
│              │                           │ Status Dictionary.          │
├──────────────┼───────────────────────────┼─────────────────────────────┤
│ VR-004       │ Appointment Datetime      │ Slot masa MESTI ≥ 12 jam    │
│              │                           │ pada masa hadapan.          │
├──────────────┼───────────────────────────┼─────────────────────────────┤
│ VR-005       │ Salary / Budget Amount    │ Nilai angka MESTI ≥ 0.00    │
│              │                           │ (Dilarang nombor negatif).  │
└──────────────┴───────────────────────────┴─────────────────────────────┘
```

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Peraturan Pengesahan Data ZK Revenue Ops (ZK-IA-007) |
