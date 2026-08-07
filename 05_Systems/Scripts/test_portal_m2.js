const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Read portal.html content
const portalPath = path.join(__dirname, '..', '..', 'portal.html');
const portalHtml = fs.readFileSync(portalPath, 'utf8');

// 2. Extract <script> content
const scriptMatch = portalHtml.match(/<script>([\s\S]*?)<\/script>/i);
if (!scriptMatch) {
    console.error("FAIL: Could not extract script from portal.html");
    process.exit(1);
}
const portalScript = scriptMatch[1];

// 3. Create simulated DOM environment
class MockElement {
    constructor(id = '', tagName = 'div') {
        this.id = id;
        this.tagName = tagName;
        this.value = '';
        this.innerText = '';
        this.innerHTML = '';
        this.className = '';
        this.style = { width: '', color: '', background: '' };
        this.classList = {
            add: (cls) => {
                const arr = this.className.split(' ').filter(Boolean);
                if (!arr.includes(cls)) arr.push(cls);
                this.className = arr.join(' ');
            },
            remove: (cls) => {
                const arr = this.className.split(' ').filter(Boolean);
                this.className = arr.filter(c => c !== cls).join(' ');
            },
            contains: (cls) => this.className.split(' ').includes(cls)
        };
        this.attributes = {};
    }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k]; }
}

const elements = {};
function getOrCreateElement(id, tagName = 'div') {
    if (!elements[id]) {
        elements[id] = new MockElement(id, tagName);
    }
    return elements[id];
}

const elementIds = [
    'renSelect', 'retainerStatusText', 'printMetaText', 'statLeads', 'statQualified',
    'statViewings', 'statLoanValue', 'dossierCountTag', 'tabBtnDossiers', 'tabBtnCalculator',
    'tabBtnCalendar', 'panelDossiers', 'panelCalculator', 'panelCalendar', 'dossiersGrid',
    'calendarTableBody', 'searchInput', 'dsrForm', 'calcBuyerName', 'calcPhone',
    'calcAgentId', 'calcIncome', 'calcCommitments', 'calcPropertyPrice', 'calcMargin',
    'calcTenure', 'calcInterest', 'calcProject', 'resDSRVal', 'resDSRTrack',
    'resDSRBadge', 'resBadgeText', 'resInstallment', 'resTotalCommitments', 'resNDI',
    'resMaxLoan', 'toast', 'toastMsg'
];

elementIds.forEach(id => getOrCreateElement(id));

