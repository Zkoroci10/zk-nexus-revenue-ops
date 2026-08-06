$json = Get-Content 'C:\Users\Dell\Documents\Projects ZK Nexus\.agents\explorer_m1\audit_results.json' -Raw | ConvertFrom-Json
$nonAgents = $json.files | Where-Object { $_.scope -ne '.agents' }
Write-Host "Total non-agents files: $($nonAgents.Count)"
Write-Host "Compliant count: $(($nonAgents | Where-Object { $_.status -eq 'OK' }).Count)"
Write-Host "Non-compliant count: $(($nonAgents | Where-Object { $_.status -ne 'OK' }).Count)"
