@echo off
cd /d "%~dp0"
echo ========================================================
echo        Starting PG-Life PHP REST API Backend
echo ========================================================
echo API URL: http://127.0.0.1:8000/api/health
echo.

IF EXIST "C:\xampp\php\php.exe" (
    "C:\xampp\php\php.exe" -S 127.0.0.1:8000 -t backend\public
) ELSE (
    php -S 127.0.0.1:8000 -t backend\public
)
pause
