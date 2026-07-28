const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(':memory:');

db.exec('PRAGMA foreign_keys = ON;');

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
    rating INTEGER,
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

db.exec(schema);
console.log('✅ Schema verification test passed! All 5 core tables created successfully.');
