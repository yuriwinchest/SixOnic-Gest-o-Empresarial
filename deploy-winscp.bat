@echo off
echo === DEPLOY VIA WINSCP (AUTOMATIZADO) ===
echo.

REM Credenciais
set USER=ver8wdgr
set IP=161.97.124.179
set PASS=Hugo2025
set APP_PATH=/home/%USER%/gestao-vendas
set WEB_PATH=/home/%USER%/web/equipcasa.com.br/public_html

echo Verificando WinSCP...
if not exist "C:\Program Files (x86)\WinSCP\WinSCP.com" (
    echo ERRO: WinSCP nao encontrado!
    echo Baixe de: https://winscp.net/eng/download.php
    pause
    exit /b 1
)

echo.
echo >>> PASSO 1: Build do Frontend...
call npm run build
if errorlevel 1 (
    echo ERRO no build!
    pause
    exit /b 1
)

echo.
echo >>> PASSO 2: Criando script WinSCP...
(
echo option batch abort
echo option confirm off
echo open sftp://%USER%:%PASS%@%IP%/
echo option transfer binary
echo.
echo # Upload Frontend
echo cd %WEB_PATH%
echo lcd dist
echo put -r *
echo.
echo # Upload Backend
echo cd %APP_PATH%/backend
echo lcd ..
echo lcd server
echo put -r *
echo lcd ..
echo put package.json
echo put .env.production .env
echo.
echo # Upload SQL
echo cd %APP_PATH%
echo put tabelas_sistema.sql
echo.
echo exit
) > winscp_deploy.txt

echo.
echo >>> PASSO 3: Executando upload via WinSCP...
"C:\Program Files (x86)\WinSCP\WinSCP.com" /script=winscp_deploy.txt /log=winscp_deploy.log

if errorlevel 1 (
    echo.
    echo ERRO no upload! Verifique o log: winscp_deploy.log
    echo.
    echo Tentando com senha alternativa...
    
    REM Tenta com senha alternativa
    set PASS=Nm84993182/*-+1
    
    (
    echo option batch abort
    echo option confirm off
    echo open sftp://%USER%:%PASS%@%IP%/
    echo option transfer binary
    echo.
    echo # Upload Frontend
    echo cd %WEB_PATH%
    echo lcd dist
    echo put -r *
    echo.
    echo # Upload Backend
    echo cd %APP_PATH%/backend
    echo lcd ..
    echo lcd server
    echo put -r *
    echo lcd ..
    echo put package.json
    echo put .env.production .env
    echo.
    echo # Upload SQL
    echo cd %APP_PATH%
    echo put tabelas_sistema.sql
    echo.
    echo exit
    ) > winscp_deploy2.txt
    
    "C:\Program Files (x86)\WinSCP\WinSCP.com" /script=winscp_deploy2.txt /log=winscp_deploy2.log
)

echo.
echo === UPLOAD CONCLUIDO ===
echo.
echo PROXIMOS PASSOS MANUAIS:
echo.
echo 1. CONFIGURAR BACKEND (via Terminal SSH do painel):
echo    Acesse: https://server.equipcasa.com.br:8083
echo    Terminal SSH e execute:
echo.
echo    cd %APP_PATH%/backend
echo    npm install --production
echo    pm2 delete all
echo    pm2 start index.js --name gestao-vendas
echo    pm2 save
echo    pm2 status
echo.
echo 2. IMPORTAR BANCO DE DADOS:
echo    - No painel, acesse phpMyAdmin
echo    - Importe: %APP_PATH%/tabelas_sistema.sql
echo.
echo 3. TESTAR:
echo    - Site: https://equipcasa.com.br
echo    - API: https://equipcasa.com.br/api/health
echo.
pause
