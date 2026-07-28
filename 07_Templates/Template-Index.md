---
Title: ZK Nexus Template Index
ID: IDX-015
Type: Index
Module: 07_Templates
BU: All
Status: Active
Version: 1
Created: 2025-07-16
Updated: 2025-07-16
Owner: Human Founder
Related: TMP-001, RUL-001
---

# ZK Nexus Template Index

**Purpose:** Master list of all templates, their IDs, and use cases.

**Rule:** Templates are generic, reusable, and not tied to a specific worker or business.

---

## Templates by Type

### Proposal

| ID | Name | Purpose | Status | Last Updated |
|----|------|---------|--------|--------------|
| TMP-001 | ZK Revenue Ops SDR Pilot Proposal | Clean markdown proposal to pitch pilot campaign to property agents | Active | 2026-07-18 |

### SOP

| ID | Name | Purpose | Status | Last Updated |
|----|------|---------|--------|--------------|
| TMP-004 | Lead Qualification & DSR Audit Checklist | Standardized lead audit, 1-100 scoring, and DSR calculation template | Active | 2026-07-28 |

### Prompt

| ID | Name | Purpose | Status | Last Updated |
|----|------|---------|--------|--------------|
| TMP-003 | CEO Operating Prompt | Prompt template for CEO operations | Active | 2026-07-18 |

### Email

| ID | Name | Purpose | Status | Last Updated |
|----|------|---------|--------|--------------|
| TMP-002 | ZK Revenue Ops SDR Outreach Emails | Standard cold outreach and value-add email pitches for agents | Active | 2026-07-28 |

### Contract

| ID | Name | Purpose | Status | Last Updated |
|----|------|---------|--------|--------------|
| (none) | — | — | — | — |

### Invoice

| ID | Name | Purpose | Status | Last Updated |
|----|------|---------|--------|--------------|
| (none) | — | — | — | — |

### Spreadsheet

| ID | Name | Purpose | Status | Last Updated |
|----|------|---------|--------|--------------|
| TMP-005 | Client Lead Database Template | Client Lead Database Template (CSV / Sheet Format) - Spreadsheet/TMP-005_Client-Lead-Database.md | Active | 2026-07-28 |

### Workflow

| ID | Name | Purpose | Status | Last Updated |
|----|------|---------|--------|--------------|
| (none) | — | — | — | — |

### Automation

| ID | Name | Purpose | Status | Last Updated |
|----|------|---------|--------|--------------|
| (none) | — | — | — | — |

---

## Template Usage Guide

| When you need to... | Use template type... | Location |
|---------------------|---------------------|----------|
| Send a proposal to a client | Proposal | 07_Templates/Proposal/ |
| Document a standard procedure | SOP | 07_Templates/SOP/ |
| Create a reusable AI prompt | Prompt | 07_Templates/Prompt/ |
| Send a standardized email | Email | 07_Templates/Email/ |
| Draft a client agreement | Contract | 07_Templates/Contract/ |
| Bill a client | Invoice | 07_Templates/Invoice/ |
| Track data in a table | Spreadsheet | 07_Templates/Spreadsheet/ |
| Document a process flow | Workflow | 07_Templates/Workflow/ |
| Configure an automation | Automation | 07_Templates/Automation/ |

---

## How to Create a Template

1. Identify the need. Is this template needed more than once?
2. Assign the next available TMP- ID from ID-Registry.
3. Create the template in the correct type subfolder.
4. Name it: `TMP-{NNN}_{Type}_{Purpose}.{ext}`
5. Ensure it is generic (no client names, no dates, no BU-specific terms).
6. Update this Template Index.
7. Log the creation in `08_Logs/Change-Logs/`.

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2025-07-16 | Human Founder | Created Template Index (empty state) |
| 2026-07-18 | AI-002 | PRJ-003: Registered TMP-001 (Proposal Template) and TMP-002 (Email Template) |
| 2026-07-18 | AI-002 | Registered TMP-003 Prompt Template (CEO Operating Prompt Library) |
| 2026-07-28 | teamwork_preview_worker | M3 Implementation: Updated TMP-001, TMP-002, and registered TMP-003 Lead Qualification Checklist |
| 2026-07-28 | worker_m3_gen2 | Resolved TMP-003 collision: Reassigned Lead Qualification Checklist to TMP-004 and restored TMP-003 to CEO Operating Prompt |
| 2026-07-28 | worker_m3_collision_fix | Resolved TMP-004 collision: Registered TMP-005 (Client Lead Database Template) under Spreadsheet templates |

