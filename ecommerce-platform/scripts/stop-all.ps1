Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow

# Stop Docker containers
Set-Location -Path "infrastructure\docker"
docker-compose down

# Stop all Java processes (Spring Boot)
Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*spring-boot*"} | Stop-Process -Force

# Stop Node.js processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Stop Python processes
Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*main.py*"} | Stop-Process -Force

Write-Host "✅ All services stopped" -ForegroundColor Green
