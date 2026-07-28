---
Title: Lead Qualification SOP & Scoring Framework
ID: ZK-OPS-004
Type: Standard Operating Procedure
Module: 01_Business / ZK Revenue Ops
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-07-28
Updated: 2026-07-28
Owner: Human Founder (Zubair Ariff) & AI SDR System
Related: ZK-GOV-004, ZK-OPS-001, ZK-OPS-002, ZK-OPS-003, RUL-001
---

# ZK-OPS-004: Lead Qualification & Scoring SOP

> **ZK-OPS-004 | Prosedur Operasi Piawai Kelayakan Lead, Skor DSR & Pengurusan Pipeline**

---

## 1. Executive Summary & Purpose

This Standard Operating Procedure (SOP) governs the systematic triage, scoring, and qualification of property buyer leads processed by ZK Revenue Ops on behalf of subscribed Real Estate Negotiators (`SEAT-001..030`).

The primary goal of ZK-OPS-004 is to eliminate time spent on unqualified buyers by enforcing a strict **1-100 Point Lead Scoring Model** and mapping all lead movements directly to the official **`ST-01` to `ST-10` Pipeline Lifecycle** (**ZK-GOV-004**).

---

## 2. Dual Qualification Framework: BANT & CHAMP

SDR operators and AI agents evaluate incoming inquiries using a hybrid framework tailored for Malaysian real estate:

```text
       BANT FRAMEWORK                             CHAMP FRAMEWORK
B - Budget (DSR Loan Eligibility)        C - Challenges (Current Housing / Urgent Need)
A - Authority (Sole / Joint Buyer)       H - Authority (Decision Maker / Spouse)
N - Need (Unit Type, Location, Bed)      M - Money (DSR <= 60%, Downpayment Ready)
T - Timeline (Buy within 30-90 days)     P - Prioritization (Active Viewing Readiness)
```

1. **Money / Budget (DSR Calculation)**:
   $$\text{DSR (\%)} = \frac{\text{Total Monthly Debt Commitments (Bank Loans + Car + Cards)}}{\text{Net Monthly Income}} \times 100$$
   * Target DSR: **$\le 60\%$** (Pass / High Eligibility for 90% margin of finance).
   * Borderline DSR: **$61\% - 70\%$** (Requires co-applicant / joint borrower).
   * Fail DSR: **$> 70\%$** (High risk of bank rejection).

2. **Authority**: Confirm if buyer is the primary loan applicant or buying jointly with spouse/parent.

3. **Need**: Match buyer's target property criteria (budget, location, unit size) with active REN property inventory.

4. **Timeline / Prioritization**: Confirm intention to view and purchase within 30 to 90 days.

---

## 3. Lead Scoring Model (1–100 Points Scale)

Leads are scored across four quantitative pillars totaling 100 points:

| Pillar | Scoring Criteria | Weight / Max Score |
| :--- | :--- | :--- |
| **1. DSR & Financial Capacity** | - DSR $\le 60\%$ (High Loan Approval): **30 pts**<br>- DSR 61%–70% (Borderline / Needs Joint): **20 pts**<br>- DSR > 70% (Bank Loan Fail Risk): **5 pts** | **30 Points** |
| **2. Downpayment Preparedness** | - 10%+ Cash / EPF Account 2 Ready: **25 pts**<br>- 5% Cash + LPPSA / Full Loan Request: **15 pts**<br>- Zero Cash & Dependent on 100% Loan: **5 pts** | **25 Points** |
| **3. Purchase Timeline** | - Immediate (< 30 days): **25 pts**<br>- 1 to 3 months: **15 pts**<br>- > 3 months / Just Browsing: **5 pts** | **25 Points** |
| **4. Responsiveness & Engagement** | - Fast WhatsApp response (< 15 min) + Doc shared: **20 pts**<br>- Slow response (24h) but cooperative: **10 pts**<br>- Unresponsive / Single-word answers: **0 pts** | **20 Points** |

---

## 4. Triage Rules & Pipeline Stage Mapping (ST-01 to ST-10)

Per **ZK-GOV-004**, every lead must be tagged with an official status code based on their qualification score:

```
[ST-01 New Lead] ──> [ST-02 Screening] ──┬──> (Score 80-100) ──> [ST-03 Hot Tier 1] ──> [ST-06 Viewing Booked]
                                        ├──> (Score 50-79)  ──> [ST-04 Warm Tier 2] ──> [ST-06 Viewing Booked]
                                        └──> (Score < 50)   ──> [ST-05 Disqualified] ──> (Archived)
```

| Pipeline Code | Status Name | Total Score | Action & Handover Procedure |
| :--- | :--- | :--- | :--- |
| `ST-01` | `📥 New Lead` | Unscored | Initial raw lead ingested. Trigger <5m WhatsApp welcome (`WA-01`). |
| `ST-02` | `🔍 Screening` | In Progress | Financial DSR questions sent (`WA-02`). Awaiting buyer reply. |
| `ST-03` | `🔥 Tier 1 Hot` | **80 – 100 Pts** | Pre-approved loan capacity. Instant calendar booking for REN viewing (`ST-06`). |
| `ST-04` | `🌤️ Tier 2 Warm` | **50 – 79 Pts** | Needs minor loan adjustment / 1-3 month timeline. Nurture via 14-day cadence. |
| `ST-05` | `🗑️ Tier 3 Disqualified` | **< 50 Pts** | Failed DSR (>70%), no downpayment, or spammer. Tag as archived. |
| `ST-06` | `📅 Viewing Booked` | Qualified | Viewing slot confirmed in REN calendar. Send location & gallery pin. |
| `ST-07` | `🔴 High Ghost Risk` | Unconfirmed | Unresponsive at T-2h verification node. Trigger urgent check call. |
| `ST-08` | `🟢 Viewing Show-Up` | Verified | Buyer physically attended property viewing with REN. |
| `ST-09` | `💰 Deal Closed Won` | Converted | Booking fee paid, S&P signed, commission secured by REN. |
| `ST-10` | `❌ Deal Lost` | Closed | Buyer rejected property post-viewing or purchased elsewhere. |

---

## 5. REN SLA Handover Protocol

1. **Hot Lead Handover (`ST-03`)**:
   - SDR notifies REN via WhatsApp alert within **5 minutes** of qualification.
   - Calendar invite injected into REN's Google Calendar with lead dossier attached (DSR score, income breakdown, budget, preferred viewing time).
2. **Viewing Escalation (`ST-07 High Ghost Risk`)**:
   - If lead does not confirm T-2h verification message, SDR flags `ST-07` in REN dashboard and attempts emergency voice call.
3. **Weekly Pipeline Audit**:
   - Weekly summary report generated for REN showing total leads processed, triage conversion ratios, and pipeline velocity.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-28 | Human Founder & AI SDR | Official release of Lead Qualification SOP (ZK-OPS-004) |
