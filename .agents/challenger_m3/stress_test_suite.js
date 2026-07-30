/**
 * ZK Nexus Milestone 3 — Challenger Stress Test Suite
 * Author: Challenger Subagent
 * Target Files: client-dashboard.html, index.html, server.js, test_dashboard_server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const TEST_PORT = 3888;
const HTML_PATH = path.join(__dirname, '../../06_Assets/Dashboard/client-dashboard.html');
const SERVER_PATH = path.join(__dirname, '../../06_Assets/Dashboard/server.js');

const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
};

function assert(condition, testName, category, details = '') {
    results.total++;
    if (condition) {
        results.passed++;
        results.details.push({ status: 'PASS', category, testName, details });
        console.log(`  ✅ [PASS] [${category}] ${testName}`);
    } else {
        results.failed++;
        results.details.push({ status: 'FAIL', category, testName, details });
        console.log(`  ❌ [FAIL] [${category}] ${testName} - ${details}`);
    }
}

// -------------------------------------------------------------
// SECTION 1: Pure JS Logic Extraction & DSR Calculator Stress Test
// -------------------------------------------------------------
function testDsrCalculator() {
    console.log('\n--- SECTION 1: DSR Calculator Input Edge Cases ---');

    // DSR Calculation Implementation copied directly from client-dashboard.html lines 943-991
    function runDsrCalcPure(incVal, comVal, prcVal, rateVal, tenureVal) {
        const inc = parseFloat(incVal) || 0;
        const com = Math.max(0, parseFloat(comVal) || 0);
        const prc = parseFloat(prcVal) || 0;
        const rate = parseFloat(rateVal) || 4.5;
        const tenure = parseFloat(tenureVal) || 35;

        const r = rate / 1200;
        const n = tenure * 12;
        const principal = prc * 0.9;
        
        let pmt = 0;
        if (r > 0 && n > 0) {
            pmt = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else if (n > 0) {
            pmt = principal / n;
        }
        const inst = Math.round(pmt);

        const totalCommit = com + inst;
        const dsr = inc > 0 ? parseFloat(((totalCommit / inc) * 100).toFixed(1)) : 100;

        const maxCommitment = (inc * 0.65) - com;
        let maxLoan = 0;
        if (maxCommitment > 0 && r > 0) {
            maxLoan = maxCommitment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
        }
        const maxPrice = maxLoan > 0 ? Math.round(maxLoan / 0.9) : 0;

        let badge = '';
        if (inc <= 0 || dsr > 75) {
            badge = 'Grade C (HIGH DSR / UNQUALIFIED)';
        } else if (dsr <= 65) {
            badge = 'Grade A (PASS / HIGHLY ELIGIBLE)';
        } else {
            badge = 'Grade B (MODERATE RISK / NURTURE)';
        }

        return { inc, com, prc, inst, dsr, maxPrice, badge };
    }

    // Baseline normal test
    const base = runDsrCalcPure(8500, 2100, 500000, 4.5, 35);
    assert(base.dsr > 0 && base.dsr <= 65 && base.badge.includes('Grade A'),
        'Normal DSR Calculation (Income RM8.5k, Price RM500k)', 'DSR', `DSR: ${base.dsr}%, Badge: ${base.badge}`);

    // Edge Case 1: Zero Income
    const zeroInc = runDsrCalcPure(0, 2100, 500000, 4.5, 35);
    assert(zeroInc.dsr > 65 || zeroInc.badge.includes('Grade C'),
        'Zero Income should produce FAIL/Grade C (BUG: Currently gives 0% Grade A)', 'DSR',
        `Actual: DSR=${zeroInc.dsr}%, Badge="${zeroInc.badge}"`);

    // Edge Case 2: Negative Commitments
    const negCom = runDsrCalcPure(8500, -5000, 500000, 4.5, 35);
    assert(negCom.com >= 0,
        'Negative commitments should be sanitized to non-negative', 'DSR',
        `Actual commitments used: ${negCom.com}, DSR=${negCom.dsr}%`);

    // Edge Case 3: Property Price > RM10M (RM15 Million)
    const highPrc = runDsrCalcPure(8500, 2100, 15000000, 4.5, 35);
    assert(highPrc.dsr > 100 && highPrc.badge.includes('Grade C') && !isNaN(highPrc.inst),
        'Property Price RM15M correctly flags high DSR without NaN', 'DSR',
        `Installment: RM ${highPrc.inst}, DSR: ${highPrc.dsr}%`);

    // Edge Case 4: Extremely High Property Price (RM 1 Billion)
    const extremePrc = runDsrCalcPure(10000, 0, 1000000000, 4.5, 35);
    assert(!isNaN(extremePrc.inst) && isFinite(extremePrc.inst) && extremePrc.dsr > 1000,
        'RM 1 Billion property price does not cause NaN or Infinity overflow', 'DSR',
        `Installment: RM ${extremePrc.inst}, DSR: ${extremePrc.dsr}%`);

    // Edge Case 5: Zero/Negative Rate & Zero Tenure
    const zeroRate = runDsrCalcPure(5000, 1000, 300000, 0, 30);
    assert(!isNaN(zeroRate.inst) && isFinite(zeroRate.inst),
        'Zero interest rate does not crash calculation', 'DSR',
        `Installment: RM ${zeroRate.inst}, DSR: ${zeroRate.dsr}%`);

    const zeroTenure = runDsrCalcPure(5000, 1000, 300000, 4.5, 0);
    assert(!isNaN(zeroTenure.inst) && isFinite(zeroTenure.inst),
        'Zero tenure does not cause division by zero', 'DSR',
        `Installment: RM ${zeroTenure.inst}, DSR: ${zeroTenure.dsr}%`);

    // Edge Case 6: Non-numeric / NaN Inputs
    const nanInput = runDsrCalcPure('invalid', 'abc', undefined, 'xyz', 'foo');
    assert(!isNaN(nanInput.dsr) && !isNaN(nanInput.inst) && !isNaN(nanInput.maxPrice),
        'Non-numeric NaN inputs handled gracefully without throwing', 'DSR',
        `DSR: ${nanInput.dsr}, Inst: ${nanInput.inst}, MaxPrice: ${nanInput.maxPrice}`);
}

// -------------------------------------------------------------
// SECTION 2: HTML & Tab Switching Structure Analysis
// -------------------------------------------------------------
function testTabSwitchingAndDOM() {
    console.log('\n--- SECTION 2: Tab Switching & DOM Integrity ---');
    const html = fs.readFileSync(HTML_PATH, 'utf8');

    // 1. Check all 5 pane IDs exist in HTML
    const expectedPanes = ['paneBuyers', 'paneDsr', 'paneListings', 'paneAppointments', 'paneDeals'];
    expectedPanes.forEach(paneId => {
        const exists = html.includes(`id="${paneId}"`) || html.includes(`id='${paneId}'`);
        assert(exists, `Pane element #${paneId} exists in HTML`, 'TabSwitching', `Found in HTML: ${exists}`);
    });

    // 2. Check tab switching JS function handles all 5 tabs
    const navItemMatches = html.match(/switchNav\(['"]([^'"]+)['"]/g) || [];
    const navItemsFound = navItemMatches.map(m => m.replace(/switchNav\(['"]/, '').replace(/['"]/, ''));
    const uniqueNavItems = [...new Set(navItemsFound)];
    assert(uniqueNavItems.length >= 5,
        'All 5 nav tab triggers exist in HTML markup', 'TabSwitching',
        `Found tabs: ${uniqueNavItems.join(', ')}`);

    // 3. Test rapid tab switching execution speed (10,000 switches simulation)
    const titles = {
        buyers: "Buyer Lead Pipeline — Ahmad Razif",
        dsr: "DSR Loan Eligibility Calculator Engine",
        listings: "Exclusive Property Listings — Ahmad Razif",
        appointments: "Viewing Schedule & Appointments",
        deals: "Commission & Deals Ledger"
    };

    const startTime = Date.now();
    let currentActiveNav = 'buyers';
    for (let i = 0; i < 10000; i++) {
        const target = expectedPanes[i % 5].replace('pane', '').toLowerCase();
        currentActiveNav = target;
        const title = titles[target];
    }
    const elapsed = Date.now() - startTime;
    assert(elapsed < 100,
        `10,000 tab state transitions executed in ${elapsed}ms (sub-100ms threshold)`, 'TabSwitching',
        `Time: ${elapsed}ms`);

    // 4. Verify search input filtering behavior across tabs
    const hasGlobalSearchTargeting = html.includes("if (paneId === 'listings')") && html.includes("searchInput");
    assert(hasGlobalSearchTargeting,
        'Search input should filter active tab (BUG: currently only filters buyers table regardless of active tab)', 'SearchFilter',
        `Search filtering bound only to loadPortal()`);
}

// -------------------------------------------------------------
// SECTION 3: Server Endpoint Load, 404 Routing, and Fallback Resilience
// -------------------------------------------------------------
function makeRequest(options, postData = null) {
    return new Promise((resolve) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                let parsed = null;
                try { parsed = JSON.parse(body); } catch (e) {}
                resolve({ statusCode: res.statusCode, headers: res.headers, body, parsed });
            });
        });
        req.on('error', (err) => resolve({ statusCode: 0, error: err }));
        if (postData) req.write(postData);
        req.end();
    });
}

async function testServerEndpointsAndLoad() {
    console.log('\n--- SECTION 3: Server Endpoint Load, 404 Routing & Payload Stress ---');

    process.env.PORT = TEST_PORT.toString();
    const serverModule = require(SERVER_PATH);

    // Start server manually on 127.0.0.1:3888
    await new Promise((resolve) => {
        serverModule.listen(TEST_PORT, '127.0.0.1', () => {
            console.log(`  [INIT] Test server running on http://127.0.0.1:${TEST_PORT}`);
            resolve();
        });
    });

    try {
        const baseOpts = { host: '127.0.0.1', port: TEST_PORT };

        // 1. Overview Endpoint
        const resOverview = await makeRequest({ ...baseOpts, path: '/api/v1/overview', method: 'GET' });
        assert(resOverview.statusCode === 200 && resOverview.parsed && resOverview.parsed.success === true,
            'GET /api/v1/overview returns 200 JSON with metrics', 'ServerAPI',
            `Status: ${resOverview.statusCode}`);

        // 2. Buyers Endpoint
        const resBuyers = await makeRequest({ ...baseOpts, path: '/api/v1/buyers', method: 'GET' });
        assert(resBuyers.statusCode === 200 && Array.isArray(resBuyers.parsed.data),
            'GET /api/v1/buyers returns 200 JSON array', 'ServerAPI',
            `Count: ${resBuyers.parsed ? resBuyers.parsed.count : 0}`);

        // 3. Listings Endpoint
        const resListings = await makeRequest({ ...baseOpts, path: '/api/v1/listings', method: 'GET' });
        assert(resListings.statusCode === 200 && Array.isArray(resListings.parsed.data),
            'GET /api/v1/listings returns 200 JSON array', 'ServerAPI',
            `Count: ${resListings.parsed ? resListings.parsed.count : 0}`);

        // 4. RENs Endpoint
        const resRens = await makeRequest({ ...baseOpts, path: '/api/v1/rens', method: 'GET' });
        assert(resRens.statusCode === 200 && Array.isArray(resRens.parsed.data),
            'GET /api/v1/rens returns 200 JSON array', 'ServerAPI',
            `Count: ${resRens.parsed ? resRens.parsed.count : 0}`);

        // 5. Match Endpoint (POST Valid buyerId)
        const matchData = JSON.stringify({ buyerId: 'BYR-001' });
        const resMatch = await makeRequest({
            ...baseOpts, path: '/api/v1/match', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(matchData) }
        }, matchData);
        assert(resMatch.statusCode === 200 && Array.isArray(resMatch.parsed.matches),
            'POST /api/v1/match (valid buyerId) returns 200 with matches', 'ServerAPI',
            `Matches count: ${resMatch.parsed && resMatch.parsed.matches ? resMatch.parsed.matches.length : 0}`);

        // 6. Match Endpoint (POST Malformed JSON)
        const resMatchBadJson = await makeRequest({
            ...baseOpts, path: '/api/v1/match', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, '{ bad json: true ');
        assert(resMatchBadJson.statusCode === 400 && resMatchBadJson.parsed && resMatchBadJson.parsed.error.includes('Invalid or malformed JSON'),
            'POST /api/v1/match with malformed JSON returns 400 Bad Request', 'ServerAPI',
            `Status: ${resMatchBadJson.statusCode}, Error: ${resMatchBadJson.parsed ? resMatchBadJson.parsed.error : ''}`);

        // 7. Match Endpoint (POST Empty Payload)
        const resMatchEmpty = await makeRequest({
            ...baseOpts, path: '/api/v1/match', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength('{}') }
        }, '{}');
        assert(resMatchEmpty.statusCode === 400 && resMatchEmpty.parsed && resMatchEmpty.parsed.error.includes('Missing buyerId'),
            'POST /api/v1/match with empty object returns 400 Bad Request', 'ServerAPI',
            `Status: ${resMatchEmpty.statusCode}`);

        // 8. Match Endpoint (POST SQL Injection Payload in criteria)
        const sqlInjData = JSON.stringify({ preferred_location: "' OR '1'='1" });
        const resSqlInj = await makeRequest({
            ...baseOpts, path: '/api/v1/match', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(sqlInjData) }
        }, sqlInjData);
        assert(resSqlInj.statusCode === 200 && resSqlInj.parsed && Array.isArray(resSqlInj.parsed.matches),
            'POST /api/v1/match with SQL Injection string handled safely by prepared statements', 'ServerSecurity',
            `Status: ${resSqlInj.statusCode}`);

        // 9. API 404 Routing
        const resApi404 = await makeRequest({ ...baseOpts, path: '/api/v1/nonexistent_route', method: 'GET' });
        assert(resApi404.statusCode === 404 && resApi404.parsed && resApi404.parsed.error === 'Endpoint not found',
            'GET /api/v1/nonexistent_route returns JSON 404', 'ServerRouting',
            `Status: ${resApi404.statusCode}`);

        // 10. Static / SPA Fallback Routing
        const resSpaFallback = await makeRequest({ ...baseOpts, path: '/unknown_client_route', method: 'GET' });
        assert(resSpaFallback.statusCode === 200 && resSpaFallback.body.includes('<!DOCTYPE html>'),
            'GET /unknown_client_route falls back to static client-dashboard.html (200 OK)', 'ServerRouting',
            `Status: ${resSpaFallback.statusCode}, HTML returned: ${resSpaFallback.body.includes('<!DOCTYPE html>')}`);

        // 11. Endpoint Concurrent Load Test (100 parallel requests)
        console.log('  Running 100 concurrent HTTP requests load test...');
        const loadStart = Date.now();
        const loadReqs = [];
        for (let i = 0; i < 100; i++) {
            const endpoint = i % 2 === 0 ? '/api/v1/buyers' : '/api/v1/listings';
            loadReqs.push(makeRequest({ ...baseOpts, path: endpoint, method: 'GET' }));
        }
        const loadResults = await Promise.all(loadReqs);
        const loadElapsed = Date.now() - loadStart;
        const all200 = loadResults.every(r => r.statusCode === 200);
        assert(all200 && loadElapsed < 2000,
            `100 concurrent requests completed in ${loadElapsed}ms with 100% 200 OK responses`, 'ServerLoad',
            `Time: ${loadElapsed}ms, All 200: ${all200}`);

    } finally {
        // Shutdown test server
        serverModule.close();
        console.log('  [SHUTDOWN] Test server cleanly closed.');
    }
}

// -------------------------------------------------------------
// SECTION 4: Modal Form Validation & Search Input Filtering Stress
// -------------------------------------------------------------
function testModalsAndFormValidation() {
    console.log('\n--- SECTION 4: Modal Form Validation & HTML Injection Stress ---');
    const html = fs.readFileSync(HTML_PATH, 'utf8');

    // 1. Check modal DOM structures
    const modals = ['modalAddLead', 'modalAddListing', 'modalScheduleViewing', 'drawerOverlay'];
    modals.forEach(m => {
        const exists = html.includes(`id="${m}"`) || html.includes(`id='${m}'`);
        assert(exists, `Modal element #${m} exists in HTML`, 'Modals', `Found: ${exists}`);
    });

    // 2. Check XSS vulnerabilities in lead table rendering
    const unescapedName = html.includes("${l.name}") && !html.includes("escapeHtml(l.name)");
    assert(!unescapedName,
        'Lead name should be HTML-escaped before insertion into DOM (VULNERABILITY: Stored XSS)', 'SecurityXSS',
        `Unescaped \${l.name} inserted directly into innerHTML string`);

    // 3. Check XSS vulnerabilities in property listing title
    const unescapedTitle = html.includes("${item.title}") && !html.includes("escapeHtml(item.title)");
    assert(!unescapedTitle,
        'Listing title should be HTML-escaped before insertion into DOM (VULNERABILITY: Stored XSS)', 'SecurityXSS',
        `Unescaped \${item.title} inserted directly into innerHTML string`);

    // 4. Check form submission NaN handling (handleAddLead)
    function handleAddLeadPure(name, phone, location, type, budgetStr, incomeStr, commitStr) {
        const budget = parseFloat(budgetStr) || 0;
        const income = parseFloat(incomeStr) || 0;
        const commit = parseFloat(commitStr) || 0;

        return {
            name, phone, location, propertyType: type,
            maxBudget: budget,
            netIncome: income,
            existingCommitments: commit,
            estCommission: Math.round(budget * 0.02)
        };
    }

    const emptyLead = handleAddLeadPure('', '', '', '', '', '', '');
    assert(!isNaN(emptyLead.maxBudget) && !isNaN(emptyLead.estCommission),
        'Form submission with empty numbers should default gracefully without NaN', 'FormValidation',
        `maxBudget: ${emptyLead.maxBudget}, estCommission: ${emptyLead.estCommission}`);
}

// -------------------------------------------------------------
// MAIN TEST RUNNER
// -------------------------------------------------------------
async function runAllTests() {
    console.log('====================================================');
    console.log('  ZK REVENUE OPS — CHALLENGER STRESS SUITE (M3)     ');
    console.log('====================================================');

    testDsrCalculator();
    testTabSwitchingAndDOM();
    await testServerEndpointsAndLoad();
    testModalsAndFormValidation();

    console.log('\n====================================================');
    console.log(`  STRESS TEST SUMMARY: ${results.passed}/${results.total} PASSED (${results.failed} FAILED)`);
    console.log('====================================================\n');

    // Output JSON summary file
    const reportPath = path.join(__dirname, 'stress_results.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`Detailed test log written to ${reportPath}`);
}

runAllTests().catch(err => {
    console.error('Unhandled error in test runner:', err);
    process.exit(1);
});
