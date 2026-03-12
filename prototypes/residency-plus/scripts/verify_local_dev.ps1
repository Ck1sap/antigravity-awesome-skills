$ErrorActionPreference = "Stop"

$logDir = "logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Force -Path $logDir | Out-Null }

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "$logDir\verify_local_dev_$timestamp.log"

function Write-Log {
    param([string]$message, [switch]$isError)
    $text = "[$(Get-Date -Format 'HH:mm:ss')] $message"
    Add-Content -Path $logFile -Value $text
    if ($isError) { Write-Host $text -ForegroundColor Red }
    else { Write-Host $text }
}

Write-Log "Starting Local Dev Verification..."

$baseUrl = "http://localhost:8888/.netlify/functions"

# Detect fixture vs live mode to avoid mixing assumptions
$devFixture = $false
if ($env:DEV_FIXTURE_MODE -eq "true") {
    $devFixture = $true
    Write-Log "DEV_FIXTURE_MODE=true detected — using fixture-friendly verification flow."
} else {
    Write-Log "DEV_FIXTURE_MODE=false (or unset) — using live SoundCloud verification flow."
}

$hasError = $false

function Invoke-And-Log {
    param(
        [string]$name,
        [string]$url
    )
    Write-Log "Checking target: $name -> $url"
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -ErrorAction Stop
        Write-Log "HTTP $($response.StatusCode)"
        $snippet = $response.Content
        if ($snippet.Length -gt 150) { $snippet = $snippet.Substring(0, 150) + "..." }
        Write-Log "Response: $snippet"
        return $response
    }
    catch {
        Write-Log "Request Failed: $($_.Exception.Message)" -isError
        if ($_.ErrorDetails) { Write-Log "Details: $($_.ErrorDetails.Message)" -isError }
        $script:hasError = $true
        return $null
    }
}

# 1) Health check (always required)
Invoke-And-Log -name "sc-health" -url "$baseUrl/sc-health"

# 2) Search + resolve behavior depends on fixture vs live mode
if ($devFixture) {
    # In fixture mode, the functions themselves bypass SoundCloud and read local fixtures:
    # - sc-official-search -> fixtures/search-ambient.json
    # - sc-official-resolve -> fixtures/resolve-sample.json
    Invoke-And-Log -name "sc-official-search" -url "$baseUrl/sc-official-search?q=ambient"

    # For resolve, the URL parameter is ignored in fixture mode; we just need a well-formed 200 JSON response.
    Invoke-And-Log -name "sc-official-resolve" -url "$baseUrl/sc-official-resolve?url=https://soundcloud.com/fixture/ambient-1"
}
else {
    # Live mode: derive a real permalink_url from search instead of assuming a specific track still exists.
    $searchResponse = Invoke-And-Log -name "sc-official-search" -url "$baseUrl/sc-official-search?q=ambient"

    if ($searchResponse -ne $null -and -not $hasError) {
        try {
            $json = $searchResponse.Content | ConvertFrom-Json
            $first = $null
            if ($json -and $json.collection -and $json.collection.Count -gt 0) {
                $first = $json.collection[0]
            }

            if ($first -and $first.permalink_url) {
                $perm = $first.permalink_url
                Write-Log "Derived permalink_url from search: $perm"
                Invoke-And-Log -name "sc-official-resolve" -url "$baseUrl/sc-official-resolve?url=$perm"
            }
            else {
                Write-Log "No items with permalink_url returned from local search; skipping resolve check." -isError
                $hasError = $true
            }
        }
        catch {
            Write-Log "Failed to parse local search JSON payload for permalink_url." -isError
            $hasError = $true
        }
    }
}

if ($hasError) {
    Write-Log ""
    Write-Log "RESULT: FAIL" -isError
    exit 1
}
else {
    Write-Log ""
    Write-Log "RESULT: PASS"
    exit 0
}
