# ZK-PORTAL-UI Analysis & Technical Blueprint (Milestone 3)

**Author:** Explorer Subagent  
**Target Component:** ZK-PORTAL-UI (`06_Assets/Dashboard/client-dashboard.html` & `index.html`)  
**Server Backend:** `06_Assets/Dashboard/server.js` (Port 3777)  
**Test Harness:** `06_Assets/Dashboard/test_dashboard_server.js`  
**Date:** 2026-07-30  

---

## 1. Direct Observations

### 1.1 HTML Asset File Locations & Synchronization
- **Primary Files:**
  - `06_Assets/Dashboard/client-dashboard.html` (37,848 bytes, 805 lines)
  - `index.html` (37,848 bytes, 805 lines) located at project root.
- Both files are currently byte-identical and serve as the single-tenant client portal UI. `index.html` serves as the entry point for GitHub Pages live deployment (`https://zkoroci10.github.io/zk-nexus-revenue-ops/`), while `client-dashboard.html` is served by `server.js` on local port 3777.

### 1.2 Automated Test Harness Execution Results
Execution of `node 06_Assets/Dashboard/test_dashboard_server.js` produced the following result:
```text
====================================================
  ZK REVENUE OPS ZK-DASH TEST HARNESS (SYS-005)    
====================================================
[INIT] Server running on http://localhost:3777

[TEST 1/7] Testing GET /api/v1/overview...
  ✅ PASS: /api/v1/overview returned 200 with valid metrics payload.
[TEST 2/7] Testing GET /api/v1/buyers...
  ✅ PASS: /api/v1/buyers returned 200 with 20 buyer prospects.
[TEST 3/7] Testing GET /api/v1/listings...
  ✅ PASS: /api/v1/listings returned 200 with 5 property listings.
[TEST 4/7] Testing GET /api/v1/rens...
  ✅ PASS: /api/v1/rens returned 200 with 4 REN agent performance records.
[TEST 5/7] Testing POST /api/v1/match (buyerId)...
  ✅ PASS: /api/v1/match returned 200 with 5 scored property matches.
[TEST 6/7] Testing POST /api/v1/match (custom criteria)...
  ✅ PASS: /api/v1/match returned 200 with 5 custom criteria matches.
[TEST 7/7] Testing GET / (Static Dashboard HTML & Dark Theme styling)...
  ❌ FAIL: Dashboard HTML missing dark theme style compliance. hasBg:false, hasCard:false, hasGreen:false, hasMonoFont:true

====================================================
  TEST RESULTS: 6/7 PASSED
====================================================
```

### 1.3 Test 7 Failure Analysis (Theme Style Non-Compliance)
- **Root Cause:** In `test_dashboard_server.js` (lines 176–179), the test requires exact color hex values in HTML:
  - `#0d1117` for base background (`hasBg`)
  - `#161b22` for card background (`hasCard`)
  - `#238636` for positive green metrics (`hasGreen`)
  - Monospace font family declaration (`hasMonoFont`)
- **Current CSS Variable Declarations (`client-dashboard.html` lines 11–24):**
  - `--bg: #09090b;` (Non-compliant)
  - `--surface: #121217;` (Non-compliant)
  - `--accent-green: #22c55e;` (Non-compliant)
- **AI Glow Violation:** Line 120 of `client-dashboard.html` contains `.status-dot { box-shadow: 0 0 8px var(--accent-green); }`. Prompt explicitly forbids AI slop glows.

