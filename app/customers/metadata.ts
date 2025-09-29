import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customer Management",
  description: "Manage your customer relationships with comprehensive customer management tools. Track customer information, purchase history, and loyalty programs in your POS system.",
  keywords: ["customer management", "CRM", "customer database", "loyalty programs", "customer analytics"],
  openGraph: {
    title: "Customer Management | RetailPro POS",
    description: "Manage your customer relationships with comprehensive customer management tools.",
    url: '/customers',
    images: [{
      url: '/og-customers.jpg',
      width: 1200,
      height: 630,
      alt: 'RetailPro POS Customer Management',
    }],
  },
  twitter: {
    title: "Customer Management | RetailPro POS",
    description: "Manage your customer relationships with comprehensive customer management tools.",
    images: ['/og-customers.jpg'],
  },
  alternates: {
    canonical: '/customers',
  }
}