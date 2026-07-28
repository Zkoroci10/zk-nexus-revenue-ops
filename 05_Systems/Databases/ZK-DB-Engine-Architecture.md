---
Title: ZK DB Engine Architecture & R&D Specifications
ID: SYS-002
Type: Architecture
Module: 05_Systems/Databases
BU: ZK Revenue Ops
Status: Active
Version: 1
Created: 2026-07-29
Updated: 2026-07-29
Owner: Human Founder
Related: RUL-001, SOP-001
---

# ZK DB Engine Architecture & R&D Specifications

## 1. Overview
The ZK DB Engine is a zero-cost, dual-layer database architecture designed specifically for Real Estate Negotiators (RENs) in Malaysia. It bridges high-speed local lead qualification with asynchronous cloud visibility.

## 2. Dual-Layer Architecture

```
[ Ingestion Sources ] (WhatsApp Web, Web Forms, Portal Scrapes)
         │
         ▼
[ Local R&D Engine ] (05_Systems/Databases/zk_db_engine.js)
  - Fast Relational Matcher (Buyer Budget vs Property Listings)
  - Commission Calculator & Lead Scoring
         │
         ▼
[ Cloud Sync Bridge ] (Notion API / Google Sheets Bridge)
  - Live Dashboard View at http://localhost:3777
  - Public Client Visibility & Export
```

## 3. Data Schema

### REN Clients (`rens`)
- `id`: Unique REN ID (e.g. `REN-001`)
- `name`: Full Name
- `agency`: Agency Name (e.g. IQI Realty, Renstar)
- `tier`: Service Tier (Starter / Growth / Enterprise)
- `activeLeads`: Active lead count

### Buyer Prospects (`buyers`)
- `id`: Buyer ID (`BYR-001`)
- `name`: Buyer Name
- `phone`: Contact Number
- `location`: Target Area (e.g. Setia Alam, Shah Alam)
- `budgetMax`: Maximum Budget (MYR)
- `preferredType`: Property Type (Condo / Terrace / Semi-D / Bungalow)
- `status`: Funnel Status (New Inquiry → Viewing → Negotiation → Booking → Closed)
- `commission`: Potential Agency Commission (MYR)

### Property Listings (`listings`)
- `id`: Listing ID (`LST-001`)
- `title`: Property Name
- `location`: Address / Area
- `price`: Asking Price (MYR)
- `type`: Property Type
- `renId`: Assigned REN

## 4. Property Matching Algorithm
The matching engine calculates a match score (0–100%) between buyers and available listings based on:
1. **Budget Compatibility** (40% weight)
2. **Property Type Exactness** (35% weight)
3. **Location / Region Fit** (25% weight)
