# ⚡ GUIA DEFINITIVO - 2 PASSOS

## 🎯 PASSO 1: CONFIGURAR SSH (Via Painel Web)

### 1.1 Abrir Painel
🌐 **URL:** https://161.97.124.179:8083  
👤 **Login:** ver8wdgr  
🔑 **Senha:** (a que você usa no navegador)

### 1.2 Configurar SSH
1. No menu lateral, clique em **"Users"** (Usuários)
2. Encontre o usuário **"HugoGandy"** e clique em **"Edit"** (Editar)
3. Role a página até encontrar a seção **"SSH"** ou **"SSH Access"**

### 1.3 Adicionar Chave
Na seção SSH:

**Campo "SSH Keys":**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

**Campo "SSH Access":**
- Mude de `nologin` para **`bash`**

**Salvar:**
- Clique no botão **"Save"** no final da página

---

## 🎯 PASSO 2: FAZER DEPLOY (No seu computador)

### 2.1 Testar SSH
Abra PowerShell e execute:
```powershell
cd C:\Users\yuriv\Desktop\SixOnic-Gest-o-Empresarial
.\testar-ssh-nova-chave.ps1
```

**Resultado esperado:**
```
✅ CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!
```

### 2.2 Deploy Automático
Se o teste passou, execute:
```powershell
.\deploy-auto-hugo.ps1
```

**Resultado esperado:**
```
✅ DEPLOY CONCLUÍDO COM SUCESSO!
🌐 Site: https://equipcasa.com.br
```

---

## ✅ PRONTO!

Agora sempre que fizer alterações no código:

```powershell
.\deploy-auto-hugo.ps1
```

**30 segundos e está no ar!** 🚀

---

## 🆘 SE DER ERRO

### Erro: "SSH pede senha"
→ Volte ao Passo 1 e verifique:
- ✅ Copiou a chave completa?
- ✅ SSH Access está como `bash`?
- ✅ Clicou em Save?
- ✅ Aguardou 10 segundos?

### Erro: "Permission denied"
→ Certifique-se de editar o usuário **HugoGandy**, não o ver8wdgr

### Erro: "Chave não encontrada"
→ Execute no diretório correto:
```powershell
cd C:\Users\yuriv\Desktop\SixOnic-Gest-o-Empresarial
```

---

## 📁 ARQUIVOS DE AJUDA

| Arquivo | Quando usar |
|---------|-------------|
| `CHAVE_SSH_HUGO.txt` | Para copiar a chave |
| `testar-ssh-nova-chave.ps1` | Para testar SSH |
| `deploy-auto-hugo.ps1` | Para fazer deploy |
| `ERRO_E_SOLUCAO.md` | Se tiver dúvidas |

---

## 💡 LEMBRE-SE

- ✅ Configure SSH **uma vez** via painel web
- ✅ Depois use **apenas** os scripts `.ps1`
- ❌ Não execute comandos Linux no PowerShell
- ❌ Não digite `root@161.97.124.179` no PowerShell

---

**Tempo total: 5 minutos para configurar, 30 segundos para cada deploy futuro!** ⚡
