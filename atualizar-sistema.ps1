$Key = "C:\Users\yuriv\.ssh\hugo_key"
$User = "HugoGandy"
$IP = "161.97.124.179"

Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Output "🔧 ATUALIZAR SISTEMA VPS"
Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Output ""

# Verificar chave
if (-not (Test-Path $Key)) {
    Write-Error "❌ Chave SSH não encontrada: $Key"
    exit 1
}

Write-Output ">>> Testando conexão SSH..."
$testResult = ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -i $Key $User@$IP "echo 'OK'" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Output "❌ ERRO: SSH não está configurado!"
    Write-Output ""
    Write-Output "A chave SSH ainda não foi configurada no painel."
    Write-Output ""
    Write-Output "📋 FAÇA ISSO PRIMEIRO:"
    Write-Output "1. Acesse: https://server.equipcasa.com.br:8083"
    Write-Output "2. Login: HugoGandy"
    Write-Output "3. Users → Edit HugoGandy"
    Write-Output "4. Cole a chave (arquivo CHAVE_SSH_HUGO.txt)"
    Write-Output "5. SSH Access = bash"
    Write-Output "6. Salve"
    Write-Output ""
    Write-Output "Depois execute: .\testar-ssh-nova-chave.ps1"
    Write-Output ""
    exit 1
}

Write-Output "✅ Conexão SSH OK"
Write-Output ""
Write-Output ">>> Atualizando sistema..."
Write-Output "    Isso pode levar alguns minutos..."
Write-Output ""

# Executar update e upgrade
ssh -o StrictHostKeyChecking=no -i $Key $User@$IP @"
echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
echo '📦 Atualizando lista de pacotes...'
echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
sudo apt-get update

echo ''
echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
echo '⬆️  Atualizando pacotes instalados...'
echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
sudo apt-get upgrade -y

echo ''
echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
echo '🧹 Limpando pacotes desnecessários...'
echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
sudo apt-get autoremove -y
sudo apt-get autoclean

echo ''
echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
echo '✅ SISTEMA ATUALIZADO COM SUCESSO!'
echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
echo ''
echo 'Informações do sistema:'
echo '------------------------'
uname -a
echo ''
echo 'Espaço em disco:'
echo '----------------'
df -h / | tail -1
echo ''
echo 'Memória:'
echo '--------'
free -h | grep Mem
"@

if ($LASTEXITCODE -eq 0) {
    Write-Output ""
    Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Output "✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!"
    Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Output ""
    Write-Output "🎯 Próximo passo: Fazer deploy"
    Write-Output "   .\deploy-auto-hugo.ps1"
    Write-Output ""
}
else {
    Write-Output ""
    Write-Output "⚠️  Houve algum problema na atualização."
    Write-Output "    Verifique os logs acima."
    Write-Output ""
}
