/**
 * ZK Revenue Ops — Local SQLite Database Engine & Matching Module
 * ID: SYS-003
 * Module: 05_Systems/Database/db_engine.js
 * 
 * Uses Node.js native node:sqlite DatabaseSync for zero-dependency execution.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_DIR = __dirname;
const DB_PATH = path.join(DB_DIR, 'client_leads.db');

class ZKDatabaseEngine {
    constructor(dbPath = DB_PATH) {
        if (!fs.existsSync(path.dirname(dbPath))) {
            fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        }
        this.dbPath = dbPath;
        this.db = new DatabaseSync(dbPath);
        this.initSchema();
    }

    initSchema() {
        // Enforce Foreign Keys on every initialization
        this.db.exec('PRAGMA foreign_keys = ON;');

        const schema = `
        CREATE TABLE IF NOT EXISTS ren_clients (
            ren_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            commission_rate REAL NOT NULL DEFAULT 0.03,
            status TEXT NOT NULL DEFAULT 'Active',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS buyer_prospects (
            buyer_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            preferred_location TEXT NOT NULL,
            max_budget REAL NOT NULL,
            property_type TEXT NOT NULL,
            min_bedrooms INTEGER NOT NULL DEFAULT 1,
            lead_score INTEGER NOT NULL DEFAULT 50,
            status TEXT NOT NULL DEFAULT 'New Inquiry',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS property_listings (
            listing_id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            property_type TEXT NOT NULL,
            price REAL NOT NULL,
            bedrooms INTEGER NOT NULL,
            bathrooms INTEGER NOT NULL,
            ren_id TEXT,
            status TEXT NOT NULL DEFAULT 'Available',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ren_id) REFERENCES ren_clients(ren_id) ON DELETE SET NULL ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS viewing_logs (
            viewing_id TEXT PRIMARY KEY,
            buyer_id TEXT NOT NULL,
            listing_id TEXT NOT NULL,
            viewing_date TEXT NOT NULL,
            feedback TEXT,
            rating INTEGER CHECK(rating IS NULL OR (rating >= 1 AND rating <= 5)),
            status TEXT NOT NULL DEFAULT 'Scheduled',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (buyer_id) REFERENCES buyer_prospects(buyer_id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (listing_id) REFERENCES property_listings(listing_id) ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS commission_deals (
            deal_id TEXT PRIMARY KEY,
            listing_id TEXT NOT NULL,
            buyer_id TEXT NOT NULL,
            ren_id TEXT NOT NULL,
            deal_amount REAL NOT NULL,
            commission_earned REAL NOT NULL,
            deal_date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (listing_id) REFERENCES property_listings(listing_id) ON DELETE RESTRICT ON UPDATE CASCADE,
            FOREIGN KEY (buyer_id) REFERENCES buyer_prospects(buyer_id) ON DELETE RESTRICT ON UPDATE CASCADE,
            FOREIGN KEY (ren_id) REFERENCES ren_clients(ren_id) ON DELETE RESTRICT ON UPDATE CASCADE
        );
        `;
        this.db.exec(schema);
    }

    seedData() {
        const renStmt = this.db.prepare(`
            INSERT OR IGNORE INTO ren_clients (ren_id, name, email, phone, commission_rate, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        renStmt.run('REN-001', 'Ahmad Razif', 'ahmad.razif@iqi.com.my', '+60121234567', 0.03, 'Active');
        renStmt.run('REN-002', 'Siti Nurhaliza', 'siti@renstar.my', '+60139876543', 0.03, 'Active');

        const buyerStmt = this.db.prepare(`
            INSERT OR IGNORE INTO buyer_prospects (buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms, lead_score, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        buyerStmt.run('BYR-001', 'Mohd Fikri bin Hassan', '+60123456789', 'fikri@gmail.com', 'Shah Alam', 500000, 'Condo', 2, 85, 'Viewing Scheduled');
        buyerStmt.run('BYR-002', 'Aina binti Kamal', '+60198765432', 'aina@yahoo.com', 'Bangi', 800000, 'Terrace', 3, 90, 'Negotiation');
        buyerStmt.run('BYR-003', 'Lee Wei Jie', '+60171234567', 'weijie@outlook.com', 'Cyberjaya', 1000000, 'Semi-D', 4, 95, 'Booking Placed');
        buyerStmt.run('BYR-004', 'Priya a/p Shankar', '+60141122334', 'priya@gmail.com', 'Puchong', 450000, 'Apartment', 3, 70, 'New Inquiry');
        buyerStmt.run('BYR-005', 'Azman bin Yusof', '+60169988776', 'azman@company.my', 'Damansara Heights', 3000000, 'Bungalow', 5, 88, 'Viewing Scheduled');

        const listingStmt = this.db.prepare(`
            INSERT OR IGNORE INTO property_listings (listing_id, title, location, property_type, price, bedrooms, bathrooms, ren_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        listingStmt.run('LST-001', 'Suria Jelutong Studio Condo', 'Bukit Jelutong, Shah Alam', 'Condo', 380000, 2, 2, 'REN-001', 'Available');
        listingStmt.run('LST-002', 'Skyfield 2-Storey Terrace', 'Bangi, Selangor', 'Terrace', 680000, 4, 3, 'REN-002', 'Available');
        listingStmt.run('LST-003', 'Cyber Towers Luxury Suite', 'Cyberjaya', 'Semi-D', 850000, 4, 4, 'REN-001', 'Available');
        listingStmt.run('LST-004', 'Botanica Hilltop Bungalow', 'Damansara Heights', 'Bungalow', 2400000, 6, 6, 'REN-001', 'Available');
        listingStmt.run('LST-005', 'Puchong Heights Subsale Apt', 'Puchong, Selangor', 'Apartment', 320000, 3, 2, 'REN-002', 'Available');

        const viewingStmt = this.db.prepare(`
            INSERT OR IGNORE INTO viewing_logs (viewing_id, buyer_id, listing_id, viewing_date, feedback, rating, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        viewingStmt.run('VW-001', 'BYR-001', 'LST-001', '2026-07-30 14:00:00', 'Buyer loved the unit location, checking bank loan DSR.', 4, 'Completed');
        viewingStmt.run('VW-002', 'BYR-002', 'LST-002', '2026-07-31 11:00:00', 'Negotiating target price down to RM650k.', 5, 'Completed');
        viewingStmt.run('VW-003', 'BYR-005', 'LST-004', '2026-08-01 15:30:00', 'Scheduled viewing with family.', null, 'Scheduled');

        const dealStmt = this.db.prepare(`
            INSERT OR IGNORE INTO commission_deals (deal_id, listing_id, buyer_id, ren_id, deal_amount, commission_earned, deal_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        dealStmt.run('DEAL-001', 'LST-003', 'BYR-003', 'REN-001', 850000, 25500, '2026-07-28', 'Closed Won');
        dealStmt.run('DEAL-002', 'LST-002', 'BYR-002', 'REN-002', 680000, 20400, '2026-07-29', 'Pending');
    }

    calculateLeadScore(buyer) {
        let score = 50; // Base score
        if (buyer.max_budget > 0) score += 15;
        if (buyer.phone && buyer.phone.length >= 10) score += 10;
        if (buyer.email) score += 5;
        if (buyer.preferred_location) score += 10;
        if (buyer.status === 'Viewing Scheduled') score += 10;
        if (buyer.status === 'Negotiation' || buyer.status === 'Booking Placed') score += 15;
        return Math.min(score, 100);
    }

    matchBuyerCriteria(criteria) {
        const stmt = this.db.prepare(`SELECT * FROM property_listings WHERE status = 'Available'`);
        const listings = stmt.all();

        const matches = listings.map(lst => {
            let score = 0;
            let reasons = [];

            // Budget Match (40% Weight)
            if (lst.price <= criteria.max_budget) {
                score += 40;
                reasons.push(`Price RM${lst.price.toLocaleString()} is within budget RM${criteria.max_budget.toLocaleString()}`);
            } else if (lst.price <= criteria.max_budget * 1.1) {
                score += 20;
                reasons.push(`Price RM${lst.price.toLocaleString()} is slightly above budget (+10%)`);
            }

            // Location Match (30% Weight)
            const buyerLoc = (criteria.preferred_location || '').trim().toLowerCase();
            const lstLoc = (lst.location || '').trim().toLowerCase();
            if (buyerLoc.length > 0 && (lstLoc.includes(buyerLoc) || buyerLoc.includes(lstLoc))) {
                score += 30;
                reasons.push(`Location match (${lst.location})`);
            }

            // Property Type Match (20% Weight)
            if ((lst.property_type || '').toLowerCase() === (criteria.property_type || '').toLowerCase()) {
                score += 20;
                reasons.push(`Exact property type match (${lst.property_type})`);
            }

            // Bedrooms Requirement Match (10% Weight)
            if (lst.bedrooms >= (criteria.min_bedrooms || 1)) {
                score += 10;
                reasons.push(`Bedrooms count (${lst.bedrooms}) meets minimum (${criteria.min_bedrooms || 1})`);
            }

            return {
                listing: lst,
                matchScore: score,
                reasons
            };
        });

        return matches.sort((a, b) => b.matchScore - a.matchScore);
    }

    matchBuyerToListings(buyerId) {
        const stmt = this.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = ?`);
        const buyer = stmt.get(buyerId);
        if (!buyer) return [];

        return this.matchBuyerCriteria({
            max_budget: buyer.max_budget,
            preferred_location: buyer.preferred_location,
            property_type: buyer.property_type,
            min_bedrooms: buyer.min_bedrooms
        });
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = { ZKDatabaseEngine, DB_PATH };
