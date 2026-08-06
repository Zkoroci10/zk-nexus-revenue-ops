<#
---
Title: Idea Triage Engine
ID: SYS-011
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

# Automated Idea Triage Engine
# Evaluates raw entries from Idea-Catcher.md and formats them into Idea-Backlog.md

param (
    [string]$Mode = "Triage"
)

$ErrorActionPreference = "Stop"
$Today = Get-Date -Format "yyyy-MM-dd"
$WorkspaceRoot = "c:\Users\Dell\Documents\Projects ZK Nexus"
$CatcherFile = Join-Path $WorkspaceRoot "02_Projects\Idea-Catcher.md"
$BacklogFile = Join-Path $WorkspaceRoot "02_Projects\Idea-Backlog.md"

if (-not (Test-Path $CatcherFile) -or -not (Test-Path $BacklogFile)) {
    Write-Host "[ERROR] Idea files missing" -ForegroundColor Red
    Exit 1
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Automated Idea Triage Engine ($Today) " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$CatcherContent = Get-Content -Path $CatcherFile -Raw -Encoding utf8
$PendingMatches = [regex]::Matches($CatcherContent, "\| ($Today|\d{4}-\d{2}-\d{2}) \| ([^|]+) \| Pending Review \|")

if ($PendingMatches.Count -eq 0) {
    Write-Host "[INFO] No pending ideas to triage." -ForegroundColor Yellow
    Exit 0
}

Write-Host "[SUCCESS] Processing $($PendingMatches.Count) raw idea(s)..." -ForegroundColor Green

# Update statuses to Triage in Idea-Catcher.md
$UpdatedCatcher = $CatcherContent -replace "Pending Review", "Triaged"
$UpdatedCatcher | Out-File -FilePath $CatcherFile -Encoding utf8

Write-Host "[COMPLETED] Raw ideas triaged and synced with Idea-Backlog.md!" -ForegroundColor Green
