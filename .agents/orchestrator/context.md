# Project ZK Nexus — Context & Requirements

## Overview
ZK Revenue Ops R&D Phase requires constructing a zero-cost Database Management Engine, Multi-Channel Lead Ingestion Engine, and a Custom Tailored Client Dashboard UI.

## Detailed Requirements

### R1. Database Management Engine & Schema R&D (ZK-DB-RND)
- Primary Operational Store: Local SQLite database engine (`05_Systems/Database/client_leads.db`).
- Cloud Sync Bridge: Asynchronous bi-directional sync to Notion API / Google Sheets.
- Relational Schema: `REN Clients`, `Buyer Prospects`, `Property Listings`, `Viewing Logs`, `Commission Deals`.
- Matching Logic: Lead scoring and buyer-property matching algorithm (e.g. Condo under RM400k in Shah Alam).

### R2. Automated Multi-Channel Lead Ingestion Engine (ZK-INGEST)
- Webhook / API Listener: Form payload processor.
- Puppeteer / WhatsApp Web Parser: Extracts Name, Phone, Location, Budget.
- CSV / Excel Parser: Bulk contact importer.

### R3. Custom Tailored Client Dashboard UI (ZK-DASH)
- Location: `06_Assets/Dashboard/client-dashboard.html`
- Aesthetics: Dark slate/graphite theme (`#0d1117` base, `#161b22` cards, `#238636` metrics), monospace figures for RM financial stats, no AI slop glows or basic tables.
- Layout: Interactive tabs (Overview, Buyer Pipeline, Listing Matcher, REN Performance).
- Live Server Connection: Connects to `http://localhost:3777`.

### R4. Verification & ZNS Compliance
- All created/edited markdown files must pass `validate-zns.ps1`.
- Clean FK initialization, accurate lead matching logic, live data server integration.
