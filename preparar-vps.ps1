# 🔧 PREPARAR VPS - INSTALAR SERVIÇOS

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🔧 PREPARANDO VPS - INSTALAÇÃO DE SERVIÇOS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$SERVER = "server.equipcasa.com.br"
$USER = "root"

Write-Host "📋 Servidor: $SERVER" -ForegroundColor Yellow
Write-Host "👤 Usuário: $USER" -ForegroundColor Yellow
Write-Host ""

Write-Host "⚠️  Este script irá:" -ForegroundColor Yellow
Write-Host "   1. Atualizar sistema" -ForegroundColor Gray
Write-Host "   2. Instalar Node.js 20.x" -ForegroundColor Gray
Write-Host "   3. Instalar PM2 (gerenciador de processos)" -ForegroundColor Gray
Write-Host "   4. Instalar/Configurar Nginx" -ForegroundColor Gray
Write-Host "   5. Instalar MySQL (se necessário)" -ForegroundColor Gray
Write-Host "   6. Configurar firewall" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Deseja continuar? (s/n)"
if ($confirm -ne "s") {
    Write-Host "❌ Cancelado pelo usuário" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Iniciando configuração da VPS..." -ForegroundColor Cyan
Write-Host ""

# Script de instalação completo
$setupScript = @'
#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 CONFIGURAÇÃO AUTOMÁTICA DA VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Passo 1: Atualizar sistema
echo "📦 Passo 1: Atualizando sistema..."
apt-get update -y
apt-get upgrade -y
echo "✅ Sistema atualizado"
echo ""

# Passo 2: Instalar Node.js 20.x
echo "📦 Passo 2: Instalando Node.js 20.x..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "ℹ️  Node.js já instalado: $NODE_VERSION"
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo "✅ Node.js instalado: $(node -v)"
fi
echo ""

# Passo 3: Instalar PM2
echo "📦 Passo 3: Instalando PM2..."
if command -v pm2 &> /dev/null; then
    echo "ℹ️  PM2 já instalado: $(pm2 -v)"
else
    npm install -g pm2
    echo "✅ PM2 instalado: $(pm2 -v)"
fi
echo ""

# Passo 4: Instalar Nginx
echo "📦 Passo 4: Instalando Nginx..."
if command -v nginx &> /dev/null; then
    echo "ℹ️  Nginx já instalado: $(nginx -v 2>&1)"
else
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo "✅ Nginx instalado e iniciado"
fi
echo ""

# Passo 5: Verificar MySQL
echo "📦 Passo 5: Verificando MySQL..."
if command -v mysql &> /dev/null; then
    echo "✅ MySQL já instalado: $(mysql -V)"
else
    echo "⚠️  MySQL não encontrado"
    echo "ℹ️  Se precisar, instale com: apt-get install -y mysql-server"
fi
echo ""

# Passo 6: Configurar Firewall
echo "🔥 Passo 6: Configurando Firewall (UFW)..."
if command -v ufw &> /dev/null; then
    # Permitir SSH, HTTP, HTTPS
    ufw allow 22/tcp comment 'SSH'
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    ufw allow 8083/tcp comment 'Hestia Panel'
    
    # Habilitar firewall (se ainda não estiver)
    echo "y" | ufw enable 2>/dev/null || true
    
    echo "✅ Firewall configurado"
    ufw status numbered
else
    echo "⚠️  UFW não encontrado"
fi
echo ""

# Passo 7: Criar diretórios
echo "📁 Passo 7: Criando estrutura de diretórios..."
mkdir -p /var/www/html/frontend
mkdir -p /var/www/html/backend
chown -R www-data:www-data /var/www/html
echo "✅ Diretórios criados"
echo ""

# Passo 8: Configurar PM2 para iniciar no boot
echo "🔧 Passo 8: Configurando PM2 startup..."
pm2 startup systemd -u root --hp /root
echo "✅ PM2 configurado para iniciar no boot"
echo ""

# Resumo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CONFIGURAÇÃO CONCLUÍDA!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Versões instaladas:"
echo "   Node.js: $(node -v)"
echo "   npm: $(npm -v)"
echo "   PM2: $(pm2 -v)"
echo "   Nginx: $(nginx -v 2>&1 | grep -oP 'nginx/\K[0-9.]+')"
echo ""
echo "🔥 Firewall (UFW):"
ufw status numbered
echo ""
echo "📁 Diretórios criados:"
echo "   Frontend: /var/www/html/frontend"
echo "   Backend: /var/www/html/backend"
echo ""
echo "✅ VPS pronta para receber o deploy!"
echo ""
'@

# Salvar script temporário
$tempScript = "setup-vps-temp.sh"
$setupScript | Out-File -FilePath $tempScript -Encoding UTF8 -NoNewline

Write-Host "📤 Enviando script de configuração para VPS..." -ForegroundColor Cyan
scp -o StrictHostKeyChecking=no $tempScript ${USER}@${SERVER}:/tmp/setup-vps.sh

Write-Host "🚀 Executando configuração na VPS..." -ForegroundColor Cyan
Write-Host "   (Isso pode levar alguns minutos...)" -ForegroundColor Yellow
Write-Host ""

ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} "chmod +x /tmp/setup-vps.sh && /tmp/setup-vps.sh"

# Limpar arquivo temporário local
Remove-Item $tempScript -Force

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ VPS CONFIGURADA COM SUCESSO!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Execute: .\deploy-site.ps1" -ForegroundColor Cyan
Write-Host "   2. Aguarde o deploy completar" -ForegroundColor Cyan
Write-Host "   3. Acesse: http://equipcasa.com.br" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Comandos úteis:" -ForegroundColor Yellow
Write-Host "   Verificar serviços: ssh root@$SERVER 'systemctl status nginx && pm2 status'" -ForegroundColor Gray
Write-Host "   Ver logs Nginx: ssh root@$SERVER 'tail -f /var/log/nginx/error.log'" -ForegroundColor Gray
Write-Host "   Ver logs PM2: ssh root@$SERVER 'pm2 logs'" -ForegroundColor Gray
Write-Host ""
