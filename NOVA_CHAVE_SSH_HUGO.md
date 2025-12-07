# 🔑 NOVA CHAVE SSH PARA HUGOGANDY

## ✅ CHAVE GERADA COM SUCESSO!

**Localização:**
- Chave privada: `C:\Users\yuriv\.ssh\hugo_key`
- Chave pública: `C:\Users\yuriv\.ssh\hugo_key.pub`

---

## 📋 COPIE ESTA CHAVE PÚBLICA

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

---

## 🎯 PASSO A PASSO PARA CONFIGURAR

### 1️⃣ Acessar o Painel
1. Acesse: **https://server.equipcasa.com.br:8083**
2. Faça login com o usuário **HugoGandy**

### 2️⃣ Deletar Chave Antiga (se existir)
1. Vá em **Users** → **Edit HugoGandy**
2. Na seção **SSH Keys**, delete a chave antiga
3. **NÃO SALVE AINDA!**

### 3️⃣ Adicionar Nova Chave
1. Na mesma tela, na seção **SSH Keys**
2. Cole a chave acima (linha completa começando com `ssh-ed25519`)
3. Verifique se **SSH Access** está configurado como **`bash`** (não `nologin`)
4. Clique em **Save**

### 4️⃣ Testar Conexão
Execute este comando para testar:

```powershell
.\testar-ssh-nova-chave.ps1
```

Se aparecer "✅ SSH FUNCIONANDO!", está tudo certo!

---

## 🚀 DEPLOY AUTOMÁTICO

Após configurar a chave, você poderá fazer deploy automático sempre que fizer ajustes:

```powershell
.\deploy-auto-hugo.ps1
```

Este comando irá:
1. ✅ Fazer build do frontend
2. ✅ Enviar arquivos via SFTP
3. ✅ Reiniciar o backend automaticamente
4. ✅ Verificar status

**Tempo total: ~30 segundos!** ⚡

---

## 🔍 VERIFICAR SE FUNCIONOU

### Teste Rápido
```powershell
ssh -i C:\Users\yuriv\.ssh\hugo_key HugoGandy@161.97.124.179 "echo 'SSH OK' && whoami"
```

**Resultado esperado:**
```
SSH OK
HugoGandy
```

Se pedir senha, a chave não foi configurada corretamente.

---

## 📝 IMPORTANTE

⚠️ **Mantenha a chave privada segura!**
- Nunca compartilhe o arquivo `hugo_key`
- Apenas a chave pública (`.pub`) deve ser colocada no servidor

✅ **A chave pública pode ser compartilhada**
- É seguro copiar e colar em servidores
- Pode ser adicionada em múltiplos servidores

---

## 🆘 PROBLEMAS?

### SSH ainda pede senha
1. Verifique se copiou a chave **completa** (toda a linha)
2. Confirme que SSH Access está como `bash`
3. Salve as configurações no painel
4. Aguarde 10 segundos e teste novamente

### Erro "Permission denied"
1. Verifique se a chave foi salva corretamente no painel
2. Tente fazer logout e login novamente no painel
3. Execute o teste novamente

---

**Fingerprint da chave:** `SHA256:Ygvw9zh7EWxawRPWLX3Z/7KNvAXzHGgIkLx1Mj+1CyA`
