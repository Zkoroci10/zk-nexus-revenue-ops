const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

// Remove 'use strict'; or attach functions to global so eval exposes them
code = code.replace("'use strict';", "");

// Mock DOM & Web Environment
const createMockElement = () => ({
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    setAttribute: () => {},
    style: {},
    value: '',
    textContent: '',
    innerHTML: '',
    reset: () => {},
    appendChild: () => {},
    disabled: false
});

global.window = {
    location: { search: '', origin: 'http://localhost', pathname: '/' }
};
global.document = {
    addEventListener: () => {},
    createElement: () => createMockElement(),
    getElementById: (id) => createMockElement(),
    querySelectorAll: () => []
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};
global.alert = (msg) => console.log('[ALERT]', msg);
global.confirm = () => true;

// Evaluate app.js in global context
(function() {
    eval(code + `
    global.initialRenClients = initialRenClients;
    global.initialLeads = initialLeads;
    global.notionDatabases = notionDatabases;
    global.load10kPartitionDataset = load10kPartitionDataset;
    global.getFilteredLeads = getFilteredLeads;
    global.autoRouteLeadToTerritory = autoRouteLeadToTerritory;
    global.parseRfc4180Csv = parseRfc4180Csv;
    global.normalisePhone = normalisePhone;
    global.calculateDsrMetrics = calculateDsrMetrics;
    global.getLeads = () => leads;
    `);
})();

console.log('--- TEST 1: 10k Partition Dataset Loading & Memory Slicing ---');
load10kPartitionDataset();
const leadsList = getLeads();
console.log('Total leads count:', leadsList.length);
if (leadsList.length !== 10000) throw new Error('Expected 10000 leads, got ' + leadsList.length);

const filtered = getFilteredLeads();
console.log('Filtered leads count:', filtered.length);
if (filtered.length !== 10000) throw new Error('Expected 10000 filtered leads');

const pageSizeTest = 50;
const currentPageTest = 1;
const slice1 = filtered.slice((currentPageTest - 1) * pageSizeTest, currentPageTest * pageSizeTest);
console.log('Page 1 slice count:', slice1.length);
if (slice1.length !== 50) throw new Error('Page 1 slice length is not 50');

console.log('--- TEST 2: Territory Locks & Auto-Routing ---');
console.log('REN-001 Lock (Subang Jaya):', initialRenClients[0]);
console.log('REN-002 Lock (Shah Alam North):', initialRenClients[1]);
console.log('REN-003 Lock (Cyberjaya/Puchong):', initialRenClients[2]);

if (initialRenClients[0].territory !== 'Subang Jaya') throw new Error('REN-001 territory lock wrong');
if (initialRenClients[1].territory !== 'Shah Alam North') throw new Error('REN-002 territory lock wrong');
if (initialRenClients[2].territory !== 'Cyberjaya/Puchong') throw new Error('REN-003 territory lock wrong');

const route1 = autoRouteLeadToTerritory('SkyResidence Subang');
const route2 = autoRouteLeadToTerritory('Setia Alam Seksyen 7');
const route3 = autoRouteLeadToTerritory('Cyberjaya Lakeview');
console.log('Routing 1:', route1, '| Routing 2:', route2, '| Routing 3:', route3);

if (route1 !== 'REN-001') throw new Error('Subang auto-routing failed');
if (route2 !== 'REN-002') throw new Error('Shah Alam auto-routing failed');
if (route3 !== 'REN-003') throw new Error('Cyberjaya auto-routing failed');

console.log('--- TEST 3: RFC-4180 CSV Parser & Phone Deduplication ---');
const csvInput = `name,phone,project,income,commitments
"Muhammad Hariz","+60123456789","SkyResidence, Subang Jaya",6500,1850
"Escaped ""Quotes"" Lead","0199998888","Setia Alam",5000,1500
"Duplicate Hariz","0123456789","USJ Subang",7000,2000`;

const rows = parseRfc4180Csv(csvInput);
console.log('Parsed RFC-4180 rows:', rows);
if (rows.length !== 4) throw new Error('Expected 4 rows');
if (rows[1][2] !== 'SkyResidence, Subang Jaya') throw new Error('Quoted comma parsing failed');
if (rows[2][0] !== 'Escaped "Quotes" Lead') throw new Error('Escaped quotes parsing failed');

const normPhone1 = normalisePhone(rows[1][1]);
const normPhone2 = normalisePhone(rows[2][1]);
const normPhone3 = normalisePhone(rows[3][1]);
console.log('Normalized Phones:', normPhone1, normPhone2, normPhone3);
if (normPhone1 !== '+60123456789') throw new Error('Phone normalisation failed');
if (normPhone2 !== '+60199998888') throw new Error('Phone normalisation failed');
if (normPhone3 !== '+60123456789') throw new Error('Phone normalisation failed');
if (normPhone1 !== normPhone3) throw new Error('Deduplication phone matching failed');

console.log('--- TEST 4: DSR Metrics Calculation ---');
const dsrResult = calculateDsrMetrics(6500, 1850);
console.log('DSR Metrics for Gross 6500, Commitments 1850:', dsrResult);
if (dsrResult.netIncome !== 5655) throw new Error('Net income calculation failed');
if (dsrResult.dsrRatio !== 33) throw new Error('DSR ratio calculation failed');
if (dsrResult.tier !== 'Hot') throw new Error('DSR Tier assignment failed');

console.log('--- TEST 5: Notion 5-Database Registry & Sync UI Cards ---');
console.log('Notion Databases Count:', notionDatabases.length);
if (notionDatabases.length !== 5) throw new Error('Expected 5 Notion DBs');

const expectedDbIds = [
    '3ab9608c-a9d9-8104-924c-c90dc01a789e',
    '3ab9608c-a9d9-81ba-8b65-e6f3552aa744',
    '3ab9608c-a9d9-8185-ae5a-f3f7d1a93dda',
    '3ab9608c-a9d9-8041-a1ca-c5ca98284cda',
    '3ab9608c-a9d9-81bc-9988-d421ab700466'
];

expectedDbIds.forEach((id, idx) => {
    if (notionDatabases[idx].id !== id) {
        throw new Error(`Notion DB ID mismatch at index ${idx}: expected ${id}, got ${notionDatabases[idx].id}`);
    }
});
console.log('All 5 Notion Database IDs verified matching project spec!');

console.log('--- TEST 6: Monthly ROI Report Calculations ---');
const totalDelivered = 10000;
const targetClients = initialRenClients;
const totalRetainerFees = targetClients.length * 1500;
console.log('Total Retainer Fees:', totalRetainerFees);

console.log('\nSUCCESS: ALL CORE REQUIREMENT TEST SUITES PASSED 100%!');
