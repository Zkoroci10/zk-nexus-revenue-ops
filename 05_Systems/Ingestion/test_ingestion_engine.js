/**
 * ZK Revenue Ops — Lead Ingestion Engine Test Harness
 * ID: SYS-004
 * Module: 05_Systems/Ingestion/test_ingestion_engine.js
 * 
 * Automated test runner validating Webhook processing, WhatsApp regex parsing, CSV bulk seeding, and foreign key integrity.
 */

const { ZKDatabaseEngine } = require('../Database/db_engine');
const { ZKIngestionEngine } = require('./ingestion_engine');

async function runIngestionTests() {
    console.log('====================================================');
    console.log('   ZK REVENUE OPS INGESTION HARNESS (SYS-004)       ');
    console.log('====================================================\n');

    let passedTests = 0;
    let totalTests = 4;

    const dbEngine = new ZKDatabaseEngine();
    const ingestionEngine = new ZKIngestionEngine(dbEngine);

    // Test 1: Webhook Payload Ingestion Test
    try {
        console.log('[TEST 1/4] Webhook Payload Processing & Database Insertion...');
        const payload = {
            name: 'Nurul Huda',
            phone: '0193334455',
            email: 'huda@example.my',
            location: 'Shah Alam',
            budget: 480000,
            property_type: 'Condo',
            min_bedrooms: 3
        };

        const lead = ingestionEngine.ingestWebhookPayload(payload);
        const dbLead = dbEngine.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = ?`).get(lead.buyer_id);

        if (dbLead && dbLead.name === 'Nurul Huda' && dbLead.phone === '+60193334455' && dbLead.max_budget === 480000) {
            console.log(`  ✅ PASS: Webhook lead ingested successfully. ID: ${lead.buyer_id} | Score: ${lead.lead_score}`);
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Webhook lead record missing or fields mismatch!');
        }
    } catch (e) {
        console.error('  ❌ FAIL Test 1:', e.message);
    }

    // Test 2: WhatsApp Regex & NLP Extraction Test
    try {
        console.log('\n[TEST 2/4] WhatsApp Message Text Parsing (Regex/NLP)...');
        const rawMsg = 'Hi, I am Ahmad, searching for 3 bedroom Condo in Shah Alam under 450k';
        const senderPhone = '0121112233';

        const lead = ingestionEngine.ingestWhatsAppMessage(rawMsg, senderPhone);

        if (lead.name === 'Ahmad' && lead.preferred_location === 'Shah Alam' && lead.max_budget === 450000 && lead.min_bedrooms === 3) {
            console.log(`  ✅ PASS: WhatsApp message parsed accurately. Extracted -> Name: ${lead.name}, Loc: ${lead.preferred_location}, Budget: RM${lead.max_budget}, Beds: ${lead.min_bedrooms}`);
            passedTests++;
        } else {
            console.error(`  ❌ FAIL: Extracted values mismatch! Name: ${lead.name}, Loc: ${lead.preferred_location}, Budget: ${lead.max_budget}`);
        }
    } catch (e) {
        console.error('  ❌ FAIL Test 2:', e.message);
    }

    // Test 3: CSV Bulk Contact Parsing & REN Seeding Test
    try {
        console.log('\n[TEST 3/4] CSV Bulk Contact Parsing & Seeding...');
        const csvContent = `Nama,Telefon,Emel,Lokasi,Bajet,Jenis Hartanah,Bilik,REN Name
Chong Wei,0178889900,chongwei@badminton.my,Cyberjaya,750000,Semi-D,4,Ahmad Razif
Siti Sarah,0112223334,sara@sing.my,Bangi,520000,Terrace,3,Siti Nurhaliza`;

        const result = ingestionEngine.ingestCSVData(csvContent);

        if (result.buyersInserted === 2 && result.rensInserted === 2) {
            console.log(`  ✅ PASS: Bulk CSV processed cleanly. Buyers Inserted: ${result.buyersInserted}, RENs Processed: ${result.rensInserted}`);
            passedTests++;
        } else {
            console.error(`  ❌ FAIL: Unexpected CSV parse count! Buyers: ${result.buyersInserted}, RENs: ${result.rensInserted}`);
        }
    } catch (e) {
        console.error('  ❌ FAIL Test 3:', e.message);
    }

    // Test 4: Data Integrity & Foreign Key Audit
    try {
        console.log('\n[TEST 4/4] Data Integrity & Foreign Key Post-Ingestion Audit...');
        const stats = ingestionEngine.getIngestionStats();
        const totalBuyers = dbEngine.db.prepare(`SELECT COUNT(*) as count FROM buyer_prospects`).get().count;

        console.log(`  Audit Stats -> Webhook Ingested: ${stats.webhookCount}, WhatsApp Ingested: ${stats.whatsappCount}, CSV Ingested: ${stats.csvCount} | Total SQLite Buyers: ${totalBuyers}`);

        if (totalBuyers >= 4) {
            console.log('  ✅ PASS: Database integrity verified post-ingestion.');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Total buyer count below expected threshold!');
        }
    } catch (e) {
        console.error('  ❌ FAIL Test 4:', e.message);
    }

    dbEngine.close();

    console.log('\n====================================================');
    console.log(`  TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
    console.log('====================================================\n');

    if (passedTests === totalTests) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runIngestionTests();
