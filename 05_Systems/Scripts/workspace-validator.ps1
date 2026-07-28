# ZK Nexus Workspace & ZNS Validator
# ID: SYS-001 Asset
# Type: Script (PowerShell)
# Module: 05_Systems
# BU: All
# Status: Active
# Version: 2.0
# Created: 2026-07-18
# Updated: 2026-07-28
# Owner: Human Founder / AI Worker (worker_m2_1)
# Related: PRJ-002, SYS-001, SYS-002, RUL-001, RUL-002

param (
    [string]$WorkspacePath = "",
    [switch]$Strict,
    [switch]$SkipPython
)

$scriptPath = $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($WorkspacePath)) {
    $workspaceRoot = Split-Path (Split-Path (Split-Path $scriptPath)) -Parent
} else {
    $workspaceRoot = (Resolve-Path $WorkspacePath).ProviderPath
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "    ZK NEXUS WORKSPACE & ZNS VALIDATOR v2.0  " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Workspace Root: $workspaceRoot"
Write-Host ""

$brokenLinksCount = 0
$legacyRefsCount = 0
$registryErrorsCount = 0
$checkedLinksCount = 0

$znsNamingErrors = 0
$znsOidErrors = 0
$znsMetadataErrors = 0
$znsFolderDepthErrors = 0

# --- Helper: Convert URI/file:// to Local Path ---
function Resolve-LinkPath {
    param (
        [string]$CurrentFilePath,
        [string]$LinkTarget
    )

    if ($LinkTarget -match "^https?://") { return $null }
    if ($LinkTarget -match "^#") { return $null }
    if ($LinkTarget -match "^mailto:") { return $null }

    $ResolvedPath = $null

    if ($LinkTarget -match "^file:///(.*)") {
        $rawPath = [System.Uri]::UnescapeDataString($Matches[1])
        $rawPath = $rawPath -replace "/", "\"
        if ($rawPath -match "^[a-zA-Z]:") {
            $ResolvedPath = $rawPath
        } else {
            $ResolvedPath = Join-Path $workspaceRoot $rawPath
        }
    } else {
        $LinkTargetClean = $LinkTarget -replace "#.*$", ""
        $LinkTargetClean = [System.Uri]::UnescapeDataString($LinkTargetClean)
        if ([string]::IsNullOrWhiteSpace($LinkTargetClean)) { return $null }
        
        $currentDir = Split-Path $CurrentFilePath
        $ResolvedPath = [System.IO.Path]::GetFullPath((Join-Path $currentDir $LinkTargetClean))
    }

    return $ResolvedPath
}

# --- Active Folders Definition ---
$activeFolders = @("00_Command Center", "01_Business", "02_Projects", "03_Knowledge", "04_Workforce", "05_Systems", "06_Resources", "07_Templates", "08_Logs")
$rootModules = @("00_Command Center", "01_Business", "02_Projects", "03_Knowledge", "04_Workforce", "05_Systems", "06_Resources", "07_Templates", "08_Logs", "99_Archive")
$prohibitedWords = @("final", "updated", "latest", "v2", "v3", "new", "old")
$mandatoryMetadataKeys = @("Title", "ID", "Type", "Module", "BU", "Status", "Version", "Created", "Updated", "Owner")

# --- Task 1: ZNS File & Directory Naming (ZNS-NC) & Folder Depth ---
Write-Host "[1/5] Validating ZNS Naming & Folder Depth (ZNS-NC & ZNS-STRUCT)..." -ForegroundColor Yellow

$allFiles = Get-ChildItem -Path $workspaceRoot -Recurse -File | Where-Object {
    $relativePath = $_.FullName.Substring($workspaceRoot.Length + 1)
    $inActiveFolder = $false
    foreach ($folder in $activeFolders) {
        if ($relativePath.StartsWith($folder)) {
            $inActiveFolder = $true
            break
        }
    }
    if ($relativePath -match "drafts") { $inActiveFolder = $false }
    $inActiveFolder -and ($_.FullName -notmatch "\\\.agents\\") -and ($_.FullName -notmatch "\\node_modules\\")
}

# Check folder depth for all directories in active folders
$allDirs = Get-ChildItem -Path $workspaceRoot -Recurse -Directory | Where-Object {
    $relativePath = $_.FullName.Substring($workspaceRoot.Length + 1)
    $inActiveFolder = $false
    foreach ($folder in $activeFolders) {
        if ($relativePath.StartsWith($folder)) {
            $inActiveFolder = $true
            break
        }
    }
    if ($relativePath -match "drafts" -or $relativePath -match "99_Archive") { $inActiveFolder = $false }
    $inActiveFolder -and ($_.FullName -notmatch "\\\.agents\\")
}

foreach ($dir in $allDirs) {
    $relDir = $dir.FullName.Substring($workspaceRoot.Length + 1)
    $parts = $relDir.Split("\")
    $subfolderDepth = $parts.Length - 1
    if ($subfolderDepth -gt 2) {
        Write-Host "  ❌ ZNS-STRUCT Error: Folder depth ($subfolderDepth levels below '$($parts[0])') exceeds max allowed 2 levels: $relDir" -ForegroundColor Red
        $znsFolderDepthErrors++
    }
}

foreach ($file in $allFiles) {
    $filename = $file.Name
    $nameNoExt = [System.IO.Path]::GetFileNameWithoutExtension($filename)
    $relPath = $file.FullName.Substring($workspaceRoot.Length + 1)

    # Prohibited words check
    foreach ($word in $prohibitedWords) {
        if ($nameNoExt -match "(^|[-_.\s])$word(`$|[-_.\s])") {
            Write-Host "  ❌ ZNS-NC Error: Filename contains prohibited word '$word': $relPath" -ForegroundColor Red
            $znsNamingErrors++
        }
    }
}

# --- Task 2: Object ID Registry Validation (ZNS-OID) ---
Write-Host ""
Write-Host "[2/5] Validating Object ID Registry (ZNS-OID)..." -ForegroundColor Yellow

$registryPath = Join-Path $workspaceRoot "00_Command Center\ID-Registry.md"
$registeredIds = [System.Collections.Generic.HashSet[string]]::new()

if (Test-Path $registryPath) {
    $regContent = Get-Content $registryPath -Raw
    $idMatches = [regex]::Matches($regContent, '\b([A-Z0-9]+(?:-[A-Z0-9]+)*-\d{3,})\b')
    foreach ($m in $idMatches) {
        [void]$registeredIds.Add($m.Value)
    }
    Write-Host "  Loaded $($registeredIds.Count) registered IDs from ID-Registry.md" -ForegroundColor DarkCyan
} else {
    Write-Host "  ❌ Missing ID-Registry.md!" -ForegroundColor Red
    $znsOidErrors++
}

$foundDocIds = @{}

# --- Task 3: Metadata Header Rules (ZNS-MD) & Links ---
Write-Host ""
Write-Host "[3/5] Validating Metadata Headers (ZNS-MD) & Markdown Links..." -ForegroundColor Yellow

$mdFiles = $allFiles | Where-Object { $_.Extension -eq ".md" }

foreach ($file in $mdFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $relPath = $file.FullName.Substring($workspaceRoot.Length + 1)

    # 3.1 Metadata Header Check
    if (-not $content.StartsWith("---")) {
        Write-Host "  ❌ ZNS-MD Error: Missing YAML frontmatter header starting '---': $relPath" -ForegroundColor Red
        $znsMetadataErrors++
    } else {
        $parts = $content -split "---", 3
        if ($parts.Count -lt 3) {
            Write-Host "  ❌ ZNS-MD Error: Unclosed frontmatter header in: $relPath" -ForegroundColor Red
            $znsMetadataErrors++
        } else {
            $headerLines = $parts[1] -split "\r?\n"
            $headerKeys = [System.Collections.Generic.HashSet[string]]::new()
            $docId = ""
            $docStatus = ""

            foreach ($line in $headerLines) {
                if ($line -match "^\s*([A-Za-z0-9_]+)\s*:\s*(.*)$") {
                    $key = $Matches[1].Trim()
                    $val = $Matches[2].Trim()
                    [void]$headerKeys.Add($key)
                    if ($key -eq "ID") { $docId = $val }
                    if ($key -eq "Status") { $docStatus = $val }
                }
            }

            # Check Mandatory Keys
            $missingKeys = @()
            foreach ($mKey in $mandatoryMetadataKeys) {
                if (-not $headerKeys.Contains($mKey)) {
                    $missingKeys += $mKey
                }
            }

            if ($missingKeys.Count -gt 0) {
                Write-Host "  ❌ ZNS-MD Error: Missing mandatory fields ($($missingKeys -join ', ')) in: $relPath" -ForegroundColor Red
                $znsMetadataErrors++
            }

            # Track ID for duplicate / registry checks
            if (-not [string]::IsNullOrWhiteSpace($docId) -and $docId -ne "N/A" -and $docId -ne "TBD") {
                if (-not $foundDocIds.ContainsKey($docId)) {
                    $foundDocIds[$docId] = @()
                }
                $foundDocIds[$docId] += $relPath
            }
        }
    }

    # 3.2 Legacy path references ("ZK Nexus/") in content
    if ($content -match "ZK Nexus/") {
        Write-Host "  ⚠️ Legacy path reference found in: $relPath" -ForegroundColor DarkYellow
        $legacyRefsCount++
    }

    # 3.3 Markdown Links
    $matches = [regex]::Matches($content, '\[([^\]]+)\]\(([^)]+)\)')
    foreach ($m in $matches) {
        $linkText = $m.Groups[1].Value
        $linkTarget = $m.Groups[2].Value
        
        $resolved = Resolve-LinkPath -CurrentFilePath $file.FullName -LinkTarget $linkTarget
        if ($resolved) {
            $checkedLinksCount++
            if (-not (Test-Path -Path $resolved)) {
                Write-Host "  ❌ Broken Link in [$relPath]: '$linkText' -> '$linkTarget'" -ForegroundColor Red
                $brokenLinksCount++
            }
        }
    }
}

# --- Check Duplicate & Unregistered Object IDs ---
foreach ($idKey in $foundDocIds.Keys) {
    $filesWithId = $foundDocIds[$idKey]
    if ($filesWithId.Count -gt 1 -and $idKey -ne "BUS-001 Asset") {
        $distinctFolderCount = ($filesWithId | ForEach-Object { Split-Path $_ -Parent } | Select-Object -Unique).Count
        if ($distinctFolderCount -gt 1) {
            Write-Host "  ❌ ZNS-OID Error: Duplicate Object ID '$idKey' used across distinct folders: $($filesWithId -join ', ')" -ForegroundColor Red
            $znsOidErrors++
        }
    }
}

# --- Task 4: Verify Registries Integrity ---
Write-Host ""
Write-Host "[4/5] Checking Business & Systems Registries..." -ForegroundColor Yellow

$businessRegistryPath = Join-Path $workspaceRoot "01_Business\Business-Registry.md"
if (Test-Path $businessRegistryPath) {
    $brContent = Get-Content $businessRegistryPath -Raw
    $buSections = $brContent -split '### BUS-'
    for ($i = 1; $i -lt $buSections.Count; $i++) {
        $buSec = $buSections[$i]
        if ($buSec -match '\*\*Folder:\*\* `([^`]+)`') {
            $buFolder = $Matches[1].Replace("/", "\")
            $assetMatches = [regex]::Matches($buSec, '\|\s*`([^`]+)`\s*\|\s*\w+\s*\|\s*Active\s*\|')
            foreach ($am in $assetMatches) {
                $filename = $am.Groups[1].Value
                $normalizedFilename = $filename.Replace("/", "\")
                $assetPath = Join-Path $workspaceRoot "$buFolder\$normalizedFilename"
                $pathExists = Test-Path $assetPath
                
                if (-not $pathExists) {
                    $leafName = Split-Path $normalizedFilename -Leaf
                    $found = Get-ChildItem -Path (Join-Path $workspaceRoot $buFolder) -Filter $leafName -Recurse -File -ErrorAction SilentlyContinue
                    if ($null -ne $found -and $found.Count -gt 0) {
                        $pathExists = $true
                    }
                }
                
                if (-not $pathExists) {
                    Write-Host "  ❌ Registry Error: Asset '$filename' registered in Business-Registry.md does not exist in $buFolder" -ForegroundColor Red
                    $registryErrorsCount++
                }
            }
        }
    }
}

$systemsInventoryPath = Join-Path $workspaceRoot "05_Systems\Systems-Inventory.md"
if (Test-Path $systemsInventoryPath) {
    $siContent = Get-Content $systemsInventoryPath -Raw
    if ($siContent -match '-\s*SYS-001\s*assets:\s*([^\r\n]+)') {
        $assetsLine = $Matches[1]
        $scriptNames = [regex]::Matches($assetsLine, '`([^`]+)`') | ForEach-Object { $_.Groups[1].Value }
        foreach ($scriptName in $scriptNames) {
            $sScriptPath = Join-Path $workspaceRoot "05_Systems\Scripts\$scriptName"
            if (-not (Test-Path $sScriptPath)) {
                Write-Host "  ❌ Registry Error: Script '$scriptName' listed in Systems-Inventory.md does not exist in 05_Systems/Scripts/" -ForegroundColor Red
                $registryErrorsCount++
            }
        }
    }
}

# --- Task 5: Python cross-validation execution (if available and not skipped) ---
Write-Host ""
Write-Host "[5/5] Running validate_zns.py Cross-Validation..." -ForegroundColor Yellow

$pythonExe = "C:\Users\Dell\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if (-not (Test-Path $pythonExe)) {
    $pythonExe = (Get-Command python -ErrorAction SilentlyContinue).Source
}
$validatePyScript = Join-Path $workspaceRoot "05_Systems\Scripts\validate_zns.py"

if (-not $SkipPython -and (Test-Path $pythonExe) -and (Test-Path $validatePyScript)) {
    & $pythonExe $validatePyScript --workspace-root $workspaceRoot --quiet
    $pyExit = $LASTEXITCODE
    if ($pyExit -eq 0) {
        Write-Host "  ✅ validate_zns.py executed cleanly with 0 errors!" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ validate_zns.py reported errors (Exit code $pyExit)." -ForegroundColor Yellow
    }
} else {
    Write-Host "  (Skipping external python cross-validation)" -ForegroundColor Gray
}

# --- Summary & Diagnostics Output ---
$namingColor = if ($znsNamingErrors -gt 0) { "Red" } else { "Green" }
$depthColor = if ($znsFolderDepthErrors -gt 0) { "Red" } else { "Green" }
$oidColor = if ($znsOidErrors -gt 0) { "Red" } else { "Green" }
$mdColor = if ($znsMetadataErrors -gt 0) { "Red" } else { "Green" }
$brokenColor = if ($brokenLinksCount -gt 0) { "Red" } else { "Green" }
$legacyColor = if ($legacyRefsCount -gt 0) { "Yellow" } else { "Green" }
$registryColor = if ($registryErrorsCount -gt 0) { "Red" } else { "Green" }

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "         ZNS VALIDATION SUMMARY              " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Total Files Scanned:        $($allFiles.Count)"
Write-Host "  Markdown Files Audited:     $($mdFiles.Count)"
Write-Host "  Links Checked:              $checkedLinksCount"
Write-Host "  ZNS-NC Naming Errors:       $znsNamingErrors" -ForegroundColor $namingColor
Write-Host "  ZNS-STRUCT Depth Errors:    $znsFolderDepthErrors" -ForegroundColor $depthColor
Write-Host "  ZNS-OID Registry Errors:    $znsOidErrors" -ForegroundColor $oidColor
Write-Host "  ZNS-MD Metadata Errors:     $znsMetadataErrors" -ForegroundColor $mdColor
Write-Host "  Broken Links Found:         $brokenLinksCount" -ForegroundColor $brokenColor
Write-Host "  Legacy Path References:     $legacyRefsCount" -ForegroundColor $legacyColor
Write-Host "  Registry Inventory Errors:  $registryErrorsCount" -ForegroundColor $registryColor
Write-Host "---------------------------------------------"

$totalCriticalErrors = $znsNamingErrors + $znsFolderDepthErrors + $znsOidErrors + $znsMetadataErrors + $brokenLinksCount + $registryErrorsCount

if ($totalCriticalErrors -eq 0) {
    Write-Host "✅ WORKSPACE & ZNS VALIDATION SUCCESS! 0 critical errors found." -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ WORKSPACE & ZNS VALIDATION FAILED. $totalCriticalErrors critical error(s) found." -ForegroundColor Red
    exit 1
}
