import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const TermeniConditii = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-16">
        <div className="container-custom max-w-4xl mx-auto px-4">
          
          <div className="mb-12 text-center">
            <h1 className="font-heading text-4xl font-bold tracking-wide mb-4">Termeni și Condiții</h1>
            <p className="text-muted-foreground">Ultima actualizare: Februarie 2026</p>
          </div>

          <div className="space-y-12 text-muted-foreground leading-relaxed">
            
            {/* Secțiunea 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Informații Generale</h2>
              <p>
                Acest site web, <strong>jadeintimo.ro</strong>, este deținut și administrat de <strong>PFA RUS S ANCA</strong>, denumită în continuare „Vânzător” sau „Jade Intimo”.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg my-4">
                <p className="font-medium text-foreground mb-2">Date de identificare ale companiei:</p>
                <ul className="space-y-2">
                  <li><strong className="text-foreground">Denumire:</strong> PFA RUS S ANCA</li>
                  <li><strong className="text-foreground">CUI:</strong> 31737801</li>
                  <li><strong className="text-foreground">Registrul Comerțului:</strong> F2/583/2013</li>
                  <li><strong className="text-foreground">Adresa sediului:</strong> Strada Cocorilor nr. 48, Județul Arad</li>
                  <li><strong className="text-foreground">E-mail:</strong> rusancarus@gmail.com</li>
                  <li><strong className="text-foreground">Telefon:</strong> 0740142790</li>
                  <li><strong className="text-foreground">Program de lucru clienți:</strong> Luni - Vineri: 10:00 - 18:00 | Sâmbătă: 10:00 - 14:00</li>
                </ul>
              </div>
              
              <p>Folosirea acestui site, inclusiv plasarea comenzilor, implică acceptarea prezentelor Termeni și Condiții.</p>
            </section>

            {/* Secțiunea 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. Plasarea Comenzilor</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clienții pot plasa comenzi pe site în calitate de <strong>„Vizitator” (Guest)</strong>, fără a fi necesară crearea obligatorie a unui cont permanent.</li>
                <li>Odată plasată o comandă, Clientul este de acord că toate datele furnizate sunt corecte și complete.</li>
                <li>Pentru o bună coordonare, Vânzătorul va comunica telefonic cu Clientul în legătură cu statusul livrării sau pentru eventuale clarificări privind comanda.</li>
              </ul>
            </section>

            {/* Secțiunea 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. Prețul și Metodele de Plată</h2>
              <p>Toate prețurile afișate pe site sunt exprimate în <strong>RON</strong>.</p>
              <p>Plata produselor se poate face prin următoarele metode:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Plata la livrare (Ramburs):</strong> Se achită contravaloarea comenzii direct la curier, în momentul primirii coletului.</li>
                <li><strong>Plata online cu cardul bancar:</strong> Procesată în condiții de maximă securitate prin intermediul partenerului nostru, <strong>Stripe</strong>. Datele cardului nu sunt stocate de către Jade Intimo.</li>
              </ul>
            </section>

            {/* Secțiunea 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Livrarea Produselor</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Livrarea se efectuează prin intermediul companiei de curierat <strong>Fan Courier</strong>.</li>
                <li><strong>Timp de procesare a comenzii:</strong> 1-2 zile lucrătoare. În cazul în care un produs prezintă stoc insuficient sau apar alte probleme tehnice/logistice, acest timp poate varia, iar Clientul va fi notificat telefonic sau prin e-mail.</li>
                <li><strong>Timp de tranzit (livrare):</strong> 1-3 zile lucrătoare din momentul predării coletului către curier.</li>
              </ul>
              
              <p className="font-medium text-foreground mt-6">Costuri de transport:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pentru comenzile cu o valoare mai mică de 500 RON, taxa de livrare este de <strong>25 RON</strong>.</li>
                <li>Pentru comenzile peste 500 RON, livrarea este <strong>GRATUITĂ</strong>.</li>
              </ul>
            </section>

            {/* Secțiunea 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Politica de Retur și Excepțiile de Igienă</h2>
              <p>Conform OUG 34/2014, Clientul are dreptul de a se retrage din contract (a returna produsele) în termen de <strong>14 zile calendaristice</strong> de la primirea coletului, fără a invoca un motiv.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Costul transportului pentru retur este suportat integral de către Client.</strong></li>
              </ul>
              
              {/* Caseta de avertizare pentru igienă */}
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-5 rounded-r-md my-6">
                <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2">ATENȚIE - EXCEPȚII DE LA RETUR (Motive de Igienă):</h3>
                <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                  Conform OUG 34/2014, Art. 16, lit. e), <strong>se exceptează de la dreptul de retur produsele din categoria lenjerie intimă și anumite piese de costume de baie (partea inferioară/slipul) care vin în contact direct cu pielea.</strong> Din motive de protecție a sănătății și de igienă, aceste produse NU pot fi returnate dacă au fost desigilate, probate sau purtate de către consumator.
                </p>
              </div>

              <p>Pentru a fi acceptate la retur (acolo unde produsul permite), articolele trebuie să fie în aceeași stare în care au fost livrate, cu toate etichetele și sigiliile de igienă intacte.</p>
            </section>

            {/* Secțiunea 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Stocarea Datelor Tehnice (Cookies și Local Storage)</h2>
              <p>Pentru funcționarea corectă a magazinului online jadeintimo.ro, platforma utilizează tehnologii de stocare în browserul Clientului:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies:</strong> Sunt folosite strict pentru a salva temporar ID-ul utilizatorului, adresa de e-mail, prenumele, numele și numărul de telefon, cu scopul de a facilita procesul de comandă.</li>
                <li><strong>Local Storage:</strong> Este folosit exclusiv pentru a salva conținutul „Coșului de cumpărături” curent, astfel încât Clientul să nu piardă produsele selectate dacă navighează pe alte pagini.</li>
              </ul>
              <p className="text-sm italic mt-4">
                (Mai multe detalii despre prelucrarea generală a datelor pot fi regăsite în Politica de Confidențialitate).
              </p>
            </section>

            {/* Secțiunea 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Forța Majoră și Litigii</h2>
              <p>Niciuna dintre părți nu va fi răspunzătoare pentru neexecutarea obligațiilor sale, dacă o astfel de neexecutare este cauzată de un eveniment de forță majoră. Orice conflict apărut între Jade Intimo și clienți va fi rezolvat pe cale amiabilă. În cazul în care acest lucru nu este posibil, litigiul va fi soluționat de instanțele judecătorești competente din România.</p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TermeniConditii;