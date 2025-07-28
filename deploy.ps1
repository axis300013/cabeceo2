# Cabeceo Project Deployment Script
# This script builds the project, commits changes to GitHub, and deploys to Firebase

param(
    [string]$CommitMessage = "Automated deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    [switch]$SkipBuild = $false,
    [switch]$SkipGit = $false,
    [switch]$SkipFirebase = $false,
    [switch]$Help
)

# Track start time for duration calculation
$startTime = Get-Date

# Display help information
if ($Help) {
    Write-Host @"
Cabeceo Deployment Script
========================

Usage: .\deploy.ps1 [OPTIONS]

Options:
  -CommitMessage <string>   Custom commit message (default: "Automated deployment YYYY-MM-DD HH:MM:SS")
  -SkipBuild               Skip the npm build step
  -SkipGit                 Skip Git operations (commit and push)
  -SkipFirebase            Skip Firebase deployment
  -Help                    Show this help message

Examples:
  .\deploy.ps1                                          # Full deployment
  .\deploy.ps1 -CommitMessage "Added new catalog features"  # Custom commit message
  .\deploy.ps1 -SkipBuild                              # Skip build, just deploy existing dist
  .\deploy.ps1 -SkipGit                                # Only build and deploy to Firebase

Prerequisites:
  - Node.js and npm installed
  - Firebase CLI installed (npm install -g firebase-tools)
  - Git configured with your credentials
  - Firebase project initialized in this directory
"@
    exit 0
}

# Color functions for better console output
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Error { param($Message) Write-Host "❌ ERROR: $Message" -ForegroundColor Red }
function Write-Warning { param($Message) Write-Host "⚠️  WARNING: $Message" -ForegroundColor Yellow }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Step { param($Message) Write-Host "🚀 $Message" -ForegroundColor Blue }

# Error handling
$ErrorActionPreference = "Stop"

try {
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                    CABECEO DEPLOYMENT SCRIPT                ║
║                                                              ║
║  This script will:                                           ║
║  1. Build the React application                              ║
║  2. Commit and push changes to GitHub                        ║
║  3. Deploy to Firebase Hosting                               ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Magenta

    # Check prerequisites
    Write-Step "Checking prerequisites..."
    
    # Check if we're in the right directory
    if (!(Test-Path "package.json")) {
        Write-Error "package.json not found. Make sure you're running this script from the project root."
        exit 1
    }
    
    # Check if Firebase is initialized
    if (!(Test-Path "firebase.json")) {
        Write-Error "firebase.json not found. Make sure Firebase is initialized in this project."
        exit 1
    }
    
    # Check if Git is initialized
    if (!(Test-Path ".git")) {
        Write-Error ".git directory not found. Make sure this is a Git repository."
        exit 1
    }
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js version: $nodeVersion"
    } catch {
        Write-Error "Node.js is not installed or not in PATH."
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Success "npm version: $npmVersion"
    } catch {
        Write-Error "npm is not installed or not in PATH."
        exit 1
    }
    
    # Check Firebase CLI
    if (!$SkipFirebase) {
        try {
            $firebaseVersion = firebase --version
            Write-Success "Firebase CLI version: $firebaseVersion"
        } catch {
            Write-Error "Firebase CLI is not installed. Install it with: npm install -g firebase-tools"
            exit 1
        }
    }
    
    # Check Git
    if (!$SkipGit) {
        try {
            $gitVersion = git --version
            Write-Success "Git version: $gitVersion"
        } catch {
            Write-Error "Git is not installed or not in PATH."
            exit 1
        }
    }

    Write-Success "All prerequisites checked successfully!"
    Write-Host ""

    # Step 1: Install dependencies (if node_modules doesn't exist)
    if (!(Test-Path "node_modules")) {
        Write-Step "Installing dependencies..."
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install dependencies"
            exit 1
        }
        Write-Success "Dependencies installed successfully!"
    } else {
        Write-Info "Dependencies already installed, skipping npm install"
    }

    # Step 2: Build the project
    if (!$SkipBuild) {
        Write-Step "Building the project..."
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Build failed"
            exit 1
        }
        Write-Success "Build completed successfully!"
        
        # Check if dist directory was created
        if (!(Test-Path "dist")) {
            Write-Error "Build completed but 'dist' directory not found"
            exit 1
        }
    } else {
        Write-Warning "Skipping build step as requested"
        if (!(Test-Path "dist")) {
            Write-Error "No 'dist' directory found and build was skipped. Run without -SkipBuild first."
            exit 1
        }
    }

    # Step 3: Git operations
    if (!$SkipGit) {
        Write-Step "Handling Git operations..."
        
        # Check if there are any changes
        $gitStatus = git status --porcelain
        if ($gitStatus) {
            Write-Info "Changes detected, committing to Git..."
            
            # Add all changes
            git add .
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Failed to add changes to Git"
                exit 1
            }
            
            # Commit changes
            git commit -m $CommitMessage
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "Git commit failed (possibly no changes to commit)"
            } else {
                Write-Success "Changes committed successfully!"
            }
            
            # Push to remote
            Write-Info "Pushing to remote repository..."
            git push
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Failed to push to remote repository"
                exit 1
            }
            Write-Success "Changes pushed to GitHub successfully!"
        } else {
            Write-Info "No changes detected in Git repository"
        }
    } else {
        Write-Warning "Skipping Git operations as requested"
    }

    # Step 4: Deploy to Firebase
    if (!$SkipFirebase) {
        Write-Step "Deploying to Firebase..."
        
        # Check if user is logged in to Firebase
        try {
            $firebaseProjects = firebase projects:list --json | ConvertFrom-Json
            Write-Success "Firebase authentication verified"
        } catch {
            Write-Warning "Not logged in to Firebase. Attempting login..."
            firebase login
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Firebase login failed"
                exit 1
            }
        }
        
        # Deploy to Firebase
        firebase deploy
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Firebase deployment failed"
            exit 1
        }
        Write-Success "Deployed to Firebase successfully!"
        
        # Get the hosting URL
        try {
            $firebaseConfig = Get-Content "firebase.json" | ConvertFrom-Json
            if ($firebaseConfig.hosting) {
                Write-Info "Your site should be available at your Firebase Hosting URL"
            }
        } catch {
            Write-Info "Deployment completed. Check Firebase Console for the hosting URL."
        }
    } else {
        Write-Warning "Skipping Firebase deployment as requested"
    }

    # Success summary
    Write-Host ""
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                     DEPLOYMENT COMPLETED                    ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green

    $completedSteps = @()
    if (!$SkipBuild) { $completedSteps += "✅ Built React application" }
    if (!$SkipGit) { $completedSteps += "✅ Committed and pushed to GitHub" }
    if (!$SkipFirebase) { $completedSteps += "✅ Deployed to Firebase Hosting" }
    
    $completedSteps | ForEach-Object { Write-Host $_ -ForegroundColor Green }
    
    Write-Host ""
    Write-Success "All operations completed successfully!"
    Write-Info "Total deployment time: $((Get-Date) - $startTime)"

} catch {
    Write-Error "Deployment failed: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "💡 Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "  • Make sure you're in the project root directory" -ForegroundColor Yellow
    Write-Host "  • Ensure Firebase CLI is installed: npm install -g firebase-tools" -ForegroundColor Yellow
    Write-Host "  • Check that you're logged in to Firebase: firebase login" -ForegroundColor Yellow
    Write-Host "  • Verify Git is configured with your credentials" -ForegroundColor Yellow
    Write-Host "  • Run with -Help for more information" -ForegroundColor Yellow
    exit 1
}
