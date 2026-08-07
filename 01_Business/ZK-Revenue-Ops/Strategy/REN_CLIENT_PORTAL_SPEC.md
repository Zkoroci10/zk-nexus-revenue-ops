---
Title: REN Client Portal Functional Specification & Value Architecture
ID: BUS-003
Type: Product Requirement Document / Functional Spec
Module: 01_Business/ZK-Revenue-Ops/Strategy
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-08-08
Updated: 2026-08-08
Owner: Zubair (zubairisa10@gmail.com)
Related: BUS-001, BUS-002, PRJ-016
---

# 🏢 REN Client Portal — Functional Specification & Value Architecture

## Executive Summary
This specification defines the high-end, white-label **REN Client Portal (`portal.html`)** for ZK Revenue Ops retainer clients (`REN-001 Subang Jaya`, `REN-002 Shah Alam North`, `REN-003 Cyberjaya/Puchong`). Designed under `ui-ux-pro-max-skill` (Linear/Stripe Slate Dark aesthetic, zero cheap emojis, SVG icons), the portal delivers maximum perceived value for REN retainers paying RM 800 - RM 3,000/mo by providing pre-approved buyer dossiers, an interactive DSR loan calculator, viewing calendar, and 1-click PDF print export.

---

## 🎯 1. Key Value Deliverables for REN Clients

```
┌────────────────────────────────────────────────────────────────────────┐
│                   REN CLIENT PORTAL VALUE ARCHITECTURE                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. 🏷️ WHITE-LABEL BRANDING & RETAINER BADGE                           │
│     • Displays REN Agent Name, Agency Name, & Territory.               │
│     • Active Retainer Tier Badge (e.g., Tier 1 Premium Retainer).      │
│                                                                        │
│  2. 📋 TAB 1: VERIFIED BUYER DOSSIERS                                  │
│     • Dossier cards for DSR pre-approved buyers assigned to client.    │
│     • Net Income, DSR Ratio %, Bank Tier badge, & 1-Click WhatsApp.    │
│                                                                        │
│  3. 🧮 TAB 2: INTERACTIVE DSR LOAN CALCULATOR                          │
│     • Live DSR underwriting calculator for REN to use with buyers.     │
│     • Auto-calculates installment, max loan, & attaches to dossier.    │
│                                                                        │
│  4. 📅 TAB 3: SALES GALLERY VIEWING CALENDAR                           │
│     • Confirmed viewing appointments & anti-ghosting WhatsApp status.  │
│                                                                        │
│  5. 📄 1-CLICK PDF PRINT EXPORT                                         │
│     • Professional `@media print` white-paper stylesheet for print/PDF.│
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 2. Action Items & Component Mapping

| Component | Function | Technical Implementation | Status |
|-----------|----------|--------------------------|--------|
| **Client Selector** | Switch between REN-001, REN-002, REN-003 or Master View | Query Param `?ren=REN-001` & topbar dropdown | 🟢 Ready |
| **Buyer Dossiers Grid** | Display pre-qualified buyer cards with DSR tags | Responsive CSS grid + 1-Click WhatsApp links | 🟢 Ready |
| **DSR Underwriter** | Interactive loan & installment calculator | JavaScript DSR math engine (`Net = Gross * 0.87`) | 🟢 Ready |
| **Viewing Calendar** | Appointment table with anti-ghosting status | Dynamic HTML table + WhatsApp reminder action | 🟢 Ready |
| **Print Stylesheet** | Clean white-paper layout for PDF export | CSS `@media print` rule block | 🟢 Ready |

---

## 🔒 3. Data Isolation & Privacy Rules
- REN Clients only see buyer dossiers assigned to their specific Client ID (`REN-001`, `REN-002`, or `REN-003`).
- Zero data bleed between competing REN retainer clients.
