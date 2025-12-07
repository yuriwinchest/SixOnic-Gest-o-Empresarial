$ErrorActionPreference = "Stop"

# Credenciais VPS
$User = "ver8wdgr"
$IP = "161.97.124.179"
$Password = "Nm84993182/*-+1"
$AppPath = "/home/$User/gestao-vendas"
$WebPath = "/home/$User/web/equipcasa.com.br/public_html"

Write-Output "=== DEPLOY COMPLETO VIA SSH (ROOT) ==="
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

# 2. CRIAR ESTRUTURA DE DIRETÓRIOS NO VPS
Write-Output ""
Write-Output ">>> PASSO 2: Criando estrutura de diretórios no VPS..."
$sshpass = "sshpass -p '$Password'"
ssh -o StrictHostKeyChecking=no $User@$IP @"
mkdir -p $AppPath/backend
mkdir -p $AppPath/frontend
mkdir -p $WebPath
"@

# 3. UPLOAD FRONTEND (dist)
Write-Output ""
Write-Output ">>> PASSO 3: Enviando Frontend..."
scp -o StrictHostKeyChecking=no -r dist/* $User@${IP}:$WebPath/

# 4. UPLOAD BACKEND
Write-Output ""
Write-Output ">>> PASSO 4: Enviando Backend..."
scp -o StrictHostKeyChecking=no -r server/* $User@${IP}:$AppPath/backend/
scp -o StrictHostKeyChecking=no package.json $User@${IP}:$AppPath/backend/
scp -o StrictHostKeyChecking=no .env.production $User@${IP}:$AppPath/backend/.env

# 5. UPLOAD TABELAS SQL
Write-Output ""
Write-Output ">>> PASSO 5: Enviando arquivo SQL..."
scp -o StrictHostKeyChecking=no tabelas_sistema.sql $User@${IP}:$AppPath/

# 6. CONFIGURAR E INICIAR BACKEND
Write-Output ""
Write-Output ">>> PASSO 6: Configurando Backend no VPS..."
ssh -o StrictHostKeyChecking=no $User@$IP @"
cd $AppPath/backend

# Instalar dependências
echo '>>> Instalando dependências...'
npm install --production

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo '>>> Instalando PM2...'
    npm install -g pm2
fi

# Parar processos antigos
echo '>>> Parando processos antigos...'
pm2 delete all 2>/dev/null || true

# Iniciar aplicação
echo '>>> Iniciando aplicação...'
pm2 start index.js --name gestao-vendas
pm2 save
pm2 startup

echo '>>> Backend configurado!'
"@

# 7. IMPORTAR BANCO DE DADOS
Write-Output ""
Write-Output ">>> PASSO 7: Configurando Banco de Dados..."
Write-Output "⚠️  ATENÇÃO: Você precisará importar o SQL manualmente via phpMyAdmin:"
Write-Output "    URL: https://server.equipcasa.com.br:8083"
Write-Output "    Arquivo: $AppPath/tabelas_sistema.sql"
Write-Output ""

# 8. VERIFICAR STATUS
Write-Output ""
Write-Output ">>> PASSO 8: Verificando status dos serviços..."
ssh -o StrictHostKeyChecking=no $User@$IP @"
echo '=== STATUS PM2 ==='
pm2 status

echo ''
echo '=== PORTAS EM USO ==='
netstat -tlnp | grep :3000 || echo 'Porta 3000 não está em uso'

echo ''
echo '=== LOGS DA APLICAÇÃO ==='
pm2 logs gestao-vendas --lines 20 --nostream
"@

Write-Output ""
Write-Output "=== DEPLOY CONCLUÍDO ==="
Write-Output ""
Write-Output "📋 PRÓXIMOS PASSOS:"
Write-Output "1. Acesse: https://server.equipcasa.com.br:8083"
Write-Output "2. Faça login com: $User / $Password"
Write-Output "3. Importe o arquivo SQL: $AppPath/tabelas_sistema.sql"
Write-Output "4. Configure o Nginx para apontar para a porta 3000"
Write-Output "5. Teste o site: https://equipcasa.com.br"
Write-Output ""
