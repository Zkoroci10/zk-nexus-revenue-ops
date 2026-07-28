---
Title: ZK-DASH Milestone 3 Technical Blueprint & Custom Tailored Client Dashboard UI
ID: SYS-005
Type: Technical Blueprint & Analysis
Module: 06_Assets/Dashboard
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0
Created: 2026-07-29
Updated: 2026-07-29
Owner: Explorer m3_1
Related: SYS-003, SYS-004, RUL-001
---

# ZK-DASH Milestone 3: Custom Tailored Client Dashboard UI Technical Blueprint & Asset Audit

## 1. Executive Summary & Architectural Vision

The **Custom Tailored Client Dashboard UI (ZK-DASH / SYS-005)** serves as the primary visual command center for the ZK Revenue Ops R&D Phase. Operating directly above the local SQLite Database Engine (`SYS-003`) and the Multi-Channel Lead Ingestion Engine (`SYS-004`), ZK-DASH presents real-time intelligence for Real Estate Negotiators (RENs), buyer pipeline status, listing matches, and financial performance metrics.

### Key Architectural Objectives:
1. **Zero-Dependency Native Backend (`server.js`)**: Node.js HTTP server running on port `3777` (`http://localhost:3777`), interfacing directly with `05_Systems/Database/client_leads.db` via `ZKDatabaseEngine`. Replaces legacy external Notion API polling with zero-latency local relational SQLite queries.
2. **REST API v1 Suite**: Provides 5 dedicated endpoints (`/api/v1/overview`, `/api/v1/buyers`, `/api/v1/listings`, `/api/v1/rens`, `/api/v1/match`) serving high-density JSON data structures.
3. **Bespoke Graphite/Slate UI (`client-dashboard.html`)**: Implements a dark slate aesthetic (`#0d1117` base, `#161b22` cards, `#238636` emerald metrics, `#30363d` subtle borders) strictly rejecting generic AI slop glows and basic plain tables. Employs tabular monospace typography (`JetBrains Mono` / `Fira Code`) for currency amounts (RM) and percentages.
4. **4 Interactive Operational Tabs**:
   - **Overview Tab**: Metric cards (Total Pipeline Value, Commission Earned, Active RENs, Conversion Rate) & recent deal activity.
   - **Buyer Pipeline Tab**: High-density grid of buyer prospects with lead scores, location badges, and status pills.
   - **Listing Matcher Tab**: Interactive buyer selector & custom criteria form querying the `/api/v1/match` scoring engine.
   - **REN Performance Tab**: Agent leaderboard tracking active listings, closed deals, and earned commissions.
5. **Automated Test Harness (`test_dashboard_server.js`)**: Programmatically verifies server startup on port 3777, validates all 5 REST API response schemas, checks HTML dark theme compliance, and shuts down cleanly returning exit code 0.

---

## 2. Existing Asset Audit vs Milestone 3 Requirements

An exhaustive audit of existing assets in `06_Assets/Dashboard/` and `05_Systems/Database/` revealed legacy implementations requiring transformation:

| Feature / Metric | Legacy Implementation (`06_Assets/Dashboard/`) | Milestone 3 ZK-DASH Blueprint (`SYS-005`) |
| :--- | :--- | :--- |
| **Backend Data Source** | Notion API HTTPS requests (`api.notion.com`) with hardcoded external DB tokens | Local SQLite DB (`05_Systems/Database/client_leads.db`) via `ZKDatabaseEngine` |
| **Port / Base URL** | Port `3777` (`http://localhost:3777`) | Port `3777` (`http://localhost:3777`) |
| **API Endpoints** | `/api/buyers`, `/api/prospects` (Legacy Notion proxy) | `/api/v1/overview`, `/api/v1/buyers`, `/api/v1/listings`, `/api/v1/rens`, `/api/v1/match` |
| **UI Structure** | Single table design targeting legacy `/api/crm/leads` | 4 Interactive Tabbed Panes (Overview, Pipeline, Matcher, Leaderboard) |
| **Visual Design** | Dark background with basic table layout | Dark Slate (`#0d1117`, `#161b22`, `#238636`), crisp badges, high-density monospace figures |
| **Property Matching** | Client-side search filtering only | Real-time backend rule-based matching engine with ranked 0-100% scores & reason tags |
| **Test Coverage** | None | Automated Node test script (`test_dashboard_server.js`) returning exit code 0 |

---

## 3. Detailed Component Blueprint Specifications

### Component A: Backend Server (`06_Assets/Dashboard/server.js`)

