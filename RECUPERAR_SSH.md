# ⚠️ SSH FALHOU - SOLUÇÃO ALTERNATIVA

## 🔴 PROBLEMA

O SSH falhou ao reiniciar com a nova configuração. Isso aconteceu porque a configuração tem **duas seções duplicadas** de `Match User`.

---

## ✅ SOLUÇÃO IMEDIATA: RESTAURAR BACKUP

**Execute no terminal do painel:**

```bash
# Restaurar backup
sudo cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config

# Reiniciar SSH
sudo systemctl restart sshd

# Verificar
sudo systemctl status sshd
```

---

## 🎯 SOLUÇÃO CORRETA: REMOVER DUPLICATAS

O problema é que há **DUAS** seções `Match User` idênticas no arquivo:

```bash
# Primeira (linha ~30)
Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy
    ChrootDirectory /srv/jail/%u
    X11Forwarding no
    AllowTCPForwarding no
    ForceCommand internal-sftp -d /home/%u 

# Segunda (linha ~35) - DUPLICATA!
Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy
    ChrootDirectory /srv/jail/%u
    X11Forwarding no
    AllowTCPForwarding no
    ForceCommand internal-sftp -d /home/%u
```

**Precisamos:**
1. Remover UMA das seções duplicadas
2. Na seção que sobrar, remover `HugoGandy` da lista

---

## 📝 COMANDOS CORRETOS

Execute no terminal do painel:

```bash
# 1. Fazer backup
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup2

# 2. Editar manualmente
sudo nano /etc/ssh/sshd_config
```

### No editor nano:

1. **Procure por:** `Match User` (use Ctrl+W para buscar)
2. **Você verá DUAS seções idênticas**
3. **DELETE completamente UMA delas** (todas as 5 linhas)
4. **Na seção que sobrou**, mude:
   - DE: `Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy`
   - PARA: `Match User sftp_dummy99,HugoGandy_equipcas`

### Resultado final deve ser:

```bash
# Hestia SFTP Chroot
Match User sftp_dummy99,HugoGandy_equipcas
    ChrootDirectory /srv/jail/%u
    X11Forwarding no
    AllowTCPForwarding no
    ForceCommand internal-sftp -d /home/%u
```

**Apenas UMA seção, sem HugoGandy!**

5. **Salvar:** Ctrl+O, Enter, Ctrl+X

```bash
# 3. Testar
sudo sshd -t

# 4. Se OK, reiniciar
sudo systemctl restart sshd

# 5. Verificar
sudo systemctl status sshd
```

---

## 🔄 ALTERNATIVA MAIS SIMPLES

Se preferir, use este comando que remove as duplicatas e HugoGandy de uma vez:

```bash
# Backup
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup3

# Criar arquivo limpo
sudo cat /etc/ssh/sshd_config | grep -v "^# Hestia SFTP Chroot" | awk '
BEGIN { in_match=0; printed=0 }
/^Match User/ { 
    if (!printed) {
        gsub(/,HugoGandy/, "")
        print
        in_match=1
        printed=1
    }
    next
}
in_match && /^[[:space:]]/ { 
    if (printed == 1) print
    next
}
in_match && /^[^[:space:]]/ { in_match=0 }
!in_match { print }
' > /tmp/sshd_config.new

# Adicionar comentário
echo "" | sudo tee -a /tmp/sshd_config.new
echo "# Hestia SFTP Chroot" | sudo tee -a /tmp/sshd_config.new

# Copiar de volta
sudo mv /tmp/sshd_config.new /etc/ssh/sshd_config

# Testar
sudo sshd -t

# Reiniciar
sudo systemctl restart sshd
```

---

## 🎯 OPÇÃO MAIS FÁCIL: USAR PAINEL HESTIA

Ao invés de editar SSH manualmente, **use o painel Hestia**:

1. **Acesse:** https://161.97.124.179:8083
2. **Vá em:** Users → Edit HugoGandy
3. **Procure:** "SSH Access" ou "Shell"
4. **Mude para:** `bash` (ao invés de `nologin`)
5. **Salve**

O Hestia pode configurar o SSH automaticamente de forma correta!

---

## ✅ DEPOIS DE CORRIGIR

Teste:
```powershell
.\testar-ssh-nova-chave.ps1
```

---

## 🆘 SE NADA FUNCIONAR

**Solução temporária:** Use SFTP ao invés de SSH

Você já tem FTP configurado:
- Host: `161.97.124.179`
- User: `HugoGandy_equipcas`
- Pass: `Hugo2025`

Pode fazer upload manual via WinSCP ou FileZilla.

---

**Primeiro restaure o backup, depois tente a opção via painel Hestia!** 🎯
