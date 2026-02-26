import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container-custom py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-2xl font-semibold tracking-wide">Jade Intimo</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Lenjerie intimă și îmbrăcăminte premium, confecționate din cele mai fine materiale pentru femeia și bărbatul modern.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="https://www.instagram.com/jade_intimo_arad/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/p/Jade-Intimo-Unirii-100063519762954/?locale=ro_RO" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Asistență</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/asistenta" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Asistență Clienți
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Ghid Mărimi
                </Link>
              </li>
              <li>
                <Link to="/livrare_si_retur" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Livrare și Retur
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Întrebări Frecvente
                </Link>
              </li>
            </ul>
          </div>

          {/* ANPC / Soluționare Litigii */}
          <div className="flex justify-start md:justify-end lg:justify-end">
            <div className="lig-cont-foot flex flex-col gap-3">
              <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer" className="link-lig-foot">
                <img 
                  alt="solutionare litigii" 
                  src={`${import.meta.env.VITE_CLOUDFLARE_DOMAIN}/anpc-sol.webp`}
                  className="w-40 h-auto"
                />
              </a>
              <a href="https://reclamatiisal.anpc.ro/" target="_blank" rel="noopener noreferrer" className="link-lig-foot">
                <img 
                  alt="solutionare litigii anpc" 
                  src={`${import.meta.env.VITE_CLOUDFLARE_DOMAIN}/anpc-sal.webp`}
                  className="w-40 h-auto"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © 2026 Jade Intimo. Toate drepturile rezervate.
              <br />
              Site realizat de <a className="underline hover:text-foreground transition-colors" href="https://www.linkedin.com/in/alexandru-r%C4%83dulescu-12b115264/" target="_blank" rel="noopener noreferrer">Rădulescu Alexandru Marius</a>
            </p>
            <div className="flex gap-6 ">
              <Link to="/termeni_si_conditii" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Termeni și Condiții
              </Link>

              <Link to="/politica_si_confidentialitate" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Politică și Confidențialitate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;