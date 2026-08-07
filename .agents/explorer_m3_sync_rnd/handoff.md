# 5-Component Handoff Report — Explorer 3 (R3 & R4 R&D / Coding Investigation)

**Agent ID**: `explorer_m3_sync_rnd`  
**Milestones Covered**: M3 (Notion CRM 5-DB Relational Sync Schema) & M4 (Automated Lead Triage & Revival Engine)  
**Workspace**: `C:\Users\Dell\Documents\Projects ZK Nexus`  
**Date**: 2026-08-07  

---

## 1. Observation

Direct code and workspace inspection yielded the following baseline state for Requirements R3 and R4:

### A. Notion 5-Database Relational Sync Engine (`05_Systems/Scripts/notion-crm-sync-engine.js`)
- **Current State**: `notion-crm-sync-engine.js` (ID: `SYS-026`) is initialized as a Node.js REST API client using standard `https` requests (`api.notion.com/v1/`).
- **Database IDs Configured** (lines 30-33):
  1. `DB_BUYER_LEADS`: `3ab9608c-a9d9-8104-924c-c90dc01a789e`
  2. `DB_LISTINGS`: `3ab9608c-a9d9-81ba-8b65-e6f3552aa744`
  3. `DB_DEALS`: `3ab9608c-a9d9-8185-ae5a-f3f7d1a93dda`
  - *Missing in existing script constants*: REN Clients DB (`3ab9608c-a9d9-8041-a1ca-c5ca98284cda`) and Appointments & Viewings DB (`3ab9608c-a9d9-81bc-9988-d421ab700466`).
- **Functionality**: `syncLeadToNotion(lead)` only writes flat properties (`Buyer Name`, `Phone`, `Preferred Location`, `Budget Range`, `Deal Status`) to Database 1. It lacks relation property mapping across the remaining 4 databases.

### B. FastAPI Webhook Server (`05_Systems/Scripts/fastapi-lead-webhook-server.py`)
- **Current State**: `fastapi-lead-webhook-server.py` (ID: `SYS-031`) runs on `PORT = 8085`.
- **Protocol**: Currently implemented using standard Python `http.server.HTTPServer` with `BaseHTTPRequestHandler`.
- **Endpoints**:
  - `GET /health` -> Returns `{"status": "ONLINE", "service": "...", "port": 8085}`.
  - `POST /webhook/lead` & `POST /api/v1/leads` -> Ingests JSON, logs lead to `08_Logs/AI-Logs/live_webhooks_intake.json`.
- **Gaps**: Lacks formal FastAPI `FastAPI()` app object with Uvicorn server launcher, Pydantic `BaseModel` request validation schemas, automated DSR triage scoring (<40% DSR trigger for Tier 1 Pre-Approved), and auto-forwarding to Notion CRM sync.

### C. DSR Speed-to-Lead Triage Engine (`05_Systems/Scripts/10k-lead-dedup-triage-engine.js`)
- **Current State**: `10k-lead-dedup-triage-engine.js` (ID: `SYS-027`) provides high-performance DSR calculation in `calculateDSR(grossIncome, monthlyCommitments)`:
  - Net Income Formula: `grossIncome * 0.87` (accounting for EPF 11%, SOCSO, Tax).
  - DSR Ratio Formula: `(commitments / netIncome) * 100`.
- **Triage Criteria Requirement R4**: Instant speed-to-lead scoring where **DSR < 40% = Tier 1 Pre-Approved**.

### D. WhatsApp Malay Revival Engine & OP-016 Framework
- **Current State**: 
  - `05_Systems/Scripts/whatsapp-outreach-automator.js` (ID: `SYS-025`) automates WhatsApp Web via Playwright Chromium.
  - `01_Business/ZK-Revenue-Ops/Operations/BATCH_1_OUTREACH_REVIEW_KIT.md` (ID: `OP-016`) details the 3-stage conversational Malay copy tailored for Zubair (Founder tone, Subang/Shah Alam/KL territories).

---

## 2. Logic Chain

