---
Title: Database Specification - ZK Revenue Ops
ID: ZK-DB-001
Type: Software Specification System Document
Module: 09_Software_Specification / 08_Database_Specification / ZK-DB-001
BU: ZK Revenue Ops
Status: Active Blueprint
Version: 1.0 (Manglish & Bahasa Pasar)
Created: 2026-07-24
Updated: 2026-07-24
Owner: Human Founder (Zubair Ariff) & AI AGY System
Target Market: Solo Real Estate Negotiator (REN) Malaysia (Max 30 Seats)
---

# ZK-DB-001 — Relational Database Schema Specification

> **ZK-DB-001 | Spesifikasi Skim Pangkalan Data SQL / PocketBase (Database Schema)**

---

## Purpose

Dokumen ini menterjemahkan **Senibina Data Phase 03** ke dalam skim relational database (*PostgreSQL / PocketBase / SQLite Schema*).

---

## Relational Database Tables

### 1. Table: `seats` (Quota 30 Seats)
```sql
CREATE TABLE seats (
    seat_id VARCHAR(10) PRIMARY KEY, -- 'SEAT-001' to 'SEAT-030'
    client_name VARCHAR(255) NOT NULL,
    territory_zone VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' -- 'VACANT', 'ACTIVE', 'REVOKED'
);
```

### 2. Table: `leads` (Master Lead Repository)
```sql
CREATE TABLE leads (
    lead_id VARCHAR(50) PRIMARY KEY, -- 'LEAD-00001'
    client_id VARCHAR(10) REFERENCES seats(seat_id),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL, -- '+601XXXXXXXX'
    project_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'NEW',
    tier_tag VARCHAR(50), -- 'Tier 1 Hot', 'Tier 2 Warm', 'Tier 3 Disqualified'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Table: `appointments` (Viewing Records)
```sql
CREATE TABLE appointments (
    appointment_id VARCHAR(50) PRIMARY KEY,
    lead_id VARCHAR(50) REFERENCES leads(lead_id),
    appointment_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    waze_url TEXT
);
```

---

## Version History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| **v1.0** | 2026-07-24 | Human Founder & AI AGY | Penulisan rasmi Database Schema ZK Revenue Ops (ZK-DB-001) |