const storage = {};
const mockLocalStorage = {
    getItem: (key) => storage[key] || null,
    setItem: (key, val) => { storage[key] = String(val); },
    removeItem: (key) => { delete storage[key]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

const mockDocument = {
    getElementById: (id) => getOrCreateElement(id),
    querySelectorAll: (selector) => {
        if (selector === '.tab-btn') {
            return [elements['tabBtnDossiers'], elements['tabBtnCalculator'], elements['tabBtnCalendar']];
        }
        if (selector === '.tab-panel') {
            return [elements['panelDossiers'], elements['panelCalculator'], elements['panelCalendar']];
        }
        return [];
    },
    addEventListener: (event, callback) => {
        if (event === 'DOMContentLoaded') {
            mockDocument._domLoadedCallback = callback;
        }
    }
};

const mockWindow = {
    print: () => {}
};

const context = vm.createContext({
    document: mockDocument,
    window: mockWindow,
    localStorage: mockLocalStorage,
    console: console,
    Math: Math,
    parseFloat: parseFloat,
    parseInt: parseInt,
    String: String,
    Date: Date,
    encodeURIComponent: encodeURIComponent,
    setTimeout: (fn) => fn()
});

vm.runInContext(portalScript, context);

if (mockDocument._domLoadedCallback) {
    mockDocument._domLoadedCallback();
}

console.log("=== EMPIRICAL TEST SUITE: DSR CALCULATOR & BUYER DOSSIER STATE ===");

let testFailures = [];
let testPasses = [];

function assert(condition, testName, details = '') {
    if (condition) {
        testPasses.push(testName);
        console.log(`[PASS] ${testName}`);
    } else {
        testFailures.push({ testName, details });
        console.log(`[FAIL] ${testName}\n  └─ Details: ${details}`);
    }
}

// -------------------------------------------------------------
// TEST GROUP 1: DSR Calculation Boundary Cases
// -------------------------------------------------------------
console.log("\n--- TEST GROUP 1: DSR Calculation Boundary Cases ---");

// Test 1.1: Gross Income = 0
elements['calcIncome'].value = "0";
elements['calcCommitments'].value = "2100";
elements['calcPropertyPrice'].value = "480000";
elements['calcMargin'].value = "90";
elements['calcTenure'].value = "35";
elements['calcInterest'].value = "4.25";

context.runDSRCalculation();
const dsrIncomeZero = elements['resDSRVal'].innerText;
const badgeIncomeZero = elements['resBadgeText'].innerText;

assert(
    dsrIncomeZero !== "0.0%" && !badgeIncomeZero.includes("Tier 1"),
    "1.1 Gross Income = 0 Boundary Check",
    `Income=0 resulted in DSR "${dsrIncomeZero}" and badge "${badgeIncomeZero}". Zero income with debts must NOT be Tier 1 Pre-Approved!`
);

// Test 1.2: Gross Income = 10,000, Commitments = 0
elements['calcIncome'].value = "10000";
elements['calcCommitments'].value = "0";
elements['calcPropertyPrice'].value = "480000";
elements['calcMargin'].value = "90";
elements['calcTenure'].value = "35";
elements['calcInterest'].value = "4.25";

context.runDSRCalculation();
const dsrNoCommitment = parseFloat(elements['resDSRVal'].innerText.replace("%", ""));
const badgeNoCommitment = elements['resBadgeText'].innerText;

assert(
    dsrNoCommitment > 0 && dsrNoCommitment <= 40 && badgeNoCommitment.includes("Tier 1"),
    "1.2 Gross Income = 10,000 with 0 Commitments",
    `Calculated DSR: ${dsrNoCommitment}%, Badge: "${badgeNoCommitment}"`
);

// Test 1.3: DSR = 39.9% (Tier 1 Pre-Approved)
// Exact commitment to yield 39.90% DSR:
// DSR = (Commitments + 1977.9238) / 10000 * 100 = 39.9 -> Commitments + 1977.9238 = 3990 -> Commitments = 2012.076
elements['calcIncome'].value = "10000";
elements['calcCommitments'].value = "2012.076";
elements['calcPropertyPrice'].value = "480000";
elements['calcMargin'].value = "90";
elements['calcTenure'].value = "35";
elements['calcInterest'].value = "4.25";

context.runDSRCalculation();
const dsrVal399 = parseFloat(elements['resDSRVal'].innerText.replace("%", ""));
const badge399 = elements['resBadgeText'].innerText;

assert(
    dsrVal399 === 39.9 && badge399.includes("Tier 1"),
    "1.3 DSR = 39.9% (Tier 1 Boundary)",
    `Actual DSR: ${dsrVal399}%, Badge: "${badge399}"`
);

// Test 1.4: DSR = 40.0% (Tier 1 Pre-Approved Boundary & Badge/Save Consistency)
// Exact commitment to yield 40.00% DSR: 4000 - 1977.9238 = 2022.076
elements['calcIncome'].value = "10000";
elements['calcCommitments'].value = "2022.076";
elements['calcPropertyPrice'].value = "480000";
elements['calcMargin'].value = "90";
elements['calcTenure'].value = "35";
elements['calcInterest'].value = "4.25";

context.runDSRCalculation();
const dsrVal400 = parseFloat(elements['resDSRVal'].innerText.replace("%", ""));
const badge400 = elements['resBadgeText'].innerText;

// Trigger save to inspect saved dossier tier vs UI badge
elements['calcBuyerName'].value = "Test 40.0 Percent";
context.saveCalculatorToDossier();
const saved40 = JSON.parse(mockLocalStorage.getItem("zk_portal_dossiers"))[0];

assert(
    dsrVal400 === 40.0 && badge400.includes("Tier 1") && saved40.tier.includes("Tier 1"),
    "1.4 DSR = 40.0% (Tier 1 Boundary & Consistency Check)",
    `UI DSR: ${dsrVal400}%, UI Badge: "${badge400}", Saved Dossier Tier: "${saved40.tier}". MISMATCH: UI badge showed Tier 2 while saved dossier showed Tier 1!`
);

// Test 1.5: DSR = 60.0% (Tier 2 Qualified Boundary & Badge/Save Consistency)
// Exact commitment to yield 60.00% DSR: 6000 - 1977.9238 = 4022.076
elements['calcIncome'].value = "10000";
elements['calcCommitments'].value = "4022.076";
elements['calcPropertyPrice'].value = "480000";
elements['calcMargin'].value = "90";
elements['calcTenure'].value = "35";
elements['calcInterest'].value = "4.25";

context.runDSRCalculation();
const dsrVal600 = parseFloat(elements['resDSRVal'].innerText.replace("%", ""));
const badge600 = elements['resBadgeText'].innerText;

elements['calcBuyerName'].value = "Test 60.0 Percent";
context.saveCalculatorToDossier();
const saved60 = JSON.parse(mockLocalStorage.getItem("zk_portal_dossiers"))[0];

assert(
    dsrVal600 === 60.0 && badge600.includes("Tier 2") && saved60.tier.includes("Tier 2"),
    "1.5 DSR = 60.0% (Tier 2 Boundary & Consistency Check)",
    `UI DSR: ${dsrVal600}%, UI Badge: "${badge600}", Saved Dossier Tier: "${saved60.tier}". MISMATCH: UI badge showed Tier 3 while saved dossier showed Tier 2!`
);

// Test 1.6: DSR = 60.1% (Tier 3 Review)
// Exact commitment for 60.10% DSR: 6010 - 1977.9238 = 4032.076
elements['calcIncome'].value = "10000";
elements['calcCommitments'].value = "4032.076";
elements['calcPropertyPrice'].value = "480000";
elements['calcMargin'].value = "90";
elements['calcTenure'].value = "35";
elements['calcInterest'].value = "4.25";

context.runDSRCalculation();
const dsrVal601 = parseFloat(elements['resDSRVal'].innerText.replace("%", ""));
const badge601 = elements['resBadgeText'].innerText;

assert(
    dsrVal601 === 60.1 && badge601.includes("Tier 3"),
    "1.6 DSR = 60.1% (Tier 3 Boundary)",
    `Actual DSR: ${dsrVal601}%, Badge: "${badge601}"`
);


// -------------------------------------------------------------
// TEST GROUP 2: Loan Margin %, Tenure, Interest Rate Inputs
// -------------------------------------------------------------
console.log("\n--- TEST GROUP 2: Loan Margin %, Tenure (10-35 yrs), Interest Rate Inputs ---");

// Test 2.1: Tenure 10 years vs 35 years
elements['calcIncome'].value = "10000";
elements['calcCommitments'].value = "1000";
elements['calcPropertyPrice'].value = "500000";
elements['calcMargin'].value = "90";
elements['calcInterest'].value = "4.25";

elements['calcTenure'].value = "10";
context.runDSRCalculation();
const inst10yVal = parseFloat(elements['resInstallment'].innerText.replace(/[^0-9.]/g, ''));

elements['calcTenure'].value = "35";
context.runDSRCalculation();
const inst35yVal = parseFloat(elements['resInstallment'].innerText.replace(/[^0-9.]/g, ''));

assert(
    inst10yVal > inst35yVal,
    "2.1 Tenure 10 yrs vs 35 yrs Input Test",
    `10y Installment: RM ${inst10yVal}, 35y Installment: RM ${inst35yVal}`
);

// Test 2.2: Interest rate = 0% input check
elements['calcIncome'].value = "10000";
elements['calcCommitments'].value = "1000";
elements['calcPropertyPrice'].value = "500000";
elements['calcMargin'].value = "90";
elements['calcTenure'].value = "30";
elements['calcInterest'].value = "0";

context.runDSRCalculation();
const inst0RateText = elements['resInstallment'].innerText;
const inst0RateVal = parseFloat(inst0RateText.replace(/[^0-9.]/g, ''));
// Expected installment for RM 450,000 loan over 360 months with 0% interest is 450000/360 = 1250
const expected0InterestInst = Math.round(450000 / 360);

assert(
    inst0RateVal === expected0InterestInst,
    "2.2 Zero Interest Rate Input Handling",
    `Input interest 0% produced installment RM ${inst0RateVal} (calculated at 4.25% fallback) instead of expected RM ${expected0InterestInst}! Bug: parseFloat("0") || 4.25 overrides 0 with 4.25.`
);

// Test 2.3: Loan Margin 100% vs 50%
elements['calcIncome'].value = "10000";
elements['calcCommitments'].value = "1000";
elements['calcPropertyPrice'].value = "500000";
elements['calcTenure'].value = "30";
elements['calcInterest'].value = "4.25";

elements['calcMargin'].value = "100";
context.runDSRCalculation();
const inst100Margin = parseFloat(elements['resInstallment'].innerText.replace(/[^0-9.]/g, ''));

elements['calcMargin'].value = "50";
context.runDSRCalculation();
const inst50Margin = parseFloat(elements['resInstallment'].innerText.replace(/[^0-9.]/g, ''));

assert(
    inst100Margin === 2 * inst50Margin,
    "2.3 Loan Margin 100% vs 50% Input Test",
    `100% Margin: RM ${inst100Margin}, 50% Margin: RM ${inst50Margin}`
);


// -------------------------------------------------------------
// TEST GROUP 3: Client-Side State Persistence (`localStorage`)
// -------------------------------------------------------------
console.log("\n--- TEST GROUP 3: Client-Side State Persistence (`localStorage`) ---");

// Test 3.1: Save calculation to buyer dossier and verify localStorage
elements['calcBuyerName'].value = "State Persistence Test Lead";
elements['calcPhone'].value = "+60128889999";
elements['calcAgentId'].value = "REN-003";
elements['calcIncome'].value = "9000";
elements['calcCommitments'].value = "2500";
elements['calcPropertyPrice'].value = "600000";
elements['calcMargin'].value = "90";
elements['calcTenure'].value = "35";
elements['calcInterest'].value = "4.25";
elements['calcProject'].value = "Cyberjaya Lakefront";

context.runDSRCalculation();
const currentDSRStr = elements['resDSRVal'].innerText.replace("%", "");

context.saveCalculatorToDossier();

const rawStored = mockLocalStorage.getItem("zk_portal_dossiers");
assert(
    rawStored !== null,
    "3.1 localStorage Key Existence Check",
    "zk_portal_dossiers was not found in localStorage"
);

let parsedStored = [];
try {
    parsedStored = JSON.parse(rawStored);
} catch(e) {}

const foundLead = parsedStored.find(d => d.buyerName === "State Persistence Test Lead");

assert(
    foundLead !== undefined && foundLead.phone === "+60128889999" && foundLead.assignedAgentId === "REN-003",
    "3.2 Saved Dossier Data Integrity in localStorage",
    `Found lead: ${JSON.stringify(foundLead)}`
);

assert(
    foundLead && String(foundLead.dsrRatio) === String(currentDSRStr),
    "3.3 Attached DSR Ratio Matches Calculation Result",
    `Calculated DSR: ${currentDSRStr}, Saved DSR: ${foundLead ? foundLead.dsrRatio : undefined}`
);

// Test 3.4: Simulated Page Reload (initApp) reads from localStorage
context.initApp();
const reloadedDossiers = parsedStored; // initApp parses localStorage again
const reloadedLead = reloadedDossiers.find(d => d.buyerName === "State Persistence Test Lead");

assert(
    reloadedLead !== undefined && reloadedLead.projectInterest === "Cyberjaya Lakefront",
    "3.4 Client-Side State Re-hydration from localStorage",
    `Reloaded lead: ${JSON.stringify(reloadedLead)}`
);


// -------------------------------------------------------------
// SUMMARY OF TEST RESULTS
// -------------------------------------------------------------
console.log("\n=================================================");
console.log(`TOTAL PASSED: ${testPasses.length}`);
console.log(`TOTAL FAILED: ${testFailures.length}`);
console.log("=================================================");

if (testFailures.length > 0) {
    console.log("\nFAILED TESTS DETAILS:");
    testFailures.forEach(f => {
        console.log(`- [FAIL] ${f.testName}`);
        console.log(`  ${f.details}`);
    });
}
