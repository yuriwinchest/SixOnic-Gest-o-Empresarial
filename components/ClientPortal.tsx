import React, { useState, useEffect } from 'react';
import { 
  LogOut, LayoutGrid, LayoutList, Package, Wrench, Calendar, 
  CreditCard, ShieldCheck, Clock, User, CheckCircle, AlertCircle, XCircle,
  ChevronDown, ChevronUp, Eye, EyeOff, BellRing, AlertTriangle
} from 'lucide-react';
import { Client, WorkOrder, ClientPurchase, OSTatus } from '../types';

interface ClientPortalProps {
  client: Client;
  workOrders: WorkOrder[];
  purchases: ClientPurchase[];
  onLogout: () => void;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ client, workOrders, purchases, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'os' | 'products'>('overview');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter data for this specific client
  const myOrders = workOrders.filter(os => os.clientId === client.id || os.clientName === client.name);
  const myPurchases = purchases.filter(p => p.clientId === client.id);

  // Alerts Logic
  const pendingPayments = myPurchases.filter(p => p.paymentStatus === 'Pendente');
  const expiringWarranties = myPurchases.filter(p => {
    const expireDate = new Date(p.warrantyExpireDate);
    const today = new Date();
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30; // Expiring within 30 days
  });

  const toggleDetails = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getStatusColor = (status: OSTatus) => {
    switch(status) {
      case OSTatus.PENDING: return 'bg-amber-100 text-amber-800';
      case OSTatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      case OSTatus.COMPLETED: return 'bg-emerald-100 text-emerald-800';
      case OSTatus.CANCELED: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: OSTatus) => {
    switch(status) {
      case OSTatus.PENDING: return <Clock size={16} />;
      case OSTatus.IN_PROGRESS: return <AlertCircle size={16} />;
      case OSTatus.COMPLETED: return <CheckCircle size={16} />;
      case OSTatus.CANCELED: return <XCircle size={16} />;
    }
  };

  const calculateWarrantyDays = (dateString: string) => {
    const expireDate = new Date(dateString);
    const today = new Date();
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper for greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Package className="text-white" size={20} />
              </div>
              <span className="font-bold text-slate-800 text-lg">Área do Cliente</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-800">{client.name}</span>
                <span className="text-xs text-slate-500">{client.email}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section with Dynamic Time/Date and Alerts */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Clock size={120} className="text-indigo-600" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {getGreeting()}, {client.name?.split(' ')[0]}!
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2 mb-6">
              <Calendar size={16} /> {formatDateFull(currentTime)} 
              <span className="mx-2 text-slate-300">|</span> 
              <Clock size={16} /> {formatTime(currentTime)}
            </p>

            {/* Critical Alerts Section */}
            {(pendingPayments.length > 0 || expiringWarranties.length > 0) && (
              <div className="space-y-3 max-w-2xl">
                {pendingPayments.length > 0 && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 p-4 rounded-lg animate-fade-in">
                    <div className="p-2 bg-red-100 text-red-600 rounded-full">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-800 text-sm">Atenção: Débitos Pendentes</h4>
                      <p className="text-sm text-red-600 mt-1">
                        Você possui <strong>{pendingPayments.length}</strong> compra(s) com pagamento pendente.
                        Por favor, regularize sua situação.
                      </p>
                    </div>
                  </div>
                )}
                
                {expiringWarranties.length > 0 && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 p-4 rounded-lg animate-fade-in">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                      <BellRing size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-800 text-sm">Garantias Vencendo em Breve</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        A garantia de <strong>{expiringWarranties.length}</strong> produto(s) irá expirar nos próximos 30 dias.
                        Verifique seus produtos.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {pendingPayments.length === 0 && expiringWarranties.length === 0 && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg w-fit text-sm font-medium border border-emerald-100">
                <CheckCircle size={16} />
                Sua conta está em dia. Nenhuma pendência encontrada.
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Wrench size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Serviços Ativos</p>
              <p className="text-2xl font-bold text-slate-800">
                {myOrders.filter(o => o.status === OSTatus.IN_PROGRESS || o.status === OSTatus.PENDING).length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Garantias Válidas</p>
              <p className="text-2xl font-bold text-slate-800">
                {myPurchases.filter(p => calculateWarrantyDays(p.warrantyExpireDate) > 0).length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pendências Fin.</p>
              <p className="text-2xl font-bold text-slate-800">
                {myPurchases.filter(p => p.paymentStatus === 'Pendente').length}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs & View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
             <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'overview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('os')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'os' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Ordens de Serviço
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'products' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Meus Produtos
            </button>
          </div>

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
        </div>

        {/* WORK ORDERS SECTION */}
        {(activeTab === 'overview' || activeTab === 'os') && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Wrench size={20} className="text-indigo-600"/> Minhas Ordens de Serviço
            </h2>
            
            {myOrders.length === 0 ? (
               <div className="bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-500">
                 Você não possui ordens de serviço registradas.
               </div>
            ) : viewMode === 'list' ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                      <tr>
                        <th className="px-6 py-4">OS ID</th>
                        <th className="px-6 py-4">Descrição</th>
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Detalhes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myOrders.map(order => (
                        <React.Fragment key={order.id}>
                          <tr className={`hover:bg-slate-50 transition-colors ${expandedId === order.id ? 'bg-slate-50' : ''}`}>
                            <td className="px-6 py-4 text-xs font-mono text-slate-500">{order.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-800">{order.description}</td>
                            <td className="px-6 py-4 text-slate-600">{order.dateCreated}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <button 
                                onClick={() => toggleDetails(order.id)}
                                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-end gap-1 w-full"
                              >
                                {expandedId === order.id ? 'Ocultar' : 'Ver Detalhes'}
                                {expandedId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </td>
                          </tr>
                          {expandedId === order.id && (
                            <tr className="bg-slate-50 animate-fade-in">
                              <td colSpan={5} className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-slate-200">
                                   <div>
                                     <p className="text-xs text-slate-500 mb-1">Técnico Responsável</p>
                                     <div className="flex items-center gap-2 mb-3">
                                        <User size={16} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700">{order.technician || 'A definir'}</span>
                                     </div>
                                   </div>
                                   <div>
                                     <p className="text-xs text-slate-500 mb-1">Valor Total</p>
                                     <p className="text-lg font-bold text-slate-800">R$ {order.totalValue.toFixed(2)}</p>
                                   </div>
                                   <div className="col-span-1 md:col-span-2">
                                     <p className="text-xs text-slate-500 mb-1">Observações</p>
                                     <p className="text-sm text-slate-600">Prioridade: {order.priority}</p>
                                   </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{order.dateCreated}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{order.description}</h3>
                      <p className="text-xs text-slate-400 font-mono mb-4">{order.id}</p>
                      
                      {expandedId === order.id ? (
                        <div className="space-y-4 animate-fade-in mt-4 pt-4 border-t border-slate-100">
                           <div className="bg-slate-50 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1">Técnico Responsável</p>
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-indigo-600" />
                              <span className="text-sm font-medium text-slate-700">{order.technician || 'Aguardando atribuição'}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-500">Prioridade</span>
                              <span className="text-sm font-medium text-slate-700">{order.priority}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                              <span className="text-sm text-slate-500">Valor Total</span>
                              <span className="text-lg font-bold text-slate-800">R$ {order.totalValue.toFixed(2)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-4 rounded-lg text-center">
                           <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                             <EyeOff size={16} /> Detalhes ocultos
                           </p>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => toggleDetails(order.id)}
                      className="mt-6 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      {expandedId === order.id ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
                      {expandedId === order.id ? <ChevronUp size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* PRODUCTS / WARRANTY SECTION */}
        {(activeTab === 'overview' || activeTab === 'products') && (
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-indigo-600"/> Produtos e Garantias
            </h2>

            {myPurchases.length === 0 ? (
               <div className="bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-500">
                 Nenhuma compra registrada.
               </div>
            ) : viewMode === 'list' ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                      <tr>
                        <th className="px-6 py-4">Produto</th>
                        <th className="px-6 py-4">Data da Compra</th>
                        <th className="px-6 py-4">Situação</th>
                        <th className="px-6 py-4 text-right">Detalhes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myPurchases.map(purchase => {
                        const daysLeft = calculateWarrantyDays(purchase.warrantyExpireDate);
                        const isExpired = daysLeft < 0;
                        return (
                          <React.Fragment key={purchase.id}>
                            <tr className={`hover:bg-slate-50 transition-colors ${expandedId === purchase.id ? 'bg-slate-50' : ''}`}>
                              <td className="px-6 py-4 font-medium text-slate-800">{purchase.productName}</td>
                              <td className="px-6 py-4 text-slate-600">
                                {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded text-xs font-semibold ${purchase.paymentStatus === 'Pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {purchase.paymentStatus}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => toggleDetails(purchase.id)}
                                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-end gap-1 w-full"
                                >
                                  {expandedId === purchase.id ? 'Ocultar' : 'Ver Detalhes'}
                                  {expandedId === purchase.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                              </td>
                            </tr>
                            {expandedId === purchase.id && (
                              <tr className="bg-slate-50 animate-fade-in">
                                <td colSpan={4} className="px-6 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg border border-slate-200">
                                    <div>
                                       <p className="text-xs text-slate-500 mb-1">Garantia</p>
                                       <div className={`flex items-center gap-2 ${isExpired ? 'text-red-600' : 'text-emerald-600'}`}>
                                          <ShieldCheck size={16} />
                                          <span className="text-sm font-medium">
                                            {isExpired ? 'Expirada' : `Vence em ${daysLeft} dias`}
                                          </span>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                          Vence: {new Date(purchase.warrantyExpireDate).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <div>
                                       <p className="text-xs text-slate-500 mb-1">Forma de Pagamento</p>
                                       <p className="text-sm text-slate-700 font-medium">{purchase.paymentMethod}</p>
                                    </div>
                                    <div>
                                       <p className="text-xs text-slate-500 mb-1">Valor Pago</p>
                                       <p className="text-lg font-bold text-slate-800">R$ {purchase.value.toFixed(2)}</p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPurchases.map(purchase => {
                   const daysLeft = calculateWarrantyDays(purchase.warrantyExpireDate);
                   const isExpired = daysLeft < 0;
                   return (
                    <div key={purchase.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                           <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                             <Package size={20} />
                           </div>
                           <span className={`px-2 py-1 rounded text-xs font-semibold ${purchase.paymentStatus === 'Pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {purchase.paymentStatus}
                           </span>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 mb-1">{purchase.productName}</h3>
                        <p className="text-xs text-slate-500 mb-4">
                           Comprado em: {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                        </p>

                        {expandedId === purchase.id ? (
                           <div className="space-y-4 animate-fade-in mt-4 pt-4 border-t border-slate-100">
                              <div className={`p-3 rounded-lg mb-4 flex items-center justify-between ${isExpired ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                 <div className="flex items-center gap-2">
                                   <ShieldCheck size={18} />
                                   <span className="text-sm font-medium">Garantia</span>
                                 </div>
                                 <span className="text-sm font-bold">{isExpired ? 'Expirada' : `${daysLeft} dias`}</span>
                              </div>

                              <div className="space-y-2">
                                 <div className="flex justify-between text-sm">
                                   <span className="text-slate-500">Pagamento</span>
                                   <span className="text-slate-700 font-medium">{purchase.paymentMethod}</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                   <span className="text-slate-500">Vencimento</span>
                                   <span className="text-slate-700 font-medium">{new Date(purchase.warrantyExpireDate).toLocaleDateString('pt-BR')}</span>
                                 </div>
                                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                    <span className="text-sm text-slate-500">Valor</span>
                                    <span className="text-lg font-bold text-slate-800">R$ {purchase.value.toFixed(2)}</span>
                                </div>
                              </div>
                           </div>
                        ) : (
                          <div className="bg-slate-50 p-4 rounded-lg text-center">
                             <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                               <EyeOff size={16} /> Dados ocultos
                             </p>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => toggleDetails(purchase.id)}
                        className="mt-6 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        {expandedId === purchase.id ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
                        {expandedId === purchase.id ? <ChevronUp size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                   );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default ClientPortal;