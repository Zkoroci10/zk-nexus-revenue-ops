---
Title: ZK-Nexus Master Briefing — Antigravity Auto-Load
ID: RUL-003
Type: Rules
Module: 00_Command Center
BU: All
Status: Active
Version: 1.0
Created: 2026-08-06
Updated: 2026-08-06
Owner: Zubair (zubairisa10@gmail.com)
---

# 🤖 Antigravity Master Briefing — ZK-Nexus

> This file is auto-read at the start of EVERY conversation. Do NOT skip it.
> Last updated: 2026-08-06

---

## 1. WHO IS THE USER

**Name:** Zubair
**Email:** zubairisa10@gmail.com
**Role:** Founder, ZK Revenue Ops
**Territory:** Subang & Shah Alam, Malaysia
**Language:** Malay + English (wa.me outreach messages MUST be in Malay)

---

## 2. WHAT IS ZK-NEXUS

ZK-Nexus is Zubair's personal operating system — a structured local workspace
for running ZK Revenue Ops, a real estate lead generation and triage business
in Malaysia. Every file, script, and tool is organised under this workspace.

**Local Path:** `C:\Users\Dell\Documents\Projects ZK Nexus`
**Google Drive:** `ZK Nexus Workspace` (remote: `zknexus-gdrive`, account: zubairisa10@gmail.com)
### 2.1 CRITICAL DISTINCTION: ZK-NEXUS VS ZK REVENUE OPS (NEVER CONFUSE THESE)
- 🌐 **ZK-Nexus**: Zubair's **AI Workspace & Operating System Product** — an "Executive Vice President / E-Coworker" workspace designed to be duplicated & pushed to GitHub Public for any founder to build & run their business.
- 🏢 **ZK Revenue Ops**: Zubair's **Active Real Estate Lead Generation & Triage Business** in Subang & Shah Alam, operating as a business unit inside ZK-Nexus.

### 2.2 NEURODIVERGENT VISUAL MICRO-STEP WORKFLOW DIRECTIVE
- 🧠 **Target Audience**: Zubair (MDD, ADHD, OCD, Autism spectrum efficiency).
- ⚡ **Rule**: NEVER output thick walls of text. Always use:
  1. Concise 1-2 line direct summary.
  2. 3 Micro-Steps (< 2-minute actionable steps).
  3. Visual Status Badges (`🟢 READY`, `⏳ IN PROGRESS`, `⚡ 1-CLICK`), tables, and Playwright screenshots.

**Sync Command:** `rclone copy "C:\Users\Dell\Documents\Projects ZK Nexus" "zknexus-gdrive:ZK Nexus Workspace" --exclude ".git/**" --exclude ".agents/**" --progress`

### Folder Structure
```
00_Command Center/   — Index, registry, health reports
01_Business/         — ZK Revenue Ops business docs
02_Projects/Active/  — Active project files
03_Knowledge/        — SOPs, finance, legal, marketing, sales
04_Workforce/        — AI roles, rules, constitution
05_Systems/Scripts/  — All scripts and tools
05_Systems/Console-Portal/ — CRM web app (index.html, styles.css, app.js)
06_Resources/        — Assets, attachments
07_Templates/        — Prompt templates
08_Logs/             — Daily pulse, AI logs, decision logs
99_Archive/          — Legacy files
```

---

## 3. ZNS RULES (MANDATORY — NEVER BREAK THESE)

### 3.1 Naming Conventions
- ✅ Use **kebab-case** for all filenames
- ❌ FORBIDDEN terms in filenames: `v2`, `v3`, `final`, `new`, `old`, `updated`, `latest`, `draft`, `optimized`
- ✅ Prefix format: `PRJ-009_Title-In-Kebab-Case.md`

### 3.2 ZNS Frontmatter (MANDATORY on every file)
Every `.md` file MUST have this YAML header:
```yaml
---
Title: [Title]
ID: [PREFIX-NNN]
Type: [Document type]
Module: [Module folder e.g. 05_Systems]
BU: [Business unit e.g. ZK Revenue Ops]
Status: [Draft | Review | Active | Archived | Completed | In Development]
Version: 1.0
Created: YYYY-MM-DD
Updated: YYYY-MM-DD
Owner: Zubair (zubairisa10@gmail.com)
Related: [comma-separated related IDs]
---
```

Scripts use comment-block headers (PowerShell `<# ... #>`, JS `/** ... */`).

### 3.3 Valid ID Prefixes
`RUL, IDX, AI, BUS, TMP, PRJ, KNB, SOP, SYS, WFR, RES, LOG, SEAT, LEAD, ZK-FND, ZK-GOV, ZK-STR, ZK-PS, ZK-SEAT, DSR, CAT`

