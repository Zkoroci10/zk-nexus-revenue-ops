/**
 * ZK Revenue Ops — High-Volume Enterprise CRM & Qualification Engine
 * Designed for REN Team Leaders & Large Agencies handling 100,000+ Lead Databases
 * Features automated DSR (Debt Service Ratio) eligibility filtering, lead grading (Grade A/B/C),
 * and PDPA 2010 compliant single-tenant data isolation.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const CRM_DB_FILE = path.join(__dirname, 'ren_100k_leads_rnd.json');

// Auto DSR Calculation Helper
function calculateDSR(netIncome, existingCommitments, estInstallment = 0) {
    if (!netIncome || netIncome <= 0) return { dsrPercent: 0, status: 'Invalid Income' };
    const totalCommitments = (existingCommitments || 0) + (estInstallment || 0);
    const dsrPercent = Math.round((totalCommitments / netIncome) * 100);
    let status = 'Grade A Pass';
    if (dsrPercent > 75) status = 'Grade C Fail';
    else if (dsrPercent > 65) status = 'Grade B Watch';
    return { dsrPercent, totalCommitments, status };
}

// Generate 100,000 Realistic Sample Leads for Enterprise Agency Load Testing
function generate100kLeads() {
    console.log("⚡ Generating 100,000 Enterprise Lead Records for High-Volume REN Team Leader Benchmark...");
    const namesFirst = ["Ahmad", "Mohd", "Nurul", "Siti", "Muhamad", "Farah", "Azman", "Faizal", "Lee", "Tan", "Wong", "Kavitha", "Devi", "Subramaniam", "Chong", "Zainab", "Hafiz", "Khairul", "Amira", "Syahmi"];
    const namesLast = ["Hassan", "Ibrahim", "Kamal", "Yusof", "Abdullah", "Razak", "Wei", "Ming", "Jie", "Kumar", "Shankar", "Chen", "Chai", "Rahman", "Bakary", "Ismail", "Rosli", "Harun", "Zainal", "Mahmud"];
    const locations = ["Setia Alam, Shah Alam", "Bangi, Selangor", "Cyberjaya", "Damansara Heights", "Puchong, Selangor", "Cheras, KL", "Petaling Jaya", "Subang Jaya", "Ampang, KL", "Rawang, Selangor", "Iskandar Puteri, Johor", "Georgetown, Penang"];
    const propertyTypes = ["Condo", "Terrace", "Semi-D", "Bungalow", "Apartment", "Townhouse", "Commercial Shoplot", "Industrial Factory"];
    const sources = ["Legacy Database (100k Agency Import)", "FB Lead Ads", "iProperty Scrape", "PropertyGuru Scrape", "WhatsApp Organic", "Referral", "Tik Tok Ads"];

    const leads = [];
    for (let i = 1; i <= 100000; i++) {
        const fn = namesFirst[Math.floor(Math.random() * namesFirst.length)];
        const ln = namesLast[Math.floor(Math.random() * namesLast.length)];
        const name = `${fn} ${ln}`;
        const phone = `+601${Math.floor(10000000 + Math.random() * 90000000)}`;
        const netIncome = Math.floor(3500 + Math.random() * 25000);
        const existingCommitments = Math.floor(800 + Math.random() * (netIncome * 0.5));
        const maxBudget = Math.floor(250000 + Math.random() * 3000000);
        
        const estInstallment = Math.round(maxBudget * 0.0048);
        const dsrResult = calculateDSR(netIncome, existingCommitments, estInstallment);
        
        let grade = "C";
        let status = "Dormant (Needs Follow-up)";
        let score = 0;

        if (dsrResult.dsrPercent <= 65) score += 40;
        else if (dsrResult.dsrPercent <= 75) score += 20;

        if (maxBudget >= 500000) score += 20;
        if (i % 7 === 0) score += 25;
        if (i % 3 === 0) score += 15;

        if (score >= 70 && dsrResult.dsrPercent <= 65) {
            grade = "A";
            status = i % 2 === 0 ? "Qualified (Hot)" : "Viewing Scheduled";
        } else if (score >= 45 && dsrResult.dsrPercent <= 75) {
            grade = "B";
            status = "Nurturing (Warm)";
        } else {
            grade = "C";
            status = dsrResult.dsrPercent > 80 ? "DSR Failed (Unqualified)" : "Dormant (Cold)";
        }

        const estCommission = Math.round(maxBudget * 0.02);

        leads.push({
            id: `LID-${String(i).padStart(6, '0')}`,
            name,
            phone,
            email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
            location: locations[Math.floor(Math.random() * locations.length)],
            propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
            maxBudget,
            netIncome,
            existingCommitments,
            dsrPercent: dsrResult.dsrPercent,
            grade,
            status,
            score,
            estCommission,
            source: sources[Math.floor(Math.random() * sources.length)],
            pdpaConsent: true,
            createdAt: new Date().toISOString()
        });
    }

    fs.writeFileSync(CRM_DB_FILE, JSON.stringify(leads, null, 2), 'utf8');
    console.log(`✅ 100,000 Enterprise Lead Records Generated Successfully at ${CRM_DB_FILE}`);
    return leads;
}

module.exports = { generate100kLeads, calculateDSR };
