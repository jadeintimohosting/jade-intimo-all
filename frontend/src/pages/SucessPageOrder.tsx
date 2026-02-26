import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartStore } from '@/hooks/use-cartstore';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const finalizeOrder = async () => {
      if (!sessionId) return;

      // 1. Retrieve the saved data
      const storedOrder = localStorage.getItem('pending_order_data');
      if (!storedOrder) {
        setStatus('error');
        toast.error("Datele comenzii s-au pierdut. Te rugăm să contactezi suportul.");
        return;
      }

      const orderData = JSON.parse(storedOrder);

      try {
        // 2. Call API to verify payment AND place order
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/order/place`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
          body: JSON.stringify({
            ...orderData,
            stripe_session_id: sessionId
          }),
        });

        if (!res.ok) throw new Error("Order creation failed");

        // 3. Cleanup
        localStorage.removeItem('pending_order_data');
        clearCart();
        setStatus('success');
        
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    finalizeOrder();
  }, [sessionId]);

  if (status === 'verifying') return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-medium">Se verifică plata...</p>
    </div>
  );
  
  if (status === 'error') return (
    <>
    <Navbar/>
      <div className="flex min-h-screen items-center justify-center text-red-600">
        <p>Ceva nu a mers bine. Te rugăm să mai verifici odată datele introduse! </p>
        
        <p>Te rugăm să contactezi suportul.</p>
      </div>
      <Footer/>
    </>
  );

  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-[60vh] pt-[100px]">
      <h1 className="text-3xl font-bold text-green-600">Comandă Confirmată!</h1>
      <p className="mt-2 text-muted-foreground">Îți mulțumim pentru cumpărături.</p>
      <button onClick={() => navigate('/')} className="btn-primary mt-6">
        Înapoi la Acasă
      </button>
    </div>
    <Footer/>
    </>
  );
};

export default SuccessPage;