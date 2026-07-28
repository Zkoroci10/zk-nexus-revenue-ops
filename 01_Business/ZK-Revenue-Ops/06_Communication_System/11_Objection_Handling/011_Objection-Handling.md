---
Title: 011 Objection Handling - ZK Revenue Ops
ID: ZK-COM-011
Type: Communication System Document
Module: 06_Communication_System / 11_Objection_Handling / 011
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 011 Objection Handling

## Goal
Menyediakan matriks skrip penanganan bantahan (*Objection Handling Matrix*) bagi 8 kategori bantahan popular pembeli hartanah di Malaysia.

## Purpose
Membolehkan Operator dan AI Agent membalas bantahan prospek secara berasaskan solusi tanpa berhujah (*Zero Argument*).

## Scope
Bantahan: Not Interested, Already Bought, No Budget, Need Time, Busy, Send Information, Wrong Timing, Already Have Agent.

## Trigger
Prospek menyatakan bantahan atau kewas-awasan dalam perbualan.

## Audience
Prospek Pembeli / Penyewa Hartanah.

## Channel
WhatsApp & Call.

---

## 2-Layer Communication Architecture

### Layer 1 — Business Communication (Objection Rules)
1. **Empathy First Rule**: Sentiasa akuinya pandangan prospek sebelum memberikan penerangan (cth: *"Faham bang, memang kena fikir betul-betul..."*).
2. **Value Offer Rule**: Tawarkan nilai tambahan (penilaian DSR percuma / layout plan eksklusif) untuk menarik minat viewing.
3. **Escalation Threshold**: Sekiranya prospek menolak 3 kali berturut-turut, HENTIKAN susulan dan tag `Archived Opt-Out`.

### Layer 2 — Channel Implementation (Script Matrix)

#### Objection 1: "Harga mahal sangat bang / Tak mampu" (`OBJ-01`)
* **Maksud**: Pembeli rasa harga melebihi bajet atau tak tahu ada rebat pemaju.
* **Respon Disyorkan**: *"Faham Encik. Memang tengok harga kasar rasa tinggi, tapi projek ni ada pakej rebat khas & zero downpayment bulan ni. Kalau ikut gaji Encik, komitmen bulanan sebenarnya sekitar RM1,800 je. Apa kata Encik tengok dulu unit contoh Sabtu ni jam 11 pagi?"*

#### Objection 2: "Nak bincang dengan isteri / suami dulu" (`OBJ-02`)
* **Maksud**: Pembeli ragu-ragu buat keputusan sorang-sorang.
* **Respon Disyorkan**: *"Bagus sangat tu Encik! Rumah ni kan untuk duduk bersama keluarga. Apa kata Encik bawa isteri sekali Sabtu ni jam 11 pagi untuk tengok susun atur dapur & bilik contoh? Boleh rasa sendiri suasana rumah."*

#### Objection 3: "Hantar brochure / maklumat kat WhatsApp dulu" (`OBJ-03`)
* **Maksud**: Pembeli malas nak cakap panjang atau nak elak komitmen.
* **Respon Disyorkan**: *"Boleh sangat Encik! Saya dah hantarkan brochure & video walkthrough unit kat atas ni. Tapi video tak sama macam tengok sendiri lighting & saiz ruang. Encik lapang tak hujung minggu ni untuk saya simpan 1 slot viewing?"*

---

## Message Flow
`Objection Received` ➔ `Empathy Statement` ➔ `Value Pitch` ➔ `Viewing Re-Offer`

## Business Rules
`BR-003` (Zero Hard Selling), `OR-002` (Script Compliance).

## Templates
`OBJ-01` hingga `OBJ-08`.

## QA Checklist
- [ ] Mesej bermula dengan pernyataan simpati/empathy.
- [ ] Tiada elemen berhujah dengan prospek.

## KPIs
* **Objection Conversion Rate**: > 20% bantahan bertukar menjadi viewing.

## Related SOP
`SOP-006` (Outreach), `SOP-007` (Follow-up)

## Related Workflow
`ZK-WF-002` (Lead Lifecycle)

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Objection Handling ZK Revenue Ops |
