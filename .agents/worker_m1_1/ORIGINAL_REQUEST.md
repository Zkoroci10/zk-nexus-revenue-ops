## 2026-07-29T04:22:19Z

You are teamwork_preview_worker for Milestone 1 (ZK-DB-RND) of ZK Revenue Ops R&D Phase.
Working directory: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\worker_m1_1
Project root: C:\Users\Dell\Documents\Projects ZK Nexus

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

TASK OBJECTIVE:
Implement the Database Management Engine & Schema R&D (ZK-DB-RND) in `05_Systems/Database/` according to the Explorer blueprint at `C:\Users\Dell\Documents\Projects ZK Nexus\.agents\explorer_m1_1\analysis.md`.

REQUIREMENTS & FILE SPECIFICATIONS:
1. Create directory `05_Systems/Database/` if it does not exist.
2. Create `05_Systems/Database/db_engine.js`:
   - Use Node.js native `node:sqlite` (`const { DatabaseSync } = require('node:sqlite');`).
   - Create database file `05_Systems/Database/client_leads.db`.
   - Execute `PRAGMA foreign_keys = ON;` on every initialization.
   - Initialize 5 core tables with clean foreign keys:
     * `ren_clients` (ren_id PK, name, email, phone, commission_rate, status, created_at, updated_at)
     * `buyer_prospects` (buyer_id PK, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms, lead_score, status, created_at, updated_at)
     * `property_listings` (listing_id PK, title, location, property_type, price, bedrooms, bathrooms, ren_id FK -> ren_clients, status, created_at, updated_at)
     * `viewing_logs` (viewing_id PK, buyer_id FK -> buyer_prospects, listing_id FK -> property_listings, viewing_date, feedback, rating, status, created_at)
     * `commission_deals` (deal_id PK, listing_id FK -> property_listings, buyer_id FK -> buyer_prospects, ren_id FK -> ren_clients, deal_amount, commission_earned, deal_date, status, created_at)
   - Implement `seedData()` to insert sample data for RENs, Buyers, Listings, Viewings, Deals.
   - Implement `calculateLeadScore(buyer)` (scoring lead criteria 0-100).
   - Implement `matchBuyerCriteria(criteria)` and `matchBuyerToListings(buyerId)` with weighted scoring (Budget 40%, Location 30%, Property Type 20%, Bedrooms 10%).

3. Create `05_Systems/Database/cloud_sync_bridge.js`:
   - Implement `CloudSyncBridge` class supporting asynchronous bi-directional sync (pushLocalToCloud and pullCloudToLocal) for Notion API and Google Sheets API.

4. Create `05_Systems/Database/test_db_engine.js`:
   - Test harness testing 5 verification points:
     * Test 1: Initialization & schema existence
     * Test 2: Foreign Key enforcement (confirming invalid FK throws FOREIGN KEY constraint failed error)
     * Test 3: Seed data population and count audit
     * Test 4: Buyer-property matching engine evaluation
     * Test 5: Bi-directional cloud sync bridge execution
   - Process exits with code 0 on success, code 1 on failure.

5. Execute and verify:
   - Run `node 05_Systems/Database/test_db_engine.js` using `run_command`. Ensure all 5 tests pass!
   - Run `powershell -ExecutionPolicy Bypass -File 05_Systems/Scripts/validate-zns.ps1` to ensure all markdown files in workspace pass ZNS metadata checks.

6. Document your changes and results in `C:\Users\Dell\Documents\Projects ZK Nexus\.agents\worker_m1_1\changes.md` and write your handoff report at `C:\Users\Dell\Documents\Projects ZK Nexus\.agents\worker_m1_1\handoff.md`.
Send a completion message back to the orchestrator once done.
