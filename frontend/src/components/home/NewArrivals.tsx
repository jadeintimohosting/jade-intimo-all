import { motion } from 'framer-motion';
import { useGender } from '@/context/GenderContext';
import ProductCard from '@/components/products/ProductCard';

const NewArrivals = ({ products }) => {
  const { gender } = useGender();

  // Don't render until products are available
  if (!products) return null;

  // products may be an object with `women`/`men` or an array of products.
  let genderProducts = [];
  if (Array.isArray(products)) {
    genderProducts = products.filter((p) => p.gender === gender);
  } else {
    genderProducts = gender === 'women' ? (products.women || []) : (products.men || []);
  }

  const displayProducts = genderProducts.slice(0, 4);
  if (displayProducts.length === 0) return null;

  return (
    <section className="p-12 bg-secondary/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row"
        >
          <div>
            <h2 className="font-heading text-3xl font-semibold md:text-4xl">
              Noutăți
            </h2>
            <p className="mt-2 text-muted-foreground">
              Cele mai recente adăugiri în colecția noastră
            </p>
          </div>
          <a
            href={`/${gender}/noutati`}
            className="text-sm font-medium uppercase tracking-wider text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Vezi Tot
          </a>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id || product._id} // Support both standard id or mongo _id
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;