/**
 * ---
 * Title: Full System Audit Runner JS
 * ID: SYS-013
 * Type: Script (Node.js)
 * Module: 05_Systems
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 1.0
 * Created: 2026-08-05
 * Updated: 2026-08-05
 * Owner: Zubair (zubairisa10@gmail.com)
 * Related: PRJ-009
 * ---
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { ZKDatabaseEngine, DB_PATH } = require('../Database/db_engine.js');
const { calculateDSR } = require('../Databases/zk_crm_engine.js');

console.log("================ 🚀 ZK REVENUE OPS FULL SYSTEM & NOTION TEST HARNESS ================");

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// 1. Database & Lead Engine Test
console.log("\n[TEST 1] SQLite Local Database & Lead Matching Engine:");
try {
  const dbEngine = new ZKDatabaseEngine(DB_PATH);
  assert(dbEngine.db !== null, "SQLite Database Connection Initialized");

  const renCount = dbEngine.db.prepare("SELECT COUNT(*) as count FROM ren_clients").get().count;
  assert(renCount >= 0, `REN Clients Table Queryable (Found ${renCount} RENs)`);

  const buyerCount = dbEngine.db.prepare("SELECT COUNT(*) as count FROM buyer_prospects").get().count;
  assert(buyerCount >= 0, `Buyer Prospects Table Queryable (Found ${buyerCount} Buyers)`);

  const matches = dbEngine.matchBuyerCriteria({ max_budget: 600000, preferred_location: 'Shah Alam', property_type: 'Condo', min_bedrooms: 2 });
  assert(Array.isArray(matches), "Buyer-Listing Matching Algorithm Executed Cleanly");
} catch (e) {
  assert(false, `Database Test Exception: ${e.message}`);
}

// 2. DSR Loan Qualification Engine Test
console.log("\n[TEST 2] Auto-DSR Bank Loan Pre-Qualification Engine:");
try {
  const sampleGrossIncome = 8500;
  const sampleCommitments = 2200;
  const sampleNetIncome = 7400;
  const sampleHouseInstallment = 2100;

  const dsrResult = calculateDSR(sampleNetIncome, sampleCommitments, sampleHouseInstallment);
  assert(dsrResult.dsrPercent !== undefined, `DSR Calculated Successfully: ${dsrResult.dsrPercent}%`);
  assert(dsrResult.status === 'Grade A Pass' || dsrResult.status === 'Grade B Watch' || dsrResult.status === 'Grade C Fail', `Valid DSR Grade Assigned: ${dsrResult.status}`);
} catch (e) {
  assert(false, `DSR Engine Exception: ${e.message}`);
}

// 3. Notion Sales CRM Integration Schema Verification
console.log("\n[TEST 3] Notion Sales CRM Schema & Sync Bridge Mapping:");
try {
  const notionFrameworkPath = path.join(__dirname, '../../01_Business/ZK-Revenue-Ops/Strategy/NOTION_SALES_CRM_FRAMEWORK.md');
  const frameworkExists = fs.existsSync(notionFrameworkPath);
  assert(frameworkExists, "Notion Sales CRM Framework Documentation Present");

  const notionSetupScript = path.join(__dirname, 'setup_notion_sales_crm.ps1');
  const scriptExists = fs.existsSync(notionSetupScript);
  assert(scriptExists, "Notion Sales CRM Automator Script Present");

  // Verify Notion Data Fields Mapping
  const expectedNotionFields = ['Property Title', 'Asking Price (RM)', 'Location Area', 'Property Type', 'SPA Deal Value (RM)', 'Agent Split %', 'Banker Loan Status'];
  const scriptContent = fs.readFileSync(notionSetupScript, 'utf8');
  let allFieldsMapped = true;
  expectedNotionFields.forEach(field => {
    if (!scriptContent.includes(field)) allFieldsMapped = false;
  });
  assert(allFieldsMapped, "All Core Notion Relational CRM Fields Mapped Correctly");
} catch (e) {
  assert(false, `Notion Test Exception: ${e.message}`);
}

// 4. REST Server Endpoints Connectivity Test (Port 3777)
console.log("\n[TEST 4] REST API Server Port 3777 Connectivity:");
function checkEndpoint(endpointPath) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3777${endpointPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });
    req.on('error', (err) => {
      resolve({ statusCode: 500, error: err.message });
    });
  });
}

async function runServerTests() {
  const endpoints = ['/api/v1/overview', '/api/v1/buyers', '/api/v1/listings', '/api/v1/viewings', '/api/v1/deals'];
  for (const ep of endpoints) {
    const res = await checkEndpoint(ep);
    assert(res.statusCode === 200, `Endpoint ${ep} Returned HTTP 200 OK`);
  }

  console.log("\n================ SUMMARY REPORT ================");
  console.log(`Total Test Checks Executed: ${passCount + failCount}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  if (failCount === 0) {
    console.log("🎉 ALL SYSTEM & NOTION INTEGRATION TESTS PASSED 100%!");
  } else {
    console.error("⚠️ SOME TESTS FAILED — CHECK LOGS ABOVE.");
  }
}

runServerTests();
