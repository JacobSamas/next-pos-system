import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const [
      totalSales,
      lastMonthSales,
      ordersToday,
      ordersYesterday,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      // Total sales this month
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(today.getFullYear(), today.getMonth(), 1),
          },
        },
        _sum: {
          total: true,
        },
      }),

      // Total sales last month
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
            lt: new Date(today.getFullYear(), today.getMonth(), 1),
          },
        },
        _sum: {
          total: true,
        },
      }),

      // Orders today
      prisma.order.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Orders yesterday
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(today.getTime() - 24 * 60 * 60 * 1000),
            lt: today,
          },
        },
      }),

      // Total active products
      prisma.product.count({
        where: {
          isActive: true,
        },
      }),

      // Low stock products
      prisma.product.count({
        where: {
          isActive: true,
          stock: {
            lte: prisma.$queryRawUnsafe('stock <= lowStockThreshold'),
          },
        },
      }),

      // Total customers
      prisma.customer.count({
        where: {
          isActive: true,
        },
      }),

      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          customer: true,
        },
      }),

      // Top selling products this month
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            status: 'COMPLETED',
            createdAt: {
              gte: new Date(today.getFullYear(), today.getMonth(), 1),
            },
          },
        },
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      }),
    ])

    // Get product details for top products
    const topProductIds = topProducts.map((item) => item.productId)
    const productDetails = await prisma.product.findMany({
      where: {
        id: {
          in: topProductIds,
        },
      },
    })

    const topProductsWithDetails = topProducts.map((item) => {
      const product = productDetails.find((p) => p.id === item.productId)
      return {
        ...product,
        soldQuantity: item._sum.quantity,
      }
    })

    // Calculate percentage changes
    const salesGrowth = lastMonthSales._sum.total
      ? ((totalSales._sum.total || 0) - (lastMonthSales._sum.total || 0)) /
        (lastMonthSales._sum.total || 1) * 100
      : 0

    const ordersGrowth = ordersYesterday
      ? ((ordersToday - ordersYesterday) / ordersYesterday) * 100
      : 0

    return NextResponse.json({
      totalSales: totalSales._sum.total || 0,
      salesGrowth: Number(salesGrowth.toFixed(1)),
      ordersToday,
      ordersGrowth: Number(ordersGrowth.toFixed(1)),
      totalProducts,
      lowStockProducts,
      totalCustomers,
      recentOrders,
      topProducts: topProductsWithDetails,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}