### 1.4 Tab Panes & API Endpoints Audit
- **Tab 1 (`paneBuyers`):** Displays buyer lead table. Integrated with `GET /api/v1/buyers`. Modal drawer (`drawerOverlay`) present for lead details.
- **Tab 2 (`paneDsr`):** Interactive DSR calculator. Currently calculates DSR % based on simple inputs, but lacks customizable interest rate / tenure parameters, max house price capability, and formatted pre-approval report generator.
- **Tab 3 (`paneListings`):** Displays listings table. Integrated with `GET /api/v1/listings`, but lacks interactive listing addition and detail modal.
- **Tab 4 (`paneAppointments` / `paneSchedule`):** Displays viewing schedule. Uses static seed arrays (`seedAppts`). SQLite table `viewing_logs` exists in `05_Systems/Database/client_leads.db` but `server.js` lacks an explicit `GET /api/v1/viewings` endpoint.
- **Tab 5 (`paneDeals` / `paneCommission`):** Displays commission ledger. Uses static seed arrays (`seedDeals`). SQLite table `commission_deals` exists in `client_leads.db`, but `server.js` lacks an explicit `GET /api/v1/deals` endpoint.

---

## 2. Logic Chain

1. **Observation 1.2 & 1.3 → Logic Step 1 (Theme Remediation):**  
   Updating `:root` CSS variables in `client-dashboard.html` and `index.html` to `#0d1117` (base), `#161b22` (cards/surface), and `#238636` (positive metrics green), while stripping glow shadows from `.status-dot`, will directly fix `TEST 7/7` in `test_dashboard_server.js`, bringing automated test compliance to **7/7 PASSED (100%)**.

2. **Observation 1.4 → Logic Step 2 (Server Endpoint Parity):**  
   `server.js` currently exposes `/api/v1/overview`, `/api/v1/buyers`, `/api/v1/listings`, `/api/v1/rens`, and `/api/v1/match`. By adding `GET /api/v1/viewings` and `GET /api/v1/deals` to `server.js`, all 5 tab panes in the UI will have full live SQLite database integration on local port 3777.

3. **Observation 1.1 & 1.4 → Logic Step 3 (Dual-Mode Integration Architecture):**  
   The UI must operate seamlessly in two distinct runtime modes:
   - **Mode A (Local Server Port 3777):** Real-time REST API fetching from `http://localhost:3777/api/v1/*`.
   - **Mode B (GitHub Pages Target):** Static deployment at `https://zkoroci10.github.io/zk-nexus-revenue-ops/` where API endpoints return 404.
   - **Solution:** Implement a unified fetch wrapper `apiFetch(endpoint, fallbackData)` with automatic fallback to rich, pre-structured embedded JavaScript seed objects (`seedBuyers`, `seedListings`, `seedAppts`, `seedDeals`). This guarantees zero runtime console errors and 100% interactive responsiveness on GitHub Pages.

4. **Observation 1.4 → Logic Step 4 (DSR Engine Performance & Standard):**  
   The DSR calculation engine must compute DSR % and Grade status in `<10ms`. Using standard JavaScript event handlers (`oninput`) attached to numeric inputs, calculations execute synchronously in `<1ms`. Adding standard Malaysian banking DSR thresholds (Grade A: ≤65%, Grade B: 66–75%, Grade C: >75%) and loan affordability formula ensures financial accuracy.

---

## 3. Caveats

- **Read-Only Explorer Scope:** As an Explorer subagent, no project source code files (`client-dashboard.html`, `index.html`, `server.js`) have been altered during this analysis turn. All proposed modifications are structured as actionable code blueprints for the Worker subagent.
- **SQLite Dependency:** `server.js` uses Node.js native `node:sqlite` (`DatabaseSync`), requiring Node.js v22.5.0+ or compatible runtime.
- **Static Deployment Limitation:** On GitHub Pages, data additions created via the UI operate in local memory state since static hosting cannot execute Node.js HTTP handlers or write to SQLite files.

---

## 4. Conclusion & Technical Blueprint for Worker Subagent

The Worker subagent must execute the following structured implementation tasks across `06_Assets/Dashboard/client-dashboard.html`, `index.html`, and `06_Assets/Dashboard/server.js`.

### 4.1 Theme & Styling Refinement Specification

