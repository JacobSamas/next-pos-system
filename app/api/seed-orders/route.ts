import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    // Get some products and customers to create sample orders
    const products = await prisma.product.findMany({ take: 5 })
    const customers = await prisma.customer.findMany({ take: 3 })

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'No products found. Please seed the database first.' },
        { status: 400 }
      )
    }

    const sampleOrders = [
      {
        customerId: customers[0]?.id || null,
        items: [
          { productId: products[0].id, quantity: 2, unitPrice: products[0].price },
          { productId: products[1].id, quantity: 1, unitPrice: products[1].price },
        ],
        paymentMethod: 'Credit Card',
        discount: 0,
      },
      {
        customerId: customers[1]?.id || null,
        items: [
          { productId: products[2].id, quantity: 1, unitPrice: products[2].price },
        ],
        paymentMethod: 'Cash',
        discount: 5,
      },
      {
        customerId: null, // Guest order
        items: [
          { productId: products[3].id, quantity: 3, unitPrice: products[3].price },
          { productId: products[4].id, quantity: 1, unitPrice: products[4].price },
        ],
        paymentMethod: 'Debit Card',
        discount: 0,
      },
    ]

    const createdOrders = []

    for (const orderData of sampleOrders) {
      // Calculate totals
      let subtotal = 0
      const orderItems = []

      for (const item of orderData.items) {
        const itemTotal = item.unitPrice * item.quantity
        subtotal += itemTotal

        orderItems.push({
          ...item,
          total: itemTotal,
        })

        // Update product stock
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      const tax = subtotal * 0.1 // 10% tax rate
      const total = subtotal + tax - orderData.discount

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          customerId: orderData.customerId,
          subtotal,
          tax,
          discount: orderData.discount,
          total,
          paymentMethod: orderData.paymentMethod,
          status: 'COMPLETED',
          items: {
            create: orderItems,
          },
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      // Update customer loyalty points if customer exists
      if (orderData.customerId) {
        const pointsEarned = Math.floor(total / 10) // 1 point per $10 spent
        await prisma.customer.update({
          where: { id: orderData.customerId },
          data: {
            loyaltyPoints: {
              increment: pointsEarned,
            },
          },
        })
      }

      createdOrders.push(order)
    }

    return NextResponse.json({
      message: `Created ${createdOrders.length} sample orders`,
      orders: createdOrders,
    })
  } catch (error) {
    console.error('Error creating sample orders:', error)
    return NextResponse.json(
      { error: 'Failed to create sample orders' },
      { status: 500 }
    )
  }
}