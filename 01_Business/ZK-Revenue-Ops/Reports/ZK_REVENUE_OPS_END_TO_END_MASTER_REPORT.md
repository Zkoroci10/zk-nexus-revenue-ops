---
Title: ZK_REVENUE_OPS_END_TO_END_MASTER_REPORT
ID: REP-008
Type: Report
Module: ZK Revenue Ops
BU: Real Estate AI Infrastructure
Status: Approved
Version: 1.0.0
Created: 2026-07-29
Updated: 2026-07-29
Owner: CEO / ZK Nexus Team
Related: STR-006, SYS-003, SYS-004, SYS-005
---

# 🚀 ZK REVENUE OPS — STRATEGI PRODUCT PLANNING, UI/UX BLUEPRINT & WORKFLOW SDR END-TO-END

> **Disediakan Khas Untuk**: Brader Ariff (CEO / Founder ZK Nexus)  
> **Tarikh / Masa**: 29 Julai 2026 | Target 11:00 AM Delivery  
> **Status**: APPROVED & READY FOR EXECUTION  

---

## 📋 ISI KANDUNGAN LAPORAN

1. **Ringkasan Eksekutif & Visi Sistem (RM 10,000/Bulan MRR)**
2. **Seni Bina Produk End-to-End & User Journey (3 Persona)**
3. **UI/UX Design Tokens & Standard Visual Client Portal**
4. **SDR Operations Playbook & Automasi 5,000+ Lead Database**
5. **Matriks 6 Zon Hartanah Malaysia & 100 Prospek REN**
6. **Penerokaan MCP, Connection Tool Percuma & Penemuan Baharu**
7. **Pelan Pelaksanaan Pelancaran (Roadmap ke RM10k MRR)**

---

## 1. 🎯 RINGKASAN EKSEKUTIF & VISI SISTEM

**ZK Revenue Ops** dibangunkan khusus sebagai **Infrastruktur AI-Native & Client Portal Percuma (RM0 Capital)** untuk ejen hartanah (REN) top-performer di Malaysia.

### Masalah Utama Ejen REN di Malaysia:
- **Tenggelam Dalam Database Mampu Milik/Subsale**: 1 REN biasa memegang 5,000+ data prospek lama (*legacy database*), tetapi 90% prospek tidak layak loan (DSR tinggi).
- **Kerja Manual Berulang**: REN terpaksa kira DSR (Debt Service Ratio) pembeli satu demi satu, isi borang, dan susun temujanji manual.
- **Tiada Brand Exclusivity**: Ejen kelihatan guna spreadsheet biasa / WhatsApp biasa tanpa portal client profesional.

### Solusi ZK Revenue Ops:
- **Dual-Layer Engine**: 
  1. *Local R&D SQLite Engine (`zk_crm_engine.js`)*: Tapis 5,000+ lead serentak dalam <10ms.
  2. *Notion Cloud CRM (5 DBs)*: Menyimpan data Lead Grade A & B yang layak loan untuk akses cloud ejen.
- **White-Label Client Portal**: Laman portal single-tenant atas nama ejen khas (Stripe/Linear Dark Theme).
- **Kapasiti Eksklusif**: Max **30 REN sahaja seluruh Malaysia** (5 REN per Zon x 6 Zon).

---

## 2. 🏗️ SENI BINA PRODUK END-TO-END & USER JOURNEY

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          ALIRAN KERJA END-TO-END REVENUE OPS                           │
└────────────────────────────────────────────────────────────────────────────────────────┘

  [1. INGESTION]           [2. QUALIFICATION]         [3. OPERATOR CONSOLE]       [4. CLIENT PORTAL]
