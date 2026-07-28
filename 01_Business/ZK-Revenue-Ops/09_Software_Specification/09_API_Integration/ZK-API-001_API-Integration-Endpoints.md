---
Title: API Integration Endpoints - ZK Revenue Ops
ID: ZK-API-001
Type: Software Specification System Document
Module: 09_Software_Specification / 09_API_Integration / ZK-API-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-API-001 — REST & Webhook Integration Endpoints

> **ZK-API-001 | Spesifikasi Endpoints API & Webhook (API Integration)**

---

## Master API Endpoints List

1. `POST /api/v1/leads/ingest`: Webhook Ingestion dari FB Ads / TikTok Ads.
2. `GET /api/v1/leads/queue`: Mengembalikan senarai queue task operator diisih mengikut SLA.
3. `POST /api/v1/whatsapp/send`: Menghantar mesej WhatsApp via Baileys WebSocket / Gateway.
4. `GET /api/v1/client/portal`: Mengembalikan data Notion Kanban Board Client Portal untuk REN.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi API Endpoints ZK Revenue Ops (ZK-API-001) |
