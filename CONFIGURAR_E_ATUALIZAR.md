# 🔧 CONFIGURAR SSH E ATUALIZAR SISTEMA

## ⚠️ SITUAÇÃO ATUAL

A chave SSH ainda não foi configurada no painel. Precisamos fazer isso primeiro.

---

## 🎯 PASSO 1: CONFIGURAR CHAVE SSH (OBRIGATÓRIO)

### Abra o Painel
https://server.equipcasa.com.br:8083

### Configure a Chave

1. **Login:** HugoGandy
2. **Vá em:** Users → Edit HugoGandy
3. **Delete a chave antiga** (se existir na seção SSH Keys)
4. **Cole esta chave:**

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

5. **Configure SSH Access:**
   - Mude de `nologin` para **`bash`**

6. **Salve** (botão Save)

---

## 🎯 PASSO 2: TESTAR CONEXÃO

Após configurar, execute:

```powershell
.\testar-ssh-nova-chave.ps1
```

**Deve aparecer:** ✅ CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!

Se pedir senha, volte ao Passo 1 e verifique:
- ✅ Copiou a chave completa?
- ✅ SSH Access está como `bash`?
- ✅ Salvou as configurações?

---

## 🎯 PASSO 3: ATUALIZAR SISTEMA

Após o SSH funcionar, execute:

```powershell
.\atualizar-sistema.ps1
```

Este script irá:
1. ✅ Conectar via SSH
2. ✅ Executar `sudo apt-get update`
3. ✅ Executar `sudo apt-get upgrade -y`
4. ✅ Mostrar o resultado

---

## 📋 RESUMO DOS COMANDOS

### 1. Configurar chave no painel (manual)
→ Siga o Passo 1 acima

### 2. Testar SSH
```powershell
.\testar-ssh-nova-chave.ps1
```

### 3. Atualizar sistema
```powershell
.\atualizar-sistema.ps1
```

### 4. Deploy automático
```powershell
.\deploy-auto-hugo.ps1
```

---

## 🔑 CHAVE SSH (para copiar)

Arquivo: `CHAVE_SSH_HUGO.txt`

Ou copie daqui:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

---

## ⏱️ TEMPO ESTIMADO

- Configurar chave: **2 minutos**
- Testar SSH: **10 segundos**
- Atualizar sistema: **2-5 minutos**
- Deploy: **30 segundos**

**Total: ~5-10 minutos (uma vez só)**

---

## 🆘 PRECISA DE AJUDA?

### SSH pede senha
→ A chave não foi configurada corretamente  
→ Volte ao Passo 1

### "Permission denied"
→ Verifique se SSH Access = `bash`  
→ Aguarde 10 segundos após salvar

### Não encontra onde configurar
→ Painel → Users → Edit HugoGandy → Seção "SSH"

---

**IMPORTANTE:** Configure a chave SSH primeiro, depois tudo funcionará automaticamente! 🚀
