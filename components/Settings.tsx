import React, { useState, useRef } from 'react';
import { Building2, Save, MapPin, Percent, Tag, CreditCard, LayoutTemplate, FileText, MessageSquare, Upload, Trash2, Bell, Hash, Store, Image as ImageIcon } from 'lucide-react';
import { CompanySettings, ClientAddress, DiscountLevel } from '../types';

interface SettingsProps {
  settings: CompanySettings;
  onUpdateSettings: (settings: CompanySettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [activeSection, setActiveSection] = useState<'company' | 'sales' | 'docs'>('company');
  const [showSuccess, setShowSuccess] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleAddressChange = (field: keyof ClientAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handleDiscountChange = (id: string, field: keyof DiscountLevel, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      discountLevels: prev.discountLevels.map(level => 
        level.id === id ? { ...level, [field]: value } : level
      )
    }));
  };

  const handleSequenceChange = (type: 'workOrder' | 'sale' | 'quote', field: 'prefix' | 'nextNumber', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      documentSequences: {
        ...prev.documentSequences,
        [type]: {
          ...prev.documentSequences[type],
          [field]: value
        }
      }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
          <p className="text-slate-500">Dados da empresa, parâmetros de vendas e automação.</p>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Save size={20} /> Salvar Alterações
        </button>
      </div>

      {showSuccess && (
        <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-lg border border-emerald-200 animate-fade-in flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          Configurações salvas com sucesso!
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 space-y-2">
           <button
             onClick={() => setActiveSection('company')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-left
               ${activeSection === 'company' 
                 ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                 : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Building2 size={18} /> Dados da Empresa
           </button>
           <button
             onClick={() => setActiveSection('sales')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-left
               ${activeSection === 'sales' 
                 ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                 : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Tag size={18} /> Vendas & Financeiro
           </button>
           <button
             onClick={() => setActiveSection('docs')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-left
               ${activeSection === 'docs' 
                 ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                 : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <FileText size={18} /> Documentos & Automação
           </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
           
           {activeSection === 'company' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6 animate-fade-in">
                
                {/* Logo Section */}
                <div className="border-b border-slate-100 pb-6">
                   <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Building2 className="text-indigo-600" size={20} /> Logotipo
                   </h3>
                   <div className="flex items-center gap-6">
                      <div className="w-32 h-32 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                         {formData.logo ? (
                           <>
                             <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                             <button 
                                onClick={() => setFormData({...formData, logo: null})}
                                className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                             >
                               <Trash2 size={24} />
                             </button>
                           </>
                         ) : (
                           <span className="text-slate-400 text-xs text-center px-2">Sem Logo</span>
                         )}
                      </div>
                      <div>
                         <p className="text-sm text-slate-600 mb-2">Carregue a logo da sua empresa para exibir em orçamentos e ordens de serviço.</p>
                         <button 
                            onClick={() => logoInputRef.current?.click()}
                            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                         >
                            <Upload size={16} /> Escolher Imagem
                         </button>
                         <input 
                            type="file" 
                            ref={logoInputRef} 
                            onChange={handleLogoUpload} 
                            className="hidden" 
                            accept="image/*"
                         />
                      </div>
                   </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                   Identificação
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social / Nome Fantasia</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.cnpj}
                        onChange={e => setFormData({...formData, cnpj: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Inscrição Estadual</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.ie}
                        onChange={e => setFormData({...formData, ie: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email de Contato</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                   </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 pt-4">
                   <MapPin className="text-indigo-600" size={20} /> Endereço Comercial
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.address.cep}
                        onChange={e => handleAddressChange('cep', e.target.value)}
                      />
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Logradouro</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.address.endereco}
                        onChange={e => handleAddressChange('endereco', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bairro</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.address.bairro}
                        onChange={e => handleAddressChange('bairro', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.address.cidade}
                        onChange={e => handleAddressChange('cidade', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">UF</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={formData.address.uf}
                        onChange={e => handleAddressChange('uf', e.target.value)}
                      />
                   </div>
                </div>
             </div>
           )}

           {activeSection === 'sales' && (
             <div className="space-y-6 animate-fade-in">
                
                {/* General Params */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                      <LayoutTemplate className="text-indigo-600" size={20} /> Parâmetros Gerais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Tabela de Preço Padrão</label>
                          <input 
                              type="text" 
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                              value={formData.standardPriceTable}
                              onChange={e => setFormData({...formData, standardPriceTable: e.target.value})}
                              placeholder="Ex: Varejo"
                            />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Validade do Orçamento (Dias)</label>
                          <input 
                              type="number" 
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                              value={formData.quoteValidityDays}
                              onChange={e => setFormData({...formData, quoteValidityDays: Number(e.target.value)})}
                            />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Comissão de Serviços (%)</label>
                          <div className="relative">
                             <input 
                                type="number" step="0.1"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                                value={formData.serviceCommission}
                                onChange={e => setFormData({...formData, serviceCommission: Number(e.target.value)})}
                              />
                              <span className="absolute right-3 top-2 text-slate-400 text-sm">%</span>
                          </div>
                       </div>
                       <div className="flex items-center mt-6">
                          <label className="flex items-center cursor-pointer relative">
                            <input 
                              type="checkbox"
                              className="sr-only peer"
                              checked={formData.autoDeleteExpiredQuotes}
                              onChange={e => setFormData({...formData, autoDeleteExpiredQuotes: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            <span className="ml-3 text-sm font-medium text-slate-700">Excluir orçamentos vencidos automaticamente</span>
                          </label>
                       </div>
                    </div>
                </div>

                {/* Discount Levels */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                      <Percent className="text-indigo-600" size={20} /> Níveis de Desconto
                    </h3>
                    
                    <div className="grid gap-4">
                       {formData.discountLevels.map((level) => (
                          <div key={level.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50">
                             <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm font-bold"
                                style={{ backgroundColor: level.color }}
                             >
                                {level.id}
                             </div>
                             
                             <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                   <label className="block text-xs font-medium text-slate-500 mb-1">Nível / Rótulo</label>
                                   <input 
                                      type="text" 
                                      className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-indigo-500 text-sm text-slate-900"
                                      value={level.label}
                                      onChange={e => handleDiscountChange(level.id, 'label', e.target.value)}
                                   />
                                </div>
                                <div>
                                   <label className="block text-xs font-medium text-slate-500 mb-1">Máximo Desconto (%)</label>
                                   <div className="relative">
                                      <input 
                                         type="number" 
                                         min="0"
                                         max="100"
                                         className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-indigo-500 text-sm text-slate-900"
                                         value={level.maxDiscount}
                                         onChange={e => handleDiscountChange(level.id, 'maxDiscount', parseFloat(e.target.value))}
                                      />
                                      <span className="absolute right-3 top-1.5 text-slate-400 text-xs font-bold">%</span>
                                   </div>
                                </div>
                                <div>
                                   <label className="block text-xs font-medium text-slate-500 mb-1">Cor do Nível (Hex)</label>
                                   <div className="flex gap-2">
                                      <input 
                                         type="color" 
                                         className="h-8 w-10 p-0 border-0 rounded cursor-pointer"
                                         value={level.color}
                                         onChange={e => handleDiscountChange(level.id, 'color', e.target.value)}
                                      />
                                      <input 
                                         type="text" 
                                         className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-indigo-500 text-sm text-slate-900"
                                         value={level.color}
                                         onChange={e => handleDiscountChange(level.id, 'color', e.target.value)}
                                      />
                                   </div>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                </div>
             </div>
           )}

           {activeSection === 'docs' && (
             <div className="space-y-6 animate-fade-in">
                
                {/* Document Numbering */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                      <Hash className="text-indigo-600" size={20} /> Numeração de Documentos
                   </h3>
                   <p className="text-sm text-slate-500 mb-6">Configure os prefixos e o próximo número da sequência para seus documentos.</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Vendas */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                         <h4 className="font-semibold text-slate-700 mb-3">Vendas</h4>
                         <div className="space-y-3">
                            <div>
                               <label className="block text-xs font-medium text-slate-500 mb-1">Prefixo</label>
                               <input 
                                  type="text" 
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm bg-white text-slate-900"
                                  value={formData.documentSequences.sale.prefix}
                                  onChange={e => handleSequenceChange('sale', 'prefix', e.target.value)}
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-medium text-slate-500 mb-1">Próximo Número</label>
                               <input 
                                  type="number" 
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm bg-white text-slate-900"
                                  value={formData.documentSequences.sale.nextNumber}
                                  onChange={e => handleSequenceChange('sale', 'nextNumber', parseInt(e.target.value))}
                               />
                            </div>
                            <div className="pt-2 text-xs text-slate-400 text-center">
                               Exemplo: {formData.documentSequences.sale.prefix}{formData.documentSequences.sale.nextNumber}
                            </div>
                         </div>
                      </div>

                      {/* Orçamentos */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                         <h4 className="font-semibold text-slate-700 mb-3">Orçamentos</h4>
                         <div className="space-y-3">
                            <div>
                               <label className="block text-xs font-medium text-slate-500 mb-1">Prefixo</label>
                               <input 
                                  type="text" 
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm bg-white text-slate-900"
                                  value={formData.documentSequences.quote.prefix}
                                  onChange={e => handleSequenceChange('quote', 'prefix', e.target.value)}
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-medium text-slate-500 mb-1">Próximo Número</label>
                               <input 
                                  type="number" 
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm bg-white text-slate-900"
                                  value={formData.documentSequences.quote.nextNumber}
                                  onChange={e => handleSequenceChange('quote', 'nextNumber', parseInt(e.target.value))}
                               />
                            </div>
                            <div className="pt-2 text-xs text-slate-400 text-center">
                               Exemplo: {formData.documentSequences.quote.prefix}{formData.documentSequences.quote.nextNumber}
                            </div>
                         </div>
                      </div>

                      {/* Ordens de Serviço */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                         <h4 className="font-semibold text-slate-700 mb-3">Ordens de Serviço</h4>
                         <div className="space-y-3">
                            <div>
                               <label className="block text-xs font-medium text-slate-500 mb-1">Prefixo</label>
                               <input 
                                  type="text" 
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm bg-white text-slate-900"
                                  value={formData.documentSequences.workOrder.prefix}
                                  onChange={e => handleSequenceChange('workOrder', 'prefix', e.target.value)}
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-medium text-slate-500 mb-1">Próximo Número</label>
                               <input 
                                  type="number" 
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm bg-white text-slate-900"
                                  value={formData.documentSequences.workOrder.nextNumber}
                                  onChange={e => handleSequenceChange('workOrder', 'nextNumber', parseInt(e.target.value))}
                               />
                            </div>
                            <div className="pt-2 text-xs text-slate-400 text-center">
                               Exemplo: {formData.documentSequences.workOrder.prefix}{formData.documentSequences.workOrder.nextNumber}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Automation Messages */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                      <Bell className="text-indigo-600" size={20} /> Mensagens Automáticas
                   </h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                         <div>
                            <p className="font-medium text-slate-700">Enviar Venda</p>
                            <p className="text-xs text-slate-500">Enviar comprovante/recibo automaticamente ao finalizar venda.</p>
                         </div>
                         <label className="flex items-center cursor-pointer relative">
                            <input 
                              type="checkbox"
                              className="sr-only peer"
                              checked={formData.autoMessageSettings.sendOnSale}
                              onChange={e => setFormData({...formData, autoMessageSettings: {...formData.autoMessageSettings, sendOnSale: e.target.checked}})}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                         </label>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                         <div>
                            <p className="font-medium text-slate-700">Enviar Proposta de Orçamento</p>
                            <p className="text-xs text-slate-500">Enviar link/PDF do orçamento automaticamente ao criar.</p>
                         </div>
                         <label className="flex items-center cursor-pointer relative">
                            <input 
                              type="checkbox"
                              className="sr-only peer"
                              checked={formData.autoMessageSettings.sendOnQuote}
                              onChange={e => setFormData({...formData, autoMessageSettings: {...formData.autoMessageSettings, sendOnQuote: e.target.checked}})}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                         </label>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                         <div>
                            <p className="font-medium text-slate-700">Cobrança Automática</p>
                            <p className="text-xs text-slate-500">Enviar lembrete de cobrança para pagamentos pendentes.</p>
                         </div>
                         <label className="flex items-center cursor-pointer relative">
                            <input 
                              type="checkbox"
                              className="sr-only peer"
                              checked={formData.autoMessageSettings.sendOnBilling}
                              onChange={e => setFormData({...formData, autoMessageSettings: {...formData.autoMessageSettings, sendOnBilling: e.target.checked}})}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                         </label>
                      </div>
                   </div>
                </div>

                {/* Texts */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                      <MessageSquare className="text-indigo-600" size={20} /> Textos Padrões e Mensagens
                   </h3>
                   
                   <div className="space-y-4">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem Rodapé da Ordem de Serviço</label>
                         <textarea 
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm text-slate-900"
                            value={formData.osFooterText}
                            onChange={e => setFormData({...formData, osFooterText: e.target.value})}
                            placeholder="Ex: Agradecemos a preferência..."
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Termos de Garantia (Padrão)</label>
                         <textarea 
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm text-slate-900"
                            value={formData.defaultWarrantyText}
                            onChange={e => setFormData({...formData, defaultWarrantyText: e.target.value})}
                            placeholder="Ex: Garantia de 90 dias contra defeitos..."
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem dos Termos e Condições</label>
                         <textarea 
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm text-slate-900"
                            value={formData.termsText}
                            onChange={e => setFormData({...formData, termsText: e.target.value})}
                            placeholder="Ex: Condições de pagamento, prazos, etc..."
                         />
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Settings;