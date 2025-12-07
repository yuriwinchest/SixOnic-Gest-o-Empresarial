# 🚀 RESUMO: DEPLOY NA VPS - EQUIPCASA.COM.BR

## ⚠️ SITUAÇÃO ATUAL

- ✅ Build do frontend está funcionando
- ✅ Chave SSH existe: `C:\Users\yuriv\.ssh\deploy_auto_key`
- ❌ Usuário **HugoGandy** NÃO tem SSH configurado
- ℹ️ O domínio `equipcasa.com.br` pertence ao usuário **HugoGandy**

**Erro atual:** `Permission denied (publickey,password)`

---

## 🎯 OPÇÃO 1: CONFIGURAR SSH (RECOMENDADO)

### Por que fazer isso?
- Deploy automatizado em segundos
- Atualizações rápidas
- Reiniciar serviços remotamente

### Como fazer:

1. **Acesse o painel:**
   - URL: https://server.equipcasa.com.br:8083
   - Login com credenciais do HugoGandy

2. **Configure SSH:**
   - Users → Edit HugoGandy
   - **SSH Access:** Mude para `bash`
   - **SSH Keys:** Cole a chave:
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDnagU59F8njYO2lFndFbXkYpwI2iuImB+41sjcghwl2 yuriv@dim
   ```
   - Salve

3. **Teste a conexão:**
   ```powershell
   .\testar-ssh-hugo.ps1
   ```

4. **Execute o deploy:**
   ```powershell
   .\deploy-completo-hugo.ps1
   ```

**Tempo total:** ~2 minutos para configurar + deploy automático

---

## 🎯 OPÇÃO 2: DEPLOY MANUAL (FUNCIONA AGORA)

Se você não quiser configurar SSH agora, pode fazer upload manual:

### Passo 1: Build Local
```powershell
npm run build
```

### Passo 2: Acessar Painel
- URL: https://server.equipcasa.com.br:8083
- Login: HugoGandy
- Senha: (use a senha do painel)

### Passo 3: Upload Frontend
**Via File Manager:**
- Local: `dist\*` (todos os arquivos da pasta dist)
- Remoto: `/home/HugoGandy/web/equipcasa.com.br/public_html/`

### Passo 4: Upload Backend
**Via File Manager:**
- Local: `server\index.js`
- Remoto: `/home/HugoGandy/gestao-vendas/backend/index.js`

- Local: `server\db.js`
- Remoto: `/home/HugoGandy/gestao-vendas/backend/db.js`

- Local: `server\sql.js`
- Remoto: `/home/HugoGandy/gestao-vendas/backend/sql.js`

- Local: `package.json`
- Remoto: `/home/HugoGandy/gestao-vendas/backend/package.json`

- Local: `.env.production`
- Remoto: `/home/HugoGandy/gestao-vendas/backend/.env`

### Passo 5: Configurar Backend
**Via Terminal SSH do painel:**
```bash
cd /home/HugoGandy/gestao-vendas/backend
npm install --production
pm2 delete all
pm2 start index.js --name gestao-vendas
pm2 save
pm2 status
```

### Passo 6: Importar Banco de Dados
**Via phpMyAdmin no painel:**
1. Selecione o banco de dados
2. Clique em "Importar"
3. Faça upload de `tabelas_sistema.sql`
4. Execute

### Passo 7: Testar
- Site: https://equipcasa.com.br
- API: https://equipcasa.com.br/api/health

**Tempo total:** ~15-20 minutos

---

## 📊 COMPARAÇÃO

| Aspecto | SSH Configurado | Manual |
|---------|----------------|--------|
| Tempo de setup inicial | 2 min | 0 min |
| Tempo de deploy | 30 seg | 15-20 min |
| Próximos deploys | 30 seg | 15-20 min |
| Automação | ✅ Total | ❌ Nenhuma |
| Recomendado para | Produção | Teste único |

---

## 🎬 PRÓXIMOS PASSOS

### Se escolheu OPÇÃO 1 (SSH):
1. Configure SSH no painel (2 min)
2. Execute: `.\testar-ssh-hugo.ps1`
3. Se OK, execute: `.\deploy-completo-hugo.ps1`
4. Importe o banco de dados via phpMyAdmin
5. Teste o site

### Se escolheu OPÇÃO 2 (Manual):
1. Execute: `npm run build`
2. Acesse o painel
3. Faça upload dos arquivos (siga Passo 3 e 4 acima)
4. Configure backend via Terminal SSH (Passo 5)
5. Importe banco de dados (Passo 6)
6. Teste o site (Passo 7)

---

## 📁 ARQUIVOS CRIADOS

- `deploy-completo-hugo.ps1` - Deploy automatizado (requer SSH)
- `testar-ssh-hugo.ps1` - Testa conexão SSH
- `CONFIGURAR_SSH_HUGO.md` - Guia detalhado SSH
- `DEPLOY_VPS_HUGO.md` - Guia completo de deploy
- `deploy-winscp.bat` - Deploy via WinSCP (alternativa)

---

## 💡 RECOMENDAÇÃO

**Configure o SSH!** Vai economizar muito tempo em futuros deploys. É só 2 minutos de configuração uma única vez. 😊

---

## 🆘 PRECISA DE AJUDA?

1. Para configurar SSH: Leia `CONFIGURAR_SSH_HUGO.md`
2. Para deploy manual: Siga OPÇÃO 2 acima
3. Para testar SSH: Execute `.\testar-ssh-hugo.ps1`

---

**Última atualização:** 2025-12-05 23:48
