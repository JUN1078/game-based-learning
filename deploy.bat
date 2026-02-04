@echo off
REM LearnQuest Studio - Deployment Helper Script (Windows)
REM This script helps you deploy to Vercel and Railway

echo.
echo ========================================
echo  LearnQuest Studio - Deployment Helper
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Git not initialized. Initializing...
    git init
    echo [OK] Git initialized
)

REM Check for changes
git status --short > temp_status.txt
for /f %%i in ("temp_status.txt") do set size=%%~zi
del temp_status.txt

if %size% gtr 0 (
    echo.
    echo Uncommitted changes found:
    git status --short
    echo.
    set /p commit_msg="Commit message: "

    if "%commit_msg%"=="" (
        set commit_msg=Deploy: %date% %time%
    )

    git add .
    git commit -m "%commit_msg%"
    echo [OK] Changes committed
) else (
    echo [OK] No uncommitted changes
)

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo No git remote found
    set /p repo_url="Enter your GitHub repository URL: "
    git remote add origin %repo_url%
    echo [OK] Remote added
)

REM Push to GitHub
echo.
echo Pushing to GitHub...
git push -u origin main 2>nul || git push origin main
echo [OK] Pushed to GitHub

echo.
echo =========================================
echo  Code pushed to GitHub successfully!
echo =========================================
echo.

REM Deployment instructions
echo Next Steps:
echo.
echo Backend (Railway):
echo   1. Go to https://railway.app
echo   2. Create new project from GitHub
echo   3. Add PostgreSQL database
echo   4. Set environment variables (see DEPLOYMENT.md)
echo   5. Deploy!
echo.
echo Frontend (Vercel):
echo   1. Run: cd frontend ^&^& vercel
echo   2. Or go to https://vercel.com/new
echo   3. Import your GitHub repository
echo   4. Set root directory to 'frontend'
echo   5. Set environment variables (see DEPLOYMENT.md)
echo   6. Deploy!
echo.
echo Full guide: DEPLOYMENT.md
echo.

pause
