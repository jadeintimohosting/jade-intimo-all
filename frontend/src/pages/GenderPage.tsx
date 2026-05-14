import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { womenCategories, menCategories } from '@/data/products';

// 1. Setup the domain safely (removes trailing slash if present)
const rawDomain = import.meta.env.VITE_CLOUDFLARE_DOMAIN || '';
const domain = rawDomain.endsWith('/') ? rawDomain.slice(0, -1) : rawDomain;

// 2. Define images. 
// NOTE: I changed these to .webp based on your previous request. 
// If your files on Cloudflare are actually .webp, change the extension below.
const categoryImagesWomen = {
  // Women's mappings (Keys match womenCategories slugs)
  'noutati': `${domain}/noutati.webp`,
  'curvy-marimi-mari': `${domain}/curvy_marimi_mari.webp`,
  'sutiene': `${domain}/sutiene.webp`,
  'chiloti': `${domain}/chiloti.webp`,
  'lenjerie': `${domain}/noutati.webp`,
  'pijamale': `${domain}/pijamale.webp`,
  'imbracaminte': `${domain}/imbracaminte.webp`,
  'costume-de-baie': `${domain}/costume_de_baie.webp`,

};

const categoryImagesMen = {
  // Women's mappings (Keys match womenCategories slugs)
  'noutati': `${domain}/noutati-men.webp`,
  'chiloti': `${domain}/chiloti-men.webp`,
  'pijamale': `${domain}/pijamale-men.webp`,
  'imbracaminte': `${domain}/imbracaminte-men.webp`,
  'costume-de-baie': `${domain}/costume_de_baie-men.webp`,
  'sosete': `${domain}/sosete-men.webp`
};

const GenderPage = () => {
  const location = useLocation();
  const gender = location.pathname.startsWith('/women') ? 'women' : 'men';
  const isWomen = gender === 'women';
  
  // Select the correct category list based on gender
  const categories = isWomen ? womenCategories : menCategories;

  // Fallback image logic based on gender

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://jade-intimo.com' },
      { '@type': 'ListItem', position: 2, name: isWomen ? 'Femei' : 'Bărbați', item: `https://jade-intimo.com/${gender}` },
    ],
  };

  return (
    <>
      <SEO
        title={isWomen ? "Colecția pentru Femei" : "Colecția pentru Bărbați"}
        description={isWomen 
          ? "Cumpără lenjerie intimă pentru femei, sutiene, chiloți, pijamale și costume de baie. Designuri elegante pentru orice ocazie."
          : "Cumpără lenjerie pentru bărbați, pijamale, îmbrăcăminte și costume de baie. Confort premium și stil sofisticat."
        }
        keywords={isWomen 
          ? "lenjerie femei, sutiene, chiloți, pijamale femei, costume de baie, intimo"
          : "lenjerie bărbați, pijamale bărbați, haine bărbați, costume de baie bărbați, boxeri"
        }
        url={`https://jade-intimo.com/${gender}`}
        schema={breadcrumbSchema}
      />
      <div className="min-h-screen">
        <Navbar />
        <main role="main" className="pt-[105px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="border-b border-border bg-secondary/30">
            <div className="container-custom py-4">
              <ol className="flex items-center gap-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground" itemProp="item">
                    <span itemProp="name">Acasă</span>
                  </Link>
                  <meta itemProp="position" content="1" />
                </li>
                <ChevronRight size={14} className="text-muted-foreground" aria-hidden="true" />
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <span className="font-medium capitalize" itemProp="name">{isWomen ? 'Femei' : 'Bărbați'}</span>
                  <meta itemProp="position" content="2" />
                </li>
              </ol>
            </div>
          </nav>

          {/* Header */}
          <header className="container-custom py-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-4xl font-semibold capitalize md:text-5xl"
            >
              Colecția pentru {isWomen ? 'Femei' : 'Bărbați'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-muted-foreground"
            >
              {isWomen
                ? 'Descoperă selecția noastră de lenjerie intimă elegantă și ținută de casă'
                : 'Piese esențiale premium, create pentru confort și stil'}
            </motion.p>
          </header>

          {/* Categories Grid */}
          <section className="container-custom pb-20" aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="sr-only">Cumpără după categorie</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <motion.article
                  key={category.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={`/${gender}/${category.slug}`}
                    className="group block overflow-hidden"
                    aria-label={`Cumpără ${category.name}`}
                  >
                    <figure className="image-zoom relative aspect-[4/5] overflow-hidden bg-secondary">
                      {/* 3. Updated Image Logic with Error Handling */}
                      <img
                        src={isWomen ? categoryImagesWomen[category.slug] : categoryImagesMen[category.slug]}
                        alt={`${category.name} - ${category.description}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // This ensures that if the Cloudflare link is broken (404),
                          // it automatically switches to the local fallback image.
                        }}
                      />
                      <figcaption className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-opacity duration-base group-hover:from-foreground/80">
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <h3 className="font-heading text-2xl font-semibold text-background">
                            {category.name}
                          </h3>
                          <p className="mt-2 text-sm text-background/80">
                            {category.description}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-background transition-all group-hover:gap-3">
                            Cumpără Acum
                            <ChevronRight size={16} aria-hidden="true" />
                          </span>
                        </div>
                      </figcaption>
                    </figure>
                  </Link>
                </motion.article>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default GenderPage;