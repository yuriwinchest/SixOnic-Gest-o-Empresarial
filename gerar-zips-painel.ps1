$ErrorActionPreference = "Stop"
Write-Output "📦 PREPARANDO ARQUIVOS PARA UPLOAD VIA PAINEL..."

# 1. FRONTEND
if (Test-Path "dist") {
    Write-Output "🔹 Compactando Frontend (Site)..."
    Compress-Archive -Path "dist\*" -DestinationPath "frontend_site.zip" -Force
}
else {
    Write-Output "⚠️ Pasta dist não encontrada! Rode npm run build primeiro."
}

# 2. BACKEND
Write-Output "🔹 Preparando Backend..."
if (Test-Path "temp_back") { Remove-Item "temp_back" -Recurse -Force }
New-Item -ItemType Directory -Path "temp_back" | Out-Null
New-Item -ItemType Directory -Path "temp_back\dist" | Out-Null

# Copia estrutura que o servidor espera
Copy-Item "server\*" -Destination "temp_back\dist\" -Recurse # Servidor espera server.js em dist/, vamos ajustar
Copy-Item "package.json" -Destination "temp_back\"
Copy-Item ".env" -Destination "temp_back\"

# Renomeia index.js para server.js para compatibilidade com deploy antigo se necessário
# Mas se o package.json roda "node server/index.js", mantemos a estrutura server/
# Vamos manter simples: Copia a pasta server inteira para dentro.

if (Test-Path "temp_back_final") { Remove-Item "temp_back_final" -Recurse -Force }
New-Item -ItemType Directory -Path "temp_back_final" | Out-Null

# Copiar arquivos essenciais
Copy-Item "server" -Destination "temp_back_final\" -Recurse
Copy-Item "package.json" -Destination "temp_back_final\"
Copy-Item ".env" -Destination "temp_back_final\"

Write-Output "🔹 Compactando Backend (API)..."
Compress-Archive -Path "temp_back_final\*" -DestinationPath "backend_api.zip" -Force

# Limpeza
Remove-Item "temp_back" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "temp_back_final" -Recurse -Force -ErrorAction SilentlyContinue

Write-Output "✅ CONCLUÍDO!"
Write-Output "Arquivos gerados na Área de Trabalho:"
Write-Output "1. frontend_site.zip (Upload em public_html)"
Write-Output "2. backend_api.zip (Upload na pasta do backend)"
