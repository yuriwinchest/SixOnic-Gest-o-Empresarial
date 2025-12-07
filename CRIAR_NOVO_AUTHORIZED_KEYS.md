# ✅ CRIAR NOVO AUTHORIZED_KEYS

## 📋 SITUAÇÃO ATUAL

Vejo na imagem:
- ✅ `authorized_keys` (0 Bytes) - Vazio
- ✅ `authorized_keys2` (326 Bytes) - Backup com as 2 chaves
- ✅ `hst-filemanager-key` - Chave do file manager

---

## 🎯 SOLUÇÃO

Criar novo `authorized_keys` com apenas nossa chave!

### Execute no Terminal SSH do painel:

```bash
# Criar novo authorized_keys com apenas nossa chave
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa" > /home/HugoGandy/.ssh/authorized_keys

# Configurar permissões corretas
chmod 600 /home/HugoGandy/.ssh/authorized_keys
chown HugoGandy:HugoGandy /home/HugoGandy/.ssh/authorized_keys

# Verificar conteúdo
cat /home/HugoGandy/.ssh/authorized_keys

# Verificar permissões
ls -la /home/HugoGandy/.ssh/authorized_keys
```

---

## ✅ RESULTADO ESPERADO

Você deve ver:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa

-rw------- 1 HugoGandy HugoGandy 107 ... authorized_keys
```

---

## 🎯 DEPOIS DE EXECUTAR

Teste no Windows:

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

## 💡 O QUE FIZEMOS

1. ✅ Renomeou `authorized_keys` para `authorized_keys2` (backup)
2. ✅ Criou novo `authorized_keys` vazio
3. ✅ Agora vamos adicionar APENAS nossa chave sem restrições
4. ✅ SSH vai funcionar!

---

**Execute os comandos no terminal do painel agora!** 🎯
