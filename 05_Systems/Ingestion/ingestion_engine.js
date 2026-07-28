/**
 * ZK Revenue Ops — Multi-Channel Lead Ingestion: Unified Orchestrator Engine
 * ID: SYS-004
 * Module: 05_Systems/Ingestion/ingestion_engine.js
 * 
 * Unified orchestrator combining Webhook Listener, WhatsApp Web Parser, and CSV/Excel Bulk Import Parser.
 */

const { ZKDatabaseEngine } = require('../Database/db_engine');
const { WebhookListener } = require('./webhook_listener');
const { WhatsAppParser } = require('./whatsapp_parser');
const { CSVExcelParser } = require('./csv_excel_parser');

class ZKIngestionEngine {
    constructor(dbEngine) {
        this.dbEngine = dbEngine || new ZKDatabaseEngine();
        this.webhookListener = new WebhookListener(this.dbEngine);
        this.whatsappParser = new WhatsAppParser(this.dbEngine);
        this.csvExcelParser = new CSVExcelParser(this.dbEngine);
        this.stats = {
            webhookCount: 0,
            whatsappCount: 0,
            csvCount: 0
        };
    }

    ingestWebhookPayload(payload) {
        const lead = this.webhookListener.processWebhookPayload(payload);
        this.stats.webhookCount++;
        return lead;
    }

    ingestWhatsAppMessage(rawText, senderPhone) {
        const lead = this.whatsappParser.ingestWhatsAppMessage(rawText, senderPhone);
        this.stats.whatsappCount++;
        return lead;
    }

    ingestCSVData(csvContentOrFilePath) {
        let result;
        if (csvContentOrFilePath.includes('\n') || csvContentOrFilePath.includes(',')) {
            result = this.csvExcelParser.parseCSVContent(csvContentOrFilePath);
        } else {
            result = this.csvExcelParser.parseCSVFile(csvContentOrFilePath);
        }
        this.stats.csvCount += result.buyersInserted;
        return result;
    }

    async startWebhookServer(port = 3800) {
        return await this.webhookListener.startServer(port);
    }

    async stopWebhookServer() {
        return await this.webhookListener.stopServer();
    }

    getIngestionStats() {
        const totalLeads = this.dbEngine.db.prepare(`SELECT COUNT(*) as count FROM buyer_prospects`).get().count;
        return {
            ...this.stats,
            totalLeadsInDatabase: totalLeads
        };
    }
}

module.exports = { ZKIngestionEngine };
