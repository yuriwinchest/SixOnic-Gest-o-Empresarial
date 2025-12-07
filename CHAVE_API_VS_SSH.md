# ⚠️ ATENÇÃO: ISSO É DIFERENTE!

## 🔴 O QUE VOCÊ CRIOU

Você criou uma **Chave de Acesso API** do Hestia:
- ID: `giLsZjbsuhkQJ4NxTLer`
- Secret: `Zulr3r6gLlKOyIOTvjh=l2IThk8YTbwtRWguhH4l`

Isso é para acessar a **API do painel Hestia**, não para SSH!

---

## ❌ ISSO NÃO É O QUE PRECISAMOS

**Chave de API ≠ Chave SSH**

| Tipo | Para que serve |
|------|----------------|
| **Chave de API** | Acessar API do Hestia (automação do painel) |
| **Chave SSH** | Conectar via SSH ao servidor |

Você criou a chave de API, mas precisamos da **chave SSH**!

---

## ✅ O QUE FAZER AGORA

### OPÇÃO 1: Adicionar Chave SSH via Usuário (CORRETO)

1. No painel Hestia, vá em **Users** (Usuários)
2. Clique em **Edit** no usuário **HugoGandy**
3. Procure a seção **"SSH"** ou **"SSH Keys"**
4. Cole a chave SSH:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```
5. Mude **SSH Access** para `bash`
6. Salve

### OPÇÃO 2: Via Terminal (MAIS RÁPIDO)

Abra o terminal SSH do painel e execute:

```bash
mkdir -p /home/HugoGandy/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa" > /home/HugoGandy/.ssh/authorized_keys
chown -R HugoGandy:HugoGandy /home/HugoGandy/.ssh
chmod 700 /home/HugoGandy/.ssh
chmod 600 /home/HugoGandy/.ssh/authorized_keys
```

---

## 💡 DIFERENÇA VISUAL

### Chave de API (o que você criou):
```
ID: giLsZjbsuhkQJ4NxTLer
Secret: Zulr3r6gLlKOyIOTvjh=l2IThk8YTbwtRWguhH4l
```
❌ Não serve para SSH!

### Chave SSH (o que precisamos):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```
✅ Serve para SSH!

---

## 🎯 ONDE ADICIONAR CHAVE SSH

### Caminho no Painel:
```
Painel Hestia
└── Users (menu lateral)
    └── HugoGandy
        └── Edit (botão)
            └── Seção "SSH" ou "Advanced"
                ├── SSH Access: bash
                └── SSH Keys: (cole a chave SSH)
```

---

## 📋 RESUMO

1. ❌ Você criou chave de API (não serve para SSH)
2. ✅ Precisa adicionar chave SSH no usuário HugoGandy
3. ✅ Use OPÇÃO 1 (via painel) ou OPÇÃO 2 (via terminal)

---

## 🔑 CHAVE SSH CORRETA

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

---

**Vá em Users → Edit HugoGandy → SSH Keys e adicione a chave SSH!** 🎯
