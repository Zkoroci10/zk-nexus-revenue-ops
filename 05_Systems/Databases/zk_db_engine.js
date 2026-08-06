/**
 * ZK Revenue Ops — Local R&D Relational Engine & API Server
 * Zero-dependency Node.js File-Backed Relational Store & Matching Logic
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const DB_FILE = path.join(__dirname, 'client_leads_rnd.json');
const NOTION_TOKEN = process.env.NOTION_API_KEY || '';
const BUYER_DB_ID = '3ab9608c-a9d9-8104-924c-c90dc01a789e';
const PORT = 3777;

// Initial Seed Schema
const initialSeed = {
    metadata: {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        environment: "R&D Development"
    },
    rens: [
        { id: "REN-001", name: "Ahmad Razif", agency: "IQI Realty", tier: "Growth", phone: "+60121234567", activeLeads: 3, commissionYTD: 54000 },
        { id: "REN-002", name: "Siti Nurhaliza", agency: "Renstar Properties", tier: "Enterprise", phone: "+60139876543", activeLeads: 2, commissionYTD: 17000 }
    ],
    listings: [
        { id: "LST-001", title: "Suria Jelutong Studio Condo", location: "Bukit Jelutong, Shah Alam", price: 380000, type: "Condo", rooms: 2, sizeSqft: 750, renId: "REN-001" },
        { id: "LST-002", title: "Skyfield 2-Storey Terrace", location: "Bangi, Selangor", price: 680000, type: "Terrace", rooms: 4, sizeSqft: 1800, renId: "REN-002" },
        { id: "LST-003", title: "Cyber Towers Luxury Suite", location: "Cyberjaya", price: 850000, type: "Semi-D", rooms: 4, sizeSqft: 2200, renId: "REN-001" },
        { id: "LST-004", title: "Botanica Hilltop Bungalow", location: "Damansara Heights", price: 2400000, type: "Bungalow", rooms: 6, sizeSqft: 5500, renId: "REN-001" },
        { id: "LST-005", title: "Puchong Heights Subsale Apt", location: "Puchong, Selangor", price: 320000, type: "Apartment", rooms: 3, sizeSqft: 850, renId: "REN-002" }
    ],
    buyers: [
        { id: "BYR-001", name: "Mohd Fikri bin Hassan", phone: "+60123456789", location: "Setia Alam, Shah Alam", budgetMax: 500000, preferredType: "Condo", renId: "REN-001", status: "Viewing Scheduled", commission: 6000, source: "Facebook Ads" },
        { id: "BYR-002", name: "Aina binti Kamal", phone: "+60198765432", location: "Bangi, Selangor", budgetMax: 800000, preferredType: "Terrace", renId: "REN-002", status: "Negotiation", commission: 12000, source: "Portal Listing" },
        { id: "BYR-003", name: "Lee Wei Jie", phone: "+60171234567", location: "Cyberjaya", budgetMax: 1000000, preferredType: "Semi-D", renId: "REN-001", status: "Booking Placed", commission: 18000, source: "Referral" },
        { id: "BYR-004", name: "Priya a/p Shankar", phone: "+60141122334", location: "Puchong, Selangor", budgetMax: 500000, preferredType: "Apartment", renId: "REN-002", status: "New Inquiry", commission: 5000, source: "WhatsApp Blast" },
        { id: "BYR-005", name: "Azman bin Yusof", phone: "+60169988776", location: "Damansara Heights", budgetMax: 3000000, preferredType: "Bungalow", renId: "REN-001", status: "Viewing Done", commission: 30000, source: "Google Ads" }
    ]
};

// Initialize DB file if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2));
}

function loadDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        return initialSeed;
    }
}

function saveDB(db) {
    db.metadata.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Matching Logic Algorithm
function findPropertyMatches(buyer) {
    const db = loadDB();
    return db.listings.map(lst => {
        let score = 0;
        let reasons = [];

        // Budget match (40%)
        if (lst.price <= buyer.budgetMax) {
            score += 40;
            reasons.push(`Price RM${lst.price.toLocaleString()} within budget RM${buyer.budgetMax.toLocaleString()}`);
        } else if (lst.price <= buyer.budgetMax * 1.1) {
            score += 20;
            reasons.push(`Price slightly above budget (+10%)`);
        }

        // Property Type match (35%)
        if (lst.type.toLowerCase() === buyer.preferredType.toLowerCase()) {
            score += 35;
            reasons.push(`Exact property type match (${lst.type})`);
        }

        // Location match (25%)
        const buyerLoc = buyer.location.toLowerCase();
        const lstLoc = lst.location.toLowerCase();
        if (lstLoc.includes(buyerLoc) || buyerLoc.includes(lstLoc)) {
            score += 25;
            reasons.push(`Matching location area (${lst.location})`);
        } else {
            // Check state match
            const buyerState = buyerLoc.split(',').pop().trim();
            if (lstLoc.includes(buyerState)) {
                score += 10;
                reasons.push(`Same state region`);
            }
        }

        return {
            listing: lst,
            matchScore: score,
            reasons
        };
    }).sort((a, b) => b.matchScore - a.matchScore);
}

// HTTP Server & API Endpoints
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    const urlParts = req.url.split('?');
    const pathName = urlParts[0];

    if (pathName === '/api/buyers') {
        const db = loadDB();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: db.buyers, total: db.buyers.length }));
    } 
    else if (pathName === '/api/listings') {
        const db = loadDB();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: db.listings, total: db.listings.length }));
    } 
    else if (pathName === '/api/rens') {
        const db = loadDB();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: db.rens, total: db.rens.length }));
    }
    else if (pathName === '/api/match') {
        const db = loadDB();
        const matches = db.buyers.map(b => ({
            buyer: b,
            topMatches: findPropertyMatches(b).slice(0, 3)
        }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: matches }));
    }
    else {
        // Serve dashboard HTML
        const htmlPath = path.join(__dirname, '..', '..', '06_Resources', 'Assets', 'Dashboard', 'client-dashboard.html');
        if (fs.existsSync(htmlPath)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fs.readFileSync(htmlPath, 'utf8'));
        } else {
            res.writeHead(404);
            res.end('Dashboard HTML not found');
        }
    }
});

server.listen(PORT, () => {
    console.log(`\n  ╔═══════════════════════════════════════════════════╗`);
    console.log(`  ║  ZK Revenue Ops — R&D Relational Engine & Server  ║`);
    console.log(`  ║  http://localhost:${PORT}                           ║`);
    console.log(`  ║  Local Store: 05_Systems/Databases/client_leads   ║`);
    console.log(`  ╚═══════════════════════════════════════════════════╝\n`);
});
