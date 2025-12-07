#!/bin/bash
# COMANDOS PARA HABILITAR SSH NO HUGOGANDY
# Copie e cole no Terminal SSH do painel

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 CORRIGINDO SSH PARA HUGOGANDY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Fazer backup
echo ">>> Fazendo backup do sshd_config..."
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup criado"
echo ""

# 2. Remover HugoGandy da restrição SFTP
echo ">>> Removendo HugoGandy da restrição SFTP..."
sudo sed -i 's/Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy/Match User sftp_dummy99,HugoGandy_equipcas/g' /etc/ssh/sshd_config
echo "✅ Configuração atualizada"
echo ""

# 3. Testar configuração
echo ">>> Testando configuração SSH..."
sudo sshd -t
if [ $? -eq 0 ]; then
    echo "✅ Configuração válida"
else
    echo "❌ Erro na configuração! Restaurando backup..."
    sudo cp /etc/ssh/sshd_config.backup.* /etc/ssh/sshd_config
    exit 1
fi
echo ""

# 4. Reiniciar SSH
echo ">>> Reiniciando serviço SSH..."
sudo systemctl restart sshd
echo "✅ SSH reiniciado"
echo ""

# 5. Verificar status
echo ">>> Verificando status do SSH..."
sudo systemctl status sshd | head -5
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CORREÇÃO CONCLUÍDA!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Próximo passo:"
echo "   No seu computador, execute:"
echo "   .\\testar-ssh-nova-chave.ps1"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