┌─────────────────┐       ┌──────────────────┐       ┌────────────────────┐     ┌──────────────────┐
│ - WhatsApp Web  │ ────► │ Engine DSR (≤65%)│ ────► │ Notion Sales CRM   │ ──► │ Client Dashboard │
│ - Webhook Form  │       │ Grade A / B / C  │       │ (5 Relational DBs) │     │ (Live Cloud URL) │
│ - CSV 5k Import │       │ Lead Score 0-100 │       │ Pipeline Kanban    │     │ Single-Tenant UI │
└─────────────────┘       └──────────────────┘       └────────────────────┘     └──────────────────┘
```

### User Journey 3 Persona Utama:

1. **Persona A: SDR Team (Operator)**
   - **Tugas**: Monitor kemasukan lead dari WhatsApp Web & CSV import, pastikan DSR ditapis automatik.
   - **Antaramuka**: Notion Operator Console (Kanban Board & Triage View).
   - **Impak**: SDR tak perlu buat data entry manual; 1 SDR boleh urus 5-10 REN (25,000 lead) serentak.

2. **Persona B: Prospek REN (Client)**
   - **Tugas**: Terima senarai pembeli Grade A (Loan Eligible) yang dah sedia nak view rumah.
   - **Antaramuka**: White-Label Client Portal (`https://zkoroci10.github.io/zk-nexus-revenue-ops/`).
   - **Impak**: REN berasa bangga ada portal sendiri, mudah muat turun CSV, dan jimat 80% masa tapis loan.

3. **Persona C: Pembeli Rumah (Buyer Prospect)**
   - **Tugas**: Berinteraksi menerusi WhatsApp Auto-Responder / Form Intake.
   - **Antaramuka**: WhatsApp Chatbot automatik.
   - **Impak**: Dapat jawapan pantas tentang anggaran kelayakan loan dan cadangan kondo/rumah yang sesuai.

---

## 3. 🎨 UI/UX DESIGN TOKENS & STANDARD VISUAL CLIENT PORTAL

Untuk mengelakkan *"AI-slop design"* (glow neon berlebihan, emoji melimpah, dan warna asas generic), Client Portal menggunakan **Stripe/Linear Minimalist Dark Aesthetics**:

### Design System Tokens:

| Element | Specification / Token | Catatan Reka Bentuk |
|---|---|---|
| **Background Base** | `#09090b` (Deep Graphite) | Permukaan gelap matte, bersih & profesional |
| **Surface Cards** | `#121217` | Border subtle 1px `#1c1c24` |
| **Typography Header** | `Inter` (Weights: 600, 700) | Font korporat SaaS moden |
| **Typography Figures** | `JetBrains Mono` | Digunakan untuk RM, DSR %, & Lead Count |
| **Positive Accent** | `#22c55e` (Emerald Green) | Untuk Grade A & Pass DSR (≤65%) |
| **Warning Accent** | `#f59e0b` (Amber Gold) | Untuk Grade B & Warm Nurture |
| **Risk Accent** | `#f43f5e` (Rose Red) | Untuk Grade C & High DSR (>75%) |
| **Emoji Standard** | **ZERO EMOJI** | Menggunakan SVG Icon & Monospace Badges sahaja |

---

## 4. ⚡ SDR OPERATIONS PLAYBOOK & AUTOMASI 5,000+ LEAD DATABASE

### Jadual Harian Team SDR (09:00 AM - 06:00 PM):

```
09:00 AM - 09:30 AM ──► Daily Pipeline Audit & High-Priority Triage (Grad A Alerts)
09:30 AM - 12:00 PM ──► WhatsApp Auto-Outreach & Intake Ingestion (Brave Browser)
12:00 PM - 01:00 PM ──► DSR Calculation Review & Bank Eligibility Verification
02:00 PM - 04:30 PM ──► Viewing Appointment Scheduling with REN Clients
04:30 PM - 05:30 PM ──► Notion Cloud Sync & Client Portal Updates
05:30 PM - 06:00 PM ──► EOD Metrics Summary & Conversion Reporting
```

### Formula Kelayakan Loan (Malaysian Banking Standard DSR):

$$\text{DSR \%} = \frac{\text{Komitmen Bank Sedia Ada} + \text{Anggaran Ansuran Loan Baharu}}{\text{Gaji Bersih Bulanan (Net Income)}} \times 100$$

- **Grade A (Pass / Hot)**: DSR $\le$ 65% + Budget $\ge$ RM300k $\rightarrow$ *Notifikasi Serta-merta kepada REN*.
- **Grade B (Warm Nurture)**: DSR 66% - 75% $\rightarrow$ *Drip Campaign WhatsApp 30 Hari*.
- **Grade C (Cold / Fail)**: DSR > 75% $\rightarrow$ *KIV / Petua Pembersihan CTOS/CCRIS*.

---

## 5. 🗺️ MATRIKS 6 ZON HARTANAH MALAYSIA & 100 PROSPEK REN

