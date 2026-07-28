# Forensic Audit Script for Milestone M3 (Enhanced Verification)
$projectRoot = "C:\Users\Dell\Documents\Projects ZK Nexus"

Write-Host "=========================================="
Write-Host "STARTING M3 ENHANCED FORENSIC AUDIT CHECKS"
Write-Host "=========================================="

# ----------------------------------------------------
# CHECK 1: Strict Static Analysis & Metadata Validation
# ----------------------------------------------------
Write-Host "`n--- CHECK 1: Strict ZNS YAML Headers Audit ---"
$targetDirs = @(
    "$projectRoot\01_Business\ZK-Revenue-Ops",
    "$projectRoot\07_Templates"
)

$mdFiles = Get-ChildItem -Path $targetDirs -Recurse -Filter "*.md"
$missingHeaderFiles = @()
$missingFieldFiles = @()

foreach ($file in $mdFiles) {
    $rawContent = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($rawContent -notmatch "(?s)^\s*---\r?\n(.*?)\r?\n---") {
        $missingHeaderFiles += $file.FullName
    } else {
        $headerText = $matches[1]
        $hasId = $headerText -match "(?i)\bID\b\s*:"
        $hasTitle = $headerText -match "(?i)\bTitle\b\s*:"
        $hasType = $headerText -match "(?i)\bType\b\s*:"
        $hasStatus = $headerText -match "(?i)\bStatus\b\s*:"
        
        if (-not ($hasId -and $hasTitle -and $hasType -and $hasStatus)) {
            $missingFieldFiles += "$($file.FullName) (Missing core ZNS fields)"
        }
    }
}

Write-Host "Total Markdown Files Scanned: $($mdFiles.Count)"
Write-Host "Files Missing Regex Valid ZNS YAML Header (--- ... ---): $($missingHeaderFiles.Count)"
Write-Host "Files Missing Required ZNS Metadata Fields: $($missingFieldFiles.Count)"

if ($missingHeaderFiles.Count -gt 0 -or $missingFieldFiles.Count -gt 0) {
    Write-Host "VIOLATIONS IN CHECK 1:"
    $missingHeaderFiles | ForEach-Object { Write-Host "  - Missing Header: $_" }
    $missingFieldFiles | ForEach-Object { Write-Host "  - Missing Fields: $_" }
    $check1Pass = $false
} else {
    Write-Host "CHECK 1 RESULT: PASS (100% compliant across $($mdFiles.Count) files, 0 missing headers/fields)"
    $check1Pass = $true
}

# ----------------------------------------------------
# CHECK 2: Object ID Collision & Registration Audit
# ----------------------------------------------------
Write-Host "`n--- CHECK 2: Object ID Collision & Master Registration Audit ---"
# 2a. Verify TMP-003, TMP-004, TMP-005 in 07_Templates/
$templateFiles = Get-ChildItem -Path "$projectRoot\07_Templates" -Recurse -Filter "*.md"
$templateIdMap = @{}
$collisions = @()

foreach ($file in $templateFiles) {
    $rawContent = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($rawContent -match "(?i)\bID\b\s*:\s*(TMP-\d+)") {
        $id = $matches[1].ToUpper()
        if ($templateIdMap.ContainsKey($id)) {
            $collisions += "Collision on ID ${id}: '$($templateIdMap[$id])' AND '$($file.FullName)'"
        } else {
            $templateIdMap[$id] = $file.FullName
        }
    }
}

Write-Host "Registered Templates in 07_Templates/:"
foreach ($k in ($templateIdMap.Keys | Sort-Object)) {
    Write-Host "  - $k => $($templateIdMap[$k])"
}

# Check explicit requirement: TMP-003, TMP-004, TMP-005 present and unique
$reqTemplates = @("TMP-001", "TMP-002", "TMP-003", "TMP-004", "TMP-005")
$missingTemplates = @()
foreach ($t in $reqTemplates) {
    if (-not $templateIdMap.ContainsKey($t)) {
        $missingTemplates += $t
    }
}

if ($collisions.Count -gt 0) {
    Write-Host "ID COLLISIONS DETECTED IN 07_TEMPLATES:"
    $collisions | ForEach-Object { Write-Host "  - $_" }
} else {
    Write-Host "Zero ID collisions across 07_Templates/."
}

# 2b. Check registration of ZK-OPS-001..010 and TMP-001..005 in ID-Registry.md
$registryPath = "$projectRoot\00_Command Center\ID-Registry.md"
$registryContent = Get-Content -Path $registryPath -Raw

$requiredMasterIDs = @(
    "ZK-OPS-001", "ZK-OPS-002", "ZK-OPS-003", "ZK-OPS-004", "ZK-OPS-005",
    "ZK-OPS-006", "ZK-OPS-007", "ZK-OPS-008", "ZK-OPS-009", "ZK-OPS-010",
    "TMP-001", "TMP-002", "TMP-003", "TMP-004", "TMP-005"
)

$unregisteredMasterIDs = @()
foreach ($masterId in $requiredMasterIDs) {
    if ($registryContent -notmatch [regex]::Escape($masterId)) {
        $unregisteredMasterIDs += $masterId
    }
}

Write-Host "`nMaster ID Registry Audit ($registryPath):"
foreach ($masterId in $requiredMasterIDs) {
    $status = if ($registryContent -match [regex]::Escape($masterId)) { "REGISTERED" } else { "MISSING" }
    Write-Host "  - $masterId : $status"
}

