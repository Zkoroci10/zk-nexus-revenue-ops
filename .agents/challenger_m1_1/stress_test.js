/**
 * Empirical & Adversarial Stress Harness for ZK Database Engine & Cloud Sync Bridge
 * Milestone 1 (ZK-DB-RND)
 * File: .agents/challenger_m1_1/stress_test.js
 */

const path = require('path');
const fs = require('fs');
const { ZKDatabaseEngine } = require('../../05_Systems/Database/db_engine');
const { CloudSyncBridge } = require('../../05_Systems/Database/cloud_sync_bridge');

// Helper for test reporting
const results = {
    total: 0,
    passed: 0,
    failed: 0,
    bugs: []
};

function logTest(suite, name, pass, detail, bugSeverity = null) {
    results.total++;
    if (pass) {
        results.passed++;
        console.log(`[PASS] [${suite}] ${name}${detail ? ` - ${detail}` : ''}`);
    } else {
        results.failed++;
        console.log(`[FAIL/BUG] [${suite}] ${name} - ${detail}`);
        results.bugs.push({ suite, name, detail, severity: bugSeverity || 'MEDIUM' });
    }
}

// Create a temp test DB path to avoid corrupting client_leads.db
const TEST_DB_PATH = path.join(__dirname, 'temp_test_leads.db');

function cleanupTempDb() {
    if (fs.existsSync(TEST_DB_PATH)) {
        try { fs.unlinkSync(TEST_DB_PATH); } catch (e) {}
    }
}