Modify `:root` in both `client-dashboard.html` and `index.html`:
```css
:root {
    --bg: #0d1117;              /* Mandated Dark Slate Base */
    --surface: #161b22;         /* Mandated Graphite Card Background */
    --surface-hover: #21262d;   /* Hover Surface */
    --border: #30363d;          /* Card & Table Borders */
    --border-hover: #8b949e;    /* Active Border Highlight */
    --text-main: #c9d1d9;       /* Primary Text */
    --text-muted: #8b949e;      /* Muted Text */
    --text-subtle: #6e7681;     /* Subtle Text */
    --accent-green: #238636;    /* Mandated Positive Metric Green */
    --accent-green-bg: rgba(35,134,54,0.15);
    --accent-amber: #d29922;    /* Nurture Amber */
    --accent-amber-bg: rgba(210,153,34,0.15);
    --accent-rose: #f85149;     /* Unqualified Red */
    --accent-rose-bg: rgba(248,81,73,0.15);
    --accent-blue: #58a6ff;     /* Info / Accent Blue */
    --accent-blue-bg: rgba(88,166,255,0.15);
}

/* Monospace font class for all financial & numerical stats */
.mono {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-feature-settings: "tnum";
}

/* Remove AI Slop Glows */
.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-green);
    /* NO box-shadow glow */
}
```

### 4.2 5 Functional Tab Panes Specifications

#### Pane 1: Buyer Pipeline (`paneBuyers`)
- **Metrics Bar:** 4 Cards (Delegated Leads, Grade A Eligible, Grade B Nurture, Est. Grade A Commission). Figures wrapped in `.mono` class.
- **Controls:** Grade Filter Tabs (`All`, `Grade A`, `Grade B`, `Grade C`), Search Input (`#searchInput`), Export CSV button (`exportCSV()`).
- **Data Table:** Renders Buyer Prospect Name, Grade Badge (`badge-a` `#238636`, `badge-b` `#d29922`, `badge-c` `#f85149`), Target Area & Budget, Net Income, Existing Commitments, DSR %, Est. Commission.
- **Drawer Modal (`drawerOverlay`):** Clicking any row opens lead detail drawer with net income, commitments, DSR status, notes, and direct "Send WhatsApp Pre-Approval Report" action.

#### Pane 2: DSR Calculator Engine (`paneDsr`)
- **Realtime Inputs:** Net Monthly Income (`cIncome`), Existing Bank Commitments (`cCommit`), Target Property Price (`cPrice`), Interest Rate % (`cRate`, default 4.5%), Loan Tenure Years (`cTenure`, default 35).
- **Calculations (<10ms Execution):**
  - Monthly Rate $r = \frac{rate}{1200}$
  - Total Months $n = tenure \times 12$
  - Monthly Installment $PMT = P \times \frac{r(1+r)^n}{(1+r)^n - 1}$
  - $DSR \% = \left( \frac{\text{Commitments} + PMT}{\text{Net Income}} \right) \times 100$
  - Max Affordable Loan Amount = $\frac{(\text{Net Income} \times 0.65) - \text{Commitments}}{\frac{r(1+r)^n}{(1+r)^n - 1}}$
- **Grade Assessment:**
  - $DSR \le 65\% \rightarrow$ **Grade A (PASS / HIGHLY ELIGIBLE)** (`#238636`)
  - $66\% \le DSR \le 75\% \rightarrow$ **Grade B (MODERATE RISK / NURTURE)** (`#d29922`)
  - $DSR > 75\% \rightarrow$ **Grade C (HIGH DSR / UNQUALIFIED)** (`#f85149`)
- **WhatsApp Dispatcher:** Button generates clean formatted text:
  ```text
  📋 ZK REVENUE OPS — DSR LOAN PRE-APPROVAL REPORT
  Client Net Income: RM 8,500
  Existing Commitments: RM 2,100
  Target Property Price: RM 500,000
  Est. Monthly Installment: RM 2,368
  Calculated DSR Ratio: 52.6% (GRADE A - PASS)
  Max Affordable Property Price: RM 618,000
  ```

