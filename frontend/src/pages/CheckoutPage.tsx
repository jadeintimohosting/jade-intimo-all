import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Check, CreditCard, Truck, MapPin, Banknote } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

import { useCartStore } from '@/hooks/use-cartstore';
import useAuthStore from '@/hooks/use-authstore';

type Step = 'shipping' | 'payment' | 'review';
type PaymentMethod = 'credit_card' | 'cod';

const CheckoutPage = () => {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');

  const user = useAuthStore((state) => state.user);
  const address = useAuthStore((state) => state.address);
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = cartTotal > 50000 ? 0 : 2500; 
  const finalTotal = cartTotal;

  // Transform cart items to match backend snake_case expectation
  const cartItems = cart.map((item) => ({
    variant_id: item.variantId,
    quantity: item.quantity,
    price: item.price
  }));

  // FIXED: Added optional chaining (?.) to safely handle null user or address
  const [shippingInfo, setShippingInfo] = useState({
    firstName: isAuthenticated ? (user?.first_name || '') : '',
    lastName: isAuthenticated ? (user?.last_name || '') : '',
    email: isAuthenticated ? (user?.email || '') : '',
    phone: isAuthenticated ? (user?.phone || '') : '',
    address: isAuthenticated ? (address?.address_line || '') : '',
    city: isAuthenticated ? (address?.city || '') : '',
    state: isAuthenticated ? (address?.state || '') : '',
    zipCode: isAuthenticated ? (address?.postal_code || '') : '',
    country: isAuthenticated ? (address?.country || "Romania") : 'Romania',
  });

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'shipping', label: 'Livrare', icon: MapPin },
    { key: 'payment', label: 'Plată', icon: CreditCard },
    { key: 'review', label: 'Sumar', icon: Check },
  ];

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const orderPayload = {
        email: shippingInfo.email,
        first_name: shippingInfo.firstName,
        last_name: shippingInfo.lastName,
        address_line: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postal_code: shippingInfo.zipCode,
        country: shippingInfo.country || "Romania",
        total_ammount: finalTotal,
        payment_method: paymentMethod,
        items: cartItems,
      };

      if (paymentMethod === 'credit_card') {
        
        const stockRes = await fetch(`/api/order/check_stock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems }),
        });

        if (!stockRes.ok) {
          const errorData = await stockRes.json();
          throw new Error(errorData.error || "Unele produse nu mai sunt în stoc");
        }

        const paymentRes = await fetch(`/api/order/payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cartItems }),
        });
        const paymentData = await paymentRes.json();
        
        localStorage.setItem('pending_order_data', JSON.stringify(orderPayload));

        if (paymentData.url) {
            window.location.href = paymentData.url;
        }

      } 
      else {
        const res = await fetch(`/api/order/place`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(orderPayload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || data.details || "A apărut o eroare la plasarea comenzii");
        }

        clearCart();
        toast.success("Comanda a fost plasată cu succes!");
        navigate("/");
      }

    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(error.message || "A apărut o eroare neașteptată");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center pt-[105px]">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-semibold">Coșul tău este gol</h1>
            <Link to="/women" className="btn-primary mt-6 inline-block">
              Continuă Cumpărăturile
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-[105px]">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-secondary/30">
          <div className="container-custom py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
                Acasă
              </Link>
              <ChevronRight size={14} className="text-muted-foreground" />
              <Link to="/cart" className="text-muted-foreground transition-colors hover:text-foreground">
                Coș
              </Link>
              <ChevronRight size={14} className="text-muted-foreground" />
              <span className="font-medium">Finalizare Comandă</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-12">
          {/* Progress Steps */}
          <div className="mb-12 flex justify-center">
            <div className="flex items-center gap-4 md:gap-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = step.key === currentStep;
                const isCompleted = steps.findIndex((s) => s.key === currentStep) > index;

                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                          isActive
                            ? 'bg-foreground text-background'
                            : isCompleted
                            ? 'bg-pink text-foreground'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                      </div>
                      <span
                        className={`text-xs font-medium uppercase tracking-wider ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`hidden h-[1px] w-12 md:block ${
                          isCompleted ? 'bg-pink' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              
              {/* Shipping Form */}
              {currentStep === 'shipping' && (
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleShippingSubmit}
                  className="space-y-6"
                >
                   <h2 className="font-heading text-2xl font-semibold">
                    Informații de Livrare
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Prenume</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Nume</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Email</label>
                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Telefon</label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Adresă</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Oraș</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Județ/Sector</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Cod Poștal</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full sm:w-auto">
                    Continuă spre Plată
                  </button>
                </motion.form>
              )}

              {/* Payment Form */}
              {currentStep === 'payment' && (
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handlePaymentSubmit}
                  className="space-y-8"
                >
                  <h2 className="font-heading text-2xl font-semibold">
                    Metoda de Plată
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-6 transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-foreground bg-secondary/50 ring-1 ring-foreground'
                          : 'border-border hover:border-foreground/50'
                      }`}
                    >
                      <CreditCard size={24} />
                      <span className="text-sm font-medium">Card Bancar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-6 transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-foreground bg-secondary/50 ring-1 ring-foreground'
                          : 'border-border hover:border-foreground/50'
                      }`}
                    >
                      <Banknote size={24} />
                      <span className="text-sm font-medium">Ramburs (La livrare)</span>
                    </button>
                  </div>

                  {paymentMethod === 'credit_card' ? (
                    <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/20 p-6 animate-in fade-in slide-in-from-top-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <CreditCard size={24} className="text-foreground"/>
                      </div>
                      <div>
                        <h3 className="font-medium">Plătește cu Cardul</h3>
                        <p className="text-sm text-muted-foreground">
                          Vei fi redirecționat către Stripe pentru a finaliza plata în siguranță.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/20 p-6 animate-in fade-in slide-in-from-top-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <Truck size={24} className="text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Plată la livrare</h3>
                        <p className="text-sm text-muted-foreground">
                          Vei plăti numerar sau cu cardul când curierul ajunge la tine.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="btn-secondary"
                    >
                      Înapoi
                    </button>
                    <button type="submit" className="btn-primary">
                      Revizuiește Comanda
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Review Step */}
              {currentStep === 'review' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <h2 className="font-heading text-2xl font-semibold">
                    Sumar Comandă
                  </h2>

                  <div className="border border-border p-6">
                    <div className="flex items-center gap-3">
                      <Truck size={20} />
                      <h3 className="font-medium">Adresă Livrare</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {shippingInfo.firstName} {shippingInfo.lastName}
                      <br />
                      {shippingInfo.address}
                      <br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      <br />
                      {shippingInfo.email}
                    </p>
                  </div>

                  <div className="border border-border p-6">
                    <div className="flex items-center gap-3">
                      {paymentMethod === 'credit_card' ? (
                        <CreditCard size={20} />
                      ) : (
                        <Banknote size={20} />
                      )}
                      <h3 className="font-medium">Metoda de Plată</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {paymentMethod === 'credit_card' 
                        ? `Plată cu Cardul (Stripe)`
                        : 'Plată Ramburs (Numerar la curier)'
                      }
                    </p>
                  </div>

                  <div className="border border-border p-6">
                    <h3 className="font-medium">Produse Comandate</h3>
                    <div className="mt-4 space-y-4">
                      {cart.map((item) => (
                        <div key={item.variantId} className="flex gap-4">
                          <div className="h-16 w-12 overflow-hidden bg-secondary">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            {item.size && (
                                <p className="text-xs text-muted-foreground">Mărime: {item.size}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Cant: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            {((item.price * item.quantity) / 100).toFixed(2)} RON
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('payment')}
                      className="btn-secondary"
                    >
                      Înapoi
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="btn-primary disabled:opacity-50"
                    >
                      {isProcessing ? 'Se procesează...' : 'Plasează Comanda'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="sticky top-32 bg-secondary/50 p-6">
                <h2 className="font-heading text-xl font-semibold">Total Comandă</h2>

                <div className="mt-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="h-16 w-12 overflow-hidden bg-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        {item.size && <p className="text-xs text-muted-foreground">Mărime: {item.size}</p>}
                        <p className="text-xs text-muted-foreground">
                          Cant: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {((item.price * item.quantity) / 100).toFixed(2)} RON
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="my-6 border-border" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{(cartTotal/100).toFixed(2)} RON</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livrare</span>
                    <span>
                      {shippingCost === 0 ? 'Gratuit' : `${(shippingCost/100).toFixed(2)} RON`}
                    </span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{((finalTotal+shippingCost)/100).toFixed(2)} RON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;