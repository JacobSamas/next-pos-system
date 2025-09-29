export const seoConfig = {
  defaultTitle: "RetailPro POS - Modern Point of Sale System",
  titleTemplate: "%s | RetailPro POS",
  description: "Streamline your retail business with RetailPro POS - a modern, intuitive point of sale system featuring inventory management, sales analytics, and customer management tools.",
  keywords: [
    "POS system",
    "point of sale",
    "retail management",
    "inventory tracking",
    "sales analytics",
    "business management",
    "RetailPro",
    "retail POS",
    "restaurant POS",
    "inventory management software",
    "customer management",
    "payment processing",
    "business analytics",
    "retail technology"
  ],
  authors: [{ name: "RetailPro Team" }],
  creator: "RetailPro",
  publisher: "RetailPro",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  socialMedia: {
    twitter: '@RetailPro',
    facebook: 'RetailProPOS',
    linkedin: 'company/retailpro'
  },
  organizationSchema: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RetailPro POS',
    description: 'Modern Point of Sale System for retail businesses',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RetailPro',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
        width: 512,
        height: 512
      },
      sameAs: [
        'https://twitter.com/RetailPro',
        'https://facebook.com/RetailProPOS',
        'https://linkedin.com/company/retailpro'
      ]
    },
    featureList: [
      'Inventory Management',
      'Sales Analytics',
      'Customer Management',
      'Product Catalog',
      'Real-time Reporting',
      'Payment Processing',
      'Multi-location Support',
      'Staff Management',
      'Tax Management',
      'Discount Management'
    ],
    screenshot: [
      {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/screenshots/dashboard.png`
      },
      {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/screenshots/products.png`
      }
    ]
  }
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  keywords = [],
  images = []
}: {
  title: string
  description: string
  path?: string
  keywords?: string[]
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>
}) {
  const fullTitle = title === 'Dashboard' ? seoConfig.defaultTitle : `${title} | RetailPro POS`
  const url = `${seoConfig.baseUrl}${path}`
  const defaultImage = {
    url: `${seoConfig.baseUrl}/og-image.jpg`,
    width: 1200,
    height: 630,
    alt: 'RetailPro POS'
  }

  return {
    title: fullTitle,
    description,
    keywords: [...seoConfig.keywords, ...keywords],
    authors: seoConfig.authors,
    creator: seoConfig.creator,
    publisher: seoConfig.publisher,
    metadataBase: new URL(seoConfig.baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'RetailPro POS',
      images: images.length > 0 ? images : [defaultImage],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: images.length > 0 ? images.map(img => img.url) : [defaultImage.url],
      creator: seoConfig.socialMedia.twitter,
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  }
}