# 5-Component Handoff Report — Challenger M2 (Branded REN Client Portal Verification)

## 1. Observation

- **Empirical Test Execution**:
  - Test harness `05_Systems/Scripts/test_portal_m2.js` executed 13 assertion tests against `portal.html` script logic.
  - Result: **9 Passed, 4 Failed**.
- **Failed Test 1 (Gross Income = 0 Boundary Flaw)**:
  - Input: `Gross Monthly Income = RM 0`, `Commitments = RM 2,100`, `Target Price = RM 480,000` (Installment = RM 2,152/mo).
  - Output: `resDSRVal` displayed `"0.0%"`, `resDSRBadge` displayed `"Tier 1 Pre-Approved (DSR <= 40%)"`.
  - Verbatim Code: `portal.html:1587-1589` (`let dsr = 0; if (income > 0) { dsr = (totalCommitments / income) * 100; }`), `portal.html:1612-1616` (`if (dsr <= 40) { badgeText.innerText = "Tier 1 Pre-Approved (DSR <= 40%)"; }`).
- **Failed Test 2 (DSR = 40.0% Boundary Mismatch)**:
  - Input: `Income = RM 10,000`, `Commitments = RM 2,022.08`, `Property Price = RM 480,000`, `Margin = 90%`, `Tenure = 35 yrs`, `Interest = 4.25%` (Total Debt = RM 4,000.0038/mo).
  - Live UI Output: `resDSRVal` displayed `"40.0%"`, `resDSRBadge` displayed `"Tier 2 Bank Qualified (DSR 41-60%)"`.
  - Persisted Dossier Output: Clicking "Attach & Save to Buyer Dossiers" saved dossier tier as `"Tier 1 Pre-Approved"`.
  - Verbatim Code: `portal.html:1612` (`if (dsr <= 40)` checks raw float `40.000038 <= 40` -> false -> Tier 2 badge) vs `portal.html:1656` (`else if (dsrVal > 40)` checks rounded DOM text `40.0 > 40` -> false -> Tier 1 dossier).
- **Failed Test 3 (DSR = 60.0% Boundary Mismatch)**:
  - Input: `Income = RM 10,000`, `Commitments = RM 4,022.08`, `Property Price = RM 480,000`, `Margin = 90%`, `Tenure = 35 yrs`, `Interest = 4.25%` (Total Debt = RM 6,000.0038/mo).
  - Live UI Output: `resDSRVal` displayed `"60.0%"`, `resDSRBadge` displayed `"Tier 3 Underwriting Review (DSR > 60%)"`.
  - Persisted Dossier Output: Clicking "Attach & Save to Buyer Dossiers" saved dossier tier as `"Tier 2 Bank Qualified"`.
  - Verbatim Code: `portal.html:1617` (`else if (dsr <= 60)` checks raw float `60.000038 <= 60` -> false -> Tier 3 badge) vs `portal.html:1656` (`else if (dsrVal > 40)` checks rounded DOM text `60.0 > 40` -> true -> Tier 2 dossier).
- **Failed Test 4 (Interest Rate 0% Input Default Override)**:
  - Input: `Interest Rate (% p.a.) = 0`.
  - Output: Installment calculated as `RM 2,214 / mo` (using 4.25% fallback) instead of expected `RM 1,250 / mo` for 0% interest loan.
  - Verbatim Code: `portal.html:1573` (`const rate = parseFloat(document.getElementById("calcInterest").value) || 4.25;`). In JavaScript, `parseFloat("0")` returns `0`, which evaluates as falsy in `0 || 4.25`, forcing a fallback to 4.25.
- **Passing Verification Checks**:
  - Tenure 10 yrs vs 35 yrs correctly scales installment (RM 4,610/mo vs RM 2,061/mo).
  - Loan Margin 100% vs 50% correctly doubles installment (RM 2,460/mo vs RM 1,230/mo).
  - `localStorage` key `zk_portal_dossiers` correctly persists newly attached calculator dossiers and `initApp()` re-hydrates state.
  - `(Get-FileHash 'portal.html').Hash -eq (Get-FileHash '05_Systems/Console-Portal/public/portal.html').Hash` returned `True`.
  - `validate-zns.ps1` returned 0 validation errors (307 valid ZNS files scanned).

