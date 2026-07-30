# Original User Request

## 2026-07-28T20:20:29Z

ZK Revenue Ops R&D Phase: Architect a robust, 100% free-tier Database Management Engine for REN Buyer Leads & Client Properties, complete with multi-channel lead ingestion, matching logic, and a custom-tailored client dashboard.

Working directory: C:\Users\Dell\Documents\Projects ZK Nexus
Integrity mode: development

## Requirements

### R1. Database Management Engine & Schema R&D (ZK-DB-RND)
Architect and implement a dual-layer zero-cost database infrastructure:
- **Primary Operational Store**: SQLite / Structured JSON local engine (`05_Systems/Database/client_leads.db`) for high-speed queries, lead scoring, and automated buyer-property matching logic.
- **Cloud Sync Bridge**: Asynchronous bi-directional sync to Notion API / Google Sheets for cloud access and client visibility.
- **Data Model**: Relational schema connecting `REN Clients`, `Buyer Prospects`, `Property Listings`, `Viewing Logs`, and `Commission Deals`.

### R2. Automated Multi-Channel Lead Ingestion Engine (ZK-INGEST)
Build a unified lead ingestion module capable of receiving buyer leads from multiple channels:
- Webhook / API listener for web forms
- Puppeteer / WhatsApp Web message parser (extracts Name, Phone, Location, Budget)
- CSV / Excel bulk import parser for legacy REN contacts

### R3. Custom Tailored Client Dashboard UI (ZK-DASH)
Build a bespoke, high-end SaaS dashboard (`06_Assets/Dashboard/client-dashboard.html`) designed specifically to avoid 'AI slop glows' and 'plain basic tables':
- Dark slate / graphite theme (`#0d1117` base with `#161b22` cards, emerald `#238636` positive metrics, subtle borders)
- Monospace figures for financial metrics (RM Commission, Conversion Rates)
- Interactive tabbed layout (Overview, Buyer Pipeline, Listing Matcher, REN Performance)
- Live connection to the local database server (`http://localhost:3777`)

## Acceptance Criteria

### Technical & R&D Verification
- [ ] Local SQLite database schema initializes cleanly with foreign key constraints between Buyers, RENs, and Listings.
- [ ] Lead matching engine correctly matches sample buyer criteria (e.g. Condo under RM400k in Shah Alam) to matching property listings.
- [ ] Custom dashboard loads live data from local server and displays responsive, high-density layout.
- [ ] Automated ZNS script (`validate-zns.ps1`) passes 100% across all created/edited workspace files.

## 2026-07-30T14:42:45Z

ZK Revenue Ops R&D & Production Rollout: Complete End-to-End Real Estate Sales Delegate (SDR) SaaS Platform, featuring single-tenant Client Portal, automated DSR Loan Qualification Engine, WhatsApp Business Founder Branding, and 100k+ Lead Scale Database Engine for Malaysian REN agents and teams.

Working directory: C:\Users\Dell\Documents\Projects ZK Nexus
Integrity mode: development

## Requirements

### R1. WhatsApp Business Assets & Catalog Restructure (ZK-WA-BRAND)
Restructure and finalize all WhatsApp Business branding & catalog assets:
- **1x Cover Photo Header Banner (16:9 Landscape)**: High-trust B2B SaaS RevOps Header with Founder Ariff's authentic face, PDPA 2010 compliance alignment, and 100,000+ Lead Scale messaging.
- **3x Tiered Catalog Product Banners (1:1 Square)**:
  - Catalog 1: *Tier 1 Starter Solo REN* (Standard RM1,500/month -> Launch Promo RM500/month)
  - Catalog 2: *Tier 2 Growth Top Team* (RM3,000/month for 1-5 REN teams)
  - Catalog 3: *Tier 3 Enterprise Agency* (Open to Discussion / Custom Quote for 100k+ lead databases)
- **1x Free Trial Offer Catalog Banner (1:1 Square)**: *30-Day Free Pilot Program (RM0 Risk-Free Onboarding)*.

### R2. Dual-Layer Database & Qualification Engine (ZK-DB-ENGINE)
Enhance and verify local SQLite & JSON database engine (zk_crm_engine.js & db_engine.js):
- Benchmark sub-50ms query latency for 100,000+ lead records.
- Automated DSR loan qualification (Debt Service Ratio <= 65% for Grade A pass).
- Multi-agent lead allocation (Dynamic Round-Robin for Tier 2, SLA Speed-to-Lead for Tier 3).

### R3. Interactive Client Portal UI & Deployment (ZK-PORTAL-UI)
Maintain 100% working interactive Client Portal (client-dashboard.html & index.html):
- 5 Functional Tab Panes (Buyer Pipeline, DSR Calculator Engine, Property Listings, Viewing Schedule, Commission Ledger).
- Live deployment at https://zkoroci10.github.io/zk-nexus-revenue-ops/ and local server port 3777.

## Acceptance Criteria

### Technical & Visual Verification
- [ ] 4 Visual Banners (1 Cover Photo 16:9 + 3 Tier Catalog Banners + 1 Pilot Trial Banner) are generated, stored, and embedded in master reports.
- [ ] DSR Loan Eligibility Calculator calculates accurate DSR % and Grade A/B/C status in <10ms.
- [ ] All 5 tabs in Client Portal are fully interactive and render live data.
- [ ] Automated ZNS script (validate-zns.ps1) passes 100% across all workspace files.
