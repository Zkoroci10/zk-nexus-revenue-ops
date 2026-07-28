---
Title: ZK Revenue Ops CRM Automation Blueprints
ID: ZK-OPS-005
Type: Specification Document
Module: 01_Business / ZK Revenue Ops
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-07-28
Updated: 2026-07-28
Owner: Human Founder (Zubair Ariff) & AI SDR System
Related: ZK-GOV-001, ZK-GOV-004, SOP-001, ZK-OPS-001, RUL-001
---

# ZK Revenue Ops — CRM Automation Blueprints

> **ZK-OPS-005 | Cetak Biru Automasi CRM, Integrasi Webhook & Enjin AI SDR**

---

## 1. Executive Overview & System Architecture

This blueprint details the automated CRM pipeline infrastructure powering ZK Revenue Ops. The engine bridges lead capture sources (Meta Ads, PropertyGuru, Landing Pages) with the AI SDR Triage Engine and the client REN’s portal (Google Sheets / Notion / Web App).

```
 Meta Ads / Webhook ──> n8n Workflow Router ──> AI SDR Engine (DSR Calc) ──> REN Portal Sync
                              │                                                    │
                              ▼                                                    ▼
                     WhatsApp Webhook API ─────────────────────────────> Google Calendar Sync
```

---

## 2. Event Triggers & Automation Handlers

| Event ID | Event Trigger Source | Operational Action & Handler | Target Output Stage |
| :--- | :--- | :--- | :--- |
| `TRG-01` | Inbound Lead Form Webhook | Ingest raw payload, format phone number to E.164 (`+60`), assign `SEAT-0xx`. | `ST-01 New Lead` |
| `TRG-02` | WhatsApp Initial Reply | Calculate speed-to-lead latency, send initial welcome script (`WA-01`). | `ST-02 Screening` |
| `TRG-03` | DSR Data Received | Extract Net Income & Commitments, compute DSR %, calculate 1-100 score. | `ST-03 Hot` / `ST-04 Warm` / `ST-05 Disqualified` |
| `TRG-04` | Viewing Slot Selected | Generate Google Calendar invite, send confirmation pin (`WA-06`) to buyer. | `ST-06 Viewing Booked` |
| `TRG-05` | T-2h Cron Check | Send automated verification message. If no response in 30 mins, mark flag. | `ST-07 High Ghost Risk` |
| `TRG-06` | REN Viewing Feedback | REN marks show-up in portal, update commission status. | `ST-08 Show-Up` / `ST-09 Closed Won` |

---

## 3. Master Lead Data Field Mapping Schema

Every lead entity processed across webhooks, database instances, and CRM portals adheres to the following field schema:

```json
{
  "lead_id": "LEAD-2026-08912",
  "seat_id": "SEAT-004",
  "ren_name": "Ahmad Property REN",
  "buyer_name": "Farhan Razak",
  "phone": "+60123456789",
  "email": "farhan.razak@example.my",
  "ad_source": "Meta_FB_Condo_PJ_NewLaunch",
  "target_property": "PJ Vista Residences",
  "budget_max": 550000,
  "gross_income": 7500.00,
  "net_income": 6400.00,
  "total_debt_commitments": 2800.00,
  "calculated_dsr_percent": 43.75,
  "downpayment_capacity_pts": 25,
  "qualification_score": 92,
  "pipeline_stage": "ST-03",
  "stage_name": "Tier 1 Hot Lead",
  "viewing_timestamp": "2026-08-02T14:30:00+08:00",
  "is_active": true,
  "created_at": "2026-07-28T09:12:00+08:00",
  "updated_at": "2026-07-28T09:15:30+08:00"
}
```

---

## 4. Webhook Payload Specifications

### 4.1 Inbound Lead Webhook Payload (`POST /api/v1/webhooks/lead-inbound`)
```json
{
  "event": "lead.created",
  "timestamp": "2026-07-28T09:12:00Z",
  "seat_id": "SEAT-004",
  "source": "facebook_lead_ad",
  "payload": {
    "full_name": "Farhan Razak",
    "phone_number": "+60123456789",
    "email": "farhan.razak@example.my",
    "campaign_id": "CMP-PJ-VISTA-01",
    "preferred_location": "Petaling Jaya"
  }
}
```

### 4.2 Qualification & DSR Event Payload (`POST /api/v1/webhooks/qualification-update`)
```json
{
  "event": "lead.qualified",
  "lead_id": "LEAD-2026-08912",
  "seat_id": "SEAT-004",
  "dsr_result": {
    "gross_income": 7500,
    "commitments": 2800,
    "dsr_percentage": 43.75,
    "eligibility_status": "APPROVED"
  },
  "score": 92,
  "assigned_stage": "ST-03",
  "next_action": "TRIGGER_CALENDAR_BOOKING"
}
```

---

## 5. AI SDR Routing Engine & System Prompt Instructions

When processing inbound WhatsApp messages via LLM orchestration (n8n / Apps Script / Python Worker), the AI SDR System executes under the following prompt instructions:

```text
You are ZK-AI-SDR, the virtual assistant for Real Estate Negotiator [Agent Name].
Your objective is to qualify property leads, calculate DSR financial eligibility, and book viewing appointments.

RULES:
1. Always maintain a polite, friendly Malaysian tone (Professional Bahasa Pasar / English).
2. Never promise 100% bank loan approval; state that loan eligibility is based on standard bank DSR guidelines (DSR <= 60%).
3. Calculate DSR using formula: (Total Monthly Debt / Net Monthly Income) * 100.
4. If DSR <= 60%, assign status ST-03 (Tier 1 Hot) and offer viewing slots.
5. If DSR > 70%, assign status ST-05 (Disqualified), suggest lower price range property, and archive.
6. Format all phone numbers to Malaysian standard (+60).
```

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-28 | Human Founder & AI SDR | Official release of CRM Automation Blueprints (ZK-OPS-005) |
