<#
---
Title: Idea Capture CLI
ID: SYS-010
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

# Instant Idea Capture Script for ZK Nexus
# Usage: idea-capture.ps1 -IdeaText "Your idea description"

param (
    [Parameter(Mandatory=$true)]
    [string]$IdeaText
)

$ErrorActionPreference = "Stop"
$Today = Get-Date -Format "yyyy-MM-dd"
$Time = Get-Date -Format "HH:mm"
$WorkspaceRoot = "c:\Users\Dell\Documents\Projects ZK Nexus"
$IdeaFile = Join-Path $WorkspaceRoot "02_Projects\Idea-Catcher.md"

if (-not (Test-Path $IdeaFile)) {
    Write-Host "[ERROR] Idea-Catcher.md not found at $IdeaFile" -ForegroundColor Red
    Exit 1
}

$Content = Get-Content -Path $IdeaFile -Raw -Encoding utf8

# Check if today's header exists
$TodayHeader = "## $Today"
$NewEntry = "### Idea ($Time): $IdeaText`n"

if ($Content -match [regex]::Escape($TodayHeader)) {
    # Insert under today's header
    $Content = $Content -replace [regex]::Escape($TodayHeader), "$TodayHeader`n`n$NewEntry"
} else {
    # Insert new today header after rules
    $RulesSection = "---`n`n## $Today`n`n$NewEntry"
    $Content = $Content -replace "---`n`n## ", "$RulesSection`n`n## "
}

# Append to summary table if present
$TableRow = "| $Today | $IdeaText | Pending Review |`n"
if ($Content -match "\| Tarikh \| Idea \| Status \|") {
    $Content = $Content -replace "\| Tarikh \| Idea \| Status \|\s*\|--------\|------\|--------\|", "| Tarikh | Idea | Status |`n|--------|------|--------|`n$TableRow"
}

$Content | Out-File -FilePath $IdeaFile -Encoding utf8
Write-Host "[SUCCESS] Idea captured in 02_Projects/Idea-Catcher.md!" -ForegroundColor Green
Write-Host "Captured: '$IdeaText'" -ForegroundColor Cyan
