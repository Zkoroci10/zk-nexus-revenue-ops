# Project ZK Nexus — Context & Requirements

## Overview
ZK Revenue Ops R&D & Production Rollout: Complete End-to-End Real Estate Sales Delegate (SDR) SaaS Platform, featuring single-tenant Client Portal, automated DSR Loan Qualification Engine, WhatsApp Business Founder Branding, and 100k+ Lead Scale Database Engine for Malaysian REN agents and teams.

## Detailed Requirements

### R1. WhatsApp Business Assets & Catalog Restructure (ZK-WA-BRAND)
- **Cover Photo Header Banner (16:9 Landscape)**: High-trust B2B SaaS RevOps Header featuring Founder Ariff's authentic face, PDPA 2010 compliance alignment, and 100k+ Lead Scale messaging.
- **3x Tiered Catalog Product Banners (1:1 Square)**:
  - Catalog 1: Tier 1 Starter Solo REN (RM1,500/mo -> Launch Promo RM500/mo)
  - Catalog 2: Tier 2 Growth Top Team (RM3,000/mo for 1-5 REN teams)
  - Catalog 3: Tier 3 Enterprise Agency (Custom quote for 100k+ lead databases)
- **1x Free Trial Offer Catalog Banner (1:1 Square)**: 30-Day Free Pilot Program (RM0 Risk-Free Onboarding).
- All 4 visual banners generated, stored, and embedded in master reports.

### R2. Dual-Layer Database & Qualification Engine (ZK-DB-ENGINE)
- **100k+ Scale Query Latency**: Benchmark sub-50ms query latency for 100,000+ lead records in `zk_crm_engine.js` / `db_engine.js`.
- **Automated DSR Loan Qualification**: DSR <= 65% for Grade A pass, calculated in <10ms with status Grade A/B/C.
- **Multi-Agent Lead Allocation**: Dynamic Round-Robin for Tier 2, SLA Speed-to-Lead for Tier 3.

### R3. Interactive Client Portal UI & Deployment (ZK-PORTAL-UI)
- **5 Functional Tab Panes**: Buyer Pipeline, DSR Calculator Engine, Property Listings, Viewing Schedule, Commission Ledger.
- **Interactive UI**: All 5 tabs fully interactive, rendering live data from local server port 3777.
- **Deployment**: Live deployment alignment at `https://zkoroci10.github.io/zk-nexus-revenue-ops/` and local server port 3777.

### R4. Verification & ZNS Compliance
- Automated ZNS script (`validate-zns.ps1`) passes 100% across all workspace files.
- Forensic integrity audit verified CLEAN.

