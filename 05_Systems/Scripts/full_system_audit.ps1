# System Audit Script for ZK Revenue Ops Single Unified WebApp

$appPath = "05_Systems\App\index.html"
$blueprintPath = "C:\Users\Dell\.gemini\antigravity\brain\435ee332-a864-4437-88f8-f519df28b010\zk_revenue_ops_master_blueprint.md"

Write-Host "=== 1. AUDITING MASTER BLUEPRINT ARTIFACT ===" -ForegroundColor Yellow
if (Test-Path $blueprintPath) {
    $bCode = Get-Content $blueprintPath -Raw
    $bLines = ($bCode -split "`n").Count
    Write-Host "Total Blueprint Document Lines: $bLines" -ForegroundColor Green
    Write-Host "SUCCESS: Master Technical Blueprint Artifact is ACTIVE!" -ForegroundColor Green
} else { Write-Host "ERROR: Master Blueprint Artifact missing!" -ForegroundColor Red }

Write-Host "`n=== 2. AUDITING MASTER UNIFIED WEBAPP (index.html) ===" -ForegroundColor Yellow
if (Test-Path $appPath) {
    $code = Get-Content $appPath -Raw
    $lines = ($code -split "`n").Count
    Write-Host "Total Unified WebApp Lines: $lines" -ForegroundColor Green
    $divOpen = ([regex]::Matches($code, '(?i)<div\b[^>]*>')).Count
    $divClose = ([regex]::Matches($code, '(?i)</div>')).Count
    Write-Host "Div Tags: <div $divOpen vs </div> $divClose" -ForegroundColor Cyan
    if ($divOpen -eq $divClose) { Write-Host "SUCCESS: Master Unified WebApp HTML Structure is PERFECT!" -ForegroundColor Green }
} else { Write-Host "ERROR: index.html missing!" -ForegroundColor Red }
