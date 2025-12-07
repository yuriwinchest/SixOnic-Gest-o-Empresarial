$Key = "C:\Users\yuriv\.ssh\deploy_auto_key"
$User = "HugoGandy"
$IP = "161.97.124.179"

Write-Output "=== TESTANDO CONEXÃO SSH ==="
Write-Output "Usuário: $User"
Write-Output "IP: $IP"
Write-Output "Chave: $Key"
Write-Output ""

if (-not (Test-Path $Key)) {
    Write-Error "❌ Chave SSH não encontrada: $Key"
    exit 1
}

Write-Output ">>> Testando conexão SSH..."
Write-Output ""

try {
    $result = ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -i $Key $User@$IP "echo 'SSH_OK' && whoami && pwd"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Output "✅ CONEXÃO SSH FUNCIONANDO!"
        Write-Output ""
        Write-Output "Resultado:"
        Write-Output $result
        Write-Output ""
        Write-Output "🎉 Tudo certo! Você pode executar o deploy agora:"
        Write-Output "   .\deploy-completo-hugo.ps1"
    }
    else {
        Write-Output "❌ CONEXÃO SSH FALHOU!"
        Write-Output ""
        Write-Output "Código de saída: $LASTEXITCODE"
        Write-Output ""
        Write-Output "📋 O QUE FAZER:"
        Write-Output "1. Acesse: https://server.equipcasa.com.br:8083"
        Write-Output "2. Vá em Users → Edit HugoGandy"
        Write-Output "3. Configure:"
        Write-Output "   - SSH Access: bash"
        Write-Output "   - SSH Keys: (cole a chave do arquivo CHAVE_SSH_PARA_COPIAR.txt)"
        Write-Output "4. Salve e teste novamente"
    }
}
catch {
    Write-Output "❌ ERRO NA CONEXÃO SSH!"
    Write-Output ""
    Write-Output "Erro: $_"
    Write-Output ""
    Write-Output "📋 POSSÍVEIS CAUSAS:"
    Write-Output "1. SSH não está habilitado para o usuário HugoGandy"
    Write-Output "2. A chave SSH não foi adicionada ao usuário"
    Write-Output "3. O SSH Access está como 'nologin' ao invés de 'bash'"
    Write-Output ""
    Write-Output "📖 Siga as instruções em: CONFIGURAR_SSH_HUGO.md"
}

Write-Output ""
