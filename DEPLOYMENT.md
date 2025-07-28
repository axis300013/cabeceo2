# Cabeceo Project Deployment Guide

This project includes automated deployment scripts for easy deployment to Firebase and GitHub updates.

## Quick Start

### Method 1: Using Batch File (Simplest)
```cmd
# Full deployment with default commit message
deploy.bat

# Full deployment with custom commit message
deploy.bat "Added new catalog features and fixed image loading"
```

### Method 2: Using PowerShell Script (More Options)
```powershell
# Full deployment
.\deploy.ps1

# Custom commit message
.\deploy.ps1 -CommitMessage "Added new features"

# Skip building (use existing dist folder)
.\deploy.ps1 -SkipBuild

# Only build and deploy to Firebase (skip Git)
.\deploy.ps1 -SkipGit

# Only commit to Git (skip Firebase deployment)
.\deploy.ps1 -SkipFirebase

# Get help
.\deploy.ps1 -Help
```

## What the Script Does

1. **Prerequisites Check**: Verifies all required tools are installed
2. **Dependency Installation**: Runs `npm install` if needed
3. **Build Process**: Runs `npm run build` to create production build
4. **Git Operations**: Commits changes and pushes to GitHub
5. **Firebase Deployment**: Deploys the built application to Firebase Hosting

## Prerequisites

Before using the deployment script, ensure you have:

### Required Tools
- **Node.js** and **npm** installed
- **Git** installed and configured
- **Firebase CLI** installed: `npm install -g firebase-tools`

### Project Setup
- Firebase project initialized in this directory (`firebase.json` exists)
- Git repository initialized (`.git` directory exists)
- Logged in to Firebase CLI: `firebase login`

## Script Features

### Error Handling
- Comprehensive error checking at each step
- Clear error messages with troubleshooting tips
- Graceful failure with helpful guidance

### Flexible Options
- Skip individual steps as needed
- Custom commit messages
- Built-in help system

### Visual Feedback
- Color-coded console output
- Progress indicators
- Success/error notifications
- Deployment time tracking

## Firebase Configuration

Make sure your `firebase.json` is properly configured:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Git Configuration

Ensure Git is configured with your credentials:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Troubleshooting

### Common Issues

**"Firebase CLI not found"**
```bash
npm install -g firebase-tools
```

**"Not logged in to Firebase"**
```bash
firebase login
```

**"Git push failed"**
- Check your Git credentials
- Ensure you have push access to the repository
- Try: `git remote -v` to verify remote URL

**"Build failed"**
- Check for TypeScript/ESLint errors
- Run `npm run build` manually to see detailed errors
- Ensure all dependencies are installed

### Debug Mode
For detailed debugging, run individual commands manually:

```bash
# Test build
npm run build

# Test Firebase deployment
firebase deploy

# Test Git operations
git status
git add .
git commit -m "test"
git push
```

## Customization

You can modify the `deploy.ps1` script to:
- Add additional build steps
- Deploy to multiple environments
- Run tests before deployment
- Send notifications after deployment
- Integrate with other CI/CD tools

## Support

If you encounter issues:
1. Run `.\deploy.ps1 -Help` for detailed usage information
2. Check the troubleshooting section above
3. Verify all prerequisites are met
4. Run individual steps manually to isolate issues
