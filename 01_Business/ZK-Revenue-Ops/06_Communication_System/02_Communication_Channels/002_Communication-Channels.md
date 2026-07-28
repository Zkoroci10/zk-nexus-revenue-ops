---
Title: 002 Communication Channels - ZK Revenue Ops
ID: ZK-COM-002
Type: Communication System Document
Module: 06_Communication_System / 02_Communication_Channels / 002
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 002 Communication Channels

## Goal
Menetap dan menguruskan semua saluran komunikasi yang disokong oleh ZK Revenue Ops untuk interaksi prospek, pelanggan REN, dan staf internal.

## Purpose
Memastikan integrasi API dan konsol perbualan di setiap saluran saluran berjalan tanpa gangguan mengikut spesifikasi teknikal.

## Scope
Saluran Utama: WhatsApp, Phone Call, SMS, Email, FB Messenger, Telegram, Future API.

## Trigger
Pilihan saluran ditetapkan berasaskan jenis mesej dan keutamaan prospek.

## Audience
Lead, Client REN, Virtual SDR Operator, Automation System.

## Channel
Multi-Channel Gateway.

---

## 2-Layer Communication Architecture

### Layer 1 — Business Communication (Platform-Agnostic Rules)
1. **Primary Channel Rule**: WhatsApp merupakan **Saluran Utama (90% perbualan)** untuk saringan DSR, follow-up, dan pengesahan temujanji viewing.
2. **Secondary Channel Rule**: Phone Call digunakan untuk kes eskalasi kecemasan atau pembeli yang memohon panggilan terus.
3. **Emergency Fallback Rule**: SMS digunakan sebagai saluran kecemasan sekiranya mesej WhatsApp gagal dihantar (*Undelivered*) pada nod T-2 jam.

### Layer 2 — Channel Implementation (Platform Specifications)
* **WhatsApp**: WhatsApp Business API / Web Console Multi-Device (Limit 50 chat/jam per nombor).
* **Phone Call**: SIP Gateway / Mobile Voice Line (Skrip perbualan min 2 minit).
* **Email**: SMTP Gateway untuk hantaran Laporan Audit Mingguan PDF ke REN.

---

## Message Flow
`Channel Ingestion` ➔ `Channel Router` ➔ `Message Delivery` ➔ `Status Logging`

## Business Rules
* `BR-002` (Data Isolation per Channel), `SLA-004` (System Uptime 99.5%).

## Templates
* All Channel Templates in `03_Message_Library`.

## QA Checklist
- [ ] Pautan WhatsApp active & verified.
- [ ] SMS Gateway fallback teruji.

## KPIs
* **Channel Delivery Rate**: > 98%.

## Related SOP
`SOP-006` (Outreach), `WI-002` (WhatsApp Console)

## Related Workflow
`ZK-WF-001` (Master Workflow)

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Communication Channels ZK Revenue Ops |