---

## 2. Logic Chain

1. **Zero Income Logic Flaw**:
   - `runDSRCalculation()` initializes `dsr = 0`. Because the calculation wrapper requires `income > 0`, an income of 0 leaves `dsr = 0`.
   - The tier evaluator tests `if (dsr <= 40)`. Since `0 <= 40` is true, an applicant with RM 0 income and RM 4,252 monthly debt is tagged as "Tier 1 Pre-Approved".
   - Zero income with non-zero debt is mathematically an undefined/infinite DSR and must be assigned `Tier 3 Underwriting Review` (or flagged as zero income error).

2. **DSR Boundary UI vs Storage Contradiction**:
   - The DSR float calculation (e.g. `40.000038`) is formatted for DOM display using `dsr.toFixed(1)` (`"40.0%"`).
   - In `runDSRCalculation()`, the badge evaluator uses the raw float `40.000038`. `40.000038 <= 40` is `false`, so the live badge displays `Tier 2 Bank Qualified (DSR 41-60%)`.
   - In `saveCalculatorToDossier()`, the function reads the DOM string `"40.0"`, parses it to `40.0`, and checks `if (dsrVal > 40)`. `40.0 > 40` is `false`, so the saved dossier is created as `Tier 1 Pre-Approved`.
   - Result: The user sees `Tier 2` on screen before saving, but the saved card becomes `Tier 1`.

3. **JS Falsy Fallback Bug on Numeric 0 Inputs**:
   - JS `parseFloat("0")` returns `0`.
   - Using logical OR (`||`) for default values causes `0 || 4.25` to evaluate to `4.25`.
   - Any valid 0% interest rate loan input is overridden by 4.25%.

---

## 3. Caveats

- **Visual & UI Layout**: The visual design, slate dark theme, Inter font, zero emojis, REN retainer switcher, and `@media print` white-paper stylesheet comply fully with UI/UX Pro Max standards.
- **Persistence Mechanism**: `localStorage` state management mechanism itself functions correctly. The failure is strictly in the calculation & tier classification logic prior to persistence.

---

## 4. Conclusion

**Verdict: REJECT**

Milestone M2 cannot be approved in its current state due to 4 empirical calculation and state classification failures:
1. Applicants with 0 income are incorrectly classified as `Tier 1 Pre-Approved`.
2. DSR boundary values (40.0%, 60.0%) create contradictions between the live UI badge and saved buyer dossiers.
3. 0% interest rate inputs are overwritten by the 4.25% fallback.

### Required Fixes for Worker M2:
1. In `runDSRCalculation()` (`portal.html:1587`):
   ```javascript
   if (income <= 0) {
       dsr = 100; // Force high-risk/Tier 3 for zero income
   } else {
       dsr = (totalCommitments / income) * 100;
   }
   ```
2. Standardize DSR tier classification using rounded DSR values (`dsrVal = Math.round(dsr * 10) / 10` or `parseFloat(dsr.toFixed(1))`) across both `runDSRCalculation()` and `saveCalculatorToDossier()`.
3. Fix input default fallback parsing in `runDSRCalculation()` (`portal.html:1573`):
   ```javascript
   const parsedRate = parseFloat(document.getElementById("calcInterest").value);
   const rate = isNaN(parsedRate) ? 4.25 : parsedRate;
   ```

---

## 5. Verification Method

1. **Empirical Test Suite Execution Command**:
   ```powershell
   node 05_Systems/Scripts/test_portal_m2.js
   ```
   *Expected result after fixes*: 13 Passed, 0 Failed.

2. **ZNS Validation Command**:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "05_Systems/Scripts/validate-zns.ps1"
   ```
   *Expected result*: 0 ZNS validation errors.

3. **Mirror Hash Verification Command**:
   ```powershell
   powershell -Command "(Get-FileHash 'portal.html').Hash -eq (Get-FileHash '05_Systems/Console-Portal/public/portal.html').Hash"
   ```
   *Expected result*: `True`.
