# 🚀 Desenvolvimento Local vs Produção

## 📋 Como Funciona

Este projeto usa **arquitetura serverless** com Vercel, o que significa:

### 🏠 **Desenvolvimento Local (npm run dev)**

- ✅ **Frontend funciona** normalmente
- ⚠️ **Backend NÃO funciona** (rotas `/api/*`)
- 🔄 **Usa dados MOCK** automaticamente
- 💾 **Dados salvos apenas em memória** (perdem ao recarregar)

**Isso é NORMAL!** O backend só funciona na Vercel.

### 🌐 **Produção (Vercel)**

- ✅ **Frontend funciona**
- ✅ **Backend funciona** (rotas `/api/*`)
- ✅ **Conecta ao Neon Database**
- 💾 **Dados persistem** no banco

---

## 🔧 Desenvolvimento Local

### Iniciar o projeto:
```bash
npm run dev
```

### O que você verá:
```
⚠️ Backend não disponível (normal em desenvolvimento local). Usando dados mock.
DB Status: Modo Offline
```

**Isso é esperado!** Você pode:
- ✅ Testar toda a interface
- ✅ Navegar entre páginas
- ✅ Adicionar/editar dados (temporariamente)
- ❌ Dados NÃO são salvos no banco

---

## 🌐 Testar com Banco de Dados

Para testar com o banco de dados real, você precisa:

### Opção 1: Deploy na Vercel
```bash
git add .
git commit -m "suas mudanças"
git push origin main
```
Aguarde o deploy automático e teste em: `https://seu-projeto.vercel.app`

### Opção 2: Vercel CLI (Avançado)
```bash
npm install -g vercel
vercel dev
```
Isso simula o ambiente Vercel localmente.

---

## 📁 Estrutura do Projeto

```
SixOnic-Gest-o-Empresarial/
├── api/                    # Backend (só funciona na Vercel)
│   ├── db.ts              # Conexão com Neon
│   ├── state.ts           # GET /api/state
│   ├── actions.ts         # POST /api/actions
│   └── setup.ts           # GET /api/setup
├── components/            # Componentes React
├── App.tsx                # App principal
└── index.tsx              # Entry point
```

---

## ⚠️ Avisos Comuns (NORMAIS)

### Console do Navegador:
```
⚠️ Backend não disponível (normal em desenvolvimento local). Usando dados mock.
```
**Solução:** Ignore. É esperado em desenvolvimento local.

### Status na Interface:
```
🔴 Modo Offline
```
**Solução:** Ignore. Conectará automaticamente na Vercel.

---

## ✅ Workflow Recomendado

### 1. Desenvolvimento Local
```bash
npm run dev
```
- Desenvolva a interface
- Teste funcionalidades
- Ajuste estilos

### 2. Build Local
```bash
npm run build
```
- **SEMPRE** rode antes de fazer push
- Garante que não há erros de compilação

### 3. Deploy
```bash
git add .
git commit -m "descrição"
git push origin main
```
- Deploy automático na Vercel
- Teste com banco de dados real

---

## 🐛 Troubleshooting

### "Failed to connect to backend"
✅ **Normal em desenvolvimento local**  
❌ **Problema na Vercel** - Verifique variáveis de ambiente

### "Dados não salvam"
✅ **Normal em desenvolvimento local** (usa mock)  
❌ **Problema na Vercel** - Verifique conexão com Neon

### "Tela azul vazia"
❌ **Erro de JavaScript** - Veja console do navegador  
❌ **Erro de build** - Rode `npm run build` localmente

---

## 📚 Documentação Adicional

- **Deploy:** `DEPLOY_VERCEL.md`
- **Configuração:** `VERCEL_CONFIG.md`
- **Comandos:** `COMANDOS_DEPLOY.txt`

---

**Desenvolvido com ❤️ usando React + Vite + Vercel + Neon**
