---
Title: Client Lifecycle Workflow - ZK Revenue Ops
ID: ZK-WF-003
Type: Operational Workflow Engine Document
Module: 04_Operational_Workflow_Engine / 003 Client Lifecycle
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 003: Client Lifecycle Workflow

> **ZK-WF-003 | Enjin Kitaran Hayat Pelanggan REN (Client Account Lifecycle Engine)**

---

## Workflow Name
**Client Account Lifecycle Workflow (REN Subscriber Progression)**

## Goal
Menguruskan keseluruhan kitaran hayat akaun pelanggan Solo REN daripada fasa prospek jualan, penandatanganan dokumen MSA/NDA, pengagihan kerusi eksklusif 30-Cap, pembaharuan bulanan, hingga pembersihan akaun (*offboarding*).

## Trigger
Permohonan baharu daripada Solo REN untuk melanggan servis ZK Revenue Ops.

## Pre-conditions
* Kuota Kerusi Eksklusif (`SEAT-001` hingga `SEAT-030`) mempunyai sekurang-kurangnya 1 kerusi lapang (*Vacant Seat*).

## Input
Profil REN (Nama, No. REN LPPEH, Agensi, Zon/Projek Fokus), Pilihan Pakej Retainer.

---

## Steps (Aliran 11 Fasa Kitaran Hayat Client)

```text
[PROSPECT] ──> [MEETING] ──> [PROPOSAL] ──> [NEGOTIATION] ──> [SIGNED]
                                                                  │
                                                                  ▼
[COMPLETED / OFFBOARDING] <── [RENEWAL] <── [ACTIVE] <── [ONBOARDING]
```

1. **Prospect**: Permohonan awal diterima daripada REN.
2. **Meeting**: Sesi penerangan 1-on-1 berkenaan model 30-Cap & Territory Lock.
3. **Proposal**: Hantaran dokumen cadangan perkhidmatan (*Starter 30-Day Pilot / Retainer*).
4. **Negotiation**: Semakan zon eksklusif dan terma pembayaran.
5. **Signed**: Penandatanganan dokumen rasmi *Master Service Agreement* (MSA) & NDA.
6. **Onboarding**: Pembayaran yuran bulan pertama, pendaftaran `SEAT-NNN`, dan penerimaan 50+ lead import awal.
7. **Active**: Akaun REN beroperasi aktif. SDR & Bot automasi mengendalikan lead harian.
8. **Renewal**: Pembaharuan yuran retainer bulanan sebelum 1hb.
9. **Completed**: Tempoh kontrak tamat dengan jayanya.
10. **Offboarding**: Penyerahan fail eksport data penuh dan perlaksanaan *Data Wipe Protocol* (14 Hari).

---

## Decision Points
* **Decision 1**: Adakah zon/projek dimohon telah dilock oleh REN lain?
  * *Ya*: Tolak permohonan / Cadangkan zon alternatif / Masukkan ke Waitlist.
  * *Tidak*: Teruskan ke fasa Proposal.

## Exception Paths
* **Gagal Bayar Retainer >7 Hari**: Kunci `SEAT-NNN` ditarik balik (*Revoked*) ➔ Alih ke fasa Offboarding.

## Output
1. *Active Client Account* (Terikat dengan Kerusi ID `#01-30`).
2. *Live Notion Client Portal Link*.

## Related Business Rules & Entities
* `BR-001` (30-Cap Rule), `BR-002` (Territory Lock), `BR-004` (Seat Revocation); Entiti `Client`, `Territory Seat`.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Client Lifecycle Workflow ZK Revenue Ops (ZK-WF-003) |
