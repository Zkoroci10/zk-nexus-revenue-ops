# ZNS Validation PowerShell Script (validate-zns.ps1)
# Validates metadata frontmatter for Project ZK Nexus

param (
    [string]$WorkspaceDir = "C:\Users\Dell\Documents\Projects ZK Nexus"
)

Write-Host "Starting ZNS Validation Scan (PowerShell) in: $WorkspaceDir" -ForegroundColor Cyan

$requiredKeys = @("Title:", "ID:", "Type:", "Module:", "Status:", "Version:")
$validCount = 0
$invalidCount = 0
$issues = @()

$mdFiles = Get-ChildItem -Path $WorkspaceDir -Recurse -Filter "*.md" | Where-Object {
    $_.FullName -notmatch '\\\.git\\' -and 
    $_.FullName -notmatch '\\\.snapshots\\' -and 
    $_.FullName -notmatch '\\\.agents\\' -and 
    $_.FullName -notmatch '\\99_Archive\\' -and
    $_.Name -ne "README.md" -and
    $_.Name -ne "AI-START-HERE.md"
}

foreach ($file in $mdFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $relPath = $file.FullName.Replace($WorkspaceDir, "").TrimStart("\")

    if (-not ($content -like "---*")) {
        $invalidCount++
        $issues += [PSCustomObject]@{ File = $relPath; Issue = "Missing frontmatter header" }
        continue
    }

    $missing = @()
    foreach ($key in $requiredKeys) {
        if (-not ($content -match $key)) {
            $missing += $key
        }
    }

    if ($missing.Count -gt 0) {
        $missingStr = $missing -join ", "
        $invalidCount++
        $issues += [PSCustomObject]@{ File = $relPath; Issue = "Missing metadata keys: $missingStr" }
    } else {
        $validCount++
    }
}

Write-Host ""
Write-Host "================ ZNS VALIDATION REPORT ================" -ForegroundColor Yellow
Write-Host "Valid ZNS Files: $validCount" -ForegroundColor Green
Write-Host "Non-compliant Files: $invalidCount" -ForegroundColor Red

if ($issues.Count -gt 0) {
    Write-Host ""
    Write-Host "Issues Found:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host " - [$($issue.File)]: $($issue.Issue)" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "All workspace files pass ZNS validation standards!" -ForegroundColor Green
}
