import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, Package, DollarSign, Menu, X, Bell, Users, LogOut, CheckSquare, ShoppingCart, Briefcase, Settings as SettingsIcon, FileCheck } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WorkOrders from './components/WorkOrders';
import Inventory from './components/Inventory';
import Finance from './components/Finance';
import Clients from './components/Clients';
import Employees from './components/Employees';
import Login from './components/Login';
import ClientPortal from './components/ClientPortal';
import EmployeePortal from './components/EmployeePortal';
import Checklists from './components/Checklists';
import Sales from './components/Sales';
import Settings from './components/Settings';
import Contracts from './components/Contracts';
import { AppState, Tab, Product, WorkOrder, Transaction, OSTatus, TransactionType, Client, AuthState, ClientPurchase, Checklist, Sale, Quote, Employee, CompanySettings, MarginRule, CostCenter, Contract, PaymentMethod, ContractTemplate } from './types';

// Mock Data
const INITIAL_STATE: AppState = {
  companySettings: {
    name: 'Nexus Automotive Ltda',
    cnpj: '00.000.000/0001-00',
    ie: '123.456.789.000',
    email: 'contato@nexus.com',
    phone: '(11) 9999-9999',
    logo: null,
    address: {
      cep: '01001-000',
      rua: 'Av. Paulista',
      cidade: 'São Paulo',
      bairro: 'Bela Vista',
      endereco: 'Av. Paulista, 1000',
      complemento: 'Conj 101',
      uf: 'SP'
    },
    standardPriceTable: 'Varejo',
    discountLevels: [
      { id: '1', label: 'Gerência', maxDiscount: 20, color: '#10b981' }, // Green
      { id: '2', label: 'Supervisão', maxDiscount: 15, color: '#3b82f6' }, // Blue
      { id: '3', label: 'Vendedor Pleno', maxDiscount: 10, color: '#f59e0b' }, // Amber
      { id: '4', label: 'Balcão', maxDiscount: 5, color: '#ef4444' }, // Red
    ],
    documentSequences: {
      workOrder: { prefix: 'OS-', nextNumber: 1026 },
      sale: { prefix: 'VEN-', nextNumber: 100 },
      quote: { prefix: 'ORC-', nextNumber: 100 }
    },
    quoteValidityDays: 15,
    autoDeleteExpiredQuotes: false,
    serviceCommission: 10,
    autoMessageSettings: {
      sendOnSale: true,
      sendOnQuote: true,
      sendOnBilling: false
    },
    osFooterText: 'Agradecemos a preferência! Serviços com garantia legal de 90 dias.',
    defaultWarrantyText: 'Garantia válida contra defeitos de fabricação e mão de obra.',
    termsText: '1. O orçamento é válido pelo prazo estipulado.\n2. Pagamentos em atraso estão sujeitos a juros.\n3. A garantia não cobre mau uso.'
  },
  storeSettings: {
    storeName: 'Nexus Loja Virtual',
    heroSlides: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2898&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2832&auto=format&fit=crop'
    ],
    sidebarSlides: [
      'https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?q=80&w=1587&auto=format&fit=crop'
    ]
  },
  marginRules: [
    { id: '1', name: 'Varejo', percentage: 100 },
    { id: '2', name: 'Atacado', percentage: 40 },
  ],
  costCenters: [
    { id: '1', name: 'Aluguel', type: 'Fixo', description: 'Aluguel da sede principal' },
    { id: '2', name: 'Energia Elétrica', type: 'Variável', description: 'Conta de luz mensal' },
    { id: '3', name: 'Fornecedores Peças', type: 'Variável', description: 'Compra de estoque' },
    { id: '4', name: 'Salários Administrativos', type: 'Fixo', description: 'Folha de pagamento fixa' },
  ],
  paymentMethods: [
    { id: '1', name: 'Dinheiro', type: 'Dinheiro', feePercentage: 0 },
    { id: '2', name: 'Pix', type: 'Pix', feePercentage: 0 },
    { id: '3', name: 'Cartão de Crédito 1x', type: 'Cartão de Crédito', feePercentage: 3.5 },
    { id: '4', name: 'Cartão de Crédito Parcelado', type: 'Cartão de Crédito', feePercentage: 5.0 },
    { id: '5', name: 'Cartão de Débito', type: 'Cartão de Débito', feePercentage: 1.5 },
    { id: '6', name: 'Entrada em Dinheiro', type: 'Entrada', feePercentage: 0 },
  ],
  contractTemplates: [
    {
      id: 'TPL-001',
      name: 'Contrato Padrão de Serviços',
      content: `
      <div style="font-family: 'Times New Roman', serif; line-height: 1.6; color: #1a1a1a;">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 40px; font-size: 18px; border-bottom: 2px solid #000; padding-bottom: 10px;">Contrato de Prestação de Serviços e Venda de Produtos</h2>
        
        <p style="text-align: justify;"><strong>CONTRATANTE:</strong> {CLIENTE}, inscrito(a) no CPF/CNPJ sob nº {DOC_CLIENTE}, residente e domiciliado(a) em {ENDERECO_CLIENTE}.</p>
        
        <p style="text-align: justify;"><strong>CONTRATADA:</strong> {EMPRESA}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº {CNPJ_EMPRESA}, sediada em {ENDERECO_EMPRESA}.</p>
        
        <p style="text-align: justify;">As partes acima identificadas têm, entre si, justo e acertado o presente Contrato, que se regerá pelas cláusulas seguintes:</p>
        
        <h4 style="margin-top: 20px; font-size: 14px; text-transform: uppercase;">1. DO OBJETO</h4>
        <p style="text-align: justify;">Cláusula 1ª. O presente contrato tem como objeto a venda de produtos e/ou prestação de serviços descritos no Orçamento nº <strong>{ID_ORCAMENTO}</strong>, conforme detalhamento abaixo:</p>
        
        <div style="margin: 20px 0;">
          {LISTA_ITENS}
        </div>

        <h4 style="margin-top: 20px; font-size: 14px; text-transform: uppercase;">2. DO VALOR E FORMA DE PAGAMENTO</h4>
        <p style="text-align: justify;">Cláusula 2ª. O CONTRATANTE pagará à CONTRATADA o valor total de <strong>R$ {VALOR_TOTAL}</strong>.</p>
        <p style="text-align: justify;">Parágrafo único. O pagamento será efetuado conforme acordado no orçamento aprovado.</p>

        <h4 style="margin-top: 20px; font-size: 14px; text-transform: uppercase;">3. DO PRAZO</h4>
        <p style="text-align: justify;">Cláusula 3ª. Os serviços ou entrega dos produtos serão realizados até a data de <strong>{DATA_VALIDADE}</strong>, salvo motivos de força maior alheios à vontade da CONTRATADA.</p>

        <h4 style="margin-top: 20px; font-size: 14px; text-transform: uppercase;">4. DA GARANTIA</h4>
        <p style="text-align: justify;">Cláusula 4ª. A garantia dos serviços e produtos segue as normas do Código de Defesa do Consumidor (90 dias para bens duráveis).</p>

        <h4 style="margin-top: 20px; font-size: 14px; text-transform: uppercase;">5. DO FORO</h4>
        <p style="text-align: justify;">Cláusula 5ª. Para dirimir quaisquer controvérsias oriundas do CONTRATO, as partes elegem o foro da comarca de {CIDADE_EMPRESA}.</p>

        <br/><br/>
        <p style="text-align: center;">{DATA_EXTENSO}.</p>
        
        <br/><br/><br/><br/>
        <div style="display: flex; justify-content: space-between; gap: 40px;">
           <div style="flex: 1; text-align: center; border-top: 1px solid #000; padding-top: 10px;">
              <strong>{EMPRESA}</strong><br/>
              CONTRATADA
           </div>
           <div style="flex: 1; text-align: center; border-top: 1px solid #000; padding-top: 10px;">
              <strong>{CLIENTE}</strong><br/>
              CONTRATANTE
           </div>
        </div>
      </div>`
    },
    {
      id: 'TPL-002',
      name: 'Termo de Garantia Simplificado',
      content: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px double #333;">
        <h1 style="text-align: center; color: #b91c1c;">TERMO DE GARANTIA</h1>
        
        <p>A empresa <strong>{EMPRESA}</strong> assegura ao cliente <strong>{CLIENTE}</strong> a garantia sobre os produtos e serviços listados abaixo, referentes ao Orçamento <strong>#{ID_ORCAMENTO}</strong>.</p>
        
        <hr/>
        {LISTA_ITENS}
        <hr/>

        <h3>Condições de Validade:</h3>
        <ul>
          <li>A garantia é válida por 90 dias a partir de <strong>{DATA_HOJE}</strong>.</li>
          <li>Não cobre danos causados por mau uso, acidentes ou desgaste natural.</li>
          <li>A apresentação deste termo é obrigatória para solicitação de reparos.</li>
        </ul>

        <p style="margin-top: 30px; text-align: center; font-style: italic;">{CIDADE_EMPRESA}, {DATA_EXTENSO}.</p>
      </div>
      `
    }
  ],
  products: [
    { 
      id: 'PRD-001', 
      name: 'Óleo de Motor 5W30', 
      category: 'Óleos', 
      brand: 'Castrol', 
      model: 'Magnatec', 
      ncm: '2710.19.32', 
      price: 45.00, 
      cost: 22.50, 
      profitMargin: 100, 
      stock: 12, 
      minStock: 20,
      warrantyDays: 90,
      images: ['https://images.unsplash.com/photo-1648242283559-4c6a044b9c8d?q=80&w=2574&auto=format&fit=crop'],
      showInStore: true
    },
    { 
      id: 'PRD-002', 
      name: 'Filtro de Ar Universal', 
      category: 'Peças', 
      brand: 'Fram', 
      model: 'CA1029', 
      price: 35.00, 
      cost: 10.00, 
      profitMargin: 250, 
      stock: 50, 
      minStock: 10,
      warrantyDays: 90,
      images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2832&auto=format&fit=crop'],
      showInStore: true
    },
    { 
      id: 'PRD-003', 
      name: 'Pastilha de Freio', 
      category: 'Peças', 
      brand: 'Bosch', 
      model: 'Cerâmica', 
      price: 120.00, 
      cost: 60.00, 
      profitMargin: 100, 
      stock: 4, 
      minStock: 8,
      warrantyDays: 180,
      images: [],
      showInStore: false
    },
    { 
      id: 'PRD-004', 
      name: 'Lâmpada LED H4', 
      category: 'Acessórios', 
      brand: 'Philips', 
      model: 'Ultinon', 
      price: 80.00, 
      cost: 40.00, 
      profitMargin: 100, 
      stock: 30, 
      minStock: 10,
      warrantyDays: 365,
      images: ['https://images.unsplash.com/photo-1612831661881-5d3410b536a2?q=80&w=2787&auto=format&fit=crop'],
      showInStore: true
    },
  ],
  workOrders: [
    { 
      id: 'OS-1023', 
      clientId: 'CLI-001', 
      clientName: 'Roberto Almeida', 
      description: 'Troca de óleo e revisão de freios', 
      status: OSTatus.IN_PROGRESS, 
      dateCreated: '2023-10-25', 
      dateStart: '2023-10-26',
      totalValue: 250.00, 
      laborValue: 100.00,
      priority: 'Alta', 
      technician: 'João Mecânico',
      paymentStatus: 'Pendente',
      products: [
        { productId: 'PRD-001', productName: 'Óleo de Motor 5W30', quantity: 3, unitPrice: 45.00, total: 135.00 }
      ]
    },
    { 
      id: 'OS-1024', 
      clientId: 'CLI-002', 
      clientName: 'Ana Clara Silva', 
      description: 'Instalação de som automotivo', 
      status: OSTatus.PENDING, 
      dateCreated: '2023-10-26', 
      totalValue: 500.00, 
      laborValue: 500.00,
      priority: 'Média', 
      technician: '',
      paymentStatus: 'Pendente',
      products: []
    },
    { 
      id: 'OS-1025', 
      clientId: 'CLI-001', 
      clientName: 'Roberto Almeida', 
      description: 'Manutenção preventiva frota', 
      status: OSTatus.COMPLETED, 
      dateCreated: '2023-10-20', 
      dateStart: '2023-10-21',
      dateEnd: '2023-10-22',
      totalValue: 1200.00, 
      laborValue: 800.00,
      priority: 'Média', 
      technician: 'Pedro Elétrica',
      paymentStatus: 'Pago',
      products: []
    },
  ],
  transactions: [
    { id: 'TR-1', description: 'Pagamento OS-1025', amount: 1200.00, type: TransactionType.INCOME, date: '2023-10-20', category: 'Serviços' },
    { id: 'TR-2', description: 'Compra de Peças Fornecedor A', amount: 450.00, type: TransactionType.EXPENSE, date: '2023-10-22', category: 'Fornecedores' },
    { id: 'TR-3', description: 'Conta de Energia', amount: 280.00, type: TransactionType.EXPENSE, date: '2023-10-25', category: 'Contas' },
    { id: 'TR-4', description: 'Venda Balcão - Óleo', amount: 90.00, type: TransactionType.INCOME, date: '2023-10-26', category: 'Vendas' },
  ],
  clients: [
    { 
      id: 'CLI-001', 
      name: 'Roberto Almeida', 
      type: 'Cliente',
      cpf: '123.456.789-00', 
      rg: '12.345.678-9',
      phone: '(11) 99999-8888',
      email: 'roberto@email.com',
      password: '123456', // Demo password
      blocked: false,
      maritalStatus: 'Casado(a)',
      address: {
        cep: '01001-000',
        rua: 'Praça da Sé',
        endereco: 'Praça da Sé, 100',
        bairro: 'Sé',
        cidade: 'São Paulo',
        uf: 'SP',
        complemento: 'Lado ímpar'
      }
    },
    { 
      id: 'FOR-001', 
      type: 'Fornecedor',
      razaoSocial: 'Auto Peças Distribuidora Ltda',
      cnpj: '12.345.678/0001-90',
      email: 'vendas@autop.com.br',
      companyPhone: '(11) 3333-4444',
      sellerContact: 'Carlos Santos',
      blocked: false,
      address: {
        cep: '02002-000',
        rua: 'Rua Voluntários da Pátria',
        endereco: 'Rua Voluntários da Pátria, 500',
        bairro: 'Santana',
        cidade: 'São Paulo',
        uf: 'SP',
        complemento: 'Galpão 3'
      }
    }
  ],
  employees: [
    {
      id: 'EMP-001',
      name: 'João Silva',
      cpf: '111.222.333-44',
      role: 'Mecânico Chefe',
      salary: 3500.00,
      advances: 500.00,
      username: 'joao.silva',
      email: 'joao@nexus.com',
      password: '123456',
      address: {
        cep: '01002-000',
        rua: 'Rua das Flores',
        cidade: 'São Paulo',
        bairro: 'Centro',
        endereco: 'Rua das Flores, 20',
        complemento: '',
        uf: 'SP'
      }
    }
  ],
  clientPurchases: [
    {
      id: 'PUR-1',
      clientId: 'CLI-001',
      productName: 'Bateria Moura 60Ah',
      purchaseDate: '2023-08-15',
      warrantyExpireDate: '2024-08-15',
      paymentMethod: 'Cartão de Crédito',
      paymentStatus: 'Pago',
      value: 450.00
    },
    {
      id: 'PUR-2',
      clientId: 'CLI-001',
      productName: 'Pneu Pirelli Aro 14',
      purchaseDate: '2023-01-10',
      warrantyExpireDate: '2028-01-10',
      paymentMethod: 'Boleto',
      paymentStatus: 'Pago',
      value: 380.00
    },
     {
      id: 'PUR-3',
      clientId: 'CLI-001',
      productName: 'Kit Revisão Completo',
      purchaseDate: '2023-10-25',
      warrantyExpireDate: '2024-01-25',
      paymentMethod: 'Pix',
      paymentStatus: 'Pendente',
      value: 120.00
    }
  ],
  checklists: [
    {
      id: 'CHK-001',
      title: 'Revisão Padrão 10.000km',
      description: 'Checklist para veículos leves em revisão periódica.',
      dateCreated: '2023-10-01',
      items: [
        { id: '1', text: 'Verificar nível de óleo', completed: false },
        { id: '2', text: 'Checar pressão dos pneus', completed: false },
        { id: '3', text: 'Verificar sistema de freios', completed: false },
        { id: '4', text: 'Testar luzes e faróis', completed: false }
      ],
      photos: [],
      parts: [
        { productId: 'PRD-001', quantity: 1 },
        { productId: 'PRD-002', quantity: 1 }
      ]
    }
  ],
  sales: [
    {
      id: 'VEN-001',
      clientId: 'CLI-001',
      clientName: 'Roberto Almeida',
      date: '2023-10-26',
      status: 'Concluída',
      paymentMethod: 'Pix',
      totalValue: 90.00,
      items: [
        { productId: 'PRD-001', productName: 'Óleo de Motor 5W30', quantity: 2, unitPrice: 45.00, total: 90.00 }
      ]
    },
    // Mock purchase for employee
    {
      id: 'VEN-002',
      clientId: 'EMP-001',
      clientName: 'João Silva',
      date: '2023-10-27',
      status: 'Concluída',
      paymentMethod: 'Dinheiro',
      totalValue: 45.00,
      items: [
        { productId: 'PRD-001', productName: 'Óleo de Motor 5W30', quantity: 1, unitPrice: 45.00, total: 45.00 }
      ]
    }
  ],
  quotes: [
    {
      id: 'ORC-001',
      clientId: 'CLI-002',
      clientName: 'Ana Clara Silva',
      date: '2023-10-28',
      expireDate: '2023-11-04',
      status: 'Aberto',
      totalValue: 120.00,
      items: [
        { productId: 'PRD-003', productName: 'Pastilha de Freio', quantity: 1, unitPrice: 120.00, total: 120.00 }
      ]
    }
  ],
  contracts: []
};

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    user: null
  });

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [quoteForContract, setQuoteForContract] = useState<Quote | null>(null);

  // Authentication Handlers
  const handleLoginSuccess = (type: 'admin' | 'client' | 'employee', userData?: Client | Employee) => {
    setAuthState({
      isAuthenticated: true,
      userType: type,
      user: userData || null
    });
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      userType: null,
      user: null
    });
  };

  // State Handlers (Admin)
  const handleAddProduct = (product: Product) => {
    setState(prev => ({ ...prev, products: [...prev.products, product] }));
  };
  
  const handleUpdateProduct = (product: Product) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === product.id ? product : p)
    }));
  };

  const handleDeleteProduct = (id: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  const handleBatchOperations = (productsToAdd: Product[], productsToUpdate: Product[]) => {
    setState(prev => {
      // Create a map of existing products for faster lookup during update
      const productMap = new Map(prev.products.map(p => [p.id, p]));
      
      // Update existing ones in the map
      productsToUpdate.forEach(updated => {
        if (productMap.has(updated.id)) {
          productMap.set(updated.id, updated);
        }
      });

      // Convert back to array
      const updatedExistingList = Array.from(productMap.values());

      return { 
        ...prev, 
        products: [...updatedExistingList, ...productsToAdd] 
      };
    });
  };

  const handleAddOrder = (order: WorkOrder) => {
    let finalOrder = order;
    let newSettings = { ...state.companySettings };

    // Generate ID if not provided (new order)
    if (!order.id) {
        const seq = newSettings.documentSequences.workOrder;
        finalOrder = { ...order, id: `${seq.prefix}${seq.nextNumber}` };
        newSettings.documentSequences.workOrder.nextNumber++;
    }

    setState(prev => ({ 
        ...prev, 
        workOrders: [finalOrder, ...prev.workOrders],
        companySettings: newSettings
    }));
  };

  const handleUpdateOrder = (order: WorkOrder) => {
     setState(prev => ({
      ...prev,
      workOrders: prev.workOrders.map(o => o.id === order.id ? order : o)
    }));
  };

  const handleAddTransaction = (transaction: Transaction) => {
    setState(prev => ({ ...prev, transactions: [transaction, ...prev.transactions] }));
  };

  const handleAddClient = (client: Client) => {
    setState(prev => ({ ...prev, clients: [...prev.clients, client] }));
  };

  const handleUpdateClient = (client: Client) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === client.id ? client : c)
    }));
  };

  const handleBlockClient = (id: string, blocked: boolean) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? { ...c, blocked } : c)
    }));
  };

  const handleDeleteClient = (id: string) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== id)
    }));
  };

  // Employee Handlers
  const handleAddEmployee = (employee: Employee) => {
    setState(prev => ({ ...prev, employees: [...prev.employees, employee] }));
  };

  const handleUpdateEmployee = (employee: Employee) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(e => e.id === employee.id ? employee : e)
    }));
  };

  const handleDeleteEmployee = (id: string) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.filter(e => e.id !== id)
    }));
  };

  // Checklist Handlers
  const handleAddChecklist = (checklist: Checklist) => {
    setState(prev => ({ ...prev, checklists: [...prev.checklists, checklist] }));
  };

  const handleUpdateChecklist = (checklist: Checklist) => {
    setState(prev => ({
      ...prev,
      checklists: prev.checklists.map(c => c.id === checklist.id ? checklist : c)
    }));
  };

  const handleDeleteChecklist = (id: string) => {
    setState(prev => ({
      ...prev,
      checklists: prev.checklists.filter(c => c.id !== id)
    }));
  };

  // Sales & Quotes Handlers
  const handleAddSale = (sale: Sale) => {
    let finalSale = sale;
    let newSettings = { ...state.companySettings };

    if (!sale.id) {
        const seq = newSettings.documentSequences.sale;
        finalSale = { ...sale, id: `${seq.prefix}${seq.nextNumber}` };
        newSettings.documentSequences.sale.nextNumber++;
    }

    setState(prev => ({ 
      ...prev, 
      sales: [finalSale, ...prev.sales],
      companySettings: newSettings,
      // Optional: Add transaction automatically
      transactions: [
        {
          id: `TR-${Date.now()}`,
          description: `Venda ${finalSale.id} - ${finalSale.clientName}`,
          amount: finalSale.totalValue,
          type: TransactionType.INCOME,
          date: finalSale.date,
          category: 'Vendas'
        },
        ...prev.transactions
      ]
    }));
  };

  const handleAddQuote = (quote: Quote) => {
    let finalQuote = quote;
    let newSettings = { ...state.companySettings };

    if (!quote.id) {
        const seq = newSettings.documentSequences.quote;
        finalQuote = { ...quote, id: `${seq.prefix}${seq.nextNumber}` };
        newSettings.documentSequences.quote.nextNumber++;
    }

    setState(prev => ({ 
        ...prev, 
        quotes: [finalQuote, ...prev.quotes],
        companySettings: newSettings
    }));
  };

  const handleUpdateQuoteStatus = (id: string, status: 'Aberto' | 'Aprovado' | 'Rejeitado') => {
    setState(prev => ({
      ...prev,
      quotes: prev.quotes.map(q => q.id === id ? { ...q, status } : q)
    }));
  };

  // Contract Handlers
  const handleGenerateContract = (quote: Quote) => {
    setQuoteForContract(quote);
    setActiveTab('contracts');
  };

  const handleClearQuoteForContract = () => {
    setQuoteForContract(null);
  };

  const handleAddContract = (contract: Contract) => {
    setState(prev => ({ ...prev, contracts: [...prev.contracts, contract] }));
  };

  const handleDeleteContract = (id: string) => {
    setState(prev => ({ ...prev, contracts: prev.contracts.filter(c => c.id !== id) }));
  };

  // Template Handlers
  const handleAddTemplate = (template: ContractTemplate) => {
    setState(prev => ({ ...prev, contractTemplates: [...prev.contractTemplates, template] }));
  };

  const handleUpdateTemplate = (template: ContractTemplate) => {
    setState(prev => ({
      ...prev,
      contractTemplates: prev.contractTemplates.map(t => t.id === template.id ? template : t)
    }));
  };

  const handleDeleteTemplate = (id: string) => {
    setState(prev => ({
      ...prev,
      contractTemplates: prev.contractTemplates.filter(t => t.id !== id)
    }));
  };

  // Settings Handler
  const handleUpdateSettings = (newSettings: CompanySettings) => {
    setState(prev => ({ ...prev, companySettings: newSettings }));
  };

  // Margin & Cost Center & Payment Methods Handlers
  const handleUpdateMarginRule = (rule: MarginRule) => {
    setState(prev => ({
      ...prev,
      marginRules: prev.marginRules.map(r => r.id === rule.id ? rule : r)
    }));
  };

  const handleAddCostCenter = (costCenter: CostCenter) => {
    setState(prev => ({ ...prev, costCenters: [...prev.costCenters, costCenter] }));
  };

  const handleUpdateCostCenter = (costCenter: CostCenter) => {
    setState(prev => ({
      ...prev,
      costCenters: prev.costCenters.map(c => c.id === costCenter.id ? costCenter : c)
    }));
  };

  const handleDeleteCostCenter = (id: string) => {
    setState(prev => ({
      ...prev,
      costCenters: prev.costCenters.filter(c => c.id !== id)
    }));
  };

  const handleAddPaymentMethod = (method: PaymentMethod) => {
    setState(prev => ({ ...prev, paymentMethods: [...prev.paymentMethods, method] }));
  };

  const handleUpdatePaymentMethod = (method: PaymentMethod) => {
    setState(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(m => m.id === method.id ? method : m)
    }));
  };

  const handleDeletePaymentMethod = (id: string) => {
    setState(prev => ({ ...prev, paymentMethods: prev.paymentMethods.filter(m => m.id !== id) }));
  };

  // 1. If not authenticated, show Login
  if (!authState.isAuthenticated) {
    return (
      <Login 
        clients={state.clients} 
        employees={state.employees} 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  // 2. If Client, show Client Portal
  if (authState.userType === 'client' && authState.user) {
    return (
      <ClientPortal 
        client={authState.user as Client} 
        workOrders={state.workOrders}
        purchases={state.clientPurchases}
        onLogout={handleLogout}
      />
    );
  }

  // 3. If Employee, show Employee Portal
  if (authState.userType === 'employee' && authState.user) {
    return (
      <EmployeePortal
        employee={authState.user as Employee}
        sales={state.sales}
        onLogout={handleLogout}
      />
    );
  }

  // 4. If Admin, show Dashboard (Original App)
  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
        ${activeTab === tab 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10 print:hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Package className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Nexus<span className="text-indigo-600">Gestão</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem tab="clients" icon={Users} label="Clientes/Fornecedores" />
          <NavItem tab="employees" icon={Briefcase} label="Funcionários" />
          <NavItem tab="sales" icon={ShoppingCart} label="Vendas" />
          <NavItem tab="os" icon={ClipboardList} label="Ordens de Serviço" />
          <NavItem tab="checklists" icon={CheckSquare} label="Checklists" />
          <NavItem tab="inventory" icon={Package} label="Estoque" />
          <NavItem tab="contracts" icon={FileCheck} label="Contratos" />
          <NavItem tab="finance" icon={DollarSign} label="Financeiro" />
          <NavItem tab="settings" icon={SettingsIcon} label="Configurações" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium mb-4"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
          
          <div className="bg-gradient-to-br from-indigo-50 to-slate-50 p-4 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">Dica Pro</p>
            <p className="text-sm text-slate-600">Use o consultor IA no painel para insights diários.</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Overlay */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 shadow-sm print:hidden">
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <span className="font-bold text-slate-800">Nexus</span>
          </div>

          <div className="hidden lg:block text-slate-500 text-sm">
             {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden print:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
            <nav className="fixed top-0 left-0 bottom-0 w-64 bg-white p-4 space-y-2 shadow-xl animate-slide-in">
              <div className="mb-8 flex items-center gap-2 px-2">
                 <div className="bg-indigo-600 p-2 rounded-lg">
                  <Package className="text-white" size={20} />
                </div>
                <h1 className="text-xl font-bold text-slate-800">Nexus</h1>
              </div>
              <NavItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem tab="clients" icon={Users} label="Clientes/Fornecedores" />
              <NavItem tab="employees" icon={Briefcase} label="Funcionários" />
              <NavItem tab="sales" icon={ShoppingCart} label="Vendas" />
              <NavItem tab="os" icon={ClipboardList} label="Ordens de Serviço" />
              <NavItem tab="checklists" icon={CheckSquare} label="Checklists" />
              <NavItem tab="inventory" icon={Package} label="Estoque" />
              <NavItem tab="contracts" icon={FileCheck} label="Contratos" />
              <NavItem tab="finance" icon={DollarSign} label="Financeiro" />
              <NavItem tab="settings" icon={SettingsIcon} label="Configurações" />
              <div className="pt-4 mt-auto border-t border-slate-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto print:p-0">
          <div className="max-w-7xl mx-auto print:max-w-none print:mx-0">
            {activeTab === 'dashboard' && <Dashboard state={state} />}
            {activeTab === 'clients' && (
              <Clients 
                clients={state.clients}
                onAddClient={handleAddClient}
                onUpdateClient={handleUpdateClient}
                onDeleteClient={handleDeleteClient}
                onBlockClient={handleBlockClient}
              />
            )}
            {activeTab === 'employees' && (
              <Employees 
                employees={state.employees}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
              />
            )}
            {activeTab === 'sales' && (
              <Sales 
                sales={state.sales}
                quotes={state.quotes}
                products={state.products}
                clients={state.clients}
                onAddSale={handleAddSale}
                onAddQuote={handleAddQuote}
                onUpdateQuoteStatus={handleUpdateQuoteStatus}
                paymentMethods={state.paymentMethods} // Passed to Sales
                onGenerateContract={handleGenerateContract}
              />
            )}
            {activeTab === 'os' && (
              <WorkOrders 
                orders={state.workOrders} 
                products={state.products}
                checklists={state.checklists}
                onAddOrder={handleAddOrder}
                onUpdateOrder={handleUpdateOrder}
                onAddTransaction={handleAddTransaction}
                paymentMethods={state.paymentMethods} // Passed to WorkOrders
              />
            )}
            {activeTab === 'checklists' && (
              <Checklists 
                checklists={state.checklists}
                products={state.products}
                onAddChecklist={handleAddChecklist}
                onUpdateChecklist={handleUpdateChecklist}
                onDeleteChecklist={handleDeleteChecklist}
              />
            )}
            {activeTab === 'inventory' && (
              <Inventory 
                products={state.products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onBatchOperations={handleBatchOperations}
              />
            )}
            {activeTab === 'contracts' && (
              <Contracts 
                contracts={state.contracts}
                contractTemplates={state.contractTemplates} // New Prop
                quotes={state.quotes}
                clients={state.clients}
                companySettings={state.companySettings}
                onAddContract={handleAddContract}
                onDeleteContract={handleDeleteContract}
                onAddTemplate={handleAddTemplate} // New Handler
                onUpdateTemplate={handleUpdateTemplate} // New Handler
                onDeleteTemplate={handleDeleteTemplate} // New Handler
                initialQuote={quoteForContract}
                onClearInitialQuote={handleClearQuoteForContract}
              />
            )}
            {activeTab === 'finance' && (
              <Finance 
                transactions={state.transactions}
                onAddTransaction={handleAddTransaction}
                marginRules={state.marginRules}
                costCenters={state.costCenters}
                paymentMethods={state.paymentMethods}
                onUpdateMarginRule={handleUpdateMarginRule}
                onAddCostCenter={handleAddCostCenter}
                onUpdateCostCenter={handleUpdateCostCenter}
                onDeleteCostCenter={handleDeleteCostCenter}
                onAddPaymentMethod={handleAddPaymentMethod}
                onUpdatePaymentMethod={handleUpdatePaymentMethod}
                onDeletePaymentMethod={handleDeletePaymentMethod}
              />
            )}
             {activeTab === 'settings' && (
              <Settings 
                settings={state.companySettings}
                onUpdateSettings={handleUpdateSettings}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;