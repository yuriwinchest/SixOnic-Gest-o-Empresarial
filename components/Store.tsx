import React, { useState, useEffect } from 'react';
import { StoreSettings, Product } from '../types';
import { ShoppingCart, Search, Menu, Heart, Star, ChevronLeft, ChevronRight, ArrowRight, ShoppingBag } from 'lucide-react';

interface StoreProps {
  products: Product[];
  settings: StoreSettings;
}

const Store: React.FC<StoreProps> = ({ products, settings }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Filter products
  const storeProducts = products.filter(p => 
    p.showInStore && 
    (selectedCategory === 'Todos' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['Todos', ...Array.from(new Set(products.filter(p => p.showInStore).map(p => p.category)))];

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % settings.heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [settings.heroSlides.length]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* Vibrant Header */}
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-orange-500 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-xl shadow-lg transform rotate-3">
                <ShoppingBag className="text-orange-500" size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight italic">{settings.storeName || 'Loja Virtual'}</h1>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
              <input 
                type="text" 
                placeholder="O que você procura hoje?"
                className="w-full py-2.5 pl-4 pr-12 rounded-full text-slate-800 focus:outline-none shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-1 top-1 bg-orange-500 p-1.5 rounded-full hover:bg-orange-600 transition-colors text-white shadow-sm">
                <Search size={18} />
              </button>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-6">
              <button className="relative group">
                <Heart size={24} className="text-white group-hover:text-orange-200 transition-colors" />
              </button>
              <button className="relative flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all border border-white/20">
                <ShoppingCart size={20} />
                <span className="font-bold text-sm">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Hero Section: Slider */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl relative h-[300px] md:h-[400px] group">
           {settings.heroSlides.map((slide, index) => (
             <div 
               key={index}
               className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
             >
               <img src={slide} alt={`Slide ${index}`} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="max-w-2xl animate-fade-in">
                     <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block">Oferta Especial</span>
                     <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Novidades da Semana</h2>
                     <p className="text-white/90 text-lg mb-4">Confira as melhores peças e acessórios para o seu veículo.</p>
                     <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all shadow-lg flex items-center gap-2">
                        Ver Ofertas <ArrowRight size={18} />
                     </button>
                  </div>
               </div>
             </div>
           ))}
           
           {/* Slider Controls */}
           <button 
             onClick={() => setCurrentSlide((prev) => (prev === 0 ? settings.heroSlides.length - 1 : prev - 1))}
             className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
           >
             <ChevronLeft size={24} />
           </button>
           <button 
             onClick={() => setCurrentSlide((prev) => (prev + 1) % settings.heroSlides.length)}
             className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
           >
             <ChevronRight size={24} />
           </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
           {/* Left Sidebar - Promo Banners */}
           <aside className="w-full lg:w-1/4 space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                 <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Menu size={20} className="text-orange-500" /> Categorias
                 </h3>
                 <ul className="space-y-2">
                    {categories.map(cat => (
                       <li key={cat}>
                          <button 
                             onClick={() => setSelectedCategory(cat)}
                             className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group
                               ${selectedCategory === cat ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-orange-500'}`}
                          >
                             {cat}
                             <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                       </li>
                    ))}
                 </ul>
              </div>

              {/* Sidebar Slides/Banners */}
              <div className="space-y-4">
                 {settings.sidebarSlides.map((banner, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden shadow-md group relative aspect-[3/4]">
                       <img src={banner} alt="Promo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                 ))}
              </div>
           </aside>

           {/* Main Product Grid */}
           <main className="flex-1">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-slate-800">Destaques</h2>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>{storeProducts.length} produtos encontrados</span>
                 </div>
              </div>

              {storeProducts.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400">Nenhum produto encontrado nesta categoria.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {storeProducts.map(product => (
                       <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden group transition-all duration-300">
                          {/* Image Area */}
                          <div className="relative aspect-square overflow-hidden bg-slate-100">
                             <img 
                               src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300?text=Sem+Imagem'} 
                               alt={product.name} 
                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                             />
                             {/* Quick Action Overlay */}
                             <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm flex justify-center gap-2">
                                <button className="p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-orange-500 transition-colors">
                                   <Heart size={20} />
                                </button>
                                <button className="p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-orange-500 transition-colors">
                                   <Search size={20} />
                                </button>
                             </div>
                             {product.stock < 5 && product.stock > 0 && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                                   ÚLTIMAS UNIDADES
                                </span>
                             )}
                          </div>

                          {/* Details */}
                          <div className="p-5">
                             <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{product.brand}</div>
                             <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2 h-12">
                                {product.name}
                             </h3>
                             
                             <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                   <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                ))}
                                <span className="text-xs text-slate-400 ml-1">(4.8)</span>
                             </div>

                             <div className="flex items-center justify-between">
                                <div>
                                   <span className="text-xs text-slate-400 line-through block">R$ {(product.price * 1.2).toFixed(2)}</span>
                                   <span className="text-xl font-extrabold text-slate-800">R$ {product.price.toFixed(2)}</span>
                                </div>
                                <button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95">
                                   <ShoppingCart size={20} />
                                </button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </main>
        </div>
      </div>
    </div>
  );
};

export default Store;