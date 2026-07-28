const { ZKDatabaseEngine, DB_PATH } = require('../../05_Systems/Database/db_engine');
const { CloudSyncBridge } = require('../../05_Systems/Database/cloud_sync_bridge');
const fs = require('fs');
const path = require('path');

const TEST_DB_PATH = path.join(__dirname, 'temp_audit_test.db');

// Helper to remove test DB
function cleanup() {
    if (fs.existsSync(TEST_DB_PATH)) {
        try { fs.unlinkSync(TEST_DB_PATH); } catch (e) {}
    }
}

async function runForensicAudit() {
    cleanup();
    console.log("=== STARTING FORENSIC INTEGRITY AUDIT FOR MILESTONE 1 ===");
    
    let results = {
        fkEnforcement: {},
        matchingEngine: {},
        leadScoring: {},
        cloudSync: {},
        hardcodeScan: {}
    };

    // ----------------------------------------------------
    // CHECK 1: Foreign Key Enforcement & Cascades
    // ----------------------------------------------------
    try {
        const engine = new ZKDatabaseEngine(TEST_DB_PATH);
        engine.seedData();

        // 1a. Test FK violation on insert invalid REN into property_listings
        let fk1Failed = false;
        try {
            engine.db.prepare(`
                INSERT INTO property_listings (listing_id, title, location, property_type, price, bedrooms, bathrooms, ren_id)
                VALUES ('LST-FK1', 'Test', 'Loc', 'Condo', 100000, 1, 1, 'REN-INVALID')
            `).run();
        } catch (e) {
            if (e.message.includes('FOREIGN KEY constraint failed')) {
                fk1Failed = true;
            }
        }

        // 1b. Test FK violation on insert invalid buyer into viewing_logs
        let fk2Failed = false;
        try {
            engine.db.prepare(`
                INSERT INTO viewing_logs (viewing_id, buyer_id, listing_id, viewing_date)
                VALUES ('VW-FK2', 'BYR-INVALID', 'LST-001', '2026-08-01')
            `).run();
        } catch (e) {
            if (e.message.includes('FOREIGN KEY constraint failed')) {
                fk2Failed = true;
            }
        }

        // 1c. Test ON DELETE CASCADE on viewing_logs when buyer deleted
        // First insert a test viewing log
        engine.db.prepare(`
            INSERT INTO viewing_logs (viewing_id, buyer_id, listing_id, viewing_date)
            VALUES ('VW-CASCADE-TEST', 'BYR-001', 'LST-001', '2026-08-01')
        `).run();

        const preCascadeCount = engine.db.prepare(`SELECT COUNT(*) as count FROM viewing_logs WHERE buyer_id = 'BYR-001'`).get().count;
        
        // Delete BYR-001 (Note: BYR-001 has no deals in commission_deals, deals are BYR-003 and BYR-002)
        engine.db.prepare(`DELETE FROM buyer_prospects WHERE buyer_id = 'BYR-001'`).run();
        const postCascadeCount = engine.db.prepare(`SELECT COUNT(*) as count FROM viewing_logs WHERE buyer_id = 'BYR-001'`).get().count;

        results.fkEnforcement = {
            invalidRenBlocked: fk1Failed,
            invalidBuyerBlocked: fk2Failed,
            preCascadeViewingCount: preCascadeCount,
            postCascadeViewingCount: postCascadeCount,
            cascadeWorking: preCascadeCount > 0 && postCascadeCount === 0
        };

        engine.close();
    } catch (err) {
        results.fkEnforcement.error = err.message;
    }

    // ----------------------------------------------------
    // CHECK 2: Matching Engine Dynamic Calculation
    // ----------------------------------------------------
    try {
        cleanup();
        const engine = new ZKDatabaseEngine(TEST_DB_PATH);
        engine.seedData();

        // Test matching with custom criteria
        // Criteria A: Shah Alam, Condo, Budget 400k, 2 bedrooms
        const matchA = engine.matchBuyerCriteria({
            max_budget: 400000,
            preferred_location: 'Shah Alam',
            property_type: 'Condo',
            min_bedrooms: 2
        });

        // Criteria B: Semi-D in Cyberjaya, Budget 900k, 4 bedrooms
        const matchB = engine.matchBuyerCriteria({
            max_budget: 900000,
            preferred_location: 'Cyberjaya',
            property_type: 'Semi-D',
            min_bedrooms: 4
        });

        // Criteria C: Bungalow in Damansara Heights, Budget 3,000,000, 5 bedrooms
        const matchC = engine.matchBuyerCriteria({
            max_budget: 3000000,
            preferred_location: 'Damansara Heights',
            property_type: 'Bungalow',
            min_bedrooms: 5
        });

        results.matchingEngine = {
            matchA_top: matchA[0] ? { title: matchA[0].listing.title, score: matchA[0].matchScore, reasons: matchA[0].reasons } : null,
            matchB_top: matchB[0] ? { title: matchB[0].listing.title, score: matchB[0].matchScore, reasons: matchB[0].reasons } : null,
            matchC_top: matchC[0] ? { title: matchC[0].listing.title, score: matchC[0].matchScore, reasons: matchC[0].reasons } : null,
            isDynamic: matchA[0]?.listing.listing_id !== matchB[0]?.listing.listing_id && matchB[0]?.listing.listing_id !== matchC[0]?.listing.listing_id
        };

        engine.close();
    } catch (err) {
        results.matchingEngine.error = err.message;
    }

    // ----------------------------------------------------
    // CHECK 3: Lead Scoring Dynamic Calculation
    // ----------------------------------------------------
    try {
        cleanup();
        const engine = new ZKDatabaseEngine(TEST_DB_PATH);
        
        const scoreMinimal = engine.calculateLeadScore({ max_budget: 0 });
        const scorePartial = engine.calculateLeadScore({ max_budget: 500000, phone: '+60123456789' });
        const scoreFull = engine.calculateLeadScore({
            max_budget: 500000,
            phone: '+60123456789',
            email: 'test@example.com',
            preferred_location: 'KL',
            status: 'Negotiation'
        });

        results.leadScoring = {
            scoreMinimal, // should be 50
            scorePartial, // 50 + 15 + 10 = 75
            scoreFull,    // 50 + 15 + 10 + 5 + 10 + 15 = 105 -> capped at 100
            isDynamic: scoreMinimal !== scorePartial && scorePartial !== scoreFull
        };

        engine.close();
    } catch (err) {
        results.leadScoring.error = err.message;
    }

    // ----------------------------------------------------
    // CHECK 4: Cloud Sync Bridge Real SQLite Manipulation
    // ----------------------------------------------------
    try {
        cleanup();
        const engine = new ZKDatabaseEngine(TEST_DB_PATH);
        engine.seedData();

        const countBeforePull = engine.db.prepare(`SELECT COUNT(*) as count FROM buyer_prospects`).get().count;

        const bridge = new CloudSyncBridge(engine);
        const push1 = await bridge.pushLocalToCloud();
        
        const pull1 = await bridge.pullCloudToLocal();
        const countAfterPull = engine.db.prepare(`SELECT COUNT(*) as count FROM buyer_prospects`).get().count;

        const fetchedPulledBuyer = engine.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = 'BYR-006'`).get();

        // Push again after pull
        const push2 = await bridge.pushLocalToCloud();

        results.cloudSync = {
            countBeforePull,
            countAfterPull,
            pulledBuyerExists: !!fetchedPulledBuyer,
            pulledBuyerName: fetchedPulledBuyer?.name,
            push1RecordsCount: push1.notion.recordsCount, // 5 buyers + 5 listings = 10
            push2RecordsCount: push2.notion.recordsCount, // 6 buyers + 5 listings = 11
            dynamicSyncConfirmed: push2.notion.recordsCount > push1.notion.recordsCount
        };

        engine.close();
    } catch (err) {
        results.cloudSync.error = err.message;
    }

    cleanup();
    console.log("\n--- FORENSIC RESULTS ---");
    console.log(JSON.stringify(results, null, 2));
}

runForensicAudit();
