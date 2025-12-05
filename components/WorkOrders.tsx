import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, CheckCircle, Clock, AlertCircle, XCircle, LayoutList, 
  LayoutGrid, ClipboardList, Calendar, DollarSign, User, Package, Wrench, 
  Trash2, PlayCircle, StopCircle, CreditCard, RefreshCw, ShieldCheck, CheckSquare, Hash
} from 'lucide-react';
import { WorkOrder, OSTatus, Product, SaleItem, Transaction, TransactionType, Checklist, PaymentMethod } from '../types';

interface WorkOrdersProps {
  orders: WorkOrder[];
  products: Product[]; // Need inventory to add parts
  checklists: Checklist[]; // Need checklists to link
  paymentMethods: PaymentMethod[]; // New Prop
  onAddOrder: (order: WorkOrder) => void;
  onUpdateOrder: (order: WorkOrder) => void;
  onAddTransaction: (transaction: Transaction) => void; // To handle "Quitar"
}

const WorkOrders: React.FC<WorkOrdersProps> = ({ orders, products, checklists, paymentMethods, onAddOrder, onUpdateOrder, onAddTransaction }) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const initialFormState: Partial<WorkOrder> = {
    priority: 'Média',
    status: OSTatus.PENDING,
    technician: '',
    products: [],
    laborValue: 0,
    totalValue: 0,
    paymentStatus: 'Pendente',
    dateStart: '',
    dateEnd: '',
    checklistId: '',
    observations: ''
  };
  const [formData, setFormData] = useState<Partial<WorkOrder>>(initialFormState);
  
  // Product Selection State inside Modal
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Settle/Pay Modal State
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [orderToSettle, setOrderToSettle] = useState<WorkOrder | null>(null);
  const [settlePaymentMethod, setSettlePaymentMethod] = useState('');

  // Filter
  const filteredOrders = orders.filter(o => 
    o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate Total whenever labor or products change
  useEffect(() => {
    const productsTotal = formData.products?.reduce((acc, item) => acc + item.total, 0) || 0;
    const labor = Number(formData.laborValue) || 0;
    setFormData(prev => ({ ...prev, totalValue: productsTotal + labor }));
  }, [formData.products, formData.laborValue]);

  // Generate Warranty Text automatically based on products
  useEffect(() => {
    if (!formData.products || formData.products.length === 0) {
      setFormData(prev => ({ ...prev, warrantyDetails: 'Garantia legal de 90 dias para serviços.' }));
      return;
    }

    const serviceWarranty = "Serviços: 90 dias.";
    const productWarranties = formData.products.map(item => {
      // Find original product to get warranty days
      const originalProd = products.find(p => p.id === item.productId);
      const days = originalProd?.warrantyDays || 90;
      return `${item.productName}: ${days} dias`;
    }).join('; ');

    setFormData(prev => ({ ...prev, warrantyDetails: `${serviceWarranty}\nPeças: ${productWarranties}` }));
  }, [formData.products, products]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (order: WorkOrder) => {
    setEditingId(order.id);
    setFormData({ ...order });
    setIsModalOpen(true);
  };

  // --- Product Logic ---
  const handleAddProduct = () => {
    const product = products.find(p => p.id === selectedProduct);
    if (product && quantity > 0) {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        unitPrice: product.price,
        total: quantity * product.price
      };

      setFormData(prev => ({
        ...prev,
        products: [...(prev.products || []), newItem]
      }));
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  const handleRemoveProduct = (prodId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products?.filter(p => p.productId !== prodId)
    }));
  };

  // --- Actions (Cards) ---
  const handleApprove = (order: WorkOrder) => {
    onUpdateOrder({ 
      ...order, 
      status: OSTatus.IN_PROGRESS,
      dateStart: order.dateStart || new Date().toISOString().split('T')[0] // Auto set start date if empty
    });
  };

  const handleCancel = (order: WorkOrder) => {
    if (window.confirm('Tem certeza que deseja cancelar esta OS?')) {
      onUpdateOrder({ ...order, status: OSTatus.CANCELED });
    }
  };

  const handleOpenSettle = (order: WorkOrder) => {
    if (order.paymentStatus === 'Pago') return;
    setOrderToSettle(order);
    setSettlePaymentMethod('');
    setIsSettleModalOpen(true);
  };

  const confirmSettle = () => {
    if (!orderToSettle) return;

    // 1. Update OS
    onUpdateOrder({ 
      ...orderToSettle, 
      paymentStatus: 'Pago',
      status: OSTatus.COMPLETED, // Auto complete usually
      dateEnd: orderToSettle.dateEnd || new Date().toISOString().split('T')[0] // Auto set end date if empty
    });

    // 2. Generate Transaction
    const paymentName = settlePaymentMethod || 'Dinheiro';
    onAddTransaction({
      id: `TR-OS-${orderToSettle.id}-${Date.now()}`,
      description: `Recebimento OS #${orderToSettle.id} - ${orderToSettle.clientName} (${paymentName})`,
      amount: orderToSettle.totalValue,
      type: TransactionType.INCOME,
      date: new Date().toISOString(),
      category: 'Serviços'
    });

    setIsSettleModalOpen(false);
    setOrderToSettle(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de campos obrigatórios
    if (!formData.clientName || !formData.clientName.trim()) {
      alert("O campo Cliente é obrigatório.");
      return;
    }

    if (!formData.description || !formData.description.trim()) {
      alert("O campo Descrição do Serviço é obrigatório.");
      return;
    }

    if (formData.laborValue === undefined || formData.laborValue === null || formData.laborValue < 0) {
      alert("Por favor, informe um valor válido para a Mão de Obra.");
      return;
    }

    const orderToSave = {
      ...formData,
      id: editingId || '', // Empty ID tells App.tsx to generate sequential ID
      dateCreated: formData.dateCreated || new Date().toLocaleDateString('pt-BR'),
      clientId: 'CLI-001' // Mock
    } as WorkOrder;

    if (editingId) {
      onUpdateOrder(orderToSave);
    } else {
      onAddOrder(orderToSave);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: OSTatus) => {
    switch(status) {
      case OSTatus.PENDING: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case OSTatus.IN_PROGRESS: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case OSTatus.COMPLETED: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case OSTatus.CANCELED: return 'bg-slate-700/50 text-slate-400 border-slate-600';
    }
  };

  const getStatusIcon = (status: OSTatus) => {
    switch(status) {
      case OSTatus.PENDING: return <Clock size={16} />;
      case OSTatus.IN_PROGRESS: return <PlayCircle size={16} />;
      case OSTatus.COMPLETED: return <CheckCircle size={16} />;
      case OSTatus.CANCELED: return <StopCircle size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Ordens de Serviço</h2>
          <p className="text-slate-400">Gestão completa de serviços, produtos e garantias.</p>
        </div>
        <div className="flex gap-2">
            <div className="flex bg-slate-800/50 rounded-lg border border-white/10 p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <LayoutList size={20} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          <button 
            onClick={handleOpenAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-900/20 border border-white/10"
          >
            <Plus size={20} /> Nova OS
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por cliente, ID ou descrição..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 text-slate-300 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700 flex items-center gap-2">
            <Filter size={20} />
            <span className="hidden sm:inline">Filtrar</span>
          </button>
        </div>

        {viewMode === 'list' ? (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 text-slate-300 font-medium text-sm">
                  <tr>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">ID / Cliente</th>
                    <th className="px-6 py-4">Datas</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4 text-right">Valor Total</th>
                    <th className="px-6 py-4 text-center">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors text-slate-300">
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                          {order.paymentStatus === 'Pago' && (
                            <span className="mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded border border-emerald-500/30 block w-fit text-center">
                              PAGO
                            </span>
                          )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-100">{order.clientName}</div>
                        <div className="text-xs font-mono text-slate-500">{order.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        <div>Criado: {order.dateCreated}</div>
                        {order.dateEnd && <div className="text-indigo-400 font-medium">Entrega: {new Date(order.dateEnd).toLocaleDateString('pt-BR')}</div>}
                      </td>
                      <td className="px-6 py-4 text-slate-400 truncate max-w-xs text-sm">
                        {order.description}
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span>{order.products?.length || 0} produtos</span>
                          {order.checklistId && <span className="flex items-center gap-1 text-indigo-400"><CheckSquare size={10}/> Checklist</span>}
                          {order.observations && <span className="text-[10px] px-1 bg-slate-700 rounded text-slate-300">Obs</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-100">R$ {order.totalValue.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                           <button onClick={() => handleOpenEdit(order)} className="p-1.5 bg-slate-800 text-slate-400 rounded hover:bg-slate-700 hover:text-white border border-white/5" title="Atualizar/Editar">
                             <RefreshCw size={16} />
                           </button>
                           {order.status === OSTatus.PENDING && (
                             <button onClick={() => handleApprove(order)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 border border-blue-500/20" title="Aprovar">
                               <PlayCircle size={16} />
                             </button>
                           )}
                           {order.status !== OSTatus.CANCELED && order.paymentStatus !== 'Pago' && (
                             <button onClick={() => handleOpenSettle(order)} className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 border border-emerald-500/20" title="Quitar">
                               <CreditCard size={16} />
                             </button>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View with Action Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map(order => (
               <div key={order.id} className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 flex flex-col justify-between overflow-hidden hover:bg-slate-800/40 transition-all">
                 <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                       <span className={`px-2 py-1 rounded text-xs font-semibold border
                          ${order.priority === 'Alta' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 
                            order.priority === 'Média' ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-blue-500/20 text-blue-400 border-blue-500/20'}`}>
                          {order.priority}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mb-1 line-clamp-2">
                       {order.description}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-mono text-slate-500">{order.id}</span>
                      <span className="text-slate-600">•</span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <User size={12} />
                        {order.clientName}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                         <span className="text-slate-500">Mão de Obra</span>
                         <span className="text-slate-300">R$ {order.laborValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-slate-500">Produtos ({order.products?.length || 0})</span>
                         <span className="text-slate-300">R$ {(order.totalValue - order.laborValue).toFixed(2)}</span>
                      </div>
                      {order.checklistId && (
                        <div className="flex justify-between">
                           <span className="text-slate-500 flex items-center gap-1"><CheckSquare size={12}/> Checklist</span>
                           <span className="text-indigo-400 font-medium text-xs">Vinculado</span>
                        </div>
                      )}
                      {order.dateEnd && (
                        <div className="flex justify-between bg-indigo-500/10 p-1 rounded px-2 border border-indigo-500/20">
                           <span className="text-indigo-400 font-medium">Entrega</span>
                           <span className="text-indigo-300 font-bold">{new Date(order.dateEnd).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                      {order.observations && (
                        <div className="mt-2 text-xs text-slate-400 italic bg-white/5 p-2 rounded border border-white/5">
                          Obs: {order.observations.length > 50 ? order.observations.substring(0, 50) + '...' : order.observations}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                       <div className="flex flex-col">
                         <span className="text-xs text-slate-500">Total</span>
                         <span className="text-xl font-bold text-slate-100">R$ {order.totalValue.toFixed(2)}</span>
                       </div>
                       {order.paymentStatus === 'Pago' ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            <CheckCircle size={14} /> Pago
                          </span>
                       ) : (
                          <span className="text-xs text-amber-400 font-medium bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">Pendente</span>
                       )}
                    </div>
                 </div>

                 {/* ACTION CARDS / BUTTONS */}
                 <div className="bg-slate-950/30 border-t border-white/5 p-3 grid grid-cols-4 gap-2">
                    <button 
                      onClick={() => handleOpenEdit(order)}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all shadow-sm group"
                      title="Atualizar"
                    >
                      <RefreshCw size={18} className="text-slate-400 group-hover:text-indigo-400 mb-1" />
                      <span className="text-[10px] font-semibold text-slate-500 group-hover:text-indigo-300">Atualizar</span>
                    </button>
                    
                    {order.status === OSTatus.PENDING && (
                      <button 
                        onClick={() => handleApprove(order)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all shadow-sm group"
                        title="Aprovar"
                      >
                        <PlayCircle size={18} className="text-slate-400 group-hover:text-blue-400 mb-1" />
                        <span className="text-[10px] font-semibold text-slate-500 group-hover:text-blue-300">Aprovar</span>
                      </button>
                    )}

                    {order.paymentStatus !== 'Pago' && order.status !== OSTatus.CANCELED && (
                      <button 
                        onClick={() => handleOpenSettle(order)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all shadow-sm group"
                        title="Quitar"
                      >
                        <DollarSign size={18} className="text-slate-400 group-hover:text-emerald-400 mb-1" />
                        <span className="text-[10px] font-semibold text-slate-500 group-hover:text-emerald-300">Quitar</span>
                      </button>
                    )}

                    {order.status !== OSTatus.CANCELED && order.status !== OSTatus.COMPLETED && (
                      <button 
                        onClick={() => handleCancel(order)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5 hover:border-red-500/50 hover:bg-red-500/10 transition-all shadow-sm group"
                        title="Cancelar"
                      >
                        <XCircle size={18} className="text-slate-400 group-hover:text-red-400 mb-1" />
                        <span className="text-[10px] font-semibold text-slate-500 group-hover:text-red-300">Cancelar</span>
                      </button>
                    )}
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>

      {/* Settle OS Modal */}
      {isSettleModalOpen && orderToSettle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-xl font-bold text-slate-100">Quitar Ordem de Serviço</h3>
                   <p className="text-sm text-slate-400">OS #{orderToSettle.id} - {orderToSettle.clientName}</p>
                </div>
                <button onClick={() => setIsSettleModalOpen(false)} className="text-slate-500 hover:text-slate-300">
                   <XCircle size={24} />
                </button>
             </div>

             <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 mb-6">
                <div className="flex justify-between mb-2">
                   <span className="text-slate-400">Valor Total</span>
                   <span className="font-bold text-slate-100">R$ {orderToSettle.totalValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Status Atual</span>
                   <span className="text-amber-500 font-medium">{orderToSettle.paymentStatus}</span>
                </div>
             </div>

             <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Forma de Pagamento</label>
                <select 
                   className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                   value={settlePaymentMethod}
                   onChange={(e) => setSettlePaymentMethod(e.target.value)}
                >
                   <option value="">Selecione...</option>
                   {paymentMethods.map(method => (
                      <option key={method.id} value={method.name}>{method.name}</option>
                   ))}
                </select>
                {settlePaymentMethod && (
                   <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <CheckCircle size={12} /> Pagamento será registrado no financeiro.
                   </p>
                )}
             </div>

             <button 
                onClick={confirmSettle}
                disabled={!settlePaymentMethod}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-900/20"
             >
                Confirmar Recebimento
             </button>
          </div>
        </div>
      )}

      {/* Modal - Advanced OS Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-scale-in my-8">
            <h3 className="text-xl font-bold text-slate-100 mb-4">
              {editingId ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Header Info (Number and Priority) */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Número da OS</label>
                    <div className="flex items-center gap-2 px-3 py-2 border border-slate-700 rounded-lg bg-slate-800/50 text-slate-400">
                       <Hash size={16} />
                       <span className="font-mono font-medium">
                          {editingId ? editingId : 'Gerado Automaticamente'}
                       </span>
                    </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-300 mb-1">Prioridade</label>
                   <select 
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Cliente *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder-slate-500"
                    value={formData.clientName || ''}
                    onChange={e => setFormData({...formData, clientName: e.target.value})}
                    placeholder="Nome do Cliente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Técnico Responsável</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                    value={formData.technician || ''}
                    onChange={e => setFormData({...formData, technician: e.target.value})}
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-1">Vincular Checklist</label>
                   <div className="relative">
                      <CheckSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <select 
                        className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                        value={formData.checklistId || ''}
                        onChange={e => setFormData({...formData, checklistId: e.target.value})}
                      >
                        <option value="">Nenhum Checklist</option>
                        {checklists.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                   </div>
                </div>
              </div>
              
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 bg-slate-800/30 p-3 rounded-lg border border-white/5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Início do Serviço</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                    value={formData.dateStart || ''}
                    onChange={e => setFormData({...formData, dateStart: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Previsão de Entrega</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                    value={formData.dateEnd || ''}
                    onChange={e => setFormData({...formData, dateEnd: e.target.value})}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Descrição do Serviço *</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Observations - New Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Observações</label>
                <textarea 
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder-slate-500"
                  value={formData.observations || ''}
                  onChange={e => setFormData({...formData, observations: e.target.value})}
                  placeholder="Informações adicionais, diagnósticos técnicos ou anotações..."
                />
              </div>

              {/* Products Section */}
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <div className="bg-slate-800/50 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                  <h4 className="font-semibold text-slate-300 flex items-center gap-2">
                    <Package size={18} /> Produtos e Peças
                  </h4>
                </div>
                
                <div className="p-4 bg-slate-900/50">
                  <div className="flex gap-2 mb-4">
                      <select 
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none text-sm text-white"
                        value={selectedProduct}
                        onChange={e => setSelectedProduct(e.target.value)}
                      >
                        <option value="">Adicionar produto à OS...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        min="1"
                        className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none text-sm text-white"
                        value={quantity}
                        onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                      />
                      <button 
                        type="button"
                        onClick={handleAddProduct}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                  </div>

                  {formData.products && formData.products.length > 0 && (
                    <div className="rounded border border-white/10 overflow-hidden mb-2">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-800 text-slate-400">
                          <tr>
                            <th className="px-3 py-2">Produto</th>
                            <th className="px-3 py-2 text-center">Qtd</th>
                            <th className="px-3 py-2 text-right">Total</th>
                            <th className="px-3 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {formData.products.map((item, idx) => (
                            <tr key={idx} className="text-slate-300">
                              <td className="px-3 py-2">{item.productName}</td>
                              <td className="px-3 py-2 text-center">{item.quantity}</td>
                              <td className="px-3 py-2 text-right">R$ {item.total.toFixed(2)}</td>
                              <td className="px-3 py-2 text-right">
                                <button type="button" onClick={() => handleRemoveProduct(item.productId)} className="text-red-400 hover:text-red-300">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Warranty */}
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-indigo-400" />
                    Termos de Garantia (Gerado automaticamente)
                  </label>
                  <textarea 
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm text-slate-300"
                    value={formData.warrantyDetails || ''}
                    onChange={e => setFormData({...formData, warrantyDetails: e.target.value})}
                  />
                </div>

              {/* Values */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-1">Mão de Obra (R$) *</label>
                   <input 
                      required
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                      value={formData.laborValue || ''}
                      onChange={e => setFormData({...formData, laborValue: Number(e.target.value)})}
                   />
                </div>
                <div className="text-right">
                   <p className="text-sm text-slate-400 mb-1">Valor Total</p>
                   <p className="text-3xl font-bold text-slate-100">R$ {formData.totalValue?.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:bg-slate-800 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20"
                >
                  Salvar OS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrders;