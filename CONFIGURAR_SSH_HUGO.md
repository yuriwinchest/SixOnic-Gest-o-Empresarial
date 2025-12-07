# 🔑 CONFIGURAR SSH PARA HUGOGANDY

## ⚠️ PROBLEMA IDENTIFICADO

O deploy está falhando porque o usuário **HugoGandy** não tem a chave SSH configurada.

**Erro:** `Permission denied (publickey,password)`

## ✅ SOLUÇÃO: Configurar SSH no Painel

### Passo 1: Acessar o Painel
1. Acesse: **https://server.equipcasa.com.br:8083**
2. Faça login com as credenciais do HugoGandy

### Passo 2: Configurar o Usuário HugoGandy
1. No painel, vá em **Users** (Usuários)
2. Clique em **Edit** (Editar) no usuário **HugoGandy**
3. Procure a seção **SSH Access**

### Passo 3: Habilitar SSH e Adicionar Chave
Configure os seguintes campos:

**SSH Access:** Altere de `nologin` para `bash`

**SSH Keys:** Cole a chave pública abaixo:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDnagU59F8njYO2lFndFbXkYpwI2iuImB+41sjcghwl2 yuriv@dim
```

### Passo 4: Salvar
Clique em **Save** (Salvar)

---

## 🚀 APÓS CONFIGURAR

Assim que você configurar o SSH, execute o deploy novamente:

```powershell
.\deploy-completo-hugo.ps1
```

---

## 🔍 VERIFICAR SE FUNCIONOU

Teste a conexão SSH:

```powershell
ssh -i C:\Users\yuriv\.ssh\deploy_auto_key HugoGandy@161.97.124.179 "echo 'SSH funcionando!'"
```

Se aparecer "SSH funcionando!", está tudo certo!

---

## 📝 ALTERNATIVA: Deploy Manual

Se preferir fazer o deploy manualmente enquanto configura o SSH:

### 1. Build Local
```powershell
npm run build
```

### 2. Upload via Painel
1. Acesse o File Manager no painel
2. Navegue até `/home/HugoGandy/web/equipcasa.com.br/public_html`
3. Faça upload de todos os arquivos da pasta `dist`

### 3. Upload Backend
1. Navegue até `/home/HugoGandy/gestao-vendas/backend`
2. Faça upload dos arquivos:
   - `server/index.js`
   - `server/db.js`
   - `server/sql.js`
   - `package.json`
   - `.env.production` (renomeie para `.env`)

### 4. Configurar Backend via Terminal SSH do Painel
```bash
cd /home/HugoGandy/gestao-vendas/backend
npm install --production
pm2 delete all
pm2 start index.js --name gestao-vendas
pm2 save
pm2 status
```

### 5. Importar Banco de Dados
1. Acesse phpMyAdmin no painel
2. Importe o arquivo `tabelas_sistema.sql`

---

## 💡 DICA

A configuração do SSH é **ESSENCIAL** para:
- Deploy automatizado
- Atualizações rápidas
- Reiniciar serviços remotamente
- Verificar logs

Vale a pena configurar! 😊
