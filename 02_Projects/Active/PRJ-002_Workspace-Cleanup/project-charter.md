---
Title: Project Charter — PRJ-002 Workspace Cleanup
ID: PRJ-002
Type: Project Charter
Module: 02_Projects
BU: All
Status: Active
Version: 1
Created: 2026-07-18
Updated: 2026-07-18
Owner: Human Founder
Related: PRJ-001, IDX-001
---

# Project Charter — PRJ-002 Workspace Cleanup

---

## 1. Project Metadata
* **Project ID:** PRJ-002
* **Project Name:** Workspace Cleanup
* **Objective:** Clean up the legacy workspace directories, eliminate duplicated files/folders, remove the accidental Git configuration in the user's home folder, and deploy a custom validation script to verify cross-file references.
* **Owner:** AI-002 ZK Operator
* **Sponsor:** Human Founder

---

## 2. Background & Rationale
After successfully migrating the ZK Revenue Ops assets (PRJ-001) to the new ZNS directory layout, the workspace contains both the new layout and the legacy `ZK Nexus` folder. This duplication confuses AI tools and human collaborators. Furthermore, an accidental Git repository in the user's home directory (`C:\Users\Dell\.git`) causes performance issues and security warnings. 

Cleaning these legacy files and setting up a workspace link-validation system is high ROI to guarantee the integrity of the workspace.

---

## 3. Scope of Work

### In Scope:
1. **Archive Legacy Workspace:** Move `c:\Users\Dell\Documents\Projects ZK Nexus\ZK Nexus` to `c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\ZK-Nexus-Legacy`.
2. **accidental Git Folder Cleanup:** Rename or remove `C:\Users\Dell\.git` to terminate tracking of personal OS files.
3. **Workspace Validation System:** Design and write `05_Systems/Scripts/workspace-validator.ps1` to programmatically verify markdown links, registries, and file existence.
4. **Correction of References:** Scan and fix any broken relative markdown links pointing to legacy folders, pointing them instead to active ZNS paths.

### Out of Scope:
- Initializing a new Git repository at the root of `Projects ZK Nexus` (postponed/refused by Founder).
- Uploading or pushing files to any GitHub account.
- Redesigning any business documents or rewriting content.

---

## 4. Deliverables
- **Legacy Archive:** [ZK-Nexus-Legacy](file:///c:/Users/Dell/Documents/Projects%20ZK%20Nexus/99_Archive/ZK-Nexus-Legacy/)
- **Validation Script:** [workspace-validator.ps1](file:///c:/Users/Dell/Documents/Projects%20ZK%20Nexus/05_Systems/Scripts/workspace-validator.ps1)
- **Project Report:** [migration-summary.md](file:///c:/Users/Dell/Documents/Projects%20ZK%20Nexus/02_Projects/Active/PRJ-002_Workspace-Cleanup/project-report.md)

---

## 5. Change Log
| Date | Actor | Change |
|------|-------|--------|
| 2026-07-18 | AI-002 | Created Project Charter for PRJ-002 |
