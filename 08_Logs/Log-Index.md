---
Title: ZK Nexus Log Index
ID: IDX-004
Type: Index
Module: 08_Logs
BU: All
Status: Active
Version: 1.1
Created: 2025-07-16
Updated: 2026-08-03
Owner: Human Founder
Related: RUL-001
---

# ZK Nexus Log Index

**Purpose:** Index of all log files by date and type.

**Rule:** Logs are append-only. No editing. No deletion. Permanent record.

---

## Log Files by Type

### Decision Logs

| File | Date Range | Entries | Status |
|------|------------|---------|--------|
| `LOG_2026-07-27_Decision_Focus-Pivot-ZK-Revenue-Ops.md` | 2026-07-27 | 1 | Active |
| `LOG_2026-07-29_Decision_Pricing-Model-v2-Dual-Stream.md` | 2026-07-29 | 1 | Active |
| `LOG_2026-07-29_Decision_Founder-Branding-Authentic-Identity.md` | 2026-07-29 | 1 | Active |
| `LOG_2026-07-29_Decision_Standard-Tech-Stack-Selection.md` | 2026-07-29 | 1 | Active |
| `LOG_2026-07-30_Decision_Lead-Scale-Repositioning-100k.md` | 2026-07-30 | 1 | Active |

### Change Logs

| File | Date Range | Entries | Status |
|------|------------|---------|--------|
| (none) | — | 0 | — |

### Meeting Logs

| File | Date Range | Entries | Status |
|------|------------|---------|--------|
| (none) | — | 0 | — |

### Daily Logs

| File | Date Range | Entries | Status |
|------|------------|---------|--------|
| (none) | — | 0 | — |

### AI Logs

| File | Date Range | Entries | Status |
|------|------------|---------|--------|
| (none) | — | 0 | — |

---

## Log Retention Policy

| Log Type | Active Retention | Archive After | Delete After |
|----------|-----------------|---------------|--------------|
| Decision Logs | 1 year | 1 year | Never |
| Change Logs | 1 year | 1 year | Never |
| Meeting Logs | 6 months | 6 months | Never |
| Daily Logs | 3 months | 3 months | 2 years |
| AI Logs | 6 months | 6 months | 1 year |

---

## How to Create a Log Entry

1. Identify the log type (Decision, Change, Meeting, Daily, AI).
2. Find or create the correct log file: `LOG_{YYYY-MM-DD}_{Type}_{Subject}.md`
3. Append your entry at the bottom of the file.
4. Every entry must include:
   - Timestamp (YYYY-MM-DD HH:MM)
   - Actor (human name or AI Worker ID)
   - Action or event
   - Brief description

**Example:**
```
| 2025-07-16 14:30 | Human Founder | Decision | Approved ZK Nexus Architecture Blueprint for lock |
```

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2025-07-16 | Human Founder | Created Log Index |
| 2026-08-03 | AI Worker M4 | Indexed 5 new decision log files for Milestone 4 |

