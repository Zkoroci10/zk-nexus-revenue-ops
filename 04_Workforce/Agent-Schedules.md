---
Title: Executive & AI Workforce Operating Schedule
ID: SCH-001
Type: Operating Schedule
Module: 04_Workforce
BU: All
Status: Active
Version: 1
Created: 2026-07-28
Updated: 2026-07-28
Owner: Human Founder & COO
Related: WRK-001, ROL-001, ROL-002, ROL-003, ROL-004, SOP-003
---

# SCH-001: Master Executive & AI Workforce Operating Schedule

**Objektif:** Menjadualkan waktu operasi, rutin kerja latar belakang, dan selang masa automasi (*cron/timer*) bagi setiap Ketua Jabatan (Head of Department) dan Ejen AI di bawahnya.

---

## ⏰ Jadual Rutin Harian Jabatan (Department Operating Hours)

```
[08:00 AM] CTO: Semakan Automasi & Integriti Sistem
[08:30 AM] COO: Taklimat Pagi & Semakan Ruang Kerja (SOP-003)
[09:00 AM] CMO: Pelancaran Kempen SDR & Saringan Lead (SOP-001)
[02:00 PM] CPO: Kajian Reka Bentuk & Pembangunan DAE Ecosystem
[05:30 PM] COO: Semakan Laporan Harian & Pengesahan ZNS
```

---

## 🔄 Rutin Kerja Mengikut Jabatan & Head of Department (HOD)

### 1. Jabatan Operasi (HOD: COO - Chief Operating Officer)
* **Waktu Aktif Utama:** 08:30 AM - 06:00 PM
* **Ejen Dibawahnya:** `AI-COO-Ops-Assistant`, `AI-Compliance-Auditor`
* **Jadual Rutin Automasi:**
  * **08:30 AM (Harian):** Melaksanakan Semakan Pagi (*Daily Control Loop SOP-003*).
  * **05:30 PM (Harian):** Menjalankan pengesahan format ZNS dan audit log harian.

---

### 2. Jabatan Pemasaran & Jualan (HOD: CMO - Chief Marketing Officer)
* **Waktu Aktif Utama:** 09:00 AM - 09:00 PM (Termasuk waktu puncak pertanyaan lead)
* **Ejen Dibawahnya:** `AI-SDR-Lead-Qualifier`, `AI-Copywriter-Outreach`
* **Jadual Rutin Automasi:**
  * **Setiap 30 Minit:** Semakan *leads* masuk dari portal iklan & borang web.
  * **10:00 AM (Harian):** Penghantaran mesej *cold outreach* dan susulan *leads* lama.
  * **06:00 PM (Harian):** Laporan penetapan temujanji (*Viewing Appointments*) ke Calendar REN.

---

### 3. Jabatan Sistem & Teknologi (HOD: CTO - Chief Technology Officer)
* **Waktu Aktif Utama:** 08:00 AM - 11:00 PM (Automasi latar belakang 24/7)
* **Ejen Dibawahnya:** `AI-Automation-Engineer`, `AI-Script-Validator`
* **Jadual Rutin Automasi:**
  * **Setiap 4 Jam:** Menjalankan `validate-zns.ps1` secara latar belakang.
  * **12:00 PM & 08:00 PM:** Semakan kesihatan API dan *pipeline* pengikisan data *lead*.

---

### 4. Jabatan Produk (HOD: CPO - Chief Product Officer)
* **Waktu Aktif Utama:** 02:00 PM - 07:00 PM
* **Ejen Dibawahnya:** `AI-UX-Designer`, `AI-Product-Architect`
* **Jadual Rutin Automasi:**
  * **02:00 PM (Harian):** Kajian komponen UI/UX dan pengemaskinian spesifikasi DAE Ecosystem.

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2026-07-28 | COO & AI | Created Master Operating Schedule for AI Workforce (SCH-001) |
