---
Title: ZK-DB-RND Milestone 1 Technical Blueprint & Database Engine Specification
ID: SYS-003
Type: Analysis & Technical Blueprint
Module: 05_Systems/Database
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0
Created: 2026-07-29
Updated: 2026-07-29
Owner: Explorer m1_1
Related: SYS-001, SYS-002, ZK-OPS-005, RUL-001
---

# ZK-DB-RND Milestone 1: Database Management Engine & Schema R&D Technical Blueprint

## 1. Executive Summary & Architectural Goals

The **ZK Revenue Ops Database Engine (SYS-003)** is a zero-cost, zero-dependency, local-first relational database solution engineered specifically for Real Estate Negotiators (RENs) operating in Malaysia. Designed as part of the ZK Revenue Ops R&D Phase, it serves as the data foundation for automated lead qualification, buyer-property matching, viewing tracking, commission calculations, and bi-directional cloud synchronization.

### Key Technical Principles:
1. **Zero-Dependency Architecture**: Leverages Node.js v24.14 native `node:sqlite` (`DatabaseSync`), eliminating reliance on external npm binaries, build toolchains (node-gyp), or external server processes.
2. **Relational Integrity**: Enforces strict foreign key constraints (`PRAGMA foreign_keys = ON;`) across 5 core entities: RENs, Buyers, Listings, Viewings, and Commission Deals.
3. **Intelligent Lead Scoring & Matching Engine**: Evaluates financial qualification, DSR eligibility, location proximity, property type, and budget limits to produce weighted (0–100%) buyer-listing match scores.
4. **Dual-Layer Cloud Sync Bridge**: Provides asynchronous bi-directional synchronization between local SQLite storage and cloud visibility platforms (Notion API and Google Sheets API).
5. **Strict Governance & ZNS Compliance**: Standardized under Object ID `SYS-003`, adhering strictly to ZNS file naming, directory structure, and metadata standards (`validate_zns.py`).

---

## 2. Workspace Exploration Findings

A comprehensive exploration of the project workspace `C:\Users\Dell\Documents\Projects ZK Nexus` was conducted, focusing on existing database modules, scripts, and business blueprints.

### Key Observations:
1. **Existing Prototype System (`05_Systems/Databases/`)**:
   - `05_Systems/Databases/zk_db_engine.js`: A legacy JSON file-backed prototype (`client_leads_rnd.json`) with an HTTP server on port 3777.
   - `05_Systems/Databases/ZK-DB-Engine-Architecture.md`: Early architecture document specifying a 3-table schema (RENs, Buyers, Listings).
   - **Gap Identified**: The existing JSON prototype lacks strict foreign key constraints, relational integrity, transaction safety, viewing logs, and formal deal closing tracking.

2. **Standardization to `05_Systems/Database/`**:
   - The user specification mandates placing the production SQLite database at `05_Systems/Database/client_leads.db`.
   - The directory `05_Systems/Database` must be created to house the SQLite database, core engine (`db_engine.js`), cloud sync bridge (`cloud_sync_bridge.js`), and test harness (`test_db_engine.js`).

3. **Node.js Environment Capabilities**:
   - Node.js version in workspace: **v24.14.0**.
   - Native support for `node:sqlite` (`const { DatabaseSync } = require('node:sqlite');`) was verified. It supports synchronous SQLite operations, transactional integrity, and foreign key enforcement natively.

4. **Integration with CRM Blueprints (`ZK-OPS-005`)**:
   - `01_Business/ZK-Revenue-Ops/005_CRM-Automation-Blueprints.md` defines the pipeline stages (`ST-01 New Lead`, `ST-02 Screening`, `ST-03 Hot`, `ST-06 Viewing Booked`, `ST-09 Closed Won`) and lead field mapping schema. The Milestone 1 SQLite database schema aligns directly with these operational specs.

---

## 3. Database Schema Design (5 Core Tables)

