---
Title: Current CRM Audit
ID: TBD
Type: Document
Module: 02_Projects
BU: ZK Revenue Ops
Status: Draft
Version: 1
Created: 2026-07-17
Updated: 2026-07-17
Owner: Human Founder
Related: PRJ-001
---

# ZK Revenue Ops - Current CRM Audit

Tarikh audit: 2026-07-10

## Sistem Semasa

CRM sekarang ialah Google Apps Script WebApp yang menggunakan Google Sheet sebagai database.

Komponen utama:

- `Setup.gs` - cipta sheet dan header asas.
- `Code.gs` - backend logic untuk lead, dashboard, broadcast, ghost revival, DSR, client token, dan flag lead.
- `Internal Panel HTML` - dashboard dalaman untuk urus semua lead.
- `Client Hub HTML` - dashboard client yang ditapis ikut client name.

## Sheet Yang Digunakan

- `War Room` - database lead utama.
- `Engine` - activity log.
- `Ghost Revival` - dormant/ghost lead workflow.
- `System Brain` - template script, commission rate, revival script.
- `Command Center` - formula ringkasan dashboard.

## Fungsi Yang Sudah Ada

- Add, update, delete lead.
- Dashboard stats.
- Client-specific dashboard.
- Appointment list.
- WhatsApp link generator.
- Broadcast queue.
- Ghost lead scanner.
- Revived lead tagging.
- DSR calculator.
- Client portal token.
- Client flag/escalation.
- CSV import.

## Risiko Utama

1. `doGet()` tidak kelihatan dalam fail yang dipaste.
   Tanpa `doGet()`, WebApp tidak tahu bila perlu buka Internal Panel atau Client Hub.

2. Client portal token belum disahkan dalam backend yang dipaste.
   Fungsi token wujud, tapi audit ini belum nampak route yang check `?client=...&token=...` sebelum render Client Hub.

3. WhatsApp number disimpan dengan apostrophe.
   Ini bagus untuk Google Sheet, tapi perlu pastikan semua function baca nombor tanpa rosak.

4. `importLeadsFromCSV()` guna split biasa.
   Kalau CSV ada comma dalam nama/property, import boleh lari column.

5. Banyak UI dan backend sudah besar.
   Upgrade selepas ini perlu dibuat kecil-kecil supaya sistem tidak pecah.

## Cadangan Langkah Seterusnya

Langkah paling penting sekarang: audit atau tambah `doGet()` routing.

Routing minimum patut buat:

- Jika URL ada `client` dan `token`, validate token dan buka Client Hub.
- Jika tiada client/token, buka Internal Panel.
- Jika token salah, papar access denied.

## Jangan Buat Dulu

- Jangan rebuild CRM dari kosong.
- Jangan tambah automation baru sebelum route dan access control jelas.
- Jangan ubah UI besar-besaran sebelum backend stabil.

---
## Change Log
| Date | Actor | Change |
|------|-------|--------|
| 2026-07-17 | AI-002 | Migrated file to PRJ-001 drafts folder |
