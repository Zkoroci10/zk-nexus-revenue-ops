---
Title: Audit Rules - ZK Revenue Ops
ID: ZK-GOV-008
Type: Governance Constitution Document
Module: 02_Governance / 008 Audit Rules
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia
---

# 008: Audit Rules

> **ZK-GOV-008 | Perlembagaan Peraturan Jejak Audit & Semakan Sistem**

---

## Purpose

Dokumen ini menetapkan **peraturan jejak audit (*Audit Rules*)** bagi memastikan setiap transaksi data, perubahan status, dan prestasi automasi boleh dijejak secara 100% tanpa sebarang kebocoran.

---

## 1. Immutable Audit Log Rule (Undang-Undang Log Jejak Kekal)

```text
  [TRANSAKSI BERLAKU] ──> Automatik Rekod: { Timestamp, Actor ID, Event Type, Old Value, New Value }
```

* **AR-001.1**: Setiap perubahan status lead, pergerakan pipeline, atau pengemaskinian nota WAJIB mencatatkan **Immutable Audit Log** (Log yang tidak boleh diubah).
* **AR-001.2**: Log audit merekodkan:
  1. `timestamp` (Waktu tepat transaksi).
  2. `actor_id` (ID Operator / Bot AI / Founder yang membuat perubahan).
  3. `event_type` (Jenis peristiwa cth: `STATUS_CHANGE`, `DOSSIER_SENT`).
  4. `old_value` vs `new_value`.

---

## 2. Weekly System Integrity Audit Rule (Undang-Undang Audit Sistem Mingguan)

* **AR-002.1**: Skrip pemeriksaan sistem [full_system_audit.ps1](file:///c:/Users/Dell/Documents/Projects%20ZK%20Nexus/05_Systems/Scripts/full_system_audit.ps1) WAJIB dijalankan secara automatik setiap hari Ahad jam 11:59 malam.
* **AR-002.2**: Audit menyemak integriti sintaks kod, imbangan tanda kurung, dan pautan pangkalan data.

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Peraturan Audit ZK Revenue Ops (ZK-GOV-008) |
