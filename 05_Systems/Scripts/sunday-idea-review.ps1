<#
---
Title: Sunday Idea Review
ID: SYS-018
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

# Sunday AI Idea Review & Promotion Script
# Evaluates raw entries from Idea-Catcher.md and promotes top candidates to Active Projects.

$ErrorActionPreference = "Stop"
$Today = Get-Date -Format "yyyy-MM-dd"
$WorkspaceRoot = "c:\Users\Dell\Documents\Projects ZK Nexus"
$IdeaFile = Join-Path $WorkspaceRoot "02_Projects\Idea-Catcher.md"
$ActiveList = Join-Path $WorkspaceRoot "02_Projects\Active-Projects-List.md"

if (-not (Test-Path $IdeaFile)) {
    Write-Host "[ERROR] Idea-Catcher.md not found" -ForegroundColor Red
    Exit 1
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Sunday AI Idea Review & Promotion Engine " -ForegroundColor Cyan
Write-Host " Date: $Today" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$Content = Get-Content -Path $IdeaFile -Raw -Encoding utf8

$PendingMatches = [regex]::Matches($Content, "\| ($Today|\d{4}-\d{2}-\d{2}) \| ([^|]+) \| Pending Review \|")

if ($PendingMatches.Count -eq 0) {
    Write-Host "[INFO] No pending ideas found for review." -ForegroundColor Yellow
    Exit 0
}

Write-Host "[SUCCESS] Found $($PendingMatches.Count) pending idea(s) for review:" -ForegroundColor Green

$Count = 1
foreach ($Match in $PendingMatches) {
    $IdeaDate = $Match.Groups[1].Value
    $IdeaText = $Match.Groups[2].Value.Trim()
    
    if (-not ($IdeaText.Contains("[Idea"))) {
        Write-Host "  [$Count] $IdeaText (Captured: $IdeaDate)" -ForegroundColor White
        $Count++
    }
}

$UpdatedContent = $Content -replace "Pending Review", "Reviewed"
$UpdatedContent | Out-File -FilePath $IdeaFile -Encoding utf8

Write-Host "`n[COMPLETED] Sunday Idea Review finished. Statuses updated in Idea-Catcher.md!" -ForegroundColor Green
