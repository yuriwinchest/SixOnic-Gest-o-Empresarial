$Key = "C:\Users\yuriv\.ssh\hugo_key"
$User = "HugoGandy"
$IP = "161.97.124.179"

Write-Output "=== TESTANDO NOVA CHAVE SSH ==="
Write-Output "Usuário: $User"
Write-Output "IP: $IP"
Write-Output "Chave: $Key"
Write-Output ""

if (-not (Test-Path $Key)) {
    Write-Error "❌ Chave SSH não encontrada: $Key"
    Write-Output "Execute novamente o comando para gerar a chave."
    exit 1
}

Write-Output ">>> Testando conexão SSH com nova chave..."
Write-Output ""

try {
    $result = ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -i $Key $User@$IP "echo '✅ SSH_FUNCIONANDO' && whoami && pwd && echo '' && echo 'Testando comandos:' && ls -la /home/$User/web/equipcasa.com.br/ 2>&1 | head -5"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        Write-Output "✅ CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!"
        Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        Write-Output ""
        Write-Output "Resultado do teste:"
        Write-Output $result
        Write-Output ""
        Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        Write-Output "🎉 TUDO CERTO! Agora você pode usar deploy automático:"
        Write-Output ""
        Write-Output "   .\deploy-auto-hugo.ps1"
        Write-Output ""
        Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    }
    else {
        Write-Output "❌ CONEXÃO SSH FALHOU!"
        Write-Output ""
        Write-Output "Código de saída: $LASTEXITCODE"
        Write-Output ""
        Write-Output "📋 VERIFIQUE:"
        Write-Output "1. A chave foi adicionada no painel?"
        Write-Output "2. SSH Access está como 'bash'?"
        Write-Output "3. Você salvou as configurações?"
        Write-Output ""
        Write-Output "📖 Veja as instruções em: NOVA_CHAVE_SSH_HUGO.md"
    }
}
catch {
    Write-Output "❌ ERRO NA CONEXÃO SSH!"
    Write-Output ""
    Write-Output "Erro: $_"
    Write-Output ""
    Write-Output "📋 POSSÍVEIS CAUSAS:"
    Write-Output "1. A chave ainda não foi adicionada ao painel"
    Write-Output "2. SSH Access está como 'nologin' ao invés de 'bash'"
    Write-Output "3. As configurações não foram salvas no painel"
    Write-Output ""
    Write-Output "📖 Siga as instruções em: NOVA_CHAVE_SSH_HUGO.md"
    Write-Output ""
    Write-Output "🔑 CHAVE PÚBLICA PARA COPIAR:"
    Write-Output ""
    Get-Content "$Key.pub"
    Write-Output ""
}

Write-Output ""
