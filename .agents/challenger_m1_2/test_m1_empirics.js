const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== EMPIRICAL TEST HARNESS FOR MILESTONE M1 ===\n');

const appJsPath = path.join(__dirname, '../../05_Systems/Console-Portal/public/js/app.js');
const rootAppJsPath = path.join(__dirname, '../../js/app.js');
const indexHtmlPath = path.join(__dirname, '../../05_Systems/Console-Portal/public/index.html');

console.log('1. Checking file sync between 05_Systems and root...');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');
const rootAppJsContent = fs.readFileSync(rootAppJsPath, 'utf8');

if (appJsContent !== rootAppJsContent) {
    console.error('❌ FAIL: 05_Systems/Console-Portal/public/js/app.js and root js/app.js are NOT identical!');
} else {
    console.log('✅ PASS: app.js files are 100% identical mirror.');
}

// Prepare mock DOM environment for app.js loading
const domElements = {};
const mockElement = (id) => ({
    id,
    value: '',
    textContent: '',
    className: '',
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    setAttribute: () => {},
    appendChild: () => {},
    innerHTML: '',
    style: {}
});

const sandbox = {
    console: console,
    localStorage: {
        getItem: () => null,
        setItem: () => {}
    },
    document: {
        getElementById: (id) => domElements[id] || (domElements[id] = mockElement(id)),
        createElement: (tag) => mockElement(tag),
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener: () => {}
    },
    window: {
        print: () => {}
    },
    fetch: () => Promise.resolve(),
    alert: () => {},
    setTimeout: setTimeout,
    Math: Math,
    parseFloat: parseFloat,
    parseInt: parseInt,
    String: String,
    Date: Date,
    JSON: JSON
};

vm.createContext(sandbox);
vm.runInContext(appJsContent, sandbox);

console.log('\n2. Testing DSR Calculation Functions & Boundary Cases...');

// Function 1: calculateDsrMetrics
const calculateDsrMetrics = sandbox.calculateDsrMetrics;

console.log('\n--- 2.1 Testing calculateDsrMetrics() ---');

// Case A: Gross Income = 0, Commitments = 0
const resZero = calculateDsrMetrics(0, 0);
console.log('Gross = 0, Commitments = 0:', resZero);
if (resZero.tier === 'Hot' || resZero.loanStatus === 'Pre-Approved') {
    console.error('❌ FAIL (BUG): Gross Income = 0 resulted in Tier "Hot" & "Pre-Approved"!');
} else {
    console.log('✅ PASS: Gross Income = 0 handled correctly.');
}

// Case B: Gross Income = 10,000, Commitments = 0
const resTenKZeroComm = calculateDsrMetrics(10000, 0);
console.log('Gross = 10,000, Commitments = 0:', resTenKZeroComm);
if (resTenKZeroComm.commitments !== 0) {
    console.error(`❌ FAIL (BUG): Gross Income = 10,000, Commitments = 0 resulted in commitments = ${resTenKZeroComm.commitments} instead of 0!`);
} else {
    console.log('✅ PASS: Commitments = 0 retained as 0.');
}

// Case C: DSR = 39.9% (Net Income = 8700, Commitment = 3471 -> 3471/8700 = 0.398965 -> ~39.9%)
// Note: netIncome for 10k is 8700. 39.9% of 8700 is 3471.3.
const res399 = calculateDsrMetrics(10000, 3471);
console.log('Gross = 10,000, Commitments = 3,471 (DSR ~39.9%):', res399);
if (res399.tier !== 'Hot' || res399.loanStatus !== 'Pre-Approved') {
    console.error(`❌ FAIL: Expected Hot/Pre-Approved for 39.9% DSR, got tier=${res399.tier}, loanStatus=${res399.loanStatus}`);
} else {
    console.log('✅ PASS: DSR 39.9% is Tier 1 Pre-Approved.');
}

// Case D: DSR = 40.0% (Net Income = 8700, Commitment = 3480 -> 3480/8700 = 0.4000 -> 40.0%)
const res400 = calculateDsrMetrics(10000, 3480);
console.log('Gross = 10,000, Commitments = 3,480 (DSR 40.0%):', res400);
if (res400.tier !== 'Hot' || res400.loanStatus !== 'Pre-Approved') {
    console.error(`❌ FAIL: Expected Tier 1 Pre-Approved (Hot/Pre-Approved) for 40.0% DSR, got tier=${res400.tier}, loanStatus=${res400.loanStatus}`);
} else {
    console.log('✅ PASS: DSR 40.0% is Tier 1 Pre-Approved.');
}

// Case E: DSR = 64.9% (Net Income = 8700, Commitment = 5646 -> 5646/8700 = 0.648965 -> ~64.9%)
const res649 = calculateDsrMetrics(10000, 5646);
console.log('Gross = 10,000, Commitments = 5,646 (DSR ~64.9%):', res649);
if (res649.tier !== 'Warm' || res649.loanStatus !== 'Documents Collected') {
    console.error(`❌ FAIL: Expected Warm/Documents Collected for 64.9% DSR, got tier=${res649.tier}, loanStatus=${res649.loanStatus}`);
} else {
    console.log('✅ PASS: DSR 64.9% is Tier 2 Qualified.');
}

