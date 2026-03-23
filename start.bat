@echo off
echo Starting Sumit Portfolio Servers...

start "Sumit AI Chatbot Backend (Port 5000)" cmd /k "cd backend && node server.js"
start "Sumit Portfolio Frontend (Port 3000)" cmd /k "npx -y serve -l 3000"

echo Both servers are booting up in new windows!
echo Your portfolio will be available at: http://localhost:3000
echo.
pause