#### Pane 3: Property Listings (`paneListings`)
- **Metrics & Controls:** Exclusive listings count, "+ Add New Listing" button.
- **Data Table:** Renders Title, Location Area, Property Type, Asking Price (`.mono` `#238636`), Specs (Beds/Baths/Sqft), Status Badge (`Available`, `Reserved`, `Sold`).
- **Interactive Add Listing Modal:** Modal form to dynamically append new property listings to UI state.

#### Pane 4: Viewing Schedule (`paneAppointments`)
- **Controls:** Scheduled Viewings count, "+ Schedule Viewing" button.
- **Data Table:** Buyer Name, Listing Title, Viewing Date & Time, Feedback / Star Rating, Status Badge (`Scheduled`, `Completed`, `Cancelled`), Action buttons (Confirm, Mark Completed).
- **Interactive Scheduler Modal:** Modal form to record new viewing appointments.

#### Pane 5: Commission Ledger (`paneDeals`)
- **Summary:** Total Cleared Commission (`RM XX,XXX`) and Total Pipeline Volume (`RM X,XXX,XXX`) in `.mono` `#238636`.
- **Data Table:** Deal Reference ID, Buyer Name, Property Listing, Deal Amount (`.mono`), Gross Commission (3%, `.mono`), Net Agent Split (80%, `.mono` `#238636`), Status Badge (`Closed Won`, `Pending`, `Cancelled`).

### 4.3 Server Endpoint Additions (`server.js`)

Add the following API endpoints to `06_Assets/Dashboard/server.js`:

```javascript
// API Route 6: Viewing Schedule (GET)
if (pathname === '/api/v1/viewings' && req.method === 'GET') {
    const stmt = dbEngine.db.prepare(`
        SELECT v.viewing_id, v.buyer_id, b.name as buyer_name, b.phone as buyer_phone,
               v.listing_id, l.title as listing_title, l.location as listing_location,
               v.viewing_date, v.feedback, v.rating, v.status
        FROM viewing_logs v
        LEFT JOIN buyer_prospects b ON v.buyer_id = b.buyer_id
        LEFT JOIN property_listings l ON v.listing_id = l.listing_id
        ORDER BY v.viewing_date ASC
    `);
    const viewings = stmt.all();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: viewings.length, data: viewings }));
    return;
}

// API Route 7: Commission Deals Ledger (GET)
if (pathname === '/api/v1/deals' && req.method === 'GET') {
    const stmt = dbEngine.db.prepare(`
        SELECT d.deal_id, d.listing_id, l.title as listing_title,
               d.buyer_id, b.name as buyer_name,
               d.ren_id, r.name as ren_name,
               d.deal_amount, d.commission_earned, d.deal_date, d.status
        FROM commission_deals d
        LEFT JOIN property_listings l ON d.listing_id = l.listing_id
        LEFT JOIN buyer_prospects b ON d.buyer_id = b.buyer_id
        LEFT JOIN ren_clients r ON d.ren_id = r.ren_id
        ORDER BY d.deal_date DESC
    `);
    const deals = stmt.all();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: deals.length, data: deals }));
    return;
}
```

---

## 5. Verification Method

### 5.1 Automated Test Verification
Run the system test harness from the root directory:
```bash
node 06_Assets/Dashboard/test_dashboard_server.js
```
**Expected Invalidation Condition:** If test output shows anything other than `7/7 PASSED`, the implementation is non-compliant.

### 5.2 Manual Browser / Theme Verification
1. Start the local server:
   ```bash
   node 06_Assets/Dashboard/server.js
   ```
2. Open `http://localhost:3777` in Chrome / Browser.
3. Inspect background color (must be `#0d1117`) and card background (must be `#161b22`).
4. Click through all 5 sidebar navigation tabs (`Buyer Pipeline`, `DSR Loan Calculator`, `Property Listings`, `Viewing Schedule`, `Commission Ledger`). Confirm all tabs switch smoothly without console errors.
5. In DSR Calculator tab, enter `Income: 10000`, `Commitments: 2000`, `Price: 600000`. Confirm DSR ratio and Grade badge update instantaneously (<10ms).
