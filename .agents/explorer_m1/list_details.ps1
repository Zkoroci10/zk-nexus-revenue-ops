$data = Get-Content 'C:\Users\Dell\Documents\Projects ZK Nexus\.agents\explorer_m1\audit_results.json' | ConvertFrom-Json

Write-Host "=== ACTIVE MODULES & ROOT NON-COMPLIANT FILES ===" -ForegroundColor Yellow
$data | Where-Object {$_.Scope -ne '99_Archive' -and $_.Scope -ne '.agents' -and $_.Status -ne 'OK'} | ForEach-Object {
    Write-Host " - [$($_.File)] (Scope: $($_.Scope)) | Status: $($_.Status) | Reason: $($_.Reason)"
}

Write-Host "`n=== 99_ARCHIVE NON-COMPLIANT FILES ===" -ForegroundColor Yellow
$data | Where-Object {$_.Scope -eq '99_Archive' -and $_.Status -ne 'OK'} | ForEach-Object {
    Write-Host " - [$($_.File)] | Status: $($_.Status) | Reason: $($_.Reason)"
}

Write-Host "`n=== .AGENTS SKILLS WITH MISSING KEYS ===" -ForegroundColor Yellow
$data | Where-Object {$_.Scope -eq '.agents' -and $_.Status -eq 'MISSING_KEYS'} | ForEach-Object {
    Write-Host " - [$($_.File)] | Missing: $($_.MissingKeys)"
}
