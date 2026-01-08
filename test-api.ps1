# Test POA Backend API
Write-Host "=== Testing POA Backend API ===" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri http://localhost:3001/health -Method GET
    Write-Host "✓ Health check passed: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Start Attention Session
Write-Host "`n2. Testing Start Attention Session..." -ForegroundColor Yellow
$testAddress = "0x1234567890123456789012345678901234567890"
$testTaskId = "test-task-001"

$startBody = @{
    userAddress = $testAddress
    taskId = $testTaskId
} | ConvertTo-Json

try {
    $startResponse = Invoke-RestMethod -Uri http://localhost:3001/api/attention/start -Method POST -Body $startBody -ContentType "application/json"
    Write-Host "✓ Session started successfully" -ForegroundColor Green
    Write-Host "  Session ID: $($startResponse.sessionId)" -ForegroundColor Gray
    Write-Host "  Started At: $($startResponse.startedAt)" -ForegroundColor Gray
    
    $sessionId = $startResponse.sessionId
    
    # Test 3: Send Heartbeat
    Write-Host "`n3. Testing Send Heartbeat..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
    $heartbeatBody = @{
        sessionId = $sessionId
        userAddress = $testAddress
        timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    } | ConvertTo-Json
    
    try {
        $heartbeatResponse = Invoke-RestMethod -Uri http://localhost:3001/api/attention/heartbeat -Method POST -Body $heartbeatBody -ContentType "application/json"
        Write-Host "✓ Heartbeat sent successfully" -ForegroundColor Green
        Write-Host "  Heartbeat Count: $($heartbeatResponse.heartbeatCount)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Heartbeat failed: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $errorBody = $reader.ReadToEnd()
            Write-Host "  Error details: $errorBody" -ForegroundColor Red
        }
    }
    
    # Test 4: End Session (will fail without blockchain/IPFS, but tests API structure)
    Write-Host "`n4. Testing End Session (will fail without blockchain/IPFS config)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
    $endBody = @{
        sessionId = $sessionId
        userAddress = $testAddress
    } | ConvertTo-Json
    
    try {
        $endResponse = Invoke-RestMethod -Uri http://localhost:3001/api/attention/end -Method POST -Body $endBody -ContentType "application/json"
        Write-Host "✓ Session ended and POA minted!" -ForegroundColor Green
        Write-Host "  Token ID: $($endResponse.tokenId)" -ForegroundColor Gray
        Write-Host "  IPFS Hash: $($endResponse.ipfsHash)" -ForegroundColor Gray
    } catch {
        Write-Host "⚠ End session failed (expected without blockchain/IPFS): $($_.Exception.Message)" -ForegroundColor Yellow
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $errorBody = $reader.ReadToEnd()
            Write-Host "  Error details: $errorBody" -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Host "✗ Start session failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $errorBody = $reader.ReadToEnd()
        Write-Host "  Error details: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
