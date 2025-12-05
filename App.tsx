
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ClipboardList, Package, DollarSign, Menu, X, Bell, Users, LogOut, CheckSquare, ShoppingCart, Briefcase, Settings as SettingsIcon, FileCheck, Database, RefreshCw } from 'lucide-react';
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

// Mock Data (Fallback if DB is empty or fails)
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
      { id: '1', label: 'Gerência', maxDiscount: 20, color: '#10b981' }, 
      { id: '2', label: 'Supervisão', maxDiscount: 15, color: '#3b82f6' }, 
      { id: '3', label: 'Vendedor Pleno', maxDiscount: 10, color: '#f59e0b' }, 
      { id: '4', label: 'Balcão', maxDiscount: 5, color: '#ef4444' }, 
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
  ],
  paymentMethods: [
    { id: '1', name: 'Dinheiro', type: 'Dinheiro', feePercentage: 0 },
    { id: '2', name: 'Pix', type: 'Pix', feePercentage: 0 },
  ],
  contractTemplates: [
    {
      id: 'TPL-001',
      name: 'Contrato Padrão de Serviços',
      content: '...'
    }
  ],
  products: [],
  workOrders: [],
  transactions: [],
  clients: [],
  employees: [],
  clientPurchases: [],
  checklists: [],
  sales: [],
  quotes: [],
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
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected'>('disconnected');

  // Load Data from API (Neon DB)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/state');
        if (response.ok) {
          const dbData = await response.json();
          // Merge fetched data with initial state structure to ensure all keys exist
          setState(prev => ({
            ...prev,
            ...dbData,
            // Fallback for objects if DB returns null (empty tables)
            companySettings: dbData.companySettings || prev.companySettings,
            storeSettings: dbData.storeSettings || prev.storeSettings,
          }));
          setDbStatus('connected');
        } else {
          console.warn("API not reachable, using local mock data.");
          setDbStatus('disconnected');
        }
      } catch (error) {
        console.error("Failed to connect to backend:", error);
        setDbStatus('disconnected');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync Helper to send data to backend
  const syncData = async (action: string, data?: any, id?: string) => {
    if (dbStatus === 'disconnected') return;
    
    try {
      await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data, id })
      });
    } catch (error) {
      console.error("Failed to sync data:", error);
      alert("Erro ao salvar no banco de dados. Verifique a conexão.");
    }
  };

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
  
  // Products (Local only for now until api/actions supports it)
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
      const productMap = new Map(prev.products.map(p => [p.id, p]));
      productsToUpdate.forEach(updated => {
        if (productMap.has(updated.id)) {
          productMap.set(updated.id, updated);
        }
      });
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

  // --- CLIENT HANDLERS (Connected to DB) ---
  const handleAddClient = (client: Client) => {
    setState(prev => ({ ...prev, clients: [...prev.clients, client] }));
    syncData('create_client', client);
  };

  const handleUpdateClient = (client: Client) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === client.id ? client : c)
    }));
    syncData('update_client', client);
  };

  const handleBlockClient = (id: string, blocked: boolean) => {
    const clientToUpdate = state.clients.find(c => c.id === id);
    if (clientToUpdate) {
      const updatedClient = { ...clientToUpdate, blocked };
      setState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === id ? updatedClient : c)
      }));
      syncData('update_client', updatedClient);
    }
  };

  const handleDeleteClient = (id: string) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== id)
    }));
    syncData('delete_client', null, id);
  };
  // -----------------------------------------

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

  const handleUpdateSettings = (newSettings: CompanySettings) => {
    setState(prev => ({ ...prev, companySettings: newSettings }));
  };

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

  // Setup Database Button (Admin only)
  const handleSetupDb = async () => {
    if(confirm("Isso criará as tabelas no banco de dados Neon. Deseja continuar?")) {
      try {
        const res = await fetch('/api/setup');
        const msg = await res.json();
        alert(msg.message || msg.error);
        if(res.ok) window.location.reload();
      } catch (e) {
        alert("Erro ao conectar.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white flex-col gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse">Conectando ao banco de dados...</p>
      </div>
    );
  }

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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium border
        ${activeTab === tab 
          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent'}`}
    >
      <Icon size={20} className={activeTab === tab ? "text-cyan-400" : "text-slate-400"} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-transparent flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900/40 backdrop-blur-xl border-r border-white/5 fixed h-full z-10 print:hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Package className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Nexus<span className="text-cyan-400">Gestão</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem tab="clients" icon={Users} label="Clientes" />
          <NavItem tab="employees" icon={Briefcase} label="Funcionários" />
          <NavItem tab="sales" icon={ShoppingCart} label="Vendas" />
          <NavItem tab="os" icon={ClipboardList} label="Ordens de Serviço" />
          <NavItem tab="checklists" icon={CheckSquare} label="Checklists" />
          <NavItem tab="inventory" icon={Package} label="Estoque" />
          <NavItem tab="contracts" icon={FileCheck} label="Contratos" />
          <NavItem tab="finance" icon={DollarSign} label="Financeiro" />
          <NavItem tab="settings" icon={SettingsIcon} label="Configurações" />
        </nav>

        <div className="p-4 border-t border-white/5 bg-slate-900/20">
          <div className="flex items-center gap-2 mb-4 px-2">
             <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
             <span className="text-xs text-slate-400">{dbStatus === 'connected' ? 'DB Conectado' : 'Modo Offline'}</span>
             {dbStatus === 'disconnected' && (
                <button onClick={handleSetupDb} className="ml-auto text-xs text-blue-400 hover:underline" title="Configurar Tabelas">
                   <Database size={12} /> Setup
                </button>
             )}
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-colors font-medium mb-4"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Overlay */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <header className="bg-slate-900/40 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 shadow-sm print:hidden">
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <span className="font-bold text-slate-100">Nexus</span>
          </div>

          <div className="hidden lg:block text-slate-400 text-sm">
             {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/20">
              AD
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden print:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <nav className="fixed top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-white/10 p-4 space-y-2 shadow-2xl animate-slide-in">
              <div className="mb-8 flex items-center gap-2 px-2">
                 <div className="bg-blue-600 p-2 rounded-lg">
                  <Package className="text-white" size={20} />
                </div>
                <h1 className="text-xl font-bold text-slate-100">Nexus</h1>
              </div>
              <NavItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem tab="clients" icon={Users} label="Clientes" />
              <NavItem tab="employees" icon={Briefcase} label="Funcionários" />
              <NavItem tab="sales" icon={ShoppingCart} label="Vendas" />
              <NavItem tab="os" icon={ClipboardList} label="Ordens de Serviço" />
              <NavItem tab="checklists" icon={CheckSquare} label="Checklists" />
              <NavItem tab="inventory" icon={Package} label="Estoque" />
              <NavItem tab="contracts" icon={FileCheck} label="Contratos" />
              <NavItem tab="finance" icon={DollarSign} label="Financeiro" />
              <NavItem tab="settings" icon={SettingsIcon} label="Configurações" />
              <div className="pt-4 mt-auto border-t border-white/10">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors font-medium"
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
                paymentMethods={state.paymentMethods} 
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
                paymentMethods={state.paymentMethods} 
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
                contractTemplates={state.contractTemplates} 
                quotes={state.quotes}
                clients={state.clients}
                companySettings={state.companySettings}
                onAddContract={handleAddContract}
                onDeleteContract={handleDeleteContract}
                onAddTemplate={handleAddTemplate} 
                onUpdateTemplate={handleUpdateTemplate} 
                onDeleteTemplate={handleDeleteTemplate} 
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
