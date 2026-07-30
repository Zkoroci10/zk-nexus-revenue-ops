# Adversarial Stress Test Report — ZK-PORTAL-UI (Milestone 3)

**Agent Role**: EMPIRICAL CHALLENGER (`challenger_m3`)  
**Target Files**: 
- `06_Assets/Dashboard/client-dashboard.html` (and identical root `index.html`)
- `06_Assets/Dashboard/server.js`
- `06_Assets/Dashboard/test_dashboard_server.js`

---

## Challenge Summary

**Overall Risk Assessment**: **MEDIUM-HIGH**

While the baseline server implementation and static asset serving pass all 7 standard tests (`test_dashboard_server.js`), empirical stress testing revealed **5 critical edge-case flaws and security vulnerabilities** in client-side calculation, form validation, search scope, and innerHTML rendering.

---

## 1. Observation

### Observation 1: Baseline Server Test Execution
Running `node 06_Assets/Dashboard/test_dashboard_server.js` executed 7 test cases against `server.js` (SQLite integration, static dashboard serving, REST API endpoints `/api/v1/overview`, `/api/v1/buyers`, `/api/v1/listings`, `/api/v1/rens`, `/api/v1/match`):
```text
====================================================
  TEST RESULTS: 7/7 PASSED
====================================================
```

### Observation 2: DSR Calculator Zero-Income & Negative Commitment Flaws
In `06_Assets/Dashboard/client-dashboard.html` (lines 943–991):
```javascript
const inc = parseFloat(document.getElementById('cIncome').value) || 0;
const com = parseFloat(document.getElementById('cCommit').value) || 0;
...
const dsr = inc > 0 ? parseFloat(((totalCommit / inc) * 100).toFixed(1)) : 0;
...
if (dsr <= 65) {
    b.className = 'badge badge-a';
    b.textContent = 'Grade A (PASS / HIGHLY ELIGIBLE)';
    document.getElementById('cDsrVal').style.color = 'var(--accent-green)';
}
```
- **Zero Income**: When `inc = 0`, `dsr` evaluates to `0%`. Since `0 <= 65`, the system outputs `Grade A (PASS / HIGHLY ELIGIBLE)` for applicants with zero income.
- **Negative Commitments**: When `com = -5000`, `totalCommit` becomes negative, yielding `dsr = -33.8%` and inflating maximum property price calculations without sanitization (`Math.max(0, com)`).

### Observation 3: Stored DOM XSS Vulnerabilities
In `06_Assets/Dashboard/client-dashboard.html`:
- Line 832: `rows += <tr onclick="openDrawer(${idx})"><td><div class="lead-name">${l.name}</div><div class="lead-meta">${l.phone} · ${l.source}</div>...`
- Line 866: `rows += <tr><td style="font-weight:600; color:var(--text-main);">${item.title}</td><td>${item.location}</td>...`
- Line 891: `rows += <tr><td style="font-weight:600;">${item.buyer}</td><td>${item.listing}</td>...`

User inputs from `modalAddLead`, `modalAddListing`, and `modalScheduleViewing` (as well as API payloads) are injected directly into `innerHTML` strings without HTML escaping.

### Observation 4: Form Input NaN Corruption
In `06_Assets/Dashboard/client-dashboard.html` (lines 1079–1084 & 1098):
```javascript
maxBudget: parseFloat(document.getElementById('addBudget').value),
netIncome: parseFloat(document.getElementById('addIncome').value),
existingCommitments: parseFloat(document.getElementById('addCommit').value),
estCommission: Math.round(parseFloat(document.getElementById('addBudget').value) * 0.02)
```
When submitted with empty fields, `parseFloat("")` evaluates to `NaN`. `estCommission` becomes `NaN`, causing table rendering functions to display `RM NaN`.

### Observation 5: Search Filter Scope Limitation
In `client-dashboard.html` (lines 791–795 & 1023–1026):
```javascript
function onSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadPortal, 250);
}
```
`onSearch()` only triggers `loadPortal()`, which filters `currentLeads` for the Buyer Pipeline tab. Typing into `#searchInput` while viewing the **Listings**, **Appointments**, or **Deals** tabs fails to filter those active tables.

---

## 2. Logic Chain

1. **DSR Zero Income Flaw**: 
   - `inc > 0` condition guards against `Infinity` division by returning `0`.
   - However, a DSR of `0%` is evaluated by `if (dsr <= 65)` as a passing Grade A status.
   - *Conclusion*: Zero income leads receive false loan pre-approvals.

2. **XSS Vulnerability**:
   - `handleAddLead` / `handleAddListing` takes user text input directly into JavaScript objects.
   - `renderTable`, `renderListings`, and `renderAppts` concatenate properties into DOM strings assigned to `innerHTML`.
   - *Conclusion*: Untrusted script tags (e.g. `<img src=x onerror=alert(1)>`) execute directly in the browser context.

3. **Server Resiliency & Load Performance**:
   - Running 100 concurrent requests across `/api/v1/buyers` and `/api/v1/listings` yielded 100% `200 OK` in 155ms.
   - Malformed JSON payloads to `POST /api/v1/match` correctly return HTTP 400 Bad Request.
   - Non-existent `/api/*` endpoints return standard HTTP 404 JSON, while SPA routes fall back to serving `client-dashboard.html`.
   - *Conclusion*: Node/SQLite backend (`server.js`) is robust under load, handles 404 routing properly, and uses prepared statements that block SQL injection.

4. **Tab Switching & DOM Integrity**:
   - 10,000 simulated tab state transitions executed in 5ms.
   - All 5 expected DOM view panes (`#paneBuyers`, `#paneDsr`, `#paneListings`, `#paneAppointments`, `#paneDeals`) are present and functional.

---

## 3. Caveats

- **Network Environment**: All empirical tests were conducted in local Node.js environment (`127.0.0.1:3888` and `localhost:3777`).
- **Browser Clipboard API**: `navigator.clipboard.writeText` in `sendDsrWhatsAppReport` requires a secure context (HTTPS) in modern browsers; HTTP fallback relies on `alert()`.

---

## 4. Conclusion

**Verdict**: **PASS WITH CONDITIONS / REQUIRED REMEDIATION**

The server backend (`server.js`) and core tab layout pass performance, load, 404 routing, and static fallback tests. However, the client application (`client-dashboard.html` / `index.html`) requires the following fixes before production release:

1. **Fix DSR Zero Income / Negative Commitment Logic**:
   - Return `dsr = 100%` / `Grade C` when income <= 0.
   - Enforce `Math.max(0, com)` on commitments.
2. **Implement HTML Escaping for Table Rendering**:
   - Wrap user-provided text in an `escapeHtml()` helper function before setting `innerHTML`.
3. **Form Input Sanitization**:
   - Fall back empty input fields to `0` using `parseFloat(val) || 0`.
4. **Extend Search Filtering Across Active Tabs**:
   - Update `onSearch()` to filter listings, appointments, and deals when those tabs are active.

---

## 5. Verification Method

To independently reproduce and verify all 34 stress tests:

```bash
# 1. Run Baseline Server Test Suite
node 06_Assets/Dashboard/test_dashboard_server.js

# 2. Run Comprehensive Challenger Stress Test Suite
node .agents/challenger_m3/stress_test_suite.js
```

**Expected Results**:
- `test_dashboard_server.js`: **7/7 PASSED**
- `stress_test_suite.js`: **29/34 PASSED**, explicitly catching the 5 documented edge-case / vulnerability failures.
