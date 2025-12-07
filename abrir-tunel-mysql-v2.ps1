# Script para abrir túnel SSH para MySQL usando DOMÍNIO

Write-Host "🔧 ABRINDO TÚNEL SSH PARA MYSQL (via Domínio)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Configurações - USANDO DOMÍNIO
$SERVER = "server.equipcasa.com.br"
$USER = "HugoGabriel"
$KEY = "C:\Users\yuriv\.ssh\deploy_auto_key"
$LOCAL_PORT = 3306
$REMOTE_PORT = 3306

Write-Host "📋 Configurações:" -ForegroundColor Yellow
Write-Host "   Servidor: $SERVER"
Write-Host "   Usuário: $USER"
Write-Host "   Chave SSH: $KEY"
Write-Host "   Porta Local: $LOCAL_PORT"
Write-Host "   Porta Remota: $REMOTE_PORT"
Write-Host ""

# Verificar se a chave existe
if (-not (Test-Path $KEY)) {
    Write-Host "❌ Chave SSH não encontrada: $KEY" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Verifique se a chave existe ou ajuste o caminho no script." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Chave SSH encontrada" -ForegroundColor Green
Write-Host ""

# Testar resolução DNS
Write-Host "🔍 Testando resolução DNS..." -ForegroundColor Cyan
try {
    $dnsResult = Resolve-DnsName $SERVER -ErrorAction Stop
    Write-Host "✅ DNS resolvido:" -ForegroundColor Green
    $dnsResult | Where-Object { $_.Type -eq 'A' } | ForEach-Object {
        Write-Host "   IP: $($_.IPAddress)" -ForegroundColor Gray
    }
    Write-Host ""
}
catch {
    Write-Host "❌ Erro ao resolver DNS: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Tentando com IP direto..." -ForegroundColor Yellow
    $SERVER = "161.97.124.179"
    Write-Host "   Usando: $SERVER" -ForegroundColor Gray
    Write-Host ""
}

# Verificar se a porta local já está em uso
$portInUse = Get-NetTCPConnection -LocalPort $LOCAL_PORT -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Porta $LOCAL_PORT já está em uso!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Conexões existentes na porta ${LOCAL_PORT}:" -ForegroundColor Yellow
    $portInUse | Format-Table -Property LocalAddress, LocalPort, RemoteAddress, RemotePort, State
    Write-Host ""
    Write-Host "💡 Opções:" -ForegroundColor Cyan
    Write-Host "   1. Feche a conexão existente"
    Write-Host "   2. Use uma porta diferente (ex: 3307)"
    Write-Host ""
    $continue = Read-Host "Deseja continuar mesmo assim? (s/n)"
    if ($continue -ne "s") {
        exit 0
    }
}

Write-Host "🚀 Abrindo túnel SSH..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Comando:" -ForegroundColor Gray
Write-Host "ssh -i $KEY -o StrictHostKeyChecking=no -o ConnectTimeout=30 -L ${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT} ${USER}@${SERVER} -N" -ForegroundColor Gray
Write-Host ""
Write-Host "⏳ Aguardando conexão (timeout: 30s)..." -ForegroundColor Yellow
Write-Host ""

# Tentar conexão
$sshProcess = Start-Process -FilePath "ssh" -ArgumentList "-i", $KEY, "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=30", "-L", "${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT}", "${USER}@${SERVER}", "-N" -NoNewWindow -PassThru

# Aguardar um pouco para ver se conecta
Start-Sleep -Seconds 5

if ($sshProcess.HasExited) {
    Write-Host "❌ Falha ao conectar!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Possíveis causas:" -ForegroundColor Yellow
    Write-Host "   1. Servidor fora do ar ou inacessível"
    Write-Host "   2. Firewall bloqueando a porta 22"
    Write-Host "   3. Chave SSH não autorizada no servidor"
    Write-Host "   4. Usuário incorreto"
    Write-Host ""
    Write-Host "🔧 Diagnóstico:" -ForegroundColor Cyan
    Write-Host "   Testando ping..." -ForegroundColor Gray
    Test-Connection -ComputerName $SERVER -Count 2
    exit 1
}
else {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "✅ TÚNEL ATIVO - Mantenha esta janela aberta!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Próximos passos:" -ForegroundColor Yellow
    Write-Host "   1. Abra um NOVO terminal PowerShell"
    Write-Host "   2. Execute: node test-database.js"
    Write-Host "   3. Ou execute: npm run dev"
    Write-Host ""
    Write-Host "Para fechar o túnel, pressione Ctrl+C" -ForegroundColor Red
    Write-Host ""
    
    # Aguardar o processo SSH
    $sshProcess.WaitForExit()
}
