---
Title: SOP-OPS-002 Console Operator & AI Worker Operational Manual
ID: SOP-OPS-002
Type: Standard Operating Procedure
Module: 01_Business / Operations
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-07-26
Updated: 2026-07-26
Owner: Human Founder & AI AGY System
Related: ZK-WF-001, SOP-SDR-001, SOP-SDR-002
---

# SOP-OPS-002: Console Operator Operational Manual

## 1. Purpose
Defines the daily operating ritual and responsibilities for the Console Operator (Human Founder & AI Workers) to maintain smooth revenue operations.

## 2. Daily Operator Schedule (15-Minute Control Loop)

### Morning Ritual (9:00 AM)
1. **Open Console Operator Dashboard** (`05_Systems/Console-Portal/public/index.html`).
2. Review incoming lead ingestion queue.
3. Check overnight responses and perform lead triage:
   - Assign `Tier 1 Hot`, `Tier 2 Warm`, or `Disqualified`.
4. Publish newly qualified `Tier 1 Hot` leads to the **REN Client Desk**.

### Mid-Day Ritual (2:00 PM)
1. Execute Touchpoint follow-up cadence (Day 1, Day 3, Day 7) via 1-click WhatsApp.
2. Confirm upcoming viewing appointments for the next 24 hours.

### Evening Ritual (6:00 PM)
1. Review REN Client Desk feedback ("Viewing Completed", "Closed Deal").
2. Update activity logs and log daily performance counters.

---

## 3. Strict Division of Data Access

| Feature / Data | Console Operator Hub | REN Client Desk |
|----------------|----------------------|-----------------|
| Raw Incoming Lead Data | Full Access | Excluded |
| Lead Screening Notes & Prompts | Full Access | Excluded |
| WhatsApp Direct Chat Links | Full Access | Excluded |
| Verified Buyer Dossiers | Full Access | Full Access |
| Confirmed Viewing Schedule | Full Access | Full Access |
| Status Update Buttons | Full Access | Client Feedback Only |

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2026-07-26 | AI AGY | Initial creation of SOP-OPS-002 Console Operator Manual |
