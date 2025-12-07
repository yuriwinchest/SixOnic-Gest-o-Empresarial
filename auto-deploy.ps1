$ErrorActionPreference = "Stop"
$User = "ver8wdgr"
$IP = "161.97.124.179"
$Key = "C:\Users\yuriv\.ssh\deploy_auto_key"
$RemotePath = "/home/$User/gestao-vendas/backend"

Write-Output "=== DEPLOY VIA SCP (SSH) ==="

# 1. FRONTEND
Write-Output "--> Enviando Frontend (SCP)..."
# scp recursivo
scp -o StrictHostKeyChecking=no -i $Key -r dist/* $User@$IP`:/home/$User/web/equipcasa.com.br/public_html/

# 2. BACKEND
Write-Output "--> Enviando Backend (SCP)..."
# Criar estrutura remota
ssh -o StrictHostKeyChecking=no -i $Key $User@$IP "mkdir -p $RemotePath/dist"

# Enviar arquivos
scp -o StrictHostKeyChecking=no -i $Key package.json $User@$IP`:$RemotePath/
scp -o StrictHostKeyChecking=no -i $Key .env $User@$IP`:$RemotePath/
scp -o StrictHostKeyChecking=no -i $Key server/index.js $User@$IP`:$RemotePath/dist/server.js
scp -o StrictHostKeyChecking=no -i $Key server/db.js $User@$IP`:$RemotePath/dist/
scp -o StrictHostKeyChecking=no -i $Key server/sql.js $User@$IP`:$RemotePath/dist/

Write-Output "--> Instalando Dependencias e Reiniciando..."
ssh -o StrictHostKeyChecking=no -i $Key $User@$IP "cd $RemotePath && npm install --production && pm2 restart all || (pm2 start dist/server.js --name gestao-vendas || node dist/server.js &)"

Write-Output "=== DEPLOY CONCLUIDO ==="
