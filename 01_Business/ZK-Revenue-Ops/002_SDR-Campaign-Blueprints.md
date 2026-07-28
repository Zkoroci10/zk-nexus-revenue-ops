---
Title: ZK Revenue Ops SDR Campaign Blueprints
ID: ZK-OPS-002
Type: Specification Document
Module: 01_Business / ZK Revenue Ops
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-07-28
Updated: 2026-07-28
Owner: Human Founder (Zubair Ariff) & AI SDR System
Related: ZK-GOV-001, ZK-GOV-004, ZK-OPS-001, RUL-001
---

# ZK Revenue Ops — SDR Campaign Blueprints

> **ZK-OPS-002 | Cetak Biru Kempen SDR Multi-Channel ZK Revenue Ops**

---

## 1. Executive Overview & Campaign Strategy

This document defines the **SDR Campaign Architecture** for ZK Revenue Ops, specifying both inbound lead triage and outbound prospect acquisition workflows for Real Estate Negotiators (RENs) in Malaysia.

By implementing structured, multi-channel cadences across WhatsApp, Cold Email, and LinkedIn, ZK Revenue Ops ensures zero lead drop-off, immediate speed-to-lead response, rigorous Debt Service Ratio (DSR) screening, and maximized viewing attendance.

---

## 2. Inbound & Outbound Campaign Architecture

```
                                INBOUND SDR PIPELINE
Meta Ads / PropertyGuru ──> Instant Webhook ──> <5m WhatsApp ──> DSR Screening ──> Viewing Booked
                                                                       │
                                OUTBOUND SDR PIPELINE                  ▼
REN Database Dump ───────> Multi-touch Cadence ───────────────> Tier 1/2 Lead ──> Cal Sync
```

### 2.1 Inbound Lead Triage Blueprint
* **Lead Sources**: Meta Lead Forms, TikTok Lead Generation, PropertyGuru/iProperty Inquiries, WhatsApp Click-to-Chat ads.
* **Speed-to-Lead Protocol**: Webhook listener triggers AI SDR initial WhatsApp message within 2-5 minutes of form submission.
* **Triage Flow**: Warm greeting -> Inquiry confirmation -> Quick 3-question DSR pre-check (Gross Income, Commitments, Preferred Location) -> Calendar slot booking -> Real-time alert to assigned REN (`SEAT-001..030`).

### 2.2 Outbound Reactivation Blueprint
* **Data Input**: Historical dormant lead database dumps (CSV/Excel) provided by subscribing RENs (minimum 50 raw leads).
* **Objective**: Re-engage cold leads who previously ghosted or went silent > 30 days ago.
* **Execution Flow**: 14-day anti-ghosting multi-channel sequence -> DSR re-assessment -> Re-activation of high-intent buyers for current property inventory.

---

## 3. Target Ideal Customer Profiles (ICPs)

### 3.1 Primary Client ICP — Solo Real Estate Negotiator (REN)
* **Profile**: Active solo property agent operating in Klang Valley, PJ, KL, Penang, or Johor Bahru.
* **Key Pain Points**: Generating 30–100 leads/month but losing > 60% due to slow response, zero structured follow-up, and taking unqualified buyers to physical viewings who later fail bank loan processing.
* **Goal**: Outsource lead qualification & DSR screening so they only spend time meeting verified, high-intent buyers.

### 3.2 Buyer Prospect ICP 1 — First-Time Homebuyer (Subsale & New Launch)
* **Demographics**: Malaysian citizen, Age 25–38, Single or Married couple.
* **Household Income**: RM 4,500 – RM 10,000 / month.
* **Target Property Price**: RM 300,000 – RM 650,000 (Condo / Terrace).
* **Primary Concern**: Monthly mortgage commitment, DSR eligibility, EPF Account 2 withdrawal, LPPSA / bank loan approval rate.

