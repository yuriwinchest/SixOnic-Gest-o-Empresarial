# 🔑 ADICIONAR CHAVE SSH COMO ROOT

## 💡 ENTENDI O PROBLEMA

A chave foi adicionada no **painel Hestia** (admin), mas precisa ser adicionada **diretamente no sistema** para o usuário HugoGandy.

---

## ✅ SOLUÇÃO: ADICIONAR VIA ROOT

**Execute no terminal SSH do painel (como root):**

```bash
# 1. Criar diretório .ssh para HugoGandy
mkdir -p /home/HugoGandy/.ssh

# 2. Adicionar chave SSH
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa" > /home/HugoGandy/.ssh/authorized_keys

# 3. Configurar permissões corretas
chown -R HugoGandy:HugoGandy /home/HugoGandy/.ssh
chmod 700 /home/HugoGandy/.ssh
chmod 600 /home/HugoGandy/.ssh/authorized_keys

# 4. Verificar
cat /home/HugoGandy/.ssh/authorized_keys
ls -la /home/HugoGandy/.ssh/
```

---

## 📋 COMANDOS LIMPOS (COPIE TUDO)

```bash
mkdir -p /home/HugoGandy/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa" > /home/HugoGandy/.ssh/authorized_keys
chown -R HugoGandy:HugoGandy /home/HugoGandy/.ssh
chmod 700 /home/HugoGandy/.ssh
chmod 600 /home/HugoGandy/.ssh/authorized_keys
cat /home/HugoGandy/.ssh/authorized_keys
ls -la /home/HugoGandy/.ssh/
```

---

## ✅ VERIFICAR SE FUNCIONOU

Você deve ver:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa

total 12
drwx------ 2 HugoGandy HugoGandy 4096 ... .
drwxr-x--- 8 HugoGandy HugoGandy 4096 ... ..
-rw------- 1 HugoGandy HugoGandy  107 ... authorized_keys
```

---

## 🎯 DEPOIS DE EXECUTAR

Teste no Windows:

```powershell
.\testar-ssh-nova-chave.ps1
```

**Deve aparecer:**
```
✅ CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!
HugoGandy
/home/HugoGandy
```

---

## 🚀 SE FUNCIONAR

```powershell
.\deploy-auto-hugo.ps1
```

**Deploy em 30 segundos!** ⚡

---

## 💡 DIFERENÇA

**Antes (não funcionava):**
- Chave adicionada no painel Hestia (admin)
- Painel não sincronizou com o sistema

**Agora (vai funcionar):**
- Chave adicionada diretamente no `/home/HugoGandy/.ssh/authorized_keys`
- Permissões corretas configuradas
- SSH vai aceitar a chave!

---

**Execute os comandos como root no terminal do painel!** 🎯
