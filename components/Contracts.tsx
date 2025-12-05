import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCheck, Plus, Search, Printer, Trash2, Eye, X, Save, PenTool, FileText, 
  Upload, FileType, Settings, Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, List, ListOrdered, Type, Variable, Undo, Redo, 
  Palette, Highlighter, Minus 
} from 'lucide-react';
import { Contract, Quote, Client, CompanySettings, ContractTemplate } from '../types';

interface ContractsProps {
  contracts: Contract[];
  contractTemplates: ContractTemplate[];
  quotes: Quote[];
  clients: Client[];
  companySettings: CompanySettings;
  onAddContract: (contract: Contract) => void;
  onDeleteContract: (id: string) => void;
  onAddTemplate: (template: ContractTemplate) => void;
  onUpdateTemplate: (template: ContractTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  initialQuote?: Quote | null;
  onClearInitialQuote?: () => void;
}

const Contracts: React.FC<ContractsProps> = ({ 
  contracts, 
  contractTemplates, 
  quotes, 
  clients, 
  companySettings, 
  onAddContract, 
  onDeleteContract,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  initialQuote,
  onClearInitialQuote
}) => {
  const [activeTab, setActiveTab] = useState<'contracts' | 'templates'>('contracts');
  const [viewMode, setViewMode] = useState<'list' | 'editor' | 'template-editor'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Contract Generation State
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  
  // Editor State
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<ContractTemplate | null>(null);
  const [editableContent, setEditableContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Filter approved quotes
  const availableQuotes = quotes.filter(q => q.status === 'Aprovado');

  useEffect(() => {
    if (initialQuote) {
      setSelectedQuote(initialQuote);
      setIsModalOpen(true);
    }
  }, [initialQuote]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuote(null);
    if (onClearInitialQuote) onClearInitialQuote();
  };

  // --- Helpers ---

  const getDateExtenso = () => {
    const date = new Date();
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const generateContractContent = (quote: Quote, templateContent: string) => {
    const client = clients.find(c => c.id === quote.clientId) || { 
      name: quote.clientName, 
      address: { rua: '', cidade: '', uf: '', bairro: '', endereco: '' }, 
      cpf: '', 
      cnpj: '' 
    } as unknown as Client;

    const clientDoc = client.type === 'Fornecedor' ? client.cnpj : client.cpf;
    const clientAddressStr = `${client.address?.endereco || ''}, ${client.address?.bairro || ''} - ${client.address?.cidade || ''}/${client.address?.uf || ''}`;
    const itemsList = `
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; margin-bottom: 10px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
            <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Qtd</th>
            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${quote.items.map(i => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${i.productName}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R$ ${i.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
           <tr>
              <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">TOTAL:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">R$ ${quote.totalValue.toFixed(2)}</td>
           </tr>
        </tfoot>
      </table>
    `;
    
    const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    const expire = new Date(quote.expireDate).toLocaleDateString('pt-BR');

    let content = templateContent;
    
    // Replace Placeholders - Using regex with 'g' flag for multiple replacements and 'i' for case insensitivity if needed
    content = content.replace(/{CLIENTE}/g, quote.clientName);
    content = content.replace(/{DOC_CLIENTE}/g, clientDoc || 'N/A');
    content = content.replace(/{ENDERECO_CLIENTE}/g, clientAddressStr);
    content = content.replace(/{EMPRESA}/g, companySettings.name);
    content = content.replace(/{CNPJ_EMPRESA}/g, companySettings.cnpj);
    content = content.replace(/{ENDERECO_EMPRESA}/g, `${companySettings.address.endereco}, ${companySettings.address.cidade}-${companySettings.address.uf}`);
    content = content.replace(/{CIDADE_EMPRESA}/g, companySettings.address.cidade);
    content = content.replace(/{ID_ORCAMENTO}/g, quote.id);
    content = content.replace(/{LISTA_ITENS}/g, itemsList);
    content = content.replace(/{VALOR_TOTAL}/g, quote.totalValue.toFixed(2));
    content = content.replace(/{DATA_VALIDADE}/g, expire);
    content = content.replace(/{DATA_HOJE}/g, today);
    content = content.replace(/{DATA_EXTENSO}/g, getDateExtenso());

    return content;
  };

  // --- Contract Logic ---

  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleSelectTemplateForGeneration = (template: ContractTemplate) => {
    if (!selectedQuote) return;

    const generatedContent = generateContractContent(selectedQuote, template.content);
    const newContract: Contract = {
      id: `CTR-${Date.now()}`,
      quoteId: selectedQuote.id,
      clientName: selectedQuote.clientName,
      dateCreated: new Date().toLocaleDateString('pt-BR'),
      status: 'Ativo',
      content: generatedContent
    };

    setCurrentContract(newContract);
    setEditableContent(generatedContent);
    setViewMode('editor');
    closeModal();
  };

  const handleSaveContract = () => {
    if (currentContract) {
      onAddContract({ ...currentContract, content: editableContent });
      setViewMode('list');
      setCurrentContract(null);
    }
  };

  const handleViewContract = (contract: Contract) => {
    setCurrentContract(contract);
    setEditableContent(contract.content);
    setViewMode('editor');
  };

  // --- Template Logic ---

  const handleNewTemplate = () => {
    const newTemplate: ContractTemplate = {
      id: `TPL-${Date.now()}`,
      name: 'Novo Modelo de Contrato',
      content: '<div style="font-family: Arial, sans-serif; padding: 20px;">\n<h2 style="text-align: center;">CONTRATO</h2>\n<p>Digite ou cole o conteúdo do contrato aqui.</p>\n<p>Variáveis disponíveis: {CLIENTE}, {VALOR_TOTAL}, {LISTA_ITENS}, etc.</p>\n</div>'
    };
    setCurrentTemplate(newTemplate);
    setEditableContent(newTemplate.content);
    setViewMode('template-editor');
  };

  const handleEditTemplate = (template: ContractTemplate) => {
    setCurrentTemplate(template);
    setEditableContent(template.content);
    setViewMode('template-editor');
  };

  const handleSaveTemplate = () => {
    if (currentTemplate) {
      if (contractTemplates.find(t => t.id === currentTemplate.id)) {
        onUpdateTemplate({ ...currentTemplate, content: editableContent });
      } else {
        onAddTemplate({ ...currentTemplate, content: editableContent });
      }
      setViewMode('list');
      setCurrentTemplate(null);
    }
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Handle .docx files using Mammoth.js
    if (file.name.toLowerCase().endsWith('.docx')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        
        // Use mammoth from the global scope (injected via CDN in index.html)
        // @ts-ignore
        if (window.mammoth) {
          // @ts-ignore
          window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            .then((result: any) => {
              setEditableContent(result.value);
            })
            .catch((err: any) => {
              console.error("Erro ao converter Word:", err);
              alert("Erro ao converter o arquivo Word. Verifique se o arquivo não está corrompido ou protegido.");
            });
        } else {
          alert("Biblioteca de conversão não carregada. Verifique sua conexão.");
        }
      };
      reader.readAsArrayBuffer(file);
    } 
    // Handle HTML/Text files
    else if (file.type === "text/html" || file.name.endsWith('.html') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        setEditableContent(content);
      };
      reader.readAsText(file);
    } else {
      alert("Formato não suportado. Use .docx, .html ou .txt");
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Editor Toolbar Logic ---
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
        editorRef.current.focus();
    }
  };

  const insertVariable = (variable: string) => {
    // Insert text at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Ensure we are inside the editor
        if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
            range.deleteContents();
            // Insert variable styled as a placeholder
            const span = document.createElement('span');
            span.style.backgroundColor = '#e0e7ff';
            span.style.color = '#3730a3';
            span.style.padding = '0 4px';
            span.style.borderRadius = '4px';
            span.style.fontWeight = 'bold';
            span.innerText = variable;
            
            // Insert regular text node afterwards to avoid getting stuck in span
            const space = document.createTextNode('\u00A0'); 

            range.insertNode(space);
            range.insertNode(span);
            
            // Move cursor after
            range.setStartAfter(space);
            range.setEndAfter(space); 
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Update state
            if(editorRef.current) setEditableContent(editorRef.current.innerHTML);
        } else {
            alert("Coloque o cursor dentro da folha do editor primeiro.");
        }
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'foreColor' | 'hiliteColor') => {
    execCmd(type, e.target.value);
  };

