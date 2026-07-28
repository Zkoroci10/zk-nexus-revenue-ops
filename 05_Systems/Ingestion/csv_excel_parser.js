/**
 * ZK Revenue Ops — Multi-Channel Lead Ingestion: CSV/Excel Bulk Parser
 * ID: SYS-004
 * Module: 05_Systems/Ingestion/csv_excel_parser.js
 * 
 * Bulk import parser for legacy REN contact CSV files and Excel spreadsheets.
 * Normalizes column names (Name/Nama, Phone/Telefon, Location/Lokasi, Budget/Bajet, REN Name),
 * handles missing fields cleanly, generates unique buyer_id and ren_id.
 */

const fs = require('fs');
const { ZKDatabaseEngine } = require('../Database/db_engine');

class CSVExcelParser {
    constructor(dbEngine) {
        this.dbEngine = dbEngine || new ZKDatabaseEngine();
    }

    normalizeHeader(header) {
        const clean = (header || '').trim().toLowerCase();
        if (clean.includes('ren email') || clean.includes('agent email')) return 'ren_email';
        if (clean.includes('ren name') || clean.includes('nama agent') || clean.includes('agent name') || clean === 'agent' || clean === 'ren') return 'ren_name';
        if (clean.includes('nama') || clean.includes('name') || clean.includes('contact name')) return 'name';
        if (clean.includes('phone') || clean.includes('telefon') || clean.includes('mobile') || clean.includes('tel')) return 'phone';
        if (clean.includes('email') || clean.includes('emel')) return 'email';
        if (clean.includes('location') || clean.includes('lokasi') || clean.includes('area')) return 'preferred_location';
        if (clean.includes('budget') || clean.includes('bajet') || clean.includes('harga') || clean.includes('price')) return 'max_budget';
        if (clean.includes('type') || clean.includes('jenis')) return 'property_type';
        if (clean.includes('bedroom') || clean.includes('bilik') || clean.includes('bed')) return 'min_bedrooms';
        return clean;
    }

    normalizePhone(phone) {
        if (!phone) return '';
        let cleaned = String(phone).replace(/[^0-9+]/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '+60' + cleaned.substring(1);
        } else if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned;
        }
        return cleaned;
    }

    parseCSVContent(csvString) {
        const lines = csvString.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length === 0) return { buyersInserted: 0, rensInserted: 0, records: [] };

        const headers = lines[0].split(',').map(h => this.normalizeHeader(h));
        const records = [];
        let buyersInserted = 0;
        let rensInserted = 0;

        const buyerStmt = this.dbEngine.db.prepare(`
            INSERT OR REPLACE INTO buyer_prospects 
            (buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms, lead_score, status, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'New Inquiry', CURRENT_TIMESTAMP)
        `);

        const renStmt = this.dbEngine.db.prepare(`
            INSERT OR IGNORE INTO ren_clients (ren_id, name, email, phone, commission_rate, status)
            VALUES (?, ?, ?, ?, 0.03, 'Active')
        `);

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            headers.forEach((h, idx) => {
                row[h] = values[idx] || '';
            });

            if (!row.name && !row.phone) continue;

            const name = row.name || `Imported Lead ${i}`;
            const rawPhone = row.phone || `+60100000${String(i).padStart(3, '0')}`;
            const phone = this.normalizePhone(rawPhone);

            const email = row.email || null;
            const preferred_location = row.preferred_location || 'Unspecified';
            const max_budget = parseFloat(row.max_budget || 0) || 0;
            const property_type = row.property_type || 'Condo';
            const min_bedrooms = parseInt(row.min_bedrooms || 1, 10) || 1;

            let buyer_id;
            const existingByPhone = this.dbEngine.db.prepare(`SELECT buyer_id FROM buyer_prospects WHERE phone = ?`).get(phone);
            if (existingByPhone) {
                buyer_id = existingByPhone.buyer_id;
            } else {
                const candidateId = `BYR-CSV-${String(i).padStart(3, '0')}`;
                const existingById = this.dbEngine.db.prepare(`SELECT buyer_id FROM buyer_prospects WHERE buyer_id = ?`).get(candidateId);
                if (!existingById) {
                    buyer_id = candidateId;
                } else {
                    buyer_id = `BYR-CSV-${Date.now()}-${i}`;
                }
            }

            // Optional REN Seeding
            if (row.ren_name) {
                let ren_id;
                const existingRen = this.dbEngine.db.prepare(`SELECT ren_id FROM ren_clients WHERE name = ?`).get(row.ren_name);
                if (existingRen) {
                    ren_id = existingRen.ren_id;
                } else {
                    const candidateRenId = `REN-CSV-${String(i).padStart(3, '0')}`;
                    const existingRenById = this.dbEngine.db.prepare(`SELECT ren_id FROM ren_clients WHERE ren_id = ?`).get(candidateRenId);
                    if (!existingRenById) {
                        ren_id = candidateRenId;
                    } else {
                        ren_id = `REN-CSV-${Date.now()}-${i}`;
                    }
                }
                const ren_email = row.ren_email || `agent_${i}_${Date.now()}@zkrealty.my`;
                renStmt.run(ren_id, row.ren_name, ren_email, phone);
                rensInserted++;
            }

            const lead_score = this.dbEngine.calculateLeadScore({
                max_budget,
                phone,
                email,
                preferred_location,
                status: 'New Inquiry'
            });

            buyerStmt.run(buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms, lead_score);
            buyersInserted++;

            records.push({
                buyer_id,
                name,
                phone,
                email,
                preferred_location,
                max_budget,
                property_type,
                min_bedrooms,
                lead_score
            });
        }

        return {
            buyersInserted,
            rensInserted,
            records
        };
    }

    parseCSVFile(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`CSV file not found at path: ${filePath}`);
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return this.parseCSVContent(content);
    }
}

module.exports = { CSVExcelParser };
