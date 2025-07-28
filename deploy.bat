@echo off
REM Simple batch file wrapper for the PowerShell deployment script
REM Usage: deploy.bat [commit message]

echo.
echo ======================================
echo    CABECEO DEPLOYMENT SCRIPT
echo ======================================
echo.

if "%1"=="" (
    echo Using default commit message...
    powershell -ExecutionPolicy Bypass -File "%~dp0deploy-new.ps1"
) else (
    echo Using custom commit message: %*
    powershell -ExecutionPolicy Bypass -File "%~dp0deploy-new.ps1" -Message "%*"
)
