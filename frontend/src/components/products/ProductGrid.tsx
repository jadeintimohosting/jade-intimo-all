import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any; // Ideally this should be Product[]
  title?: string;
  description?: string;
}

const ProductGrid = ({ products, title, description }: ProductGridProps) => {
  // Defensive check: Ensure products is an array before checking length or mapping
  const safeProducts = Array.isArray(products) ? products : [];

  if (safeProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="font-heading text-xl font-medium">Nu am gasit produse</h3>
        <p className="mt-2 text-muted-foreground">
          Incercati sa schimbati filtrele sau reveniti mai tarziu.
        </p>
      </div>
    );
  }


  return (
    <div>
      {(title || description) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {title && (
            <h2 className="font-heading text-2xl font-semibold md:text-3xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </motion.div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {safeProducts.map((product, index) => (
          <motion.div
            key={product.id || product._id || index} // Added fallbacks for keys
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;