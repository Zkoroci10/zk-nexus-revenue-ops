# Handoff Report — Milestone 2 (ZK-INGEST) Remediation

## 1. Observation
- Initial run of `.agents/challenger_m2_1/stress_ingestion_test.js` resulted in 6 failed tests out of 27:
  1. `[FAIL] Webhook HTTP: Non-numeric budget/bedrooms converted safely to defaults` (`max_budget` / `min_bedrooms` saved as `NaN` in SQLite).
  2. `[FAIL] WhatsApp: Mixed Malay/English parsing (Farhan, Bangi, 550k, Terrace, 3 beds)` (Parsed `Beds=1` instead of `3` due to "3 room" not matching regex).
  3. `[FAIL] CSV: Special chars in names & phone normalization ("Müller O'Connor", "+6012-345 6789")` (Phone stored as `+6012-345 6789` instead of `+60123456789`).
  4. `[FAIL] WhatsApp Idempotency: Duplicate WhatsApp message causes duplicate records` (2 buyer prospect rows created for identical phone).
  5. `[FAIL] Webhook Idempotency: Duplicate webhook payload creates duplicate records` (2 buyer prospect rows created for identical phone).
  6. `[FAIL] CSV Idempotency & Unique ID: Sequential CSV imports cause ID collisions & overwrite previous leads` (`BYR-CSV-001` overwritten by second import).

## 2. Logic Chain
- **Webhook Listener (`05_Systems/Ingestion/webhook_listener.js`)**:
  - `parseFloat("invalid")` returns `NaN`. Adding fallback `|| 0` ensures `NaN` evaluates to `0`. `parseInt("five", 10)` returns `NaN`. Adding fallback `|| 1` ensures `NaN` evaluates to `1`.
  - Added phone-based idempotency lookup (`SELECT buyer_id FROM buyer_prospects WHERE phone = ?`). Reusing the existing `buyer_id` in `INSERT OR REPLACE` updates the existing row rather than inserting duplicate leads.
- **WhatsApp Parser (`05_Systems/Ingestion/whatsapp_parser.js`)**:
  - Expanded bedroom regex `/(\d+)\s*(?:bedroom|bedrooms|room|rooms|bed|br|bilik)/i` so phrases like "3 room terrace" accurately extract `3` bedrooms.
  - Added phone-based idempotency lookup in `ingestWhatsAppMessage` to reuse existing `buyer_id` if phone already exists in `buyer_prospects`.
- **CSV/Excel Parser (`05_Systems/Ingestion/csv_excel_parser.js`)**:
  - Added `normalizePhone(phone)` method to strip formatting symbols (`+`, `-`, spaces, parentheses) and prefix standard `+60` for local Malaysian numbers.
  - Implemented smart `buyer_id` and `ren_id` lookup: check if phone matches an existing buyer in `buyer_prospects` (reuse ID) or if candidate ID `BYR-CSV-001` is taken by a different phone (assign `BYR-CSV-${Date.now()}-${i}`).

## 3. Caveats
- No caveats. All 6 failure modes were directly addressed without structural breaking changes to database schemas or external API contracts.

## 4. Conclusion
- All 6 vulnerabilities identified by Challenger/Reviewer in `05_Systems/Ingestion/` are fully remediated.
- 4/4 standard ingestion engine unit tests pass.
- 27/27 stress tests pass.
- 100% ZNS compliance maintained across 227 files.

## 5. Verification Method
- Execute unit test suite:
  `node 05_Systems/Ingestion/test_ingestion_engine.js` (Expected: 4/4 PASSED)
- Execute stress test suite:
  `node .agents/challenger_m2_1/stress_ingestion_test.js` (Expected: 27/27 PASSED)
- Execute ZNS compliance validation script:
  `powershell -ExecutionPolicy Bypass -File 05_Systems/Scripts/validate-zns.ps1` (Expected: 100% ZNS compliance, 0 non-compliant files)
