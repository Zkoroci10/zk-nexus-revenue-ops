---
Title: Core Infrastructure Stack Selection for RevOps Engine
ID: LOG-DEC-2026-07-29-03
Type: Log
Module: 08_Logs
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-07-29
Updated: 2026-07-29
Owner: Human Founder / AI Engineering
Related: SYS-001, PRJ-998
---

# Decision Log: Core Infrastructure Stack Selection for RevOps Engine

**Timestamp:** 2026-07-29 18:00:00 +08:00  
**Actor:** Human Founder (CEO Ariff) & AI Engineering  
**Decision Type:** Technical Architecture & Tooling Stack  
**Status:** Active & Implemented  

---

## 1. Context & Problem Statement
To power the ZK Revenue Ops B2B platform reliably without ballooning SaaS overhead or complex DevOps maintenance, a lean, resilient, standard technical stack needed to be defined and locked in.

## 2. Decision Summary
Standardize the RevOps engine infrastructure on the following validated technologies:
1. **Resend.com**: Email notification & transaction API.
2. **Notion API & Databases**: Centralized Lead CRM & Kanban pipeline tracking.
3. **GitHub Pages (Single-Tenant)**: Static Client Portal hosting (`https://zkoroci10.github.io/zk-nexus-revenue-ops/`).
4. **Google Gemini Spark / Gemini 2.0**: Ultra-fast (<500ms) AI parsing for DSR calculation and lead qualification.
5. **Baileys / WA Web Protocol**: WhatsApp outreach and lead nurture transport layer.

## 3. Key Rationale & Rationale Chain
- **Speed to Market**: Serverless static hosting on GitHub Pages combined with Notion API eliminates backend infrastructure costs.
- **Latency**: Gemini Spark delivers sub-second response times required for instant WhatsApp buyer interactions.
- **Reliability**: Resend provides developer-friendly email delivery with verified domain authentication.

## 4. Impacted Systems & Scope
- `05_Systems/` integration scripts (`gemini_spark_integration.js`, daily autopilot).
- Client portal frontend deployment pipeline.

## 5. Log Entry Record

| Timestamp | Actor | Decision | Status |
|-----------|-------|----------|--------|
| 2026-07-29 18:00 | CEO Ariff & AI Eng | Standardized RevOps stack on Resend, Notion CRM, GitHub Pages, Gemini Spark, Baileys | Implemented |

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2026-07-29 | AI Engineering | Formally logged Tech Stack Selection Decision |
