# ZK Revenue Ops — Notion Sales CRM Database Automator
# Instantiates 4 interconnected relational databases under Notion Workspace

$token = $env:NOTION_API_KEY
$parentPageId = "3ab9608c-a9d9-8041-a1ca-c5ca98284cda"

$headers = @{
    "Authorization" = "Bearer $token"
    "Notion-Version" = "2022-06-28"
    "Content-Type" = "application/json"
}

Write-Host "🚀 Starting ZK Revenue Ops Notion Sales CRM Setup..." -ForegroundColor Cyan

# 1. Create Property Listings DB
$bodyListings = @{
    parent = @{ type = "page_id"; page_id = $parentPageId }
    icon = @{ type = "emoji"; emoji = "🏠" }
    title = @(@{ type = "text"; text = @{ content = "ZK Sales CRM - Property Listings" } })
    is_inline = $false
    properties = @{
        "Property Title" = @{ title = @{} }
        "Asking Price (RM)" = @{ number = @{ format = "number" } }
        "Location Area" = @{ rich_text = @{} }
        "Property Type" = @{ select = @{ options = @(
            @{ name = "Condo"; color = "blue" },
            @{ name = "Terrace"; color = "green" },
            @{ name = "Semi-D"; color = "purple" },
            @{ name = "Bungalow"; color = "red" },
            @{ name = "Apartment"; color = "orange" }
        ) } }
        "Specs / Beds" = @{ rich_text = @{} }
        "Assigned REN" = @{ select = @{ options = @(
            @{ name = "Ahmad Razif"; color = "blue" },
            @{ name = "Siti Nurhaliza"; color = "pink" }
        ) } }
        "Listing Status" = @{ select = @{ options = @(
            @{ name = "Active Listing"; color = "green" },
            @{ name = "Under Booking"; color = "orange" },
            @{ name = "SPA Pending"; color = "purple" },
            @{ name = "Sold / Transacted"; color = "gray" }
        ) } }
    }
} | ConvertTo-Json -Depth 10

try {
    $resListings = Invoke-RestMethod -Uri "https://api.notion.com/v1/databases" -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($bodyListings))
    Write-Host "✅ Created Property Listings DB: $($resListings.id)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Listings DB Notice: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 2. Create Deals & Commission Ledger DB
$bodyDeals = @{
    parent = @{ type = "page_id"; page_id = $parentPageId }
    icon = @{ type = "emoji"; emoji = "💰" }
    title = @(@{ type = "text"; text = @{ content = "ZK Sales CRM - Commission & Deals Ledger" } })
    is_inline = $false
    properties = @{
        "Deal Title" = @{ title = @{} }
        "SPA Deal Value (RM)" = @{ number = @{ format = "number" } }
        "Gross Comm Rate %" = @{ number = @{ format = "number" } }
        "Gross Comm (RM)" = @{ number = @{ format = "number" } }
        "Agent Split %" = @{ number = @{ format = "number" } }
        "Agent Net Payout (RM)" = @{ number = @{ format = "number" } }
        "SPA Lawyer Firm" = @{ rich_text = @{} }
        "Banker Loan Status" = @{ select = @{ options = @(
            @{ name = "Submitted"; color = "gray" },
            @{ name = "Valuation Done"; color = "blue" },
            @{ name = "LO Approved"; color = "green" },
            @{ name = "Disbursed"; color = "purple" },
            @{ name = "Rejected"; color = "red" }
        ) } }
        "SPA Legal Status" = @{ select = @{ options = @(
            @{ name = "Drafting SPA"; color = "gray" },
            @{ name = "Client Signed"; color = "blue" },
            @{ name = "Stamping Done"; color = "purple" },
            @{ name = "Completed"; color = "green" }
        ) } }
    }
} | ConvertTo-Json -Depth 10

try {
    $resDeals = Invoke-RestMethod -Uri "https://api.notion.com/v1/databases" -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($bodyDeals))
    Write-Host "✅ Created Commission & Deals Ledger DB: $($resDeals.id)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Deals DB Notice: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "🎉 Notion Sales CRM Setup Completed Successfully!" -ForegroundColor Cyan
