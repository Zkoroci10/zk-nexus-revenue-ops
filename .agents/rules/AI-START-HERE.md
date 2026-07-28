---
Title: Antigravity Runtime AI Entry Point & Quick Reference Guide
ID: RUL-004-AGY
Type: Guide
Module: 00_Command Center
BU: All
Status: Active
Version: 1.0
Created: 2025-07-16
Updated: 2026-07-28
Owner: Human Founder
Related: RUL-001, RUL-002, RUL-003, RUL-004, integration-bridge.md, role-definitions.md
---

# Antigravity Runtime AI Entry Point & Quick Reference Guide

**WELCOME AI WORKSPACE AGENT.** You are operating within Project ZK Nexus under the Antigravity Agent Execution Runtime.

**CRITICAL INSTRUCTION:** Read this quick reference guide completely before executing any tool calls, reading workspace files, or modifying code.

---

## 1. Quick Navigation Matrix

Incoming agents must immediately locate key workspace registries and standards before starting tasks:

| Purpose | Registry / Standard | Path |
| :--- | :--- | :--- |
| **Workspace Navigation Map** | `Workspace-Index.md` (`IDX-001`) | `00_Command Center/Workspace-Index.md` |
| **Assigned Object IDs** | `ID-Registry.md` (`IDX-002`) | `00_Command Center/ID-Registry.md` |
| **Worker Profiles & Roles** | `Role-Definitions.md` (`IDX-011`) | `.agents/rules/role-definitions.md` |
| **AI Onboarding Sequence** | `RUL-003 AI Onboarding Protocol` | `.agents/rules/RUL-003.md` |
| **ZNS Core Standards** | `RUL-001 ZK Nexus Standard` | `.agents/rules/RUL-001.md` |
| **Module Hierarchy & Depth** | `RUL-002 Module Standard` | `.agents/rules/RUL-002.md` |
| **AI Operating Principles** | `RUL-004 AI START HERE` | `.agents/rules/RUL-004.md` |
| **Antigravity Bridge Rules** | `Integration Bridge Protocol` | `.agents/rules/integration-bridge.md` |

---

## 2. Core Execution Rules for Antigravity Agents

### 2.1 File Creation & Staging Rules
1. **Read-First Principle:** Always `view_file` workspace index and existing topic files before creating new files. Apply 80% overlap rule (update existing if >80% match).
2. **Staging Mandatory:** All new operational content MUST be created inside `02_Projects/Active/[Project-Name]/` or `02_Projects/Internal/` first (`Status: Draft`).
3. **No Direct Root Overwrites:** Do NOT write directly to live modules (`01_Business`, `03_Knowledge`, `05_Systems`, `06_Resources`, `07_Templates`).
4. **ZNS Naming Convention (`ZNS-NC`):** Use lower kebab-case for files (e.g. `sdr-outreach-playbook.md`), Title Case with spaces for folders, 3-digit zero-padded numbers for SOPs/Gov docs (e.g. `001_Vision.md`).
5. **ZNS Metadata Headers (`ZNS-MD`):** Include YAML frontmatter header on EVERY created Markdown file containing Title, ID, Type, Module, BU, Status, Version, Created, Updated, Owner, Related.

### 2.2 `.agents/` Runtime Metadata Boundary
- The `.agents/` directory is reserved **EXCLUSIVELY for agent execution metadata** (`plan.md`, `progress.md`, `BRIEFING.md`, `handoff.md`, `changes.md`, `skills/`).
- **NEVER** place workspace source code, scripts, tests, data files, or production documents inside `.agents/`.

### 2.3 Antigravity Runtime Protocol Checklist
- **Heartbeat:** Update `progress.md` after completing each meaningful task step (include `Last visited: YYYY-MM-DDTHH:MM:SSZ` timestamp).
- **Situational Awareness:** Maintain `BRIEFING.md` in agent workspace directory with locked 🔒 identity and constraints sections.
- **Handoff Report:** Write 5-component `handoff.md` (Observation, Logic Chain, Caveats, Conclusion, Verification Method) upon task completion.

---

## 3. Quick Execution Checklist for Incoming Agents

```markdown
- [ ] 1. Read AI-START-HERE.md and BRIEFING.md
- [ ] 2. Check worker role in role-definitions.md (AI-001 through AI-005)
- [ ] 3. Verify task scope and target staging directory in 02_Projects/
- [ ] 4. Inspect existing workspace context & files (apply 80% overlap rule)
- [ ] 5. Implement changes in staging with proper ZNS-MD metadata header
- [ ] 6. Run verification builds and tests
- [ ] 7. Update progress.md heartbeat timestamp
- [ ] 8. Generate changes.md and 5-component handoff.md
```

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2025-07-16 | Human Founder | Created initial AI START HERE quick reference |
| 2026-07-28 | AI-005 / Worker M1 | Published AI-START-HERE.md in `.agents/rules/` for Antigravity runtime |
