# 🔐 CONFIGURAR HTTPS (SSL) - LET'S ENCRYPT

## 🎯 OBJETIVO

Configurar certificado SSL gratuito para que o site funcione com HTTPS:
- ✅ `https://equipcasa.com.br`
- ✅ `https://www.equipcasa.com.br`

---

## 📋 PASSO A PASSO

### 1. Conectar na VPS

```bash
ssh root@server.equipcasa.com.br
```

### 2. Instalar Certbot

```bash
# Atualizar sistema
apt-get update

# Instalar Certbot
apt-get install -y certbot python3-certbot-nginx

# Verificar instalação
certbot --version
```

### 3. Obter Certificado SSL

```bash
# Executar Certbot
certbot --nginx -d equipcasa.com.br -d www.equipcasa.com.br
```

**Responda as perguntas:**

1. **Email:** Digite seu email (para renovação e avisos)
   ```
   exemplo@gmail.com
   ```

2. **Termos de Serviço:** Digite `Y` (aceitar)

3. **Compartilhar email com EFF:** Digite `N` (opcional)

4. **Redirecionar HTTP para HTTPS:**
   - Opção `1`: Não redirecionar (manter HTTP e HTTPS)
   - Opção `2`: Redirecionar (recomendado) ← **ESCOLHA ESTA**

### 4. Verificar

```bash
# Testar configuração Nginx
nginx -t

# Recarregar Nginx
systemctl reload nginx

# Verificar certificado
certbot certificates

# Testar HTTPS
curl -I https://equipcasa.com.br
```

---

## 🔄 RENOVAÇÃO AUTOMÁTICA

O Certbot configura renovação automática. Para testar:

```bash
# Testar renovação (dry-run)
certbot renew --dry-run

# Ver timer de renovação
systemctl status certbot.timer
```

---

## ✅ RESULTADO ESPERADO

Após executar, você terá:

- ✅ Certificado SSL instalado
- ✅ HTTPS funcionando
- ✅ HTTP redirecionando para HTTPS (se escolheu opção 2)
- ✅ Renovação automática configurada
- ✅ Site seguro com cadeado verde 🔒

**Acesse:**
- `https://equipcasa.com.br` ✅
- `http://equipcasa.com.br` → redireciona para HTTPS ✅

---

## 🔧 CONFIGURAÇÃO MANUAL (SE NECESSÁRIO)

Se o Certbot não configurar automaticamente, edite manualmente:

```bash
# Editar configuração Nginx
nano /etc/nginx/sites-available/equipcasa.conf
```

Adicione:

```nginx
server {
    listen 80;
    server_name equipcasa.com.br www.equipcasa.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen 8080;
    server_name equipcasa.com.br www.equipcasa.com.br;

    ssl_certificate /etc/letsencrypt/live/equipcasa.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/equipcasa.com.br/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /var/www/html/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Salve e recarregue:

```bash
# Testar
nginx -t

# Recarregar
systemctl reload nginx
```

---

## 🌐 REATIVAR CLOUDFLARE (OPCIONAL)

Depois que o HTTPS estiver funcionando:

1. Acesse: https://dash.cloudflare.com
2. Vá em **DNS**
3. Clique na nuvem **cinza** para ficar **laranja** (proxy ativado)
4. Vá em **SSL/TLS** → **Overview**
5. Modo: **Full** (ou **Full (strict)** se tiver certificado válido)
6. Aguarde 2-3 minutos

---

## 🔍 TROUBLESHOOTING

### Erro: "Failed to obtain certificate"

```bash
# Verificar se a porta 80 está aberta
ufw allow 80/tcp
ufw allow 443/tcp

# Verificar se o domínio aponta para o IP correto
dig equipcasa.com.br

# Tentar novamente
certbot --nginx -d equipcasa.com.br -d www.equipcasa.com.br
```

### Erro: "nginx: configuration file test failed"

```bash
# Ver erro específico
nginx -t

# Verificar sintaxe do arquivo
cat /etc/nginx/sites-available/equipcasa.conf
```

### Certificado não renova automaticamente

```bash
# Adicionar cron job manualmente
crontab -e

# Adicionar linha:
0 0,12 * * * certbot renew --quiet
```

---

## 📊 VERIFICAR STATUS

```bash
# Status do Nginx
systemctl status nginx

# Certificados instalados
certbot certificates

# Testar HTTPS
curl -I https://equipcasa.com.br

# Ver logs
tail -50 /var/log/letsencrypt/letsencrypt.log
```

---

## 🎯 CHECKLIST

- [ ] Certbot instalado
- [ ] Certificado SSL obtido
- [ ] Nginx configurado para HTTPS
- [ ] Porta 443 aberta no firewall
- [ ] HTTPS funcionando: `https://equipcasa.com.br`
- [ ] HTTP redirecionando para HTTPS
- [ ] Renovação automática configurada
- [ ] (Opcional) Cloudflare reativado com SSL Full

---

## 🎉 RESULTADO FINAL

Após concluir:
- ✅ `https://equipcasa.com.br` → Site seguro 🔒
- ✅ `http://equipcasa.com.br` → Redireciona para HTTPS
- ✅ Certificado válido por 90 dias
- ✅ Renovação automática ativa
- ✅ Site profissional com HTTPS!
