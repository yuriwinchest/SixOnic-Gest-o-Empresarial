@echo off
echo "=== TUNEL SSH AUTOMATICO ==="
echo "Host: 161.97.124.179"
echo "Usuario: ver8wdgr"
echo "Chave: deploy_auto_key"
echo "--------------------------------------------------------"

ssh -o StrictHostKeyChecking=no -i "C:\Users\yuriv\.ssh\deploy_auto_key" -L 3306:127.0.0.1:3306 ver8wdgr@161.97.124.179 -N

echo.
echo "Conexao caiu."
pause
