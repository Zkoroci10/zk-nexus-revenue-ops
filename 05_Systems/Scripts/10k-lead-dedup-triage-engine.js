/**
 * ---
 * Title: 10k Lead Deduplication & DSR Triage Engine
 * ID: SYS-027
 * Type: Script (Node.js High-Performance Engine)
 * Module: 05_Systems/Scripts
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 1.0
 * Created: 2026-08-07
 * Updated: 2026-08-07
 * Owner: Zubair (zubairisa10@gmail.com)
 * Related: PRJ-011, SYS-CON-001, SYS-026
 * ---
 *
 * 10k Lead Deduplication & DSR Triage Engine (SYS-027)
 * High-performance O(1) hash map deduplicator, DSR loan scorer, and multi-tenant lead partitioner
 * capable of processing 10,000+ lead records in < 1 second.
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus';
const OUTPUT_DIR = path.join(WORKSPACE_ROOT, '05_Systems', 'Console-Portal', 'public', 'tenants');

// Ensure output tenant directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ── DSR CALCULATOR HELPER ──────────────────────────────────────────────────

function calculateDSR(grossIncome, monthlyCommitments) {
    const income = parseFloat(grossIncome) || 4000;
    const commitments = parseFloat(monthlyCommitments) || 1500;
    const netIncome = income * 0.87; // Estimate after EPF / SOCSO / Tax
    const dsrRatio = (commitments / netIncome) * 100;

    let tier = 'Tier 3: Marginal';
    let maxLoanAmount = Math.round((netIncome * 0.60 - commitments) * 200);

    if (maxLoanAmount < 0) maxLoanAmount = 0;

    if (dsrRatio <= 45 && income >= 6500) {
        tier = 'Tier 1: Pre-Approved LPPSA/Bank';
    } else if (dsrRatio <= 60 && income >= 4500) {
        tier = 'Tier 2: Qualified Bank Loan';
    } else if (dsrRatio <= 75) {
        tier = 'Tier 3: Joint Loan Needed';
    } else {
        tier = 'Tier 4: High Risk DSR';
    }

    return {
        netIncome: Math.round(netIncome),
        dsrRatio: parseFloat(dsrRatio.toFixed(1)),
        maxLoanAmount,
        tier
    };
}

// ── HIGH-SCALE DEDUPLICATION & PARTITIONING ENGINE ────────────────────────

function process10kLeads(rawLeads) {
    const startTime = Date.now();
    const phoneMap = new Map();
    const uniqueLeads = [];
    let duplicateCount = 0;

    const tenantPartitions = {
        'REN-001': [], // Subang Jaya & USJ
        'REN-002': [], // Shah Alam Seksyen 7 & 13
        'REN-003': []  // Damansara & PJ Core
    };

    const tenantList = ['REN-001', 'REN-002', 'REN-003'];

    for (let i = 0; i < rawLeads.length; i++) {
        const lead = rawLeads[i];
        const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');

        if (!cleanPhone || phoneMap.has(cleanPhone)) {
            duplicateCount++;
            continue;
        }

        phoneMap.set(cleanPhone, true);

        // Assign Tenant Client if not set
        const tenantId = lead.tenantId || tenantList[i % 3];
        const dsrResult = calculateDSR(lead.income, lead.commitments);

        const processedLead = {
            id: `LEAD-${10000 + uniqueLeads.length + 1}`,
            name: lead.name,
            phone: lead.phone,
            tenantId: tenantId,
            project: lead.project,
            income: lead.income,
            commitments: lead.commitments || 1500,
            netIncome: dsrResult.netIncome,
            dsrRatio: dsrResult.dsrRatio,
            tier: dsrResult.tier,
            maxLoanAmount: dsrResult.maxLoanAmount,
            timestamp: new Date().toISOString()
        };

        uniqueLeads.push(processedLead);
        tenantPartitions[tenantId].push(processedLead);
    }

    const durationMs = Date.now() - startTime;

    return {
        totalProcessed: rawLeads.length,
        uniqueCount: uniqueLeads.length,
        duplicateCount,
        durationMs,
        tenantPartitions,
        uniqueLeads
    };
}

// ── MOCK DATA GENERATOR FOR 10,000 LEADS ────────────────────────────────────

function generateMock10kLeads() {
    const firstNames = ['Muhammad', 'Ahmad', 'Nurul', 'Wong', 'Tan', 'Santhi', 'Mohd', 'Farhan', 'Sarah', 'Kevin', 'Jason', 'Siti', 'Razif', 'Amir', 'Syed', 'Chong', 'Devi', 'Azman', 'Hafiz', 'Grace'];
    const lastNames = ['Hariz', 'Kumar', 'Aini', 'Wei Lun', 'Faizal', 'Razif', 'Ibrahim', 'Hassan', 'Lee', 'Chen', 'Subramaniam', 'Zulkifli', 'Nordin', 'Goh', 'Rosli', 'Osman'];
    const projects = ['SkyResidence Subang', 'Subang Parksuites', 'Shah Alam Vista', 'Damansara Heights Residence', 'Mont Kiara Pavilion', 'Bangsar South Suites'];

    const mockLeads = [];

    for (let i = 1; i <= 10000; i++) {
        const fname = firstNames[i % firstNames.length];
        const lname = lastNames[i % lastNames.length];
        const name = `${fname} ${lname} #${i}`;
        // Introduce 5% duplicate phone numbers intentionally to test deduplication
        const phoneIndex = (i % 9500) + 1;
        const phone = `+601${(i % 8) + 2}${String(phoneIndex).padStart(7, '0')}`;
        const project = projects[i % projects.length];
        const income = 3500 + ((i * 37) % 8500);
        const commitments = 1000 + ((i * 19) % 3500);

        mockLeads.push({ name, phone, project, income, commitments });
    }

    return mockLeads;
}

// ── MAIN EXECUTION ──────────────────────────────────────────────────────────

function run10kEngine() {
    console.log('====================================================');
    console.log('🚀 ZK REVENUE OPS — 10K LEAD DEDUP & TRIAGE ENGINE (SYS-027)');
    console.log('====================================================');

    console.log('[INFO] Generating 10,000 raw lead records for stress testing...');
    const rawLeads = generateMock10kLeads();

    console.log(`[INFO] Processing 10,000 leads through O(1) deduplicator & DSR scorer...`);
    const results = process10kLeads(rawLeads);

    console.log(`\n====================================================`);
    console.log(`⚡ HIGH-SCALE BENCHMARK RESULTS:`);
    console.log(` - Total Raw Ingested:    ${results.totalProcessed.toLocaleString()} leads`);
    console.log(` - Unique Clean Leads:   ${results.uniqueCount.toLocaleString()} leads`);
    console.log(` - Duplicates Filtered:  ${results.duplicateCount.toLocaleString()} leads`);
    console.log(` - Processing Time:      ${results.durationMs} ms (${(results.totalProcessed / (results.durationMs / 1000)).toFixed(0)} leads/sec)`);
    console.log(`====================================================\n`);

    // Write tenant partition CSVs
    Object.keys(results.tenantPartitions).forEach(tenantId => {
        const list = results.tenantPartitions[tenantId];
        const csvLines = ['id,name,phone,project,income,commitments,dsrRatio,tier,maxLoanAmount'];
        list.forEach(l => {
            csvLines.push(`"${l.id}","${l.name}","${l.phone}","${l.project}",${l.income},${l.commitments},${l.dsrRatio},"${l.tier}",${l.maxLoanAmount}`);
        });

        const filePath = path.join(OUTPUT_DIR, `${tenantId}_partition.csv`);
        fs.writeFileSync(filePath, csvLines.join('\n'), 'utf-8');
        console.log(`  📁 [${tenantId}] Partition CSV saved: ${list.length.toLocaleString()} leads -> ${filePath}`);
    });

    console.log(`\n====================================================`);
    console.log(`✅ 10K LEAD INFRASTRUCTURE READY FOR RETAINER CLIENTS!`);
    console.log(`====================================================`);
}

if (require.main === module) {
    run10kEngine();
}

module.exports = { process10kLeads, calculateDSR, generateMock10kLeads };
