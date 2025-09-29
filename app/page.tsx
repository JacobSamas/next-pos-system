import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

export const metadata = {
  title: "Dashboard",
  description: "Monitor your retail business performance with real-time sales analytics, inventory tracking, and comprehensive business insights.",
}

export default function Dashboard() {
  const stats = [
    {
      title: "Total Sales",
      value: "$12,345",
      description: "+20.1% from last month",
      icon: DollarSignIcon,
      trend: "up",
    },
    {
      title: "Orders Today",
      value: "45",
      description: "+12% from yesterday",
      icon: ShoppingBagIcon,
      trend: "up",
    },
    {
      title: "Products in Stock",
      value: "1,234",
      description: "8 items low stock",
      icon: PackageIcon,
      trend: "neutral",
    },
    {
      title: "Revenue Growth",
      value: "+15.2%",
      description: "Compared to last quarter",
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
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Order #{1000 + i}</p>
                      <p className="text-xs text-muted-foreground">Customer {i}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-card-foreground">
                        ${(Math.random() * 100 + 20).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">2 min ago</p>
                    </div>
                  </div>
                ))}
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
                {["Wireless Headphones", "Smartphone Case", "USB Cable", "Power Bank"].map((product, i) => (
                  <div key={product} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{product}</p>
                      <p className="text-xs text-muted-foreground">{20 - i * 3} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-card-foreground">
                        ${(Math.random() * 50 + 10).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
