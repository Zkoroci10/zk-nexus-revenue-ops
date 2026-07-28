---
Title: AI Security Governance - ZK Revenue Ops
ID: ZK-AI-012
Type: Digital Workforce System Document
Module: 10_Digital_Workforce / 12_AI_Security / ZK-AI-012
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-25
Updated: 2026-07-25
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-AI-012 — AI Security Governance & Prompt Injection Protection

## Core AI Security Controls
1. **Prompt Injection Prevention**: Menapis aksara arahan luar (*System Override Commands*) dari teks perbualan pembeli.
2. **Context Leak Guard**: Menyimpan RLS filter supaya AI tidak terbocor maklumat REN `SEAT-001` kepada `SEAT-002`.
3. **API Key Security**: API keys OpenAI/Claude disimpan secara selamat dalam pembolehubah persekitaran `.env` tempatan.

---

## Revision History
| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-25 | Human Founder & AI AGY | Penulisan rasmi AI Security Governance ZK Revenue Ops |
