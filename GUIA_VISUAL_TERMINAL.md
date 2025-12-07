# ⚡ ATUALIZAR SISTEMA - GUIA VISUAL

## 🌐 PASSO 1: ABRIR PAINEL

Acesse: **https://161.97.124.179:8083**

Login:
- Username: `ver8wdgr`
- Email: `hugogandy45@gmail.com`
- Senha: (a mesma que você usa no navegador)

---

## 💻 PASSO 2: ABRIR TERMINAL

No painel Hestia, procure no menu lateral:

```
📊 Dashboard
👤 Users
🌐 Web
📧 Mail
📁 Files
💾 DB
🔧 Server  ← CLIQUE AQUI
   └─ 💻 Terminal  ← DEPOIS AQUI
```

Ou procure por:
- **"Web Terminal"**
- **"SSH Terminal"**
- Ícone de terminal 💻

---

## 📋 PASSO 3: COPIAR E COLAR

### Comando Completo (Tudo de uma vez):
```bash
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y
```

### Ou Um por Vez:
```bash
sudo apt-get update
```
Aguarde terminar, depois:
```bash
sudo apt-get upgrade -y
```
Aguarde terminar, depois:
```bash
sudo apt-get autoremove -y
```

---

## ✅ PASSO 4: AGUARDAR

⏱️ Tempo: 2-5 minutos

Você verá mensagens como:
```
Reading package lists...
Building dependency tree...
...
Done
```

Quando aparecer o prompt novamente, está pronto!

---

## 🎯 DEPOIS: CONFIGURAR DEPLOY AUTOMÁTICO

### No mesmo painel:

1. Vá em **Users** → **Edit HugoGandy** (ou Edit ver8wdgr)

2. Procure a seção **"SSH"** ou **"SSH Access"**

3. Cole esta chave:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

4. Mude **SSH Access** de `nologin` para **`bash`**

5. Clique em **Save**

6. Teste no seu computador:
```powershell
.\testar-ssh-nova-chave.ps1
```

7. Se funcionar, faça deploy:
```powershell
.\deploy-auto-hugo.ps1
```

---

## 🆘 NÃO ENCONTRA O TERMINAL?

### Alternativa: Use SSH do Windows

Se o painel não tiver terminal web, você pode:

1. Habilitar SSH no painel (Users → Edit → SSH Access = bash)
2. Adicionar a chave SSH (veja acima)
3. Usar os scripts do Windows:
```powershell
.\atualizar-sistema.ps1
.\deploy-auto-hugo.ps1
```

---

## 📞 COMANDOS ÚTEIS (Depois de configurar SSH)

```powershell
# Atualizar sistema
.\atualizar-sistema.ps1

# Deploy
.\deploy-auto-hugo.ps1

# Testar SSH
.\testar-ssh-nova-chave.ps1
```

---

## ✨ RESUMO

1. ✅ Painel: https://161.97.124.179:8083
2. ✅ Terminal: Server → Terminal
3. ✅ Comando: `sudo apt-get update && sudo apt-get upgrade -y`
4. ✅ Configurar SSH para deploy automático

**Pronto!** 🚀