From the observed code structure and project constraints, the implementation logic flows as follows:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          INBOUND LEAD SOURCES                                   │
│            (Facebook Ads / TikTok Ads / Web Forms / CSV Ingestion)              │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│               Fastapi Lead Intake Webhook Server (Port 8085)                     │
│                    `fastapi-lead-webhook-server.py`                             │
│  - Endpoint: POST /webhook/lead                                                 │
│  - Pydantic Schema Validation (LeadIntakeSchema)                                 │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    INSTANT DSR SPEED-TO-LEAD TRIAGE ENGINE                      │
│  - Net Income = Gross Income * 0.87                                             │
│  - DSR Ratio % = (Monthly Commitments / Net Income) * 100                        │
│  - IF DSR < 40% ──► Tag: "Tier 1: Pre-Approved" ──► High Priority Route          │
│  - IF DSR 40-60% ─► Tag: "Tier 2: Qualified Bank Loan"                          │
│  - IF DSR 60-75% ─► Tag: "Tier 3: Joint Loan Needed"                            │
│  - IF DSR > 75%  ─► Tag: "Tier 4: High Risk DSR"                               │
└──────────────────┬──────────────────────────────────────────────┬───────────────┘
                   │                                              │
                   ▼                                              ▼
┌─────────────────────────────────────┐        ┌──────────────────────────────────┐
│ NOTION 5-DB RELATIONAL SYNC ENGINE  │        │   STALE LEAD REVIVAL TRIGGER     │
│   `notion-crm-sync-engine.js`       │        │  (Days Stale > 14 Days Dormant)  │
│  1. Buyer Leads DB                  │        └────────────────┬─────────────────┘
│  2. Property Listings DB            │                         │
│  3. Deals & Pipeline DB             │                         ▼
│  4. REN Clients / Retainers DB      │        ┌──────────────────────────────────┐
│  5. Appointments & Viewings DB      │        │  OP-016 WHATSAPP MALAY REVIVAL   │
│  - Bi-directional HTTP REST payload │        │   3-Stage Conversational Copy    │
│  - Relational mapping IDs           │        │   Playwright WhatsApp Automator  │
└─────────────────────────────────────┘        └──────────────────────────────────┘
```

### Step 1: Notion 5-Database Relational Schema Design (Requirement R3)
To ensure Notion remains fast and un-cluttered while managing thousands of leads across multiple REN clients (REN-001, REN-002, REN-003), we map 5 interconnected databases:

1. **Buyer Leads DB** (`3ab9608c-a9d9-8104-924c-c90dc01a789e`)
   - `Buyer Name` (Title)
   - `Phone` (Phone)
   - `Project / Preferred Location` (Rich Text)
   - `Income` (Number)
   - `Commitments` (Number)
   - `DSR Ratio (%)` (Number)
   - `Loan Tier` (Select: `Tier 1: Pre-Approved`, `Tier 2: Qualified`, `Tier 3: Joint Loan`, `Tier 4: High Risk`)
   - `Assigned REN` (Relation -> `REN Clients DB`)
   - `Matched Property` (Relation -> `Property Listings DB`)
   - `Active Deal` (Relation -> `Deals & Pipeline DB`)

2. **Property Listings DB** (`3ab9608c-a9d9-81ba-8b65-e6f3552aa744`)
   - `Listing Title` (Title)
   - `Location` (Rich Text / Select: `Subang Jaya`, `Shah Alam`, `Damansara/PJ Core`)
   - `Price (RM)` (Number)
   - `Assigned REN Agent` (Relation -> `REN Clients DB`)
   - `Interested Buyers` (Relation -> `Buyer Leads DB`)

3. **Deals & Pipeline DB** (`3ab9608c-a9d9-8185-ae5a-f3f7d1a93dda`)
   - `Deal Name` (Title)
   - `Deal Stage` (Select: `New Inquiry`, `Viewing Scheduled`, `Negotiation`, `Booking Placed`, `Closed Deal`, `Lost`)
   - `Commission Value (RM)` (Number - 3% of Price)
   - `Retainer Client` (Relation -> `REN Clients DB`)
   - `Buyer Lead` (Relation -> `Buyer Leads DB`)

4. **REN Clients / Retainers DB** (`3ab9608c-a9d9-8041-a1ca-c5ca98284cda`)
   - `REN Client Name` (Title e.g. `REN-001 Subang Specialist`)
   - `Territory Zone` (Select: `Subang Jaya / USJ`, `Shah Alam Seksyen 7/13`, `Damansara / PJ Core`)
   - `Retainer Tier` (Select: `RM 500/mo Starter`, `RM 1,000/mo Pro`, `RM 1,500/mo Enterprise`)
   - `Active Lead Count` (Number / Rollup)
   - `Assigned Buyer Leads` (Relation -> `Buyer Leads DB`)
   - `Listings Handled` (Relation -> `Property Listings DB`)
   - `Active Deals` (Relation -> `Deals & Pipeline DB`)

5. **Appointments & Viewings DB** (`3ab9608c-a9d9-81bc-9988-d421ab700466`)
   - `Appointment Subject` (Title)
   - `Buyer Lead` (Relation -> `Buyer Leads DB`)
   - `REN Agent` (Relation -> `REN Clients DB`)
   - `Viewing Date & Time` (Date)
   - `Location / Unit No` (Rich Text)
   - `Status` (Select: `Scheduled`, `Confirmed`, `Completed`, `Cancelled`, `Rescheduled`)

### Step 2: FastAPI Lead Intake Webhook Server Specification (Requirement R4)
The server module `05_Systems/Scripts/fastapi-lead-webhook-server.py` must support dual execution modes (Native `FastAPI` + `uvicorn` when packages are installed, with standard library `http.server` fallback):
- **Port**: `8085`
- **Host**: `0.0.0.0` or `localhost`
- **Request Pydantic Model**:
```python
class LeadIntakePayload(BaseModel):
    name: str
    phone: str
    project: str = "General Property Inquiry"
    income: float = 5000.0
    commitments: float = 1500.0
    tenant_id: Optional[str] = "REN-001"
