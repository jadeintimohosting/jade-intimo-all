import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Truck, Box, RefreshCcw, ShieldAlert, CreditCard, Clock } from 'lucide-react';

const LivrareRetur = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-16">
        <div className="container-custom max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl font-bold tracking-wide mb-4">Livrare și Retur</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Află tot ce trebuie să știi despre cum ajung produsele Jade Intimo la tine și cum poți returna un articol dacă mărimea nu este cea potrivită.
            </p>
          </div>

          <div className="space-y-16">
            
            {/* Secțiunea Livrare */}
            <section className="space-y-8">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <Truck size={28} className="text-foreground" />
                <h2 className="text-2xl font-semibold">Informații despre Livrare</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-secondary/20 p-6 rounded-lg border border-border">
                  <h3 className="font-medium text-lg mb-2">Prin Curier Rapid</h3>
                  <p className="text-muted-foreground mb-4">
                    Comenzile sunt expediate oriunde în România, exclusiv prin compania de curierat <strong>Fan Courier</strong>.
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Box size={16} /> Cost transport standard: <strong>25 RON</strong></li>
                    <li className="flex items-center gap-2"><Clock size={16} /> Procesare comandă: <strong>1 - 2 zile lucrătoare</strong></li>
                    <li className="flex items-center gap-2"><Truck size={16} /> Timp de tranzit: <strong>1 - 3 zile lucrătoare</strong></li>
                  </ul>
                </div>

                <div className="bg-secondary/20 p-6 rounded-lg border border-border flex flex-col justify-center items-start">
                  <h3 className="font-medium text-lg mb-2">Livrare Gratuită</h3>
                  <p className="text-muted-foreground mb-4">
                    Pentru a te bucura de produsele noastre fără grija transportului, îți oferim livrare gratuită pentru comenzile mai mari.
                  </p>
                  <div className="inline-block px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md">
                    Gratuit la comenzi peste 500 RON
                  </div>
                </div>
              </div>
            </section>

            {/* Secțiunea Retur */}
            <section className="space-y-8">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <RefreshCcw size={28} className="text-foreground" />
                <h2 className="text-2xl font-semibold">Politica de Retur</h2>
              </div>

              <div className="text-muted-foreground space-y-4">
                <p>
                  Conform legislației în vigoare (OUG 34/2014), ai la dispoziție <strong>14 zile calendaristice</strong> de la primirea coletului pentru a returna produsele care nu ți se potrivesc, fără a invoca un motiv. <strong>Costul transportului pentru retur este suportat integral de către client.</strong>
                </p>

                {/* Atenționare Igienă */}
                <div className="bg-red-50 dark:bg-red-950/20 p-6 border-l-4 border-red-500 rounded-r-lg my-6 flex gap-4">
                  <ShieldAlert className="text-red-600 dark:text-red-400 shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2">ATENȚIE: Condiții stricte de igienă</h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Conform Art. 16, lit. e) din OUG 34/2014, din motive de igienă și pentru protejarea sănătății, <strong>produsele din categoria lenjerie intimă și anumite piese de costume de baie (partea inferioară/slipul) care vin în contact direct cu pielea NU pot fi returnate</strong> dacă au fost desigilate, probate sau purtate.
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                      Sutienele sau alte articole care nu intră în excepțiile de mai sus pot fi returnate doar dacă au etichetele și sigiliile de igienă originale atașate, nu prezintă urme de uzură, parfum sau machiaj și nu au fost spălate.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pașii de retur */}
              <div className="mt-8">
                <h3 className="text-xl font-medium mb-6">Cum procedezi pentru a returna?</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background font-bold shrink-0">1</div>
                    <div>
                      <h4 className="font-medium text-foreground">Anunță-ne</h4>
                      <p className="text-sm text-muted-foreground mt-1">Trimite un e-mail la <strong>rusancarus@gmail.com</strong> cu numărul comenzii și contul IBAN în care dorești restituirea banilor.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background font-bold shrink-0">2</div>
                    <div>
                      <h4 className="font-medium text-foreground">Ambalează produsul</h4>
                      <p className="text-sm text-muted-foreground mt-1">Pune produsul în ambalajul original, cu toate etichetele intacte, asigurându-te că este bine protejat pentru transport.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background font-bold shrink-0">3</div>
                    <div>
                      <h4 className="font-medium text-foreground">Cheamă curierul</h4>
                      <p className="text-sm text-muted-foreground mt-1">Expediază coletul prin orice firmă de curierat (fără ramburs) către adresa noastră: <strong>Strada Cocorilor nr. 48, Județul Arad</strong>.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background font-bold shrink-0"><CreditCard size={16} /></div>
                    <div>
                      <h4 className="font-medium text-foreground">Rambursarea banilor</h4>
                      <p className="text-sm text-muted-foreground mt-1">După ce primim și verificăm produsul pentru a ne asigura că respectă condițiile de igienă, îți vom returna contravaloarea acestuia în contul bancar specificat, în termen de maxim 14 zile.</p>
                    </div>
                  </div>
                </div>
              </div>

            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default LivrareRetur;