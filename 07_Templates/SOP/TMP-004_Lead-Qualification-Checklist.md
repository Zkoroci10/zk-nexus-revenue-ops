---
Title: Template — Lead Qualification & DSR Audit Checklist
ID: TMP-004
Type: Template (Checklist / SOP)
Module: 07_Templates
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-07-28
Updated: 2026-07-28
Owner: Human Founder (Zubair Ariff) & AI SDR System
Related: ZK-GOV-004, ZK-OPS-001, SOP-001, TMP-001, RUL-001
---

# ZK Revenue Ops — Lead Qualification & DSR Audit Checklist

> **TMP-004 | Template Senarai Semak Kelayakan Lead & Audit DSR Pinjaman Bank**

---

## 1. Overview & Operational Purpose

This checklist template provides a standardized procedure for SDR operators and AI agents to audit raw property leads, execute Debt Service Ratio (DSR) screening, calculate the 1-100 Lead Score, and map stage transitions across **`ST-01` to `ST-10`** (**ZK-GOV-004**).

---

## 2. Lead Intake & Data Sanitization Checklist

- [ ] **Lead Origin**: Verify lead source (Meta Ad, PropertyGuru, TikTok, REN Cold Database Dump).
- [ ] **Client Seat Assignment**: Confirm active REN Seat ID (`SEAT-001` to `SEAT-030`).
- [ ] **Phone Formatting**: Standardize phone number format to Malaysian E.164 standard (`+601xxxxxxxxx`).
- [ ] **Deduplication Check**: Run duplicate phone check across active lead database.
- [ ] **Timestamp Ingestion**: Log exact creation timestamp (`YYYY-MM-DD THH:MM:SSZ`).
- [ ] **Initial SLA Trigger**: Dispatch initial WhatsApp welcome message (`WA-01`) within **< 5 minutes**.

---

## 3. Lead Qualification & 1–100 Point Scoring Audit Table

Fill in the scores for each pillar below to determine total lead score:

| Qualification Pillar | Field Audit & Checklist Criteria | Points Earned | Max Points |
| :--- | :--- | :---: | :---: |
| **1. DSR & Financial Capacity** | - **DSR $\le 60\%$**: Pre-approved for max loan margin (30 pts)<br>- **DSR 61%–70%**: Borderline, requires joint borrower (20 pts)<br>- **DSR > 70%**: High loan rejection risk (5 pts) | `[ ___ ]` | **30 Pts** |
| **2. Capital Preparedness** | - **10%+ Cash / EPF Account 2 Ready**: Immediate deposit (25 pts)<br>- **5% Cash + LPPSA / Full Loan Request**: Needs processing (15 pts)<br>- **Zero Cash & Dependent on 100% Loan**: High risk (5 pts) | `[ ___ ]` | **25 Pts** |
| **3. Purchase Timeline** | - **Immediate (< 30 Days)**: Active viewing ready (25 pts)<br>- **1 to 3 Months**: Nurturing pipeline (15 pts)<br>- **> 3 Months / Just Browsing**: Low priority (5 pts) | `[ ___ ]` | **25 Pts** |
| **4. Responsiveness** | - **Fast WhatsApp Response (< 15m) + Docs**: Highly engaged (20 pts)<br>- **Slow Response (24h) but Cooperative**: Moderate (10 pts)<br>- **Unresponsive / Single Word Answers**: Cold (0 pts) | `[ ___ ]` | **20 Pts** |
| **TOTAL QUALIFICATION SCORE** | **Sum of Pillars 1 through 4** | `[ ___ ]` | **100 Pts** |

---

## 4. DSR Calculation & Bank Eligibility Audit Formula

$$\text{Net Monthly Income} = \text{Gross Basic Income} + \text{Fixed Allowances} - \text{EPF} - \text{SOCSO} - \text{PCB}$$

$$\text{Total Monthly Debt Commitments} = \text{Housing Loan} + \text{Car Loan} + \text{Personal Loans} + \text{Credit Card Min Payments}$$

$$\text{Calculated DSR (\%)} = \left( \frac{\text{Total Monthly Debt Commitments}}{\text{Net Monthly Income}} \right) \times 100$$

### DSR Audit Triage Decision Matrix:
* **DSR $\le 60\%$** $\rightarrow$ **PASS (Tier 1 Hot / `ST-03`)**: High bank approval confidence. Proceed immediately to calendar booking (`ST-06`).
* **DSR $61\% - 70\%$** $\rightarrow$ **BORDERLINE (Tier 2 Warm / `ST-04`)**: Advise joint loan applicant (spouse/parent) or lower property price point.
* **DSR $> 70\%$** $\rightarrow$ **FAIL (Tier 3 Disqualified / `ST-05`)**: Bank loan rejection imminent. Tag as disqualified and archive.

---

## 5. Pipeline Stage Audit & Transition Checklist (ST-01 to ST-10)

Check off stage progression as lead moves through the pipeline:

- [ ] **`ST-01` New Lead**: Ingested from source. Speed-to-lead timer initiated.
- [ ] **`ST-02` Screening**: First outreach message (`WA-01` / `WA-02`) sent. Awaiting financial inputs.
- [ ] **`ST-03` Tier 1 Hot Lead**: Total score $\ge 80$. DSR $\le 60\%$. Calendar booking link dispatched.
- [ ] **`ST-04` Tier 2 Warm Lead**: Total score $50 - 79$. Enrolled in 14-day WhatsApp cadence.
- [ ] **`ST-05` Tier 3 Disqualified**: Total score $< 50$. DSR $> 70\%$. Archived in database.
- [ ] **`ST-06` Viewing Booked**: Date, time, and show gallery location confirmed in REN calendar.
- [ ] **`ST-07` High Ghost Risk**: Flagged if buyer does not confirm T-2h reminder. Voice call initiated.
- [ ] **`ST-08` Viewing Show-Up**: Verified physical attendance at property gallery.
- [ ] **`ST-09` Deal Closed Won**: Booking fee collected, SPA signed, commission secured by REN.
- [ ] **`ST-10` Deal Lost**: Buyer declined unit post-viewing. Feedback logged in CRM.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-28 | Human Founder & AI SDR | Official release of Lead Qualification Checklist Template (TMP-004) |
