@echo off
setlocal
title AI SAT Tutor - Dev Server
cd /d "%~dp0.."

echo ============================================
echo   AI SAT Tutor - starting dev server
echo ============================================
echo.

rem --- Check Node.js ---
where node >nul 2>nul
if errorlevel 1 goto :node_missing

rem --- Check pnpm ---
where pnpm >nul 2>nul
if errorlevel 1 goto :install_pnpm

rem --- Is the server already running on port 3000? ---
powershell -NoProfile -Command "if (Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue) { exit 1 } else { exit 0 }"
if errorlevel 1 goto :already_running

rem --- Install dependencies on first run ---
if not exist node_modules goto :install_deps

goto :start_server

:node_missing
echo [ERROR] Node.js was not found.
echo Install Node.js 18 or newer from https://nodejs.org and try again.
pause
exit /b 1

:install_pnpm
echo pnpm not found - installing it now...
call npm install -g pnpm@9
if errorlevel 1 goto :pnpm_failed
goto :check_running

:pnpm_failed
echo [ERROR] Could not install pnpm. Make sure Node.js is installed, then try again.
pause
exit /b 1

:check_running
powershell -NoProfile -Command "if (Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue) { exit 1 } else { exit 0 }"
if errorlevel 1 goto :already_running
goto :install_deps_check

:install_deps_check
if exist node_modules goto :start_server
goto :install_deps

:install_deps
echo First run - installing dependencies. This can take a minute...
call pnpm install
if errorlevel 1 goto :deps_failed
goto :start_server

:deps_failed
echo [ERROR] Dependency install failed. Check your internet connection and try again.
pause
exit /b 1

:already_running
echo A server is already running on port 3000.
echo Opening the website...
start "" http://localhost:3000
pause
exit /b 0

:start_server
rem Open the browser automatically once the server is ready
start "" /b powershell -NoProfile -ExecutionPolicy Bypass -Command "while (-not (Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue)) { Start-Sleep -Milliseconds 500 }; Start-Process 'http://localhost:3000'"

echo Starting the dev server...
echo The website will open at http://localhost:3000
echo.
echo Press Ctrl+C in this window to stop the server.
echo.
call pnpm dev

echo.
echo The server has stopped.
pause
