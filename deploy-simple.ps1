# Simple Cabeceo Deployment Script
# This script builds the project, commits changes to GitHub, and deploys to Firebase

param(
    [string]$Message = "Automated deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "🚀 Starting Cabeceo Deployment..." -ForegroundColor Blue
Write-Host "Commit message: $Message" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

try {
    # Step 1: Build the project
    Write-Host "📦 Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    Write-Host "✅ Build completed!" -ForegroundColor Green
    Write-Host ""

    # Step 2: Git operations
    Write-Host "📝 Committing to Git..." -ForegroundColor Yellow
    git add .
    git commit -m $Message
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Changes committed!" -ForegroundColor Green
        
        Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
        git push
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Pushed to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Push failed, but continuing..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "ℹ️ No changes to commit" -ForegroundColor Cyan
    }
    Write-Host ""

    # Step 3: Deploy to Firebase
    Write-Host "🔥 Deploying to Firebase..." -ForegroundColor Yellow
    firebase deploy
    if ($LASTEXITCODE -ne 0) {
        throw "Firebase deployment failed"
    }
    Write-Host "✅ Deployed to Firebase!" -ForegroundColor Green
    Write-Host ""

    # Success
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Your site should be live on Firebase Hosting!" -ForegroundColor Cyan

} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Try these solutions:" -ForegroundColor Yellow
    Write-Host "  • Make sure you're in the project directory" -ForegroundColor White
    Write-Host "  • Check that Firebase CLI is installed: npm install -g firebase-tools" -ForegroundColor White
    Write-Host "  • Login to Firebase: firebase login" -ForegroundColor White
    Write-Host "  • Verify Git is configured properly" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
