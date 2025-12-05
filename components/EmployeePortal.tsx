import React, { useState } from 'react';
import { 
  LogOut, LayoutGrid, LayoutList, User, FileText, DollarSign, 
  ShoppingBag, Eye, EyeOff, Calendar, ChevronDown, ChevronUp, Download, Briefcase
} from 'lucide-react';
import { Employee, Sale } from '../types';

interface EmployeePortalProps {
  employee: Employee;
  sales: Sale[]; // Purchases made by the employee
  onLogout: () => void;
}

const EmployeePortal: React.FC<EmployeePortalProps> = ({ employee, sales, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'purchases'>('overview');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);

  // Filter sales linked to this employee
  const myPurchases = sales.filter(s => s.clientId === employee.id || s.clientName === employee.name);
  
  // Calculations
  const netSalary = employee.salary - employee.advances;
  const totalPurchases = myPurchases.reduce((acc, sale) => acc + sale.totalValue, 0);

  const toggleSaleDetails = (id: string) => {
    setExpandedSaleId(prev => prev === id ? null : id);
  };

  const handleDownloadPayroll = () => {
    // Mock download
    alert(`Iniciando download do Holerite para ${employee.name}... (Simulação PDF)`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Briefcase className="text-white" size={20} />
              </div>
              <span className="font-bold text-slate-800 text-lg">Portal do Colaborador</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-800">{employee.name}</span>
                <span className="text-xs text-slate-500">{employee.role}</span>
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
           <h1 className="text-2xl font-bold text-slate-800">Olá, {employee.name.split(' ')[0]}</h1>
           <p className="text-slate-500">Acompanhe seus dados, pagamentos e consumo interno.</p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                 <DollarSign size={24} />
              </div>
              <div>
                 <p className="text-sm font-medium text-slate-500">Salário Base</p>
                 <p className="text-2xl font-bold text-slate-800">R$ {employee.salary.toFixed(2)}</p>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                 <DollarSign size={24} />
              </div>
              <div>
                 <p className="text-sm font-medium text-slate-500">Adiantamentos</p>
                 <p className="text-2xl font-bold text-red-600">- R$ {employee.advances.toFixed(2)}</p>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                 <FileText size={24} />
              </div>
              <div>
                 <p className="text-sm font-medium text-slate-500">Salário Líquido (Est.)</p>
                 <p className="text-2xl font-bold text-blue-600">R$ {netSalary.toFixed(2)}</p>
              </div>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
           <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
             <button
               onClick={() => setActiveTab('overview')}
               className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'overview' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Dados Pessoais
             </button>
             <button
               onClick={() => setActiveTab('financial')}
               className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'financial' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Holerite
             </button>
             <button
               onClick={() => setActiveTab('purchases')}
               className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'purchases' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Minhas Compras
             </button>
           </div>
           
           {activeTab === 'purchases' && (
             <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}><LayoutList size={20}/></button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
             </div>
           )}
        </div>

        {/* TAB CONTENT */}
        
        {/* Personal Data */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" /> Dados Cadastrais
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <p className="text-sm text-slate-500 mb-1">Nome Completo</p>
                   <p className="font-medium text-slate-800">{employee.name}</p>
                </div>
                <div>
                   <p className="text-sm text-slate-500 mb-1">CPF</p>
                   <p className="font-medium text-slate-800">{employee.cpf}</p>
                </div>
                <div>
                   <p className="text-sm text-slate-500 mb-1">Email</p>
                   <p className="font-medium text-slate-800">{employee.email}</p>
                </div>
                <div>
                   <p className="text-sm text-slate-500 mb-1">Endereço</p>
                   <p className="font-medium text-slate-800">{employee.address.endereco}, {employee.address.bairro} - {employee.address.cidade}/{employee.address.uf}</p>
                </div>
                <div>
                   <p className="text-sm text-slate-500 mb-1">Função</p>
                   <p className="font-medium text-slate-800">{employee.role}</p>
                </div>
                <div>
                   <p className="text-sm text-slate-500 mb-1">Nome de Usuário</p>
                   <p className="font-medium text-slate-800">{employee.username}</p>
                </div>
             </div>
          </div>
        )}

        {/* Payroll (Holerite) */}
        {activeTab === 'financial' && (
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" /> Folha de Pagamento
             </h3>
             <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 text-center">
                <FileText size={48} className="mx-auto text-slate-400 mb-4" />
                <h4 className="text-lg font-semibold text-slate-700">Holerite Mensal Disponível</h4>
                <p className="text-slate-500 mb-6">Mês de Referência: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                
                <button 
                  onClick={handleDownloadPayroll}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors shadow-sm"
                >
                   <Download size={20} /> Baixar PDF
                </button>
             </div>
           </div>
        )}

        {/* Purchases (Consumo Interno) */}
        {activeTab === 'purchases' && (
           <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center justify-between">
                 <div>
                    <h4 className="font-bold text-blue-800">Total em Consumo/Serviços</h4>
                    <p className="text-sm text-blue-600">Compras realizadas internamente.</p>
                 </div>
                 <p className="text-2xl font-bold text-blue-700">R$ {totalPurchases.toFixed(2)}</p>
              </div>

              {myPurchases.length === 0 ? (
                 <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
                    Nenhuma compra registrada.
                 </div>
              ) : viewMode === 'list' ? (
                 <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                          <tr>
                             <th className="px-6 py-4">Data</th>
                             <th className="px-6 py-4">ID Venda</th>
                             <th className="px-6 py-4">Total</th>
                             <th className="px-6 py-4 text-right">Ação</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {myPurchases.map(sale => (
                             <React.Fragment key={sale.id}>
                                <tr className="hover:bg-slate-50">
                                   <td className="px-6 py-4 text-slate-600">
                                      {new Date(sale.date).toLocaleDateString('pt-BR')}
                                   </td>
                                   <td className="px-6 py-4 font-mono text-xs text-slate-500">{sale.id}</td>
                                   <td className="px-6 py-4 font-bold text-slate-800">R$ {sale.totalValue.toFixed(2)}</td>
                                   <td className="px-6 py-4 text-right">
                                      <button 
                                         onClick={() => toggleSaleDetails(sale.id)}
                                         className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 justify-end w-full"
                                      >
                                         {expandedSaleId === sale.id ? 'Ocultar' : 'Ver Detalhes'}
                                         {expandedSaleId === sale.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                      </button>
                                   </td>
                                </tr>
                                {expandedSaleId === sale.id && (
                                   <tr className="bg-slate-50 animate-fade-in">
                                      <td colSpan={4} className="px-6 py-4">
                                         <div className="bg-white p-4 rounded border border-slate-200">
                                            <h5 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                               <ShoppingBag size={16} /> Itens da Compra
                                            </h5>
                                            <ul className="space-y-2">
                                               {sale.items.map((item, idx) => (
                                                  <li key={idx} className="flex justify-between text-sm border-b border-slate-100 last:border-0 pb-1">
                                                     <span className="text-slate-600">{item.productName} <span className="text-xs text-slate-400">x{item.quantity}</span></span>
                                                     <span className="font-medium text-slate-800">R$ {item.total.toFixed(2)}</span>
                                                  </li>
                                               ))}
                                            </ul>
                                         </div>
                                      </td>
                                   </tr>
                                )}
                             </React.Fragment>
                          ))}
                       </tbody>
                    </table>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myPurchases.map(sale => (
                       <div key={sale.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <ShoppingBag size={20} />
                             </div>
                             <span className="text-xs font-mono text-slate-400">{new Date(sale.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          
                          <h4 className="font-bold text-slate-800 mb-1">Compra Interna</h4>
                          <p className="text-xs text-slate-500 mb-4">ID: {sale.id}</p>

                          {expandedSaleId === sale.id ? (
                             <div className="mb-4 bg-slate-50 p-3 rounded-lg animate-fade-in">
                                <ul className="space-y-2 mb-2">
                                   {sale.items.map((item, idx) => (
                                      <li key={idx} className="flex justify-between text-xs">
                                         <span className="text-slate-600">{item.productName} (x{item.quantity})</span>
                                         <span className="font-medium">R$ {item.total.toFixed(2)}</span>
                                      </li>
                                   ))}
                                </ul>
                             </div>
                          ) : (
                             <div className="bg-slate-50 p-4 rounded-lg text-center mb-4">
                                <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                                  <EyeOff size={16} /> Detalhes ocultos
                                </p>
                             </div>
                          )}

                          <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                             <span className="font-bold text-lg text-slate-800">R$ {sale.totalValue.toFixed(2)}</span>
                             <button 
                                onClick={() => toggleSaleDetails(sale.id)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                             >
                                {expandedSaleId === sale.id ? 'Ocultar' : 'Detalhes'}
                                {expandedSaleId === sale.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        )}
      </main>
    </div>
  );
};

export default EmployeePortal;