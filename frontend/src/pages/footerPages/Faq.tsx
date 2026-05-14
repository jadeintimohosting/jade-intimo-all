import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "Cum știu ce mărime mi se potrivește?",
      answer: "Pentru a alege mărimea perfectă, te rugăm să consulți secțiunea „Ghid Mărimi” pe care o găsești în subsolul paginii (Footer). Acolo sunt explicate clar dimensiunile și modul în care trebuie să te măsori pentru a nu da greș."
    },
    {
      question: "Pot returna produsele dacă nu mi se potrivesc?",
      answer: "Da, ai la dispoziție 14 zile pentru retur, însă există EXCEPȚII STRICTE DE IGIENĂ. Conform legii, produsele care vin în contact direct cu zona intimă (chiloți, tanga, slipi de baie, body-uri) NU pot fi returnate dacă au fost desigilate sau probate. Sutienele, halatele sau pijamalele pot fi returnate doar dacă au etichetele intacte, nu prezintă urme de uzură/machiaj și nu au fost spălate. Costul transportului de retur este suportat de client."
    },
    {
      question: "Cât costă și prin ce firmă se face livrarea?",
      answer: "Livrarea se face exclusiv prin Fan Courier și costă 25 RON. Pentru comenzile a căror valoare depășește 500 RON, transportul este absolut GRATUIT. Odată predat curierului, coletul ajunge la tine în general între 1 și 3 zile lucrătoare."
    },
    {
      question: "Ce metode de plată acceptați?",
      answer: "Oferim două variante sigure: poți plăti cash la livrare (Ramburs) direct curierului, sau poți plăti online, rapid și sigur, folosind cardul bancar (plățile sunt procesate prin sistemul securizat Stripe)."
    },
    {
      question: "Trebuie să îmi creez cont pentru a comanda?",
      answer: "Nu este obligatoriu. Poți adăuga produsele în coș și poți finaliza comanda rapid în calitate de „Vizitator” (Guest). Totuși, crearea unui cont te va ajuta să plasezi comenzi mai rapid pe viitor."
    },
    {
      question: "Cum se întrețin corect articolele din dantelă sau materiale fine?",
      answer: "Pentru a prelungi durata de viață a lenjeriei premium, îți recomandăm spălarea manuală în apă călduță (maxim 30°C), cu un detergent pentru rufe delicate. Evită stoarcerea puternică, nu folosi înălbitor și nu le usca la mașină. Lasă-le să se usuce natural."
    },
    {
      question: "Cum pot anula sau modifica o comandă?",
      answer: "Dacă te-ai răzgândit sau ai greșit datele, te rugăm să ne scrii cât mai rapid la rusancarus@gmail.com sau să ne suni la 0740142790 (Luni-Vineri 10-18). Dacă nu am predat deja coletul curierului, vom modifica sau anula comanda imediat."
    }
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-16">
        <div className="container-custom max-w-3xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl font-bold tracking-wide mb-4">Întrebări Frecvente (FAQ)</h1>
            <p className="text-muted-foreground">
              Găsește rapid răspunsuri la cele mai comune întrebări despre produsele și serviciile Jade Intimo.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-lg transition-colors duration-200 ${
                  openIndex === index ? 'border-foreground bg-secondary/10' : 'border-border bg-transparent hover:border-foreground/50'
                }`}
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="font-medium text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <div className="text-muted-foreground shrink-0">
                    {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {openIndex === index && (
                  <div className="px-5 pb-5 pt-1 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-secondary/30 p-8 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2">Nu ai găsit răspunsul căutat?</h2>
            <p className="text-muted-foreground mb-6">
              Echipa noastră este aici să te ajute cu orice alte informații legate de comanda ta.
            </p>
            <Link 
              to="/asistenta"
              className="inline-block px-6 py-3 bg-foreground text-background font-medium rounded-md hover:bg-foreground/90 transition-colors"
            >
              Contactează-ne
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default Faq;