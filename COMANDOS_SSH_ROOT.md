# 📋 COMANDOS PARA EXECUTAR APÓS CONECTAR

Após digitar a senha e conectar via SSH, execute estes comandos:

## 1️⃣ ATUALIZAR SISTEMA

```bash
apt-get update && apt-get upgrade -y && apt-get autoremove -y && apt-get autoclean
```

## 2️⃣ VERIFICAR INFORMAÇÕES

```bash
# Ver versão do sistema
lsb_release -a

# Ver espaço em disco
df -h /

# Ver memória
free -h

# Ver processos
pm2 status
```

## 3️⃣ CONFIGURAR SSH PARA HUGOGANDY (Opcional)

Se quiser configurar SSH para deploy automático:

```bash
# Mudar para usuário HugoGandy
su - HugoGandy

# Criar diretório .ssh se não existir
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Adicionar chave SSH
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa" >> ~/.ssh/authorized_keys

# Configurar permissões
chmod 600 ~/.ssh/authorized_keys

# Voltar para root
exit
```

## 4️⃣ SAIR

```bash
exit
```

---

## ✅ DEPOIS DE ATUALIZAR

Teste o deploy automático:

```powershell
.\testar-ssh-nova-chave.ps1
.\deploy-auto-hugo.ps1
```

---

## 💡 DICA

Se quiser executar tudo de uma vez, cole este comando completo:

```bash
apt-get update && apt-get upgrade -y && apt-get autoremove -y && apt-get autoclean && echo "✅ Sistema atualizado!" && df -h / && free -h
```
