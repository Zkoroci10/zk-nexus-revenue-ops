---
Title: Feature Spec: Lead Management Engine - ZK Revenue Ops
ID: ZK-FEAT-001
Type: Feature Specification Document
Module: 09_Software_Specification / 05_Feature_Specification / ZK-FEAT-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-FEAT-001 — Lead Management Engine

## Goal
Menguruskan kemasukan lead mentah, normalisasi nombor telefon, pengesahan format `VR-001`, dan deduplikasi 30 hari secara automatik.

## User
SDR Operator & System Bot.

## Problem
Data lead bertindih dan format nombor telefon rosak merendahkan kadar respon perbualan.

## Input
Webhook Ingestion Payload / CSV Upload (`full_name`, `phone_number`, `project_name`).

## Workflow
`Raw Payload` ➔ `Regex Cleaner (+601...)` ➔ `30-Day Index Lookup` ➔ `Ingest to Database`.

## UI Components
* Import Button & CSV Mapper Table.
* Lead Profile Card with DSR Badge.
* Status Badge Selector (`NEW`, `VERIFIED`, `QUALIFIED`, `APPOINTMENT`).

## Business Rules
`VR-001` (Phone Format), `LR-001` (Mandatory Fields), `LR-002` (No Hard Delete).

## Permissions
* Operator: View & Edit Assigned Leads.
* REN Client: View Own Leads Only.

## Edge Cases
* Nombor telefon tidak mempunyai akaun WhatsApp ➔ Tag `🗑️ Tier 3 Disqualified (Invalid Number)`.

## Output
Rekod Lead disahkan bersih dan terikat dengan `SEAT-NNN` REN.

## KPI
* **Clean Ingestion Rate**: 100%.

---

## Revision History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Lead Management Feature Spec (ZK-FEAT-001) |
