$ErrorActionPreference = "Stop"

# Configurações
$User = "HugoGandy"
$IP = "161.97.124.179"
$Key = "C:\Users\yuriv\.ssh\hugo_key"
$AppPath = "/home/$User/gestao-vendas"
$WebPath = "/home/$User/web/equipcasa.com.br/public_html"

Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Output "🚀 DEPLOY AUTOMÁTICO - EQUIPCASA.COM.BR"
Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Output "Servidor: $IP"
Write-Output "Usuário: $User"
Write-Output ""

# Verificar chave
if (-not (Test-Path $Key)) {
    Write-Error "❌ Chave SSH não encontrada: $Key"
    Write-Output "Execute: .\testar-ssh-nova-chave.ps1"
    exit 1
}

# 1. BUILD
Write-Output ">>> [1/5] Build do Frontend..."
$buildStart = Get-Date
npm run build
if (-not $?) {
    Write-Error "❌ Erro no build!"
    exit 1
}
$buildTime = ((Get-Date) - $buildStart).TotalSeconds
Write-Output "✅ Build concluído em $([math]::Round($buildTime, 1))s"

# 2. PREPARAR UPLOAD
Write-Output ""
Write-Output ">>> [2/5] Preparando upload..."
Write-Output "✅ Usando SCP para upload"

# 3. UPLOAD FRONTEND
Write-Output ""
Write-Output ">>> [3/5] Enviando Frontend..."
$uploadStart = Get-Date

# Criar diretório remoto se não existir
ssh -o StrictHostKeyChecking=no -i $Key $User@$IP "mkdir -p $WebPath" 2>&1 | Out-Null

# Upload via SCP
scp -o StrictHostKeyChecking=no -i $Key -r dist/* ${User}@${IP}:${WebPath}/ 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    $uploadTime = ((Get-Date) - $uploadStart).TotalSeconds
    Write-Output "✅ Frontend enviado em $([math]::Round($uploadTime, 1))s"
}
else {
    Write-Error "❌ Erro ao enviar frontend!"
    exit 1
}

# 4. UPLOAD BACKEND
Write-Output ""
Write-Output ">>> [4/5] Enviando Backend..."

# Criar diretório backend se não existir
ssh -o StrictHostKeyChecking=no -i $Key $User@$IP "mkdir -p $AppPath/backend" 2>&1 | Out-Null

# Upload arquivos do backend
scp -o StrictHostKeyChecking=no -i $Key server/*.js ${User}@${IP}:${AppPath}/backend/ 2>&1 | Out-Null
scp -o StrictHostKeyChecking=no -i $Key package.json ${User}@${IP}:${AppPath}/backend/ 2>&1 | Out-Null
scp -o StrictHostKeyChecking=no -i $Key .env.production ${User}@${IP}:${AppPath}/backend/.env 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Output "✅ Backend enviado"
}
else {
    Write-Error "❌ Erro ao enviar backend!"
    exit 1
}

# 5. REINICIAR BACKEND
Write-Output ""
Write-Output ">>> [5/5] Reiniciando Backend..."

$sshCommands = @"
cd $AppPath/backend
npm install --production --silent
pm2 delete gestao-vendas 2>/dev/null || true
pm2 start index.js --name gestao-vendas
pm2 save
"@

ssh -o StrictHostKeyChecking=no -i $Key $User@$IP $sshCommands 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Output "✅ Backend reiniciado"
}
else {
    Write-Output "⚠️  Não foi possível reiniciar automaticamente"
    Write-Output "   Reinicie manualmente via painel"
}

# 6. VERIFICAR STATUS
Write-Output ""
Write-Output ">>> Verificando status..."
$status = ssh -o StrictHostKeyChecking=no -i $Key $User@$IP "pm2 jlist 2>/dev/null | jq -r '.[0] | \"Nome: \" + .name + \" | Status: \" + .pm2_env.status + \" | Uptime: \" + (.pm2_env.pm_uptime | tostring)' 2>/dev/null || pm2 status"

Write-Output ""
Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Output "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Output ""
Write-Output "🌐 Site: https://equipcasa.com.br"
Write-Output "🔧 API: https://equipcasa.com.br/api/health"
Write-Output ""
Write-Output "📊 Status do Backend:"
Write-Output $status
Write-Output ""
Write-Output "💡 Comandos úteis:"
Write-Output "   Ver logs: ssh -i $Key $User@$IP 'pm2 logs gestao-vendas'"
Write-Output "   Reiniciar: ssh -i $Key $User@$IP 'pm2 restart gestao-vendas'"
Write-Output ""
Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
