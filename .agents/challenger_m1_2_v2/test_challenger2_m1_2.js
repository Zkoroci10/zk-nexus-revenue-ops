const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("==================================================================");
console.log("CHALLENGER 2 (M1 ITERATION 2 RE-VERIFICATION) EMPIRICAL TEST SUITE");
console.log("==================================================================\n");

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
    totalCount++;
    if (condition) {
        console.log(`✅ [PASS] ${message}`);
        passedCount++;
    } else {
        console.error(`❌ [FAIL] ${message}`);
    }
}

// Target files
const fileRoot = path.join(__dirname, '../../js/app.js');
const fileConsole = path.join(__dirname, '../../05_Systems/Console-Portal/public/js/app.js');

// 1. Verify Byte-for-Byte Mirror Hash Equality
const codeRoot = fs.readFileSync(fileRoot, 'utf8');
const codeConsole = fs.readFileSync(fileConsole, 'utf8');
assert(codeRoot === codeConsole, "Root js/app.js and 05_Systems/Console-Portal/public/js/app.js are byte-for-byte identical.");

// Prepare mock DOM sandbox environment
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
    JSON: JSON,
    escapeHtml: (str) => String(str)
};

vm.createContext(sandbox);
vm.runInContext(codeConsole, sandbox);

const calculateDsrMetrics = sandbox.calculateDsrMetrics;

// TEST 1: grossIncome <= 0
console.log("\n--- TEST 1: grossIncome <= 0 ---");
const resZeroGross = calculateDsrMetrics(0, 500);
assert(resZeroGross.dsrRatio === 999.0, `grossIncome = 0 returns dsrRatio: 999.0 (Actual: ${resZeroGross.dsrRatio})`);
assert(resZeroGross.tier === 'Cold', `grossIncome = 0 returns tier: 'Cold' (Actual: '${resZeroGross.tier}')`);
assert(resZeroGross.loanStatus === 'High Risk / Unqualified', `grossIncome = 0 returns loanStatus: 'High Risk / Unqualified' (Actual: '${resZeroGross.loanStatus}')`);

const resNegativeGross = calculateDsrMetrics(-5000, 0);
assert(resNegativeGross.dsrRatio === 999.0, `grossIncome = -5000 returns dsrRatio: 999.0 (Actual: ${resNegativeGross.dsrRatio})`);
assert(resNegativeGross.tier === 'Cold', `grossIncome = -5000 returns tier: 'Cold' (Actual: '${resNegativeGross.tier}')`);
assert(resNegativeGross.loanStatus === 'High Risk / Unqualified', `grossIncome = -5000 returns loanStatus: 'High Risk / Unqualified' (Actual: '${resNegativeGross.loanStatus}')`);


// TEST 2: commitments = 0
console.log("\n--- TEST 2: commitments = 0 ---");
const resZeroCommNum = calculateDsrMetrics(10000, 0);
assert(resZeroCommNum.commitments === 0, `commitments = 0 (number) is retained as 0 without 30% override (Actual: ${resZeroCommNum.commitments})`);

const resZeroCommStr = calculateDsrMetrics(10000, "0");
assert(resZeroCommStr.commitments === 0, `commitments = "0" (string) is retained as 0 without 30% override (Actual: ${resZeroCommStr.commitments})`);

const resUndefinedComm = calculateDsrMetrics(10000, undefined);
const expectedNet = Math.round(10000 * 0.87);
const expectedFallback = Math.round(expectedNet * 0.3);
assert(resUndefinedComm.commitments === expectedFallback, `commitments = undefined falls back to 30% of net income (Actual: ${resUndefinedComm.commitments}, Expected: ${expectedFallback})`);


// TEST 3: dsrRatio = 39.896%
console.log("\n--- TEST 3: dsrRatio = 39.896% (Unrounded Float Check) ---");
// gross = 10000, netIncome = 8700. commitments = 3471 -> rawDsr = (3471/8700)*100 = 39.8965517...%
const resUnroundedHot = calculateDsrMetrics(10000, 3471);
assert(resUnroundedHot.tier === 'Hot', `rawDsr ~39.896% evaluates to tier: 'Hot' (Actual: '${resUnroundedHot.tier}')`);
assert(resUnroundedHot.loanStatus === 'Pre-Approved', `rawDsr ~39.896% evaluates to loanStatus: 'Pre-Approved' (Actual: '${resUnroundedHot.loanStatus}')`);


// TEST 4: UI calculateDsr() vs calculateDsrMetrics() Alignment for <= 40.0%
console.log("\n--- TEST 4: UI calculateDsr() vs calculateDsrMetrics() Alignment ---");
// Test 40.0% exact boundary: gross = 10000, net = 8700, commitments = 3480 -> 3480/8700 * 100 = 40.0%
const resMetrics40 = calculateDsrMetrics(10000, 3480);
assert(resMetrics40.tier === 'Hot', `calculateDsrMetrics(10000, 3480) tier is 'Hot' (Actual: '${resMetrics40.tier}')`);
assert(resMetrics40.loanStatus === 'Pre-Approved', `calculateDsrMetrics(10000, 3480) loanStatus is 'Pre-Approved' (Actual: '${resMetrics40.loanStatus}')`);

