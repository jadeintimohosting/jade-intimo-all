import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal 
} from 'lucide-react';

// Import your navigation data
import { navigationData } from '@/data/navigation'; // Adjust path as needed

// --- CONFIGURATION ---
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const ProductListAdmin = () => {
  const navigate = useNavigate();

  // --- STATES ---
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [selectedGender, setSelectedGender] = useState(''); // New Gender State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10); 

  // --- DERIVED DATA FOR DROPDOWNS ---

  // 1. Get Categories: If gender selected, show specific. If not, show all unique categories.
  const availableCategories = useMemo(() => {
    if (selectedGender) {
      return navigationData[selectedGender] || [];
    }
    // Combine women and men categories, remove duplicates by slug
    const allCategories = [...navigationData.women, ...navigationData.men];
    const uniqueCategories = [];
    const seenSlugs = new Set();
    
    for (const cat of allCategories) {
      if (!seenSlugs.has(cat.slug)) {
        seenSlugs.add(cat.slug);
        uniqueCategories.push(cat);
      }
    }
    return uniqueCategories;
  }, [selectedGender]);

  // 2. Get Subcategories: Based on selected category
  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const categoryObj = availableCategories.find(c => c.slug === selectedCategory);
    return categoryObj?.subcategories || [];
  }, [selectedCategory, availableCategories]);

  // --- FETCHING LOGIC ---
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        
        // Pagination
        params.append('page', currentPage.toString());
        params.append('limit', limit.toString());
        params.append('sortBy', sortBy);

        // Filters
        if (selectedGender) params.append('gender', selectedGender);
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedSubCategory) params.append('subCategory', selectedSubCategory);

        // Auth
        const token = localStorage.getItem('token'); 
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/products/admin?${params.toString()}`, {
          method: 'GET',
          headers: headers,
          credentials: "include"
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Neautorizat. Te rog autentifică-te.");
            throw new Error('Nu s-au putut prelua produsele');
        }
        
        const data = await response.json();
        
        const productList = data.products || data.data || [];
        setProducts(productList);

        if (data.pagination) {
          setTotalItems(data.pagination.totalItems);
          setTotalPages(data.pagination.totalPages);
        } else {
          setTotalItems(productList.length);
          setTotalPages(1); 
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [currentPage, limit, sortBy, selectedGender, selectedCategory, selectedSubCategory]);

  // --- HANDLERS ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const clearFilters = () => {
    setSelectedGender('');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestionare Produse</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gestionează inventarul, prețurile și categoriile.
            </p>
          </div>
          
          <Link 
            to="/admin/products/new" 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} />
            Adaugă Produs
          </Link>
        </div>

        {/* FILTERS TOOLBAR */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
          
          <div className="flex flex-wrap items-center gap-3 w-full">
            <div className="flex items-center gap-2 text-gray-500 mr-2">
                <Filter size={18} />
                <span className="text-sm font-medium">Filtre:</span>
            </div>

            {/* 1. Gender Select */}
            <select 
              className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              value={selectedGender}
              onChange={(e) => {
                setSelectedGender(e.target.value);
                setSelectedCategory(''); // Reset child
                setSelectedSubCategory(''); // Reset grandchild
                setCurrentPage(1);
              }}
            >
              <option value="">Toate Genurile</option>
              <option value="women">Femei</option>
              <option value="men">Bărbați</option>
            </select>

            {/* 2. Category Select (Dependent) */}
            <select 
              className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none min-w-[140px]"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory(''); // Reset grandchild
                setCurrentPage(1); 
              }}
            >
              <option value="">Toate Categoriile</option>
              {availableCategories.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>

            {/* 3. Subcategory Select (Dependent) */}
            <select 
              className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none min-w-[140px] disabled:bg-gray-100 disabled:text-gray-400"
              value={selectedSubCategory}
              onChange={(e) => {
                setSelectedSubCategory(e.target.value);
                setCurrentPage(1);
              }}
              disabled={!selectedCategory || availableSubcategories.length === 0}
            >
              <option value="">Toate Subcategoriile</option>
              {availableSubcategories.map(s => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>

            {(selectedGender || selectedCategory || selectedSubCategory) && (
              <button 
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-700 font-medium px-2 ml-2"
              >
                Resetează Filtrele
              </button>
            )}
          </div>

          {/* Sort (Pushed to right on large screens) */}
          <div className="flex items-center gap-2 w-full xl:w-auto justify-end border-t xl:border-none pt-4 xl:pt-0">
            <span className="text-sm text-gray-500 whitespace-nowrap">Sortează după:</span>
            <select 
              className="px-3 py-2 bg-transparent font-medium text-sm text-gray-900 border-none outline-none cursor-pointer hover:bg-gray-50 rounded-lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Cele mai noi</option>
              <option value="oldest">Cele mai vechi</option>
              <option value="price_asc">Preț: Crescător</option>
              <option value="price_desc">Preț: Descrescător</option>
            </select>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700 font-medium">Eroare la încărcarea produselor</p>
                <p className="text-red-600 text-sm">{error}</p>
            </div>
        )}

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Se încarcă produsele...</p>
          </div>
        ) : (
          <>
            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">Fără Imagine</div>
                      )}
                      
                      {/* Badge for Big Sizes */}
                      {product.bigSizes && (
                        <span className="absolute top-2 left-2 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                          Mărimi Mari
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            {product.gender} • {product.category}
                         </span>
                         <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={16} />
                         </button>
                      </div>

                      <h3 className="font-semibold text-gray-900 line-clamp-1" title={product.name}>
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-500 mt-1 mb-4 line-clamp-2 flex-grow">
                        {product.description || "Nicio descriere disponibilă."}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <span className="font-bold text-lg text-gray-900">
                            {formatPrice(product.price)} <span className="text-xs font-normal text-gray-500">RON</span>
                        </span>
                        
                        <Link 
                            to={`/admin/products/${product.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            Editează
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <Search size={24} />
                    </div>
                    <p className="text-lg font-medium">Nu s-au găsit produse</p>
                    <p className="text-sm">Încearcă să ajustezi filtrele sau adaugă un produs nou.</p>
                </div>
              )}
            </div>

            {/* PAGINATION FOOTER */}
            {products.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-200 mt-6">
                <p className="text-sm text-gray-500">
                    Se afișează <span className="font-medium">{products.length}</span> din <span className="font-medium">{totalItems}</span> rezultate
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p = i + 1;
                    if (totalPages > 5 && currentPage > 3) p = currentPage - 2 + i;
                    if (p > totalPages) return null;

                    return (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`w-8 h-8 rounded-md text-sm font-medium transition ${
                                currentPage === p 
                                ? 'bg-blue-600 text-white border border-blue-600' 
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {p}
                        </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListAdmin;