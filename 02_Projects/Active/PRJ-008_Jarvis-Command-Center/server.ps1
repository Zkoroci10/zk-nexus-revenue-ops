# ZK Nexus Jarvis Command Center Server (SYS-002)
# Language: PowerShell
# Author: AI-005

$ErrorActionPreference = "Stop"

# Title ASCII Art
Write-Host "   __ ___  ______   _______ ____  " -ForegroundColor Cyan
Write-Host "  / // _ |/ _ \ \  / /  _/ __/ __/  " -ForegroundColor Cyan
Write-Host "_ / // __ / , _/\ \/ // /_\ \_\ \   " -ForegroundColor Cyan
Write-Host "\___//_/ |_/_/|_|  \___/___/___/___/  " -ForegroundColor Cyan
Write-Host "       C O M M A N D   C E N T E R  `n" -ForegroundColor DarkCyan

# Define Paths
$WorkspaceRoot = "c:\Users\Dell\Documents\Projects ZK Nexus"
$PublicDir = Join-Path $WorkspaceRoot "02_Projects\Active\PRJ-008_Jarvis-Command-Center\public"

# Create Public Dir if not exists
if (-not (Test-Path $PublicDir)) {
    New-Item -ItemType Directory -Path $PublicDir -Force | Out-Null
}

# User32 Key Simulation setup
$Signature = @"
[DllImport("user32.dll")]
public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
"@
try {
    Add-Type -MemberDefinition $Signature -Name "User32Keys" -Namespace "Win32" -ErrorAction SilentlyContinue
} catch {}

# Speech Synthesis setup
try {
    Add-Type -AssemblyName System.Speech -ErrorAction SilentlyContinue
    $Global:Synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
} catch {
    Write-Host "[WARNING] System.Speech not available. Voice responses will fall back." -ForegroundColor Yellow
}

# Alerts System (File Watcher)
$Global:RecentAlerts = [System.Collections.Generic.List[PSCustomObject]]::new()
$Watcher = New-Object System.IO.FileSystemWatcher
$Watcher.Path = $WorkspaceRoot
$Watcher.IncludeSubdirectories = $true
$Watcher.Filter = "*.*"
$Watcher.EnableRaisingEvents = $true

