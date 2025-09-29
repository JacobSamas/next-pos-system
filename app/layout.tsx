import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { seoConfig } from "@/lib/seo"
import { BreadcrumbSchema } from "@/components/seo-schema"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: seoConfig.authors,
  creator: seoConfig.creator,
  publisher: seoConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(seoConfig.baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.description,
    url: '/',
    siteName: 'RetailPro POS',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'RetailPro POS Dashboard',
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.defaultTitle,
    description: seoConfig.description,
    images: ['/og-image.jpg'],
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
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = seoConfig.organizationSchema

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BreadcrumbSchema />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 lg:pl-72">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </div>
        </div>
      </body>
    </html>
  )
}
