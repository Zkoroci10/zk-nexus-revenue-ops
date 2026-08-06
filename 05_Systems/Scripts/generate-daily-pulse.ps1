<#
---
Title: Daily Pulse Generator
ID: SYS-028
Type: Script (PowerShell)
Module: 05_Systems
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-08-05
Updated: 2026-08-05
Owner: Zubair (zubairisa10@gmail.com)
Related: PRJ-009
---
#>

# Daily Pulse Generator & Email Dispatcher (Windows PowerShell)
# Target: ADHD + MDD Friendly Morning Ritual

$ErrorActionPreference = "Stop"
$Today = Get-Date -Format "yyyy-MM-dd"
$WorkspaceRoot = "c:\Users\Dell\Documents\Projects ZK Nexus"
$LogDir = Join-Path $WorkspaceRoot "08_Logs\Daily-Logs"
$LogFile = Join-Path $LogDir "$Today`_Daily-Pulse.md"

# Ensure Log Directory Exists
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

# Generate ADHD + MDD Optimized Content
$PulseContent = @"
---
Title: Daily Pulse — $Today
ID: PULSE-$Today
Type: Daily Pulse Log
Module: 08_Logs / Daily-Logs
BU: All
Status: Active
Version: 1.0
Created: $Today
Updated: $Today
Owner: Human Founder & AI AGY System
---

# Daily Pulse — $Today

> Energy & Focus System for ADHD + MDD State Management

---

## 1. Energy Gauge Check
- [ ] **Battery Level**: (Low / Moderate / High)
- [ ] **Focus State**: (Scatterbrain / Steady / Hyperfocus)

---

## 2. Quick Dopamine Win (< 5 Minutes)
- [ ] *Selesaikan 1 tugasan mikro sekarang untuk bina momentum awal (cth: Kemas meja / Minum air / Padam 10 emel spam)*

---

## 3. Top 3 Core Priorities Today
1. [ ] **Priority 1**: [Tugasan paling bernilai hari ini]
2. [ ] **Priority 2**: [Tugasan penting]
3. [ ] **Priority 3**: [Tugasan bonus jika ada tenaga lebih]

---

## 4. Permission to Drop (Lepaskan & Abai)
- [ ] **Jangan Buat Hari Ini**: [1 perkara yang sengaja dilepaskan untuk elak rasa bersalah/overwhelmed]

---

## 5. Grounding & Dopamine Regulation
- [ ] **Remind Yourself**: Elakkan mengejar dopamine instant tanpa arah. Salurkan tenaga hyperfocus kepada Priority 1 sahaja.
- [ ] **Self-Compassion Check**: Jika tenaga MDD rendah, selesaikan Priority 1 sahaja dan berehat tanpa rasa bersalah.

---

## 6. Night Reflection & Reality Check
- [ ] **Win Hari Ini**: [Apa 1 benda yang berjaya disiapkan?]
- [ ] **Soalan Refleksi**: Adakah aku bekerja dengan tenang atau dipacu gelisah hari ini?

---

## Change Log
| Date | Actor | Change |
|------|-------|--------|
| $Today | AI AGY System | Generated Daily Pulse log for $Today |
"@

# Save to Log File
$PulseContent | Out-File -FilePath $LogFile -Encoding utf8
Write-Host "[SUCCESS] Daily Pulse saved to: $LogFile" -ForegroundColor Green
