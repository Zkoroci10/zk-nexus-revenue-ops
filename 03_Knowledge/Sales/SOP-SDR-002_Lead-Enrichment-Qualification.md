---
Title: SOP-SDR-002 Lead Enrichment & Qualification Protocol
ID: SOP-SDR-002
Type: Standard Operating Procedure
Module: 03_Knowledge / Sales
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-07-26
Updated: 2026-07-26
Owner: Human Founder & AI AGY System
Related: SOP-SDR-001, ZK-WF-001
---

# SOP-SDR-002: Lead Enrichment & Qualification Protocol

## 1. Purpose
Establishes clear criteria for evaluating incoming raw property leads and categorizing them into actionable tiers before handoff to REN clients.

## 2. Lead Qualification Tiers

| Tier | Category | Qualification Criteria | Action Required |
|------|----------|------------------------|-----------------|
| Tier 1 | Hot / Qualified | Pre-approved loan OR income >= RM5,000, buying timeline < 30 days, confirmed appointment. | Fast-track to REN Client Desk + Buyer Dossier generation. |
| Tier 2 | Warm / Nurture | Interested, income meets basic requirement, but timeline 1-3 months or waiting for document collection. | Assign to Multi-Touch Follow-Up Cadence (SOP-SDR-003). |
| Tier 3 | Disqualified / Invalid | Fake number, out of budget, no response after 14 days, or explicit opt-out. | Archive lead record; exclude from REN Client Desk. |

---

## 3. Buyer Dossier Mandatory Fields
Before a lead is promoted to the REN Client Desk, the Console Operator must compile the following Buyer Dossier fields:

1. Full Name
2. Validated WhatsApp Contact (`+601...`)
3. Net Monthly Household Income (Combined/Single)
4. Loan Pre-Approval Status (Pre-approved / Pending Document Submission / Cash)
5. Target Location & Property Type Interest
6. Confirmed Viewing Time & Venue

---

## 4. Console Operator Triage Protocol
1. Receive incoming raw payload in Console Operator view.
2. Verify phone number validity using `VR-001` format rules.
3. Conduct screening via WhatsApp (Script B).
4. Update Lead Tag: `Tier 1 Hot`, `Tier 2 Warm`, or `Disqualified`.
5. If `Tier 1 Hot`, generate Buyer Dossier and publish to REN Client Desk.

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2026-07-26 | AI AGY | Initial creation of SOP-SDR-002 Lead Qualification Protocol |
