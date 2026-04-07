<#
.SYNOPSIS
    Smart Antigravity Skills Installer - detects AI tools and installs only what you have.

.DESCRIPTION
    Scans for installed AI tools (Claude, Cursor, Gemini CLI, Codex, Kiro, OpenCode,
    VS Code + GitHub Copilot) and automatically decides what to do on every run:
      - First run:  fresh install via npx for each detected tool.
      - Re-run:     git pull to update already-installed skill directories;
                    fresh install only for tools added since the last run.
      - Auto-fix:   if git pull fails for any tool, falls back to npx automatically.
    Unchanged agent files and VS Code instructions are always skipped.
    No flags needed to get the right behavior — just run it.

.PARAMETER DryRun
    Show what would be installed or updated without making any changes.

.PARAMETER Force
    Skip confirmation prompt and proceed immediately.

.PARAMETER Risk
    Risk level filter: "low", "low-medium", "all" (default: "all")

.EXAMPLE
    .\smart-install.ps1                  # install or update — it figures out which
    .\smart-install.ps1 -DryRun          # preview what would happen
    .\smart-install.ps1 -Force -Risk low # safe skills only, no prompt
#>
param(
    [switch]$DryRun,
    [switch]$Force,
    [string]$Risk = "all"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = $PSScriptRoot

# ====================================================================
# OS + SHELL DETECTION
# ====================================================================
$isWindows = ($env:OS -eq "Windows_NT") -or ($PSVersionTable.Platform -eq "Win32NT")
$isMac     = (-not $isWindows) -and ((uname -s 2>$null) -eq "Darwin")
$isLinux   = (-not $isWindows) -and (-not $isMac)

# Normalize home directory across platforms
$UserHome = if ($isWindows) { $env:USERPROFILE } else { $env:HOME }

# Detect parent shell (CMD vs PowerShell vs other)
$parentShell = "Unknown"
try {
    $ppid = (Get-WmiObject Win32_Process -Filter "ProcessId=$PID" -ErrorAction SilentlyContinue).ParentProcessId
    if ($ppid) {
        $parentShell = (Get-Process -Id $ppid -ErrorAction SilentlyContinue).ProcessName
    }
} catch { $parentShell = "Unknown" }

# ====================================================================
# Helper: Format section header
# ====================================================================
function Write-Header {
    param([string]$Title)
    $line = "=" * 64
    Write-Host ""
    Write-Host $line -ForegroundColor DarkCyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host $line -ForegroundColor DarkCyan
}

# ====================================================================
# Helper: Status lines
# ====================================================================
function Write-Found   { param([string]$msg) Write-Host "  [OK] $msg" -ForegroundColor Green  }
function Write-Missing { param([string]$msg) Write-Host "  [--] $msg" -ForegroundColor DarkGray }
function Write-Warn    { param([string]$msg) Write-Host "  [!!] $msg" -ForegroundColor Yellow }
function Write-Info    { param([string]$msg) Write-Host "  [ ] $msg"  -ForegroundColor Gray   }

# ====================================================================
# AUTO-DETECTION
# ====================================================================
Write-Header "Antigravity Skills - Smart Installer"

# OS info
if ($isWindows) {
    $osVer = [System.Environment]::OSVersion.Version
    Write-Info "OS:    Windows $($osVer.Major).$($osVer.Minor) (build $($osVer.Build))"
} elseif ($isMac) {
    $macVer = (sw_vers -productVersion 2>$null)
    Write-Info "OS:    macOS $macVer"
} else {
    $linuxVer = (uname -r 2>$null)
    Write-Info "OS:    Linux $linuxVer"
}

# Shell info
if ($parentShell -like "cmd") {
    Write-Warn "Shell: CMD  (tip: re-run from PowerShell for best results)"
} elseif ($parentShell -match "^(pwsh|powershell)$") {
    Write-Info "Shell: PowerShell  (ideal)"
} elseif ($parentShell -ne "Unknown") {
    Write-Info "Shell: $parentShell"
}

Write-Host "  Scanning your machine for AI coding tools..." -ForegroundColor Cyan
Write-Host ""

$detected = [ordered]@{}

# --- Claude Desktop / Claude Code ---------------------------------
$claudeConfig  = if ($isWindows) { Join-Path $env:APPDATA "Claude" } else { Join-Path $UserHome ".config/Claude" }
$claudeDataDir = Join-Path $UserHome ".claude"
$claudeCmd     = Get-Command "claude" -ErrorAction SilentlyContinue
if ($claudeCmd -or (Test-Path $claudeConfig) -or (Test-Path $claudeDataDir)) {
    $detected["claude"] = $true
    Write-Found "Claude Code/Desktop  (~/.claude)"
} else {
    Write-Missing "Claude Code/Desktop"
}

# --- Cursor -------------------------------------------------------
$cursorConfig = if ($isWindows) { Join-Path $env:APPDATA "Cursor" } else { Join-Path $UserHome ".cursor" }
$cursorCmd    = Get-Command "cursor" -ErrorAction SilentlyContinue
if ($cursorCmd -or (Test-Path $cursorConfig)) {
    $detected["cursor"] = $true
    Write-Found "Cursor AI  ($cursorConfig)"
} else {
    Write-Missing "Cursor AI"
}

# --- Gemini CLI ---------------------------------------------------
$geminiCmd = Get-Command "gemini" -ErrorAction SilentlyContinue
$geminiDir = Join-Path $UserHome ".gemini"
if ($geminiCmd -or (Test-Path $geminiDir)) {
    $detected["gemini"]     = $true
    $detected["antigravity"] = $true    # always bundle antigravity with gemini
    Write-Found "Gemini CLI  (~/.gemini)"
} else {
    Write-Missing "Gemini CLI"
}

# --- OpenAI Codex -------------------------------------------------
$codexCmd = Get-Command "codex" -ErrorAction SilentlyContinue
$codexDir = Join-Path $UserHome ".codex"
if ($codexCmd -or (Test-Path $codexDir)) {
    $detected["codex"] = $true
    Write-Found "OpenAI Codex  (~/.codex)"
} else {
    Write-Missing "OpenAI Codex"
}

# --- Kiro ---------------------------------------------------------
$kiroCmd = Get-Command "kiro" -ErrorAction SilentlyContinue
$kiroDir = Join-Path $UserHome ".kiro"
if ($kiroCmd -or (Test-Path $kiroDir)) {
    $detected["kiro"] = $true
    Write-Found "Kiro  (~/.kiro)"
} else {
    Write-Missing "Kiro"
}

# --- OpenCode -----------------------------------------------------
$openCodeCmd = Get-Command "opencode" -ErrorAction SilentlyContinue
if ($openCodeCmd) {
    $detected["opencode"] = $true
    Write-Found "OpenCode"
} else {
    Write-Missing "OpenCode"
}

# --- VS Code + GitHub Copilot Chat --------------------------------
$vsCodeExt = Join-Path $UserHome ".vscode\extensions"
$hasCopilot = $false
if (Test-Path $vsCodeExt) {
    $hasCopilot = @(Get-ChildItem $vsCodeExt -Directory -ErrorAction SilentlyContinue |
                   Where-Object { $_.Name -like "github.copilot-chat*" }).Count -gt 0
}
if ($hasCopilot) {
    $detected["vscode"] = $true
    Write-Found "VS Code + GitHub Copilot Chat"
} else {
    Write-Missing "VS Code + GitHub Copilot Chat"
}

# ====================================================================
# NOTHING FOUND
# ====================================================================
if ($detected.Count -eq 0) {
    Write-Host ""
    Write-Warn "No supported AI tools detected."
    Write-Info "Supported: Claude, Cursor, Gemini CLI, Codex, Kiro, OpenCode, VS Code+Copilot"
    Write-Host ""
    exit 0
}

# ====================================================================
# INSTALL PLAN
# ====================================================================
Write-Header "Install Plan"

$flags = @()
$plan  = @()

if ($detected.Contains("claude")) {
    $flags += "--claude"
    $plan  += "  Claude skills  ->  ~/.claude/skills/"
}
if ($detected.Contains("cursor")) {
    $flags += "--cursor"
    $plan  += "  Cursor skills  ->  ~/.cursor/skills/"
}
if ($detected.Contains("gemini")) {
    $flags += "--gemini"
    $plan  += "  Gemini skills  ->  ~/.gemini/skills/"
}
if ($detected.Contains("antigravity")) {
    $flags += "--antigravity"
    $plan  += "  Antigravity    ->  ~/.gemini/antigravity/skills/"
}
if ($detected.Contains("codex")) {
    $flags += "--codex"
    $plan  += "  Codex skills   ->  ~/.codex/skills/"
}
if ($detected.Contains("kiro")) {
    $flags += "--kiro"
    $plan  += "  Kiro skills    ->  ~/.kiro/skills/"
}

# OpenCode uses --path to a project-level directory
if ($detected.Contains("opencode")) {
    $openCodeOut = Join-Path $RepoRoot ".agents\skills"
    $riskLabel = if ($Risk -eq "all") { "all skills" } else { "$Risk risk only" }
    $plan += "  OpenCode       ->  $openCodeOut  ($riskLabel)"
}

# VS Code uses a separate .instructions.md file (no CLI flag)
if ($detected.Contains("vscode")) {
    $vsOut = Join-Path $UserHome ".vscode\instructions"
    $plan += "  VS Code        ->  $vsOut\antigravity-skills.instructions.md"
}

# Claude agents (sub-agents directory)
$agentsDir = Join-Path $RepoRoot "agents"
if ($detected.Contains("claude") -and (Test-Path $agentsDir)) {
    $plan += "  Claude agents  ->  ~/.claude/agents/  ($(( Get-ChildItem $agentsDir -Filter '*.md' ).Count) files)"
}

foreach ($line in $plan) {
    Write-Host $line -ForegroundColor White
}

# ====================================================================
# CLASSIFY: new install vs existing update (git pull)
# ====================================================================
$toolPaths = @{
    "claude"      = (Join-Path $UserHome ".claude\skills")
    "cursor"      = (Join-Path $UserHome ".cursor\skills")
    "gemini"      = (Join-Path $UserHome ".gemini\skills")
    "antigravity" = (Join-Path $UserHome ".gemini\antigravity\skills")
    "codex"       = (Join-Path $UserHome ".codex\skills")
    "kiro"        = (Join-Path $UserHome ".kiro\skills")
}

# Auto-detect: git pull for already-installed dirs, fresh npx for new ones
$installFlags = [System.Collections.Generic.List[string]]::new()
$updatePaths  = @{}   # flag -> path, preserved for npx fallback

foreach ($flag in $flags) {
    $toolKey = $flag.TrimStart("-")
    if ($toolPaths.ContainsKey($toolKey)) {
        $tPath  = $toolPaths[$toolKey]
        $gitDir = Join-Path $tPath ".git"
        if ((Test-Path $tPath) -and (Test-Path $gitDir)) {
            $updatePaths[$flag] = $tPath
            continue
        }
    }
    $installFlags.Add($flag)
}

if ($installFlags.Count -gt 0) {
    Write-Host ""
    Write-Info "Will install  (new): $($installFlags -join ' ') --risk $Risk"
}
if ($updatePaths.Count -gt 0) {
    Write-Host ""
    Write-Info "Will update (git pull):"
    foreach ($p in $updatePaths.Values) { Write-Info "  $p" }
}

# ====================================================================
# DRY-RUN EARLY EXIT
# ====================================================================
if ($DryRun) {
    Write-Host ""
    Write-Host "  [DryRun] No changes made. Remove -DryRun to install/update." -ForegroundColor Magenta
    Write-Host ""
    exit 0
}

# ====================================================================
# CONFIRM
# ====================================================================
if (-not $Force) {
    Write-Host ""
    $verb = if ($installFlags.Count -gt 0 -and $updatePaths.Count -gt 0) { "install and update" } `
            elseif ($updatePaths.Count -gt 0) { "update" } else { "install" }
    $answer = Read-Host "  Proceed with ${verb}? [Y/n]"
    if ($answer -match "^[nN]") {
        Write-Host "  Cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# ====================================================================
# FRESH INSTALL (tools not yet present on this machine)
# ====================================================================
if ($installFlags.Count -gt 0) {
    Write-Header "Installing (new)"
    $riskLabel = if ($Risk -eq "all") { "(all skills)" } else { "--risk $Risk" }
    Write-Info "Targets: $($installFlags -join ', ') $riskLabel"
    Write-Host ""

    $allArgs = [System.Collections.Generic.List[string]]$installFlags
    if ($Risk -ne "all") { $allArgs.Add("--risk"); $allArgs.Add($Risk) }

    try {
        Push-Location $RepoRoot
        & npx antigravity-awesome-skills install @allArgs
        if ($LASTEXITCODE -ne 0) { throw "npx installer exited with code $LASTEXITCODE" }
    } finally {
        Pop-Location
    }

    Write-Found "Install completed."
}

# ====================================================================
# UPDATE EXISTING INSTALLS (git pull, auto-fallback to npx on failure)
# ====================================================================
if ($updatePaths.Count -gt 0) {
    Write-Header "Updating (existing installs)"
    $fallbackFlags = [System.Collections.Generic.List[string]]::new()
    foreach ($uFlag in $updatePaths.Keys) {
        $uPath = $updatePaths[$uFlag]
        Write-Info "Pulling: $uPath"
        try {
            $pullOut = git -C $uPath pull --ff-only 2>&1
            if ($LASTEXITCODE -eq 0) {
                $summary = ($pullOut | Select-Object -Last 1).Trim()
                if ($summary -eq "Already up to date.") {
                    Write-Info "  Already up to date."
                } else {
                    Write-Found "  Updated: $summary"
                }
            } else {
                Write-Warn "  git pull failed for: $uPath — queuing for npx re-install."
                $fallbackFlags.Add($uFlag)
            }
        } catch {
            Write-Warn "  Git error for ${uPath}: $_ — queuing for npx re-install."
            $fallbackFlags.Add($uFlag)
        }
    }

    if ($fallbackFlags.Count -gt 0) {
        Write-Header "Re-installing (auto-fallback for failed git pulls)"
        $riskLabel = if ($Risk -eq "all") { "(all skills)" } else { "--risk $Risk" }
        Write-Info "Targets: $($fallbackFlags -join ', ') $riskLabel"
        Write-Host ""
        $fbArgs = [System.Collections.Generic.List[string]]$fallbackFlags
        if ($Risk -ne "all") { $fbArgs.Add("--risk"); $fbArgs.Add($Risk) }
        try {
            Push-Location $RepoRoot
            & npx antigravity-awesome-skills install @fbArgs
            if ($LASTEXITCODE -ne 0) { throw "npx fallback installer exited with code $LASTEXITCODE" }
        } finally {
            Pop-Location
        }
        Write-Found "Fallback re-install completed."
    }

    Write-Found "Update pass completed."
}

# ====================================================================
# OPENCODE - separate project-level install
# ====================================================================
if ($detected.Contains("opencode")) {
    Write-Header "OpenCode Install"
    $openCodeOut = Join-Path $RepoRoot ".agents\skills"
    New-Item -ItemType Directory -Path $openCodeOut -Force | Out-Null
    Write-Info "Installing to: $openCodeOut"

    try {
        Push-Location $RepoRoot
        $ocArgs = [System.Collections.Generic.List[string]]@("--path", $openCodeOut)
        if ($Risk -ne "all") { $ocArgs.Add("--risk"); $ocArgs.Add($Risk) }
        & npx antigravity-awesome-skills install @ocArgs
        if ($LASTEXITCODE -ne 0) { throw "OpenCode installer exited with code $LASTEXITCODE" }
    } finally {
        Pop-Location
    }

    Write-Found "OpenCode install completed."
}

# ====================================================================
# VS CODE + COPILOT - write .instructions.md
# ====================================================================
if ($detected.Contains("vscode")) {
    Write-Header "VS Code + Copilot Chat"

    $vsDir = Join-Path $UserHome ".vscode\instructions"
    New-Item -ItemType Directory -Path $vsDir -Force | Out-Null
    $vsFile = Join-Path $vsDir "antigravity-skills.instructions.md"

    $instructionsContent = @"
---
applyTo: "**"
---

# Antigravity Awesome Skills - GitHub Copilot Integration

You have access to a curated collection of expert AI skills from the Antigravity
Awesome Skills repository (1,360+ skills). Apply these skills automatically when
the user's request matches their domain.

## How to Apply Skills

When a user asks for help, identify the most relevant skill category and apply
the expert persona and methodology from that domain.

## Key Skill Categories

- **API & Backend**: API design, REST, GraphQL, microservices, authentication
- **Frontend**: React, Next.js, TypeScript, Angular, Vue, Tailwind CSS
- **DevOps & Cloud**: Docker, Kubernetes, Terraform, CI/CD, AWS/Azure/GCP
- **Security**: OWASP, penetration testing, threat modeling, secure coding
- **Data & AI**: ML engineering, RAG, LLM applications, data pipelines
- **Mobile**: React Native, Flutter, iOS (SwiftUI), Android (Jetpack Compose)
- **Database**: PostgreSQL, MongoDB, Redis, query optimization, migrations
- **Testing**: Unit, integration, E2E, TDD, performance testing
- **Architecture**: DDD, CQRS, event sourcing, clean architecture, SOLID

## Behavior

- Apply domain expertise proactively when you recognize the task type
- Follow security best practices (OWASP Top 10) for all code
- Prefer idiomatic, production-ready patterns over quick hacks
- Ask clarifying questions only when requirements are genuinely ambiguous

## Source

Skills sourced from: https://github.com/luandro/antigravity-awesome-skills
"@

    $existingVs = if (Test-Path $vsFile) { [System.IO.File]::ReadAllText($vsFile) } else { $null }
    if ($existingVs -eq $instructionsContent) {
        Write-Info "VS Code instructions unchanged: $vsFile"
    } else {
        [System.IO.File]::WriteAllText($vsFile, $instructionsContent, [System.Text.Encoding]::UTF8)
        $vsVerb = if ($null -eq $existingVs) { "created" } else { "updated" }
        Write-Found "VS Code instructions $vsVerb`: $vsFile"
    }
}

