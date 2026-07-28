/**
 * Empirical Stress Test Harness for Milestone 2 (ZK-INGEST) Multi-Channel Lead Ingestion Engine
 * Location: .agents/challenger_m2_1/stress_ingestion_test.js
 * Author: empirical_challenger
 */

const path = require('path');
const fs = require('fs');
const http = require('http');

const { ZKDatabaseEngine } = require('../../05_Systems/Database/db_engine');
const { ZKIngestionEngine } = require('../../05_Systems/Ingestion/ingestion_engine');
const { WebhookListener } = require('../../05_Systems/Ingestion/webhook_listener');
const { WhatsAppParser } = require('../../05_Systems/Ingestion/whatsapp_parser');
const { CSVExcelParser } = require('../../05_Systems/Ingestion/csv_excel_parser');

// Use an isolated temporary SQLite database for testing
const TEST_DB_PATH = path.join(__dirname, 'test_stress_ingestion.db');

function cleanupTestDb() {
    if (fs.existsSync(TEST_DB_PATH)) {
        try { fs.unlinkSync(TEST_DB_PATH); } catch (e) {}
    }
}

function sendHttpPost(urlStr, data, contentType = 'application/json') {
    return new Promise((resolve, reject) => {
        const url = new URL(urlStr);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': contentType,
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body });
            });
        });

        req.on('error', (err) => reject(err));
        req.write(data);
        req.end();
    });
}

