---
Title: Master Product Requirement Document (PRD) - ZK Revenue Ops
ID: ZK-PRD-001
Type: Software Specification System Document
Module: 09_Software_Specification / 01_Product_Requirements / ZK-PRD-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-PRD-001 — Master Product Requirement Document (PRD)

> **ZK-PRD-001 | Dokumen Keperluan Produk Platform ZK Revenue Ops (Cardless Stage 1 MVP)**

---

## Product Vision
Menukar operasi perkhidmatan ZK Revenue Ops daripada *service operations* menjadi **Platform Operasi Hasil (Revenue Operations Platform)** berskala tinggi yang direka khas untuk menyokong **Maksimum 30 Solo REN Eksklusif di Malaysia (`SEAT-001` hingga `SEAT-030`)** dengan jaminan *Zero Database Collision*.

---

## Core Problem Statement
1. Solo REN di Malaysia kehilangan 40%–60% jualan akibat respon lambat (*Speed-to-lead > 2 jam*), tiada saringan DSR bank awal, dan kadar pembatalan temujanji (*Ghosting*) yang tinggi.
2. REN tidak mempunyai sistem automasi real-time yang membolehkan mereka menyemak status perbualan pembeli dan ROI komisyen secara telus.

---

## Target User Personas
1. **Solo Real Estate Negotiator (REN Client)**: Pemegang kerusi eksklusif (`SEAT-01`–`30`) yang perlukan paparan *Client Portal* mudah alih.
2. **Virtual SDR Operator**: Operator yang mengendalikan queue perbualan, saringan DSR gaji, dan peringatan viewing.
3. **Founder / System Admin (Zubair Ariff)**: Pemilik platform yang memantau 30 seat, ROI komisyen, dan kesihatan perisian.

---

## Core Software Solution (Cardless Stage 1 MVP)
Perisian berseni bina **100% Cardless & Zero-Billing Stack** (Electron Desktop / Localhost + PocketBase/SQLite + Baileys WhatsApp WebSocket + Cloudflare Tunnel + Notion API) yang merangkumi:
* **Konsol Task Operator**: Kecepatan respon < 5 minit dengan pengisyoran mesej automatik.
* **Client Growth Portal**: Papan Kanban Notion / Mobile Web View untuk REN semak pembeli Hot & Viewing.
* **Viewing & Waze Dispatch Engine**: Peringatan T-24j & T-2j beserta kad Dossier dan pautan Waze terus ke telefon REN & pembeli.
* **Monday Audit PDF Engine**: Penjanaan laporan mingguan automatik pada Isnin jam 9:00 AM (`RR-001`).

---

## Core User Stories

### User Story 1: Solo REN Client View
* **Sebagai seorang**: Solo REN Malaysia (`SEAT-004`).
* **Saya mahu**: Melihat semua lead Hot dan temujanji viewing minggu ini dalam satu Client Portal ringkas.
* **Supaya**: Saya tahu pembeli mana yang sedia buat viewing fizikal tanpa perlu pening kepala urus mesej WhatsApp awal.

### User Story 2: Virtual SDR Operator Processing
* **Sebagai seorang**: Virtual SDR Operator.
* **Saya mahu**: Menerima amaran task lead baharu serta-merta dengan draf templat mesej saringan DSR.
* **Supaya**: Saya boleh menghantar mesej aluan dalam tempoh < 5 minit SLA.

---

## Success Metrics (KPIs)
* **Speed-to-lead SLA**: > 95% mesej aluan dihantar < 5 minit.
* **Viewing Show-Up Rate**: > 85% pembeli hadir temujanji.
* **Client Retention Rate**: > 90% REN memperbaharui langganan retainer bulanan.

---

## Constraints & Bootstrapping Rules
* **Zero Credit/Debit Card Billing**: Sistem WAJIB beroperasi 100% atas Free Usage Tier / Cardless Infrastructure (No Credit Card Required).

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Master PRD ZK Revenue Ops (ZK-PRD-001) |
