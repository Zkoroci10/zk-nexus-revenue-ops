---
Title: Ownership Matrix - ZK Revenue Ops
ID: ZK-IA-010
Type: Information Architecture Document
Module: 03_Information_Architecture / 010 Ownership Matrix
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 010: Ownership Matrix

> **ZK-IA-010 | Matriks Hak Milik Data & Kebenaran Transaksi**

---

## Purpose

Dokumen ini menetapkan **matriks hak milik data (*Ownership Matrix*)** yang menentukan siapa yang berhak mencipta (*Create*), mengemas kini (*Edit*), memadam (*Delete*), dan melihat (*View*) setiap entiti data.

---

## Master Ownership Matrix Table

| Entiti Objek | Create (C) | Edit (E) | Delete (D) | View (V) |
| :--- | :--- | :--- | :---: | :--- |
| **Lead** | System / Operator / AI | SDR Operator / Client REN | **NO (Haram)** | Client REN / Operator / Founder |
| **Appointment** | SDR Operator / System Bot | SDR Operator / Client REN | **NO (Haram)** | Client REN / Operator / Founder |
| **Report** | System Reporting Engine | **NO (System Generated)** | **NO (Haram)** | Client REN / Founder |
| **Client Seat** | Human Founder | Human Founder | Founder Only | All Roles |
| **Activity Log**| System Audit Engine | **NO (Immutable)** | **NO (Haram)** | All Internal Roles |
| **Message Chat**| System WhatsApp Gateway | **NO (Read-Only)** | **NO (Haram)** | SDR Operator / Founder |

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Matriks Hak Milik Data ZK Revenue Ops (ZK-IA-010) |
