import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

// Importuri Zustand
import { useCartStore } from '@/hooks/use-cartstore';
import useAuthStore from '@/hooks/use-authstore';

const CartPage = () => {
  // 1. Accesăm starea din Zustand
  const { cart, removeItem, updateQuantity } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const [isUpdating, setIsUpdating] = useState(null); // Pentru loading state per item

  // 2. Calculăm totalurile derivate
  // Presupunem că prețul vine în bani (ex: 15900 pentru 159.00 RON) deci împărțim la 100
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) / 100;
  
  const freeShippingThreshold = 500; // 500 RON pentru transport gratuit
  const shippingCost = cartTotal > freeShippingThreshold ? 0 : 25.00; // 25 RON transport
  const finalTotal = cartTotal + shippingCost;

  // 3. Handlers pentru acțiuni (Sincronizare API + Zustand)
  
  // Modificat: primește cantitatea curentă și delta (+1 sau -1)
  const handleUpdateQuantity = async (variantId, currentQuantity, delta) => {
    const finalQuantity = currentQuantity + delta;

    // Prevenim cantități mai mici de 1
    if (finalQuantity < 1) return;

    setIsUpdating(variantId);
    
    try {
      if (isAuthenticated) {
        // Dacă e logat, actualizăm pe server cu cantitatea FINALA
        const response = await fetch(`/api/cart/${variantId}`, {
          method: 'PATCH', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nr: finalQuantity }), // Trimitem cantitatea absolută
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Eșec la actualizarea coșului');
      }

      // Actualizăm local în Zustand
      updateQuantity(variantId, finalQuantity);
    } catch (error) {
      console.error(error);
      toast.error("Nu s-a putut actualiza cantitatea");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (variantId) => {
    setIsUpdating(variantId);
    try {
      if (isAuthenticated) {
        const response = await fetch(`/api/cart/${variantId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Eșec la ștergerea produsului');
      }

      removeItem(variantId);
      toast.success("Produs șters din coș");
    } catch (error) {
      console.error(error);
      toast.error("Nu s-a putut șterge produsul");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <>
      <SEO
        title="Coș de Cumpărături"
        description="Vizualizează coșul tău de cumpărături la Jade Intimo."
        url="https://jade-intimo.com/cart"
      />
      <div className="min-h-screen">
        <Navbar />
        <main role="main" className="pt-[105px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="border-b border-border bg-secondary/30">
            <div className="container-custom py-4">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
                    Acasă
                  </Link>
                </li>
                <ChevronRight size={14} className="text-muted-foreground" aria-hidden="true" />
                <li>
                  <span className="font-medium">Coș Cumpărături</span>
                </li>
              </ol>
            </div>
          </nav>

          <div className="container-custom py-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-3xl font-semibold md:text-4xl"
            >
              Coșul Tău
            </motion.h1>

            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center"
              >
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                   <Trash2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Coșul tău este gol</h2>
                <p className="mt-2 text-muted-foreground">Se pare că nu ai adăugat nimic în coș încă.</p>
                <Link to="/women" className="btn-primary mt-8 inline-block px-8">
                  Începe Cumpărăturile
                </Link>
              </motion.div>
            ) : (
              <div className="mt-8 grid gap-12 lg:grid-cols-3">
                {/* Lista Produse */}
                <section className="lg:col-span-2" aria-labelledby="cart-items-heading">
                  <h2 id="cart-items-heading" className="sr-only">Produse în coș</h2>
                  <ul className="space-y-6">
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.li
                          key={item.variantId}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-6 border-b border-border pb-6 relative"
                        >
                          {/* Loading Overlay per item */}
                          {isUpdating === item.variantId && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                              <Loader2 className="animate-spin text-foreground" />
                            </div>
                          )}

                          {/* Imagine Produs */}
                          <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-sm bg-secondary">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          {/* Detalii Produs */}
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="font-heading font-medium text-lg">
                                    <Link to={`/product/${item.id}`} className="hover:underline">
                                        {item.name}
                                    </Link>
                                </h3>
                                <p className="font-semibold">
                                  {((item.price * item.quantity) / 100).toFixed(2)} RON
                                </p>
                              </div>
                              
                              {item.size && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                  Mărime: <span className="text-foreground">{item.size}</span>
                                </p>
                              )}
                              <p className="mt-1 text-sm text-muted-foreground">
                                Preț unitar: {(item.price / 100).toFixed(2)} RON
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              {/* Control Cantitate */}
                              <div className="flex items-center border border-border rounded-sm">
                                <button
                                  onClick={() => handleUpdateQuantity(item.variantId, item.quantity, -1)}
                                  className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                  aria-label="Scade cantitatea"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-10 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.variantId, item.quantity, 1)}
                                  className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary"
                                  aria-label="Crește cantitatea"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              {/* Buton Ștergere */}
                              <button
                                onClick={() => handleRemoveItem(item.variantId)}
                                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-red-500"
                              >
                                <Trash2 size={16} />
                                <span className="hidden sm:inline">Șterge</span>
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </section>

                {/* Sumar Comandă */}
                <motion.aside
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-fit rounded-lg border border-border bg-secondary/20 p-6 shadow-sm"
                  aria-labelledby="summary-heading"
                >
                  <h2 id="summary-heading" className="font-heading text-xl font-semibold">
                    Sumar Comandă
                  </h2>

                  <dl className="mt-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd>{cartTotal.toFixed(2)} RON</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">Transport</dt>
                      <dd className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                        {shippingCost === 0 ? 'Gratuit' : `${shippingCost.toFixed(2)} RON`}
                      </dd>
                    </div>
                    
                    {shippingCost > 0 ? (
                      <div className="rounded-md bg-blue-50 p-2 text-xs text-blue-700">
                        Adaugă încă <strong>{(freeShippingThreshold - cartTotal).toFixed(2)} RON</strong> pentru transport gratuit.
                      </div>
                    ) : (
                      <div className="rounded-md bg-green-50 p-2 text-xs text-green-700">
                        Felicitări! Ai <strong>Transport Gratuit</strong>.
                      </div>
                    )}

                    <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-end">
                            <dt className="text-base font-semibold">Total</dt>
                            <dd className="text-xl font-bold">{finalTotal.toFixed(2)} RON</dd>
                        </div>
                        <p className="mt-1 text-right text-xs text-muted-foreground">
                            TVA inclus.
                        </p>
                    </div>
                  </dl>

                  <Link
                    to="/checkout"
                    className="btn-primary mt-8 flex w-full items-center justify-center gap-2 py-4 text-base font-semibold shadow-md hover:shadow-lg"
                  >
                    Finalizează Comanda
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/women"
                    className="mt-6 block text-center text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
                  >
                    Continuă Cumpărăturile
                  </Link>
                </motion.aside>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CartPage;