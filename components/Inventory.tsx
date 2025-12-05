import React, { useState, useRef } from 'react';
import { Package, Plus, Search, AlertTriangle, Edit2, Trash2, LayoutList, LayoutGrid, RefreshCw, Tag, Upload, ArrowRight, ArrowLeft, CheckCircle, X, AlertCircle, ArrowRightCircle, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onBatchOperations: (toAdd: Product[], toUpdate: Product[]) => void;
}

interface ImportCandidate {
  tempId: string;
  importedProduct: Product;
  existingProduct?: Product;
  status: 'new' | 'match_found';
  action: 'create' | 'update_stock_price' | 'replace' | 'ignore';
}

const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onBatchOperations }) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // States
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null); // Separate ref for product images
  const [importCandidates, setImportCandidates] = useState<ImportCandidate[]>([]);
  
  const initialFormState: Partial<Product> = {
    stock: 0,
    minStock: 5,
    cost: 0,
    price: 0,
    profitMargin: 0,
    brand: '',
    model: '',
    ncm: '',
    category: '',
    images: []
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);
  const [stockUpdateValue, setStockUpdateValue] = useState<string>('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- Parsing Logic ---
  const parseCSV = (text: string): Product[] => {
    const lines = text.split('\n');
    const headers = lines[0].toLowerCase().split(/[;,]/).map(h => h.trim().replace(/['"]+/g, ''));
    const newProducts: Product[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(/[;,]/).map(v => v.trim().replace(/['"]+/g, ''));
      const product: any = { id: `IMP-CSV-${Date.now()}-${i}`, stock: 0, minStock: 5, cost: 0, profitMargin: 0, images: [] };
      
      let isValid = false;

      headers.forEach((header, index) => {
        const value = values[index];
        if (!value) return;

        if (header.includes('name') || header.includes('nome') || header.includes('produto')) {
          product.name = value;
          isValid = true;
        } else if (header.includes('category') || header.includes('categoria')) {
          product.category = value;
        } else if (header.includes('brand') || header.includes('marca')) {
          product.brand = value;
        } else if (header.includes('model') || header.includes('modelo')) {
          product.model = value;
        } else if (header.includes('price') || header.includes('preço') || header.includes('preco') || header.includes('venda')) {
          product.price = parseFloat(value.replace(',', '.')) || 0;
        } else if (header.includes('cost') || header.includes('custo')) {
          product.cost = parseFloat(value.replace(',', '.')) || 0;
        } else if (header.includes('stock') || header.includes('estoque') || header.includes('qtd')) {
          product.stock = parseInt(value) || 0;
        } else if (header.includes('ncm')) {
          product.ncm = value;
        } else if (header.includes('id') || header.includes('sku') || header.includes('codigo')) {
           product.id = value; // Try to keep ID if provided
        }
      });

      if (isValid) {
        if (product.cost > 0 && product.price > 0) {
           product.profitMargin = ((product.price - product.cost) / product.cost) * 100;
        }
        if (!product.category) product.category = 'Geral';
        newProducts.push(product as Product);
      }
    }
    return newProducts;
  };

  const parseXML = (text: string): Product[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const productNodes = xmlDoc.getElementsByTagName("product"); // Assuming generic XML structure
    const newProducts: Product[] = [];

    for (let i = 0; i < productNodes.length; i++) {
      const node = productNodes[i];
      const getText = (tag: string) => node.getElementsByTagName(tag)[0]?.textContent || '';
      
      const name = getText('name') || getText('nome');
      if (!name) continue;

      const price = parseFloat((getText('price') || getText('preco') || '0').replace(',', '.'));
      const cost = parseFloat((getText('cost') || getText('custo') || '0').replace(',', '.'));
      
      const product: Product = {
        id: getText('id') || `IMP-XML-${Date.now()}-${i}`,
        name: name,
        category: getText('category') || getText('categoria') || 'Geral',
        price: price,
        cost: cost,
        stock: parseInt(getText('stock') || getText('estoque') || '0'),
        minStock: parseInt(getText('minStock') || getText('minimo') || '5'),
        brand: getText('brand') || getText('marca'),
        model: getText('model') || getText('modelo'),
        ncm: getText('ncm'),
        profitMargin: 0,
        images: []
      };

      if (product.cost > 0 && product.price > 0) {
         product.profitMargin = ((product.price - product.cost) / product.cost) * 100;
      }

      newProducts.push(product);
    }
    return newProducts;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let imported: Product[] = [];

      try {
        if (file.name.toLowerCase().endsWith('.csv')) {
          imported = parseCSV(content);
        } else if (file.name.toLowerCase().endsWith('.xml')) {
          imported = parseXML(content);
        }

        // Compare and prepare candidates
        const candidates: ImportCandidate[] = imported.map((imp, idx) => {
           // Logic: Match by ID first, then by Name + Brand (fuzzy logic simulation)
           const existing = products.find(p => 
             (p.id === imp.id && !imp.id.startsWith('IMP-')) || // Exact ID match if not generated
             (p.name.toLowerCase() === imp.name.toLowerCase() && (imp.brand ? p.brand?.toLowerCase() === imp.brand.toLowerCase() : true)) // Name match
           );

           return {
             tempId: `cand-${idx}`,
             importedProduct: imp,
             existingProduct: existing,
             status: existing ? 'match_found' : 'new',
             action: existing ? 'update_stock_price' : 'create' // Default actions
           };
        });

        setImportCandidates(candidates);
        setIsImportModalOpen(true);

      } catch (error) {
        console.error("Erro na importação:", error);
        alert("Erro ao processar arquivo.");
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const processImport = () => {
    const toAdd: Product[] = [];
    const toUpdate: Product[] = [];

    importCandidates.forEach(c => {
      if (c.action === 'ignore') return;

      if (c.action === 'create') {
        // Ensure new ID
        const newProduct = { ...c.importedProduct, id: `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` };
        toAdd.push(newProduct);
      } else if (c.action === 'replace' && c.existingProduct) {
        // Complete overwrite, keep ID
        toUpdate.push({ ...c.importedProduct, id: c.existingProduct.id });
      } else if (c.action === 'update_stock_price' && c.existingProduct) {
        // Merge logic
        toUpdate.push({
          ...c.existingProduct,
          stock: c.existingProduct.stock + c.importedProduct.stock, // Add stock
          price: c.importedProduct.price > 0 ? c.importedProduct.price : c.existingProduct.price, // Update price if present
          cost: c.importedProduct.cost > 0 ? c.importedProduct.cost : c.existingProduct.cost
        });
      }
    });

    onBatchOperations(toAdd, toUpdate);
    setIsImportModalOpen(false);
    setImportCandidates([]);
  };

  const updateCandidateAction = (tempId: string, action: ImportCandidate['action']) => {
    setImportCandidates(prev => prev.map(c => c.tempId === tempId ? { ...c, action } : c));
  };

  // --- Standard CRUD Handlers ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, images: [] });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleOpenStockUpdate = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setStockUpdateValue(product.stock.toString());
    setIsStockModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.name || !formData.name.trim()) {
      alert("O nome do produto é obrigatório.");
      return;
    }

    if (!formData.category || !formData.category.trim()) {
      alert("A categoria do produto é obrigatória.");
      return;
    }

    if (formData.cost === undefined || formData.cost <= 0) {
      alert("O custo deve ser um número positivo.");
      return;
    }

    if (formData.price === undefined || formData.price <= 0) {
      alert("O preço de venda deve ser um número positivo.");
      return;
    }

    if (formData.stock === undefined || formData.stock === null) {
      alert("O estoque é obrigatório.");
      return;
    }

    if (editingId) {
      onUpdateProduct({ ...formData as Product, id: editingId });
    } else {
      onAddProduct({ ...formData as Product, id: `PROD-${Date.now()}` });
    }
    setIsModalOpen(false);
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && formData.id) {
        onUpdateProduct({ ...formData as Product, stock: Number(stockUpdateValue) });
        setIsStockModalOpen(false);
    }
  };

  // --- Image Handling ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (formData.images?.length || 0) < 3) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  // --- Calculation Logic ---
  const handleCostChange = (val: string) => {
    const cost = parseFloat(val) || 0;
    const margin = formData.profitMargin || 0;
    const price = cost * (1 + margin / 100);
    setFormData({ ...formData, cost, price: parseFloat(price.toFixed(2)) });
  };

  const handleMarginChange = (val: string) => {
    const margin = parseFloat(val) || 0;
    const cost = formData.cost || 0;
    const price = cost * (1 + margin / 100);
    setFormData({ ...formData, profitMargin: margin, price: parseFloat(price.toFixed(2)) });
  };

  const handlePriceChange = (val: string) => {
    const price = parseFloat(val) || 0;
    const cost = formData.cost || 0;
    if (cost > 0) {
      const margin = ((price - cost) / cost) * 100;
      setFormData({ ...formData, price, profitMargin: parseFloat(margin.toFixed(2)) });
    } else {
      setFormData({ ...formData, price });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Controle de Estoque</h2>
          <p className="text-slate-400">Gerencie produtos, marcas, custos e precificação.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-slate-800/50 rounded-lg border border-white/10 p-1">
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}><LayoutList size={20} /></button>
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}><LayoutGrid size={20} /></button>
            </div>
          
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xml" onChange={handleFileSelect} />
          <button onClick={() => fileInputRef.current?.click()} className="bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700/50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
            <Upload size={20} /> <span className="hidden sm:inline">Importar</span>
          </button>

          <button onClick={handleOpenAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-900/20 border border-white/10">
            <Plus size={20} /> Novo Produto
          </button>
        </div>
      </div>

      {/* Import Review Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl p-6 animate-scale-in my-8 max-h-[90vh] flex flex-col border border-white/10">
             <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <div>
                   <h3 className="text-xl font-bold text-slate-100">Revisão de Importação</h3>
                   <p className="text-sm text-slate-400">Revise os dados antes de confirmar.</p>
                </div>
                <button onClick={() => setIsImportModalOpen(false)} className="text-slate-500 hover:text-slate-300"><X size={24} /></button>
             </div>

             <div className="flex-1 overflow-y-auto rounded-lg border border-white/10 mb-6 shadow-inner bg-slate-950/30">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-900/80 text-slate-300 font-semibold text-sm sticky top-0 z-10 shadow-sm border-b border-white/10 backdrop-blur-sm">
                      <tr>
                         <th className="px-4 py-4 w-24">Status</th>
                         <th className="px-4 py-4 w-1/3">Produto no Arquivo</th>
                         <th className="px-4 py-4 w-1/3">Dados no Sistema (Comparação)</th>
                         <th className="px-4 py-4 text-center">Ação</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 text-sm">
                      {importCandidates.map(candidate => (
                         <tr 
                            key={candidate.tempId} 
                            className={`transition-colors ${candidate.status === 'new' ? 'bg-emerald-500/10 hover:bg-emerald-500/20' : 'bg-blue-500/10 hover:bg-blue-500/20'}`}
                         >
                            <td className="px-4 py-4 align-top">
                               {candidate.status === 'new' ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                                       <Plus size={12} /> NOVO
                                    </span>
                                  </div>
                               ) : (
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                                       <RefreshCw size={12} /> EXISTE
                                    </span>
                                  </div>
                               )}
                            </td>
                            
                            {/* INCOMING DATA */}
                            <td className="px-4 py-4 align-top">
                               <div className="font-bold text-slate-200 text-base mb-1">{candidate.importedProduct.name}</div>
                               <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                  <div className="flex flex-col">
                                     <span className="text-slate-500">Preço Venda</span>
                                     <span className="font-mono font-medium text-slate-300">R$ {candidate.importedProduct.price.toFixed(2)}</span>
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-slate-500">Estoque Entrada</span>
                                     <span className="font-mono font-medium text-slate-300">+{candidate.importedProduct.stock} un</span>
                                  </div>
                                  <div className="flex flex-col col-span-2 mt-1">
                                     <span className="text-slate-500">SKU/ID (Arquivo)</span>
                                     <span className="font-mono text-slate-400">{candidate.importedProduct.id}</span>
                                  </div>
                                </div>
                            </td>

                            {/* SYSTEM COMPARISON */}
                            <td className="px-4 py-4 align-top">
                               {candidate.existingProduct ? (
                                  <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5 shadow-sm">
                                     <div className="font-medium text-slate-300 mb-2 flex items-center gap-2">
                                        {candidate.existingProduct.name}
                                     </div>
                                     
                                     {/* Comparison Grid */}
                                     <div className="space-y-2">
                                        {/* Price Comparison */}
                                        <div className="flex items-center justify-between text-xs border-b border-white/5 pb-1">
                                           <span className="text-slate-500">Preço:</span>
                                           <div className="flex items-center gap-2">
                                              <span className="text-slate-600 line-through">R$ {candidate.existingProduct.price.toFixed(2)}</span>
                                              <ArrowRight size={12} className="text-slate-500" />
                                              <span className={`font-bold ${candidate.existingProduct.price !== candidate.importedProduct.price ? 'text-blue-400' : 'text-slate-400'}`}>
                                                 R$ {candidate.importedProduct.price > 0 ? candidate.importedProduct.price.toFixed(2) : candidate.existingProduct.price.toFixed(2)}
                                              </span>
                                           </div>
                                        </div>

                                        {/* Stock Comparison */}
                                        <div className="flex items-center justify-between text-xs">
                                           <span className="text-slate-500">Estoque:</span>
                                           <div className="flex items-center gap-2">
                                              <span className="font-mono text-slate-400">{candidate.existingProduct.stock}</span>
                                              <Plus size={10} className="text-slate-500" />
                                              <span className="font-bold text-emerald-400">{candidate.importedProduct.stock}</span>
                                              <span className="text-slate-600">=</span>
                                              <span className="font-bold text-slate-200">{candidate.existingProduct.stock + candidate.importedProduct.stock}</span>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               ) : (
                                  <div className="h-full flex items-center justify-center text-slate-500 italic text-sm bg-slate-800/30 rounded border border-dashed border-white/5">
                                     Será cadastrado como novo
                                  </div>
                               )}
                            </td>

                            {/* ACTION SELECTOR */}
                            <td className="px-4 py-4 align-top">
                               <select 
                                  className={`w-full p-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer text-slate-100
                                    ${candidate.action === 'create' ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-100' : 
                                      candidate.action === 'update_stock_price' ? 'border-blue-500/30 bg-blue-500/20 text-blue-100' : 
                                      candidate.action === 'replace' ? 'border-orange-500/30 bg-orange-500/20 text-orange-100' : 
                                      'border-slate-700 bg-slate-800 text-slate-400'}`}
                                  value={candidate.action}
                                  onChange={(e) => updateCandidateAction(candidate.tempId, e.target.value as any)}
                               >
                                  <option value="create" className="bg-slate-800 text-white">Criar Novo Item</option>
                                  {candidate.existingProduct && (
                                     <>
                                        <option value="update_stock_price" className="bg-slate-800 text-white">Somar Estoque & Atualizar Preço</option>
                                        <option value="replace" className="bg-slate-800 text-white">Substituir Totalmente</option>
                                     </>
                                  )}
                                  <option value="ignore" className="bg-slate-800 text-white">Ignorar (Não Importar)</option>
                               </select>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             <div className="flex justify-between items-center pt-4 border-t border-white/10 bg-slate-900">
                <div className="text-sm text-slate-400 flex gap-4">
                   <span>Total: <strong>{importCandidates.length}</strong> itens</span>
                   <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500/20 border border-emerald-500/50 rounded-full"></div> Novos</span>
                   <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500/20 border border-blue-500/50 rounded-full"></div> Atualizações</span>
                </div>
                <div className="flex gap-3">
                   <button 
                      onClick={() => setIsImportModalOpen(false)}
                      className="px-4 py-2 text-slate-400 hover:bg-slate-800 rounded-lg font-medium transition-colors"
                   >
                      Cancelar
                   </button>
                   <button 
                      onClick={processImport}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-lg shadow-indigo-900/20"
                   >
                      <CheckCircle size={18} /> Confirmar Importação
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome, marca ou categoria..." 
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
                    <th className="px-6 py-4">Produto</th>
                    <th className="px-6 py-4">Marca/Modelo</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Custo</th>
                    <th className="px-6 py-4">Venda</th>
                    <th className="px-6 py-4">Estoque</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map(product => {
                    const isLowStock = product.stock <= product.minStock;
                    return (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors text-slate-300">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                               <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                                 <Package size={20} />
                               </div>
                            </div>
                            <div>
                              <p className="font-medium text-slate-100">{product.name}</p>
                              <p className="text-xs text-slate-500">SKU: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                             <span className="text-slate-300 text-sm">{product.brand || '-'}</span>
                             <span className="text-xs text-slate-500">{product.model}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                           <span className="bg-white/5 px-2 py-1 rounded text-xs">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">R$ {product.cost.toFixed(2)}</td>
                        <td className="px-6 py-4 text-emerald-400 font-medium">R$ {product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${isLowStock ? 'text-red-400' : 'text-slate-300'}`}>
                              {product.stock} un
                            </span>
                            {isLowStock && (
                              <div className="group relative">
                                <AlertTriangle size={16} className="text-red-500 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                                  Estoque Baixo (Mín: {product.minStock})
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleOpenEdit(product)}
                              className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => onDeleteProduct(product.id)}
                              className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredProducts.map(product => {
                const isLowStock = product.stock <= product.minStock;
                return (
                  <div key={product.id} className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-6 flex flex-col justify-between hover:bg-slate-800/40 transition-colors">
                     <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="relative">
                             <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                               <Package size={24} />
                             </div>
                          </div>
                          {isLowStock && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded uppercase tracking-wider flex items-center gap-1 border border-red-500/30">
                               <AlertTriangle size={12} /> Baixo
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-100 mb-1 truncate" title={product.name}>
                           {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                           <Tag size={12} className="text-slate-500" />
                           <span className="text-xs text-slate-400">{product.brand || 'Sem marca'} {product.model ? `- ${product.model}` : ''}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mb-4">{product.id}</p>

                        <div className="flex justify-between items-end mb-6">
                           <div>
                              <p className="text-xs text-slate-500">Preço</p>
                              <p className="text-lg font-bold text-emerald-400">R$ {product.price.toFixed(2)}</p>
                           </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Estoque</p>
                              <p className={`text-lg font-bold ${isLowStock ? 'text-red-400' : 'text-slate-300'}`}>{product.stock}</p>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                        <button 
                          onClick={() => handleOpenEdit(product)}
                          className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <Edit2 size={18} />
                          <span className="text-xs font-medium">Editar</span>
                        </button>
                        <button 
                          onClick={() => handleOpenStockUpdate(product)}
                          className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <RefreshCw size={18} />
                          <span className="text-xs font-medium text-center leading-none">Atualizar<br/>Estoque</span>
                        </button>
                        <button 
                          onClick={() => onDeleteProduct(product.id)}
                          className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
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

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-slate-500 bg-slate-900/60 rounded-xl border border-white/10 backdrop-blur-sm">
            Nenhum produto encontrado.
          </div>
        )}
      </div>

       {/* Edit/Add Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-scale-in my-8 border border-white/10">
            <h3 className="text-xl font-bold text-slate-100 mb-4">
              {editingId ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Left Column - Basic Info */}
                 <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Nome do Produto *</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder-slate-500"
                        value={formData.name || ''}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Ex: Óleo de Motor 5W30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Marca</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder-slate-500"
                          value={formData.brand || ''}
                          onChange={e => setFormData({...formData, brand: e.target.value})}
                          placeholder="Ex: Castrol"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Modelo</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder-slate-500"
                          value={formData.model || ''}
                          onChange={e => setFormData({...formData, model: e.target.value})}
                          placeholder="Ex: Magnatec"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Categoria *</label>
                        <input 
                          required
                          type="text" 
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder-slate-500"
                          value={formData.category || ''}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          list="category-list"
                        />
                        <datalist id="category-list">
                          <option value="Peças" />
                          <option value="Óleos" />
                          <option value="Acessórios" />
                          <option value="Pneus" />
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">NCM</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder-slate-500"
                          value={formData.ncm || ''}
                          onChange={e => setFormData({...formData, ncm: e.target.value})}
                          placeholder="0000.00.00"
                        />
                      </div>
                    </div>
                 </div>

                 {/* Right Column - Images */}
                 <div className="space-y-4">
                    {/* Image Upload (Max 3) */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                       <label className="block text-sm font-medium text-slate-300 mb-2">Imagens do Produto (Máx. 3)</label>
                       <div className="grid grid-cols-3 gap-2">
                          {/* Render existing images */}
                          {formData.images?.map((img, idx) => (
                             <div key={idx} className="relative aspect-square bg-slate-700 rounded border border-slate-600 overflow-hidden group">
                                <img src={img} alt={`Prod ${idx}`} className="w-full h-full object-cover" />
                                <button 
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                   <Trash2 size={20} />
                                </button>
                             </div>
                          ))}
                          
                          {/* Upload Button (if less than 3 images) */}
                          {(formData.images?.length || 0) < 3 && (
                             <button 
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                className="aspect-square border-2 border-dashed border-slate-600 rounded flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-400 transition-colors"
                             >
                                <ImageIcon size={24} />
                                <span className="text-xs mt-1">Adicionar</span>
                             </button>
                          )}
                       </div>
                       <input 
                          type="file" 
                          ref={imageInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                       />
                    </div>
                 </div>
              </div>

              {/* Pricing Section */}
              <div className="border-t border-white/10 pt-4 my-2">
                <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
                   Precificação
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Custo (R$) *</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                      value={formData.cost || ''}
                      onChange={e => handleCostChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Margem (%)</label>
                    <div className="relative">
                      <input 
                        required
                        type="number" 
                        step="0.1"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                        value={formData.profitMargin || ''}
                        onChange={e => handleMarginChange(e.target.value)}
                      />
                      <span className="absolute right-3 top-2.5 text-slate-500 text-sm">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Venda (R$) *</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-emerald-400"
                      value={formData.price || ''}
                      onChange={e => handlePriceChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Estoque Atual *</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Estoque Mínimo</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                    value={formData.minStock}
                    onChange={e => setFormData({...formData, minStock: Number(e.target.value)})}
                  />
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
      )}

      {/* Stock Update Modal */}
       {isStockModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <RefreshCw size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-100">Atualizar Estoque</h3>
                   <p className="text-xs text-slate-400 truncate w-48">{formData.name}</p>
                </div>
             </div>
            
            <form onSubmit={handleStockSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nova Quantidade</label>
                <input 
                  autoFocus
                  required
                  type="number" 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-lg font-bold text-center text-white"
                  value={stockUpdateValue}
                  onChange={e => setStockUpdateValue(e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1 text-center">Quantidade atual: {formData.stock}</p>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:bg-slate-800 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                >
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;