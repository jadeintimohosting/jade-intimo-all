import { motion } from 'framer-motion';
import { useGender } from '@/context/GenderContext';
import ProductCard from '@/components/products/ProductCard';

const Bestsellers = ({ products }) => {
  const { gender } = useGender();

  if (!products) return null;

  const bestsellerProducts = products
    .filter((p) => p.gender === gender && p.isBestseller)
    .slice(0, 4);

  // If no bestsellers for this gender, show products
  const displayProducts =
    bestsellerProducts.length > 0
      ? bestsellerProducts
      : products.filter((p) => p.gender === gender).slice(0, 4);

  return (
    <section className="p-12 bg-background">
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
              Cele mai vândute
            </h2>
            <p className="mt-2 text-muted-foreground">
              Produsele favorite ale clienților pe care le vei adora
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id || product._id}
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

export default Bestsellers;