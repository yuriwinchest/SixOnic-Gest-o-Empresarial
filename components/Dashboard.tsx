import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle, ClipboardList, DollarSign } from 'lucide-react';
import { AppState, TransactionType, OSTatus } from '../types';
import { generateBusinessInsight } from '../services/geminiService';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculations
  const income = state.transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);
  
  const expense = state.transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;
  const pendingOS = state.workOrders.filter(os => os.status === OSTatus.PENDING).length;
  const lowStockCount = state.products.filter(p => p.stock <= p.minStock).length;

  // Chart Data
  const financialData = [
    { name: 'Receitas', value: income, color: '#10b981' },
    { name: 'Despesas', value: expense, color: '#ef4444' },
  ];

  const osData = [
    { name: 'Pendentes', value: state.workOrders.filter(os => os.status === OSTatus.PENDING).length },
    { name: 'Andamento', value: state.workOrders.filter(os => os.status === OSTatus.IN_PROGRESS).length },
    { name: 'Concluídas', value: state.workOrders.filter(os => os.status === OSTatus.COMPLETED).length },
  ];
  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

  const handleGenerateInsight = async () => {
    setLoading(true);
    const result = await generateBusinessInsight(state);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-slate-500">Acompanhe os principais indicadores do seu negócio.</p>
        </div>
        <button
          onClick={handleGenerateInsight}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Sparkles size={20} />
          )}
          {loading ? 'Analisando...' : 'Consultor IA'}
        </button>
      </div>

      {insight && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={100} className="text-indigo-600" />
          </div>
          <h3 className="font-semibold text-indigo-900 flex items-center gap-2 mb-2">
            <Sparkles size={18} /> Análise Inteligente Nexus
          </h3>
          <div className="prose prose-indigo text-slate-700 max-w-none">
             <div dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Saldo Atual</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              R$ {balance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">OS Pendentes</p>
            <p className="text-2xl font-bold text-slate-800">{pendingOS}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Estoque Baixo</p>
            <p className="text-2xl font-bold text-slate-800">{lowStockCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Receita Total</p>
            <p className="text-2xl font-bold text-slate-800">R$ {income.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Fluxo de Caixa</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip 
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Status de Serviços</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={osData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {osData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {osData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-sm text-slate-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}: {entry.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;