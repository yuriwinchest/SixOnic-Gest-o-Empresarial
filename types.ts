
export enum OSTatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Concluída',
  CANCELED = 'Cancelada',
}

export enum TransactionType {
  INCOME = 'Receita',
  EXPENSE = 'Despesa',
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  // New fields
  brand?: string;
  model?: string;
  ncm?: string;
  profitMargin?: number;
  warrantyDays?: number; // Warranty in days
  // Store Fields
  images?: string[]; // Array of Base64 or URLs (Max 3) - Kept for internal inventory use
  showInStore?: boolean;
}

export interface WorkOrder {
  id: string;
  clientId?: string;
  clientName: string;
  description: string;
  status: OSTatus;
  dateCreated: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  technician?: string;
  
  // New Fields for Advanced OS
  dateStart?: string;
  dateEnd?: string;
  products?: SaleItem[]; // Products used in the service
  laborValue: number; // Cost of service/labor only
  totalValue: number; // labor + products
  paymentStatus: 'Pendente' | 'Pago';
  warrantyDetails?: string;
  checklistId?: string; // Link to a checklist
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
}

export interface ClientAddress {
  cep: string;
  rua: string;
  cidade: string;
  bairro: string;
  endereco: string;
  complemento: string;
  uf: string;
}

export interface Client {
  id: string;
  type: 'Cliente' | 'Fornecedor';
  address: ClientAddress;
  email?: string; 
  password?: string; // For authentication
  blocked?: boolean; 

  // Fields for Cliente (Person)
  name?: string;
  rg?: string;
  cpf?: string;
  phone?: string; 
  maritalStatus?: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)' | 'Separado(a)'; // New Field

  // Fields for Fornecedor (Company)
  razaoSocial?: string;
  cnpj?: string;
  sellerContact?: string; 
  companyPhone?: string; 
}

// New Interface for Employees
export interface Employee {
  id: string;
  name: string;
  cpf: string;
  address: ClientAddress;
  role: string; // Função
  salary: number;
  advances: number; // Adiantamentos
  username: string; // Nome de usuário
  email: string;
  password: string;
}

// New Interface for Client Portal Products/Warranty
export interface ClientPurchase {
  id: string;
  clientId: string;
  productName: string;
  purchaseDate: string;
  warrantyExpireDate: string;
  paymentMethod: 'Cartão de Crédito' | 'Pix' | 'Boleto' | 'Dinheiro';
  paymentStatus: 'Pago' | 'Pendente';
  value: number;
}

// --- Checklist Interfaces ---

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChecklistPart {
  productId: string;
  quantity: number;
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  photos: string[]; // Array of Base64 strings or URLs
  parts: ChecklistPart[];
  dateCreated: string;
}

// --- Sales & Quotes Interfaces ---

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  items: SaleItem[];
  totalValue: number;
  status: 'Concluída' | 'Pendente' | 'Cancelada';
  paymentMethod: string;
}

export interface Quote {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  expireDate: string;
  items: SaleItem[];
  totalValue: number;
  status: 'Aberto' | 'Aprovado' | 'Rejeitado';
}

export interface Contract {
  id: string;
  quoteId: string;
  clientName: string;
  dateCreated: string;
  content: string; // HTML content of the contract
  status: 'Ativo' | 'Finalizado' | 'Cancelado';
}

export interface ContractTemplate {
  id: string;
  name: string;
  content: string; // HTML content with placeholders
}

// --- Settings Interfaces ---

export interface DiscountLevel {
  id: string;
  label: string;
  maxDiscount: number; // Percentage 0-100
  color: string; // Hex color
}

export interface DocumentSequence {
  prefix: string;
  nextNumber: number;
}

export interface CompanySettings {
  // Identificacao
  name: string; 
  cnpj: string;
  ie: string; 
  email: string;
  phone: string;
  address: ClientAddress;
  logo: string | null; // Base64 string

  // Vendas
  standardPriceTable: string; 
  discountLevels: DiscountLevel[];
  quoteValidityDays: number; // Validade Orcamento
  autoDeleteExpiredQuotes: boolean; // Excluir Orcamentos vencidos
  serviceCommission: number; // Comissao Servicos %

  // Numeracao de Documentos
  documentSequences: {
    workOrder: DocumentSequence;
    sale: DocumentSequence;
    quote: DocumentSequence;
  };

  // Automacao e Mensagens
  autoMessageSettings: {
    sendOnSale: boolean;
    sendOnQuote: boolean;
    sendOnBilling: boolean;
  };
  
  // Textos Padroes
  osFooterText: string;
  defaultWarrantyText: string;
  termsText: string;
}

export interface StoreSettings {
  storeName: string;
  heroSlides: string[];
  sidebarSlides: string[];
}

// --- Finance Interfaces ---

export interface MarginRule {
  id: string;
  name: string; // e.g., "Varejo", "Atacado"
  percentage: number;
}

export interface CostCenter {
  id: string;
  name: string;
  type: 'Fixo' | 'Variável';
  description?: string;
}

export interface PaymentMethod {
  id: string;
  name: string; // e.g. "Visa Crédito 1x"
  type: 'Dinheiro' | 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto' | 'Entrada' | 'Outro';
  feePercentage: number; // e.g. 3.5
}

export interface AppState {
  products: Product[];
  workOrders: WorkOrder[];
  transactions: Transaction[];
  clients: Client[];
  employees: Employee[]; 
  clientPurchases: ClientPurchase[];
  checklists: Checklist[]; 
  sales: Sale[]; 
  quotes: Quote[];
  contracts: Contract[]; 
  contractTemplates: ContractTemplate[];
  companySettings: CompanySettings;
  storeSettings: StoreSettings;
  marginRules: MarginRule[];
  costCenters: CostCenter[];
  paymentMethods: PaymentMethod[]; 
}

export type Tab = 'dashboard' | 'os' | 'inventory' | 'finance' | 'clients' | 'employees' | 'checklists' | 'sales' | 'settings' | 'contracts';

export interface AuthState {
  isAuthenticated: boolean;
  userType: 'admin' | 'client' | 'employee' | null;
  user: Client | Employee | null; 
}