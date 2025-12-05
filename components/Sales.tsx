import React, { useState } from 'react';
import { ShoppingCart, FileText, Plus, Search, Calendar, User, DollarSign, LayoutList, LayoutGrid, CheckCircle, X, Trash2, ArrowRight, FileCheck } from 'lucide-react';
import { Sale, Quote, Product, Client, SaleItem, PaymentMethod } from '../types';

interface SalesProps {
  sales: Sale[];
  quotes: Quote[];
  products: Product[];
  clients: Client[];
  paymentMethods: PaymentMethod[]; // New Prop
  onAddSale: (sale: Sale) => void;
  onAddQuote: (quote: Quote) => void;
  onUpdateQuoteStatus: (id: string, status: 'Aberto' | 'Aprovado' | 'Rejeitado') => void;
  onGenerateContract: (quote: Quote) => void;
}

const Sales: React.FC<SalesProps> = ({ sales, quotes, products, clients, paymentMethods, onAddSale, onAddQuote, onUpdateQuoteStatus, onGenerateContract }) => {
  const [activeTab, setActiveTab] = useState<'sales' | 'quotes'>('sales');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formClient, setFormClient] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formExpireDate, setFormExpireDate] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState('');
  const [formItems, setFormItems] = useState<SaleItem[]>([]);
  
  // Item adding state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const filteredData = activeTab === 'sales' 
    ? sales.filter(s => s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()))
    : quotes.filter(q => q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddItem = () => {
    const product = products.find(p => p.id === selectedProduct);
    if (product && quantity > 0) {
      const existingItem = formItems.find(item => item.productId === product.id);
      if (existingItem) {
        setFormItems(prev => prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.unitPrice }
            : item
        ));
      } else {
        const newItem: SaleItem = {
          productId: product.id,
          productName: product.name,
          quantity: quantity,
          unitPrice: product.price,
          total: quantity * product.price
        };
        setFormItems(prev => [...prev, newItem]);
      }
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setFormItems(prev => prev.filter(item => item.productId !== productId));
  };

  const totalValue = formItems.reduce((acc, item) => acc + item.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientObj = clients.find(c => c.name === formClient || c.razaoSocial === formClient);
    const clientId = clientObj ? clientObj.id : 'UNKNOWN';
    const clientName = clientObj ? (clientObj.name || clientObj.razaoSocial || formClient) : formClient;

    if (activeTab === 'sales') {
      const newSale: Sale = {
        id: '', // Empty ID tells App.tsx to generate sequential ID
        clientId,
        clientName,
        date: formDate,
        items: formItems,
        totalValue,
        status: 'Concluída',
        paymentMethod: formPaymentMethod || paymentMethods[0]?.name || 'Dinheiro'
      };
      onAddSale(newSale);
    } else {
      const newQuote: Quote = {
        id: '', // Empty ID tells App.tsx to generate sequential ID
        clientId,
        clientName,
        date: formDate,
        expireDate: formExpireDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: formItems,
        totalValue,
        status: 'Aberto'
      };
      onAddQuote(newQuote);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormClient('');
    setFormItems([]);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormExpireDate('');
    setFormPaymentMethod('');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            {activeTab === 'sales' ? 'Gestão de Vendas' : 'Orçamentos'}
          </h2>
          <p className="text-slate-400">
            {activeTab === 'sales' ? 'Histórico de vendas e faturamento.' : 'Gerencie propostas comerciais.'}
          </p>
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
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-900/20 border border-white/10"
          >
            <Plus size={20} /> {activeTab === 'sales' ? 'Nova Venda' : 'Novo Orçamento'}
          </button>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-white/10">
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'sales' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingCart size={18} /> Vendas Realizadas
          {activeTab === 'sales' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'quotes' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText size={18} /> Orçamentos
          {activeTab === 'quotes' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></span>}
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder={activeTab === 'sales' ? "Buscar vendas..." : "Buscar orçamentos..."}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT: LIST OR GRID */}
      {filteredData.length === 0 ? (
         <div className="p-12 text-center text-slate-500 bg-slate-900/60 rounded-xl border border-white/10 backdrop-blur-sm">
          Nenhum registro encontrado.
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-300 font-medium text-sm">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                {activeTab === 'quotes' && <th className="px-6 py-4 text-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors text-slate-300">
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-100">{item.clientName}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-200">R$ {item.totalValue.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold border
                      ${item.status === 'Concluída' || item.status === 'Aprovado' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 
                        item.status === 'Pendente' || item.status === 'Aberto' ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                      {item.status}
                    </span>
                  </td>
                  {activeTab === 'quotes' && (
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                         {item.status === 'Aberto' && (
                           <>
                              <button 
                                onClick={() => onUpdateQuoteStatus(item.id, 'Aprovado')}
                                className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded" title="Aprovar"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                onClick={() => onUpdateQuoteStatus(item.id, 'Rejeitado')}
                                className="p-1 text-red-400 hover:bg-red-500/20 rounded" title="Rejeitar"
                              >
                                <X size={18} />
                              </button>
                           </>
                         )}
                         {item.status === 'Aprovado' && (
                            <button 
                              onClick={() => onGenerateContract(item)}
                              className="p-1 text-indigo-400 hover:bg-indigo-500/20 rounded" title="Gerar Contrato"
                            >
                              <FileCheck size={18} />
                            </button>
                         )}
                       </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredData.map((item: any) => (
             <div key={item.id} className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-6 flex flex-col justify-between hover:bg-slate-800/40 transition-colors">
                <div>
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                        {activeTab === 'sales' ? <ShoppingCart size={24} /> : <FileText size={24} />}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border
                      ${item.status === 'Concluída' || item.status === 'Aprovado' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 
                        item.status === 'Pendente' || item.status === 'Aberto' ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                      {item.status}
                    </span>
                   </div>
                   
                   <h3 className="text-lg font-bold text-slate-100 mb-1">{item.clientName}</h3>
                   <p className="text-xs text-slate-500 font-mono mb-4">{item.id}</p>

                   <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Data</span>
                        <span className="text-slate-200">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total</span>
                        <span className="text-emerald-400 font-bold">R$ {item.totalValue.toFixed(2)}</span>
                      </div>
                   </div>

                   {activeTab === 'quotes' && (
                     <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                         {item.status === 'Aberto' && (
                           <>
                              <button 
                                onClick={() => onUpdateQuoteStatus(item.id, 'Aprovado')}
                                className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Aprovar"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                onClick={() => onUpdateQuoteStatus(item.id, 'Rejeitado')}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Rejeitar"
                              >
                                <X size={18} />
                              </button>
                           </>
                         )}
                         {item.status === 'Aprovado' && (
                            <button 
                              onClick={() => onGenerateContract(item)}
                              className="p-2 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors" title="Gerar Contrato"
                            >
                              <FileCheck size={18} />
                            </button>
                         )}
                       </div>
                   )}
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl max-w-4xl w-full p-6 animate-scale-in my-8">
            <h3 className="text-xl font-bold text-slate-100 mb-6">
              {activeTab === 'sales' ? 'Nova Venda' : 'Novo Orçamento'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-1">Cliente</label>
                   <input 
                      required
                      type="text" 
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                      value={formClient}
                      onChange={e => setFormClient(e.target.value)}
                      list="clients-list"
                      placeholder="Nome do Cliente"
                   />
                   <datalist id="clients-list">
                      {clients.map(c => (
                        <option key={c.id} value={c.type === 'Cliente' ? c.name : c.razaoSocial} />
                      ))}
                   </datalist>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-1">Data</label>
                   <input 
                      required
                      type="date" 
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                   />
                </div>
                {activeTab === 'quotes' && (
                   <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Validade</label>
                      <input 
                          type="date" 
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                          value={formExpireDate}
                          onChange={e => setFormExpireDate(e.target.value)}
                       />
                   </div>
                )}
                {activeTab === 'sales' && (
                   <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Forma de Pagamento</label>
                      <select 
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                          value={formPaymentMethod}
                          onChange={e => setFormPaymentMethod(e.target.value)}
                       >
                          <option value="">Selecione...</option>
                          {paymentMethods.map(pm => (
                             <option key={pm.id} value={pm.name}>{pm.name}</option>
                          ))}
                       </select>
                   </div>
                )}
              </div>

              {/* Items Section */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                 <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <ShoppingCart size={18} /> Itens
                 </h4>

                 <div className="flex gap-2 mb-4">
                    <select 
                       className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none text-sm text-white"
                       value={selectedProduct}
                       onChange={e => setSelectedProduct(e.target.value)}
                    >
                       <option value="">Adicionar produto...</option>
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
                       onClick={handleAddItem}
                       className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                       <Plus size={20} />
                    </button>
                 </div>

                 <div className="max-h-60 overflow-y-auto">
                    {formItems.length === 0 ? (
                       <p className="text-sm text-slate-500 text-center py-4">Nenhum item adicionado.</p>
                    ) : (
                       <table className="w-full text-sm text-left">
                          <thead className="text-slate-400 border-b border-white/10">
                             <tr>
                                <th className="pb-2">Produto</th>
                                <th className="pb-2 text-center">Qtd</th>
                                <th className="pb-2 text-right">Total</th>
                                <th className="pb-2"></th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                             {formItems.map((item, idx) => (
                                <tr key={idx} className="text-slate-300">
                                   <td className="py-2">{item.productName}</td>
                                   <td className="py-2 text-center">{item.quantity}</td>
                                   <td className="py-2 text-right">R$ {item.total.toFixed(2)}</td>
                                   <td className="py-2 text-right">
                                      <button 
                                         type="button" 
                                         onClick={() => handleRemoveItem(item.productId)}
                                         className="text-red-400 hover:text-red-300"
                                      >
                                         <Trash2 size={14} />
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    )}
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-white/10 flex justify-end items-center gap-4">
                    <span className="text-slate-400">Total Geral:</span>
                    <span className="text-2xl font-bold text-emerald-400">R$ {totalValue.toFixed(2)}</span>
                 </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-400 hover:bg-slate-800 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={formItems.length === 0 || !formClient}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activeTab === 'sales' ? 'Finalizar Venda' : 'Salvar Orçamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;