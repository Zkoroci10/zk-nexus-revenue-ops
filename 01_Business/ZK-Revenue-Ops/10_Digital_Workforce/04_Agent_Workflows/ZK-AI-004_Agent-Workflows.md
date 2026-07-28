---
Title: Agent Workflows & Collaboration - ZK Revenue Ops
ID: ZK-AI-004
Type: Digital Workforce System Document
Module: 10_Digital_Workforce / 04_Agent_Workflows / ZK-AI-004
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-25
Updated: 2026-07-25
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-AI-004 — Agent Collaboration Workflows

> **ZK-AI-004 | Aliran Kerjasama Antara Ejen AI & Operator Manusia (Agent Workflows)**

---

## Master Multi-Agent Collaboration Pipeline

```text
[Lead Ingestion] ──> [AI-001: Intake Agent] ──> [AI-002: Lead Cleaner] ──> [AI-003: Scoring AI]
                                                                                  │
                                                                                  ▼
[AI-007: Reporting AI] <── [AI-006: CRM Agent] <── [Human Operator] <── [AI-004/005: Follow-up AI]
```

1. **Phase 1 (Ingestion & Cleaning)**: `AI-001` menangkap payload lead ➔ `AI-002` memformatkan nombor telefon & semak duplikasi.
2. **Phase 2 (Triage & Scoring)**: `AI-003` mengelaskan kelayakan DSR pembeli kepada Tier 1, 2, atau 3.
3. **Phase 3 (Outreach & Approval)**: `AI-004/005` menyediakan cadangan draf mesej ➔ **Human Operator** menyemak & menekan button `Approve & Send`.
4. **Phase 4 (CRM Sync & Audit)**: `AI-006` menyelaraskan fasa status ke Notion Board ➔ `AI-007` menjana Laporan Audit PDF mingguan.

---

## Revision History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-25 | Human Founder & AI AGY | Penulisan rasmi Agent Workflows ZK Revenue Ops (ZK-AI-004) |
