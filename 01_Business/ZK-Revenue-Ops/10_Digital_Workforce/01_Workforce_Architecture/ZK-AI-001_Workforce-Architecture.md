---
Title: Digital Workforce Architecture - ZK Revenue Ops
ID: ZK-AI-001
Type: Digital Workforce System Document
Module: 10_Digital_Workforce / 01_Workforce_Architecture / ZK-AI-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-25
Updated: 2026-07-25
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-AI-001 — Digital Workforce Architecture

> **ZK-AI-001 | Carta Organisasi & Seni Bina Tenaga Kerja Digital (AI & Human Workforce Org Chart)**

---

## Goal
Menetap dan menguatkuasakan carta organisasi tenaga kerja digital (*AI & Human Digital Workforce Org Chart*) yang menggabungkan ejen AI, automasi, dan operator manusia dalam satu struktur operasi berkesinambungan.

## Business Objective
Membolehkan ZK Revenue Ops beroperasi dengan nisbah efisiensi 10x ganda (*10x Operational Leverage*) di mana 1 Human Operator berupaya menyelia 10–30 akaun REN dengan bantuan Ejen AI.

## Role
AI & Human Hybrid Workforce Architect.

## Mission
Mengasingkan skop kerja manusia (judgement, empati, penutupan jualan) daripada skop kerja AI (ingestion, triage, follow-up suggestion, reporting).

---

## Digital Workforce Organization Chart (Carta Organisasi AI)

```text
                               ┌─────────────────────────────────────────┐
                               │     HUMAN FOUNDER (Zubair Ariff)        │
                               └────────────────────┬────────────────────┘
                                                    │
                               ┌────────────────────┴────────────────────┐
                               │       AI CHIEF OF STAFF (AI-010)        │
                               └────────────────────┬────────────────────┘
                                                    │
         ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
         ▼                                          ▼                                          ▼
  REVENUE OPS MANAGER                       HUMAN SDR OPERATOR                        QUALITY & KNOWLEDGE
  • AI Lead Intake (AI-001)                 • Human Judgment & Empathy                 • AI QA Assistant (AI-008)
  • AI Lead Cleaner (AI-002)                • Escalation & Closing Check               • AI Knowledge Agent (AI-009)
  • AI Lead Scoring (AI-003)                • Final Message Approval
  • AI Outreach Agent (AI-004)
  • AI Follow-up Agent (AI-005)
  • AI CRM Assistant (AI-006)
  • AI Report Analyst (AI-007)
```

---

## Input
Metadata peristiwa perniagaan, fail intake lead, & balasan chat WhatsApp.

## Knowledge Sources
Dokumen Phase 01 hingga Phase 09 (Foundation, Governance, IA, Workflows, SOPs, Comms, Analytics, Automation, & Software Specs).

## Tools
Notion API, n8n Orchestrator, PocketBase SQL, Baileys WhatsApp Gateway, OpenAI / Claude LLM Engines.

## Workflow
`Lead Arrival` ➔ `AI Ingestion & Cleaning` ➔ `AI Triage` ➔ `AI Suggestion` ➔ `Human Approval` ➔ `AI Report Generation`.

## Business Rules
`BR-001` (30-Cap Seats), `BR-003` (Zero Hard Selling), `OR-004` (Human Approval Point Rule).

## Permissions
* Human Operator: Total Control over Message Approvals & Escalations.
* AI Agents: Restricted Execution based on `ZK-AI-008` Permission Matrix.

## Escalation (Human-AI Handoff)
Ejen AI WAJIB menyerahkan perbualan kepada Human Operator apabila dikesan aduan emosi, permintaan negotiate harga khas, atau pertukaran tarikh viewing.

## KPIs
* **Automation Coverage Ratio**: > 80% tugas rutin dikendalikan AI.
* **Human Escalation Precision**: < 5% kesesatan eskalasi.

## Monitoring
Pemantauan real-time via Dashboard `ZK-DASH-003` & Log Telegram Alert.

## Risks
Halusinasi AI atau kebocoran data RLS merentasi seat REN.

## Future Improvements
Ejen suara AI (*AI Voice Calling Agent*) untuk membuat panggilan saringan awal secara automatik.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-25 | Human Founder & AI AGY | Penulisan rasmi Digital Workforce Architecture ZK Revenue Ops |
