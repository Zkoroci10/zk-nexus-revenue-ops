## 2026-07-28T04:13:33Z

Task: Resolve the Object ID collision on TMP-004 identified by reviewer_m3_gen3 and auditor_m3_gen3.

Here are the step-by-step instructions:

1. Move & Rename File:
   - Move/rename `C:\Users\Dell\Documents\Projects ZK Nexus\07_Templates\Database\TMP-004-Client-Lead-Database.md` to `C:\Users\Dell\Documents\Projects ZK Nexus\07_Templates\Spreadsheet\TMP-005_Client-Lead-Database.md`.
   - Ensure the directory `07_Templates/Spreadsheet/` is used. Delete the empty `07_Templates/Database/` directory if left empty.

2. Update Frontmatter & Content in `07_Templates/Spreadsheet/TMP-005_Client-Lead-Database.md`:
   - Line 3: Update `ID: TMP-004` -> `ID: TMP-005`.
   - Line 5: Update `Module: 07_Templates / Database` -> `Module: 07_Templates / Spreadsheet`.
   - Update any header/title or internal text referencing `TMP-004` to `TMP-005`.

3. Update `C:\Users\Dell\Documents\Projects ZK Nexus\00_Command Center\ID-Registry.md`:
   - Under `### TMP — Templates` section: keep `TMP-003` (Prompt Template) and `TMP-004` (SOP Template: Lead Qualification & DSR Audit Checklist).
   - Add entry for `TMP-005`: `| TMP-005 | Spreadsheet Template | Client Lead Database Template (CSV / Sheet Format) | Active | 07_Templates |`.
   - Update `Next Available IDs` table: set Next Available ID for `TMP` to `TMP-006`.
   - Add entry to Change Log table recording TMP-005 registration.

4. Update `C:\Users\Dell\Documents\Projects ZK Nexus\07_Templates\Template-Index.md`:
   - Register `TMP-005` under `### Spreadsheet` table (`| TMP-005 | Client Lead Database Template | Active | Spreadsheet/TMP-005_Client-Lead-Database.md |`).
   - Record change in Change Log table.

Verification:
- Run a check across all files in `07_Templates/` to confirm that no two files share the same Object ID, `TMP-004` belongs solely to `TMP-004_Lead-Qualification-Checklist.md`, and `TMP-005` belongs solely to `TMP-005_Client-Lead-Database.md`.
