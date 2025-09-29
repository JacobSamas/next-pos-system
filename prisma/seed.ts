import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      description: 'Electronic devices and accessories',
    },
  })

  const accessories = await prisma.category.create({
    data: {
      name: 'Accessories',
      description: 'Phone and computer accessories',
    },
  })

  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      description: 'Apparel and fashion items',
    },
  })

  const homeGarden = await prisma.category.create({
    data: {
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
    },
  })

  console.log('✅ Categories created')

  // Create products
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 99.99,
      cost: 60.00,
      barcode: '123456789012',
      sku: 'WH-001',
      stock: 25,
      lowStockThreshold: 10,
      categoryId: electronics.id,
    },
    {
      name: 'Smartphone Case',
      description: 'Protective case for smartphones',
      price: 24.99,
      cost: 12.00,
      barcode: '123456789013',
      sku: 'SC-001',
      stock: 50,
      lowStockThreshold: 20,
      categoryId: accessories.id,
    },
    {
      name: 'USB Cable',
      description: 'High-speed USB charging cable',
      price: 12.99,
      cost: 5.00,
      barcode: '123456789014',
      sku: 'UC-001',
      stock: 5,
      lowStockThreshold: 15,
      categoryId: electronics.id,
    },
    {
      name: 'Power Bank',
      description: 'Portable power bank with fast charging',
      price: 39.99,
      cost: 20.00,
      barcode: '123456789015',
      sku: 'PB-001',
      stock: 30,
      lowStockThreshold: 10,
      categoryId: electronics.id,
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with premium sound',
      price: 79.99,
      cost: 45.00,
      barcode: '123456789016',
      sku: 'BS-001',
      stock: 8,
      lowStockThreshold: 10,
      categoryId: electronics.id,
    },
    {
      name: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt',
      price: 19.99,
      cost: 8.00,
      barcode: '123456789017',
      sku: 'CT-001',
      stock: 40,
      lowStockThreshold: 15,
      categoryId: clothing.id,
    },
    {
      name: 'Garden Gloves',
      description: 'Protective garden gloves',
      price: 9.99,
      cost: 4.00,
      barcode: '123456789018',
      sku: 'GG-001',
      stock: 20,
      lowStockThreshold: 8,
      categoryId: homeGarden.id,
    },
    {
      name: 'Phone Stand',
      description: 'Adjustable phone stand for desk',
      price: 15.99,
      cost: 7.00,
      barcode: '123456789019',
      sku: 'PS-001',
      stock: 35,
      lowStockThreshold: 12,
      categoryId: accessories.id,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('✅ Products created')

  // Create customers
  const customers = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      zipCode: '10001',
      loyaltyPoints: 150,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      zipCode: '90001',
      loyaltyPoints: 75,
    },
    {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1234567892',
      address: '789 Pine St',
      city: 'Chicago',
      zipCode: '60601',
      loyaltyPoints: 200,
    },
    {
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice.brown@example.com',
      phone: '+1234567893',
      address: '321 Elm St',
      city: 'Houston',
      zipCode: '77001',
      loyaltyPoints: 50,
    },
    {
      firstName: 'Charlie',
      lastName: 'Wilson',
      email: 'charlie.wilson@example.com',
      phone: '+1234567894',
      address: '654 Maple Ave',
      city: 'Phoenix',
      zipCode: '85001',
      loyaltyPoints: 125,
    },
  ]

  for (const customer of customers) {
    await prisma.customer.create({
      data: customer,
    })
  }

  console.log('✅ Customers created')

  // Create payment methods
  const paymentMethods = [
    { name: 'Cash', description: 'Cash payment' },
    { name: 'Credit Card', description: 'Credit card payment' },
    { name: 'Debit Card', description: 'Debit card payment' },
    { name: 'Mobile Payment', description: 'Mobile wallet payment' },
  ]

  for (const method of paymentMethods) {
    await prisma.paymentMethod.create({
      data: method,
    })
  }

  console.log('✅ Payment methods created')

  // Create tax rates
  const taxRates = [
    { name: 'Standard Tax', rate: 0.1, description: '10% standard tax rate' },
    { name: 'Reduced Tax', rate: 0.05, description: '5% reduced tax rate' },
    { name: 'Zero Tax', rate: 0.0, description: 'No tax' },
  ]

  for (const taxRate of taxRates) {
    await prisma.taxRate.create({
      data: taxRate,
    })
  }

  console.log('✅ Tax rates created')

  // Create store settings
  await prisma.storeSettings.create({
    data: {
      storeName: 'RetailPro Demo Store',
      storeAddress: '123 Business Blvd, Commerce City, CC 12345',
      storePhone: '+1-555-123-4567',
      storeEmail: 'info@retailpro-demo.com',
      currency: 'USD',
      taxRate: 0.1,
      receiptFooter: 'Thank you for shopping with RetailPro Demo Store!',
    },
  })

  console.log('✅ Store settings created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })