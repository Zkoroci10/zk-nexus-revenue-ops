---
Title: User Roles & Responsibilities - ZK Revenue Ops
ID: ZK-FND-008
Type: Foundation Document
Module: 00_Foundation / 008 User Roles
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Exclusive Seats)
---

# 008: User Roles & Responsibilities

> **ZK-FND-008 | Modul 008 — Peranan Pengguna & Matriks Akses ZK Revenue Ops**

---

## Purpose & Scope

Dokumen ini mendefinisikan **taksonomi peranan pengguna (*User Roles*)**, tahap kebenaran akses (*access control*), serta matriks tanggungjawab (RACI) dalam ekosistem ZK Revenue Ops untuk pengurusan manusia dan ejen AI.

---

## Role Taxonomy (Taksonomi Peranan)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TAKSONOMI PERANAN PENGGUNA                      │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│ 1. FOUNDER   │ 2. CLIENT    │ 3. VIRTUAL   │ 4. AI AGENT  │ 5. AGENCY  │
│    (Zubair)  │    SOLO REN  │    SDR (Human)│    (AGY/Bot) │    OBSERVER│
│ Architect &  │ Beneficiary &│ Conversational│ Ingestion &  │ Read-only  │
│ Strategy.    │ Closing.     │ Outreach.    │ Triage Bot.  │ Dashboard. │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
```

### 1. Human Founder (Zubair Ariff)
* **Kategori**: Executive & Business Architect.
* **Peranan**: Memegang kuasa tertinggi ke atas pengagihan 30 Seat Eksklusif, menetapkan dasar perniagaan, meluluskan perbelanjaan, dan menyelia prestasi keseluruhan sistem.

### 2. Client Solo REN
* **Kategori**: External Primary User (Pelanggan Servis).
* **Peranan**: Menyediakan fail lead & maklumat hartanah, menetapkan slot kelapangan viewing, menerima *Buyer Dossier*, dan melaksana temujanji tapak (*closing viewing*).

### 3. Virtual SDR Operator (Human Operator)
* **Kategori**: Internal Operations.
* **Peranan**: Mengendalikan perbualan WhatsApp yang memerlukan perhatian manusia, menguruskan penanganan bantahan kompleks (*complex objections*), dan mengesahkan temujanji.

### 4. AI / AGI Agent (System / AGY Agent)
* **Kategori**: Autonomous Infrastructure.
* **Peranan**: Mengendalikan pemprosesan data automatik (<5 minit), menyemak duplikasi nombor, menjalankan saringan soalan DSR, mengemaskini Notion Kanban, dan menjana Laporan Audit Mingguan.

### 5. Agency Observer / Team Leader (Optional)
* **Kategori**: Read-Only Guest.
* **Peranan**: Memantau prestasi keseluruhan kumpulan ejen (jika dilanggan secara pakej agensi) tanpa kuasa mengubah data lead.

---

## RACI Matrix (Responsible, Accountable, Consulted, Informed)

| Fungsi / Task | Founder | Client REN | Virtual SDR | AI Agent |
| :--- | :---: | :---: | :---: | :---: |
| **Territory Lock & Onboarding** | **Accountable** | Informed | Support | Responsible |
| **Lead Ingestion & Cleaning** | Informed | Consulted | Support | **Responsible** |
| **Lead Qualification & Triage** | Informed | Informed | Responsible | **Responsible** |
| **WhatsApp Outreach & SOP** | Consulted | Informed | **Responsible** | Support |
| **Viewing Booking & Dossier** | Informed | Consulted | **Responsible** | Responsible |
| **Physical Viewing & Closing** | Informed | **Responsible** | Out of Scope | Out of Scope |
| **Weekly Audit Report Delivery** | Consulted | Informed | Support | **Responsible** |

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Peranan Pengguna ZK Revenue Ops (ZK-FND-008) |
