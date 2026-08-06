# Task: Worker for Milestone 2 (Project Lifecycle Cleanup & Archiving)

## Mission
Execute the archiving and reference repair plan formulated by Explorer M2 in `.agents/explorer_m2/handoff.md`:

### Step 1: Directory Movement
Safely move completed project directories from `02_Projects/Active/` to `99_Archive/Completed-Projects/`:
- `02_Projects/Active/PRJ-002_Workspace-Cleanup/` -> `99_Archive/Completed-Projects/PRJ-002_Workspace-Cleanup/`
- `02_Projects/Active/PRJ-003_Business-Readiness/` -> `99_Archive/Completed-Projects/PRJ-003_Business-Readiness/`
- `02_Projects/Active/PRJ-004_Sales-Engine/` -> `99_Archive/Completed-Projects/PRJ-004_Sales-Engine/`

Keep in `02_Projects/Active/`:
- `PRJ-008_Jarvis-Command-Center/`
- `ZKRO-Service-Catalog-Draft.md`

### Step 2: Registries & Master Lists Update
1. Update `02_Projects/Active-Projects-List.md` (Archive Location column for PRJ-002, PRJ-003, PRJ-004).
2. Populate `99_Archive/Archive-Index.md` with PRJ-001 through PRJ-004 records.
3. Update `00_Command Center/ID-Registry.md` (PRJ-004 status to Completed).

### Step 3: Frontmatter & Link Target Repairs
Update ZNS frontmatter (`Module: 99_Archive`, `Status: Completed`) and file path links in:
- `99_Archive/Completed-Projects/PRJ-002_Workspace-Cleanup/project-charter.md`
- `99_Archive/Completed-Projects/PRJ-002_Workspace-Cleanup/project-report.md`
- `99_Archive/Completed-Projects/PRJ-003_Business-Readiness/project-charter.md`
- `99_Archive/Completed-Projects/PRJ-003_Business-Readiness/project-report.md`
- `99_Archive/Completed-Projects/PRJ-004_Sales-Engine/project-report.md`

### Step 4: Verification
Run `validate-zns.ps1` to ensure all modified files pass ZNS validation.

### Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your handoff report in `.agents/worker_m2/handoff.md`.
