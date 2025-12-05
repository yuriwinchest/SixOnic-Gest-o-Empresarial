import React, { useState } from 'react';
import { Users, Plus, Search, Edit2, Trash2, MapPin, Phone, FileText, Building2, Briefcase, Mail, Ban, Unlock, LayoutGrid, LayoutList, User, X } from 'lucide-react';
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
                      (c.address?.cidade?.toLowerCase().includes(searchLower) || false);
    } else {
      matchesSearch = (c.razaoSocial?.toLowerCase().includes(searchLower) || false) || 
                      (c.cnpj?.includes(searchTerm) || false) ||
                      (c.address?.cidade?.toLowerCase().includes(searchLower) || false);
    }

    return matchesTab && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...initialClientState, type: activeTab, address: { ...initialAddress } });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData({
        ...client,
        address: client.address || initialAddress
    });
    setIsModalOpen(true);
  };

  const handleAddressChange = (field: keyof ClientAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address!,
        [field]: value
      }
    }));
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
              complemento: data.complemento || prev.address?.complemento || ''
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
              complemento: data.complemento || ''
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
          <h2 className="text-2xl font-bold text-slate-100">Clientes e Fornecedores</h2>
          <p className="text-slate-400">Gerencie sua base de contatos.</p>
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
            <Plus size={20} /> Novo {activeTab}
          </button>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-white/10">
        <button
          onClick={() => setActiveTab('Cliente')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'Cliente' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Clientes Pessoas Físicas
          {activeTab === 'Cliente' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('Fornecedor')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'Fornecedor' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fornecedores / Empresas
          {activeTab === 'Fornecedor' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></span>}
        </button>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder={`Buscar por nome, CPF/CNPJ ou cidade...`}
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
                  <th className="px-6 py-4">Nome / Razão Social</th>
                  <th className="px-6 py-4">Documento</th>
                  <th className="px-6 py-4">Contato</th>
                  <th className="px-6 py-4">Localização</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.map(client => (
                  <tr key={client.id} className={`hover:bg-white/5 transition-colors ${client.blocked ? 'bg-red-500/10' : ''} text-slate-300`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${client.type === 'Cliente' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {client.type === 'Cliente' ? <User size={20} /> : <Building2 size={20} />}
                        </div>
                        <div>
                          <p className={`font-medium ${client.blocked ? 'text-red-400' : 'text-slate-100'}`}>
                            {client.type === 'Cliente' ? client.name : client.razaoSocial}
                          </p>
                          <p className="text-xs text-slate-500">{client.email || 'Sem email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                      {client.type === 'Cliente' ? client.cpf : client.cnpj}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex flex-col text-sm">
                        <span>{client.type === 'Cliente' ? client.phone : client.companyPhone}</span>
                        {client.type === 'Fornecedor' && <span className="text-xs text-slate-500">Vend: {client.sellerContact}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {client.address?.cidade} - {client.address?.uf}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         {onBlockClient && (
                          <button 
                            onClick={() => onBlockClient(client.id, !client.blocked)}
                            className={`p-1 transition-colors ${client.blocked ? 'text-red-400 hover:text-red-300' : 'text-slate-500 hover:text-slate-300'}`}
                            title={client.blocked ? "Desbloquear" : "Bloquear"}
                          >
                            {client.blocked ? <Ban size={18} /> : <Unlock size={18} />}
                          </button>
                        )}
                        <button 
                          onClick={() => handleOpenEdit(client)}
                          className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => onDeleteClient(client.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
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
            <div key={client.id} className={`bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border p-6 flex flex-col justify-between hover:bg-slate-800/40 transition-colors ${client.blocked ? 'border-red-500/30 bg-red-500/10' : 'border-white/10'}`}>
               <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${client.type === 'Cliente' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {client.type === 'Cliente' ? <User size={24} /> : <Building2 size={24} />}
                    </div>
                    {client.blocked && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/30">BLOQUEADO</span>}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-100 mb-1 truncate">
                     {client.type === 'Cliente' ? client.name : client.razaoSocial}
                  </h3>
                   <div className="flex items-center gap-2 mb-4 text-xs text-slate-500 font-mono">
                     <FileText size={12} />
                     {client.type === 'Cliente' ? client.cpf : client.cnpj}
                   </div>

                  <div className="space-y-2 mb-4">
                     <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Phone size={14} className="text-slate-500" />
                        <span>{client.type === 'Cliente' ? client.phone : client.companyPhone}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Mail size={14} className="text-slate-500" />
                        <span className="truncate">{client.email || 'N/A'}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-slate-400">
                        <MapPin size={14} className="text-slate-500" />
                        <span className="truncate">{client.address?.cidade} - {client.address?.uf}</span>
                     </div>
                  </div>
               </div>

               <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                    {onBlockClient && (
                      <button 
                        onClick={() => onBlockClient(client.id, !client.blocked)}
                        className={`p-2 rounded-lg transition-colors ${client.blocked ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'}`}
                      >
                         {client.blocked ? <Ban size={18} /> : <Unlock size={18} />}
                      </button>
                    )}
                   <button 
                      onClick={() => handleOpenEdit(client)}
                      className="p-2 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDeleteClient(client.id)}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in custom-scrollbar">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-100">
                    {editingId ? 'Editar' : 'Novo'} {activeTab}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Specific Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTab === 'Cliente' ? (
                    <>
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
                        <label className="block text-sm font-medium text-slate-300 mb-1">RG</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.rg || ''}
                            onChange={e => setFormData({...formData, rg: e.target.value})}
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Estado Civil</label>
                        <select
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
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
                        <label className="block text-sm font-medium text-slate-300 mb-1">Celular/WhatsApp</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.phone || ''}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                        </div>
                    </>
                    ) : (
                    <>
                        <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Razão Social</label>
                            <input 
                            required
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.razaoSocial || ''}
                            onChange={e => setFormData({...formData, razaoSocial: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">CNPJ</label>
                            <input 
                            required
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.cnpj || ''}
                            onChange={e => setFormData({...formData, cnpj: e.target.value})}
                            onBlur={handleCnpjBlur}
                            placeholder="00.000.000/0000-00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Telefone Empresa</label>
                            <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.companyPhone || ''}
                            onChange={e => setFormData({...formData, companyPhone: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Contato Vendedor</label>
                            <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.sellerContact || ''}
                            onChange={e => setFormData({...formData, sellerContact: e.target.value})}
                            />
                        </div>
                    </>
                    )}
                    
                    {/* Common Fields */}
                    <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input 
                        type="email" 
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                        value={formData.email || ''}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    </div>
                </div>

                {/* Address Section */}
                <div className="border-t border-white/10 pt-4">
                    <h4 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-slate-500" /> Endereço
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">CEP</label>
                        <div className="relative">
                            <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.address?.cep || ''}
                            onChange={e => handleAddressChange('cep', e.target.value)}
                            onBlur={handleCepBlur}
                            />
                            {loadingAddress && <div className="absolute right-3 top-2.5 w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Endereço</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.address?.endereco || ''}
                            onChange={e => handleAddressChange('endereco', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Bairro</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.address?.bairro || ''}
                            onChange={e => handleAddressChange('bairro', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Cidade</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.address?.cidade || ''}
                            onChange={e => handleAddressChange('cidade', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">UF</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.address?.uf || ''}
                            onChange={e => handleAddressChange('uf', e.target.value)}
                        />
                    </div>
                        <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Complemento</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                            value={formData.address?.complemento || ''}
                            onChange={e => handleAddressChange('complemento', e.target.value)}
                        />
                    </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
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
        </div>
      )}
    </div>
  );
};

export default Clients;