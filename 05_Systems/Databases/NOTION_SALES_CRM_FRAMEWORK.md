---
Title: Notion Sales Management CRM Framework Specifications
ID: SYS-004
Type: Architecture Framework
Module: 05_Systems/Databases
BU: ZK Revenue Ops
Status: Active
Version: 1
Created: 2026-07-29
Updated: 2026-07-29
Owner: Human Founder
Related: RUL-001, SYS-002, SYS-003
---

# Notion Sales Management CRM Framework Specifications

## 1. End-to-End Sales Lifecycle Pipeline

The ZK Revenue Ops Notion Sales CRM manages the complete lifecycle of real estate transactions across 5 interconnected relational databases:

```
[ Lead Inflow ] ──► [ DSR Loan Screening ] ──► [ Property Matching ]
                                                         │
[ Deal Closing ] ◄── [ Loan & SPA Lawyer ] ◄── [ Viewing & Offer ]
```

## 2. Master Relational Database Schema

### Database 1: `🏢 REN Clients DB`
- `REN ID` (Title): Unique Agent Identifier (e.g., `REN-001`)
- `Name` (Text): Full Agent Name
- `Agency` (Select): Agency Name (IQI Realty, Renstar Properties, etc.)
- `Tier` (Select): Service Tier (Starter RM500 / Growth RM1500 / Enterprise RM3000)
- `Commission Split` (Number): Agent Split Percentage (e.g., `80%`)
- `Active Buyers` (Relation): Rollup of active Grade A/B leads
- `Total Earned YTD` (Formula): Sum of cleared commission deals

### Database 2: `👥 Buyer Prospects DB`
- `Buyer Name` (Title): Prospect Name
- `Phone Number` (Phone): WhatsApp Contact
- `Assigned REN` (Relation): Link to `REN Clients DB`
- `Grade` (Select): `Grade A (Loan Eligible)`, `Grade B (Nurture)`, `Grade C (Cold/Fail DSR)`
- `Net Income (MYR)` (Number): Monthly Net Salary
- `Commitments (MYR)` (Number): Existing Debts (Car, Cards, Loans)
- `DSR Ratio %` (Formula): `((Commitments + EstInstallment) / NetIncome) * 100`
- `Stage` (Select): `New Lead` → `Screened` → `Viewing Scheduled` → `Offer Made` → `SPA Signed` → `Closed`
- `Matched Listings` (Relation): Link to `Property Listings DB`

### Database 3: `🏠 Property Listings DB`
- `Property Title` (Title): Project / Unit Name
- `Asking Price (MYR)` (Number): Selling Price
- `Location Area` (Text): District / Suburb (e.g. Setia Alam, Shah Alam)
- `Type` (Select): Condo, Terrace, Semi-D, Bungalow, Apartment
- `Rooms / Baths` (Text): e.g. `3 Bed, 2 Bath`
- `Owner Contact` (Text): Vendor Contact
- `Assigned REN` (Relation): Link to `REN Clients DB`
- `Listing Status` (Select): `Available`, `Reserved`, `Sold`

### Database 4: `📅 Viewing & Appointments DB`
- `Appointment Title` (Title): e.g. `Viewing: Mohd Fikri @ Suria Jelutong`
- `Buyer` (Relation): Link to `Buyer Prospects DB`
- `Listing` (Relation): Link to `Property Listings DB`
- `Viewing Date` (Date): Date & Time
- `Outcome` (Select): `Interested (Preparing Offer)`, `Needs Alternatives`, `No Show`, `Rejected`
- `Feedback Notes` (Text): Buyer Comments & Objections

### Database 5: `💰 Commission & Deals Ledger DB`
- `Deal Ref` (Title): Transaction ID (e.g. `DEAL-2026-089`)
- `Buyer` (Relation): Link to `Buyer Prospects DB`
- `Listing` (Relation): Link to `Property Listings DB`
- `REN Agent` (Relation): Link to `REN Clients DB`
- `Deal Amount (MYR)` (Number): Final SPA Price
- `Gross Agency Commission` (Number): 2% to 3% of SPA Price
- `REN Net Commission` (Formula): `Gross Commission * Agent Split %`
- `Banker Loan Status` (Select): `Submitted` → `Valuation Done` → `Approved` → `Disbursed`
- `SPA Lawyer` (Text): Appointed Legal Firm
- `Payout Status` (Select): `Pending Loan` → `SPA Signed` → `Paid Out`

## 3. Notion Workspace View Setup

1. **Manager Kanban Board View**: Grouped by `Stage` for instant pipeline tracking.
2. **Grade A Action Filter**: Dedicated view showing ONLY `Grade A` buyers requiring immediate telephone calls.
3. **Agent Personal Portal Page**: Filtered template pre-configured for each REN (`Assigned REN = Current User`).
