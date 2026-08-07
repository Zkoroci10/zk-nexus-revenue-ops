/**
 * Challenger M1 Iteration 2 — Phone Normalization & CSV Ingestion Stress Harness
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootAppJsPath = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus\\js\\app.js';
const portalAppJsPath = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus\\05_Systems\\Console-Portal\\public\\js\\app.js';

console.log('===================================================================');
console.log('RE-VERIFICATION STRESS HARNESS — PHONE NORMALIZATION & CSV INGESTION');
console.log('===================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(description, actual, expected) {
    totalTests++;
    const match = JSON.stringify(actual) === JSON.stringify(expected);
    if (match) {
        passedTests++;
        console.log(`  [PASS] ${description}`);
    } else {
        failedTests++;
        console.error(`  [FAIL] ${description}`);
        console.error(`         Expected: ${JSON.stringify(expected)}`);
        console.error(`         Actual:   ${JSON.stringify(actual)}`);
    }
}

// 1. MIRROR SYNC VERIFICATION
console.log('--- 1. Mirror Sync Verification ---');
const rootContent = fs.readFileSync(rootAppJsPath, 'utf8');
const portalContent = fs.readFileSync(portalAppJsPath, 'utf8');

const rootHash = crypto.createHash('sha256').update(rootContent).digest('hex');
const portalHash = crypto.createHash('sha256').update(portalContent).digest('hex');

assert('Byte-for-byte SHA256 match between js/app.js and public/js/app.js', rootHash, portalHash);
assert('Byte length match', rootContent.length, portalContent.length);

// Extract normalisePhone & parseRfc4180Csv from js/app.js
function extractFunction(code, funcName) {
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

const normalisePhoneCode = extractFunction(rootContent, 'normalisePhone');
const parseRfc4180CsvCode = extractFunction(rootContent, 'parseRfc4180Csv');

eval(normalisePhoneCode);
eval(parseRfc4180CsvCode);

// 2. MANDATORY PHONE NORMALIZATION TESTS
console.log('\n--- 2. Phone Normalization (normalisePhone) ---');

// Mandatory check 1: 60123456789 -> +60123456789 (Confirm NOT +6060...)
assert('normalisePhone("60123456789") -> "+60123456789"', normalisePhone('60123456789'), '+60123456789');

// Mandatory check 2: 0123456789 -> +60123456789
assert('normalisePhone("0123456789") -> "+60123456789"', normalisePhone('0123456789'), '+60123456789');

// Mandatory check 3: +60123456789 -> +60123456789
assert('normalisePhone("+60123456789") -> "+60123456789"', normalisePhone('+60123456789'), '+60123456789');

// Mandatory check 4: 012-345 6789 -> +60123456789
assert('normalisePhone("012-345 6789") -> "+60123456789"', normalisePhone('012-345 6789'), '+60123456789');

// Additional edge cases
assert('normalisePhone("6012-345 6789") -> "+60123456789"', normalisePhone('6012-345 6789'), '+60123456789');
assert('normalisePhone("+60 12-345 6789") -> "+60123456789"', normalisePhone('+60 12-345 6789'), '+60123456789');
assert('normalisePhone("0191234567") -> "+60191234567"', normalisePhone('0191234567'), '+60191234567');
assert('normalisePhone("01112345678") -> "+601112345678"', normalisePhone('01112345678'), '+601112345678');
assert('normalisePhone("601112345678") -> "+601112345678"', normalisePhone('601112345678'), '+601112345678');
assert('normalisePhone("(012) 345-6789") -> "+60123456789"', normalisePhone('(012) 345-6789'), '+60123456789');
assert('normalisePhone(null) -> ""', normalisePhone(null), '');
assert('normalisePhone(undefined) -> ""', normalisePhone(undefined), '');
assert('normalisePhone("") -> ""', normalisePhone(''), '');

// 3. DEDUPLICATION ACROSS DIFFERENT FORMATS
console.log('\n--- 3. Deduplication Across Formats ---');
const rawFormats = ['60123456789', '0123456789', '+60123456789', '012-345 6789', '(012) 345-6789', '+60 12-345 6789'];
const normalizedSet = new Set(rawFormats.map(normalisePhone));
assert('All 6 raw phone variations collapse into single normalized phone in Set', normalizedSet.size, 1);
assert('Single normalized key is "+60123456789"', Array.from(normalizedSet)[0], '+60123456789');

// 4. CSV INGESTION PARSING & DEDUPLICATION SIMULATION
console.log('\n--- 4. CSV Ingestion & Deduplication Simulation ---');
const csvInput = `Name,Phone,Project,Gross Income,Commitments
Ahmad,60123456789,Subang Jaya,8000,2000
Budi,0123456789,Subang Jaya,6000,1500
Chandra,+60123456789,Shah Alam,9000,2500
Dewi,012-345 6789,Cyberjaya,7000,1800
Eka,0169876543,Setia Alam,5000,1200
`;

const rows = parseRfc4180Csv(csvInput);
assert('CSV rows count (header + 5 data rows)', rows.length, 6);

const existingPhones = new Set();
let importedCount = 0;
let skippedCount = 0;

for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const rawPhone = r[1];
    const cleanPhone = normalisePhone(rawPhone);
    if (existingPhones.has(cleanPhone)) {
        skippedCount++;
    } else {
        existingPhones.add(cleanPhone);
        importedCount++;
    }
}

assert('Simulated CSV import: importedCount = 2 (1 for +60123456789, 1 for +60169876543)', importedCount, 2);
assert('Simulated CSV import: skippedCount = 3 (duplicates of +60123456789)', skippedCount, 3);

console.log('\n===================================================================');
console.log(`STRESS TEST SUMMARY: ${passedTests} / ${totalTests} PASSED (Failures: ${failedTests})`);
console.log('===================================================================');

if (failedTests > 0) {
    process.exit(1);
}
