# Task: Worker for Milestone 3 (Structural Consolidation & Duplicate Resolution)

## Mission
Execute the asset migration and link update plan formulated by Explorer M3 in `.agents/explorer_m3/handoff.md`:

### Phase 1: Move Assets & Directory Cleanup
1. Move all 21 files from `06_Assets/Banners/` to `06_Resources/Assets/Banners/`.
2. Move all 3 files from `06_Assets/Dashboard/` to `06_Resources/Assets/Dashboard/`.
3. Delete the leftover empty directory `06_Assets/`.

### Phase 2: Update Code & Relative Require Paths
1. `06_Resources/Assets/Dashboard/server.js` (update doc header, relative require to `../../../05_Systems/Database/db_engine.js`, fallback path to `../../../06_Resources/Assets/Dashboard`).
2. `06_Resources/Assets/Dashboard/test_dashboard_server.js` (update doc header).
3. `05_Systems/Databases/zk_db_engine.js` (update path to `06_Resources/Assets/Dashboard/client-dashboard.html`).
4. `05_Systems/Scripts/generate_16_9_landscape_banner.js` (update path to `06_Resources/Assets/Banners`).
5. `05_Systems/Scripts/generate_minimalist_cards.js` (update path to `06_Resources/Assets/Banners`).
6. `.agents/auditor_m1/verify_banners.js` (update path to `06_Resources/Assets/Banners`).

### Phase 3: Update Markdown References
Update hardcoded `06_Assets` links in:
1. `01_Business/ZK-Revenue-Ops/Operations/PRE_LAUNCH_CHECKLIST_AND_EXECUTION_ROADMAP.md`
2. `01_Business/ZK-Revenue-Ops/Operations/WHATSAPP_BUSINESS_STRUCTURED_MASTER_KIT.md`
3. `01_Business/ZK-Revenue-Ops/Reports/ZK_NEXUS_EMPIRE_REVOPS_MASTER_REPORT.md`

### Phase 4: Asset Catalog Update
Update `06_Resources/Asset-Catalog.md` table to index all 24 transferred assets.

### Phase 5: Verification & Execution
Run `node 06_Resources/Assets/Dashboard/test_dashboard_server.js`, `node .agents/auditor_m1/verify_banners.js`, and `validate-zns.ps1` to verify 100% functionality and compliance.

### Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your handoff report in `.agents/worker_m3/handoff.md`.
