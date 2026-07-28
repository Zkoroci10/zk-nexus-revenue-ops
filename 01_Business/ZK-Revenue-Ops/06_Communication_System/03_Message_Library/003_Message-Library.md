---
Title: 003 Message Library - ZK Revenue Ops
ID: ZK-COM-003
Type: Communication System Document
Module: 06_Communication_System / 03_Message_Library / 003
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 003 Message Library

## Goal
Menyediakan perpustakaan templat mesej teks standard (*Message Library*) untuk semua fasa perbualan prospek.

## Purpose
Memastikan mesej yang dihantar oleh SDR manusia mahupun bot automasi sentiasa tajam, beretika, dan berkesan.

## Scope
Templat: Introduction, First Contact, Follow-up 1-3, No Response, Revival, Appointment Confirmation, Reminder, Thank You, Lost Lead, Referral, Holiday Greeting.

## Trigger
Pertukaran status lead atau pencetus masa automasi.

## Audience
Prospek Pembeli / Penyewa Hartanah.

## Channel
WhatsApp, SMS, Email.

---

## 2-Layer Communication Architecture

### Layer 1 — Business Communication (Platform-Agnostic Message Rules)
1. **Introduction Rule**: Mesej pertama MESTI memperkenalkan REN, agensi, dan projek hartanah yang dimohon oleh pembeli.
2. **Call-to-Action (CTA) Rule**: Setiap mesej MESTI diakhiri dengan 1 soalan jelas yang mudah dibalas oleh pembeli.

### Layer 2 — Channel Implementation (WhatsApp Message Templates)

#### Template 1: First Contact & DSR Screening (`TMP-MSG-01`)
```text
Salam [Nama Pembeli], saya [Nama SDR] daripada tim perunding hartanah [Nama REN] ([Agensi]). Terima kasih mendaftar minat untuk projek [Nama Projek]! 🏠

Biar saya tolong semakkan unit yang paling padan dengan bajet anda. Boleh tahu ringkas:
1. Belian ni untuk tinggal sendiri atau pelaburan?
2. Bajet bulanan atau kelayakan gaji sekitar berapa ya?
3. Dah pernah semak loan bank sebelum ni?
```

#### Template 2: Follow-up Touchpoint Hari 3 (`TMP-MSG-02`)
```text
Salam [Nama Pembeli], ni gambar & brochure projek [Nama Projek] yang saya janjikan haritu 🏢. Projek ni ada pakej rebat khas bulan ni. Anda lapang tak Sabtu ni jam 11 pagi untuk kita buat viewing unit contoh?
```

---

## Message Flow
`First Contact` ➔ `Screening Message` ➔ `Follow-up Touchpoints` ➔ `Confirmation`

## Business Rules
`OR-001` (Waktu Operasi 9am-8:30pm), `BR-003` (Zero Hard Selling).

## Templates
`TMP-MSG-01` hingga `TMP-MSG-13`.

## QA Checklist
- [ ] Pembolehubah `[Nama Pembeli]` & `[Nama Projek]` diisi tepat.
- [ ] Mesej diakhiri dengan soalan CTA.

## KPIs
* **Message Reply Rate**: > 45%.

## Related SOP
`SOP-006` (Outreach), `SOP-007` (Follow-up)

## Related Workflow
`ZK-WF-002` (Lead Lifecycle)

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Message Library ZK Revenue Ops |
