'use client'

import { usePathname } from 'next/navigation'

interface SchemaMarkupProps {
  type: 'product' | 'organization' | 'webpage' | 'breadcrumb'
  data: any
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  let schema = {}

  switch (type) {
    case 'product':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.image,
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'USD',
          availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      }
      break
    case 'breadcrumb':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }
      break
    case 'webpage':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: data.name,
        description: data.description,
        url: data.url,
        isPartOf: {
          '@type': 'WebSite',
          name: 'RetailPro POS',
          url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        },
      }
      break
    default:
      schema = data
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const breadcrumbItems = [
    { name: 'Home', url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' },
    ...pathSegments.map((segment, index) => {
      const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${pathSegments.slice(0, index + 1).join('/')}`
      const name = segment.charAt(0).toUpperCase() + segment.slice(1)
      return { name, url }
    })
  ]

  if (breadcrumbItems.length <= 1) return null

  return <SchemaMarkup type="breadcrumb" data={breadcrumbItems} />
}