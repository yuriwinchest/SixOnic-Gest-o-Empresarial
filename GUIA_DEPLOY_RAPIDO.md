# 🚀 DEPLOY EQUIPCASA.COM.BR - GUIA RÁPIDO

## ✅ BUILD CONCLUÍDO!

O frontend foi compilado com sucesso na pasta `dist`.

---

## 📋 ACESSO AO PAINEL

**URL:** https://server.equipcasa.com.br:8083  
**Usuário:** HugoGandy  
**Email:** hugogandy45@gmail.com  
**Senha:** (use a senha do painel)

---

## 🎯 PASSO A PASSO

### 1️⃣ UPLOAD FRONTEND (Substituir site atual)

1. Acesse o painel e vá em **File Manager**
2. Navegue até: `/home/HugoGandy/web/equipcasa.com.br/public_html`
3. **DELETE todos os arquivos antigos** (selecione tudo e delete)
4. Clique em **Upload** e selecione **TODOS** os arquivos da pasta:
   ```
   C:\Users\yuriv\Desktop\SixOnic-Gest-o-Empresarial\dist
   ```
5. Aguarde o upload completar

---

### 2️⃣ UPLOAD BACKEND

1. No File Manager, navegue até: `/home/HugoGandy/gestao-vendas/backend`
2. Faça upload dos seguintes arquivos:

| Arquivo Local | Destino no Servidor |
|---------------|---------------------|
| `server\index.js` | `index.js` |
| `server\db.js` | `db.js` |
| `server\sql.js` | `sql.js` |
| `package.json` | `package.json` |
| `.env.production` | `.env` ⚠️ **Renomeie!** |

---

### 3️⃣ CONFIGURAR BACKEND

1. No painel, vá em **Terminal** ou **SSH**
2. Execute os comandos:

```bash
cd /home/HugoGandy/gestao-vendas/backend
npm install --production
pm2 delete all
pm2 start index.js --name gestao-vendas
pm2 save
pm2 status
```

3. Verifique se aparece "online" no status

---

### 4️⃣ IMPORTAR BANCO DE DADOS

1. No painel, vá em **Databases** → **phpMyAdmin**
2. Selecione o banco de dados (provavelmente `HugoGandy_db` ou similar)
3. Clique na aba **Importar**
4. Escolha o arquivo:
   ```
   C:\Users\yuriv\Desktop\SixOnic-Gest-o-Empresarial\tabelas_sistema.sql
   ```
5. Clique em **Executar**
6. Aguarde a mensagem de sucesso

---

### 5️⃣ TESTAR O SITE

Acesse: **https://equipcasa.com.br**

Se tudo estiver correto, o novo sistema deve estar funcionando!

---

## 🔍 VERIFICAÇÕES

### ✅ Frontend OK?
- Acesse https://equipcasa.com.br
- Deve carregar a nova interface

### ✅ Backend OK?
```bash
pm2 status
```
Deve mostrar "gestao-vendas" como "online"

### ✅ API OK?
- Acesse: https://equipcasa.com.br/api/health
- Deve retornar status OK

### ✅ Banco OK?
- Faça login no sistema
- Tente criar/visualizar dados

---

## 🆘 PROBLEMAS?

### Site não carrega
1. Verifique se os arquivos foram enviados para `/home/HugoGandy/web/equipcasa.com.br/public_html`
2. Verifique permissões dos arquivos (devem ser 644)

### Backend não funciona
```bash
pm2 logs gestao-vendas
```
Veja os erros nos logs

### Banco não conecta
1. Verifique o arquivo `.env` no backend
2. Confirme que as credenciais do banco estão corretas
3. Verifique se o SQL foi importado com sucesso

---

## 📞 COMANDOS ÚTEIS

```bash
# Ver logs do backend
pm2 logs gestao-vendas

# Reiniciar backend
pm2 restart gestao-vendas

# Ver status
pm2 status

# Ver logs do Nginx
tail -f /var/log/nginx/error.log
```

---

## ✨ PRONTO!

Após seguir todos os passos, o sistema estará rodando em:

🌐 **https://equipcasa.com.br**

---

**Última atualização:** 2025-12-05 23:51
