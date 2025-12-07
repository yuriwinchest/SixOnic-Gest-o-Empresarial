#!/bin/bash
# RESTAURAR BACKUP E CORRIGIR SSH MANUALMENTE

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  RESTAURANDO BACKUP DO SSH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Restaurar backup
echo ">>> Restaurando configuração anterior..."
sudo cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config 2>/dev/null || sudo cp /etc/ssh/sshd_config.backup.* /etc/ssh/sshd_config
echo "✅ Backup restaurado"
echo ""

# 2. Reiniciar SSH
echo ">>> Reiniciando SSH..."
sudo systemctl restart sshd
echo "✅ SSH restaurado"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ BACKUP RESTAURADO COM SUCESSO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Próximo passo:"
echo "   Vamos usar uma abordagem diferente..."
echo ""
