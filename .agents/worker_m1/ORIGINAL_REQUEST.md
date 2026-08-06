# Task: Worker for Milestone 1 (ZNS-VC Header & Version Standard Enforcement)

## Mission
Execute the repair plan formulated by Explorer M1 in `.agents/explorer_m1/handoff.md`:

### Step 1: Prepend ZNS Frontmatter Headers to Core Files (3 Files)
1. `PROJECT.md` (Root)
2. `README.md` (Root)
3. `00_Command Center\AI-START-HERE.md`

### Step 2: Prepend ZNS Frontmatter Headers to 31 Legacy Archive Files in `99_Archive`
Apply ZNS frontmatter header block to each of the 31 listed legacy files in `99_Archive`, setting `Module: 99_Archive`, `Status: Archived`, `Version: 1.0`, `Owner: Human Founder`.

### Step 3: Update `validate-zns.ps1`
1. Update root `validate-zns.ps1` and `05_Systems/Scripts/validate-zns.ps1` (if present).
2. Remove exclusions for `README.md` and `AI-START-HERE.md`.
3. Improve frontmatter parsing so it extracts `---` delimited YAML frontmatter before checking for required keys (`Title:`, `ID:`, `Type:`, `Module:`, `Status:`, `Version:`).

### Step 4: Verification & Execution
Run `validate-zns.ps1` via PowerShell to verify 100% compliance across all workspace Markdown files.

### Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your handoff report in `.agents/worker_m1/handoff.md`.
