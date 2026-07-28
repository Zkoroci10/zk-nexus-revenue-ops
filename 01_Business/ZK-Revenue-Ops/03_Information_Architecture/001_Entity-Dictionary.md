---
Title: Entity Dictionary - ZK Revenue Ops
ID: ZK-IA-001
Type: Information Architecture Document
Module: 03_Information_Architecture / 001 Entity Dictionary
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 001: Entity Dictionary

> **ZK-IA-001 | Kamus Entiti Objek Sistem ZK Revenue Ops**

---

## Purpose

Dokumen ini mentakrifkan semua **objek data teras (*Entities*)** dalam ekosistem ZK Revenue Ops. Setiap entiti menceritakan matlamat, pemilik, kitaran hayat, input, output, dan undang-undang perniagaan masing-masing supaya pembina database dan AI Worker faham struktur objek tanpa buat andaian.

---

## 1. Entity: Lead

* **Goal**: Mengwakili prospek pembeli/penyewa hartanah yang disaring daripada pelbagai saluran iklan.
* **Definition**: Objek prospek individu yang mengandungi maklumat demografi, kewangan, preferensi hartanah, dan status kelayakan DSR.
* **Purpose**: Menyimpan dan mengesan aliran pergerakan jualan prospek dari minit pertama hingga penutupan jualan.
* **Owner**: Client REN (Pemilik Hak Milik Mutlak).
* **Lifecycle**: `New` ➔ `Screening` ➔ `Tier 1 Hot / Tier 2 Warm / Tier 3 Disqualified` ➔ `Viewing Booked` ➔ `Won / Lost` ➔ `Archived`.
* **Relationship**: Dimiliki oleh 1 Client REN (`1-to-Many`); Mempunyai banyak Activity, Message, Appointment, & Timeline records.
* **Input**: Data borang iklan (FB/TikTok/Guru), jawapan saringan DSR, nota perbualan.
* **Output**: Status kelayakan Tier, Buyer Dossier, rekod temujanji viewing.
* **Business Rules**: Lead TIDAK BOLEH dipadam (*No Hard Delete*), HANYA boleh di-Archive; Wajib ada Owner, Source, & Status.

---

## 2. Entity: Client (Solo REN)

* **Goal**: Mengwakili pelanggan ejen hartanah berlesen (Solo REN) yang melanggan ZK Revenue Ops.
* **Definition**: Objek akaun pelanggan eksklusif yang memegang hak *Territory Lock* dan kuota kerusi perkhidmatan.
* **Purpose**: Menguruskan kebenaran akses portal, maklumat lesen LPPEH, dan penetapan kawasan projek eksklusif.
* **Owner**: Human Founder (Zubair Ariff).
* **Lifecycle**: `Vacant` ➔ `Onboarding` ➔ `Active` ➔ `Revoked / Offboarded`.
* **Relationship**: Mempunyai 1 Exclusive Seat (`SEAT-001` hingga `SEAT-030`); Memiliki beribu Lead records (`1-to-Many`).
* **Input**: Nama Penuh, No. REN, Agensi, Salinan Dokumen MSA & NDA, Borang Fokus Wilayah.
* **Output**: Client Portal Notion, Locked Territory Certificate, Laporan Audit Mingguan.
* **Business Rules**: Terhad kepada MAX 30 REN sahaja di seluruh Malaysia; Wajib bayar monthly retainer sebelum 1hb.

---

## 3. Entity: Territory Seat

* **Goal**: Menguruskan kuota 30 kerusi eksklusif perkhidmatan di seluruh Malaysia.
* **Definition**: Objek permit eksklusiviti yang mengunci 1 projek/kawasan untuk 1 REN.
* **Purpose**: Memastikan *Zero Database Collision* sesama pelanggan ZK Revenue Ops.
* **Owner**: Human Founder.
* **Lifecycle**: `Vacant` ➔ `Reserved` ➔ `Active` ➔ `Revoked`.
* **Relationship**: Terikat kepada 1 Client REN (`1-to-1`).
* **Input**: Kod Kerusi (`SEAT-001` hingga `SEAT-030`), Nama Projek/Zon Hartanah.
* **Output**: Status Kaunter Kerusi (`X/30 Seats Occupied`).
* **Business Rules**: Tidak boleh melebihi 30 seat; Dibetulkan semula kepada *Vacant* jika REN tidak aktif >7 hari.

---

## 4. Entity: Appointment (Viewing)

* **Goal**: Mengunci temujanji pertemuan fizikal pembeli bersama REN di lokasi hartanah.
* **Definition**: Objek rekod masa, tarikh, lokasi, dan status kehadiran temujanji viewing hartanah.
* **Purpose**: Menguruskan peringatan anti-ghosting T-24j & T-2j dan penyediaan Buyer Dossier.
* **Owner**: Virtual SDR Operator / Client REN.
* **Lifecycle**: `Pending Confirmation` ➔ `Confirmed T-24h` ➔ `Confirmed T-2h` ➔ `Show-Up / No-Show` ➔ `Completed`.
* **Relationship**: Dimiliki oleh 1 Lead (`Many-to-1`) dan 1 REN (`Many-to-1`).
* **Input**: Tarikh & Masa, Pautan Waze Lokasi, Profil Buyer Dossier.
* **Output**: Kad Jemputan Kalendar, Notifikasi Anti-Ghosting, Borang Maklum Balas Viewing.
* **Business Rules**: Mesti booked min 12 jam awal; Max 2 kali reschedule sahaja.

