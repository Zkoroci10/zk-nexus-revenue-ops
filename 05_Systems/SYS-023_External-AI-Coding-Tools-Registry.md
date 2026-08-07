---
Title: External AI Coding Tools Registry
ID: SYS-023
Type: Systems Registry
Module: 05_Systems
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 2.0
Created: 2026-08-07
Updated: 2026-08-07
Owner: Zubair (zubairisa10@gmail.com)
Related: SYS-001, IDX-012
---

# 🤖 External AI Coding Tools & Skills Integration Matrix

> **SYS-023 | Integrasi 5 Agent Repositories + 2 Master Skill Engines (Matt Pocock & Ponytail)**

---

## 🎯 Summary Overview

Semua **5 repositori AI coding agent** dan **2 master skill frameworks** (Matt Pocock Skills & Ponytail YAGNI Engine) telah berjaya di-clone, di-setup, dan di-integrasi ke dalam `.agents/skills/` dan controller `05_Systems/Scripts/agent-control.ps1`.

| No | Tool / Skill | Repository / Author | Local Path | Dedicated Role in ZK-Nexus | Status |
|---|---|---|---|---|---|
| 1 | **OpenCODE** | `anomalyco/opencode` | `05_Systems/External-Repos/opencode` | Terminal TUI agent (Build/Plan dual mode) | 🟢 ACTIVE |
| 2 | **Kilo Code** | `Kilo-Org/kilocode` | `05_Systems/External-Repos/kilocode` | Multi-model agentic workspace (reads `AGENTS.md`) | 🟢 ACTIVE |
| 3 | **Pi** | `earendil-works/pi` | `05_Systems/External-Repos/pi` | Minimalist TS terminal agent & extension harness | 🟢 ACTIVE |
| 4 | **OH MY PI** | `can1357/oh-my-pi` | `05_Systems/External-Repos/oh-my-pi` | Rust/TS high-speed AST analysis, LSP & Debugger | 🟢 ACTIVE |
| 5 | **Cline** | `cline/cline` | `05_Systems/External-Repos/cline` | Autonomous IDE/CLI agent with MCP support | 🟢 ACTIVE |
| 6 | **Matt Pocock Skills** | `mattpocock/skills` | `.agents/skills/` (18 skills) | Workflow spec-driven engineering pipeline (`/grill-me`, `/to-spec`, `/implement`) | 🟢 INTEGRATED |
| 7 | **Ponytail Skill** | `DietrichGebert/ponytail` | `.agents/skills/ponytail` (6 skills) | Senior Dev YAGNI anti-bloat guardrail engine (80% code reduction) | 🟢 INTEGRATED |

---

## 📂 Architecture & Integration Blueprint

```
ZK-Nexus Root/
├── AGENTS.md                            — Global Directive (contains Ponytail YAGNI & Matt Pocock pipelines)
├── .agents/skills/                      — 29 Installed Skills (including Ponytail & Matt Pocock skills)
│   ├── ponytail/                        — Ponytail YAGNI Senior Dev Guardrail
│   ├── ponytail-audit/                  — Anti-bloat audit tool
│   ├── ponytail-review/                 — Code diff bloat review
│   ├── grill-with-docs/                 — Matt Pocock interactive plan interviewer
│   ├── to-spec/                         — Spec generator
│   ├── to-tickets/                      — Micro-task breakdown
│   ├── implement/                       — TDD builder
│   └── wayfinder/                       — Codebase navigator
└── 05_Systems/
    ├── External-Repos/                  — All 7 Cloned External Toolsets
    │   ├── opencode/
    │   ├── kilocode/
    │   ├── pi/
    │   ├── oh-my-pi/
    │   ├── cline/
    │   ├── mattpocock-skills/
    │   └── ponytail/
    └── Scripts/
        └── agent-control.ps1            — 1-Click Unified PowerShell Controller
```

---

## ⚡ How The System Operates (Functional Workflow)

1. **Guardrail Enforced (Ponytail YAGNI)**:
   Setiap ejen (AGY, OpenCODE, Kilo Code, Pi, OMP, Cline) membaca directive `AGENTS.md` ➔ Wajib memanjat **Ladder of Laziness** sebelum menulis sebarang kod untuk mengelakkan *over-engineering* (menjimatkan kos token API & mengelakkan bloat).

2. **Pipeline Kejuruteraan (Matt Pocock)**:
   - Panaskan idea/reka bentuk dengan `/grill-with-docs`
   - Tukar perbincangan kepada spesifikasi teknikal ZNS dengan `/to-spec`
   - Pecahkan spesifikasi kepada micro-ticket dengan `/to-tickets`
   - Laksanakan binaan berasaskan TDD dengan `/implement`

3. **1-Click Controller (`agent-control.ps1`)**:
   ```powershell
   # Semak status ejen & kemahiran
   powershell -File "05_Systems/Scripts/agent-control.ps1" -Action status

   # Jalankan OpenCODE Terminal TUI
   powershell -File "05_Systems/Scripts/agent-control.ps1" -Action opencode

   # Jalankan Audit Anti-Bloat Ponytail
   powershell -File "05_Systems/Scripts/agent-control.ps1" -Action ponytail-audit
   ```
