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
    { name: 'Receitas', value: income, color: '#2dd4bf' }, // Teal 400
    { name: 'Despesas', value: expense, color: '#f87171' }, // Red 400
  ];

  const osData = [
    { name: 'Pendentes', value: state.workOrders.filter(os => os.status === OSTatus.PENDING).length },
    { name: 'Andamento', value: state.workOrders.filter(os => os.status === OSTatus.IN_PROGRESS).length },
    { name: 'Concluídas', value: state.workOrders.filter(os => os.status === OSTatus.COMPLETED).length },
  ];
  const COLORS = ['#fbbf24', '#60a5fa', '#34d399', '#f87171']; // Updated to lighter shades

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
          <h2 className="text-2xl font-bold text-slate-100">Visão Geral</h2>
          <p className="text-slate-400">Acompanhe os principais indicadores do seu negócio.</p>
        </div>
        <button
          onClick={handleGenerateInsight}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 shadow-lg shadow-blue-900/50 border border-white/10"
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
        <div className="bg-gradient-to-r from-indigo-900/60 to-blue-900/60 border border-indigo-500/30 p-6 rounded-xl shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Sparkles size={100} className="text-cyan-400" />
          </div>
          <h3 className="font-semibold text-cyan-200 flex items-center gap-2 mb-2">
            <Sparkles size={18} /> Análise Inteligente Nexus
          </h3>
          <div className="prose prose-invert text-slate-300 max-w-none">
             <div dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/5 flex items-center gap-4 hover:bg-slate-800/60 transition-colors">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Saldo Atual</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              R$ {balance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/5 flex items-center gap-4 hover:bg-slate-800/60 transition-colors">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">OS Pendentes</p>
            <p className="text-2xl font-bold text-slate-100">{pendingOS}</p>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/5 flex items-center gap-4 hover:bg-slate-800/60 transition-colors">
          <div className="p-3 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Estoque Baixo</p>
            <p className="text-2xl font-bold text-slate-100">{lowStockCount}</p>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/5 flex items-center gap-4 hover:bg-slate-800/60 transition-colors">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Receita Total</p>
            <p className="text-2xl font-bold text-slate-100">R$ {income.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/5">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Fluxo de Caixa</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" />
                <Tooltip 
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #475569', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
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

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/5">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Status de Serviços</h3>
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
                  stroke="none"
                >
                  {osData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #475569', color: '#f8fafc' }}
                   itemStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {osData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-sm text-slate-300">
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