```
- **Instant Speed-to-Lead Scoring**:
  - Computes `net_income = income * 0.87`
  - Computes `dsr_ratio = (commitments / net_income) * 100`
  - If `dsr_ratio < 40.0`:
    - `loan_tier = "Tier 1: Pre-Approved LPPSA/Bank"`
    - `priority = "HIGH_SPEED_PRIORITY"`
    - Triggers immediate sync payload dispatch to Notion CRM.

### Step 3: OP-016 WhatsApp Malay Revival Sequence Specification (Requirement R4)
For leads flagged as dormant (`daysStale > 14`), the revival engine executes the 3-stage conversational Malay sequence using Zubair's authentic founder voice:

- **Stage 1 (Hook / Curiosity)**:
  > *"Salam Tuan [Name], saya Zubair dari ZK Revenue Ops. Saya nampak listing [Project] Tuan. Boleh saya tanya soalan pendek pasal buyer follow-up?"*
- **Stage 2 (Problem Agitation & Lead Revival)**:
  > *"Biasanya dekat area [Territory] ramai buyer bertanyakan harga tapi bila semak DSR bank loan terus sangkut atau senyap. Tuan ada simpan lead lama terbiar lebih 14 hari tak?"*
- **Stage 3 (Solution Pitch & Demo Link)**:
  > *"Kami ada enjin VA SDR untuk rawat lead lama & auto-tapis DSR bank loan. Tuan boleh cuba portal demo percuma di sini: https://zkoroci10.github.io/zk-nexus-revenue-ops/"*

---

## 3. Caveats

1. **Notion API Rate Limits**: Notion enforces a rate limit of 3 requests per second per integration. `notion-crm-sync-engine.js` must implement a 350ms delay between consecutive REST calls during bulk syncs to avoid `429 Too Many Requests`.
2. **WhatsApp Web Session State**: `whatsapp-outreach-automator.js` requires a valid persistent Chrome profile (`USER_DATA_DIR`). If the WhatsApp Web QR code session expires, manual QR scan in browser is required before automated dispatch can proceed.
3. **Environment Port Binding**: Port `8085` must be available on the local machine. If port 8085 is blocked, ensure firewall permissions allow local TCP binding.

---

## 4. Conclusion & Technical Implementation Blueprints

### A. Notion 5-DB Bi-Directional REST Payload Blueprint (`notion-crm-sync-engine.js`)

Below is the production-ready implementation spec for `05_Systems/Scripts/notion-crm-sync-engine.js`:

```javascript
/**
 * Notion CRM 5-Database Relational Sync Engine (SYS-026)
 */
const NOTION_TOKEN = process.env.NOTION_API_KEY || '';
const NOTION_VERSION = '2022-06-28';

const DB_IDS = {
    BUYER_LEADS:  '3ab9608c-a9d9-8104-924c-c90dc01a789e',
    LISTINGS:     '3ab9608c-a9d9-81ba-8b65-e6f3552aa744',
    DEALS:        '3ab9608c-a9d9-8185-ae5a-f3f7d1a93dda',
    REN_CLIENTS:  '3ab9608c-a9d9-8041-a1ca-c5ca98284cda',
    APPOINTMENTS: '3ab9608c-a9d9-81bc-9988-d421ab700466'
};

