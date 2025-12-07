$ErrorActionPreference = "Stop"
$User = "HugoGandy"
$IP = "161.97.124.179"
$Key = "C:\Users\yuriv\.ssh\deploy_auto_key"

Write-Output "=== DEPLOY CORRETO (HugoGandy) VIA SFTP ==="
Write-Output "Frontend: /home/HugoGandy/web/equipcasa.com.br/public_html"
Write-Output "Backend:  /home/HugoGandy/gestao-vendas/backend"

# 1. FRONTEND
Write-Output "--> Enviando Frontend..."
sftp -o StrictHostKeyChecking=no -i $Key -b sftp_frontend_hugo.txt $User@$IP

# 2. BACKEND
Write-Output "--> Enviando Backend..."
sftp -o StrictHostKeyChecking=no -i $Key -b sftp_backend_hugo.txt $User@$IP

Write-Output "=== UPLOAD CONCLUIDO ==="
Write-Output "⚠️  IMPORTANTE: Se o Shell estiver bloqueado (nologin), nao consigo reiniciar o Node.js."
Write-Output "⚠️  Voce precisara reiniciar pelo Painel ou eu posso tentar via SSH se voce habilitou 'bash'."

# Tenta reiniciar se possível
try {
    ssh -o StrictHostKeyChecking=no -i $Key $User@$IP "cd /home/$User/gestao-vendas/backend && npm install --production && pm2 restart all" 2>$null
    if ($?) { Write-Output "✅ Serviço Reiniciado com Sucesso via SSH!" }
}
catch {
    Write-Output "ℹ️ Não foi possível reiniciar via comando (Shell bloqueado). Reinicie pelo Painel."
}
