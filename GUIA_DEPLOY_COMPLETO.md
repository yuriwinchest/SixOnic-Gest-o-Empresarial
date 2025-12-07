# 🚀 GUIA RÁPIDO: PREPARAR VPS E FAZER DEPLOY

## 📋 PASSO A PASSO

### 1️⃣ PREPARAR VPS (Instalar Serviços)

#### Opção A: Script Automático
```powershell
.\preparar-vps.ps1
```
- Digite a senha do root quando pedir
- Aguarde a instalação (2-5 minutos)

#### Opção B: Manual via SSH
```powershell
ssh root@server.equipcasa.com.br
```

Depois execute na VPS:
```bash
# Atualizar sistema
apt-get update -y && apt-get upgrade -y

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Instalar PM2
npm install -g pm2

# Instalar Nginx (se não tiver)
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# Configurar firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8083/tcp
ufw enable

# Criar diretórios
mkdir -p /var/www/html/frontend
mkdir -p /var/www/html/backend
chown -R www-data:www-data /var/www/html

# Configurar PM2 startup
pm2 startup systemd -u root --hp /root

echo "✅ VPS preparada!"
```

---

### 2️⃣ FAZER DEPLOY DO SITE

Depois que a VPS estiver preparada:

```powershell
.\deploy-site.ps1
```

- Digite a senha do root quando pedir
- Aguarde o deploy (2-3 minutos)

---

## 🎯 PROCESSO COMPLETO EM 2 COMANDOS

```powershell
# 1. Preparar VPS
.\preparar-vps.ps1

# 2. Fazer Deploy
.\deploy-site.ps1
```

---

## ✅ VERIFICAR SE DEU CERTO

### Via Navegador
```
http://equipcasa.com.br
http://equipcasa.com.br/api/health
```

### Via SSH
```bash
ssh root@server.equipcasa.com.br

# Verificar serviços
systemctl status nginx
pm2 status

# Ver logs
pm2 logs nexus-backend
tail -f /var/log/nginx/error.log
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Node.js não encontrado"
```bash
ssh root@server.equipcasa.com.br
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
```

### Erro: "PM2 não encontrado"
```bash
ssh root@server.equipcasa.com.br
npm install -g pm2
```

### Erro: "Nginx não está rodando"
```bash
ssh root@server.equipcasa.com.br
systemctl start nginx
systemctl enable nginx
```

### Site não carrega
```bash
ssh root@server.equipcasa.com.br

# Verificar Nginx
nginx -t
systemctl status nginx

# Verificar backend
pm2 status
pm2 logs nexus-backend

# Verificar firewall
ufw status
```

---

## 📝 COMANDOS ÚTEIS

### Reiniciar serviços
```bash
ssh root@server.equipcasa.com.br "systemctl restart nginx && pm2 restart all"
```

### Ver logs em tempo real
```bash
ssh root@server.equipcasa.com.br "pm2 logs nexus-backend --lines 50"
```

### Atualizar apenas o frontend
```bash
npm run build
scp -r dist/* root@server.equipcasa.com.br:/var/www/html/frontend/
```

### Atualizar apenas o backend
```bash
scp -r server root@server.equipcasa.com.br:/var/www/html/backend/
ssh root@server.equipcasa.com.br "cd /var/www/html/backend && npm install && pm2 restart nexus-backend"
```

---

## 🔐 CONFIGURAR SSL (HTTPS) - OPCIONAL

Depois que o site estiver funcionando:

```bash
ssh root@server.equipcasa.com.br

# Instalar Certbot
apt-get install -y certbot python3-certbot-nginx

# Obter certificado SSL
certbot --nginx -d equipcasa.com.br -d www.equipcasa.com.br

# Renovação automática
certbot renew --dry-run
```

---

## 🎉 RESULTADO FINAL

Após executar os 2 scripts, você terá:

✅ **Frontend**: React/Vite servido pelo Nginx
✅ **Backend**: Node.js/Express rodando com PM2
✅ **Banco**: MySQL configurado
✅ **Domínio**: equipcasa.com.br funcionando
✅ **API**: equipcasa.com.br/api/* funcionando
✅ **Auto-restart**: PM2 reinicia o backend se cair
✅ **Firewall**: Portas corretas liberadas

---

## 📞 SUPORTE

Se algo der errado, execute:

```bash
ssh root@server.equipcasa.com.br

# Diagnóstico completo
echo "=== NGINX ===" && systemctl status nginx
echo "=== PM2 ===" && pm2 status
echo "=== FIREWALL ===" && ufw status
echo "=== PORTAS ===" && netstat -tulpn | grep -E ':(80|443|3001)'
echo "=== DISK ===" && df -h
echo "=== MEMORY ===" && free -h
```

E me envie o resultado! 🚀
