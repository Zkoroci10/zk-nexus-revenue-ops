---
Title: 007 Client Communication - ZK Revenue Ops
ID: ZK-COM-007
Type: Communication System Document
Module: 06_Communication_System / 07_Client_Communication / 007
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 007 Client Communication

## Goal
Menguruskan semua aliran komunikasi rasmi antara ZK Revenue Ops dan pelanggan Solo REN (Onboarding, Weekly Update, Monthly Report, Issue Notification, Renewal, Offboarding).

## Purpose
Memastikan pelanggan REN mendapat ketelusan 100% dan merasa disokong secara eksklusif sebagai rakan kongsi jualan.

## Scope
Komunikasi Onboarding, Hantaran Laporan Audit Mingguan (Isnin 9am), Mesej Eskalasi Kecemasan, Invois Pembaharuan Retainer.

## Trigger
Kemaskini akaun pelanggan atau pencetus jadual pelaporan.

## Audience
Client Solo REN (Pelanggan Servis 30-Cap).

## Channel
WhatsApp, Email, Notion Portal.

---

## 2-Layer Communication Architecture

### Layer 1 — Business Communication (Client Rules)
1. **Monday Audit Commitment**: Laporan Audit Mingguan WAJIB dihantar pada hari Isnin jam 9:00 AM (`RR-001`).
2. **Immediate Escalation Rule**: Mesej kecemasan (cth: Pembeli sedia bayar deposit) WAJIB dihantar ke WhatsApp REN dalam masa < 15 minit (`ER-002`).

### Layer 2 — Channel Implementation (Templates)

#### Monday Weekly Audit Delivery (WhatsApp to REN)
```text
Salam [Nama REN], Laporan Audit Mingguan ZK Revenue Ops untuk minggu [Tarikh] dah siap! 📊

📈 Ringkasan Mingguan:
- Lead Masuk: [Jumlah]
- Hot Buyers (Tier 1): [Jumlah]
- Viewing Booked: [Jumlah]
- Show-up Rate: [Peratus]%
- Estimated Commission Pipeline: RM[Nilai]

Pautan Notion Client Portal: [URL Portal]
Laporan Audit PDF: [Pautan Document]

Terima kasih atas rakan kongsi eksklusif anda! 🚀
```

---

## Message Flow
`Onboarding Welcome` ➔ `Weekly Audit PDF` ➔ `Emergency Alert` ➔ `Renewal Invoice`

## Business Rules
`RR-001` (Monday 9am), `RR-004` (Low ROI Strategy Audit), `BR-004` (Retainer Renewal).

## Templates
`TMP-CLI-01` hingga `TMP-CLI-06`.

## QA Checklist
- [ ] Laporan audit dihantar sebelum jam 9:00 pagi Isnin.
- [ ] Pautan Notion Client Portal aktif.

## KPIs
* **Client Retention Rate**: > 85%.

## Related SOP
`SOP-010` (Reporting)

## Related Workflow
`ZK-WF-003` (Client Lifecycle), `ZK-WF-007` (Reporting Workflow)

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Client Communication ZK Revenue Ops |
