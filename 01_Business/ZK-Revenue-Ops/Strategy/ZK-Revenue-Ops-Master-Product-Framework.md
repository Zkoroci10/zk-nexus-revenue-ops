---
Title: ZK Revenue Ops - Master Product & Service Framework
ID: ZK-REVOPS-MASTER-001
Type: Product Framework & System Architecture
Module: 01_Business / ZK-Revenue-Ops
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 2.0
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Malaysian Real Estate Negotiators (REN) Only
Scarcity Model: Exclusive Max 30 REN Seats Nationwide (Zero Database Collision)
---

# ZK REVENUE OPS: MASTER PRODUCT & SERVICE FRAMEWORK
> **System Architecture & Operational Blueprint for AI, AGI, & Human Operators**

---

# Module 1: REN Onboarding & Territory Lock System

## Goal
Mengunci maksimum **30 Exclusive REN Seats** di seluruh Malaysia dengan hak perlindungan wilayah/projek eksklusif bagi mengelakkan pertindihan data (*Zero Database Collision*) dan mewujudkan kedudukan *High-Ticket Exclusivity*.

---

## Problem
* **Lead Cannibalization**: Beratus REN memanggil dan menghantar mesej kepada senarai pembeli/pemilik hartanah yang sama di kawasan/projek yang sama.
* **Low Agency Trust**: REN kerap bertukar servis kerana tiada jaminan keselamatan data.
* **High Churn**: Servis SDR tanpa hak eksklusif hilang nilai tambah dengan cepat.

---

## Users
1. **Founder / Head of Operations** (Pengurus Kuota & Pengesyoran)
2. **AI / AGI Management Agent** (Penyemak Pertindihan & Pemproses Onboarding)
3. **Client (Malaysian REN)** (Pengguna Servis Eksklusif)

---

## Inputs
* **REN Profile**: Nama Penuh, No. REN (LPPEH), Nama Agensi Hartanah.
* **Territory Focus**: Kawasan Utama (cth: Mont Kiara, PJ, Shah Alam) & Projek Khusus (Subsale / New Launch).
* **Lead Database**: Fail CSV / vCard Kontak Lead Sedia Ada (50–500 lead).
* **Viewing Schedule**: Waktu kelapangan REN mingguan untuk aktiviti temujanji.

---

## Requirements
1. Lesen / Pendaftaran REN sah bawah agensi terdaftar LPPEH.
2. Mempunyai sekurang-kurangnya 50 lead aktif/dormant untuk diaktifkan semula.
3. Menandatangani Master Service Agreement (MSA) & Data Confidentiality Agreement.

---

## Workflow
```
[Borang Intake REN] ──> [Semakan Pertindihan Wilayah] ──> [Agihan Kerusi (Seat X/30)]
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
            [Lulus: Tandatangan]   [Gagal: Senarai Menunggu]
                     │
                     ▼
           [Akaun Portals Dicipta] ──> [Pangkalan Data Diisi]
```

---

