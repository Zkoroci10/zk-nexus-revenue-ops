/**
 * ZK Revenue Ops — Local SQLite Database Engine & Matching Module
 * ID: SYS-003
 * Module: 05_Systems/Database/db_engine.js
 * 
 * Uses Node.js native node:sqlite DatabaseSync for zero-dependency execution.
 * Enhanced for ZK-DB-ENGINE Milestone 2 with DSR loan qualification engine,
 * multi-agent lead allocation, B-tree indexing, and 100k bulk ingestion.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_DIR = __dirname;
const DB_PATH = path.join(DB_DIR, 'client_leads.db');

const ALLOWED_ORDER_BY = new Set([
    'lead_score DESC',
    'lead_score ASC',
    'created_at ASC',
    'created_at DESC',
    'max_budget DESC',
    'max_budget ASC',
    'dsr_percent ASC',
    'dsr_percent DESC',
    'net_income DESC',
    'net_income ASC',
    'name ASC',
    'name DESC'
]);

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
            tier TEXT NOT NULL DEFAULT 'Growth',
            active_leads_count INTEGER NOT NULL DEFAULT 0,
            last_allocated_at TEXT,
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
            gross_income REAL DEFAULT 0,
            net_income REAL DEFAULT 0,
            existing_commitments REAL DEFAULT 0,
            est_installment REAL DEFAULT 0,
            dsr_percent REAL DEFAULT 0,
            grade TEXT DEFAULT 'C',
            allocated_ren_id TEXT,
            allocated_at TEXT,
            allocation_strategy TEXT,
            sla_deadline TEXT,
            sla_status TEXT DEFAULT 'UNASSIGNED',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (allocated_ren_id) REFERENCES ren_clients(ren_id) ON DELETE SET NULL ON UPDATE CASCADE
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

        // Migration support: Add columns if table existed prior to schema expansion
        const renCols = this.db.prepare(`PRAGMA table_info(ren_clients)`).all().map(c => c.name);
        if (!renCols.includes('tier')) this.db.exec("ALTER TABLE ren_clients ADD COLUMN tier TEXT NOT NULL DEFAULT 'Growth';");
        if (!renCols.includes('active_leads_count')) this.db.exec("ALTER TABLE ren_clients ADD COLUMN active_leads_count INTEGER NOT NULL DEFAULT 0;");
        if (!renCols.includes('last_allocated_at')) this.db.exec("ALTER TABLE ren_clients ADD COLUMN last_allocated_at TEXT;");

        const buyerCols = this.db.prepare(`PRAGMA table_info(buyer_prospects)`).all().map(c => c.name);
        if (!buyerCols.includes('gross_income')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN gross_income REAL DEFAULT 0;");
        if (!buyerCols.includes('net_income')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN net_income REAL DEFAULT 0;");
        if (!buyerCols.includes('existing_commitments')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN existing_commitments REAL DEFAULT 0;");
        if (!buyerCols.includes('est_installment')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN est_installment REAL DEFAULT 0;");
        if (!buyerCols.includes('dsr_percent')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN dsr_percent REAL DEFAULT 0;");
        if (!buyerCols.includes('grade')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN grade TEXT DEFAULT 'C';");
        if (!buyerCols.includes('allocated_ren_id')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN allocated_ren_id TEXT;");
        if (!buyerCols.includes('allocated_at')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN allocated_at TEXT;");
        if (!buyerCols.includes('allocation_strategy')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN allocation_strategy TEXT;");
        if (!buyerCols.includes('sla_deadline')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN sla_deadline TEXT;");
        if (!buyerCols.includes('sla_status')) this.db.exec("ALTER TABLE buyer_prospects ADD COLUMN sla_status TEXT DEFAULT 'UNASSIGNED';");

        // Create secondary B-Tree indexes for fast filtered query evaluation
        const indexes = `
        CREATE INDEX IF NOT EXISTS idx_buyer_dsr_grade ON buyer_prospects(grade, dsr_percent);
        CREATE INDEX IF NOT EXISTS idx_buyer_status_score ON buyer_prospects(status, lead_score DESC);
        CREATE INDEX IF NOT EXISTS idx_buyer_location_budget ON buyer_prospects(preferred_location, max_budget);
        CREATE INDEX IF NOT EXISTS idx_buyer_ren_allocation ON buyer_prospects(allocated_ren_id, status);
        CREATE INDEX IF NOT EXISTS idx_buyer_sla ON buyer_prospects(sla_status, sla_deadline);
        `;
        this.db.exec(indexes);
    }

    seedData() {
        const renStmt = this.db.prepare(`
            INSERT OR IGNORE INTO ren_clients (ren_id, name, email, phone, commission_rate, status, tier, active_leads_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        renStmt.run('REN-001', 'Ahmad Razif', 'ahmad.razif@iqi.com.my', '+60121234567', 0.03, 'Active', 'Enterprise', 0);
        renStmt.run('REN-002', 'Siti Nurhaliza', 'siti@renstar.my', '+60139876543', 0.03, 'Active', 'Growth', 0);
        renStmt.run('REN-003', 'Tan Wei Ming', 'weiming.tan@iqi.com.my', '+60163334455', 0.03, 'Active', 'Starter', 0);
        renStmt.run('REN-004', 'Kavitha Raman', 'kavitha@renstar.my', '+60178889900', 0.03, 'Active', 'Enterprise', 0);

        const buyerStmt = this.db.prepare(`
            INSERT OR IGNORE INTO buyer_prospects (
                buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms,
                lead_score, status, gross_income, net_income, existing_commitments, est_installment, dsr_percent, grade
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const seedBuyers = [
            { id: 'BYR-001', name: 'Mohd Fikri bin Hassan', phone: '+60123456789', email: 'fikri@gmail.com', loc: 'Shah Alam', budget: 500000, type: 'Condo', beds: 2, score: 85, status: 'Viewing Scheduled', gross: 10000, net: 8000, commitments: 1500 },
            { id: 'BYR-002', name: 'Aina binti Kamal', phone: '+60198765432', email: 'aina@yahoo.com', loc: 'Bangi', budget: 800000, type: 'Terrace', beds: 3, score: 90, status: 'Negotiation', gross: 18000, net: 15000, commitments: 3000 },
            { id: 'BYR-003', name: 'Lee Wei Jie', phone: '+60171234567', email: 'weijie@outlook.com', loc: 'Cyberjaya', budget: 1000000, type: 'Semi-D', beds: 4, score: 95, status: 'Booking Placed', gross: 25000, net: 20000, commitments: 4000 },
            { id: 'BYR-004', name: 'Priya a/p Shankar', phone: '+60141122334', email: 'priya@gmail.com', loc: 'Puchong', budget: 450000, type: 'Apartment', beds: 3, score: 70, status: 'New Inquiry', gross: 6000, net: 5000, commitments: 3500 },
            { id: 'BYR-005', name: 'Azman bin Yusof', phone: '+60169988776', email: 'azman@company.my', loc: 'Damansara Heights', budget: 3000000, type: 'Bungalow', beds: 5, score: 88, status: 'Viewing Scheduled', gross: 40000, net: 32000, commitments: 5000 }
        ];

        for (const b of seedBuyers) {
            const dsrRes = this.calculateDSR({
                maxBudget: b.budget,
                netIncome: b.net,
                existingCommitments: b.commitments,
                grossIncome: b.gross,
                score: b.score
            });

            buyerStmt.run(
                b.id, b.name, b.phone, b.email, b.loc, b.budget, b.type, b.beds,
                dsrRes.lead_score, dsrRes.status, b.gross, b.net, b.commitments,
                dsrRes.est_installment, dsrRes.dsr_percent, dsrRes.grade
            );
        }

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
        if (buyer.status === 'Viewing Scheduled' || buyer.status === 'Qualified (Hot)') score += 10;
        if (buyer.status === 'Negotiation' || buyer.status === 'Booking Placed') score += 15;
        if (buyer.dsr_percent !== undefined && buyer.dsr_percent > 0) {
            if (buyer.dsr_percent <= 65) score += 15;
            else if (buyer.dsr_percent <= 75) score += 5;
            else score -= 20;
        }
        return Math.min(Math.max(score, 0), 100);
    }

    /**
     * Phase 2: Automated DSR Loan Qualification Engine
     * Formula:
     *   Est. Installment = Math.round(maxBudget * 0.0048)
     *   DSR (%) = Math.round(((existingCommitments + Est. Installment) / netIncome) * 100)
     * Rules:
     *   - Grade A (Pass): DSR <= 65% -> Status = 'Qualified (Hot)', Score >= 70
     *   - Grade B (Borderline): 66% <= DSR <= 75% -> Status = 'Nurturing (Warm)', Score 45-69
     *   - Grade C (Unqualified): DSR > 75% -> Status = 'DSR Failed (Unqualified)', Score < 45
     */
    calculateDSR(leadData) {
        if (!leadData) {
            throw new Error('leadData parameter is required');
        }
        const startTime = performance.now();

        const maxBudget = Math.max(0, Number(leadData.max_budget ?? leadData.maxBudget ?? 0) || 0);
        const netIncome = Number(leadData.net_income ?? leadData.netIncome ?? 0) || 0;
        const rawCommitments = Number(leadData.existing_commitments ?? leadData.existingCommitments ?? 0);
        const existingCommitments = Math.max(0, Number.isNaN(rawCommitments) ? 0 : rawCommitments);
        const grossIncome = Number(leadData.gross_income ?? leadData.grossIncome ?? (netIncome > 0 ? Math.round(netIncome * 1.25) : 0)) || 0;

        const estInstallment = Math.round(maxBudget * 0.0048);
        
        let dsrPercent = 100;
        if (netIncome > 0) {
            dsrPercent = Math.round(((existingCommitments + estInstallment) / netIncome) * 100);
        }

        let grade = 'C';
        let status = 'DSR Failed (Unqualified)';
        let score = leadData.lead_score ?? leadData.score ?? 30;

        if (rawCommitments < 0) {
            grade = 'C';
            status = 'DSR Failed (Unqualified)';
            score = 30;
        } else if (dsrPercent <= 65) {
            grade = 'A';
            status = 'Qualified (Hot)';
            if (score < 70) score = 75;
        } else if (dsrPercent <= 75) {
            grade = 'B';
            status = 'Nurturing (Warm)';
            if (score < 45 || score > 69) score = 55;
        } else {
            grade = 'C';
            status = 'DSR Failed (Unqualified)';
            if (score >= 45) score = 30;
        }

        const durationMs = performance.now() - startTime;

        return {
            gross_income: grossIncome,
            net_income: netIncome,
            existing_commitments: existingCommitments,
            est_installment: estInstallment,
            dsr_percent: dsrPercent,
            dsrPercent,
            grade,
            status,
            lead_score: score,
            score,
            calculation_time_ms: durationMs
        };
    }

    /**
     * Phase 3: Multi-Agent Lead Allocation Engine
     * Allocates buyer prospect to active REN client based on lead qualification tier.
     *   - Tier 3 Enterprise SLA Priority Routing: Grade A / budget >= 1M / score >= 80 -> Enterprise RENs with 5m SLA.
     *   - Tier 2 Team Dynamic Round-Robin Routing: Standard leads -> Growth/Starter RENs with lowest active_leads_count.
     */
    allocateLead(buyerId) {
        this.db.exec('BEGIN IMMEDIATE;');
        try {
            const buyer = this.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = ?`).get(buyerId);
            if (!buyer) {
                throw new Error(`Buyer record not found for allocation: ${buyerId}`);
            }

            const maxBudget = buyer.max_budget ?? 0;
            const score = buyer.lead_score ?? 0;
            const isEnterpriseLead = buyer.grade === 'A' || maxBudget >= 1000000 || score >= 80;

            let selectedRen = null;
            let strategy = '';
            let slaDeadline = null;
            let slaStatus = 'N/A';

            if (isEnterpriseLead) {
                const enterpriseRens = this.db.prepare(`
                    SELECT * FROM ren_clients 
                    WHERE status = 'Active' AND tier = 'Enterprise' 
                    ORDER BY active_leads_count ASC, last_allocated_at ASC
                `).all();

                if (enterpriseRens.length > 0) {
                    selectedRen = enterpriseRens[0];
                    strategy = 'SLA_ENTERPRISE_PRIORITY';
                    slaStatus = 'PENDING';
                    const now = new Date();
                    const deadline = new Date(now.getTime() + 5 * 60 * 1000);
                    slaDeadline = deadline.toISOString().replace('T', ' ').substring(0, 19);
                }
            }

            if (!selectedRen) {
                const standardRens = this.db.prepare(`
                    SELECT * FROM ren_clients 
                    WHERE status = 'Active' AND tier IN ('Starter', 'Growth') 
                    ORDER BY active_leads_count ASC, last_allocated_at ASC
                `).all();

                if (standardRens.length > 0) {
                    selectedRen = standardRens[0];
                } else {
                    const anyRen = this.db.prepare(`
                        SELECT * FROM ren_clients 
                        WHERE status = 'Active' 
                        ORDER BY active_leads_count ASC, last_allocated_at ASC
                    `).all();
                    if (anyRen.length > 0) {
                        selectedRen = anyRen[0];
                    }
                }

                if (selectedRen) {
                    strategy = 'DYNAMIC_ROUND_ROBIN';
                    slaStatus = 'N/A';
                    slaDeadline = null;
                }
            }

            if (!selectedRen) {
                throw new Error('No active REN available for allocation');
            }

            const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

            // Update target REN active count and allocation timestamp
            this.db.prepare(`
                UPDATE ren_clients 
                SET active_leads_count = active_leads_count + 1,
                    last_allocated_at = ?,
                    updated_at = ?
                WHERE ren_id = ?
            `).run(nowStr, nowStr, selectedRen.ren_id);

            // If buyer was allocated to a different REN previously, decrement that REN's count
            if (buyer.allocated_ren_id && buyer.allocated_ren_id !== selectedRen.ren_id) {
                this.db.prepare(`
                    UPDATE ren_clients 
                    SET active_leads_count = MAX(0, active_leads_count - 1),
                        updated_at = ?
                    WHERE ren_id = ?
                `).run(nowStr, buyer.allocated_ren_id);
            }

            // Update Buyer Prospect allocation state
            this.db.prepare(`
                UPDATE buyer_prospects 
                SET allocated_ren_id = ?,
                    allocated_at = ?,
                    allocation_strategy = ?,
                    sla_deadline = ?,
                    sla_status = ?,
                    updated_at = ?
                WHERE buyer_id = ?
            `).run(selectedRen.ren_id, nowStr, strategy, slaDeadline, slaStatus, nowStr, buyerId);

            this.db.exec('COMMIT;');

            return {
                buyer_id: buyerId,
                allocated_ren_id: selectedRen.ren_id,
                ren_name: selectedRen.name,
                ren_tier: selectedRen.tier,
                allocation_strategy: strategy,
                sla_deadline: slaDeadline,
                sla_status: slaStatus,
                allocated_at: nowStr
            };
        } catch (err) {
            try {
                this.db.exec('ROLLBACK;');
            } catch (rbErr) {}
            throw err;
        }
    }

    /**
     * Handles SLA deadline breaches by reallocating unacknowledged hot leads to next available Enterprise REN.
     */
    checkSLAEscalations() {
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const breachedLeads = this.db.prepare(`
            SELECT * FROM buyer_prospects 
            WHERE sla_status IN ('PENDING', 'BREACHED_REALLOCATED') AND sla_deadline IS NOT NULL AND sla_deadline < ?
        `).all(nowStr);

        const escalations = [];

        for (const lead of breachedLeads) {
            const altRens = this.db.prepare(`
                SELECT * FROM ren_clients 
                WHERE status = 'Active' AND tier = 'Enterprise' AND ren_id != ?
                ORDER BY active_leads_count ASC, last_allocated_at ASC
            `).all(lead.allocated_ren_id || '');

            let targetRen = altRens.length > 0 ? altRens[0] : null;
            if (!targetRen) {
                const fallbackRens = this.db.prepare(`
                    SELECT * FROM ren_clients 
                    WHERE status = 'Active' AND ren_id != ?
                    ORDER BY active_leads_count ASC, last_allocated_at ASC
                `).all(lead.allocated_ren_id || '');
                targetRen = fallbackRens.length > 0 ? fallbackRens[0] : null;
            }

            if (targetRen) {
                if (lead.allocated_ren_id) {
                    this.db.prepare(`
                        UPDATE ren_clients 
                        SET active_leads_count = MAX(0, active_leads_count - 1),
                            updated_at = ?
                        WHERE ren_id = ?
                    `).run(nowStr, lead.allocated_ren_id);
                }

                this.db.prepare(`
                    UPDATE ren_clients 
                    SET active_leads_count = active_leads_count + 1,
                        last_allocated_at = ?,
                        updated_at = ?
                    WHERE ren_id = ?
                `).run(nowStr, nowStr, targetRen.ren_id);

                const newDeadline = new Date(Date.now() + 5 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);

                this.db.prepare(`
                    UPDATE buyer_prospects 
                    SET allocated_ren_id = ?,
                        allocated_at = ?,
                        sla_deadline = ?,
                        sla_status = 'BREACHED_REALLOCATED',
                        updated_at = ?
                    WHERE buyer_id = ?
                `).run(targetRen.ren_id, nowStr, newDeadline, nowStr, lead.buyer_id);

                escalations.push({
                    buyer_id: lead.buyer_id,
                    previous_ren_id: lead.allocated_ren_id,
                    new_ren_id: targetRen.ren_id,
                    new_ren_name: targetRen.name,
                    sla_status: 'BREACHED_REALLOCATED',
                    new_sla_deadline: newDeadline
                });
            }
        }

        return escalations;
    }

    /**
     * Phase 4: High-Volume 100k Bulk Ingestion Integration
     * Generates 100,000 synthetic enterprise leads and seeds into SQLite using a transaction.
     * Target insertion speed: 100,000 records loaded in < 3.0 seconds.
     */
    seed100kLeads() {
        const startTime = performance.now();
        const crmEnginePath = path.join(__dirname, '../Databases/zk_crm_engine.js');
        const { generate100kLeads } = require(crmEnginePath);

        const leads = generate100kLeads();
        const generateTimeMs = performance.now() - startTime;

        const insertStartTime = performance.now();

        // Configure ultra-fast bulk PRAGMAs
        this.db.exec(`
            PRAGMA journal_mode = WAL;
            PRAGMA synchronous = OFF;
            PRAGMA temp_store = MEMORY;
            PRAGMA cache_size = -64000;
        `);

        const rebuildIndexes = `
        CREATE INDEX IF NOT EXISTS idx_buyer_dsr_grade ON buyer_prospects(grade, dsr_percent);
        CREATE INDEX IF NOT EXISTS idx_buyer_status_score ON buyer_prospects(status, lead_score DESC);
        CREATE INDEX IF NOT EXISTS idx_buyer_location_budget ON buyer_prospects(preferred_location, max_budget);
        CREATE INDEX IF NOT EXISTS idx_buyer_ren_allocation ON buyer_prospects(allocated_ren_id, status);
        CREATE INDEX IF NOT EXISTS idx_buyer_sla ON buyer_prospects(sla_status, sla_deadline);
        `;

        try {
            // Temporarily drop indexes for bulk insert speedup
            this.db.exec(`
                DROP INDEX IF EXISTS idx_buyer_dsr_grade;
                DROP INDEX IF EXISTS idx_buyer_status_score;
                DROP INDEX IF EXISTS idx_buyer_location_budget;
                DROP INDEX IF EXISTS idx_buyer_ren_allocation;
                DROP INDEX IF EXISTS idx_buyer_sla;
            `);

            this.db.exec('BEGIN TRANSACTION;');

            const stmt = this.db.prepare(`
                INSERT INTO buyer_prospects (
                    buyer_id, name, phone, email, preferred_location, max_budget,
                    property_type, min_bedrooms, lead_score, status, gross_income,
                    net_income, existing_commitments, est_installment, dsr_percent,
                    grade, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            for (let i = 0; i < leads.length; i++) {
                const l = leads[i];
                const estInstallment = Math.round(l.maxBudget * 0.0048);
                const grossIncome = Math.round(l.netIncome * 1.25);
                const createdAt = l.createdAt || new Date().toISOString();

                stmt.run(
                    l.id,
                    l.name,
                    l.phone,
                    l.email,
                    l.location,
                    l.maxBudget,
                    l.propertyType,
                    2,
                    l.score,
                    l.status,
                    grossIncome,
                    l.netIncome,
                    l.existingCommitments,
                    estInstallment,
                    l.dsrPercent,
                    l.grade,
                    createdAt,
                    createdAt
                );
            }

            this.db.exec('COMMIT;');
        } catch (err) {
            try {
                this.db.exec('ROLLBACK;');
            } catch (rbErr) {}
            throw err;
        } finally {
            // Re-create secondary B-Tree indexes post-bulk insertion
            this.db.exec(rebuildIndexes);
        }

        const insertTimeMs = performance.now() - insertStartTime;
        const totalTimeMs = performance.now() - startTime;

        return {
            recordsInserted: leads.length,
            generateTimeMs,
            insertTimeMs,
            totalTimeMs
        };
    }

    /**
     * Indexed Query Evaluation Helper for Buyer Prospects
     */
    queryBuyers(filters = {}) {
        let sql = `SELECT * FROM buyer_prospects WHERE 1=1`;
        const params = [];

        if (filters.grade) {
            sql += ` AND grade = ?`;
            params.push(filters.grade);
        }
        if (filters.dsr_max !== undefined) {
            sql += ` AND dsr_percent <= ?`;
            params.push(filters.dsr_max);
        }
        if (filters.status) {
            sql += ` AND status = ?`;
            params.push(filters.status);
        }
        if (filters.min_score !== undefined) {
            sql += ` AND lead_score >= ?`;
            params.push(filters.min_score);
        }
        if (filters.preferred_location) {
            sql += ` AND preferred_location = ?`;
            params.push(filters.preferred_location);
        }
        if (filters.max_budget !== undefined) {
            sql += ` AND max_budget <= ?`;
            params.push(filters.max_budget);
        }
        if (filters.allocated_ren_id) {
            sql += ` AND allocated_ren_id = ?`;
            params.push(filters.allocated_ren_id);
        }
        if (filters.sla_status) {
            sql += ` AND sla_status = ?`;
            params.push(filters.sla_status);
        }

        if (filters.orderBy) {
            const orderByStr = String(filters.orderBy).trim();
            if (ALLOWED_ORDER_BY.has(orderByStr)) {
                sql += ` ORDER BY ${orderByStr}`;
            } else {
                throw new Error(`Invalid or unauthorized orderBy clause: ${filters.orderBy}`);
            }
        }
        if (filters.limit) {
            sql += ` LIMIT ${Number(filters.limit)}`;
        }

        const stmt = this.db.prepare(sql);
        return stmt.all(...params);
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
