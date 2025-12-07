# 🎯 ATUALIZAR SISTEMA - VIA PAINEL WEB

## ✅ VOCÊ JÁ TEM ACESSO AO PAINEL!

**URL:** https://161.97.124.179:8083  
**Email:** hugogandy45@gmail.com  
**Username:** ver8wdgr  
**Senha:** (a senha que você usa no navegador)

---

## 📋 PASSO A PASSO

### 1️⃣ Acesse o Painel
- Abra: https://161.97.124.179:8083
- Faça login com suas credenciais

### 2️⃣ Abra o Terminal SSH
No painel Hestia, procure por uma destas opções:
- **"Terminal"** (ícone de terminal)
- **"Web Terminal"**
- **"SSH Terminal"**
- Ou vá em **"Server"** → **"Terminal"**

### 3️⃣ Cole os Comandos
Copie e cole estes comandos no terminal:

```bash
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y && sudo apt-get autoclean
```

Ou se preferir um por vez:

```bash
# 1. Atualizar lista de pacotes
sudo apt-get update

# 2. Atualizar pacotes
sudo apt-get upgrade -y

# 3. Limpar
sudo apt-get autoremove -y
sudo apt-get autoclean
```

### 4️⃣ Aguarde
A atualização pode levar 2-5 minutos.

---

## 🔧 ALTERNATIVA: Via File Manager + Cron

Se não encontrar o terminal no painel:

### Opção A: Criar script e executar

1. No painel, vá em **File Manager**
2. Navegue até `/root/` ou `/home/ver8wdgr/`
3. Crie um arquivo chamado `update.sh`
4. Cole este conteúdo:

```bash
#!/bin/bash
apt-get update
apt-get upgrade -y
apt-get autoremove -y
apt-get autoclean
echo "Sistema atualizado em $(date)" >> /var/log/update.log
```

5. Dê permissão de execução (via terminal ou File Manager)
6. Execute: `bash /root/update.sh`

---

## 💡 POR QUE SSH PEDE SENHA?

**Painel Web (Hestia):**
- Username: `ver8wdgr`
- Senha: (senha do painel)
- ✅ Funciona no navegador

**SSH (linha de comando):**
- Requer chave SSH configurada
- OU senha SSH (pode ser diferente da senha do painel)
- ❌ Por isso está pedindo senha

**Solução:** Use o **Terminal Web do painel** que já está autenticado!

---

## 🎯 DEPOIS DE ATUALIZAR

### Configure SSH para Deploy Automático

1. No painel, vá em **Users** → **Edit** (usuário HugoGandy ou ver8wdgr)
2. Procure **"SSH Access"** ou **"SSH Keys"**
3. Cole a chave SSH:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

4. Mude **SSH Access** para **`bash`**
5. Salve

Depois poderá usar:
```powershell
.\deploy-auto-hugo.ps1
```

---

## 📸 ONDE ENCONTRAR O TERMINAL NO HESTIA

Procure no menu lateral por:
- 🖥️ **Server** → Terminal
- 🔧 **Tools** → Terminal
- 💻 **SSH** → Web Terminal

Ou use o atalho de teclado (se disponível): `Ctrl + Alt + T`

---

## ✅ RESUMO

1. ✅ Você JÁ tem acesso ao painel
2. ✅ Use o Terminal Web do painel (mais fácil)
3. ✅ Cole os comandos de atualização
4. ✅ Configure SSH depois para deploy automático

**Não precisa de senha SSH se usar o Terminal Web!** 🎉
