# 🔑 ADICIONAR CHAVE SSH MANUALMENTE

## ⚠️ PROBLEMA

A chave SSH não está sendo aceita porque não foi adicionada ao arquivo `authorized_keys` do usuário HugoGandy.

---

## ✅ SOLUÇÃO: ADICIONAR CHAVE VIA TERMINAL

**Execute no terminal SSH do painel:**

```bash
# 1. Mudar para usuário HugoGandy
sudo su - HugoGandy

# 2. Criar diretório .ssh (se não existir)
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 3. Adicionar chave SSH
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa" >> ~/.ssh/authorized_keys

# 4. Configurar permissões
chmod 600 ~/.ssh/authorized_keys

# 5. Verificar
cat ~/.ssh/authorized_keys

# 6. Voltar para root
exit
```

---

## 📋 COMANDOS LIMPOS (COPIE TUDO DE UMA VEZ)

```bash
sudo su - HugoGandy
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
cat ~/.ssh/authorized_keys
exit
```

---

## ✅ DEPOIS DE EXECUTAR

Teste no Windows:

```powershell
.\testar-ssh-nova-chave.ps1
```

**Resultado esperado:**
```
✅ CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!
```

---

## 🎯 SE AINDA NÃO FUNCIONAR

Verifique as permissões do diretório home:

```bash
sudo chmod 755 /home/HugoGandy
sudo chown HugoGandy:HugoGandy /home/HugoGandy/.ssh
sudo chown HugoGandy:HugoGandy /home/HugoGandy/.ssh/authorized_keys
```

---

## 💡 ALTERNATIVA: VIA PAINEL HESTIA

Se o terminal não funcionar, tente via painel:

1. Painel: https://161.97.124.179:8083
2. Users → Edit HugoGandy
3. SSH Keys: Cole a chave
4. SSH Access: `bash`
5. Save

---

**Execute os comandos no terminal do painel agora!** 🚀
