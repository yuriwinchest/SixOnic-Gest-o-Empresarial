# 🚨 SOLUÇÃO RÁPIDA - ERRO 521 CLOUDFLARE

## ❌ Problema:
Cloudflare não consegue conectar ao servidor (erro 521)

## ✅ Causa:
Cloudflare tenta conectar na porta 80, mas o Nginx não está configurado corretamente

---

## 🔧 SOLUÇÃO RÁPIDA (VIA PAINEL HESTIA)

### 1. Acesse o Terminal Web
1. Abra: **https://server.equipcasa.com.br:8083**
2. Login: `admin` ou `root`
3. Vá em **Server** → **Terminal** (ou use SSH)

### 2. Execute estes comandos (COPIE E COLE):

```bash
# Criar configuração correta
cat > /etc/nginx/sites-available/equipcasa.conf << 'EOF'
server {
    listen 80 default_server;
    listen 8080;
    server_name equipcasa.com.br www.equipcasa.com.br 161.97.124.179 _;

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
EOF

# Remover site padrão
rm -f /etc/nginx/sites-enabled/default

# Ativar site
ln -sf /etc/nginx/sites-available/equipcasa.conf /etc/nginx/sites-enabled/

# Liberar portas no firewall
ufw allow 80/tcp
ufw allow 8080/tcp

# Testar configuração
nginx -t

# Recarregar Nginx
systemctl reload nginx

# Verificar
curl -I http://localhost
curl -I http://localhost:8080

echo "✅ Configuração aplicada!"
```

---

## 🌐 CONFIGURAR CLOUDFLARE

### Opção A: Desativar Proxy (Temporário)
1. Acesse: **https://dash.cloudflare.com**
2. Selecione o domínio `equipcasa.com.br`
3. Vá em **DNS**
4. Encontre o registro A para `equipcasa.com.br`
5. Clique na **nuvem laranja** para ficar **cinza** (DNS only)
6. Aguarde 2-3 minutos
7. Teste: `http://equipcasa.com.br`

### Opção B: Configurar SSL/TLS
1. Acesse: **https://dash.cloudflare.com**
2. Selecione o domínio `equipcasa.com.br`
3. Vá em **SSL/TLS**
4. Modo: **Flexible** (ou **Full** se tiver SSL no servidor)
5. Aguarde 2-3 minutos

---

## ✅ VERIFICAR SE FUNCIONOU

### Teste 1: Direto no IP (porta 80)
```bash
curl http://161.97.124.179
```
Deve mostrar o HTML do site (não "Welcome to nginx!")

### Teste 2: Direto no IP (porta 8080)
```bash
curl http://161.97.124.179:8080
```

### Teste 3: API
```bash
curl http://161.97.124.179/api/health
```
Deve retornar JSON

### Teste 4: Domínio
Abra no navegador:
- `http://equipcasa.com.br`
- `http://equipcasa.com.br:8080`

---

## 🔍 DIAGNÓSTICO

Se ainda não funcionar, execute:

```bash
# Ver status do Nginx
systemctl status nginx

# Ver configuração ativa
nginx -T | grep -A 20 "server {"

# Ver portas abertas
netstat -tulpn | grep nginx

# Ver logs de erro
tail -50 /var/log/nginx/error.log

# Testar localmente
curl -v http://localhost
curl -v http://localhost:8080
```

---

## 📞 CHECKLIST

- [ ] Executei os comandos no terminal da VPS
- [ ] Nginx não deu erro ao testar (`nginx -t`)
- [ ] Nginx foi recarregado (`systemctl reload nginx`)
- [ ] Portas 80 e 8080 liberadas no firewall
- [ ] `curl http://localhost` retorna HTML do site
- [ ] Configurei Cloudflare (desativei proxy ou ajustei SSL)
- [ ] Aguardei 2-3 minutos
- [ ] Testei `http://equipcasa.com.br` no navegador

---

## 🎯 RESULTADO ESPERADO

Após executar os comandos:
- ✅ `http://161.97.124.179` → Mostra o site
- ✅ `http://161.97.124.179:8080` → Mostra o site
- ✅ `http://equipcasa.com.br` → Mostra o site (após configurar Cloudflare)
- ✅ `http://equipcasa.com.br/api/health` → Retorna JSON

---

## 🆘 SE AINDA NÃO FUNCIONAR

Me envie o resultado destes comandos:

```bash
nginx -t
systemctl status nginx --no-pager
ls -la /etc/nginx/sites-enabled/
cat /etc/nginx/sites-enabled/equipcasa.conf
netstat -tulpn | grep -E ':(80|8080|3001)'
curl -I http://localhost
pm2 status
```
