---
Title: Lead Lifecycle Workflow - ZK Revenue Ops
ID: ZK-WF-002
Type: Operational Workflow Engine Document
Module: 04_Operational_Workflow_Engine / 002 Lead Lifecycle
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 002: Lead Lifecycle Workflow

> **ZK-WF-002 | Enjin Kitaran Hayat Lead (Lead Lifecycle Engine)**

---

## Workflow Name
**Lead State Progression & Lifecycle Workflow**

## Goal
Mengawal transisi fasa perjalanan lead bermula daripada pendaftaran awal hingga penutupan jualan dan pengarkiban data secara teratur dan mematuhi perlembagaan governance.

## Trigger
Data lead baharu masuk ke dalam sistem atau berlakunya pertukaran fasa perbualan/tindakan.

## Pre-conditions
* Lead mempunyai `lead_id` unik dan mematuhi aturan pengesahan format `VR-001`.

## Input
Peristiwa pertukaran fasa (*Event Trigger*), nota saringan DSR, balasan mesej WhatsApp.

---

## Lifecycle State Breakdown (13 Fasa Kitaran Hayat Lead)

```text
[NEW] ──> [VERIFIED] ──> [ASSIGNED] ──> [CONTACTED] ──> [RESPONDED] ──> [QUALIFIED]
                                                                             │
                                                                             ▼
[CLOSED] <── [ACTIVE] <── [HANDED TO REN] <── [APPOINTMENT] <── [FOLLOW UP] ◄┘
   │
   ▼
[ARCHIVED]
```

### 1. State: `NEW`
* **Purpose**: Menanda lead mentah yang baru mendaftar dari borang iklan.
* **Who can change**: System Bot / Webhook Engine.
* **Entrance Trigger**: Data lead berjaya ditangkap oleh webhook n8n.
* **Exit Trigger**: Ujian deduplikasi & kebersihan data selesai.
* **Required Action**: Merekodkan metadata `created_at` dan menyemak duplikasi nombor.

### 2. State: `VERIFIED`
* **Purpose**: Mengesahkan nombor telefon WhatsApp sah dan bebas duplikasi.
* **Who can change**: System Bot.
* **Entrance Trigger**: Ujian format `VR-001` lulus.
* **Exit Trigger**: Pengecaman hak eksklusif wilayah diselesaikan.
* **Required Action**: Menetapkan format antarabangsa `+601...`.

### 3. State: `ASSIGNED`
* **Purpose**: Mengumpukkan lead kepada pelanggan REN yang memegang hak *Territory Lock*.
* **Who can change**: System Routing Engine.
* **Entrance Trigger**: Padanan projek hartanah dengan `SEAT-NNN` REN berjaya.
* **Exit Trigger**: Mesej WhatsApp aluan pertama dihantar.
* **Required Action**: Menetapkan `client_id` pemilik lead.

### 4. State: `CONTACTED`
* **Purpose**: Menanda mesej aluan pertama telah dihantar menerusi WhatsApp (< 5 minit).
* **Who can change**: System Bot / Virtual SDR.
* **Entrance Trigger**: Webhook WhatsApp API mengembalikan status `DELIVERED`.
* **Exit Trigger**: Prospek membalas mesej WhatsApp.
* **Required Action**: Menyajikan 3 soalan saringan DSR awal.

### 5. State: `RESPONDED`
* **Purpose**: Menanda prospek telah bertindak balas dan mula berinteraksi.
* **Who can change**: System Bot / Virtual SDR.
* **Entrance Trigger**: Mesej balasan prospek diterima.
* **Exit Trigger**: Jawapan saringan kewangan/gaji lengkap diterima.
* **Required Action**: Menilai maklumat gaji kasar, komitmen, & status bank loan.

