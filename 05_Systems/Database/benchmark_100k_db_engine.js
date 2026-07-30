/**
 * ZK Revenue Ops — 100,000 Lead Database Engine SLA Benchmark Suite
 * ID: SYS-003
 * Module: 05_Systems/Database/benchmark_100k_db_engine.js
 * 
 * Verifies all 5 Milestone 2 SLA Criteria:
 *   1. 100k Bulk Ingestion < 3.0s
 *   2. Sub-10ms DSR Latency (avg < 0.1ms per item)
 *   3. Sub-50ms Query Latency for 1,000 random queries across 100k leads
 *   4. Multi-Agent Lead Allocation Engine (Tier 2 Round-Robin & Tier 3 Enterprise SLA Speed-to-Lead)
 *   5. Cloud Sync Bridge Integration
 */

const path = require('path');
const fs = require('fs');
const { ZKDatabaseEngine } = require('./db_engine');
const { CloudSyncBridge } = require('./cloud_sync_bridge');

const BENCHMARK_DB_PATH = path.join(__dirname, 'benchmark_100k.db');

async function run100kBenchmark() {
    console.log('========================================================================');
    console.log('   ZK REVENUE OPS 100,000 LEAD DB ENGINE BENCHMARK SUITE (SYS-003)    ');
    console.log('========================================================================\n');

    // Remove old benchmark DB if exists
    if (fs.existsSync(BENCHMARK_DB_PATH)) {
        fs.unlinkSync(BENCHMARK_DB_PATH);
    }

    const engine = new ZKDatabaseEngine(BENCHMARK_DB_PATH);
    engine.seedData(); // Seed initial RENs

    let passedBenchmarkTests = 0;
    const totalBenchmarkTests = 5;

    // =========================================================================
    // BENCHMARK TEST 1: High-Volume 100k Bulk Ingestion (< 3.0s SLA)
    // =========================================================================
    try {
        console.log('[BENCHMARK TEST 1/5] Testing 100,000 Lead Bulk Ingestion Speed (< 3.0s SLA)...');
        
        const seedStats = engine.seed100kLeads();
        const totalCount = engine.db.prepare(`SELECT COUNT(*) as count FROM buyer_prospects`).get().count;

        console.log(`  Records Generated: ${seedStats.recordsInserted.toLocaleString()}`);
        console.log(`  Generation Time : ${seedStats.generateTimeMs.toFixed(2)}ms`);
        console.log(`  SQLite Insert Time: ${seedStats.insertTimeMs.toFixed(2)}ms (${(seedStats.insertTimeMs / 1000).toFixed(3)}s)`);
        console.log(`  Total Seed Time : ${seedStats.totalTimeMs.toFixed(2)}ms (${(seedStats.totalTimeMs / 1000).toFixed(3)}s)`);
        console.log(`  DB Lead Count   : ${totalCount.toLocaleString()}`);

        if (totalCount >= 100000 && seedStats.insertTimeMs < 3000) {
            console.log(`  ✅ PASS: 100k leads inserted in ${seedStats.insertTimeMs.toFixed(2)}ms (< 3,000ms SLA target).\n`);
            passedBenchmarkTests++;
        } else {
            console.error(`  ❌ FAIL: Bulk ingestion benchmark failed SLA! Insert time: ${seedStats.insertTimeMs}ms, Count: ${totalCount}\n`);
        }
    } catch (e) {
        console.error('  ❌ FAIL Benchmark Test 1:', e.message, '\n');
    }

    // =========================================================================
    // BENCHMARK TEST 2: Automated DSR Loan Qualification Engine Latency (< 10ms SLA, avg < 0.1ms)
    // =========================================================================
    try {
        console.log('[BENCHMARK TEST 2/5] Testing DSR Calculation Latency across 100,000 Lead Batch...');
        
        const sampleLeads = engine.db.prepare(`SELECT * FROM buyer_prospects LIMIT 100000`).all();
        const startTime = performance.now();
        let maxSingleLatency = 0;

        for (let i = 0; i < sampleLeads.length; i++) {
            const l = sampleLeads[i];
            const t0 = performance.now();
            engine.calculateDSR({
                maxBudget: l.max_budget,
                netIncome: l.net_income,
                existingCommitments: l.existing_commitments,
                score: l.lead_score
            });
            const t1 = performance.now() - t0;
            if (t1 > maxSingleLatency) maxSingleLatency = t1;
        }

        const totalBatchTime = performance.now() - startTime;
        const avgLatencyPerLead = totalBatchTime / sampleLeads.length;

        console.log(`  Total Batch Calculations : ${sampleLeads.length.toLocaleString()}`);
        console.log(`  Total Execution Time     : ${totalBatchTime.toFixed(2)}ms`);
        console.log(`  Average Latency per Item : ${avgLatencyPerLead.toFixed(5)}ms (${(avgLatencyPerLead * 1000).toFixed(2)} µs)`);
        console.log(`  Peak Latency Single Item : ${maxSingleLatency.toFixed(4)}ms`);

        if (avgLatencyPerLead < 0.1 && maxSingleLatency < 10) {
            console.log(`  ✅ PASS: Average DSR calculation latency is ${avgLatencyPerLead.toFixed(5)}ms (< 0.1ms SLA target).\n`);
            passedBenchmarkTests++;
        } else {
            console.error(`  ❌ FAIL: DSR calculation latency exceeded threshold! Avg: ${avgLatencyPerLead}ms, Peak: ${maxSingleLatency}ms\n`);
        }
    } catch (e) {
        console.error('  ❌ FAIL Benchmark Test 2:', e.message, '\n');
    }

    // =========================================================================
    // BENCHMARK TEST 3: Indexed Query Evaluation Latency (< 50ms SLA across 1,000 Random Queries)
    // =========================================================================
    try {
        console.log('[BENCHMARK TEST 3/5] Testing Filtered Query Latency across 1,000 Random Queries on 100k Dataset...');

        const locations = ["Setia Alam, Shah Alam", "Bangi, Selangor", "Cyberjaya", "Damansara Heights", "Puchong, Selangor", "Cheras, KL", "Petaling Jaya"];
        const statuses = ["Qualified (Hot)", "Nurturing (Warm)", "DSR Failed (Unqualified)", "Viewing Scheduled", "Dormant (Cold)"];
        const grades = ["A", "B", "C"];
        const rens = ["REN-001", "REN-002", "REN-003", "REN-004"];

        const latencies = [];

        for (let q = 0; q < 1000; q++) {
            const queryType = q % 5;
            let filters = {};

            if (queryType === 0) {
                // Uses idx_buyer_dsr_grade
                filters = { grade: grades[q % grades.length], dsr_max: 75 };
            } else if (queryType === 1) {
                // Uses idx_buyer_status_score
                filters = { status: statuses[q % statuses.length], min_score: 50, orderBy: 'lead_score DESC' };
            } else if (queryType === 2) {
                // Uses idx_buyer_location_budget
                filters = { preferred_location: locations[q % locations.length], max_budget: 1000000 };
            } else if (queryType === 3) {
                // Uses idx_buyer_ren_allocation
                filters = { allocated_ren_id: rens[q % rens.length] };
            } else {
                // Uses idx_buyer_sla
                filters = { sla_status: 'UNASSIGNED' };
            }

            filters.limit = 50;

            const t0 = performance.now();
            const results = engine.queryBuyers(filters);
            const duration = performance.now() - t0;
            latencies.push(duration);
        }

        latencies.sort((a, b) => a - b);
        const sum = latencies.reduce((acc, v) => acc + v, 0);
        const avg = sum / latencies.length;
        const p50 = latencies[Math.floor(latencies.length * 0.50)];
        const p95 = latencies[Math.floor(latencies.length * 0.95)];
        const p99 = latencies[Math.floor(latencies.length * 0.99)];
        const maxQueryTime = latencies[latencies.length - 1];

        console.log(`  Total Queries Executed: 1,000`);
        console.log(`  Average Query Latency : ${avg.toFixed(4)}ms`);
        console.log(`  p50 Query Latency     : ${p50.toFixed(4)}ms`);
        console.log(`  p95 Query Latency     : ${p95.toFixed(4)}ms`);
        console.log(`  p99 Query Latency     : ${p99.toFixed(4)}ms`);
        console.log(`  Max Query Latency     : ${maxQueryTime.toFixed(4)}ms`);

        if (p95 < 50 && p99 < 50) {
            console.log(`  ✅ PASS: p95 (${p95.toFixed(3)}ms) and p99 (${p99.toFixed(3)}ms) query latencies are well under 50ms SLA target.\n`);
            passedBenchmarkTests++;
        } else {
            console.error(`  ❌ FAIL: Query latency benchmark exceeded 50ms SLA limit! p95: ${p95}ms, p99: ${p99}ms\n`);
        }
    } catch (e) {
        console.error('  ❌ FAIL Benchmark Test 3:', e.message, '\n');
    }

    // =========================================================================
    // BENCHMARK TEST 4: Multi-Agent Lead Allocation & SLA Speed-to-Lead Priority Routing
    // =========================================================================
    try {
        console.log('[BENCHMARK TEST 4/5] Testing Multi-Agent Lead Allocation & SLA Escalation Logic...');

        // 1. Enterprise Lead SLA Priority Routing
        const enterpriseLead = engine.db.prepare(`
            SELECT buyer_id FROM buyer_prospects WHERE grade = 'A' AND max_budget >= 1000000 LIMIT 1
        `).get();

        let alloc1 = engine.allocateLead(enterpriseLead.buyer_id);
        console.log(`  Tier 3 SLA Routing -> Lead: ${alloc1.buyer_id}, Strategy: ${alloc1.allocation_strategy}, REN Tier: ${alloc1.ren_tier}, SLA Status: ${alloc1.sla_status}`);

        // 2. Standard Lead Dynamic Round-Robin Routing
        const standardLead = engine.db.prepare(`
            SELECT buyer_id FROM buyer_prospects WHERE grade = 'C' AND max_budget < 500000 LIMIT 1
        `).get();

        let alloc2 = engine.allocateLead(standardLead.buyer_id);
        console.log(`  Tier 2 Round-Robin -> Lead: ${alloc2.buyer_id}, Strategy: ${alloc2.allocation_strategy}, REN Tier: ${alloc2.ren_tier}`);

        // 3. Test SLA Breach & Escalation
        const pastDeadline = new Date(Date.now() - 10 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
        engine.db.prepare(`UPDATE buyer_prospects SET sla_deadline = ? WHERE buyer_id = ?`).run(pastDeadline, enterpriseLead.buyer_id);

        const escalations = engine.checkSLAEscalations();
        console.log(`  SLA Escalation Scanner -> Reallocated ${escalations.length} expired lead(s).`);

        const isEnterpriseSuccess = alloc1.allocation_strategy === 'SLA_ENTERPRISE_PRIORITY' && alloc1.sla_status === 'PENDING';
        const isStandardSuccess = alloc2.allocation_strategy === 'DYNAMIC_ROUND_ROBIN';
        const isEscalationSuccess = escalations.length > 0 && escalations[0].buyer_id === enterpriseLead.buyer_id;

        if (isEnterpriseSuccess && isStandardSuccess && isEscalationSuccess) {
            console.log('  ✅ PASS: Multi-Agent Routing & SLA Escalations operated cleanly under load.\n');
            passedBenchmarkTests++;
        } else {
            console.error('  ❌ FAIL: Multi-Agent Allocation logic benchmark failed verification!\n');
        }
    } catch (e) {
        console.error('  ❌ FAIL Benchmark Test 4:', e.message, '\n');
    }

    // =========================================================================
    // BENCHMARK TEST 5: Cloud Sync Bridge Integration (100k Dataset Sync)
    // =========================================================================
    try {
        console.log('[BENCHMARK TEST 5/5] Testing Cloud Sync Bridge on 100k Dataset...');

        const bridge = new CloudSyncBridge(engine);
        const pushRes = await bridge.pushLocalToCloud();
        const pullRes = await bridge.pullCloudToLocal();

        console.log(`  Push Result : Status=${pushRes.status}, Records Pushed=${pushRes.notion.recordsCount}`);
        console.log(`  Pull Result : Status=${pullRes.status}, Records Reconciled=${pullRes.recordsReconciled}`);

        if (pushRes.status === 'SUCCESS' && pullRes.status === 'SUCCESS') {
            console.log('  ✅ PASS: Cloud Sync Bridge successfully reconciled database state.\n');
            passedBenchmarkTests++;
        } else {
            console.error('  ❌ FAIL: Cloud Sync Bridge failed to reconcile dataset!\n');
        }
    } catch (e) {
        console.error('  ❌ FAIL Benchmark Test 5:', e.message, '\n');
    }

    // Close engine and clean up benchmark DB file
    engine.close();
    if (fs.existsSync(BENCHMARK_DB_PATH)) {
        try { fs.unlinkSync(BENCHMARK_DB_PATH); } catch (e) {}
    }

    console.log('========================================================================');
    console.log(`  BENCHMARK RESULTS: ${passedBenchmarkTests}/${totalBenchmarkTests} PASSED`);
    console.log('========================================================================\n');

    if (passedBenchmarkTests === totalBenchmarkTests) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

run100kBenchmark();
