$data = Get-Content 'C:\Users\Dell\Documents\Projects ZK Nexus\.agents\explorer_m1\audit_results.json' | ConvertFrom-Json
$data | Group-Object Scope | ForEach-Object {
    [PSCustomObject]@{
        Scope = $_.Name
        Total = $_.Count
        OK = ($_.Group | Where-Object {$_.Status -eq 'OK'}).Count
        NoHeader = ($_.Group | Where-Object {$_.Status -eq 'NO_HEADER'}).Count
        MissingKeys = ($_.Group | Where-Object {$_.Status -eq 'MISSING_KEYS'}).Count
        MissingVersion = ($_.Group | Where-Object {$_.MissingVersion -eq $true}).Count
    }
} | Format-Table -AutoSize
