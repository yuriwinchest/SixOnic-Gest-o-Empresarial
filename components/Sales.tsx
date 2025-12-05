import React, { useState } from 'react';
import { ShoppingCart, FileText, Plus, Search, Calendar, User, DollarSign, LayoutList, LayoutGrid, CheckCircle, X, Trash2, ArrowRight } from 'lucide-react';
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
}

const Sales: React.FC<SalesProps> = ({ sales, quotes, products, clients, paymentMethods, onAddSale, onAddQuote, onUpdateQuoteStatus }) => {
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

  const selectedPaymentMethod = paymentMethods.find(m => m.name === formPaymentMethod);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'sales' ? 'Gestão de Vendas' : 'Orçamentos'}
          </h2>
          <p className="text-slate-500">
            {activeTab === 'sales' ? 'Histórico de vendas e faturamento.' : 'Gerencie propostas comerciais.'}
          </p>
        </div>
        <div className="flex gap-2">
            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutList size={20} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> {activeTab === 'sales' ? 'Nova Venda' : 'Novo Orçamento'}
          </button>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'sales' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShoppingCart size={18} /> Vendas Realizadas
          {activeTab === 'sales' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'quotes' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText size={18} /> Orçamentos
          {activeTab === 'quotes' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={activeTab === 'sales' ? "Buscar vendas..." : "Buscar orçamentos..."}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT: LIST OR GRID */}
      {filteredData.length === 0 ? (
         <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
          Nenhum registro encontrado.
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                {activeTab === 'quotes' && <th className="px-6 py-4 text-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.clientName}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">R$ {item.totalValue.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${item.status === 'Concluída' || item.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-700' : 
                        item.status === 'Pendente' || item.status === 'Aberto' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  {activeTab === 'quotes' && (
                    <td className="px-6 py-4 text-right">
                       {item.status === 'Aberto' && (
                         <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => onUpdateQuoteStatus(item.id, 'Aprovado')}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded" title="Aprovar"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => onUpdateQuoteStatus(item.id, 'Rejeitado')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded" title="Rejeitar"
                            >
                              <X size={18} />
                            </button>
                         </div>
                       )}
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
             <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        {activeTab === 'sales' ? <ShoppingCart size={24} /> : <FileText size={24} />}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${item.status === 'Concluída' || item.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-700' : 
                        item.status === 'Pendente' || item.status === 'Aberto' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                      {item.status}
                    </span>
                   </div>
                   
                   <h3 className="text-lg font-bold text-slate-800 mb-1">{item.clientName}</h3>
                   <p className="text-xs text-slate-500 font-mono mb-4">{item.id}</p>

                   <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Data</span>
                        <span className="text-slate-700">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Itens</span>
                        <span className="text-slate-700">{item.items.length} produtos</span>
                      </div>
                      {activeTab === 'sales' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Pagamento</span>
                          <span className="text-slate-700">{item.paymentMethod}</span>
                        </div>
                      )}
                      {activeTab === 'quotes' && (
                         <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Validade</span>
                          <span className="text-slate-700">{new Date(item.expireDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                   <span className="text-sm text-slate-500">Total</span>
                   <span className="text-xl font-bold text-slate-800">R$ {item.totalValue.toFixed(2)}</span>
                </div>

                {activeTab === 'quotes' && item.status === 'Aberto' && (
                    <div className="mt-4 pt-2 flex gap-2">
                        <button 
                          onClick={() => onUpdateQuoteStatus(item.id, 'Aprovado')}
                          className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
                        >
                          Aprovar
                        </button>
                        <button 
                          onClick={() => onUpdateQuoteStatus(item.id, 'Rejeitado')}
                          className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
                        >
                          Rejeitar
                        </button>
                    </div>
                )}
             </div>
           ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 animate-scale-in my-8">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {activeTab === 'sales' ? 'Nova Venda' : 'Novo Orçamento'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                  <input 
                    required
                    list="clients-list"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 placeholder-slate-400"
                    value={formClient}
                    onChange={e => setFormClient(e.target.value)}
                    placeholder="Digite o nome do cliente..."
                  />
                  <datalist id="clients-list">
                    {clients.map(c => (
                      <option key={c.id} value={c.type === 'Cliente' ? c.name : c.razaoSocial} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                  <input 
                    required
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                  />
                </div>
                {activeTab === 'sales' ? (
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Forma de Pagamento</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
                      value={formPaymentMethod}
                      onChange={e => setFormPaymentMethod(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {paymentMethods.map(method => (
                        <option key={method.id} value={method.name}>{method.name}</option>
                      ))}
                    </select>
                    {selectedPaymentMethod && selectedPaymentMethod.feePercentage > 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        Obs: Será aplicada uma taxa de {selectedPaymentMethod.feePercentage}% nesta venda.
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Válido Até</label>
                    <input 
                      type="date"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                      value={formExpireDate}
                      onChange={e => setFormExpireDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Items Section */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <ShoppingCart size={18} /> Produtos
                </h4>

                <div className="flex gap-2 mb-4">
                    <select 
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm bg-white text-slate-900"
                      value={selectedProduct}
                      onChange={e => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Selecione um produto...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      min="1"
                      className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm text-slate-900"
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

                <div className="bg-white rounded border border-slate-200 overflow-hidden">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-600">
                       <tr>
                         <th className="px-4 py-2">Produto</th>
                         <th className="px-4 py-2 text-center">Qtd</th>
                         <th className="px-4 py-2 text-right">Unit.</th>
                         <th className="px-4 py-2 text-right">Total</th>
                         <th className="px-4 py-2"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {formItems.map((item, idx) => (
                         <tr key={idx}>
                           <td className="px-4 py-2 text-slate-700">{item.productName}</td>
                           <td className="px-4 py-2 text-center text-slate-700">{item.quantity}</td>
                           <td className="px-4 py-2 text-right text-slate-700">R$ {item.unitPrice.toFixed(2)}</td>
                           <td className="px-4 py-2 text-right font-medium text-slate-700">R$ {item.total.toFixed(2)}</td>
                           <td className="px-4 py-2 text-right">
                             <button type="button" onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-700">
                               <Trash2 size={16} />
                             </button>
                           </td>
                         </tr>
                       ))}
                       {formItems.length === 0 && (
                         <tr>
                           <td colSpan={5} className="px-4 py-8 text-center text-slate-400">Nenhum produto adicionado.</td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                 <div className="text-right ml-auto">
                    <p className="text-sm text-slate-500">Valor Total</p>
                    <p className="text-2xl font-bold text-slate-800">R$ {totalValue.toFixed(2)}</p>
                 </div>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={formItems.length === 0 || !formClient}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar {activeTab === 'sales' ? 'Venda' : 'Orçamento'}
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