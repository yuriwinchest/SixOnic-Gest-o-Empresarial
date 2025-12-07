# ✅ EXECUTAR O SCRIPT NO TERMINAL

## 🎯 VOCÊ ESTÁ AQUI

Vejo na imagem que você está no **Terminal SSH do painel** com o script aberto.

O script está correto e pronto para executar!

---

## 📋 COMO EXECUTAR

### Opção 1: Copiar e Colar (RECOMENDADO)

1. **Selecione TODO o conteúdo** do arquivo `corrigir-ssh-hugo.sh`
2. **Copie** (Ctrl+C)
3. **No Terminal SSH do painel**, cole (Ctrl+V ou botão direito → Paste)
4. **Pressione Enter**

### Opção 2: Executar Linha por Linha

Se preferir, execute estes comandos um por um no terminal:

```bash
# 1. Backup
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 2. Remover HugoGandy da restrição
sudo sed -i 's/Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy/Match User sftp_dummy99,HugoGandy_equipcas/g' /etc/ssh/sshd_config

# 3. Testar configuração
sudo sshd -t

# 4. Reiniciar SSH
sudo systemctl restart sshd

# 5. Verificar status
sudo systemctl status sshd
```

---

## ✅ O QUE VAI ACONTECER

Quando você executar, verá:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 CORRIGINDO SSH PARA HUGOGANDY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

>>> Fazendo backup do sshd_config...
✅ Backup criado

>>> Removendo HugoGandy da restrição SFTP...
✅ Configuração atualizada

>>> Testando configuração SSH...
✅ Configuração válida

>>> Reiniciando serviço SSH...
✅ SSH reiniciado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CORREÇÃO CONCLUÍDA!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 DEPOIS DE EXECUTAR

### 1️⃣ No seu computador Windows, execute:

```powershell
cd C:\Users\yuriv\Desktop\SixOnic-Gest-o-Empresarial
.\testar-ssh-nova-chave.ps1
```

**Deve aparecer:**
```
✅ CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!
HugoGandy
/home/HugoGandy
```

### 2️⃣ Se funcionar, faça o deploy:

```powershell
.\deploy-auto-hugo.ps1
```

---

## 💡 DICA

Se pedir senha `sudo`, digite a senha do root ou do painel.

---

## 🚀 RESUMO

1. ✅ Cole o script no terminal do painel
2. ✅ Pressione Enter
3. ✅ Aguarde terminar
4. ✅ Teste no Windows: `.\testar-ssh-nova-chave.ps1`
5. ✅ Deploy: `.\deploy-auto-hugo.ps1`

**Está quase lá! Execute agora!** 🎯