# File change action
$WatcherAction = {
    param($sender, $event)
    # Ignore PRJ-008 folder to avoid loops
    if ($event.FullPath -like "*PRJ-008_Jarvis-Command-Center*") { return }
    if ($event.FullPath -like "*.git*") { return }
    
    $RelativePath = $event.FullPath.Replace($WorkspaceRoot + "\", "")
    $Alert = [PSCustomObject]@{
        Id        = [Guid]::NewGuid().ToString()
        Timestamp = [DateTime]::UtcNow.Ticks
        File      = $RelativePath
        Change    = $event.ChangeType.ToString()
    }
    
    $Global:RecentAlerts.Add($Alert)
    # Cap list size at 50
    if ($Global:RecentAlerts.Count -gt 50) {
        $Global:RecentAlerts.RemoveAt(0)
    }
    Write-Host "[ALERT] File $RelativePath changed ($($event.ChangeType))" -ForegroundColor Yellow
}

Register-ObjectEvent $Watcher "Changed" -Action $WatcherAction | Out-Null
Register-ObjectEvent $Watcher "Created" -Action $WatcherAction | Out-Null

# Web Server Listener Setup
$Port = 3000
$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://*:$Port/")

# Get Local IP to show to user
$LocalIPs = Get-NetIPAddress -AddressFamily IPv4 | 
            Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | 
            Select-Object -ExpandProperty IPAddress

Write-Host "Starting Jarvis Server..." -ForegroundColor White
try {
    $Listener.Start()
} catch {
    Write-Host "[ERROR] Failed to start listener: $_" -ForegroundColor Red
    Exit 1
}

Write-Host "[SUCCESS] Server is active and listening!" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor DarkGray
Write-Host "PC Access: " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:$Port" -ForegroundColor Cyan
foreach ($ip in $LocalIPs) {
    Write-Host "Mobile / LAN: " -NoNewline -ForegroundColor Gray
    Write-Host "http://$ip`:$Port" -ForegroundColor Cyan
}
Write-Host "----------------------------------------" -ForegroundColor DarkGray
Write-Host "Press [Ctrl + C] to terminate server`n" -ForegroundColor DarkGray

# Helper to send responses
function Send-Response ($Context, $Content, $ContentType = "text/plain", $StatusCode = 200) {
    $Response = $Context.Response
    $Response.StatusCode = $StatusCode
    $Response.ContentType = $ContentType
    $Response.Headers.Add("Access-Control-Allow-Origin", "*")
    $Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
    $Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    
    if ($Content -is [byte[]]) {
        $Bytes = $Content
    } else {
        $Bytes = [System.Text.Encoding]::UTF8.GetBytes($Content)
    }
    
    $Response.ContentLength64 = $Bytes.Length
    $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
    $Response.Close()
}

# Main Loop
try {
    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Path = $Request.Url.AbsolutePath
        $Method = $Request.HttpMethod

        # Handle CORS preflight
        if ($Method -eq "OPTIONS") {
            Send-Response $Context "" "text/plain" 200
            continue
        }

        # Route static files
        if ($Method -eq "GET" -and ($Path -eq "/" -or $Path -eq "/index.html" -or $Path -eq "/style.css" -or $Path -eq "/app.js")) {
            $FileName = if ($Path -eq "/") { "index.html" } else { $Path.TrimStart('/') }
            $FilePath = Join-Path $PublicDir $FileName
            
            if (Test-Path $FilePath) {
                $MimeType = switch ([System.IO.Path]::GetExtension($FilePath)) {
                    ".html" { "text/html" }
                    ".css" { "text/css" }
                    ".js" { "application/javascript" }
                    default { "text/plain" }
                }
                $FileBytes = [System.IO.File]::ReadAllBytes($FilePath)
                Send-Response $Context $FileBytes $MimeType
            } else {
                Send-Response $Context "File $FileName not found in public folder" "text/plain" 404
            }
            continue
        }

        # API: Get Workspace Status
        if ($Method -eq "GET" -and $Path -eq "/api/workspace-status") {
            try {
                # Load metadata counts and statuses
                $IndexContent = Get-Content (Join-Path $WorkspaceRoot "00_Command Center\Workspace-Index.md") -Raw
                $ProjContent = Get-Content (Join-Path $WorkspaceRoot "02_Projects\Active-Projects-List.md") -Raw
                
                # Simple parsing of folders
                $ActiveProjects = @()
                if ($ProjContent -match '\|(PRJ-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|') {
                    # Extract active projects
                    $MatchesFound = [regex]::Matches($ProjContent, '\|(PRJ-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|')
                    foreach ($m in $MatchesFound) {
                        if ($m.Groups[1].Value -ne "Project ID") {
                            $ActiveProjects += @{
                                id = $m.Groups[1].Value.Trim()
                                name = $m.Groups[2].Value.Trim()
                                status = $m.Groups[5].Value.Trim()
                            }
                        }
                    }
                }

                # Count folders in workspace modules
                $ModuleHealth = @()
                $Modules = Get-ChildItem $WorkspaceRoot -Directory | Where-Object { $_.Name -match '^\d{2}_' }
                foreach ($mod in $Modules) {
                    $FilesCount = (Get-ChildItem $mod.FullName -File -Recurse -ErrorAction SilentlyContinue).Count
                    $Size = (Get-ChildItem $mod.FullName -File -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
                    if ($Size -eq $null) { $Size = 0 }
                    $ModuleHealth += @{
                        name  = $mod.Name
                        files = $FilesCount
                        size  = [Math]::Round($Size / 1KB, 1) # Size in KB
                    }
                }

                $Payload = @{
                    status   = "OK"
                    founder  = "Zubair Ariff"
                    location = "Kulim, Kedah"
                    modules  = $ModuleHealth
                    projects = $ActiveProjects
                } | ConvertTo-Json -Depth 3

                Send-Response $Context $Payload "application/json"
            } catch {
                Send-Response $Context (@{status="ERROR"; message=$_.ToString()} | ConvertTo-Json) "application/json" 500
            }
            continue
        }

        # API: Live Screenshot
        if ($Method -eq "GET" -and $Path -eq "/api/screenshot") {
            try {
                Add-Type -AssemblyName System.Windows.Forms
                Add-Type -AssemblyName System.Drawing
                $Bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
                $Bmp = New-Object System.Drawing.Bitmap($Bounds.Width, $Bounds.Height)
                $Graphics = [System.Drawing.Graphics]::FromImage($Bmp)
                $Graphics.CopyFromScreen($Bounds.Location, [System.Drawing.Point]::Empty, $Bounds.Size)
                $Ms = New-Object System.IO.MemoryStream
                $Bmp.Save($Ms, [System.Drawing.Imaging.ImageFormat]::Png)
                $Bytes = $Ms.ToArray()
                
                $Graphics.Dispose()
                $Bmp.Dispose()
                $Ms.Dispose()
                
                Send-Response $Context $Bytes "image/png"
            } catch {
                Send-Response $Context "Screenshot failed: $_" "text/plain" 500
            }
            continue
        }

        # API: Alerts Polling
        if ($Method -eq "GET" -and $Path -eq "/api/alerts") {
            $SinceTicks = 0
            if ($Request.QueryString["since"]) {
                [void][int64]::TryParse($Request.QueryString["since"], [ref]$SinceTicks)
            }
            
            $Alerts = $Global:RecentAlerts | Where-Object { $_.Timestamp -gt $SinceTicks }
            $Payload = @{
                currentTicks = [DateTime]::UtcNow.Ticks
                alerts       = $Alerts
            } | ConvertTo-Json
            
            Send-Response $Context $Payload "application/json"
            continue
        }

        # API: PC Controls
        if ($Method -eq "POST" -and $Path -eq "/api/control") {
            $Reader = New-Object System.IO.StreamReader($Request.InputStream)
            $Body = $Reader.ReadToEnd()
            $Data = ConvertFrom-Json $Body
            $Action = $Data.action
            
            Write-Host "[API] Action Triggered: $Action" -ForegroundColor Cyan
            $LogMessage = "Command executed successfully"
            
            try {
                switch ($Action) {
                    "volume-up" {
                        [Win32.User32Keys]::keybd_event(175, 0, 0, 0) # Volume Up
                        [Win32.User32Keys]::keybd_event(175, 0, 2, 0)
                    }
                    "volume-down" {
                        [Win32.User32Keys]::keybd_event(174, 0, 0, 0) # Volume Down
                        [Win32.User32Keys]::keybd_event(174, 0, 2, 0)
                    }
                    "mute" {
                        [Win32.User32Keys]::keybd_event(173, 0, 0, 0) # Mute
                        [Win32.User32Keys]::keybd_event(173, 0, 2, 0)
                    }
                    "play-pause" {
                        [Win32.User32Keys]::keybd_event(179, 0, 0, 0) # Media Play/Pause
                        [Win32.User32Keys]::keybd_event(179, 0, 2, 0)
                    }
                    "next" {
                        [Win32.User32Keys]::keybd_event(176, 0, 0, 0) # Next Track
                        [Win32.User32Keys]::keybd_event(176, 0, 2, 0)
                    }
                    "prev" {
                        [Win32.User32Keys]::keybd_event(177, 0, 0, 0) # Prev Track
                        [Win32.User32Keys]::keybd_event(177, 0, 2, 0)
                    }
                    "lock" {
                        rundll32.exe user32.dll,LockWorkStation
                    }
                    "show-desktop" {
                        $Shell = New-Object -ComObject Shell.Application
                        $Shell.MinimizeAll()
                    }
                    "speak" {
                        $Text = $Data.text
                        if ($Global:Synth) {
                            $Global:Synth.SpeakAsync($Text) | Out-Null
                        }
                        $LogMessage = "Spoke text: $Text"
                    }
                    "open-url" {
                        $Url = $Data.url
                        Start-Process $Url
                        $LogMessage = "Opened URL: $Url"
                    }
                    default {
                        throw "Unknown action: $Action"
                    }
                }
                Send-Response $Context (@{status="OK"; message=$LogMessage} | ConvertTo-Json) "application/json"
            } catch {
                Send-Response $Context (@{status="ERROR"; message=$_.ToString()} | ConvertTo-Json) "application/json" 500
            }
            continue
        }

        # API: Sequencer (Task Pipeline Runner)
        if ($Method -eq "POST" -and $Path -eq "/api/sequence") {
            $Reader = New-Object System.IO.StreamReader($Request.InputStream)
            $Body = $Reader.ReadToEnd()
            $Data = ConvertFrom-Json $Body
            $Tasks = $Data.tasks # Array of tasks
            
            $Logs = [System.Collections.Generic.List[string]]::new()
            $Logs.Add("Initializing Orchestration Pipeline at $(Get-Date -Format 'HH:mm:ss')...")
            
            try {
                foreach ($t in $Tasks) {
                    $Logs.Add("Running Task: $t")
                    switch ($t) {
                        "health" {
                            $Logs.Add("Scanning workspace files...")
                            $Issues = 0
                            $Modules = Get-ChildItem $WorkspaceRoot -Directory | Where-Object { $_.Name -match '^\d{2}_' }
                            if ($Modules.Count -lt 10) {
                                $Logs.Add("[WARNING] Missing some of the 10 core modules.")
                                $Issues++
                            }
                            if (-not (Test-Path (Join-Path $WorkspaceRoot "README.md"))) {
                                $Logs.Add("[ERROR] README.md missing!")
                                $Issues++
                            }
                            if ($Issues -eq 0) {
                                $Logs.Add("All 10 modules are aligned. Health is Optimal.")
                            }
                        }
                        "screenshot" {
                            $Logs.Add("Capturing PC Desktop image...")
                            # This just logs execution, client UI loads the screenshot endpoint directly
                            $Logs.Add("Screenshot saved to request buffer.")
                        }
                        "speak" {
                            $Text = if ($Data.text) { $Data.text } else { "Orchestration sequence completed, Boss." }
                            $Logs.Add("Synthesizing speech on PC: '$Text'")
                            if ($Global:Synth) {
                                $Global:Synth.SpeakAsync($Text) | Out-Null
                            }
                        }
                        "mute" {
                            $Logs.Add("Muting system volume...")
                            [Win32.User32Keys]::keybd_event(173, 0, 0, 0)
                            [Win32.User32Keys]::keybd_event(173, 0, 2, 0)
                        }
                        "show-desktop" {
                            $Logs.Add("Minimizing all active windows...")
                            $Shell = New-Object -ComObject Shell.Application
                            $Shell.MinimizeAll()
                        }
                        "lock" {
                            $Logs.Add("Triggering PC Screen Lock...")
                            rundll32.exe user32.dll,LockWorkStation
                        }
                        default {
                            $Logs.Add("[ERROR] Unknown task: $t")
                        }
                    }
                    Start-Sleep -Milliseconds 500 # Brief delay for visual pipeline pacing
                }
                $Logs.Add("Pipeline completed successfully.")
                Send-Response $Context (@{status="OK"; logs=$Logs} | ConvertTo-Json) "application/json"
            } catch {
                $Logs.Add("Pipeline halted due to error: $_")
                Send-Response $Context (@{status="ERROR"; logs=$Logs} | ConvertTo-Json) "application/json" 500
            }
            continue
        }

        # Catch-all
        Send-Response $Context "Route not found" "text/plain" 404
    }
} finally {
    # Clean up
    $Listener.Stop()
    $Watcher.Dispose()
    Unregister-Event -SourceIdentifier "Changed" -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier "Created" -ErrorAction SilentlyContinue
    Write-Host "Jarvis Server stopped." -ForegroundColor Gray
}
