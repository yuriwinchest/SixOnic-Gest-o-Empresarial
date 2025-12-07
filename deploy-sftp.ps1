$ErrorActionPreference = "Stop"
$User = "ver8wdgr"
$IP = "161.97.124.179"
# $Key = "..." # Vamos usar senha interativa já que não temos chave configurada pra esse user

Write-Output "🚀 INICIANDO DEPLOY COM ADMIN ($User)..."
Write-Output "⚠️  PREPARE-SE PARA DIGITAR A SENHA: Nm84993182/*-+1"

# 1. FRONTEND
Write-Output "📤 Enviando FRONTEND..."
sftp -o StrictHostKeyChecking=no -b sftp_frontend_commands.txt $User@$IP

# 2. BACKEND
Write-Output "📤 Enviando BACKEND..."
sftp -o StrictHostKeyChecking=no -b sftp_backend_commands.txt $User@$IP

Write-Output "✅ UPLOAD CONCLUÍDO!"
Write-Output "⏳ Tentando reiniciar serviço..."
# Tenta comando SSH direto (vai pedir senha de novo)
ssh -o StrictHostKeyChecking=no $User@$IP "cd /home/$User/gestao-vendas/backend && npm install --production && pm2 restart all || echo 'Falha no restart auto'"
