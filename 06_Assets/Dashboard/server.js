/**
 * ZK Revenue Ops — Custom Tailored Client Dashboard Server (ZK-DASH)
 * ID: SYS-005
 * Module: 06_Assets/Dashboard/server.js
 * 
 * Express / Node.js HTTP Server serving static UI and REST API v1 endpoints
 * connected to SQLite client_leads.db via ZKDatabaseEngine.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { ZKDatabaseEngine, DB_PATH } = require('../../05_Systems/Database/db_engine.js');

const PORT = process.env.PORT || 3777;

// Resolve static dashboard directory
const DASHBOARD_DIR = fs.existsSync(path.join(__dirname, 'client-dashboard.html'))
    ? __dirname
    : path.join(__dirname, '../../06_Assets/Dashboard');

const dbEngine = new ZKDatabaseEngine(DB_PATH);

// Helper to parse JSON request body
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}

// MIME types dictionary for static files
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Connection', 'close');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = url.pathname;

    try {
        // API Route 1: Overview
        if (pathname === '/api/v1/overview' && req.method === 'GET') {
            const totalRensStmt = dbEngine.db.prepare(`SELECT COUNT(*) as count FROM ren_clients WHERE status = 'Active'`);
            const totalRens = totalRensStmt.get().count;

            const activeBuyersStmt = dbEngine.db.prepare(`SELECT COUNT(*) as count FROM buyer_prospects`);
            const activeBuyers = activeBuyersStmt.get().count;

            const totalListingsStmt = dbEngine.db.prepare(`SELECT COUNT(*) as count FROM property_listings WHERE status = 'Available'`);
            const totalListings = totalListingsStmt.get().count;

            const commissionStmt = dbEngine.db.prepare(`SELECT COALESCE(SUM(commission_earned), 0) as total FROM commission_deals`);
            const totalCommissionRM = commissionStmt.get().total;

            const pipelineStmt = dbEngine.db.prepare(`SELECT COALESCE(SUM(deal_amount), 0) as total FROM commission_deals`);
            const totalPipelineRM = pipelineStmt.get().total;

            const closedWonStmt = dbEngine.db.prepare(`SELECT COUNT(*) as count FROM commission_deals WHERE status = 'Closed Won'`);
            const closedWonCount = closedWonStmt.get().count;

            const conversionRatePercent = activeBuyers > 0 ? parseFloat(((closedWonCount / activeBuyers) * 100).toFixed(1)) : 0;

            const recentDealsStmt = dbEngine.db.prepare(`
                SELECT d.deal_id, d.deal_amount, d.commission_earned, d.deal_date, d.status,
                       l.title as listing_title, b.name as buyer_name, r.name as ren_name
                FROM commission_deals d
                LEFT JOIN property_listings l ON d.listing_id = l.listing_id
                LEFT JOIN buyer_prospects b ON d.buyer_id = b.buyer_id
                LEFT JOIN ren_clients r ON d.ren_id = r.ren_id
                ORDER BY d.deal_date DESC
                LIMIT 5
            `);
            const recentDeals = recentDealsStmt.all();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: {
                    totalRens,
                    activeBuyers,
                    totalListings,
                    totalCommissionRM,
                    totalPipelineRM,
                    conversionRatePercent,
                    recentDeals
                }
            }));
            return;
        }

        // API Route 2: Buyers
        if (pathname === '/api/v1/buyers' && req.method === 'GET') {
            const stmt = dbEngine.db.prepare(`
                SELECT buyer_id, name, phone, email, preferred_location, max_budget,
                       property_type, min_bedrooms, lead_score, status, created_at
                FROM buyer_prospects
                ORDER BY lead_score DESC, created_at DESC
            `);
            const buyers = stmt.all();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                count: buyers.length,
                data: buyers
            }));
            return;
        }

        // API Route 3: Listings
        if (pathname === '/api/v1/listings' && req.method === 'GET') {
            const stmt = dbEngine.db.prepare(`
                SELECT l.listing_id, l.title, l.location, l.property_type, l.price,
                       l.bedrooms, l.bathrooms, l.ren_id, r.name as ren_name, l.status, l.created_at
                FROM property_listings l
                LEFT JOIN ren_clients r ON l.ren_id = r.ren_id
                ORDER BY l.created_at DESC
            `);
            const listings = stmt.all();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                count: listings.length,
                data: listings
            }));
            return;
        }

        // API Route 4: REN Performance
        if (pathname === '/api/v1/rens' && req.method === 'GET') {
            const stmt = dbEngine.db.prepare(`
                SELECT r.ren_id, r.name, r.email, r.phone, r.commission_rate, r.status,
                       COUNT(DISTINCT l.listing_id) as active_listings,
                       COUNT(DISTINCT d.deal_id) as closed_deals,
                       COALESCE(SUM(d.commission_earned), 0) as total_commission
                FROM ren_clients r
                LEFT JOIN property_listings l ON r.ren_id = l.ren_id
                LEFT JOIN commission_deals d ON r.ren_id = d.ren_id
                GROUP BY r.ren_id
                ORDER BY total_commission DESC
            `);
            const rens = stmt.all();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                count: rens.length,
                data: rens
            }));
            return;
        }

        // API Route 5: Buyer - Property Match (POST)
        if (pathname === '/api/v1/match' && req.method === 'POST') {
            let body;
            try {
                body = await getRequestBody(req);
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Invalid or malformed JSON payload'
                }));
                return;
            }

            let matches = [];
            let buyerInfo = null;

            if (body.buyerId) {
                const buyerStmt = dbEngine.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = ?`);
                buyerInfo = buyerStmt.get(body.buyerId) || null;
                matches = dbEngine.matchBuyerToListings(body.buyerId);
            } else if (body.max_budget || body.preferred_location || body.property_type) {
                buyerInfo = body;
                matches = dbEngine.matchBuyerCriteria({
                    max_budget: parseFloat(body.max_budget || 0),
                    preferred_location: body.preferred_location || '',
                    property_type: body.property_type || '',
                    min_bedrooms: parseInt(body.min_bedrooms || 1, 10)
                });
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Missing buyerId or criteria parameters (max_budget, preferred_location, property_type)'
                }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                buyer: buyerInfo,
                matches
            }));
            return;
        }

        // API Route 6: Viewing Schedule (GET)
        if (pathname === '/api/v1/viewings' && req.method === 'GET') {
            const stmt = dbEngine.db.prepare(`
                SELECT v.viewing_id, v.buyer_id, b.name as buyer_name, b.phone as buyer_phone,
                       v.listing_id, l.title as listing_title, l.location as listing_location,
                       v.viewing_date, v.feedback, v.rating, v.status
                FROM viewing_logs v
                LEFT JOIN buyer_prospects b ON v.buyer_id = b.buyer_id
                LEFT JOIN property_listings l ON v.listing_id = l.listing_id
                ORDER BY v.viewing_date ASC
            `);
            const viewings = stmt.all();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, count: viewings.length, data: viewings }));
            return;
        }

        // API Route 7: Commission Deals Ledger (GET)
        if (pathname === '/api/v1/deals' && req.method === 'GET') {
            const stmt = dbEngine.db.prepare(`
                SELECT d.deal_id, d.listing_id, l.title as listing_title,
                       d.buyer_id, b.name as buyer_name,
                       d.ren_id, r.name as ren_name,
                       d.deal_amount, d.commission_earned, d.deal_date, d.status
                FROM commission_deals d
                LEFT JOIN property_listings l ON d.listing_id = l.listing_id
                LEFT JOIN buyer_prospects b ON d.buyer_id = b.buyer_id
                LEFT JOIN ren_clients r ON d.ren_id = r.ren_id
                ORDER BY d.deal_date DESC
            `);
            const deals = stmt.all();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, count: deals.length, data: deals }));
            return;
        }

        // API 404 Handler: Return 404 JSON for unhandled /api/ endpoints
        if (pathname.startsWith('/api/')) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Endpoint not found'
            }));
            return;
        }

        // Serve Static Files
        let targetFileName = pathname === '/' ? 'client-dashboard.html' : pathname.replace(/^\//, '');
        let filePath = path.join(DASHBOARD_DIR, targetFileName);

        fs.readFile(filePath, (err, content) => {
            if (err) {
                // Fallback to client-dashboard.html for SPA route handling
                fs.readFile(path.join(DASHBOARD_DIR, 'client-dashboard.html'), (err2, fallbackContent) => {
                    if (err2) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(fallbackContent);
                    }
                });
            } else {
                const ext = path.extname(filePath);
                const contentType = MIME_TYPES[ext] || 'application/octet-stream';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });

    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
    }
});

if (require.main === module) {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`\n  ╔══════════════════════════════════════════════════════════╗`);
        console.log(`  ║  ZK Revenue Ops — Tailored Client Dashboard Server       ║`);
        console.log(`  ║  URL: http://localhost:${PORT}                            ║`);
        console.log(`  ║  Database: 05_Systems/Database/client_leads.db           ║`);
        console.log(`  ╚══════════════════════════════════════════════════════════╝\n`);
    });
}

module.exports = server;