### 6. State: `QUALIFIED`
* **Purpose**: Mengelaskan kelayakan prospek kepada Tier 1, Tier 2, atau Tier 3.
* **Who can change**: Virtual SDR / AI Triage Engine.
* **Entrance Trigger**: Borang soalan saringan DSR lengkap diisi.
* **Exit Trigger**: Tagging Tier selesai diproses.
* **Required Action**: Tetapkan tag status `🔥 Tier 1 Hot`, `🌤️ Tier 2 Warm`, atau `🗑️ Tier 3 Disqualified`.

### 7. State: `FOLLOW UP`
* **Purpose**: Melaksanakan siri kempen susulan berjadual untuk lead Tier 2 Warm.
* **Who can change**: Virtual SDR / Multi-Touch Engine.
* **Entrance Trigger**: Lead ditag sebagai Tier 2 Warm.
* **Exit Trigger**: Prospek bersedia untuk temujanji viewing ATAU mendaftar *Cooling Off*.
* **Required Action**: Jalankan touchpoint Hari 1, 3, 7, dan 14.

### 8. State: `APPOINTMENT`
* **Purpose**: Mengunci slot temujanji viewing hartanah bersama pembeli disahkan.
* **Who can change**: Virtual SDR Operator.
* **Entrance Trigger**: Prospek bersedia dan memilih tarikh/masa temujanji.
* **Exit Trigger**: Buyer Dossier dihantar kepada REN dan nod T-2j disahkan.
* **Required Action**: Kemaskini kalendar & hantar notifikasi anti-ghosting.

### 9. State: `HANDED TO REN`
* **Purpose**: Menyerahkan tanggungjawab prospek sepenuhnya kepada REN untuk sesi viewing fizikal.
* **Who can change**: Virtual SDR Operator.
* **Entrance Trigger**: Mesej koordinasi akhir T-2j disahkan oleh pembeli.
* **Exit Trigger**: Sesi viewing fizikal selesai.
* **Required Action**: Menghantar pautan Waze & Kad Buyer Dossier ke WhatsApp REN.

### 10. State: `ACTIVE`
* **Purpose**: Menanda prospek sedang dalam fasa perbincangan jualan aktif bersama REN.
* **Who can change**: Client REN.
* **Entrance Trigger**: Sesi viewing fizikal selesai dan pembeli menyatakan minat.
* **Exit Trigger**: Resit bayaran earnest deposit diterima ATAU jualan dibatalkan.
* **Required Action**: REN kemaskini status Notion Client Portal.

### 11. State: `CLOSED`
* **Purpose**: Menanda keputusan jualan muktamad (`Closed Won` atau `Closed Lost`).
* **Who can change**: Client REN / Founder.
* **Entrance Trigger**: Resit bayaran dikemas kini ATAU penolakan muktamad dicatatkan.
* **Exit Trigger**: Pengiraan ROI komisyen selesai.
* **Required Action**: Kunci nilai komisyen jualan dan alih ke arkib.

### 12. State: `ARCHIVED`
* **Purpose**: Menyimpan data lead secara kekal dalam status read-only bagi tujuan audit.
* **Who can change**: System Bot.
* **Entrance Trigger**: Transaksi jualan selesai ATAU lead ditag sebagai Disqualified.
* **Exit Trigger**: Tiada (Fasa Akhir).
* **Required Action**: Kunci rekod daripada sebarang perubahan manual.

---

## Decision Points & Exception Paths
* Rujuk [010_State-Transition-Rules.md](file:///c:/Users/Dell/Documents/Projects%20ZK%20Nexus/01_Business/ZK-Revenue-Ops/04_Operational_Workflow_Engine/010_State-Transition-Rules.md) untuk jadual pertukaran fasa sah vs haram.

## Output
Jejak audit perjalanan fasa lead yang lengkap (*Immutable Timeline Record*).

## Related Business Rules & Entities
* `LR-001`, `LR-002`, `CR-002`; Entiti `Lead`, `Timeline`, `Activity`.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Lead Lifecycle Workflow ZK Revenue Ops (ZK-WF-002) |
