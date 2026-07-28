/**
 * ZK Revenue Ops — Automated Test Harness for Tailored Client Dashboard Server (ZK-DASH)
 * ID: SYS-005-TEST
 * Module: 06_Assets/Dashboard/test_dashboard_server.js
 * 
 * Verifies all 5 REST API v1 endpoints and HTML styling compliance on port 3777.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const server = require('./proposed_server.js');

const PORT = 3777;

function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
        });
        req.on('error', reject);
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

async function runTests() {
    console.log(`====================================================`);
    console.log(`  ZK REVENUE OPS ZK-DASH TEST HARNESS (SYS-005)    `);
    console.log(`====================================================\n`);

    let passedCount = 0;
    let totalTests = 7;

    // Start server instance
    await new Promise((resolve) => {
        server.listen(PORT, () => {
            console.log(`[INIT] Server running on http://localhost:${PORT}`);
            resolve();
        });
    });

    try {
        // TEST 1: GET /api/v1/overview
        console.log(`\n[TEST 1/7] Testing GET /api/v1/overview...`);
        const resOverview = await makeRequest({ hostname: 'localhost', port: PORT, path: '/api/v1/overview', method: 'GET' });
        if (resOverview.statusCode === 200) {
            const json = JSON.parse(resOverview.body);
            if (json.success && json.data &&
                typeof json.data.totalRens === 'number' &&
                typeof json.data.activeBuyers === 'number' &&
                typeof json.data.totalListings === 'number' &&
                typeof json.data.totalCommissionRM === 'number' &&
                typeof json.data.conversionRatePercent === 'number') {
                console.log(`  ✅ PASS: /api/v1/overview returned 200 with valid metrics payload.`);
                console.log(`     Total RENs: ${json.data.totalRens}, Active Buyers: ${json.data.activeBuyers}, Total Listings: ${json.data.totalListings}, Total Commission: RM${json.data.totalCommissionRM}`);
                passedCount++;
            } else {
                console.error(`  ❌ FAIL: Invalid JSON schema returned from /api/v1/overview`, json);
            }
        } else {
            console.error(`  ❌ FAIL: HTTP Status ${resOverview.statusCode}`);
        }

        // TEST 2: GET /api/v1/buyers
        console.log(`\n[TEST 2/7] Testing GET /api/v1/buyers...`);
        const resBuyers = await makeRequest({ hostname: 'localhost', port: PORT, path: '/api/v1/buyers', method: 'GET' });
        if (resBuyers.statusCode === 200) {
            const json = JSON.parse(resBuyers.body);
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                console.log(`  ✅ PASS: /api/v1/buyers returned 200 with ${json.count} buyer prospects.`);
                passedCount++;
            } else {
                console.error(`  ❌ FAIL: Invalid buyers response payload`, json);
            }
        } else {
            console.error(`  ❌ FAIL: HTTP Status ${resBuyers.statusCode}`);
        }

        // TEST 3: GET /api/v1/listings
        console.log(`\n[TEST 3/7] Testing GET /api/v1/listings...`);
        const resListings = await makeRequest({ hostname: 'localhost', port: PORT, path: '/api/v1/listings', method: 'GET' });
        if (resListings.statusCode === 200) {
            const json = JSON.parse(resListings.body);
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                console.log(`  ✅ PASS: /api/v1/listings returned 200 with ${json.count} property listings.`);
                passedCount++;
            } else {
                console.error(`  ❌ FAIL: Invalid listings response payload`, json);
            }
        } else {
            console.error(`  ❌ FAIL: HTTP Status ${resListings.statusCode}`);
        }

        // TEST 4: GET /api/v1/rens
        console.log(`\n[TEST 4/7] Testing GET /api/v1/rens...`);
        const resRens = await makeRequest({ hostname: 'localhost', port: PORT, path: '/api/v1/rens', method: 'GET' });
        if (resRens.statusCode === 200) {
            const json = JSON.parse(resRens.body);
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                console.log(`  ✅ PASS: /api/v1/rens returned 200 with ${json.count} REN agent performance records.`);
                passedCount++;
            } else {
                console.error(`  ❌ FAIL: Invalid rens response payload`, json);
            }
        } else {
            console.error(`  ❌ FAIL: HTTP Status ${resRens.statusCode}`);
        }

        // TEST 5: POST /api/v1/match (Buyer ID match)
        console.log(`\n[TEST 5/7] Testing POST /api/v1/match (buyerId)...`);
        const matchPayload = JSON.stringify({ buyerId: 'BYR-001' });
        const resMatch = await makeRequest({
            hostname: 'localhost',
            port: PORT,
            path: '/api/v1/match',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(matchPayload)
            }
        }, matchPayload);

        if (resMatch.statusCode === 200) {
            const json = JSON.parse(resMatch.body);
            if (json.success && json.buyer && Array.isArray(json.matches)) {
                console.log(`  ✅ PASS: /api/v1/match returned 200 with ${json.matches.length} scored property matches for BYR-001.`);
                passedCount++;
            } else {
                console.error(`  ❌ FAIL: Invalid match response payload`, json);
            }
        } else {
            console.error(`  ❌ FAIL: HTTP Status ${resMatch.statusCode}`);
        }

        // TEST 6: POST /api/v1/match (Custom Criteria match)
        console.log(`\n[TEST 6/7] Testing POST /api/v1/match (custom criteria)...`);
        const criteriaPayload = JSON.stringify({
            max_budget: 700000,
            preferred_location: 'Bangi',
            property_type: 'Terrace',
            min_bedrooms: 3
        });
        const resMatchCriteria = await makeRequest({
            hostname: 'localhost',
            port: PORT,
            path: '/api/v1/match',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(criteriaPayload)
            }
        }, criteriaPayload);

        if (resMatchCriteria.statusCode === 200) {
            const json = JSON.parse(resMatchCriteria.body);
            if (json.success && Array.isArray(json.matches)) {
                console.log(`  ✅ PASS: /api/v1/match returned 200 with ${json.matches.length} custom criteria matches.`);
                passedCount++;
            } else {
                console.error(`  ❌ FAIL: Invalid custom criteria match payload`, json);
            }
        } else {
            console.error(`  ❌ FAIL: HTTP Status ${resMatchCriteria.statusCode}`);
        }

        // TEST 7: GET / (Dashboard HTML Asset & Dark Theme Verification)
        console.log(`\n[TEST 7/7] Testing GET / (Static Dashboard HTML & Dark Theme styling)...`);
        const resHtml = await makeRequest({ hostname: 'localhost', port: PORT, path: '/', method: 'GET' });
        if (resHtml.statusCode === 200) {
            const htmlContent = resHtml.body;
            const hasBg = htmlContent.includes('#0d1117');
            const hasCard = htmlContent.includes('#161b22');
            const hasGreen = htmlContent.includes('#238636');
            const hasMonoFont = htmlContent.includes('JetBrains Mono') || htmlContent.includes('Fira Code') || htmlContent.includes('monospace');

            if (hasBg && hasCard && hasGreen && hasMonoFont) {
                console.log(`  ✅ PASS: Dashboard HTML served cleanly with mandated dark slate theme colors (#0d1117, #161b22, #238636) and monospace figures.`);
                passedCount++;
            } else {
                console.error(`  ❌ FAIL: Dashboard HTML missing dark theme style compliance. hasBg:${hasBg}, hasCard:${hasCard}, hasGreen:${hasGreen}, hasMonoFont:${hasMonoFont}`);
            }
        } else {
            console.error(`  ❌ FAIL: HTTP Status ${resHtml.statusCode}`);
        }

    } catch (err) {
        console.error(`❌ EXCEPTION during test execution:`, err);
    } finally {
        await new Promise((resolve) => {
            server.close(() => {
                console.log(`\n[SHUTDOWN] Server cleanly closed.`);
                resolve();
            });
        });
    }

    console.log(`\n====================================================`);
    console.log(`  TEST RESULTS: ${passedCount}/${totalTests} PASSED`);
    console.log(`====================================================\n`);

    if (passedCount === totalTests) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

if (require.main === module) {
    runTests();
}
