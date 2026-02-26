import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import SEO from '@/components/SEO';
import { womenCategories, menCategories } from '@/data/products';

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const location = useLocation();
  
  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter States
  const [sortBy, setSortBy] = useState('newest');
  
  // Data & Pagination States
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Constant

  const gender = location.pathname.startsWith('/women') ? 'women' : 'men';
  const categories = gender === 'women' ? womenCategories : menCategories;
  const currentCategory = categories.find((c) => c.slug === category);

  // Reset page to 1 if the category or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, subcategory, sortBy, gender]);

  // Main Data Fetching Effect
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      // Filters
      if (category && category !== 'all') params.append('category', category);
      if (subcategory) params.append('subCategory', subcategory);
      params.append('gender', gender);
      params.append('sortBy', sortBy);
      
      // Pagination Params
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      try {
        const response = await fetch(`/api/products?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        
        // 1. Set Products (Handle backend response structure)
        // Adjust 'data.products' or 'data.data' depending on your API structure
        setCategoryProducts(data.products || data.data || []);
        
        // 2. Set Pagination Data
        if (data.pagination) {
          setTotalItems(data.pagination.totalItems);
          setTotalPages(data.pagination.totalPages);
        } else {
             // Fallback if pagination data is missing
             setTotalItems(data.products?.length || 0);
             setTotalPages(1);
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load products. Please try again later.");
        setCategoryProducts([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
    
    // Scroll to top of grid when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  }, [category, subcategory, sortBy, gender, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <SEO 
        title={subcategory ? `${subcategory} - Jade Intimo` : `${currentCategory?.name || category} - Jade Intimo`} 
      />
      
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-[105px]">
          {/* Breadcrumbs */}
          <nav className="border-b border-border bg-secondary/30">
            <div className="container-custom py-4">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                <ChevronRight size={14} />
                <li className="capitalize"><Link to={`/${gender}`}>{gender}</Link></li>
                <ChevronRight size={14} />
                <li className={!subcategory ? "font-medium text-foreground" : ""}>
                  <Link to={`/${gender}/${category}`}>{currentCategory?.name || category}</Link>
                </li>
                {subcategory && (
                  <>
                    <ChevronRight size={14} />
                    <li className="font-medium text-foreground capitalize">{subcategory.replace(/-/g, ' ')}</li>
                  </>
                )}
              </ol>
            </div>
          </nav>

          <div className="container-custom py-8">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <motion.h1 
                  key={`${category}-${subcategory}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-heading text-3xl font-semibold md:text-4xl capitalize"
                >
                  {subcategory ? subcategory.replace(/-/g, ' ') : (currentCategory?.name || category)}
                </motion.h1>
                <p className="mt-2 text-muted-foreground">
                  {currentCategory?.description || `Premium collection for ${gender}.`}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-b border-foreground bg-transparent py-1 text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </header>

            {/* Results Info Bar */}
            <div className="my-8 flex items-center justify-between border-b border-border pb-4">
               <p className="text-sm text-muted-foreground italic">
                Showing <span className="font-medium text-foreground">{categoryProducts.length}</span> of <span className="font-medium text-foreground">{totalItems}</span> products
              </p>
            </div>

            {/* Grid Area */}
            <section className="relative min-h-[400px]">
              
              {/* Loading State Overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/80 pt-20 backdrop-blur-[1px]">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
              )}

              {/* Error State */}
              {error ? (
                  <div className="text-center py-20 text-red-500">
                      <p>{error}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 underline text-sm"
                      >
                        Try Again
                      </button>
                  </div>
              ) : categoryProducts.length > 0 ? (
                  <ProductGrid products={categoryProducts} />
              ) : (
                  !isLoading && (
                    <div className="text-center py-20 text-gray-500">
                        <p>No products found in this category.</p>
                        <Link to="/" className="text-blue-600 underline mt-2 block">Go Back Home</Link>
                    </div>
                  )
              )}
              

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CategoryPage;