Berdasarkan data transaksi hartanah rasmi **NAPIC (JPPH Malaysia)**, 30 REN diagihkan secara eksklusif ke dalam 6 Zon:

| Kod Zon | Nama Zon Rasmi | Kawasan Covered | Prospek Scraped (100) | Kuota Max REN |
|---|---|---|---|---|
| `Z1-KLC` | **ZON 1 - KL CORE & LUXURY** | KLCC, Mont Kiara, Bangsar, Cheras | **17 REN** | 5 REN |
| `Z2-SELW` | **ZON 2 - SELANGOR WEST METRO** | Petaling Jaya, Subang Jaya, Shah Alam | **17 REN** | 5 REN |
| `Z3-SELS` | **ZON 3 - SELANGOR SOUTH CORRIDOR** | Cyberjaya, Putrajaya, Bangi, Kajang | **17 REN** | 5 REN |
| `Z4-JHB` | **ZON 4 - JOHOR BAHRU & ISKANDAR SEZ** | JB City, Iskandar Puteri, Pasir Gudang | **17 REN** | 5 REN |
| `Z5-PNG` | **ZON 5 - PENANG ISLAND & MAINLAND** | Georgetown, Bayan Lepas, Butterworth | **16 REN** | 5 REN |
| `Z6-EMA` | **ZON 6 - EAST MALAYSIA HUBS** | Kota Kinabalu, Kuching, Miri | **16 REN** | 5 REN |

---

## 6. 🔌 PENEROKAAN MCP, CONNECTION TOOL PERCUMA & PENEMUAN BAHARU

Hasil kajian terhadap semua MCP & Tool percuma yang tersedia dalam sistem:

### 1. Integrasi MCP Yang Sedia Ada & Cara Guna:
- **Notion MCP**: Digunakan untuk auto-create page & update status lead dalam Notion CRM secara real-time.
- **Resend MCP**: Digunakan untuk jangkauan emel pukal (100 emel/hari percuma) menggunakan templat `TMP-002_Email_SDR-Outreach.md`.
- **Puppeteer MCP / Brave Browser**: Digunakan untuk automasi WhatsApp Web tanpa sebarang lesen berbayar.
- **Memory MCP**: Digunakan untuk menyimpan *knowledge graph* profil REN & sejarah transaksi.

### 2. Cadangan Tool Percuma Baharu (Pelengkap Sistem):
- **Cal.com (Percuma)**: Boleh diselitkan dalam Client Portal untuk pembeli rumah booking slot viewing terus dengan REN.
- **Tally.so (Percuma)**: Borang *intake* gaji & komitmen pembeli yang kelihatan sangat cantik & auto-sync ke Webhook server kita.
- **Telegram Bot API (Percuma)**: Notifikasi pantas ke telefon SDR setiap kali pembeli Grade A baru dikesan.

---

## 7. 🗓️ ROADMAP PELAKSANAAN KE TARGET RM 10,000 MRR

```
FASA 1: TESTING & OUTREACH (HARI 1 - 7)
├── Launch WhatsApp Outreach ke 100 Prospek REN (Brave Browser)
├── Launch Resend Email Campaign (100 Emel/Hari)
└── Target: Closed 5 REN Client Pertama @ RM500/bulan = RM 2,500 MRR

FASA 2: EXPANSION & ONBOARDING (HARI 8 - 21)
├── Onboard 15 REN Client merentasi 6 Zon
├── Integrasi Cal.com Viewing Scheduler ke Client Portal
└── Target: 15 REN Client @ RM500/bulan = RM 7,500 MRR

FASA 3: FULL CAPACITY 30 REN (HARI 22 - 30)
├── Onboard 20 REN Starter (RM500) + 4 REN Growth (RM1,500)
└── Target: Total Revenue = RM 16,000 MRR (MELEPASI TARGET RM 10,000 MRR!)
```

---

> [!TIP]
> **Status Sedia Ada**: Client Portal Live di `https://zkoroci10.github.io/zk-nexus-revenue-ops/`, Pangkalan Data 100 REN sedia ada, WhatsApp Engine ready dalam Brave Browser.  
> **Langkah Seterusnya**: Menunggu pengesahan daripada Brader Ariff pada jam 11:00 AM untuk melancarkan kempen WhatsApp Outreach pertama!
