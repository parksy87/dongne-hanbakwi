# Firebase rules/indexes 배포 (Windows)
$ErrorActionPreference = "Stop"
$env:FIREBASE_CLI_DISABLE_UPDATE_CHECK = "1"

Set-Location $PSScriptRoot/..

Write-Host "==> Firestore rules + indexes 배포..." -ForegroundColor Cyan
firebase deploy --only firestore:rules,firestore:indexes
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "==> 배포 완료" -ForegroundColor Green
