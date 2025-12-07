# ⚡ INÍCIO RÁPIDO - 3 PASSOS

## 🔑 CHAVE SSH PARA COPIAR

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

---

## 📋 PASSO 1: CONFIGURAR SSH (2 min)

1. Abra: https://server.equipcasa.com.br:8083
2. Login: **HugoGandy**
3. Users → Edit HugoGandy
4. **SSH Keys:** Cole a chave acima
5. **SSH Access:** Mude para **`bash`**
6. **Save**

---

## 📋 PASSO 2: TESTAR (10 seg)

```powershell
.\testar-ssh-nova-chave.ps1
```

Deve aparecer: ✅ **CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!**

---

## 📋 PASSO 3: ESCOLHA UMA OPÇÃO

### Opção A: Atualizar Sistema
```powershell
.\atualizar-sistema.ps1
```

### Opção B: Deploy Imediato
```powershell
.\deploy-auto-hugo.ps1
```

### Opção C: Ambos
```powershell
.\atualizar-sistema.ps1
.\deploy-auto-hugo.ps1
```

---

## ✅ PRONTO!

Após configurar uma vez, todo deploy futuro será:

```powershell
.\deploy-auto-hugo.ps1
```

**30 segundos e está no ar!** 🚀

---

## 🆘 PROBLEMAS?

**SSH pede senha?**
→ Volte ao Passo 1, verifique se:
- Copiou a chave completa
- SSH Access = `bash`
- Salvou as configurações

**Não sabe onde configurar?**
→ Painel → Users (menu lateral) → Edit HugoGandy → Seção "SSH"

---

**Arquivo com a chave:** `CHAVE_SSH_HUGO.txt`