async function runStressTests() {
    cleanupTestDb();
    console.log('================================================================');
    console.log('   ZK REVENUE OPS — ADVERSARIAL INGESTION STRESS TEST HARNESS   ');
    console.log('================================================================\n');

    const dbEngine = new ZKDatabaseEngine(TEST_DB_PATH);
    const ingestionEngine = new ZKIngestionEngine(dbEngine);

    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        vulnerabilities: []
    };

    function recordTest(testName, passed, details = '') {
        results.total++;
        if (passed) {
            results.passed++;
            console.log(`  [PASS] ${testName}`);
        } else {
            results.failed++;
            console.log(`  [FAIL] ${testName}`);
            if (details) console.log(`         -> Detail: ${details}`);
            results.vulnerabilities.push({ testName, details });
        }
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 1: Webhook Listener & Malformed Payload Handling
    // -------------------------------------------------------------------------
    console.log('--- TEST SUITE 1: Webhook Listener & Malformed Payloads ---');

    // 1.1 Non-JSON Syntax
    try {
        const res = await new Promise(res => {
            try {
                ingestionEngine.webhookListener.processWebhookPayload('{bad_json: true');
                res(false);
            } catch (e) {
                res(true);
            }
        });
        recordTest('Webhook: Non-object payload rejected with exception', res);
    } catch (e) {
        recordTest('Webhook: Non-object payload error handling', false, e.message);
    }

    // 1.2 HTTP Endpoint Malformed JSON Test
    try {
        const PORT = 3899;
        await ingestionEngine.startWebhookServer(PORT);

        // 1.2a Corrupted JSON over HTTP
        const httpRes1 = await sendHttpPost(`http://localhost:${PORT}/api/v1/webhooks/lead`, '{invalid_json');
        recordTest('Webhook HTTP: Corrupted JSON returns 400 Bad Request', httpRes1.statusCode === 400);

        // 1.2b Null payload over HTTP
        const httpRes2 = await sendHttpPost(`http://localhost:${PORT}/api/v1/webhooks/lead`, 'null');
        recordTest('Webhook HTTP: null payload returns 400 Bad Request', httpRes2.statusCode === 400);

        // 1.2c JSON Array payload over HTTP
        const httpRes3 = await sendHttpPost(`http://localhost:${PORT}/api/v1/webhooks/lead`, '[{"name":"Test"}]');
        recordTest('Webhook HTTP: Array payload returns 400 (missing phone/name or invalid format)', httpRes3.statusCode === 400);

        // 1.2d Missing required fields (missing name)
        const httpRes4 = await sendHttpPost(`http://localhost:${PORT}/api/v1/webhooks/lead`, JSON.stringify({ phone: '0123456789' }));
        recordTest('Webhook HTTP: Missing name returns 400 Bad Request', httpRes4.statusCode === 400);

        // 1.2e Missing required fields (missing phone)
        const httpRes5 = await sendHttpPost(`http://localhost:${PORT}/api/v1/webhooks/lead`, JSON.stringify({ name: 'Ali' }));
        recordTest('Webhook HTTP: Missing phone returns 400 Bad Request', httpRes5.statusCode === 400);

        // 1.2f Non-numeric budget string ("invalid")
        const httpRes6 = await sendHttpPost(`http://localhost:${PORT}/api/v1/webhooks/lead`, JSON.stringify({
            name: 'Budget Test',
            phone: '0129998888',
            budget: 'invalid',
            min_bedrooms: 'five'
        }));
        const body6 = JSON.parse(httpRes6.body);
        const leadsInDb = dbEngine.db.prepare(`SELECT * FROM buyer_prospects WHERE phone = '+60129998888'`).get();
        const budgetIsNaN = Number.isNaN(leadsInDb ? leadsInDb.max_budget : 0);
        const bedsIsNaN = Number.isNaN(leadsInDb ? leadsInDb.min_bedrooms : 0);
        if (budgetIsNaN || bedsIsNaN) {
            recordTest('Webhook HTTP: Non-numeric budget/bedrooms handled without inserting NaN', false, 
                `max_budget=${leadsInDb ? leadsInDb.max_budget : null}, min_bedrooms=${leadsInDb ? leadsInDb.min_bedrooms : null} (saved as NaN in SQLite)`);
        } else {
            recordTest('Webhook HTTP: Non-numeric budget/bedrooms converted safely to defaults', leadsInDb && leadsInDb.max_budget === 0 && leadsInDb.min_bedrooms === 1);
        }

        // 1.2g SQL Injection / Special chars in payload
        const sqlInjStr = "O'Connor'; DROP TABLE buyer_prospects;--";
        const httpRes7 = await sendHttpPost(`http://localhost:${PORT}/api/v1/webhooks/lead`, JSON.stringify({
            name: sqlInjStr,
            phone: '0191112222',
            location: "Kuala Lumpur'; DELETE FROM ren_clients;--"
        }));
        const tablesExist = dbEngine.db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='buyer_prospects'`).get();
        recordTest('Webhook HTTP: SQL injection payload safely parameterized', httpRes7.statusCode === 201 && !!tablesExist);

        await ingestionEngine.stopWebhookServer();
    } catch (e) {
        recordTest('Webhook HTTP Server Suite', false, e.message);
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 2: WhatsApp Parser Edge Cases & NLP Regex Stress
    // -------------------------------------------------------------------------
    console.log('\n--- TEST SUITE 2: WhatsApp Parser Edge Cases & NLP Regex ---');

    // 2.1 Mixed Malay/English string
    try {
        const msg1 = "Salam, saya Farhan looking for 3 room terrace in Bangi around 550k";
        const res1 = ingestionEngine.whatsappParser.parseMessageText(msg1, '0123456789');
        const pass1 = res1.name.toLowerCase() === 'farhan' &&
                      res1.preferred_location.toLowerCase() === 'bangi' &&
                      res1.max_budget === 550000 &&
                      res1.property_type === 'Terrace' &&
                      res1.min_bedrooms === 3;
        recordTest('WhatsApp: Mixed Malay/English parsing (Farhan, Bangi, 550k, Terrace, 3 beds)', pass1, 
            `Parsed: Name="${res1.name}", Loc="${res1.preferred_location}", Budget=${res1.max_budget}, Type="${res1.property_type}", Beds=${res1.min_bedrooms}`);
    } catch (e) {
        recordTest('WhatsApp: Mixed Malay/English parsing', false, e.message);
    }

    // 2.2 Multi-line message string
    try {
        const msg2 = "Hi there\nMy name is Imran\nSearching condo in PJ\nBudget RM 2.5 mil\n4 bedrooms";
        const res2 = ingestionEngine.whatsappParser.parseMessageText(msg2, '0139998877');
        const pass2 = res2.name.toLowerCase() === 'imran' &&
                      (res2.preferred_location === 'PJ' || res2.preferred_location === 'Petaling Jaya') &&
                      res2.max_budget === 2500000 &&
                      res2.property_type === 'Condo' &&
                      res2.min_bedrooms === 4;
        recordTest('WhatsApp: Multi-line message parsing (Imran, PJ, 2.5 mil, Condo, 4 beds)', pass2,
            `Parsed: Name="${res2.name}", Loc="${res2.preferred_location}", Budget=${res2.max_budget}, Type="${res2.property_type}", Beds=${res2.min_bedrooms}`);
    } catch (e) {
        recordTest('WhatsApp: Multi-line message parsing', false, e.message);
    }

    // 2.3 Missing budget in WhatsApp message
    try {
        const msg3 = "Hi, I am Tan, looking for condo in Cheras 3 bedrooms";
        const res3 = ingestionEngine.whatsappParser.parseMessageText(msg3, '0171113333');
        const pass3 = res3.name.toLowerCase() === 'tan' &&
                      res3.preferred_location.toLowerCase() === 'cheras' &&
                      res3.max_budget === 0 &&
                      res3.min_bedrooms === 3;
        recordTest('WhatsApp: Missing budget defaults to 0 cleanly', pass3,
            `Parsed: Name="${res3.name}", Loc="${res3.preferred_location}", Budget=${res3.max_budget}`);
    } catch (e) {
        recordTest('WhatsApp: Missing budget handling', false, e.message);
    }

    // 2.4 Unusual budget formats
    const budgetCases = [
        { text: "Hi I am John looking for unit budget RM 450.5k in Puchong", expected: 450500 },
        { text: "Hi I am Siti budget 2.5 mil in Cyberjaya condo", expected: 2500000 },
        { text: "Hi I am Kevin bajet RM2.5mil bungalow", expected: 2500000 },
        { text: "Hi I am Danial budget RM 600,000 terrace Shah Alam", expected: 600000 },
        { text: "Hi I am Muthu bajet 1.2 million bangi", expected: 1200000 },
        { text: "Hi I am Chong looking around 800k subang", expected: 800000 }
    ];

    for (const bCase of budgetCases) {
        try {
            const parsed = ingestionEngine.whatsappParser.parseMessageText(bCase.text, '0120000000');
            const pass = parsed.max_budget === bCase.expected;
            recordTest(`WhatsApp Budget parsing: "${bCase.text.substring(0, 35)}..." -> expected ${bCase.expected}`, pass,
                `Got max_budget = ${parsed.max_budget}`);
        } catch (e) {
            recordTest(`WhatsApp Budget parsing case`, false, e.message);
        }
    }

    // 2.5 Malay name with bin/binti & honorifics
    try {
        const msg5 = "Assalam, nama saya Encik Muhammad Haziq bin Rosli, nak cari rumah landed di Setia Alam bajet 700k";
        const res5 = ingestionEngine.whatsappParser.parseMessageText(msg5, '0182223333');
        const pass5 = res5.name.toLowerCase().includes('haziq') &&
                      res5.preferred_location === 'Setia Alam' &&
                      res5.max_budget === 700000;
        recordTest('WhatsApp: Malay honorific & full name ("Encik Muhammad Haziq bin Rosli")', pass5,
            `Extracted name: "${res5.name}"`);
    } catch (e) {
        recordTest('WhatsApp: Malay honorific name parsing', false, e.message);
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 3: Malformed CSV & Boundary Cases
    // -------------------------------------------------------------------------
    console.log('\n--- TEST SUITE 3: Malformed CSV & Boundary Cases ---');

    // 3.1 Missing headers (data on line 1)
    try {
        const csvNoHeader = "Ahmad,0123456789,ahmad@email.com,KL,500000,Condo,2,Agent Sam";
        const res1 = ingestionEngine.csvExcelParser.parseCSVContent(csvNoHeader);
        // Header normalization will treat line 1 as headers!
        // So line 1 becomes header keys, 0 records inserted.
        recordTest('CSV: Missing header row handled (0 data records inserted)', res1.buyersInserted === 0,
            `Buyers inserted: ${res1.buyersInserted}`);
    } catch (e) {
        recordTest('CSV: Missing header row handling', false, e.message);
    }

    // 3.2 Empty lines and trailing spaces/commas
    try {
        const csvEmptyLines = `Nama,Telefon,Emel,Lokasi,Bajet,Jenis Hartanah,Bilik,REN Name
        
Ahmad,0123456789,ahmad@email.com,KL,500000,Condo,2,Agent Sam
,,,,,

Bala,0198887766,bala@email.com,PJ,600000,Terrace,3,
`;
        const res2 = ingestionEngine.csvExcelParser.parseCSVContent(csvEmptyLines);
        recordTest('CSV: Empty lines and whitespace rows skipped cleanly', res2.buyersInserted === 2,
            `Buyers inserted: ${res2.buyersInserted}`);
    } catch (e) {
        recordTest('CSV: Empty lines handling', false, e.message);
    }

    // 3.3 Special characters in names and phones
    try {
        const csvSpecialChars = `Name,Phone,Location,Budget
Müller O'Connor,+6012-345 6789,Damansara Heights,1500000
D'Souza (Agent Contact),(019) 888-9900,Subang,800000`;
        const res3 = ingestionEngine.csvExcelParser.parseCSVContent(csvSpecialChars);
        const b1 = dbEngine.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = 'BYR-CSV-001'`).get();
        const b2 = dbEngine.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = 'BYR-CSV-002'`).get();
        const pass3 = res3.buyersInserted === 2 && b1 && b1.name === "Müller O'Connor" && b1.phone === "+60123456789";
        recordTest('CSV: Special chars in names & phone normalization ("Müller O\'Connor", "+6012-345 6789")', pass3,
            b1 ? `Name="${b1.name}", Phone="${b1.phone}"` : 'Failed to query inserted rows');
    } catch (e) {
        recordTest('CSV: Special characters handling', false, e.message);
    }

    // 3.4 Missing REN Name column vs empty REN name
    try {
        const csvNoRen = `Name,Phone,Location,Budget
Farida,0111222333,Bangi,400000`;
        const res4 = ingestionEngine.csvExcelParser.parseCSVContent(csvNoRen);
        recordTest('CSV: Missing REN Name column parsed without error', res4.buyersInserted === 1 && res4.rensInserted === 0);
    } catch (e) {
        recordTest('CSV: Missing REN Name column handling', false, e.message);
    }

    // 3.5 Alternate Malay & English column headers
    try {
        const csvAltHeaders = `Contact Name,Mobile,Area,Price,Jenis Hartanah,Bilik
Kamal,0167776655,Cyberjaya,700000,Semi-D,4`;
        const res5 = ingestionEngine.csvExcelParser.parseCSVContent(csvAltHeaders);
        const b = dbEngine.db.prepare(`SELECT * FROM buyer_prospects WHERE phone = '+60167776655'`).get();
        const pass5 = res5.buyersInserted === 1 && b && b.preferred_location === 'Cyberjaya' && b.max_budget === 700000;
        recordTest('CSV: Alternate headers ("Contact Name", "Mobile", "Area", "Price")', pass5,
            b ? `Loc="${b.preferred_location}", Budget=${b.max_budget}` : 'Lead not found');
    } catch (e) {
        recordTest('CSV: Alternate headers handling', false, e.message);
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 4: Duplicate Ingestion & Idempotency Audit
    // -------------------------------------------------------------------------
    console.log('\n--- TEST SUITE 4: Duplicate Ingestion & Idempotency Audit ---');

    // 4.1 Duplicate WhatsApp Message
    try {
        const waMsg = "Hi I am DuplicateWA searching condo in Shah Alam budget 500k";
        const sender = "0123334444";
        const countBefore = dbEngine.db.prepare(`SELECT COUNT(*) as c FROM buyer_prospects WHERE phone = '+60123334444'`).get().c;
        ingestionEngine.ingestWhatsAppMessage(waMsg, sender);
        ingestionEngine.ingestWhatsAppMessage(waMsg, sender);
        const countAfter = dbEngine.db.prepare(`SELECT COUNT(*) as c FROM buyer_prospects WHERE phone = '+60123334444'`).get().c;
        
        if (countAfter - countBefore > 1) {
            recordTest('WhatsApp Idempotency: Duplicate WhatsApp message causes duplicate records', false,
                `Submitting identical WhatsApp message created ${countAfter - countBefore} separate buyer prospect rows (phone: +60123334444)`);
        } else {
            recordTest('WhatsApp Idempotency: Submitting identical WhatsApp message is idempotent', true);
        }
    } catch (e) {
        recordTest('WhatsApp Idempotency Test', false, e.message);
    }

    // 4.2 Duplicate Webhook Payload without explicit buyer_id
    try {
        const whPayload = {
            name: 'Duplicate WH Lead',
            phone: '0195556666',
            location: 'Puchong',
            budget: 450000
        };
        const countBefore = dbEngine.db.prepare(`SELECT COUNT(*) as c FROM buyer_prospects WHERE phone = '+60195556666'`).get().c;
        ingestionEngine.ingestWebhookPayload(whPayload);
        ingestionEngine.ingestWebhookPayload(whPayload);
        const countAfter = dbEngine.db.prepare(`SELECT COUNT(*) as c FROM buyer_prospects WHERE phone = '+60195556666'`).get().c;

        if (countAfter - countBefore > 1) {
            recordTest('Webhook Idempotency: Duplicate webhook payload creates duplicate records', false,
                `Submitting identical webhook payload twice created ${countAfter - countBefore} separate buyer rows`);
        } else {
            recordTest('Webhook Idempotency: Submitting identical webhook payload is idempotent', true);
        }
    } catch (e) {
        recordTest('Webhook Idempotency Test', false, e.message);
    }

    // 4.3 Submitting Multiple CSV Files (Checking ID Collision Overwrites)
    try {
        const csv1 = `Name,Phone,Location,Budget\nUser One,0111111111,KL,500000`;
        const csv2 = `Name,Phone,Location,Budget\nUser Two,0222222222,PJ,600000`;

        ingestionEngine.ingestCSVData(csv1);
        const u1Before = dbEngine.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = 'BYR-CSV-001'`).get();

        ingestionEngine.ingestCSVData(csv2);
        const u1After = dbEngine.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = 'BYR-CSV-001'`).get();

        if (u1Before && u1After && u1Before.name !== u1After.name) {
            recordTest('CSV Idempotency & Unique ID: Sequential CSV imports cause ID collisions & overwrite previous leads', false,
                `Second CSV import overwrote BYR-CSV-001 ("${u1Before.name}") with ("${u1After.name}")`);
        } else {
            recordTest('CSV Idempotency & Unique ID: Sequential CSV imports assign distinct IDs', true);
        }
    } catch (e) {
        recordTest('CSV Import ID Collision Test', false, e.message);
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 5: Ingestion Stats & Lead Scoring Integrity
    // -------------------------------------------------------------------------
    console.log('\n--- TEST SUITE 5: Ingestion Engine Stats & Lead Scoring ---');

    try {
        const stats = ingestionEngine.getIngestionStats();
        const dbCount = dbEngine.db.prepare(`SELECT COUNT(*) as c FROM buyer_prospects`).get().c;
        recordTest('Ingestion Stats: totalLeadsInDatabase matches SQLite count', stats.totalLeadsInDatabase === dbCount,
            `Stats count: ${stats.totalLeadsInDatabase}, SQLite count: ${dbCount}`);
    } catch (e) {
        recordTest('Ingestion Stats Integrity', false, e.message);
    }

    dbEngine.close();
    cleanupTestDb();

    console.log('\n================================================================');
    console.log(`   STRESS TEST SUMMARY: ${results.passed}/${results.total} PASSED, ${results.failed} FAILED`);
    console.log('================================================================\n');

    if (results.vulnerabilities.length > 0) {
        console.log('--- DETECTED VULNERABILITIES & FAILURE MODES ---');
        results.vulnerabilities.forEach((v, idx) => {
            console.log(`${idx + 1}. [${v.testName}]`);
            console.log(`   ${v.details}\n`);
        });
    }

    return results;
}

runStressTests().then(res => {
    if (res.failed === 0) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}).catch(err => {
    console.error('Fatal harness error:', err);
    process.exit(1);
});
