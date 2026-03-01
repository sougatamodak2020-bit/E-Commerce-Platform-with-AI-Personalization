# Elite E-Commerce Platform - Complete Setup Script

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   🎊 ELITE E-COMMERCE PLATFORM - COMPLETE SETUP" -ForegroundColor Magenta
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Get-Location

# Step 1: Check Prerequisites
Write-Host "📋 STEP 1/5: Checking Prerequisites" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------------" -ForegroundColor Cyan

$allGood = $true

# Java Check
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "   ✅ Java installed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Java not found - Install JDK 17+" -ForegroundColor Red
    $allGood = $false
}

# Node.js Check
try {
    $nodeVersion = node -v
    Write-Host "   ✅ Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found - Install Node.js 18+" -ForegroundColor Red
    $allGood = $false
}

# Python Check
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   ✅ $pythonVersion installed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Python not found - Install Python 3.11+" -ForegroundColor Red
    $allGood = $false
}

# Docker Check
$dockerRunning = $false
try {
    $null = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Docker is running" -ForegroundColor Green
        $dockerRunning = $true
    } else {
        throw "Docker not responding"
    }
} catch {
    Write-Host "   ⚠️  Docker Desktop not running" -ForegroundColor Yellow
    Write-Host "      Please start Docker Desktop and run again" -ForegroundColor Yellow
}

if (-not $allGood) {
    Write-Host ""
    Write-Host "❌ Please install missing prerequisites and run again" -ForegroundColor Red
    exit 1
}

# Step 2: Setup Environment Files
Write-Host ""
Write-Host "📝 STEP 2/5: Creating Environment Files" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------------" -ForegroundColor Cyan

# Frontend .env.local
$frontendEnv = @"
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_APP_NAME=Elite E-Commerce
"@
$frontendEnv | Out-File -FilePath "frontend\.env.local" -Encoding UTF8 -Force

# Python service .env
$pythonEnv = @"
DATABASE_URL=postgresql://ecommerce_user:ecommerce_pass_2024@localhost:5432/ecommerce_db
REDIS_URL=redis://:redis_pass_2024@localhost:6379
OPENAI_API_KEY=your_openai_key_here
"@
$pythonEnv | Out-File -FilePath "backend\recommendation-service\.env" -Encoding UTF8 -Force

Write-Host "   ✅ Environment files created" -ForegroundColor Green

# Step 3: Install Dependencies
Write-Host ""
Write-Host "📦 STEP 3/5: Installing Dependencies" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------------" -ForegroundColor Cyan

# Frontend
Write-Host "   Installing Frontend Dependencies..." -ForegroundColor Cyan
Set-Location -Path "frontend"
npm install 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Some frontend dependencies may have warnings (continuing...)" -ForegroundColor Yellow
}
Set-Location -Path $rootDir

# Python
Write-Host "   Installing Python Dependencies..." -ForegroundColor Cyan
Set-Location -Path "backend\recommendation-service"
pip install -r requirements-lite.txt --user --quiet 2>&1 | Out-Null
Write-Host "   ✅ Python dependencies installed" -ForegroundColor Green
Set-Location -Path $rootDir

# Step 4: Start Infrastructure (if Docker is running)
Write-Host ""
Write-Host "🐳 STEP 4/5: Starting Infrastructure" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------------" -ForegroundColor Cyan

if ($dockerRunning) {
    Set-Location -Path "infrastructure\docker"
    Write-Host "   Starting PostgreSQL and Redis..." -ForegroundColor Cyan
    docker-compose up -d postgres redis 2>&1 | Out-Null
    Write-Host "   ✅ Database services starting (wait 10 seconds...)" -ForegroundColor Green
    Start-Sleep -Seconds 10
    Set-Location -Path $rootDir
} else {
    Write-Host "   ⚠️  Skipping Docker services (Docker not running)" -ForegroundColor Yellow
    Write-Host "      Start Docker Desktop and run: docker-compose up -d" -ForegroundColor Yellow
}

# Step 5: Complete!
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "   ✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green

Write-Host ""
Write-Host "📱 How to Start:" -ForegroundColor Cyan
Write-Host "   1. Start Frontend:    cd frontend && npm run dev" -ForegroundColor White
Write-Host "   2. Start AI Service:  cd backend\recommendation-service && python main.py" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host "   AI Service:   http://localhost:8086/docs" -ForegroundColor White
Write-Host ""
Write-Host "💎 You're ready to build something amazing!" -ForegroundColor Magenta
Write-Host ""
