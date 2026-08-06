---
Title: ZK Nexus Archive Index
ID: IDX-005
Type: Index
Module: 99_Archive
BU: All
Status: Active
Version: 1
Created: 2025-07-16
Updated: 2026-08-03
Owner: Human Founder
Related: RUL-001, RUL-002
---

# ZK Nexus Archive Index

**Purpose:** Index of archived items by source module, date, and ID.

**Rule:** Archive preserves value. Not deleted. Moved here when no longer active.

---

## Archived Items

| Source Module | Item ID | Item Name | Date Archived | Archived By | Reason |
|---------------|---------|-----------|---------------|-------------|--------|
| 02_Projects | PRJ-001 | ZK RevOps Migration | 2026-07-18 | AI-002 | Project completed |
| 02_Projects | PRJ-002 | Workspace Cleanup | 2026-08-03 | worker_m2 | Project completed |
| 02_Projects | PRJ-003 | Business Readiness | 2026-08-03 | worker_m2 | Project completed |
| 02_Projects | PRJ-004 | Sales Engine | 2026-08-03 | worker_m2 | Project completed |

---

## Archive by Category

### Completed Projects

| Project ID | Name | Completion Date | Archive Location |
|------------|------|-----------------|-------------------|
| PRJ-001 | ZK RevOps Migration | 2026-07-18 | `99_Archive/Completed-Projects/PRJ-001_ZK-RevOps-Migration/` |
| PRJ-002 | Workspace Cleanup | 2026-07-18 | `99_Archive/Completed-Projects/PRJ-002_Workspace-Cleanup/` |
| PRJ-003 | Business Readiness | 2026-07-18 | `99_Archive/Completed-Projects/PRJ-003_Business-Readiness/` |
| PRJ-004 | Sales Engine | 2026-07-18 | `99_Archive/Completed-Projects/PRJ-004_Sales-Engine/` |

### Old SOPs

| SOP ID | Name | Replaced By | Date Archived |
|--------|------|-------------|---------------|
| (none) | — | — | — |

### Old Business Plans

| BUS ID | Name | Date Archived | Notes |
|--------|------|---------------|-------|
| (none) | — | — | — |

### Deprecated Templates

| TMP ID | Name | Replaced By | Date Archived |
|--------|------|-------------|---------------|
| (none) | — | — | — |

### Previous Versions

| Original ID | Version | Name | Date Archived |
|-------------|---------|------|---------------|
| (none) | — | — | — |

---

## Archive Retention Policy

| Item Type | Minimum Retention | Review For Deletion After |
|-----------|-------------------|---------------------------|
| Completed Projects | 2 years | 5 years |
| Old SOPs | 3 years | 5 years |
| Old Business Plans | 5 years | 10 years |
| Deprecated Templates | 2 years | 3 years |
| Previous Versions | 1 year | 2 years |

**Note:** Deletion from archive is a Human Founder decision only. Default is "keep indefinitely."

---

## How to Archive an Item

1. Ensure the item is no longer active (Status = Deprecated or project is complete).
2. Record the archival in this index.
3. Move the item to the correct archive subfolder.
4. Preserve the original ID in the file name.
5. Append a note to the item: `ARCHIVED: {Date}. Reason: {Reason}.`
6. Log the archival in `08_Logs/Change-Logs/`.

---

## Retrieval Log

| Date | Item Retrieved | Retrieved By | Reason |
|------|---------------|--------------|--------|
| (none) | — | — | — |

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2025-07-16 | Human Founder | Created Archive Index (empty state) |
| 2026-08-03 | worker_m2 | Populated Archive Index with PRJ-001 through PRJ-004 records |
