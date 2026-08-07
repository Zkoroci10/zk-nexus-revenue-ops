# Original User Request

## 2026-08-07T03:55:24+08:00

ZK Revenue Ops End-to-End High-End Service Business Platform orchestrated across 4 specialized sub-teams: Coding, Management, R&D, and Design (UI/UX Pro Max) with explicit Notion 5-Database Relational Sync.

Working directory: C:\Users\Dell\Documents\Projects ZK Nexus
Integrity mode: development

## Requirements

### R1. Executive Master Console (Management & Coding Team)
Multi-tenant master dashboard (index.html) for Zubair to manage 10,000+ leads, 3 REN retainer clients (REN-001, REN-002, REN-003), bulk CSV ingestion, Notion CRM 5-database sync, and monthly client ROI reports.

### R2. Branded REN Client Portal (Design Team — UI/UX Pro Max)
Sleek, white-label client portal (portal.html) adhering strictly to UI/UX Pro Max guidelines (Stripe/Linear Slate Dark aesthetic, zero weird emojis, crisp Inter typography) for REN clients to view assigned buyer dossiers, DSR loan pre-approval calculations, viewing calendar, and export PDF print cards.

### R3. Notion CRM 5-Database Relational Sync Schema (Coding Team)
Bi-directional real-time sync across 5 relational Notion databases:
1. Buyer Leads DB (3ab9608c-a9d9-8104-924c-c90dc01a789e) — Buyer Name, Phone, Project, DSR Ratio, Income, Loan Tier.
2. Property Listings DB (3ab9608c-a9d9-81ba-8b65-e6f3552aa744) — Listing Title, Location, Price, Assigned REN.
3. Deals & Pipeline DB (3ab9608c-a9d9-8185-ae5a-f3f7d1a93dda) — Deal Stage, Commission Value, Retainer Client ID.
4. REN Clients / Retainers DB (3ab9608c-a9d9-8041-a1ca-c5ca98284cda) — REN Name, Territory, Retainer Tier (RM 500-1500), Active Lead Count.
5. Appointments & Viewings DB (3ab9608c-a9d9-81bc-9988-d421ab700466) — Buyer Name, REN Agent, Viewing Date/Time, Location, Status.

### R4. Automated Lead Triage & Revival Engine (R&D Team)
Instant speed-to-lead triage scoring (< 40% DSR = Tier 1 Pre-Approved) and automated WhatsApp Malay revival sequence (OP-016 framework) for stale leads (> 14 days dormant).

## Acceptance Criteria

### Master Console & Client Portal Integration
- [ ] Master Console (index.html) controls all lead partitions, bulk imports, and Notion 5-Database live sync.
- [ ] REN Client Portal (portal.html) renders white-label buyer dossiers, DSR pre-approval calculations, and 1-click PDF print export with ZERO emojis.
- [ ] Notion 5-Database sync engine (notion-crm-sync-engine.js) maps all 5 databases without HTTP errors.
- [ ] Real-time lead intake server (fastapi-lead-webhook-server.py) accepts webhook posts on Port 8085.
- [ ] 0 ZNS validation errors across all workspace files.