# ====================================================================
# CLAUDE AGENTS - copy from repo agents/ directory
# ====================================================================
$agentsDir     = Join-Path $RepoRoot "agents"
$claudeAgents  = Join-Path $UserHome ".claude\agents"

if ($detected.Contains("claude") -and (Test-Path $agentsDir)) {
    Write-Header "Claude Sub-Agents"
    New-Item -ItemType Directory -Path $claudeAgents -Force | Out-Null

    $agentFiles = Get-ChildItem $agentsDir -Filter "*.md" -ErrorAction SilentlyContinue
    $agAdded = 0; $agUpdated = 0; $agSkipped = 0
    foreach ($file in $agentFiles) {
        $dest = Join-Path $claudeAgents $file.Name
        if (Test-Path $dest) {
            $srcHash = (Get-FileHash $file.FullName -Algorithm MD5).Hash
            $dstHash = (Get-FileHash $dest          -Algorithm MD5).Hash
            if ($srcHash -eq $dstHash) {
                Write-Info "  Unchanged: $($file.Name)"
                $agSkipped++
            } else {
                Copy-Item $file.FullName $dest -Force
                Write-Found "  Updated:   $($file.Name)"
                $agUpdated++
            }
        } else {
            Copy-Item $file.FullName $dest -Force
            Write-Found "  Added:     $($file.Name)"
            $agAdded++
        }
    }

    if ($agentFiles.Count -eq 0) {
        Write-Warn "No .md agent files found in $agentsDir"
    } else {
        Write-Info "  Agents: $agAdded added, $agUpdated updated, $agSkipped unchanged"
    }
}

