import React, { useState, useRef } from 'react';
import { 
  CheckSquare, Plus, Search, Trash2, Edit2, LayoutList, LayoutGrid, 
  Image as ImageIcon, Wrench, CheckCircle2, Circle, Upload, X 
} from 'lucide-react';
import { Checklist, ChecklistItem, ChecklistPart, Product } from '../types';

interface ChecklistsProps {
  checklists: Checklist[];
  products: Product[];
  onAddChecklist: (checklist: Checklist) => void;
  onUpdateChecklist: (checklist: Checklist) => void;
  onDeleteChecklist: (id: string) => void;
}

const Checklists: React.FC<ChecklistsProps> = ({ 
  checklists, 
  products, 
  onAddChecklist, 
  onUpdateChecklist, 
  onDeleteChecklist 
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const initialFormState: Partial<Checklist> = {
    title: '',
    description: '',
    items: [],
    photos: [],
    parts: []
  };
  const [formData, setFormData] = useState<Partial<Checklist>>(initialFormState);
  const [newItemText, setNewItemText] = useState('');
  const [selectedPartId, setSelectedPartId] = useState('');
  const [selectedPartQty, setSelectedPartQty] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredChecklists = checklists.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, items: [], photos: [], parts: [] });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (checklist: Checklist) => {
    setEditingId(checklist.id);
    setFormData({ ...checklist });
    setIsModalOpen(true);
  };

  // --- Logic for Items ---
  const addItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: `item-${Date.now()}`,
        text: newItemText,
        completed: false
      };
      setFormData(prev => ({
        ...prev,
        items: [...(prev.items || []), newItem]
      }));
      setNewItemText('');
    }
  };

  const toggleItemCompletion = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== itemId)
    }));
  };

  // --- Logic for Photos ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index)
    }));
  };

  // --- Logic for Parts ---
  const addPart = () => {
    if (selectedPartId && selectedPartQty > 0) {
      // Check if part already exists
      const exists = formData.parts?.find(p => p.productId === selectedPartId);
      if (exists) {
        setFormData(prev => ({
          ...prev,
          parts: prev.parts?.map(p => 
            p.productId === selectedPartId ? { ...p, quantity: p.quantity + selectedPartQty } : p
          )
        }));
      } else {
        const newPart: ChecklistPart = {
          productId: selectedPartId,
          quantity: selectedPartQty
        };
        setFormData(prev => ({
          ...prev,
          parts: [...(prev.parts || []), newPart]
        }));
      }
      setSelectedPartId('');
      setSelectedPartQty(1);
    }
  };

  const removePart = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts?.filter(p => p.productId !== productId)
    }));
  };

  // --- Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title) {
      const checklistToSave = {
        ...formData,
        id: editingId || `CHK-${Date.now()}`,
        dateCreated: formData.dateCreated || new Date().toISOString().split('T')[0],
        items: formData.items || [],
        photos: formData.photos || [],
        parts: formData.parts || []
      } as Checklist;

      if (editingId) {
        onUpdateChecklist(checklistToSave);
      } else {
        onAddChecklist(checklistToSave);
      }
      setIsModalOpen(false);
    }
  };

  // Function to get product name by ID
  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Produto Desconhecido';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Checklists de Serviço</h2>
          <p className="text-slate-500">Crie listas de verificação, anexe fotos e peças.</p>
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
            <Plus size={20} /> Criar Checklist
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar checklists..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {filteredChecklists.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
          Nenhum checklist encontrado.
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                <tr>
                  <th className="px-6 py-4">Título</th>
                  <th className="px-6 py-4">Itens</th>
                  <th className="px-6 py-4">Peças</th>
                  <th className="px-6 py-4">Fotos</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredChecklists.map(checklist => (
                  <tr key={checklist.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                          <CheckSquare size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{checklist.title}</p>
                          <p className="text-xs text-slate-500 font-mono">{checklist.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {checklist.items.filter(i => i.completed).length}/{checklist.items.length} Concluídos
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Wrench size={16} className="text-slate-400" />
                        {checklist.parts.length} itens
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <ImageIcon size={16} className="text-slate-400" />
                        {checklist.photos.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{checklist.dateCreated}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(checklist)}
                          className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => onDeleteChecklist(checklist.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChecklists.map(checklist => {
             const progress = checklist.items.length > 0 
               ? Math.round((checklist.items.filter(i => i.completed).length / checklist.items.length) * 100)
               : 0;

             return (
              <div key={checklist.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <CheckSquare size={24} />
                      </div>
                      <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">{checklist.dateCreated}</span>
                   </div>
                   
                   <h3 className="text-lg font-bold text-slate-800 mb-2">{checklist.title}</h3>
                   <p className="text-sm text-slate-500 mb-4 line-clamp-2">{checklist.description || "Sem descrição."}</p>

                   {/* Progress Bar */}
                   <div className="mb-4">
                     <div className="flex justify-between text-xs text-slate-500 mb-1">
                       <span>Progresso</span>
                       <span>{progress}%</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2">
                       <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                     </div>
                   </div>

                   <div className="flex gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                         <Wrench size={16} className="text-slate-400"/>
                         {checklist.parts.length} Peças
                      </div>
                      <div className="flex items-center gap-1">
                         <ImageIcon size={16} className="text-slate-400"/>
                         {checklist.photos.length} Fotos
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button 
                      onClick={() => handleOpenEdit(checklist)}
                      className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                    >
                      <Edit2 size={18} />
                      <span className="text-xs font-medium">Abrir/Editar</span>
                    </button>
                    <button 
                      onClick={() => onDeleteChecklist(checklist.id)}
                      className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                      <span className="text-xs font-medium">Excluir</span>
                    </button>
                 </div>
              </div>
             );
          })}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 animate-scale-in my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? 'Editar Checklist' : 'Novo Checklist'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título do Serviço</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-900"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Revisão de Motor 1.6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descrição (Opcional)</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-900"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Detalhes adicionais..."
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <CheckSquare size={18} /> Itens de Verificação
                </h4>
                
                <div className="space-y-2 mb-3">
                  {formData.items?.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200">
                      <button 
                        type="button"
                        onClick={() => toggleItemCompletion(item.id)}
                        className={`text-slate-400 hover:text-purple-600 ${item.completed ? 'text-green-500' : ''}`}
                      >
                        {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </button>
                      <span className={`flex-1 text-sm ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {item.text}
                      </span>
                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {(!formData.items || formData.items.length === 0) && (
                    <p className="text-sm text-slate-400 italic">Nenhum item adicionado.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm text-slate-900"
                    placeholder="Novo item de verificação..."
                    value={newItemText}
                    onChange={e => setNewItemText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem())}
                  />
                  <button 
                    type="button"
                    onClick={addItem}
                    className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Parts List */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Wrench size={18} /> Lista de Peças
                  </h4>
                  
                  <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                    {formData.parts?.map((part, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200 text-sm">
                        <span className="truncate flex-1 font-medium text-slate-700">
                          {getProductName(part.productId)}
                        </span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 mx-2">
                          x{part.quantity}
                        </span>
                        <button 
                          type="button"
                          onClick={() => removePart(part.productId)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <select 
                      className="flex-1 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm bg-white truncate text-slate-900"
                      value={selectedPartId}
                      onChange={e => setSelectedPartId(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      min="1"
                      className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm text-slate-900"
                      value={selectedPartQty}
                      onChange={e => setSelectedPartQty(parseInt(e.target.value) || 1)}
                    />
                    <button 
                      type="button"
                      onClick={addPart}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Photos */}
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                   <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <ImageIcon size={18} /> Fotos
                  </h4>

                   <div className="grid grid-cols-3 gap-2 mb-3">
                     {formData.photos?.map((photo, idx) => (
                       <div key={idx} className="relative aspect-square bg-white border border-slate-200 rounded overflow-hidden group">
                         <img src={photo} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                         <button 
                           type="button"
                           onClick={() => removePhoto(idx)}
                           className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                         >
                           <Trash2 size={16} />
                         </button>
                       </div>
                     ))}
                     <button 
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="aspect-square border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-300 transition-colors"
                     >
                       <Upload size={20} />
                       <span className="text-[10px] mt-1">Add Foto</span>
                     </button>
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*" 
                       onChange={handlePhotoUpload}
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
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

export default Checklists;