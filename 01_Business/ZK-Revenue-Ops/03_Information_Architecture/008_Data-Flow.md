---
Title: Data Flow Architecture - ZK Revenue Ops
ID: ZK-IA-008
Type: Information Architecture Document
Module: 03_Information_Architecture / 008 Data Flow
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 008: Data Flow Architecture

> **ZK-IA-008 | Aliran Pergerakan Data Hujung-ke-Hujung**

---

## Purpose

Dokumen ini mendefinisikan **aliran pergerakan data hujung-ke-hujung (*End-to-End Data Flow*)** yang menunjukkan bagaimana data lead memasuki, diproses, dan mengalir menerusi 10 peringkat sistem ZK Revenue Ops.

---

## End-to-End Data Flow Diagram

```text
[1. Import (FB/TikTok/CSV)]
          │
          ▼
[2. Cleaning (Deduplication & Format Fix)]
          │
          ▼
[3. Validation (Validation Rules & Format Verification)]
          │
          ▼
[4. Segmentation (Project & Property Type Categorization)]
          │
          ▼
[5. Assignment (Routing to Exclusive REN & SDR Queue)]
          │
          ▼
[6. Outreach (WhatsApp Greeting & DSR Screening)]
          │
          ▼
[7. Follow Up (Multi-Touch Touchpoint Cadence)]
          │
          ▼
[8. Appointment (Viewing Booking & Anti-Ghosting Protocol)]
          │
          ▼
[9. Reporting (Live Notion Sync & Monday Audit PDF)]
          │
          ▼
[10. Archive (Long-Term Inactive Data Storage)]
```

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Aliran Data ZK Revenue Ops (ZK-IA-008) |
