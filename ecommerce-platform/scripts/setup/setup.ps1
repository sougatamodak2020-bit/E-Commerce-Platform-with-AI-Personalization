Write-Host "Setting up Maison Elite..." -ForegroundColor Cyan
Set-Location "frontend"
npm install
if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.example" ".env.local"
    Write-Host "Created .env.local - Please add your API keys" -ForegroundColor Yellow
}
Write-Host "Setup complete! Run: npm run dev" -ForegroundColor Green
