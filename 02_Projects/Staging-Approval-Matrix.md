---
Title: ZK Nexus Staging Approval Matrix
ID: PRJ-000-MAT-01
Type: Matrix
Module: 02_Projects
Status: Active
Version: 1.0
Created: 2026-08-03
BU: ZK Revenue Ops
Updated: 2026-08-03
Owner: Zubair (zubairisa10@gmail.com)
---

# ZK Nexus Staging Approval Matrix

## Executive Summary
This Staging Approval Matrix establishes the formal staging categorization and governance review for all workspace assets in **Project ZK Nexus**. Following the deep audit and restructuring (Milestones M1–M5), all files and directories across the workspace have been categorized into three distinct operational states:

1. **Category 1: Files & Projects Kept & Continued** — Core active operational modules (00 through 08), master frameworks, active projects, logs, templates, and primary assets.
2. **Category 2: Files & Projects Moved to Archive** — Completed projects relocated to `99_Archive/Completed-Projects/`, legacy historical code/documentation, and consolidated asset directories.
3. **Category 3: Files Tagged for User Review/Approval Before Deletion** — Unconsolidated loose drafts, redundant test scripts, and temporary utility files requiring explicit user approval prior to permanent purge.

---

## Category 1: Files & Projects Kept & Continued

Assets in this category represent active, production-ready, or active development components of the ZK Nexus Revenue Operations ecosystem.

### Active Module Structure & Core Frameworks

