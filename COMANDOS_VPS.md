# 🚀 COMANDOS PARA EXECUTAR NA VPS

## 📋 OPÇÃO 1: Comando Único (Copiar e Colar)

Conecte via SSH:
```bash
ssh root@server.equipcasa.com.br
```

Depois cole este comando completo:

```bash
apt-get update -y && \
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
apt-get install -y nodejs && \
npm install -g pm2 && \
mkdir -p /var/www/html/frontend /var/www/html/backend && \
chown -R www-data:www-data /var/www/html && \
pm2 startup systemd -u root --hp /root && \
echo "✅ VPS preparada! Node: $(node -v) | PM2: $(pm2 -v)"
```

---

## 📋 OPÇÃO 2: Via Arquivo

Envie o arquivo:
```powershell
scp install-vps.sh root@server.equipcasa.com.br:/tmp/
```

Execute na VPS:
```bash
ssh root@server.equipcasa.com.br
chmod +x /tmp/install-vps.sh
/tmp/install-vps.sh
```

---

## 📋 OPÇÃO 3: Passo a Passo

```bash
# 1. Conectar
ssh root@server.equipcasa.com.br

# 2. Atualizar
apt-get update -y

# 3. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 4. Instalar PM2
npm install -g pm2

# 5. Criar diretórios
mkdir -p /var/www/html/frontend
mkdir -p /var/www/html/backend
chown -R www-data:www-data /var/www/html

# 6. Configurar PM2
pm2 startup systemd -u root --hp /root

# 7. Verificar
node -v
npm -v
pm2 -v
```

---

## ✅ DEPOIS DE INSTALAR

Execute localmente para fazer o deploy:
```powershell
.\deploy-site.ps1
```

Ou faça manualmente:

```powershell
# 1. Build local
npm run build

# 2. Enviar frontend
scp -r dist/* root@server.equipcasa.com.br:/var/www/html/frontend/

# 3. Enviar backend
scp -r server root@server.equipcasa.com.br:/var/www/html/backend/
scp package.json root@server.equipcasa.com.br:/var/www/html/backend/

# 4. Instalar e iniciar na VPS
ssh root@server.equipcasa.com.br "cd /var/www/html/backend && npm install --production && pm2 start server/index.js --name nexus-backend && pm2 save"
```

---

## 🌐 CONFIGURAR NGINX

Na VPS, crie o arquivo de configuração:

```bash
cat > /etc/nginx/sites-available/equipcasa.conf << 'EOF'
server {
    listen 80;
    server_name equipcasa.com.br www.equipcasa.com.br;

    location / {
        root /var/www/html/frontend;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/equipcasa.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 🎯 VERIFICAR SE FUNCIONOU

```bash
# Na VPS
systemctl status nginx
pm2 status
curl http://localhost:3001/api/health
```

```powershell
# Localmente
curl http://equipcasa.com.br
curl http://equipcasa.com.br/api/health
```
