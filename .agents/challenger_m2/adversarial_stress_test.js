/**
 * ZK Revenue Ops — Adversarial Stress Test & Vulnerability Harness (SYS-003)
 * Challenger Agent Milestone 2
 */

const path = require('path');
const fs = require('fs');
const { ZKDatabaseEngine } = require('../../05_Systems/Database/db_engine');
const { CloudSyncBridge } = require('../../05_Systems/Database/cloud_sync_bridge');

const TEST_DB_PATH = path.join(__dirname, 'challenger_stress_test.db');

function cleanup() {
    if (fs.existsSync(TEST_DB_PATH)) {
        try { fs.unlinkSync(TEST_DB_PATH); } catch (e) {}
    }
}

async function runAdversarialSuite() {
    console.log('========================================================================');
    console.log('   ZK DB ENGINE ADVERSARIAL STRESS TEST & VULNERABILITY HARNESS        ');
    console.log('========================================================================\n');

    cleanup();

    const findings = [];

    // =========================================================================
    // SECTION 1: DSR Calculation Edge Cases & Sanity Boundary Vulnerabilities
    // =========================================================================
    console.log('[CATEGORY 1] Testing DSR Calculation Edge Cases...');
    const engine = new ZKDatabaseEngine(TEST_DB_PATH);

    // Scenario 1.1: Zero Net Income
    try {
        const resZeroInc = engine.calculateDSR({ maxBudget: 500000, netIncome: 0, existingCommitments: 1000 });
        console.log(`  1.1 Zero Net Income -> DSR: ${resZeroInc.dsr_percent}%, Grade: ${resZeroInc.grade}, Status: '${resZeroInc.status}'`);
        if (resZeroInc.dsr_percent !== 100 || resZeroInc.grade !== 'C') {
            findings.push({ id: 'DSR-01', severity: 'MEDIUM', title: 'Zero Net Income mishandled', details: JSON.stringify(resZeroInc) });
        }
    } catch (e) {
        console.log('  1.1 Exception on zero income:', e.message);
        findings.push({ id: 'DSR-01-ERR', severity: 'HIGH', title: 'Zero net income caused exception', error: e.message });
    }

    // Scenario 1.2: Negative Commitments (Debt Masking / Exploit)
    try {
        const resNegComm = engine.calculateDSR({ maxBudget: 500000, netIncome: 10000, existingCommitments: -10000 });
        console.log(`  1.2 Negative Commitments (-RM10k) -> DSR: ${resNegComm.dsr_percent}%, Grade: ${resNegComm.grade}, Status: '${resNegComm.status}'`);
        if (resNegComm.dsr_percent < 0 || resNegComm.grade === 'A') {
            findings.push({
                id: 'DSR-VULN-01',
                severity: 'HIGH',
                title: 'Negative Commitments Vulnerability (Debt Masking Exploit)',
                details: `Passing negative commitments (-RM10k) resulted in DSR=${resNegComm.dsr_percent}% and Grade=${resNegComm.grade} (${resNegComm.status}), illegally qualifying toxic leads!`
            });
        }
    } catch (e) {
        console.log('  1.2 Exception on negative commitments:', e.message);
    }

    // Scenario 1.3: Extreme Property Budget (> RM10M / RM100M) without Income Verification
    try {
        const resExtreme = engine.calculateDSR({ maxBudget: 50000000, netIncome: 500000, existingCommitments: 10000 });
        console.log(`  1.3 Extreme Budget (RM50M) -> Installment: RM${resExtreme.est_installment.toLocaleString()}, DSR: ${resExtreme.dsr_percent}%, Grade: ${resExtreme.grade}`);
    } catch (e) {
        console.log('  1.3 Exception on extreme budget:', e.message);
    }

    // Scenario 1.4: Missing / Null / Invalid Data Inputs
    try {
        const resNaN = engine.calculateDSR({ maxBudget: "invalid_string", netIncome: "not_a_number", existingCommitments: null });
        console.log(`  1.4 Invalid NaN String inputs -> DSR: ${resNaN.dsr_percent}, Grade: ${resNaN.grade}, Status: '${resNaN.status}'`);
        if (Number.isNaN(resNaN.dsr_percent)) {
            findings.push({
                id: 'DSR-VULN-02',
                severity: 'MEDIUM',
                title: 'NaN Propagation in DSR Engine',
                details: 'Invalid string inputs propagate NaN into dsr_percent output without throwing input validation error or falling back safely.'
            });
        }
    } catch (e) {
        console.log('  1.4 Exception on invalid inputs:', e.message);
    }

    // Scenario 1.5: Null/Undefined leadData parameter
    try {
        engine.calculateDSR(null);
        console.log('  1.5 calculateDSR(null) succeeded unexpectedly');
    } catch (e) {
        console.log(`  1.5 calculateDSR(null) threw expected exception: ${e.message}`);
    }

    // =========================================================================
    // SECTION 2: SLA Deadline Breach & Escalation Logic Edge Cases
    // =========================================================================
    console.log('\n[CATEGORY 2] Testing SLA Deadline Breach & Escalation Logic...');
    engine.seedData();

    // Scenario 2.1: Multi-Breach Escalation Failure (Second-Breach Blind Spot)
    try {
        // Create an enterprise lead BYR-003 and allocate to REN-004
        const alloc = engine.allocateLead('BYR-003');
        console.log(`  2.1 initial allocation: ${alloc.buyer_id} -> ${alloc.allocated_ren_id}, SLA Status: ${alloc.sla_status}`);

        // Set SLA deadline to past (Breach 1)
        const pastDate1 = new Date(Date.now() - 10 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
        engine.db.prepare(`UPDATE buyer_prospects SET sla_deadline = ? WHERE buyer_id = 'BYR-003'`).run(pastDate1);

        // Run SLA Escalation #1
        const esc1 = engine.checkSLAEscalations();
        console.log(`  2.1 First Escalation Result: count=${esc1.length}, status=${esc1[0]?.sla_status}, new_deadline=${esc1[0]?.new_sla_deadline}`);

        // Now set SLA deadline to past AGAIN (Breach 2)
        const pastDate2 = new Date(Date.now() - 5 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
        engine.db.prepare(`UPDATE buyer_prospects SET sla_deadline = ? WHERE buyer_id = 'BYR-003'`).run(pastDate2);

        // Run SLA Escalation #2
        const esc2 = engine.checkSLAEscalations();
        console.log(`  2.1 Second Escalation Result: count=${esc2.length}`);

        if (esc2.length === 0) {
            findings.push({
                id: 'SLA-VULN-01',
                severity: 'HIGH',
                title: 'Multi-Breach Escalation Blind Spot (Permanent Unhandled Breach)',
                details: 'When a lead breaches SLA a 2nd time after being reallocated, checkSLAEscalations ignores it because sla_status is set to "BREACHED_REALLOCATED" instead of "PENDING". Lead remains permanently abandoned.'
            });
        }
    } catch (e) {
        console.log('  2.1 Error in multi-breach escalation test:', e.message);
    }

    // Scenario 2.2: REN Status Changes (All Enterprise RENs Inactive / Busy)
    try {
        // Mark all Enterprise RENs Inactive
        engine.db.prepare(`UPDATE ren_clients SET status = 'Inactive' WHERE tier = 'Enterprise'`).run();

        // Try to allocate an enterprise lead
        let allocResult = null;
        try {
            allocResult = engine.allocateLead('BYR-002');
            console.log(`  2.2 Fallback allocation when Enterprise RENs inactive -> REN: ${allocResult.allocated_ren_id}, Strategy: ${allocResult.allocation_strategy}, SLA Status: ${allocResult.sla_status}`);
            if (allocResult.allocation_strategy === 'DYNAMIC_ROUND_ROBIN' && allocResult.sla_status === 'N/A') {
                console.log('      Notice: Enterprise lead degraded to DYNAMIC_ROUND_ROBIN without SLA monitoring when Enterprise RENs inactive!');
            }
        } catch (e) {
            console.log(`  2.2 Allocation error when all Enterprise RENs inactive: ${e.message}`);
        }

        // What if ALL RENs are inactive?
        engine.db.prepare(`UPDATE ren_clients SET status = 'Inactive'`).run();
        try {
            engine.allocateLead('BYR-001');
            console.log('  2.2 ERROR: Allocation succeeded when ALL RENs inactive!');
            findings.push({ id: 'SLA-VULN-02', severity: 'HIGH', title: 'Lead allocated to inactive REN', details: 'allocateLead assigned lead to REN despite all RENs set to Inactive' });
        } catch (e) {
            console.log(`  2.2 All RENs Inactive correctly rejected allocation: ${e.message}`);
        }

        // Restore RENs to Active
        engine.db.prepare(`UPDATE ren_clients SET status = 'Active'`).run();
    } catch (e) {
        console.log('  2.2 Error in REN status change test:', e.message);
    }

    // Scenario 2.3: Active Lead Count Underflow / Negative Leads Protection Check
    try {
        engine.db.prepare(`UPDATE ren_clients SET active_leads_count = 0`).run();
        // Manually manipulate buyer to trigger decrement on REN-001
        engine.db.prepare(`UPDATE buyer_prospects SET allocated_ren_id = 'REN-001' WHERE buyer_id = 'BYR-001'`).run();
        engine.allocateLead('BYR-001'); // Allocates to REN-002/003/004 and decrements REN-001
        const ren1 = engine.db.prepare(`SELECT active_leads_count FROM ren_clients WHERE ren_id = 'REN-001'`).get();
        console.log(`  2.3 Active Lead Count for REN-001 after decrement from 0: ${ren1.active_leads_count}`);
        if (ren1.active_leads_count < 0) {
            findings.push({ id: 'REN-VULN-01', severity: 'MEDIUM', title: 'Active lead count underflow', details: `active_leads_count dropped to ${ren1.active_leads_count}` });
        }
    } catch (e) {
        console.log('  2.3 Error testing lead count underflow:', e.message);
    }

    // =========================================================================
    // SECTION 3: 100k Lead Database Query Latency & Security Stress
    // =========================================================================
    console.log('\n[CATEGORY 3] Testing Query Engine Security & High-Frequency Latency...');

    // Scenario 3.1: SQL Injection in `queryBuyers` via `orderBy`
    try {
        const sqlInjPayload = "lead_score DESC; UPDATE ren_clients SET commission_rate = 0.99;";
        engine.queryBuyers({ orderBy: sqlInjPayload, limit: 5 });
        const renCheck = engine.db.prepare(`SELECT commission_rate FROM ren_clients WHERE ren_id = 'REN-001'`).get();
        console.log(`  3.1 SQL Injection test execution completed. REN-001 commission rate: ${renCheck.commission_rate}`);
        if (renCheck.commission_rate === 0.99) {
            findings.push({
                id: 'SEC-VULN-01',
                severity: 'CRITICAL',
                title: 'SQL Injection Vulnerability in queryBuyers (orderBy Parameter)',
                details: 'Unsanitized string interpolation in queryBuyers (ORDER BY ${filters.orderBy}) allows arbitrary SQL command execution (e.g. database tampering / table drop).'
            });
        }
    } catch (e) {
        if (e.message.includes('syntax error') || e.message.includes('sqlite')) {
            findings.push({
                id: 'SEC-VULN-01-POTENTIAL',
                severity: 'HIGH',
                title: 'Unsanitized SQL Clause Interpolation in queryBuyers',
                details: `orderBy filter is directly interpolated into SQL query string without sanitization: ${e.message}`
            });
        }
    }

    // Scenario 3.2: Rapid Repeated Filtered Queries (10,000 executions stress)
    try {
        console.log('  3.2 Stress testing 10,000 rapid filtering queries...');
        const tStart = performance.now();
        for (let i = 0; i < 10000; i++) {
            engine.queryBuyers({ status: 'Viewing Scheduled', limit: 10 });
        }
        const tDuration = performance.now() - tStart;
        const avgQuery = tDuration / 10000;
        console.log(`      10,000 queries completed in ${tDuration.toFixed(2)}ms (Avg ${avgQuery.toFixed(4)}ms/query)`);
        if (avgQuery > 1.0) {
            findings.push({ id: 'PERF-01', severity: 'MEDIUM', title: 'Query latency degradation under rapid load', details: `Avg latency: ${avgQuery.toFixed(4)}ms` });
        }
    } catch (e) {
        console.log('  3.2 Exception during query stress test:', e.message);
    }

    // Scenario 3.3: Unindexed Column Query Latency Test
    try {
        console.log('  3.3 Testing query latency on unindexed filter (property_type)...');
        const tStart = performance.now();
        engine.queryBuyers({ preferred_location: 'Shah Alam' }); // property_type not indexed
        const unindexedDuration = performance.now() - tStart;
        console.log(`      Unindexed query completed in ${unindexedDuration.toFixed(4)}ms`);
    } catch (e) {
        console.log('  3.3 Exception on unindexed query test:', e.message);
    }

    // =========================================================================
    // SECTION 4: Database Constraints & Transaction Invalidation / Rollback Failures
    // =========================================================================
    console.log('\n[CATEGORY 4] Testing Constraints & Transaction Invalidation...');

    // Scenario 4.1: Transaction Rollback Failure in `seed100kLeads` on Error
    try {
        console.log('  4.1 Simulating bulk ingestion error mid-transaction...');
        // We test if seed100kLeads leaves indexes dropped or state un-committed if generate100kLeads throws or insert fails
        // We can inspect seed100kLeads error handling logic.
        const seedCode = engine.seed100kLeads.toString();
        const hasTryCatch = seedCode.includes('try') && seedCode.includes('ROLLBACK');
        console.log(`  4.1 seed100kLeads includes try/catch ROLLBACK: ${hasTryCatch}`);
        if (!hasTryCatch) {
            findings.push({
                id: 'TXN-VULN-01',
                severity: 'HIGH',
                title: 'Transaction Error Handling Defect in seed100kLeads (Missing ROLLBACK & Index Restoration)',
                details: 'seed100kLeads drops indexes and starts a SQLite transaction without try/catch/ROLLBACK blocks. If an error occurs during bulk insert, the transaction is abandoned uncommitted and secondary B-Tree indexes remain deleted.'
            });
        }
    } catch (e) {
        console.log('  4.1 Error checking seed100kLeads transaction code:', e.message);
    }

    // Scenario 4.2: Foreign Key Deletion Behavior (Deletions on ren_clients)
    try {
        console.log('  4.2 Testing Foreign Key Deletion behavior on ren_clients with active deals...');
        let fkBlocked = false;
        try {
            // Attempt to delete REN-001 who has an active deal (DEAL-001)
            engine.db.prepare(`DELETE FROM ren_clients WHERE ren_id = 'REN-001'`).run();
        } catch (e) {
            if (e.message.includes('FOREIGN KEY constraint failed')) {
                fkBlocked = true;
            }
        }
        console.log(`  4.2 Deleting REN with active deal was blocked by RESTRICT constraint: ${fkBlocked}`);
        if (!fkBlocked) {
            findings.push({ id: 'FK-VULN-01', severity: 'HIGH', title: 'Foreign key deletion constraint failed to block cascade/orphan deal', details: 'REN with active commission deal was deleted' });
        }
    } catch (e) {
        console.log('  4.2 Exception testing FK deletion:', e.message);
    }

    // Scenario 4.3: Non-atomic Lead Allocation Data Inconsistency
    try {
        console.log('  4.3 Checking atomicity of allocateLead function...');
        const allocCode = engine.allocateLead.toString();
        const isAtomic = allocCode.includes('BEGIN') || allocCode.includes('transaction');
        console.log(`  4.3 allocateLead wraps database updates in atomic transaction: ${isAtomic}`);
        if (!isAtomic) {
            findings.push({
                id: 'TXN-VULN-02',
                severity: 'MEDIUM',
                title: 'Non-Atomic Lead Allocation Updates (Race Condition & Orphan State Risk)',
                details: 'allocateLead performs 3 separate UPDATE queries across ren_clients and buyer_prospects without an explicit transaction, leaving database vulnerable to partial state updates if interrupted.'
            });
        }
    } catch (e) {
        console.log('  4.3 Error checking allocateLead atomicity:', e.message);
    }

    engine.close();
    cleanup();

    console.log('\n========================================================================');
    console.log(`   ADVERSARIAL STRESS TEST COMPLETE: ${findings.length} VULNERABILITIES IDENTIFIED`);
    console.log('========================================================================\n');

    findings.forEach((f, i) => {
        console.log(`[VULNERABILITY #${i+1}] [${f.severity}] ${f.id}: ${f.title}`);
        console.log(`   Details: ${f.details}\n`);
    });

    return findings;
}

runAdversarialSuite();
