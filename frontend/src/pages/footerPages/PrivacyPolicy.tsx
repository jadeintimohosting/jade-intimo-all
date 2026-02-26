import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-16">
        <div className="container-custom max-w-4xl mx-auto px-4">
          
          <div className="mb-12 text-center">
            <h1 className="font-heading text-4xl font-bold tracking-wide mb-4">Politica de Confidențialitate (GDPR)</h1>
            <p className="text-muted-foreground">Ultima actualizare: Februarie 2026</p>
          </div>

          <div className="space-y-12 text-muted-foreground leading-relaxed">
            
            {/* Secțiunea 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Introducere</h2>
              <p>
                Această Politică de Confidențialitate explică modul în care <strong>PFA RUS S ANCA</strong> (denumită în continuare „Vânzătorul”, „noi” sau „Jade Intimo”) colectează, utilizează și protejează datele dumneavoastră cu caracter personal atunci când utilizați site-ul <strong>jadeintimo.ro</strong> și plasați comenzi.
              </p>
              <p>
                Ne angajăm să respectăm Regulamentul General privind Protecția Datelor (GDPR - Regulamentul UE 2016/679) și legislația națională aplicabilă.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg my-4">
                <p className="font-medium text-foreground mb-2">Datele noastre de contact pentru probleme legate de confidențialitate:</p>
                <ul className="space-y-2">
                  <li><strong className="text-foreground">Denumire:</strong> PFA RUS S ANCA</li>
                  <li><strong className="text-foreground">CUI:</strong> 31737801 | <strong className="text-foreground">Reg. Com.:</strong> F2/583/2013</li>
                  <li><strong className="text-foreground">Adresă:</strong> Strada Cocorilor nr. 48, Județul Arad</li>
                  <li><strong className="text-foreground">E-mail:</strong> rusancarus@gmail.com</li>
                  <li><strong className="text-foreground">Telefon:</strong> 0740142790</li>
                </ul>
              </div>
            </section>

            {/* Secțiunea 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. Ce date colectăm și de ce?</h2>
              <p>Colectăm doar datele strict necesare pentru a vă putea onora comenzile și pentru a vă oferi o experiență sigură pe site-ul nostru:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Date de identificare și contact:</strong> Nume, prenume, adresă de e-mail, număr de telefon.</li>
                <li><strong>Date de livrare și facturare:</strong> Adresa de livrare a produselor și adresa de facturare.</li>
                <li><strong>Date tehnice și de navigare:</strong> Adresa IP, tipul browserului, informații despre modul în care interacționați cu site-ul (prin intermediul Google Analytics).</li>
                <li><strong>Date financiare:</strong> Pentru plata online cu cardul, datele sunt procesate direct de către procesatorul de plăți (Stripe). Noi <strong>NU</strong> colectăm și nu stocăm datele cardului dumneavoastră bancar.</li>
              </ul>
              <p className="text-sm italic mt-4 bg-muted/20 p-3 rounded border-l-2 border-foreground">
                Notă: Site-ul nostru permite plasarea comenzilor în calitate de „Vizitator” (Guest), nefiind obligatorie crearea unui cont permanent.
              </p>
            </section>

            {/* Secțiunea 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. Temeiul legal și Scopul prelucrării</h2>
              <p>Prelucrăm datele dumneavoastră pe următoarele baze legale:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Executarea unui contract:</strong> Pentru procesarea, validarea, expedierea și facturarea comenzilor plasate pe site, precum și pentru contactarea telefonică a clientului strict în legătură cu livrarea comenzii.</li>
                <li><strong>Obligația legală:</strong> Pentru emiterea documentelor financiar-contabile (facturi), care trebuie păstrate conform legislației fiscale din România.</li>
                <li><strong>Interesul legitim:</strong> Pentru a ne asigura că site-ul funcționează corect și în siguranță, folosind analiza traficului pentru îmbunătățirea serviciilor.</li>
              </ul>
              <p className="text-sm italic">
                (Jade Intimo nu trimite comunicări de marketing de tip Newsletter, datele fiind folosite exclusiv pentru comenzi).
              </p>
            </section>

            {/* Secțiunea 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Cu cine partajăm datele dumneavoastră?</h2>
              <p>Pentru a vă putea oferi serviciile noastre, colaborăm cu terți de încredere, care acționează ca persoane împuternicite și sunt obligați să respecte confidențialitatea datelor:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Servicii de Curierat:</strong> Fan Courier (pentru livrarea coletelor; le transmitem numele, adresa și telefonul).</li>
                <li><strong>Procesator de Plăți:</strong> Stripe (pentru plățile online cu cardul).</li>
                <li><strong>Infrastructură IT și Găzduire (Hosting):</strong> Site-ul este găzduit pe platforma Railway, baza de date este gestionată prin Neon, iar livrarea imaginilor se face prin Cloudflare. Aceste companii asigură stocarea sigură a datelor în mediul cloud.</li>
                <li><strong>Analiza Traficului:</strong> Google Analytics (pentru a înțelege cum este utilizat site-ul; datele sunt generalizate/anonimizate).</li>
                <li>
                  <strong>Servicii de Facturare:</strong> <span className="text-orange-600 font-semibold bg-orange-100 dark:bg-orange-950/30 px-1 rounded">[COMPLETAȚI AICI NUMELE PROGRAMULUI DE FACTURARE, ex: SmartBill / Oblio / FGO]</span> (pentru emiterea facturilor fiscale conform legii).
                </li>
              </ul>
            </section>

            {/* Secțiunea 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Tehnologii de stocare internă (Cookies și Local Storage)</h2>
              <p>Pentru o funcționare optimă a procesului de cumpărături, jadeintimo.ro folosește următoarele metode de stocare pe dispozitivul dumneavoastră:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies:</strong> Sunt folosite strict pentru funcționalitățile de bază ale sesiunii, salvând temporar (doar cu acordul implicit prin continuarea navigării) un ID de utilizator, prenumele, numele, adresa de e-mail și numărul de telefon, pentru a pre-completa formularul de comandă.</li>
                <li><strong>Local Storage:</strong> Este utilizat exclusiv pentru a salva conținutul „Coșului de Cumpărături” curent. Astfel, dacă închideți accidental pagina sau navigați pe alte secțiuni, produsele selectate nu se vor pierde.</li>
              </ul>
            </section>

            {/* Secțiunea 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Perioada de păstrare a datelor</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Datele din comenzile finalizate și facturi:</strong> Sunt păstrate conform legislației financiar-contabile românești pentru o perioadă de 10 ani.</li>
                <li><strong>Datele din coșul de cumpărături / cookies:</strong> Sunt păstrate temporar pe durata sesiunii de navigare sau până când decideți ștergerea lor din setările browserului.</li>
              </ul>
            </section>

            {/* Secțiunea 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Drepturile Dumneavoastră</h2>
              <p>Conform GDPR, beneficiați de următoarele drepturi asupra datelor dumneavoastră:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dreptul de acces:</strong> Puteți solicita să aflați ce date deținem despre dumneavoastră.</li>
                <li><strong>Dreptul la rectificare:</strong> Puteți cere corectarea datelor inexacte.</li>
                <li><strong>Dreptul la ștergere („dreptul de a fi uitat”):</strong> Ne puteți cere ștergerea datelor (în măsura în care nu avem o obligație legală de a le păstra, de exemplu facturile).</li>
                <li><strong>Dreptul la restricționare și opoziție:</strong> Vă puteți opune prelucrării datelor.</li>
              </ul>
              <div className="bg-muted/30 p-5 rounded-md mt-6 border border-muted">
                <p>
                  Pentru exercitarea oricărui drept menționat, ne puteți contacta la adresa de e-mail: <strong>rusancarus@gmail.com</strong>. Vom răspunde solicitării dumneavoastră în termen de maxim 30 de zile.
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;