// Case F: DSR = 65.0% (Net Income = 8700, Commitment = 5655 -> 5655/8700 = 0.6500 -> 65.0%)
const res650 = calculateDsrMetrics(10000, 5655);
console.log('Gross = 10,000, Commitments = 5,655 (DSR 65.0%):', res650);
console.log(`DSR 65.0% evaluated as: tier=${res650.tier}, loanStatus=${res650.loanStatus}`);

// Case G: DSR = 66.0%+ High Risk (Net Income = 8700, Commitment = 5742 -> 5742/8700 = 0.6600 -> 66.0%)
const res660 = calculateDsrMetrics(10000, 5742);
console.log('Gross = 10,000, Commitments = 5,742 (DSR 66.0%):', res660);
if ((res660.tier !== 'Cold' && res660.tier !== 'New') || res660.loanStatus !== 'Pending Submission') {
    console.error(`❌ FAIL: Expected High Risk (Cold/Pending Submission) for 66% DSR, got tier=${res660.tier}, loanStatus=${res660.loanStatus}`);
} else {
    console.log('✅ PASS: DSR 66.0%+ is High Risk.');
}


console.log('\n--- 2.2 Testing interactive calculateDsr() in UI ---');

// Test calculateDsr UI function logic
const testUiDsr = (incomeVal, commitmentVal) => {
    if (!domElements['dsr-income-input']) domElements['dsr-income-input'] = mockElement('dsr-income-input');
    if (!domElements['dsr-commitment-input']) domElements['dsr-commitment-input'] = mockElement('dsr-commitment-input');
    if (!domElements['dsr-ratio-badge']) domElements['dsr-ratio-badge'] = mockElement('dsr-ratio-badge');
    if (!domElements['dsr-calc-output']) domElements['dsr-calc-output'] = mockElement('dsr-calc-output');

    domElements['dsr-income-input'].value = incomeVal;
    domElements['dsr-commitment-input'].value = commitmentVal;
    sandbox.calculateDsr();
    return {
        badgeText: domElements['dsr-ratio-badge'].textContent,
        badgeClass: domElements['dsr-ratio-badge'].className,
        outputText: domElements['dsr-calc-output'].textContent
    };
};

console.log('UI DSR (Income 0, Comm 0):', testUiDsr(0, 0));
console.log('UI DSR (Income 10000, Comm 3480 -> 40%):', testUiDsr(10000, 3480));

// Check consistency: calculateDsr() and calculateDsrMetrics() both treat 40% as Tier 1 Hot
const ui40 = testUiDsr(10000, 3480);
if (!ui40.badgeText.includes('Tier 1 Hot') || res400.tier !== 'Hot') {
    console.error('❌ FAIL (INCONSISTENCY): calculateDsr() and calculateDsrMetrics() do not align on 40% DSR as Tier 1 Hot Layak!');
} else {
    console.log('✅ PASS: calculateDsr() and calculateDsrMetrics() are aligned on 40.0% DSR as Tier 1 Hot Pre-Approved.');
}


console.log('\n3. Verifying Notion 5-Database Registry & Status Card Data Structures...');

const notionDatabases = vm.runInContext('notionDatabases', sandbox);
console.log('Registered Notion Databases count:', notionDatabases ? notionDatabases.length : 0);

const expectedDbs = [
    { id: '3ab9608c-a9d9-8104-924c-c90dc01a789e', name: 'Buyer Leads DB', key: 'buyerLeads' },
    { id: '3ab9608c-a9d9-81ba-8b65-e6f3552aa744', name: 'Property Listings DB', key: 'propertyListings' },
    { id: '3ab9608c-a9d9-8185-ae5a-f3f7d1a93dda', name: 'Deals & Pipeline DB', key: 'dealsPipeline' },
    { id: '3ab9608c-a9d9-8041-a1ca-c5ca98284cda', name: 'REN Clients / Retainers DB', key: 'renClientsDb' },
    { id: '3ab9608c-a9d9-81bc-9988-d421ab700466', name: 'Appointments & Viewings DB', key: 'appointments' }
];

expectedDbs.forEach((exp, idx) => {
    const found = notionDatabases.find(d => d.id === exp.id);
    if (!found) {
        console.error(`❌ FAIL: Notion Database ID missing: ${exp.name} (${exp.id})`);
    } else {
        console.log(`✅ PASS: Database #${idx+1} (${exp.name}): ID ${found.id} matched. Status: ${found.status}, Type: ${found.type}`);
    }
});

// Test rendering Notion sync cards
vm.runInContext('renderNotionSyncCards()', sandbox);
console.log('Rendered Notion Sync cards container updated.');

console.log('\n4. Verifying Monthly ROI Report Metrics Calculations...');

const testLeads = [
    { id: 'L1', name: 'Lead 1', tier: 'Hot', assignedClientId: 'REN-001' },
    { id: 'L2', name: 'Lead 2', tier: 'Hot', assignedClientId: 'REN-001' },
    { id: 'L3', name: 'Lead 3', tier: 'Warm', assignedClientId: 'REN-001' },
    { id: 'L4', name: 'Lead 4', tier: 'New', assignedClientId: 'REN-002' }
];