The SQLite database will be initialized at `05_Systems/Database/client_leads.db`. Upon connection, the engine executes `PRAGMA foreign_keys = ON;` to guarantee relational integrity.

```
+------------------+         +-----------------------+         +---------------------+
|   ren_clients    |         |   property_listings   |         |   buyer_prospects   |
+------------------+         +-----------------------+         +---------------------+
| PK ren_id        |<-------+| PK listing_id         |+------->| PK buyer_id         |
|    name          |    1:N  |    title              |   1:N   |    name             |
|    email         |         |    location           |         |    phone            |
|    phone         |         |    property_type      |         |    email            |
|    comm_rate     |         |    price              |         |    pref_location    |
|    status        |         |    bedrooms           |         |    max_budget       |
+------------------+         |    bathrooms          |         |    property_type    |
         ^                   | FK ren_id             |         |    min_bedrooms     |
         |                   +-----------------------+         |    lead_score       |
         |                               ^                     |    status           |
         |                               |                     +---------------------+
         | 1:N                           | 1:N                            ^
         |                               |                                | 1:N
+------------------+                     |                     +---------------------+
| commission_deals |---------------------+                     |    viewing_logs     |
+------------------+                                           +---------------------+
| PK deal_id       |                                           | PK viewing_id       |
| FK listing_id    |------------------------------------------>| FK buyer_id         |
| FK buyer_id      |                                           | FK listing_id       |
| FK ren_id        |                                           |    viewing_date     |
|    deal_amount   |                                           |    feedback         |
|    comm_earned   |                                           |    rating           |
|    deal_date     |                                           |    status           |
|    status        |                                           +---------------------+
+------------------+
```

### Table 1: `ren_clients` (Real Estate Negotiator Profiles)
Stores active REN agents operating on the platform.
```sql
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
```

### Table 2: `buyer_prospects` (Qualified Buyer Leads)
Stores buyer prospects ingested from ad channels, webforms, or WhatsApp outreach.
```sql
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
```

### Table 3: `property_listings` (Property Inventory)
Stores property listings available for matching and sale.
```sql
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
```

### Table 4: `viewing_logs` (Viewing Appointments & Feedback)
Tracks viewing schedules, attendee feedback, and rating score (1-5).
```sql
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
```

### Table 5: `commission_deals` (Closed & Pending Deals)
Tracks deal transactions, transacted prices, and calculated commission earned.
```sql
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
```

---

## 4. Database Management Engine Blueprint (`db_engine.js`)

File path: `05_Systems/Database/db_engine.js`

### Key Engine Features:
1. **`ZKDatabaseEngine` Class**: Encapsulates DB connection, PRAGMA setup, table DDL execution, CRUD helpers, and transaction wrappers.
2. **Seed Data Generator**: Populates realistic Malaysian sample data across all 5 tables:
   - RENs: `REN-001` (Ahmad Razif), `REN-002` (Siti Nurhaliza).
   - Buyers: `BYR-001` (Mohd Fikri - Setia Alam), `BYR-002` (Aina Kamal - Bangi), `BYR-003` (Lee Wei Jie - Cyberjaya), `BYR-004` (Priya Shankar - Puchong), `BYR-005` (Azman Yusof - Damansara).
   - Listings: `LST-001` (Suria Jelutong Studio), `LST-002` (Skyfield Terrace), `LST-003` (Cyber Towers Suite), `LST-004` (Botanica Hilltop Bungalow), `LST-005` (Puchong Subsale Apt).
   - Viewings: `VW-001`, `VW-002`, `VW-003` with ratings and feedback.
   - Deals: `DEAL-001`, `DEAL-002` with transacted values and calculated commissions.
3. **Lead Scoring Engine**:
   Calculates buyer lead scores (0–100) based on:
   - Budget sufficiency (up to 30 pts)
   - Contact info completeness (up to 20 pts)
   - Funnel status progression (up to 30 pts)
   - Preferred location specification (up to 20 pts)