### 3.3 Buyer Prospect ICP 2 — Upgrader & Property Investor
* **Demographics**: Age 35–55, Experienced property owner or investor.
* **Household Income**: > RM 12,000 / month.
* **Target Property Price**: RM 700,000 – RM 1,800,000 (Landed / Luxury High-Rise).
* **Primary Concern**: Rental yield, capital appreciation, ROI, fast transaction execution, minimal agent hassle.

---

## 4. Multichannel Outreach Cadences

### 4.1 WhatsApp-First Cadence (7 Touches over 14 Days)

| Day & Time | Channel | Touchpoint Focus | Script Code & Objective |
| :--- | :--- | :--- | :--- |
| **Day 1 (T+2m)** | WhatsApp | Immediate Welcome & Interest Verification | `WA-01`: Confirm property unit inquiry & ask preferred viewing timeframe. |
| **Day 1 (T+3h)** | WhatsApp | DSR Financial Pre-Screening | `WA-02`: Quick 3-question loan eligibility check (Income vs Commitments). |
| **Day 2 (10:00)** | WhatsApp | Value Hook / Floor Plan & Gallery | `WA-03`: Send exclusive unit video tour & layout plan. |
| **Day 4 (15:00)** | WhatsApp / Call | Soft Check-in & Objection Handling | `WA-04`: Follow up on loan status or location concerns. |
| **Day 7 (11:00)** | WhatsApp | Value Add (Bank Valuation & Promo) | `WA-05`: Share developer rebate / bank valuation update. |
| **Day 10 (16:00)** | WhatsApp | Social Proof / Recent Closed Unit | `WA-06`: Share buyer testimonial & limited unit availability. |
| **Day 14 (18:00)** | WhatsApp | Breakup Message (Re-engagement) | `WA-07`: Gentle breakup message to confirm if property search is closed. |

### 4.2 Cold Email Outreach Cadence (4 Touches over 10 Days)

| Step | Day | Subject Line Pattern | Focus & Call to Action |
| :--- | :--- | :--- | :--- |
| **Email 1** | Day 1 | *Are you losing property commissions to cold leads, [Name]?* | Value proposition of AI SDR + 30-Day Pilot offer (RM 199). CTA: Reply or WhatsApp chat. |
| **Email 2** | Day 3 | *Free DSR Pre-screening Checklist for [Agency Name]* | Value-add framework download. Educational proof on DSR filtering. |
| **Email 3** | Day 6 | *Case Study: How RENs closed 3 extra deals without cold calls* | Client social proof, lead triage stats, viewing show-up rate metrics. |
| **Email 4** | Day 10 | *Closing your file / Permission to archive?* | Soft breakup email prompting quick yes/no response. |

### 4.3 LinkedIn Multichannel Cadence (Property Investor Outreach)

1. **Touch 1 (Day 1)**: Profile Visit + Follow.
2. **Touch 2 (Day 2)**: Connection request with personalized note referencing active market listings.
3. **Touch 3 (Day 4)**: Direct Message introducing high-yield property opportunity or DSR screening service.
4. **Touch 4 (Day 8)**: Share exclusive market report / ROI calculation sheet.

---

## 5. Conversion Targets & Benchmarks

| Metric | Minimum Target Benchmark | Optimal Target Benchmark |
| :--- | :--- | :--- |
| **Speed-to-Lead Compliance** | 90% within < 5 minutes | 98% within < 2 minutes |
| **Inbound Engagement / Response Rate** | >= 45% | >= 65% |
| **Outbound Reactivation Rate** | >= 18% | >= 28% |
| **Qualification Rate (ST-03 Hot / ST-04 Warm)** | >= 40% of engaged leads | >= 55% of engaged leads |
| **Viewing Booking Rate** | >= 25% of qualified leads | >= 35% of qualified leads |
| **Viewing Show-Up Rate (`ST-08`)** | >= 80% | >= 90% |
| **Closed Won Rate (`ST-09`)** | >= 12% of viewings | >= 20% of viewings |

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-28 | Human Founder & AI SDR | Official release of SDR Campaign Blueprints (ZK-OPS-002) |
