---
Title: ZK Revenue Ops — CRM Database Schema (Internal CRM)
ID: ZK-OPS-007
Type: Technical Specification
Module: 01_Business / ZK-Revenue-Ops / Sales
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-07-18
Updated: 2026-07-28
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# ZK Revenue Ops — CRM Database Schema (Internal CRM)
ID: BUS-001 Outreach Database Schema
Status: Active
Version: 1.0

This document defines the schema, worksheets, column mappings, data validation values, and key formulas for the ZK Revenue Ops internal client pipeline CRM.

---

## 1. Sheet: `Dashboard`
Provides a high-level summary of the sales pipeline, total prospects, signed deals, conversion rates, and status breakdowns.

### 1.1 KPI Summaries (Row 5 - Row 8)
- **B5:B8 - TOTAL PROSPECTS:** Counts total REN prospects in the database.
  - Formula: `=COUNTA(Prospects!B4:B)`
- **C5:C8 - ACTIVE (WARM/HOT):** Sum of warm and hot prospects in active outreach stages.
  - Formula: `=COUNTIF(Prospects!H4:H,"Warm")+COUNTIF(Prospects!H4:H,"Hot")`
- **D5:D8 - SIGNED:** Total number of property agents who signed up for pilot or campaigns.
  - Formula: `=COUNTIF(Prospects!H4:H,"Signed")`
- **E5:E8 - CONVERSION RATE:** Percentage of prospects successfully signed.
  - Formula: `=IFERROR(TEXT(COUNTIF(Prospects!H4:H,"Signed")/COUNTA(Prospects!B4:B),"0%"),"—")`

### 1.2 Status Breakdown Table (Row 11 - Row 17)
- **Columns:** `STATUS` (Col B), `COUNT` (Col C), `%` (Col D)
- **Status Rows:**
  - **Cold:** Count `=COUNTIF(Prospects!H:H,"Cold")`
  - **Warm:** Count `=COUNTIF(Prospects!H:H,"Warm")`
  - **Hot:** Count `=COUNTIF(Prospects!H:H,"Hot")`
  - **Signed:** Count `=COUNTIF(Prospects!H:H,"Signed")`
  - **Lost:** Count `=COUNTIF(Prospects!H:H,"Lost")`

---

## 2. Sheet: `Prospects`
The primary outbound prospecting funnel. It stores lead contact information, outreach status, and active touch progression.

| Col Letter | Col Number | Header Name | Format / Validation | Description |
|---|---|---|---|---|
| **A** | 1 | (Spacer) | - | Left margin spacer |
| **B** | 2 | NAMA REN | Plain Text | Name of the Real Estate Negotiator |
| **C** | 3 | DAERAH | Plain Text | Focus area/district (e.g. Shah Alam) |
| **D** | 4 | NEGERI | Plain Text | Focus state (e.g. Selangor) |
| **E** | 5 | AGENCY | Plain Text | Realty firm (e.g. IQI Realty) |
| **F** | 6 | CONTACT (WA) | Plain Text / Numbers | Phone number (e.g. 0182233445) |
| **G** | 7 | MEDIA SOSIAL | Dropdown | `Facebook`, `Instagram`, `LinkedIn`, `Referral`, `Lain-lain` |
| **H** | 8 | STATUS | Dropdown | `Cold`, `Warm`, `Hot`, `Signed`, `Lost` |
| **I** | 9 | KEPERLUAN | Plain Text | Pain points / requirements (e.g. "needs viewing slot setup") |
| **J** | 10 | TOUCH | Number | Total WhatsApp touches sent (automated increment) |
| **K** | 11 | LAST CONTACT | Date (`d MMM yyyy`) | Timestamp of last outreach (auto-filled on click) |
| **L** | 12 | NEXT FOLLOW-UP | Date (`d MMM yyyy`) | Target date for next outreach |
| **M** | 13 | FOLLOW-UP NOTES | Plain Text | Brief status notes |
| **N** | 14 | (Spacer) | - | Right margin spacer |

---

## 3. Sheet: `Active Clients`
Accounts that have successfully signed up and are in active delivery stages.

| Col Letter | Col Number | Header Name | Format / Validation | Description |
|---|---|---|---|---|
| **A** | 1 | (Spacer) | - | Left margin spacer |
| **B** | 2 | CLIENT NAME | Plain Text | Real estate negotiator's name |
| **C** | 3 | AGENCY | Plain Text | Realty firm |
| **D** | 4 | SIGN DATE | Date (`d MMM yyyy`) | The date SOW/MSA was signed |
| **E** | 5 | LINK TO CLOSING DESK | Underlined Hyperlink | Google Sheet link to the client's individual lead desk |
| **F** | 6 | STATUS | Dropdown | `Active`, `On Hold`, `Terminated` |
| **G** | 7 | NOTES | Plain Text | General delivery notes |
| **H** | 8 | (Spacer) | - | Right margin spacer |

---

## 4. Sheet: `Activity Log`
Historical record of every outbound touch made by the system or the VA.

| Col Letter | Col Number | Header Name | Format / Validation | Description |
|---|---|---|---|---|
| **A** | 1 | (Spacer) | - | Left margin spacer |
| **B** | 2 | TIMESTAMP | Date-Time (`d MMM yyyy h:mm am/pm`)| Auto-timestamp when touch is made |
| **C** | 3 | REN NAME | Plain Text | Name of the contacted REN |
| **D** | 4 | CHANNEL | Dropdown | `WhatsApp`, `Call`, `Instagram`, `Facebook`, `Email` |
| **E** | 5 | RESPONSE | Dropdown | `No Reply`, `Seen`, `Replied`, `Interested`, `Not Interested`, `Appointment Set` |
| **F** | 6 | TOUCH | Number | Which touch stage was sent (T1-T7) |
| **G** | 7 | STATUS UPDATE | Dropdown | `Cold`, `Warm`, `Hot`, `Signed`, `Lost`, `—` |
| **H** | 8 | NOTES | Plain Text | Touch details (e.g. "WhatsApp sent automatically") |