  // CSS for printing
  const printStyles = `
    @media print {
      body * { visibility: hidden; }
      #contract-preview-container, #contract-preview-container * { visibility: visible; }
      #contract-preview-container {
        position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0;
        background: white; display: flex; justify-content: center;
      }
      #contract-preview {
        width: 210mm; box-shadow: none !important; padding: 20mm !important; margin: 0 !important;
      }
      @page { size: auto; margin: 0mm; }
    }
  `;

  return (
    <div className="space-y-6">
      <style>{printStyles}</style>

      {/* Main Header (Hidden on Print/Editor) */}
      {viewMode === 'list' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Contratos e Modelos</h2>
              <p className="text-slate-500">Gerencie contratos emitidos e modelos de documentos.</p>
            </div>
            <div className="flex gap-2">
               <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={20} /> Gerar Contrato
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('contracts')}
              className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                activeTab === 'contracts' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileCheck size={18} /> Contratos Gerados
              {activeTab === 'contracts' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                activeTab === 'templates' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Settings size={18} /> Modelos de Contrato
              {activeTab === 'templates' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
            </button>
          </div>

          {/* Contracts List */}
          {activeTab === 'contracts' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Buscar contratos..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                    <tr>
                      <th className="px-6 py-4">Contrato ID</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Ref. Orçamento</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contracts
                      .filter(c => c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(contract => (
                      <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">{contract.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">{contract.clientName}</td>
                        <td className="px-6 py-4 text-indigo-600 text-sm">{contract.quoteId}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{contract.dateCreated}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleViewContract(contract)} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors" title="Visualizar"><Eye size={18} /></button>
                            <button onClick={() => onDeleteContract(contract.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors" title="Excluir"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {contracts.length === 0 && (
                       <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum contrato gerado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Templates List */}
          {activeTab === 'templates' && (
             <div className="space-y-4 animate-fade-in">
                <div className="flex justify-end">
                   <button 
                      onClick={handleNewTemplate}
                      className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                   >
                      <Plus size={18} /> Criar Novo Modelo
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {contractTemplates.map(template => (
                      <div key={template.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                               <FileText size={24} />
                            </div>
                         </div>
                         <h3 className="text-lg font-bold text-slate-800 mb-2">{template.name}</h3>
                         <p className="text-xs text-slate-400 font-mono mb-4">{template.id}</p>
                         
                         <div className="flex gap-2 mt-4 border-t border-slate-100 pt-4">
                            <button 
                               onClick={() => handleEditTemplate(template)}
                               className="flex-1 py-2 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                               <PenTool size={16} /> Editar
                            </button>
                            <button 
                               onClick={() => onDeleteTemplate(template.id)}
                               className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-lg transition-colors"
                            >
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      )}

      {/* View Mode: Editor or Template Editor */}
      {(viewMode === 'editor' || viewMode === 'template-editor') && (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-scale-in">
           {/* Sidebar: Metadata and Save Actions */}
           <div className="w-full lg:w-72 flex flex-col gap-4 print:hidden order-2 lg:order-1">
              <button 
                onClick={() => {
                  if(viewMode === 'template-editor') setCurrentTemplate(null);
                  else setCurrentContract(null);
                  setViewMode('list');
                }}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                 <X size={20} /> Voltar
              </button>
              
              {viewMode === 'template-editor' && currentTemplate && (
                 <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Modelo</label>
                       <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={currentTemplate.name}
                          onChange={e => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                       />
                    </div>
                    
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">Importar Word/HTML</label>
                       <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                       >
                          <Upload size={16} /> Carregar Arquivo
                       </button>
                       <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept=".html,.htm,.txt,.docx" 
                          onChange={handleTemplateUpload} 
                       />
                       <p className="text-[10px] text-slate-400 mt-1 text-center">Suporta .docx, .html</p>
                    </div>

                    <button 
                       onClick={handleSaveTemplate}
                       className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm"
                    >
                       <Save size={20} /> Salvar Modelo
                    </button>
                 </div>
              )}

              {viewMode === 'editor' && currentContract && !contracts.find(c => c.id === currentContract.id) && (
                 <button 
                   onClick={handleSaveContract}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm"
                 >
                   <Save size={20} /> Salvar Contrato
                 </button>
              )}

              <button 
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer size={20} /> Imprimir / PDF
              </button>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg text-amber-800 text-sm">
                 <p className="font-bold flex items-center gap-2 mb-2"><PenTool size={16}/> Edição Visual</p>
                 <p>Use a barra de ferramentas acima da folha para formatar o texto ou inserir variáveis.</p>
              </div>
           </div>

           {/* Editor Area */}
           <div className="flex-1 flex flex-col gap-2 order-1 lg:order-2 h-full">
              {/* Rich Text Toolbar */}
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-1 items-center sticky top-0 z-10 print:hidden">
                 
                 {/* Undo/Redo */}
                 <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                    <button onClick={() => execCmd('undo')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Desfazer"><Undo size={18}/></button>
                    <button onClick={() => execCmd('redo')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Refazer"><Redo size={18}/></button>
                 </div>
                 <div className="w-px h-6 bg-slate-200 mx-1"></div>

                 {/* Text Style */}
                 <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                    <button onClick={() => execCmd('bold')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Negrito"><Bold size={18}/></button>
                    <button onClick={() => execCmd('italic')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Itálico"><Italic size={18}/></button>
                    <button onClick={() => execCmd('underline')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Sublinhado"><Underline size={18}/></button>
                 </div>
                 
                 {/* Colors */}
                 <div className="flex bg-slate-100 rounded-lg p-1 gap-1 items-center">
                    <div className="relative p-1.5 hover:bg-white hover:shadow-sm rounded cursor-pointer group">
                       <Palette size={18} className="text-slate-700" />
                       <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => handleColorChange(e, 'foreColor')} title="Cor do Texto" />
                    </div>
                    <div className="relative p-1.5 hover:bg-white hover:shadow-sm rounded cursor-pointer group">
                       <Highlighter size={18} className="text-slate-700" />
                       <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => handleColorChange(e, 'hiliteColor')} title="Marca Texto" />
                    </div>
                 </div>

                 <div className="w-px h-6 bg-slate-200 mx-1"></div>

                 {/* Alignment */}
                 <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                    <button onClick={() => execCmd('justifyLeft')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Alinhar Esquerda"><AlignLeft size={18}/></button>
                    <button onClick={() => execCmd('justifyCenter')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Centralizar"><AlignCenter size={18}/></button>
                    <button onClick={() => execCmd('justifyRight')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Alinhar Direita"><AlignRight size={18}/></button>
                    <button onClick={() => execCmd('justifyFull')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Justificar"><AlignJustify size={18}/></button>
                 </div>
                 
                 <div className="w-px h-6 bg-slate-200 mx-1"></div>

                 {/* Lists & Elements */}
                 <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                    <button onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Lista"><List size={18}/></button>
                    <button onClick={() => execCmd('insertOrderedList')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Lista Numerada"><ListOrdered size={18}/></button>
                    <button onClick={() => execCmd('insertHorizontalRule')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700" title="Linha Horizontal"><Minus size={18}/></button>
                 </div>

                 <div className="w-px h-6 bg-slate-200 mx-1"></div>

                 {/* Font Size & Type */}
                 <div className="flex bg-slate-100 rounded-lg p-1 gap-1 items-center">
                    <select 
                       className="bg-transparent text-xs font-bold text-slate-700 outline-none w-10 text-center cursor-pointer"
                       onChange={(e) => execCmd('fontSize', e.target.value)}
                       title="Tamanho da Fonte"
                    >
                       <option value="3">12</option>
                       <option value="1">8</option>
                       <option value="2">10</option>
                       <option value="4">14</option>
                       <option value="5">18</option>
                       <option value="6">24</option>
                       <option value="7">36</option>
                    </select>
                    <div className="h-4 w-px bg-slate-300"></div>
                    <button onClick={() => execCmd('formatBlock', 'H1')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700 font-bold text-xs flex items-center" title="Título 1"><Type size={14}/>1</button>
                    <button onClick={() => execCmd('formatBlock', 'H2')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700 font-bold text-xs flex items-center" title="Título 2"><Type size={14}/>2</button>
                    <button onClick={() => execCmd('formatBlock', 'P')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-700 font-bold text-xs flex items-center" title="Parágrafo">P</button>
                 </div>
                 
                 {/* Variables */}
                 {viewMode === 'template-editor' && (
                    <>
                       <div className="w-px h-6 bg-slate-200 mx-1"></div>
                       <div className="flex items-center gap-2 ml-auto">
                          <Variable size={16} className="text-indigo-600"/>
                          <select 
                             className="text-sm border-slate-200 bg-slate-50 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40"
                             onChange={(e) => {
                                if(e.target.value) insertVariable(e.target.value);
                                e.target.value = "";
                             }}
                          >
                             <option value="">Inserir Variável...</option>
                             <option value="{CLIENTE}">Cliente (Nome)</option>
                             <option value="{DOC_CLIENTE}">CPF/CNPJ</option>
                             <option value="{ENDERECO_CLIENTE}">Endereço Completo</option>
                             <option value="{EMPRESA}">Minha Empresa</option>
                             <option value="{CNPJ_EMPRESA}">Meu CNPJ</option>
                             <option value="{VALOR_TOTAL}">Valor Total</option>
                             <option value="{LISTA_ITENS}">Tabela de Itens</option>
                             <option value="{DATA_HOJE}">Data Atual</option>
                             <option value="{DATA_EXTENSO}">Data por Extenso</option>
                             <option value="{DATA_VALIDADE}">Data Validade</option>
                          </select>
                       </div>
                    </>
                 )}
              </div>

              {/* Editor Canvas */}
              <div className="flex-1 bg-slate-200 overflow-y-auto p-4 lg:p-8 flex justify-center rounded-xl print:bg-white print:p-0 print:overflow-visible">
                  <div id="contract-preview-container">
                    <div 
                      id="contract-preview"
                      ref={editorRef}
                      className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[20mm] text-slate-900 outline-none print:shadow-none focus:ring-2 ring-indigo-500/50 transition-shadow"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setEditableContent(e.currentTarget.innerHTML)}
                      dangerouslySetInnerHTML={{ __html: editableContent }}
                    />
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* Contract Generator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 animate-scale-in my-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Gerar Novo Contrato</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                   <X size={24} />
                </button>
             </div>
             
             {/* Step 1: Select Quote */}
             {!selectedQuote ? (
                <div className="space-y-4">
                   <p className="text-slate-500 mb-2">Selecione um orçamento aprovado:</p>
                   <div className="max-h-96 overflow-y-auto border rounded-lg border-slate-200">
                      {availableQuotes.length === 0 ? (
                         <div className="p-8 text-center text-slate-400">Nenhum orçamento aprovado disponível.</div>
                      ) : (
                         <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium text-sm sticky top-0">
                               <tr>
                                  <th className="px-4 py-3">Orçamento</th>
                                  <th className="px-4 py-3">Cliente</th>
                                  <th className="px-4 py-3 text-right">Valor</th>
                                  <th className="px-4 py-3 text-center">Ação</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                               {availableQuotes.map(quote => (
                                  <tr key={quote.id} className="hover:bg-slate-50">
                                     <td className="px-4 py-3 text-xs font-mono text-slate-500">{quote.id}</td>
                                     <td className="px-4 py-3 font-medium text-slate-800">{quote.clientName}</td>
                                     <td className="px-4 py-3 text-right font-bold text-slate-600">R$ {quote.totalValue.toFixed(2)}</td>
                                     <td className="px-4 py-3 text-center">
                                        <button 
                                          onClick={() => handleSelectQuote(quote)}
                                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm bg-indigo-50 px-3 py-1 rounded"
                                        >
                                           Selecionar
                                        </button>
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      )}
                   </div>
                </div>
             ) : (
                /* Step 2: Select Template */
                <div className="space-y-4">
                   <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-lg">
                      <div>
                         <p className="text-xs text-slate-500">Orçamento Selecionado</p>
                         <p className="font-bold text-slate-800">{selectedQuote.id} - {selectedQuote.clientName}</p>
                      </div>
                      <button onClick={() => setSelectedQuote(null)} className="text-xs text-indigo-600 hover:underline">Alterar</button>
                   </div>

                   <p className="text-slate-500 mb-2">Escolha o modelo de contrato:</p>
                   <div className="grid gap-3">
                      {contractTemplates.map(tpl => (
                         <button
                            key={tpl.id}
                            onClick={() => handleSelectTemplateForGeneration(tpl)}
                            className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                         >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FileType className="text-slate-400 group-hover:text-indigo-600" size={24} />
                                  <span className="font-medium text-slate-700 group-hover:text-indigo-800">{tpl.name}</span>
                               </div>
                               <span className="text-slate-400 group-hover:text-indigo-600"><FileCheck size={18}/></span>
                            </div>
                         </button>
                      ))}
                   </div>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;