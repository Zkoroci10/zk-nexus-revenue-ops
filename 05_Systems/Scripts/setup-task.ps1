<#
---
Title: Task Setup Helper
ID: SYS-016
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

$Action = New-ScheduledTaskAction -Execute "C:\Program Files\Git\bin\bash.exe" -Argument '"c:\Users\Dell\Documents\Projects ZK Nexus\05_Systems\Scripts\daily-pulse.sh"'
$Trigger = New-ScheduledTaskTrigger -Daily -At 8:00AM
Register-ScheduledTask -TaskName "ZKNexus_DailyPulse_8AM" -Action $Action -Trigger $Trigger -Force
Write-Host "[SUCCESS] Task ZKNexus_DailyPulse_8AM updated to run daily-pulse.sh at 8:00 AM daily!" -ForegroundColor Green
