@echo off
cd /d "%~dp0"
echo ========================================================
echo        Starting PG-Life React Frontend (Vite)
echo ========================================================
echo Frontend URL: http://localhost:5173
echo.

cd frontend
npm run dev
pause
