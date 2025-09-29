import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Billing & Invoicing",
  description: "Manage your billing, invoicing, and financial transactions with RetailPro POS. Generate invoices, track payments, and manage your store's financial operations efficiently.",
  keywords: ["billing", "invoicing", "payments", "financial management", "transaction tracking", "accounting"],
  openGraph: {
    title: "Billing & Invoicing | RetailPro POS",
    description: "Manage your billing, invoicing, and financial transactions efficiently.",
    url: '/billing',
    images: [{
      url: '/og-billing.jpg',
      width: 1200,
      height: 630,
      alt: 'RetailPro POS Billing & Invoicing',
    }],
  },
  twitter: {
    title: "Billing & Invoicing | RetailPro POS",
    description: "Manage your billing, invoicing, and financial transactions efficiently.",
    images: ['/og-billing.jpg'],
  },
  alternates: {
    canonical: '/billing',
  }
}