#!/bin/bash
# Script de instalação para VPS - Execute via SSH

echo "🔧 Instalando serviços na VPS..."
echo ""

# Atualizar sistema
echo "📦 Atualizando sistema..."
apt-get update -y

# Instalar Node.js 20.x
echo "📦 Instalando Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Instalar PM2
echo "📦 Instalando PM2..."
npm install -g pm2

# Instalar Nginx (se necessário)
echo "📦 Verificando Nginx..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
fi

# Criar diretórios
echo "📁 Criando diretórios..."
mkdir -p /var/www/html/frontend
mkdir -p /var/www/html/backend
chown -R www-data:www-data /var/www/html

# Configurar firewall
echo "🔥 Configurando firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8083/tcp
echo "y" | ufw enable

# PM2 startup
echo "🔧 Configurando PM2..."
pm2 startup systemd -u root --hp /root

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "Versões instaladas:"
echo "  Node.js: $(node -v)"
echo "  npm: $(npm -v)"
echo "  PM2: $(pm2 -v)"
echo ""
