## 2026-08-07T04:03:54Z

You are Worker 1 Fix (Remediating M1 Defects).
Working directory: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\worker_m1_fix
Workspace directory: C:\Users\Dell\Documents\Projects ZK Nexus

MUST READ FIRST:
- Gate Status: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\orchestrator\GATE_STATUS.md
- Challenger 1 Report: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\challenger_m1_1\handoff.md
- Challenger 2 Report: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\challenger_m1_2\handoff.md
- Project Plan: C:\Users\Dell\Documents\Projects ZK Nexus\PROJECT.md
- Original Request: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\orchestrator\ORIGINAL_REQUEST.md

Your Mission (Remediate M1 Defects in `js/app.js` and `05_Systems/Console-Portal/public/js/app.js`):

1. **Fix Phone Normalization (`normalisePhone`)**:
   Correct the prefix handling so `60123456789` converts to `+60123456789` (NOT `+6060123456789`). Ensure `0123456789` converts to `+60123456789` and `+60123456789` stays `+60123456789`.

2. **Fix DSR & Financial Edge-Cases (`calculateDsrMetrics` & `calculateDsr`)**:
   - If `grossIncome <= 0`: Return `dsrRatio: 999.0`, `tier: 'Cold'`, `loanStatus: 'High Risk / Unqualified'`.
   - If `commitments === 0` or `commitments === "0"`: Respect `0` as a valid commitment without forcing a 30% default override.
   - Do NOT round `dsrRatio` before evaluating threshold checks.
   - Align threshold classification across UI `calculateDsr()` and `calculateDsrMetrics()`: DSR `<= 40.0%` is Tier 1 Hot Pre-Approved, DSR `40.01% - 65.0%` is Warm Qualified.

3. **Fix Monthly ROI Report Retainer Inconsistency**:
   Calculate total monthly retainer fee dynamically using each client's actual retainer tier amount (`REN-001 Subang`: RM 1500, `REN-002 Shah Alam`: RM 3000, `REN-003 Cyberjaya`: RM 800, or `c.retainerFee`), ensuring top summary KPI cards and table rows match perfectly.

4. **Mirror Sync**:
   Keep `05_Systems/Console-Portal/public/js/app.js` and `js/app.js` (root) 100% byte-for-byte identical, as well as `index.html` files.

5. **Verification**:
   Run `powershell -ExecutionPolicy Bypass -File "05_Systems/Scripts/validate-zns.ps1"` to confirm 0 ZNS validation errors.
