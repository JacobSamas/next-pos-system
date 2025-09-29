import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { orderSchema } from '@/lib/validations'

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD-${timestamp}${random}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    const skip = (page - 1) * limit

    const where = {
      ...(status && { status }),
      ...(customerId && { customerId }),
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = orderSchema.parse(body)

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Calculate totals
      let subtotal = 0
      const orderItems = []

      for (const item of validatedData.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        })

        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`)
        }

        const itemTotal = item.unitPrice * item.quantity
        subtotal += itemTotal

        orderItems.push({
          ...item,
          total: itemTotal,
        })

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      const tax = subtotal * 0.1 // 10% tax rate (should come from settings)
      const total = subtotal + tax - validatedData.discount

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: validatedData.customerId || null,
          subtotal,
          tax,
          discount: validatedData.discount,
          total,
          paymentMethod: validatedData.paymentMethod,
          notes: validatedData.notes,
          status: 'COMPLETED',
          items: {
            create: orderItems,
          },
        },
        include: {
          customer: true,
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      })

      // Update customer loyalty points if customer exists
      if (validatedData.customerId) {
        const pointsEarned = Math.floor(total / 10) // 1 point per $10 spent
        await tx.customer.update({
          where: { id: validatedData.customerId },
          data: {
            loyaltyPoints: {
              increment: pointsEarned,
            },
          },
        })
      }

      return order
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}