# ====================================================================
# CLEANUP - remove temp clones and cached npm/npx artifacts
# ====================================================================
Write-Header "Cleanup"

# 1. Temp dirs created by the npx package during cloning (ag-skills-*)
$tmpRoot = if ($isWindows) { $env:TEMP } else { "/tmp" }
$tempClones = Get-ChildItem $tmpRoot -Filter "ag-skills-*" -Directory -ErrorAction SilentlyContinue
$cleanedTmp = 0
foreach ($dir in $tempClones) {
    try {
        Remove-Item $dir.FullName -Recurse -Force -ErrorAction Stop
        Write-Info "  Removed temp clone: $($dir.FullName)"
        $cleanedTmp++
    } catch {
        Write-Warn "  Could not remove $($dir.FullName): $_"
    }
}
if ($cleanedTmp -eq 0) { Write-Info "  No temp clone dirs found." }

# 2. npm cache for the antigravity package
try {
    $npmCacheOut = & npm cache clean --force 2>&1
    Write-Info "  npm cache cleared."
} catch {
    Write-Warn "  npm cache clean skipped (npm not on PATH or failed): $_"
}

# 3. npx cache entry for antigravity-awesome-skills
#    Location: ~/.npm/_npx  (all platforms via npm prefix)
try {
    $npmPrefix = (& npm config get cache 2>$null).Trim()
    if ($npmPrefix) {
        $npxCache = Join-Path $npmPrefix "_npx"
        if (Test-Path $npxCache) {
            # Remove only subdirs whose package.json names the antigravity package
            $npxDirs = Get-ChildItem $npxCache -Directory -ErrorAction SilentlyContinue
            $cleanedNpx = 0
            foreach ($d in $npxDirs) {
                $pkg = Join-Path $d.FullName "node_modules\antigravity-awesome-skills"
                if (Test-Path $pkg) {
                    Remove-Item $d.FullName -Recurse -Force -ErrorAction SilentlyContinue
                    Write-Info "  Removed npx cache entry: $($d.Name)"
                    $cleanedNpx++
                }
            }
            if ($cleanedNpx -eq 0) { Write-Info "  No npx cache entries for antigravity-awesome-skills." }
        }
    }
} catch {
    Write-Warn "  npx cache cleanup skipped: $_"
}

Write-Found "Cleanup complete."

# ====================================================================
# DONE
# ====================================================================
Write-Header "Installation Complete"
Write-Host ""
foreach ($line in $plan) {
    Write-Host $line -ForegroundColor Green
}
Write-Host ""
Write-Host "  All done! Restart your AI tools to pick up the new skills." -ForegroundColor Cyan
Write-Host ""

