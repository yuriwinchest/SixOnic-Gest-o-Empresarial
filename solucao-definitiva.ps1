# 🔧 SOLUÇÃO DEFINITIVA - CORRIGIR MIME TYPE

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🔧 DIAGNÓSTICO E CORREÇÃO COMPLETA" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$SERVER = "server.equipcasa.com.br"
$USER = "root"

# Passo 1: Verificar arquivos na VPS
Write-Host "📊 Passo 1: Verificando arquivos na VPS..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} "ls -lh /var/www/html/frontend/assets/"

Write-Host ""
Write-Host "🔄 Passo 2: Limpando cache do Nginx e reiniciando..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} @"
# Parar Nginx
systemctl stop nginx

# Limpar cache (se existir)
rm -rf /var/cache/nginx/* 2>/dev/null || true

# Iniciar Nginx
systemctl start nginx

echo '✅ Nginx reiniciado'
"@

Write-Host ""
Write-Host "📤 Passo 3: Reenviando frontend..." -ForegroundColor Yellow

# Fazer novo build
Write-Host "   Compilando frontend..." -ForegroundColor Gray
npm run build | Out-Null

# Enviar arquivos
Write-Host "   Enviando arquivos..." -ForegroundColor Gray
scp -r -o StrictHostKeyChecking=no dist/* ${USER}@${SERVER}:/var/www/html/frontend/

Write-Host ""
Write-Host "🔧 Passo 4: Aplicando configuração correta do Nginx..." -ForegroundColor Yellow

$nginxConfig = @'
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

    # Arquivos estáticos - SERVIR DIRETAMENTE
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$ {
        root /var/www/html/frontend;
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff";
    }

    # API
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

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
'@

$tempFile = "nginx-final.conf"
$nginxConfig | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline

scp -o StrictHostKeyChecking=no $tempFile ${USER}@${SERVER}:/etc/nginx/sites-available/equipcasa.conf
Remove-Item $tempFile -Force

Write-Host ""
Write-Host "✅ Passo 5: Testando e aplicando configuração..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} @"
nginx -t && systemctl restart nginx
echo '✅ Nginx configurado e reiniciado'
"@

Write-Host ""
Write-Host "🧪 Passo 6: Testando arquivos..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} @"
echo 'Testando arquivo JS:'
curl -I https://localhost/assets/index-DLqdS0i2.js 2>&1 | grep -i 'content-type'
echo ''
echo 'Testando arquivo CSS:'
curl -I https://localhost/assets/index-DGbpfyiN.css 2>&1 | grep -i 'content-type'
"@

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ CORREÇÃO COMPLETA APLICADA!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Limpe COMPLETAMENTE o cache: Ctrl + Shift + Delete" -ForegroundColor Gray
Write-Host "   2. Feche TODAS as abas do site" -ForegroundColor Gray
Write-Host "   3. Abra modo anônimo: Ctrl + Shift + N" -ForegroundColor Gray
Write-Host "   4. Acesse: https://equipcasa.com.br" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 O site deve funcionar perfeitamente agora!" -ForegroundColor Green
Write-Host ""
