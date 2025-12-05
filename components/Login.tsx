import React, { useState } from 'react';
import { Lock, User, Package, ArrowRight, Briefcase } from 'lucide-react';
import { Client, Employee } from '../types';

interface LoginProps {
  clients: Client[];
  employees?: Employee[]; // Add employees prop
  onLoginSuccess: (type: 'admin' | 'client' | 'employee', userData?: Client | Employee) => void;
}

const Login: React.FC<LoginProps> = ({ clients, employees = [], onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // Hardcoded Admin Credentials for Demo
      if (email === 'admin@nexus.com' && password === 'admin') {
        onLoginSuccess('admin');
        return;
      }

      // 1. Check Employee Login (Username or Email)
      const employee = employees.find(e => 
        (e.email === email || e.username === email) && e.password === password
      );

      if (employee) {
        onLoginSuccess('employee', employee);
        return;
      }

      // 2. Check Client Login
      const client = clients.find(c => c.email === email && c.password === password && !c.blocked);
      
      if (client) {
        onLoginSuccess('client', client);
      } else {
        setError('Credenciais inválidas ou usuário bloqueado.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex bg-indigo-600 p-3 rounded-xl mb-4 shadow-lg shadow-indigo-200">
          <Package className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Nexus<span className="text-indigo-600">Gestão</span></h1>
        <p className="text-slate-500 mt-2">Acesse sua conta para continuar</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email ou Usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900 placeholder-slate-400"
                  placeholder="email@exemplo.com ou usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900 placeholder-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
          <p className="text-xs text-center text-slate-500">
            Dica Demo:<br/>
            Admin: admin@nexus.com / admin<br/>
            Func.: joao.silva / 123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;