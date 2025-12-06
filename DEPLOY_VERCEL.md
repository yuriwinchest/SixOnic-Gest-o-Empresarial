# 🚀 Guia de Deploy na Vercel com Neon Database

## 📋 Pré-requisitos
- Conta na Vercel
- Conta no Neon (já configurada)
- Git instalado
- Repositório no GitHub

## 🔧 Passo 1: Preparar o Código

### 1.1 Verificar arquivos criados
Os seguintes arquivos foram criados/atualizados:
- ✅ `.env` - Variáveis de ambiente locais (NÃO será commitado)
- ✅ `.env.example` - Template de variáveis (será commitado)
- ✅ `.gitignore` - Atualizado para ignorar `.env`
- ✅ `vercel.json` - Configuração da Vercel
- ✅ `api/db.ts` - Removidas credenciais hardcoded

### 1.2 Testar localmente
```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

## 📤 Passo 2: Subir para o GitHub

```bash
# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "feat: configuração Vercel + Neon database"

# Enviar para o GitHub
git push origin main
```

**⚠️ IMPORTANTE:** O arquivo `.env` NÃO será enviado ao GitHub (está no `.gitignore`)

## 🌐 Passo 3: Deploy na Vercel

### 3.1 Importar Projeto
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Selecione seu repositório do GitHub
4. Clique em **"Import"**

### 3.2 Configurar Variáveis de Ambiente
**ANTES de fazer o deploy**, configure as variáveis de ambiente:

1. Na página de configuração do projeto, vá para **"Environment Variables"**
2. Adicione as seguintes variáveis (copie do seu arquivo `.env`):

```
DATABASE_URL = postgresql://neondb_owner:npg_wLWz3katJn2P@ep-falling-night-ahvabkur-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL = postgresql://neondb_owner:npg_wLWz3katJn2P@ep-falling-night-ahvabkur-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL_NON_POOLING = postgresql://neondb_owner:npg_wLWz3katJn2P@ep-falling-night-ahvabkur.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_USER = neondb_owner

POSTGRES_HOST = ep-falling-night-ahvabkur-pooler.c-3.us-east-1.aws.neon.tech

POSTGRES_PASSWORD = npg_wLWz3katJn2P

POSTGRES_DATABASE = neondb

POSTGRES_PRISMA_URL = postgresql://neondb_owner:npg_wLWz3katJn2P@ep-falling-night-ahvabkur-pooler.c-3.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
```

**Opcional (se usar Neon Auth):**
```
NEXT_PUBLIC_STACK_PROJECT_ID = d65cefaa-5fc4-41ca-ac2e-6bdc5923f572
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY = pck_dvtmtn959k0vmc3j4r74sgya1crdt5km47y4y6t5jnbfg
STACK_SECRET_SERVER_KEY = ssk_xp3qwecexjx0n1bc54regm3wxzh42fk3dkhv415nzyvag
```

### 3.3 Configurações de Build
A Vercel deve detectar automaticamente:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3.4 Deploy
1. Clique em **"Deploy"**
2. Aguarde o build completar (2-5 minutos)
3. Acesse a URL fornecida pela Vercel

## 🔍 Passo 4: Verificar Conexão com Banco

### 4.1 Testar API
Após o deploy, teste se a API está funcionando:
```
https://seu-projeto.vercel.app/api/setup
```

Se retornar `{ "message": "Tabelas criadas/atualizadas com sucesso!" }`, está tudo OK! ✅

### 4.2 Verificar Logs
Se houver erro:
1. Vá para o Dashboard da Vercel
2. Clique no seu projeto
3. Vá em **"Functions"** → Selecione a função com erro
4. Veja os logs para identificar o problema

## 🐛 Troubleshooting

### Erro: "DATABASE_URL environment variable is not set"
**Solução:** Verifique se você adicionou as variáveis de ambiente na Vercel (Passo 3.2)

### Erro: "connection timeout"
**Solução:** 
1. Verifique se o IP da Vercel está permitido no Neon
2. Neon geralmente permite todas as conexões por padrão
3. Verifique se a string de conexão está correta

### Erro: "SSL connection required"
**Solução:** Certifique-se de que a URL do banco tem `?sslmode=require` no final

### Dados não aparecem
**Solução:**
1. Acesse `https://seu-projeto.vercel.app/api/setup` para criar as tabelas
2. Verifique os logs da Vercel
3. Teste a conexão diretamente no Neon Dashboard

## 📊 Monitoramento

### Vercel Analytics
- Acesse o Dashboard da Vercel
- Veja métricas de performance e erros

### Neon Dashboard
- Acesse [console.neon.tech](https://console.neon.tech)
- Monitore queries e conexões ativas

## 🔄 Atualizações Futuras

Para fazer updates:
```bash
# Fazer alterações no código
git add .
git commit -m "descrição das mudanças"
git push origin main
```

A Vercel fará o deploy automático! 🎉

## 📝 Checklist Final

- [ ] Arquivo `.env` criado localmente
- [ ] `.gitignore` atualizado
- [ ] Código testado localmente
- [ ] Código enviado para GitHub
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy realizado com sucesso
- [ ] API `/api/setup` testada
- [ ] Aplicação funcionando corretamente

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs da Vercel
2. Verifique o Neon Dashboard
3. Teste a conexão localmente primeiro
4. Verifique se todas as variáveis de ambiente estão corretas

**Boa sorte com o deploy! 🚀**
