import React, { useState } from 'react';
import { Users, Plus, Search, Edit2, Trash2, MapPin, Mail, LayoutGrid, LayoutList, Briefcase, DollarSign, User } from 'lucide-react';
import { Employee, ClientAddress } from '../types';

interface EmployeesProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
  onUpdateEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

const initialAddress: ClientAddress = {
  cep: '', rua: '', cidade: '', bairro: '', endereco: '', complemento: '', uf: ''
};

const initialEmployeeState: Partial<Employee> = {
  name: '',
  cpf: '',
  role: '',
  salary: 0,
  advances: 0,
  username: '',
  email: '',
  password: '',
  address: initialAddress
};

const Employees: React.FC<EmployeesProps> = ({ employees, onAddEmployee, onUpdateEmployee, onDeleteEmployee }) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>(initialEmployeeState);

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cpf.includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialEmployeeState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData(employee);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateEmployee({ ...formData as Employee, id: editingId });
    } else {
      onAddEmployee({
        ...formData as Employee,
        id: `EMP-${Date.now()}`
      });
    }
    setIsModalOpen(false);
  };

  // Helper for address fields
  const handleAddressChange = (field: keyof ClientAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address!, [field]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Funcionários / Colaboradores</h2>
          <p className="text-slate-400">Gerencie sua equipe, funções e salários.</p>
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
            <Plus size={20} /> Novo Funcionário
          </button>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, função ou CPF..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-300 font-medium text-sm">
                <tr>
                  <th className="px-6 py-4">Nome / Função</th>
                  <th className="px-6 py-4">CPF / Contato</th>
                  <th className="px-6 py-4">Salário</th>
                  <th className="px-6 py-4">Localização</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-white/5 transition-colors text-slate-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-full">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">{emp.name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Briefcase size={10} /> {emp.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      <div className="flex flex-col">
                        <span>{emp.cpf}</span>
                        <span className="text-xs text-slate-500">{emp.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-medium text-sm">
                      R$ {emp.salary.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {emp.address.cidade} - {emp.address.uf}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => onDeleteEmployee(emp.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-6 hover:bg-slate-800/40 transition-colors">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-full">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 truncate w-32">{emp.name}</h3>
                    <p className="text-xs text-slate-400">{emp.role}</p>
                  </div>
               </div>

               <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                     <span className="text-slate-400">Salário</span>
                     <span className="font-semibold text-slate-200">R$ {emp.salary.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-400">Adiantamentos</span>
                     <span className="text-red-400">R$ {emp.advances.toFixed(2)}</span>
                  </div>
               </div>
               
               <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => handleOpenEdit(emp)}
                    className="p-2 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => onDeleteEmployee(emp.id)}
                    className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-scale-in my-8">
            <h3 className="text-xl font-bold text-slate-100 mb-6">
              {editingId ? 'Editar Funcionário' : 'Novo Funcionário'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">CPF</label>
                  <input 
                    required
                    type="text" 
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                    value={formData.cpf || ''}
                    onChange={e => setFormData({...formData, cpf: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Função / Cargo</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                    value={formData.role || ''}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  />
                </div>
              </div>

              {/* Financial & Access */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/50 p-4 rounded-lg border border-white/5">
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Salário (R$)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                      value={formData.salary || ''}
                      onChange={e => setFormData({...formData, salary: Number(e.target.value)})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Adiantamentos (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                      value={formData.advances || 0}
                      onChange={e => setFormData({...formData, advances: Number(e.target.value)})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nome de Usuário</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                      value={formData.username || ''}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                      value={formData.email || ''}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Senha de Acesso</label>
                    <input 
                      required
                      type="password" 
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                      value={formData.password || ''}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                 </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-slate-500" /> Endereço Residencial
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                      <input 
                        type="text" placeholder="CEP"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none text-white placeholder-slate-500"
                        value={formData.address?.cep || ''}
                        onChange={e => handleAddressChange('cep', e.target.value)}
                      />
                   </div>
                   <div className="md:col-span-2">
                      <input 
                        type="text" placeholder="Endereço Completo"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none text-white placeholder-slate-500"
                        value={formData.address?.endereco || ''}
                        onChange={e => handleAddressChange('endereco', e.target.value)}
                      />
                   </div>
                   <div>
                      <input 
                        type="text" placeholder="Cidade"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none text-white placeholder-slate-500"
                        value={formData.address?.cidade || ''}
                        onChange={e => handleAddressChange('cidade', e.target.value)}
                      />
                   </div>
                   <div>
                      <input 
                        type="text" placeholder="Bairro"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none text-white placeholder-slate-500"
                        value={formData.address?.bairro || ''}
                        onChange={e => handleAddressChange('bairro', e.target.value)}
                      />
                   </div>
                   <div>
                      <input 
                        type="text" placeholder="UF"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none text-white placeholder-slate-500"
                        value={formData.address?.uf || ''}
                        onChange={e => handleAddressChange('uf', e.target.value)}
                      />
                   </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:bg-slate-800 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20"
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

export default Employees;