async function runStressTests() {
    console.log('====================================================');
    console.log('STARTING EMPIRICAL STRESS TEST HARNESS FOR MILESTONE 1');
    console.log('====================================================\n');

    cleanupTempDb();

    let dbEngine;
    try {
        dbEngine = new ZKDatabaseEngine(TEST_DB_PATH);
        logTest('INIT', 'Database Initialization & Schema Setup', true, `Database created at ${TEST_DB_PATH}`);
    } catch (err) {
        logTest('INIT', 'Database Initialization & Schema Setup', false, `Failed to init DB: ${err.message}`, 'CRITICAL');
        return;
    }

    // Seed data
    try {
        dbEngine.seedData();
        logTest('INIT', 'Data Seeding', true, 'Seeded initial RENs, Buyers, Listings, Viewing Logs, Deals');
    } catch (err) {
        logTest('INIT', 'Data Seeding', false, `Failed to seed data: ${err.message}`, 'HIGH');
    }

    // =========================================================================
    // SUITE 1: Foreign Key Constraints & Data Integrity
    // =========================================================================
    console.log('\n--- SUITE 1: Foreign Key Constraints & Data Integrity ---');

    // 1.1 Invalid ren_id in property_listings
    try {
        const stmt = dbEngine.db.prepare(`
            INSERT INTO property_listings (listing_id, title, location, property_type, price, bedrooms, bathrooms, ren_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run('LST-FAIL-01', 'FK Test Listing', 'Test Loc', 'Condo', 300000, 2, 2, 'REN-NONEXISTENT', 'Available');
        logTest('SUITE 1', 'Foreign Key Violation - Invalid ren_id in property_listings', false, 'Allowed insertion of listing with non-existent ren_id (FK not enforced!)', 'HIGH');
    } catch (err) {
        const isFkError = err.message.includes('FOREIGN KEY') || err.message.includes('constraint failed');
        logTest('SUITE 1', 'Foreign Key Violation - Invalid ren_id in property_listings', isFkError, `Correctly rejected invalid ren_id: ${err.message}`);
    }

    // 1.2 Invalid buyer_id in viewing_logs
    try {
        const stmt = dbEngine.db.prepare(`
            INSERT INTO viewing_logs (viewing_id, buyer_id, listing_id, viewing_date, feedback, rating, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run('VW-FAIL-01', 'BYR-NONEXISTENT', 'LST-001', '2026-08-01 10:00:00', 'Test', 5, 'Scheduled');
        logTest('SUITE 1', 'Foreign Key Violation - Invalid buyer_id in viewing_logs', false, 'Allowed insertion of viewing log with non-existent buyer_id', 'HIGH');
    } catch (err) {
        const isFkError = err.message.includes('FOREIGN KEY') || err.message.includes('constraint failed');
        logTest('SUITE 1', 'Foreign Key Violation - Invalid buyer_id in viewing_logs', isFkError, `Correctly rejected invalid buyer_id: ${err.message}`);
    }

    // 1.3 Invalid listing_id in viewing_logs
    try {
        const stmt = dbEngine.db.prepare(`
            INSERT INTO viewing_logs (viewing_id, buyer_id, listing_id, viewing_date, feedback, rating, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run('VW-FAIL-02', 'BYR-001', 'LST-NONEXISTENT', '2026-08-01 10:00:00', 'Test', 5, 'Scheduled');
        logTest('SUITE 1', 'Foreign Key Violation - Invalid listing_id in viewing_logs', false, 'Allowed insertion of viewing log with non-existent listing_id', 'HIGH');
    } catch (err) {
        const isFkError = err.message.includes('FOREIGN KEY') || err.message.includes('constraint failed');
        logTest('SUITE 1', 'Foreign Key Violation - Invalid listing_id in viewing_logs', isFkError, `Correctly rejected invalid listing_id: ${err.message}`);
    }

    // 1.4 Delete REN with listings (ON DELETE SET NULL)
    try {
        dbEngine.db.prepare(`INSERT INTO ren_clients (ren_id, name, email, phone) VALUES ('REN-TEMP', 'Temp REN', 'temp@ren.my', '+60100000000')`).run();
        dbEngine.db.prepare(`INSERT INTO property_listings (listing_id, title, location, property_type, price, bedrooms, bathrooms, ren_id) VALUES ('LST-TEMP', 'Temp Listing', 'Loc', 'Condo', 100000, 1, 1, 'REN-TEMP')`).run();
        
        dbEngine.db.prepare(`DELETE FROM ren_clients WHERE ren_id = 'REN-TEMP'`).run();
        const updatedLst = dbEngine.db.prepare(`SELECT ren_id FROM property_listings WHERE listing_id = 'LST-TEMP'`).get();
        logTest('SUITE 1', 'Cascade Action - ON DELETE SET NULL on ren_id', updatedLst && updatedLst.ren_id === null, `Listing ren_id became: ${updatedLst ? updatedLst.ren_id : 'deleted'}`);
    } catch (err) {
        logTest('SUITE 1', 'Cascade Action - ON DELETE SET NULL on ren_id', false, `Error during delete: ${err.message}`, 'MEDIUM');
    }

    // 1.5 Delete Buyer with viewing logs (ON DELETE CASCADE)
    try {
        dbEngine.db.prepare(`INSERT INTO buyer_prospects (buyer_id, name, phone, preferred_location, max_budget, property_type) VALUES ('BYR-TEMP', 'Temp Buyer', '+6011111111', 'Loc', 500000, 'Condo')`).run();
        dbEngine.db.prepare(`INSERT INTO viewing_logs (viewing_id, buyer_id, listing_id, viewing_date) VALUES ('VW-TEMP', 'BYR-TEMP', 'LST-001', '2026-08-01 10:00:00')`).run();
        
        dbEngine.db.prepare(`DELETE FROM buyer_prospects WHERE buyer_id = 'BYR-TEMP'`).run();
        const remainingLog = dbEngine.db.prepare(`SELECT * FROM viewing_logs WHERE viewing_id = 'VW-TEMP'`).get();
        logTest('SUITE 1', 'Cascade Action - ON DELETE CASCADE on viewing_logs', !remainingLog, `Viewing log deleted automatically? ${!remainingLog}`);
    } catch (err) {
        logTest('SUITE 1', 'Cascade Action - ON DELETE CASCADE on viewing_logs', false, `Error during delete: ${err.message}`, 'MEDIUM');
    }

    // 1.6 ON DELETE RESTRICT on commission_deals
    try {
        dbEngine.db.prepare(`DELETE FROM ren_clients WHERE ren_id = 'REN-001'`).run();
        logTest('SUITE 1', 'Restrict Action - ON DELETE RESTRICT on commission_deals ren_id', false, 'Allowed deletion of REN referenced in commission_deals!', 'HIGH');
    } catch (err) {
        const isFkError = err.message.includes('FOREIGN KEY') || err.message.includes('constraint failed');
        logTest('SUITE 1', 'Restrict Action - ON DELETE RESTRICT on commission_deals ren_id', isFkError, `Correctly blocked deletion of referenced REN: ${err.message}`);
    }

    // =========================================================================
    // SUITE 2: Extreme Budgets & Boundary Conditions
    // =========================================================================
    console.log('\n--- SUITE 2: Extreme Budgets & Boundary Conditions ---');

    // 2.1 RM0 Budget Buyer
    try {
        const zeroBuyer = { buyer_id: 'BYR-ZERO', name: 'Zero Buyer', phone: '+60120000000', max_budget: 0, preferred_location: 'Shah Alam', property_type: 'Condo', min_bedrooms: 1, status: 'New Inquiry' };
        const score = dbEngine.calculateLeadScore(zeroBuyer);
        const matches = dbEngine.matchBuyerCriteria(zeroBuyer);
        logTest('SUITE 2', 'Zero Budget Buyer (RM0)', score === 70 && matches.length >= 0, `Lead score: ${score}, Matches returned: ${matches.length} (Top match price: RM${matches[0].listing.price})`);
    } catch (err) {
        logTest('SUITE 2', 'Zero Budget Buyer (RM0)', false, `Exception on zero budget: ${err.message}`, 'HIGH');
    }

    // 2.2 Extreme Budget Buyer (RM100,000,000)
    try {
        const richBuyer = { buyer_id: 'BYR-RICH', name: 'Whale Buyer', phone: '+60129999999', max_budget: 100000000, preferred_location: 'Damansara Heights', property_type: 'Bungalow', min_bedrooms: 5, status: 'Negotiation' };
        const score = dbEngine.calculateLeadScore(richBuyer);
        const matches = dbEngine.matchBuyerCriteria(richBuyer);
        logTest('SUITE 2', 'Extreme Budget Buyer (RM100M)', score <= 100 && matches.length > 0, `Lead score: ${score}, Matches count: ${matches.length}, Top match score: ${matches[0].matchScore}`);
    } catch (err) {
        logTest('SUITE 2', 'Extreme Budget Buyer (RM100M)', false, `Exception on extreme budget: ${err.message}`, 'HIGH');
    }

    // 2.3 Negative Budget Buyer (RM -500,000)
    try {
        const negBuyer = { max_budget: -500000, preferred_location: 'Bangi', property_type: 'Terrace', min_bedrooms: 2 };
        const matches = dbEngine.matchBuyerCriteria(negBuyer);
        const budgetMatched = matches.some(m => m.reasons.some(r => r.includes('within budget')));
        logTest('SUITE 2', 'Negative Budget Buyer (RM -500k)', !budgetMatched, `Negative budget incorrectly matched budget? ${budgetMatched}`);
    } catch (err) {
        logTest('SUITE 2', 'Negative Budget Buyer (RM -500k)', false, `Exception on negative budget: ${err.message}`, 'MEDIUM');
    }

    // =========================================================================
    // SUITE 3: SQL Injection & Special Characters Handling
    // =========================================================================
    console.log('\n--- SUITE 3: SQL Injection & Special Characters Handling ---');

    // 3.1 SQL Injection in Location
    try {
        const sqlInjStr = "'Shah Alam; DROP TABLE buyer_prospects; --'";
        const injBuyer = {
            buyer_id: 'BYR-INJ',
            name: "O'Connor Drop '--",
            phone: '+60123456789',
            email: 'inj@test.com',
            preferred_location: sqlInjStr,
            max_budget: 500000,
            property_type: 'Condo',
            min_bedrooms: 2
        };
        
        const stmt = dbEngine.db.prepare(`
            INSERT INTO buyer_prospects (buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(injBuyer.buyer_id, injBuyer.name, injBuyer.phone, injBuyer.email, injBuyer.preferred_location, injBuyer.max_budget, injBuyer.property_type, injBuyer.min_bedrooms);

        const count = dbEngine.db.prepare(`SELECT count(*) as cnt FROM buyer_prospects`).get();
        const matches = dbEngine.matchBuyerCriteria(injBuyer);
        
        logTest('SUITE 3', 'SQL Injection Injection in preferred_location', count.cnt > 0, `Table survived injection! Buyer count: ${count.cnt}, matches: ${matches.length}`);
    } catch (err) {
        logTest('SUITE 3', 'SQL Injection Injection in preferred_location', false, `SQL Injection test error: ${err.message}`, 'HIGH');
    }

    // 3.2 Special Characters & Unicode
    try {
        const unicodeBuyer = {
            max_budget: 600000,
            preferred_location: 'Kuala Lumpur 🇲🇾 / 吉隆坡 / கோலாலம்பூர்',
            property_type: "Semi-D & 'Bungalow'",
            min_bedrooms: 3
        };
        const matches = dbEngine.matchBuyerCriteria(unicodeBuyer);
        logTest('SUITE 3', 'Special Characters & Unicode in search criteria', true, `Handled complex unicode string smoothly, matches count: ${matches.length}`);
    } catch (err) {
        logTest('SUITE 3', 'Special Characters & Unicode in search criteria', false, `Unicode error: ${err.message}`, 'MEDIUM');
    }

    // =========================================================================
    // SUITE 4: Null / Missing Fields & Unexpected Input Types
    // =========================================================================
    console.log('\n--- SUITE 4: Null / Missing Fields & Unexpected Input Types ---');

    // 4.1 calculateLeadScore with missing / empty / invalid object
    try {
        const scoreEmptyObj = dbEngine.calculateLeadScore({});
        logTest('SUITE 4', 'calculateLeadScore({}) empty object', scoreEmptyObj === 50, `Returned base score: ${scoreEmptyObj}`);
    } catch (err) {
        logTest('SUITE 4', 'calculateLeadScore({}) empty object', false, `Error: ${err.message}`, 'HIGH');
    }

    try {
        dbEngine.calculateLeadScore(null);
        logTest('SUITE 4', 'calculateLeadScore(null)', false, 'Did not handle null buyer object gracefully', 'MEDIUM');
    } catch (err) {
        logTest('SUITE 4', 'calculateLeadScore(null)', true, `Handled gracefully by throwing expected TypeError: ${err.message}`);
    }

    // 4.2 matchBuyerCriteria with empty string / missing preferred_location
    try {
        const criteriaEmptyLoc = { max_budget: 500000, preferred_location: '', property_type: 'Condo', min_bedrooms: 2 };
        const matchesEmptyLoc = dbEngine.matchBuyerCriteria(criteriaEmptyLoc);
        
        const falseLocationMatches = matchesEmptyLoc.filter(m => m.reasons.some(r => r.includes('Location match')));
        if (falseLocationMatches.length > 0) {
            logTest('SUITE 4', 'matchBuyerCriteria with empty string preferred_location', false, `BUG DETECTED: Empty preferred_location matched ALL ${falseLocationMatches.length} listings with +30 score because ''.includes('') is true!`, 'HIGH');
        } else {
            logTest('SUITE 4', 'matchBuyerCriteria with empty string preferred_location', true, 'Empty preferred_location did not trigger false positive location score');
        }
    } catch (err) {
        logTest('SUITE 4', 'matchBuyerCriteria with empty string preferred_location', false, `Error: ${err.message}`, 'MEDIUM');
    }

    // 4.3 matchBuyerCriteria with null / undefined max_budget
    try {
        const criteriaNullBudget = { max_budget: null, preferred_location: 'Shah Alam', property_type: 'Condo' };
        dbEngine.matchBuyerCriteria(criteriaNullBudget);
        logTest('SUITE 4', 'matchBuyerCriteria with null max_budget', true, 'Handled null max_budget without throwing exception');
    } catch (err) {
        logTest('SUITE 4', 'matchBuyerCriteria with null max_budget', false, `BUG DETECTED: Threw exception on null max_budget: ${err.message}`, 'HIGH');
    }

    // 4.4 Non-string phone number in calculateLeadScore
    try {
        const numPhoneBuyer = { max_budget: 500000, phone: 60123456789 };
        const score = dbEngine.calculateLeadScore(numPhoneBuyer);
        // buyer.phone.length will fail if phone is a number
        logTest('SUITE 4', 'calculateLeadScore with numeric phone (phone: 60123456789)', score === 65, `Lead score returned: ${score} (Expected 65 if numeric phone handled)`);
    } catch (err) {
        logTest('SUITE 4', 'calculateLeadScore with numeric phone (phone: 60123456789)', false, `BUG DETECTED: Threw exception when phone is a number: ${err.message}`, 'MEDIUM');
    }

    // 4.5 DB insertion with NULL in NOT NULL columns
    try {
        const stmt = dbEngine.db.prepare(`INSERT INTO ren_clients (ren_id, name, email, phone) VALUES (?, ?, ?, ?)`);
        stmt.run('REN-NULL', null, 'null@test.com', '+60120000000');
        logTest('SUITE 4', 'Database NOT NULL Constraint - NULL name in ren_clients', false, 'Allowed NULL value in NOT NULL column (name)', 'HIGH');
    } catch (err) {
        logTest('SUITE 4', 'Database NOT NULL Constraint - NULL name in ren_clients', true, `Correctly rejected NULL name: ${err.message}`);
    }

    // 4.6 Rating CHECK constraint in viewing_logs
    try {
        const stmt = dbEngine.db.prepare(`INSERT INTO viewing_logs (viewing_id, buyer_id, listing_id, viewing_date, rating) VALUES (?, ?, ?, ?, ?)`);
        stmt.run('VW-INVALID-RATING', 'BYR-001', 'LST-001', '2026-08-01', 10);
        logTest('SUITE 4', 'CHECK Constraint - Invalid rating = 10 in viewing_logs', false, 'Allowed rating = 10 (exceeded check constraint 1..5)', 'HIGH');
    } catch (err) {
        logTest('SUITE 4', 'CHECK Constraint - Invalid rating = 10 in viewing_logs', true, `Correctly rejected rating = 10: ${err.message}`);
    }

    // =========================================================================
    // SUITE 5: Empty Listing Database & Missing Buyer Matching
    // =========================================================================
    console.log('\n--- SUITE 5: Empty Listing Database & Missing Buyer Matching ---');

    // 5.1 Match non-existent buyer ID
    try {
        const nonExistentMatches = dbEngine.matchBuyerToListings('BYR-DOES-NOT-EXIST');
        logTest('SUITE 5', 'matchBuyerToListings with non-existent buyerId', Array.isArray(nonExistentMatches) && nonExistentMatches.length === 0, `Returned empty array: ${JSON.stringify(nonExistentMatches)}`);
    } catch (err) {
        logTest('SUITE 5', 'matchBuyerToListings with non-existent buyerId', false, `Error: ${err.message}`, 'MEDIUM');
    }

    // 5.2 Empty property_listings database matching
    try {
        dbEngine.db.prepare(`DELETE FROM commission_deals`).run();
        dbEngine.db.prepare(`DELETE FROM viewing_logs`).run();
        dbEngine.db.prepare(`DELETE FROM property_listings`).run();

        const emptyDbMatches = dbEngine.matchBuyerCriteria({ max_budget: 500000, preferred_location: 'Bangi', property_type: 'Terrace' });
        logTest('SUITE 5', 'matchBuyerCriteria on empty property_listings table', Array.isArray(emptyDbMatches) && emptyDbMatches.length === 0, `Returned empty array cleanly on 0 listings`);
    } catch (err) {
        logTest('SUITE 5', 'matchBuyerCriteria on empty property_listings table', false, `Error: ${err.message}`, 'HIGH');
    }

    // =========================================================================
    // SUITE 6: Cloud Sync Bridge Stress & Integration
    // =========================================================================
    console.log('\n--- SUITE 6: Cloud Sync Bridge Stress & Integration ---');

    let bridge;
    try {
        bridge = new CloudSyncBridge(dbEngine);
        logTest('SUITE 6', 'CloudSyncBridge Instantiation', true, 'Bridge instantiated successfully');
    } catch (err) {
        logTest('SUITE 6', 'CloudSyncBridge Instantiation', false, `Failed to instantiate bridge: ${err.message}`, 'HIGH');
    }

    if (bridge) {
        // 6.1 Push Local to Cloud
        try {
            const pushLog = await bridge.pushLocalToCloud();
            logTest('SUITE 6', 'CloudSyncBridge pushLocalToCloud()', pushLog.status === 'SUCCESS' && pushLog.notion && pushLog.googleSheets, `Pushed status: ${pushLog.status}`);
        } catch (err) {
            logTest('SUITE 6', 'CloudSyncBridge pushLocalToCloud()', false, `Push error: ${err.message}`, 'HIGH');
        }

        // 6.2 Pull Cloud to Local
        try {
            const pullLog = await bridge.pullCloudToLocal();
            logTest('SUITE 6', 'CloudSyncBridge pullCloudToLocal()', pullLog.status === 'SUCCESS' && pullLog.recordsReconciled > 0, `Reconciled ${pullLog.recordsReconciled} records`);
            
            const pulledBuyer = dbEngine.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = 'BYR-006'`).get();
            logTest('SUITE 6', 'CloudSyncBridge Database Reconciliation', !!pulledBuyer && pulledBuyer.name === 'Farhan Razak', `Buyer BYR-006 found in database after pull`);
        } catch (err) {
            logTest('SUITE 6', 'CloudSyncBridge pullCloudToLocal()', false, `Pull error: ${err.message}`, 'HIGH');
        }

        // 6.3 Sync History tracking
        try {
            const history = bridge.getSyncHistory();
            logTest('SUITE 6', 'CloudSyncBridge getSyncHistory()', Array.isArray(history) && history.length === 2, `Recorded ${history.length} sync entries`);
        } catch (err) {
            logTest('SUITE 6', 'CloudSyncBridge getSyncHistory()', false, `Sync history error: ${err.message}`, 'LOW');
        }

        // 6.4 Cloud Sync Pull Idempotency Check (running pull twice)
        try {
            const pullLog2 = await bridge.pullCloudToLocal();
            const pulledCount = dbEngine.db.prepare(`SELECT count(*) as cnt FROM buyer_prospects WHERE buyer_id = 'BYR-006'`).get();
            logTest('SUITE 6', 'CloudSyncBridge Idempotency Check (duplicate pull)', pulledCount.cnt === 1, `BYR-006 count in DB after 2nd pull: ${pulledCount.cnt}`);
        } catch (err) {
            logTest('SUITE 6', 'CloudSyncBridge Idempotency Check (duplicate pull)', false, `Error during 2nd pull: ${err.message}`, 'MEDIUM');
        }
    }

    dbEngine.close();
    cleanupTempDb();

    console.log('\n====================================================');
    console.log(`STRESS TEST COMPLETE: ${results.passed}/${results.total} PASSED, ${results.failed} FAILED/BUGS DISCOVERED`);
    console.log('====================================================');

    if (results.bugs.length > 0) {
        console.log('\nSUMMARY OF DISCOVERED BUGS & VULNERABILITIES:');
        results.bugs.forEach((b, i) => {
            console.log(`  ${i + 1}. [${b.severity}] [${b.suite}] ${b.name}: ${b.detail}`);
        });
    }

    return results;
}

if (require.main === module) {
    runStressTests();
}

module.exports = { runStressTests };
