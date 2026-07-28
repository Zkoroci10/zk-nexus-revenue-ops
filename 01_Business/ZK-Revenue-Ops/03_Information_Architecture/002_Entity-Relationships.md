---
Title: Entity Relationships Architecture - ZK Revenue Ops
ID: ZK-IA-002
Type: Information Architecture Document
Module: 03_Information_Architecture / 002 Entity Relationships
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 002: Entity Relationships Architecture

> **ZK-IA-002 | Diagram & Peta Hubungan Entiti Objek Sistem**

---

## Purpose

Dokumen ini mendefinisikan **peta hubungan entiti (*Entity Relationship Architecture*)** yang menggambarkan bagaimana semua 14 objek data saling berkait secara struktural. Ia menjadi panduan utama untuk pembinaan pangkalan data (SQL/NoSQL) dan rekabentuk API endpoints.

---

## 1. Master Structural Tree Diagram (Peta Pohon Struktur Entiti)

```text
Client (REN) [SEAT-001..030]
│
├── (1:1) ──> Territory Seat (Hak Eksklusif Projek/Zon)
├── (1:1) ──> Dashboard (Notion Client Portal)
│
├── (1:N) ──> Lead (Pangkalan Data Prospek)
│              │
│              ├── (1:N) ──> Appointment (Temujanji Viewing)
│              ├── (1:N) ──> Activity (Audit Log Transaksi)
│              ├── (1:N) ──> Message (Mesej WhatsApp Chat)
│              ├── (1:N) ──> Task (Tugasan Susulan SLA)
│              ├── (1:1) ──> Timeline (Kronologi Fasa Status)
│              └── (N:M) ──> Tag (Label Klasifikasi)
│
└── (1:N) ──> Report (Weekly Audit PDF/Markdown)
```

---

## 2. Cardinality & Foreign Key Mapping Table (Matriks Hubungan Database)

| Parent Entity | Child Entity | Hubungan (Cardinality) | Foreign Key Reference | Keterangan Hubungan |
| :--- | :--- | :---: | :--- | :--- |
| **Client** | **Territory Seat** | `1 : 1` | `TerritorySeat.client_id` | 1 REN memegang 1 Kerusi Eksklusif. |
| **Client** | **Lead** | `1 : N` | `Lead.client_id` | 1 REN memiliki banyak rekod Lead. |
| **Client** | **Dashboard** | `1 : 1` | `Dashboard.client_id` | 1 REN mempunyai 1 Notion Portal. |
| **Client** | **Report** | `1 : N` | `Report.client_id` | 1 REN menerima Laporan Mingguan. |
| **Lead** | **Appointment** | `1 : N` | `Appointment.lead_id` | 1 Lead boleh ada banyak temujanji. |
| **Lead** | **Activity** | `1 : N` | `Activity.lead_id` | 1 Lead mempunyai log audit aktiviti. |
| **Lead** | **Message** | `1 : N` | `Message.lead_id` | 1 Lead mempunyai perbualan WhatsApp. |
| **Lead** | **Task** | `1 : N` | `Task.lead_id` | 1 Lead mempunyai tugasan susulan. |
| **Lead** | **Timeline** | `1 : 1` | `Timeline.lead_id` | 1 Lead mempunyai 1 kronologi fasa. |
| **Lead** | **Tag** | `N : M` | `LeadTag.lead_id & tag_id` | Lead boleh ditag dengan banyak label. |

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Peta Hubungan Entiti ZK Revenue Ops (ZK-IA-002) |
