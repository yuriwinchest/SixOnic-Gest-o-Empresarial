$ErrorActionPreference = "Stop"

# Configurações
$User = "HugoGandy"
$IP = "161.97.124.179"
$Key = "C:\Users\yuriv\.ssh\deploy_auto_key"
$AppPath = "/home/$User/gestao-vendas"
$WebPath = "/home/$User/web/equipcasa.com.br/public_html"

Write-Output "=== DEPLOY COMPLETO VIA SSH (HugoGandy) ==="
Write-Output "Servidor: $IP"
Write-Output "Usuário: $User"
Write-Output "Chave SSH: $Key"
Write-Output ""

# Verificar se a chave existe
if (-not (Test-Path $Key)) {
    Write-Error "Chave SSH não encontrada: $Key"
    exit 1
}

# 1. BUILD LOCAL
Write-Output ">>> PASSO 1: Build do Frontend..."
npm run build
if (-not $?) {
    Write-Error "Erro no build do frontend!"
    exit 1
}
Write-Output "✅ Build concluído!"

# 2. CRIAR COMANDOS SFTP
Write-Output ""
Write-Output ">>> PASSO 2: Preparando comandos SFTP..."

# Frontend SFTP
@"
-mkdir $WebPath
cd $WebPath
lcd dist
mput -r *
bye
"@ | Out-File -FilePath "sftp_frontend_hugo.txt" -Encoding ASCII -Force

# Backend SFTP
@"
-mkdir $AppPath
-mkdir $AppPath/backend
cd $AppPath/backend
lcd server
put index.js
put db.js
put sql.js
lcd ..
put package.json
put .env.production .env
cd $AppPath
put tabelas_sistema.sql
bye
"@ | Out-File -FilePath "sftp_backend_hugo.txt" -Encoding ASCII -Force

Write-Output "✅ Comandos SFTP preparados!"

# 3. UPLOAD FRONTEND
Write-Output ""
Write-Output ">>> PASSO 3: Enviando Frontend via SFTP..."
sftp -o StrictHostKeyChecking=no -i $Key -b sftp_frontend_hugo.txt $User@$IP

if ($LASTEXITCODE -eq 0) {
    Write-Output "✅ Frontend enviado com sucesso!"
}
else {
    Write-Error "Erro ao enviar frontend!"
    exit 1
}

# 4. UPLOAD BACKEND
Write-Output ""
Write-Output ">>> PASSO 4: Enviando Backend via SFTP..."
sftp -o StrictHostKeyChecking=no -i $Key -b sftp_backend_hugo.txt $User@$IP

if ($LASTEXITCODE -eq 0) {
    Write-Output "✅ Backend enviado com sucesso!"
}
else {
    Write-Error "Erro ao enviar backend!"
    exit 1
}

# 5. CONFIGURAR BACKEND VIA SSH
Write-Output ""
Write-Output ">>> PASSO 5: Configurando Backend via SSH..."

$sshCommands = @"
cd $AppPath/backend
echo '>>> Instalando dependências...'
npm install --production
echo '>>> Parando processos antigos...'
pm2 delete all 2>/dev/null || true
echo '>>> Iniciando aplicação...'
pm2 start index.js --name gestao-vendas
pm2 save
pm2 startup
echo '>>> Verificando status...'
pm2 status
echo '>>> Logs recentes...'
pm2 logs gestao-vendas --lines 10 --nostream
"@

try {
    ssh -o StrictHostKeyChecking=no -i $Key $User@$IP $sshCommands
    
    if ($LASTEXITCODE -eq 0) {
        Write-Output ""
        Write-Output "✅ Backend configurado e iniciado com sucesso!"
    }
    else {
        Write-Output ""
        Write-Output "⚠️  Houve algum problema na configuração do backend."
        Write-Output "    Verifique os logs acima."
    }
}
catch {
    Write-Output ""
    Write-Output "⚠️  Não foi possível executar comandos via SSH."
    Write-Output "    Possíveis causas:"
    Write-Output "    1. SSH Access não está configurado como 'bash' para o usuário HugoGandy"
    Write-Output "    2. A chave SSH não foi adicionada ao usuário HugoGandy"
    Write-Output ""
    Write-Output "    Configure manualmente via painel:"
    Write-Output "    https://server.equipcasa.com.br:8083"
    Write-Output ""
    Write-Output "    Depois execute os comandos via Terminal SSH:"
    Write-Output $sshCommands
}

# 6. VERIFICAR CONEXÃO
Write-Output ""
Write-Output ">>> PASSO 6: Verificando serviços..."

try {
    $status = ssh -o StrictHostKeyChecking=no -i $Key $User@$IP "pm2 jlist"
    Write-Output "Status PM2:"
    Write-Output $status
}
catch {
    Write-Output "⚠️  Não foi possível verificar o status automaticamente."
}

Write-Output ""
Write-Output "=== DEPLOY CONCLUÍDO ==="
Write-Output ""
Write-Output "📋 PRÓXIMOS PASSOS:"
Write-Output ""
Write-Output "1. IMPORTAR BANCO DE DADOS:"
Write-Output "   - Acesse: https://server.equipcasa.com.br:8083"
Write-Output "   - Login com usuário HugoGandy"
Write-Output "   - phpMyAdmin → Importar"
Write-Output "   - Arquivo: $AppPath/tabelas_sistema.sql"
Write-Output ""
Write-Output "2. VERIFICAR BACKEND:"
Write-Output "   ssh -i $Key $User@$IP"
Write-Output "   pm2 status"
Write-Output "   pm2 logs gestao-vendas"
Write-Output ""
Write-Output "3. TESTAR APLICAÇÃO:"
Write-Output "   - Site: https://equipcasa.com.br"
Write-Output "   - API: https://equipcasa.com.br/api/health"
Write-Output ""
Write-Output "4. SE HOUVER PROBLEMAS:"
Write-Output "   - Logs Nginx: tail -f /var/log/nginx/error.log"
Write-Output "   - Logs Backend: pm2 logs gestao-vendas"
Write-Output "   - Reiniciar: pm2 restart gestao-vendas"
Write-Output ""
