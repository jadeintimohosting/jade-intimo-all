import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Importuri Zustand
import useAuthStore from '@/hooks/use-authstore'; 
import { useCartStore, CartItem } from '@/hooks/use-cartstore';

// Import your base interface
import { Product } from '@/data/products';

interface Variants {
  id: string;
  product_id: string;
  size: string;
  quantity: number;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Zustand Stores
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variants[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // UI State
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [available, setAvailable] = useState(0);
  
  // Image Gallery State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 1. Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setProduct(null);
            return;
          }
          throw new Error('Eșec la încărcarea produsului');
        }

        const data = await response.json();
        const productData = data.product?.product || data.product; 
        const variantsData = data.product?.variants || [];

        setProduct(productData);
        setVariants(variantsData);
        
        setSelectedSize('');
        setQuantity(1);
        setCurrentImageIndex(0); 
      } catch (err) {
        console.error("Error loading product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (variants && variants.length > 0 && !selectedSize) {
      toast.error('Te rugăm să alegi o mărime');
      return;
    }
    if (!available || available === 0) {
      toast.error('Acest produs nu este în stoc');
      return;
    }
    if (quantity > available) {
      toast.error(`Stoc insuficient. Mai sunt doar ${available} bucăți.`);
      return;
    }

    const cartItemToAdd: CartItem = {
      ...product,
      variantId: selectedVariantId,
      size: selectedSize,
      quantity: quantity,
    };

    if (isAuthenticated) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: id,
            variantId: selectedVariantId,
            quantity: quantity
          }),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Eșec la adăugarea produsului în coș");

        addItem(cartItemToAdd);
        toast.success(`${product?.name} a fost adăugat în coș!`);

      } catch (error: any) {
        toast.error(error.message || "A apărut o problemă. Încearcă din nou.");
      }
    } else {
      try {
        addItem(cartItemToAdd);
        toast.success(`${product?.name} a fost adăugat în coș (Local)!`);
      } catch (error) {
        toast.error("Nu s-a putut salva în coșul local.");
      }
    }
  };

  const images = product?.image_list?.length > 0 
    ? product.image_list 
    : product?.image 
      ? [product.image] 
      : [];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-pink-accent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl">Produsul nu a fost găsit</h1>
          <Button onClick={() => navigate('/')} className="mt-8">Înapoi la Acasă</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-32">
      <SEO
        title={`${product.name} | Jade Intimo`}
        description={product.description || `Cumpără ${product.name} la Jade Intimo`}
      />
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Acasă</Link></li>
            <ChevronRight size={14} />
            <li>
              <Link to={`/${product.gender}`} className="capitalize hover:text-foreground">
                {product.gender === 'women' ? 'Femei' : 'Bărbați'}
              </Link>
            </li>
            <ChevronRight size={14} />
            <li className="text-foreground font-medium truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        {/* --- CHANGED GRID LAYOUT HERE --- */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-12">
          
          {/* --- IMAGE GALLERY (Now takes 5 columns instead of 6, and has a max width) --- */}
          <div className="space-y-4 select-none lg:col-span-5 lg:max-w-md w-full">
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-xl group flex items-center justify-center">
              {images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={images[currentImageIndex]}
                    alt={`${product.name} - imaginea ${currentImageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
              ) : (
                 <div className="text-muted-foreground">Fără imagine</div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 transform hover:scale-110"
                  >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 transform hover:scale-110"
                  >
                    <ChevronRight size={24} strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-20 w-16 sm:h-24 sm:w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ease-in-out ${
                      currentImageIndex === idx 
                        ? 'border-foreground shadow-md' 
                        : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- PRODUCT DETAILS (Now takes 7 columns instead of 6) --- */}
          <div className="space-y-8 lg:col-span-6">
            <div>
              <h1 className="font-heading text-3xl lg:text-4xl font-semibold">{product.name}</h1>
              <div className="mt-6 flex items-center gap-4">
                <span className="text-3xl font-semibold">{(Number(product.price) / 100).toFixed(2)} RON</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {Number(product.originalPrice / 100).toFixed(2)} RON
                  </span>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl">
              {product.description || "Nu există descriere disponibilă."}
            </p>

            {variants && variants.length > 0 && (
              <div className="space-y-4 max-w-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider">Alege Mărimea</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {variants.map((vari) => {
                    const isOutOfStock = vari.quantity === 0;
                    const isSelected = selectedSize === vari.size;
                    
                    return (
                      <button
                        key={vari.size}
                        onClick={() => {
                          if (!isOutOfStock) {
                            setSelectedSize(vari.size);
                            setAvailable(vari.quantity);
                            setSelectedVariantId(vari.id);
                            setQuantity(1); 
                          }
                        }}
                        disabled={isOutOfStock}
                        className={`min-w-[3.5rem] border px-4 py-3 text-sm font-medium transition-all 
                          ${isOutOfStock 
                            ? 'border-gray-200 text-gray-300 decoration-line-through cursor-not-allowed bg-gray-50'
                            : isSelected 
                              ? 'border-foreground bg-foreground text-background shadow-md' 
                              : 'border-border hover:border-foreground text-foreground hover:shadow-sm'
                          }
                        `}
                      >
                        {vari.size}
                      </button>
                    );
                  })}
                </div>

                {selectedSize && (
                  <div className="text-sm font-medium animate-in fade-in slide-in-from-top-1">
                     {available >= 5 
                       ? <span className="text-green-600 flex items-center gap-1">✓ În Stoc</span> 
                       : <span className="text-orange-500 flex items-center gap-1">⚠ Stoc Limitat (doar {available} buc.)</span>
                     }
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border max-w-md">
              <div className="flex items-center border border-border rounded-md w-max">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!selectedSize}
                  className="px-4 py-3 hover:bg-secondary text-lg disabled:opacity-50"
                  aria-label="Decrease quantity"
                >−</button>
                <span className="px-4 py-3 min-w-[3rem] text-center font-medium select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(available || 99, quantity + 1))}
                  disabled={!selectedSize || quantity >= available}
                  className="px-4 py-3 hover:bg-secondary text-lg disabled:opacity-50"
                  aria-label="Increase quantity"
                >+</button>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                disabled={loading || (variants?.length > 0 && !selectedSize)} 
                className="flex-1 h-auto py-4 text-sm font-bold uppercase tracking-wide"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                Adaugă în coș
              </Button>
            </div>
            
            {product.material && (
                <div className="space-y-4 pt-6 text-sm text-muted-foreground">
                    <p><span className="font-semibold text-foreground">Material:</span> {product.material}</p>
                </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;