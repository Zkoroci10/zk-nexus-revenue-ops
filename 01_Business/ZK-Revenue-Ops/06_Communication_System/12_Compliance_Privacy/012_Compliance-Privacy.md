---
Title: 012 Compliance & Privacy - ZK Revenue Ops
ID: ZK-COM-012
Type: Communication System Document
Module: 06_Communication_System / 12_Compliance_Privacy / 012
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 012 Compliance & Privacy

## Goal
Menguatkuasakan pematuhan undang-undang perkhidmatan komunikasi (*Compliance & Privacy Rules*) mengikut Akta Perlindungan Data Peribadi 2010 (PDPA Malaysia).

## Purpose
Memastikan ZK Revenue Ops, pelanggan REN, dan operator mematuhi etika privasi data dan hak prospek.

## Scope
PDPA Guidelines, Consent Rules, Do Not Contact (DNC) Registry, Data Confidentiality, Message Retention, Communication Audit.

## Trigger
Tindakan penghantaran mesej atau permohonan pemadaman data oleh prospek.

## Audience
Lead Pembeli, Client REN, SDR Operator, AI Agents.

## Channel
Semua Saluran Komunikasi.

---

## 2-Layer Communication Architecture

### Layer 1 — Business Communication (Legal & Privacy Rules)
1. **PDPA Consent Clause**: Semua borang intake & mesej WhatsApp pertama wajib mengandungi notis kebenaran pemprosesan data ringkas.
2. **Immediate DNC Compliance**: Sekiranya prospek memohon untuk tidak dihubungi (*Stop / Opt-Out / Do Not Contact*), sistem WAJIB menghentikan perbualan serta merta.
3. **Data Retention Limits**: Log perbualan WhatsApp disimpan untuk tempoh maksimum 24 bulan bagi tujuan audit sebelum diarkibkan.

### Layer 2 — Channel Implementation (Privacy Notices)

```text
[Notis Privasi WhatsApp Ringkas]:
"Nota Privasi: Maklumat anda dilindungi di bawah PDPA 2010 dan hanya digunakan untuk urusan saringan hartanah [Nama Projek]. Balas 'STOP' untuk menghentikan mesej."
```

---

## Message Flow
`Consent Check` ➔ `Communication Active` ➔ `Opt-Out Trigger` ➔ `Immediate DNC Archive`

## Business Rules
`DG-002` (PDPA Compliance), `SR-001` (Data Ownership), `SR-002` (Zero Data Selling).

## Templates
`TMP-PRIV-01` (PDPA Consent Notice).

## QA Checklist
- [ ] Notis privasi diselitkan dalam borang intake.
- [ ] Permintaan DNC dipatuhi 100% serta-merta.

## KPIs
* **PDPA Violation Rate**: 0% (Zero Tolerance).

## Related SOP
`SOP-012` (Archive)

## Related Workflow
`ZK-WF-008` (Exception Workflow)

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Compliance & Privacy ZK Revenue Ops |
