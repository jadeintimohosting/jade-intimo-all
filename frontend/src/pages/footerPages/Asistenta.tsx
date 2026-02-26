import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Asistenta = () => {
  return (
    <>
      <Navbar />
      
      {/* Containerul principal - folosim min-h-screen pentru a nu tăia conținutul pe ecrane mici */}
      <main className="min-h-screen pt-32 pb-16">
        <div className="container-custom max-w-6xl mx-auto px-4">
          
          {/* Titlul paginii */}
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl font-bold tracking-wide mb-4">Asistență Clienți</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Suntem aici pentru tine. Dacă ai întrebări despre produsele noastre, comenzi sau returnări, nu ezita să ne contactezi folosind formularul de mai jos sau datele de contact directe.
            </p>
          </div>

            
            {/* Secțiunea 1: Informații de contact */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold border-b border-border pb-4">Cum ne poți găsi</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/50 rounded-full text-foreground">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Telefon</h3>
                    <p className="text-muted-foreground mt-1">0740142790</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/50 rounded-full text-foreground">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">E-mail</h3>
                    <p className="text-muted-foreground mt-1">rusancarus@gmail.com</p>
                    <p className="text-sm text-muted-foreground mt-1">Răspundem în maximum 24 de ore lucrătoare.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/50 rounded-full text-foreground">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Program de lucru</h3>
                    <p className="text-muted-foreground mt-1">Luni - Vineri: 10:00 - 18:00</p>
                    <p className="text-muted-foreground mt-1">Sâmbătă: 10:00 - 14:00</p>
                    <p className="text-muted-foreground">Duminică: Închis</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/50 rounded-full text-foreground">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Adresă Sediu</h3>
                    <p className="text-muted-foreground mt-1">Strada Cocorilor nr. 48, Județul Arad</p>
                    <p className="text-sm text-muted-foreground mt-1">(Aceasta este adresa sediului. Pentru retururi, te rugăm să consulți pagina de Livrare și Retur.)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </main>

      <Footer />
    </>
  );
};

export default Asistenta;