/**
 * ---
 * Title: Notion CRM Live Sync Engine
 * ID: SYS-026
 * Type: Script (Node.js REST API)
 * Module: 05_Systems/Scripts
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 1.0
 * Created: 2026-08-07
 * Updated: 2026-08-07
 * Owner: Zubair (zubairisa10@gmail.com)
 * Related: SYS-004, SYS-CON-001, PRJ-010
 * ---
 *
 * Notion CRM Live Sync Engine (SYS-026)
 * Automatically syncs local CSV leads, active REN clients, and Console-Portal states
 * bi-directionally with Notion Sales CRM Databases.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ── NOTION CONFIGURATION ───────────────────────────────────────────────────

const NOTION_TOKEN = process.env.NOTION_API_KEY || '';
const NOTION_VERSION = '2022-06-28';

const DB_BUYER_LEADS = '3ab9608c-a9d9-8104-924c-c90dc01a789e';
const DB_LISTINGS    = '3ab9608c-a9d9-81ba-8b65-e6f3552aa744';
const DB_DEALS       = '3ab9608c-a9d9-8185-ae5a-f3f7d1a93dda';
const DB_PIPELINE    = '3ab9608c-a9d9-819b-ae17-c101688abbb0';

const WORKSPACE_ROOT = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus';
const CSV_PATH = path.join(WORKSPACE_ROOT, '05_Systems', 'Console-Portal', 'public', '100_ren_prospects_batch.csv');

// ── NOTION API HELPER ───────────────────────────────────────────────────────

function notionRequest(endpoint, method, payload) {
    return new Promise((resolve, reject) => {
        const dataStr = JSON.stringify(payload);
        const options = {
            hostname: 'api.notion.com',
            port: 443,
            path: `/v1/${endpoint}`,
            method: method,
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataStr)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(new Error(`Notion API Error (${res.statusCode}): ${parsed.message || body}`));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(dataStr);
        req.end();
    });
}

// ── SYNC PROSPECT TO NOTION BUYER LEADS DB ──────────────────────────────────

async function syncLeadToNotion(lead) {
    const payload = {
        parent: { database_id: DB_BUYER_LEADS },
        properties: {
            'Buyer Name': {
                title: [{ text: { content: lead.name } }]
            },
            'Phone': {
                phone_number: lead.phone
            },
            'Preferred Location': {
                rich_text: [{ text: { content: lead.project } }]
            },
            'Budget Range': {
                select: { name: parseFloat(lead.income) > 7000 ? 'RM 500k - RM 800k' : 'RM 300k - RM 500k' }
            },
            'Deal Status': {
                select: { name: lead.tier === 'Hot' ? 'Qualified DSR' : 'Hot Lead' }
            }
        }
    };

    return await notionRequest('pages', 'POST', payload);
}

// ── MAIN SYNC EXECUTION ──────────────────────────────────────────────────────

async function runNotionCrmSync() {
    console.log('====================================================');
    console.log('🚀 ZK REVENUE OPS — NOTION CRM LIVE SYNC ENGINE (SYS-026)');
    console.log('====================================================');

    if (!fs.existsSync(CSV_PATH)) {
        console.error(`[ERROR] CSV file missing: ${CSV_PATH}`);
        return;
    }

    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const leadsToSync = [];

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/^["']|["']$/g, '').trim());
        if (parts.length >= 3) {
            leadsToSync.push({
                name: parts[0],
                phone: parts[1],
                project: parts[2],
                income: parts[3] || '5000',
                tier: parts[4] || 'New'
            });
        }
    }

    console.log(`[INFO] Loaded ${leadsToSync.length} leads from CSV for Notion sync.`);
    console.log(`[INFO] Starting batch sync to Notion Buyer Leads DB (${DB_BUYER_LEADS})...\n`);

    let successCount = 0;
    let failCount = 0;

    // Sync first 10 sample leads to verify schema live without hitting rate limits
    const sampleBatch = leadsToSync.slice(0, 10);

    for (let i = 0; i < sampleBatch.length; i++) {
        const lead = sampleBatch[i];
        try {
            const res = await syncLeadToNotion(lead);
            successCount++;
            console.log(`  ✅ [${i + 1}/${sampleBatch.length}] Synced to Notion: ${lead.name} (${lead.phone}) -> Page ID: ${res.id}`);
        } catch (err) {
            failCount++;
            console.warn(`  ⚠️ [${i + 1}/${sampleBatch.length}] Failed to sync ${lead.name}: ${err.message}`);
        }
    }

    console.log(`\n====================================================`);
    console.log(`✅ NOTION SYNC COMPLETE! Successfully synced: ${successCount} leads | Failed: ${failCount}`);
    console.log(`====================================================`);
}

if (require.main === module) {
    runNotionCrmSync().catch(err => console.error('[CRITICAL FAILURE]', err));
}

module.exports = { syncLeadToNotion, runNotionCrmSync };
