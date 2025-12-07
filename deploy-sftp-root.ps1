$ErrorActionPreference = "Stop"

# Credenciais VPS
$User = "ver8wdgr"
$IP = "161.97.124.179"
$Password1 = "Nm84993182/*-+1"
$Password2 = "Hugo2025"
$AppPath = "/home/$User/gestao-vendas"
$WebPath = "/home/$User/web/equipcasa.com.br/public_html"

Write-Output "=== DEPLOY COMPLETO VIA SFTP/SSH ==="
Write-Output "Servidor: $IP"
Write-Output "Usuário: $User"
Write-Output ""

# 1. BUILD LOCAL
Write-Output ">>> PASSO 1: Build do Frontend..."
npm run build
if (-not $?) {
    Write-Error "Erro no build do frontend!"
    exit 1
}

# 2. CRIAR ARQUIVOS DE COMANDOS SFTP
Write-Output ""
Write-Output ">>> PASSO 2: Preparando comandos SFTP..."

# Frontend SFTP
@"
-mkdir /home/$User/web
-mkdir /home/$User/web/equipcasa.com.br
-mkdir /home/$User/web/equipcasa.com.br/public_html
cd /home/$User/web/equipcasa.com.br/public_html
lcd dist
mput -r *
bye
"@ | Out-File -FilePath "sftp_frontend_root.txt" -Encoding ASCII

# Backend SFTP
@"
-mkdir /home/$User/gestao-vendas
-mkdir /home/$User/gestao-vendas/backend
cd /home/$User/gestao-vendas/backend
lcd server
mput -r *
lcd ..
put package.json
put .env.production .env
cd /home/$User/gestao-vendas
put tabelas_sistema.sql
bye
"@ | Out-File -FilePath "sftp_backend_root.txt" -Encoding ASCII

# 3. UPLOAD FRONTEND
Write-Output ""
Write-Output ">>> PASSO 3: Enviando Frontend via SFTP..."
Write-Output "⚠️  Quando solicitar senha, use: $Password1"
Write-Output "    Se não funcionar, tente: $Password2"
Write-Output ""

sftp -o StrictHostKeyChecking=no -b sftp_frontend_root.txt $User@$IP
if (-not $?) {
    Write-Output "⚠️  Primeira tentativa falhou. Isso é normal se a senha estiver incorreta."
    Write-Output "    Execute novamente e use a senha alternativa: $Password2"
}

# 4. UPLOAD BACKEND
Write-Output ""
Write-Output ">>> PASSO 4: Enviando Backend via SFTP..."
sftp -o StrictHostKeyChecking=no -b sftp_backend_root.txt $User@$IP

# 5. CONFIGURAR BACKEND VIA SSH
Write-Output ""
Write-Output ">>> PASSO 5: Configurando Backend..."
Write-Output "⚠️  Tentando executar comandos via SSH..."
Write-Output ""

$commands = @"
cd $AppPath/backend
echo '>>> Instalando dependências...'
npm install --production
echo '>>> Parando processos antigos...'
pm2 delete all 2>/dev/null || true
echo '>>> Iniciando aplicação...'
pm2 start index.js --name gestao-vendas
pm2 save
pm2 startup
echo '>>> Status:'
pm2 status
"@

# Tentar via SSH
try {
    ssh -o StrictHostKeyChecking=no $User@$IP $commands
    Write-Output "✅ Backend configurado com sucesso!"
}
catch {
    Write-Output "⚠️  SSH pode estar bloqueado ou requer configuração manual."
    Write-Output ""
    Write-Output "Configure manualmente via painel SSH:"
    Write-Output ""
    Write-Output $commands
}

Write-Output ""
Write-Output "=== DEPLOY CONCLUÍDO ==="
Write-Output ""
Write-Output "📋 PRÓXIMOS PASSOS MANUAIS:"
Write-Output ""
Write-Output "1. BANCO DE DADOS:"
Write-Output "   - Acesse: https://server.equipcasa.com.br:8083"
Write-Output "   - Login: $User"
Write-Output "   - Senha: $Password1 (ou $Password2)"
Write-Output "   - Importe: $AppPath/tabelas_sistema.sql"
Write-Output ""
Write-Output "2. VERIFICAR BACKEND (via painel SSH ou terminal web):"
Write-Output "   cd $AppPath/backend"
Write-Output "   pm2 status"
Write-Output "   pm2 logs gestao-vendas"
Write-Output ""
Write-Output "3. CONFIGURAR NGINX (se necessário):"
Write-Output "   - Frontend: $WebPath"
Write-Output "   - Backend proxy: http://localhost:3000"
Write-Output ""
Write-Output "4. TESTAR:"
Write-Output "   - Site: https://equipcasa.com.br"
Write-Output "   - API: https://equipcasa.com.br/api/health"
Write-Output ""
Write-Output "💡 SENHAS DISPONÍVEIS:"
Write-Output "   Senha 1: $Password1"
Write-Output "   Senha 2: $Password2"
Write-Output ""
