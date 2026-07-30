/**
 * ZK Revenue Ops — Database Engine & Cloud Sync Test Suite
 * ID: SYS-003
 * Module: 05_Systems/Database/test_db_engine.js
 * 
 * Verifies Initialization, Foreign Key enforcement, Indexes, Seed Data,
 * Matching Engine, Cloud Sync Bridge, DSR Loan Qualification Engine,
 * and Multi-Agent Lead Allocation & SLA Escalation Engine.
 */

const { ZKDatabaseEngine } = require('./db_engine');
const { CloudSyncBridge } = require('./cloud_sync_bridge');

async function runDatabaseTests() {
    console.log('====================================================');
    console.log('   ZK REVENUE OPS DB ENGINE TEST HARNESS (SYS-003)  ');
    console.log('====================================================\n');

    let passedTests = 0;
    let totalTests = 7;

    // Test 1: Initialization, Schema Creation & Index Verification
    try {
        console.log('[TEST 1/7] Initializing Database, Schema & Verifying B-Tree Secondary Indexes...');
        const engine = new ZKDatabaseEngine();
        const tables = engine.db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all();
        const tableNames = tables.map(t => t.name);

        const expectedTables = ['ren_clients', 'buyer_prospects', 'property_listings', 'viewing_logs', 'commission_deals'];
        const missingTables = expectedTables.filter(t => !tableNames.includes(t));

        const indexes = engine.db.prepare(`SELECT name FROM sqlite_master WHERE type='index'`).all().map(i => i.name);
        const expectedIndexes = [
            'idx_buyer_dsr_grade',
            'idx_buyer_status_score',
            'idx_buyer_location_budget',
            'idx_buyer_ren_allocation',
            'idx_buyer_sla'
        ];
        const missingIndexes = expectedIndexes.filter(i => !indexes.includes(i));

        if (missingTables.length === 0 && missingIndexes.length === 0) {
            console.log('  ✅ PASS: All 5 core tables and 5 B-Tree secondary indexes exist.');
            console.log('      Indexes verified:', expectedIndexes.join(', '));
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Missing components:', { missingTables, missingIndexes });
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 1:', e.message);
    }

    // Test 2: Foreign Key Constraint Enforcement
    try {
        console.log('\n[TEST 2/7] Testing Foreign Key Enforcement...');
        const engine = new ZKDatabaseEngine();
        
        let fkViolated = false;
        try {
            // Attempt to insert listing with invalid REN ID
            const stmt = engine.db.prepare(`
                INSERT INTO property_listings (listing_id, title, location, property_type, price, bedrooms, bathrooms, ren_id)
                VALUES ('LST-ERR', 'Orphan Property', 'Invalid Loc', 'Condo', 500000, 2, 2, 'REN-NONEXISTENT')
            `);
            stmt.run();
        } catch (fkErr) {
            if (fkErr.message.includes('FOREIGN KEY constraint failed')) {
                fkViolated = true;
            }
        }

        if (fkViolated) {
            console.log('  ✅ PASS: Foreign key enforcement active (FOREIGN KEY constraint failed caught)');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Foreign key constraint failed to block invalid insertion!');
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 2:', e.message);
    }

    // Test 3: Seed Data Seeding & Data Audit
    try {
        console.log('\n[TEST 3/7] Populating Seed Data & Auditing Tables...');
        const engine = new ZKDatabaseEngine();
        engine.seedData();

        const rensCount = engine.db.prepare(`SELECT COUNT(*) as count FROM ren_clients`).get().count;
        const buyersCount = engine.db.prepare(`SELECT COUNT(*) as count FROM buyer_prospects`).get().count;
        const listingsCount = engine.db.prepare(`SELECT COUNT(*) as count FROM property_listings`).get().count;
        const viewingsCount = engine.db.prepare(`SELECT COUNT(*) as count FROM viewing_logs`).get().count;
        const dealsCount = engine.db.prepare(`SELECT COUNT(*) as count FROM commission_deals`).get().count;

        console.log(`  Audit Counts -> RENs: ${rensCount}, Buyers: ${buyersCount}, Listings: ${listingsCount}, Viewings: ${viewingsCount}, Deals: ${dealsCount}`);

        if (rensCount >= 4 && buyersCount >= 5 && listingsCount >= 5 && viewingsCount >= 3 && dealsCount >= 2) {
            console.log('  ✅ PASS: Seed data successfully populated and audited.');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Seed data count mismatch!');
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 3:', e.message);
    }

    // Test 4: Buyer-Property Matching Engine
    try {
        console.log('\n[TEST 4/7] Testing Buyer-Property Matching Engine...');
        const engine = new ZKDatabaseEngine();
        engine.seedData();

        const matches = engine.matchBuyerToListings('BYR-001');
        console.log(`  Matching Results for BYR-001 (Mohd Fikri - Budget RM500k, Shah Alam, Condo):`);
        matches.slice(0, 3).forEach((m, i) => {
            console.log(`   #${i+1} ${m.listing.title} (${m.listing.location}) - Price: RM${m.listing.price.toLocaleString()} | Score: ${m.matchScore}%`);
        });

        if (matches.length > 0 && matches[0].matchScore >= 80) {
            console.log('  ✅ PASS: Matching engine calculated top candidate correctly.');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Matching engine score evaluation error!');
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 4:', e.message);
    }

    // Test 5: Bi-Directional Cloud Sync Bridge
    try {
        console.log('\n[TEST 5/7] Testing Cloud Sync Bridge (Push & Pull Reconcile)...');
        const engine = new ZKDatabaseEngine();
        engine.seedData();

        const bridge = new CloudSyncBridge(engine);
        const pushResult = await bridge.pushLocalToCloud();
        const pullResult = await bridge.pullCloudToLocal();

        console.log(`  Push Status: ${pushResult.status} | Notion & Sheets Records Pushed`);
        console.log(`  Pull Status: ${pullResult.status} | Reconciled ${pullResult.recordsReconciled} external lead(s) into SQLite`);

        const newBuyer = engine.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = 'BYR-006'`).get();

        if (pushResult.status === 'SUCCESS' && pullResult.status === 'SUCCESS' && newBuyer) {
            console.log('  ✅ PASS: Bi-directional cloud sync bridge completed successfully.');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Cloud sync bridge verification failed!');
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 5:', e.message);
    }

    // Test 6: Automated DSR Loan Qualification Engine
    try {
        console.log('\n[TEST 6/7] Testing Automated DSR Loan Qualification Engine...');
        const engine = new ZKDatabaseEngine();

        // Grade A Case: net 10000, commitments 1500, budget 500000 -> estInstallment 2400, total 3900, DSR = 39% (Grade A, Hot)
        const gradeA = engine.calculateDSR({ maxBudget: 500000, netIncome: 10000, existingCommitments: 1500 });
        // Grade B Case: net 6000, commitments 2000, budget 600000 -> estInstallment 2880, total 4880, DSR = 81%... wait, let's adjust for DSR 70%: net 7000, commitments 2020, budget 600000 -> estInstallment 2880, total 4900, DSR = 70% (Grade B, Warm)
        const gradeB = engine.calculateDSR({ maxBudget: 600000, netIncome: 7000, existingCommitments: 2020 });
        // Grade C Case: net 4000, commitments 2500, budget 500000 -> estInstallment 2400, total 4900, DSR = 123% (Grade C, Unqualified)
        const gradeC = engine.calculateDSR({ maxBudget: 500000, netIncome: 4000, existingCommitments: 2500 });

        console.log(`  Grade A Calculation: DSR=${gradeA.dsr_percent}%, Grade=${gradeA.grade}, Status='${gradeA.status}', Latency=${gradeA.calculation_time_ms.toFixed(4)}ms`);
        console.log(`  Grade B Calculation: DSR=${gradeB.dsr_percent}%, Grade=${gradeB.grade}, Status='${gradeB.status}', Latency=${gradeB.calculation_time_ms.toFixed(4)}ms`);
        console.log(`  Grade C Calculation: DSR=${gradeC.dsr_percent}%, Grade=${gradeC.grade}, Status='${gradeC.status}', Latency=${gradeC.calculation_time_ms.toFixed(4)}ms`);

        if (gradeA.grade === 'A' && gradeA.dsr_percent <= 65 &&
            gradeB.grade === 'B' && gradeB.dsr_percent >= 66 && gradeB.dsr_percent <= 75 &&
            gradeC.grade === 'C' && gradeC.dsr_percent > 75 &&
            gradeA.calculation_time_ms < 10) {
            console.log('  ✅ PASS: Automated DSR Loan Qualification Engine passed all qualification criteria.');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: DSR Engine failed qualification validation!');
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 6:', e.message);
    }

    // Test 7: Multi-Agent Lead Allocation & SLA Escalation Engine
    try {
        console.log('\n[TEST 7/7] Testing Multi-Agent Lead Allocation & SLA Escalation Engine...');
        const engine = new ZKDatabaseEngine();
        engine.seedData();

        // BYR-003: budget 1,000,000, score 95 -> Enterprise SLA Priority Routing
        const allocEnterprise = engine.allocateLead('BYR-003');
        console.log(`  Enterprise Lead (BYR-003) -> REN: ${allocEnterprise.allocated_ren_id} (${allocEnterprise.ren_tier}), Strategy: ${allocEnterprise.allocation_strategy}, SLA Status: ${allocEnterprise.sla_status}`);

        // BYR-004: budget 450,000, score 70, Grade C -> Dynamic Round-Robin Routing
        const allocStandard = engine.allocateLead('BYR-004');
        console.log(`  Standard Lead (BYR-004) -> REN: ${allocStandard.allocated_ren_id} (${allocStandard.ren_tier}), Strategy: ${allocStandard.allocation_strategy}`);

        // Simulate SLA breach for BYR-003 by setting sla_deadline to 10 minutes ago
        const pastDate = new Date(Date.now() - 10 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
        engine.db.prepare(`UPDATE buyer_prospects SET sla_deadline = ? WHERE buyer_id = 'BYR-003'`).run(pastDate);

        const escalations = engine.checkSLAEscalations();
        console.log(`  SLA Escalations trigger -> Reallocated ${escalations.length} breached lead(s).`);
        if (escalations.length > 0) {
            console.log(`  Escalated Lead ${escalations[0].buyer_id}: ${escalations[0].previous_ren_id} -> ${escalations[0].new_ren_id} (${escalations[0].sla_status})`);
        }

        if (allocEnterprise.allocation_strategy === 'SLA_ENTERPRISE_PRIORITY' &&
            allocEnterprise.ren_tier === 'Enterprise' &&
            allocStandard.allocation_strategy === 'DYNAMIC_ROUND_ROBIN' &&
            escalations.length > 0 &&
            escalations[0].sla_status === 'BREACHED_REALLOCATED') {
            console.log('  ✅ PASS: Multi-Agent Lead Allocation & SLA Escalation Engine verified successfully.');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Lead allocation & escalation logic verification failed!');
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 7:', e.message);
    }

    console.log('\n====================================================');
    console.log(`  TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
    console.log('====================================================\n');

    if (passedTests === totalTests) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runDatabaseTests();
