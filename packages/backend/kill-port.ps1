# PowerShell script to kill process on port 3000
# Usage: .\kill-port.ps1 [port]

param(
    [int]$Port = 3000
)

Write-Host "🔍 Checking for processes on port $Port..." -ForegroundColor Cyan

$connections = netstat -ano | Select-String ":$Port" | Select-String "LISTENING"

if ($connections) {
    $pids = $connections | ForEach-Object {
        $parts = $_ -split '\s+'
        $parts[-1]
    } | Select-Object -Unique

    foreach ($pid in $pids) {
        if ($pid -and $pid -ne '0') {
            Write-Host "🔄 Killing process $pid on port $Port..." -ForegroundColor Yellow
            try {
                Stop-Process -Id $pid -Force -ErrorAction Stop
                Write-Host "✅ Process $pid killed successfully." -ForegroundColor Green
            } catch {
                Write-Host "❌ Could not kill process $pid: $_" -ForegroundColor Red
            }
        }
    }
    
    Start-Sleep -Seconds 1
    Write-Host "✅ Port $Port should now be free." -ForegroundColor Green
} else {
    Write-Host "✅ Port $Port is already free." -ForegroundColor Green
}

