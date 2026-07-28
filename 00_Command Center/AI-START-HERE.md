# AI START HERE

**If you are an AI (ChatGPT, Claude, Kimi, Codex, or any future agent), read this file first.**

**Do NOT create or modify any file until you have read this completely.**

---

## 1. Who Is ZK Nexus

ZK Nexus is an **AI-Native Collaborative Workspace** built by Zubair Ariff ("Rif" / "Human Founder").

It is not a company operating system, not a holding company, and not an ERP. It is a shared workspace where humans and AI systems collaborate through the same files and folders.

**The folder structure IS the communication protocol.**

The workspace currently operates 3 Business Units:
- **ZK Revenue Ops** — VA SDR services for Real Estate Negotiators (REN)
- **DAE Ecosystem** — Future AI-native product venture
- **Future Ventures** — Placeholder for upcoming businesses

---

## 2. Folder Hierarchy

```
ZK-Nexus/
├── 00_Command Center/     ← YOU ARE HERE. Read this first.
├── 01_Business/           ← Live business operations (ZK Revenue Ops, DAE, Future)
├── 02_Projects/           ← Active work, drafts, AI staging zone
├── 03_Knowledge/          ← Reusable knowledge, SOPs, frameworks
├── 04_Workforce/          ← AI workers, humans, roles, prompts
├── 05_Systems/            ← Live automation, scripts, APIs
├── 06_Resources/          ← Media, logos, assets
├── 07_Templates/          ← Reusable blueprints
├── 08_Logs/               ← Immutable records (append-only)
└── 99_Archive/            ← Inactive items
```

**Max folder depth:** 2 levels below any module root.

---

## 3. Rules Before Creating Files

### 3.1 Read First, Create Second
- Read the **Workspace-Index** (`00_Command Center/Workspace-Index.md`).
- Check if a file on the same topic already exists.
- If an existing file covers 80% of your need, **update it** — do not create a duplicate.

### 3.2 Stage Everything in 02_Projects First
- New operational content must be created in `02_Projects/Active/` or `02_Projects/Internal/` first.
- Do NOT write directly to 01_Business, 03_Knowledge, 05_Systems, 06_Resources, or 07_Templates without staging.
- After human review, the output is distributed to the correct module.

### 3.3 Do Not Modify Active Files Directly
- If a file has `Status: Active`, you may NOT edit it directly.
- Create a new version as `Draft` and stage it in 02_Projects.
- The Human Founder approves the promotion from Draft → Active.

### 3.4 Always Use ZNS Metadata
- Every file you create must include the ZNS metadata header at the top.
- Required fields: Title, ID, Type, Module, BU, Status, Version, Created, Updated, Owner, Related.
- Update the `Updated` field on every edit.

### 3.5 Follow Naming Conventions
- Folders: Title Case with spaces (e.g., `Client Delivery`)
- Files: kebab-case with hyphens (e.g., `Lead-Qualification-SOP.md`)
- IDs: `{PREFIX}-{NNN}` (e.g., `SOP-001`)
- Dates: `YYYY-MM-DD`
- Never use `final`, `final-final`, `updated`, `new`, `old` in file names.

### 3.6 Log Everything Significant
- Append a Change Log entry to every file you modify.
- Log significant actions in `08_Logs/`.
- Never edit or delete a log entry. Append-only.

---

## 4. How to Identify Source of Truth

**The file in the workspace is the ONLY source of truth.**

- Do not rely on memory from previous conversations.
- Do not rely on cached or recalled versions.
- If you worked on a file in a previous session, re-read it before proceeding.
- If there is a conflict between what you remember and what the file says, **the file wins.**

---

## 5. How to Request Permission

Before creating or modifying files, confirm your scope with the Human Founder:

1. State what you intend to do.
2. State where the output will be saved.
3. State which files you will read and which you will write.
4. Wait for approval or guidance.

**Exception:** If the Human Founder has already given explicit instructions for this specific task, proceed with those instructions.

---

## 6. How to Log Changes

### In the modified file:
Append this at the bottom:
```markdown
---
## Change Log
| Date | Actor | Change |
|------|-------|--------|
| 2025-07-16 | AI-XXX | Description of change |
```

### In 08_Logs:
For significant actions (new file creation, major edits, decisions):
```markdown
| 2025-07-16 14:30 | AI-XXX | Action | Brief description |
```

---

## 7. AI Worker Onboarding

If this is your first time in ZK Nexus, follow the full onboarding protocol:

**File:** `04_Workforce/AI-Onboarding-Protocol.md`

**Steps:**
1. Read this file (AI-START-HERE) ← You are here.
2. Read Workspace-Index.
3. Identify your AI Worker profile in AI-Worker-Registry.
4. Read your Role Definition.
5. Read relevant module context for your task.
6. Check for existing files on the same topic.
7. Confirm scope with Human Founder.
8. Execute within scope.
9. Log changes and handover.

---

## 8. Quick Reference

| Need | File to Read |
|------|-------------|
| Workspace map | `00_Command Center/Workspace-Index.md` |
| Assigned IDs | `00_Command Center/ID-Registry.md` |
| My role and scope | `04_Workforce/Role-Definitions.md` |
| How to onboard | `04_Workforce/AI-Onboarding-Protocol.md` |
| Naming rules | `RUL-001 ZK Nexus Standard v1.0` |
| Module contracts | `RUL-002 ZK Nexus Module Standard v1.0` |
| Active projects | `02_Projects/Active-Projects-List.md` |
| Knowledge base | `03_Knowledge/Knowledge-Index.md` |
| Templates | `07_Templates/Template-Index.md` |

---

**Document ID:** RUL-004  
**Status:** Active  
**Version:** 1  
**Created:** 2025-07-16  
**Updated:** 2025-07-16  
**Owner:** Human Founder
