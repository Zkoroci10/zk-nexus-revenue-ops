---
Title: Source Dictionary - ZK Revenue Ops
ID: ZK-IA-006
Type: Information Architecture Document
Module: 03_Information_Architecture / 006 Source Dictionary
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 006: Source Dictionary

> **ZK-IA-006 | Kamus Sumber Asal Lead (Lead Source Dictionary)**

---

## Purpose

Dokumen ini mentakrifkan **semua sumber asal lead (*Lead Source Dictionary*)** yang diiktiraf oleh sistem ZK Revenue Ops untuk tujuan penjejakan saluran jualan dan pengiraan ROI iklan.

---

## Master Source Dictionary Table

| Kod Source | Nama Sumber Visual | Saluran Terlibat | Keterangan & Kaedah Ingestion |
| :--- | :--- | :--- | :--- |
| `SRC-FB` | `Facebook Ads` | Meta Lead Forms / FB Messenger | Automatik via n8n Webhook / Zapier. |
| `SRC-TT` | `TikTok Ads` | TikTok Instant Lead Form | Automatik via n8n Webhook. |
| `SRC-PG` | `PropertyGuru` | Listing Enquiry PropertyGuru | Ingestion manual / WhatsApp parser. |
| `SRC-IP` | `iProperty` | Listing Enquiry iProperty | Ingestion manual / Email parser. |
| `SRC-WA` | `WhatsApp Direct` | Click-to-WhatsApp Ads | Direct chat greeting bot. |
| `SRC-REF` | `Referral` | Rujukan Kawan / Pelanggan Lama | Manual entry oleh Operator / REN. |
| `SRC-WALK`| `Walk In` | Booth Galeri Jualan Hartanah | Manual CSV import oleh REN. |
| `SRC-WEB` | `Website` | Landing Page REN | Webhook borang web. |
| `SRC-COLD`| `Existing Client` | Dormant Database Import | Bulk CSV import (Cold Reactivation). |

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Kamus Sumber Lead ZK Revenue Ops (ZK-IA-006) |
