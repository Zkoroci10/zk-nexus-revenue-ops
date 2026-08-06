---
Title: PRJ-009 Tools and CRM Standardization
ID: PRJ-009
Type: Project
Module: 02_Projects
BU: ZK Revenue Ops
Status: In Development
Version: 1.0
Created: 2026-08-05
Updated: 2026-08-05
Owner: Zubair (zubairisa10@gmail.com)
Related: SYS-001, SYS-002, SYS-003
---

# PRJ-009 — Tools & CRM Standardization

## Objective

Standardize all ZK-Nexus local scripts, tools, prompts, and the Console-Portal CRM web app to be fully ZNS-compliant, semantically correct, and Google Drive / Gemini Spark accessible.

## Scope

- `05_Systems/Scripts/` — All script files
- `05_Systems/Console-Portal/` — CRM web app (HTML/CSS/JS)
- `01_Business/ZK-Revenue-Ops/Sales/` — GAS CRM engine
- `07_Templates/` — Prompts and template files

## Task Checklist

- [x] Audit all scripts for missing ZNS headers
- [x] Identify files with forbidden terms (v2, final, new, old, optimized)
- [x] Create PRJ-009 project file
- [x] Inject ZNS headers into 20 scripts in 05_Systems/Scripts/
- [x] Rename files to kebab-case, remove forbidden terms
- [x] Refactor gas-code-optimized.js → gas-crm-engine.js (SYS-003)
- [x] Rework Console-Portal index.html (semantic HTML, aria, SEO)
- [x] Rework Console-Portal styles.css (dark mode tokens, glassmorphism, wa-me-btn)
- [x] Rework Console-Portal app.js (wa.me triage, reactive filter, clean functions)
- [x] Run validate_zns.py full audit
- [x] Sync all changes back to Google Drive ZK Nexus Workspace

## Deliverables

| ID | Deliverable | Status |
|----|-------------|--------|
| SYS-003 | `gas-crm-engine.js` — Refactored GAS CRM backend | Done |
| SYS-004–024 | ZNS headers injected into 20 scripts | Done |
| CON-001 | Console-Portal rework (index.html + styles.css + app.js) | Done |
| LOG-PRJ009 | Sync report + validate_zns audit log | Done |

## Notes

- `validate_zns.py` (SYS-002) used as the audit engine
- All `.md` files retain full ZNS frontmatter
- Console-Portal wa.me triage messages written in Malay
- GAS engine uses fixed `/exec` deployment URL from 99_Archive version
