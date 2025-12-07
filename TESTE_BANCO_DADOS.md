# 🎯 RESUMO: TESTE DE CONEXÃO COM BANCO DE DADOS

## ✅ Status Atual

### Sistema Rodando
- **Frontend**: http://localhost:5173 ✅
- **Backend**: http://localhost:3001 ✅
- **Página de Login**: Carregada com sucesso ✅

### Configuração do Banco
- **Tipo**: MySQL (phpMyAdmin)
- **Host**: 161.97.124.179 (VPS)
- **Porta**: 3306
- **Usuário**: ver8wdgr_root-14
- **Database**: ver8wdgr_root-14

## ⚠️ Problema Identificado

**CONEXÃO COM BANCO BLOQUEADA**
- Erro: `ETIMEDOUT`
- Causa: Firewall da VPS bloqueia conexões externas na porta 3306
- Impacto: Sistema não consegue salvar dados no banco

## 🔧 SOLUÇÕES

### Opção 1: Túnel SSH (RECOMENDADO - Mais Seguro)

#### Passo 1: Abrir Túnel
Abra um **NOVO terminal PowerShell** e execute:

```powershell
ssh -L 3306:127.0.0.1:3306 deploy@161.97.124.179 -N
```

Ou com chave SSH:
```powershell
ssh -i C:\Users\yuriv\.ssh\deploy_auto_key -L 3306:127.0.0.1:3306 HugoGabriel@161.97.124.179 -N
```

#### Passo 2: Atualizar Configuração
Edite o arquivo `.env` e adicione:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
```

#### Passo 3: Reiniciar Sistema
No terminal onde está rodando `npm run dev`, pressione `Ctrl+C` e execute novamente:
```powershell
npm run dev
```

---

### Opção 2: Liberar Porta no Firewall (Menos Seguro)

#### Via Painel Hestia
1. Acesse: https://161.97.124.179:8083
2. Vá em **Firewall**
3. Adicione regra para porta **3306**
4. Protocolo: **TCP**
5. Ação: **ACCEPT**

#### Via SSH (se tiver acesso root)
```bash
ssh root@161.97.124.179
ufw allow 3306/tcp
ufw reload
```

---

### Opção 3: Usar SQLite Local (Para Desenvolvimento)

#### Passo 1: Trocar Servidor
Edite `package.json`, linha 7:
```json
"server": "node server/index-sqlite.js",
```

#### Passo 2: Reiniciar
```powershell
npm run dev
```

Isso criará um arquivo `database.sqlite` local para testes.

---

## 🧪 TESTAR CONEXÃO

### Teste Rápido
```powershell
node test-db-simple.js
```

**Resultado esperado:**
```
✅ CONECTADO COM SUCESSO!
✅ Query teste OK: 2
✅ Tabelas encontradas: X
```

---

## 📝 PRÓXIMOS PASSOS

### 1. Criar Tabelas no Banco
Acesse no navegador:
```
http://localhost:3001/api/setup
```

Você deve ver:
```json
{"message": "Tabelas criadas/atualizadas com sucesso (MySQL)!"}
```

### 2. Verificar Estado do Sistema
```
http://localhost:3001/api/state
```

### 3. Testar Criação de Cliente

#### Via Interface (Frontend)
1. Abra: http://localhost:5173
2. Faça login
3. Vá em **Clientes**
4. Clique em **Novo Cliente**
5. Preencha os dados
6. Salve

#### Via API (Teste Direto)
Use Postman ou curl:
```bash
curl -X POST http://localhost:3001/api/actions \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_client",
    "data": {
      "id": "test-123",
      "type": "fisica",
      "name": "Cliente Teste",
      "cpf": "123.456.789-00",
      "email": "teste@example.com",
      "phone": "(11) 98765-4321",
      "blocked": false,
      "address": {
        "street": "Rua Teste",
        "number": "123",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01234-567"
      }
    }
  }'
```

### 4. Verificar se Salvou
```
http://localhost:3001/api/clients
```

Ou no phpMyAdmin:
```
https://161.97.124.179/phpmyadmin
```

---

## 🐛 TROUBLESHOOTING

### Erro: "ETIMEDOUT"
- ✅ Solução: Use túnel SSH (Opção 1)

### Erro: "ECONNREFUSED"
- ❌ Túnel SSH não está ativo
- ✅ Solução: Abra o túnel conforme Opção 1

### Erro: "ER_ACCESS_DENIED_ERROR"
- ❌ Usuário ou senha incorretos
- ✅ Solução: Verifique credenciais no `.env`

### Erro: "ER_BAD_DB_ERROR"
- ❌ Banco de dados não existe
- ✅ Solução: Crie o banco no phpMyAdmin

### Sistema não salva dados
- ❌ Conexão com banco não está funcionando
- ✅ Solução: Execute `node test-db-simple.js` para diagnosticar

---

## 📊 ARQUIVOS CRIADOS

- `test-db-simple.js` - Teste rápido de conexão
- `test-mysql-connection.js` - Teste completo com diagnóstico
- `test-database.js` - Teste com operações CRUD
- `server/db-sqlite.js` - Configuração SQLite (alternativa)
- `server/index-sqlite.js` - Servidor com SQLite (alternativa)
- `abrir-tunel-mysql.ps1` - Script para abrir túnel SSH
- `abrir-tunel-mysql-v2.ps1` - Script melhorado com diagnóstico

---

## ✅ CHECKLIST

- [x] Sistema rodando localmente (npm run dev)
- [x] Frontend acessível (http://localhost:5173)
- [x] Backend acessível (http://localhost:3001)
- [ ] Conexão com banco funcionando
- [ ] Tabelas criadas no banco
- [ ] Teste de criação de cliente bem-sucedido

---

## 🎯 RECOMENDAÇÃO

**Use a Opção 1 (Túnel SSH)** - É a mais segura e não requer alterações no firewall da VPS.

1. Abra túnel SSH em um novo terminal
2. Mantenha o túnel aberto
3. Execute `npm run dev` em outro terminal
4. Teste criar um cliente no sistema

**Tempo estimado**: 5 minutos
