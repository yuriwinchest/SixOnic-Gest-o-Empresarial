#!/bin/bash

# Script de Preparação para Deploy na Vercel
# Execute este script antes de fazer o commit

echo "🔧 Preparando projeto para deploy..."

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 2. Verificar se o build funciona
echo "🏗️  Testando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build bem-sucedido!"
else
    echo "❌ Erro no build. Corrija os erros antes de fazer deploy."
    exit 1
fi

# 3. Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "Copie o .env.example e preencha com suas credenciais."
    exit 1
fi

# 4. Verificar se .env está no .gitignore
if grep -q "^\.env$" .gitignore; then
    echo "✅ .env está no .gitignore"
else
    echo "⚠️  .env NÃO está no .gitignore! Adicionando..."
    echo ".env" >> .gitignore
fi

echo ""
echo "✅ Projeto pronto para deploy!"
echo ""
echo "Próximos passos:"
echo "1. git add ."
echo "2. git commit -m 'feat: configuração Vercel + Neon'"
echo "3. git push origin main"
echo "4. Configure as variáveis de ambiente na Vercel"
echo ""
echo "📖 Veja DEPLOY_VERCEL.md para instruções completas"
