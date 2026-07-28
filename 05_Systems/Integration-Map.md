---
Title: ZK Nexus Integration Map
ID: IDX-013
Type: Map
Module: 05_Systems
BU: All
Status: Active
Version: 1
Created: 2025-07-16
Updated: 2025-07-16
Owner: Human Founder
Related: IDX-012
---

# ZK Nexus Integration Map

**Purpose:** Visual and textual map of how systems connect to each other.

**Rule:** Updated whenever a new integration is added, removed, or modified.

---

## Current Architecture

```
[Human Founder]
      │
      ├─► ZK Nexus Workspace (Git)
      │       │
      │       ├─► 01_Business (strategy, clients)
      │       ├─► 02_Projects (active work)
      │       ├─► 03_Knowledge (SOPs, frameworks)
      │       ├─► 04_Workforce (AI workers, roles)
      │       ├─► 05_Systems (automation, infra)
      │       ├─► 06_Resources (assets)
      │       ├─► 07_Templates (reusable blueprints)
      │       ├─► 08_Logs (immutable records)
      │       └─► 99_Archive (inactive items)
      │
      ├─► AI Workers (ChatGPT / Claude / Kimi / Codex)
      │       │
      │       ├─► Read from all modules
      │       └─► Write to 02_Projects (staging)
      │
      └─► External Systems (future)
              │
              ├─► WhatsApp Business API
              ├─► Facebook Lead Ads
              ├─► Email Service
              ├─► CRM (Airtable / Baserow / Notion)
              └─► n8n / Make / Zapier
```

---

## System Connections

| System A | Direction | System B | Data Flow | Status |
|----------|-----------|----------|-----------|--------|
| (none) | — | (none) | — | — |

*No active integrations at this time.*

---

## Planned Integrations

| Priority | System A | System B | Purpose | Target |
|----------|----------|----------|---------|--------|
| High | n8n | WhatsApp Business API | Automated lead follow-up | TBD |
| High | n8n | Facebook Lead Ads | Lead capture routing | TBD |
| Medium | CRM | n8n | Lead data storage | TBD |
| Medium | Email | n8n | Appointment confirmations | TBD |
| Low | ZK Nexus (Git) | AI Workers | Automated file sync | Future |

---

## Data Flow Diagrams

### Lead Follow-Up Flow (Planned)

```
Facebook Lead Ad
      │
      ▼
n8n Webhook
      │
      ├─► CRM (Lead record created)
      │
      ├─► WhatsApp API (Welcome message sent)
      │
      └─► Email (Confirmation + next steps)
```

### Client Onboarding Flow (Planned)

```
Client Signs Contract
      │
      ▼
ZK-Operator (AI-002)
      │
      ├─► CRM (Client record created)
      │
      ├─► 02_Projects (Onboarding project created)
      │
      └─► 08_Logs (Decision logged)
```

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2025-07-16 | Human Founder | Created Integration Map with planned architecture |
