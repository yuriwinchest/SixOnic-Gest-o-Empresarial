# ⚠️ PROBLEMA: PERMISSÕES BLOQUEADAS

## 🔴 O QUE ACONTECEU

O SSH está funcionando, mas o HugoGandy **não tem permissão** para criar diretórios ou fazer upload de arquivos!

Erro: `Permission denied`

---

## 💡 CAUSA

O `sshd_config` ainda tem restrições para o HugoGandy (ChrootDirectory).

Precisamos remover HugoGandy da configuração de chroot.

---

## ✅ SOLUÇÃO: CORRIGIR SSHD_CONFIG

Execute no **Terminal SSH do painel**:

```bash
# 1. Fazer backup
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup3

# 2. Remover HugoGandy da linha Match User
sudo sed -i 's/Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy/Match User sftp_dummy99,HugoGandy_equipcas/g' /etc/ssh/sshd_config

# 3. Verificar
sudo grep "Match User" /etc/ssh/sshd_config

# 4. Testar configuração
sudo sshd -t

# 5. Se OK, reiniciar SSH
sudo systemctl restart sshd

# 6. Verificar status
sudo systemctl status sshd
```

---

## ✅ RESULTADO ESPERADO

Você deve ver:
```
Match User sftp_dummy99,HugoGandy_equipcas
```

**SEM** HugoGandy na lista!

---

## 🎯 DEPOIS DE CORRIGIR

Teste o deploy novamente:

```powershell
.\deploy-auto-hugo.ps1
```

---

## 💡 POR QUE ISSO?

O `sshd_config` tem esta configuração:

```
Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy
    ChrootDirectory /srv/jail/%u
    ForceCommand internal-sftp
```

Isso **prende** o HugoGandy em um diretório jail e só permite SFTP.

**Solução:** Remover HugoGandy dessa lista!

---

**Execute os comandos no terminal do painel agora!** 🎯
