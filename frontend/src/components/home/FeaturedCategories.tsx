import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGender } from '@/context/GenderContext';
import { womenCategories, menCategories } from '@/data/products';

const rawDomain = import.meta.env.VITE_CLOUDFLARE_DOMAIN || '';
const domain = rawDomain.endsWith('/') ? rawDomain.slice(0, -1) : rawDomain;

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


const FeaturedCategories = () => {
  const { gender } = useGender();
  const categories = gender === 'women' ? womenCategories : menCategories;
  const displayCategories = categories.slice(1, 5);

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">
            Cumpără după Categorie
          </h2>
          <p className="mt-4 text-muted-foreground">
            Găsește stilul perfect în colecțiile noastre
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/${gender}/${category.slug}`}
                className="group block overflow-hidden"
              >
                <div className="image-zoom relative aspect-[3/4] overflow-hidden bg-secondary">
                  <img
                    src={gender === 'women' ? categoryImagesWomen[category.slug] : categoryImagesMen[category.slug]}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/0 to-transparent opacity-80 transition-opacity duration-base group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                    <h3 className="font-heading text-xl font-medium">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-background/80">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;