---
Title: ZK Nexus Daily Control Loop & Autopilot Engine
ID: RUL-005
Type: Ritual & Autopilot Contract
Module: 00_Command Center
BU: All
Status: Active
Version: 2.0
Created: 2025-07-16
Updated: 2026-08-02
Owner: Human Founder & AI AGY System
Related: IDX-001, IDX-003, RUL-004
---

# ZK Nexus Daily Control Loop & Autopilot Contract

> Automated Daily Operations Contract for ZK Nexus Workspace

---

## 1. Executive Summary & Autopilot Mandate
The **Daily Control Loop** is fully automated by the AI Autopilot Engine (`05_Systems/Scripts/daily-autopilot.ps1`). 

The system runs twice daily without requiring manual user execution:
* **Morning Run (8:00 AM)**: Performs workspace health scan, checks client follow-ups, updates project status, generates `00_Command Center/AI-Suggestions.md`, and dispatches the morning summary.
* **Evening Run (6:00 PM)**: Conducts daily log closure, archives completed tasks, updates activity metrics, and prepares the next day's backlog.

---

## 2. Automated 5-Phase Check

### Phase 1: Module Health & System Audit
* Automatically scans all 10 workspace modules (`00_Command Center` to `99_Archive`).
* Validates ZNS metadata integrity and reports broken links in `00_Command Center/Module-Health-Report.md`.

### Phase 2: Client & Revenue Actions
* Scans `01_Business/ZK-Revenue-Ops/` for active clients requiring follow-ups or dossier deliveries.

### Phase 3: Active Projects Progress
* Scans `02_Projects/Active-Projects-List.md` and updates progress counters for active `PRJ` projects.

### Phase 4: Pending Decisions & Triage
* Scans `08_Logs/Decision-Logs/` and `02_Projects/Idea-Backlog.md` for items requiring Human Founder approval.

### Phase 5: Proactive AI Suggestions
* Publishes daily optimization tips, bottleneck alerts, and high-impact suggestions to `00_Command Center/AI-Suggestions.md`.

---

## 3. Autopilot Schedule & Watcher Integration

| Trigger | Schedule | Execution Script | Primary Target Output |
|---------|----------|------------------|----------------------|
| **Morning Autopilot** | 08:00 AM | `05_Systems/Scripts/daily-autopilot.ps1` | `AI-Suggestions.md` & Morning Pulse Email |
| **Evening Autopilot** | 06:00 PM | `05_Systems/Scripts/daily-autopilot.ps1` | Daily Log Closure & Evening Summary |
| **Sunday Review** | Sunday 8:00 PM | `05_Systems/Scripts/sunday-idea-review.ps1` | `Idea-Backlog.md` Triage & Draft PRJs |

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2025-07-16 | Human Founder | Created initial Daily Control Loop ritual |
| 2026-08-02 | AI AGY System | Upgraded to v2.0 Automated Autopilot Contract |
