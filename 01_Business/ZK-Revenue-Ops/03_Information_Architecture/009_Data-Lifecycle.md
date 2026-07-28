---
Title: Data Lifecycle Architecture - ZK Revenue Ops
ID: ZK-IA-009
Type: Information Architecture Document
Module: 03_Information_Architecture / 009 Data Lifecycle
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 009: Data Lifecycle Architecture

> **ZK-IA-009 | Kitaran Hayat Data (Data Lifecycle)**

---

## Purpose

Dokumen ini mendefinisikan **kitaran hayat data (*Data Lifecycle*)** yang menetapkan transisi status dari saat data dicipta (*Created*) sehingga diarkibkan (*Archived*) secara kekal.

---

## 1. Lead Data Lifecycle Diagram

```text
[Created (Ingestion)] ──> [Verified (Cleaned)] ──> [Active (Triage & Outreach)]
                                                           │
                                             ┌─────────────┴─────────────┐
                                             ▼                           ▼
                                  [Dormant (Cooling Off)]     [Completed (Closed Won)]
                                             │                           │
                                             └─────────────┬─────────────┘
                                                           ▼
                                                  [Archived (Read-Only)]
```

* **Created**: Lead mentah baru mendaftar dari borang iklan.
* **Verified**: Lead disahkan sah (Bukan duplikasi & format nombor telefon betul).
* **Active**: Lead sedang melalui proses saringan DSR, WhatsApp outreach, atau penjadualan viewing.
* **Dormant**: Lead yang tidak bertindak balas selepas 14 hari (Disimpan untuk kempen reactivation).
* **Archived**: Rekod yang tidak aktif diarkibkan secara kekal (Read-only for audit).

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Kitaran Hayat Data ZK Revenue Ops (ZK-IA-009) |
