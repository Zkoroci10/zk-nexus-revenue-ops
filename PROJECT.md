---
Title: ZK Revenue Ops End-to-End High-End Service Business Platform
ID: PRJ-010
Type: Plan
Module: 00_Command Center
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-08-07
Updated: 2026-08-07
Owner: Zubair (zubairisa10@gmail.com)
---

# Project: ZK Revenue Ops End-to-End High-End Service Business Platform

## Architecture
- **Master Console (`index.html`)**: Multi-tenant dashboard for Zubair to manage 10,000+ leads, 3 REN clients (REN-001, REN-002, REN-003), CSV lead ingestion, Notion CRM sync, and client ROI reporting.
- **Branded REN Client Portal (`portal.html`)**: White-label portal for REN clients following UI/UX Pro Max rules (Stripe/Linear Slate Dark aesthetic, zero emojis, Inter font, DSR pre-approval calculator, buyer dossiers, PDF export).
- **Notion 5-DB Sync Engine (`notion-crm-sync-engine.js`)**: Bi-directional sync across 5 relational Notion databases (Buyer Leads DB, Property Listings DB, Deals & Pipeline DB, REN Clients DB, Appointments DB).
- **Lead Intake & Revival Engine (`fastapi-lead-webhook-server.py`)**: Real-time webhook listener on Port 8085, DSR speed-to-lead scoring (<40% DSR = Tier 1 Pre-Approved), and OP-016 Malay WhatsApp revival sequence for dormant leads (>14 days).
- **System Integrity**: 100% ZNS compliance verified via `validate-zns.ps1`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Executive Master Console Dashboard | Multi-tenant lead management (10k+ leads, 3 REN retainers, CSV import, sync UI, monthly ROI report) | M1 | Request §R1 |
| 2 | Branded REN Client Portal | White-label UI/UX Pro Max portal, buyer dossiers, DSR loan calc, viewing calendar, PDF print export, zero emojis | M2 | Request §R2 |
| 3 | Notion CRM 5-DB Relational Sync Engine | Bi-directional sync across 5 Notion DBs (Buyer Leads, Property Listings, Deals, REN Clients, Appointments) | M3 | Request §R3 |
| 4 | Automated Lead Triage & Revival Engine | FastAPI webhook server on Port 8085, instant DSR speed-to-lead scoring, OP-016 WA Malay revival sequence | M4 | Request §R4 |
| 5 | System Integrity & E2E Validation | 0 ZNS validation errors via validate-zns.ps1 and full E2E verification | M5 | Request §R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Executive Master Console (Management & Coding) | Multi-tenant `index.html` master dashboard with 10k lead management, REN retainers, CSV bulk import, Notion sync UI, ROI reports | None | DONE |
| M2 | Branded REN Client Portal (Design Team UI/UX Pro Max) | White-label `portal.html` adhering to UI/UX Pro Max dark theme, zero emojis, DSR calculator, buyer dossiers, 1-click PDF print export | M1 | IN_PROGRESS |
| M3 | Notion CRM 5-Database Relational Sync Schema (Coding Team) | `notion-crm-sync-engine.js` bi-directional sync engine connecting 5 relational Notion DBs without HTTP errors | M1 | PLANNED |
| M4 | Automated Lead Triage & Revival Engine (R&D Team) | `fastapi-lead-webhook-server.py` webhook listener on Port 8085, DSR triage engine (<40% DSR = Tier 1), OP-016 WA revival | M3 | PLANNED |
| M5 | System Integrity & E2E Verification | Run `validate-zns.ps1` for 0 errors, verify end-to-end integration across console, portal, sync engine, and FastAPI server | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### Master Console ↔ Client Portal
- Shared data structure for Buyer Leads, DSR calculation logic, REN retainers.
- Clean JSON export/import format for buyer dossiers and PDF export data.

### Master Console / FastAPI Server ↔ Notion 5-DB Sync Engine
- Notion Database IDs:
  1. Buyer Leads DB: `3ab9608c-a9d9-8104-924c-c90dc01a789e`
  2. Property Listings DB: `3ab9608c-a9d9-81ba-8b65-e6f3552aa744`
  3. Deals & Pipeline DB: `3ab9608c-a9d9-8185-ae5a-f3f7d1a93dda`
  4. REN Clients DB: `3ab9608c-a9d9-8041-a1ca-c5ca98284cda`
  5. Appointments DB: `3ab9608c-a9d9-81bc-9988-d421ab700466`

## Code Layout
- `05_Systems/Console-Portal/public/index.html` & `index.html` — Executive Master Console
- `05_Systems/Console-Portal/public/portal.html` & `portal.html` — Branded REN Client Portal
- `05_Systems/Scripts/notion-crm-sync-engine.js` — Notion 5-DB Sync Engine
- `05_Systems/Scripts/fastapi-lead-webhook-server.py` — Lead Intake & Webhook Server on Port 8085
- `05_Systems/Scripts/validate-zns.ps1` — ZNS Validator
