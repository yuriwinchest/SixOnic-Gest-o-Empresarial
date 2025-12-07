$ErrorActionPreference = "Continue"
$Key = "C:\Users\yuriv\.ssh\deploy_auto_key"
$User = "ver8wdgr"
$IP = "161.97.124.179"

Write-Output "TESTANDO ACESSO SSH..."
$cmd = "ssh -i $Key -o StrictHostKeyChecking=no -o BatchMode=yes $User@$IP echo SUCESSO"
Invoke-Expression $cmd
