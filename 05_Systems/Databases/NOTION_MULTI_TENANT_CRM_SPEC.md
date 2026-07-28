---
Title: High-End Notion Multi-Tenant CRM Architecture Specification
ID: SYS-003
Type: Architecture Specification
Module: 05_Systems/Databases
BU: ZK Revenue Ops
Status: Active
Version: 1
Created: 2026-07-29
Updated: 2026-07-29
Owner: Human Founder
Related: RUL-001, SYS-002
---

# High-End Notion Multi-Tenant CRM Architecture Specification

## 1. Executive Summary
Handling 5,000+ leads per client in Notion can cause performance bottlenecks if built as a single monolithic database. This specification details the **Multi-Tenant Partitioned Architecture** designed for ZK Revenue Ops to handle tens of thousands of leads cleanly across distinct REN clients without lag or clutter.

## 2. Multi-Tenant Architectural Blueprint

```
                     ┌─────────────────────────────────────────┐
                     │   ZK Revenue Ops Master Admin Control   │
                     └────────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
    ┌───────────────────────────┐                   ┌───────────────────────────┐
    │  REN Client A (IQI Realty) │                   │ REN Client B (Renstar)    │
    │  Dedicated Notion Workspace│                   │ Dedicated Notion Workspace│
    └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                  │                                               │
  ┌───────────────┴───────────────┐               ┌───────────────┴───────────────┐
  ▼                               ▼               ▼                               ▼
[Grade A & B Notion Pipeline]  [Local High-Volume] [Grade A & B Notion Pipeline]  [Local High-Volume]
(Active Leads Only: ~500)      (Archive DB: 5k)   (Active Leads Only: ~500)      (Archive DB: 5k)
```

## 3. Key Design Principles

### A. Active vs Archive Data Tiering (Tiered Storage)
- **Notion Live CRM**: Contains **ONLY Grade A & Grade B Active Pipeline Leads** (approx. 500 - 1,000 leads per REN). This keeps Notion lightweight, superfast, and beautiful.
- **Local Engine Archive**: 5,000+ raw dormant leads stay indexed in the local zero-cost JSON/SQLite R&D Engine until re-engaged.

### B. Workspace Isolation per REN Client
Each REN Client receives a custom, white-labeled Notion Portal Page featuring:
- **Lead Pipeline Board View** (New Inquiry → Viewing → Negotiation → Booking Placed → Closed)
- **Property Matching Database** (Properties assigned to that REN)
- **DSR Loan Eligibility Summary Callouts**

## 4. Required Connections & Permission Blueprint

To execute this architecture end-to-end, ZK Revenue Ops leverages:

1. **Notion MCP Server**: Connected via `process.env.NOTION_API_KEY` for bi-directional Notion database manipulation.
2. **Resend MCP Server**: Configured for automated cold email re-engagement campaigns.
3. **Puppeteer / WhatsApp Web MCP**: Configured for local automated WhatsApp messaging & qualification triggers.
4. **GitHub MCP Server**: Configured for cloud backup of all workspace code & JSON stores.
