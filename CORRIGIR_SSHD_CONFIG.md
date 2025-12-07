# 🔍 PROBLEMA ENCONTRADO NO SSHD_CONFIG

## ❌ CAUSA RAIZ DO PROBLEMA

No arquivo `/etc/ssh/sshd_config`, há esta configuração:

```bash
Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy
    ChrootDirectory /srv/jail/%u
    X11Forwarding no
    AllowTCPForwarding no
    ForceCommand internal-sftp -d /home/%u
```

**Problema:** `ForceCommand internal-sftp` força o usuário **HugoGandy** a usar APENAS SFTP!

Isso significa que mesmo com a chave SSH correta, o HugoGandy **NÃO PODE** usar SSH normal, apenas SFTP.

---

## ✅ SOLUÇÃO: REMOVER HugoGandy DA RESTRIÇÃO

### OPÇÃO 1: Via Terminal SSH do Painel (RECOMENDADO)

1. **Acesse o painel:** https://161.97.124.179:8083
2. **Abra o Terminal SSH** (Server → Terminal)
3. **Execute estes comandos:**

```bash
# Fazer backup do arquivo
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Editar o arquivo
sudo nano /etc/ssh/sshd_config
```

4. **Encontre estas linhas:**
```bash
Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy
    ChrootDirectory /srv/jail/%u
    X11Forwarding no
    AllowTCPForwarding no
    ForceCommand internal-sftp -d /home/%u
```

5. **Remova `HugoGandy` da lista:**

**ANTES:**
```bash
Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy
```

**DEPOIS:**
```bash
Match User sftp_dummy99,HugoGandy_equipcas
```

6. **Salve o arquivo:**
   - Pressione `Ctrl + O` (salvar)
   - Pressione `Enter` (confirmar)
   - Pressione `Ctrl + X` (sair)

7. **Reinicie o SSH:**
```bash
sudo systemctl restart sshd
```

---

## ✅ OPÇÃO 2: Arquivo Corrigido Completo

Se preferir, substitua o conteúdo completo do arquivo por este:

```bash
Include /etc/ssh/sshd_config.d/*.conf

Port 22
AddressFamily any
ListenAddress 0.0.0.0
ListenAddress ::

PermitRootLogin yes
KbdInteractiveAuthentication no
UsePAM yes
X11Forwarding yes
PrintMotd no
DebianBanner no

AcceptEnv LANG LC_*
PubkeyAuthentication yes
PasswordAuthentication yes

Subsystem sftp internal-sftp-server

# Hestia SFTP Chroot - CORRIGIDO (removido HugoGandy)
Match User sftp_dummy99,HugoGandy_equipcas
    ChrootDirectory /srv/jail/%u
    X11Forwarding no
    AllowTCPForwarding no
    ForceCommand internal-sftp -d /home/%u
```

**Comandos para aplicar:**
```bash
# Fazer backup
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Editar (cole o conteúdo acima)
sudo nano /etc/ssh/sshd_config

# Testar configuração
sudo sshd -t

# Se não houver erros, reiniciar
sudo systemctl restart sshd
```

---

## 🎯 DEPOIS DE CORRIGIR

### 1️⃣ Aguarde 10 segundos

### 2️⃣ Teste SSH
```powershell
.\testar-ssh-nova-chave.ps1
```

**Resultado esperado:**
```
✅ CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!
HugoGandy
/home/HugoGandy
```

### 3️⃣ Deploy Automático
```powershell
.\deploy-auto-hugo.ps1
```

---

## 📋 EXPLICAÇÃO TÉCNICA

### O que cada linha faz:

```bash
Match User HugoGandy
```
↓ Aplica as regras abaixo APENAS para o usuário HugoGandy

```bash
ForceCommand internal-sftp -d /home/%u
```
↓ FORÇA o usuário a usar APENAS SFTP (bloqueia SSH normal)

**Solução:** Remover HugoGandy da lista de usuários restritos!

---

## ⚠️ IMPORTANTE

**NÃO remova** `HugoGandy_equipcas` da lista!

- ✅ `HugoGandy_equipcas` = Conta FTP (deve ficar restrita)
- ❌ `HugoGandy` = Usuário principal (deve ter SSH livre)

---

## 🔧 COMANDOS RESUMIDOS

```bash
# 1. Backup
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 2. Editar
sudo nano /etc/ssh/sshd_config

# 3. Mudar esta linha:
# DE:   Match User sftp_dummy99,HugoGandy_equipcas,HugoGandy
# PARA: Match User sftp_dummy99,HugoGandy_equipcas

# 4. Salvar (Ctrl+O, Enter, Ctrl+X)

# 5. Testar
sudo sshd -t

# 6. Reiniciar
sudo systemctl restart sshd
```

---

## ✅ VERIFICAR SE FUNCIONOU

```powershell
# Teste SSH
.\testar-ssh-nova-chave.ps1

# Se funcionar, faça deploy
.\deploy-auto-hugo.ps1
```

---

## 💡 RESUMO

**Problema:** HugoGandy está forçado a usar apenas SFTP  
**Causa:** Configuração no `/etc/ssh/sshd_config`  
**Solução:** Remover HugoGandy da linha `Match User`  
**Resultado:** SSH funcionará normalmente! 🚀

---

**Execute via Terminal SSH do painel e teste!**
