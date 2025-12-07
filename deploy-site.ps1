# 🚀 DEPLOY AUTOMÁTICO - EQUIPCASA.COM.BR

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🚀 DEPLOY AUTOMÁTICO PARA VPS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Configurações
$SERVER = "server.equipcasa.com.br"
$USER = "root"
$REMOTE_PATH = "/var/www/html"
$BUILD_DIR = "dist"

Write-Host "📋 Configurações:" -ForegroundColor Yellow
Write-Host "   Servidor: $SERVER"
Write-Host "   Usuário: $USER"
Write-Host "   Caminho remoto: $REMOTE_PATH"
Write-Host "   Diretório build: $BUILD_DIR"
Write-Host ""

# Passo 1: Limpar build anterior
Write-Host "🧹 Passo 1: Limpando build anterior..." -ForegroundColor Cyan
if (Test-Path $BUILD_DIR) {
    Remove-Item -Recurse -Force $BUILD_DIR
    Write-Host "   ✅ Build anterior removido" -ForegroundColor Green
}
else {
    Write-Host "   ℹ️  Nenhum build anterior encontrado" -ForegroundColor Gray
}
Write-Host ""

# Passo 2: Instalar dependências
Write-Host "📦 Passo 2: Verificando dependências..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "   Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Erro ao instalar dependências" -ForegroundColor Red
        exit 1
    }
    Write-Host "   ✅ Dependências instaladas" -ForegroundColor Green
}
else {
    Write-Host "   ✅ Dependências já instaladas" -ForegroundColor Green
}
Write-Host ""

# Passo 3: Build do projeto
Write-Host "🔨 Passo 3: Compilando projeto..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erro ao compilar projeto" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Projeto compilado com sucesso" -ForegroundColor Green
Write-Host ""

# Verificar se o build foi criado
if (-not (Test-Path $BUILD_DIR)) {
    Write-Host "❌ Erro: Diretório $BUILD_DIR não foi criado" -ForegroundColor Red
    exit 1
}

# Passo 4: Preparar backend
Write-Host "📁 Passo 4: Preparando arquivos do backend..." -ForegroundColor Cyan
$backendFiles = @("server", "package.json", "package-lock.json")
$missingFiles = @()

foreach ($file in $backendFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "   ⚠️  Arquivos faltando: $($missingFiles -join ', ')" -ForegroundColor Yellow
}
else {
    Write-Host "   ✅ Todos os arquivos do backend encontrados" -ForegroundColor Green
}
Write-Host ""

# Passo 5: Upload via SCP
Write-Host "📤 Passo 5: Enviando arquivos para VPS..." -ForegroundColor Cyan
Write-Host "   Isso pode levar alguns minutos..." -ForegroundColor Yellow
Write-Host ""

# Criar diretório temporário na VPS
Write-Host "   Criando estrutura de diretórios..." -ForegroundColor Gray
ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} "mkdir -p $REMOTE_PATH/frontend $REMOTE_PATH/backend"

# Upload do frontend (dist)
Write-Host "   Enviando frontend..." -ForegroundColor Gray
scp -r -o StrictHostKeyChecking=no ${BUILD_DIR}/* ${USER}@${SERVER}:${REMOTE_PATH}/frontend/

# Upload do backend
Write-Host "   Enviando backend..." -ForegroundColor Gray
scp -r -o StrictHostKeyChecking=no server ${USER}@${SERVER}:${REMOTE_PATH}/backend/
scp -o StrictHostKeyChecking=no package.json ${USER}@${SERVER}:${REMOTE_PATH}/backend/
scp -o StrictHostKeyChecking=no package-lock.json ${USER}@${SERVER}:${REMOTE_PATH}/backend/

Write-Host "   ✅ Arquivos enviados" -ForegroundColor Green
Write-Host ""

# Passo 6: Configurar backend na VPS
Write-Host "🔧 Passo 6: Configurando backend na VPS..." -ForegroundColor Cyan

$remoteCommands = @"
cd $REMOTE_PATH/backend
echo '📦 Instalando dependências do backend...'
npm install --production

echo '🔧 Configurando PM2...'
npm install -g pm2

echo '🚀 Iniciando servidor backend...'
pm2 stop nexus-backend 2>/dev/null || true
pm2 delete nexus-backend 2>/dev/null || true
pm2 start server/index.js --name nexus-backend
pm2 save
pm2 startup

echo '✅ Backend configurado e rodando!'
"@

ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} $remoteCommands

Write-Host "   ✅ Backend configurado" -ForegroundColor Green
Write-Host ""

# Passo 7: Configurar Nginx
Write-Host "🌐 Passo 7: Configurando Nginx..." -ForegroundColor Cyan

$nginxConfig = @"
server {
    listen 80;
    server_name equipcasa.com.br www.equipcasa.com.br;

    # Frontend (React/Vite)
    location / {
        root $REMOTE_PATH/frontend;
        try_files `$uri `$uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
    }

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Cache estático
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
"@

# Salvar configuração Nginx
$nginxConfig | ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} "cat > /etc/nginx/sites-available/equipcasa.conf"

# Ativar site e recarregar Nginx
ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} @"
ln -sf /etc/nginx/sites-available/equipcasa.conf /etc/nginx/sites-enabled/
nginx -t && nginx -s reload
"@

Write-Host "   ✅ Nginx configurado" -ForegroundColor Green
Write-Host ""

# Passo 8: Verificar status
Write-Host "🔍 Passo 8: Verificando status..." -ForegroundColor Cyan

ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} @"
echo '📊 Status dos serviços:'
echo ''
echo 'Nginx:'
systemctl status nginx --no-pager | head -3
echo ''
echo 'PM2 (Backend):'
pm2 status
echo ''
echo 'Portas em uso:'
netstat -tulpn | grep -E ':(80|3001)' || echo 'Nenhuma porta encontrada'
"@

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Acesse seu site:" -ForegroundColor Yellow
Write-Host "   http://equipcasa.com.br" -ForegroundColor Cyan
Write-Host "   http://www.equipcasa.com.br" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 API Backend:" -ForegroundColor Yellow
Write-Host "   http://equipcasa.com.br/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Comandos úteis:" -ForegroundColor Yellow
Write-Host "   Ver logs do backend: ssh root@$SERVER 'pm2 logs nexus-backend'" -ForegroundColor Gray
Write-Host "   Reiniciar backend: ssh root@$SERVER 'pm2 restart nexus-backend'" -ForegroundColor Gray
Write-Host "   Ver status: ssh root@$SERVER 'pm2 status'" -ForegroundColor Gray
Write-Host ""
