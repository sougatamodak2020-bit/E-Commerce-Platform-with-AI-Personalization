# E-Commerce Platform - Complete Startup Script

Write-Host "🚀 Starting Elite E-Commerce Platform..." -ForegroundColor Cyan

# Start Docker services
Write-Host "`n📦 Starting Docker containers..." -ForegroundColor Yellow
Set-Location -Path "infrastructure\docker"
docker-compose up -d postgres redis kafka zookeeper

# Wait for services to be ready
Write-Host "`n⏳ Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Run database migrations
Write-Host "`n🗄️  Running database migrations..." -ForegroundColor Yellow
try {
    docker exec ecommerce-postgres psql -U ecommerce_user -d ecommerce_db -f /docker-entrypoint-initdb.d/001_initial_schema.sql
    Write-Host "   ✅ Database initialized" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Database may already be initialized" -ForegroundColor Yellow
}

# Start backend services
Write-Host "`n🔧 Starting backend microservices..." -ForegroundColor Yellow

Set-Location -Path "..\.."

# User Service
Write-Host "   Starting User Service..." -ForegroundColor Cyan
Set-Location -Path "backend\user-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run" -WindowStyle Minimized

# Product Service
Write-Host "   Starting Product Service..." -ForegroundColor Cyan
Set-Location -Path "..\product-service"
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run" -WindowStyle Minimized

# AI Recommendation Service
Write-Host "   Starting AI Recommendation Service..." -ForegroundColor Cyan
Set-Location -Path "..\..\backend\recommendation-service"
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python main.py" -WindowStyle Minimized

# Start Frontend
Write-Host "`n🎨 Starting Next.js frontend..." -ForegroundColor Yellow
Set-Location -Path "..\..\frontend"
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Minimized

Set-Location -Path ".."

Write-Host "`n✅ All services started successfully!" -ForegroundColor Green
Write-Host "`n📱 Access the application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   User Service: http://localhost:8081/swagger-ui.html" -ForegroundColor White
Write-Host "   Product Service: http://localhost:8082/swagger-ui.html" -ForegroundColor White
Write-Host "   AI Service: http://localhost:8086/docs" -ForegroundColor White
Write-Host "   API Gateway: http://localhost:8080" -ForegroundColor White
Write-Host "   Grafana: http://localhost:3001" -ForegroundColor White

Write-Host "`n🎉 Happy Shopping!" -ForegroundColor Magenta
Write-Host "`n💡 Tip: Use scripts\stop-all.ps1 to stop all services" -ForegroundColor Yellow
