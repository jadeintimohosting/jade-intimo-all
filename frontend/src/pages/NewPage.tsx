import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import SEO from '@/components/SEO';
import { useProductStore } from '@/hooks/use-productstore'; // Adjusted path

const CategoryPage = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // 1. Get state and actions from Zustand
  const { newArrivals, setNewArrivals } = useProductStore();
  
  const gender = location.pathname.startsWith('/women') ? 'women' : 'men';
  const displayName = "Noutăți";

  // 2. Fetch logic with Zustand verification
  useEffect(() => {
    const fetchNewProducts = async () => {
      // Only fetch if the store has not been populated yet
      if (newArrivals == null) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/products/new`);
          const data = await response.json();
          // backend returns { men: Array, women: Array }
          setNewArrivals(data.men || data.women ? data : (data.products ?? data));
        } catch (error) {
          console.error("Failed to fetch new products:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNewProducts();
  }, [newArrivals, setNewArrivals]);

  let products: any[] = [];
  if (newArrivals) {
    products = gender === 'men' ? (newArrivals.men || []) : (newArrivals.women || []);
  }

  // 3. Filter by Gender & Sort
  const displayProducts = useMemo(() => {
    // products already scoped to gender; still guard if empty
    const filtered = (products || []).filter((p) => p.gender === gender || !p.gender);

    // Apply Sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }, [products, gender, sortBy]);

  const breadcrumbElements = [
    { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://jade-intimo.com' },
    { '@type': 'ListItem', position: 2, name: gender === 'women' ? 'Femei' : 'Bărbați', item: `https://jade-intimo.com/${gender}` },
    { '@type': 'ListItem', position: 3, name: 'Noutăți', item: `https://jade-intimo.com/${gender}/noutati` },
  ];

  return (
    <>
      <SEO
        title={`${displayName} ${gender === 'women' ? 'Femei' : 'Bărbați'}`}
        description={`Descoperă cele mai noi articole de lenjerie și haine pentru ${gender === 'women' ? 'femei' : 'bărbați'}.`}
        url={`https://jade-intimo.com/${gender}/noutati`}
        schema={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbElements }}
      />
      
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-[105px]">
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
                <li className="font-medium text-foreground">Noutăți</li>
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
              <p className="mt-2 text-muted-foreground">
                Explorează ultimele tendințe și colecții proaspăt intrate în stoc.
              </p>
            </header>

            {/* Filters Bar */}
            <div className="mb-8 flex items-center justify-between border-b border-border pb-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{displayProducts.length}</span> produse
              </p>
              <div className="flex items-center gap-4">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm font-medium focus:outline-none"
                >
                  <option value="newest">Cele mai noi</option>
                  <option value="price-low">Preț: Mic - Mare</option>
                  <option value="price-high">Preț: Mare - Mic</option>
                </select>
              </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-muted-foreground">Se încarcă noutățile...</p>
              </div>
            ) : (
              <ProductGrid products={displayProducts} />
            )}

            {!isLoading && displayProducts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">Momentan nu există produse noi în această categorie.</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CategoryPage;