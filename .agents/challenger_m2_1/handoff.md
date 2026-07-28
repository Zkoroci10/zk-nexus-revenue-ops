# Handoff Report: Milestone 2 Multi-Channel Lead Ingestion Engine Empirical Stress Testing

**Agent**: challenger_m2_1 (empirical_challenger)  
**Target Module**: `05_Systems/Ingestion/`  
**Test Harness Script**: `C:\Users\Dell\Documents\Projects ZK Nexus\.agents\challenger_m2_1\stress_ingestion_test.js`  
**Date**: 2026-07-29  

---

## 1. Observation

Empirical execution of `stress_ingestion_test.js` against `05_Systems/Ingestion/` yielded **21 PASSED** and **6 FAILED** assertions out of 27 test cases.

### Verbatim Tool Command Executed
`node .agents/challenger_m2_1/stress_ingestion_test.js`

### Output Summary
```
================================================================
   STRESS TEST SUMMARY: 21/27 PASSED, 6 FAILED
================================================================
```

### Specific Failed Observations & Code Locations

1. **`05_Systems/Ingestion/webhook_listener.js:44,46` — NaN Propagation in Numeric Inputs**
   - **Code**:
     `const max_budget = parseFloat(payload.max_budget || payload.budget || payload.Budget || 0);`
     `const min_bedrooms = parseInt(payload.min_bedrooms || payload.minBedrooms || payload.bedrooms || 1, 10);`
   - **Observation**: Sending payload `{ budget: "invalid", min_bedrooms: "five" }` results in `parseFloat("invalid") => NaN` and `parseInt("five", 10) => NaN`. `stmt.run(..., max_budget, min_bedrooms)` writes `NaN` directly into SQLite columns (`max_budget REAL NOT NULL`, `min_bedrooms INTEGER NOT NULL`).

2. **`05_Systems/Ingestion/whatsapp_parser.js:98` — WhatsApp Bedroom Extraction Misses "room / rooms"**
   - **Code**: `const bedMatch = text.match(/(\d+)\s*(?:bedroom|bedrooms|bed|br|bilik)/i);`
   - **Observation**: Parsing message `"Salam, saya Farhan looking for 3 room terrace in Bangi around 550k"` parsed `min_bedrooms` as `1` (default fallback) instead of `3`.

3. **`05_Systems/Ingestion/csv_excel_parser.js:63-65` — Un-normalized Phone Numbers in CSV Imports**
   - **Code**:
     ```javascript
     let phone = row.phone || `+60100000${String(i).padStart(3, '0')}`;
     if (phone.startsWith('0')) phone = '+60' + phone.substring(1);
     if (!phone.startsWith('+')) phone = '+' + phone;
     ```
   - **Observation**: Input string `+6012-345 6789` or `(019) 888-9900` retains hyphens, spaces, and formatting characters in SQLite. In contrast, `webhook_listener.js` and `whatsapp_parser.js` strip non-digit characters (`replace(/[^0-9+]/g, '')`), resulting in inconsistent phone string formats across channels.

4. **`05_Systems/Ingestion/whatsapp_parser.js:126` — Non-Idempotent Duplicate WhatsApp Message Ingestion**
   - **Code**: `const buyer_id = 'BYR-WA-${Date.now()}-${Math.floor(Math.random() * 1000)}';`
   - **Observation**: Submitting identical WhatsApp message text from phone `0123334444` twice creates 2 separate rows in `buyer_prospects`.

5. **`05_Systems/Ingestion/webhook_listener.js:48` — Non-Idempotent Duplicate Webhook Payload Ingestion**
   - **Code**: `const buyer_id = payload.buyer_id || 'BYR-WH-${Date.now()}-${Math.floor(Math.random() * 1000)}';`
   - **Observation**: Submitting identical webhook payloads without `buyer_id` generates unique `buyer_id` timestamps, creating duplicate rows for the same phone number.

6. **`05_Systems/Ingestion/csv_excel_parser.js:73` — Deterministic CSV `buyer_id` Collision Overwrites Subsequent Imports**
   - **Code**: `const buyer_id = 'BYR-CSV-${String(i).padStart(3, '0')}';`
   - **Observation**: `buyer_id` is generated using 1-indexed line numbers of the current file (`BYR-CSV-001`). Uploading a second CSV file generates `BYR-CSV-001` again. Because `buyer_id` is PRIMARY KEY and the query is `INSERT OR REPLACE INTO buyer_prospects`, the second CSV file silently overwrites and destroys lead records from previous CSV imports.