### 3.4 Audit Tool
```powershell
python "C:\Users\Dell\Documents\Projects ZK Nexus\05_Systems\Scripts\validate_zns.py" --workspace-root "C:\Users\Dell\Documents\Projects ZK Nexus"
```

---

## 4. ACTIVE PROJECTS

| ID | Project | Status | Key Files |
|----|---------|--------|-----------|
| PRJ-008 | Jarvis Command Center | Active | `02_Projects/Active/PRJ-008_Jarvis-Command-Center/` |
| PRJ-009 | Tools & CRM Standardization | Completed | `02_Projects/Active/PRJ-009_Tools-and-CRM-Standardization.md` |
| PRJ-998 | Idea Catcher Vault | Active | `08_Logs/` |

---

## 5. KEY SYSTEMS & TOOLS

| ID | File | Purpose |
|----|------|---------|
| SYS-002 | `05_Systems/Scripts/validate_zns.py` | Full Python ZNS auditor |
| SYS-003 | `05_Systems/Scripts/gas-crm-engine.js` | Google Apps Script CRM backend |
| SYS-022 | `05_Systems/Scripts/validate-zns.ps1` | PowerShell ZNS auditor |
| CON-001 | `05_Systems/Console-Portal/public/` | CRM web app (HTML/CSS/JS) |

---

## 6. MCP STACK (Active as of 2026-08-06)

| MCP | Purpose |
|-----|---------|
| `memory` | Persistent knowledge graph across conversations |
| `playwright` | Full browser automation (replaces puppeteer) |
| `filesystem` | Direct ZK-Nexus file read/write |
| `obsidian` | Vault-level search across all 456 notes |
| `github` | GitHub repo management |
| `notion` | Notion workspace (Notion API key active) |
| `git` | Version control |
| `context7` | Library/framework documentation lookup |
| `sequential-thinking` | Complex multi-step reasoning |
| `reddit` | Reddit browsing |
| `resend` | Email sending (needs RESEND_API_KEY) |
| `everything` | Universal search |

**Removed:** puppeteer (replaced by playwright), chrome-devtools-mcp (removed)

---

## 7. STANDING INSTRUCTIONS

### 7.1 Always Do
- ✅ Inject ZNS frontmatter on every new file created
- ✅ Use kebab-case filenames
- ✅ Sync to Google Drive after completing major tasks
- ✅ Write wa.me WhatsApp messages in **Malay**
- ✅ Assign sequential IDs from the correct prefix series
- ✅ Update `08_Logs/` with significant actions

### 7.2 Never Do
- ❌ Use forbidden filename terms (v2, final, new, old, etc.)
- ❌ Skip ZNS frontmatter
- ❌ Create files outside the ZK-Nexus folder structure without good reason
- ❌ Use puppeteer (use playwright MCP instead)

### 7.3 Zubair's Workflow Preferences
- Confirmation NOT needed for routine file operations, header injection, syncs
- Confirmation REQUIRED before: uninstalling tools, deleting files permanently, modifying MCP config tokens/keys
- Zubair speaks Malay + English — respond in whichever language he uses
- He prefers concise responses with tables and bullets, not long paragraphs
- He trusts agent judgment — "your call" means execute, don't ask again

---

## 8. KNOWN OPEN ISSUES (as of 2026-08-06)

| Issue | Severity | Notes |
|-------|----------|-------|
| ZNS audit: 87 errors | Medium | Mostly ID Registry (OID-004) — IDs not in `00_Command Center/ID-Registry.md` |
| `chrome-devtools-mcp` in config | Low | Should be removed (playwright replaces it) |
| Computer Use setup | Pending | User wants mouse/keyboard/screen control |
| Orgo Cloud + Agent Mail | Backlog | Deferred — assess later |

---

## 9. GOOGLE DRIVE SYNC

- Remote name: `zknexus-gdrive`
- Target: `ZK Nexus Workspace`
- Files synced: 456+ files, 605+ MB
- Last sync: 2026-08-05 (post PRJ-009)
- Gemini Spark (Google Workspace AI) has read access to all synced files

---

## 10. AGENT MANAGER PROTOCOL

When spawning subagents, follow `.agents/skills/antigravity-agent-manager/SKILL.md`:
- Create `.agents/<agent_id>/BRIEFING.md` for each subagent
- Heartbeat updates in `progress.md` every 5 minutes
- Use 5-Component Handoff format for all task transfers
