---
Title: ZK Revenue Ops Client Folder Structure
ID: BUS-001 Asset
Type: Folder Structure
Module: 01_Business
BU: ZK Revenue Ops
Status: Active
Version: 1
Created: 2026-07-18
Updated: 2026-07-18
Owner: Human Founder
Related: PRJ-003, BUS-001
---

# ZK Revenue Ops Client Folder Structure

This document standardizes the directory structure for onboarded property agent (REN) clients under ZK Revenue Ops.

---

## 1. Client Folder Hierarchy

Every new client receives a dedicated directory inside `01_Business/ZK-Revenue-Ops/Client-Delivery/` named in Title Case:

```text
01_Business/ZK-Revenue-Ops/Client-Delivery/[Client Name]/
├── 01_Onboarding/                ← Onboarding checklist, onboarding text logs
├── 02_Contracts_and_Invoices/    ← Signed SOW, MSA, invoices, receipts
├── 03_Lead_Lists/                ← Raw Excel/CSV lead exports from ads
└── 04_Reports/                   ← Weekly conversion reports, pilot summaries
```

---

## 2. Directory Guidelines & Naming Conventions

### 2.1 File Naming inside Client Directories
All files inside client folders must use kebab-case with hyphens and start with the project or client prefix. Never use generic names like "invoice.pdf" or "leads.csv".

**Correct Formats:**
- Onboarding checklist: `[client-name]-onboarding-form.md`
- Signed Statement of Work: `[client-name]-signed-sow.pdf`
- Invoice: `[client-name]-inv-[yyyy-mm-dd].pdf`
- Exported Leads: `[client-name]-raw-leads-[yyyy-mm-dd].csv`
- Weekly Report: `[client-name]-weekly-report-[yyyy-mm-dd].md`

---

## 3. Onboarding Directory Creation Workflow

1. Create the main client directory: `01_Business/ZK-Revenue-Ops/Client-Delivery/[Client Name]`.
2. Populate the four standard subfolders.
3. Save the signed contracts (MSA & SOW) in the `02_Contracts_and_Invoices/` folder.
4. Copy the raw lead database provided by the agent into the `03_Lead_Lists/` folder.
5. Create their client entry in `01_Business/Business-Registry.md` under the Client Directory table.

---

## Change Log
| Date | Actor | Change |
|------|-------|--------|
| 2026-07-18 | AI-002 | Created Client Folder Structure guidelines |