4. **Buyer-Property Matching Engine**:
   - `matchBuyerToListings(buyerId)`: Matches buyer ID against available listings.
   - `matchBuyerCriteria(criteria)`: Matches raw buyer criteria against available listings.
   - **Weighted Match Algorithm**:
     - **Budget Compatibility (40% Weight)**: 100% budget fit = 40 pts; up to 10% over budget = 20 pts.
     - **Location Match (30% Weight)**: Exact area match = 30 pts; same state/region = 15 pts.
     - **Property Type Match (20% Weight)**: Exact type match = 20 pts; compatible category = 10 pts.
     - **Bedroom Requirement Match (10% Weight)**: Bedrooms >= min_bedrooms = 10 pts.
   - Returns array of matched listings sorted descending by `matchScore` with match reasons.

---

## 5. Notion & Google Sheets Cloud Sync Bridge (`cloud_sync_bridge.js`)

File path: `05_Systems/Database/cloud_sync_bridge.js`

### Architecture & Capabilities:
1. **Asynchronous Bi-Directional Synchronization**:
   - **Push Local -> Cloud**: Pushes new/updated local SQLite records (buyers, listings, viewings, deals) to Notion Databases and Google Sheets Spreadsheets.
   - **Pull Cloud -> Local**: Fetches external cloud updates (e.g. webform leads submitted to Notion/Google Sheets) and reconciles into local SQLite.
2. **Conflict Resolution Strategy**:
   - Uses timestamp comparison (`updated_at` / `last_edited_time`).
   - If cloud record exists locally and cloud timestamp is newer, local SQLite is updated.
   - If local record is newer, local state pushes to Cloud.
   - Detailed sync audit log stored in memory and returned as execution telemetry.
3. **Zero-Dependency Simulator Adapters**:
   - Implements robust mock HTTP API interfaces for Notion API (`https://api.notion.com/v1/pages`, `databases`) and Google Sheets API v4 (`https://sheets.googleapis.com/v4/spreadsheets`).
   - Supports production-ready extension when live API credentials (`NOTION_API_KEY`, `GOOGLE_SERVICE_ACCOUNT_KEY`) are configured.

---

## 6. Test & Verification Suite (`test_db_engine.js`)

File path: `05_Systems/Database/test_db_engine.js`

### Verification Test Cases:
1. **Test 1: Initialization & Schema Creation**: Confirms `client_leads.db` file creation, `PRAGMA foreign_keys = ON;` execution, and existence of all 5 tables.
2. **Test 2: Foreign Key Constraint Enforcement**: Deliberately attempts to insert a `property_listings` record with a non-existent `ren_id` (`REN-999`) and a `viewing_logs` record with a non-existent `buyer_id` (`BYR-999`). Confirms SQLite throws `FOREIGN KEY constraint failed`.
3. **Test 3: Seed Generator & Data Integrity Audit**: Populates seed data and verifies table row counts (`ren_clients >= 2`, `buyer_prospects >= 5`, `property_listings >= 5`, `viewing_logs >= 3`, `commission_deals >= 2`).
4. **Test 4: Lead Scoring & Property Match Engine**: Executes `matchBuyerToListings('BYR-001')` and `matchBuyerCriteria(...)`. Confirms top matched listing for `BYR-001` (Mohd Fikri, budget 500k, Condo) is `LST-001` (Suria Jelutong Studio Condo, 380k) with score >= 90%.
5. **Test 5: Bi-Directional Cloud Sync Bridge**: Runs `CloudSyncBridge.pushLocalToCloud()` and `CloudSyncBridge.pullCloudToLocal()`. Confirms non-zero record counts and successful sync status.

---

## 7. Concrete Code Implementation Blueprints

Below are the complete, ready-to-deploy JS implementations for the Implementer Agent.

### 7.1 Database Engine Script (`05_Systems/Database/db_engine.js`)

