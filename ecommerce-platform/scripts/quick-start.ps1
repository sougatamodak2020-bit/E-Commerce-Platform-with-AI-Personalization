# Quick Start Script - Start Frontend and AI Service

Write-Host ""
Write-Host "🚀 Starting Elite E-Commerce Platform..." -ForegroundColor Cyan
Write-Host ""

$rootDir = Get-Location

# Start AI Service in background
Write-Host "Starting AI Recommendation Service..." -ForegroundColor Yellow
$aiProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend\recommendation-service'; python main.py" -PassThru -WindowStyle Minimized
Start-Sleep -Seconds 3

# Start Frontend in background
Write-Host "Starting Frontend (Next.js)..." -ForegroundColor Yellow
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; npm run dev" -PassThru -WindowStyle Minimized
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ Services Started!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Access:" -ForegroundColor Cyan
Write-Host "   Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host "   AI Service:   http://localhost:8086/docs" -ForegroundColor White
Write-Host ""
Write-Host "To stop all services, close the PowerShell windows or press Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Open browser
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"
