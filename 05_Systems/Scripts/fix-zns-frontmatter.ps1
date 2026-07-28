# M3 Remediation: Auto-Fix ZNS Frontmatter Headers
# Adds ZNS-compliant frontmatter to all 17 non-compliant files

$workspace = "C:\Users\Dell\Documents\Projects ZK Nexus"

$filesToFix = @(
    @{ Path = "00_Command Center\Dashboard-Legacy.md"; Title = "ZK Nexus Dashboard (Legacy)"; ID = "IDX-004"; Type = "Dashboard"; Module = "00_Command Center"; BU = "All" },
    @{ Path = "00_Command Center\ZK-Nexus-Guide.md"; Title = "ZK Nexus Guide"; ID = "IDX-005"; Type = "Guide"; Module = "00_Command Center"; BU = "All" },
    @{ Path = "00_Command Center\ZK-Nexus-Master-Index.md"; Title = "ZK Nexus Master Index"; ID = "IDX-006"; Type = "Index"; Module = "00_Command Center"; BU = "All" },
    @{ Path = "01_Business\DAE-Ecosystem\Strategy\Asset_Strategy.md"; Title = "DAE Ecosystem Asset Strategy"; ID = "DAE-001"; Type = "Strategy"; Module = "01_Business/DAE-Ecosystem"; BU = "DAE Ecosystem" },
    @{ Path = "01_Business\DAE-Ecosystem\Strategy\Business_Context.md"; Title = "DAE Ecosystem Business Context"; ID = "DAE-002"; Type = "Strategy"; Module = "01_Business/DAE-Ecosystem"; BU = "DAE Ecosystem" },
    @{ Path = "01_Business\DAE-Ecosystem\Strategy\Roadmap.md"; Title = "DAE Ecosystem Roadmap"; ID = "DAE-003"; Type = "Roadmap"; Module = "01_Business/DAE-Ecosystem"; BU = "DAE Ecosystem" },
    @{ Path = "02_Projects\Active\PRJ-004_Sales-Engine\project-report.md"; Title = "PRJ-004 Sales Engine Project Report"; ID = "PRJ-004"; Type = "Project Report"; Module = "02_Projects"; BU = "ZK Revenue Ops" },
    @{ Path = "03_Knowledge\Finance\FINANCE_SYSTEM.md"; Title = "Finance System Knowledge Base"; ID = "KNW-001"; Type = "Knowledge Base"; Module = "03_Knowledge/Finance"; BU = "All" },
    @{ Path = "03_Knowledge\Legal\LEGAL_SYSTEM.md"; Title = "Legal System Knowledge Base"; ID = "KNW-002"; Type = "Knowledge Base"; Module = "03_Knowledge/Legal"; BU = "All" },
    @{ Path = "03_Knowledge\Marketing\MARKETING_SYSTEM.md"; Title = "Marketing System Knowledge Base"; ID = "KNW-003"; Type = "Knowledge Base"; Module = "03_Knowledge/Marketing"; BU = "ZK Revenue Ops" },
    @{ Path = "03_Knowledge\Marketing\PROJECT_TRACKER.md"; Title = "Marketing Project Tracker"; ID = "KNW-004"; Type = "Tracker"; Module = "03_Knowledge/Marketing"; BU = "ZK Revenue Ops" },
    @{ Path = "04_Workforce\AI-OS\AI-Operating-System.md"; Title = "AI Operating System"; ID = "WRK-002"; Type = "Operating System"; Module = "04_Workforce/AI-OS"; BU = "All" },
    @{ Path = "04_Workforce\Constitution\AI-Worker-Constitution.md"; Title = "AI Worker Constitution"; ID = "WRK-003"; Type = "Constitution"; Module = "04_Workforce/Constitution"; BU = "All" },
    @{ Path = "04_Workforce\Constitution\EMPIRE_OPERATING_SYSTEM.md"; Title = "Empire Operating System"; ID = "WRK-004"; Type = "Operating System"; Module = "04_Workforce/Constitution"; BU = "All" },
    @{ Path = "04_Workforce\Rules\AI-Worker-Rules.md"; Title = "AI Worker Rules"; ID = "WRK-005"; Type = "Rules"; Module = "04_Workforce/Rules"; BU = "All" },
    @{ Path = "04_Workforce\Rules\AI_WORKING_RULES.md"; Title = "AI Working Rules"; ID = "WRK-006"; Type = "Rules"; Module = "04_Workforce/Rules"; BU = "All" },
    @{ Path = "05_Systems\Automation\ZK-Nexus-Workflow.md"; Title = "ZK Nexus Automation Workflow"; ID = "SYS-001"; Type = "Workflow"; Module = "05_Systems/Automation"; BU = "All" }
)

$fixedCount = 0
$errorCount = 0

foreach ($file in $filesToFix) {
    $fullPath = Join-Path $workspace $file.Path
    
    if (!(Test-Path $fullPath)) {
        Write-Host "SKIP: $($file.Path) - File not found" -ForegroundColor Yellow
        continue
    }

    $content = Get-Content -Path $fullPath -Raw

    if ($content -like "---*") {
        Write-Host "SKIP: $($file.Path) - Already has frontmatter" -ForegroundColor Yellow
        continue
    }

    $frontmatter = "---`r`nTitle: $($file.Title)`r`nID: $($file.ID)`r`nType: $($file.Type)`r`nModule: $($file.Module)`r`nBU: $($file.BU)`r`nStatus: Active`r`nVersion: 1`r`nCreated: 2026-07-28`r`nUpdated: 2026-07-28`r`nOwner: Human Founder`r`nRelated: RUL-001`r`n---`r`n`r`n"

    $newContent = $frontmatter + $content
    Set-Content -Path $fullPath -Value $newContent -NoNewline

    $fixedCount++
    Write-Host "FIXED: $($file.Path)" -ForegroundColor Green
}

Write-Host ""
Write-Host "================ M3 REMEDIATION COMPLETE ================" -ForegroundColor Cyan
Write-Host "Files Fixed: $fixedCount" -ForegroundColor Green
Write-Host "Errors: $errorCount" -ForegroundColor Red
