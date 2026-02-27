import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificăm în localStorage dacă utilizatorul a interacționat deja cu popup-ul
    const hasConsented = localStorage.getItem('cookie-consent');
    
    // Dacă nu a acceptat/refuzat încă, îi afișăm popup-ul cu un mic delay
    if (!hasConsented) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Înregistrăm refuzul ca să nu-l mai deranjăm la fiecare refresh
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none"
        >
          <div className="mx-auto max-w-5xl bg-background border border-border shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center pointer-events-auto relative">
            
            <div className="flex-1 flex gap-4 md:gap-6">
              <div className="bg-primary/10 p-3 rounded-full h-fit hidden sm:block">
                <ShieldCheck className="text-primary w-8 h-8" />
              </div>
              <div className="space-y-2.5">
                <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground pr-8">
                  Confidențialitatea ta este importantă pentru noi
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Folosim cookie-uri și stocare locală strict pentru a-ți asigura accesul în cont și pentru buna funcționare a magazinului. 
                  Datele pe care le salvăm securizat pe dispozitivul tău includ: <span className="font-semibold text-foreground">numele întreg, adresa de email, ID-ul contului, rolul tău de utilizator, produsele din coșul de cumpărături</span>, precum și <span className="font-semibold text-foreground">datele comenzii pe termen scurt</span> (până la procesarea sigură a plății cu cardul). 
                  Nu folosim aceste informații pentru tracking sau reclame. 
                  <br className="hidden md:block" />
                  Poți afla mai multe detalii citind <Link to="/politica_si_confidentialitate" className="text-primary hover:underline font-medium">Politica de confidențialitate</Link>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
              <Button 
                variant="outline" 
                onClick={handleDecline} 
                className="w-full sm:w-auto"
              >
                Refuză
              </Button>
              <Button 
                onClick={handleAccept} 
                className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90"
              >
                Am înțeles și Accept
              </Button>
            </div>

            {/* Buton X pentru mobile */}
            <button 
              onClick={handleDecline}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors sm:hidden"
              aria-label="Închide"
            >
              <X size={20} />
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;