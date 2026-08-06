<#
---
Title: Daily Pulse Shell Script
ID: SYS-026
Type: Script (Bash)
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

#!/bin/bash
# Daily Pulse Automation Script for ZK Nexus (ADHD + MDD Optimized)
# Target Email: zubairisa10@gmail.com

DATE=$(date +%Y-%m-%d)
WORKSPACE_ROOT="c:/Users/Dell/Documents/Projects ZK Nexus"
LOG_DIR="$WORKSPACE_ROOT/08_Logs/Daily-Logs"
LOG_FILE="$LOG_DIR/${DATE}_Daily-Pulse.md"

mkdir -p "$LOG_DIR"

echo "=========================================="
echo "📅 Generating Daily Pulse for: $DATE"
echo "=========================================="

cat <<EOF > "$LOG_FILE"
---
Title: Daily Pulse — $DATE
ID: PULSE-$DATE
Type: Daily Pulse Log
Module: 08_Logs / Daily-Logs
BU: All
Status: Active
Version: 1.0
Created: $DATE
Updated: $DATE
Owner: Human Founder & AI AGY System
Target Email: zubairisa10@gmail.com
---

# Daily Pulse — $DATE

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
| $DATE | AI AGY System | Generated Daily Pulse log for $DATE |
EOF

echo "✅ Daily Pulse saved to: $LOG_FILE"
powershell.exe -ExecutionPolicy Bypass -File "$WORKSPACE_ROOT/05_Systems/Scripts/send-email.ps1" -Recipient "zubairisa10@gmail.com" -LogFile "$LOG_FILE"
echo "📧 Email payload prepared for phone reading at: zubairisa10@gmail.com"
