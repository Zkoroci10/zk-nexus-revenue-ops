# Changes Record — Milestone 2 (ZK-INGEST) Remediation

## Summary of Fixes

### 1. `05_Systems/Ingestion/webhook_listener.js`
- **NaN Prevention**: Fixed budget and bedrooms extraction using `parseFloat(...) || 0` and `parseInt(..., 10) || 1` to prevent `NaN` values from being saved to the database when non-numeric input strings are provided.
- **Idempotency Check**: Updated `processWebhookPayload` to query `buyer_prospects` by normalized `phone` before assigning a new `buyer_id`. If an existing buyer record is found, their `buyer_id` is reused and their record updated, avoiding duplicate entries.
- **Array Payload Rejection**: Explicitly reject Array payloads alongside non-object or null payloads.

### 2. `05_Systems/Ingestion/whatsapp_parser.js`
- **Regex Expansion**: Expanded bedroom extraction regex to include `"room"` and `"rooms"` (`/(\d+)\s*(?:bedroom|bedrooms|room|rooms|bed|br|bilik)/i`), enabling correct parsing of phrases like "3 room terrace".
- **Idempotency Check**: Updated `ingestWhatsAppMessage` to query `buyer_prospects` by normalized `phone`. If a buyer already exists, reuse `existing.buyer_id` and update their record instead of creating duplicate `BYR-WA-...` records.

### 3. `05_Systems/Ingestion/csv_excel_parser.js`
- **Phone Normalization**: Added `normalizePhone` helper method to strip non-digit formatting characters (`+6012-345 6789` -> `+60123456789`, `(019) 888-9900` -> `+60198889900`, `0123456789` -> `+60123456789`).
- **Buyer & REN ID Collision Prevention**: Before assigning candidate IDs (`BYR-CSV-001`, `REN-CSV-001`), the parser checks if an existing record exists with the same phone or if the candidate ID is already occupied by a different lead/REN. If occupied by a different entity, a unique timestamp-indexed ID (`BYR-CSV-${Date.now()}-${i}`) is assigned, preventing sequential import overwrites.

## Verification
1. `node 05_Systems/Ingestion/test_ingestion_engine.js`: 4/4 tests PASSED.
2. `node .agents/challenger_m2_1/stress_ingestion_test.js`: 27/27 stress tests PASSED.
3. `powershell -ExecutionPolicy Bypass -File 05_Systems/Scripts/validate-zns.ps1`: 100% ZNS compliant (227 valid ZNS files, 0 non-compliant).
