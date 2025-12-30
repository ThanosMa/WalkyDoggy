# Quick script to update CORS in .env file
$envFile = ".\.env"
$content = Get-Content $envFile -Raw
$content = $content -replace 'ALLOWED_ORIGINS=http://localhost:8080,http://localhost:19006', 'ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080,http://localhost:19006'
Set-Content -Path $envFile -Value $content
Write-Host "✅ Updated CORS to allow port 5173"

