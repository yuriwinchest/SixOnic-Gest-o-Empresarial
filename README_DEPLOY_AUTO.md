# ⚡ CONFIGURAÇÃO COMPLETA - DEPLOY AUTOMÁTICO

## ✅ O QUE FOI FEITO

1. ✅ Nova chave SSH gerada: `C:\Users\yuriv\.ssh\hugo_key`
2. ✅ Scripts de deploy automático criados
3. ✅ Scripts de teste criados

---

## 🎯 PRÓXIMOS PASSOS (FAÇA AGORA)

### 1️⃣ Configurar Chave no Painel (2 minutos)

1. **Abra o painel:** https://server.equipcasa.com.br:8083
2. **Login:** HugoGandy
3. **Vá em:** Users → Edit HugoGandy
4. **Delete a chave antiga** (se existir)
5. **Cole esta chave nova:**

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

6. **Verifique:** SSH Access = `bash` (não `nologin`)
7. **Salve**

---

### 2️⃣ Testar Conexão SSH

Execute:
```powershell
.\testar-ssh-nova-chave.ps1
```

**Resultado esperado:**
```
✅ CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!
```

Se pedir senha ou der erro, volte ao passo 1️⃣ e verifique se:
- Copiou a chave completa
- SSH Access está como `bash`
- Salvou as configurações

---

### 3️⃣ Fazer Deploy Automático

Quando o teste passar, execute:
```powershell
.\deploy-auto-hugo.ps1
```

**O que acontece:**
1. ✅ Build do frontend (~15s)
2. ✅ Upload frontend (~5s)
3. ✅ Upload backend (~2s)
4. ✅ Reinicia backend (~3s)
5. ✅ Verifica status

**Tempo total: ~30 segundos!** ⚡

---

## 🚀 USO FUTURO

Sempre que fizer alterações no código:

```powershell
.\deploy-auto-hugo.ps1
```

Pronto! Em 30 segundos seu site está atualizado em https://equipcasa.com.br

---

## 📁 ARQUIVOS IMPORTANTES

| Arquivo | Descrição |
|---------|-----------|
| `NOVA_CHAVE_SSH_HUGO.md` | Instruções detalhadas da chave |
| `testar-ssh-nova-chave.ps1` | Testa conexão SSH |
| `deploy-auto-hugo.ps1` | Deploy automático ⭐ |
| `GUIA_DEPLOY_RAPIDO.md` | Deploy manual (backup) |

---

## 🔑 CHAVE SSH

**Chave Pública (copie no painel):**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

**Localização:**
- Privada: `C:\Users\yuriv\.ssh\hugo_key` (NÃO compartilhe!)
- Pública: `C:\Users\yuriv\.ssh\hugo_key.pub`

**Fingerprint:** `SHA256:Ygvw9zh7EWxawRPWLX3Z/7KNvAXzHGgIkLx1Mj+1CyA`

---

## 🆘 PROBLEMAS?

### SSH pede senha
→ A chave não foi configurada corretamente no painel  
→ Volte ao passo 1️⃣

### "Permission denied"
→ Verifique se copiou a chave completa  
→ Confirme que SSH Access = `bash`  
→ Aguarde 10 segundos após salvar

### Deploy falha
→ Execute primeiro: `.\testar-ssh-nova-chave.ps1`  
→ Se o teste passar, tente o deploy novamente

---

## ✨ BENEFÍCIOS

| Antes | Depois |
|-------|--------|
| 15-20 min manual | 30 seg automático |
| Upload arquivo por arquivo | Upload automático |
| Reiniciar manualmente | Reinicia sozinho |
| Verificar status manual | Status automático |

---

## 📞 COMANDOS ÚTEIS

```powershell
# Ver logs do backend
ssh -i C:\Users\yuriv\.ssh\hugo_key HugoGandy@161.97.124.179 "pm2 logs gestao-vendas"

# Reiniciar backend
ssh -i C:\Users\yuriv\.ssh\hugo_key HugoGandy@161.97.124.179 "pm2 restart gestao-vendas"

# Ver status
ssh -i C:\Users\yuriv\.ssh\hugo_key HugoGandy@161.97.124.179 "pm2 status"
```

---

## 🎬 COMECE AGORA!

1. Configure a chave no painel (passo 1️⃣)
2. Teste: `.\testar-ssh-nova-chave.ps1`
3. Deploy: `.\deploy-auto-hugo.ps1`

**Tempo total: 3 minutos para configurar uma vez, 30 segundos para cada deploy futuro!** 🚀

---

**Última atualização:** 2025-12-05 23:55
