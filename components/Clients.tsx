import React, { useState } from 'react';
import { Users, Plus, Search, Edit2, Trash2, MapPin, Phone, FileText, Building2, Briefcase, Mail, Ban, Unlock, LayoutGrid, LayoutList, User } from 'lucide-react';
import { Client, ClientAddress } from '../types';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onBlockClient?: (id: string, blocked: boolean) => void;
}

const initialAddress: ClientAddress = {
  cep: '',
  rua: '',
  cidade: '',
  bairro: '',
  endereco: '',
  complemento: '',
  uf: ''
};

const initialClientState: Partial<Client> = {
  // Cliente
  name: '',
  rg: '',
  cpf: '',
  phone: '',
  maritalStatus: 'Solteiro(a)', // Default
  
  // Fornecedor
  razaoSocial: '',
  cnpj: '',
  sellerContact: '',
  companyPhone: '',
  
  // Shared
  email: '',
  blocked: false,
  type: 'Cliente',
  address: initialAddress
};

const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, onUpdateClient, onDeleteClient, onBlockClient }) => {
  const [activeTab, setActiveTab] = useState<'Cliente' | 'Fornecedor'>('Cliente');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>(initialClientState);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Filter based on active tab AND search term
  const filteredClients = clients.filter(c => {
    const matchesTab = c.type === activeTab;
    const searchLower = searchTerm.toLowerCase();
    
    let matchesSearch = false;
    if (c.type === 'Cliente') {
      matchesSearch = (c.name?.toLowerCase().includes(searchLower) || false) || 
                      (c.cpf?.includes(searchTerm) || false) ||
                      (c.address.cidade.toLowerCase().includes(searchLower));
    } else {
      matchesSearch = (c.razaoSocial?.toLowerCase().includes(searchLower) || false) || 
                      (c.cnpj?.includes(searchTerm) || false) ||
                      (c.address.cidade.toLowerCase().includes(searchLower));
    }

    return matchesTab && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...initialClientState, type: activeTab });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData(client);
    setIsModalOpen(true);
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      setLoadingAddress(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address!,
              cep: e.target.value,
              rua: data.logradouro,
              endereco: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf,
              complemento: data.complemento
            }
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setLoadingAddress(false);
      }
    }
  };

  const handleCnpjBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cnpj = e.target.value.replace(/\D/g, '');
    if (cnpj.length === 14) {
      setLoadingAddress(true);
      try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        
        if (response.ok) {
          const data = await response.json();
          
          setFormData(prev => ({
            ...prev,
            razaoSocial: data.razao_social,
            cnpj: e.target.value,
            email: data.email,
            companyPhone: data.ddd_telefone_1, 
            address: {
              ...prev.address!,
              cep: data.cep,
              rua: data.logradouro,
              endereco: `${data.logradouro}, ${data.numero || ''}`,
              bairro: data.bairro,
              cidade: data.municipio,
              uf: data.uf,
              complemento: data.complemento
            }
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CNPJ:", error);
      } finally {
        setLoadingAddress(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateClient({ ...formData as Client, id: editingId });
    } else {
      onAddClient({
        ...formData as Client,
        id: activeTab === 'Cliente' ? `CLI-${Date.now()}` : `FOR-${Date.now()}`,
        type: activeTab
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clientes e Fornecedores</h2>
          <p className="text-slate-500">Gerencie sua base de contatos.</p>
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
            onClick={handleOpenAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Novo {activeTab}
          </button>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('Cliente')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'Cliente' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Clientes Pessoas Físicas
          {activeTab === 'Cliente' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('Fornecedor')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'Fornecedor' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Fornecedores / Empresas
          {activeTab === 'Fornecedor' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={`Buscar por nome, CPF/CNPJ ou cidade...`}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                <tr>
                  <th className="px-6 py-4">Nome / Razão Social</th>
                  <th className="px-6 py-4">Documento</th>
                  <th className="px-6 py-4">Contato</th>
                  <th className="px-6 py-4">Localização</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map(client => (
                  <tr key={client.id} className={`hover:bg-slate-50 transition-colors ${client.blocked ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${client.type === 'Cliente' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                          {client.type === 'Cliente' ? <User size={20} /> : <Building2 size={20} />}
                        </div>
                        <div>
                          <p className={`font-medium ${client.blocked ? 'text-red-700' : 'text-slate-800'}`}>
                            {client.type === 'Cliente' ? client.name : client.razaoSocial}
                          </p>
                          <p className="text-xs text-slate-500">{client.email || 'Sem email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                      {client.type === 'Cliente' ? client.cpf : client.cnpj}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex flex-col text-sm">
                        <span>{client.type === 'Cliente' ? client.phone : client.companyPhone}</span>
                        {client.type === 'Fornecedor' && <span className="text-xs text-slate-400">Vend: {client.sellerContact}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {client.address.cidade} - {client.address.uf}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         {onBlockClient && (
                          <button 
                            onClick={() => onBlockClient(client.id, !client.blocked)}
                            className={`p-1 transition-colors ${client.blocked ? 'text-red-600 hover:text-red-800' : 'text-slate-400 hover:text-slate-600'}`}
                            title={client.blocked ? "Desbloquear" : "Bloquear"}
                          >
                            {client.blocked ? <Ban size={18} /> : <Unlock size={18} />}
                          </button>
                        )}
                        <button 
                          onClick={() => handleOpenEdit(client)}
                          className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => onDeleteClient(client.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClients.map(client => (
            <div key={client.id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition-shadow ${client.blocked ? 'border-red-200 bg-red-50' : 'border-slate-100'}`}>
               <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${client.type === 'Cliente' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                      {client.type === 'Cliente' ? <User size={24} /> : <Building2 size={24} />}
                    </div>
                    {client.blocked && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">BLOQUEADO</span>}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">
                     {client.type === 'Cliente' ? client.name : client.razaoSocial}
                  </h3>
                   <div className="flex items-center gap-2 mb-4 text-xs text-slate-500 font-mono">
                     <FileText size={12} />
                     {client.type === 'Cliente' ? client.cpf : client.cnpj}
                   </div>

                  <div className="space-y-2 mb-4">
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        <span>{client.type === 'Cliente' ? client.phone : client.companyPhone}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        <span className="truncate">{client.email || 'N/A'}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="truncate">{client.address.cidade} - {client.address.uf}</span>
                     </div>
                  </div>
               </div>

               <div className="flex justify-end gap-2 pt-4 border-t border-slate-100/50">
                    {onBlockClient && (
                      <button 
                        onClick={() => onBlockClient(client.id, !client.blocked)}
                        className={`p-2 rounded-lg transition-colors ${client.blocked ? 'bg-red-100 text-red-700' : 'hover:bg-slate-50 text-slate-500'}`}
                      >
                         {client.blocked ? <Ban size={18} /> : <Unlock size={18} />}
                      </button>
                    )}
                   <button 
                      onClick={() => handleOpenEdit(client)}
                      className="p-2 hover:bg-slate-50 text-slate-500 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDeleteClient(client.id)}
                      className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 animate-scale-in my-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              {editingId ? 'Editar' : 'Novo'} {activeTab}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Specific Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === 'Cliente' ? (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.name || ''}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                      <input 
                        required
                        type="text" 
                        placeholder="000.000.000-00"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.cpf || ''}
                        onChange={e => setFormData({...formData, cpf: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">RG</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.rg || ''}
                        onChange={e => setFormData({...formData, rg: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Estado Civil</label>
                      <select
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
                        value={formData.maritalStatus || 'Solteiro(a)'}
                        onChange={e => setFormData({...formData, maritalStatus: e.target.value as any})}
                      >
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                        <option value="Separado(a)">Separado(a)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Celular/WhatsApp</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.phone || ''}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <>
                     <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social</label>
                        <input 
                          required
                          type="text" 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                          value={formData.razaoSocial || ''}
                          onChange={e => setFormData({...formData, razaoSocial: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
                        <input 
                          required
                          type="text" 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                          value={formData.cnpj || ''}
                          onChange={e => setFormData({...formData, cnpj: e.target.value})}
                          onBlur={handleCnpjBlur}
                          placeholder="00.000.000/0000-00"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Telefone Empresa</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                          value={formData.companyPhone || ''}
                          onChange={e => setFormData({...formData, companyPhone: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contato Vendedor</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                          value={formData.sellerContact || ''}
                          onChange={e => setFormData({...formData, sellerContact: e.target.value})}
                        />
                     </div>
                  </>
                )}
                
                {/* Common Fields */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                    value={formData.email || ''}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-slate-400" /> Endereço
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                          value={formData.address?.cep || ''}
                          onChange={e => setFormData({...formData, address: {...formData.address!, cep: e.target.value}})}
                          onBlur={handleCepBlur}
                        />
                        {loadingAddress && <div className="absolute right-3 top-2.5 w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
                      </div>
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-slate-900"
                        value={formData.address?.endereco || ''}
                        readOnly
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bairro</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-slate-900"
                        value={formData.address?.bairro || ''}
                        readOnly
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-slate-900"
                        value={formData.address?.cidade || ''}
                        readOnly
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">UF</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-slate-900"
                        value={formData.address?.uf || ''}
                        readOnly
                      />
                   </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Complemento</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.address?.complemento || ''}
                        onChange={e => setFormData({...formData, address: {...formData.address!, complemento: e.target.value}})}
                      />
                   </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

export default Clients;