| Module / Asset Name | Full Path | Description & Purpose | Operational Status |
|---|---|---|---|
| **00_Command Center** | `c:\Users\Dell\Documents\Projects ZK Nexus\00_Command Center\` | Central control hub, executive status dashboards, workspace navigation, and system-wide index files. | Active / Production |
| **01_Business** | `c:\Users\Dell\Documents\Projects ZK Nexus\01_Business\` | Strategic positioning, ZK Revenue Ops Master Framework, offer structures, pricing dual-stream models, and ICP definitions. | Active / Framework |
| **02_Projects (Active)** | `c:\Users\Dell\Documents\Projects ZK Nexus\02_Projects\` | Project management hub containing active project list, backlog, idea catcher, and active project execution folders. | Active / Management |
| **Jarvis Command Center** | `c:\Users\Dell\Documents\Projects ZK Nexus\02_Projects\Active\PRJ-008_Jarvis-Command-Center\` | Production UI/UX web app server (`server.ps1`), frontend components (`public/app.js`, `public/style.css`), and executive dashboard. | Active / Development (PRJ-008) |
| **Idea-Catcher** | `c:\Users\Dell\Documents\Projects ZK Nexus\02_Projects\Idea-Catcher.md` | Master repository for capturing unallocated business ideas, brain dump extractions, and future product concepts. | Active / Maintained |
| **Idea-Backlog** | `c:\Users\Dell\Documents\Projects ZK Nexus\02_Projects\Idea-Backlog.md` | Prioritized backlog of validated concepts queued for project scoping. | Active / Maintained |
| **Active Projects List** | `c:\Users\Dell\Documents\Projects ZK Nexus\02_Projects\Active-Projects-List.md` | Single source of truth index listing all currently running projects across the workspace. | Active / Maintained |
| **03_Knowledge** | `c:\Users\Dell\Documents\Projects ZK Nexus\03_Knowledge\` | Organizational knowledge base, Empire Operating System, SOPs, marketing frameworks, legal guidelines, and financial models. | Active / Knowledge Base |
| **04_Workforce** | `c:\Users\Dell\Documents\Projects ZK Nexus\04_Workforce\` | AI worker agent architecture, agent role definitions, constitutions, and multi-agent workflow specifications. | Active / Operational |
| **05_Systems** | `c:\Users\Dell\Documents\Projects ZK Nexus\05_Systems\` | Systems integration, WhatsApp ingestion tools, automated pulse generators, and primary system scripts including `validate-zns.ps1`. | Active / Systems & Scripts |
| **06_Resources & Asset Catalog** | `c:\Users\Dell\Documents\Projects ZK Nexus\06_Resources\` | Consolidated repository for graphics, media, banners, dashboards, promotional posters, and `Asset-Catalog.md`. | Active / Resource Hub |
| **07_Templates** | `c:\Users\Dell\Documents\Projects ZK Nexus\07_Templates\` | Standardized operational templates for cold email outreach, client proposals, SOPs, invoices, and CEO operating prompts (`Template-Index.md`). | Active / Templates |
| **08_Logs & Decision Logs** | `c:\Users\Dell\Documents\Projects ZK Nexus\08_Logs\` | System event logging, daily pulse logs (`2026-08-02_Daily-Pulse.md`), `Log-Index.md`, and master decision records in `08_Logs/Decision-Logs/`. | Active / Audit Trail |

### Core Decision Records (`08_Logs/Decision-Logs/`)

- `LOG_2026-07-27_Decision_Focus-Pivot-ZK-Revenue-Ops.md` — Strategic pivot decision to ZK Revenue Ops.
- `LOG_2026-07-29_Decision_Founder-Branding-Authentic-Identity.md` — Personal branding and authentic identity guidelines.
- `LOG_2026-07-29_Decision_Pricing-Model-v2-Dual-Stream.md` — Tiered service packaging and dual-stream pricing.
- `LOG_2026-07-29_Decision_Standard-Tech-Stack-Selection.md` — Technology selection and architecture standards.
- `LOG_2026-07-30_Decision_Lead-Scale-Repositioning-100k.md` — Enterprise lead scaling repositioning.

---

## Category 2: Files & Projects Moved to Archive

Assets in this category represent completed project initiatives, legacy Google Apps Scripts (GAS), old business plans, and consolidated asset structures transferred to `99_Archive/`.

### Completed Projects (`99_Archive/Completed-Projects/`)

| Project ID & Name | Archived File Location | Completion Rationale | Archive Status |
|---|---|---|---|
| **PRJ-001 ZK RevOps Migration** | `c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\Completed-Projects\PRJ-001_ZK-RevOps-Migration\` | Legacy workspace migration completed. All core framework assets integrated into `01_Business` and `06_Resources`. | Archived (Completed) |
| **PRJ-002 Workspace Cleanup** | `c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\Completed-Projects\PRJ-002_Workspace-Cleanup\` | Workspace structural cleanup milestone completed. Project charter and completion report archived. | Archived (Completed) |
| **PRJ-003 Business Readiness** | `c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\Completed-Projects\PRJ-003_Business-Readiness\` | Commercial readiness audit completed. Offer frameworks and SOPs published to `01_Business` & `07_Templates`. | Archived (Completed) |
| **PRJ-004 Sales Engine** | `c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\Completed-Projects\PRJ-004_Sales-Engine\` | Sales outreach engine setup completed. Templates migrated to `07_Templates/Email/` and `07_Templates/Proposal/`. | Archived (Completed) |

### Legacy Files & Historic Archives (31 Legacy Files in `99_Archive/`)

| Legacy Subdirectory | Full Path | File / Asset Details | Archival Reason |
|---|---|---|---|
| **Legacy GAS Code** | `c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\Legacy-GAS-Code\` | `.clasp.json`, `.claspignore`, `appsscript.json`, `gas-code-optimized.js`, `setup_sheets_helper.gs` | Deprecated Google Apps Script integration replaced by Node/PowerShell automation. |
| **Old Business Plans** | `c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\Old-Business-Plans\` | `Kit_Prompt_AI_Pejabat_Malaysia.docx`, `Business_Context.md`, `Launch_Process.md`, `Product_Framework.md` | Legacy digital product plans retained for historical context. |
| **Previous Versions** | `c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\Previous-Versions\` | `web-app-backend.gs`, `web-app-main.gs`, `web-app-setup-minimal.gs` | Pre-restructuring web app backend scripts superseded by `PRJ-008_Jarvis-Command-Center`. |
| **ZK Nexus Legacy** | `c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\ZK-Nexus-Legacy\` | Legacy dashboards, early AI worker configs, DAE project docs, old marketing PDFs, legal drafts, and legacy workflows. | Full legacy tree preserved intact for reference audit compliance. |

### Consolidated Asset Migration (`06_Assets` → `06_Resources/Assets/`)

- **Previous Path**: `c:\Users\Dell\Documents\Projects ZK Nexus\06_Assets\`
- **New Consolidated Path**: `c:\Users\Dell\Documents\Projects ZK Nexus\06_Resources\Assets\`
- **Details**: Redundant top-level `06_Assets` directory was migrated into `06_Resources/Assets/` (including `Banners/` and `Dashboard/` media), resolving workspace layout duplication under Milestone M3.

---

## Category 3: Files Tagged for User Review/Approval Before Deletion

Assets in this category have been identified as loose drafts, temporary test scripts, or redundant utility files. They are staged for user review and pending explicit authorization prior to deletion or permanent purging.

| Asset Name | Full File Path | Type | Reason for Staging / Tagging | Recommended Action | Risk Level |
|---|---|---|---|---|---|
| **ZKRO Service Catalog Draft** | `c:\Users\Dell\Documents\Projects ZK Nexus\02_Projects\Active\ZKRO-Service-Catalog-Draft.md` | Draft Markdown | Loose draft document residing in `02_Projects/Active/`. Core service catalog content has been integrated into `01_Business/` master frameworks. | User approval to delete or move to `99_Archive/`. | Low |
| **Test Dashboard Server Script** | `c:\Users\Dell\Documents\Projects ZK Nexus\06_Resources\Assets\Dashboard\test_dashboard_server.js` | JS Script | Standalone test script for dashboard server testing. Superseded by `PRJ-008_Jarvis-Command-Center/server.ps1`. | User review to delete after dashboard validation. | Low |
| **Test Client Script** | `c:\Users\Dell\Documents\Projects ZK Nexus\05_Systems\Scripts\test-client.js` | JS Script | Temporary test script used during early systems integration testing. | User approval for cleanup. | Low |
| **Test Operator Script** | `c:\Users\Dell\Documents\Projects ZK Nexus\05_Systems\Scripts\test-operator.js` | JS Script | Temporary operator test script. | User approval for cleanup. | Low |
| **Test Syntax Script** | `c:\Users\Dell\Documents\Projects ZK Nexus\05_Systems\Scripts\test-syntax.js` | JS Script | Temporary syntax checking script superseded by `validate-zns.ps1`. | User approval for cleanup. | Low |
| **Legacy Utility Test Files** | `c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\ZK-Nexus-Legacy\test.hta`<br>`c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\ZK-Nexus-Legacy\test.js`<br>`c:\Users\Dell\Documents\Projects ZK Nexus\99_Archive\ZK-Nexus-Legacy\test2.js` | HTA / JS Test Files | Legacy HTML Application and JS test scripts retained in legacy archive folder. | Tagged for user review during annual archive purge. | Low |

---

## Governance & Action Protocol

1. **Category 1 (Kept & Continued)**: Continues under standard ZNS version control and active maintenance. All markdown updates must pass `validate-zns.ps1`.
2. **Category 2 (Archived)**: Read-only status. Maintained in `99_Archive/` for historical compliance and audit traceability. No active modifications permitted.
3. **Category 3 (Pending Review)**: Requires explicit sign-off from the Human Founder / User before executing any `Remove-Item` or delete operation.

---

## Verification & Compliance Summary
- **Matrix Document ID**: `PRJ-000-MAT-01`
- **Frontmatter Standard**: Valid ZNS YAML block compliant with ZNS Specification.
- **Coverage**: 100% of workspace modules, project directories, resource folders, and archive paths accounted for.