domElements['dsr-income-input'] = mockElement('dsr-income-input');
domElements['dsr-commitment-input'] = mockElement('dsr-commitment-input');
domElements['dsr-ratio-badge'] = mockElement('dsr-ratio-badge');
domElements['dsr-calc-output'] = mockElement('dsr-calc-output');

domElements['dsr-income-input'].value = "10000";
domElements['dsr-commitment-input'].value = "3480";

vm.runInContext("calculateDsr()", sandbox);

const badgeClass = domElements['dsr-ratio-badge'].className;
const badgeText = domElements['dsr-ratio-badge'].textContent;
assert(badgeClass.includes('green'), `UI calculateDsr() sets badge class to green for 40.0% DSR (Actual: '${badgeClass}')`);
assert(badgeText.includes('Tier 1 Hot Layak'), `UI calculateDsr() badge text contains 'Tier 1 Hot Layak' for 40.0% DSR (Actual: '${badgeText}')`);


// TEST 5: ROI Summary Retainer Fee Dynamic Calculation
console.log("\n--- TEST 5: ROI Retainer Fee Dynamic Summation ---");
// Reassign sandbox renClients and leads cleanly
vm.runInContext(`
    renClients = [
        { id: 'REN-001', name: 'Ahmad Subang', renNo: 'REN-10001', territory: 'Subang Jaya', tier: 'Enterprise', retainerFee: 3000 },
        { id: 'REN-002', name: 'Siti Shah Alam', renNo: 'REN-10002', territory: 'Shah Alam North', tier: 'Growth', retainerFee: 1500 },
        { id: 'REN-003', name: 'Danial Cyberjaya', renNo: 'REN-10003', territory: 'Cyberjaya/Puchong', tier: 'Starter', retainerFee: 800 }
    ];

    leads = [
        { id: 'L-101', assignedClientId: 'REN-001', tier: 'Hot' },
        { id: 'L-102', assignedClientId: 'REN-001', tier: 'Hot' },
        { id: 'L-103', assignedClientId: 'REN-001', tier: 'Hot' },
        { id: 'L-201', assignedClientId: 'REN-002', tier: 'Hot' },
        { id: 'L-202', assignedClientId: 'REN-002', tier: 'Hot' },
        { id: 'L-203', assignedClientId: 'REN-002', tier: 'Hot' },
        { id: 'L-301', assignedClientId: 'REN-003', tier: 'Hot' },
        { id: 'L-302', assignedClientId: 'REN-003', tier: 'Hot' },
        { id: 'L-303', assignedClientId: 'REN-003', tier: 'Hot' }
    ];
`, sandbox);

domElements['roi-client-select'] = { value: 'ALL' };
domElements['roi-report-output'] = mockElement('roi-report-output');

vm.runInContext("renderClientRoiReport()", sandbox);

const htmlOutput = domElements['roi-report-output'].innerHTML;

// Total Retainer Fees = 3000 + 1500 + 800 = 5300
// Total Hot leads = 9 -> estDeals = Math.round(9 * 0.4) = 4 -> estCommissionPipeline = 60,000
// Campaign ROI = (60000 / 5300).toFixed(1) = 11.3x
assert(htmlOutput.includes('11.3x Retainer Return'), `ROI summary cards calculate average campaign ROI using sum of actual retainer fees (5,300) -> 11.3x (Actual output contains '11.3x Retainer Return')`);
assert(htmlOutput.includes('Enterprise'), `Client table contains Enterprise tier`);
assert(htmlOutput.includes('Growth'), `Client table contains Growth tier`);
assert(htmlOutput.includes('Starter'), `Client table contains Starter tier`);
assert(htmlOutput.includes('>5.0x<'), `Enterprise client ROI calculated as 15000/3000 = 5.0x (Output contains '>5.0x<')`);
assert(htmlOutput.includes('>10.0x<'), `Growth client ROI calculated as 15000/1500 = 10.0x (Output contains '>10.0x<')`);
assert(htmlOutput.includes('>18.8x<'), `Starter client ROI calculated as 15000/800 = 18.8x (Output contains '>18.8x<')`);


// SUMMARY
console.log("\n==================================================================");
console.log(`FINAL RESULT: ${passedCount} / ${totalCount} ASSERTIONS PASSED.`);
if (passedCount === totalCount) {
    console.log("VERDICT: ALL TEST CONDITIONS VERIFIED SUCCESSFULLY!");
    process.exit(0);
} else {
    console.error("VERDICT: FAILURE DETECTED!");
    process.exit(1);
}