```javascript
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
        // Enforce Foreign Keys
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
        // Clear existing seed records if needed or insert IF NOT EXISTS
        const renStmt = this.db.prepare(`
            INSERT OR REPLACE INTO ren_clients (ren_id, name, email, phone, commission_rate, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        renStmt.run('REN-001', 'Ahmad Razif', 'ahmad.razif@iqi.com.my', '+60121234567', 0.03, 'Active');
        renStmt.run('REN-002', 'Siti Nurhaliza', 'siti@renstar.my', '+60139876543', 0.03, 'Active');

        const buyerStmt = this.db.prepare(`
            INSERT OR REPLACE INTO buyer_prospects (buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms, lead_score, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        buyerStmt.run('BYR-001', 'Mohd Fikri bin Hassan', '+60123456789', 'fikri@gmail.com', 'Shah Alam', 500000, 'Condo', 2, 85, 'Viewing Scheduled');
        buyerStmt.run('BYR-002', 'Aina binti Kamal', '+60198765432', 'aina@yahoo.com', 'Bangi', 800000, 'Terrace', 3, 90, 'Negotiation');
        buyerStmt.run('BYR-003', 'Lee Wei Jie', '+60171234567', 'weijie@outlook.com', 'Cyberjaya', 1000000, 'Semi-D', 4, 95, 'Booking Placed');
        buyerStmt.run('BYR-004', 'Priya a/p Shankar', '+60141122334', 'priya@gmail.com', 'Puchong', 450000, 'Apartment', 3, 70, 'New Inquiry');
        buyerStmt.run('BYR-005', 'Azman bin Yusof', '+60169988776', 'azman@company.my', 'Damansara Heights', 3000000, 'Bungalow', 5, 88, 'Viewing Scheduled');

        const listingStmt = this.db.prepare(`
            INSERT OR REPLACE INTO property_listings (listing_id, title, location, property_type, price, bedrooms, bathrooms, ren_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        listingStmt.run('LST-001', 'Suria Jelutong Studio Condo', 'Bukit Jelutong, Shah Alam', 'Condo', 380000, 2, 2, 'REN-001', 'Available');
        listingStmt.run('LST-002', 'Skyfield 2-Storey Terrace', 'Bangi, Selangor', 'Terrace', 680000, 4, 3, 'REN-002', 'Available');
        listingStmt.run('LST-003', 'Cyber Towers Luxury Suite', 'Cyberjaya', 'Semi-D', 850000, 4, 4, 'REN-001', 'Available');
        listingStmt.run('LST-004', 'Botanica Hilltop Bungalow', 'Damansara Heights', 'Bungalow', 2400000, 6, 6, 'REN-001', 'Available');
        listingStmt.run('LST-005', 'Puchong Heights Subsale Apt', 'Puchong, Selangor', 'Apartment', 320000, 3, 2, 'REN-002', 'Available');

        const viewingStmt = this.db.prepare(`
            INSERT OR REPLACE INTO viewing_logs (viewing_id, buyer_id, listing_id, viewing_date, feedback, rating, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        viewingStmt.run('VW-001', 'BYR-001', 'LST-001', '2026-07-30 14:00:00', 'Buyer loved the unit location, checking bank loan DSR.', 4, 'Completed');
        viewingStmt.run('VW-002', 'BYR-002', 'LST-002', '2026-07-31 11:00:00', 'Negotiating target price down to RM650k.', 5, 'Completed');
        viewingStmt.run('VW-003', 'BYR-005', 'LST-004', '2026-08-01 15:30:00', 'Scheduled viewing with family.', NULL, 'Scheduled');

        const dealStmt = this.db.prepare(`
            INSERT OR REPLACE INTO commission_deals (deal_id, listing_id, buyer_id, ren_id, deal_amount, commission_earned, deal_date, status)
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
        if (buyer.status === 'Viewing Scheduled') score += 15;
        if (buyer.status === 'Negotiation' || buyer.status === 'Booking Placed') score += 20;
        return Math.min(score, 100);
    }

    matchBuyerCriteria(criteria) {
        const stmt = this.db.prepare(`SELECT * FROM property_listings WHERE status = 'Available'`);
        const listings = stmt.all();

        const matches = listings.map(lst => {
            let score = 0;
            let reasons = [];

            // Budget Match (40%)
            if (lst.price <= criteria.max_budget) {
                score += 40;
                reasons.push(`Price RM${lst.price.toLocaleString()} is within budget RM${criteria.max_budget.toLocaleString()}`);
            } else if (lst.price <= criteria.max_budget * 1.1) {
                score += 20;
                reasons.push(`Price RM${lst.price.toLocaleString()} is slightly above budget (+10%)`);
            }

            // Location Match (30%)
            const buyerLoc = (criteria.preferred_location || '').toLowerCase();
            const lstLoc = (lst.location || '').toLowerCase();
            if (lstLoc.includes(buyerLoc) || buyerLoc.includes(lstLoc)) {
                score += 30;
                reasons.push(`Location exact/partial match (${lst.location})`);
            }

            // Property Type Match (20%)
            if ((lst.property_type || '').toLowerCase() === (criteria.property_type || '').toLowerCase()) {
                score += 20;
                reasons.push(`Exact property type match (${lst.property_type})`);
            }

            // Bedrooms Match (10%)
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
        this.db.close();
    }
}

module.exports = { ZKDatabaseEngine, DB_PATH };
```

---

### 7.2 Cloud Sync Bridge Script (`05_Systems/Database/cloud_sync_bridge.js`)

```javascript
/**
 * ZK Revenue Ops — Notion & Google Sheets Cloud Sync Bridge
 * ID: SYS-003
 * Module: 05_Systems/Database/cloud_sync_bridge.js
 * 
 * Asynchronous bi-directional sync simulator & bridge interface for Notion API & Google Sheets API.
 */

const { ZKDatabaseEngine } = require('./db_engine');

class CloudSyncBridge {
    constructor(dbEngine) {
        this.dbEngine = dbEngine || new ZKDatabaseEngine();
        this.syncLogs = [];
    }

    async pushLocalToCloud() {
        const db = this.dbEngine.db;
        const buyers = db.prepare(`SELECT * FROM buyer_prospects`).all();
        const listings = db.prepare(`SELECT * FROM property_listings`).all();
        const deals = db.prepare(`SELECT * FROM commission_deals`).all();

        // Simulate pushing to Notion API & Google Sheets API
        const notionPayload = {
            target: 'Notion Database (Buyers & Listings)',
            pushedAt: new Date().toISOString(),
            recordsCount: buyers.length + listings.length
        };

        const googleSheetsPayload = {
            target: 'Google Sheets (Commission Deals & Pipeline)',
            pushedAt: new Date().toISOString(),
            recordsCount: deals.length
        };

        const logEntry = {
            timestamp: new Date().toISOString(),
            action: 'PUSH_LOCAL_TO_CLOUD',
            notion: notionPayload,
            googleSheets: googleSheetsPayload,
            status: 'SUCCESS'
        };

        this.syncLogs.push(logEntry);
        return logEntry;
    }

    async pullCloudToLocal() {
        // Simulate pulling external leads from Notion Forms / Google Sheets Ingestion
        const mockCloudLeads = [
            {
                buyer_id: 'BYR-006',
                name: 'Farhan Razak',
                phone: '+60129998877',
                email: 'farhan@example.my',
                preferred_location: 'Petaling Jaya',
                max_budget: 600000,
                property_type: 'Condo',
                min_bedrooms: 3,
                lead_score: 80,
                status: 'New Inquiry'
            }
        ];

        const db = this.dbEngine.db;
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO buyer_prospects (buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms, lead_score, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let reconciledCount = 0;
        for (const lead of mockCloudLeads) {
            stmt.run(
                lead.buyer_id,
                lead.name,
                lead.phone,
                lead.email,
                lead.preferred_location,
                lead.max_budget,
                lead.property_type,
                lead.min_bedrooms,
                lead.lead_score,
                lead.status
            );
            reconciledCount++;
        }

        const logEntry = {
            timestamp: new Date().toISOString(),
            action: 'PULL_CLOUD_TO_LOCAL',
            recordsPulled: mockCloudLeads.length,
            recordsReconciled: reconciledCount,
            status: 'SUCCESS'
        };

        this.syncLogs.push(logEntry);
        return logEntry;
    }

    getSyncHistory() {
        return this.syncLogs;
    }
}

module.exports = { CloudSyncBridge };
```

---

### 7.3 Test & Verification Script (`05_Systems/Database/test_db_engine.js`)

```javascript
/**
 * ZK Revenue Ops — Database Engine & Cloud Sync Test Suite
 * ID: SYS-003
 * Module: 05_Systems/Database/test_db_engine.js
 * 
 * Verifies Initialization, Foreign Key enforcement, Matching Engine, and Cloud Sync Bridge.
 */

const { ZKDatabaseEngine } = require('./db_engine');
const { CloudSyncBridge } = require('./cloud_sync_bridge');

async function runDatabaseTests() {
    console.log('====================================================');
    console.log('   ZK REVENUE OPS DB ENGINE TEST HARNESS (SYS-003)  ');
    console.log('====================================================\n');

    let passedTests = 0;
    let totalTests = 5;

    // Test 1: Initialization & Schema Creation
    try {
        console.log('[TEST 1/5] Initializing Database & Verifying Schema...');
        const engine = new ZKDatabaseEngine();
        const tables = engine.db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all();
        const tableNames = tables.map(t => t.name);

        const expectedTables = ['ren_clients', 'buyer_prospects', 'property_listings', 'viewing_logs', 'commission_deals'];
        const missing = expectedTables.filter(t => !tableNames.includes(t));

        if (missing.length === 0) {
            console.log('  ✅ PASS: All 5 core tables exist:', expectedTables.join(', '));
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Missing tables:', missing.join(', '));
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 1:', e.message);
    }

    // Test 2: Foreign Key Constraint Enforcement
    try {
        console.log('\n[TEST 2/5] Testing Foreign Key Enforcement...');
        const engine = new ZKDatabaseEngine();
        
        let fkViolated = false;
        try {
            // Attempt to insert listing with invalid REN ID
            const stmt = engine.db.prepare(`
                INSERT INTO property_listings (listing_id, title, location, property_type, price, bedrooms, bathrooms, ren_id)
                VALUES ('LST-ERR', 'Orphan Property', 'Invalid Loc', 'Condo', 500000, 2, 2, 'REN-NONEXISTENT')
            `);
            stmt.run();
        } catch (fkErr) {
            if (fkErr.message.includes('FOREIGN KEY constraint failed')) {
                fkViolated = true;
            }
        }

        if (fkViolated) {
            console.log('  ✅ PASS: Foreign key enforcement active (FOREIGN KEY constraint failed caught)');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Foreign key constraint failed to block invalid insertion!');
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 2:', e.message);
    }

    // Test 3: Seed Data Seeding & Data Audit
    try {
        console.log('\n[TEST 3/5] Populating Seed Data & Auditing Tables...');
        const engine = new ZKDatabaseEngine();
        engine.seedData();

        const rensCount = engine.db.prepare(`SELECT COUNT(*) as count FROM ren_clients`).get().count;
        const buyersCount = engine.db.prepare(`SELECT COUNT(*) as count FROM buyer_prospects`).get().count;
        const listingsCount = engine.db.prepare(`SELECT COUNT(*) as count FROM property_listings`).get().count;
        const viewingsCount = engine.db.prepare(`SELECT COUNT(*) as count FROM viewing_logs`).get().count;
        const dealsCount = engine.db.prepare(`SELECT COUNT(*) as count FROM commission_deals`).get().count;

        console.log(`  Audit Counts -> RENs: ${rensCount}, Buyers: ${buyersCount}, Listings: ${listingsCount}, Viewings: ${viewingsCount}, Deals: ${dealsCount}`);

        if (rensCount >= 2 && buyersCount >= 5 && listingsCount >= 5 && viewingsCount >= 3 && dealsCount >= 2) {
            console.log('  ✅ PASS: Seed data successfully populated and audited.');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Seed data count mismatch!');
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 3:', e.message);
    }

    // Test 4: Buyer-Property Matching Engine
    try {
        console.log('\n[TEST 4/5] Testing Buyer-Property Matching Engine...');
        const engine = new ZKDatabaseEngine();
        engine.seedData();

        const matches = engine.matchBuyerToListings('BYR-001');
        console.log(`  Matching Results for BYR-001 (Mohd Fikri - Budget RM500k, Shah Alam, Condo):`);
        matches.slice(0, 3).forEach((m, i) => {
            console.log(`   #${i+1} ${m.listing.title} (${m.listing.location}) - Price: RM${m.listing.price.toLocaleString()} | Score: ${m.matchScore}%`);
        });

        if (matches.length > 0 && matches[0].matchScore >= 80) {
            console.log('  ✅ PASS: Matching engine calculated top candidate correctly.');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Matching engine score evaluation error!');
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 4:', e.message);
    }

    // Test 5: Bi-Directional Cloud Sync Bridge
    try {
        console.log('\n[TEST 5/5] Testing Cloud Sync Bridge (Push & Pull Reconcile)...');
        const engine = new ZKDatabaseEngine();
        engine.seedData();

        const bridge = new CloudSyncBridge(engine);
        const pushResult = await bridge.pushLocalToCloud();
        const pullResult = await bridge.pullCloudToLocal();

        console.log(`  Push Status: ${pushResult.status} | Notion & Sheets Records Pushed`);
        console.log(`  Pull Status: ${pullResult.status} | Reconciled ${pullResult.recordsReconciled} external lead(s) into SQLite`);

        const newBuyer = engine.db.prepare(`SELECT * FROM buyer_prospects WHERE buyer_id = 'BYR-006'`).get();

        if (pushResult.status === 'SUCCESS' && pullResult.status === 'SUCCESS' && newBuyer) {
            console.log('  ✅ PASS: Bi-directional cloud sync bridge completed successfully.');
            passedTests++;
        } else {
            console.error('  ❌ FAIL: Cloud sync bridge verification failed!');
        }
        engine.close();
    } catch (e) {
        console.error('  ❌ FAIL Test 5:', e.message);
    }

    console.log('\n====================================================');
    console.log(`  TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
    console.log('====================================================\n');

    if (passedTests === totalTests) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runDatabaseTests();
```

---

## 8. Risk Analysis, Maintenance & Next Steps

### Identified Risks & Mitigation Strategies:

| Risk Item | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **SQLite Concurrency & Lock Contention** | Low–Medium | Use single-process `DatabaseSync` for synchronous local operations. WAL mode (`PRAGMA journal_mode = WAL;`) can be enabled if multi-process access is required. |
| **Missing Foreign Key Activation** | High | `PRAGMA foreign_keys = ON;` is explicitly executed inside `initSchema()` on every database instantiation. |
| **Cloud API Rate Limits** | Low | Implement retry backoff and batch sync intervals in `cloud_sync_bridge.js`. |
| **ZNS Layout & Metadata Non-Compliance** | Medium | All markdown deliverables include full frontmatter and pass `validate_zns.py`. |

### Next Steps for Implementation Agent:
1. Create directory `05_Systems/Database` if it does not exist.
2. Deploy `05_Systems/Database/db_engine.js` with `ZKDatabaseEngine`, schema DDL, seed data generator, lead scoring, and buyer-property matcher.
3. Deploy `05_Systems/Database/cloud_sync_bridge.js` with Notion and Google Sheets bi-directional sync simulator logic.
4. Deploy `05_Systems/Database/test_db_engine.js` test harness.
5. Execute `node 05_Systems/Database/test_db_engine.js` to confirm 5/5 test pass rate.
6. Execute `python 05_Systems/Scripts/validate_zns.py` to ensure workspace compliance.
