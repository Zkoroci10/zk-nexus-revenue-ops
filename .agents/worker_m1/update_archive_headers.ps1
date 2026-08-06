# Script to update frontmatter headers for the 31 legacy archive files in 99_Archive
$workspace = "C:\Users\Dell\Documents\Projects ZK Nexus"

$archiveFiles = @(
    @{
        Path = "99_Archive\Old-Business-Plans\Digital-Products\Strategy\Business_Context.md"
        ID = "ARC-001"
        Title = "Digital Products Business Context (Archived)"
        Type = "Strategy"
    },
    @{
        Path = "99_Archive\Old-Business-Plans\Digital-Products\Strategy\Launch_Process.md"
        ID = "ARC-002"
        Title = "Digital Products Launch Process (Archived)"
        Type = "Process"
    },
    @{
        Path = "99_Archive\Old-Business-Plans\Digital-Products\Strategy\Product_Framework.md"
        ID = "ARC-003"
        Title = "Digital Products Framework (Archived)"
        Type = "Framework"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\01_Dashboard\Dashboard.md"
        ID = "ARC-004"
        Title = "ZK Nexus Legacy Dashboard"
        Type = "Dashboard"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\01_Dashboard\ZK Nexus Guide.md"
        ID = "ARC-005"
        Title = "ZK Nexus Legacy Guide"
        Type = "Guideline"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\01_Dashboard\ZK Nexus Master Index.md"
        ID = "ARC-006"
        Title = "ZK Nexus Legacy Master Index"
        Type = "Index"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\02_AI_Workers\AI Operating System.md"
        ID = "ARC-007"
        Title = "Legacy AI Operating System"
        Type = "Specification"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\02_AI_Workers\AI Worker Constitution.md"
        ID = "ARC-008"
        Title = "Legacy AI Worker Constitution"
        Type = "Guideline"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\02_AI_Workers\AI Worker Rules.md"
        ID = "ARC-009"
        Title = "Legacy AI Worker Rules"
        Type = "Guideline"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\03_Projects\DAE\AI_Context\Asset_Strategy.md"
        ID = "ARC-010"
        Title = "DAE Asset Strategy (Legacy)"
        Type = "Strategy"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\03_Projects\DAE\AI_Context\Business_Context.md"
        ID = "ARC-011"
        Title = "DAE Business Context (Legacy)"
        Type = "Context"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\03_Projects\DAE\AI_Context\Roadmap.md"
        ID = "ARC-012"
        Title = "DAE Roadmap (Legacy)"
        Type = "Roadmap"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\03_Projects\Digital Products\AI_Context\Business_Context.md"
        ID = "ARC-013"
        Title = "Digital Products Business Context (Legacy)"
        Type = "Context"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\03_Projects\Digital Products\AI_Context\Launch_Process.md"
        ID = "ARC-014"
        Title = "Digital Products Launch Process (Legacy)"
        Type = "Process"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\03_Projects\Digital Products\AI_Context\Product_Framework.md"
        ID = "ARC-015"
        Title = "Digital Products Framework (Legacy)"
        Type = "Framework"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\04_SOP\SOP\AI_WORKING_RULES.md"
        ID = "ARC-016"
        Title = "Legacy AI Working Rules"
        Type = "SOP"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\04_SOP\SOP\EMPIRE_OPERATING_SYSTEM.md"
        ID = "ARC-017"
        Title = "Empire Operating System (Legacy)"
        Type = "SOP"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\05_Knowledge\Finance\FINANCE_SYSTEM.md"
        ID = "ARC-018"
        Title = "Finance System Overview (Legacy)"
        Type = "Knowledge System"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\05_Knowledge\Legal\LEGAL_SYSTEM.md"
        ID = "ARC-019"
        Title = "Legal System Overview (Legacy)"
        Type = "Knowledge System"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\05_Knowledge\Marketing\MARKETING_SYSTEM.md"
        ID = "ARC-020"
        Title = "Marketing System Overview (Legacy)"
        Type = "Knowledge System"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\05_Knowledge\Marketing\Projects\PROJECT_TRACKER.md"
        ID = "ARC-021"
        Title = "Marketing Project Tracker (Legacy)"
        Type = "Tracker"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\06_Templates\Prompt-Library\CEO-Operating-Prompt.md"
        ID = "ARC-022"
        Title = "CEO Operating Prompt (Legacy)"
        Type = "Template"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\06_Templates\Prompt-Library\README.md"
        ID = "ARC-023"
        Title = "Prompt Library Overview (Legacy)"
        Type = "Overview"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\08_RevenueOps\ZK Revenue Ops\01_Strategy\Current-CRM-Audit.md"
        ID = "ARC-024"
        Title = "Current CRM Audit (Legacy)"
        Type = "Audit"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\08_RevenueOps\ZK Revenue Ops\01_Strategy\Feature-Map.md"
        ID = "ARC-025"
        Title = "ZK RevOps Feature Map (Legacy)"
        Type = "Specification"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\08_RevenueOps\ZK Revenue Ops\01_Strategy\README.md"
        ID = "ARC-026"
        Title = "ZK RevOps Strategy Overview (Legacy)"
        Type = "Overview"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\08_RevenueOps\ZK Revenue Ops\01_Strategy\ZK Revenue Ops Dashboard.md"
        ID = "ARC-027"
        Title = "ZK RevOps Dashboard (Legacy)"
        Type = "Dashboard"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\08_RevenueOps\ZK Revenue Ops\02_Offer\AI_Context\Business_Context.md"
        ID = "ARC-028"
        Title = "ZK RevOps Business Context (Legacy)"
        Type = "Context"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\08_RevenueOps\ZK Revenue Ops\02_Offer\AI_Context\Client_Profile.md"
        ID = "ARC-029"
        Title = "ZK RevOps Client Profile (Legacy)"
        Type = "Profile"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\08_RevenueOps\ZK Revenue Ops\02_Offer\AI_Context\System_Architecture.md"
        ID = "ARC-030"
        Title = "ZK RevOps System Architecture (Legacy)"
        Type = "Architecture"
    },
    @{
        Path = "99_Archive\ZK-Nexus-Legacy\09_Automation\ZK Nexus Workflow.md"
        ID = "ARC-031"
        Title = "ZK Nexus Workflow (Legacy)"
        Type = "Workflow"
    }
)

$updatedCount = 0
$errorCount = 0

foreach ($item in $archiveFiles) {
    $fullPath = Join-Path $workspace $item.Path
    if (-not (Test-Path $fullPath)) {
        Write-Host "FILE NOT FOUND: $fullPath" -ForegroundColor Red
        $errorCount++
        continue
    }

    $rawContent = Get-Content -Path $fullPath -Raw
    if ($rawContent -and $rawContent.TrimStart().StartsWith("---")) {
        Write-Host "ALREADY HAS FRONTMATTER: $($item.Path)" -ForegroundColor Yellow
        continue
    }

    $header = @"
---
Title: $($item.Title)
ID: $($item.ID)
Type: $($item.Type)
Module: 99_Archive
BU: All
Status: Archived
Version: 1.0
Created: 2026-08-03
Updated: 2026-08-03
Owner: Human Founder
---

"@

    $newContent = $header + $rawContent
    [System.IO.File]::WriteAllText($fullPath, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "UPDATED: $($item.Path)" -ForegroundColor Green
    $updatedCount++
}

Write-Host "Done updating $updatedCount files. Errors: $errorCount."
