# Enhanced ZNS Audit Script with Scoped Categorization
param (
    [string]$WorkspaceDir = "C:\Users\Dell\Documents\Projects ZK Nexus"
)

$requiredKeys = @("Title:", "ID:", "Type:", "Module:", "Status:", "Version:")

$allFiles = Get-ChildItem -Path $WorkspaceDir -Recurse -Filter "*.md" | Where-Object {
    $_.FullName -notmatch '\\\.git\\' -and $_.FullName -notmatch '\\\.snapshots\\'
}

$results = @()

foreach ($file in $allFiles) {
    $rel = $file.FullName.Replace($WorkspaceDir, "").TrimStart("\")
    $content = Get-Content -Path $file.FullName -Raw

    # Categorize scope
    $scope = "Other"
    if ($rel.StartsWith(".agents\")) {
        $scope = ".agents"
    } elseif ($rel.StartsWith("99_Archive\")) {
        $scope = "99_Archive"
    } elseif ($rel -match '^(0[0-8]_[^\\]+)\\') {
        $scope = $matches[1]
    } elseif (-not ($rel.Contains("\"))) {
        $scope = "Root"
    }

    $status = "OK"
    $reason = ""
    $missingInHeader = @()

    if (-not $content -or $content.Trim() -eq "") {
        $status = "NO_HEADER"
        $reason = "Empty file"
    } else {
        $trimmed = $content.TrimStart()
        if (-not ($trimmed.StartsWith("---"))) {
            $status = "NO_HEADER"
            $reason = "Does not start with ---"
        } else {
            $secondIndex = $trimmed.IndexOf("---", 3)
            if ($secondIndex -lt 0) {
                $status = "NO_HEADER"
                $reason = "Unclosed header ---"
            } else {
                $headerText = $trimmed.Substring(3, $secondIndex - 3)
                foreach ($key in $requiredKeys) {
                    $pattern = "(?m)^\s*" + [regex]::Escape($key)
                    if (-not ($headerText -match $pattern)) {
                        $missingInHeader += $key
                    }
                }

                if ($missingInHeader.Count -gt 0) {
                    $status = "MISSING_KEYS"
                    $reason = "Missing: " + ($missingInHeader -join ", ")
                }
            }
        }
    }

    $results += [PSCustomObject]@{
        File = $rel
        Scope = $scope
        Status = $status
        Reason = $reason
        MissingKeys = ($missingInHeader -join ", ")
        MissingVersion = ($missingInHeader -contains "Version:")
    }
}

Write-Host "================ TOTAL SUMMARY ================" -ForegroundColor Yellow
Write-Host "Total Files Scanned: $($results.Count)"
Write-Host "Compliant (OK): $(($results | Where-Object {$_.Status -eq 'OK'}).Count)"
Write-Host "No Frontmatter Header: $(($results | Where-Object {$_.Status -eq 'NO_HEADER'}).Count)"
Write-Host "Missing Keys in Header: $(($results | Where-Object {$_.Status -eq 'MISSING_KEYS'}).Count)"
Write-Host "Missing Version Key: $(($results | Where-Object {$_.MissingVersion -eq $true}).Count)"

Write-Host "`n================ SCOPE BREAKDOWN ================" -ForegroundColor Yellow
$scopes = $results | Select-Object -ExpandProperty Scope -Unique | Sort-Object
foreach ($s in $scopes) {
    $sFiles = $results | Where-Object {$_.Scope -eq $s}
    $sOk = ($sFiles | Where-Object {$_.Status -eq 'OK'}).Count
    $sNoH = ($sFiles | Where-Object {$_.Status -eq 'NO_HEADER'}).Count
    $sMiss = ($sFiles | Where-Object {$_.Status -eq 'MISSING_KEYS'}).Count
    $sMissVer = ($sFiles | Where-Object {$_.MissingVersion -eq $true}).Count
    Write-Host "Scope: [$s] | Total: $($sFiles.Count) | OK: $sOk | NoHeader: $sNoH | MissingKeys: $sMiss | MissingVersion: $sMissVer"
}

Write-Host "`n================ NON-COMPLIANT ACTIVE MODULE & ROOT FILES ================" -ForegroundColor Red
$activeNonComp = $results | Where-Object {$_.Scope -ne '99_Archive' -and $_.Scope -ne '.agents' -and $_.Status -ne 'OK'}
foreach ($item in $activeNonComp) {
    Write-Host " - [$($item.File)] (Scope: $($item.Scope)): $($item.Status) - $($item.Reason)"
}

Write-Host "`n================ ALL NON-COMPLIANT FILES IN REPO ================" -ForegroundColor Red
$allNonComp = $results | Where-Object {$_.Status -ne 'OK'}
foreach ($item in $allNonComp) {
    Write-Host " - [$($item.File)] (Scope: $($item.Scope)): $($item.Status) - $($item.Reason)"
}

# Save detailed JSON report
$jsonPath = "C:\Users\Dell\Documents\Projects ZK Nexus\.agents\explorer_m1\audit_results.json"
$results | ConvertTo-Json -Depth 5 | Out-File -FilePath $jsonPath -Encoding utf8
Write-Host "`nFull JSON results saved to: $jsonPath" -ForegroundColor Cyan
