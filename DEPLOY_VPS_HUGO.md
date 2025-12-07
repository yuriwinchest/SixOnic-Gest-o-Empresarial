# GUIA DE DEPLOY - VPS EQUIPCASA.COM.BR

## Credenciais de Acesso

- **IP:** 161.97.124.179
- **Usuário:** ver8wdgr
- **Senha Principal:** Hugo2025
- **Senha Alternativa:** Nm84993182/*-+1
- **Painel Admin:** https://server.equipcasa.com.br:8083
- **Painel Backup:** https://161.97.124.179:8083

## Caminhos no Servidor

- **Frontend:** `/home/ver8wdgr/web/equipcasa.com.br/public_html`
- **Backend:** `/home/ver8wdgr/gestao-vendas/backend`
- **SQL:** `/home/ver8wdgr/gestao-vendas/tabelas_sistema.sql`

---

## OPÇÃO 1: Deploy Automatizado via WinSCP (RECOMENDADO)

### Pré-requisito
Instale o WinSCP: https://winscp.net/eng/download.php

### Executar
```powershell
.\deploy-winscp.bat
```

**O que faz:**
1. Build do frontend automaticamente
2. Upload de todos os arquivos via SFTP
3. Tenta ambas as senhas automaticamente
4. Fornece instruções para configuração do backend

---

## OPÇÃO 2: Deploy Manual Guiado

### Executar
```powershell
.\deploy-manual-guiado.ps1
```

**O que faz:**
1. Build do frontend
2. Fornece instruções detalhadas passo a passo
3. Abre o WinSCP automaticamente (se instalado)
4. Lista todos os arquivos e caminhos para upload manual

---

## OPÇÃO 3: Deploy via Painel de Controle (100% Manual)

### Passo 1: Build Local
```powershell
npm run build
```

### Passo 2: Acessar Painel
1. Acesse: https://server.equipcasa.com.br:8083
2. Login: ver8wdgr
3. Senha: Hugo2025 (ou Nm84993182/*-+1)

### Passo 3: Upload via File Manager

**Frontend:**
- Local: `dist/*`
- Remoto: `/home/ver8wdgr/web/equipcasa.com.br/public_html/`

**Backend:**
- Local: `server/*`
- Remoto: `/home/ver8wdgr/gestao-vendas/backend/`

- Local: `package.json`
- Remoto: `/home/ver8wdgr/gestao-vendas/backend/package.json`

- Local: `.env.production`
- Remoto: `/home/ver8wdgr/gestao-vendas/backend/.env`

**SQL:**
- Local: `tabelas_sistema.sql`
- Remoto: `/home/ver8wdgr/gestao-vendas/tabelas_sistema.sql`

---

## Configuração Pós-Deploy (OBRIGATÓRIO)

### 1. Configurar Backend

Acesse o Terminal SSH no painel e execute:

```bash
cd /home/ver8wdgr/gestao-vendas/backend
npm install --production
pm2 delete all
pm2 start index.js --name gestao-vendas
pm2 save
pm2 startup
pm2 status
```

### 2. Importar Banco de Dados

1. No painel, acesse **phpMyAdmin**
2. Selecione o banco de dados
3. Clique em **Importar**
4. Selecione o arquivo: `/home/ver8wdgr/gestao-vendas/tabelas_sistema.sql`
5. Clique em **Executar**

### 3. Verificar Nginx

Certifique-se que o Nginx está configurado para:
- **Frontend:** Servir arquivos de `/home/ver8wdgr/web/equipcasa.com.br/public_html`
- **Backend:** Proxy reverso para `http://localhost:3000`

Configuração típica do Nginx:
```nginx
server {
    listen 80;
    server_name equipcasa.com.br www.equipcasa.com.br;
    
    # Frontend
    root /home/ver8wdgr/web/equipcasa.com.br/public_html;
    index index.html;
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # SPA Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Testar

- **Site:** https://equipcasa.com.br
- **API Health:** https://equipcasa.com.br/api/health
- **Logs Backend:** `pm2 logs gestao-vendas`

---

## Troubleshooting

### Erro: "Permission denied"
- Verifique se está usando a senha correta (Hugo2025 ou Nm84993182/*-+1)
- Certifique-se que o usuário tem permissões nos diretórios

### Backend não inicia
```bash
cd /home/ver8wdgr/gestao-vendas/backend
pm2 logs gestao-vendas
```

### Site não carrega
1. Verifique se o Nginx está rodando: `systemctl status nginx`
2. Verifique os logs: `tail -f /var/log/nginx/error.log`

### Banco de dados não conecta
1. Verifique as credenciais no arquivo `.env`
2. Certifique-se que o MySQL está rodando
3. Verifique se o banco foi importado corretamente

---

## Comandos Úteis

### Ver status dos serviços
```bash
pm2 status
systemctl status nginx
systemctl status mysql
```

### Reiniciar serviços
```bash
pm2 restart gestao-vendas
sudo systemctl restart nginx
```

### Ver logs
```bash
pm2 logs gestao-vendas
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Contato

- Email: hugogandy45@gmail.com
- Painel: https://server.equipcasa.com.br:8083