---

## 5. Entity: Virtual SDR Operator

* **Goal**: Mengwakili operator manusia yang mengendalikan komunikasi perbualan WhatsApp.
* **Definition**: Objek akaun staf operasi ZK yang menguruskan saringan lead & bantahan.
* **Purpose**: Membolehkan pengagihan giliran lead (*queue assignment*) dan penjejakan KPI operator.
* **Owner**: Human Founder.
* **Lifecycle**: `Active` ➔ `On Break` ➔ `Offline`.
* **Relationship**: Menguruskan banyak Lead & Appointment records.
* **Input**: Kredensial log masuk, status ketersediaan.
* **Output**: Log mesej WhatsApp, rekod saringan DSR, kad temujanji viewing.
* **Business Rules**: Dilarang muat turun pukal pangkalan data; Wajib ikut skrip *Objection Handling Playbook*.

---

## 6. Entity: Task

* **Goal**: Menguruskan tugasan susulan berjadual oleh operator atau bot AI.
* **Definition**: Objek tugas operasi yang perlu diselesaikan dalam tempoh SLA tertentu.
* **Purpose**: Memastikan tiada tugasan follow-up atau hantaran laporan yang terlepas.
* **Owner**: System Bot / SDR Operator.
* **Lifecycle**: `Pending` ➔ `In Progress` ➔ `Completed` ➔ `Overdue`.
* **Relationship**: Dimiliki oleh 1 Lead (`Many-to-1`).
* **Input**: Jenis Tugas, Tarikh Akhir (*Due Date*), Tahap Keutamaan (P1–P4).
* **Output**: Peringatan notifikasi, log kemas kini status.
* **Business Rules**: Task P1 Critical wajib memotong giliran task lain.

---

## 7. Entity: Activity

* **Goal**: Merekodkan setiap peristiwa perbualan atau tindakan dalam sistem.
* **Definition**: Log transaksi peristiwa atomik yang tidak boleh diubah (*Immutable Log*).
* **Purpose**: Menyediakan jejak audit (*audit trail*) penuh untuk menyemak perjalanan lead.
* **Owner**: System Bot.
* **Lifecycle**: `Created` (Kekal / Read-Only).
* **Relationship**: Dimiliki oleh 1 Lead (`Many-to-1`).
* **Input**: Event Type, Actor ID, Timestamp, Metadata.
* **Output**: Audit trail log paparan Notion.
* **Business Rules**: Log activity tidak boleh diedit atau dipadam.

---

## 8. Entity: Message

* **Goal**: Menguruskan rekod mesej teks WhatsApp yang dihantar dan diterima.
* **Definition**: Objek kandungan mesej perbualan antara bot/SDR dan prospek pembeli.
* **Purpose**: Menyimpan sejarah komunikasi untuk saringan DSR dan semakan kualiti QA.
* **Owner**: System WhatsApp Gateway.
* **Lifecycle**: `Queued` ➔ `Sent` ➔ `Delivered` ➔ `Read` ➔ `Replied`.
* **Relationship**: Dimiliki oleh 1 Lead (`Many-to-1`).
* **Input**: No. Telefon WhatsApp, Teks Mesej, Media Attachment.
* **Output**: Rekod perbualan dalam CRM.
* **Business Rules**: Dilarang hantar mesej di luar waktu 9:00 AM – 8:30 PM.

---

## 9. Entity: Campaign (Reactivation)

* **Goal**: Mengendalikan kempen pengaktifan semula lead dormant secara pukal.
* **Definition**: Objek modul kempen perbualan berjadual untuk senarai 100–500 lead lama REN.
* **Purpose**: Wujudkan temujanji baharu daripada pangkalan data terbiar.
* **Owner**: SDR Operator / Founder.
* **Lifecycle**: `Draft` ➔ `Scheduled` ➔ `Running` ➔ `Completed` ➔ `Paused`.
* **Relationship**: Mengandungi banyak Lead records (`1-to-Many`).
* **Input**: Senarai Kontak Import, Skrip Mesej Blast, Waktu Hantaran.
* **Output**: Kadar Respon (%), Kadar Viewing Booked (%), Senarai Lead Aktif.
* **Business Rules**: Maksimum 50 mesej sejam untuk elak sekatan WhatsApp API.

---

## 10. Entity: Report (Weekly Audit)

