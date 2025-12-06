# Script de Preparação para Deploy na Vercel (PowerShell)
# Execute este script antes de fazer o commit

Write-Host "🔧 Preparando projeto para deploy..." -ForegroundColor Cyan

# 1. Instalar dependências
Write-Host "`n📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# 2. Verificar se o build funciona
Write-Host "`n🏗️  Testando build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build bem-sucedido!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no build. Corrija os erros antes de fazer deploy." -ForegroundColor Red
    exit 1
}

# 3. Verificar se .env existe
if (-Not (Test-Path .env)) {
    Write-Host "`n⚠️  Arquivo .env não encontrado!" -ForegroundColor Yellow
    Write-Host "Copie o .env.example e preencha com suas credenciais." -ForegroundColor Yellow
    exit 1
}

# 4. Verificar se .env está no .gitignore
$gitignoreContent = Get-Content .gitignore -Raw
if ($gitignoreContent -match "^\.env$") {
    Write-Host "✅ .env está no .gitignore" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  .env NÃO está no .gitignore! Adicionando..." -ForegroundColor Yellow
    Add-Content .gitignore "`n.env"
}

Write-Host "`n✅ Projeto pronto para deploy!" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. git add ." -ForegroundColor White
Write-Host "2. git commit -m 'feat: configuração Vercel + Neon'" -ForegroundColor White
Write-Host "3. git push origin main" -ForegroundColor White
Write-Host "4. Configure as variáveis de ambiente na Vercel" -ForegroundColor White
Write-Host "`n📖 Veja DEPLOY_VERCEL.md para instruções completas" -ForegroundColor Cyan
