# ⚠️ HUGOGANDY NÃO TEM SUDO!

## 🔴 PROBLEMA

```
HugoGandy is not in the sudoers file
```

HugoGandy não tem permissão sudo. Você precisa executar como **root**!

---

## ✅ SOLUÇÃO: EXECUTAR COMO ROOT

### No Terminal SSH do Painel Hestia:

O terminal do painel já está como **root** por padrão!

**Execute estes comandos (SEM sudo):**

```bash
# 1. Fazer backup
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup3

# 2. Remover HugoGandy da linha Match User
sed -i 's/Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy/Match User sftp_dummy99,HugoGandy_equipcas/g' /etc/ssh/sshd_config

# 3. Verificar
grep "Match User" /etc/ssh/sshd_config

# 4. Testar configuração
sshd -t

# 5. Se OK, reiniciar SSH
systemctl restart sshd

# 6. Verificar status
systemctl status sshd
```

---

## 💡 DIFERENÇA

### ❌ Como HugoGandy (não funciona):
```bash
sudo comando  # HugoGandy não tem sudo
```

### ✅ Como root no painel (funciona):
```bash
comando  # Já está como root, não precisa sudo
```

---

## 🎯 ONDE EXECUTAR

1. **Painel Hestia:** https://161.97.124.179:8083
2. **Server** → **Terminal** (ou Web Terminal)
3. O terminal já está como **root**
4. Execute os comandos **SEM** `sudo`

---

## ✅ RESULTADO ESPERADO

```
Match User sftp_dummy99,HugoGandy_equipcas
```

**SEM** HugoGandy!

---

## 🎯 DEPOIS

Teste o deploy:

```powershell
.\deploy-auto-hugo.ps1
```

---

**Execute no Terminal do Painel (como root)!** 🎯
