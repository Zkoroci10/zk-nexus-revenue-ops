# Original User Request

## Request — 2026-07-29T04:20:36Z

ZK Revenue Ops R&D Phase: Architect a robust, 100% free-tier Database Management Engine for REN Buyer Leads & Client Properties, complete with multi-channel lead ingestion, matching logic, and a custom-tailored client dashboard.

Workspace Directory: C:\Users\Dell\Documents\Projects ZK Nexus
Original Request File: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\ORIGINAL_REQUEST.md
Your working directory: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\orchestrator

Requirements:
1. R1. Database Management Engine & Schema R&D (ZK-DB-RND) - Local SQLite engine (`05_Systems/Database/client_leads.db`), Notion/Google Sheets Cloud Sync Bridge, relational schema (REN Clients, Buyer Prospects, Property Listings, Viewing Logs, Commission Deals).
2. R2. Automated Multi-Channel Lead Ingestion Engine (ZK-INGEST) - Webhook/API listener, Puppeteer/WhatsApp Web message parser, CSV/Excel bulk import parser.
3. R3. Custom Tailored Client Dashboard UI (ZK-DASH) - `06_Assets/Dashboard/client-dashboard.html` with dark slate/graphite theme (`#0d1117` base, `#161b22` cards, `#238636` metrics), monospace figures, interactive tabbed layout, live connection to `http://localhost:3777`.
4. Ensure all acceptance criteria are met, including passing `validate-zns.ps1` 100% across all created/edited files.

## 2026-07-30T14:42:45Z

ZK Revenue Ops R&D & Production Rollout: Complete End-to-End Real Estate Sales Delegate (SDR) SaaS Platform, featuring single-tenant Client Portal, automated DSR Loan Qualification Engine, WhatsApp Business Founder Branding, and 100k+ Lead Scale Database Engine for Malaysian REN agents and teams.

Requirements:
1. R1. WhatsApp Business Assets & Catalog Restructure (ZK-WA-BRAND)
   - 1x Cover Photo Header Banner (16:9 Landscape) with Founder Ariff's authentic face, PDPA 2010 compliance alignment, 100k+ Lead Scale messaging.
   - 3x Tiered Catalog Product Banners (1:1 Square): Tier 1 Starter Solo REN (RM1500->RM500/mo), Tier 2 Growth Top Team (RM3000/mo), Tier 3 Enterprise Agency (Custom quote).
   - 1x Free Trial Offer Catalog Banner (1:1 Square): 30-Day Free Pilot Program.
2. R2. Dual-Layer Database & Qualification Engine (ZK-DB-ENGINE)
   - Benchmark sub-50ms query latency for 100,000+ lead records in zk_crm_engine.js / db_engine.js.
   - Automated DSR loan qualification (DSR <= 65% for Grade A pass).
   - Multi-agent lead allocation (Dynamic Round-Robin for Tier 2, SLA Speed-to-Lead for Tier 3).
3. R3. Interactive Client Portal UI & Deployment (ZK-PORTAL-UI)
   - Maintain 100% working interactive Client Portal (client-dashboard.html & index.html) with 5 Functional Tab Panes (Buyer Pipeline, DSR Calculator Engine, Property Listings, Viewing Schedule, Commission Ledger).
   - Live deployment at https://zkoroci10.github.io/zk-nexus-revenue-ops/ and local server port 3777.

Acceptance Criteria:
- 4 Visual Banners generated, stored, and embedded in master reports.
- DSR Loan Eligibility Calculator calculates accurate DSR % and Grade A/B/C status in <10ms.
- All 5 tabs in Client Portal are fully interactive and render live data.
- Automated ZNS script (validate-zns.ps1) passes 100% across all workspace files.
