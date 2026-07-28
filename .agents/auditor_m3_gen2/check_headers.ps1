$files = Get-ChildItem -Path "01_Business/ZK-Revenue-Ops", "07_Templates" -Recurse -Filter "*.md"
Write-Host "Total files found: $($files.Count)"
$missingCount = 0
$invalidCount = 0
$validCount = 0

foreach ($f in $files) {
    $content = Get-Content -Path $f.FullName -Raw
    if ($content -match "^\s*---\r?\n([\s\S]*?)\r?\n---") {
        $header = $matches[1]
        if ($header -match "Title:" -and ($header -match "ID:" -or $header -match "Status:")) {
            $validCount++
        } else {
            Write-Host "INVALID HEADER: $($f.FullName)"
            $invalidCount++
        }
    } else {
        Write-Host "MISSING HEADER: $($f.FullName)"
        $missingCount++
    }
}

Write-Host "Valid ZNS headers: $validCount"
Write-Host "Missing headers: $missingCount"
Write-Host "Invalid headers: $invalidCount"
