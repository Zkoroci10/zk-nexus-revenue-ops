---
Title: NOTION_SALES_CRM_FRAMEWORK
ID: STR-009
Type: Architectural Framework
Module: ZK Revenue Ops
BU: Real Estate AI Infrastructure
Status: Approved
Version: 2.0.0
Created: 2026-07-31
Updated: 2026-07-31
Owner: CEO / ZK Nexus Team
Related: STR-006, STR-007, SYS-003, OP-013, OP-015
---

# 📚 NOTION SALES CRM & TOOL INTEGRATION FRAMEWORK v2.0

> **Master Synchronization Standard**: Bi-directional sync between Notion Operator Console and Local SQLite Database / Client Portal (`server.js` Port 3777).

---

## 🏛️ 1. NOTION RELATIONAL DATABASE SCHEMA

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             NOTION OPERATOR CRM ARCHITECTURE                             │
├──────────────────────────┬───────────────────────────────────────────────────────────────┤
│ DB 1: Buyer Prospects    │ Name, Phone, DSR %, Grade (A/B/C), Budget, Assigned REN       │
│ DB 2: Property Listings  │ Title, Asking Price, Location Area, Property Type, REN Name   │
│ DB 3: Viewing Schedule   │ Buyer Name, Property Title, Date/Time, Rating, Status         │
│ DB 4: Commission Ledger  │ SPA Deal Value, Gross Comm %, Agent Split %, Banker Loan Status│
└──────────────────────────┴───────────────────────────────────────────────────────────────┘
```

---

## 🔗 2. BI-DIRECTIONAL SYNC BRIDGE (NOTION <-> TOOL INTEGRATION)

1. **Local SQLite Primary Store (`client_leads.db`)**: High-speed lead scoring & DSR loan pre-qualification (<10ms).
2. **Notion Cloud Mirror (API Webhook Sync)**: Asynchronous update to Notion API endpoint (`https://api.notion.com/v1/databases`) via `setup_notion_sales_crm.ps1`.
3. **Client Portal Frontend (`index.html`)**: Real-time rendering of active leads, listings, viewings, and SPA deal commission ledger.

---

## 🛡️ 3. DATA PRIVACY & SINGLE-TENANT EXCLUSIVITY
- Single-Tenant Encrypted Isolation (AES-256 at rest).
- Built to **PDPA 2010 Privacy Standards (Act 709 Malaysia)**.
