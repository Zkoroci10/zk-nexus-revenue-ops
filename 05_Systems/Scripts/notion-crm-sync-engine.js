/**
 * ---
 * Title: Notion CRM Live Sync Engine (SDK Edition)
 * ID: SYS-026
 * Type: Script (Node.js)
 * Module: 05_Systems/Scripts
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 2.0
 * Created: 2026-08-07
 * Updated: 2026-08-07
 * Owner: Zubair (zubairisa10@gmail.com)
 * Related: SYS-004, CON-001, PRJ-016
 * ---
 *
 * Notion CRM Live Sync Engine v2.0 (SYS-026)
 * Uses official @notionhq/client SDK to sync local CSV leads
 * into all 5 Notion CRM Databases for ZK Revenue Ops.
 *
 * Usage:
 *   node 05_Systems/Scripts/notion-crm-sync-engine.js
 *   node 05_Systems/Scripts/notion-crm-sync-engine.js --test
 *   node 05_Systems/Scripts/notion-crm-sync-engine.js --file path/to/leads.csv
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// ── NOTION CONFIGURATION ────────────────────────────────────────────────────

const NOTION_TOKEN = process.env.NOTION_API_KEY || '';

const DB_IDS = {
    BUYER_LEADS:    '3ab9608c-a9d9-8104-924c-c90dc01a789e',
    LISTINGS:       '3ab9608c-a9d9-81ba-8b65-e6f3552aa744',
    DEALS:          '3ab9608c-a9d9-8185-ae5a-f3f7d1a93dda',
    REN_CLIENTS:    '3ab9608c-a9d9-8041-a1ca-c5ca98284cda',
    APPOINTMENTS:   '3ab9608c-a9d9-81bc-9988-d421ab700466',
};

const TEST_MODE = process.argv.includes('--test');
const CSV_FILE = (() => {
    const idx = process.argv.indexOf('--file');
    if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
    // Default: look for the 100-prospect batch CSV
    const defaults = [
        path.resolve(__dirname, '../../06_Resources/100_ren_prospects_batch.csv'),
        path.resolve(__dirname, '../../06_Resources/leads.csv'),
    ];
    return defaults.find(f => fs.existsSync(f)) || null;
})();

// ── INIT NOTION CLIENT ──────────────────────────────────────────────────────

if (!NOTION_TOKEN) {
    console.error('\n❌ NOTION_API_KEY is missing.');
    console.error('   Add it to your .env file:');
    console.error('   NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxx\n');
    process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// ── HELPERS ──────────────────────────────────────────────────────────────────

function parseDSR(gross, commitments) {
    const g = parseFloat(gross) || 0;
    if (g <= 0) return { net: 0, dsr: 999, tier: 'Cold' };
    const net = Math.round(g * 0.87);
    const c   = parseFloat(commitments) > 0 ? parseFloat(commitments) : Math.round(net * 0.3);
    const dsr = Math.round((c / net) * 100);
    const tier = dsr <= 40 ? 'Hot' : dsr <= 65 ? 'Warm' : 'Cold';
    return { net, dsr, tier };
}

function normalisePhone(phone) {
    let clean = (phone || '').replace(/[^0-9+]/g, '');
    if (clean.startsWith('+60')) return clean;
    if (clean.startsWith('60'))  return '+' + clean;
    if (clean.startsWith('01'))  return '+60' + clean.substring(1);
    if (clean.length >= 9)       return '+60' + clean;
    return clean;
}

function parseCSV(filepath) {
    const raw  = fs.readFileSync(filepath, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = raw.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
        const vals = [];
        let inQ = false, cur = '';
        for (const ch of line) {
            if (ch === '"') { inQ = !inQ; }
            else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
            else cur += ch;
        }
        vals.push(cur.trim());
        return Object.fromEntries(headers.map((h, i) => [h, vals[i] || '']));
    });
}

async function checkConnection() {
    console.log('\n🔍 Testing Notion API connection...');
    try {
        const me = await notion.users.me();
        console.log(`✅ Connected as: ${me.name || me.id}`);
        return true;
    } catch (e) {
        console.error(`❌ Notion connection failed: ${e.message}`);
        return false;
    }
}

// ── SYNC FUNCTIONS ──────────────────────────────────────────────────────────

async function syncLeadToNotion(lead) {
    const { net, dsr, tier } = parseDSR(lead['Gross Income'] || lead['gross_income'] || lead['income'], lead['Commitments'] || lead['commitments']);
    const phone = normalisePhone(lead['Phone'] || lead['phone'] || lead['contact']);
    const name  = lead['Name'] || lead['name'] || lead['buyer_name'] || 'Unknown Lead';
    const assignedREN = lead['Assigned REN'] || lead['assigned_ren'] || lead['assignedClientId'] || 'REN-001';
    const project = lead['Project Interest'] || lead['project'] || 'Not Specified';

    const properties = {
        'Name':            { title: [{ text: { content: name } }] },
        'Phone':           { phone_number: phone },
        'Assigned REN':    { select: { name: assignedREN } },
        'Tier':            { select: { name: tier } },
        'DSR Ratio':       { number: dsr },
        'Net Income':      { number: net },
        'Project Interest':{ rich_text: [{ text: { content: project } }] },
        'Status':          { select: { name: 'New Lead' } },
        'Source':          { select: { name: 'CSV Import' } },
    };

    // Add optional fields if present
    if (lead['Email'] || lead['email']) {
        properties['Email'] = { email: lead['Email'] || lead['email'] };
    }

    try {
        await notion.pages.create({
            parent: { database_id: DB_IDS.BUYER_LEADS },
            properties,
        });
        return { success: true, name, tier, dsr };
    } catch (e) {
        return { success: false, name, error: e.message };
    }
}

async function syncRENClientsToNotion() {
    console.log('\n📋 Syncing REN Client Retainers...');
    const renClients = [
        { id: 'REN-001', name: 'Ahmad Razif', agency: 'Subang Jaya Property Hub', territory: 'Subang Jaya & USJ', tier: 'Enterprise', fee: 1500 },
        { id: 'REN-002', name: 'Sarah Tan',   agency: 'Shah Alam Real Estate',      territory: 'Shah Alam North & Setia Alam', tier: 'Growth', fee: 1000 },
        { id: 'REN-003', name: 'Kevon Lee',   agency: 'Cyberjaya Prime Property',   territory: 'Cyberjaya & Puchong', tier: 'Starter', fee: 800 },
    ];

    for (const client of renClients) {
        try {
            await notion.pages.create({
                parent: { database_id: DB_IDS.REN_CLIENTS },
                properties: {
                    'Name':          { title: [{ text: { content: `${client.id} — ${client.name}` } }] },
                    'Agency':        { rich_text: [{ text: { content: client.agency } }] },
                    'Territory':     { rich_text: [{ text: { content: client.territory } }] },
                    'Retainer Tier': { select: { name: client.tier } },
                    'Monthly Fee':   { number: client.fee },
                    'Status':        { select: { name: 'Active' } },
                },
            });
            console.log(`  ✅ ${client.id} (${client.name}) synced`);
        } catch (e) {
            console.log(`  ⚠️  ${client.id} — ${e.message.includes('already') ? 'already exists (skip)' : e.message}`);
        }
    }
}

// ── MAIN EXECUTION ───────────────────────────────────────────────────────────

async function main() {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║  ZK Revenue Ops — Notion CRM Sync Engine v2.0        ║');
    console.log('║  SYS-026 | @notionhq/client SDK                      ║');
    console.log('╚══════════════════════════════════════════════════════╝');

    const connected = await checkConnection();
    if (!connected) return;

    if (TEST_MODE) {
        console.log('\n✅ TEST MODE PASS — Connection verified. No data written.');
        console.log('   Run without --test to sync leads.\n');
        return;
    }

    // Sync REN Clients
    await syncRENClientsToNotion();

    // Sync Leads from CSV
    if (!CSV_FILE) {
        console.log('\n⚠️  No CSV file found. Provide with --file path/to/leads.csv');
        console.log('   Expected default paths:');
        console.log('   - 06_Resources/100_ren_prospects_batch.csv');
        console.log('   - 06_Resources/leads.csv\n');
        return;
    }

    console.log(`\n📂 Loading leads from: ${path.basename(CSV_FILE)}`);
    const leads = parseCSV(CSV_FILE);
    console.log(`   Found ${leads.length} leads to sync.\n`);

    let passed = 0, failed = 0;
    for (let i = 0; i < leads.length; i++) {
        const result = await syncLeadToNotion(leads[i]);
        if (result.success) {
            console.log(`  [${i+1}/${leads.length}] ✅ ${result.name} | ${result.tier} | DSR: ${result.dsr}%`);
            passed++;
        } else {
            console.log(`  [${i+1}/${leads.length}] ❌ ${result.name} — ${result.error}`);
            failed++;
        }
        // Rate-limit: 3 requests/sec safe for Notion API
        await new Promise(r => setTimeout(r, 340));
    }

    console.log('\n══════════════════════════════════════════════════════');
    console.log(`  SYNC COMPLETE: ${passed} passed | ${failed} failed`);
    console.log('══════════════════════════════════════════════════════\n');
}

main().catch(console.error);
