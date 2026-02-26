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

      // 1. Preluăm datele salvate
      const storedOrder = localStorage.getItem('pending_order_data');
      if (!storedOrder) {
        setStatus('error');
        toast.error("Datele comenzii s-au pierdut. Te rugăm să contactezi suportul.");
        return;
      }

      const orderData = JSON.parse(storedOrder);
      
      // Setăm numărul maxim de încercări
      const maxRetries = 3;
      let attempt = 0;

      // 2. Mecanism de Retry pentru a aștepta procesarea Stripe
      while (attempt < maxRetries) {
        try {
          // Dacă nu este prima încercare, așteptăm 2 secunde (2000 ms) înainte de a face cererea
          if (attempt > 0) {
            console.log(`Reîncercăm validarea plății... (Încercarea ${attempt + 1})`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          const res = await fetch(`/api/order/place`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", 
            body: JSON.stringify({
              ...orderData,
              stripe_session_id: sessionId
            }),
          });

          if (res.ok) {
            // 3. Succes! Curățăm datele și ieșim din buclă (return)
            localStorage.removeItem('pending_order_data');
            clearCart();
            setStatus('success');
            return; 
          }

          // Dacă cererea nu are succes (ex: 402 Payment Required din controllerul tău), continuăm bucla
          const errorData = await res.json();
          console.warn(`Încercarea ${attempt + 1} a eșuat:`, errorData.message);

        } catch (error) {
          console.error(`Eroare de rețea la încercarea ${attempt + 1}:`, error);
        }

        attempt++;
      }

      // 4. Dacă am epuizat toate cele 3 încercări (a trecut prea mult timp)
      setStatus('error');
      toast.error("Nu am putut confirma plata cu procesatorul. Te rugăm să ne contactezi.");
    };

    finalizeOrder();
  }, [sessionId]);

  if (status === 'verifying') return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {/* Adăugat un mic indicator vizual pentru așteptare */}
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-foreground">Se verifică plata cu Stripe...</p>
        <p className="text-sm text-muted-foreground mt-2">Te rugăm să nu închizi această pagină.</p>
      </div>
    </div>
  );
  
  if (status === 'error') return (
    <>
    <Navbar/>
      <div className="flex min-h-screen items-center justify-center text-red-600">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">Ceva nu a mers bine.</p>
          <p>Nu am putut confirma statusul plății tale.</p>
          <p>Te rugăm să contactezi suportul la adresa de email afișată pe site.</p>
          <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 border border-red-600 rounded hover:bg-red-50 transition-colors">
            Întoarce-te pe site
          </button>
        </div>
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