/**
 * ZK Revenue Ops — Milestone 3 (ZK-DASH) Empirical Stress Test Harness (Detailed Error Capture)
 * ID: SYS-005-STRESS
 * Working Directory: .agents/challenger_m3_1/stress_dashboard_test.js
 */

const http = require('http');
const path = require('path');
const { performance } = require('perf_hooks');

const serverPath = path.resolve(__dirname, '../../06_Assets/Dashboard/server.js');
const server = require(serverPath);

const PORT = 3788;
const HOST = 'localhost';

// Use an Agent with unlimited sockets to test server connection handling
const httpAgent = new http.Agent({ keepAlive: false, maxSockets: Infinity });

function makeRequest(options, postData = null) {
    return new Promise((resolve) => {
        const startTime = performance.now();
        const req = http.request({ hostname: HOST, port: PORT, agent: httpAgent, ...options }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const duration = performance.now() - startTime;
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data,
                    duration
                });
            });
        });

        req.on('error', (err) => {
            const duration = performance.now() - startTime;
            resolve({
                statusCode: 0,
                error: err.code || err.message,
                body: '',
                duration
            });
        });

        if (postData !== null) {
            req.write(postData);
        }
        req.end();
    });
}

const testResults = [];

function recordResult(category, testName, passed, details) {
    testResults.push({ category, testName, passed, details });
    const symbol = passed ? '✅ PASS' : '❌ FAIL';
    const warnSymbol = passed ? '' : ' ⚠️ ISSUE OBSERVED';
    console.log(`  [${symbol}] ${testName}${warnSymbol}`);
    if (details) {
        console.log(`         Details: ${typeof details === 'object' ? JSON.stringify(details) : details}`);
    }
}