- **Server Architecture**: Built with native Node.js `http`, `fs`, `path`, and `url` modules, requiring zero npm external runtime dependencies.
- **Database Connection**: Instantiates `ZKDatabaseEngine` from `../../05_Systems/Database/db_engine.js`.
- **Port**: Listens on port `3777`.
- **CORS Handling**: Emits CORS headers (`Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, OPTIONS`, `Access-Control-Allow-Headers: Content-Type`) and short-circuits HTTP `OPTIONS` preflight requests.

#### REST API v1 Specifications:

1. **`GET /api/v1/overview`**
   - **SQL Queries**:
     - Total Active RENs: `SELECT COUNT(*) as count FROM ren_clients WHERE status = 'Active'`
     - Active Buyers: `SELECT COUNT(*) as count FROM buyer_prospects`
     - Total Available Listings: `SELECT COUNT(*) as count FROM property_listings WHERE status = 'Available'`
     - Total Commission Earned: `SELECT COALESCE(SUM(commission_earned), 0) as total FROM commission_deals`
     - Total Pipeline Value: `SELECT COALESCE(SUM(deal_amount), 0) as total FROM commission_deals`
     - Conversion Rate %: `(Closed Won Deals / Active Buyers) * 100` (rounded to 1 decimal place)
     - Recent Deals Feed: Top 5 records from `commission_deals` joined with `property_listings`, `buyer_prospects`, and `ren_clients`.
   - **Response Payload**:
     ```json
     {
       "success": true,
       "data": {
         "totalRens": 4,
         "activeBuyers": 20,
         "totalListings": 5,
         "totalCommissionRM": 45900,
         "totalPipelineRM": 1530000,
         "conversionRatePercent": 5.0,
         "recentDeals": [...]
       }
     }
     ```

2. **`GET /api/v1/buyers`**
   - **SQL Query**: `SELECT buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms, lead_score, status, created_at FROM buyer_prospects ORDER BY lead_score DESC, created_at DESC`
   - **Response Payload**:
     ```json
     {
       "success": true,
       "count": 20,
       "data": [...]
     }
     ```

3. **`GET /api/v1/listings`**
   - **SQL Query**: `SELECT l.listing_id, l.title, l.location, l.property_type, l.price, l.bedrooms, l.bathrooms, l.ren_id, r.name as ren_name, l.status, l.created_at FROM property_listings l LEFT JOIN ren_clients r ON l.ren_id = r.ren_id ORDER BY l.created_at DESC`
   - **Response Payload**:
     ```json
     {
       "success": true,
       "count": 5,
       "data": [...]
     }
     ```

4. **`GET /api/v1/rens`**
   - **SQL Query**: `SELECT r.ren_id, r.name, r.email, r.phone, r.commission_rate, r.status, COUNT(DISTINCT l.listing_id) as active_listings, COUNT(DISTINCT d.deal_id) as closed_deals, COALESCE(SUM(d.commission_earned), 0) as total_commission FROM ren_clients r LEFT JOIN property_listings l ON r.ren_id = l.ren_id LEFT JOIN commission_deals d ON r.ren_id = d.ren_id GROUP BY r.ren_id ORDER BY total_commission DESC`
   - **Response Payload**:
     ```json
     {
       "success": true,
       "count": 4,
       "data": [...]
     }
     ```

5. **`POST /api/v1/match`**
   - **Input Body Options**:
     - Option 1 (By Buyer ID): `{ "buyerId": "BYR-001" }` -> Calls `dbEngine.matchBuyerToListings(buyerId)`
     - Option 2 (By Custom Criteria): `{ "max_budget": 800000, "preferred_location": "Bangi", "property_type": "Terrace", "min_bedrooms": 3 }` -> Calls `dbEngine.matchBuyerCriteria(criteria)`
   - **Response Payload**:
     ```json
     {
       "success": true,
       "buyer": {...},
       "matches": [
         {
           "listing": {...},
           "matchScore": 100,
           "reasons": [
             "Price RM380,000 is within budget RM500,000",
             "Location match (Bukit Jelutong, Shah Alam)",
             "Exact property type match (Condo)"
           ]
         }
       ]
     }
     ```

---

### Component B: Bespoke UI File (`06_Assets/Dashboard/client-dashboard.html`)

- **Design Tokens**:
  - Base Background: `#0d1117`
  - Card Surface: `#161b22`
  - Subtle Borders: `#30363d`
  - Primary Metrics & Accents: `#238636` (Emerald) & `#3fb950`
  - Font Families: `'Inter'` for UI layout, `'JetBrains Mono', 'Fira Code', monospace` for monetary figures (`RM 850,000.00`), scores, and percentage metrics.
