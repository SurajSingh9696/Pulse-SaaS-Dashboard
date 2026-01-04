@echo off
echo ====================================
echo    Pulse Dashboard - Quick Commands
echo ====================================
echo.
echo Available Commands:
echo.
echo 1. npm run test-db    - Test MongoDB connection
echo 2. npm run seed       - Seed database with sample data
echo 3. npm run dev        - Start development server
echo 4. npm run build      - Build for production
echo 5. npm run start      - Start production server
echo.
echo Test Accounts After Seeding:
echo.
echo Admin:
echo   Email: admin@pulse.com
echo   Password: admin123
echo.
echo User:
echo   Email: john@example.com
echo   Password: password123
echo.
echo ====================================
echo.
set /p command="Enter command number (1-5) or 'q' to quit: "

if "%command%"=="1" (
    echo.
    echo Testing MongoDB connection...
    npm run test-db
) else if "%command%"=="2" (
    echo.
    echo Seeding database...
    npm run seed
) else if "%command%"=="3" (
    echo.
    echo Starting development server...
    npm run dev
) else if "%command%"=="4" (
    echo.
    echo Building for production...
    npm run build
) else if "%command%"=="5" (
    echo.
    echo Starting production server...
    npm run start
) else if "%command%"=="q" (
    exit
) else (
    echo Invalid command. Please try again.
    pause
)
