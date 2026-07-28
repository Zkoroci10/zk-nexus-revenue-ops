---
Title: Google Workspace & Cloud Integration Bridge
ID: INT-001
Type: Integration Guide
Module: 05_Systems/Integrations
BU: ZK Revenue Ops
Status: Active
Version: 1
Created: 2026-07-28
Updated: 2026-07-28
Owner: Human Founder & CTO
Related: DAT-001, SCH-001
---

# INT-001: Google Workspace & Drive Cloud Integration

**Objektif:** Menyediakan pangkalan data awan (*Cloud Database*) dan papan pemuka awan (*Cloud Dashboard*) ZK Revenue Ops secara langsung di dalam ekosistem **Google Drive / Google Workspace**.

---

## 🌐 1-Click Pelancaran Ke Google Sheets Cloud

### Langkah 1: Buka Google Sheets Baru di Cloud
Klik atau layari pautan rasmi Google ini untuk membuka borang Google Sheet baru terus di akaun Google Drive anda:  
👉 **[https://sheets.new](https://sheets.new)**

### Langkah 2: Salin Skrip Automasi Google Apps Script
1. Di dalam Google Sheet baharu anda, klik menu **Extensions (Peluasan) ➔ Apps Script**.
2. Salin dan tampal skrip dari fail:  
   [Google-Apps-Script-Setup.gs](file:///C:/Users/Dell/Documents/Projects%20ZK%20Nexus/05_Systems/Scripts/Google-Apps-Script-Setup.gs)
3. Klik butang **Run (Jalankan)** di bahagian atas.

### Hasil 100% Automatik di Google Cloud:
* ✅ Tab **Papan Pemuka (Dashboard)** dicipta secara automatik dengan formula kiraan real-time.
* ✅ Tab **Database** dicipta dengan senarai dropdown status (`Qualified`, `Viewing Scheduled`, `Unqualified`).
* ✅ Google Sheet secara automatik tersimpan di **Google Drive Cloud** anda, membolehkan anda dan REN mengakses data dari telefon bimbit (iPhone/Android) atau mana-mana peranti!

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2026-07-28 | CTO & AI | Created Google Workspace Cloud Integration Guide (INT-001) |