## Layout
* **Notion Territory Lock Database**:
  * *Column 1*: Seat ID (#01 hingga #30).
  * *Column 2*: Agent Name & REN No.
  * *Column 3*: Exclusive Zone / Project Focus.
  * *Column 4*: Status (Active / Onboarding / Vacant).
  * *Column 5*: Expiry / Renewal Date.

---

## Features
1. **Real-time Territory Collision Detector**: Sistem menyemak fail kawasan supaya tiada 2 REN mendapat hak projek yang sama.
2. **30-Seat Capacity Counter**: Dashboard memaparkan bilangan kerusi tersisa secara automatik (Cth: *12/30 Seats Remaining*).
3. **Automated Onboarding Dossier**: Mengumpul maklumat peribadi & preferensi kerja REN dalam 1 dokumen standard.

---

## SOP
1. **Langkah 1**: Operator/AI terima permohonan sertai ZK Revenue Ops dari REN.
2. **Langkah 2**: Semak zon/projek REN dalam *Territory Lock Database*.
3. **Langkah 3**: Jika zon lapang, kembangkan kontrak MSA & pautan pembayaran.
4. **Langkah 4**: Kemaskini kaunter kerusi (Cth: 13/30) dan buka fail *Client Portal*.
5. **Langkah 5**: Minta fail kontak lead daripada REN untuk diproses dalam Module 2.

---

## Business Rules
1. **Hard Cap 30 Seats**: Tidak boleh melebihi 30 REN di seluruh Malaysia bawah sebarang keadaan.
2. **One Project, One REN**: Hanya 1 REN dibenarkan memegang eksklusiviti untuk 1 projek khusus dalam zon yang sama.
3. **Seat Revocation**: Kerusi akan dibatalkan dan diserahkan kepada senarai menunggu jika REN tidak aktif / gagal bayar yuran selepas 7 hari tempoh ihsan.

---

## Decision Tree
* **JIKA** Projek/Kawasan dimohon **BELUM WUJUD** dalam sistem:
  * ➔ *Tindakan*: Luluskan permohonan ➔ Tugaskan Kerusi #X ➔ Hantar Kontrak MSA.
* **JIKA** Projek/Kawasan dimohon **SUDAH DILOCK** oleh REN lain:
  * ➔ *Tindakan*: Penolakan Mesra ➔ Cadangkan kawasan alternatif ATAU Masukkan ke Senarai Menunggu (Waitlist).

---

## KPI
* **Onboarding Lead Time**: < 24 jam dari pembayaran hingga pangkalan data diselaraskan.
* **Territory Lock Accuracy**: 100% Zero Collision.
* **Seat Retention Rate**: > 85% pembaharuan bulanan.

---

## QA Checklist
- [ ] Nombor REN disahkan sah bawah LPPEH.
- [ ] Zon eksklusif disemak dan tiada pertindihan.
- [ ] Dokumen MSA & NDA ditandatangani.
- [ ] Folder Client Portal & pautan Notion telah disetkan.

---

## Output
1. **Active REN Client Account** (Terikat dengan Kerusi ID #01-30).
2. **Locked Territory Certificate** (Status eksklusif projek).
3. **Onboarded Lead Repository** (Sedia untuk Triage).

---

## Future Automation
* **n8n Workflow**: Semakan automatik boring intake ke database Notion & pengeluaran cadangan wilayah.
* **WhatsApp Bot Intake**: Kumpul profil REN terus menerusi perbualan automatik.
* **AI Contract Signer**: Pautan e-Sign automatik dengan penjanaan dokumen pantas.

---

## Version History
* **v2.0 (2026-07-24)**: Penambahan struktur 30 Exclusive REN Cap & Rules Pertindihan Data.

---
---

# Module 2: Lead Ingestion & Qualification Triage Engine

## Goal
Mengambil lead mentah dari pelbagai saluran (iklan digital/pangkalan data lama) dan menapisnya secara *real-time* kepada 3 Tier kelayakan (Hot, Warm, Cold/Junk) menggunakan penilaian DSR (Debt Service Ratio) & bajet pembeli.

---

## Problem
* REN membuang 80% masa melayan lead yang tiada bajet, tiada slip gaji, atau sekadar "survey sahaja".
* Respon lambat mematikan minat pembeli (*Lead Cold Rate* tinggi jika lambat dikontak).

---

## Users
1. **SDR Operator / AI Agent** (Penapis Lead Utama)
2. **Client REN** (Penerima Lead Terlapis / Tier 1)

---

## Inputs
* **Raw Lead Data**: Nama, No. WhatsApp, Sumber Lead (FB Ads / TikTok / iProperty / Cold Import), Nama Projek Diminati, Anggaran Bajet, Gaji Kasar / Kelayakan Bank.

---

## Requirements
1. Skrip soalan kelayakan (*Triage Questionnaire Matrix*).
2. Formula pengiraan Debt Service Ratio (DSR) ringkas.
3. Akses WhatsApp Business API / Sistem Mesej.

---

## Workflow
```
[Lead Mentah Masuk] ──> [Semakan Duplikasi Nombor] ──> [Respon WhatsApp Minit ke-1]
                                                                │
                                                                ▼
                                                    [Borang Soalan Kelayakan]
                                                                │
                     ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
                     ▼                                          ▼                                          ▼
           [TIER 1: HOT 🔥]                           [TIER 2: WARM 🌤️]                          [TIER 3: JUNK 🗑️]
  • Pre-Approved / Cash                      • Timeline 1-3 Bulan                       • Tiada Bajet / Salah No
  • Timeline < 30 Hari                       • Perlu Check Bank                         • Agent Spying
         │                                          │                                          │
         ▼                                          ▼                                          ▼
[Hantar ke Module 3 (SDR)]                 [Simpan dalam Sequence Nurture]            [Buang & Archive Data]
```

---

## Layout
* **Notion Triage Pipeline Board**:
  * *Column 1*: Raw Ingestion Queue.
  * *Column 2*: Screening In Progress.
  * *Column 3*: Tier 1 - Hot (Pre-Approved / Cash).
  * *Column 4*: Tier 2 - Warm (Nurture Pipeline).
  * *Column 5*: Disqualified / Junk.

---

## Features
1. **Speed-to-Lead Clock**: Menjejak masa tindak balas (Sasaran < 5 minit dari lead masuk).
2. **Automated DSR Pre-Qualifier**: Penilaian ringkas kelayakan pinjaman bank berdasarkan pendapatan & komitmen.
3. **Duplication & Spam Filter**: Mengenal pasti nombor telefon palsu atau nombor ejen hartanah lain (*spying*).

---

## SOP
1. **Langkah 1**: Lead masuk disemak nombor pendaftaran (elak nombor duplikasi).
2. **Langkah 2**: SDR/AI hantar mesej aluan & 3 soalan wajib (Gaji/Pre-approval, Timeline belian, Tujuan belian).
3. **Langkah 3**: Berdasarkan jawapan, tag lead sebagai Tier 1, Tier 2, atau Tier 3.
4. **Langkah 4**: Jika Tier 1, terus maklumkan kepada REN dan jadualkan perbualan penentuan viewing.

---

## Business Rules
1. **Speed Rule**: Lead baharu mesti disapa dalam tempoh maksimum 5 minit (waktu operasi 9 pagi - 9 malam).
2. **No Loan, No Tier 1**: Lead tanpa *Pre-Approved Loan* atau tanpa kriteria pembeli tunai TIDAK BOLEH dikategorikan sebagai Tier 1.
3. **Purge Rule**: Lead yang tidak membalas mesej selepas 3 kali cubaan dalam 48 jam akan dimasukkan ke Tier 3.

---

## Decision Tree
* **JIKA** Pembeli ada *Pre-Approved Loan* ATAU Pembeli Tunai **DAN** mahu beli < 30 hari:
  * ➔ *Tag*: **Tier 1 (Hot 🔥)** ➔ Salur ke Module 3 (SDR Booking).
* **JIKA** Pembeli ada bajet padan **TETAPI** belum semak kelayakan bank / timeline 1-3 bulan:
  * ➔ *Tag*: **Tier 2 (Warm 🌤️)** ➔ Salur ke Sequence Nurturing Bulanan.
* **JIKA** No telefon tidak aktif / Tiada Bajet / Ejen hartanah lain:
  * ➔ *Tag*: **Tier 3 (Junk 🗑️)** ➔ Disqualify & Archive.

---

## KPI
* **Speed-to-Lead**: Average < 5 minit.
* **Triage Accuracy**: > 90% (Lead Tier 1 benar-benar layak apabila sampai ke REN).
* **Qualification Rate**: 15%–25% daripada lead mentah berjaya melepasi Tier 1.

---

## QA Checklist
- [ ] Format nombor telefon WhatsApp sah (+601...).
- [ ] Tag sumber lead dimasukkan tepat.
- [ ] Status pinjaman bank dikemaskini dalam pangkalan data.
- [ ] Nota khas prospek dicatat ringkas.

---

## Output
1. **Qualified Lead Dossier (Tier 1 & Tier 2)**.
2. **Cleaned Lead Database** (Bebas nombor sampah/spammer).

---

## Future Automation
* **n8n Webhook Ingestion**: Menyambung borang TikTok Ads/Meta Ads terus ke WhatsApp API.
* **OpenAI Qualification Agent**: Bot AI menanyakan soalan saringan secara bahasa semula jadi (Malay/English).

---

## Version History
* **v2.0 (2026-07-24)**: Penambahan Kriteria DSR Pre-Qualifier & Struktur 3 Tier.

---
---

# Module 3: Virtual SDR & Outreach Execution

## Goal
Melaksanakan kempen perbualan WhatsApp & panggilan susulan berstruktur untuk mengaktifkan semula lead dormant dan menukarkan lead kelayakan Tier 1 kepada slot temujanji viewing hartanah.

---

## Problem
* REN tiada masa untuk buat susulan berulang kali (*follow-up*) — purata REN berputus asa selepas 1 atau 2 kali cubaan.
* Lead bertukar sejuk (*cold*) kerana tiada sistem pengurusan bantahan (*Objection Handling*).

---

## Users
1. **Virtual SDR Operator / AI Outreach Agent**
2. **Lead (Prospek Pembeli)**

---

## Inputs
* Qualified Lead Dossier dari Module 2.
* Matrix Skrip Perbualan (Subsale, New Launch, Sewa).
* Playbook Penanganan Bantahan (*Objection Handling Playbook*).
* Jadual Slot Kelapangan REN.

---

## Requirements
1. Saluran WhatsApp Business API / Multiline Web App.
2. Template Skrip Outreach yang disahkan (*Humanized & Conversational*).
3. Papan jadual waktu kelapangan REN.

---

## Workflow
```
[Lead Tier 1 Diterima] ──> [Touchpoint 1: Mesej Suai Kenal & Cadangan Unit]
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
              [Prospek Balas: Berminat]   [Prospek Bantah/Ragu]
                         │                         │
                         ▼                         ▼
            [Cadang Masa Viewing]      [Aplikasi Playbook Bantahan]
                         │                         │
                         └────────────┬────────────┘
                                      ▼
                      [Setuju Waktu ──> Hantar ke Module 4]
```

---

## Layout
* **SDR Workstation Dashboard**:
  * *Panel Kiri*: Senarai WhatsApp Chat Terkini.
  * *Panel Tengah*: Rekod Profil Lead & Cadangan Projek.
  * *Panel Kanan*: Quick Drawer Playbook Bantahan (Harapan Harga, Lokasi, Loan).

---

## Features
1. **Multi-Touch Cadence Engine**: Jadual susulan automatik (Hari 1, Hari 3, Hari 7, Hari 14).
2. **Contextual Objection Playbook**: Carian skrip pantas untuk bantahan popular (Cth: *"Harga mahal sangat"*, *"Nak bincang dengan isteri"*, *"Loan tak pasti"*).
3. **Reactivation Blast Matrix**: Kempen khusus menyapa senarai 100–500 lead lama REN yang telah terbiar.

---

## SOP
1. **Langkah 1**: Buka fail lead Tier 1 dari Queue Module 2.
2. **Langkah 2**: Hantar mesej pengenalan berpandukan *Listing Pitch Matrix*.
3. **Langkah 3**: Jika ada bantahan, guna skrip penanganan yang betul (Jangan berhujah, beri solusi).
4. **Langkah 4**: Apabila prospek menunjukkan minat, tawarkan 2 pilihan slot masa viewing (Cth: *Sabtu 11 pagi ATAU Ahad 3 petang*).
5. **Langkah 5**: Apabila slot dipersetujui, terus alih lead ke Module 4 (Viewing Concierge).

---

## Business Rules
1. **Time Window**: Tiada mesej outreach dihantar sebelum jam 9:00 pagi atau selepas jam 8:30 malam.
2. **Max Touchpoints**: Maksimum 5 kali cubaan mesej dalam tempoh 14 hari. Jika tiada respon, letak dalam status *Cooling Off*.
3. **Zero Hard-Selling**: Pendekatan perbualan mestilah berbentuk perundingan mesra (*Advisory Approach*), bukan tekanan jualan kasar.

---

## Decision Tree
* **JIKA** Prospek kata *"Harga mahal"*:
  * ➔ *Guna Skrip OBJ-01*: Terangkan penilaian pasaran kawasan & tawaran pakej pinjaman/rebat ➔ Tawarkan viewing untuk lihat sendiri kualiti unit.
* **JIKA** Prospek kata *"Perlu bincang pasangan/keluarga"*:
  * ➔ *Guna Skrip OBJ-02*: Jemput bawa pasangan serentak semasa temujanji viewing ➔ Tetapkan slot hujung minggu.
* **JIKA** Prospek Setuju Viewing:
  * ➔ *Tindakan*: Kunci Masa & Hari ➔ Alih terus ke Module 4.

---

## KPI
* **Contacted-to-Engaged Rate**: > 60%.
* **Viewing Conversion Rate**: > 15% daripada lead yang dihubungi bersetuju untuk viewing.
* **Response Handling Speed**: < 10 minit waktu bekerja.

---

## QA Checklist
- [ ] Skrip dipadankan dengan tepat mengikut jenis hartanah (Subsale vs Project).
- [ ] Bahasa mesej sopan, mesra, dan bebas ejaan salah.
- [ ] Slot masa dikonfirmasikan dua belah pihak.
- [ ] Tiada mesej bertindih dihantar.

---

## Output
1. **Confirmed Viewing Request**.
2. **Logged Conversation History** (Rekod perbualan).

---

## Future Automation
* **AI WhatsApp Conversational Agent**: Model LLM yang dilatih dengan skrip hartanah Malaysia untuk membalas mesej secara automatik 24/7.
* **n8n Auto-Followup Scheduler**: Pencetus mesej susulan automatik jika tiada balasan.

---

## Version History
* **v2.0 (2026-07-24)**: Integrasi Playbook Bantahan Hartanah Malaysia.

---
---

# Module 4: Viewing Concierge & Calendar Management

## Goal
Menguruskan temujanji viewing hartanah, menghantar profil pembeli (*Buyer Dossier*) kepada REN, serta melaksana protokol **Anti-Ghosting 24j/2j** untuk memastikan kadar kehadiran pembeli melebihi 90%.

---

## Problem
* Sebingkit 30%–40% pembeli hartanah gagal hadir (*ghosting*) pada hari temujanji tanpa makluman, menyebabkan REN membuang masa & kos perjalanan.
* REN tidak mendapat maklumat awal mengenai profil pembeli sebelum berjumpa di tapak projek.

---

## Users
1. **Viewing Concierge Operator / AI Remind Bot**
2. **Client REN**
3. **Prospek Pembeli**

---

## Inputs
* Maklumat Slot Masa Viewing.
* Pautan Lokasi Waze / Google Maps Hartanah.
* Buyer Dossier (Nama, Pekerjaan, Julat Gaji, Status Bank Loan, Keperluan Unit).
* Waktu Kelapangan REN.

---

## Requirements
1. Kalendar Digital (Google Calendar / Notion Calendar).
2. Sistem Mesej Automatik WhatsApp.
3. Pautan Google Maps / Waze Hartanah.

---

## Workflow
```
[Slot Masa Diterima] ──> [Tempah Kalendar REN & Pembeli] ──> [Hantar Buyer Dossier ke REN]
                                                                     │
                                                                     ▼
                                                         [Peringatan T-24 Jam (WhatsApp)]
                                                                     │
                                                                     ▼
                                                         [Peringatan T-2 Jam (Google Maps)]
                                                                     │
                                        ┌────────────────────────────┴────────────────────────────┐
                                        ▼                                                         ▼
                             [Pembeli Sahkan Kehadiran]                              [Pembeli Gagal Sahkan / Minta Tangguh]
                                        │                                                         │
                                        ▼                                                         ▼
                             [REN Berlepas ke Viewing]                               [SDR Telefon Pembeli / Reschedule]
```

---

## Layout
* **Viewing Dossier Card (WhatsApp Format to REN)**:
```text
📌 CONFIRMED VIEWING DOSSIER
---------------------------------
🏠 Projek: Residensi Savanna, Bukit Jalil
📅 Tarikh/Masa: Sabtu, 26 Julai | 11:00 AM
👤 Pembeli: En. Hafiz (Gaji RM8,500 - Loan Approved Maybank)
🚗 Waze Link: https://waze.com/ul/hw283...
💡 Nota Khas: Cari unit tingkat tinggi, ada 2 car park.
---------------------------------
```

---

## Features
1. **One-Click Location & Dossier Dispatch**: Menghantar maklumat lengkap hartanah & prospek ke WhatsApp REN secara automatik.
2. **T-24h & T-2h Anti-Ghosting Protocol**: Mesej peringatan automatik yang memerlukan prospek membalas "1" untuk sahkan atau "2" untuk tangguh.
3. **Post-Viewing Feedback Collector**: Borang ringkas automatik dihantar kepada REN selepas 2 jam temujanji tamat untuk merekod hasil viewing.

---

## SOP
1. **Langkah 1**: Kunci tarikh/masa dalam kalendar dan hasilkan kad *Buyer Dossier*.
2. **Langkah 2**: Hantar *Buyer Dossier* kepada REN dan *Calendar Invite* kepada pembeli.
3. **Langkah 3** (T-24 Jam): Mesej WhatsApp dihantar kepada pembeli mengesahkan kehadiran.
4. **Langkah 4** (T-2 Jam): Mesej koordinasi akhir bersama pautan Waze dihantar kepada pembeli & REN.
5. **Langkah 5**: Hantar borang maklum balas hasil viewing kepada REN pada sebelah petang.

---

## Business Rules
1. **12-Hour Lead Time**: Temujanji mesti ditetapkan sekurang-kurangnya 12 jam sebelum masa viewing.
2. **Unconfirmed Penalty**: Jika pembeli tidak mengesahkan kehadiran pada nod T-2 jam, SDR akan menelifon pembeli. Jika gagal dihubungi, sistem mengelaskan temujanji sebagai *High Ghost Risk* untuk makluman REN.
3. **Max 2 Reschedules**: Prospek hanya dibenarkan menangguh tarikh temujanji maksimum 2 kali sebelum disenaraihitamkan.

---

## Decision Tree
* **JIKA** Pembeli sahkan pada T-2 jam:
  * ➔ *Hantar Mesej ke REN*: "Green Light 🟢 Pembeli dalam perjalanan."
* **JIKA** Pembeli minta ubah masa pada T-24 jam:
  * ➔ *Tindakan*: Buka jadual REN ➔ Susun semula slot ➔ Kemaskini Kalendar.
* **JIKA** Pembeli senyap pada T-2 jam:
  * ➔ *Tindakan*: SDR buat panggilan panggilan telefon segera ➔ Jika gagal, maklumkan REN elak pembaziran masa.

---

## KPI
* **Viewing Attendance Rate (Show-up Rate)**: Target > 90%.
* **Ghosting Rate**: Target < 10%.
* **Dossier Delivery Accuracy**: 100% tepat.

---

## QA Checklist
- [ ] Kalendar REN dan Pembeli dikemaskini.
- [ ] Pautan lokasi Waze tepat ke pintu pengawal / lobi galeri.
- [ ] Peringatan T-24 jam & T-2 jam dijadualkan.
- [ ] Status *Buyer Dossier* disahkan oleh REN.

---

## Output
1. **Confirmed Viewing Event**.
2. **Buyer Dossier Briefing Sheet**.
3. **Post-Viewing Outcome Record** (Offer / Second Viewing / Rejected).

---

## Future Automation
* **WhatsApp Interactive Buttons**: Butang 1-Klik ("Sahkan Kehadiran" / "Tukar Tarikh").
* **n8n Calendar Sync**: Menghubungkan Google Calendar, Notion, dan WhatsApp Gateway secara serentak.

---

## Version History
* **v2.0 (2026-07-24)**: Pengenalan Protokol Anti-Ghosting T-24j & T-2j.

---
---

# Module 5: Client Portal & Revenue Pipeline Reporting

## Goal
Menyediakan papan pemuka transparan 1-Klik (*Notion/Web Client Portal*) dan Laporan Audit Mingguan untuk membolehkan REN melihat perkembangan pipeline jualan dan mengira pulangan pelaburan (ROI) servis secara jelas.

---

## Problem
* REN membatalkan langganan servis kerana tidak nampak kerja-kerja yang dilakukan di belakang tabir.
* REN sukar menilai sejauh mana servis membantu menambah komisyen jualan mereka.

---

## Users
1. **Client REN** (Melihat Pipeline & Laporan Audit)
2. **Founder / Account Manager** (Menjana Laporan & Meneliti Strategi)

---

## Inputs
* Log Harian Triage & Outreach (Module 2 & 3).
* Log Hasil Viewing (Module 4).
* Data Komisyen Jualan Terkunci / Deal Closed.
* Yuran Langganan ZK Revenue Ops.

---

## Requirements
1. Pautan Notion Client Portal mesra telefon bimbit.
2. Template Laporan Audit Mingguan (Markdown / PDF).
3. Calculator ROI Komisyen.

---

## Workflow
```
[Log Aktiviti Harian] ──> [Pengemaskinian Pipeline Notion (Real-Time)]
                                     │
                                     ▼
                      [Janaan Laporan Audit Mingguan (Setiap Isnin)]
                                     │
                                     ▼
                      [Kiraan ROI Komisyen & Metrik Pipeline]
                                     │
                        ┌────────────┴────────────┐
                        ▼                         ▼
            [ROI > 3x: Pembaharuan]     [ROI Low: Semakan Strategi]
```

---

## Layout
* **Notion Client Portal View**:
  * *Header Top*: Kad Metrik Utama (*Total Leads Processed | Hot Leads | Viewings Booked | Est. Pipeline Commission*).
  * *Section Utama*: Board Pipeline Kanban 1-Klik (*New ➔ Contacted ➔ Qualified ➔ Viewing ➔ Closed*).
  * *Section Bawah*: Arkib Laporan Audit Mingguan (PDF/Markdown).

---

## Features
1. **Live Pipeline Kanban Board**: Paparan langsung pergerakan prospek secara visual.
2. **Estimated Commission Pipeline Calculator**: Mengira potensi komisyen REN berdasarkan unit hartanah yang sedang di peringkat viewing/booking.
3. **ROI Multiplier Metric**: Mengira nisbah hasil komisyen jualan berbanding yuran langganan ZK Revenue Ops.

---

## SOP
1. **Langkah 1**: Sistem/Operator mengemaskini paparan Board Notion setiap kali status lead berubah.
2. **Langkah 2** (Setiap Isnin 9:00 AM): Hasilkan *Weekly Revenue Operations Audit Report*.
3. **Langkah 3**: Hantar ringkasan laporan audit ke WhatsApp REN bersama pautan portal Notion.
4. **Langkah 4** (Setiap Akhir Bulan): Mengendalikan semakan strategi bulanan (*Monthly Review*) untuk menilai pembaharuan langganan.

---

## Business Rules
1. **Monday Reporting Rule**: Laporan audit mingguan wajib disampaikan sebelum jam 10:00 pagi setiap hari Isnin.
2. **Full Pipeline Transparency**: REN berhak melihat rekod setiap mesej & status lead yang dikendalikan oleh ZK Revenue Ops.
3. **ROI Audit Baseline**: Jika ROI servis berada bawah 2x dalam tempoh 60 hari, semakan semula skrip & sasaran iklan dilakukan secara percuma.

---

## Decision Tree
* **JIKA** ROI Jualan REN **> 3x Yuran Servis**:
  * ➔ *Tindakan*: Syorkan Pembaharuan Retainer 3/6 Bulan ➔ Kunci Kerusi Eksklusif.
* **JIKA** Kadar Conversion Low (< 5%):
  * ➔ *Tindakan*: Anjurkan *Strategy Audit Session* ➔ Tukar skrip pitch / Semak kualiti iklan sumber lead REN.

---

## KPI
* **Client Retention Rate**: > 85%.
* **Average Client ROI**: > 3x Nisbah Pulangan Yuran.
* **Report Delivery Punctuality**: 100% dihantar Isnin pagi.

---

## QA Checklist
- [ ] Semua kad lead dalam Notion dikemaskini mengikut status terbaharu.
- [ ] Anggaran nilai komisyen dikira tepat.
- [ ] Pautan portal boleh diakses tanpa memerlukan login rumit.
- [ ] Laporan audit minggu berkenaan telah dimasukkan ke arkib.

---

## Output
1. **Live Client Portal Workspace**.
2. **Weekly Revenue Operations Audit Report**.
3. **Monthly ROI Performance Summary**.

---

## Future Automation
* **Automated Notion Sync via n8n**: Mengemaskini borang Notion secara automatik tanpa input manual.
* **WhatsApp Audit Summary Bot**: Menghantar kad visual statistik mingguan terus ke WhatsApp REN.

---

## Version History
* **v2.0 (2026-07-24)**: Integrasi Notion Client Portal & Metric ROI Calculator.
