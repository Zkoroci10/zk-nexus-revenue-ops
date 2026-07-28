---
Title: Antigravity Integration Bridge Protocol
ID: BRG-001
Type: Protocol / Bridge Specification
Module: 04_Workforce
BU: All
Status: Active
Version: 1.0
Created: 2026-07-28
Updated: 2026-07-28
Owner: Human Founder
Related: RUL-001, RUL-002, RUL-003, RUL-004, AI-START-HERE.md, role-definitions.md
---

# Antigravity Integration Bridge Protocol

**Purpose:** Defines the integration bridge between ZK Nexus workspace governance rules (`ZNS-NC`, `ZNS-MD`, `ZNS-OID`, `ZNS-SS`, `RUL-001`..`004`) and the Antigravity Agent Runtime execution environment.

---

## 1. `.agents/` Layout & Metadata Isolation Boundary

The `.agents/` directory inside the project root contains runtime metadata, execution plans, briefings, progress heartbeats, and handoff reports for AI workspace agents.

### 1.1 Directory Structure
```
.agents/
├── rules/             ← Workspace rules & bridge protocol (RUL-001..004, integration-bridge.md)
├── skills/            ← Runtime agent skills (ui-ux-pro-max, cold-email, apify, etc.)
├── orchestrator/      ← Master plan.md, progress.md, context.md
├── explorer_m1_1/     ← Analysis report, handoff.md
└── worker_m1_1/       ← ORIGINAL_REQUEST.md, BRIEFING.md, progress.md, changes.md, handoff.md
```

### 1.2 Isolation Boundary Rule
- **STRICT PROHIBITION:** The `.agents/` directory MUST contain **ONLY agent execution metadata**.
- **NO SOURCE CODE / NO DATA:** NEVER place workspace source code, application scripts, test files, production templates, or business data inside `.agents/`.
- All operational code belong in `05_Systems/`, business docs in `01_Business/`, templates in `07_Templates/`, and staging in `02_Projects/`.

---

## 2. Heartbeat & Liveness Protocol

To prevent agent timeouts, lost state, or zombie processes, every runtime agent MUST maintain a liveness heartbeat via `progress.md` in its assigned workspace directory (e.g., `.agents/worker_m1_1/progress.md`).

### 2.1 Heartbeat Requirements
- Update `progress.md` immediately after completing each meaningful task step.
- Mandatory timestamp line: `Last visited: [ISO-8601 UTC Timestamp]`.
- During long-running tool executions (e.g., builds, test suites, large generation passes), update `progress.md` at least once every 5 minutes.

---

## 3. Situational Awareness & `BRIEFING.md` Protocol

Every runtime agent MUST maintain a persistent working briefing (`BRIEFING.md`) in its workspace folder.

### 3.1 Immutable Sections (🔒)
Sections marked with 🔒 are **append-only** and MUST NEVER be deleted or rewritten during context updates:
- `## 🔒 My Identity` (Archetype, Roles, Working Directory, Parent ID, Milestone)
- `## 🔒 Key Constraints` (Network mode, Scope boundaries, Permission rules)

### 3.2 Role-Specific Tracking Sections
Agents with implementer/qa/specialist roles MUST maintain:
- `## Change Tracker` (Files modified, build status, pending issues)
- `## Quality Status` (Build/test results, lint violations count, tests added)
- `## Loaded Skills` (Skill source paths, local copies, core methodology summary)

---

## 4. Handoff Protocol & 5-Component Handoff Report

When a runtime agent completes a task, transfers control, or encounters a blocker, it MUST generate a self-contained `handoff.md` file adhering to the 5-Component Handoff Report specification:

1. **Observation:** Exact file paths, line numbers, verbatim outputs, tool command results (quoted directly).
2. **Logic Chain:** Step-by-step reasoning linking observations to conclusions.
3. **Caveats:** Uninvestigated areas, assumptions, alternative interpretations (or "No caveats").
4. **Conclusion:** Final actionable assessment supported by logic chain.
5. **Verification Method:** Specific, reproducible commands or inspection steps to verify correctness.

### 4.1 Handoff Types
- **Hard Handoff:** Task complete. All 5 sections fully populated.
- **Soft Handoff:** Task transferred. Includes "Remaining Work" section with next steps.
- **Partial Handoff:** Agent stuck mid-task. Explains blocker and current state.

---

## 5. Mapping ZNS Governance Rules to Runtime Agent Execution

| ZNS Workspace Rule | Antigravity Runtime Execution Rule | Tool / Enforcement Mechanism |
| :--- | :--- | :--- |
| **`ZNS-NC` Naming** | Tool calls MUST create files with kebab-case filenames, Title Case directories, and 3-digit SOP numbers. | `write_to_file` parameter validation |
| **`ZNS-MD` Metadata** | Every created/updated Markdown file MUST include YAML frontmatter with required keys. `Updated` field refreshed. | Frontmatter template check in `write_to_file` / `replace_file_content` |
| **`ZNS-OID` Object ID** | Check `00_Command Center/ID-Registry.md` for next available sequential ID before assigning. | `ID-Registry.md` lookup prior to writing |
| **Staging Protocol** | All new operational documents & code MUST be written to `02_Projects/` first (`Status: Draft`). | Target path check (prohibit direct root writes) |
| **Active Protection** | Files with `Status: Active` cannot be edited directly. Stage draft copy in `02_Projects/`. | Read-only check on `Active` status files |
| **Audit Logging** | Append Change Log table at bottom of edited files; append audit entry to `08_Logs/`. | Append log entry in tool call workflow |

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2026-07-28 | AI-005 / Worker M1 | Created initial Antigravity Integration Bridge Protocol (BRG-001) |
