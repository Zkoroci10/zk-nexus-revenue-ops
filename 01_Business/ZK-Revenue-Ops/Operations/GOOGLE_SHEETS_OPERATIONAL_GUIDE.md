---
Title: Google Sheets CRM Operational Guide
ID: SOP-OPS-003
Type: Operational Guide
Module: 01_Business/ZK-Revenue-Ops
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-08-07
Updated: 2026-08-07
Owner: Zubair (zubairisa10@gmail.com)
Related: SYS-003, PRJ-010, PRJ-015
---

# 📊 Google Sheets CRM Engine Operational Guide (`SOP-OPS-003`)

> **Goal:** How Zubair & the ZK Revenue Ops team view, operate, and manage live lead data inside Google Sheets.

---

## 🔗 1. Akses Pautan Google Sheets & Apps Script Backend

- **Google Drive Location:** `ZK Nexus Workspace` (Google Account: `zubairisa10@gmail.com`)
- **Backend Script File:** [`05_Systems/Scripts/gas-crm-engine.js`](file:///C:/Users/Dell/Documents/Projects%20ZK%20Nexus/05_Systems/Scripts/gas-crm-engine.js)
- **Web App Endpoint:** `https://script.google.com/macros/s/YOUR_EXEC_ID/exec`

---

## 🛠️ 2. Cara Operate Data Di Google Sheets (3-Langkah)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   GOOGLE SHEETS OPERATIONAL STEPS                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. 📄 SEERANG JADUAL (3 SHEETS UTAMA)                                 │
│     ├── Sheet 1: 'Buyer Leads' (Maklumat nama, phone, project, DSR).   │
│     ├── Sheet 2: 'REN Clients' (Senarai Client Retainer REN 001-003). │
│     └── Sheet 3: 'Closed Deals' (Rekod komisen & transaksi).         │
│                                                                        │
│  2. ✏️ OPERASI DATA (EDIT / TAMBAH / PADAM)                           │
│     ├── Edit Gaji / DSR Status: Tukar colum 'Status' terus di Sheets.  │
│     └── Tambah Lead Manual: Taip di baris baharu di bawah.            │
│                                                                        │
│  3. 🔄 AUTOMATIC LIVE SYNC                                             │
│     Setiap baris baharu yang ditambah atau diedit di Google Sheets     │
│     secara automatik disinkronkan ke Console-Portal & Notion CRM!     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ 3. Peraturan Pematuhan Data (Security Rules)

1. **Jangan Tukar Nama Tajuk Kolum (Header Row 1)**:  
   Pastikan baris 1 (`Buyer Name`, `Phone`, `Project Interest`, `Income`, `DSR Status`) tidak diubah ejaannya supaya webhook Apps Script tidak terputus.
2. **Eksport CSV Back-Up**:  
   Bila-bila masa kamu mahu muat turun pangkalan data, klik **File -> Download -> Comma Separated Values (.csv)**.
