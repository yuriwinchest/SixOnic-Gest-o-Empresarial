import React, { useState } from 'react';
import { Plus, ArrowUpCircle, ArrowDownCircle, Search, Percent, Target, PieChart, Layers, Trash2, Edit2, Save, CreditCard } from 'lucide-react';
import { Transaction, TransactionType, MarginRule, CostCenter, PaymentMethod } from '../types';

interface FinanceProps {
  transactions: Transaction[];
  marginRules: MarginRule[];
  costCenters: CostCenter[];
  paymentMethods: PaymentMethod[]; // New prop
  onAddTransaction: (transaction: Transaction) => void;
  onUpdateMarginRule: (rule: MarginRule) => void;
  onAddCostCenter: (costCenter: CostCenter) => void;
  onUpdateCostCenter: (costCenter: CostCenter) => void;
  onDeleteCostCenter: (id: string) => void;
  onAddPaymentMethod: (method: PaymentMethod) => void; // New handler
  onUpdatePaymentMethod: (method: PaymentMethod) => void; // New handler
  onDeletePaymentMethod: (id: string) => void; // New handler
}

const Finance: React.FC<FinanceProps> = ({ 
  transactions, 
  marginRules, 
  costCenters, 
  paymentMethods,
  onAddTransaction,
  onUpdateMarginRule,
  onAddCostCenter,
  onUpdateCostCenter,
  onDeleteCostCenter,
  onAddPaymentMethod,
  onUpdatePaymentMethod,
  onDeletePaymentMethod
}) => {
  const [activeTab, setActiveTab] = useState<'cashflow' | 'margins' | 'costs' | 'payments'>('cashflow');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
  
  // Transaction Form State
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: TransactionType.EXPENSE,
    date: new Date().toISOString().split('T')[0]
  });

  // Cost Center Form State
  const [editingCostCenterId, setEditingCostCenterId] = useState<string | null>(null);
  const [costCenterForm, setCostCenterForm] = useState<Partial<CostCenter>>({
    name: '',
    type: 'Fixo',
    description: ''
  });

  // Payment Method Form State
  const [editingPaymentMethodId, setEditingPaymentMethodId] = useState<string | null>(null);
  const [paymentMethodForm, setPaymentMethodForm] = useState<Partial<PaymentMethod>>({
    name: '',
    type: 'Outro',
    feePercentage: 0
  });

  // Margin Editing State
  const [editingMarginId, setEditingMarginId] = useState<string | null>(null);
  const [marginValue, setMarginValue] = useState<string>('');

  // Calculations for Cashflow
  const income = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  // Handlers
  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTransaction.description && newTransaction.amount) {
      onAddTransaction({
        id: `TR-${Date.now()}`,
        description: newTransaction.description,
        amount: Number(newTransaction.amount),
        type: newTransaction.type as TransactionType,
        date: newTransaction.date || new Date().toISOString(),
        category: newTransaction.category || 'Geral',
      });
      setIsTransactionModalOpen(false);
      setNewTransaction({ type: TransactionType.EXPENSE, date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleCostCenterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (costCenterForm.name) {
      if (editingCostCenterId) {
        onUpdateCostCenter({ ...costCenterForm as CostCenter, id: editingCostCenterId });
      } else {
        onAddCostCenter({
          ...costCenterForm as CostCenter,
          id: `CC-${Date.now()}`
        });
      }
      setIsCostCenterModalOpen(false);
    }
  };

  const handlePaymentMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethodForm.name && paymentMethodForm.feePercentage !== undefined) {
      if (editingPaymentMethodId) {
        onUpdatePaymentMethod({ ...paymentMethodForm as PaymentMethod, id: editingPaymentMethodId });
      } else {
        onAddPaymentMethod({
          ...paymentMethodForm as PaymentMethod,
          id: `PM-${Date.now()}`
        });
      }
      setIsPaymentMethodModalOpen(false);
    }
  };

  const openCostCenterModal = (cc?: CostCenter) => {
    if (cc) {
      setEditingCostCenterId(cc.id);
      setCostCenterForm(cc);
    } else {
      setEditingCostCenterId(null);
      setCostCenterForm({ name: '', type: 'Fixo', description: '' });
    }
    setIsCostCenterModalOpen(true);
  };

  const openPaymentMethodModal = (pm?: PaymentMethod) => {
    if (pm) {
      setEditingPaymentMethodId(pm.id);
      setPaymentMethodForm(pm);
    } else {
      setEditingPaymentMethodId(null);
      setPaymentMethodForm({ name: '', type: 'Outro', feePercentage: 0 });
    }
    setIsPaymentMethodModalOpen(true);
  };

  const startEditingMargin = (rule: MarginRule) => {
    setEditingMarginId(rule.id);
    setMarginValue(rule.percentage.toString());
  };

  const saveMargin = (rule: MarginRule) => {
    onUpdateMarginRule({ ...rule, percentage: parseFloat(marginValue) });
    setEditingMarginId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
          <p className="text-slate-500">Controle de receitas, despesas e custos.</p>
        </div>
        {activeTab === 'cashflow' && (
          <button 
            onClick={() => setIsTransactionModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Nova Transação
          </button>
        )}
        {activeTab === 'costs' && (
          <button 
            onClick={() => openCostCenterModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Novo Centro de Custo
          </button>
        )}
        {activeTab === 'payments' && (
          <button 
            onClick={() => openPaymentMethodModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Nova Forma de Pagamento
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cashflow')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'cashflow' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <PieChart size={18} /> Fluxo de Caixa
          {activeTab === 'cashflow' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('margins')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'margins' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Percent size={18} /> Margens
          {activeTab === 'margins' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('costs')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'costs' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers size={18} /> Centros de Custo
          {activeTab === 'costs' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'payments' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <CreditCard size={18} /> Formas de Pagamento
          {activeTab === 'payments' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
      </div>

      {/* CASHFLOW TAB */}
      {activeTab === 'cashflow' && (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-500 text-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-emerald-100 font-medium">Entradas</span>
                <ArrowUpCircle className="opacity-80" />
              </div>
              <span className="text-2xl font-bold">R$ {income.toFixed(2)}</span>
            </div>
            <div className="bg-red-500 text-white p-6 rounded-xl shadow-sm">
               <div className="flex justify-between items-center mb-2">
                <span className="text-red-100 font-medium">Saídas</span>
                <ArrowDownCircle className="opacity-80" />
              </div>
              <span className="text-2xl font-bold">R$ {expense.toFixed(2)}</span>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
               <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 font-medium">Saldo Líquido</span>
                <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600">Este Mês</span>
              </div>
              <span className={`text-2xl font-bold ${income - expense >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                R$ {(income - expense).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">
              Últimas Transações
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                  <tr>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.slice().reverse().map(transaction => (
                    <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">{transaction.description}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs">{transaction.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1 text-sm font-medium ${
                          transaction.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {transaction.type === TransactionType.INCOME ? <ArrowUpCircle size={14}/> : <ArrowDownCircle size={14}/>}
                          {transaction.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${
                        transaction.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {transaction.type === TransactionType.INCOME ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MARGINS TAB */}
      {activeTab === 'margins' && (
        <div className="animate-fade-in max-w-4xl mx-auto">
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Target size={20} className="text-indigo-600" /> Definição de Margens de Lucro
              </h3>
              <p className="text-slate-500 mb-6 text-sm">
                 Defina as margens padrão aplicadas aos preços de custo dos produtos para venda no Varejo e Atacado.
              </p>

              <div className="overflow-hidden rounded-lg border border-slate-200">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                       <tr>
                          <th className="px-6 py-4">Tipo de Venda</th>
                          <th className="px-6 py-4 text-right">Margem (%)</th>
                          <th className="px-6 py-4 text-right">Ação</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {marginRules.map(rule => (
                          <tr key={rule.id} className="hover:bg-slate-50">
                             <td className="px-6 py-4 font-medium text-slate-800">{rule.name}</td>
                             <td className="px-6 py-4 text-right">
                                {editingMarginId === rule.id ? (
                                   <div className="flex justify-end items-center gap-1">
                                      <input 
                                        type="number" 
                                        className="w-20 px-2 py-1 border border-slate-300 rounded text-right focus:outline-none focus:border-indigo-500 text-slate-900"
                                        value={marginValue}
                                        onChange={e => setMarginValue(e.target.value)}
                                        autoFocus
                                      />
                                      <span className="text-slate-500">%</span>
                                   </div>
                                ) : (
                                   <span className="text-slate-700 font-bold">{rule.percentage}%</span>
                                )}
                             </td>
                             <td className="px-6 py-4 text-right">
                                {editingMarginId === rule.id ? (
                                   <button 
                                      onClick={() => saveMargin(rule)}
                                      className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded text-xs font-medium hover:bg-emerald-100 border border-emerald-200"
                                   >
                                      Salvar
                                   </button>
                                ) : (
                                   <button 
                                      onClick={() => startEditingMargin(rule)}
                                      className="p-1 text-slate-400 hover:text-indigo-600"
                                      title="Editar"
                                   >
                                      <Edit2 size={18} />
                                   </button>
                                )}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* COST CENTERS TAB */}
      {activeTab === 'costs' && (
        <div className="animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {costCenters.map(cc => (
                 <div key={cc.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                       <div className="flex justify-between items-start mb-4">
                          <div className={`p-2 rounded-lg ${cc.type === 'Fixo' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                             <Layers size={20} />
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${cc.type === 'Fixo' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                             {cc.type}
                          </span>
                       </div>
                       <h3 className="font-bold text-slate-800 text-lg mb-2">{cc.name}</h3>
                       <p className="text-sm text-slate-500 mb-4">{cc.description || 'Sem descrição'}</p>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                       <button 
                          onClick={() => openCostCenterModal(cc)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                       >
                          <Edit2 size={18} />
                       </button>
                       <button 
                          onClick={() => onDeleteCostCenter(cc.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                 </div>
              ))}
           </div>
           
           {costCenters.length === 0 && (
              <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
                 Nenhum centro de custo cadastrado.
              </div>
           )}
        </div>
      )}

      {/* PAYMENT METHODS TAB */}
      {activeTab === 'payments' && (
        <div className="animate-fade-in max-w-5xl mx-auto">
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <CreditCard size={20} className="text-indigo-600" /> Cadastro de Formas de Pagamento
              </h3>
              <p className="text-slate-500 mb-6 text-sm">
                 Gerencie as formas de pagamento aceitas e as taxas aplicadas para cada uma. Isso afetará os cálculos de vendas.
              </p>

              <div className="overflow-hidden rounded-lg border border-slate-200">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                       <tr>
                          <th className="px-6 py-4">Nome da Forma de Pagamento</th>
                          <th className="px-6 py-4">Tipo</th>
                          <th className="px-6 py-4 text-right">Taxa (%)</th>
                          <th className="px-6 py-4 text-right">Ações</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {paymentMethods.map(method => (
                          <tr key={method.id} className="hover:bg-slate-50">
                             <td className="px-6 py-4 font-medium text-slate-800">{method.name}</td>
                             <td className="px-6 py-4 text-slate-600">
                                <span className="bg-slate-100 px-2 py-1 rounded text-xs">{method.type}</span>
                             </td>
                             <td className="px-6 py-4 text-right font-medium text-slate-700">
                                {method.feePercentage > 0 ? (
                                  <span className="text-red-600">-{method.feePercentage}%</span>
                                ) : (
                                  <span className="text-emerald-600">Isento</span>
                                )}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                   <button 
                                      onClick={() => openPaymentMethodModal(method)}
                                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                                      title="Editar"
                                   >
                                      <Edit2 size={18} />
                                   </button>
                                   <button 
                                      onClick={() => onDeletePaymentMethod(method.id)}
                                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                      title="Excluir"
                                   >
                                      <Trash2 size={18} />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {isPaymentMethodModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
               {editingPaymentMethodId ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
            </h3>
            <form onSubmit={handlePaymentMethodSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome (Exibição)</label>
                  <input 
                     required
                     type="text" 
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                     value={paymentMethodForm.name}
                     onChange={e => setPaymentMethodForm({...paymentMethodForm, name: e.target.value})}
                     placeholder="Ex: Visa Crédito 1x"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <select
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
                     value={paymentMethodForm.type}
                     onChange={e => setPaymentMethodForm({...paymentMethodForm, type: e.target.value as any})}
                  >
                     <option value="Dinheiro">Dinheiro</option>
                     <option value="Pix">Pix</option>
                     <option value="Cartão de Crédito">Cartão de Crédito</option>
                     <option value="Cartão de Débito">Cartão de Débito</option>
                     <option value="Boleto">Boleto</option>
                     <option value="Entrada">Entrada</option>
                     <option value="Outro">Outro</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Taxa (%)</label>
                  <div className="relative">
                     <input 
                        required
                        type="number" 
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={paymentMethodForm.feePercentage}
                        onChange={e => setPaymentMethodForm({...paymentMethodForm, feePercentage: parseFloat(e.target.value)})}
                     />
                     <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Taxa administrativa descontada do valor recebido.</p>
               </div>

               <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsPaymentMethodModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Nova Transação</h3>
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type"
                      checked={newTransaction.type === TransactionType.INCOME}
                      onChange={() => setNewTransaction({...newTransaction, type: TransactionType.INCOME})}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700">Receita</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type"
                      checked={newTransaction.type === TransactionType.EXPENSE}
                      onChange={() => setNewTransaction({...newTransaction, type: TransactionType.EXPENSE})}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700">Despesa</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                  value={newTransaction.description || ''}
                  onChange={e => setNewTransaction({...newTransaction, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                    value={newTransaction.amount || ''}
                    onChange={e => setNewTransaction({...newTransaction, amount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                    value={newTransaction.date}
                    onChange={e => setNewTransaction({...newTransaction, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
                  value={newTransaction.category || ''}
                  onChange={e => setNewTransaction({...newTransaction, category: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Serviços">Serviços</option>
                  {costCenters.map(cc => (
                     <option key={cc.id} value={cc.name}>{cc.name} ({cc.type})</option>
                  ))}
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsTransactionModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cost Center Modal */}
      {isCostCenterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
               {editingCostCenterId ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
            </h3>
            <form onSubmit={handleCostCenterSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                  <input 
                     required
                     type="text" 
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                     value={costCenterForm.name}
                     onChange={e => setCostCenterForm({...costCenterForm, name: e.target.value})}
                     placeholder="Ex: Aluguel, Marketing..."
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Custo</label>
                  <select
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
                     value={costCenterForm.type}
                     onChange={e => setCostCenterForm({...costCenterForm, type: e.target.value as any})}
                  >
                     <option value="Fixo">Custo Fixo</option>
                     <option value="Variável">Custo Variável</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Custos fixos ocorrem periodicamente (ex: Aluguel). Custos variáveis dependem da atividade (ex: Peças).
                  </p>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                  <textarea 
                     rows={3}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                     value={costCenterForm.description || ''}
                     onChange={e => setCostCenterForm({...costCenterForm, description: e.target.value})}
                  />
               </div>

               <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsCostCenterModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;