---

## 2. Logic Chain

1. **Numeric Parsing & NaN Propagation**:
   - `parseFloat("invalid")` returns `NaN` in JavaScript.
   - `parseFloat("invalid") || 0` evaluates to `0` because `NaN` is falsy.
   - Without the `|| 0` fallback on `parseFloat`, `max_budget` stays `NaN`.
   - Node's `DatabaseSync` accepts `NaN` as a valid float argument, persisting `NaN` into SQLite.
   - Downstream query comparisons (e.g., `price <= criteria.max_budget`) evaluate `NaN` comparisons as `false`, corrupting lead matching and financial summaries.

2. **Regex Keyword Scope in WhatsApp Parsing**:
   - Malaysian English and colloquial WhatsApp messages frequently use "3 room", "4 rooms", or "2-room".
   - The regex `/(\d+)\s*(?:bedroom|bedrooms|bed|br|bilik)/i` excludes `room` and `rooms`.
   - When no regex group matches, `min_bedrooms` falls back to `1`, losing user preference data.

3. **Inconsistent Phone Normalization**:
   - `webhook_listener.js` and `whatsapp_parser.js` share a `normalizePhone` helper that strips `/[^0-9+]/g`.
   - `csv_excel_parser.js` lacks `normalizePhone` and only checks prefix `0` or `+`.
   - As a result, CSV-imported phones like `+6012-345 6789` do not match normalized phones (`+60123456789`) in queries or cross-channel deduplication.

4. **Channel Idempotency & Duplicate Lead Prevention**:
   - Auto-generating `buyer_id` via timestamp `Date.now()` on every ingestion invocation guarantees that every request creates a new primary key.
   - Without checking if a buyer record with the same `phone` already exists, retries or duplicate incoming webhook/WhatsApp messages create duplicate buyer records.

5. **CSV Batch ID Scoping**:
   - Generating `BYR-CSV-001` based purely on file line index `i` makes IDs non-unique across different CSV files.
   - Combined with `INSERT OR REPLACE`, uploading file B causes `BYR-CSV-001` from file B to overwrite `BYR-CSV-001` from file A.

---

## 3. Caveats

- Tests were run using `node:sqlite` (Node 22 built-in SQLite engine).
- Webhook server HTTP tests were conducted over local loopback (`http://localhost:3899`).
- WhatsApp parser tests focused on regex parsing logic; live WhatsApp Web API network integration was outside the scope.

---

## 4. Conclusion

**VERDICT: REJECT / CONDITIONAL REVISION REQUIRED**

The Milestone 2 Lead Ingestion Engine successfully handles standard happy-path inputs (4/4 in `test_ingestion_engine.js`) and correctly defends against basic payload malformations and SQL injection. However, adversarial stress testing revealed **6 critical vulnerabilities**:

1. **Data Corruption**: `NaN` budget/bedroom values written to SQLite on invalid string input in Webhook listener.
2. **Data Loss**: Sequential CSV file imports overwrite previously imported leads due to non-unique `buyer_id` generation (`BYR-CSV-001`).
3. **Data Inconsistency**: Phone numbers in CSV import retain formatting characters, breaking cross-channel deduplication.
4. **Regex Gaps**: WhatsApp parser misses common "room / rooms" terminology for minimum bedrooms.
5. **Idempotency Flaws**: Webhook and WhatsApp ingestion pipelines create duplicate prospect records on repeated submissions.

---

## 5. Verification Method

To independently verify these findings:

1. **Run the Stress Test Harness**:
   ```bash
   node .agents/challenger_m2_1/stress_ingestion_test.js
   ```
2. **Inspect Vulnerability Output**:
   Observe the 6 failed test assertions and corresponding diagnostic details in stdout.
3. **Condition for Invalidation/Passing**:
   All 27 assertions in `stress_ingestion_test.js` pass (0 failures), and happy-path harness `node 05_Systems/Ingestion/test_ingestion_engine.js` continues to pass 4/4.
