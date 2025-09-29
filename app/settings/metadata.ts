import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure your RetailPro POS system settings. Customize your store profile, tax settings, payment methods, and system preferences to optimize your retail operations.",
  keywords: ["POS settings", "store configuration", "tax settings", "payment methods", "system preferences"],
  openGraph: {
    title: "Settings | RetailPro POS",
    description: "Configure your RetailPro POS system settings and preferences.",
    url: '/settings',
    images: [{
      url: '/og-settings.jpg',
      width: 1200,
      height: 630,
      alt: 'RetailPro POS Settings',
    }],
  },
  twitter: {
    title: "Settings | RetailPro POS",
    description: "Configure your RetailPro POS system settings and preferences.",
    images: ['/og-settings.jpg'],
  },
  alternates: {
    canonical: '/settings',
  }
}