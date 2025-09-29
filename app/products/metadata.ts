import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Product Catalog",
  description: "Manage your inventory and product catalog. Add, edit, and track your products with real-time stock alerts and comprehensive product management tools.",
  keywords: ["inventory management", "product catalog", "stock tracking", "POS inventory", "retail products"],
  openGraph: {
    title: "Product Catalog | RetailPro POS",
    description: "Manage your inventory and product catalog with comprehensive product management tools.",
    url: '/products',
    images: [{
      url: '/og-products.jpg',
      width: 1200,
      height: 630,
      alt: 'RetailPro POS Product Catalog',
    }],
  },
  twitter: {
    title: "Product Catalog | RetailPro POS",
    description: "Manage your inventory and product catalog with comprehensive product management tools.",
    images: ['/og-products.jpg'],
  },
  alternates: {
    canonical: '/products',
  }
}