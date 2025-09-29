"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardApi } from "@/lib/api"

const DollarSignIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const PackageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
)

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
)


export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        const data = await dashboardApi.getStats()
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-destructive">Error: {error}</p>
          </div>
        </main>
      </>
    )
  }

  const stats = [
    {
      title: "Total Sales",
      value: `$${dashboardData?.totalSales?.toLocaleString() || '0'}`,
      description: `${dashboardData?.salesGrowth >= 0 ? '+' : ''}${dashboardData?.salesGrowth || 0}% from last month`,
      icon: DollarSignIcon,
      trend: dashboardData?.salesGrowth >= 0 ? "up" : "down",
    },
    {
      title: "Orders Today",
      value: dashboardData?.ordersToday?.toString() || "0",
      description: `${dashboardData?.ordersGrowth >= 0 ? '+' : ''}${dashboardData?.ordersGrowth || 0}% from yesterday`,
      icon: ShoppingBagIcon,
      trend: dashboardData?.ordersGrowth >= 0 ? "up" : "down",
    },
    {
      title: "Products in Stock",
      value: dashboardData?.totalProducts?.toString() || "0",
      description: `${dashboardData?.lowStockProducts || 0} items low stock`,
      icon: PackageIcon,
      trend: "neutral",
    },
    {
      title: "Total Customers",
      value: dashboardData?.totalCustomers?.toString() || "0",
      description: "Active customers",
      icon: TrendingUpIcon,
      trend: "up",
    },
  ]

  return (
    <>
      <Header />
      <main className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Recent Orders</CardTitle>
              <CardDescription>Latest transactions from your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentOrders?.length > 0 ? (
                  dashboardData.recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest Customer'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-card-foreground">
                          ${order.total.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent orders</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Top Products</CardTitle>
              <CardDescription>Best selling items this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.topProducts?.length > 0 ? (
                  dashboardData.topProducts.map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.soldQuantity || 0} sold</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-card-foreground">
                          ${product.price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No sales data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
