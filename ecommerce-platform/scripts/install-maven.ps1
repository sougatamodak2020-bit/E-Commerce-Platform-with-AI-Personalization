# Maven Installation Script

Write-Host "📥 Installing Apache Maven..." -ForegroundColor Yellow

$toolsDir = "E:\git\E-Commerce Platform with AI Personalization\ecommerce-platform\tools"
New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null

$mavenVersion = "3.9.9"
# Correct Apache Maven download URL
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$mavenZip = "$toolsDir\maven.zip"

Write-Host "   Downloading Maven $mavenVersion..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip -UseBasicParsing
    
    Write-Host "   Extracting Maven..." -ForegroundColor Cyan
    Expand-Archive -Path $mavenZip -DestinationPath $toolsDir -Force
    Remove-Item $mavenZip
    
    $env:MAVEN_HOME = "$toolsDir\apache-maven-$mavenVersion"
    $env:Path = "$env:MAVEN_HOME\bin;$env:Path"
    
    Write-Host "✅ Maven installed successfully!" -ForegroundColor Green
    Write-Host "   Maven Home: $env:MAVEN_HOME" -ForegroundColor Cyan
    
    # Verify
    & "$env:MAVEN_HOME\bin\mvn.cmd" -v
} catch {
    Write-Host "❌ Failed to download/install Maven" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "   Please install Maven manually from https://maven.apache.org" -ForegroundColor Yellow
}
