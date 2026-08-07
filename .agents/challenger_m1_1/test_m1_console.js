/**
 * Empirical Stress Test Harness for Executive Master Console (M1)
 * Target Files: js/app.js & 05_Systems/Console-Portal/public/js/app.js
 */

const fs = require('fs');
const path = require('path');

const rootAppJsPath = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus\\js\\app.js';
const portalAppJsPath = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus\\05_Systems\\Console-Portal\\public\\js\\app.js';
const rootIndexPath = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus\\index.html';
const portalIndexPath = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus\\05_Systems\\Console-Portal\\public\\index.html';

console.log('===================================================================');
console.log('EMPIRICAL STRESS TEST SUITE — EXECUTIVE MASTER CONSOLE (MILESTONE M1)');
console.log('===================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureReport = [];

function assertTest(testName, condition, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  [PASS] ${testName}`);
    } else {
        failedTests++;
        console.error(`  [FAIL] ${testName}`);
        if (details) console.error(`         Detail: ${details}`);
        failureReport.push({ testName, details });
    }
}

// ── 0. MIRROR SYNC VERIFICATION ────────────────────────────────────────────────
console.log('--- TEST SUITE 0: Mirror Sync Verification ---');
const rootAppContent = fs.readFileSync(rootAppJsPath, 'utf8');
const portalAppContent = fs.readFileSync(portalAppJsPath, 'utf8');
const rootIndexContent = fs.readFileSync(rootIndexPath, 'utf8');
const portalIndexContent = fs.readFileSync(portalIndexPath, 'utf8');

assertTest('js/app.js and 05_Systems/Console-Portal/public/js/app.js mirror sync', rootAppContent === portalAppContent, 'Files are not byte-for-byte identical');
assertTest('index.html and 05_Systems/Console-Portal/public/index.html mirror sync', rootIndexContent === portalIndexContent, 'Index files are not byte-for-byte identical');

// Evaluate app.js context for unit testing functions
// Extract relevant functions using eval context mock
const mockDom = {
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => []
};

// Create function sandbox from rootAppContent
function extractFunction(code, funcName) {
    const match = code.match(new RegExp(`function ${funcName}\\s*\\([\\s\\S]*?\\n}`, 'm'));
    if (!match) {
        // Try searching with balanced braces if match simple regex fails
        const start = code.indexOf(`function ${funcName}(`);
        if (start === -1) return null;
        let braceCount = 0;
        let started = false;
        let end = start;
        for (let i = start; i < code.length; i++) {
            if (code[i] === '{') {
                braceCount++;
                started = true;
            } else if (code[i] === '}') {
                braceCount--;
                if (started && braceCount === 0) {
                    end = i + 1;
                    break;
                }
            }
        }
        return code.substring(start, end);
    }
    return match[0];
}

// Eval functions into current scope
const parseRfc4180CsvCode = extractFunction(rootAppContent, 'parseRfc4180Csv');
const normalisePhoneCode = extractFunction(rootAppContent, 'normalisePhone');
const autoRouteLeadToTerritoryCode = extractFunction(rootAppContent, 'autoRouteLeadToTerritory');
const calculateDsrMetricsCode = extractFunction(rootAppContent, 'calculateDsrMetrics');

eval(parseRfc4180CsvCode);
eval(normalisePhoneCode);
eval(autoRouteLeadToTerritoryCode);
eval(calculateDsrMetricsCode);

// ── 1. RFC-4180 CSV PARSER EDGE CASES ──────────────────────────────────────────
console.log('\n--- TEST SUITE 1: RFC-4180 CSV Parser Edge Cases ---');

// Case 1.1: Quoted value containing commas
const csvQuotedCommas = 'name,phone,project,income,commitments\n"Muhammad Hariz","+60123456789","SkyResidence, Subang Jaya",6500,1850';
const parsed1 = parseRfc4180Csv(csvQuotedCommas);
assertTest('Parse CSV with quoted value containing comma', 
    parsed1.length === 2 && parsed1[1][2] === 'SkyResidence, Subang Jaya',
    `Expected 'SkyResidence, Subang Jaya', got: '${parsed1[1] ? parsed1[1][2] : undefined}'`
);

// Case 1.2: Empty fields
const csvEmptyFields = 'name,phone,project,income,commitments\n"Nurul Aini",,,5200,';
const parsed2 = parseRfc4180Csv(csvEmptyFields);
assertTest('Parse CSV with empty fields',
    parsed2.length === 2 && parsed2[1][0] === 'Nurul Aini' && parsed2[1][1] === '' && parsed2[1][2] === '' && parsed2[1][3] === '5200' && parsed2[1][4] === '',
    `Parsed row: ${JSON.stringify(parsed2[1])}`
);

// Case 1.3: Escaped quotes inside quoted fields
const csvEscapedQuotes = 'name,phone,project,income,commitments\n"Tan ""The Agent"" Lun","+60171112233","Setia Alam ""Villa""",8000,2400';
const parsed3 = parseRfc4180Csv(csvEscapedQuotes);
assertTest('Parse CSV with escaped double quotes ("")',
    parsed3.length === 2 && parsed3[1][0] === 'Tan "The Agent" Lun' && parsed3[1][2] === 'Setia Alam "Villa"',
    `Parsed name: '${parsed3[1] ? parsed3[1][0] : ''}', project: '${parsed3[1] ? parsed3[1][2] : ''}'`
);

// Case 1.4: Leading & trailing whitespace around quoted & unquoted values
const csvWhitespace = '  name  ,  phone  ,  project  \n  "  Santhi Kumar  "  ,  +60164445566  ,  "Cyberjaya Garden"  ';
const parsed4 = parseRfc4180Csv(csvWhitespace);
assertTest('Parse CSV with leading and trailing whitespace',
    parsed4.length === 2 && parsed4[1][0] === 'Santhi Kumar' && parsed4[1][1] === '+60164445566' && parsed4[1][2] === 'Cyberjaya Garden',
    `Parsed row: ${JSON.stringify(parsed4[1])}`
);

// Case 1.5: Multiline quoted field
const csvMultiline = 'name,phone,notes\n"Ahmad Faizal","+60123000000","Line 1\nLine 2"';
const parsed5 = parseRfc4180Csv(csvMultiline);
assertTest('Parse CSV with multiline field inside quotes',
    parsed5.length === 2 && parsed5[1][2] === 'Line 1\nLine 2',
    `Parsed notes: '${parsed5[1] ? parsed5[1][2] : ''}'`
);

// Case 1.6: Windows CRLF line endings
const csvCrlf = 'name,phone,project\r\n"Hariz","+60123456789","Subang"\r\n"Sarah","+60198765432","Shah Alam"\r\n';
const parsed6 = parseRfc4180Csv(csvCrlf);
assertTest('Parse CSV with Windows CRLF (\\r\\n)',
    parsed6.length === 3 && parsed6[1][0] === 'Hariz' && parsed6[2][0] === 'Sarah',
    `Rows length: ${parsed6.length}, rows: ${JSON.stringify(parsed6)}`
);

// ── 2. PHONE NORMALIZATION & DEDUPLICATION ────────────────────────────────────
console.log('\n--- TEST SUITE 2: Phone Normalization & Deduplication ---');

const phone1 = '+60123456789';
const phone2 = '012-345 6789';
const phone3 = '60123456789';
const phone4 = '012 345 6789';
const phone5 = '+60 12-345 6789';

const norm1 = normalisePhone(phone1);
const norm2 = normalisePhone(phone2);
const norm3 = normalisePhone(phone3);
const norm4 = normalisePhone(phone4);
const norm5 = normalisePhone(phone5);

console.log(`  Raw formats & Normalized results:`);
console.log(`    '${phone1}' -> '${norm1}'`);
console.log(`    '${phone2}' -> '${norm2}'`);
console.log(`    '${phone3}' -> '${norm3}'`);
console.log(`    '${phone4}' -> '${norm4}'`);
console.log(`    '${phone5}' -> '${norm5}'`);

assertTest('Normalize +60123456789 -> +60123456789', norm1 === '+60123456789', `Got: '${norm1}'`);
assertTest('Normalize 012-345 6789 -> +60123456789', norm2 === '+60123456789', `Got: '${norm2}'`);
assertTest('Normalize 012 345 6789 -> +60123456789', norm4 === '+60123456789', `Got: '${norm4}'`);
assertTest('Normalize +60 12-345 6789 -> +60123456789', norm5 === '+60123456789', `Got: '${norm5}'`);

// Stress test format 3: '60123456789' (without +)
assertTest('Normalize 60123456789 -> +60123456789 (STRESS CHECK)', norm3 === '+60123456789', 
    `BUG DETECTED! '60123456789' normalized to '${norm3}' instead of '+60123456789'`
);

// Deduplication Set Test
const phoneSet = new Set();
phoneSet.add(norm1);
const isDup2 = phoneSet.has(norm2);
const isDup3 = phoneSet.has(norm3);
assertTest('Phone deduplication: 012-345 6789 detected as duplicate of +60123456789', isDup2 === true);
assertTest('Phone deduplication: 60123456789 detected as duplicate of +60123456789', isDup3 === true,
    `Failed because 60123456789 normalized to '${norm3}' while set had '${norm1}'`
);

// ── 3. TERRITORY AUTO-ROUTING ─────────────────────────────────────────────────
console.log('\n--- TEST SUITE 3: Territory Auto-Routing Rules ---');

const territoryTestCases = [
    { location: 'SkyResidence Subang', expected: 'REN-001', name: 'Subang keyword' },
    { location: 'USJ One Heights', expected: 'REN-001', name: 'USJ keyword' },
    { location: 'SS15 Courtyard', expected: 'REN-001', name: 'SS15 keyword' },
    { location: 'SS14 Subang', expected: 'REN-001', name: 'SS14 keyword' },
    { location: 'Sunway Lagoon Suites', expected: 'REN-001', name: 'Sunway keyword' },
    { location: 'Subang Parksuites', expected: 'REN-001', name: 'Parksuites keyword' },
    { location: 'SkyResidence Condominium', expected: 'REN-001', name: 'SkyResidence keyword' },

    { location: 'Shah Alam Seksyen 7', expected: 'REN-002', name: 'Shah Alam keyword' },
    { location: 'Seksyen 13 Apartment', expected: 'REN-002', name: 'Seksyen keyword' },
    { location: 'Setia Alam Villa', expected: 'REN-002', name: 'Setia Alam keyword' },
    { location: 'Bukit Jelutong Bungalow', expected: 'REN-002', name: 'Bukit Jelutong keyword' },
    { location: 'Denai Alam Heights', expected: 'REN-002', name: 'Denai Alam keyword' },
    { location: 'i-City Executive Suite', expected: 'REN-002', name: 'i-City keyword' },
    { location: 'Mont Kiara Designer Unit', expected: 'REN-002', name: 'Mont Kiara keyword' },
    { location: 'Denai Residency', expected: 'REN-002', name: 'Denai keyword' },

    { location: 'Cyberjaya Garden', expected: 'REN-003', name: 'Cyberjaya keyword' },
    { location: 'Puchong Financial Center', expected: 'REN-003', name: 'Puchong keyword' },
    { location: 'Putrajaya Lakeview', expected: 'REN-003', name: 'Putrajaya keyword' },
    { location: 'Kinrara Residence', expected: 'REN-003', name: 'Kinrara keyword' },
    { location: 'Cyber Heights', expected: 'REN-003', name: 'Cyber keyword' },
    { location: 'Tropez Cyberjaya', expected: 'REN-003', name: 'Tropez keyword' },

    { location: 'Kuala Lumpur City Center', expected: 'REN-001', name: 'Fallback for unknown territory' }
];

territoryTestCases.forEach(tc => {
    const routed = autoRouteLeadToTerritory(tc.location);
    assertTest(`Auto-route '${tc.location}' -> ${tc.expected} (${tc.name})`, routed === tc.expected, `Got: '${routed}'`);
});

// ── 4. PAGINATION LOGIC FOR 10,000 LEADS ──────────────────────────────────────
console.log('\n--- TEST SUITE 4: Pagination Logic for 10,000 Lead Records ---');

// Generate 10,000 mock leads
const mock10kLeads = [];
for (let i = 1; i <= 10000; i++) {
    mock10kLeads.push({ id: `LEAD-${i}`, name: `Lead ${i}`, phone: `+6013${String(i).padStart(7, '0')}` });
}

const pageSizeDefault = 50;
const totalPages10k = Math.ceil(mock10kLeads.length / pageSizeDefault) || 1;

assertTest('10,000 leads page count calculation (pageSize = 50)', totalPages10k === 200, `Expected 200, got: ${totalPages10k}`);

// Page 1 slice boundary
let curPage = 1;
let startIdx = (curPage - 1) * pageSizeDefault;
let endIdx = Math.min(startIdx + pageSizeDefault, mock10kLeads.length);
let slicePage1 = mock10kLeads.slice(startIdx, endIdx);
assertTest('Page 1 slice boundaries [0, 50]', 
    slicePage1.length === 50 && slicePage1[0].id === 'LEAD-1' && slicePage1[49].id === 'LEAD-50',
    `Length: ${slicePage1.length}, first: ${slicePage1[0]?.id}, last: ${slicePage1[49]?.id}`
);

// Page 100 slice boundary
curPage = 100;
startIdx = (curPage - 1) * pageSizeDefault;
endIdx = Math.min(startIdx + pageSizeDefault, mock10kLeads.length);
let slicePage100 = mock10kLeads.slice(startIdx, endIdx);
assertTest('Page 100 slice boundaries [4950, 5000]',
    slicePage100.length === 50 && slicePage100[0].id === 'LEAD-4951' && slicePage100[49].id === 'LEAD-5000',
    `Length: ${slicePage100.length}, first: ${slicePage100[0]?.id}, last: ${slicePage100[49]?.id}`
);

// Page 200 (last page) slice boundary
curPage = 200;
startIdx = (curPage - 1) * pageSizeDefault;
endIdx = Math.min(startIdx + pageSizeDefault, mock10kLeads.length);
let slicePage200 = mock10kLeads.slice(startIdx, endIdx);
assertTest('Page 200 slice boundaries [9950, 10000]',
    slicePage200.length === 50 && slicePage200[0].id === 'LEAD-9951' && slicePage200[49].id === 'LEAD-10000',
    `Length: ${slicePage200.length}, first: ${slicePage200[0]?.id}, last: ${slicePage200[49]?.id}`
);

// Clamp upper bound navigation (attempting to go to Page 250)
curPage = Math.min(Math.max(1, 250), totalPages10k);
assertTest('Navigation clamp upper bound (Page 250 -> Page 200)', curPage === 200, `Got: ${curPage}`);

// Clamp lower bound navigation (attempting to go to Page -5)
curPage = Math.min(Math.max(1, -5), totalPages10k);
assertTest('Navigation clamp lower bound (Page -5 -> Page 1)', curPage === 1, `Got: ${curPage}`);

// Test non-standard dataset size (10,025 leads)
const mock10025Leads = [];
for (let i = 1; i <= 10025; i++) mock10025Leads.push({ id: `LEAD-${i}` });
const totalPages10025 = Math.ceil(mock10025Leads.length / pageSizeDefault) || 1;
assertTest('10,025 leads page count calculation (pageSize = 50)', totalPages10025 === 201, `Expected 201, got: ${totalPages10025}`);

curPage = 201;
startIdx = (curPage - 1) * pageSizeDefault;
endIdx = Math.min(startIdx + pageSizeDefault, mock10025Leads.length);
let slicePage201 = mock10025Leads.slice(startIdx, endIdx);
assertTest('Page 201 (last page of 10,025 dataset) slice boundaries [10000, 10025]',
    slicePage201.length === 25 && slicePage201[0].id === 'LEAD-10001' && slicePage201[24].id === 'LEAD-10025',
    `Length: ${slicePage201.length}, first: ${slicePage201[0]?.id}, last: ${slicePage201[24]?.id}`
);

// Empty dataset pagination (0 leads)
const totalPagesEmpty = Math.ceil(0 / pageSizeDefault) || 1;
curPage = Math.min(Math.max(1, 1), totalPagesEmpty);
startIdx = (curPage - 1) * pageSizeDefault;
endIdx = Math.min(startIdx + pageSizeDefault, 0);
let sliceEmpty = [].slice(startIdx, endIdx);
assertTest('Empty dataset pagination math (0 leads -> 1 page, 0 items rendered)',
    totalPagesEmpty === 1 && sliceEmpty.length === 0,
    `Total pages: ${totalPagesEmpty}, slice length: ${sliceEmpty.length}`
);


console.log('\n===================================================================');
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} PASSED`);
console.log('===================================================================');

if (failureReport.length > 0) {
    console.log('\nSUMMARY OF FAILURE MODES DETECTED:');
    failureReport.forEach((f, idx) => {
        console.log(`${idx + 1}. ${f.testName}`);
        console.log(`   Detail: ${f.details}`);
    });
}
