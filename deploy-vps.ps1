$ErrorActionPreference = "Stop"
$User = "HugoGandy"
$IP = "161.97.124.179"
$Key = "C:\Users\yuriv\.ssh\id_ed25519"

Write-Output "🚀 INICIANDO DEPLOY PARA VPS ($IP)..."
Write-Output "🔑 Usando chave: $Key"

# 1. SETUP REMOTO (Criar pastas)
Write-Output "📁 Criando diretórios remotos..."
ssh -o StrictHostKeyChecking=no -i $Key $User@$IP "mkdir -p /home/$User/web/equipcasa.com.br/public_html && mkdir -p /home/$User/gestao-vendas/backend/dist"

# 2. FRONTEND (Upload)
Write-Output "📤 Enviando FRONTEND (dist)..."
scp -o StrictHostKeyChecking=no -i $Key -r dist/* $User@$IP`:/home/$User/web/equipcasa.com.br/public_html/

# 3. BACKEND (Upload)
Write-Output "📤 Enviando BACKEND..."
# Envia package.json para a raiz do backend
scp -o StrictHostKeyChecking=no -i $Key package.json $User@$IP`:/home/$User/gestao-vendas/backend/
# Envia arquivos do server para a pasta dist remota (para bater com o caminho do service)
scp -o StrictHostKeyChecking=no -i $Key server/* $User@$IP`:/home/$User/gestao-vendas/backend/dist/
# Renomeia index.js para server.js se necessário (para bater com o service)
ssh -o StrictHostKeyChecking=no -i $Key $User@$IP "mv /home/$User/gestao-vendas/backend/dist/index.js /home/$User/gestao-vendas/backend/dist/server.js 2>/dev/null || true"

# 4. INSTALAÇÃO E RESTART
Write-Output "📦 Instalando dependências e Reiniciando Serviço..."
ssh -o StrictHostKeyChecking=no -i $Key $User@$IP "cd /home/$User/gestao-vendas/backend && npm install --production && sudo systemctl restart gestao-vendas || echo '⚠️ AVISO: Não foi possível reiniciar o serviço automaticamente (falta de sudo?). Reinicie manualmente.'"

Write-Output "✅ DEPLOY CONCLUÍDO!"
