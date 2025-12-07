# DEPLOY MANUAL - INSTRUÇÕES PASSO A PASSO
# Execute cada comando quando solicitado

$User = "ver8wdgr"
$IP = "161.97.124.179"
$Password1 = "Nm84993182/*-+1"
$Password2 = "Hugo2025"

Write-Output "=== DEPLOY MANUAL GUIADO ==="
Write-Output ""
Write-Output "Credenciais:"
Write-Output "  Usuário: $User"
Write-Output "  IP: $IP"
Write-Output "  Senha 1: $Password1"
Write-Output "  Senha 2: $Password2"
Write-Output ""

# 1. BUILD
Write-Output ">>> PASSO 1: Build do Frontend..."
Write-Output "Executando: npm run build"
npm run build

if (-not $?) {
    Write-Error "Erro no build!"
    exit 1
}

Write-Output ""
Write-Output "✅ Build concluído!"
Write-Output ""
Write-Output "=== PRÓXIMOS PASSOS MANUAIS ==="
Write-Output ""
Write-Output "Agora você precisa fazer o upload manualmente usando um cliente SFTP."
Write-Output "Recomendações: WinSCP, FileZilla ou Cyberduck"
Write-Output ""
Write-Output "OPÇÃO 1 - WinSCP (Recomendado para Windows):"
Write-Output "  1. Baixe: https://winscp.net/eng/download.php"
Write-Output "  2. Conecte com:"
Write-Output "     - Protocolo: SFTP"
Write-Output "     - Host: $IP"
Write-Output "     - Porta: 22"
Write-Output "     - Usuário: $User"
Write-Output "     - Senha: $Password1 (ou $Password2)"
Write-Output ""
Write-Output "  3. UPLOAD FRONTEND:"
Write-Output "     Local: $(Get-Location)\dist\*"
Write-Output "     Remoto: /home/$User/web/equipcasa.com.br/public_html/"
Write-Output ""
Write-Output "  4. UPLOAD BACKEND:"
Write-Output "     Local: $(Get-Location)\server\*"
Write-Output "     Remoto: /home/$User/gestao-vendas/backend/"
Write-Output ""
Write-Output "     Local: $(Get-Location)\package.json"
Write-Output "     Remoto: /home/$User/gestao-vendas/backend/package.json"
Write-Output ""
Write-Output "     Local: $(Get-Location)\.env.production"
Write-Output "     Remoto: /home/$User/gestao-vendas/backend/.env"
Write-Output ""
Write-Output "  5. UPLOAD SQL:"
Write-Output "     Local: $(Get-Location)\tabelas_sistema.sql"
Write-Output "     Remoto: /home/$User/gestao-vendas/tabelas_sistema.sql"
Write-Output ""
Write-Output "OPÇÃO 2 - Via Painel de Controle:"
Write-Output "  1. Acesse: https://server.equipcasa.com.br:8083"
Write-Output "  2. Login: $User / $Password1 (ou $Password2)"
Write-Output "  3. Use o File Manager para fazer upload dos arquivos"
Write-Output ""
Write-Output "=== APÓS O UPLOAD ==="
Write-Output ""
Write-Output "1. CONFIGURAR BACKEND (via Terminal SSH do painel):"
Write-Output "   cd /home/$User/gestao-vendas/backend"
Write-Output "   npm install --production"
Write-Output "   pm2 delete all"
Write-Output "   pm2 start index.js --name gestao-vendas"
Write-Output "   pm2 save"
Write-Output "   pm2 status"
Write-Output ""
Write-Output "2. IMPORTAR BANCO DE DADOS:"
Write-Output "   - No painel, acesse phpMyAdmin"
Write-Output "   - Importe: /home/$User/gestao-vendas/tabelas_sistema.sql"
Write-Output ""
Write-Output "3. TESTAR:"
Write-Output "   - Site: https://equipcasa.com.br"
Write-Output "   - API: https://equipcasa.com.br/api/health"
Write-Output ""

# Pausar para o usuário ler
Write-Output ""
Write-Output "Pressione qualquer tecla para abrir o WinSCP (se instalado)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Tentar abrir WinSCP se estiver instalado
$winscpPath = "C:\Program Files (x86)\WinSCP\WinSCP.exe"
if (Test-Path $winscpPath) {
    $session = "sftp://${User}@${IP}"
    Start-Process $winscpPath -ArgumentList $session
}
else {
    Write-Output "WinSCP não encontrado. Instale de: https://winscp.net/eng/download.php"
    Start-Process "https://winscp.net/eng/download.php"
}
