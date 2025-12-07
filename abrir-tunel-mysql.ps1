# Script para abrir túnel SSH para MySQL e testar conexão

Write-Host "🔧 ABRINDO TÚNEL SSH PARA MYSQL" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Configurações
$IP = "161.97.124.179"
$USER = "HugoGabriel"
$KEY = "C:\Users\yuriv\.ssh\deploy_auto_key"
$LOCAL_PORT = 3306
$REMOTE_PORT = 3306

Write-Host "📋 Configurações:" -ForegroundColor Yellow
Write-Host "   IP: $IP"
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
Write-Host "ssh -i $KEY -o StrictHostKeyChecking=no -L ${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT} ${USER}@${IP} -N" -ForegroundColor Gray
Write-Host ""
Write-Host "⏳ Aguardando conexão..." -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "TÚNEL ATIVO - Mantenha esta janela aberta!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Abra um NOVO terminal PowerShell"
Write-Host "   2. Execute: node test-database.js"
Write-Host "   3. Ou execute: npm run dev"
Write-Host ""
Write-Host "Para fechar o túnel, pressione Ctrl+C" -ForegroundColor Red
Write-Host ""

# Abrir túnel (este comando bloqueia até ser interrompido)
ssh -i $KEY -o StrictHostKeyChecking=no -L ${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT} ${USER}@${IP} -N
