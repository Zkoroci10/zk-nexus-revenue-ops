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
    $_.FullName -notmatch '\\\.agents\\'
}

foreach ($file in $mdFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $relPath = $file.FullName.Replace($WorkspaceDir, "").TrimStart("\")

    if ([string]::IsNullOrWhiteSpace($content)) {
        $invalidCount++
        $issues += [PSCustomObject]@{ File = $relPath; Issue = "File is empty" }
        continue
    }

    $trimmedContent = $content.TrimStart()
    if (-not ($trimmedContent.StartsWith("---"))) {
        $invalidCount++
        $issues += [PSCustomObject]@{ File = $relPath; Issue = "Missing frontmatter header" }
        continue
    }

    # Find the closing '---' of the YAML frontmatter block (after the opening '---')
    $secondDashIndex = $trimmedContent.IndexOf("---", 3)
    if ($secondDashIndex -lt 0) {
        $invalidCount++
        $issues += [PSCustomObject]@{ File = $relPath; Issue = "Unclosed frontmatter header block" }
        continue
    }

    # Extract the frontmatter header substring strictly
    $headerText = $trimmedContent.Substring(0, $secondDashIndex + 3)

    $missing = @()
    foreach ($key in $requiredKeys) {
        if (-not ($headerText -match $key)) {
            $missing += $key
        }
    }

    if ($missing.Count -gt 0) {
        $missingStr = $missing -join ", "
        $invalidCount++
        $issues += [PSCustomObject]@{ File = $relPath; Issue = "Missing metadata keys in frontmatter header: $missingStr" }
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
    exit 1
} else {
    Write-Host ""
    Write-Host "All workspace files pass ZNS validation standards!" -ForegroundColor Green
    exit 0
}
