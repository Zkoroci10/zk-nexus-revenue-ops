---
Title: 004 Call Library - ZK Revenue Ops
ID: ZK-COM-004
Type: Communication System Document
Module: 06_Communication_System / 04_Call_Library / 004
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 004 Call Library

## Goal
Menyediakan skrip perbualan suara (*Call Scripts*) untuk panggilan telefon susulan oleh Virtual SDR.

## Purpose
Memastikan panggilan telefon dijalankan secara profesional, pantas mengunci maklumat DSR, dan menetapkan temujanji viewing.

## Scope
Skrip: Opening Script, Discovery Questions, Qualification Questions, Appointment Closing, Voicemail Script, Call Ending.

## Trigger
Lead memohon panggilan terus ATAU kes eskalasi pembeli VIP.

## Audience
Lead Pembeli / Penyewa Hartanah.

## Channel
Panggilan Telefon (Phone Call / SIP Line).

---

## 2-Layer Communication Architecture

### Layer 1 — Business Communication (Call Rules)
1. **30-Second Hook Rule**: 30 saat pertama panggilan wajib menyatakan sebab panggilan secara jelas tanpa berbelik-belik.
2. **70/30 Rule**: Operator mendengar 70% perbualan dan bercakap 30% sahaja.

### Layer 2 — Channel Implementation (Call Scripts)

```text
[Operator]: "Salam Encik [Nama Pembeli], saya [Nama SDR] daripada tim hartanah [Nama REN]. Saya panggil sebab Encik ada mendaftar minat untuk projek [Nama Projek] haritu. Encik ada masa 1 minit untuk saya kongsikan unit yang masih tinggal?"

[Pembeli]: "Boleh, bang."

[Operator]: "Bagus Encik. Projek ni ada rebat khas bulan ni. Sebelum saya hantarkan layout plan, Encik bercadang nak beli untuk duduk sendiri atau pelaburan ya?"
```

---

## Message Flow
`Opening Hook` ➔ `Discovery Questions` ➔ `Qualification` ➔ `Appointment Closing`

## Business Rules
`OR-001` (Waktu Operasi Panggilan 9am-8:30pm).

## Templates
`TMP-CALL-01` hingga `TMP-CALL-05`.

## QA Checklist
- [ ] Pengenalan diri & projek dibuat dalam 30 saat.
- [ ] Slot viewing ditawarkan (Sabtu/Ahad).

## KPIs
* **Call-to-Appointment Rate**: > 25%.

## Related SOP
`SOP-006` (Outreach), `SOP-008` (Appointment Booking)

## Related Workflow
`ZK-WF-001`

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Call Library ZK Revenue Ops |
