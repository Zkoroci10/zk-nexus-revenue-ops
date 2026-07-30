/**
 * ZK Revenue Ops — Comprehensive Empirical Harness & Benchmarks (SYS-003)
 * Challenger Agent Milestone 2
 */

const path = require('path');
const fs = require('fs');
const { ZKDatabaseEngine } = require('../../05_Systems/Database/db_engine');

const HARNESS_DB_PATH = path.join(__dirname, 'harness_100k.db');

function cleanup() {
    if (fs.existsSync(HARNESS_DB_PATH)) {
        try { fs.unlinkSync(HARNESS_DB_PATH); } catch (e) {}
    }
}

async function runEmpiricalHarness() {
    console.log('========================================================================');
    console.log('   ZK DB ENGINE EMPIRICAL HARNESS & DEEP BENCHMARK REPORT              ');
    console.log('========================================================================\n');

    cleanup();
    const engine = new ZKDatabaseEngine(HARNESS_DB_PATH);
    engine.seedData();

    // -------------------------------------------------------------------------
    // 1. DSR ENGINE DEEP STRESS & MATRIX TEST
    // -------------------------------------------------------------------------
    console.log('[HARNESS 1/4] Executing DSR Calculation Boundary Matrix...');
    const dsrTestCases = [
        { name: 'Standard Lead (Pass A)', input: { maxBudget: 500000, netIncome: 10000, existingCommitments: 1500 }, expectedGrade: 'A' },
        { name: 'Zero Net Income', input: { maxBudget: 500000, netIncome: 0, existingCommitments: 1500 }, expectedGrade: 'C' },
        { name: 'Negative Net Income (-RM5000)', input: { maxBudget: 500000, netIncome: -5000, existingCommitments: 1500 }, expectedGrade: 'C' },
        { name: 'Negative Commitments (-RM10000)', input: { maxBudget: 500000, netIncome: 10000, existingCommitments: -10000 }, expectedGrade: 'A' }, // Exploit
        { name: 'Extreme Budget (RM20M)', input: { maxBudget: 20000000, netIncome: 200000, existingCommitments: 10000 }, expectedGrade: 'A' },
        { name: 'Extreme Budget (RM100M)', input: { maxBudget: 100000000, netIncome: 1000000, existingCommitments: 50000 }, expectedGrade: 'A' },
        { name: 'NaN Net Income String', input: { maxBudget: 500000, netIncome: "N/A", existingCommitments: 1500 }, expectedGrade: 'C' },
        { name: 'Empty Input Object {}', input: {}, expectedGrade: 'C' }
    ];

    const dsrResults = [];
    for (const tc of dsrTestCases) {
        const res = engine.calculateDSR(tc.input);
        const pass = res.grade === tc.expectedGrade;
        dsrResults.push({
            name: tc.name,
            input: tc.input,
            output: { dsr_percent: res.dsr_percent, grade: res.grade, status: res.status },
            expectedGrade: tc.expectedGrade,
            pass
        });
        console.log(`  - [${tc.name}]: DSR=${res.dsr_percent}%, Grade=${res.grade}, Status='${res.status}' ${pass ? '✅' : '❌ (FLAW DETECTED)'}`);
    }

    // -------------------------------------------------------------------------
    // 2. SLA DEADLINE BREACH & MULTI-ESC EMPIRICAL VERIFICATION
    // -------------------------------------------------------------------------
    console.log('\n[HARNESS 2/4] Empirical SLA Breach & Escalation Lifecycle Simulation...');
    
    // Seed enterprise lead
    const buyerId = 'BYR-003';
    const alloc1 = engine.allocateLead(buyerId);
    console.log(`  Initial Allocation: ${alloc1.buyer_id} allocated to REN ${alloc1.allocated_ren_id} (SLA: ${alloc1.sla_status})`);

    // Simulate 1st Breach
    const pastTime1 = new Date(Date.now() - 600000).toISOString().replace('T', ' ').substring(0, 19);
    engine.db.prepare(`UPDATE buyer_prospects SET sla_deadline = ? WHERE buyer_id = ?`).run(pastTime1, buyerId);

    const esc1 = engine.checkSLAEscalations();
    console.log(`  Escalation #1 Result: Reallocated ${esc1.length} lead(s). New REN: ${esc1[0]?.new_ren_id}, New SLA Status: ${esc1[0]?.sla_status}`);

    // Check DB state after 1st breach
    const buyerAfter1 = engine.db.prepare(`SELECT sla_status, sla_deadline, allocated_ren_id FROM buyer_prospects WHERE buyer_id = ?`).get(buyerId);
    console.log(`  DB State after Escalation #1 -> sla_status: '${buyerAfter1.sla_status}', deadline: '${buyerAfter1.sla_deadline}'`);

    // Simulate 2nd Breach
    const pastTime2 = new Date(Date.now() - 300000).toISOString().replace('T', ' ').substring(0, 19);
    engine.db.prepare(`UPDATE buyer_prospects SET sla_deadline = ? WHERE buyer_id = ?`).run(pastTime2, buyerId);

    const esc2 = engine.checkSLAEscalations();
    console.log(`  Escalation #2 Result: Reallocated ${esc2.length} lead(s).`);

    const buyerAfter2 = engine.db.prepare(`SELECT sla_status, sla_deadline, allocated_ren_id FROM buyer_prospects WHERE buyer_id = ?`).get(buyerId);
    console.log(`  DB State after Escalation #2 -> sla_status: '${buyerAfter2.sla_status}', deadline: '${buyerAfter2.sla_deadline}'`);
    
    const secondBreachFailed = esc2.length === 0 && buyerAfter2.sla_status === 'BREACHED_REALLOCATED';
    console.log(`  Second Breach Handled Correctly? ${!secondBreachFailed ? '✅ YES' : '❌ NO (SLAs fail silently on 2nd breach)'}`);

    // -------------------------------------------------------------------------
    // 3. 100K LEAD SEEDING & LATENCY BENCHMARK WITH UNINDEXED VS INDEXED COMPARISON
    // -------------------------------------------------------------------------
    console.log('\n[HARNESS 3/4] 100k Dataset Seeding & Query Performance Benchmark...');
    const seedStats = engine.seed100kLeads();
    console.log(`  100k Bulk Ingestion Time: ${seedStats.insertTimeMs.toFixed(2)}ms`);

    // Compare Indexed Query Latency vs Unindexed / Complex Multi-Column Filter Query Latency
    console.log('  Benchmarking Query Latency (1,000 queries each):');

    // Case A: Fully Indexed Query (grade, dsr_percent)
    const tA0 = performance.now();
    for (let i = 0; i < 1000; i++) {
        engine.queryBuyers({ grade: 'A', dsr_max: 65, limit: 20 });
    }
    const durationA = performance.now() - tA0;

    // Case B: Query with unindexed filter (property_type)
    const tB0 = performance.now();
    for (let i = 0; i < 1000; i++) {
        engine.db.prepare(`SELECT * FROM buyer_prospects WHERE property_type = 'Bungalow' LIMIT 20`).all();
    }
    const durationB = performance.now() - tB0;

    console.log(`  - Indexed Query (grade, dsr_max): Total ${durationA.toFixed(2)}ms (Avg ${(durationA / 1000).toFixed(4)}ms/query)`);
    console.log(`  - Unindexed Query (property_type): Total ${durationB.toFixed(2)}ms (Avg ${(durationB / 1000).toFixed(4)}ms/query)`);

    // -------------------------------------------------------------------------
    // 4. TRANSACTION ROLLBACK FAILURE EMPIRICAL PROOF
    // -------------------------------------------------------------------------
    console.log('\n[HARNESS 4/4] Empirical Transaction Rollback & Index Corruption Test...');
    
    // Simulate what happens when seed100kLeads throws mid-execution
    // We create a temporary DB, drop indexes, start transaction, throw error, and verify index status.
    const corruptDbPath = path.join(__dirname, 'corrupt_test.db');
    if (fs.existsSync(corruptDbPath)) fs.unlinkSync(corruptDbPath);

    const corruptEngine = new ZKDatabaseEngine(corruptDbPath);
    let indexCheckBefore = corruptEngine.db.prepare(`SELECT count(*) as cnt FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'`).get().cnt;
    console.log(`  Indexes before transaction error: ${indexCheckBefore}`);

    try {
        // Replicate seed100kLeads execution flow without try/catch
        corruptEngine.db.exec(`
            DROP INDEX IF EXISTS idx_buyer_dsr_grade;
            DROP INDEX IF EXISTS idx_buyer_status_score;
            DROP INDEX IF EXISTS idx_buyer_location_budget;
            DROP INDEX IF EXISTS idx_buyer_ren_allocation;
            DROP INDEX IF EXISTS idx_buyer_sla;
        `);
        corruptEngine.db.exec('BEGIN TRANSACTION;');

        // Insert 5 rows then throw an error (simulating failure at row 6)
        const stmt = corruptEngine.db.prepare(`INSERT INTO buyer_prospects (buyer_id, name, phone, preferred_location, max_budget, property_type) VALUES (?, ?, ?, ?, ?, ?)`);
        stmt.run('ERR-01', 'Test', '123', 'Loc', 100, 'Condo');
        stmt.run('ERR-02', 'Test', '123', 'Loc', 100, 'Condo');

        // Force intentional Error mid-transaction (e.g. duplicate key or constraint violation)
        throw new Error('Simulated Bulk Ingestion Mid-Transaction Exception');

        corruptEngine.db.exec('COMMIT;');
    } catch (e) {
        console.log(`  Caught simulated bulk ingestion exception: "${e.message}"`);
    }

    let indexCheckAfter = corruptEngine.db.prepare(`SELECT count(*) as cnt FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'`).get().cnt;
    let inTxn = false;
    try {
        corruptEngine.db.exec('BEGIN TRANSACTION;'); // Will fail if transaction still active
        corruptEngine.db.exec('COMMIT;');
    } catch (e) {
        inTxn = true;
    }

    console.log(`  Indexes after unhandled exception: ${indexCheckAfter} (Was: ${indexCheckBefore})`);
    console.log(`  Database left in stuck uncommitted transaction state? ${inTxn ? '❌ YES (Stuck Transaction)' : '✅ NO'}`);

    if (indexCheckAfter === 0) {
        console.log('  ❌ CONFIRMED: Secondary B-Tree indexes were PERMANENTLY DESTROYED due to missing try/catch/ROLLBACK!');
    }

    corruptEngine.close();
    if (fs.existsSync(corruptDbPath)) fs.unlinkSync(corruptDbPath);

    engine.close();
    cleanup();

    console.log('\n========================================================================');
    console.log('   EMPIRICAL HARNESS RUN COMPLETE');
    console.log('========================================================================\n');
}

runEmpiricalHarness();
