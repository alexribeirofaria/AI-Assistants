param (
    [string]$FrontendUrl = "http://localhost:4200",
    [string]$BackendUrl = "http://localhost:5000/health"
)

$backendPath = "..\python-app"
$frontendPath = ".\"

function Stop-PortProcess {
    param ([int]$Port)

    try {
        $currentPid = $PID

        $pids = netstat -ano | Select-String ":$Port" | ForEach-Object {
            ($_ -split "\s+")[-1]
        } | Where-Object { $_ -match "^\d+$" } | Select-Object -Unique

        foreach ($p in $pids) {

            # 🔒 filtros de segurança
            if ($p -eq "0") { continue }
            if ($p -eq $currentPid) { continue }

            # verifica se processo ainda existe
            $proc = Get-Process -Id $p -ErrorAction SilentlyContinue
            if (-not $proc) { continue }

            try {
                Write-Host "Encerrando PID $p na porta $Port"
                taskkill /PID $p /T /F | Out-Null
            } catch {
                # ignora erro (processo já morreu ou inacessível)
            }
        }

    } catch {
        # ignora falha geral
    }
}

function Stop-ProcessTree {
    param ([int]$ProcessId)

    if ($ProcessId -and $ProcessId -ne 0) {
        try {
            taskkill /PID $ProcessId /T /F | Out-Null
        } catch {}
    }
}

function Wait-ForHttp {
    param (
        [string]$Url,
        [int]$TimeoutSeconds = 120
    )

    Write-Host "Aguardando: $Url"

    $start = Get-Date

    while ($true) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                Write-Host "Disponivel: $Url"
                return
            }
        } catch {}

        if ((Get-Date) - $start -gt (New-TimeSpan -Seconds $TimeoutSeconds)) {
            throw "Timeout ao aguardar $Url"
        }

        Start-Sleep -Seconds 2
    }
}

Write-Host "Pre-cleanup: liberando portas..."

Stop-PortProcess 4200
Stop-PortProcess 5000

Start-Sleep -Seconds 2

Write-Host "Iniciando E2E..."

# Backend
Write-Host "Iniciando Backend..."
$backend = Start-Process cmd `
    -WorkingDirectory $backendPath `
    -PassThru `
    -WindowStyle Hidden `
    -ArgumentList "/c py main.py --app web"

# Frontend
Write-Host "Iniciando Frontend..."
$frontend = Start-Process cmd `
    -WorkingDirectory $frontendPath `
    -PassThru `
    -WindowStyle Hidden `
    -ArgumentList "/c npm run start:silent"

$testFailed = $false

try {
    Wait-ForHttp -Url $BackendUrl -TimeoutSeconds 120
    Wait-ForHttp -Url $FrontendUrl -TimeoutSeconds 120

    Write-Host "Executando testes E2E..."
    npx playwright test

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Testes falharam"
        $testFailed = $true
    } else {
        Write-Host "Testes finalizados com sucesso"
    }

} catch {
    Write-Host "Erro: $($_.Exception.Message)"
    $testFailed = $true
}
finally {
    Write-Host "Finalizando processos..."

    if ($backend) { Stop-ProcessTree $backend.Id }
    if ($frontend) { Stop-ProcessTree $frontend.Id }

    # limpeza final garantida
    Stop-PortProcess 4200
    Stop-PortProcess 5000

    Write-Host "Cleanup concluido"
}

if ($testFailed) {
    exit 1
} else {
    exit 0
}