- **4 Interactive Tabs**:
  1. **Overview Tab**: 4 high-level KPI cards (Pipeline Value, Commission Earned, Active RENs, Conversion Rate), Recent Activity Table, System Connection Badge.
  2. **Buyer Pipeline Tab**: High-density table of buyer prospects featuring lead score badges (85+ Hot, 70-84 Warm, <70 Nurture), preferred location tags, max budget, min bedrooms, status pills, and instant match trigger buttons.
  3. **Listing Matcher Tab**: Interactive panel with active buyer dropdown selector and manual criteria input form. Submits query to `/api/v1/match` and renders ranked listings with visual percentage progress bars and itemized reason tags.
  4. **REN Performance Tab**: Agent leaderboard displaying agent profile info, active listings count, closed deal count, commission rate %, and total earned commission in bold monospaced figures.
- **Dynamic JavaScript Logic**:
  - `loadOverview()`, `loadBuyers()`, `initMatcherTab()`, `runMatchAlgorithm()`, `loadRens()`.
  - Tab switcher `switchTab(tabId)` managing active tab classes.
  - Auto-refresh background interval polling overview stats every 30 seconds.

---

### Component C: Test Harness (`06_Assets/Dashboard/test_dashboard_server.js`)

- **Automated Validation Suite**:
  1. Spawns/listens server instance on port `3777`.
  2. Test 1: `GET /api/v1/overview` -> Asserts HTTP 200 and checks numeric fields `totalRens`, `activeBuyers`, `totalListings`, `totalCommissionRM`, `conversionRatePercent`.
  3. Test 2: `GET /api/v1/buyers` -> Asserts HTTP 200 and checks non-empty buyer prospects array.
  4. Test 3: `GET /api/v1/listings` -> Asserts HTTP 200 and checks non-empty property listings array.
  5. Test 4: `GET /api/v1/rens` -> Asserts HTTP 200 and checks non-empty REN performance array.
  6. Test 5: `POST /api/v1/match` (buyerId) -> Asserts HTTP 200 and checks scored match list for `BYR-001`.
  7. Test 6: `POST /api/v1/match` (criteria) -> Asserts HTTP 200 and checks scored match list for custom budget/location criteria.
  8. Test 7: `GET /` (Static HTML) -> Asserts HTTP 200 and verifies presence of dark theme hex codes (`#0d1117`, `#161b22`, `#238636`) and monospace font rules.
  9. Shuts down server cleanly and exits with code 0 on 100% pass.

---

## 4. Verification Proof & Test Harness Results

The proposed implementation was fully tested on the local environment using the automated test harness.

```
====================================================
  ZK REVENUE OPS ZK-DASH TEST HARNESS (SYS-005)    
====================================================

[INIT] Server running on http://localhost:3777

[TEST 1/7] Testing GET /api/v1/overview...
  ✅ PASS: /api/v1/overview returned 200 with valid metrics payload.
     Total RENs: 4, Active Buyers: 20, Total Listings: 5, Total Commission: RM45900

[TEST 2/7] Testing GET /api/v1/buyers...
  ✅ PASS: /api/v1/buyers returned 200 with 20 buyer prospects.

[TEST 3/7] Testing GET /api/v1/listings...
  ✅ PASS: /api/v1/listings returned 200 with 5 property listings.

[TEST 4/7] Testing GET /api/v1/rens...
  ✅ PASS: /api/v1/rens returned 200 with 4 REN agent performance records.

[TEST 5/7] Testing POST /api/v1/match (buyerId)...
  ✅ PASS: /api/v1/match returned 200 with 5 scored property matches for BYR-001.

[TEST 6/7] Testing POST /api/v1/match (custom criteria)...
  ✅ PASS: /api/v1/match returned 200 with 5 custom criteria matches.

[TEST 7/7] Testing GET / (Static Dashboard HTML & Dark Theme styling)...
  ✅ PASS: Dashboard HTML served cleanly with mandated dark slate theme colors (#0d1117, #161b22, #238636) and monospace figures.

[SHUTDOWN] Server cleanly closed.

====================================================
  TEST RESULTS: 7/7 PASSED
====================================================
```

---

## 5. Blueprint Action Plan for Implementer (`worker_m3_1`)

1. Overwrite `06_Assets/Dashboard/server.js` with the verified production backend code in `.agents/explorer_m3_1/proposed_server.js`.
2. Overwrite `06_Assets/Dashboard/client-dashboard.html` with the bespoke UI layout in `.agents/explorer_m3_1/proposed_client-dashboard.html`.
3. Create `06_Assets/Dashboard/test_dashboard_server.js` using `.agents/explorer_m3_1/proposed_test_dashboard_server.js`.
4. Execute `node 06_Assets/Dashboard/test_dashboard_server.js` to confirm final deployment passes 7/7 automated tests.
