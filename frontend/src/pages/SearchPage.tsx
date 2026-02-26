import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import SEO from '@/components/SEO';

const SearchPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Citim direct din URL keyword-ul și pagina curentă
  const keyword = searchParams.get('keyword') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Genul extras din URL (folosit și pentru backend API)
  const gender = location.pathname.startsWith('/women') ? 'women' : 'men';
  const displayName = "Rezultatele căutării";

  useEffect(() => {
    const fetchSearchProducts = async () => {
      if (!keyword.trim()) {
        setProducts([]);
        setPagination({ totalPages: 1, totalItems: 0 });
        return;
      }

      setIsLoading(true);
      try {
        // Trimitem TOȚI parametrii către backend pentru o paginare exactă
        const query = new URLSearchParams({
          keyword: keyword,
          page: currentPage.toString(),
          limit: '12', // Câte produse vrei pe pagină
          gender: gender,
          sortBy: sortBy
        });

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?${query.toString()}`);
        
        if (!response.ok) throw new Error("Eroare la preluarea datelor");

        const data = await response.json();
        
        setProducts(data.products || []);
        
        // Salvăm datele de paginare returnate de backend
        if (data.pagination) {
          setPagination({
            totalPages: data.pagination.totalPages || 1,
            totalItems: data.pagination.totalItems || 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchProducts();
    // Scroll sus de fiecare dată când se schimbă pagina sau căutarea
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [keyword, currentPage, gender, sortBy]);

  // Handlers pentru UI
  const handlePageChange = (newPage: number) => {
    // Actualizăm URL-ul, ceea ce va declanșa din nou useEffect-ul
    setSearchParams({ keyword, page: newPage.toString() });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    // Resetăm la pagina 1 când schimbăm sortarea
    setSearchParams({ keyword, page: '1' }); 
  };

  const breadcrumbElements = [
    { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://jade-intimo.com' },
    { '@type': 'ListItem', position: 2, name: gender === 'women' ? 'Femei' : 'Bărbați', item: `https://jade-intimo.com/${gender}` },
    { '@type': 'ListItem', position: 3, name: 'Căutare', item: `https://jade-intimo.com/${gender}/search?keyword=${keyword}` },
  ];

  return (
    <>
      <SEO
        title={`Căutare: ${keyword} | ${gender === 'women' ? 'Femei' : 'Bărbați'}`}
        description={`Rezultatele căutării pentru "${keyword}" în categoria de ${gender === 'women' ? 'femei' : 'bărbați'}.`}
        url={`https://jade-intimo.com/${gender}/search?keyword=${keyword}&page=${currentPage}`}
        schema={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbElements }}
      />
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="pt-[105px] flex-grow">
          {/* Breadcrumbs */}
          <nav className="border-b border-border bg-secondary/30">
            <div className="container-custom py-4">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Acasă</Link></li>
                <ChevronRight size={14} />
                <li>
                  <Link to={`/${gender}`} className="capitalize hover:text-foreground">
                    {gender === 'women' ? 'Femei' : 'Bărbați'}
                  </Link>
                </li>
                <ChevronRight size={14} />
                <li className="font-medium text-foreground">Căutare</li>
              </ol>
            </div>
          </nav>

          <div className="container-custom py-8">
            <header className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-3xl font-semibold md:text-4xl"
              >
                {displayName}
              </motion.h1>
              <p className="mt-2 text-muted-foreground text-lg">
                {keyword ? (
                  <>Ai căutat: <span className="font-medium text-foreground">"{keyword}"</span></>
                ) : (
                  "Te rugăm să introduci un termen pentru căutare."
                )}
              </p>
            </header>

            {/* Bara de filtre și număr produse */}
            {keyword && (
              <div className="mb-8 flex items-center justify-between border-b border-border pb-6">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{pagination.totalItems}</span> produse găsite
                </p>
                <div className="flex items-center gap-4">
                  <select 
                    value={sortBy} 
                    onChange={handleSortChange}
                    className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Cele mai noi</option>
                    <option value="price-low-high">Preț: Mic - Mare</option>
                    <option value="price-high-low">Preț: Mare - Mic</option>
                    <option value="best-selling">Cele mai vândute</option>
                  </select>
                </div>
              </div>
            )}

            {/* Conținut: Loader, Produse sau Empty State */}
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-pink-accent" size={40} />
                <p className="text-muted-foreground">Se caută produsele...</p>
              </div>
            ) : keyword ? (
              <>
                <ProductGrid products={products} />
                
                {/* --- PAGINAREA --- */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary border border-transparent hover:border-border"
                    >
                      <ChevronLeft size={16} />
                      Înapoi
                    </button>
                    
                    <span className="text-sm font-medium px-4">
                      Pagina {currentPage} din {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary border border-transparent hover:border-border"
                    >
                      Următoarea
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* Niciun produs găsit */}
                {products.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground text-lg">Nu am găsit niciun produs care să corespundă criteriilor.</p>
                    <Link to={`/${gender}`} className="mt-6 inline-block text-blue-600 hover:underline">
                      Întoarce-te la cumpărături
                    </Link>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default SearchPage;