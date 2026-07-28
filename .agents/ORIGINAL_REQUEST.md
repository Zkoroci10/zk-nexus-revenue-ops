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
