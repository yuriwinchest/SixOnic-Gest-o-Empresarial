<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SixOnic - Sistema de Gestão Empresarial

Sistema completo de gestão empresarial com integração Neon Database e deploy na Vercel.

## 🚀 Tecnologias

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express (API Routes)
- **Banco de Dados:** PostgreSQL (Neon)
- **Deploy:** Vercel
- **UI:** Lucide React + Recharts

## 📋 Pré-requisitos

- Node.js 18+
- Conta no GitHub
- Conta na Vercel
- Conta no Neon (PostgreSQL)

## 🔧 Instalação Local

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd SixOnic-Gest-o-Empresarial
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Neon Database.

### 4. Execute localmente
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 🌐 Deploy na Vercel

### Método Rápido
Siga as instruções detalhadas em **[RESUMO_DEPLOY.md](RESUMO_DEPLOY.md)**

### Passos Resumidos:
1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

📖 **Documentação completa:** [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)

## 🗄️ Estrutura do Banco de Dados

O sistema cria automaticamente as seguintes tabelas:
- `company_settings` - Configurações da empresa
- `store_settings` - Configurações da loja virtual
- `margin_rules` - Regras de margem
- `cost_centers` - Centros de custo
- `payment_methods` - Formas de pagamento
- `clients` - Clientes e fornecedores
- `employees` - Funcionários
- `products` - Produtos
- `sales` - Vendas
- `quotes` - Orçamentos
- `checklists` - Checklists
- `work_orders` - Ordens de serviço
- `transactions` - Transações financeiras
- `client_purchases` - Compras de clientes
- `contract_templates` - Modelos de contrato
- `contracts` - Contratos gerados

### Inicializar Banco de Dados
Acesse: `https://seu-projeto.vercel.app/api/setup`

## 📁 Estrutura do Projeto

```
SixOnic-Gest-o-Empresarial/
├── api/                    # Backend API
│   ├── db.ts              # Configuração do banco
│   ├── setup.ts           # Setup das tabelas
│   ├── state.ts           # Gerenciamento de estado
│   └── actions.ts         # Ações do sistema
├── components/            # Componentes React
├── services/             # Serviços
├── .env                  # Variáveis de ambiente (não commitado)
├── .env.example          # Template de variáveis
├── vercel.json           # Configuração Vercel
└── vite.config.ts        # Configuração Vite
```

## 🔐 Segurança

- ✅ Credenciais protegidas em variáveis de ambiente
- ✅ `.env` no `.gitignore`
- ✅ SSL/TLS habilitado para conexões com banco
- ✅ Validação de variáveis de ambiente

## 📊 Monitoramento

- **Vercel Dashboard:** Métricas e logs
- **Neon Console:** Queries e performance do banco

## 🐛 Troubleshooting

Veja a seção de troubleshooting em [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)

## 📝 Licença

Propriedade de SixOnic

## 🆘 Suporte

Para problemas:
1. Verifique os logs da Vercel
2. Verifique o Neon Dashboard
3. Consulte a documentação de deploy

---

**Desenvolvido com ❤️ usando React + Vite + Neon**
