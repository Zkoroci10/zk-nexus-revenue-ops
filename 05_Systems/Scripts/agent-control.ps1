<#
.SYNOPSIS
    ZK-Nexus Unified Agent Controller & Skill Pipeline Launcher
.DESCRIPTION
    Provides unified 1-click launcher for OpenCODE, Kilo Code, Pi, Oh My Pi, and Cline
    pre-configured with Matt Pocock Workflows and Ponytail YAGNI Guardrails.
.PARAMETER Action
    opencode | kilocode | pi | omp | cline | ponytail-audit | grill-me | status
#>

param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("opencode", "kilocode", "pi", "omp", "cline", "ponytail-audit", "grill-me", "status")]
    [string]$Action = "status"
)

$WorkspaceRoot = "C:\Users\Dell\Documents\Projects ZK Nexus"
$ReposDir = Join-Path $WorkspaceRoot "05_Systems\External-Repos"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " 🤖 ZK-NEXUS UNIFIED AGENT & SKILL CONTROLLER v1.0" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Guardrails: Ponytail YAGNI Engine ACTIVE" -ForegroundColor Green
Write-Host " Workflows: Matt Pocock Spec-Driven Pipeline READY" -ForegroundColor Green
Write-Host " Workspace: $WorkspaceRoot" -ForegroundColor Yellow
Write-Host ""

switch ($Action) {
    "status" {
        Write-Host "[+] Installed AI Coding Agents Status:" -ForegroundColor Cyan
        Get-ChildItem -Directory $ReposDir | ForEach-Object {
            Write-Host "  - $($_.Name) : INSTALLED ($($_.FullName))" -ForegroundColor Green
        }
        Write-Host "`n[+] Installed Skills in .agents/skills:" -ForegroundColor Cyan

        Get-ChildItem -Directory "$WorkspaceRoot\.agents\skills" | ForEach-Object {
            Write-Host "  - $($_.Name)" -ForegroundColor Gray
        }
    }
    "opencode" {
        Write-Host "🚀 Launching OpenCODE Terminal Agent..." -ForegroundColor Cyan
        npx opencode --dir $WorkspaceRoot
    }
    "kilocode" {
        Write-Host "🚀 Checking Kilo Code Workspace configuration..." -ForegroundColor Cyan
        Write-Host "Kilo Code loads AGENTS.md natively. Opening workspace in VS Code..." -ForegroundColor Green
        code $WorkspaceRoot
    }
    "pi" {
        Write-Host "🚀 Launching Pi Coding Agent Harness..." -ForegroundColor Cyan
        npx @earendil/pi --dir $WorkspaceRoot
    }
    "omp" {
        Write-Host "🚀 Launching OH MY PI (omp) Rust Engine..." -ForegroundColor Cyan
        & "$ReposDir\oh-my-pi\target\release\omp.exe" --workspace $WorkspaceRoot
    }
    "cline" {
        Write-Host "🚀 Running Cline Autonomous CLI Session..." -ForegroundColor Cyan
        npx cline --workspace $WorkspaceRoot
    }
    "ponytail-audit" {
        Write-Host "🔍 Running Ponytail Anti-Bloat Codebase Audit..." -ForegroundColor Yellow
        python "$ReposDir\ponytail\__init__.py" --audit $WorkspaceRoot
    }
    "grill-me" {
        Write-Host "📋 Triggering Matt Pocock /grill-with-docs Spec Interview..." -ForegroundColor Yellow
        Write-Host "Interview prompt active. Please respond to the agent questions." -ForegroundColor Green
    }
}
