/**
 * ZK Revenue Ops — Multi-Channel Lead Ingestion: WhatsApp Web Message Parser
 * ID: SYS-004
 * Module: 05_Systems/Ingestion/whatsapp_parser.js
 * 
 * Extracts Name, Phone, Location, Budget, Property Type, Min Bedrooms from raw message text using NLP Regex rules.
 */

const { ZKDatabaseEngine } = require('../Database/db_engine');

class WhatsAppParser {
    constructor(dbEngine) {
        this.dbEngine = dbEngine || new ZKDatabaseEngine();
    }

    parseMessageText(rawText, senderPhone = '') {
        const text = (rawText || '').trim();
        if (!text) throw new Error('Message text cannot be empty');

        // 1. Extract Name
        let name = 'WhatsApp Prospect';
        const namePatterns = [
            /(?:hi|hello|hey|salam|assalam)?\s*(?:i am|i'm|saya|nama saya|my name is)\s+([a-z\s]+?)(?:,|\.|\s+searching|\s+looking|\s+want|\s+under|\s+budget|\s+di|\s+in|$)/i,
            /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+here/i
        ];
        for (const pattern of namePatterns) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].trim().length > 1) {
                name = match[1].trim();
                break;
            }
        }

        // 2. Extract Phone
        let phone = senderPhone;
        const phoneMatch = text.match(/(?:\+?60|0)1[0-9]-?[0-9]{7,8}/);
        if (phoneMatch) {
            phone = phoneMatch[0];
        }
        phone = this.normalizePhone(phone || '+60100000000');

        // 3. Extract Budget
        let max_budget = 0;
        const budgetPatterns = [
            /(?:under|below|budget|bajet|harga|max|around)?\s*(?:rm)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|mil|million|000)?\b/i,
            /(?:under|below|budget|bajet|harga|max|around)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|mil|million|000)?\b/i,
            /\b(\d+(?:\.\d+)?)\s*(k|lakh|mil|million)\b/i
        ];
        for (const pattern of budgetPatterns) {
            const match = text.match(pattern);
            if (match) {
                let numStr = match[1].replace(/,/g, '');
                let num = parseFloat(numStr);
                const unit = (match[2] || '').toLowerCase();
                if (unit === 'k' || unit === '000') num *= 1000;
                else if (unit === 'mil' || unit === 'million') num *= 1000000;
                else if (unit === 'lakh') num *= 100000;
                else if (num < 1000) num *= 1000;
                max_budget = num;
                break;
            }
        }

        // 4. Extract Preferred Location
        let preferred_location = 'Unspecified';
        const locations = ['Shah Alam', 'Bangi', 'Cyberjaya', 'Puchong', 'Damansara Heights', 'Damansara', 'Petaling Jaya', 'PJ', 'Subang', 'KL', 'Kuala Lumpur', 'Cheras', 'Kepong', 'Setia Alam'];
        for (const loc of locations) {
            if (new RegExp(`\\b${loc}\\b`, 'i').test(text)) {
                preferred_location = loc;
                break;
            }
        }
        if (preferred_location === 'Unspecified') {
            const locMatch = text.match(/(?:in|di|around|area|dekat)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
            if (locMatch && locMatch[1]) {
                preferred_location = locMatch[1].trim();
            }
        }

        // 5. Extract Property Type
        let property_type = 'Condo';
        const propTypes = [
            { key: 'Condo', pattern: /condo|condominium|apartment|apt|flat|studio/i },
            { key: 'Terrace', pattern: /terrace|landed|house|rumah|2-storey|link/i },
            { key: 'Semi-D', pattern: /semi-d|semi d|semid/i },
            { key: 'Bungalow', pattern: /bungalow|villa/i },
            { key: 'Townhouse', pattern: /townhouse/i }
        ];
        for (const prop of propTypes) {
            if (prop.pattern.test(text)) {
                property_type = prop.key;
                break;
            }
        }

        // 6. Extract Min Bedrooms
        let min_bedrooms = 1;
        const bedMatch = text.match(/(\d+)\s*(?:bedroom|bedrooms|room|rooms|bed|br|bilik)/i);
        if (bedMatch) {
            min_bedrooms = parseInt(bedMatch[1], 10);
        }

        return {
            name,
            phone,
            preferred_location,
            max_budget,
            property_type,
            min_bedrooms
        };
    }

    normalizePhone(phone) {
        if (!phone) return '+60100000000';
        let cleaned = String(phone).replace(/[^0-9+]/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '+60' + cleaned.substring(1);
        } else if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned;
        }
        return cleaned;
    }

    ingestWhatsAppMessage(rawText, senderPhone = '') {
        const parsed = this.parseMessageText(rawText, senderPhone);
        
        let buyer_id;
        const existing = this.dbEngine.db.prepare(`SELECT buyer_id FROM buyer_prospects WHERE phone = ?`).get(parsed.phone);
        if (existing) {
            buyer_id = existing.buyer_id;
        } else {
            buyer_id = `BYR-WA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }

        const lead_score = this.dbEngine.calculateLeadScore({
            max_budget: parsed.max_budget,
            phone: parsed.phone,
            email: null,
            preferred_location: parsed.preferred_location,
            status: 'New Inquiry'
        });

        const stmt = this.dbEngine.db.prepare(`
            INSERT OR REPLACE INTO buyer_prospects 
            (buyer_id, name, phone, email, preferred_location, max_budget, property_type, min_bedrooms, lead_score, status, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'New Inquiry', CURRENT_TIMESTAMP)
        `);

        stmt.run(buyer_id, parsed.name, parsed.phone, null, parsed.preferred_location, parsed.max_budget, parsed.property_type, parsed.min_bedrooms, lead_score);

        return {
            buyer_id,
            ...parsed,
            lead_score,
            status: 'New Inquiry'
        };
    }
}

module.exports = { WhatsAppParser };