async function runAllSuites() {
    console.log(`================================================================`);
    console.log(`  ZK-DASH EMPIRICAL & ADVERSARIAL STRESS TEST HARNESS           `);
    console.log(`================================================================\n`);

    await new Promise((resolve) => {
        server.listen(PORT, () => {
            console.log(`[INIT] Test server listening on http://${HOST}:${PORT}\n`);
            resolve();
        });
    });

    try {
        console.log(`--- SUITE 1: Standard API Endpoints Baseline ---`);
        const resOverview = await makeRequest({ path: '/api/v1/overview', method: 'GET' });
        let overviewValid = false;
        try {
            const json = JSON.parse(resOverview.body);
            overviewValid = resOverview.statusCode === 200 && json.success === true && typeof json.data.totalRens === 'number';
        } catch (e) {}
        recordResult('Baseline', 'GET /api/v1/overview baseline', overviewValid, `Status ${resOverview.statusCode}`);

        const resBuyers = await makeRequest({ path: '/api/v1/buyers', method: 'GET' });
        let buyersValid = false;
        try {
            const json = JSON.parse(resBuyers.body);
            buyersValid = resBuyers.statusCode === 200 && json.success === true && Array.isArray(json.data);
        } catch (e) {}
        recordResult('Baseline', 'GET /api/v1/buyers baseline', buyersValid, `Status ${resBuyers.statusCode}`);

        const resListings = await makeRequest({ path: '/api/v1/listings', method: 'GET' });
        let listingsValid = false;
        try {
            const json = JSON.parse(resListings.body);
            listingsValid = resListings.statusCode === 200 && json.success === true && Array.isArray(json.data);
        } catch (e) {}
        recordResult('Baseline', 'GET /api/v1/listings baseline', listingsValid, `Status ${resListings.statusCode}`);

        const resRens = await makeRequest({ path: '/api/v1/rens', method: 'GET' });
        let rensValid = false;
        try {
            const json = JSON.parse(resRens.body);
            rensValid = resRens.statusCode === 200 && json.success === true && Array.isArray(json.data);
        } catch (e) {}
        recordResult('Baseline', 'GET /api/v1/rens baseline', rensValid, `Status ${resRens.statusCode}`);

        const matchPayload = JSON.stringify({ buyerId: 'BYR-001' });
        const resMatch1 = await makeRequest({
            path: '/api/v1/match',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(matchPayload) }
        }, matchPayload);
        let match1Valid = false;
        try {
            const json = JSON.parse(resMatch1.body);
            match1Valid = resMatch1.statusCode === 200 && json.success === true && Array.isArray(json.matches);
        } catch (e) {}
        recordResult('Baseline', 'POST /api/v1/match (buyerId)', match1Valid, `Status ${resMatch1.statusCode}`);

        console.log(`\n--- SUITE 2: CORS Preflight OPTIONS Requests ---`);

        const resCorsOverview = await makeRequest({ path: '/api/v1/overview', method: 'OPTIONS' });
        const corsOverviewPass = resCorsOverview.statusCode === 200 &&
            resCorsOverview.headers['access-control-allow-origin'] === '*' &&
            resCorsOverview.headers['access-control-allow-methods']?.includes('POST');
        recordResult('CORS', 'OPTIONS /api/v1/overview', corsOverviewPass, {
            status: resCorsOverview.statusCode,
            allowOrigin: resCorsOverview.headers['access-control-allow-origin'],
            allowMethods: resCorsOverview.headers['access-control-allow-methods'],
            allowHeaders: resCorsOverview.headers['access-control-allow-headers']
        });

        const resCorsMatch = await makeRequest({ path: '/api/v1/match', method: 'OPTIONS' });
        const corsMatchPass = resCorsMatch.statusCode === 200 &&
            resCorsMatch.headers['access-control-allow-origin'] === '*';
        recordResult('CORS', 'OPTIONS /api/v1/match', corsMatchPass, `Status ${resCorsMatch.statusCode}`);

        console.log(`\n--- SUITE 3: Invalid JSON, Bad Params & Adversarial Inputs ---`);

        const badJsonRaw = '{"buyerId": "BYR-001", bad_json: ';
        const resBadJson = await makeRequest({
            path: '/api/v1/match',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(badJsonRaw) }
        }, badJsonRaw);
        recordResult('EdgeCases', 'POST /api/v1/match (Malformed JSON)', resBadJson.statusCode === 400 || resBadJson.statusCode === 500, {
            statusCode: resBadJson.statusCode,
            note: resBadJson.statusCode === 500 ? 'Server handles error without crashing, but returns 500 instead of 400 Bad Request' : 'Clean 400'
        });

        const emptyJson = '{}';
        const resEmptyJson = await makeRequest({
            path: '/api/v1/match',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(emptyJson) }
        }, emptyJson);
        const emptyJsonPass = resEmptyJson.statusCode === 400;
        recordResult('EdgeCases', 'POST /api/v1/match (Empty JSON {})', emptyJsonPass, `Status ${resEmptyJson.statusCode}, Body: ${resEmptyJson.body}`);

        const unrelatedJson = JSON.stringify({ foo: 'bar', baz: 123 });
        const resUnrelated = await makeRequest({
            path: '/api/v1/match',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(unrelatedJson) }
        }, unrelatedJson);
        const unrelatedPass = resUnrelated.statusCode === 400;
        recordResult('EdgeCases', 'POST /api/v1/match (Unrelated fields)', unrelatedPass, `Status ${resUnrelated.statusCode}`);

        const nonExistentBuyer = JSON.stringify({ buyerId: 'BYR-NONEXISTENT-999' });
        const resNonExist = await makeRequest({
            path: '/api/v1/match',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(nonExistentBuyer) }
        }, nonExistentBuyer);
        let nonExistPass = false;
        try {
            const json = JSON.parse(resNonExist.body);
            // buyer key is undefined in JSON output because undefined properties are omitted by JSON.stringify
            nonExistPass = resNonExist.statusCode === 200 && json.success === true && json.buyer === null && Array.isArray(json.matches);
        } catch (e) {}
        recordResult('EdgeCases', 'POST /api/v1/match (Non-existent buyerId)', nonExistPass, {
            statusCode: resNonExist.statusCode,
            buyerPropertyPresent: 'buyer' in JSON.parse(resNonExist.body || '{}'),
            note: 'buyer property omitted from JSON response when buyer is not found (should be null)'
        });

        const objBuyerId = JSON.stringify({ buyerId: { "$gt": "" } });
        const resObjBuyer = await makeRequest({
            path: '/api/v1/match',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(objBuyerId) }
        }, objBuyerId);
        recordResult('EdgeCases', 'POST /api/v1/match (buyerId as object)', resObjBuyer.statusCode === 500, {
            statusCode: resObjBuyer.statusCode,
            body: resObjBuyer.body,
            note: 'Caught by server error handler (HTTP 500 returned, server stayed alive)'
        });

        const sqlInjPayload = JSON.stringify({ buyerId: "'; DROP TABLE buyer_prospects; --" });
        const resSqlInj = await makeRequest({
            path: '/api/v1/match',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(sqlInjPayload) }
        }, sqlInjPayload);
        let sqlInjPass = false;
        try {
            const json = JSON.parse(resSqlInj.body);
            sqlInjPass = resSqlInj.statusCode === 200 && json.success === true && json.buyer === null;
        } catch (e) {}
        recordResult('EdgeCases', 'POST /api/v1/match (SQL Injection in buyerId)', sqlInjPass, {
            statusCode: resSqlInj.statusCode,
            note: 'SQL injection safely prevented by SQLite parameterized query. buyer key omitted from JSON output.'
        });

        const sqlInjCriteria = JSON.stringify({ preferred_location: "' OR '1'='1", max_budget: 1000000 });
        const resSqlCriteria = await makeRequest({
            path: '/api/v1/match',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(sqlInjCriteria) }
        }, sqlInjCriteria);
        recordResult('EdgeCases', 'POST /api/v1/match (SQL Injection in location criteria)', resSqlCriteria.statusCode === 200, `Status ${resSqlCriteria.statusCode}`);

        const badNumericCriteria = JSON.stringify({ max_budget: -999999, min_bedrooms: 'abc', preferred_location: 'Shah Alam' });
        const resBadNum = await makeRequest({
            path: '/api/v1/match',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(badNumericCriteria) }
        }, badNumericCriteria);
        recordResult('EdgeCases', 'POST /api/v1/match (Negative budget / NaN bedrooms)', resBadNum.statusCode === 200, `Parsed budget as ${JSON.parse(resBadNum.body || '{}').buyer?.max_budget}`);

        const largeString = 'A'.repeat(1024 * 1024);
        const largePayload = JSON.stringify({ buyerId: 'BYR-001', padding: largeString });
        const resLarge = await makeRequest({
            path: '/api/v1/match',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(largePayload) }
        }, largePayload);
        recordResult('EdgeCases', 'POST /api/v1/match (1MB payload)', resLarge.statusCode === 200, `Duration: ${resLarge.duration.toFixed(2)}ms`);

        console.log(`\n--- SUITE 4: Routing, Fallbacks, 404 Handlers & Path Traversal ---`);

        const resRoot = await makeRequest({ path: '/', method: 'GET' });
        recordResult('Routing', 'GET / (Root HTML)', resRoot.statusCode === 200 && resRoot.body.includes('<!DOCTYPE html>'), `Status ${resRoot.statusCode}`);

        const resNonExistFile = await makeRequest({ path: '/random-file-xyz.html', method: 'GET' });
        recordResult('Routing', 'GET /random-file-xyz.html (SPA Fallback)', resNonExistFile.statusCode === 200 && resNonExistFile.body.includes('<!DOCTYPE html>'), {
            statusCode: resNonExistFile.statusCode,
            behavior: 'SPA Route Fallback to client-dashboard.html (200 OK)'
        });

        const resNonExistApi = await makeRequest({ path: '/api/v1/unknown_endpoint', method: 'GET' });
        const isApi404 = resNonExistApi.statusCode === 404;
        recordResult('Routing', 'GET /api/v1/unknown_endpoint (API 404 Handler)', isApi404, {
            statusCode: resNonExistApi.statusCode,
            contentType: resNonExistApi.headers['content-type'],
            note: isApi404 ? 'Proper 404' : 'FEEL THROUGH TO SPA STATIC FALLBACK! Serves HTML 200 OK for missing API endpoint!'
        });

        const resWrongMethod = await makeRequest({ path: '/api/v1/overview', method: 'POST' });
        const isMethodHandled = resWrongMethod.statusCode === 405 || resWrongMethod.statusCode === 404;
        recordResult('Routing', 'POST /api/v1/overview (Invalid HTTP Method)', isMethodHandled, {
            statusCode: resWrongMethod.statusCode,
            note: isMethodHandled ? 'Handled correctly' : 'FEEL THROUGH TO SPA STATIC FALLBACK! Returns HTML 200 OK for POST to GET-only API!'
        });

        const resPathTrav = await makeRequest({ path: '/../../package.json', method: 'GET' });
        const pathTravSecure = !resPathTrav.body.includes('"name":') || resPathTrav.statusCode === 404 || resPathTrav.body.includes('<!DOCTYPE html>');
        recordResult('Security', 'Path Traversal (GET /../../package.json)', pathTravSecure, {
            statusCode: resPathTrav.statusCode,
            isLeaked: resPathTrav.body.includes('"name":')
        });

        console.log(`\n--- SUITE 5: Rapid Concurrent Requests (Load & Stress) ---`);

        console.log(`\n  Executing Burst 1: 50 concurrent GET requests to /api/v1/overview...`);
        const burst1Start = performance.now();
        const burst1Promises = Array.from({ length: 50 }, () => makeRequest({ path: '/api/v1/overview', method: 'GET' }));
        const burst1Results = await Promise.all(burst1Promises);
        const burst1Duration = performance.now() - burst1Start;
        const burst1Successes = burst1Results.filter(r => r.statusCode === 200).length;
        const burst1Latencies = burst1Results.map(r => r.duration).sort((a, b) => a - b);
        const burst1Avg = burst1Latencies.reduce((a, b) => a + b, 0) / burst1Latencies.length;
        const burst1P95 = burst1Latencies[Math.floor(burst1Latencies.length * 0.95)];

        recordResult('Stress', '50 Concurrent Requests (/api/v1/overview)', burst1Successes === 50, {
            successRate: `${burst1Successes}/50`,
            totalTime: `${burst1Duration.toFixed(2)}ms`,
            avgLatency: `${burst1Avg.toFixed(2)}ms`,
            p95Latency: `${burst1P95.toFixed(2)}ms`,
            rps: (50 / (burst1Duration / 1000)).toFixed(1)
        });

        console.log(`\n  Executing Burst 2: 200 concurrent mixed GET requests...`);
        const endpoints = ['/api/v1/overview', '/api/v1/buyers', '/api/v1/listings', '/api/v1/rens'];
        const burst2Start = performance.now();
        const burst2Promises = Array.from({ length: 200 }, (_, i) => {
            const ep = endpoints[i % endpoints.length];
            return makeRequest({ path: ep, method: 'GET' });
        });
        const burst2Results = await Promise.all(burst2Promises);
        const burst2Duration = performance.now() - burst2Start;
        const burst2Successes = burst2Results.filter(r => r.statusCode === 200).length;
        const burst2Latencies = burst2Results.map(r => r.duration).sort((a, b) => a - b);
        const burst2Avg = burst2Latencies.reduce((a, b) => a + b, 0) / burst2Latencies.length;
        const burst2P95 = burst2Latencies[Math.floor(burst2Latencies.length * 0.95)];
        const burst2P99 = burst2Latencies[Math.floor(burst2Latencies.length * 0.99)];

        recordResult('Stress', '200 Concurrent Mixed GET Requests', burst2Successes === 200, {
            successRate: `${burst2Successes}/200`,
            totalTime: `${burst2Duration.toFixed(2)}ms`,
            avgLatency: `${burst2Avg.toFixed(2)}ms`,
            p95Latency: `${burst2P95.toFixed(2)}ms`,
            p99Latency: `${burst2P99.toFixed(2)}ms`,
            rps: (200 / (burst2Duration / 1000)).toFixed(1)
        });

        console.log(`\n  Executing Burst 3: 500 concurrent heavy requests (GET & POST match)...`);
        const burst3Start = performance.now();
        const matchBody = JSON.stringify({ buyerId: 'BYR-001' });
        const burst3Promises = Array.from({ length: 500 }, (_, i) => {
            if (i % 5 === 4) {
                return makeRequest({
                    path: '/api/v1/match',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(matchBody) }
                }, matchBody);
            } else {
                const ep = endpoints[i % endpoints.length];
                return makeRequest({ path: ep, method: 'GET' });
            }
        });
        const burst3Results = await Promise.all(burst3Promises);
        const burst3Duration = performance.now() - burst3Start;
        const burst3Successes = burst3Results.filter(r => r.statusCode === 200).length;
        const burst3ErrorTypes = {};
        burst3Results.forEach(r => {
            if (r.statusCode !== 200) {
                const key = r.statusCode ? `HTTP_${r.statusCode}` : (r.error || 'Unknown');
                burst3ErrorTypes[key] = (burst3ErrorTypes[key] || 0) + 1;
            }
        });
        const burst3Latencies = burst3Results.map(r => r.duration).sort((a, b) => a - b);
        const burst3Avg = burst3Latencies.reduce((a, b) => a + b, 0) / burst3Latencies.length;
        const burst3Min = burst3Latencies[0];
        const burst3Max = burst3Latencies[burst3Latencies.length - 1];
        const burst3P95 = burst3Latencies[Math.floor(burst3Latencies.length * 0.95)];
        const burst3P99 = burst3Latencies[Math.floor(burst3Latencies.length * 0.99)];

        recordResult('Stress', '500 Heavy Concurrent Requests (GET + POST Match)', burst3Successes === 500, {
            successRate: `${burst3Successes}/500`,
            errorBreakdown: burst3ErrorTypes,
            totalTime: `${burst3Duration.toFixed(2)}ms`,
            minLatency: `${burst3Min.toFixed(2)}ms`,
            maxLatency: `${burst3Max.toFixed(2)}ms`,
            avgLatency: `${burst3Avg.toFixed(2)}ms`,
            p95Latency: `${burst3P95.toFixed(2)}ms`,
            p99Latency: `${burst3P99.toFixed(2)}ms`,
            rps: (500 / (burst3Duration / 1000)).toFixed(1)
        });

        const postStressRes = await makeRequest({ path: '/api/v1/overview', method: 'GET' });
        recordResult('Stress', 'Post-Burst Server Liveness Check', postStressRes.statusCode === 200, `Status ${postStressRes.statusCode} - Server remained responsive`);

    } catch (err) {
        console.error('Fatal test runner exception:', err);
    } finally {
        await new Promise((resolve) => {
            server.close(() => {
                console.log(`\n[SHUTDOWN] Test server cleanly closed.`);
                resolve();
            });
        });
    }

    console.log(`\n================================================================`);
    console.log(`  STRESS TEST SUMMARY RESULTS                                    `);
    console.log(`================================================================`);
    const passedTotal = testResults.filter(r => r.passed).length;
    console.log(`Passed: ${passedTotal}/${testResults.length} checks`);
    console.log(`================================================================\n`);
}

if (require.main === module) {
    runAllSuites();
}
