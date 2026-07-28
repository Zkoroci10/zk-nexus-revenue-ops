$files = Get-ChildItem -Path "C:\Users\Dell\Documents\Projects ZK Nexus\01_Business\ZK-Revenue-Ops", "C:\Users\Dell\Documents\Projects ZK Nexus\07_Templates" -Recurse -Filter "*.md"
$nonCompliant = @()

foreach ($f in $files) {
    $c = Get-Content -Path $f.FullName -Raw
    if ($c -match "(?s)^\s*---\r?\n(.*?)\r?\n---") {
        $h = $matches[1]
        $missingFields = @()
        foreach ($field in @("Title:", "ID:", "Type:", "Module:", "Status:")) {
            if ($h -notmatch $field) {
                $missingFields += $field
            }
        }
        if ($missingFields.Count -gt 0) {
            $nonCompliant += "$($f.FullName) missing: $($missingFields -join ', ')"
        }
    } else {
        $nonCompliant += "$($f.FullName) (Missing frontmatter header)"
    }
}

Write-Host "Total markdown files scanned: $($files.Count)"
Write-Host "Non-compliant files count: $($nonCompliant.Count)"
if ($nonCompliant.Count -gt 0) {
    $nonCompliant | ForEach-Object { Write-Host " - $_" }
}
