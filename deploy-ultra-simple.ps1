# Ultra-Simple Cabeceo Deployment Script
param([string]$Message = "Automated deployment")

$ErrorActionPreference = "Stop"

Write-Host "=== CABECEO DEPLOYMENT ===" -ForegroundColor Blue
Write-Host "Commit: $Message" -ForegroundColor Cyan
Write-Host ""

try {
    Write-Host "Building..." -ForegroundColor Yellow
    & npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
    Write-Host "✓ Build OK" -ForegroundColor Green

    Write-Host "Git add..." -ForegroundColor Yellow
    & git add .
    
    Write-Host "Git commit..." -ForegroundColor Yellow
    & git commit -m $Message
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Committed" -ForegroundColor Green
        
        Write-Host "Git push..." -ForegroundColor Yellow
        & git push
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Pushed" -ForegroundColor Green
        }
    } else {
        Write-Host "! No changes" -ForegroundColor Yellow
    }

    Write-Host "Firebase deploy..." -ForegroundColor Yellow
    & firebase deploy
    if ($LASTEXITCODE -ne 0) { throw "Firebase failed" }
    Write-Host "✓ Deployed" -ForegroundColor Green

    Write-Host ""
    Write-Host "SUCCESS! Site is live!" -ForegroundColor Green

} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Check: npm, git, firebase-tools installed" -ForegroundColor Yellow
    pause
    exit 1
}

pause
