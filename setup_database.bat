@echo off
cd /d "%~dp0"
echo ========================================================
echo        PG-Life Database Setup & Migration
echo ========================================================
echo.

IF EXIST "C:\xampp\php\php.exe" (
    "C:\xampp\php\php.exe" backend\database\migrate.php
) ELSE (
    php backend\database\migrate.php
)
pause
