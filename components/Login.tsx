import React, { useState } from 'react';
import { Lock, User, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { Client, Employee } from '../types';

interface LoginProps {
  clients: Client[];
  employees?: Employee[];
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

    // Simulate network delay for effect
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
    }, 1000);
  };

  const handleFillCredentials = (user: string, pass: string) => {
    setEmail(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans">
      {/* Background Decor Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-indigo-950 z-0" />

      {/* Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md p-6 animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-blue-500 p-4 rounded-2xl shadow-lg shadow-indigo-900/50 mb-6">
            <Package className="text-white" size={36} />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Nexus<span className="text-indigo-400">Gestão</span></h1>
          <p className="text-slate-400 text-sm">Sistema Integrado de Gestão Empresarial</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-slate-800">Bem-vindo de volta</h2>
              <p className="text-slate-500 text-sm mt-1">Insira suas credenciais para acessar.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email ou Usuário</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    required
                    className="block w-full pl-10 pr-3 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                    placeholder="Seu identificador"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Senha</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-3 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2 justify-center font-medium animate-shake">
                  <ShieldCheck size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Acessar Plataforma <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Access Footer */}
          <div className="bg-slate-50 px-8 py-5 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400 font-semibold uppercase tracking-wider mb-3">
              Acesso Rápido (Demo)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleFillCredentials('admin@nexus.com', 'admin')}
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all text-xs"
              >
                <span className="font-bold text-slate-700">Admin</span>
                <span className="text-slate-400 scale-90">admin / admin</span>
              </button>
              <button
                onClick={() => handleFillCredentials('joao.silva', '123456')}
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all text-xs"
              >
                <span className="font-bold text-slate-700">Funcionário</span>
                <span className="text-slate-400 scale-90">joao.silva / 123456</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8 opacity-60">
          © {new Date().getFullYear()} Nexus Gestão. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;