# 🔧 CORREÇÃO URGENTE - ERRO MIME TYPE

## ❌ PROBLEMA IDENTIFICADO

**Erro:** "tipo MIME não permitido ("text/html")"

**Causa:** O Nginx está retornando HTML para arquivos `.js` e `.css` porque a configuração está fazendo fallback para `index.html` em todas as requisições, incluindo arquivos estáticos.

---

## ✅ SOLUÇÃO (EXECUTE AGORA)

### Conecte na VPS:
```bash
ssh root@server.equipcasa.com.br
```

### Cole este comando completo:
```bash
cat > /etc/nginx/sites-available/equipcasa.conf << 'EOF'
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

    # Servir arquivos estáticos diretamente (JS, CSS, imagens, etc)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
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

    # SPA fallback - APENAS para rotas que não são arquivos
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF

# Testar configuração
nginx -t

# Recarregar Nginx
systemctl reload nginx

echo "✅ Nginx recarregado!"
```

---

## 🧪 TESTAR

Após executar os comandos acima:

1. **Limpe o cache do navegador**: `Ctrl + Shift + Delete`
2. **Force reload**: `Ctrl + F5`
3. **Acesse**: `https://equipcasa.com.br`

O site deve carregar normalmente agora!

---

## 📊 O QUE FOI CORRIGIDO

### Antes (ERRADO):
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
Isso fazia o Nginx retornar `index.html` para TODOS os arquivos, incluindo `.js` e `.css`

### Depois (CORRETO):
```nginx
# 1. Primeiro: Servir arquivos estáticos
location ~* \.(js|css|png|jpg|...)$ {
    try_files $uri =404;
}

# 2. Depois: SPA fallback para rotas
location / {
    try_files $uri $uri/ /index.html;
}
```
Agora o Nginx serve arquivos estáticos corretamente ANTES de fazer fallback para `index.html`

---

## ✅ VERIFICAR SE FUNCIONOU

```bash
# Testar se o JS está sendo servido corretamente
curl -I https://equipcasa.com.br/assets/index-DLqdS0i2.js

# Deve retornar:
# Content-Type: application/javascript
# (NÃO text/html)
```

---

## 🎯 CHECKLIST

- [ ] Conectei na VPS via SSH
- [ ] Executei o comando para criar a configuração
- [ ] Executei `nginx -t` (sem erros)
- [ ] Executei `systemctl reload nginx`
- [ ] Limpei cache do navegador
- [ ] Forcei reload (`Ctrl + F5`)
- [ ] Site carregou corretamente

---

## 🆘 SE DER ERRO NO NGINX -T

Se o `nginx -t` der erro, execute:

```bash
# Ver o erro específico
nginx -t

# Ver configuração atual
cat /etc/nginx/sites-available/equipcasa.conf

# Restaurar configuração anterior se necessário
# (Mas a nova configuração está correta)
```

---

## 📞 RESULTADO ESPERADO

Após aplicar a correção:
- ✅ Arquivos `.js` servidos com `Content-Type: application/javascript`
- ✅ Arquivos `.css` servidos com `Content-Type: text/css`
- ✅ Site carrega normalmente
- ✅ Sem erros de MIME type no console