// Relation payload builder for Notion API v1
function buildNotion5DbLeadPage(lead, renPageId, listingPageId) {
    const netIncome = lead.income * 0.87;
    const dsrRatio = Number(((lead.commitments / netIncome) * 100).toFixed(1));
    const isTier1 = dsrRatio < 40.0;
    const loanTier = isTier1 ? 'Tier 1: Pre-Approved LPPSA/Bank' :
                     dsrRatio <= 60 ? 'Tier 2: Qualified Bank Loan' :
                     dsrRatio <= 75 ? 'Tier 3: Joint Loan Needed' : 'Tier 4: High Risk DSR';

    return {
        parent: { database_id: DB_IDS.BUYER_LEADS },
        properties: {
            'Buyer Name': { title: [{ text: { content: lead.name } }] },
            'Phone': { phone_number: lead.phone },
            'Preferred Location': { rich_text: [{ text: { content: lead.project } }] },
            'Gross Income': { number: Number(lead.income) },
            'Monthly Commitments': { number: Number(lead.commitments) },
            'DSR Ratio (%)': { number: dsrRatio },
            'Loan Tier': { select: { name: loanTier } },
            'Assigned REN': renPageId ? { relation: [{ id: renPageId }] } : undefined,
            'Matched Property': listingPageId ? { relation: [{ id: listingPageId }] } : undefined
        }
    };
}
```

### B. FastAPI Server Specification (`fastapi-lead-webhook-server.py`)

Below is the production-ready code specification for `05_Systems/Scripts/fastapi-lead-webhook-server.py`:

```python
"""
FastAPI / Python Local Webhook Server (SYS-031) - Port 8085
"""
import json
import os
import sys
from typing import Optional

PORT = 8085
WORKSPACE_ROOT = r"C:\Users\Dell\Documents\Projects ZK Nexus"
LEADS_LOG_PATH = os.path.join(WORKSPACE_ROOT, "08_Logs", "AI-Logs", "live_webhooks_intake.json")

def calculate_dsr_triage(income: float, commitments: float):
    net_income = income * 0.87
    dsr_ratio = round((commitments / net_income) * 100, 1) if net_income > 0 else 99.9
    
    if dsr_ratio < 40.0:
        tier = "Tier 1: Pre-Approved LPPSA/Bank"
        is_preapproved = True
    elif dsr_ratio <= 60.0:
        tier = "Tier 2: Qualified Bank Loan"
        is_preapproved = False
    elif dsr_ratio <= 75.0:
        tier = "Tier 3: Joint Loan Needed"
        is_preapproved = False
    else:
        tier = "Tier 4: High Risk DSR"
        is_preapproved = False
        
    return {
        "net_income": round(net_income, 2),
        "dsr_ratio": dsr_ratio,
        "tier": tier,
        "is_preapproved": is_preapproved
    }
```

---

## 5. Verification Method

To independently verify the implementation of R3 and R4:

### 1. Verify FastAPI Server on Port 8085
Run the server and perform a webhook POST test:
```powershell
# Terminal 1: Start FastAPI server
python "C:\Users\Dell\Documents\Projects ZK Nexus\05_Systems\Scripts\fastapi-lead-webhook-server.py"

# Terminal 2: Test Health Check & Webhook Intake
Invoke-RestMethod -Uri "http://localhost:8085/health" -Method Get
Invoke-RestMethod -Uri "http://localhost:8085/webhook/lead" -Method Post -ContentType "application/json" -Body '{"name":"Ahmad Test","phone":"+60123456789","project":"Subang Parksuites","income":8000,"commitments":2000}'
```
*Expected Output*: DSR ratio = 28.7%, Tier = "Tier 1: Pre-Approved LPPSA/Bank", `is_preapproved` = True, status HTTP 200.

### 2. Verify Notion 5-DB Sync Script
Run the sync script in dry-run/sync mode:
```powershell
node "C:\Users\Dell\Documents\Projects ZK Nexus\05_Systems\Scripts\notion-crm-sync-engine.js"
```
*Expected Output*: Reads leads from CSV/JSON, formats Notion REST API payloads for all 5 relational databases, exits with code 0.

### 3. Verify ZNS Metadata Standard Compliance
Run the workspace ZNS validator:
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Dell\Documents\Projects ZK Nexus\05_Systems\Scripts\validate-zns.ps1"
```
*Expected Output*: "All workspace files pass ZNS validation standards!" (0 non-compliant files).
