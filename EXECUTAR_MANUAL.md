# ⚠️ PRECISO QUE VOCÊ EXECUTE MANUALMENTE

## 🔴 NÃO CONSIGO EXECUTAR AUTOMATICAMENTE

Não tenho acesso root via SSH para executar os comandos automaticamente.

**Você precisa executar manualmente no terminal do painel.**

---

## 📋 PASSO A PASSO SIMPLES

### 1️⃣ Acesse o Terminal do Painel

- URL: https://161.97.124.179:8083
- Login com suas credenciais
- Vá em **Server** → **Terminal** (ou Web Terminal)

### 2️⃣ Copie e Cole ESTES Comandos

```bash
mkdir -p /home/HugoGandy/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa" > /home/HugoGandy/.ssh/authorized_keys
chown -R HugoGandy:HugoGandy /home/HugoGandy/.ssh
chmod 700 /home/HugoGandy/.ssh
chmod 600 /home/HugoGandy/.ssh/authorized_keys
cat /home/HugoGandy/.ssh/authorized_keys
```

### 3️⃣ Pressione Enter

Aguarde os comandos executarem.

### 4️⃣ Verifique

Você deve ver a chave SSH aparecer:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

---

## ✅ DEPOIS DE EXECUTAR

### No seu computador Windows, execute:

```powershell
.\testar-ssh-nova-chave.ps1
```

**Resultado esperado:**
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

**Deploy automático em 30 segundos!** ⚡

---

## 📁 ONDE ESTÃO OS COMANDOS

**Arquivo:** `comandos-root-ssh.txt`

Abra este arquivo, copie TODO o conteúdo e cole no terminal do painel.

---

## 💡 POR QUE PRECISO FAZER MANUALMENTE?

- Não tenho senha do root
- Não tenho acesso SSH direto como root
- O terminal do painel já está autenticado como root
- É mais rápido e seguro você executar diretamente

---

## ⏱️ TEMPO ESTIMADO

- Abrir painel: 30 segundos
- Copiar e colar comandos: 10 segundos
- Executar: 5 segundos
- Testar SSH: 10 segundos

**Total: ~1 minuto** ⚡

---

**Abra o terminal do painel e execute os comandos agora!** 🎯
