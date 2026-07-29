/**
 * ZK Revenue Ops — Stage 1 WhatsApp Cold Outreach Dispatcher
 * Prepares & dispatches Stage 1 Hooks to 100 REN prospects across 6 Macro Zones
 */

const fs = require('fs');
const path = require('path');
const { generateFounderWhatsAppSequence } = require('../Ingestion/whatsapp_parser.js');

const PROSPECTS_FILE = path.join(__dirname, '../../01_Business/ZK-Revenue-Ops/Leads/ren_prospects_100.json');
const OUTREACH_LOG_FILE = path.join(__dirname, '../../08_Logs/stage1_outreach_dispatch_log.json');

function runStage1Dispatch() {
    console.log("================ STAGE 1 OUTREACH DISPATCHER (BRAVE BROWSER) ================");

    if (!fs.existsSync(PROSPECTS_FILE)) {
        console.error("ERROR: Prospect database not found!");
        return;
    }

    const prospects = JSON.parse(fs.readFileSync(PROSPECTS_FILE, 'utf8'));
    const dispatchQueue = [];

    prospects.forEach(ren => {
        const sequence = generateFounderWhatsAppSequence(ren);
        dispatchQueue.push({
            prospect_id: ren.id,
            name: ren.name,
            ren_number: ren.ren_number,
            agency: ren.agency,
            phone: ren.phone,
            zone_code: ren.zone_code,
            micro_location: ren.micro_location,
            stage1_message: sequence.message1,
            stage2_message: sequence.message2,
            stage3_message: sequence.message3,
            status: "Queued for Dispatch",
            dispatched_at: new Date().toISOString()
        });
    });

    // Ensure log directory exists
    const dir = path.dirname(OUTREACH_LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(dispatchQueue, null, 2), 'utf8');
    console.log(`SUCCESS: 100 Stage 1 Hook Messages queued & formatted.`);
    console.log(`Saved log: ${OUTREACH_LOG_FILE}`);
}

runStage1Dispatch();
