$ErrorActionPreference = "Continue"
$Key = "C:\Users\yuriv\.ssh\deploy_auto_key"
$User = "ver8wdgr"
$IP = "161.97.124.179"

Write-Output "🔍 TESTANDO ACESSO SSH AUTOMÁTICO..."

# Executa SSH e captura saída
$cmd = "ssh -i $Key -o StrictHostKeyChecking=no -o BatchMode=yes $User@$IP echo CONEXAO_ESTABELECIDA"
Invoke-Expression $cmd | Tee-Object -Variable result

if ($result -match "CONEXAO_ESTABELECIDA") {
    Write-Output "✅ SUCESSO! Conexão SSH funcionando sem senha."
}
else {
    Write-Output "❌ FALHA NA CONEXÃO. Veja a saída acima."
    Write-Output "Possíveis causas: Chave incorreta no painel ou SSH Shell não habilitado (bash)."
}
