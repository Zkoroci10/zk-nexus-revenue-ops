---
Title: System Architecture Specification - ZK Revenue Ops
ID: ZK-ARCH-001
Type: Software Specification System Document
Module: 09_Software_Specification / 02_System_Architecture / ZK-ARCH-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-ARCH-001 — Full-Stack Cardless System Architecture

> **ZK-ARCH-001 | Cetak Biru Seni Bina Perisian 100% Cardless (System Architecture)**

---

## Purpose

Dokumen ini mendefinisikan **Seni Bina Perisian (*System Architecture*)** ZK Revenue Ops Platform berasaskan teknologi *100% Cardless & Zero-Billing Stack* yang beroperasi tanpa pergantungan pada kad debit/kredit.

---

## 5-Layer Cardless Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION LAYER                     │
│   • Client REN Portal (Cloudflare Pages Mobile Web View)               │
│   • Operator Task Console (Electron / React Local Desktop App)         │
├────────────────────────────────────────────────────────────────────────┤
│                        BACKEND API & SECURITY LAYER                    │
│   • Local Node.js REST API Server                                      │
│   • Row-Level Security (RLS) Filter per `SEAT-NNN`                     │
├────────────────────────────────────────────────────────────────────────┤
│                        DATABASE & STORAGE LAYER                        │
│   • PocketBase / SQLite Local Database Engine                          │
│   • Notion Master Database API Sync                                    │
├────────────────────────────────────────────────────────────────────────┤
│                        AUTOMATION ORCHESTRATION LAYER                  │
│   • Local n8n Desktop Engine (Cron & Trigger Workflows)                │
├────────────────────────────────────────────────────────────────────────┤
│                        EXTERNAL COMMUNICATION GATEWAY                  │
│   • @whiskeysockets/baileys (Native WhatsApp WebSocket Engine)         │
│   • Cloudflare Tunnel (Cardless Secure Web Access)                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Component Details

1. **Frontend Presentation**: App Electron Desktop untuk Operator & Web View Cloudflare Pages untuk Client REN.
2. **Backend API**: Server Node.js tempatan yang menguatkuasakan aturan `WHERE client_id = current_seat_id`.
3. **Database Engine**: PocketBase / SQLite tempatan dengan Admin UI mesra pengguna.
4. **Automation Layer**: n8n local engine yang memproses scheduled cron & triggers.
5. **Gateway**: Baileys WebSocket yang menyambung ke WhatsApp Web melalui QR Code tanpa kos API Meta.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi System Architecture ZK Revenue Ops (ZK-ARCH-001) |
