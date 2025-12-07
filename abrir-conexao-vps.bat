@echo off
echo "=== TÚNEL SSH DE BANCO DE DADOS ==="
echo "Host: 161.97.124.179"
echo "User: ver8wdgr"
echo "Senha: Nm84993182/*-+1"
echo "--------------------------------------------------------"
echo "Obs: Se autenticar mas fechar logo em seguida com mensagem"
echo "'This service allows sftp connections only', siginifica que"
echo "o servidor BLOQUEIA tuneis. Nesse caso, use o phpMyAdmin."
echo "--------------------------------------------------------"

ssh -o StrictHostKeyChecking=no -L 3306:127.0.0.1:3306 ver8wdgr@161.97.124.179 -N

echo.
echo "Conexão fechada."
pause
