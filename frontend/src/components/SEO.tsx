import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  schema?: object;
}

const defaultTitle = 'Jade Intimo | Premium Intimates & Loungewear';
const defaultDescription = 'Discover luxurious intimates, lingerie, and loungewear designed for the modern woman and man. Shop bras, panties, pajamas, and swimwear with free shipping over 500 Ron.';
const defaultImage = 'https://lovable.dev/opengraph-image-p98pqg.png';
const siteUrl = 'https://jade-intimo.com';

const domain=import.meta.env.VITE_CLOUDFLARE_DOMAIN;

const SEO = ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = 'lingerie, intimates, underwear, bras, panties, sleepwear, pajamas, swimwear, women fashion, men underwear, luxury fashion',
  image = defaultImage,
  url = siteUrl,
  type = 'website',
  schema,
}: SEOProps) => {
  const fullTitle = title === defaultTitle ? title : `${title} | Jade Intimo`;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jade Intimo',
    description: defaultDescription,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jade Intimo',
    url: siteUrl,
    logo: `${domain}/logo.webp`,
    sameAs: [
      'https://instagram.com/jade-intimo',
      'https://facebook.com/jade-intimo',
      'https://twitter.com/jade-intimo',
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Jade Intimo" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Jade Intimo" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@jade-intimo" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
