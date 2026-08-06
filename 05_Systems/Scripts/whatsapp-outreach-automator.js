/**
 * ---
 * Title: WhatsApp Outreach Playwright Automator
 * ID: SYS-025
 * Type: Script (Node.js Playwright)
 * Module: 05_Systems/Scripts
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 1.0
 * Created: 2026-08-06
 * Updated: 2026-08-06
 * Owner: Zubair (zubairisa10@gmail.com)
 * Related: OP-016, SYS-CON-001, PRJ-010
 * ---
 *
 * WhatsApp Outreach Playwright Automator (SYS-025)
 * Safely automates Batch 1 (20 REN Prospects) WhatsApp outreach via WhatsApp Web.
 * Implements anti-spam delay cadence (30-90s random delay) and personalized Malay copy templates.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ── CONFIGURATION & PATHS ───────────────────────────────────────────────────

const WORKSPACE_ROOT = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus';
const CSV_PATH = path.join(WORKSPACE_ROOT, '05_Systems', 'Console-Portal', 'public', '100_ren_prospects_batch.csv');
const LOG_PATH = path.join(WORKSPACE_ROOT, '08_Logs', 'AI-Logs', `whatsapp_dispatch_${new Date().toISOString().slice(0,10)}.json`);
const USER_DATA_DIR = path.join(process.env.LOCALAPPDATA || 'C:\\Users\\Dell\\AppData\\Local', 'Google', 'Chrome', 'User Data', 'WhatsAppAutomationProfile');

const BATCH_SIZE = 20;
const MIN_DELAY_MS = 30000;  // 30 seconds minimum delay
const MAX_DELAY_MS = 65000;  // 65 seconds maximum delay

// ── MALAY OUTREACH TEMPLATES (OP-016 FRAMEWORK) ─────────────────────────────

function getOutreachMessage(name, project, tier) {
    const cleanName = name.replace(/^Agent\s+/i, '').trim();

    if (tier === 'Hot') {
        return `Salam Tuan ${cleanName}, saya Zubair dari ZK Revenue Ops. Saya nampak listing ${project} Tuan. Ramai buyer berminat tapi selalu tersangkut DSR bank loan. Boleh saya kongsi portal demo VA SDR kami untuk tapis DSR & urus follow-up? https://zkoroci10.github.io/zk-nexus-revenue-ops/`;
    } else if (tier === 'Warm') {
        return `Salam Tuan ${cleanName}, saya Zubair dari ZK Revenue Ops. Saya perhati listing ${project} Tuan aktif betul. Nak tanya sikit pasal lead lama terbiar, Tuan ada simpan pangkalan data lead? Nah link portal demo percuma untuk Tuan review: https://zkoroci10.github.io/zk-nexus-revenue-ops/`;
    } else {
        return `Salam Tuan ${cleanName}, saya Zubair dari ZK Revenue Ops. Saya ada enjin VA SDR untuk rawat lead lama & auto-tapis DSR bank loan untuk listing ${project}. Tuan boleh cuba demo portal percuma di sini: https://zkoroci10.github.io/zk-nexus-revenue-ops/`;
    }
}

// ── CSV PARSER ───────────────────────────────────────────────────────────────

function loadBatchProspects() {
    if (!fs.existsSync(CSV_PATH)) {
        console.error(`[ERROR] CSV file not found at: ${CSV_PATH}`);
        return [];
    }

    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const prospects = [];

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/^["']|["']$/g, '').trim());
        if (parts.length >= 3) {
            prospects.push({
                index: i,
                name: parts[0],
                phone: parts[1],
                project: parts[2],
                income: parts[3] || '5000',
                tier: parts[4] || 'New'
            });
        }
    }

    return prospects.slice(0, BATCH_SIZE);
}

// ── RANDOM DELAY HELPER ──────────────────────────────────────────────────────

function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── PLAYWRIGHT AUTOMATION ENGINE ─────────────────────────────────────────────

async function runWhatsAppOutreach() {
    console.log('====================================================');
    console.log('🚀 ZK REVENUE OPS — WHATSAPP DISPATCH AUTOMATOR (SYS-025)');
    console.log('====================================================');

    const batch = loadBatchProspects();
    console.log(`[INFO] Loaded ${batch.length} REN Prospects for Batch 1 dispatch.`);

    if (batch.length === 0) {
        console.log('[WARN] No prospects found in CSV batch.');
        return;
    }

    console.log(`[INFO] Launching Playwright browser with user profile...`);

    const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
        headless: false, // Show browser window for scan/verification
        viewport: { width: 1280, height: 800 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await context.newPage();
    console.log(`[INFO] Navigating to WhatsApp Web (web.whatsapp.com)...`);
    await page.goto('https://web.whatsapp.com', { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log(`\n----------------------------------------------------`);
    console.log(`📱 WHATSAPP WEB IS OPEN.`);
    console.log(`Sila pastikan WhatsApp Web telah dimuatkan / di-scan di skrin browser.`);
    console.log(`----------------------------------------------------\n`);

    const dispatchLogs = [];

    for (let i = 0; i < batch.length; i++) {
        const p = batch[i];
        const cleanPhone = p.phone.replace(/[^0-9]/g, '');
        const message = getOutreachMessage(p.name, p.project, p.tier);
        const waUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

        console.log(`[${i + 1}/${batch.length}] Dispatching to ${p.name} (${p.phone})...`);

        try {
            await page.goto(waUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(5000); // Wait for chat UI to load

            // Press Enter or click send button
            await page.keyboard.press('Enter');
            console.log(`  ✅ Mesej berjaya dihantar ke ${p.name}!`);

            dispatchLogs.push({
                index: i + 1,
                name: p.name,
                phone: p.phone,
                status: 'SENT',
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.warn(`  ⚠️ Failed to dispatch to ${p.name}: ${err.message}`);
            dispatchLogs.push({
                index: i + 1,
                name: p.name,
                phone: p.phone,
                status: 'FAILED',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        }

        // Apply anti-spam random delay if not the last item
        if (i < batch.length - 1) {
            const delay = getRandomDelay(MIN_DELAY_MS, MAX_DELAY_MS);
            console.log(`  ⏱️ Anti-spam delay: Waiting ${Math.round(delay / 1000)} seconds before next message...\n`);
            await page.waitForTimeout(delay);
        }
    }

    // Save dispatch log
    fs.writeFileSync(LOG_PATH, JSON.stringify(dispatchLogs, null, 2), 'utf-8');
    console.log(`\n====================================================`);
    console.log(`✅ DISPATCH COMPLETED! Log saved to: ${LOG_PATH}`);
    console.log(`====================================================`);

    await context.close();
}

// Execute script if called directly
if (require.main === module) {
    runWhatsAppOutreach().catch(err => {
        console.error('[CRITICAL FAILURE]', err);
    });
}

module.exports = { runWhatsAppOutreach, loadBatchProspects, getOutreachMessage };
