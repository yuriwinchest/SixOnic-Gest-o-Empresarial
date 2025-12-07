# ✅ COMANDOS COMO ROOT (ver8wdgr)

## 🎯 VOCÊ ESTÁ AQUI

```
ver8wdgr@server:~$
```

Perfeito! Você tem acesso root!

---

## 📋 EXECUTE ESTES COMANDOS

### 1️⃣ Corrigir SSH (Remover HugoGandy do chroot)

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup3
sudo sed -i 's/Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy/Match User sftp_dummy99,HugoGandy_equipcas/g' /etc/ssh/sshd_config
sudo grep "Match User" /etc/ssh/sshd_config
sudo sshd -t
sudo systemctl restart sshd
```

### 2️⃣ Dar Permissões ao HugoGandy

```bash
# Dar propriedade total do diretório home
sudo chown -R HugoGandy:HugoGandy /home/HugoGandy
sudo chmod 755 /home/HugoGandy

# Criar diretórios necessários
sudo mkdir -p /home/HugoGandy/gestao-vendas/backend
sudo mkdir -p /home/HugoGandy/web/equipcasa.com.br/public_html

# Dar propriedade
sudo chown -R HugoGandy:HugoGandy /home/HugoGandy/gestao-vendas
sudo chown -R HugoGandy:HugoGandy /home/HugoGandy/web

# Dar permissões de escrita
sudo chmod -R 755 /home/HugoGandy/gestao-vendas
sudo chmod -R 755 /home/HugoGandy/web
```

### 3️⃣ Verificar

```bash
ls -la /home/HugoGandy/
ls -la /home/HugoGandy/web/
```

---

## ✅ RESULTADO ESPERADO

### SSH Config:
```
Match User sftp_dummy99,HugoGandy_equipcas
```
**SEM** HugoGandy!

### Permissões:
```
drwxr-xr-x ... HugoGandy HugoGandy ... gestao-vendas
drwxr-xr-x ... HugoGandy HugoGandy ... web
```

---

## 🎯 DEPOIS DE EXECUTAR

Teste o deploy:

```powershell
.\deploy-auto-hugo.ps1
```

**Deve funcionar perfeitamente!** 🚀

---

**Execute os comandos agora!** 🎯
