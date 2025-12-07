# Script para corrigir configuração Nginx
Write-Host "🔧 Corrigindo configuração do Nginx..." -ForegroundColor Cyan

$SERVER = "server.equipcasa.com.br"
$USER = "root"

# Criar arquivo de configuração localmente
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

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$ {
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
'@

# Salvar configuração em arquivo temporário
$tempFile = "nginx-temp.conf"
$nginxConfig | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline

Write-Host "📤 Enviando configuração para VPS..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=no $tempFile ${USER}@${SERVER}:/etc/nginx/sites-available/equipcasa.conf

Write-Host "🔄 Testando e recarregando Nginx..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} "nginx -t && systemctl reload nginx"

# Limpar arquivo temporário
Remove-Item $tempFile -Force

Write-Host ""
Write-Host "✅ Nginx corrigido com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Limpe o cache do navegador (Ctrl + Shift + Delete)" -ForegroundColor Gray
Write-Host "   2. Force reload (Ctrl + F5)" -ForegroundColor Gray
Write-Host "   3. Acesse: https://equipcasa.com.br" -ForegroundColor Cyan
Write-Host ""
