# Environment Setup Script

Write-Host "🔧 Setting up development environment..." -ForegroundColor Cyan

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

$prerequisites = @(
    @{Name="Java"; Command="java -version"},
    @{Name="Maven"; Command="mvn -v"},
    @{Name="Node.js"; Command="node -v"},
    @{Name="Docker"; Command="docker -v"},
    @{Name="Python"; Command="python --version"}
)

foreach ($prereq in $prerequisites) {
    try {
        $null = Invoke-Expression $prereq.Command 2>&1
        Write-Host "   ✅ $($prereq.Name) installed" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ $($prereq.Name) not found" -ForegroundColor Red
    }
}

# Create .env files
Write-Host "`n📝 Creating environment files..." -ForegroundColor Yellow

# Frontend .env
$frontendEnv = @"
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_APP_NAME=Elite E-Commerce
"@
$frontendEnv | Out-File -FilePath "frontend\.env.local" -Encoding UTF8 -Force

# Backend .env (for AI service)
$backendEnv = @"
DATABASE_URL=postgresql://ecommerce_user:ecommerce_pass_2024@localhost:5432/ecommerce_db
REDIS_URL=redis://:redis_pass_2024@localhost:6379
OPENAI_API_KEY=your_openai_key_here
PINECONE_API_KEY=your_pinecone_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment
"@
$backendEnv | Out-File -FilePath "backend\recommendation-service\.env" -Encoding UTF8 -Force

Write-Host "   ✅ Environment files created" -ForegroundColor Green

Write-Host "`n✅ Setup complete! Run 'scripts\start-all.ps1' to launch the platform." -ForegroundColor Green