* **Goal**: Menyediakan laporan audit prestasi jualan dan ROI mingguan untuk pelanggan REN.
* **Definition**: Objek ringkasan statistik harian & mingguan yang dihantar setiap Isnin jam 9 pagi.
* **Purpose**: Membuktikan nisbah ROI jualan komisyen REN (3x–5x).
* **Owner**: System Reporting Engine.
* **Lifecycle**: `Generating` ➔ `Published` ➔ `Delivered`.
* **Relationship**: Dimiliki oleh 1 Client REN (`Many-to-1`).
* **Input**: Data Lead Ingested, Speed-to-Lead avg, Viewing Show-up %, Commission Value.
* **Output**: Dokumen PDF / Markdown Audit Report.
* **Business Rules**: Wajib siap dan dihantar sebelum jam 9:00 pagi setiap Isnin.

---

## 11. Entity: Tag

* **Goal**: Memberi label atribut fleksibel kepada lead (Di luar status pipeline).
* **Definition**: Objek kata kunci pengelasan spesifik untuk pencarian pantas.
* **Purpose**: Memudahkan penapisan prospek mengikut kriteria khas (cth: Cash Buyer, Investor, Urgent).
* **Owner**: System / SDR Operator.
* **Lifecycle**: `Active` ➔ `Deprecated`.
* **Relationship**: Dihubungkan kepada Lead (`Many-to-Many`).
* **Input**: Nama Tag, Warna Tag, Kriteria Tagging.
* **Output**: Filtered Lead List.
* **Business Rules**: Tag bukan status pipeline; Tag boleh ditambah/dibuang.

---

## 12. Entity: Timeline

* **Goal**: Memaparkan kronologi pergerakan fasa jualan lead secara visual.
* **Definition**: Objek rentetan masa pertukaran fasa dari `New` hingga `Closed Won/Lost`.
* **Purpose**: Membolehkan REN dan Operator melihat sejarah masa perbualan prospek.
* **Owner**: System Bot.
* **Lifecycle**: `Created` (Append-Only).
* **Relationship**: Dimiliki oleh 1 Lead (`1-to-1 Timeline`).
* **Input**: Perubahan Fasa Status, Masa Pertukaran.
* **Output**: Visual Timeline Board di Notion.
* **Business Rules**: Dikemas kini secara automatik oleh webhook sistem.

---

## 13. Entity: Dashboard

* **Goal**: Menyediakan antaramuka paparan metrik jualan 1-Klik di Notion Client Portal.
* **Definition**: Objek agregasi data statistik pipeline jualan REN secara real-time.
* **Purpose**: Membolehkan REN melihat anggaran nilai komisyen dan status temujanji.
* **Owner**: Client REN / System.
* **Lifecycle**: `Active`.
* **Relationship**: Dimiliki oleh 1 Client REN (`1-to-1 Dashboard`).
* **Input**: Data Pipeline Kanban, Metrik ROI.
* **Output**: Paparan UI Notion.
* **Business Rules**: Paparan mesra telefon bimbit, tiada paparan data REN lain.

---

## 14. Entity: Notification

* **Goal**: Menghantar amaran serta-merta kepada REN atau SDR apabila berlaku peristiwa P1 Critical.
* **Definition**: Objek amaran mesej singkat menerusi WhatsApp atau e-mel.
* **Purpose**: Memastikan tindak balas pantas untuk eskalasi temujanji / isu ghosting.
* **Owner**: System Notification Engine.
* **Lifecycle**: `Triggered` ➔ `Sent` ➔ `Acknowledged`.
* **Relationship**: Dituju kepada Client REN / SDR Operator (`Many-to-1`).
* **Input**: Event Alert Type, Mesej Amaran, Target Recipient.
* **Output**: Pop-up WhatsApp Alert.
* **Business Rules**: Hantar serta-merta untuk kes P1 Critical (<1 minit).

---

## 15. Entity: Buyer Dossier

* **Goal**: Menampilkan profail pembeli yang disahkan (Tier 1 Hot) kepada ejen REN tanpa mendedahkan rekod dalaman operator.
* **Definition**: Objek ringkasan prospek berkualiti tinggi yang mengandungi status pinjaman, bajet, dan masa temujanji.
* **Purpose**: Membolehkan REN bersiap sedia untuk sesi viewing fizikal dengan maklumat lengkap prospek.
* **Owner**: System / Console Operator Hub.
* **Lifecycle**: `Draft` ➔ `Verified (Active)` ➔ `Completed` / `Archived`.
* **Relationship**: Terbit daripada 1 Lead (`1-to-1 Dossier`).
* **Input**: Nama Pembeli, No Telefon WhatsApp, Bajet, Status Pinjaman, Lokasi Pilihan, Masa Viewing.
* **Output**: Paparan Dossier di REN Client Desk.
* **Business Rules**: Hanya prospek Tier 1 Hot dengan temujanji disahkan dibenarkan terbit ke REN Client Desk.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Kamus Entiti Objek ZK Revenue Ops (ZK-IA-001) |
| **v1.1** | 2026-07-26 | AI AGY | Penambahan Entiti 15: Buyer Dossier bagi pengasingan REN Client Desk |

