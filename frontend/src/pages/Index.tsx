import { useEffect } from 'react';
import { useProductStore } from '@/hooks/use-productstore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import NewArrivals from '@/components/home/NewArrivals';
import Bestsellers from '@/components/home/Bestsellers';
import SEO from '@/components/SEO';

const Index = () => {
  const { 
    newArrivals, 
    bestSellers, 
    setNewArrivals, 
    setBestSellers 
  } = useProductStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch New Products only if not yet fetched
        if (newArrivals == null) {
          const newRes = await fetch(`/api/products/new`);
          const newData = await newRes.json();
          // store the payload's products (handle either shape)
          setNewArrivals(newData.products ?? newData);
        }

        // 2. Fetch Bestsellers only if not yet fetched
        if (bestSellers == null) {
          const bestRes = await fetch(`/api/products?limit=4&sortBy=best-selling`);
          const bestData = await bestRes.json();
          setBestSellers(bestData.products ?? bestData);
        }
      } catch (error) {
        console.error("Error fetching home products:", error);
      }
    };

    fetchData();
  }, [newArrivals, bestSellers, setNewArrivals, setBestSellers]);


  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Jade Intimo - Lenjerie Intimă & Loungewear Premium',
    description: 'Descoperă lenjerie intimă de lux și ținute de casă confortabile.',
    url: 'https://jade-intimo.com',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Colecția pentru Femei', url: 'https://jade-intimo.com/women' },
        { '@type': 'ListItem', position: 2, name: 'Colecția pentru Bărbați', url: 'https://jade-intimo.com/men' },
      ],
    },
  };

  return (
    <>
      <SEO 
        title="Jade Intimo | Lenjerie Intimă & Loungewear Premium"
        description="Cumpără sutiene, chiloți, pijamale și costume de baie. Transport gratuit la comenzi peste 500 RON."
        url="https://jade-intimo.com"
        schema={homeSchema}
      />
      <div className="min-h-screen">
        <Navbar />
        <main role="main">
          <Hero />
          <FeaturedCategories />
          
          {/* Passing the data from Zustand to components */}
          <NewArrivals products={newArrivals}/>
          
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;