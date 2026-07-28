/**
 * ZK Revenue Ops — High-Volume CRM & Qualification R&D Engine
 * Designed to handle 5,000+ leads per REN with automated DSR (Debt Service Ratio)
 * loan eligibility filtering, lead grading (Grade A/B/C), and instant query.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const CRM_DB_FILE = path.join(__dirname, 'ren_5000_leads_rnd.json');
const PORT = 3777;

// Generate 5,000 Realistic Sample Leads for R&D Load Testing if DB doesn't exist
function generate5kLeads() {
    console.log("⚡ Generating 5,000 R&D Leads for High-Volume REN Database Test...");
    const namesFirst = ["Ahmad", "Mohd", "Nurul", "Siti", "Muhamad", "Farah", "Azman", "Faizal", "Lee", "Tan", "Wong", "Kavitha", "Devi", "Subramaniam", "Chong", "Zainab", "Hafiz", "Khairul", "Amira", "Syahmi"];
    const namesLast = ["Hassan", "Ibrahim", "Kamal", "Yusof", "Abdullah", "Razak", "Wei", "Ming", "Jie", "Kumar", "Shankar", "Chen", "Chai", "Rahman", "Bakary", "Ismail", "Rosli", "Harun", "Zainal", "Mahmud"];
    const locations = ["Setia Alam, Shah Alam", "Bangi, Selangor", "Cyberjaya", "Damansara Heights", "Puchong, Selangor", "Cheras, KL", "Petaling Jaya", "Subang Jaya", "Ampang, KL", "Rawang, Selangor"];
    const propertyTypes = ["Condo", "Terrace", "Semi-D", "Bungalow", "Apartment", "Townhouse"];
    const sources = ["Legacy Database (5k Import)", "FB Ads Lead Gen", "iProperty Scrape", "PropertyGuru Scrape", "WhatsApp Organic", "Referral"];

    const leads = [];
    for (let i = 1; i <= 5000; i++) {
        const fn = namesFirst[Math.floor(Math.random() * namesFirst.length)];
        const ln = namesLast[Math.floor(Math.random() * namesLast.length)];
        const name = `${fn} ${ln}`;
        const phone = `+601${Math.floor(10000000 + Math.random() * 90000000)}`;
        const netIncome = Math.floor(3500 + Math.random() * 15000); // RM 3,500 - RM 18,500
        const existingCommitments = Math.floor(800 + Math.random() * (netIncome * 0.5));
        const maxBudget = Math.floor(250000 + Math.random() * 1500000);
        
        // Calculate estimated monthly installment (approx 4.5% interest, 35 years)
        const estInstallment = Math.round(maxBudget * 0.0048);
        const dsrPercent = Math.round(((existingCommitments + estInstallment) / netIncome) * 100);
        
        // Automated Lead Qualification Logic (DSR & Readiness Scoring)
        let grade = "C"; // Default Unqualified / Cold
        let status = "Dormant (Needs Follow-up)";
        let score = 0;

        if (dsrPercent <= 65) {
            score += 40; // Financial pass
        } else if (dsrPercent <= 75) {
            score += 20; // Marginal pass
        }

        if (maxBudget >= 500000) score += 20;
        if (i % 7 === 0) score += 25; // Active response simulation
        if (i % 3 === 0) score += 15; // Complete criteria

        if (score >= 70 && dsrPercent <= 65) {
            grade = "A";
            status = i % 2 === 0 ? "Qualified (Hot)" : "Viewing Scheduled";
        } else if (score >= 45 && dsrPercent <= 75) {
            grade = "B";
            status = "Nurturing (Warm)";
        } else {
            grade = "C";
            status = dsrPercent > 80 ? "DSR Failed (Unqualified)" : "Dormant (Cold)";
        }

        const estCommission = Math.round(maxBudget * 0.02); // 2% agency commission

        leads.push({
            id: `LID-${String(i).padStart(5, '0')}`,
            name,
            phone,
            email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
            location: locations[Math.floor(Math.random() * locations.length)],
            propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
            maxBudget,
            netIncome,
            existingCommitments,
            dsrPercent,
            grade, // Grade A (Hot & Eligible), Grade B (Warm Nurture), Grade C (Cold/Unqualified)
            status,
            score,
            estCommission,
            source: sources[Math.floor(Math.random() * sources.length)],
            lastContactDate: new Date(Date.now() - Math.floor(Math.random() * 90 * 86400000)).toISOString().split('T')[0],
            renId: i % 2 === 0 ? "REN-001" : "REN-002"
        });
    }

    const initialDb = {
        metadata: {
            totalLeads: 5000,
            generatedAt: new Date().toISOString(),
            engine: "ZK High-Volume CRM Qualification Engine"
        },
        rens: [
            { id: "REN-001", name: "Ahmad Razif", agency: "IQI Realty", totalLeads: 2500 },
            { id: "REN-002", name: "Siti Nurhaliza", agency: "Renstar Properties", totalLeads: 2500 }
        ],
        leads
    };

    fs.writeFileSync(CRM_DB_FILE, JSON.stringify(initialDb, null, 2));
    console.log("✅ 5,000 R&D Leads Database Successfully Generated & Indexed!");
    return initialDb;
}

function loadCRM() {
    if (!fs.existsSync(CRM_DB_FILE)) {
        return generate5kLeads();
    }
    try {
        return JSON.parse(fs.readFileSync(CRM_DB_FILE, 'utf8'));
    } catch (e) {
        return generate5kLeads();
    }
}

// Fast Filtering Engine
function filterLeads(query) {
    const db = loadCRM();
    let results = db.leads;

    if (query.grade) {
        results = results.filter(l => l.grade === query.grade.toUpperCase());
    }
    if (query.renId) {
        results = results.filter(l => l.renId === query.renId);
    }
    if (query.search) {
        const s = query.search.toLowerCase();
        results = results.filter(l => l.name.toLowerCase().includes(s) || l.phone.includes(s) || l.location.toLowerCase().includes(s));
    }
    if (query.maxDsr) {
        const dsr = parseInt(query.maxDsr);
        results = results.filter(l => l.dsrPercent <= dsr);
    }

    const summary = {
        total: results.length,
        gradeA: results.filter(l => l.grade === 'A').length,
        gradeB: results.filter(l => l.grade === 'B').length,
        gradeC: results.filter(l => l.grade === 'C').length,
        potentialCommission: results.reduce((sum, l) => sum + (l.grade === 'A' ? l.estCommission : 0), 0)
    };

    return { summary, results: results.slice(0, 50) }; // Paginated 50 for UI speed
}

// Server & API
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const pathName = urlObj.pathname;
    const queryParams = Object.fromEntries(urlObj.searchParams);

    if (pathName === '/api/crm/leads') {
        const data = filterLeads(queryParams);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }
    else if (pathName === '/api/crm/stats') {
        const db = loadCRM();
        const stats = {
            totalLeads: db.leads.length,
            gradeACount: db.leads.filter(l => l.grade === 'A').length,
            gradeBCount: db.leads.filter(l => l.grade === 'B').length,
            gradeCCount: db.leads.filter(l => l.grade === 'C').length,
            pipelineCommission: db.leads.filter(l => l.grade === 'A').reduce((sum, l) => sum + l.estCommission, 0),
            dsrPassRate: Math.round((db.leads.filter(l => l.dsrPercent <= 65).length / db.leads.length) * 100)
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats));
    }
    else {
        // Serve Dashboard HTML
        const htmlPath = path.join(__dirname, '..', '..', '06_Assets', 'Dashboard', 'client-dashboard.html');
        if (fs.existsSync(htmlPath)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fs.readFileSync(htmlPath, 'utf8'));
        } else {
            res.writeHead(404); res.end('Dashboard not found');
        }
    }
});

server.listen(PORT, () => {
    console.log(`\n  ╔══════════════════════════════════════════════════════════╗`);
    console.log(`  ║  ZK Revenue Ops — 5,000 Leads High-Volume CRM Engine    ║`);
    console.log(`  ║  http://localhost:${PORT}                                  ║`);
    console.log(`  ║  Automated DSR Loan Filtering & Grade A/B/C Classifier   ║`);
    console.log(`  ╚══════════════════════════════════════════════════════════╝\n`);
});
