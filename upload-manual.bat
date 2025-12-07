@echo off
echo "=== UPLOAD MANUAL (SENHA COMPLEXA) ==="
echo "User: ver8wdgr"
echo "Senha: Nm84993182/*-+1"
echo "---"
echo "Aparentemente a senha 'Hugo2025' foi recusada."
echo "Mas a senha longa parece ter funcionado para o painel."
echo "TENTE USAR A SENHA LONGA ABAIXO:"
echo "Nm84993182/*-+1"
echo "-------------------------------------"

sftp -o StrictHostKeyChecking=no -b sftp_frontend_commands.txt ver8wdgr@161.97.124.179

echo.
echo "Pressione qualquer tecla para ir para o BACKEND..."
pause

echo "=== UPLOAD BACKEND ==="
sftp -o StrictHostKeyChecking=no -b sftp_backend_commands.txt ver8wdgr@161.97.124.179

echo "=== FIM ==="
pause
