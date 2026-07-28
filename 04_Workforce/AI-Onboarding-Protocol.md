---
Title: ZK Nexus AI Onboarding Protocol
ID: RUL-003
Type: Protocol
Module: 04_Workforce
BU: All
Status: Active
Version: 1
Created: 2025-07-16
Updated: 2025-07-16
Owner: Human Founder
Related: AI-START-HERE, IDX-001, IDX-010
---

# ZK Nexus AI Onboarding Protocol

**Purpose:** Standardized entry procedure for every AI worker (ChatGPT, Claude, Kimi, Codex, or future agents) entering ZK Nexus.

**Rule:** No AI creates or modifies files until this protocol is completed.

---

## Step 1: Read AI-START-HERE

**File:** `00_Command Center/AI-START-HERE.md`

**Action:** Read this file completely. It explains:
- What ZK Nexus is
- The folder hierarchy
- Rules before creating files
- How to identify source of truth
- How to request permission
- How to log changes

**Output:** Confirm to the Human Founder that AI-START-HERE has been read.

---

## Step 2: Read Workspace-Index

**File:** `00_Command Center/Workspace-Index.md`

**Action:** Read the current workspace index to understand:
- Which modules exist
- What folders are inside each module
- Where to navigate for your task

**Output:** State which modules are relevant to your assigned task.

---

## Step 3: Identify Your AI Worker Profile

**File:** `04_Workforce/AI-Worker-Registry.md` and `04_Workforce/Role-Definitions.md`

**Action:**
1. Check the AI Worker Registry to see if your role is already defined.
2. Read your Role Definition to understand your scope and boundaries.
3. If you are a new AI worker not yet registered, ask the Human Founder for assignment.

**Output:** Confirm your AI Worker ID and role.

---

## Step 4: Read Relevant Module Context

**Action:** Based on your task, read the relevant module(s):

| If your task involves... | Read these modules... |
|--------------------------|----------------------|
| Business strategy or client work | 01_Business, 03_Knowledge |
| Active work or projects | 02_Projects, 01_Business |
| Research or documentation | 03_Knowledge, 08_Logs |
| System or automation | 05_Systems, 03_Knowledge |
| Content or marketing | 01_Business, 06_Resources, 07_Templates |
| Operations or planning | 02_Projects, 01_Business, 04_Workforce |

**Output:** List the specific files and folders you have reviewed.

---

## Step 5: Check for Existing Files

**Action:** Before creating ANY new file:
1. Search the relevant module for files on the same topic.
2. Read any existing files that cover the same or similar ground.
3. Decide: (a) update existing, or (b) create new with justification.

**Rule:** If an existing file covers 80% of your need, update it. Do not create duplicates.

**Output:** State your decision and rationale.

---

## Step 6: Confirm Scope with Human Founder

**Action:** Before creating or modifying:
1. State what you intend to do.
2. State where the output will be saved.
3. State which files you will read and which you will write.
4. Wait for Human Founder approval or guidance.

**Exception:** If the Human Founder has already given explicit instructions for this specific task, proceed with those instructions.

---

## Step 7: Execute Within Scope

**Action:** Once approved:
1. Create/modify files in the correct location.
2. Follow ZNS naming conventions (RUL-001, Section 1).
3. Include ZNS metadata header on every file (RUL-001, Section 3).
4. Update the `Updated` field on every edit.
5. Append a Change Log entry at the bottom of modified files.
6. Log significant actions in `08_Logs/`.

**Critical Rules:**
- Write new operational content to 02_Projects first (staging).
- Do NOT write directly to 01_Business, 03_Knowledge, 05_Systems, 06_Resources, or 07_Templates without staging.
- Do NOT modify Active-status files directly. Create a new version as Draft.
- Do NOT delete or edit log entries in 08_Logs. Append only.

---

## Step 8: Handover or Complete

**Action:** When your task is complete:
1. Update any relevant index files (Workspace-Index, Knowledge-Index, etc.).
2. If handing over to another AI worker, write a Handover Note (ZNS-AI, Section 6.5).
3. If the output is ready for human review, move to Review status and notify the Human Founder.
4. Log task completion in the Assignment Log.

---

## Onboarding Checklist

- [ ] Read AI-START-HERE
- [ ] Read Workspace-Index
- [ ] Identify AI Worker profile
- [ ] Read relevant module context
- [ ] Check for existing files
- [ ] Confirm scope with Human Founder
- [ ] Execute within scope
- [ ] Complete handover or notify Human Founder

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2025-07-16 | Human Founder | Created AI Onboarding Protocol |
