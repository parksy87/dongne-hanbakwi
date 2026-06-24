# Capacitor Android sync (Windows)
# Usage: .\scripts\android-sync.ps1 192.168.0.10

param(
    [Parameter(Mandatory = $true)]
    [string]$ServerIp,
    [int]$Port = 3000
)

$ErrorActionPreference = "Stop"
$env:CAPACITOR_SERVER_URL = "http://${ServerIp}:${Port}"

Write-Host "CAPACITOR_SERVER_URL = $env:CAPACITOR_SERVER_URL"
Set-Location $PSScriptRoot + "\.."
npm run cap:sync
Write-Host "Done. Open Android Studio: npm run cap:open"
