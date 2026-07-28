/**
 * ZK Revenue Ops — Multi-Channel Lead Ingestion: Webhook Listener
 * ID: SYS-004
 * Module: 05_Systems/Ingestion/webhook_listener.js
 * 
 * Express / Node HTTP Webhook listener accepting JSON webform payloads.
 */

const http = require('http');
const { ZKDatabaseEngine } = require('../Database/db_engine');

class WebhookListener {
    constructor(dbEngine) {
        this.dbEngine = dbEngine || new ZKDatabaseEngine();
        this.server = null;
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

    processWebhookPayload(payload) {
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            throw new Error('Invalid payload format: expected JSON object');
        }

        const name = (payload.name || payload.Name || '').trim();
        const rawPhone = payload.phone || payload.Phone || payload.mobile || '';
        const phone = this.normalizePhone(rawPhone);

        if (!name || !phone) {
            throw new Error('Missing required fields: Name and Phone are mandatory');
        }

        const email = (payload.email || payload.Email || '').trim() || null;
        const preferred_location = (payload.preferred_location || payload.location || payload.Location || 'Unspecified').trim();
        const max_budget = parseFloat(payload.max_budget || payload.budget || payload.Budget || 0) || 0;
        const property_type = (payload.property_type || payload.propertyType || payload.Property_Type || 'Condo').trim();
        const min_bedrooms = parseInt(payload.min_bedrooms || payload.minBedrooms || payload.bedrooms || 1, 10) || 1;

        let buyer_id = payload.buyer_id;
        if (!buyer_id) {
            const existing = this.dbEngine.db.prepare(`SELECT buyer_id FROM buyer_prospects WHERE phone = ?`).get(phone);
            if (existing) {
                buyer_id = existing.buyer_id;
            } else {
                buyer_id = `BYR-WH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            }
        }

        const lead_score = this.dbEngine.calculateLeadScore({
            max_budget,
            phone,
            email,
            preferred_location,
            status: 'New Inquiry'
        });

        const stmt = this.dbEngine.db.prepare(`
            INSERT OR REPLACE INTO buyer_prospects 
            (buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms, lead_score, status, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'New Inquiry', CURRENT_TIMESTAMP)
        `);

        stmt.run(buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms, lead_score);

        return {
            buyer_id,
            name,
            phone,
            email,
            preferred_location,
            max_budget,
            property_type,
            min_bedrooms,
            lead_score,
            status: 'New Inquiry'
        };
    }

    startServer(port = 3800) {
        return new Promise((resolve) => {
            this.server = http.createServer((req, res) => {
                if (req.method === 'POST' && (req.url === '/api/v1/webhooks/lead' || req.url === '/')) {
                    let body = '';
                    req.on('data', chunk => body += chunk.toString());
                    req.on('end', () => {
                        try {
                            const payload = JSON.parse(body);
                            const lead = this.processWebhookPayload(payload);
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ status: 'success', message: 'Lead ingested successfully', lead }));
                        } catch (err) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ status: 'error', message: err.message }));
                        }
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'error', message: 'Endpoint not found' }));
                }
            });

            this.server.listen(port, () => {
                resolve(this.server);
            });
        });
    }

    stopServer() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => resolve());
            } else {
                resolve();
            }
        });
    }
}

module.exports = { WebhookListener };
