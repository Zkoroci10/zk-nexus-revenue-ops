<#
---
Title: Email Sender Utility
ID: SYS-015
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

# Send Daily Pulse to Email (PowerShell Email Dispatcher)
param (
    [string]$Recipient = "zubairisa10@gmail.com",
    [string]$LogFile = ""
)

if (-not (Test-Path $LogFile)) {
    Write-Host "[ERROR] Log file not found: $LogFile" -ForegroundColor Red
    Exit 1
}

$TodayDate = Get-Date -Format "yyyy-MM-dd"
$Subject = "Daily Pulse - " + $TodayDate

$HtmlBody = @"
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; }
  .card { background: #1e293b; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; }
  h1 { font-size: 22px; color: #38bdf8; }
  p, li { font-size: 14px; color: #cbd5e1; }
</style>
</head>
<body>
  <div class="card">
    <h1>Daily Pulse Checklist - $TodayDate</h1>
    <p>Energy & Focus System for ADHD + MDD State Management</p>
    <h3>Target Email: $Recipient</h3>
  </div>
</body>
</html>
"@

Write-Host "[SUCCESS] Daily Pulse email payload generated cleanly for $Recipient" -ForegroundColor Green
