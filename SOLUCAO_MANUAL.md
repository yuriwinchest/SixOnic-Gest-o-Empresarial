# 🎯 SOLUÇÃO FINAL SIMPLES

## Execute estes comandos UM POR VEZ:

### 1. Conecte na VPS:
```bash
ssh root@server.equipcasa.com.br
```

### 2. Pare o Nginx:
```bash
systemctl stop nginx
```

### 3. Limpe cache:
```bash
rm -rf /var/cache/nginx/*
```

### 4. Crie a configuração correta:
```bash
cat > /etc/nginx/sites-available/equipcasa.conf << 'ENDOFFILE'
server {
    listen 80;
    server_name equipcasa.com.br www.equipcasa.com.br 161.97.124.179;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen 8080;
    server_name equipcasa.com.br www.equipcasa.com.br 161.97.124.179;

    ssl_certificate /etc/letsencrypt/live/equipcasa.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/equipcasa.com.br/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /var/www/html/frontend;
    index index.html;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$ {
        root /var/www/html/frontend;
        add_header Content-Type "";
        types {
            application/javascript js;
            text/css css;
            image/png png;
            image/jpeg jpg jpeg;
            image/gif gif;
            image/svg+xml svg;
            font/woff woff;
            font/woff2 woff2;
        }
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
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

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
ENDOFFILE
```

### 5. Teste a configuração:
```bash
nginx -t
```

### 6. Inicie o Nginx:
```bash
systemctl start nginx
```

### 7. Verifique o status:
```bash
systemctl status nginx
```

### 8. Teste o arquivo JS:
```bash
curl -I https://localhost/assets/index-DLqdS0i2.js
```

Deve mostrar: `Content-Type: application/javascript`

---

## 🌐 DEPOIS DE EXECUTAR:

1. **Feche TODAS as abas** do site
2. **Limpe o cache**: `Ctrl + Shift + Delete`
3. **Abra modo anônimo**: `Ctrl + Shift + N`
4. **Acesse**: `https://equipcasa.com.br`

---

## ✅ CHECKLIST:

- [ ] Conectei na VPS
- [ ] Parei o Nginx
- [ ] Limpei o cache
- [ ] Criei a configuração
- [ ] Testei com `nginx -t` (sem erros)
- [ ] Iniciei o Nginx
- [ ] Testei o arquivo JS (Content-Type correto)
- [ ] Limpei cache do navegador
- [ ] Testei no modo anônimo

---

## 🆘 SE NÃO FUNCIONAR:

Execute este diagnóstico:

```bash
# Ver configuração ativa
cat /etc/nginx/sites-enabled/equipcasa.conf

# Ver tipo MIME do arquivo
file /var/www/html/frontend/assets/index-DLqdS0i2.js

# Testar diretamente
curl -I https://equipcasa.com.br/assets/index-DLqdS0i2.js
```

Me envie o resultado!