if ($collisions.Count -eq 0 -and $missingTemplates.Count -eq 0 -and $unregisteredMasterIDs.Count -eq 0) {
    Write-Host "CHECK 2 RESULT: PASS"
    $check2Pass = $true
} else {
    Write-Host "CHECK 2 RESULT: FAIL"
    $check2Pass = $false
}

# ----------------------------------------------------
# CHECK 3: Governance Taxonomy Audit
# ----------------------------------------------------
Write-Host "`n--- CHECK 3: Governance Taxonomy Audit ---"
$govFile = "$projectRoot\01_Business\ZK-Revenue-Ops\02_Governance\003_Object-ID-Standard.md"
if (Test-Path $govFile) {
    $govContent = Get-Content -Path $govFile -Raw
    $hasOpsPrefix = $govContent -match "ZK-OPS-"
    Write-Host "File exists: $govFile"
    Write-Host "'ZK-OPS-' prefix present: $hasOpsPrefix"
    
    if ($hasOpsPrefix) {
        Write-Host "CHECK 3 RESULT: PASS"
        $check3Pass = $true
    } else {
        Write-Host "CHECK 3 RESULT: FAIL"
        $check3Pass = $false
    }
} else {
    Write-Host "Governance taxonomy file MISSING: $govFile"
    Write-Host "CHECK 3 RESULT: FAIL"
    $check3Pass = $false
}

# ----------------------------------------------------
# CHECK 4: File/Folder Path Integrity
# ----------------------------------------------------
Write-Host "`n--- CHECK 4: File/Folder Path Integrity Audit ---"
$pathViolations = @()

# 4a. No space folder ZK Revenue Ops/ (excluding 99_Archive)
$spaceFolders = Get-ChildItem -Path $projectRoot -Recurse -Directory -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -eq "ZK Revenue Ops" -and $_.FullName -notlike "*99_Archive*"
}
if ($spaceFolders) {
    foreach ($sf in $spaceFolders) {
        $pathViolations += "Forbidden space folder: $($sf.FullName)"
    }
}

# 4b. No unstandardized 07_Templates/Database/ folder
$unstandardizedFolder = "$projectRoot\07_Templates\Database"
if (Test-Path $unstandardizedFolder) {
    $pathViolations += "Unstandardized template directory found: $unstandardizedFolder"
}

# 4c. No root 07_Templates/*.md duplicates (only Template-Index.md allowed at root of 07_Templates/)
$rootTemplates = Get-ChildItem -Path "$projectRoot\07_Templates" -File -Filter "*.md" | Where-Object {
    $_.Name -ne "Template-Index.md"
}
if ($rootTemplates) {
    foreach ($rt in $rootTemplates) {
        $pathViolations += "Root duplicate template file found: $($rt.FullName)"
    }
}

if ($pathViolations.Count -gt 0) {
    Write-Host "PATH VIOLATIONS DETECTED:"
    $pathViolations | ForEach-Object { Write-Host "  - $_" }
    Write-Host "CHECK 4 RESULT: FAIL"
    $check4Pass = $false
} else {
    Write-Host "No forbidden 'ZK Revenue Ops/' folder (outside archive)."
    Write-Host "No unstandardized '07_Templates/Database/' folder."
    Write-Host "No loose/duplicate markdown files at root of '07_Templates/'."
    Write-Host "CHECK 4 RESULT: PASS"
    $check4Pass = $true
}

# ----------------------------------------------------
# CHECK 5: Authentic Implementation Check
# ----------------------------------------------------
Write-Host "`n--- CHECK 5: Authentic Implementation Audit ---"
# Check all M3 files for fake returns, empty/stubs, facade implementation
$deliverableFiles = Get-ChildItem -Path "$projectRoot\01_Business\ZK-Revenue-Ops", "$projectRoot\07_Templates" -Recurse -Filter "*.md"
$fakePatterns = @(
    "TODO", "FIXME", "TBD", "PLACEHOLDER",
    'return "fake"', 'return null', "NOT_IMPLEMENTED",
    "dummy implementation", "facade implementation"
)

$flaggedLines = @()
foreach ($file in $deliverableFiles) {
    $lines = Get-Content -Path $file.FullName -ErrorAction SilentlyContinue
    $lNum = 0
    foreach ($line in $lines) {
        $lNum++
        foreach ($pat in $fakePatterns) {
            if ($line -match "\b[regex]::Escape($pat)\b") {
                $flaggedLines += "$($file.FullName):$lNum [$pat] -> $($line.Trim())"
            }
        }
    }
}

Write-Host "Scanned $($deliverableFiles.Count) files across 01_Business/ZK-Revenue-Ops/ and 07_Templates/."
if ($flaggedLines.Count -gt 0) {
    Write-Host "Flagged implementation patterns ($($flaggedLines.Count)):"
    $flaggedLines | ForEach-Object { Write-Host "  - $_" }
} else {
    Write-Host "Zero facade implementations, fake returns, or unresolved placeholders detected."
}

if ($flaggedLines.Count -eq 0) {
    Write-Host "CHECK 5 RESULT: PASS"
    $check5Pass = $true
} else {
    Write-Host "CHECK 5 RESULT: REQUIRES REVIEW"
    $check5Pass = $false
}

Write-Host "`n=========================================="
Write-Host "SUMMARY VERDICT"
Write-Host "=========================================="
Write-Host "Check 1 (Static Analysis): $check1Pass"
Write-Host "Check 2 (ID Collision & Reg): $check2Pass"
Write-Host "Check 3 (Governance Taxonomy): $check3Pass"
Write-Host "Check 4 (Path Integrity): $check4Pass"
Write-Host "Check 5 (Authentic Impl): $check5Pass"
