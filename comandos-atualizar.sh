#!/bin/bash
# COMANDOS PARA ATUALIZAR O SISTEMA VPS
# Copie e cole no Terminal SSH do painel

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 ATUALIZANDO SISTEMA VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo ">>> [1/4] Atualizando lista de pacotes..."
sudo apt-get update

echo ""
echo ">>> [2/4] Atualizando pacotes instalados..."
sudo apt-get upgrade -y

echo ""
echo ">>> [3/4] Removendo pacotes desnecessários..."
sudo apt-get autoremove -y

echo ""
echo ">>> [4/4] Limpando cache..."
sudo apt-get autoclean

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SISTEMA ATUALIZADO COM SUCESSO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📊 Informações do Sistema:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Versão do Sistema:"
lsb_release -a 2>/dev/null || cat /etc/os-release | grep PRETTY_NAME
echo ""
echo "Espaço em Disco:"
df -h / | tail -1
echo ""
echo "Memória:"
free -h | grep Mem
echo ""
echo "Uptime:"
uptime
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