const testClients = [
    { id: 'REN-001', name: 'Agent Ahmad', renNo: 'REN 45102', territory: 'Subang Jaya', tier: 'Growth' },
    { id: 'REN-002', name: 'Agent Sarah', renNo: 'REN 52109', territory: 'Shah Alam North', tier: 'Growth' }
];

sandbox.leads = testLeads;
sandbox.renClients = testClients;

domElements['roi-client-select'] = { value: 'ALL' };
vm.runInContext('renderClientRoiReport()', sandbox);

const roiHtml = domElements['roi-report-output'].innerHTML;
console.log('ROI Output HTML generated.');

const totalDelivered = testLeads.length; // 4
const hotQualified = testLeads.filter(l => l.tier === 'Hot').length; // 2
const convRate = ((hotQualified / totalDelivered) * 100).toFixed(1); // 50.0%
const estDeals = Math.round(hotQualified * 0.4); // Math.round(2 * 0.4) = Math.round(0.8) = 1 deal
const estCommissionPipeline = estDeals * 15000; // 1 * 15000 = RM 15,000
const totalRetainerFees = testClients.length * 1500; // 2 * 1500 = RM 3,000
const roiMultiple = (estCommissionPipeline / totalRetainerFees).toFixed(1); // 15000 / 3000 = 5.0x

console.log(`\nROI Empirical Verification:
- Total Leads Delivered: ${totalDelivered}
- Tier 1 Hot Qualified: ${hotQualified}
- Qualification Rate: ${convRate}%
- Est. Deals (Hot * 40%): ${estDeals}
- Est. Commission Pipeline: RM ${estCommissionPipeline}
- Total Retainer Fees (Clients * RM1500): RM ${totalRetainerFees}
- Retainer ROI Multiple: ${roiMultiple}x
`);

if (roiHtml.includes(`>${totalDelivered}<`) && roiHtml.includes(`>${hotQualified}<`) && roiHtml.includes(`${convRate}%`)) {
    console.log('✅ PASS: ROI HTML correctly reflects calculated metrics.');
} else {
    console.error('❌ FAIL: ROI HTML metric mismatch!');
}

console.log('\n--- 4.1 Testing ROI Edge Cases ---');

// Edge Case 1: 0 Leads delivered
vm.runInContext('leads = []; renderClientRoiReport();', sandbox);
const roiZeroLeadsHtml = domElements['roi-report-output'].innerHTML;
if (roiZeroLeadsHtml.includes('NaN')) {
    console.error('❌ FAIL (BUG): 0 leads delivered resulted in NaN in ROI report!');
} else {
    console.log('✅ PASS: 0 leads delivered handled gracefully without NaN.');
}

// Edge Case 2: 0 REN clients
vm.runInContext('leads = [{ id: "L1", tier: "Hot", assignedClientId: "REN-001" }]; renClients = []; renderClientRoiReport();', sandbox);
const roiZeroClientsHtml = domElements['roi-report-output'].innerHTML;
if (roiZeroClientsHtml.includes('Infinity') || roiZeroClientsHtml.includes('NaN')) {
    console.error('❌ FAIL (BUG): 0 REN clients resulted in Infinity/NaN ROI multiple!');
} else {
    console.log('✅ PASS: 0 REN clients handled gracefully without Infinity/NaN.');
}

console.log('\n--- 4.2 Checking Retainer Fee Calculation Inconsistency ---');
vm.runInContext(`
    renClients = [{ id: 'REN-001', name: 'Agent Ahmad', renNo: 'REN 45102', territory: 'Subang Jaya', tier: 'Enterprise' }];
    leads = [
        { id: 'L1', tier: 'Hot', assignedClientId: 'REN-001' },
        { id: 'L2', tier: 'Hot', assignedClientId: 'REN-001' },
        { id: 'L3', tier: 'Hot', assignedClientId: 'REN-001' }
    ];
    renderClientRoiReport();
`, sandbox);

const topRoiText = domElements['roi-report-output'].innerHTML;

// For 3 hot leads: 3 * 0.4 = 1.2 -> 1 deal -> RM 15,000 est commission pipeline.
// Client is Enterprise (RM 3,000 fee).
// Top summary hardcodes retainer fee to RM 1,500 * 1 client = RM 1,500 -> 15000 / 1500 = 10.0x ROI.
// Table row calculates fee as RM 3,000 -> 15000 / 3000 = 5.0x ROI.
console.log('Discrepancy Check (Enterprise Client RM 3000 fee):');
if (topRoiText.includes('10.0x Retainer Return') && topRoiText.includes('5.0x')) {
    console.error('❌ FAIL (BUG INCONSISTENCY): Top summary displays "10.0x Retainer Return" (using hardcoded RM 1,500 retainer fee), but table row displays "5.0x" (using actual Enterprise tier fee of RM 3,000)!');
} else {
    console.log('Top summary & table ROI multiple checked.');
}
console.log('\n=== EMPIRICAL TEST HARNESS COMPLETE ===');
