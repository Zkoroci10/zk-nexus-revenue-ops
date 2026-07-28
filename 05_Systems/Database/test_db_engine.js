/**
 * ZK Revenue Ops — Database Engine & Cloud Sync Test Suite
 * ID: SYS-003
 * Module: 05_Systems/Database/test_db_engine.js
 * 
 * Verifies Initialization, Foreign Key enforcement, Matching Engine, and Cloud Sync Bridge.
 */

const { ZKDatabaseEngine } = require('./db_engine');
const { CloudSyncBridge } = require('./cloud_sync_bridge');

async function runDatabaseTests() {
    console.log('====================================================');
    console.log('   ZK REVENUE OPS DB ENGINE TEST HARNESS (SYS-003)  ');
    console.log('====================================================\n');

    let passedTests = 0;
    let totalTests = 5;

    // Test 1: Initialization & Schema Creation
    try {
        console.log('[TEST 1/5] Initializing Database & Verifying Schema...');
        const engine = new ZKDatabaseEngine();
        const tables = engine.db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all();
        const tableNames = tables.map(t => t.name);

        const expectedTables = ['ren_clients', 'buyer_prospects', 'property_listings', 'viewing_logs', 'commission_deals'];
        const missing = expectedTables.filter(t => !tableNames.includes(t));

        if (missing.length === 0) {
            console.log('  ✅ PASS: All 5 core tables exist:', expectedTables.join(', '));
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Missing tables:', missing.join(', '));
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 1:', e.message);
    }

    // Test 2: Foreign Key Constraint Enforcement
    try {
        console.log('\n[TEST 2/5] Testing Foreign Key Enforcement...');
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
        console.log('\n[TEST 3/5] Populating Seed Data & Auditing Tables...');
        const engine = new ZKDatabaseEngine();
        engine.seedData();

        const rensCount = engine.db.prepare(`SELECT COUNT(*) as count FROM ren_clients`).get().count;
        const buyersCount = engine.db.prepare(`SELECT COUNT(*) as count FROM buyer_prospects`).get().count;
        const listingsCount = engine.db.prepare(`SELECT COUNT(*) as count FROM property_listings`).get().count;
        const viewingsCount = engine.db.prepare(`SELECT COUNT(*) as count FROM viewing_logs`).get().count;
        const dealsCount = engine.db.prepare(`SELECT COUNT(*) as count FROM commission_deals`).get().count;

        console.log(`  Audit Counts -> RENs: ${rensCount}, Buyers: ${buyersCount}, Listings: ${listingsCount}, Viewings: ${viewingsCount}, Deals: ${dealsCount}`);

        if (rensCount >= 2 && buyersCount >= 5 && listingsCount >= 5 && viewingsCount >= 3 && dealsCount >= 2) {
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
        console.log('\n[TEST 4/5] Testing Buyer-Property Matching Engine...');
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
        console.log('\n[TEST 5/5] Testing Cloud Sync Bridge (Push & Pull Reconcile)...');
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
