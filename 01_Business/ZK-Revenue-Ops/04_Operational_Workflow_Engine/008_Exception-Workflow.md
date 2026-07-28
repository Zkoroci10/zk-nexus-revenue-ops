---
Title: Exception Workflow - ZK Revenue Ops
ID: ZK-WF-008
Type: Operational Workflow Engine Document
Module: 04_Operational_Workflow_Engine / 008 Exception Workflow
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 008: Exception Workflow

> **ZK-WF-008 | Enjin Penanganan Pengecualian & Isu Tidak Normal (Exception Engine)**

---

## Workflow Name
**Abnormal Operational Exception Handling Workflow**

## Goal
Menyediakan aliran pemprosesan automatik bagi mengendalikan situasi tidak normal (*Exception Scenarios*) seperti lead duplikasi, nombor telefon salah, pembatalan temujanji, atau permintaan menghentikan mesej (*Opt-out*) tanpa menjejaskan integriti sistem.

---

## Master Exception Scenarios (4 Senario Pengecualian)

### 1. Scenario: Duplicate Lead (Lead Duplikasi)
```text
  [Duplicate Lead Detected] ──> [Semak Sumber & Rekod Asal] ──> [Gabungkan Log Perbualan (Merge)] ──> [Tag "Duplicate Archived"]
```
* **Trigger**: Nombor telefon yang sama dimasukkan dalam tempoh < 30 hari.
* **Resolution**: Sistem menggabungkan log perbualan baharu ke dalam kad lead asal dan menandakan rekod baharu sebagai *Duplicate Archived*.

### 2. Scenario: Wrong / Invalid Phone Number (Nombor Salah/Rosak)
```text
  [Mesej WhatsApp Undelivered] ──> [Semak Format Nombor] ──> [Tag "Invalid Phone Number"] ──> [End Workflow]
```
* **Trigger**: Webhook WhatsApp API mengembalikan status error `UNDELIVERABLE / NO_WHATSAPP_ACCOUNT`.
* **Resolution**: Sistem menandakan lead sebagai `🗑️ Tier 3 Disqualified (Invalid Number)` dan menghentikan semua workflow susulan.

### 3. Scenario: Appointment Cancellation (Pembatalan Temujanji)
```text
  [Pembeli Batal Viewing] ──> [Tawarkan 2 Slot Masa Baharu] ──> [If Agreed: Reschedule Calendar]
                                                                        │
                                                                        ▼
                                                             [If Refused: Tag "Closed Lost"]
```
* **Trigger**: Pembeli membalas "2" (Batal/Tukar Tarikh) pada nod T-24j atau T-2j.
* **Resolution**: Bot/SDR menawarkan 2 slot masa baharu. Jika pembeli bersedia, jadual semula kalendar; jika pembeli menolak secara muktamad, tukar status ke `❌ Deal Lost`.

### 4. Scenario: Opt-Out / Stop Messaging Request (Permintaan Henti Mesej)
```text
  [Mesej "STOP / JANGAN CHAT"] ──> [Sertamerta Hentikan Sequences] ──> [Tag "Archived (Opt-Out)"] ──> [End Workflow]
```
* **Trigger**: Prospek membalas mesej mengandungi kata kunci penolakan (*Stop, Jangan Chat, Block*).
* **Resolution**: Mematuhi PDPA 2010 — sistem serta-merta menghentikan semua siri mesej automasi dan menandakan akaun sebagai *Archived Opt-Out*.

---

## Related Business Rules & Entities
* `LR-002` (No Hard Delete), `AR-004` (Reschedule Limit), `DG-002` (PDPA Opt-Out); Entiti `Lead`, `Appointment`, `Activity`.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Exception Workflow ZK Revenue Ops (ZK-WF-008) |
