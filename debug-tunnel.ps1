$ErrorActionPreference = "Stop"
Write-Output "Tentando estabelecer túnel SSH com deploy@equipcasa.com.br..."

# Inicia o SSH em background (-f não funciona bem no Windows, usamos Start-Process)
# -o BatchMode=yes falha se precisar de senha, o que é bom para detectar erro de chave
try {
    # Testar conexão primeiro
    $test = ssh -o BatchMode=yes -o StrictHostKeyChecking=no deploy@equipcasa.com.br "echo OK" 2>&1
    if ($test -notmatch "OK") {
        Write-Output "Falha no teste de conexão SSH: $test"
        exit 1
    }

    # Iniciar Túnel
    $proc = Start-Process ssh -ArgumentList "-L 3306:127.0.0.1:3306 -N -o BatchMode=yes -o StrictHostKeyChecking=no deploy@equipcasa.com.br" -PassThru -WindowStyle Minimized
    
    Write-Output "Processo SSH iniciado (PID: $($proc.Id)). Aguardando bind..."
    Start-Sleep -Seconds 5
    
    # Verificar se a porta abriu
    $tcp = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
    if ($tcp) {
        Write-Output "SUCESSO: Túnel ativo na porta 3306."
        Write-Output "IP da VPS (detectado via HostName do SSH): equipcasa.com.br (Resolução DNS será usada)"
    }
    else {
        Write-Output "ERRO: O processo SSH rodou, mas a porta 3306 não abriu. Pode estar ocupada ou a conexão caiu."
        Stop-Process -Id $proc.Id -ErrorAction SilentlyContinue
    }
}
catch {
    Write-Output "Erro ao executar script: $_"
}
